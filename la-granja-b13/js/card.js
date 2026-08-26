/*
  card.js — Motor compartido de la "ficha" (modal con pestañas Ficha /
  Personalizar / Quiz), las insignias, las normas, la sesión de estudiante
  y el panel docente.

  Usado tanto por index.html (Potrero) como por mapa.html (Mapa de la Granja).
*/

let discoveredSet = new Set(state.discovered);
let mapDiscoveredSet = new Set(state.mapDiscovered);
let currentOnClose = null;
let activeAnimal = null;

function getMapAnimals() {
  return (typeof MAP_ANIMALS !== 'undefined') ? MAP_ANIMALS : [];
}

/* ============ Utilidades de interfaz ============ */

function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.remove('show'), 2400);
}

function openOverlayId(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

function closeOverlayId(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

function spawnStarBurst(el) {
  if (!el) return;
  const star = document.createElement('span');
  star.className = 'star-burst';
  star.textContent = '✨';
  el.appendChild(star);
  setTimeout(() => star.remove(), 700);
}

function bounceSpriteIfPresent(id) {
  if (typeof sprites === 'undefined' || !sprites || !sprites[id]) return;
  const el = sprites[id];
  el.classList.remove('happy');
  void el.offsetWidth;
  el.classList.add('happy');
  setTimeout(() => el.classList.remove('happy'), 550);
}

/* ============ Gestión de Estudiante ============ */

function updateStudentUI() {
  const displayEl = document.getElementById('studentDisplayName');
  if (displayEl) {
    if (state.studentName && state.studentName.trim() !== '') {
      const gradeText = state.studentGrade ? ` (${state.studentGrade})` : '';
      displayEl.textContent = state.studentName + gradeText;
    } else {
      displayEl.textContent = '(Sin registrar — Toca para ingresar)';
    }
  }

  const nameInput = document.getElementById('studentNameInput');
  const gradeInput = document.getElementById('studentGradeInput');
  if (nameInput && state.studentName) nameInput.value = state.studentName;
  if (gradeInput && state.studentGrade) gradeInput.value = state.studentGrade;
}

function openStudentModal() {
  const nameInput = document.getElementById('studentNameInput');
  const gradeInput = document.getElementById('studentGradeInput');
  const errEl = document.getElementById('studentError');
  if (errEl) errEl.style.display = 'none';

  if (nameInput) nameInput.value = state.studentName || '';
  if (gradeInput) gradeInput.value = state.studentGrade || '';

  openOverlayId('studentOverlay');
  if (nameInput && typeof nameInput.focus === 'function') {
    setTimeout(() => nameInput.focus(), 100);
  }
}

/* ============ Validación y Registro de Estudiante ============ */

function sanitizeInput(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[<>'"&;]/g, '').trim();
}

function validateStudentName(name) {
  if (!name || name.trim().length < 3) {
    return { valid: false, msg: '⚠️ Por favor ingresa tu nombre y apellido (mínimo 3 letras).' };
  }
  // Rechazar números o teléfonos
  if (/\d/.test(name)) {
    return { valid: false, msg: '⚠️ El nombre no debe contener números ni dígitos de teléfono. Ingresa tu nombre real.' };
  }
  // Permitir letras latinas, tildes, ñ, diéresis y espacios
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s.'-]{3,40}$/;
  if (!nameRegex.test(name)) {
    return { valid: false, msg: '⚠️ Por favor ingresa un nombre y apellido válido (solo letras, ej: Yefrin González).' };
  }
  return { valid: true };
}

function validateStudentGrade(grade) {
  if (!grade || grade.trim().length < 2) {
    return { valid: false, msg: '⚠️ Por favor indica tu curso o nivel (ej: 3°F o 1° Medio).' };
  }
  const gradeRegex = /^[0-9a-zA-ZáéíóúÁÉÍÓÚñÑüÜ°\s\/\.-]{2,20}$/;
  if (!gradeRegex.test(grade)) {
    return { valid: false, msg: '⚠️ Ingresa un formato de curso válido (ej: 3°F o 2 Medio B).' };
  }
  return { valid: true };
}

function handleSaveStudent() {
  const nameInput = document.getElementById('studentNameInput');
  const gradeInput = document.getElementById('studentGradeInput');
  const errEl = document.getElementById('studentError');

  const rawName = nameInput ? nameInput.value : '';
  const rawGrade = gradeInput ? gradeInput.value : '';

  const cleanName = sanitizeInput(rawName);
  const cleanGrade = sanitizeInput(rawGrade);

  const nameVal = validateStudentName(cleanName);
  if (!nameVal.valid) {
    if (errEl) {
      errEl.textContent = nameVal.msg;
      errEl.style.display = 'block';
    }
    if (nameInput) {
      nameInput.focus();
      nameInput.classList.add('input-error');
    }
    return;
  }

  const gradeVal = validateStudentGrade(cleanGrade);
  if (!gradeVal.valid) {
    if (errEl) {
      errEl.textContent = gradeVal.msg;
      errEl.style.display = 'block';
    }
    if (gradeInput) {
      gradeInput.focus();
      gradeInput.classList.add('input-error');
    }
    return;
  }

  if (errEl) errEl.style.display = 'none';
  if (nameInput) nameInput.classList.remove('input-error');
  if (gradeInput) gradeInput.classList.remove('input-error');

  const ok = setActiveStudent(cleanName, cleanGrade);
  if (ok) {
    discoveredSet = new Set(state.discovered);
    mapDiscoveredSet = new Set(state.mapDiscovered);
    closeOverlayId('studentOverlay');
    updateStudentUI();
    if (typeof updateHeader === 'function') updateHeader();
    renderBadgesBar();
    showToast(`🎒 Cuaderno de Campo activado para ${cleanName}`);

    // Si había una ficha abierta en la pestaña de quiz, refrescar
    if (activeAnimal) {
      renderQuiz(activeAnimal);
    }
  }
}

/* ============ Insignias / logros ============ */

const BADGE_HINTS = {
  explorador: 'Requisito: Explora el Potrero y abre las fichas de los 5 animales (Gallo, Gallina, Conejo, Catita y Agapornis).',
  cuadernista: 'Requisito: Responde y completa el quiz de al menos 1 animal.',
  guardian: 'Requisito: Completa con éxito los quizzes de los 5 animales del Potrero.',
  precision: 'Requisito: Responde todas las preguntas de un quiz correctamente a la primera (100% de precisión).',
  zoologo: 'Requisito: Recorre el Mapa de la Granja y abre las fichas de los 10 animales reales.',
  veterinario: 'Requisito: Completa los quizzes de evaluación de los 10 animales del Mapa de la Granja.'
};

function renderAchievementsList() {
  const container = document.getElementById('achievementsList');
  if (!container) return;
  
  const earnedCount = BADGES.filter(b => state.badges.includes(b.id)).length;
  
  container.innerHTML = `
    <div style="font-size:0.85rem;font-weight:700;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;background:var(--paper-dark);padding:8px 12px;border-radius:6px;border:2px solid var(--ink);">
      <span>PROGRESO DE LOGROS:</span>
      <span style="color:var(--grass-dark);font-family:'Space Mono',monospace;font-size:0.95rem;">${earnedCount} / ${BADGES.length} Desbloqueados</span>
    </div>
    ${BADGES.map(b => {
      const isEarned = state.badges.includes(b.id);
      const hint = BADGE_HINTS[b.id] || 'Completa tareas en la granja para obtenerlo.';
      return `
        <div class="achievement-row${isEarned ? ' earned' : ''}">
          <div class="achievement-icon-box">${b.icon}</div>
          <div class="achievement-details">
            <div class="achievement-title">
              <span>${b.label}</span>
              <span class="achievement-status-tag">${isEarned ? '✅ OBTENIDO' : '🔒 PENDIENTE'}</span>
            </div>
            <div class="achievement-desc">${b.desc}</div>
            <div class="achievement-hint">💡 <b>Pista:</b> ${hint}</div>
          </div>
        </div>
      `;
    }).join('')}
  `;
}

function renderBadgesBar() {
  const box = document.getElementById('badgesBar');
  if (!box) return;
  box.innerHTML = BADGES.map(b => {
    const earned = state.badges.includes(b.id);
    return `
      <button type="button" class="badge${earned ? ' earned' : ''}" data-badge="${b.id}" title="${b.desc}">
        <span class="ic">${b.icon}</span>
        <span class="badge-label">${b.label}</span>
        ${earned ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
      </button>
    `;
  }).join('');

  box.querySelectorAll('.badge').forEach(btn => {
    btn.addEventListener('click', () => {
      renderAchievementsList();
      openOverlayId('achievementsOverlay');
    });
  });
}

function showBadgeInfoModal(b) {
  const isEarned = state.badges.includes(b.id);
  const iconEl = document.getElementById('badgeModalIcon');
  const titleEl = document.getElementById('badgeModalTitle');
  const statusEl = document.getElementById('badgeModalStatus');
  const stampEl = document.getElementById('badgeModalStamp');
  const descEl = document.getElementById('badgeModalDesc');
  const hintEl = document.getElementById('badgeModalHint');

  if (iconEl) iconEl.textContent = b.icon;
  if (titleEl) titleEl.textContent = b.label;
  if (statusEl) {
    statusEl.innerHTML = isEarned
      ? '<b style="color:var(--grass-dark);">🏆 ¡Logro Desbloqueado!</b>'
      : '<span style="color:var(--clay);">🔒 Por Desbloquear</span>';
  }
  if (stampEl) {
    stampEl.textContent = isEarned ? 'LOGRO OBTENIDO' : 'DESAFÍO DISPONIBLE';
    stampEl.style.borderColor = isEarned ? 'var(--grass-dark)' : 'var(--clay)';
    stampEl.style.color = isEarned ? 'var(--grass-dark)' : 'var(--clay)';
  }
  if (descEl) descEl.textContent = b.desc;
  if (hintEl) {
    const hint = BADGE_HINTS[b.id] || 'Completa desafíos en la granja para obtener este logro.';
    hintEl.innerHTML = `💡 <b>¿Cómo conseguirlo?</b><br>${hint}`;
  }

  openOverlayId('badgeOverlay');
}

function isPerfectQuiz(q, len) {
  if (!q || !q.completed || !Array.isArray(q.results)) return false;
  return q.results.length === len && q.results.every(r => r === true);
}

function checkBadges() {
  const newly = [];
  const mapAnimals = getMapAnimals();

  if (discoveredSet.size === ANIMALS.filter(a => POTRERO_IDS.includes(a.id)).length && !state.badges.includes('explorador')) newly.push('explorador');

  const anyCompleted = ANIMALS.some(a => state.quiz[a.id] && state.quiz[a.id].completed);
  if (anyCompleted && !state.badges.includes('cuadernista')) newly.push('cuadernista');

  const allCompleted = POTRERO_IDS.every(id => state.quiz[id] && state.quiz[id].completed);
  if (allCompleted && !state.badges.includes('guardian')) newly.push('guardian');

  if (mapAnimals.length > 0 && mapDiscoveredSet.size === mapAnimals.length && !state.badges.includes('zoologo')) newly.push('zoologo');

  const mapAllCompleted = mapAnimals.length > 0 && mapAnimals.every(a => state.mapQuiz[a.id] && state.mapQuiz[a.id].completed);
  if (mapAllCompleted && !state.badges.includes('veterinario')) newly.push('veterinario');

  const anyPerfect = ANIMALS.some(a => isPerfectQuiz(state.quiz[a.id], a.quiz.length)) ||
    mapAnimals.some(a => isPerfectQuiz(state.mapQuiz[a.id], a.quiz.length));
  if (anyPerfect && !state.badges.includes('precision')) newly.push('precision');

  newly.forEach(id => {
    state.badges.push(id);
    const b = BADGES.find(x => x.id === id);
    showToast(`🏅 ¡Nuevo logro! ${b.label}`);
    playVictory();
  });
  if (newly.length) renderBadgesBar();

  if (allCompleted && !state.finalShown) {
    state.finalShown = true;
    setTimeout(() => showFinalMessage(FINAL_MESSAGE), 600);
  }
  if (mapAllCompleted && !state.mapFinalShown) {
    state.mapFinalShown = true;
    setTimeout(() => showFinalMessage(MAP_FINAL_MESSAGE), 700);
  }
  saveState();
}

function showFinalMessage(text) {
  const el = document.getElementById('finalMessage');
  if (el) el.textContent = text;
  openOverlayId('finalOverlay');
}

/* ============ Abrir / cerrar la ficha ============ */

function openFichaOverlay(a, opts) {
  opts = opts || {};
  currentOnClose = opts.onClose || null;
  activeAnimal = a;

  const spriteEl = document.getElementById('cardSprite');
  if (a.photo) {
    spriteEl.innerHTML = `<img src="${a.photo}" alt="${a.name}">`;
    spriteEl.classList.add('has-photo');
  } else {
    spriteEl.textContent = a.emoji;
    spriteEl.classList.remove('has-photo');
  }
  document.getElementById('cardName').textContent = a.name;
  document.getElementById('cardLat').textContent = a.lat;

  const soundBtn = document.getElementById('cardSoundBtn');
  if (soundBtn) {
    soundBtn.style.display = a.sound ? 'inline-flex' : 'none';
    soundBtn.onclick = () => playRealSound(a.sound);
  }

  renderFicha(a);
  renderPersonalizar(a);
  renderQuiz(a);
  switchTab('ficha');
  openOverlayId('overlay');
  if (opts.onOpen) opts.onOpen();

  const isMap = a.store === 'mapQuiz';
  const bucket = isMap ? mapDiscoveredSet : discoveredSet;
  const total = isMap ? getMapAnimals().length : POTRERO_IDS.length;

  if (!bucket.has(a.id)) {
    bucket.add(a.id);
    if (isMap) state.mapDiscovered = Array.from(mapDiscoveredSet);
    else state.discovered = Array.from(discoveredSet);

    if (typeof updateHeader === 'function') updateHeader();
    checkBadges();
    saveState();

    if (total > 0 && bucket.size === total) {
      const msg = isMap
        ? '¡Cuaderno completo! Conociste a los 10 animales del Mapa de la Granja.'
        : '¡Cuaderno completo! Descubriste las 4 fichas de campo del potrero.';
      setTimeout(() => showToast(msg), 400);
    }
  }
}

function closeFichaOverlay() {
  closeOverlayId('overlay');
  activeAnimal = null;
  if (currentOnClose) {
    currentOnClose();
    currentOnClose = null;
  }
}

document.getElementById('closeBtn').addEventListener('click', closeFichaOverlay);
document.getElementById('overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('overlay')) closeFichaOverlay();
});

/* ============ Pestañas ============ */

document.querySelectorAll('#overlay .tabs button').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

function switchTab(tab) {
  const overlay = document.getElementById('overlay');
  if (!overlay) return;
  overlay.querySelectorAll('.tabs button').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
  overlay.querySelectorAll('.tabpanel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + tab);
  if (panel) {
    panel.classList.add('active');
    if (tab === 'quiz' && activeAnimal) {
      renderQuiz(activeAnimal);
    }
  }
}

/* ============ Ficha ============ */

function renderFicha(a) {
  const intro = a.blurb
    ? `<div class="fact pet-intro"><div class="k">Sobre ${a.name}</div><div class="v">${a.blurb}${zoneLine(a)}</div></div>`
    : '';
  document.getElementById('panel-ficha').innerHTML = `
    <div class="stamp">ESPÉCIMEN OBSERVADO</div>
    ${intro}
    <div class="fact"><div class="k">Clasificación</div><div class="v">${a.facts.clasificacion}</div></div>
    <div class="fact"><div class="k">Hábitat</div><div class="v">${a.facts.habitat}</div></div>
    <div class="fact"><div class="k">Alimentación</div><div class="v">${a.facts.alimentacion}</div></div>
    <div class="fact"><div class="k">Consumo de agua</div><div class="v">${a.facts.agua}</div></div>
    <div class="fact"><div class="k">Comportamiento</div><div class="v">${a.facts.comportamiento}</div></div>
    <div class="fact"><div class="k">Reproducción</div><div class="v">${a.facts.reproduccion}</div></div>
    <div class="fact"><div class="k">Cuidados y bienestar</div><div class="v">${a.facts.cuidados}</div></div>
    <div class="fact highlight"><div class="k">Dato de campo</div><div class="v">${a.facts.dato}</div></div>
    <div class="anatomy-box">
      <div class="k">Anatomía</div>
      <button class="open-btn" id="openAnatomyBtn" type="button">🔬 Ver diagrama interactivo</button>
      <div class="anatomy-diagram" id="anatomyDiagram" style="display:none;"></div>
    </div>
  `;
  const btn = document.getElementById('openAnatomyBtn');
  const diagram = document.getElementById('anatomyDiagram');
  let openState = false;
  btn.addEventListener('click', () => {
    openState = !openState;
    if (openState) {
      diagram.style.display = 'block';
      diagram.innerHTML = a.anatomyImage ? buildAnatomyImage(a) : buildAnatomySVG(a);
      attachOrganHandlers(a);
      btn.textContent = '✕ Cerrar anatomía';
    } else {
      diagram.style.display = 'none';
      btn.textContent = '🔬 Ver diagrama interactivo';
    }
  });
}

function zoneLine(a) {
  if (!a.zoneId || typeof FARM_ZONES_BY_ID === 'undefined') return '';
  const z = FARM_ZONES_BY_ID[a.zoneId];
  return z ? ` Vive en la zona de <b>${z.label}</b> del mapa.` : '';
}

function buildAnatomySVG(a) {
  const bodyOrgans = a.organs.map(o => {
    const cx = 60 + o.x * 300;
    const cy = 100;
    return `<ellipse class="organ" data-id="${o.id}" cx="${cx}" cy="${cy}" rx="${o.rx}" ry="${o.ry}" fill="${o.color}"></ellipse>
    <text class="organ-label" x="${cx}" y="${cy + o.ry + 10}">${o.label}</text>`;
  }).join('');
  return `
    <svg viewBox="0 0 400 190" xmlns="http://www.w3.org/2000/svg">
      <ellipse class="body-outline open" cx="210" cy="100" rx="160" ry="55"></ellipse>
      <circle class="body-outline open" cx="45" cy="95" r="34"></circle>
      ${bodyOrgans}
    </svg>
    <div class="organ-info" id="organInfo">Toca un órgano del diagrama para leer su función.</div>
    <div class="anatomy-hint">Diagrama esquemático, no a escala real. Muestra el orden real del tracto digestivo.</div>
  `;
}

function buildAnatomyImage(a) {
  const pins = a.organs.map(o =>
    `<button type="button" class="organ anatomy-pin" data-id="${o.id}" style="left:${o.left}%;top:${o.top}%;" title="${o.label}" aria-label="${o.label}"></button>`
  ).join('');
  return `
    <div class="anatomy-img-wrap">
      <img src="${a.anatomyImage}" alt="Anatomía de ${a.name}">
      ${pins}
    </div>
    <div class="organ-info" id="organInfo">Toca un punto marcado en la imagen para leer su función.</div>
    <div class="anatomy-hint">Ilustración de referencia (no es una foto real del animal).</div>
  `;
}

function attachOrganHandlers(a) {
  const info = document.getElementById('organInfo');
  document.querySelectorAll('.organ').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.organ').forEach(o => o.classList.remove('sel'));
      el.classList.add('sel');
      const organ = a.organs.find(o => o.id === el.dataset.id);
      if (organ) {
        info.innerHTML = `<b>${organ.label}</b>${organ.desc}`;
      }
    });
  });
}

