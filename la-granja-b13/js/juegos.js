/*
  juegos.js — Motores de minijuegos educativos para La Granja B-13
  1. Busca las Parejas (Memoria de Curiosidades ↔ Animales)
  2. Sopa de Letras Zootécnica y Comunitaria
  3. Aventura en la Granja (Plataformas 2D con animal personalizado)
*/

(function() {
  'use strict';

  // Sonidos sintetizados por Web Audio API con apagado forzado y seguro
  const AudioFX = {
    ctx: null,
    activeNodes: new Set(),
    activeTimeouts: new Set(),

    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        try {
          this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    },

    stopAll() {
      // Limpiar todos los timeouts programados de melodías
      this.activeTimeouts.forEach(tid => clearTimeout(tid));
      this.activeTimeouts.clear();

      // Silenciar y desconectar de inmediato todos los osciladores y nodos de ganancia
      this.activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
        } catch (e) {}
        try {
          if (node.gain && this.ctx) {
            node.gain.setValueAtTime(0, this.ctx.currentTime);
          }
        } catch (e) {}
        try {
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      this.activeNodes.clear();
    },

    playTone(freq, type, duration, delay = 0) {
      this.init();
      if (!this.ctx) return;

      const tid = setTimeout(() => {
        this.activeTimeouts.delete(tid);
        try {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = type;
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.12, now);
          gain.gain.linearRampToValueAtTime(0.0001, now + duration);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          this.activeNodes.add(osc);
          this.activeNodes.add(gain);

          osc.onended = () => {
            try {
              osc.disconnect();
              gain.disconnect();
            } catch (e) {}
            this.activeNodes.delete(osc);
            this.activeNodes.delete(gain);
          };

          osc.start(now);
          osc.stop(now + duration);

          // Fallback estricto para nunca dejar un sonido colgado en el navegador
          const cleanupTid = setTimeout(() => {
            this.activeTimeouts.delete(cleanupTid);
            try {
              osc.stop();
              osc.disconnect();
              gain.disconnect();
            } catch (e) {}
            this.activeNodes.delete(osc);
            this.activeNodes.delete(gain);
          }, (duration + 0.08) * 1000);
          this.activeTimeouts.add(cleanupTid);

        } catch (err) {}
      }, delay);
      this.activeTimeouts.add(tid);
    },

    flip() { this.playTone(320, 'sine', 0.08); },
    match() {
      this.playTone(523.25, 'triangle', 0.12, 0);
      this.playTone(659.25, 'triangle', 0.15, 90);
      this.playTone(783.99, 'triangle', 0.22, 180);
    },
    wrong() {
      this.playTone(220, 'sawtooth', 0.14, 0);
      this.playTone(180, 'sawtooth', 0.18, 90);
    },
    jump() { this.playTone(420, 'square', 0.09); },
    dash() {
      // Efecto de ráfaga y aceleración estilo Celeste
      this.playTone(580, 'sine', 0.06, 0);
      this.playTone(880, 'triangle', 0.10, 30);
    },
    parry() {
      // Campanazo agudo y brillante estilo Cuphead Parry Slap
      this.playTone(1174, 'triangle', 0.12, 0);
      this.playTone(1760, 'sine', 0.16, 50);
    },
    pogo() {
      // Golpe metálico de aguijón sobre seta estilo Hollow Knight
      this.playTone(740, 'square', 0.06, 0);
      this.playTone(1320, 'triangle', 0.10, 40);
    },
    crystal() {
      // Destello de cristal Celeste para recarga de Dash
      this.playTone(1046, 'sine', 0.08, 0);
      this.playTone(1568, 'sine', 0.12, 60);
    },
    crumble() {
      this.playTone(110, 'sawtooth', 0.15, 0);
    },
    spring() {
      this.playTone(330, 'sine', 0.08, 0);
      this.playTone(660, 'triangle', 0.14, 60);
      this.playTone(990, 'triangle', 0.18, 120);
    },
    splash() {
      this.playTone(150, 'sawtooth', 0.12, 0);
    },
    coin() {
      this.playTone(880, 'sine', 0.07, 0);
      this.playTone(1320, 'sine', 0.12, 60);
    },
    win() {
      this.stopAll();
      [523, 659, 783, 1046].forEach((f, i) => this.playTone(f, 'triangle', 0.22, i * 110));
    }
  };

  /* Toast flotante de pistas pedagógicas para Quizzes */
  let clueToastTimeout = null;
  function showQuizClueToast(text, icon = '💡') {
    let toast = document.getElementById('quizClueToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'quizClueToast';
      toast.className = 'quiz-clue-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="clue-icon">${icon}</span> <span>${text}</span>`;
    toast.classList.add('active');
    clearTimeout(clueToastTimeout);
    clueToastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 5000);
  }
  window.showQuizClueToast = showQuizClueToast;

  /* Helper para modal de resultado/victoria enriquecido y de cierre garantizado */
  function showGameVictory({ icon, title, subtitle, msg, stats, stamp, isDefeat = false, onRestart, onRetryImmediate }) {
    const overlay = document.getElementById('victoryOverlay');
    if (!overlay) return;

    const iconEl = document.getElementById('victoryIcon');
    const titleEl = document.getElementById('victoryTitle');
    const subEl = document.getElementById('victorySubtitle');
    const msgEl = document.getElementById('victoryMsg');
    const statsEl = document.getElementById('victoryStats');
    const stampEl = document.getElementById('victoryStamp');
    const restartBtn = document.getElementById('victoryPlayAgainBtn');
    const acceptBtn = document.getElementById('victoryAcceptBtn');
    const closeBtn = document.getElementById('victoryCloseBtn');

    if (iconEl) iconEl.textContent = icon || (isDefeat ? '🌧️' : '🏆');
    if (titleEl) {
      titleEl.textContent = title || (isDefeat ? '¡Inténtalo de Nuevo!' : '¡Felicitaciones!');
      titleEl.style.color = isDefeat ? '#991b1b' : '#1b4332';
    }
    if (subEl) subEl.textContent = subtitle || (isDefeat ? 'Recorrido Interrumpido' : 'Desafío Recreativo Superado');
    if (msgEl) msgEl.innerHTML = msg || '';
    if (statsEl) statsEl.innerHTML = stats || '';
    if (stampEl) {
      stampEl.textContent = stamp || (isDefeat ? 'INTÉNTALO OTRA VEZ' : 'MISIÓN CUMPLIDA');
      stampEl.className = isDefeat ? 'stamp stamp-defeat' : 'stamp';
    }

    const activeRestart = typeof onRestart === 'function' ? onRestart : null;
    const activeImmediate = typeof onRetryImmediate === 'function' ? onRetryImmediate : activeRestart;

    const closeVictory = (e, callback) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      overlay.classList.remove('open');
      overlay.style.display = 'none';
      AudioFX.stopAll();
      if (typeof callback === 'function') {
        callback();
      }
    };

    if (isDefeat) {
      if (restartBtn) {
        restartBtn.innerHTML = '<span>🚀</span> ¡Volver a Intentarlo!';
        restartBtn.className = 'tool-btn victory-btn-retry-primary';
        restartBtn.title = 'Reintentar de inmediato con la misma configuración';
        restartBtn.onclick = (e) => closeVictory(e, activeImmediate);
      }
      if (acceptBtn) {
        acceptBtn.innerHTML = '<span>⚙️</span> Apartado de Reintento';
        acceptBtn.className = 'tool-btn victory-btn-retry-lobby';
        acceptBtn.title = 'Ir al apartado para cambiar corredor, dificultad y reintentar';
        acceptBtn.onclick = (e) => closeVictory(e, activeRestart);
      }
    } else {
      if (restartBtn) {
        restartBtn.innerHTML = '🔁 Jugar otra versión';
        restartBtn.className = 'tool-btn victory-btn-again';
        restartBtn.onclick = (e) => closeVictory(e, activeImmediate);
      }
      if (acceptBtn) {
        acceptBtn.innerHTML = '✓ Aceptar';
        acceptBtn.className = 'tool-btn victory-btn-accept';
        acceptBtn.onclick = (e) => closeVictory(e, activeRestart);
      }
    }

    if (closeBtn) {
      closeBtn.onclick = (e) => closeVictory(e, activeRestart);
    }

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeVictory(e, activeRestart);
      }
    };

    overlay.style.display = 'flex';
    overlay.classList.add('open');
  }

  // Atajo con tecla Escape para cerrar cualquier modal y apagar sonidos
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const vOverlay = document.getElementById('victoryOverlay');
      if (vOverlay && vOverlay.classList.contains('open')) {
        const closeBtn = document.getElementById('victoryCloseBtn');
        if (closeBtn) closeBtn.click();
        else {
          vOverlay.classList.remove('open');
          vOverlay.style.display = 'none';
          AudioFX.stopAll();
        }
      }
    }
  });

  function checkMaestroArcade() {
    if (typeof state === 'undefined') return;
    const mg = state.minigames || {};
    const mem = (mg.memory && mg.memory.bestScore > 0) || false;
    const ws = (mg.wordsearch && mg.wordsearch.bestScore > 0) || false;
    const plat = (mg.platformer && mg.platformer.bestScore > 0) || false;
    if (mem && ws && plat && typeof window.unlockBadge === 'function') {
      window.unlockBadge('maestro_arcade');
    }
  }
  window.checkMaestroArcade = checkMaestroArcade;

  /* ============================================================
     SISTEMA DE PESTAÑAS DE JUEGOS
     ============================================================ */
  function initGameTabs() {
    const tabs = document.querySelectorAll('.game-tab-btn');
    const panels = document.querySelectorAll('.game-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        AudioFX.stopAll();
        tab.classList.add('active');
        const targetId = tab.dataset.game;
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
          if (targetId === 'game-memory') {
            if (!MemoryGame.initialized) MemoryGame.start();
          }
          if (targetId === 'game-wordsearch') {
            if (!WordSearchGame.initialized) WordSearchGame.start();
          }
          if (targetId === 'game-platformer') {
            if (!PlatformerGame.initialized) PlatformerGame.start();
            else {
              if (!PlatformerGame.isRunning) PlatformerGame.draw();
            }
          } else {
            // Pausar física si el jugador navega a otra pestaña
            if (PlatformerGame.isRunning) {
              PlatformerGame.pauseRun();
            }
          }
          if (targetId === 'game-flappy') {
            if (!FlappyGame.initialized) FlappyGame.start();
            else {
              if (!FlappyGame.isRunning) FlappyGame.draw();
            }
          } else {
            if (typeof FlappyGame !== 'undefined' && FlappyGame.isRunning) {
              FlappyGame.pause();
            }
          }
        }
      });
    });
  }

  /* ============================================================
     SISTEMA PEDAGÓGICO: "MIS PISTAS" (CUADERNO DE APUNTES DE MINIJUEGOS)
     Recolecta y persiste los conceptos clave zootécnicos descubiertos
     para que los estudiantes los repasen antes de rendir los Quizzes
     ============================================================ */
  const CluesNotebook = {
    getStorageKey() {
      let userKey = 'anonimo';
      if (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') {
        const sesion = Auth.getSesion();
        if (sesion && sesion.rol === 'estudiante' && (sesion.correo || sesion.nombre)) {
          userKey = (sesion.correo || sesion.nombre).trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
        }
      } else if (typeof state !== 'undefined' && state.studentName && state.studentName.trim()) {
        userKey = (state.studentName + '_' + (state.studentGrade || '')).trim().toLowerCase().replace(/[^a-z0-9_]/g, '_');
      }
      return `granja_clues_${userKey}`;
    },

    getClues() {
      const key = this.getStorageKey();
      try {
        const raw = localStorage.getItem(key);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {}
      if (typeof state !== 'undefined' && Array.isArray(state.collectedClues)) {
        return state.collectedClues;
      }
      return [];
    },

    saveClues(clues) {
      const key = this.getStorageKey();
      try {
        localStorage.setItem(key, JSON.stringify(clues));
      } catch (e) {}
      if (typeof state !== 'undefined') {
        state.collectedClues = clues;
        if (typeof saveState === 'function') saveState();
      }
      this.updateCounter();
    },

    addClue({ title, fact, game, icon }) {
      if (!fact || !fact.trim()) return;
      const clues = this.getClues();
      const normFact = fact.trim();
      const exists = clues.some(c => c.fact.trim().toLowerCase() === normFact.toLowerCase());
      if (exists) return; // Ya aprendida

      const newClue = {
        id: 'clue_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title: title || 'Concepto de Granja',
        fact: normFact,
        game: game || 'Minijuegos B-13',
        icon: icon || '💡',
        date: new Date().toLocaleDateString('es-CL')
      };

      clues.unshift(newClue);
      this.saveClues(clues);

      // Si el modal está visible, re-renderizar
      const overlay = document.getElementById('cluesOverlay');
      if (overlay && overlay.style.display !== 'none' && !overlay.classList.contains('hidden')) {
        this.renderClues();
      }
    },

    updateCounter() {
      const clues = this.getClues();
      const counterEl = document.getElementById('toolbarCluesCount');
      if (counterEl) counterEl.textContent = clues.length;
    },

    renderClues(filter = 'todas') {
      const container = document.getElementById('cluesCollectionContainer');
      if (!container) return;

      const clues = this.getClues();
      const countAll = clues.length;
      const countMem = clues.filter(c => c.game.toLowerCase().includes('parejas') || c.game.toLowerCase().includes('memoria')).length;
      const countWs = clues.filter(c => c.game.toLowerCase().includes('sopa')).length;
      const countPlat = clues.filter(c => c.game.toLowerCase().includes('aventura') || c.game.toLowerCase().includes('plataformas') || c.game.toLowerCase().includes('carrera')).length;

      const elAll = document.getElementById('cluesFilterCountAll');
      const elMem = document.getElementById('cluesFilterCountMem');
      const elWs = document.getElementById('cluesFilterCountWs');
      const elPlat = document.getElementById('cluesFilterCountPlat');

      if (elAll) elAll.textContent = countAll;
      if (elMem) elMem.textContent = countMem;
      if (elWs) elWs.textContent = countWs;
      if (elPlat) elPlat.textContent = countPlat;

      let filtered = clues;
      if (filter !== 'todas') {
        const lowF = filter.toLowerCase();
        filtered = clues.filter(c => c.game.toLowerCase().includes(lowF));
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="clues-empty-state">
            <span class="clues-empty-icon">📖🌾</span>
            <h4 style="margin:0;font-family:'Fraunces',serif;color:#1e293b;font-size:1.1rem;">
              ${countAll === 0 ? '¡Tu Cuaderno de Campo está esperando!' : 'No hay pistas en esta categoría'}
            </h4>
            <p style="margin:0;max-width:380px;font-size:0.85rem;line-height:1.45;">
              ${countAll === 0
                ? 'Juega a las <b>Parejas de Curiosidades</b>, la <b>Sopa de Letras</b> o la <b>Carrera 2D</b> para descubrir pistas zootécnicas clave que te ayudarán a asegurar tus décimas en los Quizzes oficiales.'
                : 'Explora los otros minijuegos para desbloquear los conceptos que faltan.'}
            </p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(c => `
        <div class="clue-item-card">
          <div class="clue-item-icon-box">${c.icon}</div>
          <div class="clue-item-content">
            <div class="clue-item-header">
              <h4 class="clue-item-title">${c.title}</h4>
              <span class="clue-game-badge">🎮 ${c.game}</span>
            </div>
            <p class="clue-item-fact">${c.fact}</p>
          </div>
        </div>
      `).join('');
    },

    init() {
      this.updateCounter();

      const cluesBtn = document.getElementById('cluesBtn');
      const overlay = document.getElementById('cluesOverlay');
      const closeBtn = document.getElementById('cluesCloseBtn');
      const filterBar = document.getElementById('cluesFilterBar');

      let currentClueFilter = 'todas';

      const openModal = () => {
        if (!overlay) return;
        this.renderClues(currentClueFilter);
        overlay.style.display = 'flex';
        overlay.classList.add('active');
        overlay.classList.remove('hidden');
      };

      const closeModal = () => {
        if (!overlay) return;
        overlay.style.display = 'none';
        overlay.classList.remove('active');
        overlay.classList.add('hidden');
      };

      if (cluesBtn) {
        cluesBtn.addEventListener('click', (e) => {
          e.preventDefault();
          window.location.href = 'perfil.html#pistas';
        });
      }
      if (closeBtn) closeBtn.addEventListener('click', closeModal);

      if (overlay) {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) closeModal();
        });
      }

      if (filterBar) {
        filterBar.querySelectorAll('.clues-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            filterBar.querySelectorAll('.clues-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentClueFilter = btn.dataset.filter || 'todas';
            this.renderClues(currentClueFilter);
          });
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay && overlay.style.display !== 'none' && !overlay.classList.contains('hidden')) {
          closeModal();
        }
      });
    }
  };

  // Exponer a nivel de ventana para llamadas modulares
  window.addStudentClue = (clueData) => CluesNotebook.addClue(clueData);

  /* ============================================================
     JUEGO 1: BUSCA LAS PAREJAS (MEMORIA CURIOSIDAD ↔ ANIMAL)
     Pool de 18 parejas maestras: Cada partida elige al azar parejas según dificultad
     y ofrece pistas directas para responder los Quizzes del liceo
     ============================================================ */
  const MemoryGame = {
    initialized: false,
    isStarted: false,
    difficulty: 'facil',
    diffConfig: {
      facil: { pairs: 6, cols: 4, name: '🟢 Fácil', multiplier: 1.0, desc: '6 parejas zootécnicas (12 cartas). Empareja cada animal con su curiosidad biológica.' },
      media: { pairs: 8, cols: 4, name: '🟡 Media', multiplier: 1.5, desc: '8 parejas zootécnicas (16 cartas). Mayor reto de memoria y conceptos.' },
      dificil: { pairs: 10, cols: 5, name: '🔴 Difícil', multiplier: 2.0, desc: '10 parejas zootécnicas (20 cartas). Cuadrícula expandida para expertos.' }
    },
    masterPairs: [
      { id: 'conejo', name: 'Conejo', emoji: '🐰', fact: 'Sus incisivos crecen toda la vida y practica cecotrofia (reingerir heces blandas con vitamina B).' },
      { id: 'gallo', name: 'Gallo', emoji: '🐓', fact: 'Cresta vascularizada que actúa como radiador térmico y espolones para proteger el orden de picoteo.' },
      { id: 'gallina', name: 'Gallina', emoji: '🐔', fact: 'Toma baños de tierra para eliminar ácaros y usa la molleja con grit (piedrecillas) para moler granos.' },
      { id: 'pato', name: 'Pato', emoji: '🦆', fact: 'Glándula uropígea que impermeabiliza su plumaje; el pan blanco les provoca la deformación ala de ángel.' },
      { id: 'agapornis', name: 'Agapornis', emoji: '🦜', fact: 'Aves monógamas de por vida con patas zigodáctilas (2 dedos adelante y 2 atrás) para trepar.' },
      { id: 'catita', name: 'Catita Australiana', emoji: '🐦', fact: 'El céreo azul indica macho adulto y marrón hembra; la palta y el chocolate son toxinas letales.' },
      { id: 'gallito_japones', name: 'Gallito Chabo', emoji: '🐓', fact: 'Raza japonesa pequeña con tarsos emplumados que exigen suelos secos para no acumular barro ni hongos.' },
      { id: 'cecotrofia', name: 'Cecotrofia', emoji: '🌱', fact: 'Estrategia digestiva del conejo para reasimilar aminoácidos, celulosa fermentada y complejo B.' },
      { id: 'molleja', name: 'Molleja Muscular', emoji: '⚙️', fact: 'Estómago mecánico de las aves donde piedrecillas ingeridas trituran alimentos duros en vez de dientes.' },
      { id: 'heno', name: 'Heno Seco', emoji: '🌾', fact: 'Debe constituir el 80% de la dieta del conejo para el desgaste dental y la motilidad del ciego.' },
      { id: 'incubacion', name: 'Incubación (21 Días)', emoji: '🥚', fact: 'Período en que la gallina provee 37.5°C y humedad precisa para el desarrollo embrionario del pollito.' },
      { id: 'buche', name: 'El Buche', emoji: '🥣', fact: 'Dilatación esofágica en aves que almacena y reblandece el grano antes de pasar al proventrículo.' },
      { id: 'espolon', name: 'Espolones', emoji: '⚔️', fact: 'Defensa ósea córnea en las patas del gallo usada en la jerarquía del gallinero.' },
      { id: 'grit', name: 'Grit y Calcio', emoji: '🪨', fact: 'Piedritas y conchuelas molidas indispensables para moler granos y formar la cáscara del huevo.' },
      { id: 'uropigea', name: 'Glándula Uropígea', emoji: '💧', fact: 'Ubicada sobre la rabadilla de las aves acuáticas para untar cera repelente al agua con el pico.' },
      { id: 'banos_tierra', name: 'Baño de Ceniza', emoji: '🏜️', fact: 'Comportamiento natural donde las aves se revuelcan en polvo para asfixiar ectoparásitos.' },
      { id: 'monogamia', name: 'Lazos de Pareja', emoji: '💞', fact: 'Los agapornis fortalecen su bienestar mediante el acicalamiento mutuo (allopreening) permanente.' },
      { id: 'altricial', name: 'Gazapos Altriciales', emoji: '🍼', fact: 'Las crías de conejo nacen ciegas, sin pelaje y termorregulación, a diferencia de los precociales.' }
    ],
    currentPairs: [],
    cards: [],
    flippedCards: [],
    matchedCount: 0,
    moves: 0,
    timerSeconds: 0,
    timerInterval: null,
    learnedClues: [],

    start() {
      this.initialized = true;
      this.initStartScreen();
      this.showStartScreen();
    },

    initStartScreen() {
      const playBtn = document.getElementById('memStartPlayBtn');
      if (playBtn) {
        playBtn.onclick = () => this.startPlaying();
      }

      const diffSelector = document.getElementById('memDiffSelector');
      if (diffSelector) {
        diffSelector.querySelectorAll('.diff-card-btn').forEach(btn => {
          btn.onclick = () => {
            diffSelector.querySelectorAll('.diff-card-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.difficulty = btn.dataset.diff || 'facil';
            this.updateDifficultyUI();
            this.buildDeckAndRender();
          };
        });
      }
      this.updateDifficultyUI();
    },

    updateDifficultyUI() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      const diffValEl = document.getElementById('memDiffVal');
      if (diffValEl) {
        diffValEl.textContent = cfg.name;
        diffValEl.style.color = (this.difficulty === 'facil') ? '#16a34a' : ((this.difficulty === 'media') ? '#d97706' : '#dc2626');
      }
      const descEl = document.getElementById('memStageDynamicDesc');
      if (descEl) descEl.textContent = cfg.desc;
    },

    showStartScreen() {
      clearInterval(this.timerInterval);
      this.isStarted = false;
      this.flippedCards = [];
      this.matchedCount = 0;
      this.moves = 0;
      this.timerSeconds = 0;
      this.learnedClues = [];
      this.updateDifficultyUI();
      this.updateStats();

      const overlay = document.getElementById('memStartOverlay');
      if (overlay) overlay.classList.remove('hidden');

      this.buildDeckAndRender();
    },

    startPlaying() {
      const overlay = document.getElementById('memStartOverlay');
      if (overlay) overlay.classList.add('hidden');

      this.isStarted = true;
      this.timerSeconds = 0;
      this.moves = 0;
      this.matchedCount = 0;
      this.flippedCards = [];
      this.learnedClues = [];
      this.updateDifficultyUI();
      this.updateStats();

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.updateStats();
      }, 1000);

      AudioFX.jump();
    },

    reset() {
      this.showStartScreen();
    },

    buildDeckAndRender() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      // Elegir parejas al azar según dificultad
      const shuffledMaster = [...this.masterPairs].sort(() => Math.random() - 0.5);
      this.currentPairs = shuffledMaster.slice(0, cfg.pairs);

      // Construir baraja
      const deck = [];
      this.currentPairs.forEach(p => {
        deck.push({ pairId: p.id, type: 'animal', name: p.name, emoji: p.emoji, fact: p.fact });
        deck.push({ pairId: p.id, type: 'curiosity', text: p.fact, pairName: p.name, emoji: p.emoji });
      });

      // Barajar aleatoriamente (Fisher-Yates)
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      this.cards = deck;
      this.render();
    },

    render() {
      const board = document.getElementById('memoryBoard');
      if (!board) return;

      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      board.style.gridTemplateColumns = `repeat(${cfg.cols}, 1fr)`;

      board.innerHTML = '';
      this.cards.forEach((card, idx) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.dataset.index = idx;

        let backContent = '';
        if (card.type === 'animal') {
          backContent = `
            <div class="memory-card-face memory-card-back card-animal">
              <span class="card-animal-emoji">${card.emoji}</span>
              <span class="card-animal-name">${card.name}</span>
            </div>
          `;
        } else {
          backContent = `
            <div class="memory-card-face memory-card-back card-curiosity">
              <div class="card-curiosity-tag">💡 Pista de Quiz:</div>
              <div class="card-curiosity-text">${card.text}</div>
            </div>
          `;
        }

        cardEl.innerHTML = `
          <!-- Cara numerada frontal -->
          <div class="memory-card-face memory-card-front">
            <span class="card-number">${idx + 1}</span>
            <span class="card-front-icon">🌾</span>
          </div>
          <!-- Cara revelada posterior -->
          ${backContent}
        `;

        cardEl.addEventListener('click', () => this.handleCardClick(cardEl, idx));
        board.appendChild(cardEl);
      });
    },

    handleCardClick(cardEl, idx) {
      if (!this.isStarted) return;
      if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
      if (this.flippedCards.length >= 2) return;

      AudioFX.flip();
      cardEl.classList.add('flipped');
      this.flippedCards.push({ el: cardEl, data: this.cards[idx] });

      if (this.flippedCards.length === 2) {
        this.moves++;
        this.updateStats();

        const [c1, c2] = this.flippedCards;
        // Comprobar coincidencia: mismo animal y tipos distintos
        if (c1.data.pairId === c2.data.pairId && c1.data.type !== c2.data.type) {
          AudioFX.match();
          const clueFact = c1.data.fact || c2.data.text;
          const clueAnimal = c1.data.name || c2.data.pairName || 'Granja B-13';
          const clueEmoji = c1.data.emoji || c2.data.emoji || '💡';

          if (clueFact && !this.learnedClues.includes(clueFact)) {
            this.learnedClues.push(clueFact);
          }

          // Guardar en el cuaderno permanente "Mis Pistas"
          if (typeof CluesNotebook !== 'undefined') {
            CluesNotebook.addClue({
              title: clueAnimal,
              fact: clueFact,
              game: 'Parejas de Curiosidades',
              icon: clueEmoji
            });
          }

          showQuizClueToast(`💡 Pista Quiz Guardada en "Mis Pistas": ${clueFact}`, clueEmoji);

          setTimeout(() => {
            c1.el.classList.add('matched');
            c2.el.classList.add('matched');
            this.flippedCards = [];
            this.matchedCount++;
            this.updateStats();

            if (this.matchedCount === this.currentPairs.length) {
              clearInterval(this.timerInterval);
              AudioFX.win();
              const mins = Math.floor(this.timerSeconds / 60);
              const secs = this.timerSeconds % 60;
              const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

              // Cálculo de puntuación para el Ranking Arcade
              const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
              const baseScore = cfg.pairs * 120;
              const timeBonus = Math.max(0, 300 - this.timerSeconds * 2);
              const movesBonus = Math.max(0, 200 - Math.max(0, this.moves - cfg.pairs) * 10);
              const totalScore = Math.round((baseScore + timeBonus + movesBonus) * cfg.multiplier);

              // Guardar récord en el estado del estudiante y persistir
              if (typeof state !== 'undefined') {
                state.minigames = state.minigames || {};
                state.minigames.memory = state.minigames.memory || {};
                const prevBest = state.minigames.memory.bestScore || 0;
                state.minigames.memory.bestScore = Math.max(prevBest, totalScore);
                state.minigames.memory.bestTime = Math.min(state.minigames.memory.bestTime || 9999, this.timerSeconds);
                if (typeof saveState === 'function') saveState();
              }
              if (typeof window.unlockBadge === 'function') window.unlockBadge('memoria_fotografica');
              if (typeof checkMaestroArcade === 'function') checkMaestroArcade();
              if (typeof window.refreshRankingWidget === 'function') {
                window.refreshRankingWidget();
              }

              const cluesListHtml = this.learnedClues.length > 0
                ? `<div style="margin-top:10px;text-align:left;background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.82rem;color:#1e293b;"><b>💡 Pistas Clave para tus Quizzes (Guardadas en "Mis Pistas"):</b><ul style="margin:6px 0 0 16px;padding:0;">${this.learnedClues.map(c => `<li>${c}</li>`).join('')}</ul></div>`
                : '';

              setTimeout(() => {
                showGameVictory({
                  icon: '🧠',
                  title: '¡Memoria Zootécnica Completada!',
                  subtitle: `Dificultad: ${cfg.name} — Pistas Guardadas en tu Cuaderno`,
                  stamp: 'EXCELENCIA BIOLÓGICA',
                  msg: `¡Gran trabajo! Has emparejado con éxito todos los conceptos biológicos en nivel <b>${cfg.name}</b>. Los puntos se sumaron al Salón de Honor Arcade y las pistas fueron añadidas a tu cuaderno de <b>Mis Pistas</b>.`,
                  stats: `⭐ <b>Puntaje Obtenido:</b> ${totalScore} pts (${cfg.name}) &nbsp;|&nbsp; ⏱️ <b>Tiempo empleado:</b> ${timeStr} &nbsp;|&nbsp; 🔄 <b>Movimientos:</b> ${this.moves}${cluesListHtml}`,
                  onRestart: () => this.showStartScreen()
                });
              }, 350);
            }
          }, 350);
        } else {
          AudioFX.wrong();
          setTimeout(() => {
            c1.el.classList.remove('flipped');
            c2.el.classList.remove('flipped');
            this.flippedCards = [];
          }, 1100);
        }
      }
    },

    updateStats() {
      const movesEl = document.getElementById('memMovesVal');
      const matchesEl = document.getElementById('memMatchesVal');
      const timeEl = document.getElementById('memTimeVal');

      if (movesEl) movesEl.textContent = this.moves;
      if (matchesEl) matchesEl.textContent = `${this.matchedCount}/${this.currentPairs.length || 6}`;
      if (timeEl) {
        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  };

  /* ============================================================
     JUEGO 2: SOPA DE LETRAS ZOOTÉCNICA
     Pool de 24 palabras maestras: Cada partida genera una sopa única
     según la dificultad elegida con pistas de quiz para el liceo
     ============================================================ */
  const WordSearchGame = {
    initialized: false,
    isStarted: false,
    difficulty: 'facil',
    diffConfig: {
      facil: { size: 10, count: 6, allowReverse: false, allowDiag: false, name: '🟢 Fácil', multiplier: 1.0, desc: '6 conceptos (cuadrícula 10x10). Palabras en sentido horizontal y vertical.' },
      media: { size: 12, count: 8, allowReverse: false, allowDiag: true, name: '🟡 Media', multiplier: 1.5, desc: '8 conceptos (cuadrícula 12x12). Incluye palabras en diagonal.' },
      dificil: { size: 14, count: 10, allowReverse: true, allowDiag: true, name: '🔴 Difícil', multiplier: 2.0, desc: '10 conceptos (cuadrícula 14x14). Incluye diagonales y palabras invertidas.' }
    },
    timerSeconds: 0,
    timerInterval: null,
    size: 10,
    masterWords: [
      { word: 'CECOTROFIA', desc: 'Heces blandas ricas en vitamina B y aminoácidos que el conejo reingiere.' },
      { word: 'MOLLEJA', desc: 'Estómago muscular de las aves que muele granos con ayuda de piedrecillas.' },
      { word: 'CRESTA', desc: 'Estructura vascularizada del gallo que disipa calor como un radiador.' },
      { word: 'HENO', desc: 'Fibra indispensable que forma el 80% de la dieta del conejo para desgaste dental.' },
      { word: 'INCUBACION', desc: 'Período de calor de 21 días para el desarrollo del pollito en el huevo.' },
      { word: 'AGAPORNIS', desc: 'Aves psitácidas africanas monógamas con patas zigodáctilas para trepar.' },
      { word: 'PATOS', desc: 'Aves de plumaje impermeable con glándula uropígea y patas palmeadas.' },
      { word: 'FORRAJE', desc: 'Pasto fresco y verde rico en carotenoides que pigmenta yemas de huevos.' },
      { word: 'BIENESTAR', desc: 'Manejo respetuoso, agua fresca, alimento balanceado y enriquecimiento.' },
      { word: 'GALLINERO', desc: 'Instalación seca y ventilada con perchas elevadas y nidales protegidos.' },
      { word: 'UROPIGEA', desc: 'Glándula sebácea sobre la cola del pato que impermeabiliza su plumaje.' },
      { word: 'BUCHE', desc: 'Bolsa esofágica de las aves donde humedecen y almacenan el alimento.' },
      { word: 'CHABO', desc: 'Raza de gallito japonés ornamental de patas cortas y plumas sedosas.' },
      { word: 'GRIT', desc: 'Piedrecillas silíceas que las aves tragan para triturar comida en la molleja.' },
      { word: 'CEREO', desc: 'Zona carnosa sobre el pico de la catita que indica su sexo biológico.' },
      { word: 'ZIGODACTILA', desc: 'Pata con dos dedos hacia adelante y dos hacia atrás para trepar ramas.' },
      { word: 'ESPOLON', desc: 'Estructura córnea defensiva en los tarsos de los gallos del liceo.' },
      { word: 'ALTRICIAL', desc: 'Tipo de cría que nace indefensa, ciega y sin pelo, como los gazapos.' },
      { word: 'CAROTENO', desc: 'Pigmento natural del pasto que da color amarillo a la yema de huevo.' },
      { word: 'GAZAPO', desc: 'Nombre que recibe la cría recién nacida del conejo de granja.' },
      { word: 'NIDAL', desc: 'Cajón oscuro y acolchado con paja limpia donde las gallinas ponen huevos.' },
      { word: 'PICOTEO', desc: 'Jerarquía social natural mediante la cual las aves organizan el gallinero.' },
      { word: 'AUSTRALIA', desc: 'Continente de origen silvestre de las catitas o periquitos australianos.' },
      { word: 'DESPARASITAR', desc: 'Cuidado sanitario contra ácaros y piojillos mediante baños de tierra.' }
    ],
    words: [],
    grid: [],
    foundWords: new Set(),
    startCell: null,
    isSelecting: false,

    start() {
      this.initialized = true;
      this.initStartScreen();
      this.showStartScreen();
    },

    initStartScreen() {
      const playBtn = document.getElementById('wsStartPlayBtn');
      if (playBtn) {
        playBtn.onclick = () => this.startPlaying();
      }

      const diffSelector = document.getElementById('wsDiffSelector');
      if (diffSelector) {
        diffSelector.querySelectorAll('.diff-card-btn').forEach(btn => {
          btn.onclick = () => {
            diffSelector.querySelectorAll('.diff-card-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            this.difficulty = btn.dataset.diff || 'facil';
            this.updateDifficultyUI();
            this.showStartScreen();
          };
        });
      }
      this.updateDifficultyUI();
    },

    updateDifficultyUI() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      const diffValEl = document.getElementById('wsDiffVal');
      if (diffValEl) {
        diffValEl.textContent = cfg.name;
        diffValEl.style.color = (this.difficulty === 'facil') ? '#16a34a' : ((this.difficulty === 'media') ? '#d97706' : '#dc2626');
      }
      const descEl = document.getElementById('wsStageDynamicDesc');
      if (descEl) descEl.textContent = cfg.desc;
    },

    showStartScreen() {
      clearInterval(this.timerInterval);
      this.isStarted = false;
      this.timerSeconds = 0;
      this.clearSelection();
      this.updateDifficultyUI();

      const overlay = document.getElementById('wsStartOverlay');
      if (overlay) overlay.classList.remove('hidden');

      this.generateGrid();
      this.render();
      this.updateProgress();
    },

    startPlaying() {
      const overlay = document.getElementById('wsStartOverlay');
      if (overlay) overlay.classList.add('hidden');

      this.isStarted = true;
      this.timerSeconds = 0;
      this.updateDifficultyUI();
      this.updateProgress();

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.updateProgress();
      }, 1000);

      AudioFX.jump();
    },

    reset() {
      this.showStartScreen();
    },

    generateGrid() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      this.size = cfg.size;
      this.foundWords.clear();
      this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(''));

      // Seleccionar palabras aleatorias de la biblioteca según dificultad
      const shuffled = [...this.masterWords].sort(() => Math.random() - 0.5);
      this.words = shuffled.slice(0, cfg.count);

      // Colocar cada palabra en la matriz
      this.words.forEach(wObj => {
        const word = wObj.word;
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 250) {
          attempts++;
          const maxDir = cfg.allowDiag ? 3 : 2;
          const dir = Math.floor(Math.random() * maxDir); // 0: horizontal, 1: vertical, 2: diagonal
          let r = Math.floor(Math.random() * this.size);
          let c = Math.floor(Math.random() * this.size);

          const shouldReverse = cfg.allowReverse && Math.random() < 0.4;
          const targetStr = shouldReverse ? word.split('').reverse().join('') : word;

          let canPlace = true;
          for (let k = 0; k < targetStr.length; k++) {
            let nr = r + (dir === 1 || dir === 2 ? k : 0);
            let nc = c + (dir === 0 || dir === 2 ? k : 0);
            if (nr >= this.size || nc >= this.size) { canPlace = false; break; }
            if (this.grid[nr][nc] !== '' && this.grid[nr][nc] !== targetStr[k]) { canPlace = false; break; }
          }

          if (canPlace) {
            for (let k = 0; k < targetStr.length; k++) {
              let nr = r + (dir === 1 || dir === 2 ? k : 0);
              let nc = c + (dir === 0 || dir === 2 ? k : 0);
              this.grid[nr][nc] = targetStr[k];
            }
            wObj.coords = { r, c, dir, len: targetStr.length, isReversed: shouldReverse };
            placed = true;
          }
        }
      });

      // Rellenar espacios vacíos con letras aleatorias
      const abc = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          if (this.grid[r][c] === '') {
            this.grid[r][c] = abc[Math.floor(Math.random() * abc.length)];
          }
        }
      }
    },

    render() {
      const gridEl = document.getElementById('wsGrid');
      const cluesEl = document.getElementById('wsCluesList');
      if (!gridEl || !cluesEl) return;

      // Configurar columnas de cuadrícula según tamaño
      gridEl.style.gridTemplateColumns = `repeat(${this.size}, 1fr)`;

      // Renderizar cuadrícula
      gridEl.innerHTML = '';
      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const cell = document.createElement('div');
          cell.className = 'ws-cell';
          cell.textContent = this.grid[r][c];
          cell.dataset.r = r;
          cell.dataset.c = c;

          cell.addEventListener('mousedown', () => this.handleCellDown(r, c));
          cell.addEventListener('mouseenter', () => this.handleCellOver(r, c));
          gridEl.appendChild(cell);
        }
      }

      document.addEventListener('mouseup', () => this.handleCellUp());

      // Renderizar pistas ilustradas
      cluesEl.innerHTML = '';
      this.words.forEach(wObj => {
        const isFound = this.foundWords.has(wObj.word);
        const card = document.createElement('div');
        card.className = 'clue-card' + (isFound ? ' found' : '');
        card.id = 'clue-' + wObj.word;
        card.innerHTML = `
          <div class="clue-check">${isFound ? '✅' : '🔍'}</div>
          <div class="clue-text-wrap">
            <div class="clue-word">${wObj.word}</div>
            <div class="clue-desc">${wObj.desc}</div>
          </div>
        `;
        cluesEl.appendChild(card);
      });

      this.updateProgress();
    },

    handleCellDown(r, c) {
      if (!this.isStarted) return;
      this.isSelecting = true;
      this.startCell = { r, c };
      this.clearSelection();
      this.highlightPath(r, c, r, c);
    },

    handleCellOver(r, c) {
      if (!this.isSelecting || !this.startCell) return;
      this.clearSelection();
      this.highlightPath(this.startCell.r, this.startCell.c, r, c);
    },

    handleCellUp() {
      if (!this.isSelecting) return;
      this.isSelecting = false;

      // Extraer palabra seleccionada
      const selectedCells = Array.from(document.querySelectorAll('.ws-cell.selecting'));
      const formedWord = selectedCells.map(el => el.textContent).join('');
      const formedReversed = formedWord.split('').reverse().join('');

      const matchedWord = this.words.find(w => w.word === formedWord || w.word === formedReversed);
      if (matchedWord && !this.foundWords.has(matchedWord.word)) {
        AudioFX.match();
        this.foundWords.add(matchedWord.word);
        selectedCells.forEach(el => {
          el.classList.remove('selecting');
          el.classList.add('found');
        });

        const clueEl = document.getElementById('clue-' + matchedWord.word);
        if (clueEl) {
          clueEl.classList.add('found');
          clueEl.querySelector('.clue-check').textContent = '✅';
        }

        // Guardar concepto en el cuaderno "Mis Pistas"
        if (typeof CluesNotebook !== 'undefined') {
          CluesNotebook.addClue({
            title: matchedWord.word,
            fact: matchedWord.desc,
            game: 'Sopa de Letras',
            icon: '🔤'
          });
        }

        showQuizClueToast(`💡 Concepto Guardado en "Mis Pistas": ${matchedWord.word} — ${matchedWord.desc}`, '🔤');
        this.updateProgress();

        if (this.foundWords.size === this.words.length) {
          clearInterval(this.timerInterval);
          AudioFX.win();
          const mins = Math.floor(this.timerSeconds / 60);
          const secs = this.timerSeconds % 60;
          const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

          // Cálculo de puntuación para el Ranking Arcade
          const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
          const baseScore = cfg.count * 130;
          const timeBonus = Math.max(0, 400 - this.timerSeconds * 2);
          const totalScore = Math.round((baseScore + timeBonus) * cfg.multiplier);

          // Guardar récord en el estado del estudiante y persistir
          if (typeof state !== 'undefined') {
            state.minigames = state.minigames || {};
            state.minigames.wordsearch = state.minigames.wordsearch || {};
            const prevBest = state.minigames.wordsearch.bestScore || 0;
            state.minigames.wordsearch.bestScore = Math.max(prevBest, totalScore);
            state.minigames.wordsearch.bestTime = Math.min(state.minigames.wordsearch.bestTime || 9999, this.timerSeconds);
            if (typeof saveState === 'function') saveState();
          }
          if (typeof window.unlockBadge === 'function') window.unlockBadge('ojo_halcon');
          if (typeof checkMaestroArcade === 'function') checkMaestroArcade();
          if (typeof window.refreshRankingWidget === 'function') {
            window.refreshRankingWidget();
          }

          const conceptsListHtml = `<div style="margin-top:10px;text-align:left;background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.82rem;color:#1e293b;"><b>💡 Conceptos Dominados (Guardados en "Mis Pistas"):</b><ul style="margin:6px 0 0 16px;padding:0;">${this.words.map(w => `<li><b>${w.word}:</b> ${w.desc}</li>`).join('')}</ul></div>`;

          setTimeout(() => {
            showGameVictory({
              icon: '🔍',
              title: '¡Sopa de Letras Agroecológica Superada!',
              subtitle: `Dificultad: ${cfg.name} — Conceptos Guardados en tu Cuaderno`,
              stamp: 'ZOOTECNIA COMUNITARIA',
              msg: `¡Excelente trabajo! Has identificado los ${this.words.length} conceptos clave en nivel <b>${cfg.name}</b>. Los puntos se sumaron al Salón de Honor Arcade y los términos quedaron registrados en <b>Mis Pistas</b> para tus Quizzes por décimas.`,
              stats: `⭐ <b>Puntaje Obtenido:</b> ${totalScore} pts (${cfg.name}) &nbsp;|&nbsp; 🎯 <b>Conceptos:</b> ${this.words.length}/${this.words.length} &nbsp;|&nbsp; ⏱️ <b>Tiempo:</b> ${timeStr}${conceptsListHtml}`,
              onRestart: () => this.showStartScreen()
            });
          }, 300);
        }
      } else {
        this.clearSelection();
      }
    },

    clearSelection() {
      document.querySelectorAll('.ws-cell.selecting').forEach(el => el.classList.remove('selecting'));
    },

    highlightPath(r1, c1, r2, c2) {
      const dr = r2 - r1;
      const dc = c2 - c1;

      // Solo permitir línea recta: horizontal, vertical o diagonal 45°
      if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return;

      const steps = Math.max(Math.abs(dr), Math.abs(dc));
      const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
      const stepC = dc === 0 ? 0 : dc / Math.abs(dc);

      for (let i = 0; i <= steps; i++) {
        const currR = r1 + (i * stepR);
        const currC = c1 + (i * stepC);
        const cell = document.querySelector(`.ws-cell[data-r="${currR}"][data-c="${currC}"]`);
        if (cell) cell.classList.add('selecting');
      }
    },

    updateProgress() {
      const countEl = document.getElementById('wsCountVal');
      if (countEl) countEl.textContent = `${this.foundWords.size}/${this.words.length}`;

      const timeEl = document.getElementById('wsTimeVal');
      if (timeEl) {
        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  };

  /* ============================================================
     JUEGO 3: PLATAFORMAS 2D (AVENTURA EN LA GRANJA B-13)
     Generación procedural aleatoria por intento, daño real por lodo,
     pergaminos coleccionables con pistas de quiz y llegada garantizada al granero
     ============================================================ */
  const CLUES_BANK = [
    '🐰 Cecotrofia: Los conejos reingieren heces blandas ricas en vitamina B y aminoácidos esenciales.',
    '🐰 Dieta Conejo: El heno seco debe componer el 80% de su alimento para desgastar sus incisivos.',
    '🐔 Molleja de Aves: No tienen dientes; la molleja tritura granos duros con piedrecillas (grit).',
    '🐔 Baño de Ceniza: Las gallinas se revuelcan en tierra seca para asfixiar ácaros y piojillos.',
    '🐓 Cresta del Gallo: Órgano vascularizado que disipa calor corporal en días de calor.',
    '🐓 Espolón: Estructura córnea defensiva en los tarsos de los gallos para la jerarquía del gallinero.',
    '🦆 Patos y Agua: La glándula uropígea secreta aceite con que impermeabilizan su plumaje al nadar.',
    '🦆 Peligro de Pan Blanco: Alimenta patos solo con granos y vegetales; el pan les provoca «ala de ángel».',
    '🦜 Psitácidos Trepadores: Catitas y agapornis tienen patas zigodáctilas (2 dedos adelante y 2 atrás).',
    '🦜 Céreo de Catita: Céreo azul indica macho adulto y marrón o beige indica hembra.',
    '🦜 Alimentos Prohibidos: La palta (aguacate) y el chocolate son toxinas letales para todas las aves.',
    '🥚 Incubación: El pollito dentro del huevo requiere 21 días de calor continuo (37.5°C) para nacer.'
  ];

  const PlatformerGame = {
    initialized: false,
    isRunning: false,
    isFinished: false,
    canvas: null,
    ctx: null,
    reqId: null,
    score: 0,
    lives: 3,
    maxLives: 3,
    timerSeconds: 0,
    timerInterval: null,
    keys: { left: false, right: false, jump: false, dash: false },
    selectedAnimal: 'conejo',
    animalEmojis: {
      conejo: '🐰',
      gallo: '🐓',
      gallina: '🐔',
      pato: '🦆',
      agapornis: '🦜',
      catita: '🐦'
    },
    difficulty: 'facil',
    unlockedDifficulties: ['facil', 'media', 'dificil', 'legendaria'],
    diffConfig: {
      facil: {
        name: '🟢 Fácil',
        title: 'Granja Campestre (Stardew Valley)',
        subtitle: 'Paseo tranquilo, fardos amplios y trampolines de heno generosos. 3 Vidas.',
        lives: 3,
        speed: 4.8,
        gravity: 0.62,
        jumpStrength: 10.5,
        theme: 'facil',
        dashEnabled: false
      },
      media: {
        name: '🟡 Media',
        title: 'Huerto de Zarzas y Viento',
        subtitle: 'Plataformas móviles y fardos quebradizos con ráfagas de viento otoñal. 3 Vidas.',
        lives: 3,
        speed: 5.0,
        gravity: 0.62,
        jumpStrength: 10.5,
        theme: 'media',
        dashEnabled: false
      },
      dificil: {
        name: '🔴 Difícil',
        title: 'Cavernas Huecas (Hollow Knight)',
        subtitle: 'Aguijón Pogo sobre setas bioluminiscentes, fosos de ácido y 2 Vidas. ¡Vence este nivel para desbloquear el Modo Extremo!',
        lives: 2,
        speed: 5.2,
        gravity: 0.64,
        jumpStrength: 10.6,
        theme: 'dificil',
        dashEnabled: false
      },
      extrema: {
        name: '🟣 Extrema',
        title: 'La Gran Pesadilla (Celeste & Cuphead)',
        subtitle: 'Air Dash estilo Celeste (Shift/X), Pink Parries estilo Cuphead (💖), sierras giratorias y muerte súbita (1 Vida).',
        lives: 1,
        speed: 5.4,
        gravity: 0.65,
        jumpStrength: 10.8,
        theme: 'extrema',
        dashEnabled: true
      },
      legendaria: {
        name: '👑 Legendaria',
        title: 'Cacería Salvaje — Lobo Sombra y Reloj Fatal',
        subtitle: '¡Límite estricto de 45 segundos! El voraz Lobo Sombra te pisa los talones sin descanso. Air Dash habilitado y 1 Sola Vida.',
        lives: 1,
        speed: 5.6,
        gravity: 0.65,
        jumpStrength: 10.8,
        theme: 'legendaria',
        dashEnabled: true,
        timeLimit: 45
      }
    },
    player: {
      x: 50,
      y: 150,
      w: 38,
      h: 38,
      vx: 0,
      vy: 0,
      speed: 4.8,
      jumpStrength: 10.5,
      grounded: false,
      emoji: '🐰',
      accEmoji: '',
      facing: 1,
      runCycle: 0,
      landSquash: 0,
      invulnerableTime: 0,
      hasAirDash: true,
      dashCooldown: 0,
      isDashing: false,
      dashTimer: 0,
      currentPlatform: null
    },
    cameraX: 0,
    worldWidth: 4200,
    platforms: [],
    trampolines: [],
    mushrooms: [],
    dashCrystals: [],
    parryOrbs: [],
    sawblades: [],
    mudPuddles: [],
    acidPuddles: [],
    thorns: [],
    quizScrolls: [],
    items: [],
    particles: [],
    dashTrails: [],
    slashEffects: [],
    ambientLeaves: [],
    floatingTexts: [],
    unlockedClues: [],
    goal: { x: 3960, y: 150, w: 180, h: 190 },
    lastTime: 0,
    animTime: 0,
    screenShake: 0,
    hitFreeze: 0,
    wallopBannerTimer: 0,

    start() {
      this.initialized = true;
      this.canvas = document.getElementById('platformerCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.loadUnlockedDifficulties();
      this.initRunnerSelector();
      this.initDifficultySelectors();
      this.initStartScreen();
      this.setupControls();
      this.showStartScreen();
    },

    loadUnlockedDifficulties() {
      if (typeof state !== 'undefined') {
        state.minigames = state.minigames || {};
        state.minigames.platformer = state.minigames.platformer || {};
        if (!Array.isArray(state.minigames.platformer.unlockedDifficulties)) {
          state.minigames.platformer.unlockedDifficulties = ['facil', 'media', 'dificil', 'legendaria'];
        } else if (!state.minigames.platformer.unlockedDifficulties.includes('legendaria')) {
          state.minigames.platformer.unlockedDifficulties.push('legendaria');
        }
        this.unlockedDifficulties = state.minigames.platformer.unlockedDifficulties;
      }
      this.updateDifficultyUI();
    },

    setDifficulty(diffId) {
      if (!this.unlockedDifficulties.includes(diffId)) {
        AudioFX.wrong();
        showQuizClueToast('🔒 El Modo Extremo está bloqueado. ¡Completa el nivel Difícil (Cavernas Huecas) para desbloquear la Pesadilla Arcade!', '🏆');
        return;
      }
      this.difficulty = diffId;
      this.updateDifficultyUI();
      if (!this.isRunning) {
        this.showStartScreen();
      }
    },

    updateDifficultyUI() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      const diffValEl = document.getElementById('platDiffVal');
      if (diffValEl) {
        diffValEl.textContent = cfg.name;
        diffValEl.style.color = (this.difficulty === 'facil') ? '#16a34a'
          : (this.difficulty === 'media') ? '#d97706'
          : (this.difficulty === 'dificil') ? '#dc2626'
          : (this.difficulty === 'legendaria') ? '#b45309'
          : '#9333ea';
      }

      // Actualizar botones en la barra rápida
      document.querySelectorAll('#quickDiffPillGroup .diff-pill-btn').forEach(btn => {
        const d = btn.dataset.diff;
        if (d === this.difficulty) btn.classList.add('active');
        else btn.classList.remove('active');

        if (d === 'extrema') {
          const isUnlocked = this.unlockedDifficulties.includes('extrema');
          btn.classList.toggle('locked', !isUnlocked);
          const icon = document.getElementById('pillLockIcon');
          if (icon) icon.textContent = isUnlocked ? '🔥' : '🔒';
        }
      });

      // Actualizar botones en el modal previo
      document.querySelectorAll('#modalDiffSelector .diff-card-btn').forEach(btn => {
        const d = btn.dataset.diff;
        if (d === this.difficulty) btn.classList.add('active');
        else btn.classList.remove('active');

        if (d === 'extrema') {
          const isUnlocked = this.unlockedDifficulties.includes('extrema');
          btn.classList.toggle('locked', !isUnlocked);
          const icon = document.getElementById('modalLockIcon');
          if (icon) icon.textContent = isUnlocked ? '🔥' : '🔒';
        }
      });

      // Controles táctiles móviles y recordatorio de Dash
      const touchDash = document.getElementById('touchBtnDash');
      const dashHint = document.getElementById('dashControlsQuickHint');
      if (touchDash) {
        touchDash.style.display = cfg.dashEnabled ? 'inline-flex' : 'none';
      }
      if (dashHint) {
        dashHint.style.display = cfg.dashEnabled ? 'inline' : 'none';
      }
      this.updateDashUI();

      // Títulos del start overlay
      const pill = document.getElementById('platStagePill');
      const title = document.getElementById('platStageTitle');
      const sub = document.getElementById('platStageSubtitle');
      if (pill) pill.textContent = `🏃‍♂️🌾 NIVEL: ${cfg.name.toUpperCase()} — B-13`;
      if (title) title.textContent = `${cfg.title}`;
      if (sub) sub.textContent = cfg.subtitle;
    },

    initDifficultySelectors() {
      // Pills en la barra rápida exterior
      document.querySelectorAll('#quickDiffPillGroup .diff-pill-btn').forEach(btn => {
        btn.onclick = () => {
          const diff = btn.dataset.diff || 'facil';
          this.setDifficulty(diff);
        };
      });

      // Cards en el modal de inicio
      document.querySelectorAll('#modalDiffSelector .diff-card-btn').forEach(btn => {
        btn.onclick = () => {
          const diff = btn.dataset.diff || 'facil';
          this.setDifficulty(diff);
        };
      });
    },

    initRunnerSelector() {
      const allButtons = document.querySelectorAll('.runner-pick-btn');
      allButtons.forEach(btn => {
        btn.onclick = () => {
          const animalId = btn.dataset.animal || 'conejo';
          this.setAnimalRunner(animalId);
          allButtons.forEach(b => {
            if (b.dataset.animal === animalId) b.classList.add('active');
            else b.classList.remove('active');
          });
        };
      });
    },

    initStartScreen() {
      const playBtn = document.getElementById('platStartPlayBtn');
      if (playBtn) {
        playBtn.onclick = () => this.startRun();
      }
    },

    showStartScreen(isRetry = false, retryStats = null) {
      this.isRunning = false;
      this.isFinished = false;
      if (this.reqId) {
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
      }
      clearInterval(this.timerInterval);
      AudioFX.stopAll();

      const overlay = document.getElementById('platStartOverlay');
      if (overlay) overlay.classList.remove('hidden');

      const stagePill = document.getElementById('platStagePill');
      const stageTitle = document.getElementById('platStageTitle');
      const stageSubtitle = document.getElementById('platStageSubtitle');
      const playBtn = document.getElementById('platStartPlayBtn');
      const retryCard = document.getElementById('platRetrySummaryCard');

      if (isRetry) {
        if (stagePill) {
          stagePill.innerHTML = '<span>🔄</span> MODO REINTENTO &amp; REVANCHA — B-13';
          stagePill.className = 'stage-badge-pill stage-badge-retry';
        }
        if (stageTitle) stageTitle.textContent = '¿Listo para tu Revancha?';
        if (stageSubtitle) stageSubtitle.textContent = '¡No te rindas! Ajusta tu corredor, cambia de dificultad si lo necesitas y supera tu marca anterior.';
        if (playBtn) {
          playBtn.innerHTML = '<span>🚀</span> ¡Reintentar la Carrera!';
          playBtn.className = 'stage-play-btn stage-play-btn-retry';
        }
        if (retryCard && retryStats) {
          const tipText = (this.difficulty === 'extrema')
            ? 'En Pesadilla Arcade usa el Air Dash (<kbd class="kbd-chip">Shift</kbd> / <kbd class="kbd-chip">X</kbd>) en el aire para cruzar precipicios.'
            : (this.difficulty === 'dificil')
            ? 'Aprovecha las setas elásticas para tomar altura sobre las pozas de lodo tóxico.'
            : 'Si caes abajo, busca los trampolines amarillos para rebotar hacia las plataformas superiores.';

          retryCard.innerHTML = `
            <div class="retry-card-badge">📊 RESULTADO DEL ÚLTIMO INTENTO (${retryStats.runnerEmoji} · ${retryStats.diffName})</div>
            <div class="retry-card-stats-row">
              <div class="retry-stat-item"><span class="retry-stat-label">🏁 Recorrido:</span> <span class="retry-stat-value">${retryStats.pct}%</span></div>
              <div class="retry-stat-item"><span class="retry-stat-label">⭐ Puntaje:</span> <span class="retry-stat-value">${retryStats.score} pts</span></div>
              <div class="retry-stat-item"><span class="retry-stat-label">⏱️ Sobrevivido:</span> <span class="retry-stat-value">${retryStats.time}s</span></div>
              <div class="retry-stat-item"><span class="retry-stat-label">💡 Pistas:</span> <span class="retry-stat-value">${retryStats.clues}</span></div>
            </div>
            <div class="retry-card-tip">💡 <b>Estrategia de Revancha:</b> ${tipText}</div>
          `;
          retryCard.style.display = 'flex';
        }
      } else {
        if (stagePill) {
          stagePill.innerHTML = '🏃‍♂️🌾 AVENTURA EN LA GRANJA B-13';
          stagePill.className = 'stage-badge-pill';
        }
        if (stageTitle) stageTitle.textContent = 'Carrera hacia el Granero B-13';
        if (stageSubtitle) stageSubtitle.textContent = 'Configuración previa para una competencia limpia y pareja entre todos los estudiantes.';
        if (playBtn) {
          playBtn.innerHTML = '<span>▶</span> ¡Empezar la Carrera!';
          playBtn.className = 'stage-play-btn';
        }
        if (retryCard) retryCard.style.display = 'none';
      }

      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      this.score = 0;
      this.lives = cfg.lives;
      this.maxLives = cfg.lives;
      this.timerSeconds = 0;
      this.resetWorld();
      this.updateHud();
      this.draw();
    },

    startRun() {
      const overlay = document.getElementById('platStartOverlay');
      if (overlay) overlay.classList.add('hidden');

      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      this.resetWorld();
      this.score = 0;
      this.lives = cfg.lives;
      this.maxLives = cfg.lives;
      this.mudDamageCount = 0;
      this.isRunning = true;
      this.isFinished = false;

      if (this.difficulty === 'legendaria') {
        this.timerSeconds = 45;
        this.wallopBannerTimer = 2.4;
      } else {
        this.timerSeconds = 0;
        this.wallopBannerTimer = (this.difficulty === 'extrema') ? 1.8 : 0;
      }
      this.updateHud();

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        if (this.difficulty === 'legendaria') {
          this.timerSeconds--;
          this.updateHud();
          if (this.timerSeconds <= 0) {
            clearInterval(this.timerInterval);
            this.takeDamage(999, '⏱️ ¡TIEMPO AGOTADO! El Granero B-13 cerró sus puertas.');
          }
        } else {
          this.timerSeconds++;
          this.updateHud();
        }
      }, 1000);

      this.lastTime = performance.now();
      AudioFX.jump();
      this.loop(this.lastTime);
    },

    pauseRun() {
      this.isRunning = false;
      if (this.reqId) {
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
      }
      clearInterval(this.timerInterval);
      AudioFX.stopAll();
    },

    setAnimalRunner(animalId) {
      this.selectedAnimal = animalId;
      this.player.emoji = this.animalEmojis[animalId] || '🐰';
      this.loadAccessory();
      this.updateCharPreview();
      this.updateModalCharPreview();
      if (!this.isRunning) this.draw();
    },

    updateModalCharPreview() {
      const modalPreview = document.getElementById('modalCharPreview');
      if (modalPreview) {
        const nameCap = this.selectedAnimal.charAt(0).toUpperCase() + this.selectedAnimal.slice(1);
        const accInfo = this.player.accEmoji
          ? `<span style="display:inline-flex;align-items:center;gap:5px;background:#eef7e6;border:1.5px solid #2e3821;border-radius:6px;padding:3px 8px;margin-left:6px;font-size:0.82rem;font-weight:700;color:#183610;"><span style="font-size:1.15rem;">${this.player.accEmoji}</span> ${this.player.accLabel || 'Accesorio'}</span>`
          : `<span style="font-size:0.78rem;color:#666;font-style:italic;margin-left:6px;">(Sin accesorio equipado)</span>`;
        modalPreview.innerHTML = `Corredor activo: <b>${this.player.emoji} ${nameCap}</b> · ${accInfo}`;
      }
    },

    loadAccessory() {
      this.player.accEmoji = '';
      this.player.accLabel = 'Ninguno';
      if (typeof state !== 'undefined') {
        let accId = 'none';
        if (state.custom && state.custom[this.selectedAnimal] && state.custom[this.selectedAnimal].accessory) {
          accId = state.custom[this.selectedAnimal].accessory;
        } else if (state.custom && state.custom.conejo && state.custom.conejo.accessory) {
          accId = state.custom.conejo.accessory;
        }
        if (typeof getAnimalAccessoryEmoji === 'function') {
          this.player.accEmoji = getAnimalAccessoryEmoji(this.selectedAnimal, accId);
        } else if (typeof ACCESSORIES !== 'undefined') {
          const found = ACCESSORIES.find(x => x.id === accId);
          if (found && found.emoji) this.player.accEmoji = found.emoji;
        }
        if (typeof ACCESSORIES !== 'undefined') {
          const found = ACCESSORIES.find(x => x.id === accId);
          if (found) {
            this.player.accLabel = (accId === 'hat' && this.selectedAnimal === 'gallo') ? 'Sombrero Vaquero' : found.label;
          }
        }
      }
    },

    updateCharPreview() {
      const charEl = document.getElementById('charPreviewIcon');
      if (charEl) {
        charEl.innerHTML = `${this.player.emoji}${this.player.accEmoji ? ` <span style="font-size:1.2rem;margin-left:2px;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.35));">${this.player.accEmoji}</span>` : ''}`;
        charEl.title = `Corredor: ${this.selectedAnimal}${this.player.accEmoji ? ` con accesorio ${this.player.accLabel} (${this.player.accEmoji})` : ''}`;
      }
    },

    setupControls() {
      window.addEventListener('keydown', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName) || (e.target && e.target.isContentEditable)) return;
        if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
        if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
        if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
          this.keys.jump = true;
          e.preventDefault();
        }
        if (['ShiftLeft', 'ShiftRight', 'KeyX', 'KeyK'].includes(e.code)) {
          this.keys.dash = true;
          this.triggerDash();
          e.preventDefault();
        }
      });

      window.addEventListener('keyup', (e) => {
        if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName) || (e.target && e.target.isContentEditable)) return;
        if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
        if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
        if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.jump = false;
        if (['ShiftLeft', 'ShiftRight', 'KeyX', 'KeyK'].includes(e.code)) this.keys.dash = false;
      });

      const btnLeft = document.getElementById('touchBtnLeft');
      const btnRight = document.getElementById('touchBtnRight');
      const btnJump = document.getElementById('touchBtnJump');
      const btnDash = document.getElementById('touchBtnDash');

      if (btnLeft) {
        btnLeft.onpointerdown = (e) => { e.preventDefault(); this.keys.left = true; };
        btnLeft.onpointerup = (e) => { e.preventDefault(); this.keys.left = false; };
        btnLeft.onpointerleave = () => { this.keys.left = false; };
      }
      if (btnRight) {
        btnRight.onpointerdown = (e) => { e.preventDefault(); this.keys.right = true; };
        btnRight.onpointerup = (e) => { e.preventDefault(); this.keys.right = false; };
        btnRight.onpointerleave = () => { this.keys.right = false; };
      }
      if (btnJump) {
        btnJump.onpointerdown = (e) => { e.preventDefault(); this.keys.jump = true; };
        btnJump.onpointerup = (e) => { e.preventDefault(); this.keys.jump = false; };
        btnJump.onpointerleave = () => { this.keys.jump = false; };
      }
      if (btnDash) {
        btnDash.onpointerdown = (e) => {
          e.preventDefault();
          this.keys.dash = true;
          this.triggerDash();
        };
        btnDash.onpointerup = (e) => { e.preventDefault(); this.keys.dash = false; };
        btnDash.onpointerleave = () => { this.keys.dash = false; };
      }
    },

    triggerDash() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      if (!cfg.dashEnabled) return;
      const p = this.player;
      if (!p.hasAirDash || p.dashCooldown > 0) return;

      p.hasAirDash = false;
      p.dashCooldown = 22;
      p.isDashing = true;
      p.dashTimer = 14;
      p.vx = p.facing * 13.5;
      p.vy = -1.6;
      AudioFX.dash();
      this.screenShake = 6;
      this.hitFreeze = 2;

      for (let i = 0; i < 5; i++) {
        this.dashTrails.push({
          x: p.x - p.vx * (i * 0.28),
          y: p.y,
          facing: p.facing,
          emoji: p.emoji,
          accEmoji: p.accEmoji,
          color: ['#38bdf8', '#c084fc', '#f472b6', '#fbbf24', '#4ade80'][i],
          life: 1.0,
          decay: 0.08
        });
      }
      if (!this.totalDashCount) this.totalDashCount = 0;
      this.totalDashCount++;
      if (this.totalDashCount >= 10 && typeof window.unlockSecretBadge === 'function') {
        window.unlockSecretBadge('dash_celeste');
      }
      this.updateDashUI();
    },

    updateDashUI() {
      const dashBtn = document.getElementById('touchBtnDash');
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      if (dashBtn && cfg.dashEnabled) {
        if (this.player.hasAirDash && this.player.dashCooldown <= 0) {
          dashBtn.classList.remove('spent');
        } else {
          dashBtn.classList.add('spent');
        }
      }
    },

    reset() {
      this.showStartScreen();
    },

    resetWorld() {
      this.cameraX = 0;
      this.particles = [];
      this.dashTrails = [];
      this.slashEffects = [];
      this.floatingTexts = [];
      this.unlockedClues = [];
      this.animTime = 0;
      this.screenShake = 0;
      this.hitFreeze = 0;

      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      this.setAnimalRunner(this.selectedAnimal || 'conejo');

      // Jugador arranca en porche elevado
      this.player.x = 50;
      this.player.y = 150;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.speed = cfg.speed;
      this.player.jumpStrength = cfg.jumpStrength;
      this.player.grounded = false;
      this.player.facing = 1;
      this.player.landSquash = 0;
      this.player.invulnerableTime = 0;
      this.player.hasAirDash = true;
      this.player.dashCooldown = 0;
      this.player.isDashing = false;
      this.player.dashTimer = 0;
      this.player.currentPlatform = null;
      this.updateDashUI();

      // Perseguidor Lobo Sombra en Modo Legendario
      if (this.difficulty === 'legendaria') {
        this.chaserEnemy = {
          x: -160,
          y: 280,
          w: 48,
          h: 44,
          speed: 4.88,
          animTime: 0
        };
      } else {
        this.chaserEnemy = null;
      }

      // Hojas/esporas según dificultad
      this.ambientLeaves = [];
      const leafCount = (this.difficulty === 'dificil') ? 35 : (this.difficulty === 'legendaria') ? 42 : 26;
      for (let i = 0; i < leafCount; i++) {
        this.ambientLeaves.push({
          x: Math.random() * 4200,
          y: Math.random() * 340,
          size: 3 + Math.random() * 3.5,
          speedX: 0.7 + Math.random() * 0.9,
          speedY: 0.3 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI * 2,
          color: (this.difficulty === 'dificil')
            ? ['#38bdf8', '#818cf8', '#c084fc', '#a5f3fc'][Math.floor(Math.random() * 4)] // Esporas luminosas Hollow Knight
            : (this.difficulty === 'legendaria')
            ? ['#ef4444', '#f97316', '#b91c1c', '#dc2626', '#fbbf24'][Math.floor(Math.random() * 5)] // Cenizas incandescentes de Lobo Sombra
            : (this.difficulty === 'extrema')
            ? ['#f472b6', '#a855f7', '#fbbf24', '#f43f5e', '#38bdf8'][Math.floor(Math.random() * 5)] // Neón Celeste / Cuphead
            : ['#fbcfe8', '#f472b6', '#fed7aa', '#fde047', '#a7f3d0'][Math.floor(Math.random() * 5)] // Pétalos Stardew
        });
      }

      // Suelo continuo en la zanja inferior (y = 340) + porche inicial de madera
      this.platforms = [
        { x: 0, y: 340, w: 4200, h: 60, type: 'ground' },
        { x: 20, y: 200, w: 150, h: 28, type: 'wood', label: 'Porche Salida' }
      ];

      // Variación sutil garantizando que plataformas elevadas estén en y ≤ 210
      const rOffset = () => (Math.random() - 0.5) * 16;
      const isLegendaria = this.difficulty === 'legendaria';
      const isExtrema = this.difficulty === 'extrema' || isLegendaria;
      const isDificil = this.difficulty === 'dificil' || isExtrema;
      const isMedia = this.difficulty === 'media';

      // Sección 1 (x: 250 - 950)
      this.platforms.push(
        { x: 250 + rOffset(), y: 205, w: isExtrema ? 85 : 110, h: 40, type: isMedia ? 'crumbling' : 'straw', crumbleTimer: 0.6, maxCrumble: 0.6, label: 'Fardo 1' },
        { x: 430 + rOffset(), y: 185, w: 135, h: 26, type: 'wood', label: 'Pasarela 1', lantern: true },
        { x: 635 + rOffset(), y: 198, w: isDificil ? 85 : 115, h: 40, type: isExtrema ? 'crumbling' : 'straw', crumbleTimer: 0.45, maxCrumble: 0.45, label: 'Fardo 2' },
        { x: 820 + rOffset(), y: 180, w: isExtrema ? 95 : 130, h: 26, type: 'wood', label: 'Terraza 1' }
      );

      // Sección 2 (x: 1040 - 1760)
      this.platforms.push(
        { x: 1040 + rOffset(), y: 205, w: isDificil ? 85 : 115, h: 40, type: isDificil ? 'crumbling' : 'straw', crumbleTimer: 0.5, maxCrumble: 0.5, label: 'Fardo 3' },
        {
          x: 1230 + rOffset(), y: 180, w: isExtrema ? 100 : 135, h: 26,
          type: (isMedia || isExtrema) ? 'moving' : 'wood',
          baseX: 1230, rangeX: 65, speed: 1.8,
          label: 'Puente Móvil 2', lantern: true
        },
        { x: 1445 + rOffset(), y: 200, w: isExtrema ? 80 : 110, h: 40, type: isMedia ? 'crumbling' : 'straw', crumbleTimer: 0.6, maxCrumble: 0.6, label: 'Fardo 4' },
        { x: 1625 + rOffset(), y: 185, w: isDificil ? 90 : 135, h: 26, type: 'wood', label: 'Andamio 2' }
      );

      // Sección 3 (x: 1860 - 2580)
      this.platforms.push(
        { x: 1860 + rOffset(), y: 195, w: isExtrema ? 85 : 120, h: 40, type: isExtrema ? 'crumbling' : 'straw', crumbleTimer: 0.4, maxCrumble: 0.4, label: 'Fardo 5' },
        {
          x: 2055 + rOffset(), y: 175, w: isExtrema ? 95 : 135, h: 26,
          type: (isMedia || isExtrema) ? 'moving' : 'wood',
          baseX: 2055, rangeX: 70, speed: 2.1,
          label: 'Pasarela Huerto', lantern: true
        },
        { x: 2265 + rOffset(), y: 205, w: isDificil ? 85 : 115, h: 40, type: isDificil ? 'crumbling' : 'straw', crumbleTimer: 0.5, maxCrumble: 0.5, label: 'Fardo 6' },
        { x: 2450 + rOffset(), y: 180, w: isExtrema ? 95 : 135, h: 26, type: 'wood', label: 'Terraza Central' }
      );

      // Sección 4 (x: 2690 - 3410)
      this.platforms.push(
        { x: 2690 + rOffset(), y: 200, w: isExtrema ? 85 : 125, h: 40, type: isMedia ? 'crumbling' : 'straw', crumbleTimer: 0.6, maxCrumble: 0.6, label: 'Fardo 7' },
        {
          x: 2885 + rOffset(), y: 180, w: isExtrema ? 100 : 140, h: 26,
          type: (isMedia || isExtrema) ? 'moving' : 'wood',
          baseX: 2885, rangeX: 75, speed: 2.2,
          label: 'Puente Rústico', lantern: true
        },
        { x: 3095 + rOffset(), y: 195, w: isDificil ? 85 : 115, h: 40, type: isExtrema ? 'crumbling' : 'straw', crumbleTimer: 0.4, maxCrumble: 0.4, label: 'Fardo 8' },
        { x: 3280 + rOffset(), y: 180, w: isExtrema ? 95 : 130, h: 26, type: 'wood', label: 'Terraza Alta' }
      );

      // Sección 5: Llegada al Granero (x: 3510 - 3960)
      this.platforms.push(
        { x: 3510 + rOffset(), y: 205, w: isExtrema ? 90 : 120, h: 40, type: isDificil ? 'crumbling' : 'straw', crumbleTimer: 0.5, maxCrumble: 0.5, label: 'Fardo Final' },
        { x: 3700 + rOffset(), y: 190, w: 140, h: 26, type: 'wood', label: 'Pasarela Granero', lantern: true },
        { x: 3885, y: 210, w: 110, h: 30, type: 'wood', label: 'Porche Granero' }
      );

      // Trampolines de heno (Fácil y Media)
      this.trampolines = [];
      if (!isDificil) {
        this.trampolines = [
          { x: 890, y: 324, w: 56, h: 16, cooldown: 0 },
          { x: 1690, y: 324, w: 56, h: 16, cooldown: 0 },
          { x: 2500, y: 324, w: 56, h: 16, cooldown: 0 },
          { x: 3320, y: 324, w: 56, h: 16, cooldown: 0 }
        ];
      }

      // Setas rebotadoras Pogo (Hollow Knight) en Difícil y Extrema
      this.mushrooms = [];
      if (isDificil) {
        this.mushrooms = [
          { x: 890, y: 318, w: 52, h: 22, cooldown: 0 },
          { x: 1690, y: 318, w: 52, h: 22, cooldown: 0 },
          { x: 2500, y: 318, w: 52, h: 22, cooldown: 0 },
          { x: 3320, y: 318, w: 52, h: 22, cooldown: 0 }
        ];
      }

      // Cristales de recarga de Dash Celeste (solo en Extrema)
      this.dashCrystals = [];
      if (isExtrema) {
        this.dashCrystals = [
          { x: 740, y: 150, taken: false, respawnTimer: 0 },
          { x: 1540, y: 145, taken: false, respawnTimer: 0 },
          { x: 2360, y: 140, taken: false, respawnTimer: 0 },
          { x: 3180, y: 145, taken: false, respawnTimer: 0 }
        ];
      }

      // Pink Parry Orbs estilo Cuphead (solo en Extrema)
      this.parryOrbs = [];
      if (isExtrema) {
        this.parryOrbs = [
          { x: 530, y: 140, cooldown: 0, emoji: '💖' },
          { x: 1330, y: 130, cooldown: 0, emoji: '🦋' },
          { x: 2160, y: 135, cooldown: 0, emoji: '💖' },
          { x: 2990, y: 130, cooldown: 0, emoji: '🦋' }
        ];
      }

      // Sierras giratorias mecánicas patrullando en vertical (solo en Extrema)
      this.sawblades = [];
      if (isExtrema) {
        this.sawblades = [
          { x: 990, y: 210, baseY: 210, rangeY: 55, speed: 2.5, rad: 16 },
          { x: 1810, y: 200, baseY: 200, rangeY: 50, speed: 2.8, rad: 16 },
          { x: 2630, y: 210, baseY: 210, rangeY: 55, speed: 2.6, rad: 16 }
        ];
      }

      // Charcos de barro / ácido según dificultad
      this.mudPuddles = [];
      this.acidPuddles = [];
      if (isDificil) {
        this.acidPuddles = [
          { x: 500, y: 338, w: 110, h: 12 },
          { x: 1290, y: 338, w: 115, h: 12 },
          { x: 2100, y: 338, w: 120, h: 12 },
          { x: 2920, y: 338, w: 115, h: 12 },
          { x: 3600, y: 338, w: 100, h: 12 }
        ];
      } else {
        this.mudPuddles = [
          { x: 500, y: 338, w: 105, h: 12 },
          { x: 1290, y: 338, w: 110, h: 12 },
          { x: 2100, y: 338, w: 115, h: 12 },
          { x: 2920, y: 338, w: 110, h: 12 },
          { x: 3600, y: 338, w: 95, h: 12 }
        ];
      }

      // Zarzas espinosas
      this.thorns = [
        { x: 710, y: 318, w: 34, h: 22 },
        { x: 1510, y: 318, w: 34, h: 22 },
        { x: 2320, y: 318, w: 34, h: 22 },
        { x: 3130, y: 318, w: 34, h: 22 }
      ];

      // 3 Pergaminos de Quiz
      const shuffledClues = [...CLUES_BANK].sort(() => Math.random() - 0.5);
      this.quizScrolls = [
        { x: 495, y: 145, taken: false, clue: shuffledClues[0] },
        { x: 1300, y: 140, taken: false, clue: shuffledClues[1] },
        { x: 2955, y: 140, taken: false, clue: shuffledClues[2] }
      ];

      // Items nutritivos
      this.items = [
        { x: 290, y: 165, emoji: '🥕', val: 10, name: 'Zanahoria', taken: false },
        { x: 480, y: 145, emoji: '🌽', val: 15, name: 'Choclo', taken: false },
        { x: 680, y: 155, emoji: '🌾', val: 20, name: 'Trigo', taken: false },
        { x: 875, y: 140, emoji: '⭐', val: 50, name: 'Estrella Dorada', taken: false },

        { x: 1090, y: 165, emoji: '🥕', val: 10, name: 'Zanahoria', taken: false },
        { x: 1290, y: 140, emoji: '🌽', val: 15, name: 'Choclo', taken: false },
        { x: 1495, y: 160, emoji: '🌾', val: 20, name: 'Trigo', taken: false },
        { x: 1680, y: 145, emoji: '⭐', val: 50, name: 'Estrella Dorada', taken: false },

        { x: 1910, y: 155, emoji: '🥕', val: 10, name: 'Zanahoria', taken: false },
        { x: 2110, y: 135, emoji: '🌽', val: 15, name: 'Choclo', taken: false },
        { x: 2315, y: 165, emoji: '🌾', val: 20, name: 'Trigo', taken: false },
        { x: 2510, y: 140, emoji: '⭐', val: 50, name: 'Estrella Dorada', taken: false },

        { x: 2740, y: 160, emoji: '🥕', val: 10, name: 'Zanahoria', taken: false },
        { x: 2945, y: 140, emoji: '🌽', val: 15, name: 'Choclo', taken: false },
        { x: 3145, y: 155, emoji: '🌾', val: 20, name: 'Trigo', taken: false },
        { x: 3340, y: 140, emoji: '⭐', val: 50, name: 'Estrella Dorada', taken: false },

        { x: 3560, y: 165, emoji: '🥕', val: 10, name: 'Zanahoria', taken: false },
        { x: 3760, y: 150, emoji: '⭐', val: 50, name: 'Estrella Dorada', taken: false }
      ];
    },

    loop(timestamp) {
      if (!this.isRunning || this.isFinished) {
        if (this.reqId) {
          cancelAnimationFrame(this.reqId);
          this.reqId = null;
        }
        return;
      }
      const dt = Math.min(32, timestamp - (this.lastTime || timestamp));
      this.lastTime = timestamp;
      this.animTime += dt * 0.001;

      // Hit-stop micro freeze para impacto visceral estilo Cuphead / Hollow Knight
      if (this.hitFreeze > 0) {
        this.hitFreeze--;
      } else {
        this.update(dt);
      }

      this.draw();

      if (this.isRunning && !this.isFinished) {
        this.reqId = requestAnimationFrame((t) => this.loop(t));
      }
    },

    spawnDust(x, y, count = 3) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 16,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 2 - (this.player.vx * 0.3),
          vy: -Math.random() * 1.5 - 0.5,
          rad: 3 + Math.random() * 3,
          color: (this.difficulty === 'dificil') ? 'rgba(56, 189, 248, 0.5)' : 'rgba(215, 195, 150, 0.75)',
          life: 1.0,
          decay: 0.04 + Math.random() * 0.03
        });
      }
    },

    spawnMudSplash(x, y, count = 8, isAcid = false) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -Math.random() * 3.5 - 1.5,
          rad: 3 + Math.random() * 3.5,
          color: isAcid
            ? ['#22c55e', '#16a34a', '#86efac'][Math.floor(Math.random() * 3)]
            : ['#3e2410', '#543217', '#251408'][Math.floor(Math.random() * 3)],
          life: 1.0,
          decay: 0.045
        });
      }
    },

    spawnSparkles(x, y, count = 8, customColors = null) {
      const palette = customColors || ['#ffd83d', '#ff9f1c', '#ffffff', '#4ade80'];
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 3.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          rad: 2 + Math.random() * 2.5,
          color: palette[Math.floor(Math.random() * palette.length)],
          life: 1.0,
          decay: 0.035 + Math.random() * 0.02
        });
      }
    },

    spawnSlashParticle(x, y) {
      this.slashEffects.push({
        x,
        y,
        life: 1.0,
        decay: 0.12,
        rot: Math.random() * Math.PI
      });
    },

    spawnVictoryFireworks() {
      for (let i = 0; i < 48; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 6;
        this.particles.push({
          x: this.goal.x + 90,
          y: this.goal.y + 40,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          rad: 3 + Math.random() * 4,
          color: ['#ffd83d', '#ff4757', '#2ed573', '#1e90ff', '#f59e0b', '#a855f7', '#ec4899'][Math.floor(Math.random() * 7)],
          life: 1.3,
          decay: 0.022
        });
      }
    },

    spawnFloatingText(x, y, text, color = '#ffd83d') {
      this.floatingTexts.push({
        x,
        y,
        text,
        color,
        life: 1.0,
        decay: 0.024
      });
    },

    takeDamage(amount, reason) {
      if (this.isFinished) return;
      this.mudDamageCount = (this.mudDamageCount || 0) + amount;
      this.lives = Math.max(0, this.lives - amount);
      this.player.invulnerableTime = 1.35;
      this.player.vy = -6.0;
      this.player.vx = -this.player.facing * 3.0;
      this.screenShake = 7;
      AudioFX.splash();
      AudioFX.wrong();
      this.spawnMudSplash(this.player.x + this.player.w / 2, this.player.y + this.player.h, 8, this.difficulty === 'dificil');
      this.spawnFloatingText(this.player.x + this.player.w / 2, this.player.y - 16, reason || '-1 VIDA 💔', '#ef4444');
      this.updateHud();

      if (this.lives <= 0) {
        this.gameOver();
      }
    },

    gameOver() {
      if (this.isFinished) return;
      this.isFinished = true;
      this.isRunning = false;
      if (this.reqId) {
        cancelAnimationFrame(this.reqId);
        this.reqId = null;
      }
      clearInterval(this.timerInterval);
      AudioFX.stopAll();
      AudioFX.wrong();

      const p = this.player;
      const pct = Math.min(99, Math.max(1, Math.round((p.x / (this.worldWidth - 200)) * 100)));
      const retryStatsData = {
        pct: pct,
        score: this.score,
        time: this.timerSeconds,
        clues: this.unlockedClues.length,
        diffName: this.diffConfig[this.difficulty] ? this.diffConfig[this.difficulty].name : 'Estándar',
        runnerEmoji: this.player.emoji
      };

      // Tarjeta de progreso y quote estilo Cuphead
      const cupheadBarHtml = `
        <div class="cuphead-progress-card">
          <div style="font-family:'Fraunces',serif;font-size:0.88rem;font-weight:700;color:#292524;display:flex;justify-content:space-between;margin-bottom:4px;">
            <span>🏁 Progreso del Recorrido</span>
            <span><b>${pct}%</b> completado</span>
          </div>
          <div class="cuphead-progress-track">
            <div class="cuphead-progress-fill" style="width:${pct}%;"></div>
            <div class="cuphead-runner-pin" style="left:${pct}%;">${this.player.emoji}</div>
          </div>
          <div style="font-size:0.75rem;color:#78716c;margin-top:6px;line-height:1.35;">
            ${(this.difficulty === 'extrema')
              ? `💀 <i>"¡Un cálculo en falso en el dash! En la Pesadilla Arcade cada milímetro cuenta."</i>`
              : (this.difficulty === 'dificil')
              ? `🍄 <i>"¡El ácido de las cavernas no perdona! Domina el pogo sobre las setas elásticas."</i>`
              : `🌾 <i>"¡Cuidado con el fango! Recuerda que solo los trampolines te impulsan de vuelta a las alturas."</i>`
            }
          </div>
        </div>
      `;

      // Guardar puntaje parcial en el ranking si supera el récord personal
      if (this.score > 0 && typeof state !== 'undefined') {
        state.minigames = state.minigames || {};
        state.minigames.platformer = state.minigames.platformer || {};
        const prevBest = state.minigames.platformer.bestScore || 0;
        if (this.score > prevBest) {
          state.minigames.platformer.bestScore = this.score;
          if (typeof saveState === 'function') saveState();
          if (typeof window.refreshRankingWidget === 'function') window.refreshRankingWidget();
        }
      }

      setTimeout(() => {
        showGameVictory({
          isDefeat: true,
          icon: (this.difficulty === 'legendaria') ? '🐺💀' : (this.difficulty === 'extrema') ? '💀⚡' : '🌧️',
          title: (this.difficulty === 'legendaria') ? '¡EL LOBO SOMBRA TE ATRAPÓ!' : (this.difficulty === 'extrema') ? '¡YOU DIED! — Muerte Súbita' : '¡El Fango Atrapó a tu Corredor!',
          subtitle: `Nivel: ${this.diffConfig[this.difficulty].name} — Recorrido Interrumpido`,
          stamp: (this.difficulty === 'legendaria') ? 'EL LOBO NUNCA DUERME' : (this.difficulty === 'extrema') ? 'PRACTICE MAKES PERFECT' : 'INTÉNTALO OTRA VEZ',
          msg: `${cupheadBarHtml}<div style="margin-top:10px;">Tu corredor no logró alcanzar la meta con vida en esta ocasión. Puedes reintentar la carrera inmediatamente o ir al apartado de reintento para ajustar corredor y dificultad.</div>`,
          stats: `⭐ <b>Puntaje:</b> ${this.score} pts &nbsp;|&nbsp; ⏱️ <b>Tiempo:</b> ${this.timerSeconds}s &nbsp;|&nbsp; 💡 <b>Pistas descubiertas:</b> ${this.unlockedClues.length}`,
          onRetryImmediate: () => this.startRun(),
          onRestart: () => this.showStartScreen(true, retryStatsData)
        });
      }, 200);
    },

    update(dt) {
      const p = this.player;
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;

      // Tiempo de banner al inicio
      if (this.wallopBannerTimer > 0) {
        this.wallopBannerTimer -= dt * 0.001;
      }

      // Persecución voraz del Lobo Sombra en Modo Legendario
      if (this.difficulty === 'legendaria' && this.chaserEnemy) {
        const wolf = this.chaserEnemy;
        const dist = p.x - wolf.x;

        if (dist > 320) {
          wolf.speed = 5.3;
        } else if (dist > 180) {
          wolf.speed = 5.0;
        } else {
          wolf.speed = 4.85;
        }

        wolf.x += wolf.speed * (dt / 16.666);
        wolf.y += (p.y - wolf.y) * 0.08;

        const hitBoxX = Math.abs((p.x + p.w / 2) - (wolf.x + wolf.w / 2));
        const hitBoxY = Math.abs((p.y + p.h / 2) - (wolf.y + wolf.h / 2));
        if (hitBoxX < 32 && hitBoxY < 36 && p.invulnerableTime <= 0) {
          this.takeDamage(999, '🐺 ¡El Lobo Sombra te alcanzó! Devorado en plena carrera.');
        }
      }

      // Decrementar tiempo de invulnerabilidad tras daño
      if (p.invulnerableTime > 0) {
        p.invulnerableTime -= dt * 0.001;
      }

      // Cooldown de Air Dash
      if (p.dashCooldown > 0) {
        p.dashCooldown--;
        if (p.dashCooldown === 0) this.updateDashUI();
      }

      // Mecánica Celeste Air Dash
      if (cfg.dashEnabled) {
        if (this.keys.dash && p.hasAirDash && p.dashCooldown <= 0) {
          this.triggerDash();
        }
      }

      // Movimiento horizontal
      if (p.isDashing) {
        p.dashTimer--;
        if (p.dashTimer <= 0) {
          p.isDashing = false;
        }
      } else {
        if (this.keys.left) {
          p.vx = -p.speed;
          p.facing = -1;
          p.runCycle += 0.22;
          if (p.grounded && Math.random() < 0.25) this.spawnDust(p.x + p.w * 0.7, p.y + p.h);
        } else if (this.keys.right) {
          p.vx = p.speed;
          p.facing = 1;
          p.runCycle += 0.22;
          if (p.grounded && Math.random() < 0.25) this.spawnDust(p.x + p.w * 0.3, p.y + p.h);
        } else {
          p.vx *= 0.76;
        }

        // Salto normal
        if (this.keys.jump && p.grounded) {
          AudioFX.jump();
          p.vy = -p.jumpStrength;
          p.grounded = false;
          p.landSquash = -0.22;
          this.spawnDust(p.x + p.w / 2, p.y + p.h, 5);
        }

        // Gravedad
        p.vy += cfg.gravity;
        if (p.vy > 14) p.vy = 14;
      }

      // Ráfagas de viento otoñal en dificultad Media
      if (this.difficulty === 'media') {
        const windDrift = Math.sin(this.animTime * 1.5) * 0.45;
        p.x += windDrift;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Límites del mundo
      if (p.x < 10) p.x = 10;
      if (p.x > this.worldWidth - p.w) p.x = this.worldWidth - p.w;

      // Actualizar plataformas móviles y quebradizas
      for (const plat of this.platforms) {
        if (plat.type === 'moving') {
          plat.x = plat.baseX + Math.sin(this.animTime * plat.speed) * plat.rangeX;
          if (p.grounded && p.currentPlatform === plat) {
            p.x += Math.cos(this.animTime * plat.speed) * plat.rangeX * plat.speed * 0.016;
          }
        } else if (plat.type === 'crumbling') {
          if (plat.isShaking) {
            plat.crumbleTimer -= dt * 0.001;
            if (plat.crumbleTimer <= 0) {
              plat.collapsed = true;
              plat.respawnTimer = 2.8;
              plat.isShaking = false;
              AudioFX.crumble();
              this.spawnDust(plat.x + plat.w / 2, plat.y + plat.h / 2, 10);
            }
          }
          if (plat.collapsed) {
            plat.respawnTimer -= dt * 0.001;
            if (plat.respawnTimer <= 0) {
              plat.collapsed = false;
              plat.crumbleTimer = plat.maxCrumble;
              this.spawnSparkles(plat.x + plat.w / 2, plat.y + plat.h / 2, 8);
            }
          }
        }
      }

      // Colisiones con plataformas sólidas
      const wasGrounded = p.grounded;
      p.grounded = false;
      p.currentPlatform = null;

      for (const plat of this.platforms) {
        if (plat.collapsed) continue;

        if (
          p.x + p.w * 0.8 > plat.x &&
          p.x + p.w * 0.2 < plat.x + plat.w &&
          p.y + p.h >= plat.y &&
          p.y + p.h <= plat.y + plat.h + 14 &&
          p.vy >= 0
        ) {
          p.y = plat.y - p.h;
          p.vy = 0;
          p.grounded = true;
          p.currentPlatform = plat;
          p.hasAirDash = true; // Recarga de Air Dash al tocar suelo sólido
          this.updateDashUI();

          if (plat.type === 'crumbling' && !plat.isShaking) {
            plat.isShaking = true;
          }

          if (!wasGrounded) {
            p.landSquash = 0.25;
            this.spawnDust(p.x + p.w / 2, p.y + p.h, 4);
          }
        }
      }

      p.landSquash *= 0.82;

      // Trampolines de heno elásticos (Fácil y Media)
      for (const t of this.trampolines) {
        if (t.cooldown > 0) t.cooldown--;
        if (
          t.cooldown === 0 &&
          p.x + p.w > t.x &&
          p.x < t.x + t.w &&
          p.y + p.h >= t.y &&
          p.y + p.h <= t.y + t.h + 10 &&
          p.vy >= 0
        ) {
          AudioFX.spring();
          p.vy = -18.6;
          p.grounded = false;
          p.hasAirDash = true;
          this.updateDashUI();
          t.cooldown = 24;
          this.spawnSparkles(t.x + t.w / 2, t.y, 14);
          this.spawnFloatingText(t.x + t.w / 2, t.y - 12, '¡SÚPER SALTO! 🦘', '#fbbf24');
        }
      }

      // Setas rebotadoras Pogo estilo Hollow Knight (Difícil y Extrema)
      for (const m of this.mushrooms) {
        if (m.cooldown > 0) m.cooldown--;
        if (
          m.cooldown === 0 &&
          p.x + p.w > m.x &&
          p.x < m.x + m.w &&
          p.y + p.h >= m.y &&
          p.y + p.h <= m.y + m.h + 12 &&
          p.vy >= 0
        ) {
          AudioFX.pogo();
          p.vy = -18.8;
          p.grounded = false;
          p.hasAirDash = true;
          this.updateDashUI();
          m.cooldown = 24;
          this.spawnSlashParticle(m.x + m.w / 2, m.y);
          this.spawnSparkles(m.x + m.w / 2, m.y, 14, ['#38bdf8', '#818cf8', '#c084fc']);
          this.spawnFloatingText(m.x + m.w / 2, m.y - 12, '🗡️ POGO BOUNCE!', '#38bdf8');
        }
      }

      // Cristales de recarga de Dash estilo Celeste (Extrema)
      for (const dc of this.dashCrystals) {
        if (!dc.taken) {
          const dist = Math.hypot((p.x + p.w / 2) - dc.x, (p.y + p.h / 2) - dc.y);
          if (dist < 32) {
            dc.taken = true;
            dc.respawnTimer = 2.5;
            p.hasAirDash = true;
            this.updateDashUI();
            AudioFX.crystal();
            this.spawnSparkles(dc.x, dc.y, 12, ['#38bdf8', '#a855f7', '#ffffff']);
            this.spawnFloatingText(dc.x, dc.y - 12, '💎 DASH REFILL!', '#38bdf8');
          }
        } else {
          dc.respawnTimer -= dt * 0.001;
          if (dc.respawnTimer <= 0) {
            dc.taken = false;
            this.spawnSparkles(dc.x, dc.y, 6, ['#38bdf8', '#ffffff']);
          }
        }
      }

      // Pink Parry Orbs estilo Cuphead (Extrema)
      for (const po of this.parryOrbs) {
        if (po.cooldown > 0) po.cooldown -= dt * 0.001;
        const dist = Math.hypot((p.x + p.w / 2) - po.x, (p.y + p.h / 2) - po.y);
        if (dist < 34 && po.cooldown <= 0) {
          po.cooldown = 1.8;
          p.vy = -19.4;
          p.hasAirDash = true;
          p.isDashing = false;
          this.updateDashUI();
          this.hitFreeze = 4;
          this.screenShake = 8;
          AudioFX.parry();
          this.score += 100;
          this.updateHud();
          this.spawnSparkles(po.x, po.y, 18, ['#ec4899', '#f472b6', '#ffd83d']);
          this.spawnFloatingText(po.x, po.y - 16, '💥 PARRY SLAP! +100', '#ec4899');
        }
      }

      // Sierras mecánicas en vertical (Extrema)
      for (const s of this.sawblades) {
        s.y = s.baseY + Math.sin(this.animTime * s.speed) * s.rangeY;
        const dist = Math.hypot((p.x + p.w / 2) - s.x, (p.y + p.h / 2) - s.y);
        if (dist < s.rad + 14 && p.invulnerableTime <= 0) {
          this.takeDamage(1, '⚙️ ¡Sierra mecánica! -1 VIDA 💔');
        }
      }

      // Charcos de barro (Fácil y Media)
      for (const m of this.mudPuddles) {
        if (
          p.x + p.w * 0.75 > m.x &&
          p.x + p.w * 0.25 < m.x + m.w &&
          p.y + p.h >= m.y &&
          p.y + p.h <= m.y + m.h + 16
        ) {
          p.vx *= 0.38;
          if (p.invulnerableTime <= 0) {
            this.takeDamage(1, '¡Caíste al lodo! -1 VIDA 💔');
          }
        }
      }

      // Fosos de ácido fosforescente (Difícil y Extrema)
      for (const a of this.acidPuddles) {
        if (
          p.x + p.w * 0.75 > a.x &&
          p.x + p.w * 0.25 < a.x + a.w &&
          p.y + p.h >= a.y &&
          p.y + p.h <= a.y + a.h + 16
        ) {
          p.vx *= 0.35;
          if (p.invulnerableTime <= 0) {
            this.takeDamage(1, '🧪 ¡Ácido de las cavernas! -1 VIDA 💔');
          }
        }
      }

      // Zarzas espinosas
      for (const z of this.thorns) {
        if (
          p.x + p.w * 0.7 > z.x &&
          p.x + p.w * 0.3 < z.x + z.w &&
          p.y + p.h >= z.y &&
          p.y <= z.y + z.h
        ) {
          if (p.invulnerableTime <= 0) {
            this.takeDamage(1, '¡Zarzas espinosas! -1 VIDA 💔');
          }
        }
      }

      // Caída al vacío fuera del mapa
      if (p.y > 420) {
        this.takeDamage(1, '¡Caída al abismo! -1 VIDA 💔');
        if (this.lives > 0) {
          p.x = Math.max(50, p.x - 300);
          p.y = 170;
          p.vy = 0;
        }
      }

      // Recolección de pergaminos de quiz
      for (const scroll of this.quizScrolls) {
        if (!scroll.taken) {
          const dist = Math.hypot((p.x + p.w / 2) - scroll.x, (p.y + p.h / 2) - scroll.y);
          if (dist < 36) {
            AudioFX.spring();
            scroll.taken = true;
            this.score += 35;
            this.updateHud();
            this.spawnSparkles(scroll.x, scroll.y, 14);
            this.spawnFloatingText(scroll.x, scroll.y - 14, '+35 💡 ¡Pista Quiz!', '#fbbf24');
            const clueText = scroll.clue || CLUES_BANK[Math.floor(Math.random() * CLUES_BANK.length)];
            if (!this.unlockedClues.includes(clueText)) {
              this.unlockedClues.push(clueText);
            }

            // Registrar en cuaderno permanente "Mis Pistas"
            const parts = clueText.split(':');
            const clueTitle = parts.length > 1 ? parts[0].trim() : 'Pista de Campo';
            const clueFact = parts.length > 1 ? parts.slice(1).join(':').trim() : clueText;
            if (typeof CluesNotebook !== 'undefined') {
              CluesNotebook.addClue({
                title: clueTitle,
                fact: clueFact,
                game: 'Aventura 2D (Plataformas)',
                icon: '🏃'
              });
            }

            showQuizClueToast(`💡 Pista Guardada en "Mis Pistas": ${clueText}`, '📜');
          }
        }
      }

      // Recolección de items nutritivos
      for (const item of this.items) {
        if (!item.taken) {
          const dist = Math.hypot((p.x + p.w / 2) - item.x, (p.y + p.h / 2) - item.y);
          if (dist < 34) {
            AudioFX.coin();
            item.taken = true;
            this.score += item.val;
            this.updateHud();
            this.spawnSparkles(item.x, item.y, 8);
            this.spawnFloatingText(item.x, item.y - 12, `+${item.val} ${item.name}`, '#ffd83d');
          }
        }
      }

      // Llegada a la meta: El Granero B-13
      if (p.x + p.w >= 3940) {
        if (this.isFinished) return;
        this.isFinished = true;
        this.isRunning = false;
        if (this.reqId) {
          cancelAnimationFrame(this.reqId);
          this.reqId = null;
        }
        clearInterval(this.timerInterval);
        AudioFX.stopAll();
        AudioFX.win();

        // Desbloquear Modo Extrema al vencer Difícil
        let unlockedExtremaNotice = false;
        if (this.difficulty === 'dificil' && !this.unlockedDifficulties.includes('extrema')) {
          this.unlockedDifficulties.push('extrema');
          unlockedExtremaNotice = true;
          this.updateDifficultyUI();
        }

        // Guardar récord de carrera en el estado del estudiante y persistir
        if (typeof state !== 'undefined') {
          state.minigames = state.minigames || {};
          state.minigames.platformer = state.minigames.platformer || {};
          state.minigames.platformer.unlockedDifficulties = this.unlockedDifficulties;
          const prevBest = state.minigames.platformer.bestScore || 0;
          state.minigames.platformer.bestScore = Math.max(prevBest, this.score);
          state.minigames.platformer.bestTime = Math.min(state.minigames.platformer.bestTime || 9999, this.timerSeconds);
          if (typeof saveState === 'function') saveState();
        }
        if (typeof window.refreshRankingWidget === 'function') {
          window.refreshRankingWidget();
        }

        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        this.spawnVictoryFireworks();

        const cluesListHtml = this.unlockedClues.length > 0
          ? `<div style="margin-top:10px;text-align:left;background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.82rem;color:#1e293b;"><b>💡 Pistas Clave Desbloqueadas para los Quizzes (${this.unlockedClues.length}):</b><ul style="margin:6px 0 0 16px;padding:0;">${this.unlockedClues.map(c => `<li>${c}</li>`).join('')}</ul></div>`
          : '';

        const extremaUnlockBanner = unlockedExtremaNotice
          ? `<div style="margin:12px 0;background:linear-gradient(135deg,#581c87,#3b0764);color:#ffffff;padding:12px 16px;border-radius:12px;border:2px solid #ec4899;box-shadow:0 0 18px rgba(236,72,153,0.5);text-align:center;">
              <div style="font-size:1.15rem;font-weight:900;">🔥 ¡MODO EXTREMO DESBLOQUEADO! 🔥</div>
              <p style="margin:4px 0 0;font-size:0.82rem;color:#fbcfe8;">¡Has dominado las Cavernas Huecas! Ahora puedes jugar la <b>Pesadilla Arcade</b> con <b>Air Dash estilo Celeste</b>, <b>Pink Parries estilo Cuphead</b> y muerte súbita (1 ❤️).</p>
            </div>`
          : '';

        const winIcon = (this.difficulty === 'legendaria') ? '🐺👑⚡' : (this.difficulty === 'extrema') ? '🏆👑' : (this.difficulty === 'dificil') ? '🗡️🏆' : '🏆';
        const winTitle = (this.difficulty === 'legendaria') ? '¡SUPERVIVIENTE LEGENDARIO!' : (this.difficulty === 'extrema') ? '¡VICTORIA TOTAL! ¡CALIFICACIÓN SOBRESALIENTE!' : '¡Llegaste al Granero B-13!';
        const winSubtitle = (this.difficulty === 'legendaria') ? '¡Escapaste de las fauces del Lobo Sombra en tiempo récord!' : (this.difficulty === 'extrema') ? '¡Has Conquistado la Pesadilla Arcade con Honores!' : `¡Carrera Campestre Completada (${cfg.name})!`;
        const winStamp = (this.difficulty === 'legendaria') ? 'LEYENDA VIVIENTE B-13' : (this.difficulty === 'extrema') ? 'MAESTRÍA SUPREMA B-13' : 'MISIÓN CUMPLIDA';

        if (this.difficulty === 'legendaria') {
          this.score += 500;
          if (typeof window.unlockSecretBadge === 'function') window.unlockSecretBadge('superviviente_legendario');
        }
        if (typeof window.unlockBadge === 'function') window.unlockBadge('velocista_granero');
        if (this.difficulty === 'dificil' || this.difficulty === 'extrema' || this.difficulty === 'legendaria') {
          if (typeof window.unlockSecretBadge === 'function') window.unlockSecretBadge('pesadilla_conquistada');
        }
        if ((!this.mudDamageCount || this.mudDamageCount === 0) && typeof window.unlockSecretBadge === 'function') {
          window.unlockSecretBadge('parry_cuphead');
        }
        if (typeof checkMaestroArcade === 'function') checkMaestroArcade();

        setTimeout(() => {
          showGameVictory({
            icon: winIcon,
            title: winTitle,
            subtitle: winSubtitle,
            stamp: winStamp,
            msg: `${extremaUnlockBanner}<div style="margin-top:8px;">¡Tu corredor ${this.player.emoji} superó los obstáculos y alcanzó la meta con vida! Recuerda usar las pistas descubiertas para responder los Quizzes en el Mapa y ganar décimas.</div>`,
            stats: `⭐ <b>Puntos de Carrera:</b> ${this.score} pts &nbsp;|&nbsp; ❤️ <b>Vidas restantes:</b> ${'❤️'.repeat(Math.max(1, this.lives))} &nbsp;|&nbsp; ⏱️ <b>Tiempo:</b> ${timeStr}${cluesListHtml}`,
            onRestart: () => this.showStartScreen()
          });
        }, 250);
        return;
      }

      // Actualizar partículas
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= pt.decay;
        if (pt.life <= 0) this.particles.splice(i, 1);
      }

      // Actualizar estelas fantasma Celeste Air Dash
      for (let i = this.dashTrails.length - 1; i >= 0; i--) {
        const dtPart = this.dashTrails[i];
        dtPart.life -= dtPart.decay;
        if (dtPart.life <= 0) this.dashTrails.splice(i, 1);
      }

      // Actualizar efectos de corte slash
      for (let i = this.slashEffects.length - 1; i >= 0; i--) {
        const sl = this.slashEffects[i];
        sl.life -= sl.decay;
        if (sl.life <= 0) this.slashEffects.splice(i, 1);
      }

      // Actualizar hojas y esporas ambientales
      for (const leaf of this.ambientLeaves) {
        leaf.x += leaf.speedX;
        leaf.y += leaf.speedY + Math.sin(this.animTime * 2.5 + leaf.phase) * 0.45;
        leaf.rot += 0.02;
        if (leaf.x > this.worldWidth + 100 || leaf.y > 400) {
          leaf.x = Math.max(0, this.cameraX - 60 + Math.random() * 200);
          leaf.y = -15 - Math.random() * 40;
        }
      }

      // Actualizar textos flotantes
      for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
        const ft = this.floatingTexts[i];
        ft.y -= 0.85;
        ft.life -= ft.decay;
        if (ft.life <= 0) this.floatingTexts.splice(i, 1);
      }

      // Cámara suave de seguimiento
      this.cameraX = p.x - 260;
      if (this.cameraX < 0) this.cameraX = 0;
      if (this.cameraX > this.worldWidth - 860) this.cameraX = this.worldWidth - 860;
    },

    draw() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Efecto Screen Shake
      ctx.save();
      if (this.screenShake > 0) {
        const sx = (Math.random() - 0.5) * this.screenShake;
        const sy = (Math.random() - 0.5) * this.screenShake;
        ctx.translate(sx, sy);
        this.screenShake *= 0.82;
        if (this.screenShake < 0.3) this.screenShake = 0;
      }

      // 1. Cielo según dificultad
      if (this.difficulty === 'legendaria') {
        // Crepúsculo tormentoso carmesí (Cacería del Lobo Sombra)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#1c0707');
        skyGrad.addColorStop(0.38, '#450a0a');
        skyGrad.addColorStop(0.72, '#7f1d1d');
        skyGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (this.difficulty === 'extrema') {
        // Estética Synthwave / Retro Cuphead Celeste
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#180326');
        skyGrad.addColorStop(0.4, '#3b0764');
        skyGrad.addColorStop(0.75, '#581c87');
        skyGrad.addColorStop(1, '#831843');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (this.difficulty === 'dificil') {
        // Estética Cavernas Huecas (Hollow Knight)
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#020617');
        skyGrad.addColorStop(0.5, '#0f172a');
        skyGrad.addColorStop(1, '#1e1b4b');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
      } else if (this.difficulty === 'media') {
        // Atardecer otoñal con viento
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#9a3412');
        skyGrad.addColorStop(0.38, '#ea580c');
        skyGrad.addColorStop(0.72, '#f59e0b');
        skyGrad.addColorStop(1, '#fef08a');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Mañana campestre Stardew Valley
        const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
        skyGrad.addColorStop(0, '#3a7bd5');
        skyGrad.addColorStop(0.38, '#68a691');
        skyGrad.addColorStop(0.72, '#f4d06f');
        skyGrad.addColorStop(1, '#ffe8d6');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, w, h);
      }

      // Sol o Luna según dificultad
      ctx.save();
      const sunX = w - 100;
      const sunY = 70;
      if (this.difficulty === 'legendaria') {
        // Luna de Sangre carmesí con resplandor
        ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 68, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7f1d1d';
        ctx.beginPath();
        ctx.arc(sunX + 6, sunY - 4, 24, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.difficulty === 'dificil') {
        // Luna espectral de caverna
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 55, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#bae6fd';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 26, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.difficulty === 'extrema') {
        // Sol neón con halo magenta
        ctx.fillStyle = 'rgba(236, 72, 153, 0.35)';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 70, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f472b6';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 28, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sol cálido campestre
        const sunGlow = ctx.createRadialGradient(sunX, sunY, 15, sunX, sunY, 90);
        sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
        sunGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.18)');
        sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
        ctx.fillStyle = sunGlow;
        ctx.beginPath();
        ctx.arc(sunX, sunY, 90, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(sunX, sunY, 32, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Parallax de fondo
      if (this.difficulty === 'dificil') {
        // Estalactitas y rocas de caverna
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= w; x += 40) {
          const sy = 35 + Math.sin(x * 0.05 + this.cameraX * 0.02) * 20;
          ctx.lineTo(x, sy);
        }
        ctx.lineTo(w, 0);
        ctx.closePath();
        ctx.fill();
      } else {
        // Nubes suaves
        ctx.fillStyle = (this.difficulty === 'extrema') ? 'rgba(236, 72, 153, 0.25)' : (this.difficulty === 'legendaria') ? 'rgba(185, 28, 28, 0.35)' : 'rgba(255, 255, 255, 0.85)';
        for (let i = 0; i < 9; i++) {
          const cloudX = ((i * 380) - (this.cameraX * 0.10) + (this.animTime * 10)) % (w + 420) - 100;
          const cloudY = 48 + (i % 3) * 24;
          ctx.beginPath();
          ctx.arc(cloudX, cloudY, 24, 0, Math.PI * 2);
          ctx.arc(cloudX + 20, cloudY - 7, 28, 0, Math.PI * 2);
          ctx.arc(cloudX + 44, cloudY, 22, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Capas montañosas
      ctx.save();
      const mColor1 = (this.difficulty === 'legendaria') ? '#1c0707' : (this.difficulty === 'extrema') ? '#3b0764' : (this.difficulty === 'dificil') ? '#090d16' : (this.difficulty === 'media') ? '#7c2d12' : '#3d5a80';
      const mColor2 = (this.difficulty === 'legendaria') ? '#450a0a' : (this.difficulty === 'extrema') ? '#581c87' : (this.difficulty === 'dificil') ? '#1e293b' : (this.difficulty === 'media') ? '#9a3412' : '#204e3b';
      const mColor3 = (this.difficulty === 'legendaria') ? '#7f1d1d' : (this.difficulty === 'extrema') ? '#701a75' : (this.difficulty === 'dificil') ? '#334155' : (this.difficulty === 'media') ? '#c2410c' : '#40916c';

      ctx.fillStyle = mColor1;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 40) {
        const wx = x + (this.cameraX * 0.06);
        const my = 175 + Math.sin(wx * 0.0028) * 38 + Math.cos(wx * 0.007) * 22;
        ctx.lineTo(x, my);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = mColor2;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 30) {
        const wx = x + (this.cameraX * 0.14);
        const hy = 215 + Math.sin(wx * 0.0042) * 28 + Math.sin(wx * 0.012) * 12;
        ctx.lineTo(x, hy);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = mColor3;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 50) {
        const wx = x + (this.cameraX * 0.22);
        const gy = 265 + Math.sin(wx * 0.005) * 18 + Math.cos(wx * 0.01) * 8;
        ctx.lineTo(x, gy);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Coordenadas relativas de mundo
      ctx.save();
      ctx.translate(-this.cameraX, 0);

      // Molino rústico animado a mitad de camino
      if (this.difficulty !== 'dificil') {
        this.drawWindmill(ctx, 1850, 240);
      }

      // Cercas de madera campestres en el fondo
      ctx.strokeStyle = (this.difficulty === 'dificil') ? '#334155' : '#5a3d1e';
      ctx.lineWidth = 2.5;
      for (let fx = 100; fx < 4000; fx += 160) {
        ctx.strokeRect(fx, 316, 6, 24);
        ctx.strokeRect(fx + 28, 316, 6, 24);
        ctx.beginPath();
        ctx.moveTo(fx, 322);
        ctx.lineTo(fx + 34, 322);
        ctx.moveTo(fx, 331);
        ctx.lineTo(fx + 34, 331);
        ctx.stroke();
      }

      // Hojas/esporas ambientales
      for (const leaf of this.ambientLeaves) {
        ctx.save();
        ctx.translate(leaf.x, leaf.y);
        ctx.rotate(leaf.rot);
        ctx.fillStyle = leaf.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, leaf.size * 1.5, leaf.size * 0.75, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Estelas fantasma del Air Dash estilo Celeste
      for (const dtPart of this.dashTrails) {
        ctx.save();
        ctx.translate(dtPart.x + this.player.w / 2, dtPart.y + this.player.h / 2);
        if (dtPart.facing < 0) ctx.scale(-1, 1);
        ctx.globalAlpha = Math.max(0, dtPart.life * 0.55);
        ctx.fillStyle = dtPart.color;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(dtPart.emoji, 0, 0);
        ctx.restore();
      }
      ctx.globalAlpha = 1.0;

      // Efectos de corte Nail Slash sobre setas (Hollow Knight)
      for (const sl of this.slashEffects) {
        ctx.save();
        ctx.translate(sl.x, sl.y);
        ctx.rotate(sl.rot);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.globalAlpha = Math.max(0, sl.life);
        ctx.beginPath();
        ctx.arc(0, 0, 24, -Math.PI * 0.3, Math.PI * 0.3);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalAlpha = 1.0;

      // Dibujar plataformas
      for (const p of this.platforms) {
        if (p.collapsed) continue;

        let drawX = p.x;
        let drawY = p.y;
        if (p.isShaking) {
          drawX += (Math.random() - 0.5) * 4;
          drawY += (Math.random() - 0.5) * 4;
        }

        if (p.type === 'ground') {
          // Zanja inferior
          ctx.fillStyle = (this.difficulty === 'dificil') ? '#090d16' : '#3a2414';
          ctx.fillRect(drawX, drawY, p.w, p.h);

          ctx.fillStyle = (this.difficulty === 'dificil') ? '#1e293b' : '#4f772d';
          ctx.fillRect(drawX, drawY, p.w, 14);

          ctx.fillStyle = (this.difficulty === 'dificil') ? '#38bdf8' : '#74c69d';
          for (let gx = drawX; gx < drawX + p.w; gx += 16) {
            ctx.beginPath();
            ctx.moveTo(gx, drawY);
            ctx.lineTo(gx + 3, drawY - 6);
            ctx.lineTo(gx + 6, drawY);
            ctx.fill();
          }

          ctx.fillStyle = (this.difficulty === 'dificil') ? '#020617' : '#27150a';
          ctx.fillRect(drawX, drawY + 14, p.w, p.h - 14);
        } else if (p.type === 'straw' || p.type === 'crumbling') {
          // Fardos de heno / plataformas quebradizas
          ctx.fillStyle = (p.type === 'crumbling') ? '#d97706' : '#eab308';
          ctx.fillRect(drawX, drawY, p.w, p.h);
          ctx.strokeStyle = '#28311b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(drawX, drawY, p.w, p.h);

          // Cuerdas de cáñamo
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(drawX + p.w * 0.28, drawY);
          ctx.lineTo(drawX + p.w * 0.28, drawY + p.h);
          ctx.moveTo(drawX + p.w * 0.72, drawY);
          ctx.lineTo(drawX + p.w * 0.72, drawY + p.h);
          ctx.stroke();

          if (p.type === 'crumbling') {
            ctx.font = 'bold 9px "Space Mono", monospace';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.fillText('⏳ FRÁGIL', drawX + p.w / 2, drawY + p.h / 2 + 3);
          }
        } else if (p.type === 'wood' || p.type === 'moving') {
          // Pasarela de madera / plataforma móvil
          ctx.fillStyle = '#451a03';
          ctx.fillRect(drawX + 10, drawY + p.h, 12, 340 - (drawY + p.h));
          ctx.fillRect(drawX + p.w - 22, drawY + p.h, 12, 340 - (drawY + p.h));

          ctx.fillStyle = (p.type === 'moving') ? '#b45309' : '#854d0e';
          ctx.fillRect(drawX, drawY, p.w, p.h);
          ctx.strokeStyle = '#28311b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(drawX, drawY, p.w, p.h);

          if (p.type === 'moving') {
            ctx.font = 'bold 9px "Space Mono", monospace';
            ctx.fillStyle = '#fef08a';
            ctx.textAlign = 'center';
            ctx.fillText('◀ MÓVIL ▶', drawX + p.w / 2, drawY + p.h / 2 + 3);
          }

          if (p.lantern) {
            const lx = drawX + p.w - 8;
            const ly = drawY + p.h + 12;
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx, drawY + p.h);
            ctx.lineTo(lx, ly);
            ctx.stroke();

            const lanternGlow = ctx.createRadialGradient(lx, ly + 6, 2, lx, ly + 6, 32);
            lanternGlow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
            lanternGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
            ctx.fillStyle = lanternGlow;
            ctx.beginPath();
            ctx.arc(lx, ly + 6, 32, 0, Math.PI * 2);
            ctx.fill();

            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🏮', lx, ly + 10);
          }
        }
      }

      // Dibujar trampolines de heno (Fácil y Media)
      for (const t of this.trampolines) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x + 4, t.y + 8, t.w - 8, t.h - 8);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(t.x + 10, t.y + 12);
        ctx.lineTo(t.x + t.w / 2, t.y + 5);
        ctx.lineTo(t.x + t.w - 10, t.y + 12);
        ctx.stroke();

        ctx.fillStyle = '#dc2626';
        ctx.fillRect(t.x, t.y, t.w, 7);
        ctx.strokeStyle = '#28311b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t.x, t.y, t.w, 7);

        ctx.font = 'bold 9px "Space Mono", monospace';
        ctx.fillStyle = '#166534';
        ctx.textAlign = 'center';
        ctx.fillText('▲ SALTO', t.x + t.w / 2, t.y - 6);
      }

      // Dibujar setas bioluminiscentes Pogo (Hollow Knight)
      for (const m of this.mushrooms) {
        const glow = ctx.createRadialGradient(m.x + m.w / 2, m.y + 6, 2, m.x + m.w / 2, m.y + 6, 28);
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
        glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(m.x + m.w / 2, m.y + 6, 28, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🍄', m.x + m.w / 2, m.y + m.h - 2);

        ctx.font = 'bold 9px "Space Mono", monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.fillText('🗡️ POGO', m.x + m.w / 2, m.y - 6);
      }

      // Dibujar Cristales de Dash Celeste (Extrema)
      for (const dc of this.dashCrystals) {
        if (!dc.taken) {
          const hoverY = dc.y + Math.sin(this.animTime * 5 + dc.x) * 4;
          const glow = ctx.createRadialGradient(dc.x, hoverY, 4, dc.x, hoverY, 24);
          glow.addColorStop(0, 'rgba(56, 189, 248, 0.7)');
          glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(dc.x, hoverY, 24, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '24px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('💎', dc.x, hoverY);
        } else {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(dc.x, dc.y, 10, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // Dibujar Pink Parry Orbs estilo Cuphead (Extrema)
      for (const po of this.parryOrbs) {
        const hoverY = po.y + Math.sin(this.animTime * 4.5 + po.x) * 4.5;
        const glow = ctx.createRadialGradient(po.x, hoverY, 6, po.x, hoverY, 30);
        glow.addColorStop(0, 'rgba(236, 72, 153, 0.7)');
        glow.addColorStop(1, 'rgba(236, 72, 153, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(po.x, hoverY, 30, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '26px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(po.emoji, po.x, hoverY);

        ctx.font = 'bold 9px "Space Mono", monospace';
        ctx.fillStyle = '#ec4899';
        ctx.fillText('PARRY!', po.x, hoverY - 18);
      }

      // Dibujar Sierras mecánicas giratorias (Extrema)
      for (const s of this.sawblades) {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(this.animTime * 12);
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚙️', 0, 0);
        ctx.restore();
      }

      // Charcos de barro / fosos de ácido
      for (const m of this.mudPuddles) {
        ctx.fillStyle = '#201205';
        ctx.beginPath();
        ctx.ellipse(m.x + m.w / 2, m.y + m.h / 2, m.w / 2, m.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️', m.x + m.w / 2, m.y - 7);
      }

      for (const a of this.acidPuddles) {
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.ellipse(a.x + a.w / 2, a.y + a.h / 2, a.w / 2, a.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        const bY = a.y + Math.sin(this.animTime * 6 + a.x) * 3;
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(a.x + a.w * 0.35, bY, 4, 0, Math.PI * 2);
        ctx.arc(a.x + a.w * 0.65, bY - 1, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🧪', a.x + a.w / 2, a.y - 7);
      }

      // Zarzas espinosas
      for (const z of this.thorns) {
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌵', z.x + z.w / 2, z.y + z.h - 2);
      }

      // Pergaminos Dorados de Quiz
      for (const scroll of this.quizScrolls) {
        if (!scroll.taken) {
          const hoverY = scroll.y + Math.sin(this.animTime * 5 + scroll.x) * 5;
          ctx.font = '30px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('📜', scroll.x, hoverY);

          ctx.fillStyle = 'rgba(251, 191, 36, 0.4)';
          ctx.beginPath();
          ctx.arc(scroll.x, hoverY, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = 'bold 10px "Space Mono", monospace';
          ctx.fillStyle = (this.difficulty === 'dificil') ? '#38bdf8' : '#78350f';
          ctx.fillText('PISTA QUIZ', scroll.x, hoverY - 22);
        }
      }

      // Items nutritivos
      for (const item of this.items) {
        if (!item.taken) {
          const hoverY = item.y + Math.sin(this.animTime * 4 + item.x) * 4.5;
          ctx.font = (item.emoji === '⭐') ? '28px Arial' : '25px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.emoji, item.x, hoverY);
        }
      }

      // Partículas
      for (const pt of this.particles) {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Textos flotantes
      ctx.font = 'bold 14px "Space Mono", monospace';
      ctx.textAlign = 'center';
      for (const ft of this.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillText(ft.text, ft.x, ft.y);
      }
      ctx.globalAlpha = 1.0;

      // Meta: Granero B-13
      this.drawGoal(ctx);

      // Lobo Sombra perseguidor en Modo Legendario
      if (this.difficulty === 'legendaria' && this.chaserEnemy) {
        this.drawChaserEnemy(ctx);
      }

      // Jugador
      ctx.globalAlpha = 1.0;
      this.drawPlayer(ctx);

      ctx.restore();

      // Banner "READY? GO!" al inicio de carrera
      if (this.wallopBannerTimer > 0) {
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(0, h / 2 - 45, w, 90);
        ctx.fillStyle = (this.difficulty === 'legendaria') ? '#ef4444' : '#ffd83d';
        ctx.font = '900 2.2rem "Fraunces", serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000000';
        ctx.shadowBlur = 10;
        const bannerTxt = (this.difficulty === 'legendaria') ? '¡HUYE DEL LOBO! ⏱️ 45s' : 'READY? GO!';
        ctx.fillText(bannerTxt, w / 2, h / 2);
        ctx.restore();
      }

      // Viñeta retro en modo Extrema (estilo 1930s Cuphead / Celeste)
      if (this.difficulty === 'extrema') {
        const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.35, w / 2, h / 2, w * 0.6);
        vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vig.addColorStop(1, 'rgba(15, 3, 25, 0.45)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
      } else if (this.difficulty === 'legendaria') {
        // Alertas y efectos de pantalla de Modo Legendario
        const wolfDist = this.chaserEnemy ? Math.max(0, this.player.x - this.chaserEnemy.x) : 999;
        const vigIntensity = (wolfDist < 160) ? 0.65 : (wolfDist < 260) ? 0.42 : 0.25;
        const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.62);
        vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
        vig.addColorStop(1, `rgba(185, 28, 28, ${vigIntensity})`);
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);

        // Barra HUD superior de alerta de proximidad del lobo
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
        ctx.fillRect(w / 2 - 140, 8, 280, 26);
        ctx.strokeStyle = (wolfDist < 160) ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(w / 2 - 140, 8, 280, 26);

        ctx.font = 'bold 12px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = (wolfDist < 160) ? '#fca5a5' : '#fef08a';
        const distM = Math.max(0, Math.round(wolfDist / 12));
        ctx.fillText(`🐺 LOBO SOMBRA: ${distM}m ATRÁS ⚠️`, w / 2, 21);
        ctx.restore();
      }

      ctx.restore();
    },

    drawWindmill(ctx, wx, wy) {
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.moveTo(wx - 28, wy + 100);
      ctx.lineTo(wx - 16, wy);
      ctx.lineTo(wx + 16, wy);
      ctx.lineTo(wx + 28, wy + 100);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.arc(wx, wy, 18, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.translate(wx, wy);
      const rotSpeed = (this.difficulty === 'media') ? 3.5 : 1.6;
      ctx.rotate(this.animTime * rotSpeed);
      for (let i = 0; i < 4; i++) {
        ctx.rotate(Math.PI / 2);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(46, 0);
        ctx.stroke();

        ctx.fillStyle = 'rgba(254, 243, 199, 0.85)';
        ctx.strokeStyle = '#28311b';
        ctx.lineWidth = 1;
        ctx.fillRect(14, -9, 28, 18);
        ctx.strokeRect(14, -9, 28, 18);
      }
      ctx.restore();
    },

    drawGoal(ctx) {
      const g = this.goal;

      // Cuerpo del granero
      ctx.fillStyle = (this.difficulty === 'dificil') ? '#1e293b' : '#8b261e';
      ctx.fillRect(g.x, g.y, g.w, g.h);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 3;
      ctx.strokeRect(g.x, g.y, g.w, g.h);

      // Molduras
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(g.x, g.y, 8, g.h);
      ctx.fillRect(g.x + g.w - 8, g.y, 8, g.h);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2;
      ctx.strokeRect(g.x, g.y, 8, g.h);
      ctx.strokeRect(g.x + g.w - 8, g.y, 8, g.h);

      // Puertas con X blanca
      const dw = 60;
      const dh = 80;
      const dx = g.x + (g.w - dw) / 2;
      const dy = g.y + g.h - dh;

      ctx.fillStyle = '#451a03';
      ctx.fillRect(dx, dy, dw, dh);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.strokeRect(dx, dy, dw, dh);

      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.lineTo(dx + dw, dy + dh);
      ctx.moveTo(dx + dw, dy);
      ctx.lineTo(dx, dy + dh);
      ctx.stroke();

      // Ventana circular del pajar
      ctx.fillStyle = (this.difficulty === 'dificil') ? '#38bdf8' : '#fef08a';
      ctx.beginPath();
      ctx.arc(g.x + g.w / 2, g.y + 44, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Techo campestre
      ctx.fillStyle = (this.difficulty === 'dificil') ? '#0f172a' : '#551511';
      ctx.beginPath();
      ctx.moveTo(g.x - 16, g.y);
      ctx.lineTo(g.x + g.w / 2, g.y - 50);
      ctx.lineTo(g.x + g.w + 16, g.y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Cúpula superior con gallito veleta
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(g.x + g.w / 2 - 10, g.y - 68, 20, 18);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2;
      ctx.strokeRect(g.x + g.w / 2 - 10, g.y - 68, 20, 18);

      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('🐓', g.x + g.w / 2, g.y - 74);

      // Bandera de Meta
      const flagWave = Math.sin(this.animTime * 6) * 4;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(g.x + g.w / 2 - 2, g.y - 115, 4, 45);

      ctx.font = '28px Arial';
      ctx.fillText('🏁', g.x + g.w / 2 + 18, g.y - 114 + flagWave);

      // Cartel luminoso
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(g.x + 12, g.y - 20, g.w - 24, 20);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2;
      ctx.strokeRect(g.x + 12, g.y - 20, g.w - 24, 20);

      ctx.fillStyle = '#1c2713';
      ctx.font = 'bold 11px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('GRANERO B-13', g.x + g.w / 2, g.y - 6);
    },

    drawPlayer(ctx) {
      const p = this.player;
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

      // Siempre asegurar opacidad normal 1.0 por defecto
      ctx.globalAlpha = 1.0;

      // Parpadeo de invulnerabilidad
      if (p.invulnerableTime > 0) {
        ctx.globalAlpha = (Math.floor(this.animTime * 14) % 2 === 0) ? 0.35 : 1.0;
      }

      // Volteo horizontal
      if (p.facing < 0) ctx.scale(-1, 1);

      // Deformación física suave
      let sx = 1 + p.landSquash;
      let sy = 1 - p.landSquash;

      if (p.isDashing) {
        sx = 1.35;
        sy = 0.75;
      } else if (!p.grounded) {
        if (p.vy < -2) {
          sx = 0.88;
          sy = 1.15;
        } else if (p.vy > 2) {
          sx = 1.12;
          sy = 0.92;
        }
      } else if (Math.abs(p.vx) > 0.5) {
        sy = 1 + Math.sin(p.runCycle * 2) * 0.08;
        sx = 1 - Math.sin(p.runCycle * 2) * 0.05;
      } else {
        // En reposo (idle): respiración sutil
        sy = 1 + Math.sin(this.animTime * 3) * 0.02;
        sx = 1 - Math.sin(this.animTime * 3) * 0.015;
      }

      ctx.scale(sx, sy);

      // Sombra proyectada
      if (p.grounded) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(0, p.h / 2 + 2, 14, 4, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sprite del animal corredor
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);

      // Accesorio oficial
      if (p.accEmoji) {
        ctx.save();
        ctx.font = '22px Arial, sans-serif';
        const yOff = (this.selectedAnimal === 'gallo') ? -24 : -21;
        const xOff = (this.selectedAnimal === 'gallo') ? 2 : 0;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 3;
        ctx.fillText(p.accEmoji, xOff, yOff);
        ctx.restore();
      }

      // Aura de Air Dash lista en Extrema / Legendaria
      if (this.diffConfig[this.difficulty]?.dashEnabled && p.hasAirDash) {
        ctx.strokeStyle = (this.difficulty === 'legendaria') ? 'rgba(239, 68, 68, 0.75)' : 'rgba(56, 189, 248, 0.65)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.globalAlpha = 1.0;
      ctx.restore();
    },

    drawChaserEnemy(ctx) {
      const wolf = this.chaserEnemy;
      if (!wolf) return;
      ctx.save();
      ctx.translate(wolf.x + wolf.w / 2, wolf.y + wolf.h / 2);

      // Estelas oscuras de sombra que se desprenden
      ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
      for (let i = 1; i <= 3; i++) {
        const offY = Math.sin(this.animTime * 12 + i) * 5;
        ctx.beginPath();
        ctx.arc(-i * 15, offY, 18 - i * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Aura carmesí pulsante
      const pulse = Math.sin(this.animTime * 10) * 4;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.22)';
      ctx.beginPath();
      ctx.arc(0, 0, 26 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Sombra en el suelo
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, wolf.h / 2 + 2, 16, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sprite del Lobo
      ctx.font = '42px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐺', 0, 0);

      // Ojo rojo llameante
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(6, -4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = 1.0;
      ctx.restore();
    },

    updateHud() {
      const scoreEl = document.getElementById('platScoreVal');
      const livesEl = document.getElementById('platLivesVal');
      const timeEl = document.getElementById('platTimeVal');
      if (scoreEl) scoreEl.textContent = this.score;
      if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives));
      if (timeEl) {
        const mins = Math.floor(Math.max(0, this.timerSeconds) / 60);
        const secs = Math.max(0, this.timerSeconds) % 60;
        timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (this.difficulty === 'legendaria') {
          timeEl.style.color = (this.timerSeconds <= 10) ? '#ef4444' : '#b45309';
          timeEl.style.fontWeight = 'bold';
        } else {
          timeEl.style.color = '';
        }
      }
    }
  };

  /* ============================================================
     JUEGO 4: FLAPPY LORO B-13 (AGAPORNIS VOLADOR)
     ============================================================ */
  const FlappyGame = {
    canvas: null,
    ctx: null,
    animId: null,
    initialized: false,
    isRunning: false,
    gameOver: false,
    hasFlappedOnce: false,

    // Dificultad
    difficulty: 'facil',
    diffConfig: {
      facil: {
        gravity: 0.28,
        jumpPower: -6.2,
        pipeSpeed: 2.1,
        pipeGap: 155,
        pipeInterval: 130
      },
      media: {
        gravity: 0.35,
        jumpPower: -7.0,
        pipeSpeed: 2.7,
        pipeGap: 135,
        pipeInterval: 110
      },
      dificil: {
        gravity: 0.42,
        jumpPower: -7.8,
        pipeSpeed: 3.3,
        pipeGap: 115,
        pipeInterval: 95
      }
    },

    // Datos del pájaro
    bird: {
      x: 120,
      y: 200,
      vy: 0,
      radius: 17,
      angle: 0,
      wingTimer: 0
    },

    // Elementos del mundo
    pipes: [],
    seeds: [],
    particles: [],
    clouds: [],
    frameCount: 0,
    score: 0,
    seedsCollected: 0,
    highScore: 0,
    activeFact: '',

    facts: [
      "¡Sabías que los agapornis son llamados 'inseparables' porque forman parejas leales que permanecen juntas toda la vida!",
      "El pico fuerte y curvo de los loros actúa como una tercera extremidad: les permite trepar y partir semillas duras.",
      "Las plumas verdes de los agapornis contienen psitacofulvinas, pigmentos exclusivos que solo producen los loros.",
      "En la Granja B-13, una dieta rica en semillas variadas, verduras frescas y agua limpia garantiza su plumaje radiante.",
      "Los loros tienen visión tetracromática: pueden ver la luz ultravioleta (UV), lo que les permite saber qué frutos están maduros.",
      "Las patas de los loros son zigodáctilas (dos dedos hacia adelante y dos hacia atrás), lo que les permite agarrar cosas como manos."
    ],

    init() {
      if (this.initialized) return;
      this.canvas = document.getElementById('flappyCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.highScore = parseInt(localStorage.getItem('granjaFlappyBest') || (state.flappyHighScore || 0), 10) || 0;

      // Generar nubes iniciales
      this.clouds = [
        { x: 50, y: 40, w: 90, h: 40, speed: 0.4 },
        { x: 300, y: 70, w: 120, h: 50, speed: 0.6 },
        { x: 580, y: 30, w: 100, h: 42, speed: 0.5 },
        { x: 750, y: 80, w: 130, h: 48, speed: 0.55 }
      ];

      this.bindEvents();
      this.initialized = true;
      this.updateHud();
      this.showStartScreen();
    },

    bindEvents() {
      // Selector de dificultad
      const diffBtns = document.querySelectorAll('#flappyDiffSelector .diff-card-btn');
      diffBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          diffBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.difficulty = btn.dataset.diff || 'facil';
          const valEl = document.getElementById('flappyDiffVal');
          if (valEl) {
            const labels = { facil: '🟢 Paseo', media: '🟡 Potrero', dificil: '🔴 Desafío B-13' };
            valEl.textContent = labels[this.difficulty] || this.difficulty;
          }
        });
      });

      // Botón comenzar
      const startBtn = document.getElementById('flappyStartPlayBtn');
      if (startBtn) {
        startBtn.addEventListener('click', () => {
          this.hideStartScreen();
          this.resetGame();
        });
      }

      // Botón aletear touch
      const flapBtn = document.getElementById('flappyTouchFlapBtn');
      if (flapBtn) {
        flapBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.flap();
        });
        flapBtn.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.flap();
        }, { passive: false });
      }

      // Clic o toque en canvas
      if (this.canvas) {
        this.canvas.addEventListener('mousedown', (e) => {
          e.preventDefault();
          this.flap();
        });
        this.canvas.addEventListener('touchstart', (e) => {
          e.preventDefault();
          this.flap();
        }, { passive: false });
      }

      // Teclado (Espacio / Flecha Arriba / W)
      window.addEventListener('keydown', (e) => {
        const panel = document.getElementById('game-flappy');
        if (!panel || !panel.classList.contains('active')) return;

        if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
          e.preventDefault();
          this.flap();
        }
      });
    },

    showStartScreen() {
      this.isRunning = false;
      if (this.animId) cancelAnimationFrame(this.animId);
      const overlay = document.getElementById('flappyStartOverlay');
      if (overlay) overlay.style.display = 'flex';
      this.drawIdle();
    },

    hideStartScreen() {
      const overlay = document.getElementById('flappyStartOverlay');
      if (overlay) overlay.style.display = 'none';
    },

    start() {
      this.init();
      this.showStartScreen();
    },

    resetGame() {
      this.score = 0;
      this.seedsCollected = 0;
      this.pipes = [];
      this.seeds = [];
      this.particles = [];
      this.frameCount = 0;
      this.gameOver = false;
      this.hasFlappedOnce = false;

      this.bird.y = this.canvas.height * 0.45;
      this.bird.vy = 0;
      this.bird.angle = 0;

      this.activeFact = this.facts[Math.floor(Math.random() * this.facts.length)];

      this.isRunning = true;
      this.updateHud();

      if (this.animId) cancelAnimationFrame(this.animId);
      this.loop();
    },

    pause() {
      this.isRunning = false;
      if (this.animId) {
        cancelAnimationFrame(this.animId);
        this.animId = null;
      }
    },

    flap() {
      if (this.gameOver) {
        this.resetGame();
        return;
      }
      if (!this.isRunning) {
        this.hideStartScreen();
        this.resetGame();
      }

      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      this.bird.vy = cfg.jumpPower;
      this.hasFlappedOnce = true;

      // Sonido de aleteo suave
      if (typeof AudioFX !== 'undefined' && AudioFX.playTone) {
        AudioFX.playTone(392, 'sine', 0.08);
      }

      // Partículas de brisa / pluma
      for (let i = 0; i < 3; i++) {
        this.particles.push({
          x: this.bird.x - 14,
          y: this.bird.y + (Math.random() * 12 - 6),
          vx: -(Math.random() * 2 + 1),
          vy: Math.random() * 1.5 - 0.7,
          life: 20,
          maxLife: 20,
          color: 'rgba(255, 255, 255, 0.7)',
          size: Math.random() * 3 + 2
        });
      }
    },

    spawnPipe() {
      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      const minHeight = 50;
      const groundH = 45;
      const playableH = this.canvas.height - groundH;
      const maxTop = playableH - cfg.pipeGap - minHeight;
      const topH = Math.floor(Math.random() * (maxTop - minHeight + 1)) + minHeight;
      const bottomY = topH + cfg.pipeGap;
      const bottomH = playableH - bottomY;

      const pipe = {
        x: this.canvas.width + 10,
        width: 58,
        topH,
        bottomY,
        bottomH,
        passed: false
      };
      this.pipes.push(pipe);

      // 65% probabilidad de generar una semilla de girasol en la brecha
      if (Math.random() < 0.65) {
        this.seeds.push({
          x: pipe.x + pipe.width * 0.5,
          y: topH + cfg.pipeGap * 0.5 + (Math.random() * 30 - 15),
          radius: 12,
          collected: false,
          baseY: topH + cfg.pipeGap * 0.5,
          oscSpeed: Math.random() * 0.05 + 0.03
        });
      }
    },

    update() {
      if (!this.isRunning || this.gameOver) return;

      const cfg = this.diffConfig[this.difficulty] || this.diffConfig.facil;
      this.frameCount++;

      // Física del ave si ya dio el primer aleteo
      if (this.hasFlappedOnce) {
        this.bird.vy += cfg.gravity;
        this.bird.y += this.bird.vy;
        this.bird.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, this.bird.vy * 0.07));
      } else {
        // Flotación suave idle previa al flap
        this.bird.y += Math.sin(this.frameCount * 0.08) * 0.8;
      }

      this.bird.wingTimer += 0.2;

      // Generar postes
      if (this.hasFlappedOnce && this.frameCount % cfg.pipeInterval === 0) {
        this.spawnPipe();
      }

      // Mover nubes
      this.clouds.forEach(c => {
        c.x -= c.speed;
        if (c.x + c.w < 0) c.x = this.canvas.width + 20;
      });

      // Mover postes y verificar pase
      const birdBox = {
        left: this.bird.x - this.bird.radius + 3,
        right: this.bird.x + this.bird.radius - 3,
        top: this.bird.y - this.bird.radius + 3,
        bottom: this.bird.y + this.bird.radius - 3
      };

      for (let i = this.pipes.length - 1; i >= 0; i--) {
        const p = this.pipes[i];
        p.x -= cfg.pipeSpeed;

        // Puntuación por esquivar
        if (!p.passed && p.x + p.width < this.bird.x) {
          p.passed = true;
          this.score++;
          this.updateHud();
          if (typeof AudioFX !== 'undefined' && AudioFX.playTone) {
            AudioFX.playTone(587.33, 'triangle', 0.12);
          }
        }

        // Colisión con postes
        if (birdBox.right > p.x && birdBox.left < p.x + p.width) {
          if (birdBox.top < p.topH || birdBox.bottom > p.bottomY) {
            this.handleCrash();
            return;
          }
        }

        if (p.x + p.width < -30) {
          this.pipes.splice(i, 1);
        }
      }

      // Mover y recolectar semillas
      for (let i = this.seeds.length - 1; i >= 0; i--) {
        const s = this.seeds[i];
        s.x -= cfg.pipeSpeed;
        s.y = s.baseY + Math.sin(this.frameCount * s.oscSpeed) * 8;

        if (!s.collected) {
          const dist = Math.hypot(this.bird.x - s.x, this.bird.y - s.y);
          if (dist < this.bird.radius + s.radius) {
            s.collected = true;
            this.seedsCollected++;
            this.score += 5;
            this.updateHud();

            // Sonido de recolecta alegre
            if (typeof AudioFX !== 'undefined' && AudioFX.playTone) {
              AudioFX.playTone(523.25, 'sine', 0.08, 0);
              AudioFX.playTone(659.25, 'sine', 0.08, 50);
              AudioFX.playTone(783.99, 'triangle', 0.15, 100);
            }

            // Partículas doradas
            for (let k = 0; k < 8; k++) {
              const ang = Math.random() * Math.PI * 2;
              const spd = Math.random() * 3 + 1;
              this.particles.push({
                x: s.x,
                y: s.y,
                vx: Math.cos(ang) * spd,
                vy: Math.sin(ang) * spd,
                life: 25,
                maxLife: 25,
                color: '#facc15',
                size: Math.random() * 4 + 2
              });
            }
          }
        }

        if (s.x + s.radius < -20 || s.collected) {
          this.seeds.splice(i, 1);
        }
      }

      // Colisión suelo y techo
      const groundY = this.canvas.height - 45;
      if (this.bird.y + this.bird.radius >= groundY || this.bird.y - this.bird.radius <= 0) {
        this.handleCrash();
        return;
      }

      // Actualizar partículas
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const pt = this.particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) this.particles.splice(i, 1);
      }
    },

    handleCrash() {
      this.gameOver = true;
      this.isRunning = false;

      // Sonido de choque
      if (typeof AudioFX !== 'undefined' && AudioFX.playTone) {
        AudioFX.playTone(146.83, 'sawtooth', 0.22);
      }

      // Guardar récord
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('granjaFlappyBest', this.highScore);
        if (typeof state !== 'undefined') {
          state.flappyHighScore = this.highScore;
          if (typeof saveState === 'function') saveState();
        }
      }

      // Bonificación al perfil general del alumno
      if (this.score > 0) {
        const ptsWon = Math.floor(this.score * 1.5) + this.seedsCollected * 2;
        if (typeof state !== 'undefined') {
          state.score = (state.score || 0) + ptsWon;
          if (typeof saveState === 'function') saveState();
          if (typeof updateHeaderScore === 'function') updateHeaderScore();
        }
      }

      this.updateHud();
      this.draw();
    },

    updateHud() {
      const sEl = document.getElementById('flappyScoreVal');
      const seedEl = document.getElementById('flappySeedsVal');
      const bEl = document.getElementById('flappyBestVal');
      if (sEl) sEl.textContent = this.score;
      if (seedEl) seedEl.textContent = this.seedsCollected;
      if (bEl) bEl.textContent = this.highScore;
    },

    draw() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // 1. Cielo con degradado campestre
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(0.5, '#bae6fd');
      skyGrad.addColorStop(0.85, '#e0f2fe');
      skyGrad.addColorStop(1, '#86efac');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Sol brillante del Liceo
      ctx.save();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(w - 70, 60, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
      ctx.beginPath();
      ctx.arc(w - 70, 60, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 3. Nubes decorativas
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      this.clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.h * 0.45, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.3, c.y - c.h * 0.2, c.h * 0.55, 0, Math.PI * 2);
        ctx.arc(c.x + c.w * 0.6, c.y, c.h * 0.45, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Colinas distantes
      ctx.fillStyle = '#86efac';
      ctx.beginPath();
      ctx.moveTo(0, h - 45);
      ctx.bezierCurveTo(120, h - 90, 240, h - 60, 380, h - 85);
      ctx.bezierCurveTo(520, h - 110, 680, h - 70, w, h - 80);
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.fill();

      // 5. Postes de Madera (Cercados)
      this.pipes.forEach(p => {
        this.drawFencePost(ctx, p.x, 0, p.width, p.topH, true);
        this.drawFencePost(ctx, p.x, p.bottomY, p.width, p.bottomH, false);
      });

      // 6. Semillas de Girasol flotantes
      this.seeds.forEach(s => {
        this.drawSunflowerSeed(ctx, s.x, s.y, s.radius);
      });

      // 7. Partículas
      this.particles.forEach(pt => {
        ctx.save();
        ctx.globalAlpha = pt.life / pt.maxLife;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 8. Ave: Pepe el Agapornis
      this.drawAgapornis(ctx, this.bird.x, this.bird.y, this.bird.angle, this.bird.wingTimer);

      // 9. Suelo del potrero con pasto
      const groundY = h - 45;
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, groundY, w, 45);
      ctx.fillStyle = '#4d7c0f';
      ctx.fillRect(0, groundY, w, 6);

      // Margaritas en el pasto
      for (let x = 15; x < w; x += 45) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x, groundY + 16, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(x, groundY + 16, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 10. Marcador en pantalla si está jugando
      if (this.isRunning && !this.gameOver) {
        ctx.save();
        ctx.font = "bold 26px 'Fraunces', serif";
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        ctx.strokeText(`${this.score} pts`, w * 0.5, 45);
        ctx.fillText(`${this.score} pts`, w * 0.5, 45);
        ctx.restore();
      }

      // 11. Modal de Game Over en Canvas
      if (this.gameOver) {
        this.drawGameOverScreen(ctx, w, h);
      }
    },

    drawFencePost(ctx, x, y, width, height, isTop) {
      ctx.save();
      // Poste de madera principal
      const woodGrad = ctx.createLinearGradient(x, y, x + width, y);
      woodGrad.addColorStop(0, '#78350f');
      woodGrad.addColorStop(0.3, '#92400e');
      woodGrad.addColorStop(0.7, '#b45309');
      woodGrad.addColorStop(1, '#78350f');
      ctx.fillStyle = woodGrad;
      ctx.fillRect(x, y, width, height);

      // Borde y líneas de veta
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);

      // Tapa o extremo redondeado del poste
      const capH = 14;
      const capY = isTop ? height - capH : y;
      ctx.fillStyle = '#92400e';
      ctx.fillRect(x - 3, capY, width + 6, capH);
      ctx.strokeRect(x - 3, capY, width + 6, capH);

      // Hojas de enredadera decorativas (hiedra de la granja)
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(x + 8, isTop ? height - 20 : y + 20, 5, 0, Math.PI * 2);
      ctx.arc(x + width - 8, isTop ? height - 30 : y + 30, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    drawSunflowerSeed(ctx, x, y, r) {
      ctx.save();
      // Aura dorada
      ctx.fillStyle = 'rgba(250, 204, 21, 0.35)';
      ctx.beginPath();
      ctx.arc(x, y, r + 4, 0, Math.PI * 2);
      ctx.fill();

      // Pétalos dorados
      ctx.fillStyle = '#f59e0b';
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI * 2) / 8;
        const px = x + Math.cos(ang) * (r * 0.85);
        const py = y + Math.sin(ang) * (r * 0.85);
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Semilla central
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(x, y, r * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Brillo
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - 2, y - 2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    },

    drawAgapornis(ctx, x, y, angle, wingTimer) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      // Cola de plumas verdes y azul turquesa
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(-12, 4);
      ctx.lineTo(-24, 8);
      ctx.lineTo(-14, -2);
      ctx.closePath();
      ctx.fill();

      // Cuerpo ovalado verde esmeralda
      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cara y babero color melocotón / rojo rosado (Agapornis roseicollis)
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(7, -1, 10, 9, 0.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.ellipse(5, 4, 8, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pico curvado amarillo / marfil
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(14, -3);
      ctx.lineTo(23, 2);
      ctx.lineTo(13, 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Anillo ocular blanco distintivo
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(9, -4, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Ojo negro con brillo
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(9.5, -4, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(8.5, -5, 1, 0, Math.PI * 2);
      ctx.fill();

      // Ala verde con animación de aleteo
      const wingSweep = Math.sin(wingTimer) * 8;
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.ellipse(-3, 1 + wingSweep * 0.3, 11, 7 + Math.abs(wingSweep * 0.5), -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Sombrerito de campo o pañuelo liceano
      ctx.fillStyle = '#ffd83d';
      ctx.beginPath();
      ctx.ellipse(5, -10, 8, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.fillRect(3, -15, 6, 5);

      ctx.restore();
    },

    drawGameOverScreen(ctx, w, h) {
      ctx.save();
      // Telón oscuro suave
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fillRect(0, 0, w, h);

      // Tarjeta central de resultados
      const cardW = Math.min(500, w - 40);
      const cardH = 260;
      const cardX = (w - cardW) * 0.5;
      const cardY = (h - cardH) * 0.5;

      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 16);
      ctx.fill();
      ctx.stroke();

      // Título
      ctx.font = "bold 24px 'Fraunces', serif";
      ctx.fillStyle = '#166534';
      ctx.textAlign = 'center';
      ctx.fillText("🏁 ¡Fin del Vuelo!", w * 0.5, cardY + 38);

      // Estadísticas
      ctx.font = "bold 16px 'Karla', sans-serif";
      ctx.fillStyle = '#334155';
      ctx.fillText(`Puntos: ${this.score}   |   Semillas: ${this.seedsCollected} 🌻   |   Récord: ${this.highScore}`, w * 0.5, cardY + 70);

      // Franja de dato curioso zootécnico
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(cardX + 16, cardY + 86, cardW - 32, 90, 8);
      ctx.fill();
      ctx.stroke();

      ctx.font = "bold 11px 'Space Mono', monospace";
      ctx.fillStyle = '#16a34a';
      ctx.textAlign = 'left';
      ctx.fillText("🌿 SABIDURÍA DE CAMPO B-13:", cardX + 26, cardY + 104);

      // Texto de sabiduría biológica con ajuste de línea
      ctx.font = "13px 'Karla', sans-serif";
      ctx.fillStyle = '#1e293b';
      this.wrapText(ctx, this.activeFact || this.facts[0], cardX + 26, cardY + 124, cardW - 52, 17);

      // Botón interactivo de reinicio
      ctx.textAlign = 'center';
      ctx.font = "bold 15px 'Karla', sans-serif";
      ctx.fillStyle = '#15803d';
      ctx.fillText("Toca la pantalla o presiona ESPACIO para volar otra vez 🪽", w * 0.5, cardY + 235);

      ctx.restore();
    },

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const words = text.split(' ');
      let line = '';
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, y);
          line = words[n] + ' ';
          y += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, y);
    },

    drawIdle() {
      if (!this.ctx || !this.canvas) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Fondo simple
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#38bdf8');
      skyGrad.addColorStop(1, '#86efac');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Suelo
      ctx.fillStyle = '#65a30d';
      ctx.fillRect(0, h - 45, w, 45);

      // Ave en reposo
      this.drawAgapornis(ctx, w * 0.5, h * 0.45, 0, 0);
    },

    loop() {
      if (!this.isRunning) return;
      this.update();
      this.draw();
      this.animId = requestAnimationFrame(() => this.loop());
    }
  };

  window.FlappyGame = FlappyGame;

  /* Función para refrescar el puntaje oficial de quizzes en el scorebox general */
  function updateHeaderScore() {
    const scoreEl = document.getElementById('score');
    if (scoreEl) {
      const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : ((typeof state !== 'undefined' && state.pureScore) ? state.pureScore : 0);
      scoreEl.textContent = purePts;
    }
  }
  window.updateHeaderScore = updateHeaderScore;

  // Inicializar todos los minijuegos, cuaderno de pistas y botones al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    updateHeaderScore();
    initGameTabs();
    CluesNotebook.init();
    MemoryGame.start();
    WordSearchGame.start();
    PlatformerGame.start();
    FlappyGame.init();

    const memResetBtn = document.getElementById('memResetBtn');
    if (memResetBtn) memResetBtn.addEventListener('click', () => MemoryGame.showStartScreen());

    const wsResetBtn = document.getElementById('wsResetBtn');
    if (wsResetBtn) wsResetBtn.addEventListener('click', () => WordSearchGame.showStartScreen());

    const platResetBtn = document.getElementById('platResetBtn');
    if (platResetBtn) platResetBtn.addEventListener('click', () => PlatformerGame.showStartScreen());

    const flappyResetBtn = document.getElementById('flappyResetBtn');
    if (flappyResetBtn) flappyResetBtn.addEventListener('click', () => FlappyGame.showStartScreen());

    // Conexión garantizada de botones de la barra de herramientas
    const rulesBtn = document.getElementById('rulesBtn');
    if (rulesBtn) {
      rulesBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof renderRules === 'function') renderRules();
        if (typeof openOverlayId === 'function') openOverlayId('rulesOverlay');
        else {
          const ov = document.getElementById('rulesOverlay');
          if (ov) { ov.style.display = 'flex'; ov.classList.add('active'); }
        }
      });
    }

    const achievementsBtn = document.getElementById('achievementsBtn');
    if (achievementsBtn) {
      achievementsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof renderAchievementsList === 'function') renderAchievementsList();
        if (typeof openOverlayId === 'function') openOverlayId('achievementsOverlay');
        else {
          const ov = document.getElementById('achievementsOverlay');
          if (ov) { ov.style.display = 'flex'; ov.classList.add('active'); }
        }
      });
    }
  });

})();
