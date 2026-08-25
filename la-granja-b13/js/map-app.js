/*
  map-app.js — Lógica específica de la vista "Mapa de la Granja"
  (mapa.html): los pines sobre la imagen del mapa, la mini-vista por
  zona (grilla de retratos) y la conexión con la ficha compartida de
  card.js. La ficha, el quiz y las insignias son exactamente el mismo
  motor que usa el Potrero.
*/

const farmmap = document.getElementById('farmmap');

FARM_ZONES.forEach(zone => {
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
  // No agregamos una etiqueta de texto aparte: la imagen ya trae el
  // nombre de cada zona pintado en su propio cartel de madera.
});

function onZoneClick(zone) {
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

  if (iconEl) iconEl.textContent = zone.icon || '📍';
  if (titleEl) titleEl.textContent = zone.label || 'Punto de Interés';
  if (catEl) catEl.textContent = 'Espacio de la Granja B13';
  if (textEl) textEl.textContent = zone.flavor || '';

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
    const done = !!(state && state.mapQuiz && state.mapQuiz[a.id] && state.mapQuiz[a.id].completed);
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'portrait-card';
    card.innerHTML = `
      <div class="portrait-photo"><img src="${a.photo}" alt="${a.name}"></div>
      <div class="portrait-name" style="color:${a.color}">${a.name}</div>
      ${done ? '<div class="portrait-done">✓ Quiz completo</div>' : ''}
    `;
    card.addEventListener('click', () => {
      closeOverlayId('miniVistaOverlay');
      openFichaOverlay(a);
    });
    grid.appendChild(card);
  });
}

/* ============ Cabecera y pines (progreso) ============ */

function refreshZonePinBadges() {
  FARM_ZONES.forEach(zone => {
    if (zone.kind !== 'animals') return;
    const el = document.getElementById('count-' + zone.id);
    if (!el) return;
    const found = zone.animalIds.filter(id => mapDiscoveredSet.has(id)).length;
    el.textContent = found + '/' + zone.animalIds.length;
    el.classList.toggle('full', found === zone.animalIds.length);
  });
}

function updateHeader() {
  document.getElementById('score').textContent = state.score;
  document.getElementById('discovered').textContent = mapDiscoveredSet.size;
  refreshZonePinBadges();
}

// El Mapa no tiene un sprite visible detrás de la ficha (la mini-vista
// se cierra antes de abrirla), así que no hay nada que refrescar ahí:
// el retrato se vuelve a dibujar solo la próxima vez que se abra esa
// zona, leyendo el nombre/color ya actualizado.
function refreshSprite(a) { /* sin sprite visible en esta vista */ }

/* ============ Inicio ============ */

updateHeader();