/* ============ Personalizar ============ */

function saveCustom(a) {
  state.custom[a.id] = { name: a.name, color: a.color, accessory: a.accessory };
  saveState();
}

function renderPersonalizar(a) {
  const panel = document.getElementById('panel-personalizar');
  panel.innerHTML = `
    <div class="field-row">
      <label for="nameInput">Nombre personalizado del animal</label>
      <input type="text" id="nameInput" value="${a.name}" maxlength="18">
    </div>
    <div class="field-row">
      <label>Color de etiqueta</label>
      <div class="swatches" id="swatches"></div>
    </div>
    <div class="field-row">
      <label>Accesorio</label>
      <div class="accessories" id="accBtns"></div>
    </div>
    <div class="save-note">Los cambios quedan guardados en el cuaderno de campo del/la estudiante.</div>
  `;
  document.getElementById('nameInput').addEventListener('input', e => {
    a.name = e.target.value || a.defaultName || a.name;
    document.getElementById('cardName').textContent = a.name;
    if (typeof refreshSprite === 'function') refreshSprite(a);
    saveCustom(a);
  });
  const sw = document.getElementById('swatches');
  COLORS.forEach(c => {
    const b = document.createElement('div');
    b.className = 'swatch' + (a.color === c ? ' sel' : '');
    b.style.background = c;
    b.addEventListener('click', () => {
      a.color = c;
      if (typeof refreshSprite === 'function') refreshSprite(a);
      sw.querySelectorAll('.swatch').forEach(s => s.classList.remove('sel'));
      b.classList.add('sel');
      saveCustom(a);
    });
    sw.appendChild(b);
  });
  const accBox = document.getElementById('accBtns');
  ACCESSORIES.forEach(acc => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'acc-btn' + (a.accessory === acc.id ? ' sel' : '');
    b.textContent = (acc.emoji || '—') + ' ' + acc.label;
    b.addEventListener('click', () => {
      a.accessory = acc.id;
      if (typeof refreshSprite === 'function') refreshSprite(a);
      accBox.querySelectorAll('.acc-btn').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      saveCustom(a);
    });
    accBox.appendChild(b);
  });
}

