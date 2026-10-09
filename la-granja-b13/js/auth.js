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
    // Inicializar listas en localStorage sólo si es la primera vez (null)
    if (localStorage.getItem(CLAVE_ESTUDIANTES) === null) {
      localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify([CUENTA_DEMO_ESTUDIANTE]));
    }
    if (localStorage.getItem(CLAVE_QUIZZES_ZONA) === null) {
      localStorage.setItem(CLAVE_QUIZZES_ZONA, JSON.stringify(QUIZZES_INICIALES));
    }

    // Sincronizar bidireccionalmente los estudiantes registrados en el servidor backend
    if (typeof fetch === 'function') {
      fetch('/api/students')
        .then(res => res.json())
        .then(data => {
          if (data && data.success && Array.isArray(data.students)) {
            const locales = Auth.getEstudiantes();
            let huboCambios = false;
            data.students.forEach(s => {
              if (!s || !s.studentName) return;
              const existe = locales.some(l => l.nombre.toLowerCase() === s.studentName.toLowerCase() || (s.correo && l.correo && l.correo.toLowerCase() === s.correo.toLowerCase()));
              if (!existe) {
                locales.push({
                  nombre: s.studentName,
                  curso: s.studentGrade || '',
                  genero: s.genero || 'No especificado',
                  correo: s.correo || `${s.studentName.toLowerCase().replace(/\s+/g, '.')}@granja.cl`,
                  clave: '123456', // clave placeholder para cuentas remotas sincronizadas
                  fechaRegistro: s.updatedAt || new Date().toISOString()
                });
                huboCambios = true;
              }
            });
            if (huboCambios) {
              Auth.guardarEstudiantes(locales);
            }
          }
        })
        .catch(() => {});
    }

    // Sincronizar estado global con la sesión activa
    const sesion = Auth.getSesion();
    if (typeof state !== 'undefined') {
      if (sesion && sesion.rol === 'estudiante' && sesion.nombre) {
        if (typeof setActiveStudent === 'function') {
          setActiveStudent(sesion.nombre, sesion.curso || '');
        } else {
          state.studentName = sesion.nombre || '';
          state.studentGrade = sesion.curso || '';
        }
      } else {
        state.studentName = '';
        state.studentGrade = '';
      }
    }

    Auth.aplicarRestriccionesRol();
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
    try {
      localStorage.setItem('granjaSesionActiva', 'true');
      localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
      if (typeof state !== 'undefined') {
        if (sesion && sesion.rol === 'estudiante') {
          if (typeof setActiveStudent === 'function' && sesion.nombre) {
            setActiveStudent(sesion.nombre, sesion.curso || '');
          } else {
            state.studentName = sesion.nombre || '';
            state.studentGrade = sesion.curso || '';
          }
          if (typeof sesion.nameChangesCount === 'number' && typeof state !== 'undefined') {
            state.nameChangesCount = sesion.nameChangesCount;
          }
          if (typeof discoveredSet !== 'undefined' && Array.isArray(state.discovered)) {
            discoveredSet.clear();
            state.discovered.forEach(id => discoveredSet.add(id));
          }
          if (typeof mapDiscoveredSet !== 'undefined' && Array.isArray(state.mapDiscovered)) {
            mapDiscoveredSet.clear();
            state.mapDiscovered.forEach(id => mapDiscoveredSet.add(id));
          }
        } else {
          state.studentName = '';
          state.studentGrade = '';
        }
        if (typeof saveState === 'function') saveState();
      }
      Auth.aplicarRestriccionesRol();
      if (typeof updateHeader === 'function') updateHeader();
      if (typeof updateStudentUI === 'function') updateStudentUI();
      if (typeof window.refreshRankingWidget === 'function') window.refreshRankingWidget();
    } catch (e) {
      console.error('Error al guardar sesión:', e);
    }
  },

  cerrarSesion() {
    localStorage.removeItem('granjaSesionActiva');
    Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
    Auth.mostrarNotificacion('Has cerrado sesión.');
    Auth.actualizarPildora();
    const loginTarget = window.location.protocol === 'file:' ? 'login.html' : '/login';
    setTimeout(() => {
      window.location.href = loginTarget;
    }, 200);
  },

  salir() {
    localStorage.removeItem('granjaSesionActiva');
    Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
    const loginTarget = window.location.protocol === 'file:' ? 'login.html' : '/login';
    window.location.href = loginTarget;
  },

  entrarVisita() {
    Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
    Auth.cerrarModales();
    Auth.mostrarNotificacion('¡Bienvenido en Modo Visitas! Puedes explorar libremente.');
  },

  getEstudiantes() {
    try {
      const raw = localStorage.getItem(CLAVE_ESTUDIANTES);
      if (raw !== null) {
        return JSON.parse(raw) || [];
      }
      return [CUENTA_DEMO_ESTUDIANTE];
    } catch (e) {
      return [];
    }
  },

  guardarEstudiantes(lista) {
    localStorage.setItem(CLAVE_ESTUDIANTES, JSON.stringify(lista));
  },

  registroEstudiante(nombre, curso, genero, correo, clave) {
    nombre = (nombre || '').trim();
    if (!nombre) {
      return { ok: false, error: 'Por favor ingresa tu nombre completo.' };
    }
    if (/\d/.test(nombre)) {
      return { ok: false, error: 'El nombre completo no puede contener números. Por favor escribe tu nombre y apellido reales.' };
    }
    if (nombre.length < 3) {
      return { ok: false, error: 'El nombre debe tener al menos 3 caracteres.' };
    }
    if (!curso) {
      return { ok: false, error: 'Por favor selecciona tu curso o nivel.' };
    }
    if (!correo || !correo.includes('@')) {
      return { ok: false, error: 'Por favor ingresa un correo electrónico válido.' };
    }
    if (!clave || clave.length < 6) {
      return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    }

    const estudiantes = Auth.getEstudiantes();
    const existe = estudiantes.some(e => e.correo.toLowerCase() === correo.toLowerCase())
      || correo.toLowerCase() === CUENTA_DEMO_ESTUDIANTE.correo;

    if (existe) {
      return { ok: false, error: 'Este correo electrónico ya está registrado en la base de datos escolar.' };
    }

    const nuevo = { nombre, curso, genero, correo, clave, nameChangesCount: 0, fechaRegistro: new Date().toISOString() };
    estudiantes.push(nuevo);
    Auth.guardarEstudiantes(estudiantes);

    // Asegurar inicialización inmediata del perfil en el cuaderno de campo
    if (typeof setActiveStudent === 'function') {
      try {
        setActiveStudent(nombre, curso);
      } catch (e) {}
    }

    // Persistir de forma robusta e inmediata en la base de datos del servidor backend
    if (typeof fetch === 'function') {
      fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, curso, genero, correo, clave, avatar: '🧑‍🌾' })
      }).then(r => r.json()).then(data => {
        if (data && data.success) {
          console.log('✅ Estudiante persistido en el servidor:', nombre);
        }
      }).catch(err => {
        console.warn('Servidor no disponible para registro inmediato, guardado en almacenamiento local:', err);
      });
    }

    // Iniciar sesión automáticamente
    Auth.setSesion({ rol: 'estudiante', nombre, correo, curso, genero, nameChangesCount: 0 });
    return { ok: true, usuario: nuevo };
  },

  async loginEstudianteAsync(correo, clave) {
    correo = (correo || '').trim().toLowerCase();
    clave = (clave || '');

    // Intentar primero con el servidor para máxima sincronización
    if (typeof fetch === 'function') {
      try {
        const resp = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo, clave })
        });
        const resData = await resp.json();
        if (resp.ok && resData && resData.success) {
          // Guardar en la lista local si no estaba
          const estudiantes = Auth.getEstudiantes();
          let local = estudiantes.find(e => e.correo.toLowerCase() === correo);
          if (!local) {
            local = {
              nombre: resData.nombre,
              curso: resData.curso,
              genero: resData.genero,
              correo: resData.correo,
              clave,
              fechaRegistro: new Date().toISOString()
            };
            estudiantes.push(local);
            Auth.guardarEstudiantes(estudiantes);
          }
          Auth.setSesion({
            rol: 'estudiante',
            nombre: resData.nombre,
            correo: resData.correo,
            curso: resData.curso,
            genero: resData.genero,
            nameChangesCount: 0
          });
          return { ok: true };
        } else if (resData && resData.error && resp.status === 401) {
          return { ok: false, error: resData.error, code: 'WRONG_PASSWORD' };
        }
      } catch (netErr) {
        // En caso de modo offline, continúa con fallback local
      }
    }

    // Fallback local instantáneo
    return Auth.loginEstudiante(correo, clave);
  },

  loginEstudiante(correo, clave) {
    correo = (correo || '').trim().toLowerCase();
    clave = (clave || '');

    if (!correo || !clave) {
      return { ok: false, error: 'Por favor ingresa tu correo y contraseña.' };
    }

    if (correo === CUENTA_DEMO_ESTUDIANTE.correo && clave === CUENTA_DEMO_ESTUDIANTE.clave) {
      Auth.setSesion({
        rol: 'estudiante',
        nombre: CUENTA_DEMO_ESTUDIANTE.nombre,
        correo: CUENTA_DEMO_ESTUDIANTE.correo,
        curso: CUENTA_DEMO_ESTUDIANTE.curso,
        genero: CUENTA_DEMO_ESTUDIANTE.genero,
        nameChangesCount: CUENTA_DEMO_ESTUDIANTE.nameChangesCount || 0
      });
      return { ok: true };
    }

    const estudiantes = Auth.getEstudiantes();
    const usuarioPorCorreo = estudiantes.find(e => e.correo.toLowerCase() === correo);
    if (!usuarioPorCorreo && correo !== CUENTA_DEMO_ESTUDIANTE.correo) {
      return {
        ok: false,
        error: '⚠️ Esta cuenta no está registrada en el Liceo B-13. Si eres estudiante nuevo/a, puedes registrarte en la pestaña "Crear Cuenta".',
        code: 'USER_NOT_FOUND'
      };
    }

    if (usuarioPorCorreo && usuarioPorCorreo.clave !== clave) {
      return {
        ok: false,
        error: '🔑 La contraseña ingresada no es correcta. Verifica mayúsculas y minúsculas o vuelve a escribirla.',
        code: 'WRONG_PASSWORD'
      };
    }

    if (correo === CUENTA_DEMO_ESTUDIANTE.correo && clave !== CUENTA_DEMO_ESTUDIANTE.clave) {
      return {
        ok: false,
        error: '🔑 Contraseña incorrecta para la cuenta demo (clave de prueba: demo1234).',
        code: 'WRONG_PASSWORD'
      };
    }

    Auth.setSesion({
      rol: 'estudiante',
      nombre: usuarioPorCorreo.nombre,
      correo: usuarioPorCorreo.correo,
      curso: usuarioPorCorreo.curso,
      genero: usuarioPorCorreo.genero,
      nameChangesCount: usuarioPorCorreo.nameChangesCount || 0
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
    Auth.aplicarRestriccionesRol();
  },

  aplicarRestriccionesRol() {
    const sesion = Auth.getSesion();
    const rol = (sesion && sesion.rol) ? sesion.rol : 'visita';

    // Clase CSS en el body para control instantáneo y sin parpadeo
    document.body.classList.remove('rol-visita', 'rol-estudiante', 'rol-profesor', 'rol-admin');
    document.body.classList.add('rol-' + rol);

    // 1. Píldora de usuario
    const pill = document.getElementById('studentPill');
    const labelEl = pill ? pill.querySelector('.student-label') : null;
    const iconEl = pill ? pill.querySelector('.student-icon') : null;
    const displayEl = document.getElementById('studentDisplayName');
    const changeBtn = document.getElementById('changeStudentBtn');

    if (pill) {
      pill.classList.remove('role-profesor', 'role-admin', 'role-visita', 'role-estudiante');
      pill.classList.add('role-' + rol);
    }

    // 2. Elementos de barra de herramientas y progreso
    const teacherBtn = document.getElementById('teacherBtn');
    const achievementsBtn = document.getElementById('achievementsBtn');
    const badgesBar = document.getElementById('badgesBar');
    const badgesCard = document.getElementById('badgesShowcaseCard');
    const scorebox = document.querySelector('.scorebox');

    if (rol === 'visita') {
      if (iconEl) iconEl.textContent = '🧭';
      if (labelEl) labelEl.textContent = 'MODO VISITA';
      if (displayEl) displayEl.textContent = 'Visitante (Explorador)';
      if (changeBtn) {
        changeBtn.textContent = '🎓';
        changeBtn.title = 'Iniciar sesión como Estudiante o Profesor';
      }
      if (pill) {
        pill.title = 'Modo Visita: toca para iniciar sesión como Estudiante o Docente';
      }

      // Restricción: visitantes NUNCA ven panel docente ni barra de logros
      if (teacherBtn) teacherBtn.style.display = 'none';
      if (achievementsBtn) achievementsBtn.style.display = 'none';
      if (badgesBar) badgesBar.style.display = 'none';
      if (badgesCard) badgesCard.style.display = 'none';

      // Ajustar scorebox para visita (sin puntaje escolar acumulable)
      if (scorebox) {
        const isMap = document.title.includes('Mapa') || window.location.pathname.includes('mapa');
        const isGallery = document.title.includes('Galería') || document.title.includes('Galeria') || window.location.pathname.includes('galeria') || !!document.getElementById('galleryCount');
        const isFicha = document.title.includes('Enciclopedia') || window.location.pathname.includes('ficha') || !!document.getElementById('fichaContentWrap');

        let count = 0;
        let total = '5';
        let unit = 'FICHAS';

        if (isGallery) {
          const galTotal = (typeof REAL_GALLERY_ITEMS !== 'undefined' && Array.isArray(REAL_GALLERY_ITEMS)) ? REAL_GALLERY_ITEMS.length : 17;
          count = galTotal;
          total = String(galTotal);
          unit = 'REGISTROS';
        } else if (isMap) {
          const mapTotal = (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) ? MAP_ANIMALS.length : 23;
          count = (typeof mapDiscoveredSet !== 'undefined') ? mapDiscoveredSet.size : ((typeof state !== 'undefined' && state.mapDiscovered) ? state.mapDiscovered.length : 0);
          total = String(mapTotal);
          unit = 'ANIMALES';
        } else if (isFicha) {
          const fichaTotal = (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) ? MAP_ANIMALS.length : 23;
          const allDisc = (typeof state !== 'undefined' && Array.isArray(state.discovered)) ? state.discovered.length : (typeof discoveredSet !== 'undefined' ? discoveredSet.size : 0);
          const mapDisc = (typeof state !== 'undefined' && Array.isArray(state.mapDiscovered)) ? state.mapDiscovered.length : (typeof mapDiscoveredSet !== 'undefined' ? mapDiscoveredSet.size : 0);
          count = Math.min(fichaTotal, allDisc + mapDisc);
          total = String(fichaTotal);
          unit = 'FICHAS';
        } else {
          // Potrero: estrictamente especies reales del potrero (0 a 5)
          const potreroList = (typeof POTRERO_IDS !== 'undefined') ? POTRERO_IDS : ['gallo', 'gallina', 'conejo', 'catita', 'agapornis'];
          count = potreroList.filter(id => {
            if (typeof discoveredSet !== 'undefined' && discoveredSet.has) return discoveredSet.has(id);
            if (typeof state !== 'undefined' && Array.isArray(state.discovered)) return state.discovered.includes(id);
            return false;
          }).length;
          total = '5';
          unit = 'FICHAS';
        }
        scorebox.innerHTML = `<span style="color:#ffd83d;font-weight:700;">🧭 VISITA</span><br>${unit}: <span id="discovered">${count}</span>/${total}`;
      }
    } else if (rol === 'estudiante') {
      const studentAvatar = (typeof state !== 'undefined' && state.avatarIcon) ? state.avatarIcon : '🧑‍🌾';
      const studentBorder = (typeof state !== 'undefined' && state.avatarColor) ? state.avatarColor : '#ffd83d';
      let studentTitle = (typeof state !== 'undefined' && state.studentTitle) ? state.studentTitle : 'Explorador/a de Granja';
      if (studentTitle === 'Explorador/a de Campo') studentTitle = 'Explorador/a de Granja';

      if (iconEl) {
        iconEl.textContent = studentAvatar;
        iconEl.style.border = `2px solid ${studentBorder}`;
        iconEl.style.borderRadius = '50%';
        iconEl.style.padding = '1px';
      }
      if (labelEl) labelEl.textContent = studentTitle.toUpperCase();
      const nombre = (typeof state !== 'undefined' && state.studentName) ? state.studentName : (sesion.nombre || 'Estudiante');
      const curso = (typeof state !== 'undefined' && state.studentGrade) ? state.studentGrade : (sesion.curso || '');
      if (displayEl) displayEl.textContent = `${nombre}${curso ? ' (' + curso + ')' : ''}`;
      if (changeBtn) {
        changeBtn.textContent = '✏️';
        changeBtn.title = 'Ver mi perfil, personalizar avatar y certificado oficial';
      }
      if (pill) {
        pill.title = 'Toca para abrir tu Cuaderno de Campo, personalizar avatar y ver tu certificado';
      }

      // Restricción: estudiantes NUNCA ven el panel docente
      if (teacherBtn) teacherBtn.style.display = 'none';
      if (achievementsBtn) achievementsBtn.style.display = '';
      if (badgesBar) badgesBar.style.display = '';
      if (badgesCard) badgesCard.style.display = '';

      // Restaurar scorebox de estudiante de forma instantánea
      if (scorebox) {
        const isMap = document.title.includes('Mapa') || window.location.pathname.includes('mapa');
        const isGallery = document.title.includes('Galería') || document.title.includes('Galeria') || window.location.pathname.includes('galeria') || !!document.getElementById('galleryCount');
        const isGames = document.title.includes('Juega') || window.location.pathname.includes('juegos') || !!document.getElementById('modoStatus');
        const isFicha = document.title.includes('Enciclopedia') || window.location.pathname.includes('ficha') || !!document.getElementById('fichaContentWrap');

        if (isGames) {
          const scoreVal = (typeof state !== 'undefined' && state.score) ? state.score : 0;
          scorebox.innerHTML = `PUNTAJE: <b id="score">${scoreVal}</b><br>MODO: <span id="modoStatus">Estudiante</span>`;
        } else {
          let count = 0;
          let total = '5';
          let unit = 'FICHAS';

          if (isGallery) {
            const galTotal = (typeof REAL_GALLERY_ITEMS !== 'undefined' && Array.isArray(REAL_GALLERY_ITEMS)) ? REAL_GALLERY_ITEMS.length : 17;
            count = galTotal;
            total = String(galTotal);
            unit = 'REGISTROS';
          } else if (isMap) {
            const mapTotal = (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) ? MAP_ANIMALS.length : 23;
            count = (typeof mapDiscoveredSet !== 'undefined') ? mapDiscoveredSet.size : ((typeof state !== 'undefined' && state.mapDiscovered) ? state.mapDiscovered.length : 0);
            total = String(mapTotal);
            unit = 'ANIMALES';
          } else if (isFicha) {
            const fichaTotal = (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) ? MAP_ANIMALS.length : 23;
            const allDisc = (typeof state !== 'undefined' && Array.isArray(state.discovered)) ? state.discovered.length : (typeof discoveredSet !== 'undefined' ? discoveredSet.size : 0);
            const mapDisc = (typeof state !== 'undefined' && Array.isArray(state.mapDiscovered)) ? state.mapDiscovered.length : (typeof mapDiscoveredSet !== 'undefined' ? mapDiscoveredSet.size : 0);
            count = Math.min(fichaTotal, allDisc + mapDisc);
            total = String(fichaTotal);
            unit = 'FICHAS';
          } else {
            // Potrero: estrictamente especies reales del potrero (0 a 5)
            const potreroList = (typeof POTRERO_IDS !== 'undefined') ? POTRERO_IDS : ['gallo', 'gallina', 'conejo', 'catita', 'agapornis'];
            count = potreroList.filter(id => {
              if (typeof discoveredSet !== 'undefined' && discoveredSet.has) return discoveredSet.has(id);
              if (typeof state !== 'undefined' && Array.isArray(state.discovered)) return state.discovered.includes(id);
              return false;
            }).length;
            total = '5';
            unit = 'FICHAS';
          }
          const scoreVal = (typeof computePureScore === 'function') ? computePureScore(state) : ((typeof state !== 'undefined' && state.pureScore) ? state.pureScore : 0);
          scorebox.innerHTML = `PUNTAJE: <b id="score">${scoreVal}</b><br>${unit}: <span id="discovered">${count}</span>/${total}`;
        }
      }
    } else if (rol === 'profesor') {
      if (iconEl) iconEl.textContent = '🍎';
      if (labelEl) labelEl.textContent = 'DOCENTE';
      if (displayEl) displayEl.textContent = `Prof. ${sesion.nombre || 'B-13'}`;
      if (changeBtn) {
        changeBtn.textContent = '⚙️';
        changeBtn.title = 'Abrir Panel Docente';
      }
      if (pill) {
        pill.title = 'Docente: toca para abrir el panel docente';
      }

      // El profesor SÍ ve el panel docente; se oculta barra de insignias de estudiante
      if (teacherBtn) teacherBtn.style.display = '';
      if (achievementsBtn) achievementsBtn.style.display = 'none';
      if (badgesBar) badgesBar.style.display = 'none';

      if (scorebox) {
        scorebox.innerHTML = `<span style="color:#ffd83d;font-weight:700;">🍎 DOCENTE</span><br><span style="font-size:0.75rem;color:var(--hay);">Desafíos y Quizzes</span>`;
      }
    } else if (rol === 'admin') {
      if (iconEl) iconEl.textContent = '🔧';
      if (labelEl) labelEl.textContent = 'ADMIN';
      if (displayEl) displayEl.textContent = 'Administrador/a B-13';
      if (changeBtn) {
        changeBtn.textContent = '📊';
        changeBtn.title = 'Abrir Panel de Métricas';
      }
      if (pill) {
        pill.title = 'Toca para abrir métricas de administración';
      }

      if (teacherBtn) teacherBtn.style.display = '';
      if (achievementsBtn) achievementsBtn.style.display = 'none';
      if (badgesBar) badgesBar.style.display = 'none';

      if (scorebox) {
        scorebox.innerHTML = `<span style="color:#ffd83d;font-weight:700;">🔧 ADMIN</span><br><span style="font-size:0.75rem;color:var(--hay);">Métricas Liceo B-13</span>`;
      }
    }

    // 3. Botones de Salir / Cerrar Sesión en navegación y barra
    const exitButtons = document.querySelectorAll('#navBtnCambiarModo, .nav-switch-btn, #btnPortalRegresarInicio');
    const isVisita = (rol === 'visita');
    const exitText = isVisita ? '🚪 Salir' : '🚪 Cerrar Sesión';
    const exitTitle = isVisita ? 'Salir de la granja' : 'Cerrar sesión de estudiante / docente';

    exitButtons.forEach(btn => {
      btn.textContent = exitText;
      btn.title = exitTitle;
      btn.onclick = (e) => {
        e.preventDefault();
        if (isVisita) {
          if (typeof Auth.salir === 'function') Auth.salir();
          else window.volverAlEspacioModos();
        } else {
          if (typeof Auth.cerrarSesion === 'function') Auth.cerrarSesion();
          else window.volverAlEspacioModos();
        }
      };
    });
  },

  abrirSelectorRoles() {
    if (typeof window.volverAlEspacioModos === 'function') {
      window.volverAlEspacioModos();
    } else if (typeof window.volverAlInicio === 'function') {
      window.volverAlInicio();
    }
  },

  cerrarModales() {
    document.querySelectorAll('.role-modal, .role-modal-overlay').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
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

if (typeof window !== 'undefined') {
  window.Auth = Auth;
  window.TeacherQuizzes = TeacherQuizzes;
}

// Inicializar al cargar el script
document.addEventListener('DOMContentLoaded', () => {
  Auth.init();
});
