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
  if (id === 'rulesOverlay' && typeof unlockSecretBadge === 'function') {
    unlockSecretBadge('devoralibros');
  }
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
  if (typeof Auth !== 'undefined' && typeof Auth.aplicarRestriccionesRol === 'function') {
    Auth.aplicarRestriccionesRol();
  } else {
    const displayEl = document.getElementById('studentDisplayName');
    if (displayEl) {
      if (state.studentName && state.studentName.trim() !== '') {
        const gradeText = state.studentGrade ? ` (${state.studentGrade})` : '';
        displayEl.textContent = state.studentName + gradeText;
      } else {
        displayEl.textContent = 'Visitante';
      }
    }
  }

  const nameInput = document.getElementById('studentNameInput');
  const gradeInput = document.getElementById('studentGradeInput');
  if (nameInput && state.studentName) nameInput.value = state.studentName;
  if (gradeInput && state.studentGrade) gradeInput.value = state.studentGrade;
}

function openStudentModal() {
  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };
  if (sesion.rol === 'visita') {
    if (typeof volverAlEspacioModos === 'function') {
      volverAlEspacioModos();
    } else if (typeof volverAlInicio === 'function') {
      volverAlInicio();
    }
    return;
  }

  renderStudentProfileModal();
  openOverlayId('studentOverlay');
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
  if (/\d/.test(name)) {
    return { valid: false, msg: '⚠️ El nombre no debe contener números ni dígitos de teléfono. Ingresa tu nombre real.' };
  }
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