/* ============ Quiz de Evaluación Formativa ============ */

function getQuizBucket(a) {
  const key = a.store === 'mapQuiz' ? 'mapQuiz' : 'quiz';
  if (!state[key]) state[key] = {};
  if (!state[key][a.id]) {
    state[key][a.id] = {
      index: 0,
      answers: [],
      results: [],
      completed: false,
      scoreEarned: 0,
      completedAt: null
    };
  }
  return state[key][a.id];
}

function renderDots(a, qState) {
  return a.quiz.map((_, i) => {
    let cls = 'quiz-dot';
    if (qState.results[i] === true) cls += ' correct';
    else if (qState.results[i] === false) cls += ' wrong';
    if (i === qState.index && !qState.completed) cls += ' current';
    return `<span class="${cls}"></span>`;
  }).join('');
}

function renderQuiz(a) {
  const panel = document.getElementById('panel-quiz');
  if (!panel) return;

  // 1. Validar que el/la estudiante se haya identificado
  if (!state.studentName || state.studentName.trim() === '') {
    panel.innerHTML = `
      <div class="quiz-auth-gate">
        <div style="font-size:2.2rem;margin-bottom:8px;">🎒</div>
        <h3 style="margin:0 0 6px;font-family:'Fraunces',serif;">¡Identifícate para responder el Quiz!</h3>
        <p style="font-size:0.86rem;line-height:1.4;margin:0 0 14px;color:var(--grass-dark);">
          Para registrar tus respuestas, ganar puntos y optar a décimas formativas, primero debes ingresar tu nombre y curso.
        </p>
        <button class="tool-btn" id="gateAuthBtn" type="button" style="background:var(--hay);color:var(--ink);font-size:0.88rem;padding:9px 16px;">
          ✍️ Ingresar mi nombre y curso
        </button>
      </div>
    `;
    const authBtn = document.getElementById('gateAuthBtn');
    if (authBtn) {
      authBtn.addEventListener('click', openStudentModal);
    }
    return;
  }

  const qState = getQuizBucket(a);

  // 2. Si el quiz ya está completado para este estudiante
  if (qState.completed) {
    const correct = (qState.results || []).filter(Boolean).length;
    const total = a.quiz.length;
    const scoreVal = qState.scoreEarned || (correct * 10);
    const dateStr = qState.completedAt ? new Date(qState.completedAt).toLocaleDateString() : '';

    let reviewHtml = a.quiz.map((q, i) => {
      const isRight = qState.results[i] === true;
      const chosenIdx = qState.answers ? qState.answers[i] : null;
      const chosenText = chosenIdx !== null && chosenIdx !== undefined ? q.options[chosenIdx] : '—';
      const rightText = q.options[q.a];
      return `
        <div class="quiz-review-item ${isRight ? 'correct' : 'wrong'}">
          <div class="q-title"><b>${i + 1}.</b> ${q.q}</div>
          <div class="q-ans">Tu respuesta: <i>${chosenText}</i> ${isRight ? '✅' : '❌'}</div>
          ${!isRight ? `<div class="q-correct">Respuesta correcta: <b>${rightText}</b></div>` : ''}
          <div class="q-explain">💡 ${q.explain}</div>
        </div>
      `;
    }).join('');

    panel.innerHTML = `
      <div class="quiz-done-banner">
        <div style="font-size:2.2rem;">🏆</div>
        <div>
          <h3 style="margin:0;font-family:'Fraunces',serif;color:var(--grass-dark);">¡Quiz completado con éxito!</h3>
          <div style="font-size:0.85rem;margin-top:2px;">Evaluación registrada para <b>${state.studentName}</b> ${dateStr ? `· ${dateStr}` : ''}</div>
        </div>
      </div>
      <div class="teacher-chip" style="margin:10px 0 14px;background:#fff;">
        Resultado: <b>${correct}/${total} correctas (+${scoreVal} pts)</b>
      </div>
      <div class="quiz-review-list">
        <div style="font-size:0.78rem;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;margin-bottom:8px;color:var(--grass-dark);">
          Revisión pedagógica y retroalimentación:
        </div>
        ${reviewHtml}
      </div>
      <div class="quiz-done-actions" style="margin-top:14px;display:flex;gap:8px;">
        <button class="tool-btn" id="repasoQuizBtn" type="button" style="font-size:0.8rem;">🔄 Repetir evaluación (Nuevo intento)</button>
      </div>
    `;

    document.getElementById('repasoQuizBtn').addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar este quiz para un nuevo intento? Tu puntaje anterior de este quiz se actualizará con el nuevo resultado.')) {
        // Restar el puntaje anterior si se había sumado
        if (qState.scoreEarned) {
          state.score = Math.max(0, state.score - qState.scoreEarned);
        }
        qState.index = 0;
        qState.answers = [];
        qState.results = [];
        qState.completed = false;
        qState.scoreEarned = 0;
        qState.completedAt = null;
        if (typeof updateHeader === 'function') updateHeader();
        saveState();
        renderQuiz(a);
      }
    });
    return;
  }

  // 3. Quiz en progreso
  const idx = qState.index;
  if (idx >= a.quiz.length) {
    qState.completed = true;
    qState.completedAt = Date.now();
    checkBadges();
    saveState();
    renderQuiz(a);
    return;
  }

  const q = a.quiz[idx];
  const isAnswered = qState.results[idx] !== undefined && qState.results[idx] !== null;

  panel.innerHTML = `
    <div class="quiz-progress">${renderDots(a, qState)}</div>
    <div class="quiz-q"><b>Pregunta ${idx + 1} de ${a.quiz.length}:</b><br>${q.q}</div>
    <div id="opts" class="quiz-opts-box"></div>
    <div id="quizFeedback" class="quiz-feedback-slot"></div>
  `;

  const optsBox = document.getElementById('opts');
  const feedbackBox = document.getElementById('quizFeedback');

  q.options.forEach((opt, i) => {
    const b = document.createElement('button');
    b.className = 'quiz-opt';
    b.type = 'button';
    b.textContent = opt;

    if (isAnswered) {
      b.disabled = true;
      const studentAns = qState.answers[idx];
      if (i === q.a) b.classList.add('correct');
      if (i === studentAns && i !== q.a) b.classList.add('wrong');
    } else {
      b.addEventListener('click', () => {
        optsBox.querySelectorAll('.quiz-opt').forEach(x => x.disabled = true);
        const isCorrect = (i === q.a);
        qState.answers[idx] = i;
        qState.results[idx] = isCorrect;

        if (isCorrect) {
          b.classList.add('correct');
          spawnStarBurst(b);
          state.score += 10;
          qState.scoreEarned = (qState.scoreEarned || 0) + 10;
          if (typeof updateHeader === 'function') updateHeader();
          playCorrect();
          bounceSpriteIfPresent(a.id);
        } else {
          b.classList.add('wrong');
          if (optsBox.children[q.a]) optsBox.children[q.a].classList.add('correct');
          playWrong();
        }

        saveState();
        drawFeedbackAndNext(a, qState, idx, q, isCorrect, feedbackBox);
      });
    }
    optsBox.appendChild(b);
  });

  if (isAnswered) {
    drawFeedbackAndNext(a, qState, idx, q, qState.results[idx] === true, feedbackBox);
  }
}

