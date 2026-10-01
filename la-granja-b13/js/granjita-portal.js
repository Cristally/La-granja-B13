/*
  granjita-portal.js — Flujo de Inicio de Sesión Obligatorio y Pantallas Completas
  (Inicio, Modo, Login/Registro Estudiante, Panel Admin con PIN, Panel Profesor)
  Diseño fiel al prototipo GranjitaBase con colores granate y oro (#4a0d1f / #ffd83d).
*/

(function() {
  const CLAVE_SESION_ACTIVA = 'granjaSesionActiva';

  const isLoginPage = (function() {
    const p = (window.location.pathname || '').toLowerCase();
    return p.endsWith('/login') || p.endsWith('/login.html') || p.includes('login') ||
           document.body.classList.contains('login-page') ||
           !!document.getElementById('loginAppWrap');
  })();

  function inyectarPantallas() {
    if (!isLoginPage) {
      const sesionActiva = localStorage.getItem(CLAVE_SESION_ACTIVA) === 'true';
      if (!sesionActiva) {
        const loginTarget = window.location.protocol === 'file:' ? 'login.html' : '/login';
        window.location.replace(loginTarget);
        return;
      }
      // En páginas de contenido con sesión activa no se inyecta el portal, solo se configuran botones
      inyectarBotonInicioEnJuego();
      if (typeof Auth !== 'undefined') {
        Auth.aplicarRestriccionesRol();
      }
      return;
    }

    if (document.getElementById('startScreen')) {
      inyectarBotonInicioEnJuego();
      inicializarEventos();
      verificarEstadoInicial();
      return;
    }

    const portalWrap = document.createElement('div');
    portalWrap.id = 'granjitaPortalWrap';
    portalWrap.innerHTML = `
      <!-- PANTALLA 1: Inicio / Bienvenida -->
      <div class="start-screen" id="startScreen">
        <div class="start-content">
          <img src="assets/img/logo.png" alt="Escudo Oficial Granja B13" class="logo-img">
          <h1 class="game-title">
            <span class="title-line1">Bienvenidos a la</span>
            <span class="title-line2">Granjita B13</span>
          </h1>
          <p class="start-subtitle">Exploración Interactiva y Aprendizaje en Terreno</p>

          <!-- Banner de sesión activa si ya hay una cuenta abierta -->
          <div class="active-session-banner" id="portalActiveSessionBanner" style="display:none;">
            <div>👋 Tienes una sesión activa como: <b id="portalActiveSessionUser">Estudiante</b></div>
            <div class="active-session-actions">
              <button type="button" class="active-session-btn btn-continue" id="btnContinueActiveSession">
                🌾 Continuar a la Granja
              </button>
              <button type="button" class="active-session-btn btn-logout" id="btnLogoutActiveSession">
                🚪 Cerrar Sesión
              </button>
            </div>
          </div>

          <button class="enter-btn" id="portalEnterBtn" type="button">
            <span>Comenzar Experiencia</span>
            <span class="btn-ic">🌾</span>
          </button>

          <div class="start-bottom-roles">
            <button class="modern-chip-btn" id="portalStartAdminBtn" type="button">
              <span>🔧</span> Admin
            </button>
            <button class="modern-chip-btn" id="portalStartProfesorBtn" type="button">
              <span>🍎</span> Profesor
            </button>
          </div>
        </div>
      </div>

      <!-- PANTALLA 2: Selección de Modo -->
      <div class="mode-screen" id="modeScreen" hidden>
        <div class="screen-top-bar">
          <button class="modern-back-btn" id="portalModeBackBtn" type="button" title="Volver a la bienvenida">
            <span class="back-arrow">←</span>
            <span>Volver a Inicio</span>
          </button>
          <span class="auth-school-badge">Liceo Domingo Herrera Rivera B-13</span>
        </div>

        <div class="mode-content">
          <img src="assets/img/logo.png" alt="Escudo Oficial Granja B13" class="auth-logo">
          <h2 class="mode-title" style="color:#ffffff !important;">¿Cómo quieres entrar?</h2>
          <p class="mode-subtitle">Selecciona tu perfil de acceso para comenzar</p>

          <div class="mode-cards-grid">
            <button class="modern-mode-card" id="portalModeVisitaBtn" type="button">
              <span class="mode-card-ic">🧭</span>
              <div class="mode-card-info">
                <span class="mode-card-title">Modo Visitas</span>
                <span class="mode-card-desc">Exploración libre de potrero, mapa y galería</span>
              </div>
              <span class="mode-card-arrow">➤</span>
            </button>

            <button class="modern-mode-card modern-mode-student" id="portalModeEstudianteBtn" type="button">
              <span class="mode-card-ic">🎓</span>
              <div class="mode-card-info">
                <span class="mode-card-title">Modo Estudiante</span>
                <span class="mode-card-desc">Guarda décimas, insignias y progreso formativo</span>
              </div>
              <span class="mode-card-arrow">➤</span>
            </button>
          </div>

          <div class="mode-quick-access">
            <span class="mode-quick-label">Acceso administrativo y docente</span>
            <div class="mode-quick-buttons">
              <button class="modern-chip-btn" id="portalModeAdminBtn" type="button">
                <span>🔧</span> Administrador
              </button>
              <button class="modern-chip-btn" id="portalModeProfesorBtn" type="button">
                <span>🍎</span> Profesor / Docente
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PANTALLA 3: Portal de Acceso Estudiante (Moderno & Separado) -->
      <div class="auth-screen" id="authScreen" hidden>
        <div class="screen-top-bar">
          <button class="modern-back-btn" id="portalAuthBackBtn" type="button" title="Volver a seleccionar modo">
            <span class="back-arrow">←</span>
            <span>Volver a Selección de Modo</span>
          </button>
          <span class="auth-school-badge">Liceo Domingo Herrera Rivera B-13</span>
        </div>

        <div class="modern-auth-container">
          <div class="modern-auth-brand">
            <img src="assets/img/logo.png" alt="Escudo Oficial Granja B13" class="auth-logo">
            <h1>La Granjita B13</h1>
            <p>Exploración de la Granja y Cuaderno de Campo</p>
          </div>

          <div class="modern-auth-card">
            <!-- Pestañas Segmentadas para alternar entre Iniciar Sesión y Crear Cuenta -->
            <div class="auth-segmented-nav" role="tablist">
              <button type="button" class="auth-nav-pill active" id="authTabLoginBtn" role="tab" aria-selected="true">
                <span>🔑</span> Iniciar Sesión
              </button>
              <button type="button" class="auth-nav-pill" id="authTabRegisterBtn" role="tab" aria-selected="false">
                <span>✨</span> Crear Cuenta
              </button>
            </div>

            <!-- Panel 1: INICIAR SESIÓN -->
            <div class="auth-pane" id="paneLogin">
              <div class="auth-pane-header">
                <h2 class="auth-pane-title">¡Bienvenido/a de nuevo!</h2>
                <p class="auth-pane-sub">Ingresa a tu sesión para guardar tus décimas, puntaje y logros de campo.</p>
              </div>

              <!-- Botón de prueba rápida con un solo toque -->
              <button type="button" class="demo-quick-fill-btn" id="btnFillDemoCreds" title="Toca para rellenar los datos de prueba">
                <span class="demo-flash">⚡</span>
                <span class="demo-txt">Cuenta demo: <b>demo@granja.cl</b> (demo1234)</span>
                <span class="demo-action">Rellenar</span>
              </button>

              <form class="modern-form" id="portalLoginForm">
                <div class="form-field">
                  <label for="portalLoginCorreo">Correo institucional o registrado</label>
                  <div class="input-box">
                    <span class="input-ic">✉️</span>
                    <input type="email" id="portalLoginCorreo" placeholder="ejemplo@granja.cl" autocomplete="username" value="demo@granja.cl" required>
                  </div>
                </div>

                <div class="form-field">
                  <label for="portalLoginClave">Contraseña</label>
                  <div class="input-box">
                    <span class="input-ic">🔒</span>
                    <input type="password" id="portalLoginClave" placeholder="Ingresa tu contraseña" autocomplete="current-password" value="demo1234" required>
                    <button type="button" class="toggle-pass-btn" id="toggleLoginPass" aria-label="Mostrar contraseña">👁️</button>
                  </div>
                </div>

                <div class="auth-error-box" id="portalLoginError" hidden></div>

                <button type="submit" class="modern-btn-submit" id="portalLoginSubmitBtn">
                  <span>Ingresar a la Granja</span>
                  <span class="btn-ic">➤</span>
                </button>
              </form>

              <div class="auth-footer-switch">
                ¿Aún no tienes cuenta creada?
                <button type="button" class="switch-link-btn" id="btnGoToRegister">Regístrate gratis aquí</button>
              </div>
            </div>

            <!-- Panel 2: CREAR CUENTA -->
            <div class="auth-pane" id="paneRegister" hidden>
              <div class="auth-pane-header">
                <h2 class="auth-pane-title">Registro de Estudiante</h2>
                <p class="auth-pane-sub">Crea tu cuenta escolar para activar tu Cuaderno de Campo individual.</p>
              </div>

              <form class="modern-form" id="portalRegisterForm">
                <div class="form-field">
                  <label for="portalRegNombre">Nombre completo</label>
                  <div class="input-box">
                    <span class="input-ic">👤</span>
                    <input type="text" id="portalRegNombre" placeholder="Tu nombre y apellido (sin números)" autocomplete="name" required>
                  </div>
                </div>

                <div class="form-row-2col">
                  <div class="form-field">
                    <label for="portalRegCurso">Curso / Nivel oficial</label>
                    <div class="input-box">
                      <span class="input-ic">🏫</span>
                      <select id="portalRegCurso" required>
                        <option value="" disabled selected>Selecciona tu curso...</option>
                        <optgroup label="1° Medios">
                          <option value="1° Medio A">1° Medio A</option>
                          <option value="1° Medio B">1° Medio B</option>
                          <option value="1° Medio C">1° Medio C</option>
                          <option value="1° Medio D">1° Medio D</option>
                          <option value="1° Medio E">1° Medio E</option>
                          <option value="1° Medio F">1° Medio F</option>
                        </optgroup>
                        <optgroup label="2° Medios">
                          <option value="2° Medio A">2° Medio A</option>
                          <option value="2° Medio B">2° Medio B</option>
                          <option value="2° Medio C">2° Medio C</option>
                          <option value="2° Medio D">2° Medio D</option>
                          <option value="2° Medio E">2° Medio E</option>
                          <option value="2° Medio F">2° Medio F</option>
                        </optgroup>
                        <optgroup label="3° Medios">
                          <option value="3° Medio A">3° Medio A</option>
                          <option value="3° Medio B">3° Medio B</option>
                          <option value="3° Medio C">3° Medio C</option>
                          <option value="3° Medio D">3° Medio D</option>
                          <option value="3° Medio E">3° Medio E</option>
                          <option value="3° Medio F">3° Medio F</option>
                        </optgroup>
                        <optgroup label="4° Medios">
                          <option value="4° Medio A">4° Medio A</option>
                          <option value="4° Medio B">4° Medio B</option>
                          <option value="4° Medio C">4° Medio C</option>
                          <option value="4° Medio D">4° Medio D</option>
                          <option value="4° Medio E">4° Medio E</option>
                          <option value="4° Medio F">4° Medio F</option>
                        </optgroup>
                        <optgroup label="Talleres y Academias B-13">
                          <option value="Brigada Ecológica B-13">Brigada Ecológica B-13</option>
                          <option value="Academia de Ciencias B-13">Academia de Ciencias B-13</option>
                          <option value="Taller Agroecológico B-13">Taller Agroecológico B-13</option>
                          <option value="Otro Curso / Nivel B-13">Otro Curso / Nivel B-13</option>
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div class="form-field">
                    <label for="portalRegGenero">Género</label>
                    <div class="input-box">
                      <span class="input-ic">🚻</span>
                      <select id="portalRegGenero" required>
                        <option value="" disabled selected>Selecciona...</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="form-field">
                  <label for="portalRegCorreo">Correo electrónico</label>
                  <div class="input-box">
                    <span class="input-ic">✉️</span>
                    <input type="email" id="portalRegCorreo" placeholder="estudiante@granja.cl" autocomplete="username" required>
                  </div>
                </div>

                <div class="form-field">
                  <label for="portalRegClave">Crear contraseña</label>
                  <div class="input-box">
                    <span class="input-ic">🔒</span>
                    <input type="password" id="portalRegClave" placeholder="Mínimo 6 caracteres" autocomplete="new-password" minlength="6" required>
                    <button type="button" class="toggle-pass-btn" id="toggleRegPass" aria-label="Mostrar contraseña">👁️</button>
                  </div>
                </div>

                <div class="auth-error-box" id="portalRegisterError" hidden></div>

                <button type="submit" class="modern-btn-submit modern-btn-gold" id="portalRegSubmitBtn">
                  <span>Crear mi Cuenta de Estudiante</span>
                  <span class="btn-ic">✨</span>
                </button>
              </form>

              <div class="auth-footer-switch">
                ¿Ya tienes una cuenta creada?
                <button type="button" class="switch-link-btn" id="btnGoToLogin">Inicia sesión aquí</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PANTALLA 4: Estadísticas de Administrador -->
      <div class="admin-screen" id="adminScreen" hidden>
        <div class="screen-top-bar">
          <button class="modern-back-btn" id="portalAdminBackBtn" type="button" title="Volver a selección de modo">
            <span class="back-arrow">←</span>
            <span>Volver a Selección de Modo</span>
          </button>
          <span class="auth-school-badge">Panel Administrativo B-13</span>
        </div>

        <div class="admin-content">
          <h2 class="brand-heading">📊 Estadísticas y Control de la Granjita B13</h2>
          <div id="portalAdminNotif" class="admin-notif-banner" hidden></div>
          <div class="admin-stats" id="portalAdminStats"></div>
          
          <div class="stat-card stat-card-danger">
            <div class="stat-card-header">
              <span class="danger-ic">⚙️</span>
              <h3 style="color:#ffb3b3;margin:0;">Limpieza y Control de Registros</h3>
            </div>
            <p class="auth-hint" style="text-align:left;color:#ffe6e6;margin:8px 0 14px;line-height:1.4;">
              Gestiona o vacía la base de datos de estudiantes, puntuaciones y respuestas para iniciar un nuevo ciclo de actividades escolares.
            </p>
            <div class="admin-action-buttons">
              <button class="admin-btn-action admin-btn-warning" id="portalResetRespuestasBtn" type="button">
                <span>📝</span> Borrar solo respuestas y actividad (conservar estudiantes)
              </button>
              <button class="admin-btn-action admin-btn-danger" id="portalResetDatosBtn" type="button">
                <span>🗑️</span> Borrar TODOS los registros (Alumnos, Respuestas y Perfiles)
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PANTALLA 5: Panel del Profesor -->
      <div class="admin-screen" id="profesorScreen" hidden>
        <div class="screen-top-bar">
          <button class="modern-back-btn" id="portalProfesorBackBtn" type="button" title="Volver a selección de modo">
            <span class="back-arrow">←</span>
            <span>Volver a Selección de Modo</span>
          </button>
          <span class="auth-school-badge">Portal Docente Liceo B-13</span>
        </div>

        <div class="admin-content">
          <h2 class="brand-heading">🍎 Panel del Profesor</h2>

          <div class="stat-card">
            <h3>📋 Seguimiento y Registro de Actividades</h3>
            <div class="admin-action-buttons" style="margin-top:10px;">
              <button class="admin-btn-action admin-btn-gold" id="btnProfesorEntrarJuego" type="button">
                <span>🌾</span> Entrar a la Granja (Modo Docente)
              </button>
              <button class="admin-btn-action admin-btn-info" id="btnProfesorAbrirPlanilla" type="button">
                <span>📋</span> Ver Calificaciones del Curso en el Juego
              </button>
              <a href="/api/export-csv" class="admin-btn-action admin-btn-success" id="btnDescargarPlanillaDocente" style="text-decoration:none;">
                <span>📊</span> Descargar Planilla Excel (.csv)
              </a>
            </div>
          </div>

          <div class="stat-card">
            <h3>➕ Crear quiz para una zona del mapa</h3>
            <p class="auth-hint" style="text-align:left;color:#ffeed1;margin-bottom:12px;">Máximo 10 preguntas por zona con puntaje en décimas.</p>
            <form class="auth-form modern-form" id="portalQuizEditorForm">
              <div class="form-field">
                <label for="portalQuizAutor">Profesor/a Docente Guía</label>
                <div class="input-box">
                  <span class="input-ic">👤</span>
                  <select id="portalQuizAutor" required>
                    <option value="Profesor/a B-13">Profesor/a B-13 (Docente Guía)</option>
                    <option value="Prof. Carlos Soto">Prof. Carlos Soto (Ciencias Naturales)</option>
                    <option value="Prof. Ana Reyes">Prof. Ana Reyes (Biología y Ecosistemas)</option>
                    <option value="Prof. Valentina Rojas">Prof. Valentina Rojas (Educación Ambiental)</option>
                    <option value="Prof. Francisco Tapia">Prof. Francisco Tapia (Taller Agroecológico)</option>
                  </select>
                </div>
              </div>
              <div class="form-field">
                <label for="portalQuizZona">Zona del mapa</label>
                <div class="input-box">
                  <span class="input-ic">📍</span>
                  <select id="portalQuizZona" required>
                    <option value="" disabled selected>Selecciona una zona...</option>
                    <option value="conejos">🐰 Conejeras Escolares</option>
                    <option value="gallinas">🐔 Gallinero B-13</option>
                    <option value="jaula-gallo">🐓 Jaula del Gallo Fino</option>
                    <option value="arboleda">🌳 Arboleda y Pajarera</option>
                    <option value="aviario">🦜 Aviario Australiano</option>
                    <option value="potrero">🌾 Potrero Central</option>
                    <option value="huerto">🥕 Huerto Orgánico</option>
                    <option value="invernadero">🌱 Invernadero Pedagógico</option>
                    <option value="compostera">🍂 Compostera Escolar</option>
                    <option value="lombricultura">🪱 Lombricultura y Vermicompost</option>
                  </select>
                </div>
              </div>
              <div class="form-field">
                <label for="portalQuizPregunta">Pregunta formativa</label>
                <div class="input-box">
                  <span class="input-ic">❓</span>
                  <input type="text" id="portalQuizPregunta" placeholder="Escribe la pregunta" required>
                </div>
              </div>
              <div class="form-row-2col">
                <div class="form-field">
                  <label for="portalQuizOpcion0">Alternativa 1</label>
                  <div class="input-box">
                    <span class="input-ic">A</span>
                    <input type="text" id="portalQuizOpcion0" placeholder="Alternativa 1" required>
                  </div>
                </div>
                <div class="form-field">
                  <label for="portalQuizOpcion1">Alternativa 2</label>
                  <div class="input-box">
                    <span class="input-ic">B</span>
                    <input type="text" id="portalQuizOpcion1" placeholder="Alternativa 2" required>
                  </div>
                </div>
              </div>
              <div class="form-row-2col">
                <div class="form-field">
                  <label for="portalQuizOpcion2">Alternativa 3</label>
                  <div class="input-box">
                    <span class="input-ic">C</span>
                    <input type="text" id="portalQuizOpcion2" placeholder="Alternativa 3" required>
                  </div>
                </div>
                <div class="form-field">
                  <label for="portalQuizOpcion3">Alternativa 4</label>
                  <div class="input-box">
                    <span class="input-ic">D</span>
                    <input type="text" id="portalQuizOpcion3" placeholder="Alternativa 4" required>
                  </div>
                </div>
              </div>
              <div class="form-row-2col">
                <div class="form-field">
                  <label for="portalQuizCorrecta">¿Cuál alternativa es correcta?</label>
                  <div class="input-box">
                    <span class="input-ic">✅</span>
                    <select id="portalQuizCorrecta" required>
                      <option value="" disabled selected>Alternativa correcta...</option>
                      <option value="0">Alternativa 1 (A)</option>
                      <option value="1">Alternativa 2 (B)</option>
                      <option value="2">Alternativa 3 (C)</option>
                      <option value="3">Alternativa 4 (D)</option>
                    </select>
                  </div>
                </div>
                <div class="form-field">
                  <label for="portalQuizDecimas">Décimas asignadas</label>
                  <div class="input-box">
                    <span class="input-ic">📐</span>
                    <input type="number" id="portalQuizDecimas" placeholder="0.3" step="0.1" min="0" max="1" value="0.3" required>
                  </div>
                </div>
              </div>
              <p class="auth-error-box" id="portalQuizEditorError" hidden></p>
              <button class="modern-btn-submit modern-btn-gold" type="submit">
                <span>➕ Publicar Quiz en el Mapa</span>
              </button>
            </form>
          </div>

          <div class="admin-stats" id="portalQuizListaProfesor"></div>
        </div>
      </div>

      <!-- MODALES DE PIN ADMIN Y LOGIN PROFESOR -->
      <div class="granjita-modal" id="portalAdminPinModal" hidden>
        <div class="granjita-modal-card">
          <button class="granjita-modal-close" id="closePortalAdminPin" type="button" aria-label="Cerrar modal">✕</button>
          <div class="modal-card-icon">🔐</div>
          <h3 class="brand-heading brand-heading-sm">Acceso Administrador</h3>
          <p class="auth-hint" style="margin-bottom:12px;">Ingresa el código PIN de 4 dígitos para acceder al panel de control.</p>
          <form class="auth-form modern-form" id="portalAdminPinForm">
            <div class="input-box" style="justify-content:center;">
              <input class="auth-pin" type="tel" inputmode="numeric" pattern="[0-9]*" maxlength="4" id="portalInputAdminPin" placeholder="••••" autocomplete="off" required>
            </div>
            <p class="auth-error-box" id="portalAdminPinError" hidden></p>
            <button class="modern-btn-submit modern-btn-gold" type="submit">
              <span>Ingresar al Panel</span>
              <span class="btn-ic">🔓</span>
            </button>
          </form>
          <p class="auth-hint" style="margin-top:10px;opacity:0.85;">PIN de prueba: <b>1234</b></p>
        </div>
      </div>

      <div class="granjita-modal" id="portalProfesorLoginModal" hidden>
        <div class="granjita-modal-card">
          <button class="granjita-modal-close" id="closePortalProfesorLogin" type="button" aria-label="Cerrar modal">✕</button>
          <div class="modal-card-icon">🍎</div>
          <h3 class="brand-heading brand-heading-sm">Acceso Profesor</h3>
          <p class="auth-hint" style="margin-bottom:12px;">Ingresa con tus credenciales docentes para administrar quizzes y notas.</p>
          <form class="auth-form modern-form" id="portalProfesorLoginForm">
            <div class="form-field">
              <label for="portalProfesorEmail">Correo Institucional</label>
              <div class="input-box">
                <span class="input-ic">✉️</span>
                <input type="email" id="portalProfesorEmail" placeholder="profesor@granja.cl" autocomplete="username" value="profesor@granja.cl" required>
              </div>
            </div>
            <div class="form-field">
              <label for="portalProfesorPass">Contraseña</label>
              <div class="input-box">
                <span class="input-ic">🔒</span>
                <input type="password" id="portalProfesorPass" placeholder="Contraseña" autocomplete="current-password" value="profesor1234" required>
              </div>
            </div>
            <p class="auth-error-box" id="portalProfesorError" hidden></p>
            <button class="modern-btn-submit modern-btn-gold" type="submit">
              <span>Ingresar como Profesor</span>
              <span class="btn-ic">➤</span>
            </button>
          </form>
          <p class="auth-hint" style="margin-top:10px;opacity:0.85;">Docente demo: <b>profesor@granja.cl</b> / <b>profesor1234</b></p>
        </div>
      </div>

      <!-- MODAL CELEBRATORIO DE REGISTRO EXITOSO -->
      <div class="granjita-modal" id="portalRegSuccessModal" hidden>
        <div class="granjita-modal-card" style="text-align:center;max-width:440px;">
          <div class="modal-card-icon" style="font-size:3.2rem;">🎉</div>
          <h3 class="brand-heading brand-heading-sm" style="color:#ffd83d;margin-bottom:6px;">¡Cuenta Creada con Éxito!</h3>
          <p class="auth-hint" style="font-size:0.95rem;color:#ffffff;line-height:1.5;margin:8px 0 14px;">
            ¡Bienvenido/a a La Granja B-13, <b id="regSuccessNombre" style="color:#ffd83d;">Estudiante</b>!<br>
            Tu Cuaderno de Campo individual del curso <b id="regSuccessCurso" style="color:#a7f3d0;">1° Medio</b> ha sido activado en el sistema escolar.
          </p>
          <div style="background:rgba(255,255,255,0.08);border:1px solid rgba(255,216,61,0.3);border-radius:8px;padding:10px 14px;margin-bottom:16px;text-align:left;font-size:0.82rem;color:#ffeed1;line-height:1.55;">
            🌾 <b>Cuaderno Individual:</b> Tu puntaje y décimas quedarán guardados en este equipo.<br>
            🐾 <b>Animales de la Granja:</b> Descubre las 5 especies del potrero y los 10 registros del mapa.<br>
            🎖️ <b>Insignias y Certificado:</b> Podrás ganar insignias oficiales del Liceo B-13.
          </div>
          <button class="modern-btn-submit modern-btn-gold" id="btnRegSuccessContinuar" type="button" style="width:100%;font-size:1.02rem;padding:12px;">
            <span>Comenzar Aventura en la Granja</span>
            <span class="btn-ic">🌾</span>
          </button>
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
    const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };
    const isVisita = (sesion.rol === 'visita');
    const label = isVisita ? '🚪 Salir' : '🚪 Cerrar Sesión';
    const tip = isVisita ? 'Salir de la granja' : 'Cerrar sesión de estudiante / docente';

    // Vincular todos los botones de cambio de modo o salida si existen
    document.querySelectorAll('#btnPortalRegresarInicio, .btn-portal-inicio, .nav-switch-btn, #navBtnCambiarModo, #btnOverlayCambiarModo').forEach(btn => {
      btn.textContent = label;
      btn.title = tip;
      btn.onclick = (e) => {
        e.preventDefault();
        window.volverAlEspacioModos();
      };
    });
  }

  function getAppContainer() {
    return document.querySelector('.app') || document.querySelector('.wrap') || document.querySelector('.games-app') || document.getElementById('gamesAppWrap');
  }

  function cambiarPantalla(origen, destino, alTerminar) {
    if (origen) origen.hidden = true;
    if (destino) {
      destino.hidden = false;
      destino.scrollTop = 0;
    }
    if (alTerminar) alTerminar();
  }

  function verificarEstadoInicial() {
    if (!isLoginPage) {
      ocultarTodasLasPantallas();
      const appContainer = getAppContainer();
      if (appContainer) appContainer.style.display = '';
      if (typeof Auth !== 'undefined') {
        Auth.aplicarRestriccionesRol();
      }
      return;
    }

    const sesionActiva = localStorage.getItem(CLAVE_SESION_ACTIVA) === 'true';
    const banner = document.getElementById('portalActiveSessionBanner');
    const userText = document.getElementById('portalActiveSessionUser');
    const btnContinue = document.getElementById('btnContinueActiveSession');
    const btnLogout = document.getElementById('btnLogoutActiveSession');

    if (sesionActiva) {
      const sesion = (typeof Auth !== 'undefined') ? Auth.getSesion() : { rol: 'visita', nombre: 'Visitante' };
      if (banner && userText) {
        const rolTexto = sesion.rol === 'visita' ? 'Modo Visita' :
                         sesion.rol === 'estudiante' ? `Estudiante (${sesion.curso || 'B-13'})` :
                         sesion.rol === 'profesor' ? 'Docente' : 'Administrador';
        userText.textContent = `${sesion.nombre || 'Usuario'} · ${rolTexto}`;
        banner.style.display = 'flex';
      }
      if (btnContinue) {
        btnContinue.onclick = () => {
          window.location.href = 'index.html';
        };
      }
      if (btnLogout) {
        btnLogout.onclick = () => {
          localStorage.removeItem(CLAVE_SESION_ACTIVA);
          if (typeof Auth !== 'undefined') {
            Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
          }
          if (banner) banner.style.display = 'none';
        };
      }
    } else {
      if (banner) banner.style.display = 'none';
    }

    const startScreen = document.getElementById('startScreen');
    if (startScreen) startScreen.hidden = false;
    ['modeScreen', 'authScreen', 'adminScreen', 'profesorScreen'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
  }

  function ocultarTodasLasPantallas() {
    ['startScreen', 'modeScreen', 'authScreen', 'adminScreen', 'profesorScreen', 'portalAdminPinModal', 'portalProfesorLoginModal', 'portalRegSuccessModal'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.hidden = true;
    });
  }

  function entrarAlJuego(rol, datos) {
    try {
      localStorage.setItem(CLAVE_SESION_ACTIVA, 'true');
      if (typeof Auth !== 'undefined') {
        Auth.setSesion({ rol, ...datos });
      }
      window.location.href = 'index.html';
    } catch (err) {
      console.error('Error al entrar al juego:', err);
      window.location.href = 'index.html';
    }
  }

  window.volverAlEspacioModos = function() {
    localStorage.removeItem(CLAVE_SESION_ACTIVA);
    if (typeof Auth !== 'undefined') {
      Auth.setSesion({ rol: 'visita', nombre: 'Visitante' });
      if (typeof Auth.cerrarModales === 'function') Auth.cerrarModales();
    }
    const loginTarget = window.location.protocol === 'file:' ? 'login.html' : '/login';
    window.location.href = loginTarget;
  };
  window.volverAlInicio = window.volverAlEspacioModos;

  function inicializarEventos() {
    const startScreen = document.getElementById('startScreen');
    const modeScreen = document.getElementById('modeScreen');
    const authScreen = document.getElementById('authScreen');
    const adminScreen = document.getElementById('adminScreen');
    const profesorScreen = document.getElementById('profesorScreen');

    // 1. Start Screen -> Mode Screen
    const portalEnterBtn = document.getElementById('portalEnterBtn');
    if (portalEnterBtn) {
      portalEnterBtn.onclick = () => cambiarPantalla(startScreen, modeScreen);
    }

    // 2. Mode Screen -> Start Screen
    const portalModeBackBtn = document.getElementById('portalModeBackBtn');
    if (portalModeBackBtn) {
      portalModeBackBtn.onclick = () => cambiarPantalla(modeScreen, startScreen);
    }

    // 3. Modo Visitas
    const portalModeVisitaBtn = document.getElementById('portalModeVisitaBtn');
    if (portalModeVisitaBtn) {
      portalModeVisitaBtn.onclick = () => {
        entrarAlJuego('visita', { nombre: 'Visitante' });
        if (typeof Auth !== 'undefined') Auth.mostrarNotificacion('¡Entraste en Modo Visitas!');
      };
    }

    // Manejo de Pestañas y Vistas en Auth Screen (Login vs Registro)
    const tabLoginBtn = document.getElementById('authTabLoginBtn');
    const tabRegBtn = document.getElementById('authTabRegisterBtn');
    const paneLogin = document.getElementById('paneLogin');
    const paneRegister = document.getElementById('paneRegister');

    function mostrarLogin() {
      if (tabLoginBtn) {
        tabLoginBtn.classList.add('active');
        tabLoginBtn.setAttribute('aria-selected', 'true');
      }
      if (tabRegBtn) {
        tabRegBtn.classList.remove('active');
        tabRegBtn.setAttribute('aria-selected', 'false');
      }
      if (paneLogin) {
        paneLogin.hidden = false;
        paneLogin.style.display = 'flex';
      }
      if (paneRegister) {
        paneRegister.hidden = true;
        paneRegister.style.display = 'none';
      }
      const err = document.getElementById('portalLoginError');
      if (err) err.hidden = true;
    }

    function mostrarRegistro() {
      if (tabRegBtn) {
        tabRegBtn.classList.add('active');
        tabRegBtn.setAttribute('aria-selected', 'true');
      }
      if (tabLoginBtn) {
        tabLoginBtn.classList.remove('active');
        tabLoginBtn.setAttribute('aria-selected', 'false');
      }
      if (paneRegister) {
        paneRegister.hidden = false;
        paneRegister.style.display = 'flex';
      }
      if (paneLogin) {
        paneLogin.hidden = true;
        paneLogin.style.display = 'none';
      }
      const err = document.getElementById('portalRegisterError');
      if (err) err.hidden = true;
    }

    if (tabLoginBtn) tabLoginBtn.onclick = mostrarLogin;
    if (tabRegBtn) tabRegBtn.onclick = mostrarRegistro;

    const btnGoToReg = document.getElementById('btnGoToRegister');
    if (btnGoToReg) btnGoToReg.onclick = mostrarRegistro;

    const btnGoToLog = document.getElementById('btnGoToLogin');
    if (btnGoToLog) btnGoToLog.onclick = mostrarLogin;

    // Rellenar credenciales de prueba con un clic
    const btnDemo = document.getElementById('btnFillDemoCreds');
    if (btnDemo) {
      btnDemo.onclick = () => {
        const emailInput = document.getElementById('portalLoginCorreo');
        const passInput = document.getElementById('portalLoginClave');
        if (emailInput) emailInput.value = 'demo@granja.cl';
        if (passInput) passInput.value = 'demo1234';
      };
    }

    // Toggle de visibilidad de contraseñas
    const setupPassToggle = (btnId, inputId) => {
      const btn = document.getElementById(btnId);
      const inp = document.getElementById(inputId);
      if (btn && inp) {
        btn.onclick = () => {
          const isPass = inp.getAttribute('type') === 'password';
          inp.setAttribute('type', isPass ? 'text' : 'password');
          btn.textContent = isPass ? '🙈' : '👁️';
          btn.setAttribute('aria-label', isPass ? 'Ocultar contraseña' : 'Mostrar contraseña');
        };
      }
    };
    setupPassToggle('toggleLoginPass', 'portalLoginClave');
    setupPassToggle('toggleRegPass', 'portalRegClave');

    // 4. Modo Estudiante -> Auth Screen (Inicia en vista de login)
    const portalModeEstudianteBtn = document.getElementById('portalModeEstudianteBtn');
    if (portalModeEstudianteBtn) {
      portalModeEstudianteBtn.onclick = () => {
        cambiarPantalla(modeScreen, authScreen, () => {
          mostrarLogin();
        });
      };
    }

    // 5. Auth Screen -> Mode Screen (Regresar a seleccionar cómo entrar)
    const portalAuthBackBtn = document.getElementById('portalAuthBackBtn');
    if (portalAuthBackBtn) {
      portalAuthBackBtn.onclick = () => {
        cambiarPantalla(authScreen, modeScreen);
      };
    }

    // Botones globales de volver a cambiar de modo
    document.querySelectorAll('#navBtnCambiarModo, .nav-switch-btn, #btnPortalRegresarInicio').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        window.volverAlEspacioModos();
      };
    });

    // Filtro en tiempo real para Nombre Completo (sin números)
    const inputRegNombre = document.getElementById('portalRegNombre');
    if (inputRegNombre) {
      inputRegNombre.addEventListener('input', function() {
        const cleaned = this.value.replace(/[0-9]/g, '');
        if (cleaned !== this.value) {
          this.value = cleaned;
          const errEl = document.getElementById('portalRegisterError');
          if (errEl) {
            errEl.textContent = 'ℹ️ Los números no están permitidos en el nombre completo. Por favor ingresa tu nombre real.';
            errEl.hidden = false;
            setTimeout(() => {
              if (errEl && errEl.textContent.includes('números')) errEl.hidden = true;
            }, 3000);
          }
        }
      });
    }

    // Submit Login Estudiante
    const portalLoginForm = document.getElementById('portalLoginForm');
    if (portalLoginForm) {
      portalLoginForm.onsubmit = (e) => {
        e.preventDefault();
        const correo = document.getElementById('portalLoginCorreo').value.trim();
        const clave = document.getElementById('portalLoginClave').value;
        const errEl = document.getElementById('portalLoginError');

        if (typeof Auth !== 'undefined') {
          const res = Auth.loginEstudiante(correo, clave);
          if (!res.ok) {
            let errorHtml = `<span>${res.error}</span>`;
            if (res.code === 'USER_NOT_FOUND') {
              errorHtml += `
                <div style="margin-top:10px;">
                  <button type="button" class="modern-btn-submit modern-btn-gold" style="padding:6px 14px;font-size:0.84rem;width:auto;display:inline-flex;align-items:center;gap:6px;" id="btnErrGoToReg">
                    <span>✨ Crear Cuenta Gratis Ahora</span>
                  </button>
                </div>`;
            }
            errEl.innerHTML = errorHtml;
            errEl.hidden = false;

            const btnGoReg = document.getElementById('btnErrGoToReg');
            if (btnGoReg) {
              btnGoReg.onclick = () => {
                const navReg = document.getElementById('btnGoToRegister');
                if (navReg) navReg.click();
              };
            }
            return;
          }
          errEl.hidden = true;
          const sesion = Auth.getSesion();
          entrarAlJuego('estudiante', sesion);
          Auth.mostrarNotificacion(`¡Bienvenido/a, ${sesion.nombre}!`);
        }
      };
    }

    // Submit Registro Estudiante
    const portalRegisterForm = document.getElementById('portalRegisterForm');
    if (portalRegisterForm) {
      portalRegisterForm.onsubmit = (e) => {
        e.preventDefault();
        const nombre = document.getElementById('portalRegNombre').value.trim();
        const curso = document.getElementById('portalRegCurso').value;
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

          // Mostrar modal afirmativo y claro de confirmación de cuenta
          const successModal = document.getElementById('portalRegSuccessModal');
          const successNombre = document.getElementById('regSuccessNombre');
          const successCurso = document.getElementById('regSuccessCurso');
          const btnContinuar = document.getElementById('btnRegSuccessContinuar');

          if (successModal && successNombre && successCurso && btnContinuar) {
            successNombre.textContent = nombre;
            successCurso.textContent = curso;
            successModal.hidden = false;

            btnContinuar.onclick = () => {
              successModal.hidden = true;
              entrarAlJuego('estudiante', { nombre, curso, genero, correo });
              if (typeof playVictory === 'function') playVictory();
              Auth.mostrarNotificacion(`¡Bienvenido/a a La Granja B-13, ${nombre}!`);
            };
          } else {
            entrarAlJuego('estudiante', { nombre, curso, genero, correo });
            Auth.mostrarNotificacion(`¡Cuenta creada con éxito! Bienvenido/a, ${nombre}.`);
          }
        }
      };
    }

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
    const btnAbrirPlanilla = document.getElementById('btnProfesorAbrirPlanilla');
    if (btnAbrirPlanilla) {
      btnAbrirPlanilla.onclick = () => {
        entrarAlJuego('profesor', { nombre: 'Profesor/a B-13' });
        if (typeof renderTeacherPanel === 'function') {
          renderTeacherPanel();
        }
        if (typeof openOverlayId === 'function') {
          openOverlayId('teacherOverlay');
        }
      };
    }

    const btnEntrarDocente = document.getElementById('btnProfesorEntrarJuego');
    if (btnEntrarDocente) {
      btnEntrarDocente.onclick = () => {
        entrarAlJuego('profesor', { nombre: 'Profesor/a B-13' });
      };
    }

    // Botón de Descargar Planilla Excel (.csv) con respaldo autónomo
    const btnDescargarCsv = document.getElementById('btnDescargarPlanillaDocente');
    if (btnDescargarCsv) {
      btnDescargarCsv.onclick = (e) => {
        if (window.location.protocol === 'file:' || !window.location.host) {
          e.preventDefault();
          exportarCsvLocalDocente();
        }
      };
    }

    function exportarCsvLocalDocente() {
      let estudiantes = [];
      if (typeof Auth !== 'undefined' && typeof Auth.getEstudiantes === 'function') {
        estudiantes = Auth.getEstudiantes();
      }
      const allProfiles = (typeof loadAllProfiles === 'function') ? loadAllProfiles() : {};

      let csv = 'Nombre,Curso,Genero,Correo,Puntaje,Fichas Potrero,Fichas Mapa,Insignias,Fecha Registro\n';

      if (estudiantes.length === 0 && Object.keys(allProfiles).length === 0) {
        const sName = (typeof state !== 'undefined' && state.studentName) ? state.studentName : 'Estudiante Demo';
        const sGrade = (typeof state !== 'undefined' && state.studentGrade) ? state.studentGrade : '1° Medio A';
        const sScore = (typeof state !== 'undefined' && state.score) ? state.score : 0;
        csv += `"${sName}","${sGrade}","No especificado","demo@granja.cl",${sScore},0,0,0,"${new Date().toLocaleDateString()}"\n`;
      } else {
        estudiantes.forEach(est => {
          const key = ((est.nombre || '').trim().toLowerCase() + '_' + (est.curso || '').trim().toLowerCase());
          const prof = allProfiles[key] || {};
          const stData = prof.stateData || {};
          const score = stData.score || prof.score || 0;
          const potreroDisc = (stData.discovered || []).length;
          const mapDisc = (stData.mapDiscovered || []).length;
          const badgesCount = (stData.badges || []).length;
          const cleanName = (est.nombre || '').replace(/"/g, '""');
          const cleanCurso = (est.curso || '').replace(/"/g, '""');
          const cleanGenero = (est.genero || '').replace(/"/g, '""');
          const cleanCorreo = (est.correo || '').replace(/"/g, '""');
          const fecha = est.fechaRegistro ? new Date(est.fechaRegistro).toLocaleDateString() : new Date().toLocaleDateString();

          csv += `"${cleanName}","${cleanCurso}","${cleanGenero}","${cleanCorreo}",${score},${potreroDisc},${mapDisc},${badgesCount},"${fecha}"\n`;
        });
      }

      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `planilla_calificaciones_granja_b13_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 150);
      if (typeof Auth !== 'undefined') Auth.mostrarNotificacion('📊 Planilla Excel (.csv) descargada con éxito.');
    }

    function mostrarNotifAdmin(msg) {
      const banner = document.getElementById('portalAdminNotif');
      if (banner) {
        banner.textContent = msg;
        banner.hidden = false;
        setTimeout(() => { banner.hidden = true; }, 4500);
      }
    }

    // Botón borrar solo respuestas y actividad
    const btnResetRespuestas = document.getElementById('portalResetRespuestasBtn');
    if (btnResetRespuestas) {
      btnResetRespuestas.onclick = () => {
        if (!confirm('¿Deseas vaciar todas las respuestas a quizzes y métricas de visitas? Los estudiantes registrados se conservarán.')) return;

        localStorage.setItem('granjaRespuestasQuiz', '[]');
        localStorage.setItem('granjaVisitasZonas', '{}');
        localStorage.setItem('granjaVisitasAnimales', '{}');
        localStorage.setItem('granjaActividadPorDia', '{}');

        // Limpiar respuestas en perfiles de alumnos
        try {
          const raw = localStorage.getItem('granja_b13_state_v3.profiles');
          if (raw) {
            const profiles = JSON.parse(raw);
            Object.keys(profiles).forEach(k => {
              if (profiles[k] && profiles[k].stateData) {
                profiles[k].stateData.score = 0;
                profiles[k].stateData.quiz = {};
                profiles[k].stateData.mapQuiz = {};
                profiles[k].score = 0;
                profiles[k].potreroQuizCompleted = 0;
                profiles[k].mapQuizCompleted = 0;
              }
            });
            localStorage.setItem('granja_b13_state_v3.profiles', JSON.stringify(profiles));
          }
        } catch (e) {}

        if (typeof state !== 'undefined') {
          state.score = 0;
          state.quiz = {};
          state.mapQuiz = {};
          if (typeof saveState === 'function') saveState();
        }

        renderizarEstadisticasAdmin();
        mostrarNotifAdmin('✅ Respuestas, visitas y métricas reiniciadas a cero.');
      };
    }

    // Botón reiniciar TODOS los datos en admin
    const btnResetDatos = document.getElementById('portalResetDatosBtn');
    if (btnResetDatos) {
      btnResetDatos.onclick = () => {
        if (!confirm('⚠️ ¿Estás seguro/a de borrar TODOS los registros (estudiantes, respuestas, visitas, puntajes y perfiles)? Esta acción dejará las estadísticas completamente en cero.')) return;

        // 1. Vaciar listas locales
        localStorage.setItem('granjaEstudiantes', '[]');
        localStorage.setItem('granjaRespuestasQuiz', '[]');
        localStorage.setItem('granjaVisitasZonas', '{}');
        localStorage.setItem('granjaVisitasAnimales', '{}');
        localStorage.setItem('granjaActividadPorDia', '{}');

        // 2. Eliminar estados de juego y perfiles
        [
          'granja_b13_state_v3',
          'granja_b13_state_v3.profiles',
          'granja_b13_state',
          'granja_b13_state_v2',
          'granjaSesion',
          'granjaSesionActiva',
          'granjaSeedEstudiantes',
          'granjaSeedVisitas',
          'granjaSeedQuizzes',
          'granjaSeedComentarios',
          'granjaComentariosQuiz'
        ].forEach(k => localStorage.removeItem(k));

        // 3. Eliminar claves dinámicas
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('granjaPuntaje_') || k.startsWith('granjaDecimas_')) {
            localStorage.removeItem(k);
          }
        });

        // 4. Reiniciar servidor backend si está activo
        try {
          if (typeof fetch === 'function') {
            fetch('/api/reset', { method: 'POST' }).catch(() => {});
          }
        } catch (e) {}

        // 5. Reiniciar estado en memoria
        if (typeof defaultStudentSession === 'function') {
          state = defaultStudentSession('', '');
          if (typeof saveState === 'function') saveState();
        }

        // 6. Actualizar pantalla admin
        renderizarEstadisticasAdmin();
        mostrarNotifAdmin('✅ Todos los registros y datos locales fueron borrados con éxito.');
      };
    }
  }

  const DEFAULT_FARM_ZONES = [
    { id: 'conejos', label: 'Conejeras Escolares', icon: '🐰' },
    { id: 'gallinas', label: 'Gallinero B-13', icon: '🐔' },
    { id: 'jaula-gallo', label: 'Jaula del Gallo Fino', icon: '🐓' },
    { id: 'arboleda', label: 'Arboleda y Pajarera', icon: '🌳' },
    { id: 'aviario', label: 'Aviario Australiano', icon: '🦜' },
    { id: 'potrero', label: 'Potrero Central', icon: '🌾' },
    { id: 'huerto', label: 'Huerto Orgánico', icon: '🥕' },
    { id: 'invernadero', label: 'Invernadero Pedagógico', icon: '🌱' },
    { id: 'compostera', label: 'Compostera Escolar', icon: '🍂' },
    { id: 'lombricultura', label: 'Lombricultura y Vermicompost', icon: '🪱' }
  ];

  // Renderizar Panel del Profesor (Zonas y lista de quizzes)
  function renderizarPanelProfesorPortal() {
    const selectZona = document.getElementById('portalQuizZona');
    const selectAutor = document.getElementById('portalQuizAutor');
    const lista = document.getElementById('portalQuizListaProfesor');
    const zonas = (typeof FARM_ZONES !== 'undefined' && FARM_ZONES.length > 0) ? FARM_ZONES : DEFAULT_FARM_ZONES;

    if (selectZona) {
      const prevVal = selectZona.value;
      selectZona.innerHTML = '<option value="" disabled ' + (!prevVal ? 'selected' : '') + '>Selecciona una zona...</option>' +
        zonas.map(z => `<option value="${z.id}" ${prevVal === z.id ? 'selected' : ''}>${z.icon} ${z.label}</option>`).join('');
    }

    if (selectAutor && typeof Auth !== 'undefined') {
      const sesion = Auth.getSesion();
      if (sesion && sesion.nombre && (sesion.rol === 'profesor' || sesion.rol === 'admin')) {
        const exists = Array.from(selectAutor.options).some(o => o.value === sesion.nombre);
        if (!exists) {
          const opt = document.createElement('option');
          opt.value = sesion.nombre;
          opt.textContent = `${sesion.nombre} (Docente en sesión)`;
          selectAutor.appendChild(opt);
        }
        selectAutor.value = sesion.nombre;
      }
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
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <h3 style="margin:0;">👥 Lista de Estudiantes (${estudiantes.length})</h3>
        </div>
        <div class="admin-lista-estudiantes" style="display:flex;flex-direction:column;gap:6px;max-height:220px;overflow-y:auto;">
          ${estudiantes.length === 0 ? '<p class="stat-empty">No hay estudiantes registrados actualmente.</p>' : estudiantes.map(e => `
            <div style="display:flex;justify-content:space-between;align-items:center;padding:7px 10px;border-bottom:1px solid rgba(255,216,61,0.2);background:rgba(0,0,0,0.2);border-radius:6px;font-size:0.82rem;color:#fff6de;">
              <div>
                <strong>${e.nombre}</strong> (${e.curso || 'Sin curso'})<br>
                <span style="color:#ffd83d;font-size:0.75rem;">${e.correo || 'Sin correo'}</span>
              </div>
              <button class="btn-borrar-estudiante" data-email="${e.correo || ''}" data-nombre="${e.nombre}" type="button" title="Eliminar estudiante y sus datos">
                🗑️ Borrar
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Vincular botones de borrar estudiante individual
    contenedor.querySelectorAll('.btn-borrar-estudiante').forEach(btn => {
      btn.onclick = () => {
        const email = btn.dataset.email;
        const nombre = btn.dataset.nombre;
        if (!confirm(`¿Eliminar al estudiante "${nombre}" y todos sus registros y respuestas?`)) return;

        // 1. Filtrar lista de estudiantes
        let lista = [];
        try {
          lista = JSON.parse(localStorage.getItem('granjaEstudiantes')) || [];
        } catch (e) {}
        lista = lista.filter(e => {
          const matchEmail = email && e.correo && e.correo.toLowerCase() === email.toLowerCase();
          const matchNombre = nombre && e.nombre && e.nombre.toLowerCase() === nombre.toLowerCase();
          return !matchEmail && !matchNombre;
        });
        localStorage.setItem('granjaEstudiantes', JSON.stringify(lista));

        // 2. Filtrar respuestas de quiz
        let resps = [];
        try {
          resps = JSON.parse(localStorage.getItem('granjaRespuestasQuiz')) || [];
        } catch (e) {}
        resps = resps.filter(r => {
          const matchEmail = email && r.correo && r.correo.toLowerCase() === email.toLowerCase();
          const matchNombre = nombre && r.nombre && r.nombre.toLowerCase() === nombre.toLowerCase();
          return !matchEmail && !matchNombre;
        });
        localStorage.setItem('granjaRespuestasQuiz', JSON.stringify(resps));

        // 3. Filtrar de perfiles guardados
        try {
          const raw = localStorage.getItem('granja_b13_state_v3.profiles');
          if (raw) {
            const profiles = JSON.parse(raw);
            Object.keys(profiles).forEach(k => {
              if (profiles[k] && profiles[k].studentName && profiles[k].studentName.toLowerCase() === (nombre || '').toLowerCase()) {
                delete profiles[k];
              }
            });
            localStorage.setItem('granja_b13_state_v3.profiles', JSON.stringify(profiles));
          }
        } catch (e) {}

        // 4. Servidor backend si está conectado
        try {
          if (typeof fetch === 'function') {
            fetch('/api/students/' + encodeURIComponent(email || nombre), { method: 'DELETE' }).catch(() => {});
          }
        } catch (e) {}

        renderizarEstadisticasAdmin();
        const banner = document.getElementById('portalAdminNotif');
        if (banner) {
          banner.textContent = `✅ Estudiante "${nombre}" y sus registros fueron eliminados.`;
          banner.hidden = false;
          setTimeout(() => { banner.hidden = true; }, 4000);
        }
      };
    });
  }

  document.addEventListener('DOMContentLoaded', inyectarPantallas);
})();