function renderStudentProfileModal() {
  const container = document.getElementById('studentModalBody') || document.querySelector('#studentOverlay .card-body');
  if (!container) return;

  const currentAvatar = state.avatarIcon || '🧑‍🌾';
  const currentFrameColor = state.avatarColor || '#ffd83d';
  const currentTitle = state.studentTitle || 'Explorador/a de Campo';
  const currentName = state.studentName || '';
  const currentGrade = state.studentGrade || '';
  const score = state.score || 0;
  const badgesEarned = (state.badges || []).length;
  const secretsEarned = (state.secretBadges || []).length;

  const isEligibleForCert = state.certificateUnlocked ||
    (state.badges && (state.badges.includes('guardian') || state.badges.includes('veterinario'))) ||
    (POTRERO_IDS.every(id => state.quiz[id] && state.quiz[id].completed));

  if (isEligibleForCert && !state.certificateUnlocked) {
    state.certificateUnlocked = true;
    if (!state.certificateCode) {
      const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
      state.certificateCode = `B13-CERT-2026-${rnd}`;
      state.certificateIssuedAt = Date.now();
    }
    unlockSecretBadge('cert_unlocked');
    saveState();
  }

  container.innerHTML = `
    <!-- Tarjeta de Identidad y Previsualización en Vivo -->
    <div class="student-profile-preview" style="background:var(--paper-dark);border:2px solid var(--ink);border-radius:8px;padding:12px;margin-bottom:14px;display:flex;align-items:center;gap:14px;">
      <div id="modalAvatarPreview" style="font-size:2.4rem;width:64px;height:64px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#fff;border:3px solid ${currentFrameColor};box-shadow:0 3px 6px rgba(0,0,0,0.15);flex-shrink:0;">
        ${currentAvatar}
      </div>
      <div style="flex:1;min-width:0;">
        <div id="modalTitlePreview" style="font-size:0.75rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--grass-dark);">
          ${currentTitle}
        </div>
        <div id="modalNamePreview" style="font-size:1.05rem;font-weight:700;color:var(--ink);font-family:'Fraunces',serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          ${currentName || 'Estudiante Sin Registrar'}
        </div>
        <div style="font-size:0.8rem;color:#555;">
          ${currentGrade ? `Curso: ${currentGrade} · ` : ''}<b>${score} pts</b> · ${badgesEarned} insignias · ${secretsEarned} misterios
        </div>
      </div>
    </div>

    <!-- Recompensa Tangible: Certificado Oficial -->
    <div class="cert-status-banner" style="margin-bottom:14px;padding:12px;border-radius:8px;border:2px solid ${isEligibleForCert ? '#ffd83d' : '#ccc'};background:${isEligibleForCert ? '#fffdf0' : '#f9f9f9'};">
      ${isEligibleForCert ? `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:2rem;">🎓</span>
          <div style="flex:1;">
            <div style="font-weight:700;color:#7A0F2B;font-size:0.92rem;">¡Certificado Oficial B-13 Desbloqueado!</div>
            <div style="font-size:0.78rem;color:#444;line-height:1.35;margin-top:2px;">
              Has completado el recorrido de aprendizaje animal. Tu diploma oficial firmado digitalmente está emitido y listo para imprimir o guardar en PDF.
            </div>
          </div>
        </div>
        <button type="button" id="btnOpenCertModal" class="tool-btn" style="width:100%;margin-top:10px;padding:9px;background:#7A0F2B;color:#fff;font-weight:700;font-size:0.88rem;border:2px solid #1a1a1a;border-radius:6px;cursor:pointer;">
          📜 Ver e Imprimir mi Certificado Oficial B-13
        </button>
      ` : `
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:1.8rem;opacity:0.6;">🔒</span>
          <div style="flex:1;">
            <div style="font-weight:700;color:#555;font-size:0.88rem;">Certificado Oficial B-13 (En progreso)</div>
            <div style="font-size:0.76rem;color:#777;line-height:1.35;margin-top:2px;">
              Rinde los desafíos en el Mapa 3D para desbloquear tu diploma oficial firmado digitalmente por el Liceo.
            </div>
          </div>
        </div>
        <button type="button" id="btnDemoCertModal" class="tool-btn" style="width:100%;margin-top:10px;padding:8px;background:var(--paper);color:var(--ink);font-weight:700;font-size:0.82rem;border:1.5px solid var(--ink);border-radius:6px;cursor:pointer;">
          🔍 Ver Demostración de Certificado Oficial B-13
        </button>
      `}
    </div>

    <!-- Formulario de Datos Básicos y Personalización -->
    <form id="studentForm" onsubmit="return false;">
      <div class="field-row" style="margin-bottom:10px;">
        <label for="studentNameInput" style="font-size:0.82rem;font-weight:700;">Nombre y Apellido *</label>
        <input type="text" id="studentNameInput" value="${currentName}" placeholder="Ej: Yefrin González" maxlength="30" required autocomplete="off" style="width:100%;padding:8px 10px;border:2px solid var(--ink);border-radius:6px;font-size:0.9rem;">
      </div>
      <div class="field-row" style="margin-bottom:10px;">
        <label for="studentGradeInput" style="font-size:0.82rem;font-weight:700;">Curso / Nivel *</label>
        <input type="text" id="studentGradeInput" value="${currentGrade}" placeholder="Ej: 3°F o 2° Medio" maxlength="20" required autocomplete="off" style="width:100%;padding:8px 10px;border:2px solid var(--ink);border-radius:6px;font-size:0.9rem;">
      </div>

      <!-- Selector de Título Honorífico -->
      <div class="field-row" style="margin-bottom:12px;">
        <label for="studentTitleSelect" style="font-size:0.82rem;font-weight:700;">Título Honorífico de Campo</label>
        <select id="studentTitleSelect" style="width:100%;padding:8px 10px;border:2px solid var(--ink);border-radius:6px;font-size:0.88rem;background:#fff;">
          ${(typeof STUDENT_TITLES !== 'undefined' ? STUDENT_TITLES : []).map(t => `<option value="${t}" ${t === currentTitle ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
      </div>

      <!-- Selector de Avatar con pestañas de categoría -->
      <div style="margin-bottom:14px;">
        <label style="font-size:0.82rem;font-weight:700;display:block;margin-bottom:6px;">Elige tu Avatar o Accesorio (Estudiantes B-13)</label>
        <div class="avatar-cat-bar" id="avatarCatBar" style="display:flex;gap:4px;margin-bottom:8px;background:var(--paper-dark);padding:3px;border-radius:6px;border:1.5px solid var(--ink);">
          <button type="button" class="avatar-cat-btn active" data-cat="fauna" style="flex:1;padding:5px 4px;font-size:0.75rem;font-weight:700;border:none;border-radius:4px;cursor:pointer;background:var(--grass-dark);color:#fff;">🐾 Fauna Granja</button>
          <button type="button" class="avatar-cat-btn" data-cat="fem" style="flex:1;padding:5px 4px;font-size:0.75rem;font-weight:700;border:none;border-radius:4px;cursor:pointer;background:transparent;color:var(--ink);">🌸 Flores & Moños</button>
          <button type="button" class="avatar-cat-btn" data-cat="masc" style="flex:1;padding:5px 4px;font-size:0.75rem;font-weight:700;border:none;border-radius:4px;cursor:pointer;background:transparent;color:var(--ink);">🧢 Gorras & Aventura</button>
          <button type="button" class="avatar-cat-btn" data-cat="all" style="padding:5px 8px;font-size:0.75rem;font-weight:700;border:none;border-radius:4px;cursor:pointer;background:transparent;color:var(--ink);">✨ Todos</button>
        </div>
        <div class="avatar-select-grid" id="avatarGrid" style="display:grid;grid-template-columns:repeat(5, 1fr);gap:6px;max-height:175px;overflow-y:auto;padding:2px;">
          ${(typeof STUDENT_AVATARS !== 'undefined' ? STUDENT_AVATARS : []).map(av => `
            <button type="button" class="avatar-picker-btn ${av.icon === currentAvatar ? 'selected' : ''}" data-icon="${av.icon}" data-cat="${av.category || 'fauna'}" title="${av.name} — ${av.desc}" style="background:#fff;border:2px solid ${av.icon === currentAvatar ? 'var(--grass-dark)' : '#ccc'};border-radius:8px;padding:6px 2px;font-size:1.55rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;transition:all 0.15s ease;">
              <span>${av.icon}</span>
              <span style="font-size:0.6rem;font-weight:600;color:#333;margin-top:2px;text-align:center;line-height:1;overflow:hidden;text-overflow:ellipsis;width:100%;">${av.name.split(' ')[0]}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Selector de Marco / Color de Borde -->
      <div style="margin-bottom:14px;">
        <label style="font-size:0.82rem;font-weight:700;display:block;margin-bottom:6px;">Marco Distintivo</label>
        <div class="frame-select-row" id="frameRow" style="display:flex;gap:8px;flex-wrap:wrap;">
          ${(typeof AVATAR_FRAMES !== 'undefined' ? AVATAR_FRAMES : []).map(f => `
            <button type="button" class="frame-picker-btn ${f.color === currentFrameColor ? 'selected' : ''}" data-color="${f.color}" title="${f.name}" style="background:${f.color};width:32px;height:32px;border-radius:50%;border:3px solid ${f.color === currentFrameColor ? '#1a1a1a' : '#fff'};box-shadow:0 1px 3px rgba(0,0,0,0.2);cursor:pointer;position:relative;">
              ${f.color === currentFrameColor ? '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#1a1a1a;font-weight:900;">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <div id="studentError" style="color:var(--clay);font-size:0.8rem;font-weight:700;margin-bottom:8px;display:none;"></div>

      <button type="submit" class="tool-btn" id="saveStudentBtn" style="width:100%;padding:10px;background:var(--hay);color:var(--ink);font-weight:700;font-size:0.92rem;border:2px solid var(--ink);border-radius:6px;cursor:pointer;">
        💾 Guardar Cambios de Perfil
      </button>
    </form>

    <button type="button" id="btnOverlayCambiarModo" class="nav-switch-btn" style="width:100%;margin-top:10px;padding:9px;justify-content:center;display:flex;border:2px solid var(--ink);border-radius:6px;cursor:pointer;">
      🔄 Cambiar Modo / Cerrar Sesión
    </button>
  `;

  // Listeners dinámicos
  let tempAvatar = currentAvatar;
  let tempFrame = currentFrameColor;
  let tempTitle = currentTitle;

  const catBar = document.getElementById('avatarCatBar');
  const avatarGrid = document.getElementById('avatarGrid');
  if (catBar && avatarGrid) {
    function filterAvatars(cat) {
      avatarGrid.querySelectorAll('.avatar-picker-btn').forEach(btn => {
        const match = (cat === 'all' || btn.dataset.cat === cat);
        btn.style.display = match ? 'flex' : 'none';
      });
    }
    filterAvatars('fauna'); // Por defecto mostrar fauna oficial de la granja

    catBar.querySelectorAll('.avatar-cat-btn').forEach(cBtn => {
      cBtn.addEventListener('click', () => {
        catBar.querySelectorAll('.avatar-cat-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = 'transparent';
          b.style.color = 'var(--ink)';
        });
        cBtn.classList.add('active');
        cBtn.style.background = 'var(--grass-dark)';
        cBtn.style.color = '#fff';
        filterAvatars(cBtn.dataset.cat);
      });
    });

    avatarGrid.querySelectorAll('.avatar-picker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        avatarGrid.querySelectorAll('.avatar-picker-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = '#ccc';
        });
        btn.classList.add('selected');
        btn.style.borderColor = 'var(--grass-dark)';
        tempAvatar = btn.dataset.icon;
        const prev = document.getElementById('modalAvatarPreview');
        if (prev) prev.textContent = tempAvatar;
      });
    });
  }

  const frameRow = document.getElementById('frameRow');
  if (frameRow) {
    frameRow.querySelectorAll('.frame-picker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        frameRow.querySelectorAll('.frame-picker-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = '#fff';
          b.innerHTML = '';
        });
        btn.classList.add('selected');
        btn.style.borderColor = '#1a1a1a';
        btn.innerHTML = '<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.75rem;color:#1a1a1a;font-weight:900;">✓</span>';
        tempFrame = btn.dataset.color;
        const prev = document.getElementById('modalAvatarPreview');
        if (prev) prev.style.borderColor = tempFrame;
      });
    });
  }

  const titleSel = document.getElementById('studentTitleSelect');
  if (titleSel) {
    titleSel.addEventListener('change', () => {
      tempTitle = titleSel.value;
      const prev = document.getElementById('modalTitlePreview');
      if (prev) prev.textContent = tempTitle;
    });
  }

  const nameInp = document.getElementById('studentNameInput');
  if (nameInp) {
    nameInp.addEventListener('input', () => {
      const prev = document.getElementById('modalNamePreview');
      if (prev) prev.textContent = nameInp.value || 'Estudiante Sin Registrar';
    });
  }

  const form = document.getElementById('studentForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveStudentProfile(tempAvatar, tempFrame, tempTitle);
    });
  }

  const saveBtn = document.getElementById('saveStudentBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.preventDefault();
      saveStudentProfile(tempAvatar, tempFrame, tempTitle);
    });
  }

  const certBtn = document.getElementById('btnOpenCertModal');
  if (certBtn) {
    certBtn.addEventListener('click', () => {
      closeOverlayId('studentOverlay');
      openCertificateModal(false);
    });
  }

  const demoCertBtn = document.getElementById('btnDemoCertModal');
  if (demoCertBtn) {
    demoCertBtn.addEventListener('click', () => {
      closeOverlayId('studentOverlay');
      openCertificateModal(true);
    });
  }

  const modoBtn = document.getElementById('btnOverlayCambiarModo');
  if (modoBtn) {
    modoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeOverlayId('studentOverlay');
      if (typeof volverAlEspacioModos === 'function') {
        volverAlEspacioModos();
      } else if (typeof volverAlInicio === 'function') {
        volverAlInicio();
      }
    });
  }
}

function handleSaveStudent() {
  const currentAvatar = state.avatarIcon || '🧑‍🌾';
  const currentFrameColor = state.avatarColor || '#ffd83d';
  const currentTitle = state.studentTitle || 'Explorador/a de Campo';
  saveStudentProfile(currentAvatar, currentFrameColor, currentTitle);
}

function saveStudentProfile(avatar, frame, title) {
  const nameInput = document.getElementById('studentNameInput');
  const gradeInput = document.getElementById('studentGradeInput');
  const errEl = document.getElementById('studentError');

  const rawName = nameInput ? nameInput.value : '';
  const rawGrade = gradeInput ? gradeInput.value : '';

  const cleanName = sanitizeInput(rawName);
  const cleanGrade = sanitizeInput(rawGrade);

  const nameVal = validateStudentName(cleanName);
  if (!nameVal.valid) {
    if (errEl) { errEl.textContent = nameVal.msg; errEl.style.display = 'block'; }
    if (nameInput) { nameInput.focus(); nameInput.classList.add('input-error'); }
    return;
  }

  const gradeVal = validateStudentGrade(cleanGrade);
  if (!gradeVal.valid) {
    if (errEl) { errEl.textContent = gradeVal.msg; errEl.style.display = 'block'; }
    if (gradeInput) { gradeInput.focus(); gradeInput.classList.add('input-error'); }
    return;
  }

  if (errEl) errEl.style.display = 'none';
  if (nameInput) nameInput.classList.remove('input-error');
  if (gradeInput) gradeInput.classList.remove('input-error');

  const ok = setActiveStudent(cleanName, cleanGrade);
  if (ok) {
    state.avatarIcon = avatar || state.avatarIcon || '🧑‍🌾';
    state.avatarColor = frame || state.avatarColor || '#ffd83d';
    state.studentTitle = title || state.studentTitle || 'Explorador/a de Campo';
    saveState();

    discoveredSet = new Set(state.discovered);
    mapDiscoveredSet = new Set(state.mapDiscovered);
    closeOverlayId('studentOverlay');
    updateStudentUI();
    if (typeof updateHeader === 'function') updateHeader();
    if (typeof Auth !== 'undefined' && typeof Auth.aplicarRestriccionesRol === 'function') {
      Auth.aplicarRestriccionesRol();
    }
    renderBadgesBar();
    showToast(`🎒 Perfil actualizado: ${cleanName} (${state.studentTitle})`);

    if (activeAnimal) {
      renderQuiz(activeAnimal);
    }
  }
}

/* ============ Sistema de Logros Secretos y Easter Eggs ============ */

function unlockSecretBadge(id) {
  if (!state) return;
  if (!state.secretBadges) state.secretBadges = [];
  if (state.secretBadges.includes(id)) return;

  state.secretBadges.push(id);
  saveState();

  const sb = (typeof SECRET_BADGES !== 'undefined' ? SECRET_BADGES : []).find(x => x.id === id);
  if (sb) {
    showToast(`🌟 ¡MISTERIO DESCUBIERTO! ${sb.icon} ${sb.label}`);
    playVictory();
  }
  if (typeof renderAchievementsList === 'function') renderAchievementsList();
  if (typeof renderBadgesBar === 'function') renderBadgesBar();
}

function trackAnimalSound(soundSrc) {
  if (!state) return;
  if (!state.soundsPlayed) state.soundsPlayed = [];
  if (soundSrc && !state.soundsPlayed.includes(soundSrc)) {
    state.soundsPlayed.push(soundSrc);
    saveState();
  }
  if (state.soundsPlayed.length >= 5) {
    unlockSecretBadge('susurrador');
  }
}
window.trackAnimalSound = trackAnimalSound;

/* ============ Certificado Oficial Digital Liceo B-13 ============ */

function openCertificateModal(isDemo = false) {
  renderCertificate(isDemo);
  openOverlayId('certificateOverlay');
  setupCertificateEvents();
}

function renderCertificate(isDemo = false) {
  const container = document.getElementById('certificateContent');
  if (!container) return;

  const isSimulated = isDemo && (!state.studentName || state.studentName.trim() === '');
  const studentName = isSimulated ? 'YEFRIN GONZÁLEZ (DEMO)' : (state.studentName || 'Estudiante B-13').toUpperCase();
  const studentGrade = isSimulated ? '3° Medio F' : (state.studentGrade || 'Enseñanza Media');
  const studentTitle = state.studentTitle || 'Guardián/a de la Granja';
  const studentScore = (state.score && state.score > 0) ? state.score : (isDemo ? 850 : 0);
  const badgesCount = (state.badges || []).length;
  const secretCount = (state.secretBadges || []).length;
  const totalBadges = (badgesCount + secretCount) || (isDemo ? 12 : 0);

  if (!state.certificateCode) {
    const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
    state.certificateCode = `B13-CERT-2026-${rnd}`;
    state.certificateIssuedAt = Date.now();
    saveState();
  }

  const issueDate = state.certificateIssuedAt
    ? new Date(state.certificateIssuedAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' });

  container.innerHTML = `
    <div class="certificate-sheet">
      <div class="cert-border-outer">
        <div class="cert-border-inner">
          
          <!-- Encabezado Institucional -->
          <div class="cert-header">
            <div class="cert-logo-box">
              <img src="assets/img/logo.png" alt="Escudo Liceo B-13" class="cert-logo-img">
            </div>
            <div class="cert-inst-text">
              <div class="cert-inst-title">REPÚBLICA DE CHILE · MINISTERIO DE EDUCACIÓN</div>
              <div class="cert-inst-sub">LICEO DOMINGO HERRERA RIVERA B-13 — ANTOFAGASTA</div>
              <div class="cert-inst-sub2">DEPARTAMENTO DE CIENCIAS NATURALES Y EDUCACIÓN AMBIENTAL</div>
              <div class="cert-inst-proj">PROYECTO EDUCATIVO «LA GRANJA ESCOLAR B-13»</div>
            </div>
            <div class="cert-flag-box">
              <span style="font-size:2rem;">🇨🇱</span>
            </div>
          </div>

          <div class="cert-divider"></div>

          <!-- Título del Certificado -->
          <div class="cert-title-section">
            <h1 class="cert-main-title">CERTIFICADO OFICIAL DE DISTINCIÓN</h1>
            <h2 class="cert-sub-title">COMPETENCIA EN BIENESTAR ANIMAL, BIOLOGÍA APLICADA Y TRABAJO DE CAMPO</h2>
          </div>

          <!-- Cuerpo del Certificado -->
          <div class="cert-body-text">
            El Liceo B-13 y el Comité Coordinador de La Granja Educativa confieren con honores la presente distinción a:
          </div>

          <div class="cert-student-highlight">
            <div class="cert-student-name">${studentName}</div>
            <div class="cert-student-meta">
              <span>Nivel / Curso: <b>${studentGrade}</b></span>
              <span>•</span>
              <span>Título Honorífico: <b>${studentTitle}</b></span>
            </div>
          </div>

          <p class="cert-praise">
            Por haber superado exitosamente los desafíos de aprendizaje, observación biológica, anatomía comparada, fisiología y protocolos de cuidado y bienestar animal en los módulos interactivos de La Granja B-13, promoviendo activamente la sustentabilidad escolar y los Objetivos de Desarrollo Sostenible (ODS 4 y ODS 15).
          </p>

          <!-- Métricas y Logros de Campo -->
          <div class="cert-merits-grid">
            <div class="cert-merit-box">
              <div class="cert-merit-val">${studentScore} PTS</div>
              <div class="cert-merit-lbl">PUNTAJE ACUMULADO</div>
            </div>
            <div class="cert-merit-box">
              <div class="cert-merit-val">+0.5 DÉCIMAS</div>
              <div class="cert-merit-lbl">RECOMPENSA PEDAGÓGICA CIENCIAS</div>
            </div>
            <div class="cert-merit-box">
              <div class="cert-merit-val">${totalBadges} INSIGNIAS</div>
              <div class="cert-merit-lbl">LOGROS Y SECRETOS DESBLOQUEADOS</div>
            </div>
            <div class="cert-merit-box">
              <div class="cert-merit-val">DISTINCIÓN MÁXIMA</div>
              <div class="cert-merit-lbl">CALIFICACIÓN DE CAMPO</div>
            </div>
          </div>

          <!-- Firmas y Sello Oficial -->
          <div class="cert-signatures-section">
            <div class="cert-sig-box">
              <div class="cert-sig-line">
                <span class="digital-sig-draw">Prof. Encargado(a) B-13</span>
              </div>
              <div class="cert-sig-name">Profesor(a) Encargado(a)</div>
              <div class="cert-sig-role">Coordinación de Granja Escolar B-13</div>
            </div>

            <div class="cert-seal-box">
              <div class="cert-seal-stamp">
                <div class="cert-seal-inner">
                  <span class="cert-seal-star">★ ★ ★</span>
                  <span class="cert-seal-txt">LICEO B-13</span>
                  <span class="cert-seal-valid">OFICIALMENTE VALIDADO</span>
                  <span class="cert-seal-year">2026</span>
                </div>
              </div>
              <div class="cert-code-tag">FOLIO: ${state.certificateCode}</div>
              <div class="cert-date-tag">Fecha: ${issueDate}</div>
            </div>

            <div class="cert-sig-box">
              <div class="cert-sig-line">
                <span class="digital-sig-draw">Dirección Liceo B-13</span>
              </div>
              <div class="cert-sig-name">Dirección del Establecimiento</div>
              <div class="cert-sig-role">Liceo Domingo Herrera Rivera B-13</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

function setupCertificateEvents() {
  const printBtn = document.getElementById('printCertBtn');
  if (printBtn) {
    printBtn.onclick = () => window.print();
  }
}

/* ============ Insignias / logros ============ */

const BADGE_HINTS = {
  explorador: 'Requisito: Explora el Potrero y abre las fichas de los 5 animales (Gallo, Gallina, Conejo, Catita y Agapornis).',
  cuadernista: 'Requisito: Responde y completa el quiz de al menos 1 animal.',
  guardian: 'Requisito: Completa con éxito los quizzes de los 5 animales del Potrero.',
  precision: 'Requisito: Responde todas las preguntas de un quiz correctamente a la primera (100% de precisión).',
  zoologo: 'Requisito: Recorre el Mapa de la Granja y abre las fichas de los 10 animales reales.',
  veterinario: 'Requisito: Completa los quizzes de los 10 animales del Mapa de la Granja.'
};

function renderAchievementsList() {
  const container = document.getElementById('achievementsList');
  if (!container) return;
  
  const earnedOfficialCount = BADGES.filter(b => state.badges.includes(b.id)).length;
  const secretsList = typeof SECRET_BADGES !== 'undefined' ? SECRET_BADGES : [];
  const earnedSecretCount = secretsList.filter(s => (state.secretBadges || []).includes(s.id)).length;
  
  container.innerHTML = `
    <div style="font-size:0.85rem;font-weight:700;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;background:var(--paper-dark);padding:10px 14px;border-radius:6px;border:2px solid var(--ink);">
      <span>PROGRESO TOTAL:</span>
      <span style="color:var(--grass-dark);font-family:'Space Mono',monospace;font-size:0.95rem;">
        ${earnedOfficialCount}/${BADGES.length} Oficiales · ${earnedSecretCount}/${secretsList.length} Secretos
      </span>
    </div>

    <div style="font-size:0.8rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:var(--grass-dark);margin:12px 0 6px;">
      🏅 Insignias Oficiales de Campo
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
            <div class="achievement-hint">💡 <b>Requisito:</b> ${hint}</div>
          </div>
        </div>
      `;
    }).join('')}

    <div style="font-size:0.8rem;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;color:#8B4513;margin:18px 0 6px;">
      🌟 Logros Ocultos y Misterios de Terreno (Easter Eggs)
    </div>
    ${secretsList.map(s => {
      const isEarned = (state.secretBadges || []).includes(s.id);
      if (isEarned) {
        return `
          <div class="achievement-row earned secret-unlocked" style="background:#fffcf0;border-left:4px solid #ffd83d;">
            <div class="achievement-icon-box" style="background:#ffd83d;border-color:#1a1a1a;">${s.icon}</div>
            <div class="achievement-details">
              <div class="achievement-title">
                <span style="color:#7A0F2B;font-weight:700;">${s.label}</span>
                <span class="achievement-status-tag" style="background:#ffd83d;color:#1a1a1a;border-color:#1a1a1a;">✨ DESCUBIERTO</span>
              </div>
              <div class="achievement-desc">${s.desc}</div>
              <div class="achievement-hint" style="color:#5c3d00;">🎉 ¡Misterio descubierto por tu espíritu observador!</div>
            </div>
          </div>
        `;
      } else {
        return `
          <div class="achievement-row secret-locked" style="opacity:0.85;background:#f8f8f8;">
            <div class="achievement-icon-box" style="filter:grayscale(1);opacity:0.6;">❓</div>
            <div class="achievement-details">
              <div class="achievement-title">
                <span style="color:#777;font-style:italic;">??? (Logro Misterioso)</span>
                <span class="achievement-status-tag" style="background:#e0e0e0;color:#555;">🔒 MISTERIO</span>
              </div>
              <div class="achievement-desc" style="color:#888;font-style:italic;">Un secreto de la granja que aún no has descubierto...</div>
              <div class="achievement-hint" style="color:#8B4513;">💡 <b>Pista misteriosa:</b> ${s.secretHint}</div>
            </div>
          </div>
        `;
      }
    }).join('')}
  `;
}

function renderBadgesBar() {
  const box = document.getElementById('badgesBar');
  if (!box) return;
  
  const officialHtml = BADGES.map(b => {
    const earned = state.badges.includes(b.id);
    return `
      <button type="button" class="badge${earned ? ' earned' : ''}" data-badge="${b.id}" title="${b.label}: ${b.desc}">
        <span class="ic">${b.icon}</span>
        <span class="badge-label">${b.label}</span>
        ${earned ? '<span class="badge-check">✓</span>' : '<span class="badge-lock">🔒</span>'}
      </button>
    `;
  }).join('');

  const secretsList = typeof SECRET_BADGES !== 'undefined' ? SECRET_BADGES : [];
  const secretHtml = (state.secretBadges || []).map(sid => {
    const s = secretsList.find(x => x.id === sid);
    if (!s) return '';
    return `
      <button type="button" class="badge earned secret-badge" data-badge="${s.id}" title="🌟 ${s.label}: ${s.desc}" style="background:#fffcf0;border-color:#ffd83d;">
        <span class="ic">${s.icon}</span>
        <span class="badge-label">${s.label}</span>
        <span class="badge-check" style="color:#ffd83d;">★</span>
      </button>
    `;
  }).join('');

  box.innerHTML = officialHtml + secretHtml;

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

  if (allCompleted || mapAllCompleted || state.badges.includes('guardian') || state.badges.includes('veterinario')) {
    if (!state.certificateUnlocked) {
      state.certificateUnlocked = true;
      if (!state.certificateCode) {
        const rnd = Math.random().toString(36).substring(2, 7).toUpperCase();
        state.certificateCode = `B13-CERT-2026-${rnd}`;
        state.certificateIssuedAt = Date.now();
      }
      unlockSecretBadge('cert_unlocked');
    }
  }

  const curH = new Date().getHours();
  if (curH >= 20 || curH < 6) {
    unlockSecretBadge('noctambulo');
  }

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
  const accEmoji = (typeof ACCESSORIES !== 'undefined' ? ACCESSORIES.find(x => x.id === a.accessory)?.emoji : '') || '';
  if (a.photo) {
    spriteEl.innerHTML = `<img src="${a.photo}" alt="${a.name}">${accEmoji ? `<span class="card-sprite-acc">${accEmoji}</span>` : ''}`;
    spriteEl.classList.add('has-photo');
  } else {
    spriteEl.innerHTML = `${a.emoji}${accEmoji ? `<span class="card-sprite-acc">${accEmoji}</span>` : ''}`;
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
        if (!state.organsInspected) state.organsInspected = [];
        const organKey = `${a.id}_${organ.id}`;
        if (!state.organsInspected.includes(organKey)) {
          state.organsInspected.push(organKey);
          saveState();
        }
        if (state.organsInspected.length >= 6) {
          unlockSecretBadge('anatomista');
        }
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
  const currentAccEmoji = (typeof ACCESSORIES !== 'undefined' ? ACCESSORIES.find(x => x.id === a.accessory)?.emoji : '') || '';

  panel.innerHTML = `
    <!-- Previsualización en vivo del espécimen personalizado -->
    <div class="personalizar-live-box" style="display:flex;align-items:center;gap:16px;background:var(--paper-dark);border:2px solid var(--ink);border-radius:8px;padding:12px 14px;margin-bottom:14px;">
      <div id="persoSpriteWrap" style="position:relative;width:56px;height:56px;display:flex;align-items:center;justify-content:center;background:#fff;border-radius:12px;border:2px solid var(--ink);font-size:2.2rem;box-shadow:0 2px 4px rgba(0,0,0,0.1);flex-shrink:0;">
        <span id="persoEmoji">${a.emoji}</span>
        <span id="persoAcc" style="position:absolute;top:-12px;left:50%;transform:translateX(-50%);font-size:1.3rem;line-height:1;">${currentAccEmoji}</span>
      </div>
      <div style="flex:1;min-width:0;">
        <div id="persoTag" style="font-family:'Space Mono',monospace;font-size:0.78rem;font-weight:700;display:inline-block;padding:2px 8px;border-radius:4px;border:2px solid ${a.color};color:${a.color};background:#fff;margin-bottom:4px;">
          ${a.name}
        </div>
        <div style="font-size:0.78rem;color:#555;">
          Observación y personalización de campo B-13
        </div>
      </div>
    </div>

    <div class="field-row">
      <label for="nameInput">Nombre personalizado del animal</label>
      <input type="text" id="nameInput" value="${a.name}" maxlength="18">
    </div>
    <div class="field-row">
      <label>Color de etiqueta</label>
      <div class="swatches" id="swatches"></div>
    </div>
    <div class="field-row">
      <label>Accesorio de campo</label>
      <div class="accessories" id="accBtns"></div>
    </div>
    <div class="save-note">Los cambios quedan guardados en el cuaderno de campo del/la estudiante.</div>
  `;

  function updateHeaderSprite() {
    const spriteEl = document.getElementById('cardSprite');
    if (!spriteEl) return;
    const accEmoji = (typeof ACCESSORIES !== 'undefined' ? ACCESSORIES.find(x => x.id === a.accessory)?.emoji : '') || '';
    if (a.photo) {
      spriteEl.innerHTML = `<img src="${a.photo}" alt="${a.name}">${accEmoji ? `<span class="card-sprite-acc">${accEmoji}</span>` : ''}`;
    } else {
      spriteEl.innerHTML = `${a.emoji}${accEmoji ? `<span class="card-sprite-acc">${accEmoji}</span>` : ''}`;
    }
  }

  document.getElementById('nameInput').addEventListener('input', e => {
    a.name = e.target.value || a.defaultName || a.name;
    document.getElementById('cardName').textContent = a.name;
    const tag = document.getElementById('persoTag');
    if (tag) tag.textContent = a.name;
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
      const tag = document.getElementById('persoTag');
      if (tag) {
        tag.style.borderColor = c;
        tag.style.color = c;
      }
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
      const persoAcc = document.getElementById('persoAcc');
      if (persoAcc) persoAcc.textContent = acc.emoji || '';
      updateHeaderSprite();
      if (typeof refreshSprite === 'function') refreshSprite(a);
      accBox.querySelectorAll('.acc-btn').forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      saveCustom(a);
    });
    accBox.appendChild(b);
  });
}

/* ============ Desafíos y Quizzes de Aprendizaje ============ */

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
      completedAt: null,
      sampledQuestions: (typeof sampleQuestionsForAnimal === 'function') ? sampleQuestionsForAnimal(a.id, 6) : (a.quiz || [])
    };
  } else if (!state[key][a.id].sampledQuestions || state[key][a.id].sampledQuestions.length === 0) {
    state[key][a.id].sampledQuestions = (typeof sampleQuestionsForAnimal === 'function') ? sampleQuestionsForAnimal(a.id, 6) : (a.quiz || []);
  }
  return state[key][a.id];
}

function renderDots(questions, qState) {
  const list = questions || [];
  return list.map((_, i) => {
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

  const sesionActual = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };

  // Detección estricta de la vista activa (Potrero vs Mapa 3D)
  const isPotreroView = (typeof stage !== 'undefined' && stage !== null) ||
    (document.getElementById('stage') !== null && document.getElementById('farmmap') === null);

  // 1. RESTRICCIÓN PEDAGÓGICA: En el Potrero NO se rinden los quizzes; es para observación y curiosidades
  if (isPotreroView) {
    let poolKey = a.id;
    if (['nesquik', 'vainilla', 'tasmi', 'quesito'].includes(poolKey)) poolKey = 'conejo';
    const hints = (typeof CURIOSITIES !== 'undefined' && CURIOSITIES[poolKey]) ? CURIOSITIES[poolKey] : [];
    const curiosityHint = hints.length > 0 ? hints[Math.floor(Math.random() * hints.length)] : 'Observa y escucha a este animal en el potrero para aprender sus hábitos y biología.';

    panel.innerHTML = `
      <div class="potrero-quiz-gate" style="text-align:center;padding:22px 16px;background:var(--paper-dark);border:2px dashed var(--grass-dark);border-radius:10px;">
        <div style="font-size:2.8rem;margin-bottom:8px;">🌾🗺️</div>
        <h3 style="margin:0 0 6px;font-family:'Fraunces',serif;color:var(--grass-dark);font-size:1.22rem;">
          ¡Los Desafíos con Décimas se rinden en el Mapa 3D!
        </h3>
        <p style="font-size:0.88rem;line-height:1.45;color:var(--ink);max-width:440px;margin:0 auto 14px;">
          El <b>Potrero</b> es tu espacio de observación en vivo, convivencia y estudio de curiosidades de campo.
          Aquí los animalitos te enseñan sus secretos al pasar.
          <br><br>
          Cuando te sientas preparado/a, ve al <b>Mapa de la Granja 3D</b> para rendir tus desafíos oficiales y acumular décimas para tu nota de Ciencias.
        </p>
        <div class="potrero-curiosity-box" style="background:#fff;border:2px solid var(--ink);border-radius:8px;padding:12px 14px;margin:0 auto 16px;max-width:440px;text-align:left;box-shadow:0 2px 4px rgba(0,0,0,0.06);">
          <div style="font-weight:700;font-size:0.84rem;color:var(--grass-dark);margin-bottom:4px;display:flex;align-items:center;gap:6px;">
            <span>💡</span> Pista de Campo de ${a.name}:
          </div>
          <div style="font-size:0.84rem;color:#333;line-height:1.4;">
            ${curiosityHint}
          </div>
        </div>
        <a href="mapa.html" class="tool-btn" style="display:inline-block;text-decoration:none;padding:11px 22px;background:var(--hay);color:var(--ink);font-weight:700;font-size:0.92rem;border:2px solid var(--ink);border-radius:6px;box-shadow:0 3px 0 var(--ink);">
          🚀 Ir al Mapa 3D a Rendir Desafíos ➤
        </a>
      </div>
    `;
    return;
  }

  // Caso A: Modo Visita en Mapa 3D
  if (sesionActual.rol === 'visita') {
    panel.innerHTML = `
      <div class="quiz-auth-gate">
        <div style="font-size:2.4rem;margin-bottom:8px;">🧭</div>
        <h3 style="margin:0 0 6px;font-family:'Fraunces',serif;color:var(--grass-dark);">Modo Visita: Recorrido Libre</h3>
        <p style="font-size:0.88rem;line-height:1.45;margin:0 0 14px;color:var(--ink);">
          Estás recorriendo La Granja B13 como visitante. Los quizzes formativos, preguntas de campo y la entrega de décimas son exclusivos del <b>Modo Estudiante</b> para alumnos del Liceo Domingo Herrera Rivera B-13.
        </p>
        <button class="tool-btn" id="gateVisitaToStudentBtn" type="button" style="background:var(--hay);color:var(--ink);font-weight:700;font-size:0.88rem;padding:9px 18px;border:2px solid var(--ink);border-radius:6px;cursor:pointer;">
          🎓 Iniciar sesión como Estudiante
        </button>
      </div>
    `;
    const toStudentBtn = document.getElementById('gateVisitaToStudentBtn');
    if (toStudentBtn) {
      toStudentBtn.addEventListener('click', () => {
        closeFichaOverlay();
        if (typeof volverAlInicio === 'function') {
          volverAlInicio();
          const startScreen = document.getElementById('startScreen');
          const authScreen = document.getElementById('authScreen');
          if (startScreen && authScreen) {
            startScreen.hidden = true;
            authScreen.hidden = false;
          }
        }
      });
    }
    return;
  }

  // Caso B: Modo Docente (Vista Previa Formativa)
  const qState = getQuizBucket(a);
  const questions = (qState.sampledQuestions && qState.sampledQuestions.length > 0)
    ? qState.sampledQuestions
    : (qState.sampledQuestions = (typeof sampleQuestionsForAnimal === 'function' ? sampleQuestionsForAnimal(a.id, 6) : (a.quiz || [])));

  if (sesionActual.rol === 'profesor' || sesionActual.rol === 'admin') {
    let previewHtml = questions.map((q, i) => {
      const diffBadge = q.difficulty === 'dificil'
        ? '<span class="diff-badge diff-dificil">🔴 Avanzado (20 pts)</span>'
        : (q.difficulty === 'medio'
            ? '<span class="diff-badge diff-medio">🟡 Intermedio (15 pts)</span>'
            : '<span class="diff-badge diff-facil">🟢 Básico (10 pts)</span>');
      return `
        <div class="quiz-review-item correct" style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="q-title"><b>${i + 1}.</b> ${q.q}</div>
            ${diffBadge}
          </div>
          <div class="q-correct" style="margin-top:4px;">Respuesta correcta: <b>${q.options[q.a]}</b></div>
          <div class="q-explain">💡 ${q.explain}</div>
        </div>
      `;
    }).join('');

    panel.innerHTML = `
      <div class="quiz-box">
        <div class="quiz-title" style="color:#7A0F2B;border-bottom:2px solid #7A0F2B;padding-bottom:6px;">
          🍎 Vista Previa Docente — ${a.name}
        </div>
        <p style="font-size:0.82rem;color:#555;margin:6px 0 12px;">
          Como docente, aquí puedes revisar las preguntas formativas aleatorias y explicaciones pedagógicas generadas para este animal.
        </p>
        ${previewHtml}
      </div>
    `;
    return;
  }

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

  // 2. Si el quiz ya está completado para este estudiante
  if (qState.completed) {
    const correct = (qState.results || []).filter(Boolean).length;
    const total = questions.length;
    const scoreVal = qState.scoreEarned || (correct * 10);
    const dateStr = qState.completedAt ? new Date(qState.completedAt).toLocaleDateString() : '';

    let reviewHtml = questions.map((q, i) => {
      const isRight = qState.results[i] === true;
      const chosenIdx = qState.answers ? qState.answers[i] : null;
      const chosenText = chosenIdx !== null && chosenIdx !== undefined ? q.options[chosenIdx] : '—';
      const rightText = q.options[q.a];
      const diffBadge = q.difficulty === 'dificil'
        ? '<span class="diff-badge diff-dificil">🔴 Avanzado</span>'
        : (q.difficulty === 'medio'
            ? '<span class="diff-badge diff-medio">🟡 Intermedio</span>'
            : '<span class="diff-badge diff-facil">🟢 Básico</span>');
      return `
        <div class="quiz-review-item ${isRight ? 'correct' : 'wrong'}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div class="q-title"><b>${i + 1}.</b> ${q.q}</div>
            ${diffBadge}
          </div>
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
          <div style="font-size:0.85rem;margin-top:2px;">Desafío registrado para <b>${state.studentName}</b> ${dateStr ? `· ${dateStr}` : ''}</div>
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
        <button class="tool-btn" id="repasoQuizBtn" type="button" style="font-size:0.8rem;">🔄 Repetir desafío (Nuevas preguntas)</button>
      </div>
    `;

    document.getElementById('repasoQuizBtn').addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar este quiz para un nuevo intento? Tu puntaje anterior de este quiz se actualizará y recibirás nuevas preguntas aleatorias del banco para seguir aprendiendo.')) {
        if (qState.scoreEarned) {
          state.score = Math.max(0, state.score - qState.scoreEarned);
        }
        qState.index = 0;
        qState.answers = [];
        qState.results = [];
        qState.completed = false;
        qState.scoreEarned = 0;
        qState.completedAt = null;
        // Muestrear preguntas frescas del banco (anti-copia)
        qState.sampledQuestions = (typeof sampleQuestionsForAnimal === 'function')
          ? sampleQuestionsForAnimal(a.id, 6)
          : (a.quiz || []);
        if (typeof updateHeader === 'function') updateHeader();
        saveState();
        renderQuiz(a);
      }
    });
    return;
  }

  // 3. Quiz en progreso en el Mapa 3D
  const idx = qState.index;
  if (idx >= questions.length) {
    qState.completed = true;
    qState.completedAt = Date.now();
    checkBadges();
    saveState();
    renderQuiz(a);
    return;
  }

  const q = questions[idx];
  const isAnswered = qState.results[idx] !== undefined && qState.results[idx] !== null;

  const diffLabel = q.difficulty === 'dificil'
    ? '<span class="diff-badge diff-dificil">🔴 Avanzado (+20 pts)</span>'
    : (q.difficulty === 'medio'
        ? '<span class="diff-badge diff-medio">🟡 Intermedio (+15 pts)</span>'
        : '<span class="diff-badge diff-facil">🟢 Básico (+10 pts)</span>');

  panel.innerHTML = `
    <div style="font-size:0.78rem;background:var(--paper-dark);border-left:3px solid var(--grass-dark);padding:6px 10px;border-radius:4px;margin-bottom:10px;color:var(--grass-dark);display:flex;align-items:center;gap:6px;">
      <span>💡</span>
      <span><b>Consejo de campo:</b> ¿Observaste a este animal en el Potrero? ¡Allí revelan secretos que entran en este desafío!</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <div class="quiz-progress">${renderDots(questions, qState)}</div>
      ${diffLabel}
    </div>
    <div class="quiz-q"><b>Pregunta ${idx + 1} de ${questions.length}:</b><br>${q.q}</div>
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
        const ptsVal = q.points || (q.difficulty === 'dificil' ? 20 : (q.difficulty === 'medio' ? 15 : 10));

        if (isCorrect) {
          b.classList.add('correct');
          spawnStarBurst(b);
          state.score += ptsVal;
          qState.scoreEarned = (qState.scoreEarned || 0) + ptsVal;

          // Racha para logro relámpago
          state.streak = (state.streak || 0) + 1;
          if (state.streak >= 3) {
            unlockSecretBadge('relampago');
          }
          // Logro cecotrofia master
          if (q.q && q.q.toLowerCase().includes('cecotrofia')) {
            unlockSecretBadge('cecotrofia_master');
          }

          if (typeof updateHeader === 'function') updateHeader();
          playCorrect();
          bounceSpriteIfPresent(a.id);
        } else {
          b.classList.add('wrong');
          state.streak = 0;
          if (optsBox.children[q.a]) optsBox.children[q.a].classList.add('correct');
          playWrong();
        }

        saveState();
        drawFeedbackAndNext(a, qState, idx, q, isCorrect, feedbackBox, ptsVal);
      });
    }
    optsBox.appendChild(b);
  });

  if (isAnswered) {
    const ptsVal = q.points || (q.difficulty === 'dificil' ? 20 : (q.difficulty === 'medio' ? 15 : 10));
    drawFeedbackAndNext(a, qState, idx, q, qState.results[idx] === true, feedbackBox, ptsVal);
  }
}

