/*
  auth-ui.js — Componentes visuales y modales interactivos para:
  1. Selector de Roles (Estudiante, Profesor, Visita, Admin)
  2. Login y Registro de Estudiante
  3. Login del Profesor y PIN de Administrador
  4. Modal del Desafío de Quiz del Profesor en el Mapa
*/

(function() {
  function inyectarModales() {
    if (document.getElementById('roleSelectModal')) return;

    const modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
      <!-- Modal 1: Selector de Roles -->
      <div class="role-modal-overlay" id="roleSelectModal">
        <div class="role-modal-card">
          <button class="close-btn" id="closeRoleModalBtn" type="button" aria-label="Cerrar">✕</button>
          <div style="text-align:center;margin-bottom:12px;">
            <img src="assets/img/logo.png" alt="Escudo B13" style="width:75px;height:75px;object-fit:contain;margin-bottom:6px;">
            <h2 class="role-modal-title">La Granjita B-13</h2>
            <div class="role-modal-sub">Liceo Domingo Herrera Rivera — Antofagasta</div>
            <p style="font-size:0.86rem;color:#444;margin:0 0 14px;">¿Cómo deseas ingresar a la plataforma?</p>
          </div>

          <div class="role-grid">
            <button class="role-btn-card" id="btnRolEstudiante" type="button">
              <span class="role-btn-icon">🎓</span>
              <div>
                <div class="role-btn-name">Modo Estudiante</div>
                <div class="role-btn-desc">Inicia sesión o regístrate para guardar tu progreso, responder quizzes y acumular décimas.</div>
              </div>
            </button>

            <button class="role-btn-card" id="btnRolProfesor" type="button">
              <span class="role-btn-icon">🍎</span>
              <div>
                <div class="role-btn-name">Modo Profesor</div>
                <div class="role-btn-desc">Revisa calificaciones, descarga informes del curso y crea nuevos quizzes para el mapa.</div>
              </div>
            </button>

            <button class="role-btn-card" id="btnRolVisita" type="button">
              <span class="role-btn-icon">🧭</span>
              <div>
                <div class="role-btn-name">Modo Visitas (Invitado)</div>
                <div class="role-btn-desc">Explora el mapa, los animales y la galería libremente sin necesidad de registrarte.</div>
              </div>
            </button>

            <button class="role-btn-card" id="btnRolAdmin" type="button">
              <span class="role-btn-icon">🔧</span>
              <div>
                <div class="role-btn-name">Administrador B-13</div>
                <div class="role-btn-desc">Acceso con PIN a estadísticas de uso, visitas por zona y métricas del colegio.</div>
              </div>
            </button>
          </div>

          <div id="activeSessionStatus" style="font-size:0.8rem;text-align:center;color:#666;margin-top:10px;"></div>
        </div>
      </div>

      <!-- Modal 2: Autenticación de Estudiante (Login / Registro) -->
      <div class="role-modal-overlay" id="authStudentModal">
        <div class="role-modal-card">
          <button class="close-btn" id="closeAuthStudentBtn" type="button" aria-label="Cerrar">✕</button>
          
          <div class="auth-tabs">
            <button class="auth-tab-btn active" id="tabLoginBtn" type="button">Iniciar Sesión</button>
            <button class="auth-tab-btn" id="tabRegisterBtn" type="button">Crear Cuenta</button>
          </div>

          <div class="auth-error-msg" id="authStudentError"></div>

          <!-- Formulario Login -->
          <form id="formLoginStudent">
            <div class="auth-input-group">
              <label class="auth-label">Correo electrónico:</label>
              <input class="auth-field" type="email" id="loginEmail" placeholder="ejemplo@granja.cl" value="demo@granja.cl" required autocomplete="username">
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Contraseña:</label>
              <input class="auth-field" type="password" id="loginPass" placeholder="••••••••" value="demo1234" required autocomplete="current-password">
            </div>
            <button class="tool-btn" type="submit" style="width:100%;padding:10px;background:var(--grass-dark);color:#fff;font-weight:700;font-size:0.9rem;margin-top:8px;">
              Entrar como Estudiante ➤
            </button>
            <div style="text-align:center;margin-top:10px;font-size:0.78rem;color:#666;">
              Cuenta de prueba rápida: <b>demo@granja.cl</b> / <b>demo1234</b>
            </div>
          </form>

          <!-- Formulario Registro -->
          <form id="formRegisterStudent" style="display:none;">
            <div class="auth-input-group">
              <label class="auth-label">Nombre completo:</label>
              <input class="auth-field" type="text" id="regName" placeholder="Tu nombre y apellido" required autocomplete="name">
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Curso (ej: 2°B, 7°A, etc.):</label>
              <input class="auth-field" type="text" id="regGrade" placeholder="Ej: 2°B" required>
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Género:</label>
              <select class="auth-field" id="regGender">
                <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Correo electrónico:</label>
              <input class="auth-field" type="email" id="regEmail" placeholder="tu_correo@liceo.cl" required autocomplete="username">
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Crea una Contraseña:</label>
              <input class="auth-field" type="password" id="regPass" placeholder="Mínimo 4 caracteres" required autocomplete="new-password">
            </div>
            <button class="tool-btn" type="submit" style="width:100%;padding:10px;background:var(--clay);color:#fff;font-weight:700;font-size:0.9rem;margin-top:8px;">
              Crear mi Cuenta y Entrar ➤
            </button>
          </form>
        </div>
      </div>

      <!-- Modal 3: Acceso Docente -->
      <div class="role-modal-overlay" id="profesorModal">
        <div class="role-modal-card">
          <button class="close-btn" id="closeProfesorModalBtn" type="button" aria-label="Cerrar">✕</button>
          <div style="text-align:center;margin-bottom:14px;">
            <span style="font-size:2rem;">🍎</span>
            <h2 class="role-modal-title">Acceso Docente</h2>
            <div class="role-modal-sub">Gestión pedagógica y evaluación formativa</div>
          </div>
          <div class="auth-error-msg" id="profesorError"></div>
          <form id="formLoginProfesor">
            <div class="auth-input-group">
              <label class="auth-label">Correo del profesor/a:</label>
              <input class="auth-field" type="email" id="profEmail" value="profesor@granja.cl" required autocomplete="username">
            </div>
            <div class="auth-input-group">
              <label class="auth-label">Contraseña:</label>
              <input class="auth-field" type="password" id="profPass" value="profesor1234" required autocomplete="current-password">
            </div>
            <button class="tool-btn" type="submit" style="width:100%;padding:10px;background:var(--grass-dark);color:#fff;font-weight:700;font-size:0.9rem;margin-top:8px;">
              Ingresar al Panel Docente ➤
            </button>
            <div style="text-align:center;margin-top:10px;font-size:0.78rem;color:#666;">
              Datos precargados de prueba: <b>profesor@granja.cl</b> / <b>profesor1234</b>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal 4: Acceso Administrador con PIN -->
      <div class="role-modal-overlay" id="adminPinModal">
        <div class="role-modal-card" style="max-width:360px;">
          <button class="close-btn" id="closeAdminPinBtn" type="button" aria-label="Cerrar">✕</button>
          <div style="text-align:center;margin-bottom:14px;">
            <span style="font-size:2rem;">🔧</span>
            <h2 class="role-modal-title">Administrador B-13</h2>
            <div class="role-modal-sub">Ingresa el PIN de seguridad de 4 dígitos</div>
          </div>
          <div class="auth-error-msg" id="adminError"></div>
          <form id="formAdminPin">
            <div class="auth-input-group" style="align-items:center;">
              <input class="auth-field" type="password" maxlength="4" id="inputAdminPin" placeholder="••••" style="width:140px;font-size:1.6rem;text-align:center;letter-spacing:0.3em;" required>
            </div>
            <button class="tool-btn" type="submit" style="width:100%;padding:10px;background:var(--ink);color:var(--paper);font-weight:700;font-size:0.9rem;margin-top:8px;">
              Desbloquear Estadísticas ➤
            </button>
            <div style="text-align:center;margin-top:10px;font-size:0.78rem;color:#666;">
              PIN de prueba: <b>1234</b>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal 5: Desafío de Quiz del Profesor en Zona del Mapa -->
      <div class="role-modal-overlay" id="teacherQuizModal">
        <div class="role-modal-card">
          <button class="close-btn" id="closeTeacherQuizBtn" type="button" aria-label="Cerrar">✕</button>
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;border-bottom:2px solid var(--ink);padding-bottom:10px;">
            <span style="font-size:1.8rem;">📝</span>
            <div>
              <h3 id="tqZoneTitle" style="font-family:'Fraunces',serif;margin:0;font-size:1.15rem;color:var(--ink);">Desafío del Profesor</h3>
              <div id="tqZoneSub" style="font-size:0.75rem;color:var(--grass-dark);font-weight:700;">Zona de la Granja B-13</div>
            </div>
          </div>

          <div id="tqContentWrap">
            <div id="tqProgress" style="font-family:'Space Mono',monospace;font-size:0.75rem;color:#666;margin-bottom:8px;"></div>
            <div id="tqQuestion" style="font-family:'Fraunces',serif;font-size:1.02rem;color:var(--ink);line-height:1.4;margin-bottom:14px;"></div>
            <div id="tqOptions" style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;"></div>
            <div id="tqFeedback" style="display:none;padding:8px 12px;border-radius:5px;font-size:0.85rem;line-height:1.35;margin-bottom:12px;"></div>
            <button id="tqNextBtn" class="tool-btn" type="button" style="display:none;width:100%;padding:10px;background:var(--grass-dark);color:#fff;font-weight:700;">
              Siguiente Pregunta ➤
            </button>
          </div>

          <div id="tqFinishWrap" style="display:none;text-align:center;padding:12px 0;">
            <div style="font-size:2.5rem;margin-bottom:8px;">🌟</div>
            <h3 style="font-family:'Fraunces',serif;font-size:1.2rem;margin:0 0 6px;">¡Desafío Completado!</h3>
            <p id="tqFinalSummary" style="font-size:0.9rem;line-height:1.4;color:#444;margin-bottom:14px;"></p>
            <button id="tqCloseFinishBtn" class="tool-btn" type="button" style="padding:10px 18px;background:var(--hay);color:var(--ink);font-weight:700;">
              ✓ Volver al Mapa
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);
    enlazarEventosModales();
  }

  function enlazarEventosModales() {
    // Abrir selector de roles al pulsar la píldora superior
    const studentPill = document.getElementById('studentPill');
    if (studentPill) {
      studentPill.addEventListener('click', () => {
        Auth.abrirSelectorRoles();
        actualizarEstadoSesionModal();
      });
    }

    // Botones del selector de roles
    const btnEstudiante = document.getElementById('btnRolEstudiante');
    const btnProfesor = document.getElementById('btnRolProfesor');
    const btnVisita = document.getElementById('btnRolVisita');
    const btnAdmin = document.getElementById('btnRolAdmin');

    if (btnEstudiante) {
      btnEstudiante.addEventListener('click', () => {
        Auth.cerrarModales();
        document.getElementById('authStudentModal').classList.add('active');
      });
    }
    if (btnProfesor) {
      btnProfesor.addEventListener('click', () => {
        Auth.cerrarModales();
        document.getElementById('profesorModal').classList.add('active');
      });
    }
    if (btnVisita) {
      btnVisita.addEventListener('click', () => {
        Auth.entrarVisita();
      });
    }
    if (btnAdmin) {
      btnAdmin.addEventListener('click', () => {
        Auth.cerrarModales();
        document.getElementById('adminPinModal').classList.add('active');
      });
    }

    // Botones de cierre
    const closures = [
      ['closeRoleModalBtn', 'roleSelectModal'],
      ['closeAuthStudentBtn', 'authStudentModal'],
      ['closeProfesorModalBtn', 'profesorModal'],
      ['closeAdminPinBtn', 'adminPinModal'],
      ['closeTeacherQuizBtn', 'teacherQuizModal'],
      ['tqCloseFinishBtn', 'teacherQuizModal']
    ];
    closures.forEach(([btnId, modalId]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          const m = document.getElementById(modalId);
          if (m) m.classList.remove('active');
        });
      }
    });

    // Pestañas Login vs Registro en Estudiante
    const tabLogin = document.getElementById('tabLoginBtn');
    const tabReg = document.getElementById('tabRegisterBtn');
    const formLogin = document.getElementById('formLoginStudent');
    const formReg = document.getElementById('formRegisterStudent');

    if (tabLogin && tabReg && formLogin && formReg) {
      tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabReg.classList.remove('active');
        formLogin.style.display = 'block';
        formReg.style.display = 'none';
        document.getElementById('authStudentError').style.display = 'none';
      });
      tabReg.addEventListener('click', () => {
        tabReg.classList.add('active');
        tabLogin.classList.remove('active');
        formLogin.style.display = 'none';
        formReg.style.display = 'block';
        document.getElementById('authStudentError').style.display = 'none';
      });
    }

    // Submit Login Estudiante
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPass').value;
        const errEl = document.getElementById('authStudentError');

        const res = Auth.loginEstudiante(email, pass);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';
        Auth.cerrarModales();
        Auth.mostrarNotificacion(`¡Bienvenido/a, ${Auth.getSesion().nombre}!`);
        setTimeout(() => location.reload(), 350);
      });
    }

    // Submit Registro Estudiante
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const grade = document.getElementById('regGrade').value.trim();
        const gender = document.getElementById('regGender').value;
        const email = document.getElementById('regEmail').value.trim();
        const pass = document.getElementById('regPass').value;
        const errEl = document.getElementById('authStudentError');

        const res = Auth.registroEstudiante(name, grade, gender, email, pass);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';
        Auth.cerrarModales();
        Auth.mostrarNotificacion(`¡Cuenta creada con éxito! Bienvenido/a, ${name}.`);
        setTimeout(() => location.reload(), 350);
      });
    }

    // Submit Login Profesor
    const formProf = document.getElementById('formLoginProfesor');
    if (formProf) {
      formProf.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('profEmail').value.trim();
        const pass = document.getElementById('profPass').value;
        const errEl = document.getElementById('profesorError');

        const res = Auth.loginProfesor(email, pass);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';
        Auth.cerrarModales();
        Auth.mostrarNotificacion('¡Sesión Docente iniciada!');
        if (typeof openOverlayId === 'function') {
          openOverlayId('teacherOverlay');
        }
      });
    }

    // Submit Admin PIN
    const formAdmin = document.getElementById('formAdminPin');
    if (formAdmin) {
      formAdmin.addEventListener('submit', (e) => {
        e.preventDefault();
        const pin = document.getElementById('inputAdminPin').value;
        const errEl = document.getElementById('adminError');

        const res = Auth.loginAdmin(pin);
        if (!res.ok) {
          errEl.textContent = res.error;
          errEl.style.display = 'block';
          return;
        }
        errEl.style.display = 'none';
        Auth.cerrarModales();
        Auth.mostrarNotificacion('¡Acceso Administrador concedido!');
        if (typeof openOverlayId === 'function') {
          openOverlayId('teacherOverlay');
          // Cambiar a la pestaña de estadísticas
          setTimeout(() => {
            const btnStats = document.querySelector('[data-ttab="stats"]');
            if (btnStats) btnStats.click();
          }, 150);
        }
      });
    }
  }

  function actualizarEstadoSesionModal() {
    const statusEl = document.getElementById('activeSessionStatus');
    if (!statusEl) return;
    const s = Auth.getSesion();
    if (s.rol === 'visita') {
      statusEl.innerHTML = 'Actualmente en <b>Modo Visitas</b>.';
    } else {
      statusEl.innerHTML = `Sesión activa: <b>${s.nombre}</b> (${s.rol}) · <a href="#" id="linkCerrarSesion" style="color:#B22222;font-weight:700;text-decoration:underline;">Cerrar sesión</a>`;
      const link = document.getElementById('linkCerrarSesion');
      if (link) {
        link.onclick = (e) => {
          e.preventDefault();
          Auth.cerrarSesion();
        };
      }
    }
  }

  // Desafío de Quiz del Profesor en una zona del mapa
  window.abrirQuizProfesorZona = function(zonaId, zonaLabel) {
    const preguntas = TeacherQuizzes.getForZone(zonaId);
    if (!preguntas || preguntas.length === 0) {
      Auth.mostrarNotificacion('Esta zona aún no tiene quizzes creados por el profesor.');
      return;
    }

    const modal = document.getElementById('teacherQuizModal');
    const titleEl = document.getElementById('tqZoneTitle');
    const subEl = document.getElementById('tqZoneSub');
    const progressEl = document.getElementById('tqProgress');
    const questionEl = document.getElementById('tqQuestion');
    const optionsEl = document.getElementById('tqOptions');
    const feedbackEl = document.getElementById('tqFeedback');
    const nextBtn = document.getElementById('tqNextBtn');
    const contentWrap = document.getElementById('tqContentWrap');
    const finishWrap = document.getElementById('tqFinishWrap');

    if (!modal) return;

    titleEl.textContent = `Desafío Docente: ${zonaLabel}`;
    subEl.textContent = `Preguntas creadas por profesores del Liceo B-13`;
    contentWrap.style.display = 'block';
    finishWrap.style.display = 'none';

    let currentIdx = 0;
    let correctCount = 0;
    let totalDecimasGanadas = 0;

    function renderQuestion() {
      const q = preguntas[currentIdx];
      progressEl.textContent = `PREGUNTA ${currentIdx + 1} DE ${preguntas.length} · +${(q.decimas || 0.3).toFixed(1)} DÉCIMAS`;
      questionEl.textContent = q.pregunta;
      optionsEl.innerHTML = '';
      feedbackEl.style.display = 'none';
      nextBtn.style.display = 'none';

      q.opciones.forEach((opc, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'tool-btn';
        btn.style.cssText = 'width:100%;text-align:left;padding:10px 14px;background:#fff;border:2px solid var(--ink);border-radius:6px;font-size:0.88rem;cursor:pointer;';
        btn.textContent = `${['A', 'B', 'C', 'D'][idx]}) ${opc}`;

        btn.addEventListener('click', () => {
          // Deshabilitar todos los botones
          optionsEl.querySelectorAll('button').forEach(b => b.disabled = true);

          const isCorrect = idx === q.correcta;
          Auth.registrarRespuestaQuiz(isCorrect, zonaId);

          if (isCorrect) {
            btn.style.background = '#D4EDDA';
            btn.style.borderColor = '#28A745';
            btn.style.color = '#155724';
            feedbackEl.style.background = '#D4EDDA';
            feedbackEl.style.border = '1px solid #28A745';
            feedbackEl.style.color = '#155724';
            feedbackEl.innerHTML = `<b>¡Correcto! 🎉</b> Ganaste +${(q.decimas || 0.3).toFixed(1)} décimas de evaluación formativa.`;
            correctCount++;
            totalDecimasGanadas += (q.decimas || 0.3);
            if (typeof playSoundSuccess === 'function') playSoundSuccess();
          } else {
            btn.style.background = '#F8D7DA';
            btn.style.borderColor = '#DC3545';
            btn.style.color = '#721C24';
            feedbackEl.style.background = '#F8D7DA';
            feedbackEl.style.border = '1px solid #DC3545';
            feedbackEl.style.color = '#721C24';
            const optCorrecta = q.opciones[q.correcta];
            feedbackEl.innerHTML = `<b>Incorrecto.</b> La respuesta correcta era: <i>${optCorrecta}</i>.`;
            if (typeof playSoundError === 'function') playSoundError();
          }
          feedbackEl.style.display = 'block';

          if (currentIdx < preguntas.length - 1) {
            nextBtn.textContent = 'Siguiente Pregunta ➤';
            nextBtn.style.display = 'block';
          } else {
            nextBtn.textContent = 'Ver Resultados Finales ➤';
            nextBtn.style.display = 'block';
          }
        });

        optionsEl.appendChild(btn);
      });
    }

    nextBtn.onclick = () => {
      currentIdx++;
      if (currentIdx < preguntas.length) {
        renderQuestion();
      } else {
        contentWrap.style.display = 'none';
        finishWrap.style.display = 'block';
        const finalEl = document.getElementById('tqFinalSummary');
        finalEl.innerHTML = `
          Respondiste correctamente <b>${correctCount} de ${preguntas.length}</b> preguntas.<br>
          Acumulaste un bono de <b>+${totalDecimasGanadas.toFixed(1)} décimas</b> sugeridas para tu calificación de ciencias.
        `;
        if (typeof state !== 'undefined' && typeof saveState === 'function') {
          state.score += (correctCount * 10);
          saveState();
        }
      }
    };

    renderQuestion();
    modal.classList.add('active');
  };

  document.addEventListener('DOMContentLoaded', inyectarModales);
})();
