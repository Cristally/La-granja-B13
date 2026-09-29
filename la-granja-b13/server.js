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
    return parsed;
  } catch (e) {
    return { students: Object.create(null), createdAt: new Date().toISOString() };
  }
}

function writeDatabase(data) {
  initDatabase();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
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

    const db = readDatabase();
    
    // Asignación segura sin riesgo de contaminar el prototipo
    db.students[key] = {
      id: key,
      studentName: cleanName,
      studentGrade: cleanGrade,
      score: validScore,
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
        score: validScore,
        badges: Array.isArray(studentData.badges) ? studentData.badges.slice(0, 20) : [],
        discovered: Array.isArray(studentData.discovered) ? studentData.discovered.slice(0, 50) : [],
        mapDiscovered: Array.isArray(studentData.mapDiscovered) ? studentData.mapDiscovered.slice(0, 50) : []
      }
    };

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
    const list = Object.values(db.students || {}).map(s => ({
      id: s.id,
      studentName: s.studentName,
      studentGrade: s.studentGrade,
      score: s.score,
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

    writeDatabase(db);
    res.json({ success: true, message: 'Quiz guardado con éxito.' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar el quiz.' });
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
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  initDatabase();
  console.log(`🌾 La Granja B13 protegida y escuchando en http://localhost:${PORT}`);
});
