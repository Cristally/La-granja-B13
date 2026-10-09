/*
  app.js — Lógica específica del Potrero (index.html):
  - 5 especies reales de la granja del Liceo B-13 (Gallo, Gallina, Conejo, Catita, Agapornis).
  - Ciclo Día / Noche: Luna, estrellas dinámicas, animales durmiendo con burbujas "💤".
  - Pradera enriquecida con flores silvestres, setas y arbustos.
*/

const POTRERO_ANIMALS = ANIMALS.filter(a => POTRERO_IDS.includes(a.id));
const sprites = {};
let isNightMode = false;

// Ajuste vertical frontal y visible de cada especie para que se vean de inmediato en cualquier pantalla
const DEFAULT_Y_POSITIONS = {
  gallo: 12,
  gallina: 34,
  conejo: 58,
  catita: 82,
  agapornis: 106
};

/* ============ Escenario ============ */

const stage = document.getElementById('stage');
const fence = document.getElementById('fence');
if (fence) {
  fence.innerHTML = '';
  for (let i = 0; i < 22; i++) { fence.innerHTML += '<i></i>'; }
}

// Nubes esponjosas en el cielo
if (stage) {
  for (let i = 0; i < 3; i++) {
    const c = document.createElement('div');
    c.className = 'cloud';
    const w = 48 + Math.random() * 45, h = w * 0.45;
    c.style.width = w + 'px'; c.style.height = h + 'px';
    c.style.top = (8 + i * 18) + 'px';
    c.style.left = (5 + i * 32) + '%';
    c.style.animationDelay = (i * -12) + 's';
    stage.appendChild(c);
  }

  // Flores silvestres, setas y arbustos en el pasto
  const wf = document.getElementById('wildflowers');
  if (wf) {
    const flora = ['🌼', '🌸', '🌻', '🌿', '🌱', '🌾', '🍄', '🌼', '🌺', '🌿', '🌸', '🍄', '🌱', '🌾', '🌻', '🌼', '🌿'];
    for (let i = 0; i < flora.length; i++) {
      const fl = document.createElement('span');
      fl.className = 'flower';
      fl.textContent = flora[i];
      fl.style.left = (4 + Math.random() * 90) + '%';
      fl.style.bottom = (8 + Math.random() * 140) + 'px';
      fl.style.fontSize = (0.75 + Math.random() * 0.35) + 'rem';
      fl.style.opacity = (0.75 + Math.random() * 0.25);
      wf.appendChild(fl);
    }
  }
}

function applyCustomizations() {
  POTRERO_ANIMALS.forEach(a => {
    const c = state.custom[a.id];
    if (c) {
      if (c.name) a.name = c.name;
      if (c.color) a.color = c.color;
      if (c.accessory) a.accessory = c.accessory;
    }
  });
}
applyCustomizations();

if (stage) {
  const stageW = Math.max(280, stage.clientWidth || 340);
  const animalW = 68;
  const availW = Math.max(140, stageW - animalW - 16);

  POTRERO_ANIMALS.forEach((a, idx) => {
    const el = document.createElement('div');
    el.className = 'animal bob';
    const yPos = DEFAULT_Y_POSITIONS[a.id] !== undefined ? DEFAULT_Y_POSITIONS[a.id] : (a.y || 20);
    el.style.bottom = yPos + 'px';
    el.innerHTML = `
      <div class="sprite">
        ${a.emoji}
        <span class="accessory"></span>
      </div>
      <div class="tag"></div>
    `;
    
    el.addEventListener('click', () => {
      showSpeechBubble(a.id);
      openCard(a.id);
    });
    el.addEventListener('mouseenter', () => { a.hovered = true; });
    el.addEventListener('mouseleave', () => { a.hovered = false; });
    el.addEventListener('touchstart', () => { a.hovered = true; }, { passive: true });
    el.addEventListener('touchend', () => { setTimeout(() => { a.hovered = false; }, 300); }, { passive: true });
    el.addEventListener('touchcancel', () => { a.hovered = false; }, { passive: true });
    
    stage.appendChild(el);
    sprites[a.id] = el;

    // Distribuir uniformemente a lo ancho de la pantalla para que TODOS sean visibles de inmediato
    const initialFraction = (idx + 0.5) / POTRERO_ANIMALS.length;
    a.x = 8 + initialFraction * availW;
    a.targetX = 8 + Math.random() * availW;
    a.speed = 0.22 + Math.random() * 0.22;
    el.style.left = a.x + 'px';
  });
}

