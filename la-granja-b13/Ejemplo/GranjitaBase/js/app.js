function ajustarAltoViewport() {
  const alto = (window.visualViewport ? window.visualViewport.height : window.innerHeight) * 0.01;
  document.documentElement.style.setProperty('--vh', `${alto}px`);
}

ajustarAltoViewport();
window.addEventListener('resize', ajustarAltoViewport);
window.addEventListener('orientationchange', ajustarAltoViewport);
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', ajustarAltoViewport);
}

let modoActual = null;

function cambiarPantalla(origen, destino, alTerminar) {
  origen.hidden = true;
  destino.hidden = false;
  if (alTerminar) alTerminar();
}

function irAModoVisita() {
  modoActual = 'visita';
  const modo = document.getElementById('modeScreen');
  const juego = document.getElementById('gameScreen');
  cambiarPantalla(modo, juego, entrarAlMapa);
}

function irAAuthEstudiante() {
  const modo = document.getElementById('modeScreen');
  const auth = document.getElementById('authScreen');
  cambiarPantalla(modo, auth, () => {
    document.getElementById('loginCard').hidden = false;
    document.getElementById('registerCard').hidden = true;
  });
}

function volverAModo() {
  const auth = document.getElementById('authScreen');
  const modo = document.getElementById('modeScreen');
  cambiarPantalla(auth, modo);
}

function entrarComoEstudiante() {
  modoActual = 'estudiante';
  const auth = document.getElementById('authScreen');
  const juego = document.getElementById('gameScreen');
  cambiarPantalla(auth, juego, entrarAlMapa);
}

function entrarAlMapa() {
  const quizFab = document.getElementById('quizFab');
  const scoreBadge = document.getElementById('scoreBadge');
  const esEstudiante = modoActual === 'estudiante';

  if (quizFab) quizFab.hidden = !esEstudiante;
  if (scoreBadge) {
    scoreBadge.hidden = !esEstudiante;
    if (esEstudiante) actualizarPuntajeMostrado();
  }

  crearHotspotsQuiz();
}

function volverAlInicio(destinoId = 'modeScreen') {
  const destino = document.getElementById(destinoId);
  const origen = ['startScreen', 'modeScreen', 'authScreen', 'gameScreen', 'adminScreen', 'profesorScreen']
    .filter((id) => id !== destinoId)
    .map((id) => document.getElementById(id))
    .find((el) => el && !el.hidden);

  if (!origen || !destino) return;

  modoActual = null;
  document.getElementById('infoModal').hidden = true;
  document.getElementById('quizModal').hidden = true;
  document.getElementById('galleryModal').hidden = true;
  document.getElementById('bioModal').hidden = true;
  document.getElementById('lightbox').hidden = true;
  document.getElementById('adminPinModal').hidden = true;
  document.getElementById('profesorLoginModal').hidden = true;
  document.getElementById('quizFab').hidden = true;
  document.getElementById('scoreBadge').hidden = true;

  cambiarPantalla(origen, destino);
}

const CLAVE_ESTUDIANTES = 'granjaEstudiantes';
const CLAVE_SESION = 'granjaSesion';
const CUENTA_DEMO = {
  nombre: 'Estudiante Demo', correo: 'demo@granja.cl', clave: 'demo1234',
  curso: 'Demo', genero: 'Prefiero no decirlo',
};
const PIN_ADMIN = '1234';
const CUENTA_PROFESOR = { correo: 'profesor@granja.cl', clave: 'profesor1234' };

function obtenerEstudiantes() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_ESTUDIANTES)) || [];
  } catch (error) {
    return [];
  }
}

function guardarEstudiantes(lista) {
  localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify(lista));
}

function registrarEstudiante(nombre, correo, clave, curso, genero) {
  const estudiantes = obtenerEstudiantes();
  const yaExiste = estudiantes.some((e) => e.correo.toLowerCase() === correo.toLowerCase())
    || correo.toLowerCase() === CUENTA_DEMO.correo;

  if (yaExiste) {
    return { ok: false, error: 'Ese correo ya está registrado.' };
  }

  estudiantes.push({ nombre, correo, clave, curso, genero });
  guardarEstudiantes(estudiantes);
  return { ok: true };
}

function validarLogin(correo, clave) {
  if (correo.toLowerCase() === CUENTA_DEMO.correo && clave === CUENTA_DEMO.clave) {
    return { nombre: CUENTA_DEMO.nombre, correo: CUENTA_DEMO.correo };
  }

  const estudiantes = obtenerEstudiantes();
  const encontrado = estudiantes.find(
    (e) => e.correo.toLowerCase() === correo.toLowerCase() && e.clave === clave
  );

  return encontrado || null;
}

function guardarSesion(estudiante) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(estudiante));
}

function obtenerSesion() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_SESION));
  } catch (error) {
    return null;
  }
}

function manejarRegistro(evento) {
  evento.preventDefault();
  const nombre = document.getElementById('regNombre').value.trim();
  const curso = document.getElementById('regCurso').value.trim();
  const genero = document.getElementById('regGenero').value;
  const correo = document.getElementById('regCorreo').value.trim();
  const clave = document.getElementById('regClave').value;
  const error = document.getElementById('registerError');

  const resultado = registrarEstudiante(nombre, correo, clave, curso, genero);
  if (!resultado.ok) {
    error.textContent = resultado.error;
    error.hidden = false;
    return;
  }

  error.hidden = true;
  guardarSesion({ nombre, correo, curso, genero });
  entrarComoEstudiante();
}

function manejarLogin(evento) {
  evento.preventDefault();
  const correo = document.getElementById('loginCorreo').value.trim();
  const clave = document.getElementById('loginClave').value;
  const error = document.getElementById('loginError');

  const estudiante = validarLogin(correo, clave);
  if (!estudiante) {
    error.textContent = 'Correo o contraseña incorrectos.';
    error.hidden = false;
    return;
  }

  error.hidden = true;
  guardarSesion(estudiante);
  entrarComoEstudiante();
}

function mostrarFormularioRegistro() {
  document.getElementById('loginCard').hidden = true;
  document.getElementById('registerCard').hidden = false;
}

function mostrarFormularioLogin() {
  document.getElementById('registerCard').hidden = true;
  document.getElementById('loginCard').hidden = false;
}

function manejarAdminLogin(evento) {
  evento.preventDefault();
  const campoPin = document.getElementById('adminPin');
  const pin = campoPin.value.trim();
  const error = document.getElementById('adminError');

  if (pin !== PIN_ADMIN) {
    error.textContent = 'PIN incorrecto.';
    error.hidden = false;
    campoPin.value = '';
    return;
  }

  error.hidden = true;
  campoPin.value = '';
  document.getElementById('adminPinModal').hidden = true;

  cambiarPantalla(pantallaAccesoActiva(), document.getElementById('adminScreen'), renderizarEstadisticas);
}

function pantallaAccesoActiva() {
  const inicio = document.getElementById('startScreen');
  return inicio.hidden ? document.getElementById('modeScreen') : inicio;
}

function abrirPinAdmin() {
  document.getElementById('adminError').hidden = true;
  document.getElementById('adminPin').value = '';
  document.getElementById('adminPinModal').hidden = false;
}

function cerrarPinAdmin() {
  document.getElementById('adminPinModal').hidden = true;
}

function abrirLoginProfesor() {
  document.getElementById('profesorError').hidden = true;
  document.getElementById('profesorLoginModal').hidden = false;
}

function cerrarLoginProfesor() {
  document.getElementById('profesorLoginModal').hidden = true;
}

