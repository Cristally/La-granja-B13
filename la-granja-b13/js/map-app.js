/*
  map-app.js — Lógica específica de la vista "Mapa de la Granja"
  (mapa.html): pines sobre la imagen 3D realista (mapa3.jpg),
  mini-vista por zona (grilla de retratos con animales reales),
  pines de quiz docente y alternancia con vista clásica 2D.
*/

const farmmap = document.getElementById('farmmap');
const farmmapBg = document.getElementById('farmmapBg');
const toggleMapModeBtn = document.getElementById('toggleMapModeBtn');

let currentMapMode = '3d'; // '3d' o 'classic'

function renderMapPins() {
  if (!farmmap) return;

  // Limpiar pines existentes
  farmmap.querySelectorAll('.map-pin').forEach(p => p.remove());

  const activeZones = currentMapMode === '3d' ? FARM_ZONES_3D : FARM_ZONES_CLASSIC;
  FARM_ZONES = activeZones;

  if (farmmapBg) {
    farmmapBg.src = currentMapMode === '3d' ? 'assets/img/map/mapa3.jpg' : 'assets/img/map/mapa-granja.jpg';
    farmmapBg.alt = currentMapMode === '3d' ? 'Mapa 3D realista de La Granja B13' : 'Mapa ilustrado clásico de La Granja B13';
  }

  activeZones.forEach(zone => {
    const pin = document.createElement('button');
    pin.type = 'button';
    pin.className = 'map-pin' + (zone.kind === 'animals' ? ' has-animals' : '');
    pin.style.left = zone.left + '%';
    pin.style.top = zone.top + '%';
    pin.title = zone.label;
    pin.dataset.zone = zone.id;
    pin.innerHTML = `<span class="map-pin-ic">${zone.icon}</span>`;
    if (zone.kind === 'animals') {
      pin.innerHTML += `<span class="map-pin-count" id="count-${zone.id}"></span>`;
    }
    pin.addEventListener('click', () => onZoneClick(zone));
    farmmap.appendChild(pin);
  });

  refreshZonePinBadges();
}

function onZoneClick(zone) {
  // Registrar visita de zona en estadísticas
  if (typeof Auth !== 'undefined' && typeof Auth.registrarVisitaZona === 'function') {
    Auth.registrarVisitaZona(zone.id);
  }

  if (zone.kind === 'animals') {
    renderMiniVista(zone);
    openOverlayId('miniVistaOverlay');
  } else {
    renderZoneInfo(zone);
    openOverlayId('zoneInfoOverlay');
    if (zone.sound) playRealSound(zone.sound);
  }
}

function renderZoneInfo(zone) {
  const iconEl = document.getElementById('zoneInfoIcon');
  const titleEl = document.getElementById('zoneInfoTitle');
  const catEl = document.getElementById('zoneInfoCategory');
  const textEl = document.getElementById('zoneInfoText');
  const extraEl = document.getElementById('zoneInfoExtra');
  const imgWrap = document.getElementById('zoneInfoImgWrap');
  const imgEl = document.getElementById('zoneInfoImg');

  if (iconEl) iconEl.textContent = zone.icon || '📍';
  if (titleEl) titleEl.textContent = zone.label || 'Punto de Interés';
  if (catEl) catEl.textContent = 'Espacio Real — Granja B13';
  if (textEl) textEl.textContent = zone.flavor || '';

  // Foto real de la zona
  if (imgWrap && imgEl) {
    if (zone.image) {
      imgEl.src = zone.image;
      imgEl.alt = zone.label;
      imgWrap.style.display = 'block';
    } else {
      imgWrap.style.display = 'none';
    }
  }

  if (extraEl) {
    if (zone.sound) {
      extraEl.innerHTML = `
        <button class="sound-btn" id="zoneSoundBtn" type="button" style="display:inline-flex;margin-top:4px;">
          🔊 Escuchar sonido real
        </button>
      `;
      const sndBtn = document.getElementById('zoneSoundBtn');
      if (sndBtn) sndBtn.onclick = () => playRealSound(zone.sound);
    } else {
      extraEl.innerHTML = '';
    }
  }
}

function renderMiniVista(zone) {
  const iconEl = document.getElementById('miniVistaIcon');
  const titleEl = document.getElementById('miniVistaTitle');
  const introEl = document.getElementById('miniVistaIntro');
  if (iconEl) iconEl.textContent = zone.icon || '🐾';
  if (titleEl) titleEl.textContent = zone.label || 'Zona';
  if (introEl) introEl.textContent = zone.intro || '';

  const grid = document.getElementById('portraitGrid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!Array.isArray(zone.animalIds)) return;

  zone.animalIds.forEach(id => {
    const a = (typeof MAP_ANIMALS_BY_ID !== 'undefined') ? MAP_ANIMALS_BY_ID[id] : null;
    if (!a) return;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'portrait-card';
    card.innerHTML = `
      <div class="portrait-photo"><img src="${a.photo_real || a.photo}" alt="${a.name}"></div>
      <div class="portrait-name" style="color:${a.color}">${a.name}</div>
      <div class="portrait-tag-badge">🐾 Ver Perfil Oficial</div>
    `;
    card.addEventListener('click', () => {
      // Registrar visita de animal
      if (typeof Auth !== 'undefined' && typeof Auth.registrarVisitaAnimal === 'function') {
        Auth.registrarVisitaAnimal(a.name);
      }
      closeOverlayId('miniVistaOverlay');
      openFichaOverlay(a);
    });
    grid.appendChild(card);
  });
}

/* ============ Cabecera y pines (progreso) ============ */

function refreshZonePinBadges() {
  const activeZones = currentMapMode === '3d' ? FARM_ZONES_3D : FARM_ZONES_CLASSIC;
  activeZones.forEach(zone => {
    if (zone.kind !== 'animals') return;
    const el = document.getElementById('count-' + zone.id);
    if (!el) return;
    el.textContent = zone.animalIds.length;
    el.classList.add('full');
  });
}

function updateHeader() {
  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };
  if (sesion.rol === 'visita') {
    if (typeof Auth !== 'undefined' && typeof Auth.aplicarRestriccionesRol === 'function') {
      Auth.aplicarRestriccionesRol();
    }
    refreshZonePinBadges();
    return;
  }
  const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : ((typeof state !== 'undefined' && state.pureScore) ? state.pureScore : 0);
  if (scoreEl) scoreEl.textContent = purePts;
  if (discEl) discEl.textContent = mapDiscoveredSet.size;
  refreshZonePinBadges();
}

function refreshSprite(a) { /* sin sprite visible en esta vista */ }

// Botón de alternancia de mapa (3D vs 2D clásico)
if (toggleMapModeBtn) {
  toggleMapModeBtn.addEventListener('click', () => {
    currentMapMode = currentMapMode === '3d' ? 'classic' : '3d';
    toggleMapModeBtn.textContent = currentMapMode === '3d' ? '🔄 Cambiar a vista clásica 2D' : '🔄 Cambiar a vista 3D realista';
    renderMapPins();
  });
}

/* ============ Inicio ============ */
renderMapPins();
updateHeader();