function showSpeechBubble(animalId, customText) {
  const el = sprites[animalId];
  if (!el || isNightMode) return;

  const oldBubble = el.querySelector('.animal-speech-bubble');
  if (oldBubble) oldBubble.remove();

  const hints = (typeof CURIOSITIES !== 'undefined' && CURIOSITIES[animalId]) ? CURIOSITIES[animalId] : [];
  const text = customText || (hints.length > 0 ? hints[Math.floor(Math.random() * hints.length)] : '¡Ven a descubrir mis secretos de campo!');

  const bubble = document.createElement('div');
  bubble.className = 'animal-speech-bubble';
  bubble.innerHTML = `
    <div class="bubble-header">💡 Dato de Campo:</div>
    <div class="bubble-body">${text}</div>
  `;

  bubble.addEventListener('click', (e) => {
    e.stopPropagation();
    openCard(animalId);
  });

  el.appendChild(bubble);

  clearTimeout(el._bubbleTimer);
  el._bubbleTimer = setTimeout(() => {
    bubble.classList.add('fade-out');
    setTimeout(() => bubble.remove(), 400);
  }, 4800);
}
window.showSpeechBubble = showSpeechBubble;

function speakRandomCuriosity() {
  if (isNightMode || !stage) return;
  const overlayOpen = document.querySelector('.overlay.open');
  if (overlayOpen) return;

  const wakingAnimals = POTRERO_ANIMALS.filter(a => !a.paused);
  if (wakingAnimals.length === 0) return;
  const chosen = wakingAnimals[Math.floor(Math.random() * wakingAnimals.length)];
  showSpeechBubble(chosen.id);
}
setInterval(speakRandomCuriosity, 8500);

function refreshSprite(a) {
  const el = sprites[a.id];
  if (!el) return;
  const tag = el.querySelector('.tag');
  if (tag) {
    tag.textContent = a.name;
    tag.style.borderColor = a.color;
    tag.style.color = a.color;
  }
  const accEmoji = (typeof getAnimalAccessoryEmoji === 'function')
    ? getAnimalAccessoryEmoji(a.id, a.accessory)
    : ((typeof ACCESSORIES !== 'undefined' ? ACCESSORIES.find(x => x.id === a.accessory)?.emoji : '') || '');
  const acc = el.querySelector('.accessory');
  if (acc) acc.textContent = accEmoji;
}
POTRERO_ANIMALS.forEach(refreshSprite);

/* ============ Ciclo Día / Noche ============ */

function spawnStars() {
  const starsLayer = document.getElementById('starsLayer');
  if (!starsLayer) return;
  starsLayer.innerHTML = '';
  const starSymbols = ['✨', '⭐', '✦', '⋆', '·', '✨', '✦'];
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    s.textContent = starSymbols[i % starSymbols.length];
    s.style.left = (3 + Math.random() * 92) + '%';
    s.style.top = (6 + Math.random() * 38) + '%';
    s.style.fontSize = (0.65 + Math.random() * 0.45) + 'rem';
    s.style.animationDelay = (Math.random() * 2.5) + 's';
    s.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';
    starsLayer.appendChild(s);
  }
}

function clearStars() {
  const starsLayer = document.getElementById('starsLayer');
  if (starsLayer) starsLayer.innerHTML = '';
}

function setNightMode(night) {
  isNightMode = !!night;
  if (!stage) return;

  stage.classList.toggle('night', isNightMode);

  const btn = document.getElementById('dayNightBtn');
  if (btn) {
    btn.textContent = isNightMode ? '☀️ Día' : '🌙 Noche';
    btn.title = isNightMode ? 'Cambiar a modo Día' : 'Cambiar a modo Noche';
  }

  if (isNightMode) {
    spawnStars();
    // Poner a los animales a descansar con burbuja zzz
    POTRERO_ANIMALS.forEach(a => {
      const el = sprites[a.id];
      if (el) {
        el.classList.add('sleeping');
        let bubble = el.querySelector('.sleep-bubble');
        if (!bubble) {
          bubble = document.createElement('span');
          bubble.className = 'sleep-bubble';
          bubble.textContent = '💤';
          el.querySelector('.sprite').appendChild(bubble);
        }
      }
    });
  } else {
    clearStars();
    // Despertar a los animales
    POTRERO_ANIMALS.forEach(a => {
      const el = sprites[a.id];
      if (el) {
        el.classList.remove('sleeping');
        const bubble = el.querySelector('.sleep-bubble');
        if (bubble) bubble.remove();
      }
    });
  }
}

const dayNightBtn = document.getElementById('dayNightBtn');
if (dayNightBtn) {
  dayNightBtn.addEventListener('click', () => {
    setNightMode(!isNightMode);
    if (isNightMode) {
      showToast('🌙 Ha caído la noche en La Granja B13: los animales están descansando 💤');
    } else {
      showToast('☀️ Ha amanecido: ¡los animales despiertan listos para aprender!');
    }
  });
}

function animate() {
  if (stage) {
    const w = stage.clientWidth;
    const minX = 8;
    const maxX = Math.max(minX + 60, w - 74);

    POTRERO_ANIMALS.forEach(a => {
      // De noche los animales descansan y no caminan
      if (isNightMode || a.paused || a.hovered) return;
      const dx = a.targetX - a.x;
      if (Math.abs(dx) < 3) {
        a.targetX = minX + Math.random() * (maxX - minX);
        a.pauseTimer = 18 + Math.random() * 45;
      }
      if (a.pauseTimer > 0) { a.pauseTimer--; return; }
      const dir = dx > 0 ? 1 : -1;
      a.x += dir * a.speed;

      // Mantener estrictamente dentro del marco visible
      if (a.x < minX) { a.x = minX; a.targetX = minX + Math.random() * (maxX - minX); }
      if (a.x > maxX) { a.x = maxX; a.targetX = minX + Math.random() * (maxX - minX); }

      const el = sprites[a.id];
      if (el) {
        el.style.left = a.x + 'px';
        el.classList.toggle('flip', dir < 0);
      }
    });
  }
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);

