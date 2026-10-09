/*
  perfil-app.js — Lógica de la vista dedicada "Cuaderno de Campo & Perfil" (perfil.html).
  Controla la edición de datos estudiantiles con límite de 2 cambios,
  título honorífico desbloqueable por mérito, personalización de avatar/accesorio,
  personalización del color de fondo con contraste inteligente, vitrina de logros,
  diploma de certificado oficial firmado y cuaderno de pistas descubiertas.
*/

(function() {
  'use strict';

  // 1. Inicializar autenticación y estado del estudiante
  if (typeof Auth !== 'undefined' && typeof Auth.init === 'function') {
    Auth.init();
  }

  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function')
    ? Auth.getSesion()
    : { rol: 'estudiante', nombre: 'Estudiante Demo', curso: '2°B' };

  // Asegurar que el estado esté sincronizado con la sesión
  if (typeof state === 'undefined' || !state) {
    if (typeof loadState === 'function') {
      loadState();
    }
  }

  if (sesion && sesion.nombre && (!state.studentName || state.studentName === '')) {
    state.studentName = sesion.nombre;
    state.studentGrade = sesion.curso || state.studentGrade || '2°B';
  }

  // Constantes de configuración
  const MAX_NAME_CHANGES = 2;
  let tempAvatar = state.avatarIcon || '🧑‍🌾';
  let tempFrame = state.avatarColor || '#ffd83d';
  let tempTitle = state.studentTitle || 'Explorador/a de Granja';
  if (tempTitle === 'Explorador/a de Campo') tempTitle = 'Explorador/a de Granja';
  let tempThemeBg = state.themeBg || localStorage.getItem('granja_theme_bg') || '#FAF7EE';
  let tempThemeMode = state.themeMode || 'light';

  // 2. Control de Pestañas (Tabs)
  const tabButtons = document.querySelectorAll('.perfil-tab-btn');
  const tabSections = {
    perfil: document.getElementById('tabSecPerfil'),
    logros: document.getElementById('tabSecLogros'),
    certificado: document.getElementById('tabSecCertificado'),
    pistas: document.getElementById('tabSecPistas')
  };

  function switchTab(tabId) {
    tabButtons.forEach(b => {
      if (b.dataset.tab === tabId) b.classList.add('active');
      else b.classList.remove('active');
    });

    Object.keys(tabSections).forEach(key => {
      const sec = tabSections[key];
      if (sec) {
        sec.style.display = (key === tabId) ? 'block' : 'none';
      }
    });

    try {
      history.replaceState(null, '', '#' + tabId);
    } catch (e) {}
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Si la URL contiene hash (#logros, #certificado, #pistas), abrir la pestaña correspondiente
  const currentHash = (window.location.hash || '').replace('#', '').toLowerCase();
  if (currentHash && tabSections[currentHash]) {
    switchTab(currentHash);
  }

  // 3. Renderizar Header y Credencial en vivo
  function renderLiveHeaderAndBadge() {
    const scoreEl = document.getElementById('score');
    const badgesEl = document.getElementById('badgesCount');
    const secretsEl = document.getElementById('secretsCount');

    const purePts = (typeof computePureScore === 'function')
      ? computePureScore(state)
      : (state.pureScore || state.score || 0);

    const bCount = (state.badges || []).length;
    const sCount = (state.secretBadges || []).length;

    if (scoreEl) scoreEl.textContent = purePts;
    if (badgesEl) badgesEl.textContent = bCount;
    if (secretsEl) secretsEl.textContent = sCount;

    // Credencial en vivo
    const liveAvatar = document.getElementById('liveAvatarPreview');
    const liveTitle = document.getElementById('liveTitlePreview');
    const liveName = document.getElementById('liveNamePreview');
    const liveGrade = document.getElementById('liveGradePreview');
    const liveScore = document.getElementById('liveScorePreview');

    if (liveAvatar) {
      liveAvatar.textContent = tempAvatar;
      liveAvatar.style.borderColor = tempFrame;
    }
    if (liveTitle) liveTitle.textContent = tempTitle;
    if (liveName) liveName.textContent = state.studentName || 'Estudiante Sin Registrar';
    if (liveGrade) liveGrade.textContent = `Curso: ${state.studentGrade || sesion.curso || '2°B'}`;
    if (liveScore) liveScore.textContent = `${purePts} pts`;
  }

  // 4. Formulario de Datos: Nombre (2 cambios) y Curso fijo
  function renderProfileForm() {
    const nameInput = document.getElementById('pageStudentNameInput');
    const gradeInput = document.getElementById('pageStudentGradeInput');
    const badgeEl = document.getElementById('pageNameChangeBadge');
    const helpEl = document.getElementById('pageNameHelp');

    const changesDone = typeof state.nameChangesCount === 'number' ? state.nameChangesCount : 0;
    const changesLeft = Math.max(0, MAX_NAME_CHANGES - changesDone);
    const isLocked = changesLeft <= 0;

    if (nameInput) {
      nameInput.value = state.studentName || '';
      if (isLocked) {
        nameInput.readOnly = true;
        nameInput.style.background = '#f1f5f9';
        nameInput.style.cursor = 'not-allowed';
        nameInput.style.color = '#64748b';
      }
    }

    if (gradeInput) {
      gradeInput.value = state.studentGrade || sesion.curso || '2°B';
    }

    if (badgeEl) {
      if (isLocked) {
        badgeEl.textContent = '🔒 Límite de 2 cambios alcanzado';
        badgeEl.style.background = '#ffebee';
        badgeEl.style.color = '#c62828';
        badgeEl.style.borderColor = '#ef9a9a';
      } else {
        badgeEl.textContent = `✏️ ${changesLeft} de ${MAX_NAME_CHANGES} cambios disponibles`;
        badgeEl.style.background = '#e8f5e9';
        badgeEl.style.color = '#2e7d32';
        badgeEl.style.borderColor = '#a5d6a7';
      }
    }

    if (helpEl) {
      helpEl.textContent = isLocked
        ? '🔒 Has agotado los 2 cambios de nombre oficiales permitidos.'
        : `ℹ️ Puedes cambiar tu nombre oficial ${changesLeft} vez más antes de que quede fijado definitivamente.`;
    }

    // Reglas de títulos honoríficos
    const potreroCount = Object.keys(state.quiz || {}).filter(k => state.quiz[k] && state.quiz[k].completed).length;
    const isBirdUnlocked = !!(state.discovered && (state.discovered.includes('agapornis') || state.discovered.includes('catita') || state.discovered.includes('gallina')));
    const isRabbitUnlocked = !!(state.discovered && state.discovered.includes('conejo'));
    const isBioUnlocked = (state.pureScore || 0) >= 30 || potreroCount >= 3;
    const isSciUnlocked = (state.pureScore || 0) >= 60;
    const isVetUnlocked = (state.badges && state.badges.includes('veterinario')) || (state.organsInspected && state.organsInspected.length >= 3);
    const isGuardianUnlocked = !!state.certificateUnlocked || (state.badges && state.badges.includes('guardian')) || potreroCount >= 5;

    const TITLE_RULES = {
      'Explorador/a de Granja': { unlocked: true, hint: 'Inicial' },
      'Observador/a de Aves': { unlocked: isBirdUnlocked, hint: 'Explora aves o aviario' },
      'Amigo/a de los Conejos': { unlocked: isRabbitUnlocked, hint: 'Explora la conejera' },
      'Protector/a de la Biodiversidad': { unlocked: isBioUnlocked, hint: '30+ pts en quizzes' },
      'Científico/a Juvenil B-13': { unlocked: isSciUnlocked, hint: '60+ pts en quizzes' },
      'Veterinario/a Honorífico/a': { unlocked: isVetUnlocked, hint: 'Inspecciona anatomía' },
      'Guardián/a de la Granja': { unlocked: isGuardianUnlocked, hint: 'Diploma oficial B-13' }
    };

    const titleSel = document.getElementById('pageStudentTitleSelect');
    if (titleSel) {
      titleSel.innerHTML = (typeof STUDENT_TITLES !== 'undefined' ? STUDENT_TITLES : [
        'Explorador/a de Granja', 'Observador/a de Aves', 'Amigo/a de los Conejos',
        'Protector/a de la Biodiversidad', 'Científico/a Juvenil B-13',
        'Veterinario/a Honorífico/a', 'Guardián/a de la Granja'
      ]).map(t => {
        const rule = TITLE_RULES[t] || { unlocked: true };
        if (rule.unlocked || t === tempTitle) {
          return `<option value="${t}" ${t === tempTitle ? 'selected' : ''}>🎖️ ${t}</option>`;
        } else {
          return `<option value="${t}" disabled style="color:#94a3b8;">🔒 ${t} (${rule.hint})</option>`;
        }
      }).join('');

      titleSel.addEventListener('change', () => {
        tempTitle = titleSel.value;
        renderLiveHeaderAndBadge();
      });
    }

    // Avatar y categorías
    renderAvatarPicker();
    renderFramePicker();
  }

  // 5. Selector de Avatar con categorías
  function renderAvatarPicker() {
    const grid = document.getElementById('pageAvatarGrid');
    const catBar = document.getElementById('pageAvatarCatBar');
    if (!grid) return;

    const avatars = (typeof STUDENT_AVATARS !== 'undefined') ? STUDENT_AVATARS : [
      { icon: '🧑‍🌾', name: 'Granjero/a', desc: 'Cuidador general', category: 'fauna' },
      { icon: '🐰', name: 'Conejo', desc: 'Amigo de los saltos', category: 'fauna' },
      { icon: '🐔', name: 'Gallina', desc: 'Ponedora feliz', category: 'fauna' },
      { icon: '🐓', name: 'Gallo', desc: 'Centinela', category: 'fauna' },
      { icon: '🦆', name: 'Pato', desc: 'Buzo del estanque', category: 'fauna' },
      { icon: '🦜', name: 'Agapornis', desc: 'Inseparable', category: 'fauna' },
      { icon: '🌸', name: 'Flor Rosa', desc: 'Naturaleza viva', category: 'fem' },
      { icon: '🎀', name: 'Moño Rosa', desc: 'Detalle de gala', category: 'fem' },
      { icon: '🧢', name: 'Gorra', desc: 'Explorador', category: 'masc' },
      { icon: '🤠', name: 'Sombrero', desc: 'Vaquero de campo', category: 'masc' }
    ];

    grid.innerHTML = avatars.map(av => `
      <button type="button" class="avatar-picker-btn ${av.icon === tempAvatar ? 'selected' : ''}" data-icon="${av.icon}" data-cat="${av.category || 'fauna'}" title="${av.name} — ${av.desc}" style="background:#fff;border:2px solid ${av.icon === tempAvatar ? 'var(--grass-dark)' : '#cbd5e1'};border-radius:10px;padding:8px 4px;font-size:1.8rem;cursor:pointer;display:flex;flex-direction:column;align-items:center;transition:all 0.15s ease;">
        <span>${av.icon}</span>
        <span style="font-size:0.68rem;font-weight:700;color:#334155;margin-top:4px;text-align:center;line-height:1;width:100%;overflow:hidden;text-overflow:ellipsis;">${av.name.split(' ')[0]}</span>
      </button>
    `).join('');

    function filterAvatars(cat) {
      grid.querySelectorAll('.avatar-picker-btn').forEach(btn => {
        const match = (cat === 'all' || btn.dataset.cat === cat);
        btn.style.display = match ? 'flex' : 'none';
      });
    }
    filterAvatars('fauna');

    if (catBar) {
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
    }

    grid.querySelectorAll('.avatar-picker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        grid.querySelectorAll('.avatar-picker-btn').forEach(b => {
          b.classList.remove('selected');
          b.style.borderColor = '#cbd5e1';
        });
        btn.classList.add('selected');
        btn.style.borderColor = 'var(--grass-dark)';
        tempAvatar = btn.dataset.icon;
        renderLiveHeaderAndBadge();
      });
    });
  }

  // 6. Selector de Marcos
  function renderFramePicker() {
    const row = document.getElementById('pageFrameRow');
    if (!row) return;

    const frames = (typeof AVATAR_FRAMES !== 'undefined') ? AVATAR_FRAMES : [
      { color: '#ffd83d', name: 'Oro de Granja' },
      { color: '#3B5832', name: 'Verde Ecosistema' },
      { color: '#74B9E6', name: 'Cielo Antofagasta' },
      { color: '#f43f5e', name: 'Rojo Carmesí' },
      { color: '#a855f7', name: 'Púrpura Místico' },
      { color: '#1a1a1a', name: 'Azabache Nocturno' }
    ];

    row.innerHTML = frames.map(f => `
      <button type="button" class="frame-picker-btn" data-color="${f.color}" title="${f.name}" style="background:${f.color};width:36px;height:36px;border-radius:50%;border:3px solid ${f.color === tempFrame ? '#1a1a1a' : '#fff'};box-shadow:0 2px 6px rgba(0,0,0,0.2);cursor:pointer;position:relative;display:inline-flex;align-items:center;justify-content:center;">
        ${f.color === tempFrame ? '<span style="color:#1a1a1a;font-weight:900;font-size:0.85rem;">✓</span>' : ''}
      </button>
    `).join('');

    row.querySelectorAll('.frame-picker-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        tempFrame = btn.dataset.color;
        renderFramePicker();
        renderLiveHeaderAndBadge();
      });
    });
  }

  // 7. Personalización de Fondo & Contraste
  function setupThemeHandlers() {
    const btnLight = document.getElementById('btnPageThemeLight');
    const btnDark = document.getElementById('btnPageThemeDark');
    const palette = document.getElementById('pageThemePalette');
    const customInput = document.getElementById('pageThemeCustomInput');

    function applyTempTheme(mode, bg) {
      tempThemeMode = mode;
      tempThemeBg = bg;
      if (typeof applyGranjaTheme === 'function') {
        applyGranjaTheme(mode, bg);
      }

      if (btnLight && btnDark) {
        if (mode === 'dark') {
          btnDark.classList.add('active');
          btnDark.style.borderColor = 'var(--grass-dark)';
          btnDark.style.background = '#1e293b';
          btnDark.style.color = '#fff';

          btnLight.classList.remove('active');
          btnLight.style.borderColor = '#ccc';
          btnLight.style.background = 'transparent';
        } else {
          btnLight.classList.add('active');
          btnLight.style.borderColor = 'var(--grass-dark)';
          btnLight.style.background = '#fff';

          btnDark.classList.remove('active');
          btnDark.style.borderColor = '#ccc';
          btnDark.style.background = 'transparent';
          btnDark.style.color = 'inherit';
        }
      }

      if (palette) {
        palette.querySelectorAll('.theme-swatch-btn').forEach(b => {
          b.classList.toggle('selected', b.dataset.color.toLowerCase() === bg.toLowerCase());
          b.style.borderColor = (b.dataset.color.toLowerCase() === bg.toLowerCase()) ? '#1a1a1a' : '#bbb';
        });
      }
      if (customInput) customInput.value = bg;
    }

    if (btnLight) {
      btnLight.addEventListener('click', () => applyTempTheme('light', '#FAF7EE'));
    }
    if (btnDark) {
      btnDark.addEventListener('click', () => applyTempTheme('dark', '#151C14'));
    }

    if (palette) {
      palette.querySelectorAll('.theme-swatch-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const color = btn.dataset.color;
          const isDark = (color === '#151C14');
          applyTempTheme(isDark ? 'dark' : 'light', color);
        });
      });
    }

    if (customInput) {
      customInput.addEventListener('input', (e) => {
        const val = e.target.value;
        const lum = (typeof getBgLuminance === 'function') ? getBgLuminance(val) : 0.5;
        applyTempTheme(lum <= 0.38 ? 'dark' : 'light', val);
      });
    }
  }

  // 8. Guardar Perfil con validaciones estrictas y sonido
  const saveBtn = document.getElementById('btnPageSaveProfile');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const nameInput = document.getElementById('pageStudentNameInput');
      const errEl = document.getElementById('pageStudentError');

      const rawName = nameInput ? nameInput.value.trim() : '';
      if (!rawName || rawName.length < 3) {
        if (errEl) {
          errEl.textContent = '⚠️ Ingresa tu nombre y apellido (mínimo 3 caracteres).';
          errEl.style.display = 'block';
        }
        if (nameInput) nameInput.focus();
        return;
      }
      if (/\d/.test(rawName)) {
        if (errEl) {
          errEl.textContent = '⚠️ El nombre no debe contener números.';
          errEl.style.display = 'block';
        }
        if (nameInput) nameInput.focus();
        return;
      }

      if (errEl) errEl.style.display = 'none';

      const oldName = (state.studentName || '').trim();
      const isNameChanged = (oldName !== '' && rawName.toLowerCase() !== oldName.toLowerCase());

      if (isNameChanged) {
        const currentCount = typeof state.nameChangesCount === 'number' ? state.nameChangesCount : 0;
        if (currentCount >= MAX_NAME_CHANGES) {
          if (errEl) {
            errEl.textContent = '🔒 Has alcanzado el límite máximo de 2 cambios de nombre.';
            errEl.style.display = 'block';
          }
          if (nameInput) nameInput.value = oldName;
          return;
        }
        state.nameChangesCount = currentCount + 1;
        if (typeof renameStudent === 'function') {
          renameStudent(oldName, state.studentGrade, rawName, state.studentGrade);
        }
      }

      state.studentName = rawName;
      state.avatarIcon = tempAvatar;
      state.avatarColor = tempFrame;
      state.studentTitle = tempTitle;
      state.themeMode = tempThemeMode;
      state.themeBg = tempThemeBg;

      // Sincronizar en Auth
      if (typeof Auth !== 'undefined') {
        const s = Auth.getSesion();
        if (s && s.rol === 'estudiante') {
          s.nombre = rawName;
          s.nameChangesCount = state.nameChangesCount || 0;
          localStorage.setItem('granjaSesion', JSON.stringify(s));
        }
        const estudiantes = Auth.getEstudiantes();
        let mod = false;
        estudiantes.forEach(est => {
          if (est.nombre && (est.nombre.toLowerCase() === oldName.toLowerCase() || est.nombre.toLowerCase() === rawName.toLowerCase())) {
            est.nombre = rawName;
            est.nameChangesCount = state.nameChangesCount || 0;
            mod = true;
          }
        });
        if (mod) Auth.guardarEstudiantes(estudiantes);
      }

      if (typeof saveState === 'function') saveState();

      renderLiveHeaderAndBadge();
      renderProfileForm();

      if (typeof AudioFX !== 'undefined' && typeof AudioFX.coin === 'function') {
        AudioFX.coin();
      }

      // Mostrar toast de éxito
      if (typeof showToast === 'function') {
        showToast('✅ ¡Cambios de perfil guardados correctamente en tu cuenta escolar!');
      } else if (typeof Auth !== 'undefined' && typeof Auth.mostrarNotificacion === 'function') {
        Auth.mostrarNotificacion('✅ ¡Cambios guardados en tu perfil escolar!');
      } else {
        alert('✅ ¡Cambios guardados con éxito!');
      }
    });
  }

  // 9. Vitrina de Logros Oficiales & Secretos
  function renderBadgesShowcase() {
    const badgesGrid = document.getElementById('pageBadgesGrid');
    const secretGrid = document.getElementById('pageSecretBadgesGrid');
    if (!badgesGrid || !secretGrid) return;

    const earnedBadges = new Set(state.badges || []);
    const earnedSecrets = new Set(state.secretBadges || []);

    const allBadges = (typeof BADGES !== 'undefined') ? BADGES : [];
    const allSecretBadges = (typeof SECRET_BADGES !== 'undefined') ? SECRET_BADGES : [];

    badgesGrid.innerHTML = allBadges.map(b => {
      const isUnlocked = earnedBadges.has(b.id);
      return `
        <div class="badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-item-icon">${isUnlocked ? b.icon : '🔒'}</div>
          <div>
            <div style="font-weight:800;font-size:0.9rem;color:${isUnlocked ? '#1e293b' : '#64748b'};">
              ${b.label}
            </div>
            <div style="font-size:0.75rem;color:#64748b;margin-top:2px;line-height:1.3;">
              ${b.desc}
            </div>
            <div style="font-size:0.7rem;font-weight:700;margin-top:4px;color:${isUnlocked ? '#16a34a' : '#94a3b8'};">
              ${isUnlocked ? '✓ Obtenido' : 'Por desbloquear'}
            </div>
          </div>
        </div>
      `;
    }).join('');

    secretGrid.innerHTML = allSecretBadges.map(sb => {
      const isUnlocked = earnedSecrets.has(sb.id);
      return `
        <div class="badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}">
          <div class="badge-item-icon">${isUnlocked ? sb.icon : '❓'}</div>
          <div>
            <div style="font-weight:800;font-size:0.9rem;color:${isUnlocked ? '#b45309' : '#64748b'};">
              ${isUnlocked ? sb.label : 'Misterio Oculto'}
            </div>
            <div style="font-size:0.75rem;color:#64748b;margin-top:2px;line-height:1.3;">
              ${isUnlocked ? sb.desc : `🔮 <i>"${sb.secretHint || 'Explora rincones secretos de la granja...'}"</i>`}
            </div>
            <div style="font-size:0.7rem;font-weight:700;margin-top:4px;color:${isUnlocked ? '#f59e0b' : '#94a3b8'};">
              ${isUnlocked ? '✨ ¡Descubierto!' : 'Secreto por revelar'}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // 10. Certificado Oficial B-13
  function renderCertificateSection() {
    const container = document.getElementById('certStatusContainer');
    if (!container) return;

    const potreroCount = Object.keys(state.quiz || {}).filter(k => state.quiz[k] && state.quiz[k].completed).length;
    const isEligibleForCert = state.certificateUnlocked ||
      (state.badges && (state.badges.includes('guardian') || state.badges.includes('veterinario'))) ||
      (typeof POTRERO_IDS !== 'undefined' && POTRERO_IDS.every(id => state.quiz[id] && state.quiz[id].completed));

    if (isEligibleForCert && !state.certificateUnlocked) {
      state.certificateUnlocked = true;
      if (!state.certificateCode) {
        state.certificateCode = `B13-CERT-2026-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        state.certificateIssuedAt = Date.now();
      }
      if (typeof unlockSecretBadge === 'function') unlockSecretBadge('cert_unlocked');
      if (typeof saveState === 'function') saveState();
    }

    if (isEligibleForCert) {
      const certDate = new Date(state.certificateIssuedAt || Date.now()).toLocaleDateString('es-CL', {
        day: 'numeric', month: 'long', year: 'numeric'
      });
      const certCode = state.certificateCode || 'B13-CERT-2026-OFICIAL';

      container.innerHTML = `
        <div class="cert-preview-frame">
          <div style="font-size:3rem;margin-bottom:8px;">🎓</div>
          <div style="font-size:0.85rem;font-weight:800;letter-spacing:0.08em;color:#92400e;text-transform:uppercase;">
            LICEO DOMINGO HERRERA RIVERA B-13 · ANTOFAGASTA
          </div>
          <h1 style="font-family:'Fraunces',serif;font-size:1.85rem;margin:8px 0;color:#78350f;">
            Certificado de Honor y Sabiduría de Campo
          </h1>
          <p style="font-size:0.95rem;color:#451a03;line-height:1.5;max-width:680px;margin:12px auto;">
            Se otorga la presente distinción oficial con validez pedagógica a:
          </p>
          <div style="font-family:'Fraunces',serif;font-size:1.95rem;font-weight:800;color:#1e3a8a;margin:10px 0;text-decoration:underline;">
            ${state.studentName || 'Estudiante B-13'}
          </div>
          <p style="font-size:0.9rem;color:#451a03;line-height:1.5;max-width:700px;margin:10px auto;">
            Por haber completado con excelencia el recorrido de observación de campo, aprendizaje interactivo,
            quizzes formativos y el compromiso de cuidado y bienestar animal con apego al ODS 15.
          </p>
          <div style="display:flex;justify-content:space-around;margin-top:24px;border-top:1.5px dashed #d97706;padding-top:16px;flex-wrap:wrap;gap:16px;">
            <div>
              <div style="font-size:0.78rem;color:#78350f;"><b>Fecha de Emisión:</b> ${certDate}</div>
              <div style="font-size:0.75rem;font-family:'Space Mono',monospace;color:#92400e;"><b>Código:</b> ${certCode}</div>
            </div>
            <div>
              <div style="font-size:0.82rem;font-weight:700;color:#1e293b;">Prof. Encargado de Granja</div>
              <div style="font-size:0.75rem;color:#64748b;">Comité de Medioambiente B-13</div>
            </div>
          </div>

          <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <button type="button" id="btnPrintCert" class="tool-btn" style="padding:10px 20px;background:#15803d;color:#fff;font-weight:800;font-size:0.92rem;border:2px solid #14532d;border-radius:8px;cursor:pointer;">
              🖨️ Imprimir / Guardar en PDF
            </button>
          </div>
        </div>
      `;

      const printBtn = document.getElementById('btnPrintCert');
      if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
      }
    } else {
      container.innerHTML = `
        <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:30px;text-align:center;">
          <div style="font-size:3.5rem;opacity:0.6;margin-bottom:10px;">🔒</div>
          <h3 style="font-family:'Fraunces',serif;color:#1e293b;font-size:1.3rem;margin:0 0 8px;">
            Certificado Oficial en Progreso
          </h3>
          <p style="font-size:0.9rem;color:#64748b;max-width:560px;margin:0 auto 16px;line-height:1.5;">
            Para desbloquear y emitir tu diploma oficial con firma digital del Liceo, debes completar los quizzes de los 5 animales principales del potrero o resolver los desafíos del mapa.
          </p>
          <div style="display:inline-flex;gap:10px;flex-wrap:wrap;justify-content:center;">
            <a href="index.html" class="tool-btn" style="text-decoration:none;padding:10px 18px;background:var(--grass-dark);color:#fff;font-weight:800;border-radius:8px;">
              🌾 Ir al Potrero a completar Quizzes
            </a>
            <a href="mapa.html" class="tool-btn" style="text-decoration:none;padding:10px 18px;background:var(--hay);color:var(--ink);font-weight:800;border-radius:8px;">
              🗺️ Explorar Mapa 3D
            </a>
          </div>
        </div>
      `;
    }
  }

  // 11. Cuaderno de Pistas de Campo
  function renderCluesSection() {
    const list = document.getElementById('pageCluesList');
    if (!list) return;

    // Recuperar banco de pistas descubierto
    let allClues = [];
    if (typeof CLUES_BANK !== 'undefined' && Array.isArray(CLUES_BANK)) {
      allClues = CLUES_BANK;
    }

    if (allClues.length === 0) {
      list.innerHTML = `
        <div style="text-align:center;padding:24px;color:#64748b;">
          <span>🌾</span>
          <p>Aún no has registrado pistas en tu cuaderno. Juega en la carrera o responde quizzes para anotar observaciones.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = allClues.map((clue, idx) => `
      <div class="clue-item-card">
        <span style="font-size:1.4rem;">📜</span>
        <div style="flex:1;">
          <div style="font-weight:800;font-size:0.88rem;color:var(--ink);">
            Pista de Campo #${idx + 1}
          </div>
          <div style="font-size:0.82rem;color:#444;margin-top:2px;line-height:1.4;">
            ${clue}
          </div>
        </div>
      </div>
    `).join('');
  }

  // 12. Cerrar sesión
  const logoutBtn = document.getElementById('navBtnCambiarModo');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (typeof Auth !== 'undefined' && typeof Auth.cerrarSesion === 'function') {
        Auth.cerrarSesion();
      } else {
        localStorage.removeItem('granjaSesion');
        window.location.href = 'login.html';
      }
    });
  }

  // Inicializar todo
  renderLiveHeaderAndBadge();
  renderProfileForm();
  setupThemeHandlers();
  renderBadgesShowcase();
  renderCertificateSection();
  renderCluesSection();

})();