function manejarLoginProfesor(evento) {
  evento.preventDefault();
  const correo = document.getElementById('profesorCorreo').value.trim();
  const clave = document.getElementById('profesorClave').value;
  const error = document.getElementById('profesorError');

  if (correo.toLowerCase() !== CUENTA_PROFESOR.correo || clave !== CUENTA_PROFESOR.clave) {
    error.textContent = 'Correo o contraseña incorrectos.';
    error.hidden = false;
    return;
  }

  error.hidden = true;
  document.getElementById('profesorLoginModal').hidden = true;

  cambiarPantalla(pantallaAccesoActiva(), document.getElementById('profesorScreen'), renderizarPanelProfesor);
}

function obtenerQuizzesZona() {
  try {
    return JSON.parse(localStorage.getItem('granjaQuizzesZona')) || {};
  } catch (error) {
    return {};
  }
}

function guardarQuizzesZona(datos) {
  localStorage.setItem('granjaQuizzesZona', JSON.stringify(datos));
}

const MAX_PREGUNTAS_POR_ZONA = 10;

function crearQuizZona(zonaId, pregunta, opciones, correcta, decimas, profesor) {
  const quizzes = obtenerQuizzesZona();
  if (!quizzes[zonaId]) quizzes[zonaId] = [];
  if (quizzes[zonaId].length >= MAX_PREGUNTAS_POR_ZONA) {
    return { ok: false, error: `Esta zona ya tiene el máximo de ${MAX_PREGUNTAS_POR_ZONA} preguntas.` };
  }
  quizzes[zonaId].push({ pregunta, opciones, correcta, decimas, profesor });
  guardarQuizzesZona(quizzes);
  return { ok: true };
}

function eliminarQuizZona(zonaId, indice) {
  const quizzes = obtenerQuizzesZona();
  if (!quizzes[zonaId]) return;
  quizzes[zonaId].splice(indice, 1);
  if (quizzes[zonaId].length === 0) delete quizzes[zonaId];
  guardarQuizzesZona(quizzes);
  renderizarPanelProfesor();
}

function manejarCrearQuiz(evento) {
  evento.preventDefault();
  const autor = document.getElementById('quizAutor').value.trim();
  const zonaId = document.getElementById('quizZona').value;
  const pregunta = document.getElementById('quizPregunta').value.trim();
  const opciones = [0, 1, 2, 3].map((i) => document.getElementById('quizOpcion' + i).value.trim());
  const correcta = document.getElementById('quizCorrecta').value;
  const decimas = document.getElementById('quizDecimas').value;
  const error = document.getElementById('quizEditorError');

  if (!autor || !zonaId || !pregunta || opciones.some((o) => !o) || correcta === '' || decimas === '') {
    error.textContent = 'Completa todos los campos antes de guardar.';
    error.hidden = false;
    return;
  }

  const resultado = crearQuizZona(zonaId, pregunta, opciones, parseInt(correcta, 10), parseFloat(decimas), autor);
  if (!resultado.ok) {
    error.textContent = resultado.error;
    error.hidden = false;
    return;
  }

  error.hidden = true;
  const autorPrevio = autor;
  document.getElementById('quizEditorForm').reset();
  document.getElementById('quizAutor').value = autorPrevio;
  document.getElementById('quizDecimas').value = '0.3';
  renderizarPanelProfesor();
}

function renderizarPanelProfesor() {
  const selectZona = document.getElementById('quizZona');
  const lista = document.getElementById('quizListaProfesor');
  if (!selectZona || !lista) return;

  selectZona.innerHTML = '<option value="" disabled selected>Zona del mapa</option>'
    + ZONAS_MAPA.map((z) => {
      const titulo = RESPALDOS_ZONAS[z.nombre] ? RESPALDOS_ZONAS[z.nombre].titulo : z.nombre;
      return `<option value="${z.nombre}">${titulo}</option>`;
    }).join('');

  const quizzes = obtenerQuizzesZona();
  const zonasConQuiz = Object.keys(quizzes).filter((z) => quizzes[z].length > 0);

  if (zonasConQuiz.length === 0) {
    lista.innerHTML = '<div class="stat-card"><h3>Quizzes creados</h3><p class="stat-empty">Aún no has creado ningún quiz.</p></div>';
    return;
  }

  const filas = zonasConQuiz.map((zonaId) => {
    const titulo = RESPALDOS_ZONAS[zonaId] ? RESPALDOS_ZONAS[zonaId].titulo : zonaId;
    const preguntas = quizzes[zonaId].map((q, indice) => `
      <div class="quiz-item-row">
        <div class="quiz-item-text">
          <strong>${titulo}:</strong> ${q.pregunta}<br>
          <span style="opacity:0.75;">👤 ${q.profesor || 'Sin autor'} · 📐 +${(q.decimas || 0).toFixed(1)} décimas</span>
        </div>
        <button class="quiz-item-delete" data-zona="${zonaId}" data-indice="${indice}">✕</button>
      </div>
    `).join('');
    return preguntas;
  }).join('');

  lista.innerHTML = `<div class="stat-card"><h3>Quizzes creados (${Object.values(quizzes).reduce((acc, arr) => acc + arr.length, 0)})</h3>${filas}</div>`;

  lista.querySelectorAll('.quiz-item-delete').forEach((boton) => {
    boton.addEventListener('click', () => {
      eliminarQuizZona(boton.dataset.zona, parseInt(boton.dataset.indice, 10));
    });
  });
}

const ESTUDIANTES_PRUEBA = [
  { nombre: 'Sofía Herrera', correo: 'sofia@prueba.cl', clave: 'prueba1234', curso: '7°A', genero: 'Femenino' },
  { nombre: 'Mateo Rojas', correo: 'mateo@prueba.cl', clave: 'prueba1234', curso: '7°A', genero: 'Masculino' },
  { nombre: 'Valentina Soto', correo: 'valentina@prueba.cl', clave: 'prueba1234', curso: '7°B', genero: 'Femenino' },
  { nombre: 'Diego Fuentes', correo: 'diego@prueba.cl', clave: 'prueba1234', curso: '7°B', genero: 'Masculino' },
  { nombre: 'Camila Vidal', correo: 'camila@prueba.cl', clave: 'prueba1234', curso: '8°A', genero: 'Femenino' },
  { nombre: 'Benjamín Castro', correo: 'benjamin@prueba.cl', clave: 'prueba1234', curso: '8°A', genero: 'Masculino' },
  { nombre: 'Isidora Muñoz', correo: 'isidora@prueba.cl', clave: 'prueba1234', curso: '8°B', genero: 'Femenino' },
  { nombre: 'Tomás Araya', correo: 'tomas@prueba.cl', clave: 'prueba1234', curso: '8°B', genero: 'Prefiero no decirlo' },
];

const PATRON_RESPUESTAS_PRUEBA = [
  ['sofia@prueba.cl', '7°A', 'Femenino', 3, 0],
  ['mateo@prueba.cl', '7°A', 'Masculino', 2, 1],
  ['valentina@prueba.cl', '7°B', 'Femenino', 3, 1],
  ['diego@prueba.cl', '7°B', 'Masculino', 1, 2],
  ['camila@prueba.cl', '8°A', 'Femenino', 4, 0],
  ['benjamin@prueba.cl', '8°A', 'Masculino', 2, 2],
  ['isidora@prueba.cl', '8°B', 'Femenino', 3, 0],
  ['tomas@prueba.cl', '8°B', 'Prefiero no decirlo', 2, 1],
];

function generarRespuestasPrueba() {
  const respuestas = [];
  PATRON_RESPUESTAS_PRUEBA.forEach(([correo, curso, genero, correctas, incorrectas]) => {
    for (let i = 0; i < correctas; i++) respuestas.push({ correo, curso, genero, correcta: true, fecha: new Date().toISOString() });
    for (let i = 0; i < incorrectas; i++) respuestas.push({ correo, curso, genero, correcta: false, fecha: new Date().toISOString() });
  });
  return respuestas;
}