// Reajustar posiciones al girar el móvil o redimensionar pantalla
window.addEventListener('resize', () => {
  if (!stage) return;
  const w = stage.clientWidth;
  const minX = 8;
  const maxX = Math.max(minX + 60, w - 74);
  POTRERO_ANIMALS.forEach(a => {
    if (a.x > maxX) a.x = maxX;
    if (a.x < minX) a.x = minX;
    if (a.targetX > maxX) a.targetX = maxX;
    const el = sprites[a.id];
    if (el) el.style.left = a.x + 'px';
  });
});

/* ============ Ficha (usa el motor compartido de card.js) ============ */

function updateHeader() {
  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };
  if (sesion.rol === 'visita') {
    if (typeof Auth !== 'undefined' && typeof Auth.aplicarRestriccionesRol === 'function') {
      Auth.aplicarRestriccionesRol();
    }
    return;
  }
  const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : (state.pureScore || 0);
  const scoreEl = document.getElementById('score');
  const discEl = document.getElementById('discovered');

  // Contar estrictamente las especies que pertenecen al Potrero (0 a 5)
  const potreroFound = POTRERO_IDS.filter(id => {
    if (typeof discoveredSet !== 'undefined' && discoveredSet.has) return discoveredSet.has(id);
    if (state && Array.isArray(state.discovered)) return state.discovered.includes(id);
    return false;
  }).length;

  if (scoreEl) scoreEl.textContent = purePts;
  if (discEl) discEl.textContent = potreroFound;

  if (typeof Auth !== 'undefined' && typeof Auth.aplicarRestriccionesRol === 'function') {
    Auth.aplicarRestriccionesRol();
  }
}

function openCard(id) {
  const a = POTRERO_ANIMALS.find(x => x.id === id);
  if (!a) return;
  a.paused = true;
  a.hovered = false;
  openFichaOverlay(a, {
    onClose: () => {
      a.paused = false;
      a.hovered = false;
    }
  });
}

/* ============ Inicio ============ */

updateHeader();

/* ============ Video Introductorio de Estudiantes ============ */

function initIntroVideo() {
  const video = document.getElementById('introFarmVideo');
  const playOverlay = document.getElementById('introVideoPlayOverlay');
  const ctaBtn = document.getElementById('introCtaPlayBtn');
  const ctaText = document.getElementById('introCtaPlayBtnText');
  const fullscreenBtn = document.getElementById('introVideoFullscreenBtn');
  const scrollPotreroBtn = document.getElementById('btnScrollPotrero');
  const introCard = document.getElementById('introVideoCard');

  if (!video) return;

  function updatePlayState(isPlaying) {
    if (playOverlay) {
      if (isPlaying) {
        playOverlay.classList.add('overlay-hidden');
      } else {
        playOverlay.classList.remove('overlay-hidden');
      }
    }
    if (ctaText) {
      if (isPlaying) {
        ctaText.textContent = '⏸ Pausar Video';
      } else if (video.currentTime > 0 && !video.ended) {
        ctaText.textContent = '▶ Continuar Video';
      } else {
        ctaText.textContent = '▶ Ver Video de Experiencias';
      }
    }
  }

  function togglePlayVideo() {
    if (video.paused || video.ended) {
      video.play().then(() => {
        updatePlayState(true);
      }).catch(err => {
        console.warn('Reproducción de video diferida:', err);
      });
    } else {
      video.pause();
      updatePlayState(false);
    }
  }

  if (playOverlay) {
    playOverlay.addEventListener('click', () => {
      togglePlayVideo();
    });
  }

  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      const rect = video.getBoundingClientRect();
      if (rect.top < 0 || rect.bottom > window.innerHeight) {
        video.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      togglePlayVideo();
    });
  }

  video.addEventListener('play', () => updatePlayState(true));
  video.addEventListener('pause', () => updatePlayState(false));
  video.addEventListener('ended', () => {
    updatePlayState(false);
    if (ctaText) ctaText.textContent = '▶ Repetir Video de Experiencias';
  });

  if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        } else if (introCard && introCard.requestFullscreen) {
          introCard.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    });
  }

  // Bloquear menú contextual de clic derecho para impedir descarga directa
  video.addEventListener('contextmenu', (e) => e.preventDefault());
  const videoWrapper = video.closest('.intro-video-wrapper') || video.parentElement;
  if (videoWrapper) {
    videoWrapper.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  if (scrollPotreroBtn) {
    scrollPotreroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const potrero = document.getElementById('potreroSection') || document.getElementById('stage');
      if (potrero) {
        potrero.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initIntroVideo);
} else {
  initIntroVideo();
}
