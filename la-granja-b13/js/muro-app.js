/*
  muro-app.js — Lógica de la vista dedicada "Muro Comunitario & Observaciones" (muro.html).
  Permite publicar preguntas y notas de campo con fotos de la granja,
  responder entre estudiantes y visualizar respuestas verificadas de docentes.
*/

(function() {
  'use strict';

  if (typeof Auth !== 'undefined' && typeof Auth.init === 'function') {
    Auth.init();
  }

  const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function')
    ? Auth.getSesion()
    : { rol: 'estudiante', nombre: 'Estudiante Demo', curso: '2°B' };

  if (typeof state === 'undefined' || !state) {
    if (typeof loadState === 'function') loadState();
  }

  // Aplicar tema guardado
  if (typeof applyGranjaTheme === 'function' && state) {
    applyGranjaTheme(state.themeMode || 'light', state.themeBg || '#FAF7EE');
  }

  const STORAGE_KEY_MURO = 'granjaMuroPosts_v1';

  // Publicaciones pedagógicas iniciales de la comunidad
  const DEFAULT_POSTS = [
    {
      id: 'post_1',
      author: 'Yefrin González',
      course: '3° Medio F',
      avatar: '🐇',
      avatarColor: '#ffd83d',
      category: 'conejos',
      catLabel: '🐇 Conejos & Conejeras',
      text: 'Hoy durante el recreo vi a Nesquik comiendo heno en la conejera. Tenía el pelaje súper esponjoso y limpio. Recuerden no darle pan ni galletas porque les daña el estómago y su digestión cecotrófica.',
      photo: 'assets/img/animals/nesquik.png',
      timestamp: 'Hoy, hace 1 hora',
      likes: 8,
      replies: [
        {
          author: 'Prof. Ana Reyes',
          role: 'docente',
          avatar: '👩‍🏫',
          text: '¡Excelente observación Yefrin! El heno de alfalfa y gramíneas es vital para el desgaste constante de sus dientes incisivos.',
          timestamp: 'Hace 45 minutos'
        }
      ]
    },
    {
      id: 'post_2',
      author: 'Camila Morales',
      course: '2° Medio B',
      avatar: '🦆',
      avatarColor: '#74B9E6',
      category: 'patos',
      catLabel: '🦆 Patos & Estanque',
      text: '¿Sal y Pimienta tienen agua limpia hoy? Los vi nadando felices en su tinaja bajo el toldo de sombra. ¡Se ven muy sanos y activos!',
      photo: 'assets/img/animals/sal.png',
      timestamp: 'Ayer a las 15:30',
      likes: 12,
      replies: [
        {
          author: 'Prof. Carlos Soto',
          role: 'docente',
          avatar: '👨‍🏫',
          text: 'El equipo de turno renueva su agua dos veces al día para que sus glándulas uropígeas sigan impermeabilizando sus plumas.',
          timestamp: 'Ayer a las 16:10'
        }
      ]
    },
    {
      id: 'post_3',
      author: 'Nicolás Tapia',
      course: '1° Medio A',
      avatar: '🐔',
      avatarColor: '#f43f5e',
      category: 'gallinas',
      catLabel: '🐔 Gallinas & Gallos',
      text: 'Tormenta y Milagro estaban empollando juntas en el cajón de madera del patio central. ¡Qué hermoso ver cómo conviven tranquilas!',
      photo: 'assets/img/animals/tormenta.png',
      timestamp: 'Hace 2 días',
      likes: 15,
      replies: []
    }
  ];

  function getStoredPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MURO);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_POSTS;
  }

  function savePosts(posts) {
    try {
      localStorage.setItem(STORAGE_KEY_MURO, JSON.stringify(posts));
    } catch (e) {}
  }

  let postsData = getStoredPosts();

  // Renderizar autor en el formulario
  function updateFormAuthor() {
    const avatarEl = document.getElementById('postAuthorAvatar');
    const nameEl = document.getElementById('postAuthorName');
    const gradeEl = document.getElementById('postAuthorGrade');

    if (avatarEl) avatarEl.textContent = state.avatarIcon || '🧑‍🌾';
    if (nameEl) nameEl.textContent = state.studentName || sesion.nombre || 'Estudiante B-13';
    if (gradeEl) gradeEl.textContent = `Curso: ${state.studentGrade || sesion.curso || '2°B'}`;
  }

  // Renderizar publicaciones
  function renderFeed() {
    const container = document.getElementById('postsFeedContainer');
    const totalEl = document.getElementById('muroTotalPosts');
    if (totalEl) totalEl.textContent = postsData.length;

    if (!container) return;

    if (postsData.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#64748b;">
          <span style="font-size:3rem;">🌾</span>
          <p style="margin-top:10px;font-size:0.95rem;">Aún no hay publicaciones en el muro. ¡Sé el primero en compartir una observación!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = postsData.map(post => `
      <article class="post-item-card" id="${post.id}">
        <div class="post-author-row">
          <div class="post-author-avatar" style="border-color:${post.avatarColor || '#ffd83d'};">
            ${post.avatar || '🧑‍🌾'}
          </div>
          <div style="flex:1;min-width:0;">
            <div style="font-weight:800;font-size:0.95rem;color:#1e293b;">
              ${post.author}
            </div>
            <div style="font-size:0.75rem;color:#64748b;">
              ${post.course ? `${post.course} · ` : ''}${post.timestamp}
            </div>
          </div>
          <span class="post-cat-badge">${post.catLabel || '🌾 General'}</span>
        </div>

        <div class="post-content-text">
          ${post.text}
        </div>

        ${post.photo ? `
          <img src="${post.photo}" alt="Foto adjunta de la granja" class="post-image-attachment" loading="lazy">
        ` : ''}

        <div class="post-actions-row">
          <button type="button" class="post-action-btn like-btn" data-id="${post.id}">
            ❤️ <span class="like-count">${post.likes || 0}</span> Me gusta
          </button>
          <button type="button" class="post-action-btn reply-toggle-btn" data-id="${post.id}">
            💬 Responder (${(post.replies || []).length})
          </button>
        </div>

        <!-- Hilo de respuestas -->
        ${(post.replies && post.replies.length > 0) ? `
          <div class="replies-thread">
            ${post.replies.map(r => `
              <div class="reply-item">
                <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                  <span>${r.avatar || '💬'}</span>
                  <b style="color:${r.role === 'docente' ? '#15803d' : '#1e293b'};">${r.author}</b>
                  ${r.role === 'docente' ? '<span style="font-size:0.68rem;background:#dcfce7;color:#15803d;padding:1px 6px;border-radius:4px;font-weight:800;">Docente B-13</span>' : ''}
                  <span style="font-size:0.7rem;color:#94a3b8;margin-left:auto;">${r.timestamp}</span>
                </div>
                <div style="color:#334155;padding-left:22px;line-height:1.4;">${r.text}</div>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- Formulario para responder desplegable -->
        <div class="reply-form-wrap" id="replyFormWrap_${post.id}" style="display:none;margin-top:10px;">
          <div style="display:flex;gap:8px;">
            <input type="text" id="replyInput_${post.id}" placeholder="Escribe tu respuesta o aporte..." style="flex:1;padding:8px 10px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:0.85rem;">
            <button type="button" class="tool-btn send-reply-btn" data-id="${post.id}" style="padding:8px 14px;background:var(--grass-dark);color:#fff;font-weight:800;font-size:0.82rem;border-radius:6px;border:none;cursor:pointer;">
              Enviar
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Conectar eventos de likes y respuestas
    container.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.dataset.id;
        const target = postsData.find(p => p.id === pId);
        if (target) {
          target.likes = (target.likes || 0) + 1;
          savePosts(postsData);
          renderFeed();
        }
      });
    });

    container.querySelectorAll('.reply-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.dataset.id;
        const box = document.getElementById(`replyFormWrap_${pId}`);
        if (box) {
          box.style.display = (box.style.display === 'none') ? 'block' : 'none';
        }
      });
    });

    container.querySelectorAll('.send-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pId = btn.dataset.id;
        const input = document.getElementById(`replyInput_${pId}`);
        if (!input || !input.value.trim()) return;

        const target = postsData.find(p => p.id === pId);
        if (target) {
          target.replies = target.replies || [];
          target.replies.push({
            author: state.studentName || sesion.nombre || 'Estudiante B-13',
            role: (sesion.rol === 'profesor') ? 'docente' : 'estudiante',
            avatar: (sesion.rol === 'profesor') ? '👩‍🏫' : (state.avatarIcon || '🧑‍🌾'),
            text: input.value.trim(),
            timestamp: 'Hace un momento'
          });
          savePosts(postsData);
          renderFeed();
        }
      });
    });
  }

  // Manejar envío de nueva publicación
  const submitBtn = document.getElementById('btnSubmitPost');
  if (submitBtn) {
    submitBtn.addEventListener('click', () => {
      const textInput = document.getElementById('postTextInput');
      const catSelect = document.getElementById('postCatSelect');
      const photoSelect = document.getElementById('postPhotoSelect');
      const errEl = document.getElementById('postErrorMsg');

      const text = textInput ? textInput.value.trim() : '';
      if (!text || text.length < 5) {
        if (errEl) {
          errEl.textContent = '⚠️ Escribe al menos 5 caracteres para compartir tu observación.';
          errEl.style.display = 'block';
        }
        if (textInput) textInput.focus();
        return;
      }

      if (errEl) errEl.style.display = 'none';

      const catMap = {
        conejos: '🐇 Conejos & Conejeras',
        gallinas: '🐔 Gallinas & Gallos',
        patos: '🦆 Patos & Estanque',
        aves: '🦜 Aviario & Loros',
        huerto: '🌱 Huerto & Botánica',
        pregunta: '❓ Pregunta Zootécnica',
        curiosidad: '💡 Curiosidad de Campo'
      };

      const newPost = {
        id: 'post_' + Date.now(),
        author: state.studentName || sesion.nombre || 'Estudiante B-13',
        course: state.studentGrade || sesion.curso || '2°B',
        avatar: state.avatarIcon || '🧑‍🌾',
        avatarColor: state.avatarColor || '#ffd83d',
        category: catSelect ? catSelect.value : 'general',
        catLabel: catMap[catSelect ? catSelect.value : ''] || '🌾 General',
        text: text,
        photo: photoSelect ? photoSelect.value : '',
        timestamp: 'Hace un momento',
        likes: 0,
        replies: []
      };

      postsData.unshift(newPost);
      savePosts(postsData);

      if (textInput) textInput.value = '';
      if (photoSelect) photoSelect.value = '';

      renderFeed();

      if (typeof showToast === 'function') {
        showToast('📢 ¡Tu observación fue publicada en el muro comunitario!');
      } else if (typeof Auth !== 'undefined' && typeof Auth.mostrarNotificacion === 'function') {
        Auth.mostrarNotificacion('📢 ¡Observación publicada con éxito!');
      }
    });
  }

  // Cerrar sesión
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

  updateFormAuthor();
  renderFeed();

})();