const VISITAS_ANIMALES_PRUEBA = {
  Nesquik: 14, Vainilla: 11, Tasmi: 9, Quesito: 7,
  'Matías y Vicente': 6, Gallo: 5, Catitas: 8, Agapornis: 4,
};

const VISITAS_ZONAS_PRUEBA = {
  gallinero: 18, conejera: 15, huerta: 10, pozo: 9, aviario: 7, almacen: 5,
};

function generarActividadPorDiaPrueba() {
  const valores = [6, 9, 7, 13, 10, 16, 12];
  const datos = {};
  const hoy = new Date();
  valores.forEach((valor, i) => {
    const fecha = new Date(hoy);
    fecha.setDate(hoy.getDate() - (valores.length - 1 - i));
    datos[fecha.toISOString().slice(0, 10)] = valor;
  });
  return datos;
}

const QUIZZES_EJEMPLO_ZONA = {
  conejera: [
    { pregunta: '¿Por qué los conejos necesitan roer heno constantemente?', opciones: ['Para divertirse', 'Porque sus dientes crecen toda la vida', 'Para dormir mejor', 'Porque les gusta el sabor'], correcta: 1, decimas: 0.5, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Cuántas crías puede tener una coneja por camada, aproximadamente?', opciones: ['1', '4 a 8', '20', '50'], correcta: 1, decimas: 0.3, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Qué tipo de alimentación tiene el conejo?', opciones: ['Carnívoro', 'Herbívoro estricto', 'Omnívoro', 'Filtrador'], correcta: 1, decimas: 0.4, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Cuánto dura aproximadamente la gestación de una coneja?', opciones: ['5 días', '28 a 31 días', '6 meses', '1 año'], correcta: 1, decimas: 0.4, profesor: 'Prof. Ana Reyes' },
    { pregunta: '¿Qué es la cecotrofia en los conejos?', opciones: ['Un tipo de hibernación', 'La reingestión de heces blandas ricas en nutrientes', 'Una enfermedad digestiva', 'El cambio de dientes'], correcta: 1, decimas: 0.5, profesor: 'Prof. Ana Reyes' },
  ],
  gallinero: [
    { pregunta: '¿Cuánto dura la incubación de un huevo de gallina?', opciones: ['7 días', '21 días', '40 días', '3 meses'], correcta: 1, decimas: 0.4, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿Qué come principalmente una gallina?', opciones: ['Solo carne', 'Granos, semillas e insectos', 'Solo pasto', 'Plástico'], correcta: 1, decimas: 0.3, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿Por qué las gallinas toman baños de tierra?', opciones: ['Para cuidar sus plumas y eliminar parásitos', 'Porque no les gusta el agua', 'Para cambiar de plumaje', 'Para no pasar frío'], correcta: 0, decimas: 0.4, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿Qué estructura ayuda a regular la temperatura del gallo?', opciones: ['Las patas', 'La cresta', 'Las alas', 'La cola'], correcta: 1, decimas: 0.3, profesor: 'Prof. Carlos Soto' },
    { pregunta: '¿A qué grupo taxonómico pertenece el gallo?', opciones: ['Mamíferos', 'Reptiles', 'Aves', 'Anfibios'], correcta: 2, decimas: 0.3, profesor: 'Prof. Carlos Soto' },
  ],
  aviario: [
    { pregunta: '¿De qué continente son originarios los agapornis?', opciones: ['América', 'África', 'Europa', 'Oceanía'], correcta: 1, decimas: 0.4, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Por qué se les llama "inseparables" a los agapornis?', opciones: ['Porque nunca vuelan', 'Porque forman parejas unidas de por vida', 'Porque son del mismo color', 'Porque no pueden verse'], correcta: 1, decimas: 0.4, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Qué comen principalmente las catitas en libertad?', opciones: ['Carne', 'Semillas de pastos', 'Peces', 'Plástico'], correcta: 1, decimas: 0.3, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Cómo son las bandadas de catitas en estado silvestre?', opciones: ['Siempre solitarias', 'Nómadas, pueden juntar miles de aves', 'Fijas en un mismo árbol', 'Solo se juntan de a dos'], correcta: 1, decimas: 0.4, profesor: 'Prof. Valentina Rojas' },
    { pregunta: '¿Cuánto dura aproximadamente la incubación de los huevos de catita?', opciones: ['2 días', '8 días', '18 días', '40 días'], correcta: 2, decimas: 0.5, profesor: 'Prof. Valentina Rojas' },
  ],
};

const COMENTARIOS_QUIZ_PRUEBA = [
  { correo: 'sofia@prueba.cl', zonaId: 'conejera', comentario: '¡Muy entretenido! No sabía que los conejos hacían eso con sus heces.', fecha: new Date().toISOString() },
  { correo: 'mateo@prueba.cl', zonaId: 'gallinero', comentario: 'Las preguntas estaban buenas, pero una era un poco difícil.', fecha: new Date().toISOString() },
  { correo: 'camila@prueba.cl', zonaId: 'aviario', comentario: 'Me encantaron las preguntas sobre los agapornis, aprendí harto.', fecha: new Date().toISOString() },
];

function sembrarDatosPrueba() {
  if (!localStorage.getItem('granjaSeedEstudiantes')) {
    const estudiantesActuales = obtenerEstudiantes();
    const correosActuales = new Set(estudiantesActuales.map((e) => e.correo.toLowerCase()));
    const nuevos = ESTUDIANTES_PRUEBA.filter((e) => !correosActuales.has(e.correo.toLowerCase()));
    guardarEstudiantes([...estudiantesActuales, ...nuevos]);

    localStorage.setItem('granjaRespuestasQuiz', JSON.stringify(generarRespuestasPrueba()));

    PATRON_RESPUESTAS_PRUEBA.forEach(([correo, , , correctas]) => {
      localStorage.setItem('granjaPuntaje_' + correo, String(correctas * 10));
      localStorage.setItem('granjaDecimas_' + correo, (correctas * 0.4).toFixed(1));
    });

    localStorage.setItem('granjaSeedEstudiantes', '1');
  }

  if (!localStorage.getItem('granjaSeedVisitas')) {
    localStorage.setItem('granjaVisitasAnimales', JSON.stringify(VISITAS_ANIMALES_PRUEBA));
    localStorage.setItem('granjaVisitasZonas', JSON.stringify(VISITAS_ZONAS_PRUEBA));
    localStorage.setItem('granjaActividadPorDia', JSON.stringify(generarActividadPorDiaPrueba()));
    localStorage.setItem('granjaSeedVisitas', '1');
  }

  if (!localStorage.getItem('granjaSeedQuizzes')) {
    const quizzesActuales = obtenerQuizzesZona();
    Object.entries(QUIZZES_EJEMPLO_ZONA).forEach(([zonaId, preguntas]) => {
      if (!quizzesActuales[zonaId]) quizzesActuales[zonaId] = [];
      quizzesActuales[zonaId] = [...quizzesActuales[zonaId], ...preguntas].slice(0, MAX_PREGUNTAS_POR_ZONA);
    });
    guardarQuizzesZona(quizzesActuales);
    localStorage.setItem('granjaSeedQuizzes', '1');
  }

  if (!localStorage.getItem('granjaSeedComentarios')) {
    localStorage.setItem('granjaComentariosQuiz', JSON.stringify(COMENTARIOS_QUIZ_PRUEBA));
    localStorage.setItem('granjaSeedComentarios', '1');
  }
}

function reiniciarDatos() {
  const confirmado = confirm('¿Borrar TODOS los datos (estudiantes, respuestas, visitas y puntajes)? Esta acción no se puede deshacer.');
  if (!confirmado) return;

  [
    'granjaEstudiantes', 'granjaSesion', 'granjaRespuestasQuiz', 'granjaVisitasAnimales',
    'granjaVisitasZonas', 'granjaActividadPorDia', 'granjaQuizzesZona', 'granjaComentariosQuiz',
    'granjaSeedEstudiantes', 'granjaSeedVisitas', 'granjaSeedQuizzes', 'granjaSeedComentarios',
  ].forEach((clave) => localStorage.removeItem(clave));

  Object.keys(localStorage)
    .filter((clave) => clave.startsWith('granjaPuntaje_') || clave.startsWith('granjaDecimas_'))
    .forEach((clave) => localStorage.removeItem(clave));

  renderizarEstadisticas();
}

function calcularEstadisticas() {
  const estudiantes = obtenerEstudiantes();
  let respuestas = [];
  try {
    respuestas = JSON.parse(localStorage.getItem('granjaRespuestasQuiz')) || [];
  } catch (error) {
    respuestas = [];
  }

  const totalRespuestas = respuestas.length;
  const totalCorrectas = respuestas.filter((r) => r.correcta).length;

  const agruparPor = (campo) => {
    const grupos = {};
    respuestas.forEach((r) => {
      const clave = r[campo] || 'Sin dato';
      if (!grupos[clave]) grupos[clave] = { total: 0, correctas: 0 };
      grupos[clave].total++;
      if (r.correcta) grupos[clave].correctas++;
    });
    return grupos;
  };

  return {
    totalEstudiantes: estudiantes.length,
    totalRespuestas,
    totalCorrectas,
    porcentajeGeneral: totalRespuestas ? Math.round((totalCorrectas / totalRespuestas) * 100) : 0,
    porCurso: agruparPor('curso'),
    porGenero: agruparPor('genero'),
    visitasAnimales: obtenerContador('granjaVisitasAnimales'),
    visitasZonas: obtenerContador('granjaVisitasZonas'),
    actividadPorDia: obtenerContador('granjaActividadPorDia'),
  };
}

function filaEstadistica(etiqueta, valor) {
  return `<div class="stat-row"><span class="stat-row-label">${etiqueta}</span><span class="stat-row-value">${valor}</span></div>`;
}

function tablaGrupo(grupos) {
  const entradas = Object.entries(grupos);
  if (entradas.length === 0) return '<p class="stat-empty">Aún no hay datos.</p>';

  return entradas
    .map(([clave, datos]) => {
      const porcentaje = datos.total ? Math.round((datos.correctas / datos.total) * 100) : 0;
      return filaEstadistica(clave, `${datos.correctas}/${datos.total} correctas (${porcentaje}%)`);
    })
    .join('');
}

function rankingVisitas(contador, nombresPorId) {
  const entradas = Object.entries(contador).sort((a, b) => b[1] - a[1]);
  if (entradas.length === 0) return '<p class="stat-empty">Aún no hay visitas registradas.</p>';

  return entradas
    .map(([id, veces]) => filaEstadistica(nombresPorId(id), `${veces} visita${veces === 1 ? '' : 's'}`))
    .join('');
}

function tablaEstudiantesPuntajes() {
  const estudiantes = obtenerEstudiantes();
  if (estudiantes.length === 0) return '<p class="stat-empty">Aún no hay estudiantes registrados.</p>';

  return estudiantes
    .map((e) => {
      const puntaje = obtenerPuntaje(e.correo);
      const decimas = obtenerDecimas(e.correo);
      return `
        <div class="quiz-item-row">
          <div class="quiz-item-text">
            <strong>${e.nombre}</strong><br>
            <span style="opacity:0.8;">${e.curso || 'Sin curso'} · ${e.genero || 'Sin dato'}</span>
          </div>
          <div class="stat-row-value">⭐ ${puntaje}<br>📐 ${decimas.toFixed(1)}</div>
        </div>
      `;
    })
    .join('');
}

function tablaComentariosQuiz() {
  let comentarios = [];
  try {
    comentarios = JSON.parse(localStorage.getItem('granjaComentariosQuiz')) || [];
  } catch (error) {
    comentarios = [];
  }

  if (comentarios.length === 0) return '<p class="stat-empty">Aún no hay comentarios de estudiantes.</p>';

  const estudiantes = obtenerEstudiantes();
  const nombrePorCorreo = (correo) => {
    const est = estudiantes.find((e) => e.correo === correo);
    return est ? est.nombre : correo;
  };

  return comentarios
    .slice()
    .reverse()
    .map((c) => {
      const titulo = RESPALDOS_ZONAS[c.zonaId] ? RESPALDOS_ZONAS[c.zonaId].titulo : (c.zonaId || 'Quiz');
      return `
        <div class="quiz-item-row">
          <div class="quiz-item-text">
            <strong>${nombrePorCorreo(c.correo)}</strong> · <span style="opacity:0.8;">${titulo}</span><br>
            "${c.comentario}"
          </div>
        </div>
      `;
    })
    .join('');
}

function construirGraficoLinea(datosPorDia) {
  const claves = Object.keys(datosPorDia).sort();
  if (claves.length === 0) return '<p class="stat-empty">Aún no hay actividad registrada.</p>';

  const valores = claves.map((k) => datosPorDia[k]);
  const maxValor = Math.max(...valores, 1);
  const ancho = 300;
  const alto = 110;
  const margenInferior = 22;
  const altoUtil = alto - margenInferior;
  const paso = claves.length > 1 ? ancho / (claves.length - 1) : 0;

  const coords = valores.map((v, i) => ({
    x: claves.length > 1 ? i * paso : ancho / 2,
    y: altoUtil - (v / maxValor) * (altoUtil - 10) - 5,
  }));

  const puntos = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const circulos = coords
    .map((c) => `<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="#ffd83d" />`)
    .join('');
  const etiquetas = claves
    .map((k, i) => {
      const fecha = new Date(k + 'T00:00:00');
      const texto = fecha.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' });
      return `<text x="${coords[i].x}" y="${alto - 4}" font-size="9" fill="#ffe9b0" text-anchor="middle">${texto}</text>`;
    })
    .join('');

  return `
    <svg viewBox="0 0 ${ancho} ${alto}" class="line-chart" preserveAspectRatio="xMidYMid meet">
      <polyline points="${puntos}" fill="none" stroke="#ffd83d" stroke-width="2.5" />
      ${circulos}
      ${etiquetas}
    </svg>
  `;
}

function renderizarEstadisticas() {
  const contenedor = document.getElementById('adminStats');
  if (!contenedor) return;

  const stats = calcularEstadisticas();

  const nombreZona = (id) => (RESPALDOS_ZONAS[id] ? RESPALDOS_ZONAS[id].titulo : id);
  const nombreAnimal = (id) => id;

  contenedor.innerHTML = `
    <div class="stat-card">
      <div class="stat-big-number">${stats.totalEstudiantes}</div>
      <div class="stat-big-label">Estudiantes registrados</div>
    </div>

    <div class="stat-card">
      <h3>✅ Respuestas del Quiz</h3>
      ${filaEstadistica('Total de respuestas', stats.totalRespuestas)}
      ${filaEstadistica('Correctas', `${stats.totalCorrectas} (${stats.porcentajeGeneral}%)`)}
    </div>

    <div class="stat-card">
      <h3>🎓 Por curso</h3>
      ${tablaGrupo(stats.porCurso)}
    </div>

    <div class="stat-card">
      <h3>🚻 Por género</h3>
      ${tablaGrupo(stats.porGenero)}
    </div>

    <div class="stat-card">
      <h3>🐾 Animales más visitados</h3>
      ${rankingVisitas(stats.visitasAnimales, nombreAnimal)}
    </div>

    <div class="stat-card">
      <h3>🗺️ Zonas más visitadas</h3>
      ${rankingVisitas(stats.visitasZonas, nombreZona)}
    </div>

    <div class="stat-card">
      <h3>📈 Visitas por día</h3>
      ${construirGraficoLinea(stats.actividadPorDia)}
    </div>

    <div class="stat-card">
      <h3>👥 Estudiantes y puntajes</h3>
      ${tablaEstudiantesPuntajes()}
    </div>

    <div class="stat-card">
      <h3>💬 Comentarios de estudiantes</h3>
      ${tablaComentariosQuiz()}
    </div>
  `;
}

const ZONAS_MAPA = [
  { nombre: 'huerta', x: 20, y: 16 },
  { nombre: 'pozo', x: 50, y: 8 },
  { nombre: 'almacen', x: 34, y: 8 },
  { nombre: 'conejera', x: 18, y: 45 },
  { nombre: 'gallinero', x: 82, y: 45 },
  { nombre: 'aviario', x: 77, y: 80 },
];

function crearHotspots() {
  const contenedor = document.getElementById('hotspots');
  if (!contenedor) return;

  ZONAS_MAPA.forEach((zona) => {
    const punto = document.createElement('button');
    punto.className = 'hotspot';
    punto.style.left = zona.x + '%';
    punto.style.top = zona.y + '%';
    punto.setAttribute('aria-label', zona.nombre);
    punto.addEventListener('click', () => mostrarInfoZona(zona.nombre));
    contenedor.appendChild(punto);
  });
}

function crearHotspotsQuiz() {
  const contenedor = document.getElementById('hotspotsQuiz');
  if (!contenedor) return;

  contenedor.innerHTML = '';
  if (modoActual !== 'estudiante') return;

  const quizzes = obtenerQuizzesZona();

  ZONAS_MAPA.forEach((zona) => {
    if (!quizzes[zona.nombre] || quizzes[zona.nombre].length === 0) return;

    const punto = document.createElement('button');
    punto.className = 'hotspot hotspot-quiz';
    punto.style.left = Math.min(94, zona.x + 7) + '%';
    punto.style.top = Math.max(5, zona.y - 6) + '%';
    punto.setAttribute('aria-label', 'Quiz: ' + zona.nombre);
    punto.addEventListener('click', () => iniciarQuizDeZona(zona.nombre));
    contenedor.appendChild(punto);
  });
}

async function cargarInfoZona(ruta, respaldo) {
  try {
    const respuesta = await fetch(ruta);
    if (!respuesta.ok) throw new Error('No se pudo cargar ' + ruta);
    const texto = await respuesta.text();
    const lineas = texto.split('\n').map((linea) => linea.trim()).filter((linea) => linea.length > 0);
    if (lineas.length === 0) return respaldo;
    return { titulo: lineas[0], cuerpo: lineas.slice(1).join(' ') };
  } catch (error) {
    console.warn(`No se pudo cargar "${ruta}", uso texto de respaldo.`, error);
    return respaldo;
  }
}

const RESPALDOS_ZONAS = {
  huerta: { titulo: 'Huerto Escolar', cuerpo: 'El huerto vegetal del liceo. Parte de la cosecha complementa la dieta de los animales.' },
  pozo: { titulo: 'Pozo de Agua Limpia', cuerpo: 'Fuente principal de agua de la granja, indispensable para la salud de los animales.' },
  almacen: { titulo: 'Almacén de Granja', cuerpo: 'Aquí se guardan alimentos y herramientas del liceo, siempre secos y ordenados.' },
  conejera: { titulo: 'Conejeras', cuerpo: 'Aquí viven Nesquik, Vainilla, Tasmi y Quesito, los conejos del liceo.' },
  gallinero: { titulo: 'Gallinero y Jaula del Gallo', cuerpo: 'Aquí viven las gallinas —incluyendo a Matías y Vicente— y el gallo de la granja.' },
  aviario: { titulo: 'Arboleda de Nidos', cuerpo: 'Aquí viven las catitas y los agapornis, las aves pequeñas y coloridas de la granja.' },
};

const IMAGENES_ZONAS = {
  huerta: 'img/zonas/real/huerto_bancales.jpg',
  pozo: 'img/zonas/real/pozo_real.jpg',
  conejera: 'img/zonas/real/conejo_pasto_real.jpg',
  gallinero: 'img/zonas/real/gallo_jaula_real.png',
  aviario: 'img/zonas/animales/catitas.png',
};

function obtenerContador(clave) {
  try {
    return JSON.parse(localStorage.getItem(clave)) || {};
  } catch (error) {
    return {};
  }
}

function incrementarContador(clave, campo) {
  const datos = obtenerContador(clave);
  datos[campo] = (datos[campo] || 0) + 1;
  localStorage.setItem(clave, JSON.stringify(datos));
}

function fechaDeHoy() {
  return new Date().toISOString().slice(0, 10);
}

function registrarActividadDelDia() {
  incrementarContador('granjaActividadPorDia', fechaDeHoy());
}

function registrarVisitaZona(nombre) {
  incrementarContador('granjaVisitasZonas', nombre);
  registrarActividadDelDia();
}

function registrarVisitaAnimal(nombre) {
  incrementarContador('granjaVisitasAnimales', nombre);
  registrarActividadDelDia();
}

function registrarRespuestaQuiz(correcta) {
  const sesion = obtenerSesion();
  if (!sesion) return;

  let registros = [];
  try {
    registros = JSON.parse(localStorage.getItem('granjaRespuestasQuiz')) || [];
  } catch (error) {
    registros = [];
  }

  registros.push({
    correo: sesion.correo,
    curso: sesion.curso || 'Sin curso',
    genero: sesion.genero || 'Sin dato',
    correcta: !!correcta,
    fecha: new Date().toISOString(),
  });

  localStorage.setItem('granjaRespuestasQuiz', JSON.stringify(registros));
  registrarActividadDelDia();
}

async function mostrarInfoZona(nombre) {
  registrarVisitaZona(nombre);

  const modal = document.getElementById('infoModal');
  const titulo = document.getElementById('infoTitle');
  const cuerpo = document.getElementById('infoBody');
  const imagenWrap = document.getElementById('infoImageWrap');
  const imagen = document.getElementById('infoImage');
  if (!modal || !titulo || !cuerpo) return;

  const respaldo = RESPALDOS_ZONAS[nombre] || { titulo: nombre, cuerpo: '' };
  const info = await cargarInfoZona(`data/zonas/${nombre}.txt`, respaldo);

  titulo.textContent = info.titulo;
  cuerpo.textContent = info.cuerpo;

  const rutaImagen = IMAGENES_ZONAS[nombre];
  if (imagenWrap && imagen) {
    if (rutaImagen) {
      imagen.src = rutaImagen;
      imagen.alt = info.titulo;
      imagenWrap.hidden = false;
    } else {
      imagenWrap.hidden = true;
    }
  }

  modal.hidden = false;
}

function cerrarInfoZona() {
  document.getElementById('infoModal').hidden = true;
}

const GALERIA_GRANJA = [
  { foto: 'img/zonas/real/huerto_bancales.jpg', texto: 'Bancales del huerto escolar, donde crecen las verduras del liceo.' },
  { foto: 'img/zonas/real/invernadero_bancas.jpg', texto: 'Invernadero con bancas para el trabajo en el huerto.' },
  { foto: 'img/zonas/real/mesa_cultivo_flores.jpg', texto: 'Mesa de cultivo con flores del huerto escolar.' },
  { foto: 'img/zonas/real/tomates_maceta.jpg', texto: 'Tomates creciendo en maceta dentro del huerto.' },
  { foto: 'img/zonas/real/estanque_rocalla.jpg', texto: 'Estanque con rocalla decorativa de la granja.' },
  { foto: 'img/zonas/real/pozo_real.jpg', texto: 'El pozo de agua real de la granja del liceo.' },
  { foto: 'img/zonas/real/canasto_huevos_taller.jpg', texto: 'Canasto con huevos recolectados en el taller de la granja.' },
  { foto: 'img/zonas/real/nido_huevos_1.jpg', texto: 'Nido con huevos recién puestos por las gallinas.' },
  { foto: 'img/zonas/real/aviario_real.jpg', texto: 'Vista real del aviario del liceo.' },
];

const MASCOTAS = [
  { foto: 'img/zonas/animales/nesquik.png', nombre: 'Nesquik', especie: 'conejo', texto: 'Edad: 3 años. Carácter: introvertido e impredecible. Pelaje café con manchas oscuras, largo y esponjoso.' },
  { foto: 'img/zonas/animales/vainilla.png', nombre: 'Vainilla', especie: 'conejo', texto: 'Edad: 5 años. Carácter: enamoradizo y tierno. Pelaje blanco con manchas café claro, pelo corto.' },
  { foto: 'img/zonas/animales/tasmi.png', nombre: 'Tasmi', especie: 'conejo', texto: 'Edad: 2 años. Carácter: revoltoso y destructor. Pelaje blanco con manchas café claro en las orejitas.' },
  { foto: 'img/zonas/animales/quesito.png', nombre: 'Quesito', especie: 'conejo', texto: 'Edad: 1 año. Carácter: metiche y amistoso. Pelaje blanco, largo y esponjoso, ojitos azules.' },
  { foto: 'img/zonas/animales/matias_vicente.png', nombre: 'Matías y Vicente', especie: 'gallo', texto: 'Dos gallitos japoneses muy amorosos, de plumaje blanco sedoso y carácter sociable.' },
  { foto: 'img/zonas/animales/rooster.png', nombre: 'Gallo', especie: 'gallo', texto: 'El único gallo de la granja: plumaje anaranjado y verde oscuro, con una gran cresta roja.' },
  { foto: 'img/zonas/animales/catitas.png', nombre: 'Catitas', especie: 'catita', texto: 'Pareja de periquitos: uno de tono verde y amarillo, el otro celeste.' },
  { foto: 'img/zonas/animales/agapornis.png', nombre: 'Agapornis', especie: 'agapornis', texto: 'Trío de agapornis de distintos colores: cabeza anaranjada, celeste y verde con anaranjado.' },
];

const BIOLOGIA_ESPECIES = {
  conejo: {
    nombre: 'Conejo', lat: 'Oryctolagus cuniculus',
    imagen: 'img/zonas/anatomia/conejo.jpg',
    clasificacion: 'Mamífero lagomorfo (no roedor), familia Leporidae.',
    habitat: 'Excava madrigueras en el suelo; en estado silvestre habita praderas y campos abiertos.',
    alimentacion: 'Herbívoro estricto: pastos, heno y fibra vegetal.',
    agua: 'Necesita agua limpia disponible siempre; puede beber entre 50 y 150 ml por kilo de peso al día.',
    comportamiento: 'Animal social que vive en grupos; más activo al amanecer y al atardecer (hábito crepuscular).',
    reproduccion: 'La gestación dura entre 28 y 31 días. Las crías nacen sin pelo, ciegas y dependientes de la madre.',
    cuidados: 'Necesita heno siempre disponible para desgastar sus dientes, espacio amplio y evitar ruidos fuertes.',
    dato: 'Practica cecotrofia: reingiere heces blandas ricas en nutrientes para obtener una segunda digestión.',
  },
  gallo: {
    nombre: 'Gallo y gallina', lat: 'Gallus gallus domesticus',
    imagen: 'img/zonas/anatomia/gallina.jpg',
    clasificacion: 'Ave, familia Phasianidae, domesticada a partir del gallo bankiva del sudeste asiático.',
    habitat: 'Vive en corrales o gallineros con acceso a un espacio abierto para escarbar.',
    alimentacion: 'Omnívoro: granos, semillas, vegetales frescos e insectos.',
    agua: 'Necesita agua limpia todo el día; un ave adulta bebe entre 200 y 400 ml diarios.',
    comportamiento: 'Vive en grupos con una jerarquía social ("orden de picoteo"); es diurno y escarba el suelo buscando comida.',
    reproduccion: 'La gallina puede poner un huevo casi a diario; la incubación de huevos fecundados dura unos 21 días.',
    cuidados: 'Necesita un gallinero limpio, seco, ventilado y protegido de depredadores, con espacio para moverse.',
    dato: 'Los gallos siguen cantando justo antes del amanecer incluso en oscuridad constante: responden a un reloj biológico interno, no solo a la luz.',
  },
  catita: {
    nombre: 'Catita', lat: 'Melopsittacus undulatus',
    imagen: 'img/zonas/anatomia/ave-general.jpg',
    clasificacion: 'Ave, orden Psittaciformes (loros). Periquito pequeño originario de Australia.',
    habitat: 'En estado silvestre habita el interior árido de Australia, anidando en huecos de árboles.',
    alimentacion: 'Principalmente granívora: semillas de pastos, complementadas con frutas y verduras.',
    agua: 'Necesita agua limpia a diario; puede tomar hasta un 5% de su peso corporal en agua al día.',
    comportamiento: 'Muy social y gregaria: en libertad forma bandadas nómadas que pueden juntar miles de aves.',
    reproduccion: 'Es monógama. La hembra incuba entre 4 y 6 huevos durante unos 18 días.',
    cuidados: 'Necesita jaula amplia para volar, compañía y una dieta variada, no solo semillas.',
    dato: 'Su nombre científico significa algo así como "periquito melodioso de alas onduladas".',
  },
  agapornis: {
    nombre: 'Agapornis', lat: 'Agapornis roseicollis',
    imagen: 'img/zonas/anatomia/ave-general.jpg',
    clasificacion: 'Ave, orden Psittaciformes, género Agapornis, originario del sur de África.',
    habitat: 'En estado silvestre habita bosques abiertos y matorrales áridos del sur de África.',
    alimentacion: 'Granívora y frugívora: semillas, frutas y verduras. Solo semillas es una dieta pobre en nutrientes.',
    agua: 'Necesita agua limpia a diario; le gusta bañarse con frecuencia.',
    comportamiento: 'Muy social; forma parejas monógamas para toda la vida que pasan el día acicalándose juntas.',
    reproduccion: 'La hembra incuba entre 4 y 6 huevos durante 18 a 24 días.',
    cuidados: 'Vive mejor en pareja o grupo, con jaula amplia, juguetes y dieta variada.',
    dato: 'Se les llama "inseparables" porque las parejas se mantienen unidas de por vida, incluso para dormir.',
  },
};

function crearGaleria(tipo) {
  const contenedor = document.getElementById('galleryScroll');
  const titulo = document.getElementById('galleryTitle');
  if (!contenedor || !titulo) return;

  contenedor.innerHTML = '';
  const esMascotas = tipo === 'mascotas';
  titulo.textContent = esMascotas ? '🐾 Las Mascotitas' : '🌾 Más Granjita';
  const datos = esMascotas ? MASCOTAS : GALERIA_GRANJA;

  datos.forEach((item) => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'gallery-item';

    const fotoWrap = document.createElement('div');
    fotoWrap.className = 'gallery-photo-wrap';
    fotoWrap.innerHTML = `<img class="gallery-photo" src="${item.foto}" alt="${item.nombre || ''}"><span class="info-image-zoom">🔍</span>`;
    fotoWrap.addEventListener('click', () => {
      if (esMascotas && item.nombre) registrarVisitaAnimal(item.nombre);
      abrirLightbox(item.foto, item.nombre || '');
    });
    tarjeta.appendChild(fotoWrap);

    if (item.nombre) {
      const nombre = document.createElement('p');
      nombre.className = 'gallery-name';
      nombre.textContent = item.nombre;
      tarjeta.appendChild(nombre);
    }

    const caption = document.createElement('p');
    caption.className = 'gallery-caption';
    caption.textContent = item.texto;
    tarjeta.appendChild(caption);

    if (esMascotas && modoActual === 'estudiante' && BIOLOGIA_ESPECIES[item.especie]) {
      const aprender = document.createElement('button');
      aprender.className = 'gallery-learn-btn';
      aprender.textContent = '🔬 Aprender';
      aprender.addEventListener('click', () => abrirBiologia(item.especie));
      tarjeta.appendChild(aprender);
    }

    contenedor.appendChild(tarjeta);
  });
}

function abrirGaleria(tipo) {
  crearGaleria(tipo);
  document.getElementById('galleryModal').hidden = false;
}

function cerrarGaleria() {
  document.getElementById('galleryModal').hidden = true;
}

function abrirBiologia(especie) {
  const datos = BIOLOGIA_ESPECIES[especie];
  const modal = document.getElementById('bioModal');
  const titulo = document.getElementById('bioTitle');
  const cuerpo = document.getElementById('bioBody');
  const imagenWrap = document.getElementById('bioImageWrap');
  const imagen = document.getElementById('bioImage');
  if (!datos || !modal || !titulo || !cuerpo) return;

  titulo.textContent = `${datos.nombre} (${datos.lat})`;

  if (imagenWrap && imagen) {
    if (datos.imagen) {
      imagen.src = datos.imagen;
      imagen.alt = `Anatomía de ${datos.nombre}`;
      imagenWrap.hidden = false;
    } else {
      imagenWrap.hidden = true;
    }
  }

  const secciones = [
    ['🔬 Clasificación', datos.clasificacion],
    ['🏡 Hábitat', datos.habitat],
    ['🍽️ Alimentación', datos.alimentacion],
    ['💧 Agua', datos.agua],
    ['🐾 Comportamiento', datos.comportamiento],
    ['🥚 Reproducción', datos.reproduccion],
    ['🛡️ Cuidados', datos.cuidados],
    ['💡 Dato curioso', datos.dato],
  ];

  cuerpo.innerHTML = secciones
    .map(([etiqueta, texto]) => `<div class="bio-section"><strong>${etiqueta}</strong><p>${texto}</p></div>`)
    .join('');

  modal.hidden = false;
}

function cerrarBiologia() {
  document.getElementById('bioModal').hidden = true;
}

const lightboxState = { scale: 1, x: 0, y: 0, lastTap: 0 };
let pinchInicial = null;
let panInicial = null;

function aplicarTransformLightbox() {
  const img = document.getElementById('lightboxImg');
  img.style.transform = `translate(${lightboxState.x}px, ${lightboxState.y}px) scale(${lightboxState.scale})`;
}

function alternarZoomLightbox() {
  lightboxState.scale = lightboxState.scale > 1 ? 1 : 2.5;
  lightboxState.x = 0;
  lightboxState.y = 0;
  aplicarTransformLightbox();
}

function abrirLightbox(src, alt) {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;

  img.src = src;
  img.alt = alt || '';
  lightboxState.scale = 1;
  lightboxState.x = 0;
  lightboxState.y = 0;
  aplicarTransformLightbox();
  lb.hidden = false;
}

function cerrarLightbox() {
  document.getElementById('lightbox').hidden = true;
}

function distanciaEntreToques(t1, t2) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
}

function configurarLightbox() {
  const viewport = document.getElementById('lightboxViewport');
  if (!viewport) return;

  viewport.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
      pinchInicial = { dist: distanciaEntreToques(e.touches[0], e.touches[1]), scale: lightboxState.scale };
    } else if (e.touches.length === 1) {
      const ahora = Date.now();
      if (ahora - lightboxState.lastTap < 300) {
        alternarZoomLightbox();
      }
      lightboxState.lastTap = ahora;
      panInicial = { x: e.touches[0].clientX - lightboxState.x, y: e.touches[0].clientY - lightboxState.y };
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2 && pinchInicial) {
      const distActual = distanciaEntreToques(e.touches[0], e.touches[1]);
      lightboxState.scale = Math.min(4, Math.max(1, pinchInicial.scale * (distActual / pinchInicial.dist)));
      aplicarTransformLightbox();
    } else if (e.touches.length === 1 && panInicial && lightboxState.scale > 1) {
      lightboxState.x = e.touches[0].clientX - panInicial.x;
      lightboxState.y = e.touches[0].clientY - panInicial.y;
      aplicarTransformLightbox();
    }
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    pinchInicial = null;
    panInicial = null;
  });

  viewport.addEventListener('dblclick', alternarZoomLightbox);
}

