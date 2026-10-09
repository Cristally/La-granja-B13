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
    : { rol: 'estudiante', nombre: 'Estudiante Demo', curso: '1° Medio A' };

  if (typeof state === 'undefined' || !state) {
    if (typeof loadState === 'function') loadState();
  }

  // Aplicar tema guardado
  if (typeof applyGranjaTheme === 'function' && typeof state !== 'undefined' && state) {
    applyGranjaTheme(state.themeMode || 'light', state.themeBg || '#FAF7EE');
  }

  const STORAGE_KEY_MURO = 'granjaMuroPosts_v1';

  function sanitizeAvatarIcon(icon) {
    if (!icon || typeof icon !== 'string') return '🧑‍🌾';
    const trimmed = icon.trim();
    if (trimmed === '' || trimmed.includes('?') || trimmed.includes('') || trimmed.length > 4) {
      return '🧑‍🌾';
    }
    return trimmed;
  }

  function sanitizeStudentGrade(grade) {
    if (!grade || typeof grade !== 'string') return '1° Medio A';
    let clean = grade.replace(/[?]+/g, '°').trim();
    clean = clean.replace(/^(\d+)\s+Medio/i, '$1° Medio');
    return clean || '1° Medio A';
  }

  function sanitizeText(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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
      text: 'Hoy en el recreo vi a Nesquik comiendo heno en la conejera. Tenía el pelaje súper esponjoso y limpio. Recuerden no darle pan ni galletas porque les hace mal a la guatita. El heno los cuida y los mantiene sanos.',
      photo: 'assets/img/animals/nesquik.png',
      timestamp: 'Hoy, hace 1 hora',
      likes: 8,
      replies: [
        {
          author: 'Prof. Ana Reyes',
          role: 'docente',
          avatar: '👩‍🏫',
          text: '¡Excelente observación Yefrin! El heno es fundamental para que desgasten sus dientes de forma natural y tengan una digestión sana.',
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
          text: 'El equipo de turno renueva su agua dos veces al día para que puedan bañarse y mantener sus plumas limpias y sanas.',
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
    },
    {
      id: 'post_4',
      author: 'Estudiante Prueba',
      course: '1° Medio A',
      avatar: '🧑‍🌾',
      avatarColor: '#ffd83d',
      category: 'aves',
      catLabel: '🦜 Aviario & Loros',
      text: '¿Cuál es la fruta favorita de los agapornis de la granja?',
      photo: '',
      timestamp: 'Hace 2 días',
      likes: 6,
      replies: [
        {
          author: 'Profesor/a B-13',
          role: 'docente',
          avatar: '👩‍🏫',
          text: 'A los agapornis les encanta la manzana roja en rodajas finas (siempre sin semillas) y trocitos de pera madura.',
          timestamp: 'Hace 2 días'
        }
      ]
    }
  ];

  function sanitizePostTexts(posts) {
    if (!Array.isArray(posts)) return DEFAULT_POSTS;
    return posts.map(p => {
      if (p.id === 'post_1' || (p.text && p.text.includes('cecotrófica'))) {
        p.text = 'Hoy en el recreo vi a Nesquik comiendo heno en la conejera. Tenía el pelaje súper esponjoso y limpio. Recuerden no darle pan ni galletas porque les hace mal a la guatita. El heno los cuida y los mantiene sanos.';
        if (Array.isArray(p.replies) && p.replies[0]) {
          p.replies[0].text = '¡Excelente observación Yefrin! El heno es fundamental para que desgasten sus dientes de forma natural y tengan una digestión sana.';
        }
      }
      if (p.id === 'post_2' || (p.replies && p.replies.some(r => r.text && r.text.includes('uropígeas')))) {
        if (Array.isArray(p.replies) && p.replies[0]) {
          p.replies[0].text = 'El equipo de turno renueva su agua dos veces al día para que puedan bañarse y mantener sus plumas limpias y sanas.';
        }
      }
      if (p.catLabel === '❓ Pregunta Zootécnica') p.catLabel = '❓ Preguntas y Dudas';
      if (p.catLabel === '💡 Curiosidad de Campo') p.catLabel = '💡 Curiosidades';
      return p;
    });
  }

  function getStoredPosts() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MURO);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return sanitizePostTexts(parsed);
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
  let currentActiveFilter = 'all';

  // Sincronizar con /api/comments si está disponible el servidor
  async function syncWithServerComments() {
    try {
      const res = await fetch('/api/comments');
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && Array.isArray(json.comments) && json.comments.length > 0) {
          const catMapReverse = {
            conejos: '🐇 Conejos & Conejeras',
            gallinas: '🐔 Gallinas & Gallos',
            patos: '🦆 Patos & Estanque',
            aves: '🦜 Aviario & Loros',
            huerto: '🌱 Huerto & Botánica',
            pregunta: '❓ Preguntas y Dudas',
            curiosidad: '💡 Curiosidades'
          };

          const serverPosts = json.comments.map(c => {
            const cat = c.categoria || (c.isQuestion ? 'pregunta' : 'conejos');
            const replies = Array.isArray(c.replies) ? c.replies.map(r => ({
              author: r.author || r.autor || 'Docente B-13',
              role: r.role || r.rol || 'docente',
              avatar: sanitizeAvatarIcon(r.avatar || '👩‍🏫'),
              text: r.text || r.mensaje || '',
              timestamp: r.timestamp || 'Reciente'
            })) : [];

            return {
              id: c.id || ('srv_' + Date.now()),
              author: c.author || c.autor || 'Estudiante B-13',
              course: sanitizeStudentGrade(c.course || c.curso || '1° Medio A'),
              avatar: sanitizeAvatarIcon(c.avatar),
              avatarColor: '#ffd83d',
              category: cat,
              catLabel: catMapReverse[cat] || '🌾 General',
              text: c.text || c.mensaje || '',
              photo: c.foto || c.photo || '',
              timestamp: c.timestamp ? new Date(c.timestamp).toLocaleDateString('es-CL', { day:'numeric', month:'short' }) : 'Reciente',
              likes: c.likes || 1,
              replies: replies
            };
          });

          // Mezclar sin duplicar por ID
          const existingIds = new Set(postsData.map(p => p.id));
          serverPosts.forEach(sp => {
            if (!existingIds.has(sp.id)) {
              postsData.push(sp);
              existingIds.add(sp.id);
            }
          });
          savePosts(postsData);
          renderFeed();
        }
      }
    } catch (e) {
      // Offline o sin servidor backend, opera localmente sin problemas
    }
  }

  // Renderizar autor en el formulario
  function updateFormAuthor() {
    const avatarEl = document.getElementById('postAuthorAvatar');
    const nameEl = document.getElementById('postAuthorName');
    const gradeEl = document.getElementById('postAuthorGrade');

    const curAvatar = (typeof state !== 'undefined' && state && state.avatarIcon) ? state.avatarIcon : (sesion.avatar || '🧑‍🌾');
    const curName = (typeof state !== 'undefined' && state && state.studentName) ? state.studentName : (sesion.nombre || 'Estudiante B-13');
    const curGrade = (typeof state !== 'undefined' && state && state.studentGrade) ? state.studentGrade : (sesion.curso || '1° Medio A');

    if (avatarEl) avatarEl.textContent = sanitizeAvatarIcon(curAvatar);
    if (nameEl) nameEl.textContent = curName;
    if (gradeEl) gradeEl.textContent = `Curso: ${sanitizeStudentGrade(curGrade)}`;
  }

  // Renderizar publicaciones
  function renderFeed() {
    const container = document.getElementById('postsFeedContainer');
    const totalEl = document.getElementById('muroTotalPosts');

    const filtered = (currentActiveFilter === 'all')
      ? postsData
      : postsData.filter(p => p.category === currentActiveFilter);

    if (totalEl) totalEl.textContent = postsData.length;
    if (!container) return;

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:#64748b;">
          <span style="font-size:3rem;">🌾</span>
          <p style="margin-top:10px;font-size:0.95rem;">No hay publicaciones en esta categoría. ¡Sé el primero en compartir una observación!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(post => {
      const safeAvatar = sanitizeAvatarIcon(post.avatar);
      const safeGrade = sanitizeStudentGrade(post.course);
      const safeText = sanitizeText(post.text);

      return `
        <article class="post-item-card" id="${post.id}">
          <div class="post-author-row">
            <div class="post-author-avatar" style="border-color:${post.avatarColor || '#ffd83d'};">
              ${safeAvatar}
            </div>
            <div style="flex:1;min-width:0;">
              <div style="font-weight:800;font-size:0.95rem;color:#1e293b;">
                ${post.author}
              </div>
              <div style="font-size:0.75rem;color:#64748b;">
                ${safeGrade ? `${safeGrade} · ` : ''}${post.timestamp}
              </div>
            </div>
            <span class="post-cat-badge">${post.catLabel || '🌾 General'}</span>
          </div>

          <div class="post-content-text">${safeText}</div>

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
              ${post.replies.map(r => {
                const isTeacher = r.role === 'docente' || r.role === 'profesor';
                const rAvatar = sanitizeAvatarIcon(r.avatar || (isTeacher ? '👩‍🏫' : '💬'));
                const rText = sanitizeText(r.text);

                return `
                  <div class="reply-item">
                    <div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;">
                      <span>${rAvatar}</span>
                      <b style="color:${isTeacher ? '#15803d' : '#1e293b'};">${r.author}</b>
                      ${isTeacher ? '<span style="font-size:0.68rem;background:#dcfce7;color:#15803d;padding:1px 6px;border-radius:4px;font-weight:800;border:1px solid #86efac;">Docente B-13</span>' : ''}
                      <span style="font-size:0.7rem;color:#94a3b8;margin-left:auto;">${r.timestamp}</span>
                    </div>
                    <div style="color:#334155;padding-left:22px;line-height:1.4;">${rText}</div>
                  </div>
                `;
              }).join('')}
            </div>
          ` : ''}

          <!-- Formulario para responder desplegable -->
          <div class="reply-form-wrap" id="replyFormWrap_${post.id}" style="display:none;margin-top:10px;">
            <div style="display:flex;gap:8px;">
              <input type="text" id="replyInput_${post.id}" placeholder="Escribe tu respuesta o aporte..." style="flex:1;padding:8px 10px;border:1.5px solid #cbd5e1;border-radius:6px;font-size:0.85rem;">
              <button type="button" class="tool-btn send-reply-btn" data-id="${post.id}" style="padding:8px 14px;background:var(--grass-dark, #2b5329);color:#fff;font-weight:800;font-size:0.82rem;border-radius:6px;border:none;cursor:pointer;">
                Enviar
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');

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
          if (box.style.display === 'block') {
            const input = document.getElementById(`replyInput_${pId}`);
            if (input) input.focus();
          }
        }
      });
    });

    container.querySelectorAll('.send-reply-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pId = btn.dataset.id;
        const input = document.getElementById(`replyInput_${pId}`);
        if (!input || !input.value.trim()) return;

        const target = postsData.find(p => p.id === pId);
        if (target) {
          const authorName = (typeof state !== 'undefined' && state && state.studentName) ? state.studentName : (sesion.nombre || 'Estudiante B-13');
          const isDocente = (sesion.rol === 'profesor' || sesion.rol === 'admin');
          const replyAvatar = isDocente ? '👩‍🏫' : sanitizeAvatarIcon((typeof state !== 'undefined' && state && state.avatarIcon) ? state.avatarIcon : '🧑‍🌾');
          const replyText = input.value.trim();

          target.replies = target.replies || [];
          target.replies.push({
            author: authorName,
            role: isDocente ? 'docente' : 'estudiante',
            avatar: replyAvatar,
            text: replyText,
            timestamp: 'Hace un momento'
          });
          savePosts(postsData);

          // Enviar también al backend si es posible
          try {
            await fetch(`/api/comments/${encodeURIComponent(pId)}/reply`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                author: authorName,
                role: isDocente ? 'profesor' : 'estudiante',
                avatar: replyAvatar,
                text: replyText
              })
            });
          } catch (e) {}

          renderFeed();
        }
      });
    });
  }

  // Manejar envío de nueva publicación
  const submitBtn = document.getElementById('btnSubmitPost');
  if (submitBtn) {
    submitBtn.addEventListener('click', async () => {
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
        pregunta: '❓ Preguntas y Dudas',
        curiosidad: '💡 Curiosidades'
      };

      const authorName = (typeof state !== 'undefined' && state && state.studentName) ? state.studentName : (sesion.nombre || 'Estudiante B-13');
      const authorGrade = (typeof state !== 'undefined' && state && state.studentGrade) ? state.studentGrade : (sesion.curso || '1° Medio A');
      const authorAvatar = (typeof state !== 'undefined' && state && state.avatarIcon) ? state.avatarIcon : (sesion.avatar || '🧑‍🌾');
      const chosenCat = catSelect ? catSelect.value : 'conejos';

      const newPost = {
        id: 'post_' + Date.now(),
        author: authorName,
        course: sanitizeStudentGrade(authorGrade),
        avatar: sanitizeAvatarIcon(authorAvatar),
        avatarColor: '#ffd83d',
        category: chosenCat,
        catLabel: catMap[chosenCat] || '🌾 General',
        text: text,
        photo: photoSelect ? photoSelect.value : '',
        timestamp: 'Hace un momento',
        likes: 0,
        replies: []
      };

      postsData.unshift(newPost);
      savePosts(postsData);

      // Intentar enviar al backend
      try {
        await fetch('/api/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            author: authorName,
            course: authorGrade,
            role: (sesion.rol === 'profesor' || sesion.rol === 'admin') ? 'profesor' : 'estudiante',
            avatar: authorAvatar,
            text: text,
            categoria: chosenCat,
            photo: photoSelect ? photoSelect.value : ''
          })
        });
      } catch (e) {}

      if (textInput) textInput.value = '';
      if (photoSelect) photoSelect.value = '';

      renderFeed();

      if (typeof Auth !== 'undefined' && typeof Auth.mostrarNotificacion === 'function') {
        Auth.mostrarNotificacion('📢 ¡Observación publicada con éxito!');
      } else {
        alert('📢 ¡Tu observación fue publicada con éxito en el muro comunitario!');
      }
    });
  }

  // Filtros por categoría
  const filterPills = document.querySelectorAll('.muro-filter-pill');
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentActiveFilter = pill.dataset.cat || 'all';
      renderFeed();
    });
  });

  // Preseleccionar si viene por parámetro URL ?animal=...
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const animalParam = urlParams.get('animal');
    if (animalParam) {
      const a = animalParam.toLowerCase();
      let targetCat = 'all';
      if (a.includes('conejo') || a.includes('nesquik')) targetCat = 'conejos';
      else if (a.includes('galli') || a.includes('gallo') || a.includes('tormenta') || a.includes('milagro') || a.includes('vicente')) targetCat = 'gallinas';
      else if (a.includes('pato') || a.includes('sal') || a.includes('pimienta')) targetCat = 'patos';
      else if (a.includes('loro') || a.includes('agapornis') || a.includes('catita') || a.includes('ave')) targetCat = 'aves';
      else if (a.includes('huerto') || a.includes('planta') || a.includes('bancal')) targetCat = 'huerto';

      if (targetCat !== 'all') {
        currentActiveFilter = targetCat;
        const matchingPill = document.querySelector(`.muro-filter-pill[data-cat="${targetCat}"]`);
        if (matchingPill) {
          filterPills.forEach(p => p.classList.remove('active'));
          matchingPill.classList.add('active');
        }
        const catSelect = document.getElementById('postCatSelect');
        if (catSelect) catSelect.value = targetCat;
      }
    }
  } catch (e) {}

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
  syncWithServerComments();

})();