function drawFeedbackAndNext(a, qState, idx, q, isCorrect, container) {
  container.innerHTML = '';

  const exp = document.createElement('div');
  exp.className = 'quiz-explain';
  exp.innerHTML = `<b>${isCorrect ? '✨ ¡Correcto!' : 'ℹ️ Explicación formativa:'}</b> ${q.explain}`;
  container.appendChild(exp);

  if (isCorrect) {
    const pts = document.createElement('div');
    pts.className = 'quiz-points';
    pts.textContent = CORRECT_MESSAGE;
    container.appendChild(pts);
  }

  const isLast = (idx + 1 >= a.quiz.length);
  const next = document.createElement('button');
  next.className = 'quiz-next';
  next.type = 'button';
  next.textContent = isLast ? '🏁 Finalizar y Ver Resultado' : '➡️ Siguiente pregunta';
  
  next.addEventListener('click', () => {
    qState.index++;
    if (qState.index >= a.quiz.length) {
      qState.completed = true;
      qState.completedAt = Date.now();
      playVictory();
      checkBadges();
    }
    saveState();
    renderQuiz(a);
  });

  container.appendChild(next);
}

/* ============ Normas de la granja ============ */

function renderRules() {
  const list = document.getElementById('rulesList');
  if (list) {
    list.innerHTML = RULES.map(r => `<li>${r}</li>`).join('');
  }
}