function obtenerPuntaje(correo) {
  const valor = localStorage.getItem('granjaPuntaje_' + correo);
  return valor ? parseInt(valor, 10) : 0;
}

function sumarPuntaje(correo, puntos) {
  const total = obtenerPuntaje(correo) + puntos;
  localStorage.setItem('granjaPuntaje_' + correo, String(total));
  return total;
}

function obtenerDecimas(correo) {
  const valor = localStorage.getItem('granjaDecimas_' + correo);
  return valor ? parseFloat(valor) : 0;
}

function sumarDecimas(correo, cantidad) {
  const total = Math.round((obtenerDecimas(correo) + cantidad) * 10) / 10;
  localStorage.setItem('granjaDecimas_' + correo, String(total));
  return total;
}

function actualizarPuntajeMostrado() {
  const sesion = obtenerSesion();
  const valorEl = document.getElementById('scoreValue');
  if (!sesion || !valorEl) return;
  valorEl.textContent = obtenerPuntaje(sesion.correo);
}

const quizEnCurso = { zonaId: null, preguntas: [], indice: 0, correctas: 0 };

function totalDecimasDelQuiz(preguntas) {
  return preguntas.reduce((acc, p) => acc + (p.decimas || 0), 0);
}

function iniciarQuizDeZona(zonaId) {
  const quizzes = obtenerQuizzesZona();
  const preguntas = quizzes[zonaId] || [];
  if (preguntas.length === 0) return;

  quizEnCurso.zonaId = zonaId;
  quizEnCurso.preguntas = preguntas;
  quizEnCurso.indice = 0;
  quizEnCurso.correctas = 0;

  document.getElementById('quizFinalWrap').hidden = true;
  document.getElementById('quizPreguntaWrap').hidden = false;
  document.getElementById('quizModal').hidden = false;

  mostrarPreguntaActualDelQuiz();
}

