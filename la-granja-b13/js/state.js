/*
  state.js — Guarda y recupera el progreso de los estudiantes en el
  navegador (localStorage), para que el panel docente pueda mostrar
  un resumen por estudiante, calcular décimas y asegurar que cada
  alumno/a tenga su evaluación individual sin mezclar respuestas.

  El progreso se comparte entre index.html (Potrero) y mapa.html
  (Mapa de la Granja) mediante la misma clave de localStorage.
*/

const STORAGE_KEY = 'lagranjaB13.progress.v2';
const LEGACY_STORAGE_KEY = 'lagranjaB13.progress.v1';

function defaultStudentSession(name, grade) {
  const quiz = {};
  ANIMALS.forEach(a => {
    quiz[a.id] = {
      index: 0,
      answers: [],
      results: [],
      completed: false,
      scoreEarned: 0,
      completedAt: null
    };
  });

  const mapQuiz = {};
  if (typeof MAP_ANIMALS !== 'undefined') {
    MAP_ANIMALS.forEach(a => {
      mapQuiz[a.id] = {
        index: 0,
        answers: [],
        results: [],
        completed: false,
        scoreEarned: 0,
        completedAt: null
      };
    });
  }

  return {
    studentName: name || '',
    studentGrade: grade || '',
    score: 0,
    discovered: [],
    quiz: quiz,
    mapDiscovered: [],
    mapQuiz: mapQuiz,
    badges: [],
    custom: {},
    soundOn: true,
    finalShown: false,
    mapFinalShown: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}

function ensureQuizBucketStructure(bucket, questionsCount) {
  if (!bucket || typeof bucket !== 'object') {
    bucket = { index: 0, answers: [], results: [], completed: false, scoreEarned: 0, completedAt: null };
  }
  bucket.index = typeof bucket.index === 'number' ? bucket.index : 0;
  bucket.answers = Array.isArray(bucket.answers) ? bucket.answers : [];
  bucket.results = Array.isArray(bucket.results) ? bucket.results : [];
  bucket.completed = !!bucket.completed;
  bucket.scoreEarned = typeof bucket.scoreEarned === 'number' ? bucket.scoreEarned : 0;
  
  // Si el quiz está completado, index debe ser igual a la longitud
  if (bucket.completed && questionsCount && bucket.index < questionsCount) {
    bucket.index = questionsCount;
  }
  return bucket;
}

function ensureMapQuizEntries(st) {
  if (typeof MAP_ANIMALS === 'undefined') return;
  MAP_ANIMALS.forEach(a => {
    st.mapQuiz[a.id] = ensureQuizBucketStructure(st.mapQuiz[a.id], a.quiz ? a.quiz.length : 3);
  });
}

function loadAllProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + '.profiles');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveAllProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_KEY + '.profiles', JSON.stringify(profiles));
  } catch (e) {}
}

function loadState() {
  let base = defaultStudentSession('', '');
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      // Solo restaurar datos si hay un estudiante real registrado en esa sesión
      if (saved && saved.studentName && typeof saved.studentName === 'string' && saved.studentName.trim() !== '') {
        base.studentName = saved.studentName.trim();
        base.studentGrade = (saved.studentGrade || '').trim();
        base.score = typeof saved.score === 'number' ? saved.score : 0;
        base.discovered = Array.isArray(saved.discovered) ? saved.discovered : [];
        base.mapDiscovered = Array.isArray(saved.mapDiscovered) ? saved.mapDiscovered : [];
        base.badges = Array.isArray(saved.badges) ? saved.badges : [];
        base.custom = saved.custom || {};
        base.soundOn = saved.soundOn !== false;
        base.finalShown = !!saved.finalShown;
        base.mapFinalShown = !!saved.mapFinalShown;
        base.createdAt = saved.createdAt || Date.now();
        base.updatedAt = saved.updatedAt || Date.now();

        if (saved.quiz) {
          Object.keys(base.quiz).forEach(id => {
            const sp = ANIMALS.find(x => x.id === id);
            const qCount = sp && sp.quiz ? sp.quiz.length : 3;
            base.quiz[id] = ensureQuizBucketStructure(saved.quiz[id], qCount);
          });
        }

        base.mapQuiz = (saved.mapQuiz && typeof saved.mapQuiz === 'object') ? saved.mapQuiz : {};
      }
    }

    ensureMapQuizEntries(base);
    return base;
  } catch (e) {
    ensureMapQuizEntries(base);
    return base;
  }
}

function saveState() {
  try {
    state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Si hay un estudiante identificado, guardar o actualizar su perfil en el listado docente
    if (state.studentName && state.studentName.trim() !== '') {
      const key = (state.studentName.trim() + '_' + (state.studentGrade || '').trim()).toLowerCase();
      const profiles = loadAllProfiles();
      profiles[key] = {
        studentName: state.studentName.trim(),
        studentGrade: (state.studentGrade || '').trim(),
        score: state.score,
        discoveredCount: state.discovered.length,
        mapDiscoveredCount: state.mapDiscovered.length,
        potreroQuizCompleted: Object.keys(state.quiz).filter(k => state.quiz[k] && state.quiz[k].completed).length,
        mapQuizCompleted: Object.keys(state.mapQuiz).filter(k => state.mapQuiz[k] && state.mapQuiz[k].completed).length,
        badgesCount: state.badges.length,
        updatedAt: state.updatedAt,
        stateData: JSON.parse(JSON.stringify(state))
      };
      saveAllProfiles(profiles);
    }
    // Sincronización transparente con el servidor / base de datos en segundo plano si está disponible
    syncWithServer();
  } catch (e) {
    // localStorage en modo incógnito o lleno
  }
}

function syncWithServer() {
  if (!state || !state.studentName || state.studentName.trim() === '') return;
  try {
    if (typeof fetch === 'function') {
      fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      }).catch(() => {
        // Modo offline / estático: LocalStorage sigue funcionando al 100%
      });
    }
  } catch (e) {
    // Ignorar si no hay conexión a internet o el backend no está activo
  }
}

function setActiveStudent(name, grade) {
  const cleanName = (name || '').trim();
  const cleanGrade = (grade || '').trim();
  if (!cleanName) return false;

  const key = (cleanName + '_' + cleanGrade).toLowerCase();
  const profiles = loadAllProfiles();

  if (profiles[key] && profiles[key].stateData) {
    // Cargar perfil existente de ese estudiante
    state = profiles[key].stateData;
    state.studentName = cleanName;
    state.studentGrade = cleanGrade;
  } else {
    // Iniciar nuevo cuaderno de campo para este estudiante
    const currentSound = state ? state.soundOn : true;
    state = defaultStudentSession(cleanName, cleanGrade);
    state.soundOn = currentSound;
  }
  
  ensureMapQuizEntries(state);
  saveState();
  return true;
}

function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '.profiles');
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem('granja_b13_state');
    localStorage.removeItem('granja_b13_state_v2');
  } catch (e) {}
  location.reload();
}

function clearAllProfiles() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '.profiles');
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem('granja_b13_state');
    localStorage.removeItem('granja_b13_state_v2');
  } catch (e) {}
  location.reload();
}

// Estado global de la sesión
let state = loadState();
