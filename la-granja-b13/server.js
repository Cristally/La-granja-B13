/*
  server.js — Servidor Node.js Express con API REST, base de datos persistente
  y capa de seguridad reforzada contra inyecciones SQL/NoSQL, XSS, contaminación
  de prototipos (Prototype Pollution), inyección en CSV y saturación de peticiones.
  Liceo Domingo Herrera Rivera B-13 — La Granja B13.
*/

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'database.json');

/* ============================================================
   Utilidades de Seguridad y Sanitización
   ============================================================ */

// Detección de claves peligrosas (Prototype Pollution)
function isDangerousKey(key) {
  if (typeof key !== 'string') return true;
  const lower = key.toLowerCase();
  return lower === '__proto__' || lower === 'constructor' || lower === 'prototype';
}

// Sanitización de cadenas para prevención de XSS y SQL/NoSQL Injection
function sanitizeForSecurity(val, maxLen = 200) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/\0/g, '')               // Byte nulo
    .replace(/[<>'"`\\;]/g, '')       // Delimitadores de XSS / SQL
    .replace(/--|\/\*|\*\//g, '')     // Comentarios SQL (--, /*, */)
    .trim()
    .slice(0, maxLen);
}

// Sanitización para exportación CSV (Prevención de CSV Formula Injection)
function sanitizeForCsv(val) {
  if (val === undefined || val === null) return '""';
  let s = String(val).replace(/"/g, '""');
  // Si la celda empieza con =, +, -, @, \t o \r, Excel la interpreta como fórmula
  if (/^[=+\-@\t\r]/.test(s)) {
    s = "'" + s;
  }
  return `"${s}"`;
}

// Sanitización de IDs y parámetros de ruta (Prevención de Path Traversal)
function sanitizeId(id) {
  if (typeof id !== 'string') return '';
  return id
    .replace(/\0/g, '')
    .replace(/\.\./g, '')
    .replace(/[\/\\?#%]/g, '')
    .trim()
    .slice(0, 100);
}

/* ============================================================
   Middleware de Seguridad HTTP & Rate Limiting
   ============================================================ */

// Cabeceras HTTP de protección (equivalente a Helmet básico)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' https: data: blob:;");
  next();
});

// Limitador de tasa básico en memoria (Anti-DDoS y fuerza bruta)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 150; // máx 150 peticiones por minuto por IP

app.use('/api/', (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  let record = rateLimitMap.get(ip);
  if (!record || now - record.start > RATE_LIMIT_WINDOW) {
    record = { start: now, count: 1 };
    rateLimitMap.set(ip, record);
    return next();
  }
  record.count++;
  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({ error: 'Demasiadas solicitudes desde esta IP. Intenta en 1 minuto.' });
  }
  next();
});

// Middleware estándar
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname)));

/* ============================================================
   Persistencia en Base de Datos (JSON seguro)
   ============================================================ */

function initDatabase() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      students: Object.create(null),
      users: Object.create(null),
      activityLogs: [],
      comments: [],
      quizzes: Object.create(null),
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readDatabase() {
  initDatabase();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.students || typeof parsed.students !== 'object') {
      parsed.students = Object.create(null);
    }
    if (!parsed.users || typeof parsed.users !== 'object') {
      parsed.users = Object.create(null);
    }
    if (!Array.isArray(parsed.activityLogs)) {
      parsed.activityLogs = [];
    }
    if (!Array.isArray(parsed.comments)) {
      parsed.comments = [];
    }
    if (!Array.isArray(parsed.visitas)) {
      parsed.visitas = [];
    }
    if (!parsed.quizzes || typeof parsed.quizzes !== 'object') {
      parsed.quizzes = Object.create(null);
    }
    return parsed;
  } catch (e) {
    return {
      students: Object.create(null),
      users: Object.create(null),
      activityLogs: [],
      comments: [],
      quizzes: Object.create(null),
      createdAt: new Date().toISOString()
    };
  }
}