function mostrarPreguntaActualDelQuiz() {
  const { preguntas, indice } = quizEnCurso;
  const pregunta = preguntas[indice];
  if (!pregunta) return;

  const metaEl = document.getElementById('quizMeta');
  const progresoEl = document.getElementById('quizProgreso');
  const preguntaEl = document.getElementById('quizQuestion');
  const opcionesEl = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');
  const siguienteBtn = document.getElementById('quizSiguienteBtn');

  const totalDecimas = totalDecimasDelQuiz(preguntas);
  metaEl.textContent = `👤 ${pregunta.profesor || 'Profesor/a'} · Responde bien todas y gana +${totalDecimas.toFixed(1)} décimas`;
  progresoEl.textContent = `Pregunta ${indice + 1} de ${preguntas.length}`;

  preguntaEl.textContent = pregunta.pregunta;
  feedbackEl.hidden = true;
  feedbackEl.textContent = '';
  siguienteBtn.hidden = true;
  opcionesEl.innerHTML = '';

  pregunta.opciones.forEach((opcion, i) => {
    const boton = document.createElement('button');
    boton.className = 'quiz-option';
    boton.textContent = opcion;
    boton.addEventListener('click', () => responderQuizActual(i, boton, opcionesEl, feedbackEl, siguienteBtn));
    opcionesEl.appendChild(boton);
  });
}