/* ============ Panel docente ============ */

function calculateDecimas(potreroDone, mapDone) {
  // Según sección 5 del formulario Go Innova: entrega de décimas formativas
  const totalCompleted = potreroDone + mapDone;
  if (totalCompleted === 0) return '0.0';
  // 1 décima cada 2 animales completados, hasta +0.5 décimas máximo
  const dec = Math.min(0.5, totalCompleted * 0.05).toFixed(1);
  return `+${dec}`;
}

function renderTeacherPanel() {
  const body = document.getElementById('teacherBody');
  if (!body) return;

  const potreroAnimals = ANIMALS.filter(a => POTRERO_IDS.includes(a.id));
  const potreroCompleted = potreroAnimals.filter(a => state.quiz[a.id] && state.quiz[a.id].completed).length;
  const badgesEarned = state.badges.map(id => BADGES.find(b => b.id === id)).filter(Boolean);

  const mapAnimals = getMapAnimals();
  const mapCompleted = mapAnimals.length > 0 ? mapAnimals.filter(a => state.mapQuiz[a.id] && state.mapQuiz[a.id].completed).length : 0;

  const decimasSugeridas = calculateDecimas(potreroCompleted, mapCompleted);

  const rows = potreroAnimals.map(a => {
    const q = state.quiz[a.id] || { results: [], completed: false };
    const correct = (q.results || []).filter(Boolean).length;
    const disc = discoveredSet.has(a.id) ? 'Sí' : 'No';
    const quizStatus = q.completed ? `✅ ${correct}/${a.quiz.length} correctas` : ((q.results && q.results.length) ? '⏳ En progreso' : '⚪ No iniciado');
    return `<tr><td><b>${a.name}</b> (${a.defaultName})</td><td>${disc}</td><td>${quizStatus}</td></tr>`;
  }).join('');

  let mapSection = '';
  if (mapAnimals.length > 0) {
    const mapRows = mapAnimals.map(a => {
      const q = state.mapQuiz[a.id] || { results: [], completed: false };
      const correct = (q.results || []).filter(Boolean).length;
      const disc = mapDiscoveredSet.has(a.id) ? 'Sí' : 'No';
      const quizStatus = q.completed ? `✅ ${correct}/${a.quiz.length} correctas` : ((q.results && q.results.length) ? '⏳ En progreso' : '⚪ No iniciado');
      return `<tr><td><b>${a.name}</b></td><td>${disc}</td><td>${quizStatus}</td></tr>`;
    }).join('');

    mapSection = `
      <div class="save-note" style="margin-top:14px;font-size:0.8rem;"><b>Mapa de la Granja:</b> ${mapDiscoveredSet.size}/${mapAnimals.length} descubiertos · ${mapCompleted}/${mapAnimals.length} quizzes completados.</div>
      <div class="teacher-table-wrap">
        <table class="teacher-table">
          <thead><tr><th>Animal (Mapa Real)</th><th>Descubierto</th><th>Evaluación Formativa</th></tr></thead>
          <tbody>${mapRows}</tbody>
        </table>
      </div>`;
  }

  // Lista de todos los estudiantes registrados en este navegador
  const allProfiles = loadAllProfiles();
  const profileKeys = Object.keys(allProfiles);
  let profilesListHtml = '';
  if (profileKeys.length > 1) {
    const options = profileKeys.map(k => {
      const p = allProfiles[k];
      const isCur = (state.studentName.trim().toLowerCase() + '_' + (state.studentGrade || '').trim().toLowerCase()) === k;
      return `<option value="${k}" ${isCur ? 'selected' : ''}>${p.studentName} (${p.studentGrade || 'Sin curso'}) — ${p.score} pts</option>`;
    }).join('');

    profilesListHtml = `
      <div class="teacher-selector-box" style="margin-top:14px;background:#fff;border:2px solid var(--ink);padding:10px;border-radius:6px;">
        <label for="profileSelect" style="font-size:0.75rem;font-weight:700;display:block;margin-bottom:4px;color:var(--grass-dark);">
          👤 REVISAR OTRO ESTUDIANTE REGISTRADO EN ESTE EQUIPO:
        </label>
        <div style="display:flex;gap:8px;">
          <select id="profileSelect" style="flex:1;padding:6px;border:2px solid var(--ink);border-radius:4px;font-family:'Karla',sans-serif;">
            ${options}
          </select>
          <button class="tool-btn" id="loadProfileBtn" type="button">Cargar</button>
        </div>
      </div>
    `;
  }

  const updated = state.updatedAt ? new Date(state.updatedAt).toLocaleString() : '—';
  const studentInfoStr = state.studentName ? `${state.studentName} (${state.studentGrade || 'Curso no especificado'})` : '(Estudiante sin registrar)';

  body.innerHTML = `
    <div class="teacher-summary">
      <div class="teacher-chip">Estudiante Activo<br><b>${studentInfoStr}</b></div>
      <div class="teacher-chip">Puntaje Total<br><b>${state.score} pts</b></div>
      <div class="teacher-chip">Potrero (Fichas / Quizzes)<br><b>${discoveredSet.size}/${potreroAnimals.length} · ${potreroCompleted}/${potreroAnimals.length}</b></div>
      <div class="teacher-chip" style="background:#E3F0D8;border-color:var(--grass-dark);">Décimas Sugeridas<br><b style="color:var(--grass-dark);font-size:1.15rem;">${decimasSugeridas} décimas</b></div>
      <div class="teacher-chip">Insignias Obtenidas<br><b>${badgesEarned.length}/${BADGES.length}</b></div>
    </div>

    <div class="teacher-table-wrap">
      <table class="teacher-table">
        <thead><tr><th>Animal (Potrero)</th><th>Descubierto</th><th>Evaluación Formativa</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    ${mapSection}

    ${profilesListHtml}

    <div class="save-note" style="margin-top:12px;">
      <b>Nota pedagógica:</b> Los puntajes y décimas corresponden a la evaluación formativa individual según la rúbrica de Go Innova.
      Última actualización: ${updated}.
    </div>

    <div class="teacher-actions" style="margin-top:14px;">
      <button class="tool-btn" id="exportBtn" type="button">⬇️ Descargar informe oficial (.txt)</button>
      <button class="tool-btn" id="newStudentSessionBtn" type="button">👤 Registrar nuevo estudiante</button>
      <button class="tool-btn" id="resetBtn" type="button" style="color:var(--clay);">🔄 Reiniciar datos locales</button>
    </div>
  `;

  document.getElementById('exportBtn').addEventListener('click', exportReport);
  document.getElementById('newStudentSessionBtn').addEventListener('click', () => {
    closeOverlayId('teacherOverlay');
    openStudentModal();
  });

  const loadBtn = document.getElementById('loadProfileBtn');
  if (loadBtn) {
    loadBtn.addEventListener('click', () => {
      const sel = document.getElementById('profileSelect');
      const val = sel ? sel.value : null;
      if (val && allProfiles[val]) {
        state = allProfiles[val].stateData;
        discoveredSet = new Set(state.discovered);
        mapDiscoveredSet = new Set(state.mapDiscovered);
        saveState();
        updateStudentUI();
        if (typeof updateHeader === 'function') updateHeader();
        renderBadgesBar();
        renderTeacherPanel();
        showToast(`Perfil cargado: ${state.studentName}`);
      }
    });
  }

  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('¿Deseas reiniciar los datos locales de este navegador?')) {
      resetState();
    }
  });
}

