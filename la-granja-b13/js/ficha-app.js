/*
  ficha-app.js — Controlador de la Vista Dedicada y Completa de la Ficha del Animal
  Proporciona una experiencia de aprendizaje espaciosa, moderna y pedagógica
  reemplazando el modal superpuesto por una enciclopedia completa con pestañas.
*/

(function() {
  'use strict';

  // Lista consolidada de animales oficiales del Liceo B-13 (23 ejemplares reales)
  function getAllSpeciesList() {
    const list = [];
    const seen = new Set();

    // 1. Animales específicos del Liceo B-13 (los 23 ejemplares oficiales de los pósters)
    if (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) {
      MAP_ANIMALS.forEach(a => {
        if (!seen.has(a.id)) {
          seen.add(a.id);
          list.push(a);
        }
      });
    }

    // 2. Animales del Potrero principal (especies generales de soporte)
    if (typeof ANIMALS !== 'undefined' && Array.isArray(ANIMALS)) {
      ANIMALS.forEach(a => {
        if (!seen.has(a.id)) {
          seen.add(a.id);
          list.push(a);
        }
      });
    }

    return list;
  }

  function getQueryParam(key) {
    const params = new URLSearchParams(window.location.search);
    return params.get(key);
  }

  let currentAnimal = null;
  let currentTab = 'facts';
  let currentCategory = 'all';
  const fromParam = getQueryParam('from') || 'index.html';
  const initialId = getQueryParam('id') || 'nesquik';

  function init() {
    setupBackButton();
    setupRibbon();
    setupTabSwitching();

    const allSpecies = getAllSpeciesList();
    let initialAnimal = allSpecies.find(x => x.id === initialId);
    if (!initialAnimal) {
      initialAnimal = allSpecies.find(x => x.species === initialId) || allSpecies[0];
    }

    if (initialAnimal) {
      loadAnimal(initialAnimal, false);
    }
  }

  function setupBackButton() {
    const btn = document.getElementById('fichaNavBackBtn');
    const textEl = document.getElementById('fichaNavBackText');
    if (!btn) return;

    if (fromParam.includes('mapa')) {
      btn.href = 'mapa.html';
      if (textEl) textEl.textContent = 'Volver al Mapa 3D';
    } else if (fromParam.includes('juegos')) {
      btn.href = 'juegos.html';
      if (textEl) textEl.textContent = 'Volver a los Minijuegos';
    } else {
      btn.href = 'index.html';
      if (textEl) textEl.textContent = 'Volver al Potrero';
    }
  }

  function setupRibbon() {
    const catBtns = document.querySelectorAll('#fichaCategoryBar .ficha-cat-btn');
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat || 'all';
        renderRibbonButtons();
      });
    });

    renderRibbonButtons();
  }

  function renderRibbonButtons() {
    const ribbon = document.getElementById('fichaSpeciesRibbon');
    if (!ribbon) return;

    const allSpecies = getAllSpeciesList();
    const filtered = allSpecies.filter(a => {
      if (currentCategory === 'all') return true;
      if (a.group) return a.group === currentCategory;
      if (currentCategory === 'conejos') return a.id.includes('conejo') || a.species === 'conejo';
      if (currentCategory === 'gallinas') return a.id.includes('gallo') || a.id.includes('gallina');
      if (currentCategory === 'loros') return a.id.includes('catita') || a.id.includes('agapornis');
      if (currentCategory === 'patos') return a.id.includes('pato');
      return true;
    });

    ribbon.innerHTML = filtered.map(a => {
      const isCur = currentAnimal ? (a.id === currentAnimal.id) : (a.id === initialId);
      const thumbHtml = a.photo
        ? `<img src="${a.photo}" alt="${a.name}" class="ficha-species-btn-thumb">`
        : `<span class="ficha-species-btn-emoji">${a.emoji || '🐾'}</span>`;
      return `
        <button type="button" class="ficha-species-btn ${isCur ? 'active' : ''}" data-id="${a.id}">
          ${thumbHtml}
          <span>${a.name}</span>
        </button>
      `;
    }).join('');

    ribbon.querySelectorAll('.ficha-species-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const target = allSpecies.find(x => x.id === id);
        if (target) {
          ribbon.querySelectorAll('.ficha-species-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          loadAnimal(target, true);
        }
      });
    });
  }

  function setupTabSwitching() {
    const tabBtns = document.querySelectorAll('#fichaMainTabs .ficha-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchFichaTab(tab);
      });
    });
  }

  function switchFichaTab(tab) {
    currentTab = tab;
    document.querySelectorAll('#fichaMainTabs .ficha-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tab);
    });

    const panels = {
      facts: document.getElementById('panelFichaFacts'),
      jokes: document.getElementById('panelFichaJokes'),
      anatomy: document.getElementById('panelFichaAnatomy'),
      accessories: document.getElementById('panelFichaAccessories'),
      quiz: document.getElementById('panelFichaQuiz')
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) panels[k].style.display = (k === tab) ? 'block' : 'none';
    });

    if (tab === 'quiz' && currentAnimal && typeof renderQuiz === 'function') {
      renderQuiz(currentAnimal);
    }
    if (tab === 'accessories' && currentAnimal && typeof renderPersonalizar === 'function') {
      renderPersonalizar(currentAnimal);
    }
  }

  function loadAnimal(a, updateUrl = true) {
    currentAnimal = a;
    activeAnimal = a; // Sincroniza con card.js

    if (updateUrl && window.history && window.history.pushState) {
      const newUrl = `ficha.html?id=${encodeURIComponent(a.id)}&from=${encodeURIComponent(fromParam)}`;
      window.history.pushState({ id: a.id }, '', newUrl);
    }

    // Registrar en el estado como descubierto
    const isMap = a.store === 'mapQuiz';
    const bucket = isMap ? mapDiscoveredSet : discoveredSet;
    if (!bucket.has(a.id)) {
      bucket.add(a.id);
      if (isMap) state.mapDiscovered = Array.from(mapDiscoveredSet);
      else state.discovered = Array.from(discoveredSet);
      if (typeof updateHeader === 'function') updateHeader();
      if (typeof checkBadges === 'function') checkBadges();
      saveState();
    }

    // === RECOLORIZACIÓN DINÁMICA DEL FONDO SEGÚN EL ANIMAL ===
    const profile = (typeof ANIMAL_FUN_PROFILES !== 'undefined' && (ANIMAL_FUN_PROFILES[a.id] || ANIMAL_FUN_PROFILES[a.species])) || null;
    const themeGrad = profile?.themeGradient || 'linear-gradient(135deg, #1b3815 0%, #305822 50%, #447a32 100%)';
    const themeColor = profile?.themeColor || '#305822';
    const accentColor = profile?.accentColor || '#f59e0b';
    const glowColor = profile?.glowColor || 'rgba(245, 158, 11, 0.4)';

    document.documentElement.style.setProperty('--animal-theme-grad', themeGrad);
    document.documentElement.style.setProperty('--animal-theme-color', themeColor);
    document.documentElement.style.setProperty('--animal-accent', accentColor);
    document.documentElement.style.setProperty('--animal-glow', glowColor);

    const appWrap = document.getElementById('fichaAppWrap');
    if (appWrap) {
      appWrap.style.background = themeGrad;
      appWrap.style.transition = 'background 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }

    const heroBanner = document.getElementById('fichaHeroBanner');
    if (heroBanner) {
      heroBanner.style.borderColor = accentColor;
      heroBanner.style.boxShadow = `0 12px 35px ${glowColor}`;
      heroBanner.style.borderTop = `6px solid ${accentColor}`;
    }

    const appHeader = document.querySelector('.ficha-page-app header.top');
    if (appHeader) appHeader.style.borderColor = accentColor;

    const appTabs = document.getElementById('fichaMainTabs');
    if (appTabs) appTabs.style.borderColor = accentColor;

    const appContainer = document.querySelector('.ficha-view-container');
    if (appContainer) appContainer.style.borderColor = accentColor;

    const appFooter = document.querySelector('.ficha-page-app footer.ods');
    if (appFooter) appFooter.style.borderColor = accentColor;

    const appBadges = document.querySelector('.ficha-page-app .badges-bar');
    if (appBadges) appBadges.style.borderColor = accentColor;

    // Actualizar botones de categoría activos con el color del animal
    document.querySelectorAll('#fichaCategoryBar .ficha-cat-btn').forEach(btn => {
      if (btn.classList.contains('active')) {
        btn.style.background = themeColor;
        btn.style.color = '#ffffff';
        btn.style.borderColor = accentColor;
        btn.style.boxShadow = `0 4px 14px ${glowColor}`;
      } else {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      }
    });

    // Actualizar botones de cinta
    document.querySelectorAll('#fichaSpeciesRibbon .ficha-species-btn').forEach(btn => {
      const isThis = btn.dataset.id === a.id;
      btn.classList.toggle('active', isThis);
      if (isThis) {
        btn.style.background = themeColor;
        btn.style.color = '#ffffff';
        btn.style.borderColor = accentColor;
        btn.style.boxShadow = `0 4px 14px ${glowColor}`;
      } else {
        btn.style.background = '';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      }
    });

    // Actualizar Hero Banner
    const photoWrap = document.getElementById('fichaPhotoWrap');
    const heroEmoji = document.getElementById('fichaHeroEmoji');
    const heroImg = document.getElementById('fichaHeroImg');
    const accBadge = document.getElementById('fichaHeroAccBadge');
    const nameEl = document.getElementById('fichaHeroName');
    const latEl = document.getElementById('fichaHeroLat');
    const blurbEl = document.getElementById('fichaHeroBlurb');
    const zoneBadge = document.getElementById('fichaZoneBadge');
    const soundBtn = document.getElementById('fichaSoundBtn');

    if (nameEl) nameEl.textContent = a.name;
    if (latEl) latEl.textContent = a.lat || 'Especie fauna Liceo B-13';
    if (blurbEl) blurbEl.textContent = a.blurb || '';

    if (zoneBadge) {
      const zName = (a.zoneId && typeof FARM_ZONES_BY_ID !== 'undefined' && FARM_ZONES_BY_ID[a.zoneId])
        ? FARM_ZONES_BY_ID[a.zoneId].label
        : 'Granja Escolar';
      zoneBadge.innerHTML = `📍 ${zName}`;
    }

    const accEmoji = (typeof getAnimalAccessoryEmoji === 'function')
      ? getAnimalAccessoryEmoji(a.id, a.accessory)
      : ((typeof ACCESSORIES !== 'undefined' ? ACCESSORIES.find(x => x.id === a.accessory)?.emoji : '') || '');

    if (a.photo) {
      if (heroImg) {
        heroImg.src = a.photo;
        heroImg.alt = a.name;
        heroImg.style.display = 'block';
      }
      if (heroEmoji) heroEmoji.style.display = 'none';
    } else {
      if (heroImg) heroImg.style.display = 'none';
      if (heroEmoji) {
        heroEmoji.textContent = a.emoji || '🐾';
        heroEmoji.style.display = 'block';
      }
    }

    if (photoWrap) {
      photoWrap.style.borderColor = accentColor;
      photoWrap.style.boxShadow = `0 8px 24px ${glowColor}`;
    }

    if (accBadge) {
      if (accEmoji) {
        accBadge.textContent = accEmoji;
        accBadge.style.display = 'flex';
      } else {
        accBadge.style.display = 'none';
      }
    }

    // Sonido
    if (soundBtn) {
      if (a.sound) {
        soundBtn.style.display = 'inline-flex';
        soundBtn.style.background = accentColor;
        soundBtn.style.color = '#ffffff';
        soundBtn.style.boxShadow = `0 4px 12px ${glowColor}`;
        soundBtn.onclick = () => {
          if (typeof playRealSound === 'function') playRealSound(a.sound);
        };
      } else {
        soundBtn.style.display = 'none';
      }
    }

    // Renderizar Pestaña 1: Ficha Zootécnica Amplia
    renderWideFacts(a);

    // Renderizar Pestaña 2: Chiste de Granja & Superpoderes
    renderWideJokes(a);

    // Renderizar Pestaña 3: Anatomía Interactiva
    renderWideAnatomy(a);

    // Renderizar Pestaña 4: Personalizar
    if (typeof renderPersonalizar === 'function') {
      renderPersonalizar(a);
      const persoContainer = document.getElementById('panel-personalizar');
      if (persoContainer) {
        persoContainer.onclick = () => {
          setTimeout(() => {
            const freshAccEmoji = (typeof getAnimalAccessoryEmoji === 'function')
              ? getAnimalAccessoryEmoji(a.id, a.accessory)
              : ((typeof ACCESSORIES !== 'undefined' ? ACCESSORIES.find(x => x.id === a.accessory)?.emoji : '') || '');
            if (accBadge) {
              if (freshAccEmoji) {
                accBadge.textContent = freshAccEmoji;
                accBadge.style.display = 'flex';
              } else {
                accBadge.style.display = 'none';
              }
            }
          }, 50);
        };
      }
    }

    // Renderizar Pestaña 5: Quiz Formativo
    if (typeof renderQuiz === 'function') {
      renderQuiz(a);
    }

    // Sincronizar UI de estudiante e insignias
    if (typeof updateStudentUI === 'function') updateStudentUI();
    if (typeof renderBadgesBar === 'function') renderBadgesBar();
    updateHeader();
  }

  function updateHeader() {
    const scoreEl = document.getElementById('score');
    const discEl = document.getElementById('discovered');
    if (scoreEl && typeof state !== 'undefined') scoreEl.textContent = state.score || 0;
    if (discEl && typeof state !== 'undefined') {
      const disc = (state.discovered || []).length + (state.mapDiscovered || []).length;
      discEl.textContent = disc;
    }
  }
  window.updateHeader = updateHeader;

  function renderWideFacts(a) {
    const grid = document.getElementById('fichaFactsWideGrid');
    if (!grid) return;

    const facts = a.facts || {};
    grid.innerHTML = `
      <div class="ficha-fact-card full-col">
        <div class="ficha-fact-card-k">🏷️ Clasificación Biológica y Taxonómica</div>
        <div class="ficha-fact-card-v">${facts.clasificacion || 'Fauna de granja escolar, Liceo Domingo Herrera Rivera B-13.'}</div>
      </div>

      <div class="ficha-fact-card">
        <div class="ficha-fact-card-k">🏡 Hábitat y Requerimientos de Espacio</div>
        <div class="ficha-fact-card-v">${facts.habitat || 'Espacio adaptado para bienestar animal en el Liceo B-13.'}</div>
      </div>

      <div class="ficha-fact-card">
        <div class="ficha-fact-card-k">🥗 Alimentación y Nutrición Zootécnica</div>
        <div class="ficha-fact-card-v">${facts.alimentacion || 'Dieta balanceada zootécnica rica en nutrientes y fibra.'}</div>
      </div>

      <div class="ficha-fact-card">
        <div class="ficha-fact-card-k">💧 Consumo e Hidratación de Agua</div>
        <div class="ficha-fact-card-v">${facts.agua || 'Agua limpia y fresca a libre disposición durante todo el día.'}</div>
      </div>

      <div class="ficha-fact-card">
        <div class="ficha-fact-card-k">👥 Comportamiento Social y Convivencia</div>
        <div class="ficha-fact-card-v">${facts.comportamiento || 'Comportamiento gremial y amigable con el estudiantado.'}</div>
      </div>

      <div class="ficha-fact-card">
        <div class="ficha-fact-card-k">🐣 Reproducción, Ciclo de Cría y Gestación</div>
        <div class="ficha-fact-card-v">${facts.reproduccion || 'Ciclo reproductivo controlado bajo protocolos de bienestar animal.'}</div>
      </div>

      <div class="ficha-fact-card full-col">
        <div class="ficha-fact-card-k">❤️ Cuidados Especiales y Bienestar Animal Oficial B-13</div>
        <div class="ficha-fact-card-v">${facts.cuidados || 'Manejo respetuoso, enriquecimiento ambiental y chequeo veterinario permanente.'}</div>
      </div>

      <div class="ficha-fact-card full-col">
        <div class="ficha-fact-card-k">🌾 Dato de Terreno del Liceo B-13 (Observación Práctica)</div>
        <div class="ficha-fact-card-v">${facts.dato || 'Especie clave en el aprendizaje práctico de ciencias naturales y agroecología.'}</div>
      </div>
    `;
  }

  function renderWideJokes(a) {
    const container = document.getElementById('fichaJokesContainer');
    if (!container) return;

    const profileKey = a.id || a.species || 'gallo';
    const funProfile = (typeof ANIMAL_FUN_PROFILES !== 'undefined' && (ANIMAL_FUN_PROFILES[profileKey] || ANIMAL_FUN_PROFILES[a.species] || ANIMAL_FUN_PROFILES.gallo)) || {
      quote: `¡Hola! Soy ${a.name}, habitante del Liceo B-13. ¡Explora mi ficha para conocer mis secretos biológicos!`,
      joke: {
        question: "¿Por qué los animales de la Granja B-13 sacan las mejores notas del liceo?",
        punchline: "¡Porque se pasan todo el día en el campo practicando ciencias naturales al aire libre! 🌾🦉 ¡Puro 7 zootécnico!"
      },
      superpower: {
        name: "⚡ Adaptación Zootécnica de Terreno",
        desc: "Excelente resiliencia ambiental y convivencia comunitaria en los espacios educativos del liceo."
      },
      curiosity: "La granja escolar del Liceo B-13 fomenta el bienestar animal, la tenencia responsable y el aprendizaje vivencial de las ciencias naturales."
    };

    // Logros secretos
    if ((a.id === 'nesquik' || a.name === 'Nesquik') && typeof unlockSecretBadge === 'function') {
      unlockSecretBadge('amigo_nesquik');
    }
    if (typeof state !== 'undefined') {
      if (!state.superpowersViewed) state.superpowersViewed = [];
      if (!state.superpowersViewed.includes(profileKey)) {
        state.superpowersViewed.push(profileKey);
        saveState();
      }
      if (state.superpowersViewed.length >= 4 && typeof unlockSecretBadge === 'function') {
        unlockSecretBadge('superpoder_detective');
      }
    }

    container.innerHTML = `
      <!-- Bocadillo de Diálogo Amigable -->
      <div class="animal-speech-bubble" style="margin-bottom:16px;">
        <div class="bubble-avatar">${a.emoji || '🐾'}</div>
        <div class="bubble-content">
          <div class="bubble-title">
            <span>¡Mensaje directo de ${a.name}!</span>
          </div>
          <p class="bubble-text">"${funProfile.quote}"</p>
        </div>
      </div>

      <!-- Chiste de Granja Interactivo con Remate Revelable -->
      <div class="animal-joke-box" id="fichaWideJokeBox_${a.id}" style="margin-bottom:18px;">
        <div class="joke-header">
          <span class="joke-title-tag">🌾 Chiste de Granja</span>
          <span class="joke-sub">¡Toca para adivinar y reírte con humor campesino B-13!</span>
        </div>
        <div class="joke-q">${funProfile.joke.question}</div>
        <div class="joke-punchline" id="punchlineWide_${a.id}" style="display:none;background:#fef3c7;border:2px dashed #d97706;border-radius:10px;padding:12px;margin:12px 0;font-size:1.02rem;color:#78350f;">
          <span>🎭</span> <b>${funProfile.joke.punchline}</b>
        </div>
        <button type="button" class="joke-reveal-btn" id="jokeWideBtn_${a.id}">
          <span>👀 ¡Ver Remate!</span>
        </button>
      </div>

      <!-- Tarjeta de Superpoder Biológico -->
      <div class="animal-superpower-card" style="margin-bottom:16px;">
        <div class="superpower-header">
          <span class="superpower-badge">SUPERPODER BIOLÓGICO</span>
          <span class="superpower-name">${funProfile.superpower.name}</span>
        </div>
        <p class="superpower-desc" style="font-size:0.95rem;line-height:1.5;">${funProfile.superpower.desc}</p>
      </div>

      <!-- Tarjeta de Curiosidad Asombrosa -->
      <div class="animal-curiosity-card">
        <span class="curiosity-icon">💡</span>
        <div class="curiosity-body">
          <div class="curiosity-tag">¿SABÍAS ESTO? · CURIOSIDAD DE CAMPO</div>
          <p class="curiosity-text" style="font-size:0.95rem;line-height:1.5;">${funProfile.curiosity}</p>
        </div>
      </div>
    `;

    const jokeBtn = document.getElementById(`jokeWideBtn_${a.id}`);
    const punchlineEl = document.getElementById(`punchlineWide_${a.id}`);
    if (jokeBtn && punchlineEl) {
      jokeBtn.addEventListener('click', () => {
        const isHidden = punchlineEl.style.display === 'none';
        if (isHidden) {
          punchlineEl.style.display = 'flex';
          jokeBtn.innerHTML = '<span>🤫 Ocultar Remate</span>';
          if (typeof state !== 'undefined') {
            if (!state.jokesRevealedCount) state.jokesRevealedCount = 0;
            state.jokesRevealedCount++;
            saveState();
            if (state.jokesRevealedCount >= 3 && typeof unlockSecretBadge === 'function') {
              unlockSecretBadge('comediante_corral');
            }
          }
          if (typeof spawnStarBurst === 'function') spawnStarBurst(jokeBtn);
        } else {
          punchlineEl.style.display = 'none';
          jokeBtn.innerHTML = '<span>👀 ¡Ver Remate!</span>';
        }
      });
    }
  }

  function renderWideAnatomy(a) {
    const container = document.getElementById('fichaAnatomyContainer');
    if (!container) return;

    if (!a.organs || a.organs.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:30px;color:#666;">
          <span style="font-size:3rem;display:block;margin-bottom:8px;">🔬</span>
          <h3 style="font-family:'Fraunces',serif;color:var(--ink);margin:0 0 6px;">Diagrama anatómico en preparación</h3>
          <p style="font-size:0.9rem;">El equipo de ciencias del Liceo B-13 está digitalizando el mapa de órganos de esta especie.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="anatomy-box" style="display:block;">
        <div class="k" style="font-size:1.1rem;margin-bottom:12px;">🔬 Radiografía y Diagrama de Fisiología Zootécnica</div>
        <div class="anatomy-diagram" id="anatomyWideDiagram" style="display:block;margin-top:10px;">
          ${a.anatomyImage ? buildAnatomyImage(a) : buildAnatomySVG(a)}
        </div>
      </div>
    `;

    attachOrganHandlers(a);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
