/*
  auth.js — Sistema Multi-Rol de Autenticación, Gestión de Estudiantes,
  Panel del Profesor con Creador de Quizzes y Estadísticas de la Granjita B13.
  Integrado con La Granja B13 (Liceo Domingo Herrera Rivera).
*/

const CLAVE_ESTUDIANTES = 'granjaEstudiantes';
const CLAVE_SESION = 'granjaSesion';
const CLAVE_QUIZZES_ZONA = 'granjaQuizzesZona';
const CLAVE_RESPUESTAS = 'granjaRespuestasQuiz';
const CLAVE_VISITAS_ZONAS = 'granjaVisitasZonas';
const CLAVE_VISITAS_ANIMALES = 'granjaVisitasAnimales';
const CLAVE_ACTIVIDAD_DIA = 'granjaActividadPorDia';

const CUENTA_PROFESOR = { correo: 'profesor@granja.cl', clave: 'profesor1234', nombre: 'Profesor/a B-13' };
const CUENTA_DEMO_ESTUDIANTE = {
  nombre: 'Estudiante Demo', correo: 'demo@granja.cl', clave: 'demo1234',
  curso: '2°B', genero: 'Prefiero no decirlo'
};
const PIN_ADMIN = '1234';

// Quizzes iniciales pedagógicos del liceo por zona (aportados por el ejemplo GranjitaBase)
const QUIZZES_INICIALES = {
  conejos: [
    { pregunta: '¿Por qué los conejos necesitan roer heno constantemente?', opciones: ['Para entretenerse', 'Porque sus dientes crecen durante toda la vida', 'Para dormir mejor', 'Porque les gusta el sabor'], correcta: 1, decimas: 0.5, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Cuántas crías puede tener una coneja por camada, aproximadamente?', opciones: ['1 cría', '4 a 8 crías', '20 crías', '50 crías'], correcta: 1, decimas: 0.3, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Qué tipo de alimentación tiene el conejo?', opciones: ['Carnívoro estricto', 'Herbívoro estricto con alto contenido en fibra', 'Omnívoro carroñero', 'Frugívoro exclusivo'], correcta: 1, decimas: 0.4, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Cuánto dura aproximadamente la gestación de una coneja?', opciones: ['5 días', '28 a 31 días', '6 meses', '1 año'], correcta: 1, decimas: 0.4, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Qué es la cecotrofia en los conejos?', opciones: ['Un tipo de hibernación', 'La ingestión de heces blandas ricas en nutrientes y vitaminas', 'Una enfermedad digestiva', 'El cambio de pelaje estacional'], correcta: 1, decimas: 0.5, profesor: 'Prof. Ana Reyes' }
  ],
  gallinas: [
    { pregunta: '¿Cuánto dura la incubación de un huevo de gallina?', opciones: ['7 días', '21 días', '45 días', '3 meses'], correcta: 1, decimas: 0.4, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿Qué come principalmente una gallina en su dieta equilibrada?', opciones: ['Solo restos de carne', 'Granos, semillas, vegetales e insectos', 'Solo pasto seco', 'Alimentos azucarados'], correcta: 1, decimas: 0.3, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿Por qué las gallinas toman baños de tierra o arena?', opciones: ['Para limpiar su plumaje y controlar parásitos externos', 'Porque temen al frío nocturno', 'Para cambiar el color de sus plumas', 'Para descansar sus patas'], correcta: 0, decimas: 0.4, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿Qué estructura cefálica ayuda a regular la temperatura del gallo?', opciones: ['Las patas escamosas', 'La cresta y barbillas muy vascularizadas', 'Las alas primarias', 'El pico córneo'], correcta: 1, decimas: 0.3, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿A qué clase taxonómica pertenece el gallo y la gallina?', opciones: ['Mamíferos', 'Reptiles escamosos', 'Aves (Aves galliformes)', 'Anfibios terrestres'], correcta: 2, decimas: 0.3, profesor: 'Prof. Carlos Soto' }
  ],
  arboleda: [
    { pregunta: '¿De qué continente son originarios los agapornis?', opciones: ['América del Sur', 'África y Madagascar', 'Europa Central', 'Oceanía'], correcta: 1, decimas: 0.4, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Por qué se les conoce popularmente como "inseparables" a los agapornis?', opciones: ['Porque no pueden volar solos', 'Porque forman lazos de pareja muy estables y duraderos', 'Porque son idénticos en color', 'Porque duermen pegados al suelo'], correcta: 1, decimas: 0.4, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Cuál es la base de alimentación de las catitas australianas?', opciones: ['Carne picada', 'Semillas de pastos, mijo y brotes frescos', 'Peces pequeños', 'Ramas leñosas secas'], correcta: 1, decimas: 0.3, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Cuánto dura aproximadamente la incubación de los huevos de catita?', opciones: ['2 días', '8 días', '18 a 21 días', '45 días'], correcta: 2, decimas: 0.5, profesor: 'Prof. Valentina Rojas' }
  ],
  pozo: [
    { pregunta: '¿Por qué el agua para los animales debe cambiarse a diario y mantenerse limpia?', opciones: ['Para que no se evapore rápido', 'Para prevenir la proliferación de bacterias, algas y enfermedades', 'Solo por estética del corral', 'Porque los animales solo beben agua helada'], correcta: 1, decimas: 0.4, profesor: 'Equipo Granja B13' }
  ],
  plantas: [
    { pregunta: '¿Qué beneficio aporta el huerto escolar a la fauna del Liceo B-13?', opciones: ['Ninguno, son independientes', 'Provee verduras frescas, forraje y hojas ricas en fibra', 'Atrae plagas nocivas', 'Reduce el espacio de los corrales'], correcta: 1, decimas: 0.4, profesor: 'Equipo Granja B13' }
  ]
};

const Auth = {
  init() {
    // Inicializar listas en localStorage si no existen
    if (!localStorage.getItem(CLAVE_ESTUDIANTES)) {
      localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify([CUENTA_DEMO_ESTUDIANTE]));
    }
    if (!localStorage.getItem(CLAVE_QUIZZES_ZONA)) {
      localStorage.setItem(CLAVE_QUIZZES_ZONA, JSON.stringify(QUIZZES_INICIALES));
    }

    // Registrar actividad de hoy
    Auth.registrarActividadDelDia();

    // Sincronizar estado global con la sesión activa
    const sesion = Auth.getSesion();
    if (sesion && sesion.rol === 'estudiante') {
      if (typeof state !== 'undefined') {
        state.studentName = sesion.nombre;
        state.studentGrade = sesion.curso || '';
      }
    }

    Auth.actualizarPildora();
  },

  getSesion() {
    try {
      const raw = localStorage.getItem(CLAVE_SESION);
      return raw ? JSON.parse(raw) : { rol: 'visita', nombre: 'Visitante' };
    } catch (e) {
      return { rol: 'visita', nombre: 'Visitante' };
    }
  },

  setSesion(sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
    if (typeof state !== 'undefined' && sesion.rol === 'estudiante') {
      state.studentName = sesion.nombre;
      state.studentGrade = sesion.curso || '';
      if (typeof saveState === 'function') saveState();
    }
    Auth.actualizarPildora();
    if (typeof updateHeaderUI === 'function') updateHeaderUI();
  },

  cerrarSesion() {
    Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
    Auth.mostrarNotificacion('Has cerrado sesión. Modo Visitas activado.');
    Auth.actualizarPildora();
    setTimeout(() => location.reload(), 300);
  },

  entrarVisita() {
    Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
    Auth.cerrarModales();
    Auth.mostrarNotificacion('¡Bienvenido en Modo Visitas! Puedes explorar libremente.');
  },

  getEstudiantes() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_ESTUDIANTES)) || [];
    } catch (e) {
      return [CUENTA_DEMO_ESTUDIANTE];
    }
  },

  guardarEstudiantes(lista) {
    localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify(lista));
  },

  registroEstudiante(nombre, curso, genero, correo, clave) {
    const estudiantes = Auth.getEstudiantes();
    const existe = estudiantes.some(e => e.correo.toLowerCase() === correo.toLowerCase())
      || correo.toLowerCase() === CUENTA_DEMO_ESTUDIANTE.correo;

    if (existe) {
      return { ok: false, error: 'Ese correo ya está registrado.' };
    }

    const nuevo = { nombre, curso, genero, correo, clave, fechaRegistro: new Date().toISOString() };
    estudiantes.push(nuevo);
    Auth.guardarEstudiantes(estudiantes);

    // Iniciar sesión automáticamente
    Auth.setSesion({ rol: 'estudiante', nombre, correo, curso, genero });
    return { ok: true };
  },

  loginEstudiante(correo, clave) {
    if (correo.toLowerCase() === CUENTA_DEMO_ESTUDIANTE.correo && clave === CUENTA_DEMO_ESTUDIANTE.clave) {
      Auth.setSesion({
        rol: 'estudiante',
        nombre: CUENTA_DEMO_ESTUDIANTE.nombre,
        correo: CUENTA_DEMO_ESTUDIANTE.correo,
        curso: CUENTA_DEMO_ESTUDIANTE.curso,
        genero: CUENTA_DEMO_ESTUDIANTE.genero
      });
      return { ok: true };
    }

    const estudiantes = Auth.getEstudiantes();
    const encontrado = estudiantes.find(e => e.correo.toLowerCase() === correo.toLowerCase() && e.clave === clave);
    if (!encontrado) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' };
    }

    Auth.setSesion({
      rol: 'estudiante',
      nombre: encontrado.nombre,
      correo: encontrado.correo,
      curso: encontrado.curso,
      genero: encontrado.genero
    });
    return { ok: true };
  },

  loginProfesor(correo, clave) {
    if (correo.toLowerCase() === CUENTA_PROFESOR.correo && clave === CUENTA_PROFESOR.clave) {
      Auth.setSesion({
        rol: 'profesor',
        nombre: CUENTA_PROFESOR.nombre,
        correo: CUENTA_PROFESOR.correo
      });
      return { ok: true };
    }
    return { ok: false, error: 'Credenciales docentes incorrectas.' };
  },

  loginAdmin(pin) {
    if (pin.trim() === PIN_ADMIN) {
      Auth.setSesion({
        rol: 'admin',
        nombre: 'Administrador/a B-13'
      });
      return { ok: true };
    }
    return { ok: false, error: 'PIN incorrecto. (PIN de prueba: 1234)' };
  },

  actualizarPildora() {
    const pill = document.getElementById('studentPill');
    const label = document.getElementById('studentPillName');
    if (!pill || !label) return;

    const sesion = Auth.getSesion();
    pill.classList.remove('role-profesor', 'role-admin', 'role-visita', 'role-estudiante');

    if (sesion.rol === 'profesor') {
      pill.classList.add('role-profesor');
      label.textContent = '🍎 Docente: ' + (sesion.nombre || 'Profesor/a');
    } else if (sesion.rol === 'admin') {
      pill.classList.add('role-admin');
      label.textContent = '🔧 Admin B-13';
    } else if (sesion.rol === 'estudiante') {
      pill.classList.add('role-estudiante');
      label.textContent = `🎓 ${sesion.nombre} (${sesion.curso || 'Estudiante'})`;
    } else {
      pill.classList.add('role-visita');
      label.textContent = '🧭 Modo Visitas (Invitado)';
    }
  },

  abrirSelectorRoles() {
    const modal = document.getElementById('roleSelectModal');
    if (modal) modal.classList.add('active');
  },

  cerrarModales() {
    document.querySelectorAll('.role-modal').forEach(m => m.classList.remove('active'));
  },

  mostrarNotificacion(texto) {
    if (typeof showToast === 'function') {
      showToast(texto);
    } else {
      console.log(texto);
    }
  },

  registrarActividadDelDia() {
    try {
      const hoy = new Date().toISOString().slice(0, 10);
      const datos = JSON.parse(localStorage.getItem(CLAVE_ACTIVIDAD_DIA)) || {};
      datos[hoy] = (datos[hoy] || 0) + 1;
      localStorage.setItem(CLAVE_ACTIVIDAD_DIA, JSON.stringify(datos));
    } catch (e) {}
  },

  registrarVisitaZona(zonaId) {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_VISITAS_ZONAS)) || {};
      datos[zonaId] = (datos[zonaId] || 0) + 1;
      localStorage.setItem(CLAVE_VISITAS_ZONAS, JSON.stringify(datos));
      Auth.registrarActividadDelDia();
    } catch (e) {}
  },

  registrarVisitaAnimal(animalId) {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_VISITAS_ANIMALES)) || {};
      datos[animalId] = (datos[animalId] || 0) + 1;
      localStorage.setItem(CLAVE_VISITAS_ANIMALES, JSON.stringify(datos));
      Auth.registrarActividadDelDia();
    } catch (e) {}
  },

  registrarRespuestaQuiz(correcta, zonaId) {
    const sesion = Auth.getSesion();
    try {
      const registros = JSON.parse(localStorage.getItem(CLAVE_RESPUESTAS)) || [];
      registros.push({
        correo: sesion.correo || 'anonimo@granja.cl',
        nombre: sesion.nombre || 'Visitante',
        curso: sesion.curso || 'Sin curso',
        genero: sesion.genero || 'Sin dato',
        correcta: !!correcta,
        zonaId: zonaId || 'general',
        fecha: new Date().toISOString()
      });
      localStorage.setItem(CLAVE_RESPUESTAS, JSON.stringify(registros));
      Auth.registrarActividadDelDia();
    } catch (e) {}
  }
};

