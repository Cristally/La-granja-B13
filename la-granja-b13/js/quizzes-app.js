/*
  quizzes-app.js — Controlador dedicado de la Vista de Desafíos & Quizzes Formativos
  Permite a los estudiantes responder preguntas sobre cada animal y tema agroecológico,
  acumulando décimas oficiales para su calificación sin saturar el mapa ni la experiencia.
  Liceo Domingo Herrera Rivera B-13 Antofagasta.
*/

(function() {
  'use strict';

  let currentCategory = 'all';
  let activeQuizItem = null;
  let activeQuestions = [];
  let currentQuestionIdx = 0;
  let currentAnswers = [];
  let questionAnswered = false;

  // Colección unificada de Quizzes Formativos
  function getAllQuizzes() {
    const list = [];
    const seen = new Set();

    // 1. Quizzes de los 23 animales oficiales (usando su especie facts/quiz)
    if (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) {
      MAP_ANIMALS.forEach(a => {
        const key = 'animal_' + a.id;
        if (!seen.has(key)) {
          seen.add(key);

          // Obtener preguntas asociadas (específicas o de su especie base)
          let qList = (a.quiz && a.quiz.length) ? a.quiz : [];
          if (!qList.length && typeof ANIMALS !== 'undefined') {
            const sp = ANIMALS.find(x => x.id === a.species || x.id === a.id);
            if (sp && sp.quiz) qList = sp.quiz;
          }

          // Si aún no tiene preguntas directas, generar preguntas zootécnicas pedagógicas
          if (!qList.length) {
            qList = generatePedagogicalQuestions(a);
          }

          list.push({
            id: a.id,
            uniqueId: key,
            type: 'animal',
            group: a.group || (a.id.includes('conejo') ? 'conejos' : 'gallinas'),
            title: `Desafío: ${a.name}`,
            subtitle: a.lat || 'Fauna Oficial Liceo B-13',
            thumb: a.photo_real || a.photo || a.img_real,
            desc: a.blurb || 'Demuestra lo que aprendiste sobre su alimentación, hábitat y bienestar.',
            questions: qList,
            storageKey: a.id,
            isMap: true
          });
        }
      });
    }

    // 2. Desafío General de Bioética y Normas ODS 15
    list.push({
      id: 'bioetica_ods15',
      uniqueId: 'bioetica_ods15',
      type: 'bioetica',
      group: 'bioetica',
      title: 'Desafío: Bioética & Normas ODS 15',
      subtitle: 'Protocolos de convivencia y bienestar animal escolar',
      thumb: 'assets/img/real/huerto_bancales.jpg',
      desc: 'Preguntas sobre las 6 normas oficiales de la granja y el compromiso con la vida terrestre.',
      questions: [
        {
          q: '¿Por qué está prohibido alimentar a los animales con restos de comida de los alumnos sin autorización docente?',
          options: [
            'Para que no engorden antes del recreo',
            'Porque alimentos ultraprocesados o con sal/azúcar dañan gravemente su sistema digestivo',
            'Porque los animales solo comen de noche',
            'Porque se pueden volver desobedientes'
          ],
          a: 1,
          difficulty: 'facil',
          points: 10,
          explain: 'Los alimentos humanos contienen sal, condimentos, cebolla o azúcares que causan cólicos, intoxicaciones o maloclusiones.'
        },
        {
          q: '¿Qué actitud deben mantener los estudiantes al ingresar a la zona de corrales y nidos?',
          options: [
            'Gritar fuerte para avisar que llegaron',
            'Silencio, respeto y movimientos suaves para no generar estrés acústico',
            'Correr en círculos para hacerles ejercicio',
            'Tomar fotos con flash a 5 centímetros'
          ],
          a: 1,
          difficulty: 'facil',
          points: 10,
          explain: 'Las aves y conejos son animales presa hipersensibles a ruidos repentinos y movimientos bruscos.'
        },
        {
          q: '¿Con qué Objetivos de Desarrollo Sostenible (ODS) de las Naciones Unidas se alinea el proyecto La Granja B-13?',
          options: [
            'ODS 1 (Fin de la pobreza) y ODS 2 (Hambre cero)',
            'ODS 4 (Educación de Calidad) y ODS 15 (Vida de Ecosistemas Terrestres)',
            'ODS 7 (Energía no contaminante) y ODS 9 (Industria)',
            'ODS 14 (Vida submarina exclusivamente)'
          ],
          a: 1,
          difficulty: 'medio',
          points: 15,
          explain: 'La Granja B-13 promueve aprendizaje vivencial de calidad (ODS 4) y respeto/conservación de la biodiversidad (ODS 15).'
        }
      ],
      storageKey: 'bioetica_ods15',
      isMap: false
    });

    // 3. Quizzes personalizados creados por el profesorado
    if (typeof TeacherQuizzes !== 'undefined' && typeof TeacherQuizzes.getAll === 'function') {
      const teacherObj = TeacherQuizzes.getAll();
      Object.keys(teacherObj).forEach(zoneId => {
        const tQuestions = teacherObj[zoneId];
        if (Array.isArray(tQuestions) && tQuestions.length > 0) {
          list.push({
            id: 'docente_' + zoneId,
            uniqueId: 'docente_' + zoneId,
            type: 'docente',
            group: 'docente',
            title: `Quiz Docente: Zona ${zoneId.toUpperCase()}`,
            subtitle: 'Evaluación oficial asignada por tu profesor/a',
            thumb: 'assets/img/real/pozo_real.jpg',
            desc: `Preguntas formativas diseñadas por el equipo pedagógico (${tQuestions.length} preguntas).`,
            questions: tQuestions.map(tq => ({
              q: tq.pregunta,
              options: tq.opciones,
              a: tq.correcta,
              difficulty: 'medio',
              points: (tq.decimas || 1) * 10,
              explain: `Pregunta oficial formulada por: ${tq.autor || 'Profesor/a B-13'}.`
            })),
            storageKey: zoneId,
            isTeacher: true
          });
        }
      });
    }

    return list;
  }

  // Generador de preguntas zootécnicas de respaldo con base científica
  function generatePedagogicalQuestions(a) {
    if (a.group === 'conejos' || a.id.includes('conejo')) {
      return [
        {
          q: `¿Qué proceso fisiológico vital realiza ${a.name} para reabsorber nutrientes y vitaminas del complejo B?`,
          options: ['Cecotrofia en el ciego digestivo', 'Rumia con cuatro estómagos', 'Fotosíntesis epidérmica', 'Hibernación invernal'],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'Los conejos ingieren cecotrofos blandos fermentados para aprovechar proteína bacteriana y vitaminas producidas en su ciego.'
        },
        {
          q: `¿Cuál es el alimento base e indispensable que debe constituir al menos el 80% de la dieta de ${a.name}?`,
          options: ['Heno fresco de alta fibra', 'Zanahorias dulces en trozos', 'Pan remojado con leche', 'Semillas de maravilla con sal'],
          a: 0,
          difficulty: 'facil',
          points: 10,
          explain: 'El heno de gramíneas desgasta los incisivos de crecimiento continuo y previene estasis gastrointestinal.'
        },
        {
          q: `¿Cómo reacciona ${a.name} cuando experimenta un momento de profunda alegría y bienestar en la conejera?`,
          options: ['Realiza brincos acrobáticos y giros en el aire llamados binky', 'Muerde fuertemente los barrotes', 'Se esconde sin respirar', 'Canta como un gallo'],
          a: 0,
          difficulty: 'facil',
          points: 10,
          explain: 'El binky es un salto con contorsión en el aire que expresa felicidad y relajación en lagomorfos.'
        }
      ];
    } else if (a.group === 'patos' || a.id.includes('pato') || a.id === 'sal' || a.id === 'pimienta') {
      return [
        {
          q: `¿Qué estructura glandular secreta la sustancia oleosa que ${a.name} esparce en sus plumas para mantenerse seco?`,
          options: ['Glándula uropígea sobre la base de la cola', 'Glándulas sudoríparas en las patas', 'Glándula salival anterior', 'Hígado dorsal'],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'La glándula uropígea impermeabiliza el plumaje, permitiendo al pato flotar sin que el agua moje su piel.'
        },
        {
          q: `¿Por qué está estrictamente prohibido alimentar a ${a.name} con pan blanco refinado en el liceo?`,
          options: ['Provoca malnutrición y la malformación conocida como ala de ángel', 'Hace que floten demasiado rápido', 'Les cambia el color de los ojos', 'No les gusta el trigo'],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'El exceso de carbohidratos simples y falta de micronutrientes causa crecimiento óseo deforme en las alas.'
        }
      ];
    } else {
      return [
        {
          q: `¿Qué función cumple la cresta muy vascularizada de ${a.name} en días soleados de Antofagasta?`,
          options: ['Disipador térmico para regular la temperatura corporal', 'Antena receptora de sonidos lejanos', 'Almacén de calcio para los huesos', 'Defensa contra parásitos'],
          a: 0,
          difficulty: 'facil',
          points: 10,
          explain: 'Al no poder sudar, las aves usan su cresta y barbillas como radiadores biológicos para disipar calor corporal.'
        },
        {
          q: `¿Dado que las aves carecen de dientes, en qué órgano ${a.name} tritura los granos con piedrecillas?`,
          options: ['En la molleja muscular (ventrículo)', 'En el buche esofágico', 'En el colon anterior', 'En el paladar'],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'La molleja posee paredes musculares hipertrofiadas que muelen mecánicamente el grano duro.'
        }
      ];
    }
  }

  function init() {
    setupCategories();
    renderQuizzesList();
    updateStatsBanner();
    setupPlayerEvents();
    if (typeof updateStudentUI === 'function') updateStudentUI();
    if (typeof updateHeader === 'function') updateHeader();
  }

  function setupCategories() {
    const nav = document.getElementById('quizzesCatNav');
    if (!nav) return;
    nav.querySelectorAll('.quizzes-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        nav.querySelectorAll('.quizzes-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat || 'all';
        renderQuizzesList();
      });
    });
  }

  function renderQuizzesList() {
    const grid = document.getElementById('quizzesGrid');
    if (!grid) return;

    const all = getAllQuizzes();
    const filtered = all.filter(item => {
      if (currentCategory === 'all') return true;
      if (currentCategory === 'conejos') return item.group === 'conejos';
      if (currentCategory === 'gallinas') return item.group === 'gallinas';
      if (currentCategory === 'loros') return item.group === 'loros';
      if (currentCategory === 'patos') return item.group === 'patos';
      if (currentCategory === 'bioetica') return item.group === 'bioetica';
      if (currentCategory === 'docente') return item.group === 'docente';
      return true;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;background:#fff;border-radius:16px;border:2px dashed #cbd5e1;">
          <div style="font-size:2.5rem;margin-bottom:8px;">🔍</div>
          <h3 style="margin:0 0 4px;font-family:'Fraunces',serif;">No hay desafíos en esta categoría</h3>
          <p style="margin:0;color:#64748b;font-size:0.9rem;">Prueba seleccionando otra categoría en la barra superior.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(item => {
      const isDone = checkQuizDone(item);
      const scoreEarned = getQuizScore(item);
      const totalQuestions = item.questions.length;
      const totalPoints = item.questions.reduce((acc, q) => acc + (q.points || 10), 0);

      const statusPill = isDone
        ? `<span class="quiz-card-pill pill-status-done">✅ Completado (+${scoreEarned} pts)</span>`
        : `<span class="quiz-card-pill pill-status-pending">⏳ Disponible (+${totalPoints} pts)</span>`;

      const playBtnText = isDone ? '🔄 Repasar Desafío' : '▶️ Iniciar Desafío';
      const playBtnStyle = isDone ? 'background:#e2e8f0;color:#334155;' : '';

      const fichaBtn = item.type === 'animal'
        ? `<a href="ficha.html?id=${encodeURIComponent(item.id)}&from=quizzes.html" class="quiz-btn-ficha" title="Estudiar ficha de campo">📖 Ficha</a>`
        : '';

      return `
        <div class="quiz-card ${isDone ? 'completed' : ''}" data-qid="${item.uniqueId}">
          <div class="quiz-card-head">
            <div class="quiz-card-thumb-wrap">
              <img src="${item.thumb}" alt="${item.title}">
            </div>
            <div class="quiz-card-meta">
              <h3 class="quiz-card-title">${item.title}</h3>
              <div class="quiz-card-sub">${item.subtitle}</div>
            </div>
          </div>
          <div class="quiz-card-body">
            <div class="quiz-card-info-pills">
              ${statusPill}
              <span class="quiz-card-pill">${totalQuestions} preguntas</span>
            </div>
            <p class="quiz-card-desc">${item.desc}</p>
            <div class="quiz-card-actions">
              <button type="button" class="quiz-btn-play" style="${playBtnStyle}" data-action="play" data-qid="${item.uniqueId}">
                ${playBtnText}
              </button>
              ${fichaBtn}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Eventos de botones
    grid.querySelectorAll('button[data-action="play"]').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const target = all.find(x => x.uniqueId === qid);
        if (target) {
          startQuizPlayer(target);
        }
      });
    });
  }

  function checkQuizDone(item) {
    if (!state) return false;
    if (item.isTeacher) {
      return !!(state.teacherQuizzes && state.teacherQuizzes[item.storageKey] && state.teacherQuizzes[item.storageKey].completed);
    }
    if (item.isMap && state.mapQuiz && state.mapQuiz[item.storageKey]) {
      return !!state.mapQuiz[item.storageKey].completed;
    }
    if (state.quiz && state.quiz[item.storageKey]) {
      return !!state.quiz[item.storageKey].completed;
    }
    return false;
  }

  function getQuizScore(item) {
    if (!state) return 0;
    if (item.isTeacher && state.teacherQuizzes && state.teacherQuizzes[item.storageKey]) {
      return state.teacherQuizzes[item.storageKey].scoreEarned || 0;
    }
    if (item.isMap && state.mapQuiz && state.mapQuiz[item.storageKey]) {
      return state.mapQuiz[item.storageKey].scoreEarned || 0;
    }
    if (state.quiz && state.quiz[item.storageKey]) {
      return state.quiz[item.storageKey].scoreEarned || 0;
    }
    return 0;
  }

  function updateStatsBanner() {
    const all = getAllQuizzes();
    const completedCount = all.filter(x => checkQuizDone(x)).length;
    const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : (state.pureScore || 0);
    const decimas = (purePts / 10).toFixed(1);

    const totalEl = document.getElementById('statTotalScore');
    const doneEl = document.getElementById('statQuizzesDone');
    const decEl = document.getElementById('statDecimasTotal');
    const topScoreEl = document.getElementById('score');
    const topDecEl = document.getElementById('quizzesScoreEarned');

    if (totalEl) totalEl.textContent = purePts;
    if (doneEl) doneEl.textContent = `${completedCount} / ${all.length}`;
    if (decEl) decEl.textContent = `${decimas} pts`;
    if (topScoreEl) topScoreEl.textContent = purePts;
    if (topDecEl) topDecEl.textContent = decimas;
  }

  /* ============================================================
     JUGADOR DE QUIZ INTERACTIVO
     ============================================================ */

  function startQuizPlayer(quizItem) {
    activeQuizItem = quizItem;
    activeQuestions = quizItem.questions;
    currentQuestionIdx = 0;
    currentAnswers = [];
    questionAnswered = false;

    const overlay = document.getElementById('quizPlayerOverlay');
    const thumb = document.getElementById('playerThumb');
    const title = document.getElementById('playerTitle');
    const subtitle = document.getElementById('playerSubtitle');

    if (thumb) thumb.src = quizItem.thumb;
    if (title) title.textContent = quizItem.title;
    if (subtitle) subtitle.textContent = quizItem.subtitle;

    renderQuestion();

    if (overlay) {
      overlay.style.display = 'flex';
      overlay.classList.add('open');
    }
  }

  function renderQuestion() {
    questionAnswered = false;
    const q = activeQuestions[currentQuestionIdx];
    if (!q) {
      finishQuiz();
      return;
    }

    const total = activeQuestions.length;
    const progPercent = Math.round((currentQuestionIdx / total) * 100);

    const progFill = document.getElementById('playerProgFill');
    const qIdxEl = document.getElementById('playerQuestionIndex');
    const qText = document.getElementById('playerQuestionText');
    const optsList = document.getElementById('playerOptionsList');
    const feedbackBox = document.getElementById('playerFeedbackBox');
    const nextBtn = document.getElementById('playerNextBtn');

    if (progFill) progFill.style.width = progPercent + '%';
    if (qIdxEl) qIdxEl.textContent = `Pregunta ${currentQuestionIdx + 1} de ${total}`;
    if (qText) qText.textContent = q.q;

    if (feedbackBox) {
      feedbackBox.className = 'quiz-feedback-box';
      feedbackBox.style.display = 'none';
    }
    if (nextBtn) {
      nextBtn.style.display = 'none';
      nextBtn.textContent = (currentQuestionIdx + 1 === total) ? '🏆 Finalizar Desafío' : 'Siguiente Pregunta ➔';
    }

    if (optsList) {
      const letters = ['A', 'B', 'C', 'D'];
      optsList.innerHTML = q.options.map((opt, i) => `
        <button type="button" class="quiz-option-btn" data-opt="${i}">
          <b style="color:#2563eb;font-family:'Space Mono',monospace;">${letters[i]})</b>
          <span>${opt}</span>
        </button>
      `).join('');

      optsList.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          if (questionAnswered) return;
          const pickedIdx = parseInt(btn.dataset.opt, 10);
          handleAnswerPick(pickedIdx, q);
        });
      });
    }
  }

  function handleAnswerPick(pickedIdx, q) {
    questionAnswered = true;
    const isCorrect = pickedIdx === q.a;
    currentAnswers.push(isCorrect);

    const optsList = document.getElementById('playerOptionsList');
    const feedbackBox = document.getElementById('playerFeedbackBox');
    const feedbackTitle = document.getElementById('playerFeedbackTitle');
    const feedbackExplain = document.getElementById('playerFeedbackExplain');
    const nextBtn = document.getElementById('playerNextBtn');

    if (optsList) {
      optsList.querySelectorAll('.quiz-option-btn').forEach(btn => {
        btn.disabled = true;
        const optIdx = parseInt(btn.dataset.opt, 10);
        if (optIdx === q.a) {
          btn.classList.add('opt-correct');
        } else if (optIdx === pickedIdx && !isCorrect) {
          btn.classList.add('opt-wrong');
        }
      });
    }

    if (isCorrect) {
      if (typeof AudioFX !== 'undefined' && typeof AudioFX.correct === 'function') AudioFX.correct();
      if (feedbackBox) {
        feedbackBox.className = 'quiz-feedback-box correct';
        feedbackBox.style.display = 'block';
      }
      if (feedbackTitle) feedbackTitle.textContent = '🌟 ¡Respuesta Correcta!';
    } else {
      if (typeof AudioFX !== 'undefined' && typeof AudioFX.wrong === 'function') AudioFX.wrong();
      if (feedbackBox) {
        feedbackBox.className = 'quiz-feedback-box incorrect';
        feedbackBox.style.display = 'block';
      }
      if (feedbackTitle) feedbackTitle.textContent = '💡 Casi, revisemos el fundamento:';
    }

    if (feedbackExplain) {
      feedbackExplain.textContent = q.explain || 'Aprender de cada observación es la base del rigor científico.';
    }

    if (nextBtn) {
      nextBtn.style.display = 'block';
    }
  }

  function setupPlayerEvents() {
    const nextBtn = document.getElementById('playerNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQuestionIdx++;
        if (currentQuestionIdx < activeQuestions.length) {
          renderQuestion();
        } else {
          finishQuiz();
        }
      });
    }

    const overlay = document.getElementById('quizPlayerOverlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        if (e.target === overlay || e.target.classList.contains('close-btn')) {
          overlay.classList.remove('open');
          overlay.style.display = 'none';
        }
      });
    }
  }

  function finishQuiz() {
    const overlay = document.getElementById('quizPlayerOverlay');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.style.display = 'none';
    }

    const correctCount = currentAnswers.filter(Boolean).length;
    const totalCount = activeQuestions.length;
    const pointsPerQ = 10;
    const scoreEarned = correctCount * pointsPerQ;

    // Actualizar estado del estudiante
    if (state && activeQuizItem) {
      const key = activeQuizItem.storageKey;
      const quizRecord = {
        index: totalCount,
        answers: currentAnswers.map(x => x ? 1 : 0),
        results: currentAnswers,
        completed: true,
        scoreEarned: scoreEarned,
        completedAt: Date.now()
      };

      if (activeQuizItem.isTeacher) {
        if (!state.teacherQuizzes) state.teacherQuizzes = {};
        state.teacherQuizzes[key] = quizRecord;
      } else if (activeQuizItem.isMap) {
        if (!state.mapQuiz) state.mapQuiz = {};
        state.mapQuiz[key] = quizRecord;
      } else {
        if (!state.quiz) state.quiz = {};
        state.quiz[key] = quizRecord;
      }

      saveState();

      // Guardar puntaje en el servidor para ranking y panel docente
      if (typeof Auth !== 'undefined' && typeof Auth.guardarPuntaje === 'function') {
        Auth.guardarPuntaje(state.pureScore, 'quiz_' + key);
      }
      if (typeof checkBadges === 'function') checkBadges();
    }

    updateStatsBanner();
    renderQuizzesList();

    // Mensaje toast de felicitación
    const decimaEquiv = (scoreEarned / 10).toFixed(1);
    if (typeof showToast === 'function') {
      showToast(`🎉 ¡Desafío completado! Ganaste +${scoreEarned} puntos (+${decimaEquiv} décimas)`);
    }

    if (typeof AudioFX !== 'undefined' && typeof AudioFX.victory === 'function') {
      AudioFX.victory();
    }
  }

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