function exportReport() {
  const potreroAnimals = ANIMALS.filter(a => POTRERO_IDS.includes(a.id));
  const potreroCompleted = potreroAnimals.filter(a => state.quiz[a.id] && state.quiz[a.id].completed).length;
  const mapAnimals = getMapAnimals();
  const mapCompleted = mapAnimals.length > 0 ? mapAnimals.filter(a => state.mapQuiz[a.id] && state.mapQuiz[a.id].completed).length : 0;
  const decimasSugeridas = calculateDecimas(potreroCompleted, mapCompleted);

  const lines = [];
  lines.push('===============================================================');
  lines.push('        LA GRANJA B13 — INFORME DE EVALUACIÓN FORMATIVA        ');
  lines.push('             Liceo Domingo Herrera Rivera B-13                ');
  lines.push('          Go Innova — Vinculado a ODS 4 y ODS 15              ');
  lines.push('===============================================================');
  lines.push('');
  lines.push('DATOS DEL/LA ESTUDIANTE:');
  lines.push('  Estudiante: ' + (state.studentName || '(Sin registrar)'));
  lines.push('  Curso:      ' + (state.studentGrade || '(No especificado)'));
  lines.push('  Fecha:      ' + new Date().toLocaleString());
  lines.push('');
  lines.push('RESUMEN DE RENDIMIENTO:');
  lines.push('  Puntaje Total Acumulado:   ' + state.score + ' pts');
  lines.push('  Décimas Formativas Sugeridas: ' + decimasSugeridas + ' décimas');
  lines.push('  Insignias de Logro:        ' + state.badges.length + ' / ' + BADGES.length);
  lines.push('');
  lines.push('DETALLE DE EVALUACIÓN — POTRERO:');
  potreroAnimals.forEach(a => {
    const q = state.quiz[a.id] || { results: [], completed: false };
    const correct = (q.results || []).filter(Boolean).length;
    const status = q.completed ? `Completado (${correct}/${a.quiz.length} correctas)` : 'Pendiente';
    lines.push(`  - [${a.defaultName}]: Descubierto=${discoveredSet.has(a.id) ? 'SÍ' : 'NO'} | Quiz=${status}`);
  });

  if (mapAnimals.length > 0) {
    lines.push('');
    lines.push('DETALLE DE EVALUACIÓN — MAPA REAL DE LA GRANJA:');
    mapAnimals.forEach(a => {
      const q = state.mapQuiz[a.id] || { results: [], completed: false };
      const correct = (q.results || []).filter(Boolean).length;
      const status = q.completed ? `Completado (${correct}/${a.quiz.length} correctas)` : 'Pendiente';
      lines.push(`  - [${a.name}]: Descubierto=${mapDiscoveredSet.has(a.id) ? 'SÍ' : 'NO'} | Quiz=${status}`);
    });
  }

  lines.push('');
  lines.push('INSIGNIAS OBTENIDAS:');
  if (state.badges.length === 0) {
    lines.push('  (Ninguna todavía)');
  } else {
    state.badges.forEach(id => {
      const b = BADGES.find(x => x.id === id);
      if (b) lines.push(`  - ${b.icon} ${b.label}: ${b.desc}`);
    });
  }

  lines.push('');
  lines.push('===============================================================');
  lines.push('Firma Docente: _______________________   Fecha: _______________');
  lines.push('===============================================================');

  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const aTag = document.createElement('a');
  aTag.href = url;
  const fileNameClean = (state.studentName || 'estudiante').replace(/[^a-zA-Z0-9]/g, '_');
  aTag.download = `evaluacion-granja-b13-${fileNameClean}.txt`;
  document.body.appendChild(aTag);
  aTag.click();
  aTag.remove();
  URL.revokeObjectURL(url);
}

