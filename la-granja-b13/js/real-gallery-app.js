/*
  real-gallery-app.js — Controlador de la vista Galería Real B-13
  Muestra la correlación entre las fotos reales del liceo y el juego interactivo.
*/

let currentFilter = 'todos';

function initGallery() {
  renderFilterButtons();
  renderGalleryGrid();
  setupLightbox();
  updateGalleryHeader();
}

function updateGalleryHeader() {
  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function') ? Auth.getSesion() : { rol: 'visita' };
  if (sesion.rol === 'visita') {
    if (typeof Auth !== 'undefined' && typeof Auth.aplicarRestriccionesRol === 'function') {
      Auth.aplicarRestriccionesRol();
    }
    return;
  }
  const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : ((typeof state !== 'undefined' && state.pureScore) ? state.pureScore : 0);
  const countEl = document.getElementById('galleryCount');
  const scoreEl = document.getElementById('score');
  if (scoreEl) scoreEl.textContent = purePts;
  if (countEl) {
    countEl.textContent = REAL_GALLERY_ITEMS.length;
    const totalEl = document.getElementById('galleryTotal');
    if (totalEl) totalEl.textContent = REAL_GALLERY_ITEMS.length;
  }
}

function renderFilterButtons() {
  const container = document.getElementById('galleryFilterBar');
  if (!container) return;

  const countCat = (cat) => cat === 'todos' ? REAL_GALLERY_ITEMS.length : REAL_GALLERY_ITEMS.filter(item => item.category === cat).length;

  const categories = [
    { id: 'todos', label: `🌿 Todos (${countCat('todos')})` },
    { id: 'fauna', label: `🐾 Fauna Real (${countCat('fauna')})` },
    { id: 'espacios', label: `🏡 Espacios e Instalaciones (${countCat('espacios')})` },
    { id: 'huerto', label: `🌱 Huerto y Botánica (${countCat('huerto')})` },
    { id: 'nidos', label: `🐣 Nidos y Maternidad (${countCat('nidos')})` }
  ];

  container.innerHTML = categories.map(c => `
    <button type="button" class="filter-btn${currentFilter === c.id ? ' active' : ''}" data-filter="${c.id}">
      ${c.label}
    </button>
  `).join('');

  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentFilter = btn.dataset.filter;
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderGalleryGrid();
      if (typeof playChirp === 'function') playChirp();
    });
  });
}

function renderGalleryGrid() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  const filtered = currentFilter === 'todos'
    ? REAL_GALLERY_ITEMS
    : REAL_GALLERY_ITEMS.filter(item => item.category === currentFilter);

  if (filtered.length === 0) {
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#666;">No hay registros en esta categoría.</div>';
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const hasExtra = !!item.extraPhoto;
    return `
      <article class="gallery-card" id="card-${item.id}">
        <div class="gallery-card-img-wrap" data-lightbox-src="${item.photo}" data-title="${item.title}" data-desc="${item.desc}">
          <img src="${item.photo}" alt="${item.title}" id="main-img-${item.id}">
          <span class="gallery-real-badge${item.isHD ? ' is-hd' : ''}">${item.isHD ? '🌟 FOTO REAL HD' : '📸 FOTO REAL B-13'}</span>
          <span class="gallery-zoom-hint">🔍 Ampliar</span>
        </div>
        ${hasExtra ? `
          <div class="gallery-extra-thumbs">
            <button type="button" class="gallery-thumb-btn active" data-target="${item.id}" data-src="${item.photo}" title="Foto principal">
              <img src="${item.photo}" alt="Foto 1">
            </button>
            <button type="button" class="gallery-thumb-btn" data-target="${item.id}" data-src="${item.extraPhoto}" title="Foto secundaria">
              <img src="${item.extraPhoto}" alt="Foto 2">
            </button>
          </div>
        ` : ''}
        <div class="gallery-card-body">
          <a href="${item.gameRef.link}" class="gallery-game-ref" title="Ver elemento en el juego interactivo">
            <span>🎮 En el juego:</span>
            <span>${item.gameRef.icon} ${item.gameRef.label}</span>
            <span>➜</span>
          </a>
          <h3 class="gallery-card-title">${item.title}</h3>
          <div class="gallery-card-subtitle">${item.subtitle}</div>

          <div class="gallery-specs">
            ${item.specs.map(s => `
              <div class="gallery-spec-row">
                <span class="gallery-spec-k">${s.k}:</span>
                <span class="gallery-spec-v">${s.v}</span>
              </div>
            `).join('')}
          </div>

          <p class="gallery-card-desc">${item.desc}</p>
          <div class="gallery-card-pedagogy">${item.pedagogy}</div>
        </div>
      </article>
    `;
  }).join('');

  // Event listeners para cambiar miniaturas
  grid.querySelectorAll('.gallery-thumb-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.dataset.target;
      const newSrc = btn.dataset.src;
      const mainImg = document.getElementById('main-img-' + targetId);
      const wrap = mainImg.closest('.gallery-card-img-wrap');
      if (mainImg) {
        mainImg.src = newSrc;
        wrap.dataset.lightboxSrc = newSrc;
      }
      const parent = btn.closest('.gallery-extra-thumbs');
      parent.querySelectorAll('.gallery-thumb-btn').forEach(b => b.classList.toggle('active', b === btn));
    });
  });

  // Event listeners para abrir Lightbox
  grid.querySelectorAll('.gallery-card-img-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      openLightbox(wrap.dataset.lightboxSrc, wrap.dataset.title, wrap.dataset.desc);
    });
  });
}

/* ============ Lightbox Modal ============ */

function setupLightbox() {
  const lb = document.getElementById('lightboxModal');
  if (!lb) return;

  const closeBtn = lb.querySelector('.lightbox-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lb.addEventListener('click', (e) => {
    if (e.target === lb) closeLightbox();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lb.classList.contains('open')) {
      closeLightbox();
    }
  });
}

function openLightbox(src, title, desc) {
  const lb = document.getElementById('lightboxModal');
  if (!lb) return;

  const img = document.getElementById('lightboxImg');
  const titleEl = document.getElementById('lightboxTitle');
  const descEl = document.getElementById('lightboxDesc');

  if (img) img.src = src;
  if (titleEl) titleEl.textContent = title;
  if (descEl) descEl.textContent = desc;

  lb.classList.add('open');
  if (typeof playChirp === 'function') playChirp();
}

function closeLightbox() {
  const lb = document.getElementById('lightboxModal');
  if (lb) lb.classList.remove('open');
}

// Iniciar al cargar
document.addEventListener('DOMContentLoaded', initGallery);
