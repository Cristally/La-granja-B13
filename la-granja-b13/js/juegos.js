/*
  juegos.js — Motores de minijuegos educativos para La Granja B-13
  1. Busca las Parejas (Memoria de Curiosidades ↔ Animales)
  2. Sopa de Letras Zootécnica y Comunitaria
  3. Aventura en la Granja (Plataformas 2D con animal personalizado)
*/

(function() {
  'use strict';

  // Sonidos sintetizados por Web Audio API para máxima compatibilidad sin latencia
  const AudioFX = {
    ctx: null,
    init() {
      if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      }
    },
    playTone(freq, type, duration, delay = 0) {
      this.init();
      if (!this.ctx) return;
      setTimeout(() => {
        try {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
          gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start();
          osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
      }, delay);
    },
    flip() { this.playTone(320, 'sine', 0.08); },
    match() {
      this.playTone(523.25, 'triangle', 0.12, 0);
      this.playTone(659.25, 'triangle', 0.15, 100);
      this.playTone(783.99, 'triangle', 0.22, 200);
    },
    wrong() {
      this.playTone(220, 'sawtooth', 0.15, 0);
      this.playTone(180, 'sawtooth', 0.2, 100);
    },
    jump() { this.playTone(420, 'square', 0.12); },
    coin() {
      this.playTone(880, 'sine', 0.08, 0);
      this.playTone(1320, 'sine', 0.14, 70);
    },
    win() {
      [523, 659, 783, 1046].forEach((f, i) => this.playTone(f, 'triangle', 0.25, i * 120));
    }
  };

  /* Helper para modal de victoria enriquecido */
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

    if (iconEl) iconEl.textContent = icon || '🏆';
    if (titleEl) titleEl.textContent = title || '¡Felicitaciones!';
    if (subEl) subEl.textContent = subtitle || 'Desafío Recreativo Superado';
    if (msgEl) msgEl.textContent = msg || '';
    if (statsEl) statsEl.innerHTML = stats || '';
    if (stampEl) stampEl.textContent = stamp || 'MISIÓN CUMPLIDA';

    if (restartBtn) {
      restartBtn.onclick = () => {
        overlay.classList.remove('open');
        if (typeof onRestart === 'function') onRestart();
      };
    }

    overlay.classList.add('open');
  }

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

        tab.classList.add('active');
        const targetId = tab.dataset.game;
        const panel = document.getElementById(targetId);
        if (panel) {
          panel.classList.add('active');
          if (targetId === 'game-memory' && !MemoryGame.initialized) MemoryGame.start();
          if (targetId === 'game-wordsearch' && !WordSearchGame.initialized) WordSearchGame.start();
          if (targetId === 'game-platformer' && !PlatformerGame.initialized) PlatformerGame.start();
        }
      });
    });
  }

  /* ============================================================
     JUEGO 1: BUSCA LAS PAREJAS (MEMORIA CURIOSIDAD ↔ ANIMAL)
     ============================================================ */
  const MemoryGame = {
    initialized: false,
    pairsData: [
      { id: 'conejo', name: 'Conejo', emoji: '🐰', fact: 'Sus incisivos crecen durante toda la vida y practica cecotrofia.' },
      { id: 'gallo', name: 'Gallo', emoji: '🐓', fact: 'Cresta vascularizada que disipa calor y canto por reloj circadiano.' },
      { id: 'gallina', name: 'Gallina', emoji: '🐔', fact: 'Ave social que toma baños de tierra y emite más de 24 vocalizaciones.' },
      { id: 'pato', name: 'Pato', emoji: '🦆', fact: 'Plumaje impermeable gracias a la glándula uropígea y patas palmeadas.' },
      { id: 'agapornis', name: 'Agapornis', emoji: '🦜', fact: 'Llamados inseparables porque forman lazos afectivos monógamos de por vida.' },
      { id: 'catita', name: 'Catita', emoji: '🐦', fact: 'Originaria de Australia, consume semillas de mijo y brotes tiernos.' }
    ],
    cards: [],
    flippedCards: [],
    matchedCount: 0,
    moves: 0,
    timerSeconds: 0,
    timerInterval: null,

    start() {
      this.initialized = true;
      this.reset();
    },

    reset() {
      clearInterval(this.timerInterval);
      this.flippedCards = [];
      this.matchedCount = 0;
      this.moves = 0;
      this.timerSeconds = 0;
      this.updateStats();

      // Construir baraja de 12 cartas (6 animales y 6 curiosidades)
      const deck = [];
      this.pairsData.forEach(p => {
        // Carta A: Animal
        deck.push({ pairId: p.id, type: 'animal', name: p.name, emoji: p.emoji });
        // Carta B: Curiosidad
        deck.push({ pairId: p.id, type: 'curiosity', text: p.fact });
      });

      // Barajar aleatoriamente (Fisher-Yates)
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }

      this.cards = deck;
      this.render();

      this.timerInterval = setInterval(() => {
        this.timerSeconds++;
        this.updateStats();
      }, 1000);
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
              <div class="card-curiosity-tag">💡 Curiosidad de Campo:</div>
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
      if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;
      if (this.flippedCards.length >= 2) return;

      AudioFX.flip();
      cardEl.classList.add('flipped');
      this.flippedCards.push({ el: cardEl, data: this.cards[idx] });

      if (this.flippedCards.length === 2) {
        this.moves++;
        this.updateStats();

        const [c1, c2] = this.flippedCards;
        // Comprobar coincidencia: mismo animal y tipos distintos (uno animal y otro curiosidad)
        if (c1.data.pairId === c2.data.pairId && c1.data.type !== c2.data.type) {
          AudioFX.match();
          setTimeout(() => {
            c1.el.classList.add('matched');
            c2.el.classList.add('matched');
            this.flippedCards = [];
            this.matchedCount++;
            this.updateStats();

            if (this.matchedCount === this.pairsData.length) {
              clearInterval(this.timerInterval);
              AudioFX.win();
              setTimeout(() => {
                showGameVictory({
                  icon: '🧠✨',
                  title: '¡Memoria Zootécnica Completada!',
                  subtitle: 'Curiosidades y Animales de La Granja B-13',
                  stamp: 'EXCELENCIA BIOLÓGICA',
                  msg: 'Has emparejado correctamente cada curiosidad científica y de campo con su correspondiente especie animal del liceo.',
                  stats: `⏱️ <b>Tiempo empleado:</b> ${this.timerSeconds}s &nbsp;|&nbsp; 🔄 <b>Intentos realizados:</b> ${this.moves} movimientos`,
                  onRestart: () => this.reset()
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
      if (matchesEl) matchesEl.textContent = `${this.matchedCount}/${this.pairsData.length}`;
      if (timeEl) {
        const mins = Math.floor(this.timerSeconds / 60);
        const secs = this.timerSeconds % 60;
        timeEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
  };

  /* ============================================================
     JUEGO 2: SOPA DE LETRAS ZOOTÉCNICA
     ============================================================ */
  const WordSearchGame = {
    initialized: false,
    size: 12,
    words: [
      { word: 'CECOTROFIA', desc: 'Heces blandas ricas en nutrientes que el conejo vuelve a ingerir.' },
      { word: 'MOLLEJA', desc: 'Estómago muscular de las aves que tritura granos con piedrecillas.' },
      { word: 'CRESTA', desc: 'Estructura carnosa en la cabeza del gallo para disipar calor.' },
      { word: 'HENO', desc: 'Alimento fibroso vital para el desgaste de los dientes de los conejos.' },
      { word: 'INCUBACION', desc: 'Período de calor de 21 días para el desarrollo del pollito.' },
      { word: 'AGAPORNIS', desc: 'Aves inseparables del aviario que forman lazos monógamos.' },
      { word: 'PATOS', desc: 'Aves acuáticas con patas palmeadas y pico aplanado.' },
      { word: 'FORRAJE', desc: 'Pasto fresco y vegetales nutritivos para los corrales.' },
      { word: 'BIENESTAR', desc: 'Salud, espacio limpio y respeto hacia los animales.' },
      { word: 'GALLINERO', desc: 'Espacio seco y ventilado donde duermen las gallinas.' }
    ],
    grid: [],
    foundWords: new Set(),
    startCell: null,
    isSelecting: false,

    start() {
      this.initialized = true;
      this.generateGrid();
      this.render();
    },

    generateGrid() {
      this.foundWords.clear();
      this.grid = Array(this.size).fill(null).map(() => Array(this.size).fill(''));

      // Intentar colocar cada palabra en horizontal, vertical o diagonal
      this.words.forEach(wObj => {
        const word = wObj.word;
        let placed = false;
        let attempts = 0;

        while (!placed && attempts < 100) {
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

        this.updateProgress();

        if (this.foundWords.size === this.words.length) {
          AudioFX.win();
          setTimeout(() => {
            showGameVictory({
              icon: '🔍📜',
              title: '¡Sopa de Letras Agroecológica Superada!',
              subtitle: 'Vocabulario y Bienestar Animal Liceo B-13',
              stamp: 'ZOOTECNIA COMUNITARIA',
              msg: 'Encontraste los 10 conceptos fundamentales de nutrición, anatomía, manejo avícola y compromiso sustentable de la granja escolar.',
              stats: `🎯 <b>Palabras identificadas:</b> ${this.words.length}/${this.words.length} conceptos zootécnicos clave`,
              onRestart: () => this.start()
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
    }
  };

  /* ============================================================
     JUEGO 3: PLATAFORMAS 2D (AVENTURA EN LA GRANJA B-13)
     ============================================================ */
  const PlatformerGame = {
    initialized: false,
    canvas: null,
    ctx: null,
    reqId: null,
    score: 0,
    lives: 3,
    keys: { left: false, right: false, jump: false },
    player: {
      x: 60,
      y: 280,
      w: 36,
      h: 36,
      vx: 0,
      vy: 0,
      speed: 4.8,
      jumpStrength: 12.8,
      grounded: false,
      emoji: '🐰',
      accEmoji: ''
    },
    cameraX: 0,
    worldWidth: 3200,
    platforms: [],
    items: [],
    goal: { x: 3000, y: 220, w: 80, h: 100 },

    start() {
      this.initialized = true;
      this.canvas = document.getElementById('platformerCanvas');
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');

      this.setupControls();
      this.reset();
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

      // Botones táctiles móviles
      const btnLeft = document.getElementById('touchBtnLeft');
      const btnRight = document.getElementById('touchBtnRight');
      const btnJump = document.getElementById('touchBtnJump');

      if (btnLeft) {
        btnLeft.onpointerdown = () => { this.keys.left = true; };
        btnLeft.onpointerup = () => { this.keys.left = false; };
      }
      if (btnRight) {
        btnRight.onpointerdown = () => { this.keys.right = true; };
        btnRight.onpointerup = () => { this.keys.right = false; };
      }
      if (btnJump) {
        btnJump.onpointerdown = () => { this.keys.jump = true; };
        btnJump.onpointerup = () => { this.keys.jump = false; };
      }
    },

    reset() {
      cancelAnimationFrame(this.reqId);
      this.score = 0;
      this.lives = 3;
      this.cameraX = 0;

      // Cargar personalización del estudiante activo
      if (typeof state !== 'undefined') {
        this.player.emoji = state.avatarIcon || '🐰';
        const acc = state.custom && state.custom.conejo ? state.custom.conejo.accessory : 'none';
        if (typeof ACCESSORIES !== 'undefined') {
          this.player.accEmoji = ACCESSORIES.find(x => x.id === acc)?.emoji || '';
        }
      }
      const charEl = document.getElementById('charPreviewIcon');
      if (charEl) {
        charEl.innerHTML = `${this.player.emoji}${this.player.accEmoji ? ` <span style="font-size:1.1rem;">${this.player.accEmoji}</span>` : ''}`;
      }

      this.player.x = 60;
      this.player.y = 280;
      this.player.vx = 0;
      this.player.vy = 0;
      this.player.grounded = false;

      // Crear nivel de la granja (plataformas de pasto, fardos y cercas)
      this.platforms = [
        // Suelo principal continuo
        { x: 0, y: 340, w: 3200, h: 60, type: 'ground' },
        // Fardos de paja
        { x: 260, y: 280, w: 90, h: 60, type: 'straw' },
        { x: 420, y: 230, w: 100, h: 40, type: 'straw' },
        { x: 650, y: 260, w: 120, h: 30, type: 'wood' },
        { x: 860, y: 200, w: 140, h: 30, type: 'wood' },
        { x: 1100, y: 250, w: 100, h: 50, type: 'straw' },
        { x: 1300, y: 190, w: 130, h: 30, type: 'wood' },
        { x: 1550, y: 230, w: 110, h: 40, type: 'straw' },
        { x: 1800, y: 170, w: 140, h: 30, type: 'wood' },
        { x: 2100, y: 220, w: 120, h: 40, type: 'straw' },
        { x: 2350, y: 180, w: 150, h: 30, type: 'wood' },
        { x: 2650, y: 230, w: 120, h: 40, type: 'straw' }
      ];

      // Alimentos recolectables en el recorrido
      this.items = [
        { x: 280, y: 240, type: 'carrot', emoji: '🥕', val: 10, taken: false },
        { x: 450, y: 190, type: 'corn', emoji: '🌽', val: 10, taken: false },
        { x: 700, y: 220, type: 'wheat', emoji: '🌾', val: 10, taken: false },
        { x: 920, y: 160, type: 'star', emoji: '⭐', val: 50, taken: false },
        { x: 1130, y: 210, type: 'carrot', emoji: '🥕', val: 10, taken: false },
        { x: 1350, y: 150, type: 'corn', emoji: '🌽', val: 10, taken: false },
        { x: 1600, y: 190, type: 'wheat', emoji: '🌾', val: 10, taken: false },
        { x: 1850, y: 130, type: 'star', emoji: '⭐', val: 50, taken: false },
        { x: 2130, y: 180, type: 'carrot', emoji: '🥕', val: 10, taken: false },
        { x: 2400, y: 140, type: 'corn', emoji: '🌽', val: 10, taken: false },
        { x: 2700, y: 190, type: 'star', emoji: '⭐', val: 50, taken: false }
      ];

      this.updateHud();
      this.loop();
    },

    loop() {
      this.update();
      this.draw();
      this.reqId = requestAnimationFrame(() => this.loop());
    },

    update() {
      // Movimiento horizontal
      if (this.keys.left) this.player.vx = -this.player.speed;
      else if (this.keys.right) this.player.vx = this.player.speed;
      else this.player.vx *= 0.75;

      // Salto
      if (this.keys.jump && this.player.grounded) {
        AudioFX.jump();
        this.player.vy = -this.player.jumpStrength;
        this.player.grounded = false;
      }

      // Gravedad
      this.player.vy += 0.58;
      if (this.player.vy > 14) this.player.vy = 14;

      this.player.x += this.player.vx;
      this.player.y += this.player.vy;

      // Límites del mundo
      if (this.player.x < 0) this.player.x = 0;
      if (this.player.x > this.worldWidth - this.player.w) this.player.x = this.worldWidth - this.player.w;

      // Colisiones con plataformas
      this.player.grounded = false;
      for (const p of this.platforms) {
        if (
          this.player.x + this.player.w > p.x &&
          this.player.x < p.x + p.w &&
          this.player.y + this.player.h >= p.y &&
          this.player.y + this.player.h <= p.y + p.h + 12 &&
          this.player.vy >= 0
        ) {
          this.player.y = p.y - this.player.h;
          this.player.vy = 0;
          this.player.grounded = true;
        }
      }

      // Caída fuera del mundo
      if (this.player.y > 420) {
        this.lives--;
        this.updateHud();
        if (this.lives <= 0) {
          cancelAnimationFrame(this.reqId);
          AudioFX.wrong();
          setTimeout(() => {
            showGameVictory({
              icon: '🐾🌱',
              title: '¡Ánimo en el Potrero!',
              subtitle: 'Recorrido Interrumpido',
              stamp: 'INTÉNTALO OTRA VEZ',
              msg: 'Tu animalito se agotó al saltar entre los fardos. ¡Vuelve a intentarlo para llegar al Granero B-13!',
              stats: `⭐ <b>Puntaje alcanzado:</b> ${this.score} pts`,
              onRestart: () => this.reset()
            });
          }, 150);
          return;
        } else {
          this.player.x = Math.max(60, this.player.x - 300);
          this.player.y = 200;
          this.player.vy = 0;
        }
      }

      // Recolección de items
      for (const item of this.items) {
        if (!item.taken) {
          const dist = Math.hypot((this.player.x + 18) - item.x, (this.player.y + 18) - item.y);
          if (dist < 32) {
            AudioFX.coin();
            item.taken = true;
            this.score += item.val;
            this.updateHud();
          }
        }
      }

      // Llegada a la meta (Granero B-13)
      if (this.player.x >= this.goal.x - 20) {
        cancelAnimationFrame(this.reqId);
        AudioFX.win();
        setTimeout(() => {
          showGameVictory({
            icon: '🏁🌾',
            title: '¡Llegaste al Granero B-13!',
            subtitle: 'Aventura de Campo Completada',
            stamp: 'MISIÓN CUMPLIDA',
            msg: '¡Tu animalito personalizado superó las plataformas, esquivó obstáculos y llevó las provisiones al granero escolar con gran agilidad!',
            stats: `⭐ <b>Puntaje alcanzado:</b> ${this.score} pts &nbsp;|&nbsp; ❤️ <b>Vidas restantes:</b> ${'❤️'.repeat(Math.max(1, this.lives))}`,
            onRestart: () => this.reset()
          });
        }, 200);
        return;
      }

      // Cámara suave
      this.cameraX = this.player.x - 280;
      if (this.cameraX < 0) this.cameraX = 0;
      if (this.cameraX > this.worldWidth - 860) this.cameraX = this.worldWidth - 860;
    },

    draw() {
      if (!this.ctx) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.save();
      ctx.translate(-this.cameraX, 0);

      // Fondo del cielo y colinas
      this.drawBackground(ctx);

      // Dibujar plataformas
      for (const p of this.platforms) {
        if (p.type === 'ground') {
          ctx.fillStyle = '#5c8446';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.fillStyle = '#3b5832';
          ctx.fillRect(p.x, p.y, p.w, 10);
        } else if (p.type === 'straw') {
          ctx.fillStyle = '#e8a838';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#28311b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(p.x, p.y, p.w, p.h);
        } else if (p.type === 'wood') {
          ctx.fillStyle = '#7d5838';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#28311b';
          ctx.lineWidth = 2;
          ctx.strokeRect(p.x, p.y, p.w, p.h);
        }
      }

      // Dibujar items recolectables
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      for (const item of this.items) {
        if (!item.taken) {
          ctx.fillText(item.emoji, item.x, item.y + 8);
        }
      }

      // Dibujar Granero de Meta
      this.drawGoal(ctx);

      // Dibujar Jugador (Animalito personalizado con accesorio)
      this.drawPlayer(ctx);

      ctx.restore();
    },

    drawBackground(ctx) {
      // Nubes
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (let i = 0; i < 10; i++) {
        const cx = i * 360 + 80;
        ctx.beginPath();
        ctx.arc(cx, 80, 30, 0, Math.PI * 2);
        ctx.arc(cx + 25, 70, 35, 0, Math.PI * 2);
        ctx.arc(cx + 50, 80, 28, 0, Math.PI * 2);
        ctx.fill();
      }
    },

    drawGoal(ctx) {
      const g = this.goal;
      // Granero Rojo
      ctx.fillStyle = '#944336';
      ctx.fillRect(g.x, g.y, g.w, g.h);
      ctx.strokeStyle = '#28311b';
      ctx.lineWidth = 3;
      ctx.strokeRect(g.x, g.y, g.w, g.h);

      // Techo
      ctx.fillStyle = '#551c14';
      ctx.beginPath();
      ctx.moveTo(g.x - 10, g.y);
      ctx.lineTo(g.x + g.w / 2, g.y - 35);
      ctx.lineTo(g.x + g.w + 10, g.y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bandera de meta
      ctx.font = '28px Arial';
      ctx.fillText('🏁', g.x + g.w / 2, g.y - 42);
    },

    drawPlayer(ctx) {
      const p = this.player;
      ctx.save();
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);

      if (p.vx < 0) ctx.scale(-1, 1);

      // Sprite del animal
      ctx.font = '34px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);

      // Accesorio flotante sobre la cabeza
      if (p.accEmoji) {
        ctx.font = '16px Arial';
        ctx.fillText(p.accEmoji, 0, -18);
      }

      ctx.restore();
    },

    updateHud() {
      const scoreEl = document.getElementById('platScoreVal');
      const livesEl = document.getElementById('platLivesVal');
      if (scoreEl) scoreEl.textContent = this.score;
      if (livesEl) livesEl.textContent = '❤️'.repeat(Math.max(0, this.lives));
    }
  };

  // Inicializar al cargar
  document.addEventListener('DOMContentLoaded', () => {
    initGameTabs();
    MemoryGame.start();

    const memResetBtn = document.getElementById('memResetBtn');
    if (memResetBtn) memResetBtn.addEventListener('click', () => MemoryGame.reset());

    const wsResetBtn = document.getElementById('wsResetBtn');
    if (wsResetBtn) wsResetBtn.addEventListener('click', () => WordSearchGame.start());

    const platResetBtn = document.getElementById('platResetBtn');
    if (platResetBtn) platResetBtn.addEventListener('click', () => PlatformerGame.reset());
  });

})();
