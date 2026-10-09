/*
  quizzes-app.js — Controlador dedicado de la Vista de Desafíos & Quizzes Formativos
  Permite a los estudiantes responder preguntas sobre cada animal y tema agroecológico,
  acumulando un máximo de 0,5 décimas oficiales para su nota si completan los 29 desafíos
  bien a la primera.
  Liceo Domingo Herrera Rivera B-13 Antofagasta.
*/

(function() {
  'use strict';

  const TOTAL_QUIZZES = 29;
  const MAX_DECIMAS = 0.50;
  const DECIMA_POR_QUIZ = MAX_DECIMAS / TOTAL_QUIZZES; // ~0.01724...

  let currentCategory = 'all';
  let activeQuizItem = null;
  let activeQuestions = [];
  let currentQuestionIdx = 0;
  let currentAnswers = [];
  let questionAnswered = false;
  let isQuizActive = false;

  // Colección unificada y estricta de los 29 Quizzes Formativos
  function getAllQuizzes() {
    const list = [];
    const seen = new Set();

    // 1. Quizzes de los 23 animales oficiales (usando MAP_ANIMALS)
    if (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) {
      MAP_ANIMALS.forEach(a => {
        const key = 'animal_' + a.id;
        if (!seen.has(key)) {
          seen.add(key);

          // Obtener preguntas zootécnicas asociadas
          let qList = (a.quiz && a.quiz.length) ? a.quiz : [];
          if (!qList.length && typeof ANIMALS !== 'undefined') {
            const sp = ANIMALS.find(x => x.id === a.species || x.id === a.id);
            if (sp && sp.quiz) qList = sp.quiz;
          }

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

    // 2. Desafío General de Bioética y Normas ODS 15 (1 quiz)
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

    // 3. Quizzes Oficiales de Zonas Pedagógicas del Liceo (5 quizzes docentes)
    const officialTeacherZones = [
      { id: 'conejos', title: 'Quiz Docente: Conejeras Oficiales', thumb: 'assets/img/real/conejos_tres_amigos_cartel.jpg', desc: 'Evaluación formativa sobre el manejo y cuidados en la conejera escolar.' },
      { id: 'gallinas', title: 'Quiz Docente: Gallinero & Gallos', thumb: 'assets/img/real/gallinas_comiendo_maiz.jpg', desc: 'Evaluación docente sobre nutrición avícola, postura e instalaciones.' },
      { id: 'arboleda', title: 'Quiz Docente: Aviario & Arboleda', thumb: 'assets/img/real/almacen_herramientas_aviario.jpg', desc: 'Preguntas pedagógicas sobre la arboleda, sombra y aves menores del aviario.' },
      { id: 'pozo', title: 'Quiz Docente: Pozo de Agua & Riego', thumb: 'assets/img/real/pozo_real.jpg', desc: 'Preguntas sobre la gestión del agua potable y bebederos limpios en el liceo.' },
      { id: 'plantas', title: 'Quiz Docente: Huerto Escolar & Bancales', thumb: 'assets/img/real/huerto_bancales.jpg', desc: 'Preguntas sobre compostaje, forraje fresco y cultivos sustentables.' }
    ];

    officialTeacherZones.forEach(tz => {
      let tQuestions = [];
      if (typeof TeacherQuizzes !== 'undefined' && typeof TeacherQuizzes.getForZone === 'function') {
        tQuestions = TeacherQuizzes.getForZone(tz.id);
      }
      if (!tQuestions || !tQuestions.length) {
        if (typeof QUIZZES_INICIALES !== 'undefined' && QUIZZES_INICIALES[tz.id]) {
          tQuestions = QUIZZES_INICIALES[tz.id];
        }
      }

      list.push({
        id: 'docente_' + tz.id,
        uniqueId: 'docente_' + tz.id,
        type: 'docente',
        group: 'docente',
        title: tz.title,
        subtitle: 'Evaluación oficial asignada por el equipo docente',
        thumb: tz.thumb,
        desc: tz.desc,
        questions: (tQuestions && tQuestions.length) ? tQuestions.map(tq => ({
          q: tq.pregunta,
          options: tq.opciones,
          a: tq.correcta,
          difficulty: 'medio',
          points: 10,
          explain: `Pregunta formulada por: ${tq.profesor || tq.autor || 'Equipo Docente B-13'}.`
        })) : [
          {
            q: `¿Cuál es la prioridad fundamental en la zona de ${tz.title} según el protocolo zootécnico?`,
            options: ['Garantizar agua limpia, higiene y tranquilidad para la fauna', 'Permitir ruido excesivo', 'Dejar la comida en el suelo sin control', 'Cerrar sin ventilación'],
            a: 0,
            difficulty: 'facil',
            points: 10,
            explain: 'El bienestar animal exige agua fresca constante, limpieza rigurosa y ausencia de estrés.'
          }
        ],
        storageKey: tz.id,
        isTeacher: true
      });
    });

    return list;
  }

  // Generador de respaldo de preguntas pedagógicas
  function generatePedagogicalQuestions(a) {
    if (a.group === 'conejos' || a.id.includes('conejo')) {
      return [
        {
          q: `¿Qué proceso fisiológico vital realiza ${a.name} para reabsorber nutrientes y vitaminas del complejo B?`,
          options: [
            'Cecotrofia en el ciego digestivo',
            'Rumia con cuatro estómagos',
            'Fotosíntesis epidérmica',
            'Hibernación invernal'
          ],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'Los conejos ingieren cecotrofos blandos fermentados para aprovechar proteína bacteriana y vitaminas producidas en su ciego.'
        },
        {
          q: `¿Cuál es el alimento base e indispensable que debe constituir al menos el 80% de la dieta de ${a.name}?`,
          options: [
            'Heno fresco de alta fibra',
            'Zanahorias dulces en trozos',
            'Pan remojado con leche',
            'Semillas de maravilla con sal'
          ],
          a: 0,
          difficulty: 'facil',
          points: 10,
          explain: 'El heno de gramíneas desgasta los incisivos de crecimiento continuo y previene problemas gastrointestinales.'
        },
        {
          q: `¿Cómo expresa ${a.name} un momento de profunda alegría y bienestar en la conejera?`,
          options: [
            'Realiza un binky',
            'Muerde fuertemente los barrotes',
            'Se esconde sin respirar',
            'Canta como un gallo al amanecer'
          ],
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
          options: [
            'Glándula uropígea',
            'Glándulas sudoríparas en las patas',
            'Glándula salival anterior',
            'Hígado dorsal'
          ],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'La glándula uropígea impermeabiliza el plumaje, permitiendo al pato flotar sin que el agua moje su piel.'
        },
        {
          q: `¿Por qué está estrictamente prohibido alimentar a ${a.name} con pan blanco en la granja del liceo?`,
          options: [
            'Provoca malnutrición y la malformación conocida como ala de ángel',
            'Hace que floten demasiado rápido',
            'Les cambia el color de los ojos',
            'No les gusta el trigo'
          ],
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
          options: [
            'Termorregulación para disipar calor corporal',
            'Antena receptora de sonidos lejanos',
            'Almacén de calcio para los huesos',
            'Defensa contra parásitos'
          ],
          a: 0,
          difficulty: 'facil',
          points: 10,
          explain: 'Al no poder sudar, las aves usan su cresta y barbillas como radiadores biológicos para disipar calor corporal.'
        },
        {
          q: `Dado que las aves carecen de dientes, ¿en qué órgano ${a.name} tritura los granos con piedrecillas?`,
          options: [
            'En la molleja',
            'En el buche esofágico',
            'En el colon anterior',
            'En el paladar'
          ],
          a: 0,
          difficulty: 'medio',
          points: 15,
          explain: 'La molleja posee paredes musculares hipertrofiadas que muelen mecánicamente el grano duro.'
        }
      ];
    }
  }

  // Cálculo de décimas oficiales acumuladas (solo a la primera, máx 0.50 en total)
  function computeTotalDecimas() {
    if (!state) return 0;
    if (!state.firstTryQuizzes) state.firstTryQuizzes = {};
    const perfectFirstTryCount = Object.values(state.firstTryQuizzes).filter(Boolean).length;
    if (perfectFirstTryCount >= TOTAL_QUIZZES) return MAX_DECIMAS;
    const raw = (perfectFirstTryCount / TOTAL_QUIZZES) * MAX_DECIMAS;
    return Number(raw.toFixed(2));
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

      // Estado de primer intento y décimas ganadas
      let decimaPill = '';
      if (state && state.firstTryQuizzes) {
        if (state.firstTryQuizzes[item.storageKey] === true) {
          decimaPill = `<span class="quiz-card-pill" style="background:#ecfdf5;color:#047857;border-color:#a7f3d0;">🏅 +0.017 décimas (a la 1ª)</span>`;
        } else if (state.firstTryQuizzes[item.storageKey] === false) {
          decimaPill = `<span class="quiz-card-pill" style="background:#fef2f2;color:#991b1b;border-color:#fecaca;">❌ Sin décima (falló en 1ª)</span>`;
        } else if (!isDone) {
          decimaPill = `<span class="quiz-card-pill" style="background:#eff6ff;color:#1e40af;border-color:#bfdbfe;">🎯 +0.017 si respondes 100% a la 1ª</span>`;
        }
      }

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
              ${decimaPill}
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
          promptPreQuizAdvice(target);
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
    const decimasTotal = computeTotalDecimas().toFixed(2);

    const totalEl = document.getElementById('statTotalScore');
    const doneEl = document.getElementById('statQuizzesDone');
    const decEl = document.getElementById('statDecimasTotal');
    const topScoreEl = document.getElementById('score');
    const topDecEl = document.getElementById('quizzesScoreEarned');

    if (totalEl) totalEl.textContent = purePts;
    if (doneEl) doneEl.textContent = `${completedCount} / ${all.length}`;
    if (decEl) decEl.textContent = `${decimasTotal} / 0.50`;
    if (topScoreEl) topScoreEl.textContent = purePts;
    if (topDecEl) topDecEl.textContent = decimasTotal;
  }

  /* ============================================================
     CONSEJO DE CAMPO PREVIO AL DESAFÍO (Para ganar décimas a la 1ª)
     ============================================================ */
  let pendingQuizItem = null;

  function promptPreQuizAdvice(quizItem) {
    pendingQuizItem = quizItem;
    const adviceOverlay = document.getElementById('preQuizAdviceOverlay');
    if (!adviceOverlay) {
      startQuizPlayer(quizItem);
      return;
    }

    const titleEl = document.getElementById('adviceModalTitle');
    const goFichaBtn = document.getElementById('adviceBtnGoFicha');
    const cleanTitle = quizItem.title.replace(/^Desafío:\s*/, '');

    if (titleEl) {
      titleEl.textContent = `💡 ¿Te preparaste para el desafío de ${cleanTitle}?`;
    }

    if (goFichaBtn) {
      if (quizItem.type === 'animal') {
        goFichaBtn.style.display = 'inline-flex';
        goFichaBtn.href = `ficha.html?id=${encodeURIComponent(quizItem.id)}&from=quizzes.html`;
        goFichaBtn.innerHTML = `<span>🔍</span> Ver Ficha de ${cleanTitle}`;
      } else {
        goFichaBtn.style.display = 'inline-flex';
        goFichaBtn.href = 'mapa.html';
        goFichaBtn.innerHTML = `<span>🗺️</span> Ver Mapa y Normas`;
      }
    }

    adviceOverlay.classList.add('open');
    adviceOverlay.style.display = 'flex';
  }

  function closeAdviceModal() {
    const adviceOverlay = document.getElementById('preQuizAdviceOverlay');
    if (adviceOverlay) {
      adviceOverlay.classList.remove('open');
      adviceOverlay.style.display = 'none';
    }
    pendingQuizItem = null;
  }

  /* ============================================================
     JUGADOR DE QUIZ INTERACTIVO (CON BLOQUEO HASTA TERMINAR)
     ============================================================ */

  function startQuizPlayer(quizItem) {
    isQuizActive = true;
    window.isQuizPlayerActive = true;
    activeQuizItem = quizItem;
    activeQuestions = quizItem.questions;
    currentQuestionIdx = 0;
    currentAnswers = [];
    questionAnswered = false;

    const overlay = document.getElementById('quizPlayerOverlay');
    const thumb = document.getElementById('playerThumb');
    const title = document.getElementById('playerTitle');
    const subtitle = document.getElementById('playerSubtitle');
    const closeBtn = document.getElementById('quizPlayerCloseBtn');
    const qBody = document.getElementById('playerQuestionsBody');
    const rBox = document.getElementById('playerResultsBox');
    const progBar = document.getElementById('quizPlayerProgBar');
    const qIdx = document.getElementById('playerQuestionIndex');

    // Bloqueo total: Ocultar botón de cierre durante el quiz activo
    if (closeBtn) closeBtn.style.display = 'none';
    if (qBody) qBody.style.display = 'block';
    if (rBox) rBox.style.display = 'none';
    if (progBar) progBar.style.display = 'block';
    if (qIdx) qIdx.style.display = 'inline-block';

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
      finishQuizAndShowResults();
      return;
    }

    // Asegurar que la nueva pregunta comience visible desde arriba
    const modal = document.querySelector('.quiz-player-modal');
    if (modal) {
      modal.scrollTo({ top: 0, behavior: 'smooth' });
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
      nextBtn.textContent = (currentQuestionIdx + 1 === total) ? '🏆 Finalizar y Ver Resultados ➔' : 'Siguiente Pregunta ➔';
    }

    if (optsList) {
      const letters = ['A', 'B', 'C', 'D'];
      optsList.innerHTML = q.options.map((opt, i) => `
        <button type="button" class="quiz-option-btn" data-opt="${i}">
          <span class="quiz-option-badge">${letters[i]}</span>
          <span class="quiz-option-text">${opt}</span>
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

    // Desplazamiento automático suave hacia la explicación y el botón de acción
    setTimeout(() => {
      const modal = document.querySelector('.quiz-player-modal');
      if (modal) {
        modal.scrollTo({
          top: modal.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 120);
  }

  function setupPlayerEvents() {
    const nextBtn = document.getElementById('playerNextBtn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        currentQuestionIdx++;
        if (currentQuestionIdx < activeQuestions.length) {
          renderQuestion();
        } else {
          finishQuizAndShowResults();
        }
      });
    }

    // Botón de finalización oficial en la pantalla de resultados
    const finishBtn = document.getElementById('playerFinishBtn');
    if (finishBtn) {
      finishBtn.addEventListener('click', () => {
        closeQuizPlayerAndUnlock();
      });
    }

    // Eventos del Modal de Consejo Previo (Campo y Ficha)
    const adviceOverlay = document.getElementById('preQuizAdviceOverlay');
    const adviceCloseBtn = document.getElementById('adviceCloseBtn');
    const adviceStartBtn = document.getElementById('adviceBtnStartQuiz');

    if (adviceCloseBtn) {
      adviceCloseBtn.addEventListener('click', closeAdviceModal);
    }
    if (adviceStartBtn) {
      adviceStartBtn.addEventListener('click', () => {
        const target = pendingQuizItem;
        closeAdviceModal();
        if (target) {
          startQuizPlayer(target);
        }
      });
    }
    if (adviceOverlay) {
      adviceOverlay.addEventListener('click', e => {
        if (e.target === adviceOverlay) {
          closeAdviceModal();
        }
      });
    }

    // Bloqueo de salida anticipada: Backdrop no cierra si el quiz está en curso
    const overlay = document.getElementById('quizPlayerOverlay');
    if (overlay) {
      overlay.addEventListener('click', e => {
        // Si el clic fue adentro de la tarjeta del modal y no es el botón de cerrar, permitir interacción interna
        if (e.target.closest('.quiz-player-modal') && !e.target.classList.contains('close-btn')) {
          return;
        }

        if (isQuizActive) {
          // Bloqueo estricto: El estudiante NO puede salir haciendo clic fuera del modal
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();

          const modal = overlay.querySelector('.quiz-player-modal');
          if (modal) {
            modal.classList.remove('modal-shake');
            void modal.offsetWidth;
            modal.classList.add('modal-shake');
            setTimeout(() => modal.classList.remove('modal-shake'), 400);
          }
          if (typeof showToast === 'function') {
            showToast('⚠️ No puedes salir del desafío hasta responder todas las preguntas.', 2500);
          }
          return false;
        }

        if (e.target === overlay || e.target.classList.contains('close-btn')) {
          closeQuizPlayerAndUnlock();
        }
      }, true); // Capture phase para interceptar antes de cualquier otro listener
    }

    // Bloqueo de tecla Escape mientras el quiz está activo
    window.addEventListener('keydown', e => {
      if (isQuizActive && (e.key === 'Escape' || e.key === 'Esc')) {
        e.preventDefault();
        e.stopPropagation();
      }
    });

    // Advertencia de salida del navegador durante el quiz activo
    window.addEventListener('beforeunload', e => {
      if (isQuizActive) {
        e.preventDefault();
        e.returnValue = 'Tienes un desafío formativo en curso. Debes finalizarlo para guardar tus respuestas.';
        return e.returnValue;
      }
    });
  }

  // Finalizar quiz y mostrar pantalla de resultados (permanece dentro del modal hasta que el alumno toque Finalizar)
  function finishQuizAndShowResults() {
    const correctCount = currentAnswers.filter(Boolean).length;
    const totalCount = activeQuestions.length;
    const isAllCorrect = (correctCount === totalCount && totalCount > 0);
    const pointsPerQ = 10;
    const scoreEarned = correctCount * pointsPerQ;

    // Gestión estricta de Décimas Formativas a la primera
    if (!state.firstTryQuizzes) state.firstTryQuizzes = {};
    const key = activeQuizItem.storageKey;
    const isFirstAttempt = (state.firstTryQuizzes[key] === undefined);
    let earnedDecimaOnThisTry = false;

    if (isFirstAttempt) {
      if (isAllCorrect) {
        state.firstTryQuizzes[key] = true;
        earnedDecimaOnThisTry = true;
      } else {
        state.firstTryQuizzes[key] = false;
      }
    }

    // Actualizar estado del estudiante
    if (state && activeQuizItem) {
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

      if (typeof computePureScore === 'function') {
        state.pureScore = computePureScore(state);
        state.score = state.pureScore;
      }

      saveState();

      if (typeof Auth !== 'undefined' && typeof Auth.guardarPuntaje === 'function') {
        Auth.guardarPuntaje(state.pureScore, 'quiz_' + key);
      }
      if (typeof checkBadges === 'function') checkBadges();
    }

    // Ocultar sección de preguntas y mostrar pantalla de resultados
    const qBody = document.getElementById('playerQuestionsBody');
    const progBar = document.getElementById('quizPlayerProgBar');
    const qIdx = document.getElementById('playerQuestionIndex');
    const rBox = document.getElementById('playerResultsBox');

    if (qBody) qBody.style.display = 'none';
    if (progBar) progBar.style.display = 'none';
    if (qIdx) qIdx.style.display = 'none';
    if (rBox) rBox.style.display = 'flex';

    // Rellenar datos de la pantalla de resultados
    const trophy = document.getElementById('resultsTrophyIcon');
    const title = document.getElementById('resultsTitle');
    const desc = document.getElementById('resultsDesc');
    const statScore = document.getElementById('resultsStatScore');
    const statAcc = document.getElementById('resultsStatAccuracy');
    const statDec = document.getElementById('resultsStatDecimas');
    const advice = document.getElementById('resultsAdvice');

    if (trophy) trophy.textContent = isAllCorrect ? '🏆' : (correctCount > 0 ? '⭐' : '🌱');
    if (title) title.textContent = isAllCorrect ? '¡Puntaje Perfecto!' : '¡Desafío Completado!';
    if (desc) desc.textContent = `Acertaste ${correctCount} de ${totalCount} preguntas en este desafío.`;
    if (statScore) statScore.textContent = `+${scoreEarned}`;
    if (statAcc) statAcc.textContent = `${correctCount}/${totalCount}`;
    if (statDec) statDec.textContent = `+${earnedDecimaOnThisTry ? DECIMA_POR_QUIZ.toFixed(3) : '0.000'}`;

    if (advice) {
      const decimasAcum = computeTotalDecimas().toFixed(2);
      if (earnedDecimaOnThisTry) {
        advice.innerHTML = `🎉 <b>¡Excelente! Respondiste al 100% en tu primer intento.</b> Ganaste <b>+0.017 décimas</b> para tu nota (Acumulado oficial: <b>${decimasAcum} / 0.50</b>).`;
      } else if (isFirstAttempt && !isAllCorrect) {
        advice.innerHTML = `⚠️ <b>Tuviste ${totalCount - correctCount} error(es) en este primer intento.</b> Las décimas se entregan solo al completar al 100% a la primera. ¡Sigue repasando para reforzar tu conocimiento zootécnico!`;
      } else {
        advice.innerHTML = `🔄 <b>Modo Repaso:</b> Ya habías realizado este desafío antes. Este intento refuerza tu aprendizaje sin alterar tus décimas oficiales registradas.`;
      }
    }

    if (typeof AudioFX !== 'undefined' && typeof AudioFX.victory === 'function') {
      AudioFX.victory();
    }
  }

  // Cerrar el modal y desbloquear al estudiante tras presionar Finalizar
  function closeQuizPlayerAndUnlock() {
    isQuizActive = false;
    window.isQuizPlayerActive = false;
    const overlay = document.getElementById('quizPlayerOverlay');
    if (overlay) {
      overlay.classList.remove('open');
      overlay.style.display = 'none';
    }

    updateStatsBanner();
    renderQuizzesList();

    const decimasTotal = computeTotalDecimas().toFixed(2);
    if (typeof showToast === 'function') {
      showToast(`✨ Progreso actualizado. Décimas acumuladas: ${decimasTotal} / 0.50`);
    }
  }

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
