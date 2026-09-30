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

  /* Helper para modal de victoria enriquecido y de cierre garantizado */
  function showGameVictory({ icon, title, subtitle, msg, stats, stamp, onRestart }) {
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

    if (iconEl) iconEl.textContent = icon || '🏆';
    if (titleEl) titleEl.textContent = title || '¡Felicitaciones!';
    if (subEl) subEl.textContent = subtitle || 'Desafío Recreativo Superado';
    if (msgEl) msgEl.textContent = msg || '';
    if (statsEl) statsEl.innerHTML = stats || '';
    if (stampEl) stampEl.textContent = stamp || 'MISIÓN CUMPLIDA';

    const closeVictory = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      overlay.classList.remove('open');
      overlay.style.display = 'none';
      AudioFX.stopAll();
    };

    if (closeBtn) closeBtn.onclick = closeVictory;
    if (acceptBtn) acceptBtn.onclick = closeVictory;

    if (restartBtn) {
      restartBtn.onclick = (e) => {
        closeVictory(e);
        if (typeof onRestart === 'function') onRestart();
      };
    }

    overlay.onclick = (e) => {
      if (e.target === overlay) {
        closeVictory(e);
      }
    };

    overlay.style.display = 'flex';
    overlay.classList.add('open');
  }

  // Atajo con tecla Escape para cerrar cualquier modal y apagar sonidos
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const vOverlay = document.getElementById('victoryOverlay');
      if (vOverlay) {
        vOverlay.classList.remove('open');
        vOverlay.style.display = 'none';
        AudioFX.stopAll();
      }
    }
  });

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
        }
      });
    });
  }

  /* ============================================================
     JUEGO 1: BUSCA LAS PAREJAS (MEMORIA CURIOSIDAD ↔ ANIMAL)
     Pool de 18 parejas maestras: Cada partida elige al azar 6 parejas
     y ofrece pistas directas para responder los Quizzes del liceo
     ============================================================ */
  const MemoryGame = {
    initialized: false,
    isStarted: false,
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
    },

    showStartScreen() {
      clearInterval(this.timerInterval);
      this.isStarted = false;
      this.flippedCards = [];
      this.matchedCount = 0;
      this.moves = 0;
      this.timerSeconds = 0;
      this.learnedClues = [];
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
      // Elegir 6 parejas al azar del banco maestro para que cada intento sea único
      const shuffledMaster = [...this.masterPairs].sort(() => Math.random() - 0.5);
      this.currentPairs = shuffledMaster.slice(0, 6);

      // Construir baraja de 12 cartas (6 animales y 6 curiosidades)
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
          if (clueFact && !this.learnedClues.includes(clueFact)) {
            this.learnedClues.push(clueFact);
          }
          showQuizClueToast(`💡 Pista Quiz Desbloqueada: ${clueFact}`, '🧠');

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

              const cluesListHtml = this.learnedClues.length > 0
                ? `<div style="margin-top:10px;text-align:left;background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.82rem;color:#1e293b;"><b>💡 Pistas Clave para tus Quizzes:</b><ul style="margin:6px 0 0 16px;padding:0;">${this.learnedClues.map(c => `<li>${c}</li>`).join('')}</ul></div>`
                : '';

              setTimeout(() => {
                showGameVictory({
                  icon: '🧠',
                  title: '¡Memoria Zootécnica Completada!',
                  subtitle: 'Pistas y Conceptos para Quizzes Desbloqueados',
                  stamp: 'EXCELENCIA BIOLÓGICA',
                  msg: 'Has emparejado con éxito todos los conceptos clave de la granja. ¡Usa estas pistas en los Quizzes del Mapa 3D para asegurar tus décimas!',
                  stats: `⏱️ <b>Tiempo empleado:</b> ${timeStr} &nbsp;|&nbsp; 🔄 <b>Intentos realizados:</b> ${this.moves} movimientos${cluesListHtml}`,
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
     Pool de 24 palabras maestras: Cada partida elige al azar 8 palabras
     y genera una cuadrícula 12x12 totalmente nueva con pistas de quiz
     ============================================================ */
  const WordSearchGame = {
    initialized: false,
    isStarted: false,
    timerSeconds: 0,
    timerInterval: null,
    size: 12,
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
    },

    showStartScreen() {
      clearInterval(this.timerInterval);
      this.isStarted = false;
      this.timerSeconds = 0;
      this.clearSelection();

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
      this.foundWords.clear();
      this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(''));

      // Seleccionar 8 palabras aleatorias de la biblioteca maestra de 24 términos
      const shuffled = [...this.masterWords].sort(() => Math.random() - 0.5);
      this.words = shuffled.slice(0, 8);

      // Colocar cada palabra en la matriz (horizontal, vertical o diagonal)
      this.words.forEach(wObj => {
        const word = wObj.word;
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 150) {
          attempts++;
          const dir = Math.floor(Math.random() * 3); // 0: horizontal, 1: vertical, 2: diagonal
          let r = Math.floor(Math.random() * this.size);
          let c = Math.floor(Math.random() * this.size);

          let canPlace = true;
          for (let k = 0; k < word.length; k++) {
            let nr = r + (dir === 1 || dir === 2 ? k : 0);
            let nc = c + (dir === 0 || dir === 2 ? k : 0);
            if (nr >= this.size || nc >= this.size) { canPlace = false; break; }
            if (this.grid[nr][nc] !== '' && this.grid[nr][nc] !== word[k]) { canPlace = false; break; }
          }

          if (canPlace) {
            for (let k = 0; k < word.length; k++) {
              let nr = r + (dir === 1 || dir === 2 ? k : 0);
              let nc = c + (dir === 0 || dir === 2 ? k : 0);
              this.grid[nr][nc] = word[k];
            }
            wObj.coords = { r, c, dir, len: word.length };
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

        showQuizClueToast(`💡 Concepto Descubierto: ${matchedWord.word} — ${matchedWord.desc}`, '🔤');
        this.updateProgress();

        if (this.foundWords.size === this.words.length) {
          clearInterval(this.timerInterval);
          AudioFX.win();
          const mins = Math.floor(this.timerSeconds / 60);
          const secs = this.timerSeconds % 60;
          const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

          const conceptsListHtml = `<div style="margin-top:10px;text-align:left;background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.82rem;color:#1e293b;"><b>💡 Conceptos Dominados para tus Quizzes:</b><ul style="margin:6px 0 0 16px;padding:0;">${this.words.map(w => `<li><b>${w.word}:</b> ${w.desc}</li>`).join('')}</ul></div>`;

          setTimeout(() => {
            showGameVictory({
              icon: '🔍',
              title: '¡Sopa de Letras Agroecológica Superada!',
              subtitle: 'Vocabulario y Bienestar Animal Liceo B-13',
              stamp: 'ZOOTECNIA COMUNITARIA',
              msg: `¡Excelente trabajo! Has identificado los ${this.words.length} conceptos clave. Cada uno de estos términos aparece en las preguntas de los Quizzes del liceo.`,
              stats: `🎯 <b>Palabras identificadas:</b> ${this.words.length}/${this.words.length} conceptos &nbsp;|&nbsp; ⏱️ <b>Tiempo:</b> ${timeStr}${conceptsListHtml}`,
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
    timerSeconds: 0,
    timerInterval: null,
    keys: { left: false, right: false, jump: false },
    selectedAnimal: 'conejo',
    animalEmojis: {
      conejo: '🐰',
      gallo: '🐓',
      gallina: '🐔',
      pato: '🦆',
      agapornis: '🦜',
      catita: '🐦'
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
      invulnerableTime: 0
    },
    cameraX: 0,
    worldWidth: 4200,
    platforms: [],
    trampolines: [],
    mudPuddles: [],
    thorns: [],
    quizScrolls: [],
    items: [],
    particles: [],
    ambientLeaves: [],
    floatingTexts: [],
    unlockedClues: [],
    goal: { x: 3960, y: 150, w: 180, h: 190 },
    lastTime: 0,
    animTime: 0,

    start() {
      this.initialized = true;
      this.canvas = document.getElementById('platformerCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.initRunnerSelector();
      this.initStartScreen();
      this.setupControls();
      this.showStartScreen();
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

    showStartScreen() {
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

      this.score = 0;
      this.lives = 3;
      this.timerSeconds = 0;
      this.resetWorld();
      this.updateHud();
      this.draw();
    },

    startRun() {
      const overlay = document.getElementById('platStartOverlay');
      if (overlay) overlay.classList.add('hidden');

      this.resetWorld();
      this.score = 0;
      this.lives = 3;
      this.timerSeconds = 0;
      this.isRunning = true;
      this.isFinished = false;
      this.updateHud();

      clearInterval(this.timerInterval);
      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.updateHud();
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
        modalPreview.innerHTML = `Corredor activo: <b>${this.player.emoji} ${nameCap}</b>${this.player.accEmoji ? ` (Accesorio: ${this.player.accEmoji})` : ''}`;
      }
    },

    loadAccessory() {
      this.player.accEmoji = '';
      if (typeof state !== 'undefined') {
        let accId = 'none';
        if (state.custom && state.custom[this.selectedAnimal] && state.custom[this.selectedAnimal].accessory) {
          accId = state.custom[this.selectedAnimal].accessory;
        } else if (state.custom && state.custom.conejo && state.custom.conejo.accessory) {
          accId = state.custom.conejo.accessory;
        }
        if (typeof ACCESSORIES !== 'undefined') {
          const found = ACCESSORIES.find(x => x.id === accId);
          if (found && found.emoji) this.player.accEmoji = found.emoji;
        }
      }
    },

    updateCharPreview() {
      const charEl = document.getElementById('charPreviewIcon');
      if (charEl) {
        charEl.innerHTML = `${this.player.emoji}${this.player.accEmoji ? ` <span style="font-size:1.1rem;margin-left:2px;">${this.player.accEmoji}</span>` : ''}`;
      }
    },

    setupControls() {
      window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = true;
        if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = true;
        if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) {
          this.keys.jump = true;
          e.preventDefault();
        }
      });

      window.addEventListener('keyup', (e) => {
        if (['ArrowLeft', 'KeyA'].includes(e.code)) this.keys.left = false;
        if (['ArrowRight', 'KeyD'].includes(e.code)) this.keys.right = false;
        if (['ArrowUp', 'KeyW', 'Space'].includes(e.code)) this.keys.jump = false;
      });

      const btnLeft = document.getElementById('touchBtnLeft');
      const btnRight = document.getElementById('touchBtnRight');
      const btnJump = document.getElementById('touchBtnJump');

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
    },

    reset() {
      this.showStartScreen();
    },

    resetWorld() {
      this.cameraX = 0;
      this.particles = [];
      this.floatingTexts = [];
      this.unlockedClues = [];
      this.animTime = 0;

      this.setAnimalRunner(this.selectedAnimal || 'conejo');

      // Jugador arranca sobre el porche elevado inicial (y = 150 -> aterriza en y = 200)
      this.player.x = 50;
      this.player.y = 150;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.grounded = false;
      this.player.facing = 1;
      this.player.landSquash = 0;
      this.player.invulnerableTime = 0;

      // Hojas y pétalos flotantes estilo Stardew Valley
      this.ambientLeaves = [];
      for (let i = 0; i < 26; i++) {
        this.ambientLeaves.push({
          x: Math.random() * 4200,
          y: Math.random() * 340,
          size: 3 + Math.random() * 3.5,
          speedX: 0.8 + Math.random() * 0.9,
          speedY: 0.35 + Math.random() * 0.5,
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI * 2,
          color: ['#fbcfe8', '#f472b6', '#fed7aa', '#fde047', '#a7f3d0'][Math.floor(Math.random() * 5)]
        });
      }

      // Suelo continuo en la zanja inferior (y = 340) + porche inicial de madera
      this.platforms = [
        { x: 0, y: 340, w: 4200, h: 60, type: 'ground' },
        { x: 20, y: 200, w: 150, h: 28, type: 'wood', label: 'Porche Salida' }
      ];

      // Variación sutil garantizando que todas las plataformas elevadas permanezcan entre y = 175 e y = 210
      // NINGUNA plataforma elevada está al alcance del salto normal desde el suelo (340 - 210 = 130px > 88.9px)
      const rOffset = () => (Math.random() - 0.5) * 20;

      // Sección 1: Potrero Inicial Elevado (x: 250 - 950)
      this.platforms.push(
        { x: 250 + rOffset(), y: 205, w: 110, h: 42, type: 'straw', label: 'Fardo 1' },
        { x: 430 + rOffset(), y: 185, w: 135, h: 26, type: 'wood', label: 'Pasarela 1', lantern: true },
        { x: 635 + rOffset(), y: 198, w: 115, h: 42, type: 'straw', label: 'Fardo 2' },
        { x: 820 + rOffset(), y: 180, w: 130, h: 26, type: 'wood', label: 'Terraza 1' }
      );

      // Sección 2: El Silo y Pasarelas Elevadas (x: 1040 - 1760)
      this.platforms.push(
        { x: 1040 + rOffset(), y: 205, w: 115, h: 42, type: 'straw', label: 'Fardo 3' },
        { x: 1230 + rOffset(), y: 180, w: 140, h: 26, type: 'wood', label: 'Puente Roble 2', lantern: true },
        { x: 1445 + rOffset(), y: 200, w: 110, h: 42, type: 'straw', label: 'Fardo 4' },
        { x: 1625 + rOffset(), y: 185, w: 135, h: 26, type: 'wood', label: 'Andamio 2' }
      );

      // Sección 3: Huerto y Terrazas Colgantes (x: 1860 - 2580)
      this.platforms.push(
        { x: 1860 + rOffset(), y: 195, w: 120, h: 42, type: 'straw', label: 'Fardo 5' },
        { x: 2055 + rOffset(), y: 175, w: 140, h: 26, type: 'wood', label: 'Pasarela Huerto', lantern: true },
        { x: 2265 + rOffset(), y: 205, w: 115, h: 42, type: 'straw', label: 'Fardo 6' },
        { x: 2450 + rOffset(), y: 180, w: 135, h: 26, type: 'wood', label: 'Terraza Central' }
      );

      // Sección 4: El Gran Desfiladero Campestre (x: 2690 - 3410)
      this.platforms.push(
        { x: 2690 + rOffset(), y: 200, w: 125, h: 42, type: 'straw', label: 'Fardo 7' },
        { x: 2885 + rOffset(), y: 180, w: 140, h: 26, type: 'wood', label: 'Puente Rústico', lantern: true },
        { x: 3095 + rOffset(), y: 195, w: 115, h: 42, type: 'straw', label: 'Fardo 8' },
        { x: 3280 + rOffset(), y: 180, w: 130, h: 26, type: 'wood', label: 'Terraza Alta' }
      );

      // Sección 5: Llegada y Porche de Entrada al Granero (x: 3510 - 3960)
      this.platforms.push(
        { x: 3510 + rOffset(), y: 205, w: 120, h: 42, type: 'straw', label: 'Fardo Final' },
        { x: 3700 + rOffset(), y: 190, w: 140, h: 26, type: 'wood', label: 'Pasarela Granero', lantern: true },
        { x: 3885, y: 210, w: 110, h: 30, type: 'wood', label: 'Porche Granero' }
      );

      // Trampolines de heno elásticos en el suelo (ÚNICA forma de subir desde la zanja inferior)
      this.trampolines = [
        { x: 890, y: 324, w: 56, h: 16, cooldown: 0 },
        { x: 1690, y: 324, w: 56, h: 16, cooldown: 0 },
        { x: 2500, y: 324, w: 56, h: 16, cooldown: 0 },
        { x: 3320, y: 324, w: 56, h: 16, cooldown: 0 }
      ];

      // Charcos de barro viscoso en el suelo (causan daño y frenan fuertemente)
      this.mudPuddles = [
        { x: 500, y: 338, w: 105, h: 12 },
        { x: 1290, y: 338, w: 110, h: 12 },
        { x: 2100, y: 338, w: 115, h: 12 },
        { x: 2920, y: 338, w: 110, h: 12 },
        { x: 3600, y: 338, w: 95, h: 12 }
      ];

      // Zarzas espinosas de campo en el suelo (causan daño al tocarlas)
      this.thorns = [
        { x: 710, y: 318, w: 34, h: 22 },
        { x: 1510, y: 318, w: 34, h: 22 },
        { x: 2320, y: 318, w: 34, h: 22 },
        { x: 3130, y: 318, w: 34, h: 22 }
      ];

      // 3 Pergaminos Dorados con pistas para Quizzes distribuidos a lo largo de las rutas altas
      const shuffledClues = [...CLUES_BANK].sort(() => Math.random() - 0.5);
      this.quizScrolls = [
        { x: 495, y: 145, taken: false, clue: shuffledClues[0] },
        { x: 1300, y: 140, taken: false, clue: shuffledClues[1] },
        { x: 2955, y: 140, taken: false, clue: shuffledClues[2] }
      ];

      // Items nutritivos recolectables y estrellas doradas
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

      this.update(dt);
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
          color: 'rgba(215, 195, 150, 0.75)',
          life: 1.0,
          decay: 0.04 + Math.random() * 0.03
        });
      }
    },

    spawnMudSplash(x, y, count = 8) {
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: x + (Math.random() - 0.5) * 20,
          y: y + (Math.random() - 0.5) * 4,
          vx: (Math.random() - 0.5) * 4.5,
          vy: -Math.random() * 3.5 - 1.5,
          rad: 3 + Math.random() * 3.5,
          color: ['#3e2410', '#543217', '#251408'][Math.floor(Math.random() * 3)],
          life: 1.0,
          decay: 0.045
        });
      }
    },

    spawnSparkles(x, y, count = 8) {
      for (let i = 0; i < count; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 1.5 + Math.random() * 3.5;
        this.particles.push({
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          rad: 2 + Math.random() * 2.5,
          color: ['#ffd83d', '#ff9f1c', '#ffffff', '#4ade80'][Math.floor(Math.random() * 4)],
          life: 1.0,
          decay: 0.035 + Math.random() * 0.02
        });
      }
    },

    spawnVictoryFireworks() {
      for (let i = 0; i < 40; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 5.5;
        this.particles.push({
          x: this.goal.x + 90,
          y: this.goal.y + 40,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          rad: 3 + Math.random() * 4,
          color: ['#ffd83d', '#ff4757', '#2ed573', '#1e90ff', '#f59e0b', '#a855f7'][Math.floor(Math.random() * 6)],
          life: 1.3,
          decay: 0.025
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
        decay: 0.025
      });
    },

    takeDamage(amount, reason) {
      if (this.isFinished) return;
      this.lives = Math.max(0, this.lives - amount);
      this.player.invulnerableTime = 1.35;
      this.player.vy = -6.0;
      this.player.vx = -this.player.facing * 2.8;
      AudioFX.splash();
      AudioFX.wrong();
      this.spawnMudSplash(this.player.x + this.player.w / 2, this.player.y + this.player.h);
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

      setTimeout(() => {
        showGameVictory({
          icon: '🌧️',
          title: '¡El Fango Atrapó a tu Corredor!',
          subtitle: 'Recorrido Interrumpido — Sin Vidas',
          stamp: 'INTÉNTALO OTRA VEZ',
          msg: 'Tu animalito cayó en el lodo resbaloso y se agotó. Recuerda que no puedes saltar a las plataformas altas directamente desde el suelo: ¡debes usar los trampolines de heno elásticos para impulsarte hacia arriba!',
          stats: `⭐ <b>Puntaje:</b> ${this.score} pts &nbsp;|&nbsp; ⏱️ <b>Tiempo:</b> ${this.timerSeconds}s &nbsp;|&nbsp; 💡 <b>Pistas descubiertas:</b> ${this.unlockedClues.length}`,
          onRestart: () => this.showStartScreen()
        });
      }, 200);
    },

    update(dt) {
      const p = this.player;

      // Decrementar tiempo de invulnerabilidad tras daño
      if (p.invulnerableTime > 0) {
        p.invulnerableTime -= dt * 0.001;
      }

      // Movimiento horizontal
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

      // Salto normal (jumpStrength: 10.5, altura máx ≈ 88.9px, incapaz de llegar a y ≤ 210 desde el suelo y = 340)
      if (this.keys.jump && p.grounded) {
        AudioFX.jump();
        p.vy = -p.jumpStrength;
        p.grounded = false;
        p.landSquash = -0.22;
        this.spawnDust(p.x + p.w / 2, p.y + p.h, 5);
      }

      // Gravedad calibrada (0.62)
      p.vy += 0.62;
      if (p.vy > 14) p.vy = 14;

      p.x += p.vx;
      p.y += p.vy;

      // Límites del mundo
      if (p.x < 10) p.x = 10;
      if (p.x > this.worldWidth - p.w) p.x = this.worldWidth - p.w;

      // Colisiones con plataformas sólidas
      const wasGrounded = p.grounded;
      p.grounded = false;

      for (const plat of this.platforms) {
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
          if (!wasGrounded) {
            p.landSquash = 0.25;
            this.spawnDust(p.x + p.w / 2, p.y + p.h, 4);
          }
        }
      }

      p.landSquash *= 0.82;

      // Interacción con trampolines de heno elásticos (ÚNICA forma de subir desde la zanja inferior)
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
          p.vy = -18.6; // Catapulta 279px hacia arriba hasta y ≈ 61px, permitiendo aterrizar en plataformas altas
          p.grounded = false;
          t.cooldown = 24;
          this.spawnSparkles(t.x + t.w / 2, t.y, 14);
          this.spawnFloatingText(t.x + t.w / 2, t.y - 12, '¡SÚPER SALTO! 🦘', '#fbbf24');
        }
      }

      // Interacción con charcos de barro (dañan 1 vida y ralentizan fuertemente)
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

      // Interacción con zarzas espinosas (dañan 1 vida)
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
        this.takeDamage(1, '¡Caída al vacío! -1 VIDA 💔');
        if (this.lives > 0) {
          p.x = Math.max(50, p.x - 300);
          p.y = 170;
          p.vy = 0;
        }
      }

      // Recolección de pergaminos de pistas de quiz
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
            showQuizClueToast(clueText, '📜');
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

        if (typeof state !== 'undefined') {
          state.minigames = state.minigames || {};
          const prevBest = state.minigames.platformer?.bestScore || 0;
          state.minigames.platformer = {
            bestScore: Math.max(prevBest, this.score),
            bestTime: Math.min(state.minigames.platformer?.bestTime || 9999, this.timerSeconds),
            runsCompleted: (state.minigames.platformer?.runsCompleted || 0) + 1
          };
          if (typeof saveState === 'function') saveState();
        }

        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

        this.spawnVictoryFireworks();

        const cluesListHtml = this.unlockedClues.length > 0
          ? `<div style="margin-top:10px;text-align:left;background:rgba(255,255,255,0.9);padding:10px 14px;border-radius:10px;border:1px solid #cbd5e1;font-size:0.82rem;color:#1e293b;"><b>💡 Pistas Clave Desbloqueadas para los Quizzes (${this.unlockedClues.length}):</b><ul style="margin:6px 0 0 16px;padding:0;">${this.unlockedClues.map(c => `<li>${c}</li>`).join('')}</ul></div>`
          : '';

        setTimeout(() => {
          showGameVictory({
            icon: '🏆',
            title: '¡Llegaste al Granero B-13!',
            subtitle: '¡Carrera Campestre Completada!',
            stamp: 'MISIÓN CUMPLIDA',
            msg: `¡Tu corredor ${this.player.emoji} superó los charcos de lodo, escaló los fardos y alcanzó la meta con vida! Recuerda usar las pistas descubiertas para responder los Quizzes en el Mapa y ganar décimas.`,
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

      // Actualizar hojas y pétalos ambientales
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

      // Cámara de seguimiento horizontal suave
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

      // 1. Cielo degradado estilo Stardew Valley (mañana campestre cálida)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, '#3a7bd5');   // azul cerúleo profundo
      skyGrad.addColorStop(0.38, '#68a691'); // turquesa de montaña
      skyGrad.addColorStop(0.72, '#f4d06f'); // resplandor dorado
      skyGrad.addColorStop(1, '#ffe8d6');   // luz melocotón suave de horizonte
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h);

      // Sol radiante con halo cálido y destello suave
      ctx.save();
      const sunX = w - 100;
      const sunY = 70;
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
      ctx.restore();

      // Nubes suaves con parallax
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      for (let i = 0; i < 9; i++) {
        const cloudX = ((i * 380) - (this.cameraX * 0.10) + (this.animTime * 10)) % (w + 420) - 100;
        const cloudY = 48 + (i % 3) * 24;
        ctx.beginPath();
        ctx.arc(cloudX, cloudY, 24, 0, Math.PI * 2);
        ctx.arc(cloudX + 20, cloudY - 7, 28, 0, Math.PI * 2);
        ctx.arc(cloudX + 44, cloudY, 22, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Capa 1 de montañas lejanas (picos alpinos pizarra) con parallax
      ctx.save();
      ctx.fillStyle = '#3d5a80';
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

      // Capa 2 de colinas de pinos (verde bosque profundo) con copas triangulares
      ctx.fillStyle = '#204e3b';
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

      // Siluetas de pinos en la cresta de las colinas
      ctx.fillStyle = '#16382a';
      for (let x = 15; x <= w; x += 38) {
        const wx = x + (this.cameraX * 0.14);
        const hy = 215 + Math.sin(wx * 0.0042) * 28 + Math.sin(wx * 0.012) * 12;
        ctx.beginPath();
        ctx.moveTo(x, hy - 16);
        ctx.lineTo(x - 7, hy);
        ctx.lineTo(x + 7, hy);
        ctx.closePath();
        ctx.fill();
      }

      // Capa 3: lomas de pastoreo cercanas (verde pradera cálida)
      ctx.fillStyle = '#40916c';
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

      // Coordenadas del mundo con traslación de la cámara
      ctx.save();
      ctx.translate(-this.cameraX, 0);

      // Molino rústico de viento campestre animado a mitad de trayecto
      this.drawWindmill(ctx, 1850, 240);

      // Cercas de madera campestres en el fondo a lo largo del camino
      ctx.strokeStyle = '#5a3d1e';
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

      // Dibujar pétalos y hojas flotantes ambientales estilo Stardew Valley
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

      // Dibujar plataformas (suelo, fardos de heno, puentes de roble)
      for (const p of this.platforms) {
        if (p.type === 'ground') {
          // Suelo de labranza estilo Stardew: césped frondoso + tierra de cultivo
          ctx.fillStyle = '#3a2414';
          ctx.fillRect(p.x, p.y, p.w, p.h);

          // Franja de césped fértil
          ctx.fillStyle = '#4f772d';
          ctx.fillRect(p.x, p.y, p.w, 14);

          // Puntas de hierba pixelada
          ctx.fillStyle = '#74c69d';
          for (let gx = p.x; gx < p.x + p.w; gx += 16) {
            ctx.beginPath();
            ctx.moveTo(gx, p.y);
            ctx.lineTo(gx + 3, p.y - 6);
            ctx.lineTo(gx + 6, p.y);
            ctx.fill();
          }

          // Flores silvestres salpicadas (amapolas, margaritas, tréboles)
          const flowers = ['#f43f5e', '#facc15', '#ffffff', '#22c55e'];
          for (let fx = p.x + 12; fx < p.x + p.w; fx += 52) {
            const fColor = flowers[(fx * 13) % flowers.length];
            ctx.fillStyle = fColor;
            ctx.beginPath();
            ctx.arc(fx, p.y - 3, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Estrato de tierra con textura y piedras de río
          ctx.fillStyle = '#27150a';
          ctx.fillRect(p.x, p.y + 14, p.w, p.h - 14);

          ctx.fillStyle = '#5c3c26';
          for (let px = p.x + 8; px < p.x + p.w; px += 36) {
            ctx.fillRect(px, p.y + 22 + ((px * 7) % 20), 7, 4);
          }
        } else if (p.type === 'straw') {
          // Fardo de heno estilo Stardew Valley con detalle artesanal
          ctx.fillStyle = '#eab308';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#28311b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(p.x, p.y, p.w, p.h);

          // Sombra inferior del fardo
          ctx.fillStyle = '#ca8a04';
          ctx.fillRect(p.x + 2, p.y + p.h - 8, p.w - 4, 6);

          // Puntas y briznas de paja dorada
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.5;
          for (let sy = p.y + 7; sy < p.y + p.h - 6; sy += 8) {
            ctx.beginPath();
            ctx.moveTo(p.x + 5, sy);
            ctx.lineTo(p.x + p.w - 5, sy);
            ctx.stroke();
          }

          // Pajas sueltas que sobresalen en los bordes
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 2;
          for (let wx = p.x + 10; wx < p.x + p.w - 10; wx += 18) {
            ctx.beginPath();
            ctx.moveTo(wx, p.y);
            ctx.lineTo(wx + ((wx % 2 === 0) ? 3 : -3), p.y - 4);
            ctx.stroke();
          }

          // Cuerdas dobles de cáñamo rústico
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(p.x + p.w * 0.28, p.y);
          ctx.lineTo(p.x + p.w * 0.28, p.y + p.h);
          ctx.moveTo(p.x + p.w * 0.72, p.y);
          ctx.lineTo(p.x + p.w * 0.72, p.y + p.h);
          ctx.stroke();
        } else if (p.type === 'wood') {
          // Pasarela de roble estilo carpintería de Robin (Stardew Valley)
          ctx.fillStyle = '#451a03';
          ctx.fillRect(p.x + 10, p.y + p.h, 12, 340 - (p.y + p.h));
          ctx.fillRect(p.x + p.w - 22, p.y + p.h, 12, 340 - (p.y + p.h));

          // Enredaderas verdes que trepan por los postes
          ctx.fillStyle = '#22c55e';
          for (let py = p.y + p.h + 8; py < 330; py += 24) {
            ctx.beginPath();
            ctx.arc(p.x + 10, py, 3, 0, Math.PI * 2);
            ctx.arc(p.x + p.w - 10, py + 10, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Tablón principal de madera
          ctx.fillStyle = '#854d0e';
          ctx.fillRect(p.x, p.y, p.w, p.h);

          // Veteado cálido de la madera
          ctx.fillStyle = '#a16207';
          ctx.fillRect(p.x + 2, p.y + 3, p.w - 4, p.h * 0.35);

          ctx.strokeStyle = '#28311b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(p.x, p.y, p.w, p.h);

          // Clavos de hierro forjado y junturas de tablones
          ctx.strokeStyle = '#3b1e08';
          ctx.lineWidth = 1.5;
          for (let bx = p.x + 26; bx < p.x + p.w - 12; bx += 30) {
            ctx.beginPath();
            ctx.moveTo(bx, p.y);
            ctx.lineTo(bx, p.y + p.h);
            ctx.stroke();

            // Cabezas de clavos
            ctx.fillStyle = '#334155';
            ctx.fillRect(bx - 5, p.y + 4, 2.5, 2.5);
            ctx.fillRect(bx - 5, p.y + p.h - 6, 2.5, 2.5);
          }

          // Farol rústico colgante con halo cálido de luz en plataformas seleccionadas
          if (p.lantern) {
            const lx = p.x + p.w - 8;
            const ly = p.y + p.h + 12;

            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(lx, p.y + p.h);
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

      // Dibujar charcos de barro viscoso con burbujas y cartel de peligro
      for (const m of this.mudPuddles) {
        ctx.fillStyle = '#201205';
        ctx.beginPath();
        ctx.ellipse(m.x + m.w / 2, m.y + m.h / 2, m.w / 2, m.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#3a210d';
        ctx.beginPath();
        ctx.ellipse(m.x + m.w / 2, m.y + m.h / 2 + 1, m.w * 0.38, m.h * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();

        // Burbujas de lodo viscoso animadas
        const b1Y = m.y + Math.sin(this.animTime * 5 + m.x) * 3;
        const b2Y = m.y + Math.sin(this.animTime * 4.5 + m.x * 2) * 2.5;
        ctx.fillStyle = '#543217';
        ctx.beginPath();
        ctx.arc(m.x + m.w * 0.32, b1Y, 4, 0, Math.PI * 2);
        ctx.arc(m.x + m.w * 0.68, b2Y, 3, 0, Math.PI * 2);
        ctx.fill();

        // Estaca con cartel de precaución
        ctx.font = '15px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚠️', m.x + m.w / 2, m.y - 7);
      }

      // Dibujar zarzas espinosas de campo
      for (const z of this.thorns) {
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🌵', z.x + z.w / 2, z.y + z.h - 2);
      }

      // Dibujar trampolines de heno elásticos (los únicos impulsores hacia arriba)
      for (const t of this.trampolines) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(t.x + 4, t.y + 8, t.w - 8, t.h - 8);
        ctx.strokeStyle = '#28311b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(t.x + 4, t.y + 8, t.w - 8, t.h - 8);

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

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(t.x + t.w / 2 - 8, t.y + 1, 16, 5);

        ctx.font = 'bold 9px "Space Mono", monospace';
        ctx.fillStyle = '#166534';
        ctx.textAlign = 'center';
        ctx.fillText('▲ SALTO', t.x + t.w / 2, t.y - 6);
      }

      // Dibujar Pergaminos Dorados de Quiz con halo celestial
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
          ctx.fillStyle = '#78350f';
          ctx.fillText('PISTA QUIZ', scroll.x, hoverY - 22);
        }
      }

      // Dibujar items nutritivos y estrellas
      for (const item of this.items) {
        if (!item.taken) {
          const hoverY = item.y + Math.sin(this.animTime * 4 + item.x) * 4.5;
          ctx.font = (item.emoji === '⭐') ? '28px Arial' : '25px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item.emoji, item.x, hoverY);

          ctx.fillStyle = 'rgba(255, 216, 61, 0.35)';
          ctx.beginPath();
          ctx.arc(item.x, hoverY, 14, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Dibujar partículas
      for (const pt of this.particles) {
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      // Dibujar textos flotantes
      ctx.font = 'bold 15px "Space Mono", monospace';
      ctx.textAlign = 'center';
      for (const ft of this.floatingTexts) {
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillText(ft.text, ft.x, ft.y);
      }
      ctx.globalAlpha = 1.0;

      // Dibujar Granero de Meta B-13 estilo Deluxe Stardew
      this.drawGoal(ctx);

      // Dibujar Jugador
      this.drawPlayer(ctx);

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
      ctx.rotate(this.animTime * 1.6);
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

      // Cuerpo principal del Granero Rojo B-13 (Robin's Deluxe Barn)
      ctx.fillStyle = '#8b261e';
      ctx.fillRect(g.x, g.y, g.w, g.h);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 3;
      ctx.strokeRect(g.x, g.y, g.w, g.h);

      // Tablones horizontales de revestimiento
      ctx.strokeStyle = '#681b14';
      ctx.lineWidth = 1.5;
      for (let ly = g.y + 14; ly < g.y + g.h; ly += 14) {
        ctx.beginPath();
        ctx.moveTo(g.x, ly);
        ctx.lineTo(g.x + g.w, ly);
        ctx.stroke();
      }

      // Molduras esquineras blancas de granero
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(g.x, g.y, 8, g.h);
      ctx.fillRect(g.x + g.w - 8, g.y, 8, g.h);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2;
      ctx.strokeRect(g.x, g.y, 8, g.h);
      ctx.strokeRect(g.x + g.w - 8, g.y, 8, g.h);

      // Puertas dobles centrales con clásica X blanca
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

      // Ventana circular del pajar con luz dorada
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(g.x + g.w / 2, g.y + 44, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Heno que cuelga de la ventana del pajar
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      for (let hx = -10; hx <= 10; hx += 5) {
        ctx.beginPath();
        ctx.moveTo(g.x + g.w / 2 + hx, g.y + 58);
        ctx.lineTo(g.x + g.w / 2 + hx + ((hx % 2 === 0) ? 3 : -3), g.y + 68);
        ctx.stroke();
      }

      // Techo campestre a dos aguas con alero
      ctx.fillStyle = '#551511';
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

      // Mástil y Bandera ondeante de Meta
      const flagWave = Math.sin(this.animTime * 6) * 4;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(g.x + g.w / 2 - 2, g.y - 115, 4, 45);

      ctx.font = '28px Arial';
      ctx.fillText('🏁', g.x + g.w / 2 + 18, g.y - 114 + flagWave);

      // Cartel de madera tallada: "GRANERO B-13"
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

      // Parpadeo durante tiempo de invulnerabilidad tras ser dañado
      if (p.invulnerableTime > 0) {
        if (Math.floor(this.animTime * 14) % 2 === 0) {
          ctx.globalAlpha = 0.35;
        }
      }

      // Volteo horizontal según dirección
      if (p.facing < 0) ctx.scale(-1, 1);

      // Deformación física suave: squash al caer, stretch al saltar
      let sx = 1 + p.landSquash;
      let sy = 1 - p.landSquash;

      if (!p.grounded) {
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
      }

      ctx.scale(sx, sy);

      // Sombra proyectada en la plataforma
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

      // Accesorio oficial posicionado sobre la cabeza
      if (p.accEmoji) {
        ctx.font = '18px Arial';
        ctx.fillText(p.accEmoji, 0, -20);
      }

      ctx.restore();
    },

    updateHud() {
      const scoreEl = document.getElementById('platScoreVal');
      const livesEl = document.getElementById('platLivesVal');
      const timeEl = document.getElementById('platTimeVal');
      if (scoreEl) scoreEl.textContent = this.score;
      if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives));
      if (timeEl) {
        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  };

  /* Función para refrescar el puntaje oficial de quizzes en el scorebox general */
  function updateHeaderScore() {
    const scoreEl = document.getElementById('score');
    if (scoreEl) {
      const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : ((typeof state !== 'undefined' && state.pureScore) ? state.pureScore : 0);
      scoreEl.textContent = purePts;
    }
  }
  window.updateHeaderScore = updateHeaderScore;

  // Inicializar todos los minijuegos al cargar el DOM
  document.addEventListener('DOMContentLoaded', () => {
    updateHeaderScore();
    initGameTabs();
    MemoryGame.start();
    WordSearchGame.start();
    PlatformerGame.start();

    const memResetBtn = document.getElementById('memResetBtn');
    if (memResetBtn) memResetBtn.addEventListener('click', () => MemoryGame.showStartScreen());

    const wsResetBtn = document.getElementById('wsResetBtn');
    if (wsResetBtn) wsResetBtn.addEventListener('click', () => WordSearchGame.showStartScreen());

    const platResetBtn = document.getElementById('platResetBtn');
    if (platResetBtn) platResetBtn.addEventListener('click', () => PlatformerGame.showStartScreen());
  });

})();
