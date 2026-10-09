/*
  ficha-app.js — Controlador de la Vista Dedicada y Completa de la Ficha del Animal
  Proporciona una experiencia de aprendizaje espaciosa, moderna y pedagógica
  reemplazando el modal superpuesto por una enciclopedia completa con pestañas.
*/

(function() {
  'use strict';

  // Mapeo de especies genéricas a sus mascotas residentes oficiales del B-13
  const ALIAS_MAP = {
    conejo: 'nesquik',
    gallina: 'cleo',
    gallo: 'vicente',
    catita: 'las_catitas',
    agapornis: 'pastelito',
    pato: 'sal',
    matias_vicente: 'matias'
  };

  // Lista consolidada de animales oficiales del Liceo B-13 (los 23 ejemplares reales)
  function getAllSpeciesList() {
    const list = [];
    const seen = new Set();

    // Animales oficiales del Liceo B-13 (los 23 ejemplares reales de los pósters)
    if (typeof MAP_ANIMALS !== 'undefined' && Array.isArray(MAP_ANIMALS)) {
      MAP_ANIMALS.forEach(a => {
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
  let currentAnimalImageMode = 'real';
  const fromParam = getQueryParam('from') || 'index.html';
  const rawInitialId = getQueryParam('id') || 'nesquik';
  const initialId = ALIAS_MAP[rawInitialId] || rawInitialId;

  function init() {
    setupBackButton();
    setupRibbon();
    setupTabSwitching();
    setupImageModeSwitcher();

    const allSpecies = getAllSpeciesList();
    let initialAnimal = allSpecies.find(x => x.id === initialId);
    if (!initialAnimal) {
      initialAnimal = allSpecies.find(x => x.species === initialId) || allSpecies[0];
    }

    const initialTab = getQueryParam('tab') || 'facts';
    if (initialAnimal) {
      loadAnimal(initialAnimal, false);
      if (initialTab && initialTab !== 'facts') {
        switchFichaTab(initialTab);
      }
    }
  }

  function applyAnimalImageMode() {
    currentAnimalImageMode = 'real';
    const heroImg = document.getElementById('fichaHeroImg');
    const heroEmoji = document.getElementById('fichaHeroEmoji');
    const labelEl = document.getElementById('fichaPhotoModeLabel');

    if (!currentAnimal) return;

    const realSrc = currentAnimal.photo_real || currentAnimal.photo || currentAnimal.img_real;

    if (realSrc && heroImg) {
      heroImg.src = realSrc;
      heroImg.alt = `${currentAnimal.name} (Fotografía Realista Oficial)`;
      heroImg.className = 'ficha-hero-photo mode-real';
      heroImg.style.display = 'block';
      if (heroEmoji) heroEmoji.style.display = 'none';
    }
    if (labelEl) labelEl.innerHTML = '🌿 Fotografía Real Oficial Liceo B-13';
  }
  window.setAnimalPhotoView = applyAnimalImageMode;

  function setupImageModeSwitcher() {
    // Modo realista exclusivo: no se requieren conmutadores de imagen
  }

  function setupBackButton() {
    const btn = document.getElementById('fichaNavBackBtn');
    const textEl = btn ? (btn.querySelector('.btn-volver-text') || document.getElementById('fichaNavBackText')) : null;
    if (!btn) return;

    if (fromParam.includes('mapa')) {
      btn.href = 'mapa.html';
    } else if (fromParam.includes('juegos')) {
      btn.href = 'juegos.html';
    } else {
      btn.href = 'index.html';
    }
    if (textEl) textEl.textContent = 'Volver';
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
      return a.group === currentCategory;
    });

    ribbon.innerHTML = filtered.map(a => {
      const isCur = currentAnimal ? (a.id === currentAnimal.id) : (a.id === initialId);
      const thumbSrc = a.photo_real || a.photo || a.img_real;
      const thumbHtml = thumbSrc
        ? `<img src="${thumbSrc}" alt="${a.name}" class="ficha-species-btn-thumb">`
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
      handling: document.getElementById('panelFichaHandling'),
      dictionary: document.getElementById('panelFichaDictionary'),
      jokes: document.getElementById('panelFichaJokes'),
      anatomy: document.getElementById('panelFichaAnatomy'),
      accessories: document.getElementById('panelFichaAccessories')
    };

    Object.keys(panels).forEach(k => {
      if (panels[k]) panels[k].style.display = (k === tab) ? 'block' : 'none';
    });

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

    applyAnimalImageMode('real');

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
          if (typeof playRealSound === 'function') playRealSound(a.sound, true);
        };
      } else {
        soundBtn.style.display = 'none';
      }
    }

    // Renderizar Pestaña 1: Ficha Zootécnica Amplia
    renderWideFacts(a);

    // Renderizar Pestaña 2: Guía de Trato Respetuoso (Cargar, Levantar y Acariciar)
    renderHandlingGuide(a);

    // Renderizar Pestaña 3: Diccionario Biológico de Campo
    renderFieldDictionary(a);

    // Renderizar Pestaña 4: Chiste de Granja & Superpoderes
    renderWideJokes(a);

    // Renderizar Pestaña 5: Anatomía Interactiva
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
      const allSpecies = getAllSpeciesList();
      const combined = new Set([
        ...(state.discovered || []),
        ...(state.mapDiscovered || [])
      ]);
      const officialIds = new Set(allSpecies.map(s => s.id));
      let count = 0;
      officialIds.forEach(id => {
        if (combined.has(id)) count++;
      });
      discEl.textContent = Math.min(count, allSpecies.length);
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
        <div class="ficha-fact-card-k">🥗 Alimentación y Dieta Saludable</div>
        <div class="ficha-fact-card-v">${facts.alimentacion || 'Dieta balanceada rica en nutrientes y fibra.'}</div>
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

      <div class="ficha-fact-card full-col" style="background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);border:2px solid #86efac;padding:16px 18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <div class="ficha-fact-card-k" style="color:#166534;margin:0 0 4px;">🤝 Guía de Trato Respetuoso (Cargar, Levantar y Acariciar)</div>
            <div style="font-size:0.92rem;color:#14532d;line-height:1.45;">Aprende cómo levantar a ${a.name} con seguridad, sus zonas de caricias felices y lo que <b>NUNCA</b> debes hacer.</div>
          </div>
          <button type="button" class="tool-btn" id="btnGoTabHandling_${a.id}" style="background:#15803d;color:#fff;border:2px solid #166534;border-radius:10px;padding:8px 16px;font-weight:700;font-size:0.86rem;cursor:pointer;">
            <span>🤝</span> Ver Guía de Trato y Caricias ➔
          </button>
        </div>
      </div>

      <div class="ficha-fact-card full-col" style="background:linear-gradient(135deg, #eff6ff 0%, #e0f2fe 100%);border:2px solid #93c5fd;padding:16px 18px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <div class="ficha-fact-card-k" style="color:#1e40af;margin:0 0 4px;">📚 Diccionario Biológico de Campo</div>
            <div style="font-size:0.92rem;color:#1e3a8a;line-height:1.45;">Conoce conceptos clave como cecotrofia, heno, molleja, buche o glándula uropígea con explicaciones claras para tus desafíos.</div>
          </div>
          <button type="button" class="tool-btn" id="btnGoTabDictionary_${a.id}" style="background:#2563eb;color:#fff;border:2px solid #1d4ed8;border-radius:10px;padding:8px 16px;font-weight:700;font-size:0.86rem;cursor:pointer;">
            <span>📚</span> Ver Diccionario Biológico ➔
          </button>
        </div>
      </div>

      <div class="ficha-fact-card full-col" style="background:#f0f9ff;border:1.5px solid #0284c7;text-align:center;padding:16px;">
        <p style="margin:0 0 10px;font-size:0.86rem;color:#0369a1;font-weight:700;">¿Tienes dudas o hiciste una observación interesante sobre ${a.name}?</p>
        <button type="button" class="tool-btn" id="btnFichaComment_${a.id}" style="padding:10px 20px;font-size:0.88rem;font-weight:700;background:#0284c7;color:#fff;border-radius:8px;cursor:pointer;border:none;box-shadow:0 2px 4px rgba(2,132,199,0.25);">
          💬 Abrir Muro Comunitario para ${a.name}
        </button>
      </div>
    `;

    const btnHandling = document.getElementById(`btnGoTabHandling_${a.id}`);
    if (btnHandling) {
      btnHandling.addEventListener('click', () => {
        switchFichaTab('handling');
      });
    }

    const btnDict = document.getElementById(`btnGoTabDictionary_${a.id}`);
    if (btnDict) {
      btnDict.addEventListener('click', () => {
        switchFichaTab('dictionary');
      });
    }

    const cBtn = document.getElementById(`btnFichaComment_${a.id}`);
    if (cBtn) {
      cBtn.addEventListener('click', () => {
        if (typeof openCommentsModal === 'function') {
          openCommentsModal(a.id);
        }
      });
    }
  }

  /* ============================================================
     DATOS Y GUÍAS DE TRATO RESPETUOSO (BIENESTAR Y ETOLOGÍA ANIMAL)
     ============================================================ */
  const ANIMAL_HANDLING_GUIDES = {
    conejos: {
      categoryName: 'Conejos (Lagomorfos)',
      summary: 'Los conejos son animales presa sumamente sensibles. Tienen huesos ligeros y una columna vertebral frágil. Una manipulación brusca puede asustarlos gravemente o causarles fracturas en su espalda.',
      howToLift: {
        title: 'Cómo levantarlo y cargarlo con seguridad',
        technique: 'Técnica de la Cuna o Balón de Rugby:',
        steps: [
          '<b>Paso 1 (Calma previa):</b> Agáchate despacio a su altura. Nunca te acerques por arriba como una sombra (los conejos ven las sombras altas como aves rapaces).',
          '<b>Paso 2 (Mano delantera):</b> Desliza una mano abierta con firmeza pero suavemente por debajo de su pecho, sujetando sus patitas delanteras.',
          '<b>Paso 3 (Soporte trasero obligatorio):</b> Al mismo tiempo, coloca tu otra mano por debajo de su colita y patas traseras para soportar todo su peso. <i>¡Nunca lo dejes patalear en el aire!</i>',
          '<b>Paso 4 (Apego seguro):</b> Levántalo con suavidad y pégalo pegado contra tu pecho o costado, manteniendo su cabeza protegida.'
        ]
      },
      neverDo: [
        '<b>NUNCA levantarlo de las orejas:</b> Es una crueldad extrema. Les provoca desgarro muscular y vascular irreparable además de un dolor insoportable.',
        '<b>NUNCA levantarlo del pellejo del lomo sin apoyo:</b> Les causa pánico agudo y riesgo de luxación vertebral.',
        '<b>NUNCA ponerlo boca arriba (inmovilidad tónica):</b> Quedarse quieto boca arriba no es relajación; es un reflejo de terror extremo (hacerse el muerto ante un depredador).',
        '<b>NUNCA gritar ni hacer ruidos fuertes:</b> El estrés acústico puede provocar una parada gastrointestinal letal.'
      ],
      happyZones: [
        '<b>Frente y entre las orejas:</b> Su lugar favorito número 1. Simula el saludo afectuoso entre conejos.',
        '<b>Mejillas y detrás de las orejas:</b> Acariciar con la yema de los dedos en la dirección del pelo.',
        '<b>Todo el lomo y espalda:</b> Caricias largas y suaves desde el cuello hacia la cola.'
      ],
      dangerZones: [
        '<b>La pancita y vientre:</b> Es su zona más vulnerable; tocarla les genera pánico defensivo.',
        '<b>Las patitas traseras y delanteras:</b> Sienten cosquilleo o miedo de ser atrapados.',
        '<b>La colita:</b> Se sobresaltan y huirán rápidamente.'
      ],
      howToPet: [
        'Extiende el dorso de tus nudillos despacio a la altura de su nariz para que huela tu aroma.',
        'Si baja la cabeza o se acomoda en el suelo, acaricia suavemente su frente entre las orejas.',
        '<b>Señal de felicidad:</b> Si rechina sus dientes suavemente ("ronroneo dental") o apoya su barbilla relajado, está feliz y confiado.'
      ]
    },
    gallinas: {
      categoryName: 'Gallinas y Gallos (Aves Galliformes)',
      summary: 'Las aves de corral son sociables y curiosas. No obstante, sus alas son delicadas y carecen de diafragma muscular para respirar, por lo que nunca deben ser apretadas ni perseguidas con brusquedad.',
      howToLift: {
        title: 'Cómo levantarlo y cargarlo con seguridad',
        technique: 'Técnica de Alas Plegadas al Cuerpo:',
        steps: [
          '<b>Paso 1 (Aproximación lateral):</b> Acércate despacio desde el costado, hablándole con tono suave y calmado.',
          '<b>Paso 2 (Contención de alas):</b> Coloca ambas manos sobre sus costados, manteniendo sus alas suavemente plegadas contra su cuerpo para que no aletee ni se lastime.',
          '<b>Paso 3 (Soporte inferior):</b> Desliza una mano por debajo de su pecho, pasando tus dedos entre sus patas para sujetarlas con delicadeza.',
          '<b>Paso 4 (Cargar al costado):</b> Apóyala contra tu costado o antebrazo como si llevaras un balón, asegurando que sus alas permanezcan tranquilas.'
        ]
      },
      neverDo: [
        '<b>NUNCA agarrarla de las patas colgando cabeza abajo:</b> Les provoca congestión craneal, angustia severa y asfixia por peso visceral.',
        '<b>NUNCA levantarla de una sola ala o del cuello:</b> Ruptura inmediata de articulaciones alares o asfixia.',
        '<b>NUNCA correr detrás de ellas en el corral:</b> Genera pánico colectivo, taquicardia y golpes contra los cercos.',
        '<b>NUNCA tirar de las plumas de la cola:</b> Les arranca folículos sensibles y las desestabiliza.'
      ],
      happyZones: [
        '<b>Pecho y parte baja del cuello:</b> Caricias suaves con las yemas en dirección de las plumas.',
        '<b>Espalda y lomo:</b> Caricias amplias y delicadas que imitan el calor del sol.',
        '<b>Base de la nuca:</b> Zonas que disfrutan cuando ya confían en el estudiante.'
      ],
      dangerZones: [
        '<b>Cresta y barbillas bruscamente:</b> Son órganos muy vascularizados y sensibles a cualquier presión.',
        '<b>Las alas extendidas y cola:</b> Provoca reflejo inmediato de escape.',
        '<b>El pico y los ojos:</b> Pueden asustarse o picotear por instinto defensivo.'
      ],
      howToPet: [
        'Ofrécele un puñado de maíz o semillas en tu mano abierta para que se acerque voluntariamente.',
        'Acaricia con un dedo o dos su pecho en la dirección en que crecen las plumas.',
        '<b>Señal de felicidad:</b> Si emite un suave "cloc-cloc", cierra los ojitos o se echa a tu lado a tomar sol, está completamente relajada.'
      ]
    },
    patos: {
      categoryName: 'Patos (Aves Anseriformes Acuáticas)',
      summary: 'Los patos son animales acuáticos pacíficos y comunitarios. Sus plumas tienen una capa de aceite protector que no debe frotarse con fuerza y sus patas palmeadas son delicadas al caminar sobre tierra firme.',
      howToLift: {
        title: 'Cómo levantarlo y cargarlo con seguridad',
        technique: 'Técnica de Soporte Plantar y Pecho:',
        steps: [
          '<b>Paso 1 (Movimientos pausados):</b> Los patos tienen visión panorámica; no hagas aspavientos con los brazos.',
          '<b>Paso 2 (Abrazo de alas):</b> Coloca ambas manos a los lados del pato, abrazando sus alas contra su cuerpo para prevenir el aleteo.',
          '<b>Paso 3 (Apoyo en patas):</b> Desliza una mano plana bajo su vientre y patitas palmeadas para que sientan suelo firme bajo sus pies.',
          '<b>Paso 4 (Cargar pegado al cuerpo):</b> Mantén su cuerpo pegado con suavidad a tu torso con la cabeza hacia adelante para que no se desoriente.'
        ]
      },
      neverDo: [
        '<b>NUNCA levantarlo por el cuello:</b> Lesiona gravemente su tráquea, esófago y vértebras cervicales.',
        '<b>NUNCA levantarlo de las patas palmeadas:</b> La membrana interdigital y sus caderas pueden luxarse fácilmente.',
        '<b>NUNCA alimentarlo con pan:</b> El pan blanco provoca malnutrición y la enfermedad irreversible de "ala de ángel".',
        '<b>NUNCA asustarlo hacia el agua profunda:</b> Aunque nadan muy bien, forzarlos por sorpresa les genera estrés agudo.'
      ],
      happyZones: [
        '<b>Pecho y zona media del cuello:</b> Caricias suaves descendentes con la punta de los dedos.',
        '<b>Lomo y hombros:</b> Deslizando la mano con suavidad a favor del plumaje.',
        '<b>Costados del cuerpo:</b> Toques leves y relajantes.'
      ],
      dangerZones: [
        '<b>El pico y las narinas:</b> Es su órgano sensitivo primordial; tocarlo les genera molestia.',
        '<b>Membranas palmeadas de las patas:</b> Muy sensibles y fáciles de lastimar con uñas humanas.',
        '<b>Glándula uropígea sobre la cola:</b> Zona aceitosa que solo ellos deben manipular al acicalarse.'
      ],
      howToPet: [
        'Ponte en cuclillas a su altura cerca del agua o comedero.',
        'Deja que el pato se aproxime y acaricia su pecho de arriba hacia abajo muy despacio.',
        '<b>Señal de felicidad:</b> Si mueve la cola de lado a lado como un perrito y hace suaves chasquidos nasales, está feliz.'
      ]
    },
    loros: {
      categoryName: 'Aves Menores y Psitácidos (Agapornis y Catitas)',
      summary: 'Los loritos y agapornis son aves sumamente inteligentes y sensibles. Las aves NO tienen diafragma muscular; respiran expandiendo su tórax, por lo que NUNCA se debe rodear su pecho con fuerza.',
      howToLift: {
        title: 'Cómo sostenerlo e interactuar',
        technique: 'Técnica de la Percha Voluntaria (Dedo Índice):',
        steps: [
          '<b>Paso 1 (Invitación voluntaria):</b> Coloca tu dedo índice en posición horizontal justo frente a su abdomen, a la altura de sus patitas.',
          '<b>Paso 2 (Orden suave):</b> Di con voz dulce "sube" o su nombre. Deja que el ave decida trepar a tu dedo como si fuera una percha.',
          '<b>Paso 3 (Estabilidad):</b> Mantén la mano firme y quieta. Si el ave quiere regresar a su percha, déjala sin forzarla.',
          '<b>Paso 4 (Seguridad respiratoria):</b> NUNCA cierres la mano alrededor de su tórax; apretar su pecho les impide expandir sus sacos aéreos y causa asfixia fatal.'
        ]
      },
      neverDo: [
        '<b>NUNCA presionar o rodear su pecho:</b> No tienen diafragma; apretar el tórax es asfixia inmediata.',
        '<b>NUNCA acariciar el lomo o alas:</b> En psitácidos estimula hormonas reproductivas que causan agresividad, celos y frustración.',
        '<b>NUNCA atraparlos por sorpresa con manos cerradas:</b> Provoca shock por terror y caída masiva de plumas.',
        '<b>NUNCA tirar de la cola:</b> Provoca la "muda de susto", perdiendo el timón al volar.'
      ],
      happyZones: [
        '<b>Coronilla y nuca (cabeza):</b> Es su única zona favorita recomendada por veterinarios. Simula el allopreening.',
        '<b>Mejillas y alrededor de las orejas:</b> Frotar muy suavemente las plumas a contrapelo con un solo dedo.',
        '<b>Bajo la barbilla del pico:</b> Toques suaves que les ayudan a acicalar plumas donde no se alcanzan.'
      ],
      dangerZones: [
        '<b>Lomo y espalda:</b> Estimula comportamiento hormonal inadecuado y picaje de plumas.',
        '<b>Debajo de las alas y cola:</b> Zona prohibida; causa frustración y agresividad.',
        '<b>Patas y uñas:</b> Se sienten atrapados y usarán su fuerte pico para defenderse.'
      ],
      howToPet: [
        'Espera a que el ave esté cómoda en tu dedo o percha.',
        'Acerca tu dedo índice lentamente de lado hacia su cabecita.',
        '<b>Señal de felicidad:</b> Si agacha la cabecita y esponja las plumas del cuello pidiéndote mimos, puedes rascarle suavemente la nuca.'
      ]
    }
  };

  /* ============================================================
     DICCIONARIO BIOLÓGICO DE CAMPO (VOCABULARIO CIENTÍFICO EDUCATIVO)
     ============================================================ */
  const ANIMAL_FIELD_DICTIONARIES = {
    conejos: [
      {
        term: 'Cecotrofia',
        icon: '🥬',
        badge: 'Fisiología Digestiva',
        def: 'Proceso biológico vital donde el conejo reingiere unos racimos de heces blandas especiales (cecotrofos) producidas en su ciego. Estas contienen vitaminas del complejo B, vitamina K y proteínas bacterianas esenciales que el conejo absorbe en una segunda digestión completa.'
      },
      {
        term: 'Heno Fresco',
        icon: '🌾',
        badge: 'Nutrición Esencial',
        def: 'Pasto seco con más del 80% de fibra vegetal no digerible. Debe constituir la gran mayoría de la dieta del conejo para mantener activo el tránsito intestinal y desgastar sus dientes incisivos y muelas, los cuales crecen continuamente durante toda su vida.'
      },
      {
        term: 'Binky',
        icon: '🤸',
        badge: 'Etología y Bienestar',
        def: 'Salto acrobático con giro en el aire, sacudida de cabeza y patas que realizan los conejos cuando sienten euforia, máxima felicidad, seguridad y relajación en su conejera escolar.'
      },
      {
        term: 'Cría Altricial',
        icon: '🐣',
        badge: 'Desarrollo y Cría',
        def: 'Tipo de desarrollo biológico donde los gazapos (conejitos bebés) nacen ciegos, sordos, sin pelaje e incapaces de caminar o regular su temperatura corporal. Dependen al 100% del calor del nido y de la leche de su madre para sobrevivir.'
      },
      {
        term: 'Lagomorfo',
        icon: '🐇',
        badge: 'Taxonomía',
        def: 'Orden zoológico al que pertenecen los conejos y liebres. A diferencia de los roedores (que tienen 2 incisivos superiores), los lagomorfos poseen 4 dientes incisivos superiores (dos grandes al frente y dos pequeños de soporte por detrás llamados dientes de clavija).'
      },
      {
        term: 'Hábito Crepuscular',
        icon: '🌅',
        badge: 'Ritmo Circadiano',
        def: 'Patrón de actividad biológica donde el conejo está más despierto, activo y dispuesto a alimentarse durante el amanecer y el atardecer, descansando en las horas de mayor calor del mediodía.'
      }
    ],
    gallinas: [
      {
        term: 'Buche',
        icon: '🌾',
        badge: 'Anatomía Digestiva',
        def: 'Bolsita o dilatación esofágica en la base del cuello de las aves donde se almacenan y humedecen temporalmente los granos y semillas secas antes de continuar hacia el estómago.'
      },
      {
        term: 'Molleja (Ventrículo Muscular)',
        icon: '🪨',
        badge: 'Digestión Mecánica',
        def: 'Poderoso estómago muscular de las aves que suple la falta de dientes. Utiliza piedrecillas que tragan a propósito (grit) para triturar y pulverizar granos y semillas duras con gran fuerza.'
      },
      {
        term: 'Cresta y Barbillas',
        icon: '🌡️',
        badge: 'Termorregulación',
        def: 'Estructuras carnosas rojas altamente irrigadas de vasos sanguíneos. Además de servir para el cortejo, actúan como radiadores térmicos biológicos que disipan el exceso de calor corporal en días soleados.'
      },
      {
        term: 'Cloaca',
        icon: '🥚',
        badge: 'Anatomía Aviar',
        def: 'Cámara y orificio terminal común en las aves y reptiles donde confluyen las funciones del sistema digestivo (desechos), urinario (ácido úrico) y reproductor (postura de huevos o fecundación).'
      },
      {
        term: 'Cría Precocial (o Nidífuga)',
        icon: '🐥',
        badge: 'Desarrollo Biológico',
        def: 'Tipo de desarrollo donde los pollitos nacen en un estado muy avanzado: con ojos abiertos, plumón térmico y capaces de caminar y comer por sí mismos a las pocas horas siguiendo a su madre.'
      },
      {
        term: 'Orden de Picoteo',
        icon: '👑',
        badge: 'Comportamiento Social',
        def: 'Jerarquía social natural y pacífica dentro del gallinero que establece turnos organizados para acceder al comedero, bebedero y a las perchas más altas para dormir.'
      }
    ],
    patos: [
      {
        term: 'Glándula Uropígea',
        icon: '💧',
        badge: 'Impermeabilidad',
        def: 'Glándula sebácea situada sobre la base dorsal de la cola de las aves acuáticas. Secreta aceites y ceras que el pato esparce con su pico sobre sus plumas para mantenerse impermeable y flotar en el agua.'
      },
      {
        term: 'Laminillas (Pecten)',
        icon: '🪮',
        badge: 'Alimentación por Filtro',
        def: 'Finas crestas o peines en los bordes interiores del pico del pato que actúan como coladores, permitiéndole expulsar el agua y retener semillas, algas y pequeños invertebrados.'
      },
      {
        term: 'Peligro del Pan ("Ala de Ángel")',
        icon: '⚠️',
        badge: 'Salud y Nutrición',
        def: 'Grave malformación ósea incurable en las alas de los patos provocada por dietas con pan blanco o masas refinadas ricas en carbohidratos simples y deficientes en vitaminas. Las plumas y huesos de las alas crecen torcidos hacia afuera impidiéndoles volar.'
      },
      {
        term: 'Patas Palmeadas',
        icon: '🦆',
        badge: 'Locomoción Acuática',
        def: 'Membrana interdigital de piel que une los dedos de las patas del pato, funcionando como eficientes aletas o remos para impulsarse con velocidad en el agua.'
      },
      {
        term: 'Plumón Térmico',
        icon: '🪶',
        badge: 'Aislamiento',
        def: 'Capa profunda de plumas suaves y esponjosas en contacto con la piel que atrapa aire caliente, brindando un aislamiento térmico perfecto para que el agua fría nunca enfríe su cuerpo.'
      }
    ],
    loros: [
      {
        term: 'Cinesis Craneal',
        icon: '🦜',
        badge: 'Biomecánica del Pico',
        def: 'Capacidad biomecánica especial de los psitácidos donde la mandíbula superior se articula de forma móvil con el cráneo, permitiéndoles mover el pico hacia arriba para abrirlo ampliamente y ejercer tremenda fuerza prensil para quebrar cáscaras duras.'
      },
      {
        term: 'Allopreening',
        icon: '🤝',
        badge: 'Etología Social',
        def: 'Comportamiento afectivo donde dos aves se limpian y acicalan las plumas mutuamente con el pico (sobre todo en cabeza y cuello), reforzando los vínculos de pareja y amistad en la bandada.'
      },
      {
        term: 'Patas Zigodáctilas',
        icon: '🐾',
        badge: 'Anatomía Prensátil',
        def: 'Disposición anatómica de los dedos donde 2 dedos apuntan hacia adelante y 2 hacia atrás, permitiéndoles trepar ramas verticales con gran destreza y sostener comida con la pata como si fuera una mano.'
      },
      {
        term: 'Céreo',
        icon: '👃',
        badge: 'Morfología Aviar',
        def: 'Membrana carnosa suave sobre la base del pico donde se ubican las fosas nasales. En las catitas adultas, su coloración indica el sexo (azul o violáceo en machos, marrón o blanquecino en hembras).'
      },
      {
        term: 'Enriquecimiento Ambiental',
        icon: '🌿',
        badge: 'Bienestar Psicológico',
        def: 'Conjunto de ramas frescas para roer, juguetes de forrajeo y desafíos mentales indispensables para evitar el estrés, el aburrimiento y el picaje en aves de alta inteligencia.'
      }
    ]
  };

  function getAnimalGroupKey(a) {
    if (!a) return 'conejos';
    const gid = (a.group || '').toLowerCase();
    const aid = (a.id || '').toLowerCase();
    
    if (gid.includes('conejo') || aid.includes('conejo') || aid === 'nesquik' || aid === 'copito' || aid === 'tambor' || aid === 'oreo' || aid === 'manchitas' || aid === 'panchito' || aid === 'nieve' || aid === 'canela' || aid === 'luna') {
      return 'conejos';
    }
    if (gid.includes('pato') || aid.includes('pato') || aid === 'sal' || aid === 'pimienta') {
      return 'patos';
    }
    if (gid.includes('loro') || gid.includes('ave') || aid.includes('catita') || aid.includes('agapornis') || aid === 'pastelito' || aid === 'las_catitas') {
      return 'loros';
    }
    return 'gallinas';
  }

  function renderHandlingGuide(a) {
    const container = document.getElementById('fichaHandlingContainer');
    if (!container) return;

    const gKey = getAnimalGroupKey(a);
    const guide = ANIMAL_HANDLING_GUIDES[gKey] || ANIMAL_HANDLING_GUIDES.gallinas;

    container.innerHTML = `
      <div class="handling-container">
        <!-- Banner Introductorio -->
        <div class="handling-hero-card">
          <div class="handling-hero-title">
            <span>🤝</span>
            <span>Guía de Trato Respetuoso: ¿Cómo interactuar con ${a.name}?</span>
          </div>
          <p class="handling-hero-subtitle">
            ${guide.summary}
          </p>
        </div>

        <!-- Fila 1: Cómo levantarlo y Lo que NUNCA debes hacer -->
        <div class="handling-grid-2col">
          <!-- Tarjeta: Cómo levantarlo -->
          <div class="handling-card">
            <div class="handling-card-header">
              <span class="handling-card-icon">🤲</span>
              <h3 class="handling-card-title">${guide.howToLift.title}</h3>
            </div>
            <p style="font-weight:700;color:var(--grass-dark);margin:0 0 10px;font-size:0.95rem;">
              ${guide.howToLift.technique}
            </p>
            <ol class="handling-steps-list">
              ${guide.howToLift.steps.map(s => `<li>${s}</li>`).join('')}
            </ol>
          </div>

          <!-- Tarjeta: Lo que NUNCA debes hacer -->
          <div class="handling-card danger-zone">
            <div class="handling-card-header">
              <span class="handling-card-icon">⚠️</span>
              <h3 class="handling-card-title">Lo que NUNCA debes hacer</h3>
            </div>
            <ul class="handling-list danger">
              ${guide.neverDo.map(item => `<li>${item}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Fila 2: Zonas Felices y Zonas Prohibidas -->
        <div class="handling-grid-2col">
          <!-- Zonas Felices -->
          <div class="handling-card happy-zone">
            <div class="handling-card-header">
              <span class="handling-card-icon">💚</span>
              <h3 class="handling-card-title">¿Dónde SÍ acariciar? (Zonas Felices)</h3>
            </div>
            <ul class="handling-list happy">
              ${guide.happyZones.map(hz => `<li>${hz}</li>`).join('')}
            </ul>
          </div>

          <!-- Zonas Prohibidas -->
          <div class="handling-card danger-zone">
            <div class="handling-card-header">
              <span class="handling-card-icon">⛔</span>
              <h3 class="handling-card-title">¿Dónde NO tocar? (Zonas Prohibidas)</h3>
            </div>
            <ul class="handling-list danger">
              ${guide.dangerZones.map(dz => `<li>${dz}</li>`).join('')}
            </ul>
          </div>
        </div>

        <!-- Tarjeta de Cierre: Cómo acariciarlo paso a paso -->
        <div class="handling-card" style="background:#fcfbf7;">
          <div class="handling-card-header">
            <span class="handling-card-icon">✨</span>
            <h3 class="handling-card-title">¿Cómo acariciarlo paso a paso con cariño?</h3>
          </div>
          <ol class="handling-steps-list">
            ${guide.howToPet.map(p => `<li>${p}</li>`).join('')}
          </ol>
        </div>
      </div>
    `;
  }

  function renderFieldDictionary(a) {
    const container = document.getElementById('fichaDictionaryContainer');
    if (!container) return;

    const gKey = getAnimalGroupKey(a);
    const terms = ANIMAL_FIELD_DICTIONARIES[gKey] || ANIMAL_FIELD_DICTIONARIES.gallinas;

    container.innerHTML = `
      <div class="dictionary-container">
        <!-- Banner Introductorio -->
        <div class="dictionary-hero-card">
          <div class="dictionary-hero-title">
            <span>📚</span>
            <span>Diccionario Biológico de Campo: ${a.name}</span>
          </div>
          <p class="dictionary-hero-subtitle">
            Aprende los términos científicos y zootécnicos clave con definiciones sencillas para tus estudios y para resolver los <b>Desafíos Formativos</b> a la primera.
          </p>
        </div>

        <!-- Grilla de Términos -->
        <div class="dictionary-grid">
          ${terms.map(t => `
            <div class="dict-card">
              <div class="dict-card-term">
                <span>${t.icon}</span>
                <span>${t.term}</span>
                <span class="dict-card-badge">${t.badge}</span>
              </div>
              <p class="dict-card-def">${t.def}</p>
            </div>
          `).join('')}
        </div>

        <!-- Banner hacia Desafíos -->
        <div style="background:#f0fdf4;border:2px solid #86efac;border-radius:14px;padding:16px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
          <div>
            <div style="font-weight:800;color:#166534;font-size:1.02rem;">🎯 ¿Ya dominas estos conceptos?</div>
            <div style="color:#14532d;font-size:0.86rem;margin-top:2px;">Pon a prueba lo que aprendiste y gana décimas oficiales para tu promedio escolar.</div>
          </div>
          <a href="quizzes.html" class="tool-btn" style="background:#15803d;color:#ffffff;border:2px solid #166534;padding:8px 16px;font-weight:700;border-radius:20px;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">
            <span>⭐</span> Ir a Desafíos de Décimas ➜
          </a>
        </div>
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
        punchline: "¡Porque se pasan todo el día en el campo practicando ciencias naturales al aire libre! 🌾🦉 ¡Puro 7 en ciencias!"
      },
      superpower: {
        name: "⚡ Adaptación y Habilidad de Terreno",
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
          <span class="joke-sub">¡Humor de la granja del Liceo B-13!</span>
        </div>
        <div class="joke-q">${funProfile.joke.question}</div>
        <div class="joke-punchline" id="punchlineWide_${a.id}" style="display:none;background:#fef3c7;border:2px dashed #d97706;border-radius:10px;padding:12px;margin:12px 0;font-size:1.02rem;color:#78350f;">
          <span>🎭</span> <b>${funProfile.joke.punchline}</b>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:8px;">
          <button type="button" class="joke-reveal-btn" id="jokeWideBtn_${a.id}">
            <span>👀 ¡Ver Remate!</span>
          </button>
          <button type="button" class="joke-audio-btn tool-btn" id="jokeWideAudioBtn_${a.id}" style="padding:7px 14px;font-size:0.82rem;font-weight:700;background:#fef3c7;border:1.5px solid #d97706;color:#78350f;border-radius:20px;cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
            <span>🗣️ Escuchar Chiste</span>
          </button>
        </div>
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

    function playRimshotWide() {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.2);
        g.gain.setValueAtTime(0.3, now);
        g.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);
      } catch (e) {}
    }

    const jokeBtn = document.getElementById(`jokeWideBtn_${a.id}`);
    const jokeAudioBtn = document.getElementById(`jokeWideAudioBtn_${a.id}`);
    const punchlineEl = document.getElementById(`punchlineWide_${a.id}`);

    if (jokeBtn && punchlineEl) {
      jokeBtn.addEventListener('click', () => {
        const isHidden = punchlineEl.style.display === 'none';
        if (isHidden) {
          punchlineEl.style.display = 'flex';
          jokeBtn.innerHTML = '<span>🤫 Ocultar Remate</span>';
          playRimshotWide();
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

    if (jokeAudioBtn && punchlineEl) {
      jokeAudioBtn.addEventListener('click', () => {
        const q = funProfile.joke.question;
        const ans = funProfile.joke.punchline.replace(/[^\w\sáéíóúüñ¿?¡!]/gi, '');
        punchlineEl.style.display = 'flex';
        if (jokeBtn) jokeBtn.innerHTML = '<span>🤫 Ocultar Remate</span>';

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterQ = new SpeechSynthesisUtterance(q);
          utterQ.lang = 'es-CL';
          const utterA = new SpeechSynthesisUtterance(ans);
          utterA.lang = 'es-CL';
          utterA.onend = playRimshotWide;
          utterQ.onend = () => {
            setTimeout(() => window.speechSynthesis.speak(utterA), 300);
          };
          window.speechSynthesis.speak(utterQ);
        } else {
          playRimshotWide();
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
        <div class="k" style="font-size:1.1rem;margin-bottom:12px;">🔬 Radiografía y Diagrama de Anatomía</div>
        <div class="anatomy-diagram" id="anatomyWideDiagram" style="display:block;margin-top:10px;max-width:540px;margin-left:auto;margin-right:auto;">
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