function responderQuizActual(indiceElegido, botonElegido, opcionesEl, feedbackEl, siguienteBtn) {
  const pregunta = quizEnCurso.preguntas[quizEnCurso.indice];
  const botones = opcionesEl.querySelectorAll('.quiz-option');
  botones.forEach((b, i) => {
    b.disabled = true;
    if (i === pregunta.correcta) b.classList.add('correcta');
  });

  const esCorrecta = indiceElegido === pregunta.correcta;
  if (!esCorrecta) botonElegido.classList.add('incorrecta');

  registrarRespuestaQuiz(esCorrecta);

  const sesion = obtenerSesion();
  let total = 0;
  if (sesion) {
    total = sumarPuntaje(sesion.correo, esCorrecta ? 10 : 0);
    actualizarPuntajeMostrado();
  }

  if (esCorrecta) {
    quizEnCurso.correctas++;
  }

  feedbackEl.textContent = esCorrecta
    ? `¡Correcto! +10 puntos (total: ${total})`
    : `Incorrecto. Puntaje total: ${total}`;
  feedbackEl.hidden = false;

  const esUltima = quizEnCurso.indice >= quizEnCurso.preguntas.length - 1;
  siguienteBtn.textContent = esUltima ? 'Ver resultado ➤' : 'Siguiente ➤';
  siguienteBtn.hidden = false;
}