/* ============================================================
   Gestión de Quizzes creados por el Profesor para Zonas
   ============================================================ */
const TeacherQuizzes = {
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(CLAVE_QUIZZES_ZONA)) || QUIZZES_INICIALES;
    } catch (e) {
      return QUIZZES_INICIALES;
    }
  },

  getForZone(zonaId) {
    const todos = TeacherQuizzes.getAll();
    return todos[zonaId] || [];
  },

  add(zonaId, pregunta, opciones, correcta, decimas, profesor) {
    const todos = TeacherQuizzes.getAll();
    if (!todos[zonaId]) todos[zonaId] = [];
    if (todos[zonaId].length >= 10) {
      return { ok: false, error: 'Esta zona ya tiene el límite de 10 preguntas.' };
    }
    todos[zonaId].push({
      pregunta: pregunta.trim(),
      opciones: opciones.map(o => o.trim()),
      correcta: parseInt(correcta, 10),
      decimas: parseFloat(decimas) || 0.3,
      profesor: profesor.trim() || 'Profesor/a B-13',
      creadoEn: new Date().toISOString()
    });
    localStorage.setItem(CLAVE_QUIZZES_ZONA, JSON.stringify(todos));
    return { ok: true };
  },

  remove(zonaId, index) {
    const todos = TeacherQuizzes.getAll();
    if (!todos[zonaId]) return;
    todos[zonaId].splice(index, 1);
    if (todos[zonaId].length === 0) delete todos[zonaId];
    localStorage.setItem(CLAVE_QUIZZES_ZONA, JSON.stringify(todos));
  }
};

function getTeacherQuizzesForZone(zonaId) {
  return TeacherQuizzes.getForZone(zonaId);
}

// Inicializar al cargar el script
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