function writeDatabase(data) {
  initDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function addActivityLog(db, logEntry) {
  if (!Array.isArray(db.activityLogs)) db.activityLogs = [];
  const entry = {
    id: 'act_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    type: sanitizeForSecurity(logEntry.type || 'info', 40),
    user: sanitizeForSecurity(logEntry.user || 'Usuario', 80),
    course: sanitizeForSecurity(logEntry.course || '', 40),
    role: sanitizeForSecurity(logEntry.role || 'estudiante', 25),
    detail: sanitizeForSecurity(logEntry.detail || '', 300),
    icon: sanitizeForSecurity(logEntry.icon || '📌', 12),
    timestamp: new Date().toISOString()
  };
  db.activityLogs.unshift(entry);
  if (db.activityLogs.length > 250) {
    db.activityLogs = db.activityLogs.slice(0, 250);
  }
  return entry;
}

/* ============================================================
   Rutas de la API REST
   ============================================================ */

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'La Granja B13 API Segura',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Registro oficial persistente de estudiantes
app.post('/api/register', (req, res) => {
  try {
    const { nombre, curso, genero, correo, clave, password, avatar } = req.body || {};
    const cleanNombre = sanitizeForSecurity(nombre || '', 80);
    const cleanCurso = sanitizeForSecurity(curso || '', 35);
    const cleanGenero = sanitizeForSecurity(genero || 'Prefiero no decirlo', 30);
    const cleanCorreo = sanitizeForSecurity((correo || '').toLowerCase(), 90);
    const cleanClave = String(clave || password || '').trim().slice(0, 100);
    const cleanAvatar = sanitizeForSecurity(avatar || '🧑‍🌾', 12) || '🧑‍🌾';

    if (!cleanNombre || cleanNombre.length < 3) {
      return res.status(400).json({ error: 'Nombre de estudiante inválido o muy corto.' });
    }
    if (/\d/.test(cleanNombre)) {
      return res.status(400).json({ error: 'El nombre no debe contener números.' });
    }
    if (!cleanCurso) {
      return res.status(400).json({ error: 'Debes seleccionar un curso válido.' });
    }
    if (!cleanCorreo || !cleanCorreo.includes('@')) {
      return res.status(400).json({ error: 'Correo electrónico institucional o escolar inválido.' });
    }
    if (!cleanClave || cleanClave.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    if (isDangerousKey(cleanCorreo) || isDangerousKey(cleanNombre)) {
      return res.status(400).json({ error: 'Identificador no permitido.' });
    }

    const db = readDatabase();
    if (!db.users) db.users = Object.create(null);
    if (!db.students) db.students = Object.create(null);

    // Verificar si el correo ya existe
    if (db.users[cleanCorreo]) {
      return res.status(409).json({ error: 'Este correo electrónico ya se encuentra registrado.' });
    }

    const studentKey = (cleanNombre + '_' + cleanCurso).toLowerCase().replace(/[^a-z0-9_\-\. ]/g, '_');
    const nowIso = new Date().toISOString();

    const userData = {
      nombre: cleanNombre,
      curso: cleanCurso,
      genero: cleanGenero,
      correo: cleanCorreo,
      clave: cleanClave,
      rol: 'estudiante',
      avatar: cleanAvatar,
      registradoEn: nowIso
    };
    db.users[cleanCorreo] = userData;

    // Asegurar registro inicial en la tabla consolidada de estudiantes
    if (!db.students[studentKey]) {
      db.students[studentKey] = {
        id: studentKey,
        studentName: cleanNombre,
        studentGrade: cleanCurso,
        genero: cleanGenero,
        correo: cleanCorreo,
        score: 0,
        pureScore: 0,
        avatarIcon: cleanAvatar,
        discoveredCount: 0,
        mapDiscoveredCount: 0,
        potreroQuizCompleted: 0,
        mapQuizCompleted: 0,
        badgesCount: 0,
        updatedAt: nowIso,
        stateData: {
          score: 0,
          pureScore: 0,
          avatarIcon: cleanAvatar,
          badges: [],
          discovered: [],
          mapDiscovered: []
        }
      };
    } else {
      db.students[studentKey].correo = cleanCorreo;
      db.students[studentKey].genero = cleanGenero;
    }

    // Registrar en el historial de acciones en tiempo real
    addActivityLog(db, {
      type: 'register',
      user: cleanNombre,
      course: cleanCurso,
      role: 'estudiante',
      detail: `Nuevo estudiante registrado en ${cleanCurso}.`,
      icon: '🎓'
    });

    writeDatabase(db);
    res.json({
      success: true,
      message: 'Estudiante registrado y persistido con éxito.',
      student: {
        nombre: cleanNombre,
        curso: cleanCurso,
        genero: cleanGenero,
        correo: cleanCorreo,
        avatar: cleanAvatar
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Error interno al registrar estudiante.' });
  }
});

// Inicio de sesión validado en el servidor
app.post('/api/login', (req, res) => {
  try {
    const { correo, clave, password } = req.body || {};
    const cleanCorreo = sanitizeForSecurity((correo || '').toLowerCase(), 90);
    const cleanClave = String(clave || password || '').trim();

    if (!cleanCorreo || !cleanClave) {
      return res.status(400).json({ error: 'Correo y contraseña requeridos.' });
    }

    // Cuenta de profesor oficial
    if (cleanCorreo === 'profesor@granja.cl' && cleanClave === 'profesor1234') {
      const db = readDatabase();
      addActivityLog(db, {
        type: 'login',
        user: 'Profesor/a B-13',
        course: 'Docencia',
        role: 'profesor',
        detail: 'Profesor inició sesión en el panel docente.',
        icon: '🍎'
      });
      writeDatabase(db);
      return res.json({
        success: true,
        rol: 'profesor',
        nombre: 'Profesor/a B-13',
        correo: 'profesor@granja.cl'
      });
    }

    // Cuenta demo
    if (cleanCorreo === 'demo@granja.cl' && cleanClave === 'demo1234') {
      return res.json({
        success: true,
        rol: 'estudiante',
        nombre: 'Estudiante Demo',
        curso: '2°B',
        correo: 'demo@granja.cl',
        genero: 'Prefiero no decirlo',
        avatar: '🧑‍🌾'
      });
    }

    const db = readDatabase();
    const user = db.users ? db.users[cleanCorreo] : null;

    if (!user) {
      return res.status(404).json({ error: 'Esta cuenta no está registrada en el Liceo B-13.' });
    }

    if (user.clave !== cleanClave) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    addActivityLog(db, {
      type: 'login',
      user: user.nombre,
      course: user.curso || '',
      role: user.rol || 'estudiante',
      detail: 'Inició sesión en la plataforma escolar.',
      icon: '🔑'
    });
    writeDatabase(db);

    res.json({
      success: true,
      rol: user.rol || 'estudiante',
      nombre: user.nombre,
      curso: user.curso,
      genero: user.genero,
      correo: user.correo,
      avatar: user.avatar || '🧑‍🌾'
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar el inicio de sesión.' });
  }
});

// Guardar o sincronizar progreso de un estudiante
app.post('/api/sync', (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData || typeof studentData !== 'object') {
      return res.status(400).json({ error: 'Datos no válidos.' });
    }

    const rawName = String(studentData.studentName || '');
    const rawGrade = String(studentData.studentGrade || '');

    const cleanName = sanitizeForSecurity(rawName, 80);
    const cleanGrade = sanitizeForSecurity(rawGrade, 30);

    if (!cleanName) {
      return res.status(400).json({ error: 'El nombre del estudiante es obligatorio y debe ser válido.' });
    }

    if (isDangerousKey(cleanName) || isDangerousKey(cleanGrade)) {
      return res.status(400).json({ error: 'Identificador no permitido.' });
    }

    const key = (cleanName + '_' + cleanGrade).toLowerCase().replace(/[^a-z0-9_\-\. ]/g, '_');
    if (isDangerousKey(key)) {
      return res.status(400).json({ error: 'Identificador generado no permitido.' });
    }

    const rawScore = parseInt(studentData.score, 10);
    const validScore = Number.isFinite(rawScore) && rawScore >= 0 && rawScore <= 100000 ? rawScore : 0;

    const rawPureScore = parseInt(studentData.pureScore, 10);
    const validPureScore = Number.isFinite(rawPureScore) && rawPureScore >= 0 && rawPureScore <= 100000
      ? rawPureScore
      : validScore;

    const rawAvatar = String(studentData.avatarIcon || studentData.avatar || '🧑‍🌾');
    const cleanAvatar = sanitizeForSecurity(rawAvatar, 12) || '🧑‍🌾';

    const db = readDatabase();
    const prevScore = db.students[key] ? (db.students[key].pureScore || 0) : 0;

    // Asignación segura sin riesgo de contaminar el prototipo
    db.students[key] = {
      id: key,
      studentName: cleanName,
      studentGrade: cleanGrade,
      score: validPureScore,
      pureScore: validPureScore,
      avatarIcon: cleanAvatar,
      discoveredCount: Array.isArray(studentData.discovered) ? studentData.discovered.length : 0,
      mapDiscoveredCount: Array.isArray(studentData.mapDiscovered) ? studentData.mapDiscovered.length : 0,
      potreroQuizCompleted: studentData.quiz && typeof studentData.quiz === 'object'
        ? Object.keys(studentData.quiz).filter(k => studentData.quiz[k] && studentData.quiz[k].completed).length
        : 0,
      mapQuizCompleted: studentData.mapQuiz && typeof studentData.mapQuiz === 'object'
        ? Object.keys(studentData.mapQuiz).filter(k => studentData.mapQuiz[k] && studentData.mapQuiz[k].completed).length
        : 0,
      badgesCount: Array.isArray(studentData.badges) ? studentData.badges.length : 0,
      updatedAt: new Date().toISOString(),
      stateData: {
        score: validPureScore,
        pureScore: validPureScore,
        avatarIcon: cleanAvatar,
        badges: Array.isArray(studentData.badges) ? studentData.badges.slice(0, 20) : [],
        discovered: Array.isArray(studentData.discovered) ? studentData.discovered.slice(0, 50) : [],
        mapDiscovered: Array.isArray(studentData.mapDiscovered) ? studentData.mapDiscovered.slice(0, 50) : []
      }
    };

    // Registrar en tiempo real si hubo aumento significativo de puntaje
    if (validPureScore > prevScore && validPureScore > 0) {
      addActivityLog(db, {
        type: 'score_up',
        user: cleanName,
        course: cleanGrade,
        role: 'estudiante',
        detail: `Actualizó su progreso y alcanzó ${validPureScore} pts oficiales (+${validPureScore - prevScore} pts).`,
        icon: '⭐'
      });
    }

    writeDatabase(db);
    res.json({ success: true, message: 'Progreso guardado correctamente.', studentId: key });
  } catch (err) {
    res.status(500).json({ error: 'Error al procesar el guardado.' });
  }
});

// Obtener lista consolidada de todos los estudiantes para el panel docente
app.get('/api/students', (req, res) => {
  try {
    const db = readDatabase();
    if (!db.students) db.students = Object.create(null);
    if (!db.users) db.users = Object.create(null);

    // Asegurar que usuarios registrados en db.users figuren en db.students
    Object.values(db.users).forEach(u => {
      if (!u || !u.nombre) return;
      const key = (u.nombre + '_' + (u.curso || '')).toLowerCase().replace(/[^a-z0-9_\-\. ]/g, '_');
      if (!db.students[key]) {
        db.students[key] = {
          id: key,
          studentName: u.nombre,
          studentGrade: u.curso || '',
          genero: u.genero || 'No especificado',
          correo: u.correo || '',
          score: 0,
          pureScore: 0,
          avatarIcon: u.avatar || '🧑‍🌾',
          discoveredCount: 0,
          mapDiscoveredCount: 0,
          potreroQuizCompleted: 0,
          mapQuizCompleted: 0,
          badgesCount: 0,
          updatedAt: u.registradoEn || new Date().toISOString()
        };
      } else {
        if (!db.students[key].correo && u.correo) db.students[key].correo = u.correo;
        if (!db.students[key].genero && u.genero) db.students[key].genero = u.genero;
      }
    });

    const list = Object.values(db.students).map(s => ({
      id: s.id,
      studentName: s.studentName,
      studentGrade: s.studentGrade,
      correo: s.correo || '',
      genero: s.genero || 'No especificado',
      score: Number.isFinite(s.pureScore) ? s.pureScore : (s.score || 0),
      pureScore: Number.isFinite(s.pureScore) ? s.pureScore : (s.score || 0),
      avatarIcon: s.avatarIcon || '🧑‍🌾',
      potreroQuizCompleted: s.potreroQuizCompleted || 0,
      mapQuizCompleted: s.mapQuizCompleted || 0,
      badgesCount: s.badgesCount || 0,
      updatedAt: s.updatedAt
    }));
    res.json({ success: true, total: list.length, students: list });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar estudiantes.' });
  }
});

// Historial de actividad y acciones en tiempo real para docentes
app.get('/api/activity', (req, res) => {
  try {
    const db = readDatabase();
    const logs = Array.isArray(db.activityLogs) ? db.activityLogs : [];
    res.json({ success: true, total: logs.length, logs });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar el historial de actividades.' });
  }
});

app.post('/api/activity', (req, res) => {
  try {
    const { type, user, course, role, detail, icon } = req.body || {};
    const db = readDatabase();
    const entry = addActivityLog(db, { type, user, course, role, detail, icon });
    writeDatabase(db);
    res.json({ success: true, log: entry });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar la acción.' });
  }
});

// Sistema de Comentarios y Dudas Pedagógicas
app.get('/api/comments', (req, res) => {
  try {
    const db = readDatabase();
    let comments = Array.isArray(db.comments) ? db.comments : [];
    const animalFilter = sanitizeId(req.query.animalId || '');
    if (animalFilter && animalFilter !== 'all') {
      comments = comments.filter(c => c.animalId === animalFilter);
    }
    // Normalizar propiedades en cada comentario para interoperabilidad total
    const normalized = comments.map(c => {
      const replies = Array.isArray(c.replies || c.respuestas) ? (c.replies || c.respuestas) : [];
      const normReplies = replies.map(r => ({
        id: r.id,
        author: r.author || r.autor || 'Docente',
        autor: r.autor || r.author || 'Docente',
        role: r.role || r.rol || 'profesor',
        rol: r.rol || r.role || 'profesor',
        text: r.text || r.mensaje || '',
        mensaje: r.mensaje || r.text || '',
        timestamp: r.timestamp || r.fecha || new Date().toISOString()
      }));
      return {
        ...c,
        author: c.author || c.autor || 'Estudiante',
        autor: c.autor || c.author || 'Estudiante',
        role: c.role || c.rol || 'estudiante',
        rol: c.rol || c.role || 'estudiante',
        course: c.course || c.curso || '',
        curso: c.curso || c.course || '',
        text: c.text || c.mensaje || '',
        mensaje: c.mensaje || c.text || '',
        isQuestion: c.isQuestion !== undefined ? c.isQuestion : (c.categoria === 'pregunta'),
        timestamp: c.timestamp || c.fecha || new Date().toISOString(),
        replies: normReplies,
        respuestas: normReplies
      };
    });
    res.json({ success: true, total: normalized.length, comments: normalized });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener comentarios.' });
  }
});

app.post('/api/comments', (req, res) => {
  try {
    const { autor, author, curso, course, rol, role, avatar, mensaje, text, comment, animalId, categoria, isQuestion } = req.body || {};
    const cleanAutor = sanitizeForSecurity(autor || author || 'Anónimo', 80);
    const cleanCurso = sanitizeForSecurity(curso || course || '', 40);
    const cleanRol = sanitizeForSecurity(rol || role || 'estudiante', 25);
    const cleanAvatar = sanitizeForSecurity(avatar || '💬', 12) || '💬';
    const cleanMensaje = sanitizeForSecurity(mensaje || text || comment || '', 500);
    const cleanAnimalId = sanitizeId(animalId || 'general').slice(0, 40);
    const cleanIsQuestion = isQuestion !== undefined ? !!isQuestion : (categoria === 'pregunta');
    const cleanCategoria = sanitizeForSecurity(categoria || (cleanIsQuestion ? 'pregunta' : 'observacion') || 'general', 40);

    if (!cleanMensaje || cleanMensaje.length < 3) {
      return res.status(400).json({ error: 'El comentario no puede estar vacío.' });
    }

    const db = readDatabase();
    if (!Array.isArray(db.comments)) db.comments = [];

    const nowIso = new Date().toISOString();
    const newComment = {
      id: 'com_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      autor: cleanAutor,
      author: cleanAutor,
      curso: cleanCurso,
      course: cleanCurso,
      rol: cleanRol,
      role: cleanRol,
      avatar: cleanAvatar,
      mensaje: cleanMensaje,
      text: cleanMensaje,
      animalId: cleanAnimalId,
      categoria: cleanCategoria,
      isQuestion: cleanIsQuestion,
      fecha: nowIso,
      timestamp: nowIso,
      respuestas: [],
      replies: []
    };

    db.comments.unshift(newComment);
    if (db.comments.length > 300) db.comments = db.comments.slice(0, 300);

    addActivityLog(db, {
      type: 'comment',
      user: cleanAutor,
      course: cleanCurso,
      role: cleanRol,
      detail: `Publicó un comentario en la Granja: "${cleanMensaje.slice(0, 50)}..."`,
      icon: '💬'
    });

    writeDatabase(db);
    res.json({ success: true, comment: newComment });
  } catch (err) {
    res.status(500).json({ error: 'Error al publicar comentario.' });
  }
});

app.post('/api/comments/:id/reply', (req, res) => {
  try {
    const commentId = sanitizeId(req.params.id);
    const { autor, author, rol, role, avatar, mensaje, text } = req.body || {};
    const cleanAutor = sanitizeForSecurity(autor || author || 'Docente B-13', 80);
    const cleanRol = sanitizeForSecurity(rol || role || 'profesor', 25);
    const cleanAvatar = sanitizeForSecurity(avatar || '🍎', 12) || '🍎';
    const cleanMensaje = sanitizeForSecurity(mensaje || text || '', 400);

    if (!cleanMensaje) {
      return res.status(400).json({ error: 'La respuesta no puede estar vacía.' });
    }

    const db = readDatabase();
    const comment = (db.comments || []).find(c => c.id === commentId);

    if (!comment) {
      return res.status(404).json({ error: 'Comentario no encontrado.' });
    }

    if (!Array.isArray(comment.respuestas)) comment.respuestas = [];
    if (!Array.isArray(comment.replies)) comment.replies = [];

    const nowIso = new Date().toISOString();
    const reply = {
      id: 'rep_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      autor: cleanAutor,
      author: cleanAutor,
      rol: cleanRol,
      role: cleanRol,
      avatar: cleanAvatar,
      mensaje: cleanMensaje,
      text: cleanMensaje,
      fecha: nowIso,
      timestamp: nowIso
    };
    comment.respuestas.push(reply);
    comment.replies.push(reply);

    addActivityLog(db, {
      type: 'reply',
      user: cleanAutor,
      course: 'Docente',
      role: cleanRol,
      detail: `Respondió a la consulta de ${comment.autor || comment.author}: "${cleanMensaje.slice(0, 50)}..."`,
      icon: '↩️'
    });

    writeDatabase(db);
    res.json({ success: true, reply, comment });
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar respuesta.' });
  }
});

// Obtener ranking oficial de estudiantes ordenados por puntaje puro (sin repetición)
app.get('/api/ranking', (req, res) => {
  try {
    const db = readDatabase();
    const studentsList = Object.values(db.students || {});
    const ranking = studentsList.map(s => {
      const pure = Number.isFinite(s.pureScore) ? s.pureScore : (Number.isFinite(s.score) ? s.score : 0);
      return {
        id: s.id,
        studentName: s.studentName,
        studentGrade: s.studentGrade,
        avatarIcon: s.avatarIcon || '🧑‍🌾',
        score: pure,
        pureScore: pure,
        quizzesCount: (s.potreroQuizCompleted || 0) + (s.mapQuizCompleted || 0),
        badgesCount: s.badgesCount || 0,
        updatedAt: s.updatedAt
      };
    }).sort((a, b) => b.pureScore - a.pureScore);

    res.json({ success: true, total: ranking.length, ranking });
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar ranking.' });
  }
});

// Obtener detalle de un estudiante con sanitización de ID
app.get('/api/students/:id', (req, res) => {
  try {
    const cleanId = sanitizeId(req.params.id).toLowerCase();
    if (!cleanId || isDangerousKey(cleanId)) {
      return res.status(400).json({ error: 'ID de estudiante inválido.' });
    }

    const db = readDatabase();
    if (!Object.prototype.hasOwnProperty.call(db.students, cleanId)) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }

    res.json({ success: true, student: db.students[cleanId] });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener detalle del estudiante.' });
  }
});

// Exportar planilla consolidada en formato CSV con protección anti-inyección de fórmulas
app.get('/api/export-csv', (req, res) => {
  try {
    const db = readDatabase();
    const list = Object.values(db.students || {});
    
    let csv = 'Nombre,Curso,Puntaje,Fichas Potrero,Fichas Mapa,Quizzes Potrero,Quizzes Mapa,Insignias,Ultima Actualizacion\n';
    list.forEach(s => {
      const name = sanitizeForCsv(s.studentName);
      const grade = sanitizeForCsv(s.studentGrade);
      const score = Number.isFinite(s.score) ? s.score : 0;
      const fPot = Number.isFinite(s.discoveredCount) ? s.discoveredCount : 0;
      const fMap = Number.isFinite(s.mapDiscoveredCount) ? s.mapDiscoveredCount : 0;
      const qPot = Number.isFinite(s.potreroQuizCompleted) ? s.potreroQuizCompleted : 0;
      const qMap = Number.isFinite(s.mapQuizCompleted) ? s.mapQuizCompleted : 0;
      const badges = Number.isFinite(s.badgesCount) ? s.badgesCount : 0;
      const updated = sanitizeForCsv(s.updatedAt);

      csv += `${name},${grade},${score},${fPot},${fMap},${qPot},${qMap},${badges},${updated}\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="informe_granja_b13_general.csv"');
    res.send('\uFEFF' + csv);
  } catch (err) {
    res.status(500).send('Error al generar CSV: ' + err.message);
  }
});

// Quizzes personalizados creados por el profesor
app.get('/api/quizzes', (req, res) => {
  try {
    const db = readDatabase();
    res.json({ success: true, quizzes: db.quizzes || {} });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener quizzes.' });
  }
});

app.post('/api/quizzes', (req, res) => {
  try {
    const { zonaId, pregunta, opciones, correcta, decimas, profesor } = req.body;
    if (!zonaId || !pregunta || !Array.isArray(opciones)) {
      return res.status(400).json({ error: 'Datos de quiz incompletos.' });
    }

    const cleanZona = sanitizeId(zonaId);
    if (!cleanZona || isDangerousKey(cleanZona)) {
      return res.status(400).json({ error: 'Zona inválida.' });
    }

    const cleanPregunta = sanitizeForSecurity(pregunta, 300);
    const cleanProfesor = sanitizeForSecurity(profesor || 'Profesor/a B-13', 60);
    const cleanOpciones = opciones.slice(0, 6).map(op => sanitizeForSecurity(String(op), 150));

    const corrInt = parseInt(correcta, 10);
    const cleanCorrecta = Number.isInteger(corrInt) && corrInt >= 0 && corrInt < cleanOpciones.length ? corrInt : 0;

    const decFloat = parseFloat(decimas);
    const cleanDecimas = Number.isFinite(decFloat) && decFloat >= 0 && decFloat <= 2 ? parseFloat(decFloat.toFixed(1)) : 0.3;

    const db = readDatabase();
    if (!db.quizzes || typeof db.quizzes !== 'object') db.quizzes = {};
    if (!db.quizzes[cleanZona]) db.quizzes[cleanZona] = [];

    db.quizzes[cleanZona].push({
      pregunta: cleanPregunta,
      opciones: cleanOpciones,
      correcta: cleanCorrecta,
      decimas: cleanDecimas,
      profesor: cleanProfesor,
      createdAt: new Date().toISOString()
    });

    addActivityLog(db, {
      type: 'quiz_created',
      user: cleanProfesor,
      course: 'Docente',
      role: 'profesor',
      detail: `Publicó una nueva pregunta de quiz formativo en zona "${cleanZona}".`,
      icon: '📝'
    });

    writeDatabase(db);
    res.json({ success: true, message: 'Quiz guardado con éxito.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el quiz.' });
  }
});

// ============================================================
// Endpoints de Visitas Guiadas a la Granja Real B-13
// ============================================================
app.get('/api/visitas', (req, res) => {
  try {
    const db = readDatabase();
    const visitas = Array.isArray(db.visitas) ? db.visitas : [];
    res.json({ success: true, total: visitas.length, visitas });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener solicitudes de visitas guiadas.' });
  }
});

app.post('/api/visitas', (req, res) => {
  try {
    const { nombre, institucion, email, telefono, tipoGrupo, cantidad, fecha, horario, enfoque, comentarios, codigo } = req.body || {};

    const cleanNombre = sanitizeForSecurity(nombre || 'Docente / Responsable', 100);
    const cleanInstitucion = sanitizeForSecurity(institucion || 'Particular', 120);
    const cleanEmail = sanitizeForSecurity(email || '', 120);
    const cleanTelefono = sanitizeForSecurity(telefono || '', 30);
    const cleanTipoGrupo = sanitizeForSecurity(tipoGrupo || 'General', 80);
    const cleanCantidad = Math.min(Math.max(parseInt(cantidad, 10) || 1, 1), 60);
    const cleanFecha = sanitizeForSecurity(fecha || '', 20);
    const cleanHorario = sanitizeForSecurity(horario || '', 60);
    const cleanEnfoque = sanitizeForSecurity(enfoque || 'Bioalfabetización y Bienestar Animal', 120);
    const cleanComentarios = sanitizeForSecurity(comentarios || '', 400);

    const folioRandom = Math.floor(1000 + Math.random() * 9000);
    const finalCodigo = sanitizeForSecurity(codigo || `#VIS-B13-${folioRandom}`, 20);

    const db = readDatabase();
    if (!Array.isArray(db.visitas)) db.visitas = [];

    const nuevaVisita = {
      id: finalCodigo,
      codigo: finalCodigo,
      nombre: cleanNombre,
      institucion: cleanInstitucion,
      email: cleanEmail,
      telefono: cleanTelefono,
      tipoGrupo: cleanTipoGrupo,
      cantidad: cleanCantidad,
      fecha: cleanFecha,
      horario: cleanHorario,
      enfoque: cleanEnfoque,
      comentarios: cleanComentarios,
      timestamp: new Date().toISOString(),
      estado: 'Recibida en Demo'
    };

    db.visitas.unshift(nuevaVisita);
    if (db.visitas.length > 100) {
      db.visitas = db.visitas.slice(0, 100);
    }

    addActivityLog(db, {
      type: 'visita_guiada',
      user: cleanNombre,
      course: cleanInstitucion,
      role: 'visita',
      detail: `Solicitó recorrido guiado para ${cleanCantidad} personas el día ${cleanFecha} (${cleanHorario}). Ref: ${finalCodigo}`,
      icon: '🚜'
    });

    writeDatabase(db);
    res.json({ success: true, id: finalCodigo, visita: nuevaVisita });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar solicitud de visita guiada.' });
  }
});

// Estadísticas generales para el panel docente y directivo
app.get('/api/stats', (req, res) => {
  try {
    const db = readDatabase();
    const studentsList = Object.values(db.students || {});
    res.json({
      success: true,
      totalStudents: studentsList.length,
      averageScore: studentsList.length ? Math.round(studentsList.reduce((acc, s) => acc + (s.score || 0), 0) / studentsList.length) : 0,
      totalQuizzesCompleted: studentsList.reduce((acc, s) => acc + (s.potreroQuizCompleted || 0) + (s.mapQuizCompleted || 0), 0),
      students: studentsList.map(s => ({
        name: s.studentName,
        grade: s.studentGrade,
        score: s.score,
        updatedAt: s.updatedAt
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas.' });
  }
});

// Borrar todos los registros de estudiantes o reiniciar base de datos (Admin)
app.post('/api/reset', (req, res) => {
  try {
    const initialData = {
      students: {},
      createdAt: new Date().toISOString()
    };
    writeDatabase(initialData);
    res.json({ success: true, message: 'Base de datos reiniciada con éxito.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al reiniciar la base de datos.' });
  }
});

// Eliminar un estudiante específico por ID o correo con sanitización
app.delete('/api/students/:id', (req, res) => {
  try {
    const db = readDatabase();
    const id = sanitizeId(decodeURIComponent(req.params.id || '')).toLowerCase();

    if (!id || isDangerousKey(id)) {
      return res.status(400).json({ error: 'Identificador inválido.' });
    }

    let foundKey = null;
    if (Object.prototype.hasOwnProperty.call(db.students, id)) {
      foundKey = id;
    } else {
      for (const k in db.students) {
        if (!Object.prototype.hasOwnProperty.call(db.students, k)) continue;
        const s = db.students[k];
        if (k.toLowerCase() === id || (s.studentName && s.studentName.toLowerCase() === id) || (s.correo && s.correo.toLowerCase() === id)) {
          foundKey = k;
          break;
        }
      }
    }

    if (foundKey) {
      delete db.students[foundKey];
      writeDatabase(db);
      return res.json({ success: true, message: `Registro eliminado correctamente.` });
    }
    res.status(404).json({ error: 'Estudiante no encontrado en el servidor.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar estudiante.' });
  }
});

// Rutas directas para el frontend
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, 'mapa.html'));
});

app.get('/juegos', (req, res) => {
  res.sendFile(path.join(__dirname, 'juegos.html'));
});

app.get('/galeria-real', (req, res) => {
  res.sendFile(path.join(__dirname, 'galeria-real.html'));
});

app.get('/ficha', (req, res) => {
  res.sendFile(path.join(__dirname, 'ficha.html'));
});

app.get(['/perfil', '/cuaderno'], (req, res) => {
  res.sendFile(path.join(__dirname, 'perfil.html'));
});

app.get(['/quizzes', '/desafios'], (req, res) => {
  res.sendFile(path.join(__dirname, 'quizzes.html'));
});

app.get(['/muro', '/comunidad'], (req, res) => {
  res.sendFile(path.join(__dirname, 'muro.html'));
});

app.get(['/visitas', '/visitas-guiadas', '/guias'], (req, res) => {
  res.sendFile(path.join(__dirname, 'visitas.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  initDatabase();
  console.log(`🌾 La Granja B13 protegida y escuchando en http://localhost:${PORT}`);
});