/* ============ Barra de herramientas y overlays ============ */

function updateSoundBtn() {
  const btn = document.getElementById('soundBtn');
  if (btn) {
    btn.textContent = state.soundOn ? '🔊 Sonido' : '🔇 Sonido';
    btn.classList.toggle('off', !state.soundOn);
  }
}

const changeStudentBtn = document.getElementById('changeStudentBtn');
if (changeStudentBtn) {
  changeStudentBtn.addEventListener('click', openStudentModal);
}

const studentPill = document.getElementById('studentPill');
if (studentPill) {
  studentPill.addEventListener('click', (e) => {
    if (e.target !== changeStudentBtn) openStudentModal();
  });
}

const saveStudentBtn = document.getElementById('saveStudentBtn');
if (saveStudentBtn) {
  saveStudentBtn.addEventListener('click', handleSaveStudent);
}

const studentForm = document.getElementById('studentForm');
if (studentForm) {
  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSaveStudent();
  });
}

const soundBtn = document.getElementById('soundBtn');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    updateSoundBtn();
    saveState();
    if (state.soundOn) ensureAudioCtx();
  });
}

const rulesBtn = document.getElementById('rulesBtn');
if (rulesBtn) {
  rulesBtn.addEventListener('click', () => {
    renderRules();
    openOverlayId('rulesOverlay');
  });
}