function drawFeedbackAndNext(a, qState, idx, q, isCorrect, container, ptsVal) {
  container.innerHTML = '';

  const exp = document.createElement('div');
  exp.className = 'quiz-explain';
  exp.innerHTML = `<b>${isCorrect ? '✨ ¡Correcto!' : 'ℹ️ Explicación formativa:'}</b> ${q.explain}`;
  container.appendChild(exp);

  if (isCorrect) {
    const pts = document.createElement('div');
    pts.className = 'quiz-points';
    pts.innerHTML = `¡Respuesta correcta! Ganaste <b>+${ptsVal || 10} puntos</b> por aprender sobre biología y bienestar animal.`;
    container.appendChild(pts);
  }

  const questions = qState.sampledQuestions || a.quiz || [];
  const isLast = (idx + 1 >= questions.length);
  const next = document.createElement('button');
  next.className = 'quiz-next';
  next.type = 'button';
  next.textContent = isLast ? '🏁 Finalizar y Ver Resultado' : '➡️ Siguiente pregunta';

  next.addEventListener('click', () => {
    qState.index++;
    if (qState.index >= questions.length) {
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

let activeTeacherTab = 'calificaciones';

function renderTeacherPanel() {
  const body = document.getElementById('teacherBody');
  if (!body) return;

  const potreroAnimals = ANIMALS.filter(a => POTRERO_IDS.includes(a.id));
  const potreroCompleted = potreroAnimals.filter(a => state.quiz[a.id] && state.quiz[a.id].completed).length;
  const badgesEarned = state.badges.map(id => BADGES.find(b => b.id === id)).filter(Boolean);

  const mapAnimals = getMapAnimals();
  const mapCompleted = mapAnimals.length > 0 ? mapAnimals.filter(a => state.mapQuiz[a.id] && state.mapQuiz[a.id].completed).length : 0;

  const decimasSugeridas = calculateDecimas(potreroCompleted, mapCompleted);

  // Tab 1: Calificaciones
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
          <thead><tr><th>Animal (Mapa Real)</th><th>Descubierto</th><th>Quiz / Desafío</th></tr></thead>
          <tbody>${mapRows}</tbody>
        </table>
      </div>`;
  }

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

  // Tab 2: Quizzes creados por el profesor
  const quizzesDocente = typeof TeacherQuizzes !== 'undefined' ? TeacherQuizzes.getAll() : {};
  const zonasMap = typeof FARM_ZONES !== 'undefined' ? FARM_ZONES : [];
  const optionsZonas = zonasMap.map(z => `<option value="${z.id}">${z.icon} ${z.label}</option>`).join('');

  let listaQuizzesHtml = '';
  const zonasConQuizzes = Object.keys(quizzesDocente);
  if (zonasConQuizzes.length === 0) {
    listaQuizzesHtml = '<p style="font-size:0.84rem;color:#777;text-align:center;padding:12px;">Aún no se han creado quizzes personalizados.</p>';
  } else {
    zonasConQuizzes.forEach(zId => {
      const zObj = zonasMap.find(z => z.id === zId) || { label: zId, icon: '📍' };
      const arr = quizzesDocente[zId];
      if (arr && arr.length > 0) {
        listaQuizzesHtml += `<div style="font-weight:700;font-size:0.84rem;color:var(--grass-dark);margin:10px 0 4px;">${zObj.icon} ${zObj.label} (${arr.length} preguntas):</div>`;
        arr.forEach((q, qIdx) => {
          listaQuizzesHtml += `
            <div class="quiz-item-row">
              <div style="flex:1;">
                <strong>${q.pregunta}</strong><br>
                <span style="font-size:0.75rem;color:#555;">Correcta: ${q.opciones[q.correcta]} · Bono: +${(q.decimas || 0.3).toFixed(1)} décimas · Por: ${q.profesor || 'Docente'}</span>
              </div>
              <button class="quiz-item-del" data-del-zid="${zId}" data-del-idx="${qIdx}" type="button" title="Eliminar pregunta">✕</button>
            </div>
          `;
        });
      }
    });
  }

  // Tab 3: Métricas
  let respuestasTotales = [];
  try {
    respuestasTotales = JSON.parse(localStorage.getItem('granjaRespuestasQuiz')) || [];
  } catch (e) {}
  const totalCorrectas = respuestasTotales.filter(r => r.correcta).length;
  const pctCorrectas = respuestasTotales.length ? Math.round((totalCorrectas / respuestasTotales.length) * 100) : 0;

  let visitasZonas = {};
  try {
    visitasZonas = JSON.parse(localStorage.getItem('granjaVisitasZonas')) || {};
  } catch (e) {}
  const rankingZonas = Object.entries(visitasZonas).sort((a,b) => b[1]-a[1]).map(([zid, cnt]) => {
    const zObj = zonasMap.find(z => z.id === zid);
    return `<li><b>${zObj ? zObj.label : zid}:</b> ${cnt} visitas</li>`;
  }).join('') || '<li>Sin visitas registradas todavía.</li>';

  const estudiantesRegistrados = typeof Auth !== 'undefined' ? Auth.getEstudiantes() : [];

  body.innerHTML = `
    <div class="teacher-tabs">
      <button class="teacher-tab-btn ${activeTeacherTab === 'calificaciones' ? 'active' : ''}" data-ttab="calificaciones" type="button">📋 Calificaciones</button>
      <button class="teacher-tab-btn ${activeTeacherTab === 'quizzes' ? 'active' : ''}" data-ttab="quizzes" type="button">➕ Crear Quizzes</button>
      <button class="teacher-tab-btn ${activeTeacherTab === 'stats' ? 'active' : ''}" data-ttab="stats" type="button">📊 Métricas del Liceo</button>
    </div>

    <!-- Pestaña 1: Calificaciones -->
    <div id="tabContentCalificaciones" style="${activeTeacherTab === 'calificaciones' ? 'display:block;' : 'display:none;'}">
      <div class="teacher-summary">
        <div class="teacher-chip">Estudiante Activo<br><b>${studentInfoStr}</b></div>
        <div class="teacher-chip">Puntaje Total<br><b>${state.score} pts</b></div>
        <div class="teacher-chip">Potrero (Fichas / Quizzes)<br><b>${discoveredSet.size}/${potreroAnimals.length} · ${potreroCompleted}/${potreroAnimals.length}</b></div>
        <div class="teacher-chip" style="background:#E3F0D8;border-color:var(--grass-dark);">Décimas Sugeridas<br><b style="color:var(--grass-dark);font-size:1.15rem;">${decimasSugeridas} décimas</b></div>
        <div class="teacher-chip">Insignias Obtenidas<br><b>${badgesEarned.length}/${BADGES.length}</b></div>
      </div>

      <div class="teacher-table-wrap">
        <table class="teacher-table">
          <thead><tr><th>Animal (Potrero)</th><th>Descubierto</th><th>Quiz / Desafío</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
      ${mapSection}

      ${profilesListHtml}

      <div class="save-note" style="margin-top:12px;">
        <b>Nota pedagógica:</b> Los puntajes y décimas corresponden a las actividades de aprendizaje práctico según la rúbrica de Go Innova.
        Última actualización: ${updated}.
      </div>

      <div class="teacher-actions" style="margin-top:14px;">
        <button class="tool-btn" id="exportBtn" type="button">⬇️ Descargar informe oficial (.txt)</button>
        <button class="tool-btn" id="newStudentSessionBtn" type="button">👤 Registrar nuevo estudiante</button>
        <button class="tool-btn" id="resetBtn" type="button" style="color:var(--clay);">🔄 Reiniciar datos locales</button>
      </div>
    </div>

    <!-- Pestaña 2: Creador de Quizzes -->
    <div id="tabContentQuizzes" style="${activeTeacherTab === 'quizzes' ? 'display:block;' : 'display:none;'}">
      <div class="quiz-creator-card">
        <h3 style="font-family:'Fraunces',serif;margin:0 0 4px;font-size:1.1rem;color:var(--ink);">Agregar Quiz a una Zona del Mapa</h3>
        <p style="font-size:0.8rem;color:#555;margin-bottom:12px;">Diseña preguntas biológicas o de normas con décimas asignables para motivar a los estudiantes.</p>

        <form id="formTeacherQuizCreator">
          <div class="auth-input-group">
            <label class="auth-label">Zona del Mapa:</label>
            <select class="auth-field" id="tqcZona" required>
              ${optionsZonas}
            </select>
          </div>
          <div class="auth-input-group">
            <label class="auth-label">Pregunta:</label>
            <input class="auth-field" type="text" id="tqcPregunta" placeholder="Escribe la pregunta formativa" required>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
            <div class="auth-input-group" style="margin-bottom:0;">
              <label class="auth-label">Alternativa A:</label>
              <input class="auth-field" type="text" id="tqcOpc0" placeholder="Opción A" required>
            </div>
            <div class="auth-input-group" style="margin-bottom:0;">
              <label class="auth-label">Alternativa B:</label>
              <input class="auth-field" type="text" id="tqcOpc1" placeholder="Opción B" required>
            </div>
            <div class="auth-input-group" style="margin-bottom:0;">
              <label class="auth-label">Alternativa C:</label>
              <input class="auth-field" type="text" id="tqcOpc2" placeholder="Opción C" required>
            </div>
            <div class="auth-input-group" style="margin-bottom:0;">
              <label class="auth-label">Alternativa D:</label>
              <input class="auth-field" type="text" id="tqcOpc3" placeholder="Opción D" required>
            </div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
            <div class="auth-input-group" style="margin-bottom:0;">
              <label class="auth-label">¿Cuál es la correcta?:</label>
              <select class="auth-field" id="tqcCorrecta" required>
                <option value="0">Alternativa A</option>
                <option value="1">Alternativa B</option>
                <option value="2">Alternativa C</option>
                <option value="3">Alternativa D</option>
              </select>
            </div>
            <div class="auth-input-group" style="margin-bottom:0;">
              <label class="auth-label">Décimas al acertar:</label>
              <input class="auth-field" type="number" step="0.1" min="0.1" max="1.0" id="tqcDecimas" value="0.3" required>
            </div>
          </div>
          <button class="tool-btn" type="submit" style="width:100%;padding:10px;background:var(--grass-dark);color:#fff;font-weight:700;">
            ➕ Publicar Quiz en el Mapa
          </button>
        </form>
      </div>

      <div style="background:#fff;border:2px solid var(--ink);border-radius:8px;padding:12px;">
        <h4 style="font-family:'Fraunces',serif;margin:0 0 8px;font-size:1rem;color:var(--ink);">Quizzes Publicados en el Mapa</h4>
        ${listaQuizzesHtml}
      </div>
    </div>

    <!-- Pestaña 3: Métricas del Liceo -->
    <div id="tabContentStats" style="${activeTeacherTab === 'stats' ? 'display:block;' : 'display:none;'}">
      <div class="teacher-summary">
        <div class="teacher-chip">Alumnos Registrados<br><b>${estudiantesRegistrados.length}</b></div>
        <div class="teacher-chip">Respuestas en Quizzes<br><b>${respuestasTotales.length}</b></div>
        <div class="teacher-chip">Porcentaje de Aciertos<br><b>${pctCorrectas}%</b></div>
        <div class="teacher-chip">Zonas Activas con Quiz<br><b>${zonasConQuizzes.length} zonas</b></div>
      </div>

      <div style="background:#fff;border:2px solid var(--ink);border-radius:8px;padding:12px;margin-bottom:12px;">
        <h4 style="font-family:'Fraunces',serif;margin:0 0 6px;font-size:0.95rem;color:var(--ink);">🗺️ Zonas más visitadas por los estudiantes</h4>
        <ul style="font-size:0.84rem;line-height:1.6;margin:0;padding-left:18px;">
          ${rankingZonas}
        </ul>
      </div>

      <div style="background:#fff;border:2px solid var(--ink);border-radius:8px;padding:12px;">
        <h4 style="font-family:'Fraunces',serif;margin:0 0 6px;font-size:0.95rem;color:var(--ink);">👥 Estudiantes en el Sistema</h4>
        <div style="display:flex;flex-direction:column;gap:6px;max-height:160px;overflow-y:auto;">
          ${estudiantesRegistrados.map(e => `
            <div style="display:flex;justify-content:space-between;padding:6px 8px;background:var(--paper-dark);border-radius:4px;font-size:0.8rem;">
              <span><b>${e.nombre}</b> (${e.curso || 'Sin curso'})</span>
              <span style="color:#666;">${e.correo}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;

  // Cambiar pestañas
  body.querySelectorAll('.teacher-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTeacherTab = btn.dataset.ttab;
      renderTeacherPanel();
    });
  });

  // Eventos de Tab 1
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportReport);

  const newStudentBtn = document.getElementById('newStudentSessionBtn');
  if (newStudentBtn) {
    newStudentBtn.addEventListener('click', () => {
      closeOverlayId('teacherOverlay');
      if (typeof Auth !== 'undefined') {
        Auth.cerrarModales();
        document.getElementById('authStudentModal').classList.add('active');
      }
    });
  }

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

  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Deseas reiniciar los datos locales de este navegador?')) {
        resetState();
      }
    });
  }

  // Eventos de Tab 2: Crear Quiz
  const formCreator = document.getElementById('formTeacherQuizCreator');
  if (formCreator) {
    formCreator.addEventListener('submit', (e) => {
      e.preventDefault();
      const zId = document.getElementById('tqcZona').value;
      const preg = document.getElementById('tqcPregunta').value;
      const opc = [
        document.getElementById('tqcOpc0').value,
        document.getElementById('tqcOpc1').value,
        document.getElementById('tqcOpc2').value,
        document.getElementById('tqcOpc3').value,
      ];
      const corr = document.getElementById('tqcCorrecta').value;
      const dec = document.getElementById('tqcDecimas').value;
      const ses = typeof Auth !== 'undefined' ? Auth.getSesion() : { nombre: 'Profesor/a B-13' };

      if (typeof TeacherQuizzes !== 'undefined') {
        const res = TeacherQuizzes.add(zId, preg, opc, corr, dec, ses.nombre);
        if (!res.ok) {
          alert(res.error);
          return;
        }
        showToast('¡Quiz publicado en el mapa con éxito!');
        renderTeacherPanel();
        if (typeof renderMapPins === 'function') renderMapPins();
      }
    });
  }

  // Eventos de eliminar pregunta
  body.querySelectorAll('.quiz-item-del').forEach(btn => {
    btn.addEventListener('click', () => {
      const zId = btn.dataset.delZid;
      const idx = parseInt(btn.dataset.delIdx, 10);
      if (confirm('¿Eliminar esta pregunta del mapa?')) {
        if (typeof TeacherQuizzes !== 'undefined') {
          TeacherQuizzes.remove(zId, idx);
          renderTeacherPanel();
          if (typeof renderMapPins === 'function') renderMapPins();
        }
      }
    });
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
  lines.push('        LA GRANJA B13 — INFORME DE ACTIVIDADES Y LOGROS        ');
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
  lines.push('  Puntaje Total Acumulado:      ' + state.score + ' pts');
  lines.push('  Décimas de Aprendizaje:       ' + decimasSugeridas + ' décimas');
  lines.push('  Insignias de Logro:           ' + state.badges.length + ' / ' + BADGES.length);
  lines.push('');
  lines.push('DETALLE DE ACTIVIDADES — POTRERO:');
  potreroAnimals.forEach(a => {
    const q = state.quiz[a.id] || { results: [], completed: false };
    const correct = (q.results || []).filter(Boolean).length;
    const status = q.completed ? `Completado (${correct}/${a.quiz.length} correctas)` : 'Pendiente';
    lines.push(`  - [${a.defaultName}]: Descubierto=${discoveredSet.has(a.id) ? 'SÍ' : 'NO'} | Quiz=${status}`);
  });

  if (mapAnimals.length > 0) {
    lines.push('');
    lines.push('DETALLE DE ACTIVIDADES — MAPA REAL DE LA GRANJA:');
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
  aTag.download = `informe-granja-b13-${fileNameClean}.txt`;
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

function onStudentPillClick() {
  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };
  if (sesion.rol === 'estudiante') {
    openStudentModal();
  } else if (sesion.rol === 'visita') {
    if (typeof volverAlEspacioModos === 'function') {
      volverAlEspacioModos();
    } else if (typeof volverAlInicio === 'function') {
      volverAlInicio();
    }
  } else if (sesion.rol === 'profesor') {
    renderTeacherPanel();
    openOverlayId('teacherOverlay');
  } else if (sesion.rol === 'admin') {
    const adminScreen = document.getElementById('adminScreen');
    if (adminScreen) {
      adminScreen.hidden = false;
      const appContainer = document.querySelector('.app');
      if (appContainer) appContainer.style.display = 'none';
      if (typeof renderizarEstadisticasAdmin === 'function') renderizarEstadisticasAdmin();
    }
  }
}

const changeStudentBtn = document.getElementById('changeStudentBtn');
if (changeStudentBtn) {
  changeStudentBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    onStudentPillClick();
  });
}

const studentPill = document.getElementById('studentPill');
if (studentPill) {
  studentPill.addEventListener('click', onStudentPillClick);
}

const btnOverlayCambiarModo = document.getElementById('btnOverlayCambiarModo');
if (btnOverlayCambiarModo) {
  btnOverlayCambiarModo.addEventListener('click', (e) => {
    e.preventDefault();
    closeAllModals();
    if (typeof volverAlEspacioModos === 'function') {
      volverAlEspacioModos();
    } else if (typeof volverAlInicio === 'function') {
      volverAlInicio();
    }
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
    const sesion = (typeof Auth !== 'undefined') ? Auth.getSesion() : null;
    if (!sesion || (sesion.rol !== 'profesor' && sesion.rol !== 'admin')) {
      if (typeof Auth !== 'undefined') Auth.mostrarNotificacion('El panel docente requiere acceso de profesor.');
      return;
    }
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

// Solo abrir modal de bienvenida si el rol activo es ESTUDIANTE y no tiene nombre guardado
const sesionActual = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : null;
if (sesionActual && sesionActual.rol === 'estudiante' && (!state.studentName || state.studentName.trim() === '')) {
  setTimeout(() => {
    openStudentModal();
  }, 500);
}
