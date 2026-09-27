/*
  granjita-portal.js — Flujo de Inicio de Sesión Obligatorio y Pantallas Completas
  (Inicio, Modo, Login/Registro Estudiante, Panel Admin con PIN, Panel Profesor)
  Diseño fiel al prototipo GranjitaBase con colores granate y oro (#4a0d1f / #ffd83d).
*/

(function() {
  const CLAVE_SESION_ACTIVA = 'granjaSesionActiva';

  function inyectarPantallas() {
    if (document.getElementById('startScreen')) return;

    const portalWrap = document.createElement('div');
    portalWrap.id = 'granjitaPortalWrap';
    portalWrap.innerHTML = `
      <!-- PANTALLA 1: Inicio / Bienvenida -->
      <div class="start-screen" id="startScreen">
        <img src="assets/img/logo.png" alt="Escudo DHR Antofagasta" class="logo-img">

        <div class="start-content">
          <h1 class="game-title">
            <span class="title-line1">Bienvenidos a la</span>
            <span class="title-line2">Granjita B13</span>
          </h1>

          <button class="enter-btn" id="portalEnterBtn" type="button">Entrar</button>
        </div>

        <div class="corner-buttons">
          <button class="admin-btn" id="portalStartAdminBtn" type="button">🔧 Admin</button>
          <button class="admin-btn" id="portalStartProfesorBtn" type="button">🍎 Profesor</button>
        </div>
      </div>

      <!-- PANTALLA 2: Selección de Modo -->
      <div class="mode-screen" id="modeScreen" hidden>
        <button class="auth-back mode-back" id="portalModeBackBtn" type="button">← Inicio</button>

        <div class="mode-content">
          <img src="assets/img/logo.png" alt="Escudo DHR Antofagasta" class="auth-logo">
          <h2 class="mode-title">¿Cómo quieres entrar?</h2>

          <button class="mode-btn" id="portalModeVisitaBtn" type="button">🧭 Modo Visitas</button>
          <button class="mode-btn" id="portalModeEstudianteBtn" type="button">🎓 Modo Estudiante</button>
        </div>

        <div class="corner-buttons">
          <button class="admin-btn" id="portalModeAdminBtn" type="button">🔧 Admin</button>
          <button class="admin-btn" id="portalModeProfesorBtn" type="button">🍎 Profesor</button>
        </div>
      </div>

      <!-- PANTALLA 3: Login y Registro Obligatorio de Estudiante -->
      <div class="auth-screen" id="authScreen" hidden>
        <div class="auth-content">
          <button class="auth-back" id="portalAuthBackBtn" type="button">← Volver</button>

          <img src="assets/img/logo.png" alt="Escudo DHR Antofagasta" class="auth-logo">

          <div class="auth-card" id="portalLoginCard">
            <h2 class="auth-title">Iniciar sesión</h2>
            <form class="auth-form" id="portalLoginForm">
              <input class="auth-input" type="email" id="portalLoginCorreo" placeholder="Correo" autocomplete="username" value="demo@granja.cl" required>
              <input class="auth-input" type="password" id="portalLoginClave" placeholder="Contraseña" autocomplete="current-password" value="demo1234" required>
              <p class="auth-error" id="portalLoginError" hidden></p>
              <button class="auth-submit" type="submit">Entrar</button>
            </form>
            <p class="auth-hint">Prueba: demo@granja.cl / demo1234</p>
            <button class="auth-switch" id="portalShowRegisterBtn" type="button">¿No tienes cuenta? Regístrate</button>
          </div>

          <div class="auth-card" id="portalRegisterCard" hidden>
            <h2 class="auth-title">Registro de estudiante</h2>
            <form class="auth-form" id="portalRegisterForm">
              <input class="auth-input" type="text" id="portalRegNombre" placeholder="Nombre completo" autocomplete="name" required>
              <input class="auth-input" type="text" id="portalRegCurso" placeholder="Curso (ej: 7°A, 2°B)" required>
              <select class="auth-input" id="portalRegGenero" required>
                <option value="" disabled selected>Género</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
              </select>
              <input class="auth-input" type="email" id="portalRegCorreo" placeholder="Correo" autocomplete="username" required>
              <input class="auth-input" type="password" id="portalRegClave" placeholder="Contraseña" autocomplete="new-password" required>
              <p class="auth-error" id="portalRegisterError" hidden></p>
              <button class="auth-submit" type="submit">Crear cuenta</button>
            </form>
            <button class="auth-switch" id="portalShowLoginBtn" type="button">¿Ya tienes cuenta? Inicia sesión</button>
          </div>
        </div>
      </div>

      <!-- PANTALLA 4: Estadísticas de Administrador -->
      <div class="admin-screen" id="adminScreen" hidden>
        <div class="admin-content">
          <button class="auth-back" id="portalAdminBackBtn" type="button">← Salir</button>
          <h2 class="brand-heading">📊 Estadísticas de la Granjita B13</h2>
          <div class="admin-stats" id="portalAdminStats"></div>
          <button class="admin-btn admin-reset-btn" id="portalResetDatosBtn" type="button">🗑️ Borrar todos los datos locales</button>
        </div>
      </div>

      <!-- PANTALLA 5: Panel del Profesor -->
      <div class="admin-screen" id="profesorScreen" hidden>
        <div class="admin-content">
          <button class="auth-back" id="portalProfesorBackBtn" type="button">← Salir</button>
          <h2 class="brand-heading">🍎 Panel del Profesor</h2>

          <div class="stat-card">
            <h3>Crear quiz para una zona del mapa</h3>
            <p class="auth-hint">Máximo 10 preguntas por zona con puntaje en décimas.</p>
            <form class="auth-form" id="portalQuizEditorForm">
              <input class="auth-input" type="text" id="portalQuizAutor" placeholder="Tu nombre (profesor/a)" value="Profesor Demo" required>
              <select class="auth-input" id="portalQuizZona" required></select>
              <input class="auth-input" type="text" id="portalQuizPregunta" placeholder="Pregunta" required>
              <input class="auth-input" type="text" id="portalQuizOpcion0" placeholder="Alternativa 1" required>
              <input class="auth-input" type="text" id="portalQuizOpcion1" placeholder="Alternativa 2" required>
              <input class="auth-input" type="text" id="portalQuizOpcion2" placeholder="Alternativa 3" required>
              <input class="auth-input" type="text" id="portalQuizOpcion3" placeholder="Alternativa 4" required>
              <select class="auth-input" id="portalQuizCorrecta" required>
                <option value="" disabled selected>¿Cuál alternativa es correcta?</option>
                <option value="0">Alternativa 1</option>
                <option value="1">Alternativa 2</option>
                <option value="2">Alternativa 3</option>
                <option value="3">Alternativa 4</option>
              </select>
              <input class="auth-input" type="number" id="portalQuizDecimas" placeholder="Décimas si acierta (ej: 0.5)" step="0.1" min="0" max="1" value="0.3" required>
              <p class="auth-error" id="portalQuizEditorError" hidden></p>
              <button class="auth-submit" type="submit">➕ Agregar quiz al mapa</button>
            </form>
          </div>

          <div class="stat-card">
            <h3>📋 Evaluación y Registro</h3>
            <div style="display:flex;flex-direction:column;gap:8px;margin-top:6px;">
              <button class="admin-btn" id="btnProfesorAbrirPlanilla" type="button" style="text-align:center;padding:10px;">📋 Ver Calificaciones del Curso en el Juego</button>
              <a href="/api/export-csv" class="admin-btn" style="text-align:center;padding:10px;text-decoration:none;display:block;background:#1e4d2b;border-color:#5ac57a;color:#fff;">📊 Descargar Planilla Excel / CSV</a>
            </div>
          </div>

          <div class="admin-stats" id="portalQuizListaProfesor"></div>
        </div>
      </div>

      <!-- MODALES DE PIN ADMIN Y LOGIN PROFESOR -->
      <div class="granjita-modal" id="portalAdminPinModal" hidden>
        <div class="granjita-modal-card">
          <button class="granjita-modal-close" id="closePortalAdminPin" type="button">✕</button>
          <h3 class="brand-heading brand-heading-sm">Acceso administrador</h3>
          <form class="auth-form" id="portalAdminPinForm">
            <input class="auth-input auth-pin" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="4" id="portalInputAdminPin" placeholder="PIN" autocomplete="off" required>
            <p class="auth-error" id="portalAdminPinError" hidden></p>
            <button class="auth-submit" type="submit">Entrar</button>
          </form>
          <p class="auth-hint">PIN de prueba: 1234</p>
        </div>
      </div>

      <div class="granjita-modal" id="portalProfesorLoginModal" hidden>
        <div class="granjita-modal-card">
          <button class="granjita-modal-close" id="closePortalProfesorLogin" type="button">✕</button>
          <h3 class="brand-heading brand-heading-sm">Acceso Profesor</h3>
          <form class="auth-form" id="portalProfesorLoginForm">
            <input class="auth-input" type="email" id="portalProfesorEmail" placeholder="Correo" autocomplete="username" value="profesor@granja.cl" required>
            <input class="auth-input" type="password" id="portalProfesorPass" placeholder="Contraseña" autocomplete="current-password" value="profesor1234" required>
            <p class="auth-error" id="portalProfesorError" hidden></p>
            <button class="auth-submit" type="submit">Entrar</button>
          </form>
          <p class="auth-hint">Datos de prueba: profesor@granja.cl / profesor1234</p>
        </div>
      </div>
    `;

    document.body.appendChild(portalWrap);

    // Inyectar botón de "← Inicio" en la barra de herramientas del juego si no existe
    inyectarBotonInicioEnJuego();

    // Inicializar navegación entre pantallas
    inicializarEventos();

    // Verificar si ya hay una sesión activa para mostrar el juego o la pantalla de inicio
    verificarEstadoInicial();
  }

  function inyectarBotonInicioEnJuego() {
    const topBar = document.querySelector('.top-bar');
    if (topBar && !document.getElementById('btnPortalRegresarInicio')) {
      const btn = document.createElement('button');
      btn.id = 'btnPortalRegresarInicio';
      btn.type = 'button';
      btn.className = 'btn-inicio-portal';
      btn.innerHTML = '🚪 Inicio';
      btn.title = 'Regresar a la pantalla de inicio / cambiar de rol';
      btn.addEventListener('click', () => {
        volverAlInicio();
      });

      // Insertar al lado del studentPill
      const studentPill = document.getElementById('studentPill');
      if (studentPill && studentPill.parentNode) {
        studentPill.parentNode.insertBefore(btn, studentPill);
      } else {
        topBar.appendChild(btn);
      }
    }
  }

  function cambiarPantalla(origen, destino, alTerminar) {
    if (origen) origen.hidden = true;
    if (destino) destino.hidden = false;
    if (alTerminar) alTerminar();
  }

  function verificarEstadoInicial() {
    const sesionActiva = localStorage.getItem(CLAVE_SESION_ACTIVA) === 'true';
    const mainWrap = document.querySelector('.wrap');

    if (!sesionActiva) {
      if (mainWrap) mainWrap.style.display = 'none';
      document.getElementById('startScreen').hidden = false;
      document.getElementById('modeScreen').hidden = true;
      document.getElementById('authScreen').hidden = true;
      document.getElementById('adminScreen').hidden = true;
      document.getElementById('profesorScreen').hidden = true;
    } else {
      ocultarTodasLasPantallas();
      if (mainWrap) mainWrap.style.display = '';
    }
  }

  function ocultarTodasLasPantallas() {
    ['startScreen', 'modeScreen', 'authScreen', 'adminScreen', 'profesorScreen', 'portalAdminPinModal', 'portalProfesorLoginModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
  }

  function entrarAlJuego(rol, datos) {
    localStorage.setItem(CLAVE_SESION_ACTIVA, 'true');
    if (typeof Auth !== 'undefined') {
      Auth.setSesion({ rol, ...datos });
    }
    ocultarTodasLasPantallas();
    const mainWrap = document.querySelector('.wrap');
    if (mainWrap) mainWrap.style.display = '';
    if (typeof Auth !== 'undefined') Auth.actualizarPildora();
  }

  window.volverAlInicio = function() {
    localStorage.removeItem(CLAVE_SESION_ACTIVA);
    const mainWrap = document.querySelector('.wrap');
    if (mainWrap) mainWrap.style.display = 'none';
    ocultarTodasLasPantallas();
    document.getElementById('startScreen').hidden = false;
  };

  function inicializarEventos() {
    const startScreen = document.getElementById('startScreen');
    const modeScreen = document.getElementById('modeScreen');
    const authScreen = document.getElementById('authScreen');
    const adminScreen = document.getElementById('adminScreen');
    const profesorScreen = document.getElementById('profesorScreen');

    // 1. Start Screen -> Mode Screen
    document.getElementById('portalEnterBtn').onclick = () => {
      cambiarPantalla(startScreen, modeScreen);
    };

    // 2. Mode Screen -> Start Screen
    document.getElementById('portalModeBackBtn').onclick = () => {
      cambiarPantalla(modeScreen, startScreen);
    };

    // 3. Modo Visitas
    document.getElementById('portalModeVisitaBtn').onclick = () => {
      entrarAlJuego('visita', { nombre: 'Visitante' });
      if (typeof Auth !== 'undefined') Auth.mostrarNotificacion('¡Entraste en Modo Visitas!');
    };

    // 4. Modo Estudiante -> Auth Screen
    document.getElementById('portalModeEstudianteBtn').onclick = () => {
      cambiarPantalla(modeScreen, authScreen, () => {
        document.getElementById('portalLoginCard').hidden = false;
        document.getElementById('portalRegisterCard').hidden = true;
      });
    };

    // 5. Auth Screen -> Mode Screen
    document.getElementById('portalAuthBackBtn').onclick = () => {
      cambiarPantalla(authScreen, modeScreen);
    };

    // Switch Login <-> Registro
    document.getElementById('portalShowRegisterBtn').onclick = () => {
      document.getElementById('portalLoginCard').hidden = true;
      document.getElementById('portalRegisterCard').hidden = false;
    };
    document.getElementById('portalShowLoginBtn').onclick = () => {
      document.getElementById('portalRegisterCard').hidden = true;
      document.getElementById('portalLoginCard').hidden = false;
    };

    // Submit Login Estudiante
    document.getElementById('portalLoginForm').onsubmit = (e) => {
      e.preventDefault();
      const correo = document.getElementById('portalLoginCorreo').value.trim();
      const clave = document.getElementById('portalLoginClave').value;
      const errEl = document.getElementById('portalLoginError');

      if (typeof Auth !== 'undefined') {
        const res = Auth.loginEstudiante(correo, clave);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.hidden = false;
          return;
        }
        errEl.hidden = true;
        const sesion = Auth.getSesion();
        entrarAlJuego('estudiante', sesion);
        Auth.mostrarNotificacion(`¡Bienvenido/a, ${sesion.nombre}!`);
      }
    };

    // Submit Registro Estudiante
    document.getElementById('portalRegisterForm').onsubmit = (e) => {
      e.preventDefault();
      const nombre = document.getElementById('portalRegNombre').value.trim();
      const curso = document.getElementById('portalRegCurso').value.trim();
      const genero = document.getElementById('portalRegGenero').value;
      const correo = document.getElementById('portalRegCorreo').value.trim();
      const clave = document.getElementById('portalRegClave').value;
      const errEl = document.getElementById('portalRegisterError');

      if (typeof Auth !== 'undefined') {
        const res = Auth.registroEstudiante(nombre, curso, genero, correo, clave);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.hidden = false;
          return;
        }
        errEl.hidden = true;
        entrarAlJuego('estudiante', { nombre, curso, genero, correo });
        Auth.mostrarNotificacion(`¡Cuenta creada con éxito! Bienvenido/a, ${nombre}.`);
      }
    };

    // Botones Admin
    const pinModal = document.getElementById('portalAdminPinModal');
    const abrirPinAdmin = () => {
      document.getElementById('portalAdminPinError').hidden = true;
      document.getElementById('portalInputAdminPin').value = '';
      pinModal.hidden = false;
    };
    document.getElementById('portalStartAdminBtn').onclick = abrirPinAdmin;
    document.getElementById('portalModeAdminBtn').onclick = abrirPinAdmin;
    document.getElementById('closePortalAdminPin').onclick = () => pinModal.hidden = true;

    document.getElementById('portalAdminPinForm').onsubmit = (e) => {
      e.preventDefault();
      const pin = document.getElementById('portalInputAdminPin').value.trim();
      const errEl = document.getElementById('portalAdminPinError');
      if (pin !== PIN_ADMIN) {
        errEl.textContent = 'PIN incorrecto (Prueba: 1234)';
        errEl.hidden = false;
        return;
      }
      errEl.hidden = true;
      pinModal.hidden = true;
      const origen = !startScreen.hidden ? startScreen : modeScreen;
      cambiarPantalla(origen, adminScreen, renderizarEstadisticasAdmin);
    };

    document.getElementById('portalAdminBackBtn').onclick = () => {
      cambiarPantalla(adminScreen, modeScreen);
    };

    // Botones Profesor
    const profModal = document.getElementById('portalProfesorLoginModal');
    const abrirLoginProf = () => {
      document.getElementById('portalProfesorError').hidden = true;
      profModal.hidden = false;
    };
    document.getElementById('portalStartProfesorBtn').onclick = abrirLoginProf;
    document.getElementById('portalModeProfesorBtn').onclick = abrirLoginProf;
    document.getElementById('closePortalProfesorLogin').onclick = () => profModal.hidden = true;

    document.getElementById('portalProfesorLoginForm').onsubmit = (e) => {
      e.preventDefault();
      const correo = document.getElementById('portalProfesorEmail').value.trim();
      const clave = document.getElementById('portalProfesorPass').value;
      const errEl = document.getElementById('portalProfesorError');

      if (correo.toLowerCase() !== CUENTA_PROFESOR.correo || clave !== CUENTA_PROFESOR.clave) {
        errEl.textContent = 'Correo o contraseña incorrectos.';
        errEl.hidden = false;
        return;
      }
      errEl.hidden = true;
      profModal.hidden = true;
      const origen = !startScreen.hidden ? startScreen : modeScreen;
      cambiarPantalla(origen, profesorScreen, renderizarPanelProfesorPortal);
    };

    document.getElementById('portalProfesorBackBtn').onclick = () => {
      cambiarPantalla(profesorScreen, modeScreen);
    };

    // Crear Quiz en Panel Profesor
    document.getElementById('portalQuizEditorForm').onsubmit = (e) => {
      e.preventDefault();
      const autor = document.getElementById('portalQuizAutor').value.trim();
      const zona = document.getElementById('portalQuizZona').value;
      const preg = document.getElementById('portalQuizPregunta').value.trim();
      const opc = [0, 1, 2, 3].map(i => document.getElementById('portalQuizOpcion' + i).value.trim());
      const corr = document.getElementById('portalQuizCorrecta').value;
      const dec = document.getElementById('portalQuizDecimas').value;
      const errEl = document.getElementById('portalQuizEditorError');

      if (typeof TeacherQuizzes !== 'undefined') {
        const res = TeacherQuizzes.add(zona, preg, opc, corr, dec, autor);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.hidden = false;
          return;
        }
        errEl.hidden = true;
        document.getElementById('portalQuizPregunta').value = '';
        [0,1,2,3].forEach(i => document.getElementById('portalQuizOpcion' + i).value = '');
        if (typeof Auth !== 'undefined') Auth.mostrarNotificacion('¡Quiz guardado en el mapa!');
        renderizarPanelProfesorPortal();
      }
    };

    // Botón para ver calificaciones dentro del juego desde el panel profesor
    document.getElementById('btnProfesorAbrirPlanilla').onclick = () => {
      entrarAlJuego('profesor', { nombre: 'Profesor/a B-13' });
      if (typeof openOverlayId === 'function') {
        openOverlayId('teacherOverlay');
      }
    };

    // Botón reiniciar datos en admin
    document.getElementById('portalResetDatosBtn').onclick = () => {
      if (confirm('¿Borrar TODOS los datos de prueba y registros locales?')) {
        [CLAVE_ESTUDIANTES, CLAVE_SESION, CLAVE_QUIZZES_ZONA, CLAVE_RESPUESTAS, CLAVE_VISITAS_ZONAS, CLAVE_VISITAS_ANIMALES, CLAVE_ACTIVIDAD_DIA].forEach(k => localStorage.removeItem(k));
        if (typeof Auth !== 'undefined') Auth.init();
        renderizarEstadisticasAdmin();
      }
    };
  }

  // Renderizar Panel del Profesor (Zonas y lista de quizzes)
  function renderizarPanelProfesorPortal() {
    const selectZona = document.getElementById('portalQuizZona');
    const lista = document.getElementById('portalQuizListaProfesor');
    const zonas = (typeof FARM_ZONES !== 'undefined') ? FARM_ZONES : [];

    if (selectZona) {
      selectZona.innerHTML = '<option value="" disabled selected>Zona del mapa</option>' +
        zonas.map(z => `<option value="${z.id}">${z.icon} ${z.label}</option>`).join('');
    }

    if (lista && typeof TeacherQuizzes !== 'undefined') {
      const todos = TeacherQuizzes.getAll();
      const keys = Object.keys(todos).filter(k => todos[k] && todos[k].length > 0);
      if (keys.length === 0) {
        lista.innerHTML = '<div class="stat-card"><h3>Quizzes creados</h3><p class="stat-empty">Aún no has creado ningún quiz.</p></div>';
        return;
      }

      let totalQ = 0;
      const htmlZonas = keys.map(zId => {
        const zObj = zonas.find(z => z.id === zId) || { label: zId, icon: '📍' };
        const items = todos[zId].map((q, idx) => {
          totalQ++;
          return `
            <div class="quiz-item-row">
              <div class="quiz-item-text">
                <strong>${zObj.icon} ${zObj.label}:</strong> ${q.pregunta}<br>
                <span style="opacity:0.8;">👤 ${q.profesor || 'Docente'} · 📐 +${(q.decimas || 0.3).toFixed(1)} décimas</span>
              </div>
              <button class="quiz-item-delete" data-del-zid="${zId}" data-del-idx="${idx}" type="button">✕</button>
            </div>
          `;
        }).join('');
        return items;
      }).join('');

      lista.innerHTML = `<div class="stat-card"><h3>Quizzes en el Mapa (${totalQ})</h3>${htmlZonas}</div>`;

      lista.querySelectorAll('.quiz-item-delete').forEach(btn => {
        btn.onclick = () => {
          TeacherQuizzes.remove(btn.dataset.delZid, parseInt(btn.dataset.delIdx, 10));
          renderizarPanelProfesorPortal();
        };
      });
    }
  }

  // Renderizar Estadísticas Completas en Pantalla Admin
  function renderizarEstadisticasAdmin() {
    const contenedor = document.getElementById('portalAdminStats');
    if (!contenedor) return;

    let estudiantes = [];
    let respuestas = [];
    let visitasZonas = {};
    let visitasAnimales = {};
    let actividadPorDia = {};

    try {
      estudiantes = JSON.parse(localStorage.getItem(CLAVE_ESTUDIANTES)) || [];
      respuestas = JSON.parse(localStorage.getItem(CLAVE_RESPUESTAS)) || [];
      visitasZonas = JSON.parse(localStorage.getItem(CLAVE_VISITAS_ZONAS)) || {};
      visitasAnimales = JSON.parse(localStorage.getItem(CLAVE_VISITAS_ANIMALES)) || {};
      actividadPorDia = JSON.parse(localStorage.getItem(CLAVE_ACTIVIDAD_DIA)) || {};
    } catch (e) {}

    const totalRespuestas = respuestas.length;
    const totalCorrectas = respuestas.filter(r => r.correcta).length;
    const pctGeneral = totalRespuestas ? Math.round((totalCorrectas / totalRespuestas) * 100) : 0;

    // Agrupar respuestas
    const agrupar = (campo) => {
      const g = {};
      respuestas.forEach(r => {
        const k = r[campo] || 'Sin dato';
        if (!g[k]) g[k] = { total: 0, correctas: 0 };
        g[k].total++;
        if (r.correcta) g[k].correctas++;
      });
      return g;
    };

    const filaStat = (etiqueta, valor) => `
      <div class="stat-row">
        <span class="stat-row-label">${etiqueta}</span>
        <span class="stat-row-value">${valor}</span>
      </div>`;

    const tablaGrupo = (grupos) => {
      const entries = Object.entries(grupos);
      if (entries.length === 0) return '<p class="stat-empty">Aún no hay datos.</p>';
      return entries.map(([k, d]) => {
        const pct = d.total ? Math.round((d.correctas / d.total) * 100) : 0;
        return filaStat(k, `${d.correctas}/${d.total} correctas (${pct}%)`);
      }).join('');
    };

    const ranking = (contador) => {
      const entries = Object.entries(contador).sort((a,b) => b[1]-a[1]);
      if (entries.length === 0) return '<p class="stat-empty">Sin visitas registradas.</p>';
      return entries.map(([id, veces]) => filaStat(id, `${veces} visita${veces === 1 ? '' : 's'}`)).join('');
    };

    // Gráfico de visitas por día
    const clavesDias = Object.keys(actividadPorDia).sort();
    let chartSvg = '<p class="stat-empty">Sin actividad aún.</p>';
    if (clavesDias.length > 0) {
      const valores = clavesDias.map(k => actividadPorDia[k]);
      const maxVal = Math.max(...valores, 1);
      const w = 300, h = 110, mBot = 22, hUtil = h - mBot;
      const step = clavesDias.length > 1 ? w / (clavesDias.length - 1) : 0;
      const coords = valores.map((v, i) => ({
        x: clavesDias.length > 1 ? i * step : w / 2,
        y: hUtil - (v / maxVal) * (hUtil - 10) - 5
      }));
      const pts = coords.map(c => `${c.x},${c.y}`).join(' ');
      const circs = coords.map(c => `<circle cx="${c.x}" cy="${c.y}" r="3.5" fill="#ffd83d" />`).join('');
      const lbls = clavesDias.map((k, i) => {
        const txt = k.slice(5); // MM-DD
        return `<text x="${coords[i].x}" y="${h - 4}" font-size="9" fill="#ffe9b0" text-anchor="middle">${txt}</text>`;
      }).join('');
      chartSvg = `
        <svg viewBox="0 0 ${w} ${h}" class="line-chart" preserveAspectRatio="xMidYMid meet">
          <polyline points="${pts}" fill="none" stroke="#ffd83d" stroke-width="2.5" />
          ${circs}
          ${lbls}
        </svg>
      `;
    }

    contenedor.innerHTML = `
      <div class="stat-card">
        <div class="stat-big-number">${estudiantes.length}</div>
        <div class="stat-big-label">Estudiantes registrados</div>
      </div>

      <div class="stat-card">
        <h3>✅ Respuestas del Quiz</h3>
        ${filaStat('Total de respuestas', totalRespuestas)}
        ${filaStat('Correctas', `${totalCorrectas} (${pctGeneral}%)`)}
      </div>

      <div class="stat-card">
        <h3>🎓 Rendimiento por curso</h3>
        ${tablaGrupo(agrupar('curso'))}
      </div>

      <div class="stat-card">
        <h3>🚻 Rendimiento por género</h3>
        ${tablaGrupo(agrupar('genero'))}
      </div>

      <div class="stat-card">
        <h3>🐾 Animales más visitados</h3>
        ${ranking(visitasAnimales)}
      </div>

      <div class="stat-card">
        <h3>🗺️ Zonas más visitadas</h3>
        ${ranking(visitasZonas)}
      </div>

      <div class="stat-card">
        <h3>📈 Actividad por día</h3>
        ${chartSvg}
      </div>

      <div class="stat-card">
        <h3>👥 Lista de Estudiantes</h3>
        <div style="display:flex;flex-direction:column;gap:5px;max-height:160px;overflow-y:auto;">
          ${estudiantes.map(e => `
            <div style="display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid rgba(255,216,61,0.2);font-size:0.82rem;color:#fff6de;">
              <span><strong>${e.nombre}</strong> (${e.curso || 'Sin curso'})</span>
              <span style="color:#ffd83d;">${e.correo}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', inyectarPantallas);
})();