function avanzarQuizSiguiente() {
  quizEnCurso.indice++;
  if (quizEnCurso.indice < quizEnCurso.preguntas.length) {
    mostrarPreguntaActualDelQuiz();
  } else {
    finalizarQuiz();
  }
}

function finalizarQuiz() {
  const { preguntas, correctas } = quizEnCurso;
  const total = preguntas.length;
  const esPerfecto = correctas === total;

  document.getElementById('quizPreguntaWrap').hidden = true;
  document.getElementById('quizFinalWrap').hidden = false;

  const resultadoEl = document.getElementById('quizResultado');
  const sesion = obtenerSesion();

  if (esPerfecto) {
    const decimasGanadas = totalDecimasDelQuiz(preguntas);
    const totalDecimas = sesion ? sumarDecimas(sesion.correo, decimasGanadas) : decimasGanadas;
    resultadoEl.textContent = `¡Perfecto! ${correctas}/${total} correctas. Ganaste +${decimasGanadas.toFixed(1)} décimas (total: ${totalDecimas.toFixed(1)}).`;
  } else {
    resultadoEl.textContent = `Obtuviste ${correctas}/${total} correctas. ¡Sigue practicando para ganar las décimas!`;
  }

  document.getElementById('quizComentario').value = '';
}

function guardarComentarioQuiz(comentario) {
  if (!comentario) return;
  const sesion = obtenerSesion();

  let comentarios = [];
  try {
    comentarios = JSON.parse(localStorage.getItem('granjaComentariosQuiz')) || [];
  } catch (error) {
    comentarios = [];
  }

  comentarios.push({
    correo: sesion ? sesion.correo : 'anonimo',
    zonaId: quizEnCurso.zonaId,
    comentario,
    fecha: new Date().toISOString(),
  });

  localStorage.setItem('granjaComentariosQuiz', JSON.stringify(comentarios));
}