const achievementsBtn = document.getElementById('achievementsBtn');
if (achievementsBtn) {
  achievementsBtn.addEventListener('click', () => {
    renderAchievementsList();
    openOverlayId('achievementsOverlay');
  });
}

const teacherBtn = document.getElementById('teacherBtn');
if (teacherBtn) {
  teacherBtn.addEventListener('click', () => {
    renderTeacherPanel();
    openOverlayId('teacherOverlay');
  });
}

// Abrir modal de Escudo Oficial al hacer clic en el Logo
document.querySelectorAll('.app-logo').forEach(logoEl => {
  logoEl.addEventListener('click', () => {
    openOverlayId('logoOverlay');
  });
  logoEl.setAttribute('title', 'Toca para ver el Escudo Oficial y su simbología');
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeOverlayId(btn.dataset.close));
});

document.querySelectorAll('.overlay').forEach(el => {
  if (el.id === 'overlay') return;
  el.addEventListener('click', e => { if (e.target === el) closeOverlayId(el.id); });
});

// Atajo de teclado: tecla Escape cierra overlays
window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeFichaOverlay();
    ['studentOverlay', 'rulesOverlay', 'teacherOverlay', 'finalOverlay', 'miniVistaOverlay', 'zoneInfoOverlay', 'badgeOverlay', 'achievementsOverlay', 'logoOverlay'].forEach(closeOverlayId);
  }
});

/* ============ Inicio ============ */

renderBadgesBar();
updateSoundBtn();
updateStudentUI();

// Si al cargar no hay estudiante registrado, abrir modal de bienvenida para identificarse
if (!state.studentName || state.studentName.trim() === '') {
  setTimeout(() => {
    openStudentModal();
  }, 500);
}
