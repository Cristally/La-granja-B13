/*
  state.js — Guarda y recupera el progreso de los estudiantes en el
  navegador (localStorage), para que el panel docente pueda mostrar
  un resumen por estudiante, calcular décimas y asegurar que cada
  alumno/a tenga su registro individual de actividades sin mezclar respuestas.

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
    avatarIcon: '🧑‍🌾',
    avatarColor: '#ffd83d',
    studentTitle: 'Explorador/a de Campo',
    score: 0,
    discovered: [],
    quiz: quiz,
    mapDiscovered: [],
    mapQuiz: mapQuiz,
    badges: [],
    secretBadges: [],
    certificateUnlocked: false,
    certificateIssuedAt: null,
    certificateCode: '',
    organsInspected: [],
    soundsPlayed: [],
    rulesRead: false,
    streak: 0,
    custom: {},
    soundOn: true,
    finalShown: false,
    mapFinalShown: false,
    collectedClues: [],
    themeBg: '#FAF7EE',
    themeMode: 'light',
    nameChangesCount: 0,
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
        base.avatarIcon = saved.avatarIcon || '🧑‍🌾';
        base.avatarColor = saved.avatarColor || '#ffd83d';
        base.studentTitle = saved.studentTitle || 'Explorador/a de Campo';
        base.score = typeof saved.score === 'number' ? saved.score : 0;
        base.discovered = Array.isArray(saved.discovered) ? saved.discovered : [];
        base.mapDiscovered = Array.isArray(saved.mapDiscovered) ? saved.mapDiscovered : [];
        base.badges = Array.isArray(saved.badges) ? saved.badges : [];
        base.secretBadges = Array.isArray(saved.secretBadges) ? saved.secretBadges : [];
        base.certificateUnlocked = !!saved.certificateUnlocked;
        base.certificateIssuedAt = saved.certificateIssuedAt || null;
        base.certificateCode = saved.certificateCode || '';
        base.organsInspected = Array.isArray(saved.organsInspected) ? saved.organsInspected : [];
        base.soundsPlayed = Array.isArray(saved.soundsPlayed) ? saved.soundsPlayed : [];
        base.rulesRead = !!saved.rulesRead;
        base.streak = typeof saved.streak === 'number' ? saved.streak : 0;
        base.custom = saved.custom || {};
        base.soundOn = saved.soundOn !== false;
        base.finalShown = !!saved.finalShown;
        base.mapFinalShown = !!saved.mapFinalShown;
        base.collectedClues = Array.isArray(saved.collectedClues) ? saved.collectedClues : [];
        base.themeBg = saved.themeBg || '#FAF7EE';
        base.themeMode = saved.themeMode || 'light';
        base.nameChangesCount = typeof saved.nameChangesCount === 'number' ? saved.nameChangesCount : 0;
        base.createdAt = saved.createdAt || Date.now();
        base.updatedAt = saved.updatedAt || Date.now();

        if (saved.quiz) {
          Object.keys(base.quiz).forEach(id => {
            const sp = ANIMALS.find(x => x.id === id);
            const qCount = sp && sp.quiz ? sp.quiz.length : 6;
            base.quiz[id] = ensureQuizBucketStructure(saved.quiz[id], qCount);
          });
        }

        base.mapQuiz = (saved.mapQuiz && typeof saved.mapQuiz === 'object') ? saved.mapQuiz : {};
      }
    }

    ensureMapQuizEntries(base);
    base.pureScore = computePureScore(base);
    base.score = base.pureScore; // El puntaje oficial de la plataforma siempre es el puntaje academico puro de quizzes
    return base;
  } catch (e) {
    ensureMapQuizEntries(base);
    base.pureScore = computePureScore(base);
    base.score = base.pureScore;
    return base;
  }
}

function computePureScore(st) {
  if (!st) return 0;
  let total = 0;
  // 1. Quizzes de animales en el Mapa 3D (cada especie cuenta máx 1 vez con su mejor puntaje)
  if (st.mapQuiz && typeof st.mapQuiz === 'object') {
    for (const key of Object.keys(st.mapQuiz)) {
      const q = st.mapQuiz[key];
      if (q && q.completed) {
        let pts = Number(q.scoreEarned);
        if (!Number.isFinite(pts) || pts <= 0) {
          pts = Array.isArray(q.results) ? q.results.filter(Boolean).length * 10 : 0;
        }
        total += Math.min(90, Math.max(0, pts));
      }
    }
  }
  // 2. Quizzes de animales en el Potrero (si existen en st.quiz)
  if (st.quiz && typeof st.quiz === 'object') {
    for (const key of Object.keys(st.quiz)) {
      const q = st.quiz[key];
      if (q && q.completed) {
        let pts = Number(q.scoreEarned);
        if (!Number.isFinite(pts) || pts <= 0) {
          pts = Array.isArray(q.results) ? q.results.filter(Boolean).length * 10 : 0;
        }
        total += Math.min(90, Math.max(0, pts));
      }
    }
  }
  // 3. Quizzes de profesor por zona (máx 1 vez por zona)
  if (st.teacherQuizzes && typeof st.teacherQuizzes === 'object') {
    for (const key of Object.keys(st.teacherQuizzes)) {
      const tq = st.teacherQuizzes[key];
      if (tq && tq.completed) {
        total += Math.max(0, Number(tq.scoreEarned || 0));
      }
    }
  }
  return total;
}
window.computePureScore = computePureScore;

function saveState() {
  try {
    if (typeof window !== 'undefined') window.state = state;
    state.pureScore = computePureScore(state);
    state.score = state.pureScore; // Puntaje oficial del juego es el puntaje puro sin repetición
    state.updatedAt = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    // Si hay un estudiante identificado, guardar o actualizar su perfil en el listado docente
    if (state.studentName && state.studentName.trim() !== '') {
      const key = (state.studentName.trim() + '_' + (state.studentGrade || '').trim()).toLowerCase();
      const profiles = loadAllProfiles();
      profiles[key] = {
        studentName: state.studentName.trim(),
        studentGrade: (state.studentGrade || '').trim(),
        avatarIcon: state.avatarIcon || '🧑‍🌾',
        avatarColor: state.avatarColor || '#ffd83d',
        studentTitle: state.studentTitle || 'Explorador/a de Campo',
        score: state.pureScore,
        pureScore: state.pureScore,
        discoveredCount: state.discovered.length,
        mapDiscoveredCount: state.mapDiscovered.length,
        potreroQuizCompleted: Object.keys(state.quiz).filter(k => state.quiz[k] && state.quiz[k].completed).length,
        mapQuizCompleted: Object.keys(state.mapQuiz).filter(k => state.mapQuiz[k] && state.mapQuiz[k].completed).length,
        badgesCount: state.badges.length,
        secretBadgesCount: (state.secretBadges || []).length,
        certificateUnlocked: !!state.certificateUnlocked,
        nameChangesCount: state.nameChangesCount || 0,
        updatedAt: state.updatedAt,
        stateData: JSON.parse(JSON.stringify(state))
      };
      saveAllProfiles(profiles);
    }
    // Sincronización transparente con el servidor / base de datos en segundo plano si está disponible
    syncWithServer();
    if (typeof window.refreshRankingWidget === 'function') {
      window.refreshRankingWidget();
    }
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
    if (typeof state.nameChangesCount !== 'number') {
      state.nameChangesCount = profiles[key].nameChangesCount || 0;
    }
    if (!Array.isArray(state.collectedClues)) state.collectedClues = [];
  } else {
    // Iniciar nuevo cuaderno de campo para este estudiante
    const currentSound = state ? state.soundOn : true;
    state = defaultStudentSession(cleanName, cleanGrade);
    state.soundOn = currentSound;
  }

  try {
    const rawSesion = localStorage.getItem('granjaSesion');
    if (rawSesion) {
      const s = JSON.parse(rawSesion);
      if (s && s.rol === 'estudiante' && s.nombre && s.nombre.toLowerCase() === cleanName.toLowerCase()) {
        if (typeof s.nameChangesCount === 'number' && s.nameChangesCount > (state.nameChangesCount || 0)) {
          state.nameChangesCount = s.nameChangesCount;
        }
      }
    }
  } catch (e) {}
  
  ensureMapQuizEntries(state);
  applyGranjaTheme(state.themeMode, state.themeBg);
  if (typeof window !== 'undefined') window.state = state;
  saveState();
  return true;
}

function renameStudent(oldName, oldGrade, newName, newGrade) {
  const cleanOldName = (oldName || '').trim();
  const cleanOldGrade = (oldGrade || '').trim();
  const cleanNewName = (newName || '').trim();
  const cleanNewGrade = (newGrade || '').trim();

  if (!cleanNewName) return false;

  const oldKey = (cleanOldName + '_' + cleanOldGrade).toLowerCase();
  const newKey = (cleanNewName + '_' + cleanNewGrade).toLowerCase();

  const profiles = loadAllProfiles();

  if (oldKey !== newKey) {
    if (profiles[oldKey]) {
      // Migrar registro completo del estudiante sin perder quizzes ni puntajes
      profiles[newKey] = {
        ...profiles[oldKey],
        studentName: cleanNewName,
        studentGrade: cleanNewGrade,
        nameChangesCount: state.nameChangesCount || profiles[oldKey].nameChangesCount || 0,
        updatedAt: Date.now()
      };
      if (profiles[newKey].stateData) {
        profiles[newKey].stateData.studentName = cleanNewName;
        profiles[newKey].stateData.studentGrade = cleanNewGrade;
        profiles[newKey].stateData.nameChangesCount = state.nameChangesCount || 0;
      }
      delete profiles[oldKey];
      saveAllProfiles(profiles);
    }

    // Migrar cuaderno de pistas zootécnicas si existían
    try {
      const oldCluesKey = 'granja_clues_' + oldKey;
      const newCluesKey = 'granja_clues_' + newKey;
      const oldClues = localStorage.getItem(oldCluesKey);
      if (oldClues && !localStorage.getItem(newCluesKey)) {
        localStorage.setItem(newCluesKey, oldClues);
        localStorage.removeItem(oldCluesKey);
      }
    } catch (e) {}
  }

  // Actualizar estado en memoria y persistir
  if (state) {
    state.studentName = cleanNewName;
    state.studentGrade = cleanNewGrade;
    saveState();
  }

  return true;
}
window.renameStudent = renameStudent;
window.setActiveStudent = setActiveStudent;
window.saveState = saveState;
window.loadState = loadState;

function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + '.profiles');
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem('granja_b13_state');
    localStorage.removeItem('granja_b13_state_v2');
    localStorage.setItem('granjaEstudiantes', '[]');
    localStorage.setItem('granjaRespuestasQuiz', '[]');
    localStorage.setItem('granjaVisitasZonas', '{}');
    localStorage.setItem('granjaVisitasAnimales', '{}');
    localStorage.setItem('granjaActividadPorDia', '{}');
    localStorage.removeItem('granjaSesion');
    localStorage.removeItem('granjaSesionActiva');
    if (typeof fetch === 'function') {
      fetch('/api/reset', { method: 'POST' }).catch(() => {});
    }
  } catch (e) {}
  location.reload();
}

function clearAllProfiles() {
  resetState();
}

// Estado global de la sesión
let state = loadState();
if (typeof window !== 'undefined') {
  window.state = state;
}

// Cálculo matemático universal de luminancia relativa (W3C WCAG 2.1)
function getBgLuminance(colorStr) {
  if (!colorStr || typeof colorStr !== 'string') return 0.9;
  const s = colorStr.trim();
  if (s.startsWith('rgb')) {
    const match = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
    if (match) {
      const r = parseInt(match[1], 10) / 255;
      const g = parseInt(match[2], 10) / 255;
      const b = parseInt(match[3], 10) / 255;
      const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
      return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
    }
  }
  let hex = s.replace('#', '').trim();
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  if (hex.length !== 6) return 0.9;
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  const toLinear = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
window.getBgLuminance = getBgLuminance;

function applyGranjaTheme(themeMode, themeBg) {
  let bg = themeBg || (typeof state !== 'undefined' && state ? state.themeBg : null) || localStorage.getItem('granja_theme_bg');
  let mode = themeMode || (typeof state !== 'undefined' && state ? state.themeMode : null) || localStorage.getItem('granja_theme_mode');

  // Si no hay color definido, asignar según modo
  if (!bg) {
    bg = (mode === 'dark') ? '#141c13' : '#FAF7EE';
  } else {
    // Si se pasa modo explícito 'dark' y el color sigue siendo el beige claro por defecto
    if (mode === 'dark' && (bg.toLowerCase() === '#faf7ee' || bg.toLowerCase() === '#ffffff')) {
      bg = '#141c13';
    } else if (mode === 'light' && (bg.toLowerCase() === '#141c13' || bg.toLowerCase() === '#151c14' || bg.toLowerCase() === '#000000')) {
      bg = '#FAF7EE';
    }
  }

  // Evaluar matemáticamente la luminosidad real del fondo para garantizar contraste estricto
  const lum = getBgLuminance(bg);
  const isDark = (lum <= 0.38);
  const effectiveMode = isDark ? 'dark' : 'light';

  const docEl = document.documentElement;
  const docBody = document.body;

  if (isDark) {
    docEl.classList.add('theme-dark', 'bg-is-dark');
    docEl.classList.remove('bg-is-light');
    if (docBody) {
      docBody.classList.add('theme-dark', 'bg-is-dark');
      docBody.classList.remove('bg-is-light');
    }
    docEl.style.setProperty('--bg-canvas', bg);
    docEl.style.setProperty('--text-on-bg', '#FFFFFF');
    docEl.style.setProperty('--text-sub-on-bg', '#d7e2cb');
    docEl.style.setProperty('--border-on-bg', '#4a5e42');
    docEl.style.setProperty('--ink', '#eef3e5');
    docEl.style.setProperty('--grass-dark', '#81c784');
    docEl.style.setProperty('--paper-dark', '#1f2a1c');
    docEl.style.setProperty('--paper-card', '#222d1e');
  } else {
    docEl.classList.remove('theme-dark', 'bg-is-dark');
    docEl.classList.add('bg-is-light');
    if (docBody) {
      docBody.classList.remove('theme-dark', 'bg-is-dark');
      docBody.classList.add('bg-is-light');
    }
    docEl.style.setProperty('--bg-canvas', bg);
    docEl.style.setProperty('--text-on-bg', '#1c2616');
    docEl.style.setProperty('--text-sub-on-bg', '#2d4624');
    docEl.style.setProperty('--border-on-bg', '#28311B');
    docEl.style.setProperty('--ink', '#28311B');
    docEl.style.setProperty('--grass-dark', '#2d4624');
    docEl.style.setProperty('--paper-dark', '#EADBBE');
    docEl.style.setProperty('--paper-card', '#FFFDF7');
  }

  if (docBody) {
    docBody.style.backgroundColor = bg;
  }

  if (typeof state !== 'undefined' && state) {
    state.themeMode = effectiveMode;
    state.themeBg = bg;
  }
  try {
    localStorage.setItem('granja_theme_mode', effectiveMode);
    localStorage.setItem('granja_theme_bg', bg);
  } catch (e) {}
}
window.applyGranjaTheme = applyGranjaTheme;

applyGranjaTheme(state ? state.themeMode : null, state ? state.themeBg : null);
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyGranjaTheme(state ? state.themeMode : null, state ? state.themeBg : null);
    });
  } else {
    applyGranjaTheme(state ? state.themeMode : null, state ? state.themeBg : null);
  }
}