function manejarEnviarComentarioQuiz() {
  guardarComentarioQuiz(document.getElementById('quizComentario').value.trim());
  cerrarQuiz();
}

function cerrarQuiz() {
  document.getElementById('quizModal').hidden = true;
}

document.addEventListener('DOMContentLoaded', () => {
  ajustarAltoViewport();
  setTimeout(ajustarAltoViewport, 300);

  sembrarDatosPrueba();
  crearHotspots();

  document.getElementById('enterBtn').addEventListener('click', () => {
    cambiarPantalla(document.getElementById('startScreen'), document.getElementById('modeScreen'));
  });

  document.getElementById('modeVisitaBtn').addEventListener('click', irAModoVisita);
  document.getElementById('modeEstudianteBtn').addEventListener('click', irAAuthEstudiante);
  document.getElementById('modeBackBtn').addEventListener('click', () => volverAlInicio('startScreen'));
  document.getElementById('mapBackBtn').addEventListener('click', () => volverAlInicio());
  document.getElementById('authBackBtn').addEventListener('click', volverAModo);
  document.getElementById('showRegisterBtn').addEventListener('click', mostrarFormularioRegistro);
  document.getElementById('showLoginBtn').addEventListener('click', mostrarFormularioLogin);
  document.getElementById('loginForm').addEventListener('submit', manejarLogin);
  document.getElementById('registerForm').addEventListener('submit', manejarRegistro);

  document.getElementById('startAdminBtn').addEventListener('click', abrirPinAdmin);
  document.getElementById('modeAdminBtn').addEventListener('click', abrirPinAdmin);
  document.getElementById('adminPinClose').addEventListener('click', cerrarPinAdmin);
  document.getElementById('adminPinModal').addEventListener('click', (e) => {
    if (e.target.id === 'adminPinModal') cerrarPinAdmin();
  });
  document.getElementById('adminForm').addEventListener('submit', manejarAdminLogin);
  document.getElementById('adminBackBtn').addEventListener('click', () => volverAlInicio());
  document.getElementById('resetDatosBtn').addEventListener('click', reiniciarDatos);

  document.getElementById('startProfesorBtn').addEventListener('click', abrirLoginProfesor);
  document.getElementById('modeProfesorBtn').addEventListener('click', abrirLoginProfesor);
  document.getElementById('profesorLoginClose').addEventListener('click', cerrarLoginProfesor);
  document.getElementById('profesorLoginModal').addEventListener('click', (e) => {
    if (e.target.id === 'profesorLoginModal') cerrarLoginProfesor();
  });
  document.getElementById('profesorLoginForm').addEventListener('submit', manejarLoginProfesor);
  document.getElementById('profesorBackBtn').addEventListener('click', () => volverAlInicio());
  document.getElementById('quizEditorForm').addEventListener('submit', manejarCrearQuiz);

  document.getElementById('infoClose').addEventListener('click', cerrarInfoZona);
  document.getElementById('infoModal').addEventListener('click', (e) => {
    if (e.target.id === 'infoModal') cerrarInfoZona();
  });

  document.getElementById('infoImageWrap').addEventListener('click', () => {
    const img = document.getElementById('infoImage');
    abrirLightbox(img.src, img.alt);
  });

  document.getElementById('bioImageWrap').addEventListener('click', () => {
    const img = document.getElementById('bioImage');
    abrirLightbox(img.src, img.alt);
  });

  configurarLightbox();
  document.getElementById('lightboxClose').addEventListener('click', cerrarLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') cerrarLightbox();
  });

  document.getElementById('quizFab').addEventListener('click', () => iniciarQuizDeZona('aviario'));
  document.getElementById('quizClose').addEventListener('click', cerrarQuiz);
  document.getElementById('quizModal').addEventListener('click', (e) => {
    if (e.target.id === 'quizModal') cerrarQuiz();
  });
  document.getElementById('quizSiguienteBtn').addEventListener('click', avanzarQuizSiguiente);
  document.getElementById('quizEnviarComentario').addEventListener('click', manejarEnviarComentarioQuiz);

  document.getElementById('galeriaGranjaBtn').addEventListener('click', () => abrirGaleria('granja'));
  document.getElementById('galeriaMascotasBtn').addEventListener('click', () => abrirGaleria('mascotas'));
  document.getElementById('galleryClose').addEventListener('click', cerrarGaleria);
  document.getElementById('galleryModal').addEventListener('click', (e) => {
    if (e.target.id === 'galleryModal') cerrarGaleria();
  });

  document.getElementById('bioClose').addEventListener('click', cerrarBiologia);
  document.getElementById('bioModal').addEventListener('click', (e) => {
    if (e.target.id === 'bioModal') cerrarBiologia();
  });
});
