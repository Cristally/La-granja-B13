/*
  server.js — Servidor Node.js Express con API REST y almacenamiento
  en base de datos persistente para La Granja B13 (Liceo Domingo Herrera Rivera).
  Compatible con Render, Railway, Replit o ejecución local.
*/

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'data', 'database.json');

// Middleware
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(express.static(path.join(__dirname)));

// Asegurar que exista la carpeta data/ y el archivo de base de datos
function initDatabase() {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    const initialData = {
      students: {},
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function readDatabase() {
  initDatabase();
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    return { students: {}, createdAt: new Date().toISOString() };
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
    app: 'La Granja B13 API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Guardar o sincronizar progreso de un estudiante
app.post('/api/sync', (req, res) => {
  try {
    const studentData = req.body;
    if (!studentData || !studentData.studentName) {
      return res.status(400).json({ error: 'Datos de estudiante inválidos (falta studentName).' });
    }

    const name = String(studentData.studentName).trim();
    const grade = String(studentData.studentGrade || '').trim();
    const key = (name + '_' + grade).toLowerCase();

    const db = readDatabase();
    db.students[key] = {
      id: key,
      studentName: name,
      studentGrade: grade,
      score: studentData.score || 0,
      discoveredCount: Array.isArray(studentData.discovered) ? studentData.discovered.length : 0,
      mapDiscoveredCount: Array.isArray(studentData.mapDiscovered) ? studentData.mapDiscovered.length : 0,
      potreroQuizCompleted: studentData.quiz ? Object.keys(studentData.quiz).filter(k => studentData.quiz[k] && studentData.quiz[k].completed).length : 0,
      mapQuizCompleted: studentData.mapQuiz ? Object.keys(studentData.mapQuiz).filter(k => studentData.mapQuiz[k] && studentData.mapQuiz[k].completed).length : 0,
      badgesCount: Array.isArray(studentData.badges) ? studentData.badges.length : 0,
      updatedAt: new Date().toISOString(),
      stateData: studentData
    };

    writeDatabase(db);
    res.json({ success: true, message: 'Progreso guardado correctamente en la base de datos.', studentId: key });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar en base de datos: ' + err.message });
  }
});

// Obtener lista consolidada de todos los estudiantes para el panel docente
app.get('/api/students', (req, res) => {
  try {
    const db = readDatabase();
    const list = Object.values(db.students).map(s => ({
      id: s.id,
      studentName: s.studentName,
      studentGrade: s.studentGrade,
      score: s.score,
      potreroQuizCompleted: s.potreroQuizCompleted,
      mapQuizCompleted: s.mapQuizCompleted,
      badgesCount: s.badgesCount,
      updatedAt: s.updatedAt
    }));
    res.json({ success: true, total: list.length, students: list });
  } catch (err) {
    res.status(500).json({ error: 'Error al leer estudiantes: ' + err.message });
  }
});

// Obtener detalle completo de un estudiante
app.get('/api/students/:id', (req, res) => {
  try {
    const db = readDatabase();
    const student = db.students[req.params.id.toLowerCase()];
    if (!student) {
      return res.status(404).json({ error: 'Estudiante no encontrado.' });
    }
    res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estudiante: ' + err.message });
  }
});

// Exportar planilla consolidada en formato CSV para el libro de notas del profesor
app.get('/api/export-csv', (req, res) => {
  try {
    const db = readDatabase();
    const list = Object.values(db.students);
    
    let csv = 'Nombre,Curso,Puntaje,Fichas Potrero,Fichas Mapa,Quizzes Potrero,Quizzes Mapa,Insignias,Ultima Actualizacion\n';
    list.forEach(s => {
      csv += `"${s.studentName}","${s.studentGrade}",${s.score},${s.discoveredCount || 0},${s.mapDiscoveredCount || 0},${s.potreroQuizCompleted},${s.mapQuizCompleted},${s.badgesCount},"${s.updatedAt}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="informe_granja_b13_general.csv"');
    res.send('\uFEFF' + csv); // BOM UTF-8 para compatibilidad con Excel
  } catch (err) {
    res.status(500).send('Error al generar CSV: ' + err.message);
  }
});

// Rutas directas para el frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  initDatabase();
  console.log(`🌾 La Granja B13 escuchando en http://localhost:${PORT}`);
});
