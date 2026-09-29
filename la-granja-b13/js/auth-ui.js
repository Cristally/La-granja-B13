/*
  auth-ui.js — Componentes visuales y modales interactivos para:
  1. Selector de Roles (Estudiante, Profesor, Visita, Admin)
  2. Login y Registro de Estudiante
  3. Login del Profesor y PIN de Administrador
  4. Modal del Desafío de Quiz del Profesor en el Mapa
*/

(function() {
  function inyectarModales() {
    if (document.getElementById('teacherQuizModal')) return;

    const modalWrap = document.createElement('div');
    modalWrap.innerHTML = `
      <!-- Modal: Desafío de Quiz del Profesor en Zona del Mapa -->
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
    const closures = [
      ['closeTeacherQuizBtn', 'teacherQuizModal'],
      ['tqCloseFinishBtn', 'teacherQuizModal']
    ];
    closures.forEach(([btnId, modalId]) => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.addEventListener('click', () => {
          const m = document.getElementById(modalId);
          if (m) {
            m.classList.remove('active');
            m.style.display = 'none';
          }
        });
      }
    });
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
            feedbackEl.innerHTML = `<b>¡Correcto! 🎉</b> Ganaste +${(q.decimas || 0.3).toFixed(1)} décimas de aprendizaje.`;
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
