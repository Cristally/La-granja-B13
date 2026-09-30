/*
  ranking.js — Salón de Honor y Leaderboard Oficial de La Granja B-13.
  Sistema de Ranking por Puntaje Puro (sin repetición de quizzes),
  con efectos especiales tipo videojuego para el Top 3 (Oro 👑, Plata 🥈, Bronce 🥉),
  soporte para vista lateral en PC y modal desplegable en dispositivos móviles.
*/

(function() {
  'use strict';

  // Estado inicial colapsado por defecto para no invadir márgenes ni tapar el potrero
  let currentFilter = 'general'; // 'general' | 'curso'
  let isSidebarCollapsed = true;

  // Cargar preferencia de colapso desde localStorage si el usuario ya interactuó
  try {
    const savedCol = localStorage.getItem('granja_ranking_collapsed');
    if (savedCol !== null) isSidebarCollapsed = (savedCol === 'true');
  } catch (e) {}

  /**
   * Obtiene la lista unificada de estudiantes reales y calcula su puntaje puro (sin repetición)
   */
  async function obtenerListaRanking() {
    let listaServidor = null;

    // 1. Intentar consultar API del backend si está disponible
    try {
      if (typeof fetch === 'function') {
        const res = await fetch('/api/ranking');
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.ranking) && json.ranking.length > 0) {
            listaServidor = json.ranking;
          }
        }
      }
    } catch (e) {
      // Backend no activo, continuar con localStorage
    }

    // 2. Extraer estudiantes guardados en localStorage
    let perfilesLocales = {};
    if (typeof loadAllProfiles === 'function') {
      try {
        perfilesLocales = loadAllProfiles() || {};
      } catch (e) {}
    }

    let cuentasLocales = [];
    if (typeof Auth !== 'undefined' && typeof Auth.getEstudiantes === 'function') {
      try {
        cuentasLocales = Auth.getEstudiantes() || [];
      } catch (e) {}
    }

    // 3. Estudiante en sesión activa
    let estudianteActivo = null;
    if (typeof state !== 'undefined' && state.studentName && state.studentName.trim() !== '') {
      const pure = typeof window.computePureScore === 'function' ? window.computePureScore(state) : (state.pureScore || state.score || 0);
      estudianteActivo = {
        id: (state.studentName.trim() + '_' + (state.studentGrade || '').trim()).toLowerCase(),
        studentName: state.studentName.trim(),
        studentGrade: (state.studentGrade || '').trim() || 'Liceo B-13',
        avatarIcon: state.avatarIcon || '🧑‍🌾',
        pureScore: pure,
        score: pure,
        quizzesCount: (Object.keys(state.mapQuiz || {}).filter(k => state.mapQuiz[k] && state.mapQuiz[k].completed).length),
        badgesCount: (state.badges || []).length,
        isCurrent: true
      };
    }

    // Mapa unificador por ID normalizado: SOLO alumnos que existen con cuenta en el sistema
    const mapaEstudiantes = new Map();

    // A. Cuentas creadas y registradas (con correo y clave en Auth)
    cuentasLocales.forEach(c => {
      if (!c.nombre || c.nombre.trim() === '') return;
      const id = (c.nombre.trim() + '_' + (c.curso || '').trim()).toLowerCase();
      mapaEstudiantes.set(id, {
        id,
        studentName: c.nombre.trim(),
        studentGrade: (c.curso || '').trim() || 'Liceo B-13',
        avatarIcon: c.genero === 'Femenino' ? '🌸' : (c.genero === 'Masculino' ? '🧢' : '🧑‍🌾'),
        pureScore: 0,
        score: 0,
        badgesCount: 0,
        quizzesCount: 0
      });
    });

    // B. Perfiles reales en localStorage vinculados a cuentas
    Object.values(perfilesLocales).forEach(p => {
      if (!p.studentName || p.studentName.trim() === '') return;
      const id = (p.studentName.trim() + '_' + (p.studentGrade || '').trim()).toLowerCase();
      const pure = typeof window.computePureScore === 'function'
        ? window.computePureScore(p.stateData || p)
        : (p.pureScore || p.score || 0);

      const existing = mapaEstudiantes.get(id);
      mapaEstudiantes.set(id, {
        id,
        studentName: p.studentName.trim(),
        studentGrade: (p.studentGrade || '').trim() || 'Liceo B-13',
        avatarIcon: p.avatarIcon || (existing ? existing.avatarIcon : '🧑‍🌾'),
        pureScore: pure,
        score: pure,
        badgesCount: p.badgesCount || 0,
        quizzesCount: (p.mapQuizCompleted || 0)
      });
    });

    // C. Datos del servidor si existían
    if (listaServidor) {
      listaServidor.forEach(s => {
        if (!s.studentName) return;
        const id = (s.studentName.trim() + '_' + (s.studentGrade || '').trim()).toLowerCase();
        const pure = Number.isFinite(s.pureScore) ? s.pureScore : (s.score || 0);
        const existing = mapaEstudiantes.get(id);
        mapaEstudiantes.set(id, {
          id,
          studentName: s.studentName.trim(),
          studentGrade: (s.studentGrade || '').trim() || 'Liceo B-13',
          avatarIcon: s.avatarIcon || (existing ? existing.avatarIcon : '🧑‍🌾'),
          pureScore: pure,
          score: pure,
          badgesCount: s.badgesCount || (existing ? existing.badgesCount : 0),
          quizzesCount: s.quizzesCount || (existing ? existing.quizzesCount : 0)
        });
      });
    }

    // D. Sobrescribir con estudiante activo actual
    if (estudianteActivo) {
      mapaEstudiantes.set(estudianteActivo.id, estudianteActivo);
    }

    // Convertir a lista y ordenar por Puntaje Puro descendente
    const lista = Array.from(mapaEstudiantes.values()).sort((a, b) => {
      if (b.pureScore !== a.pureScore) {
        return b.pureScore - a.pureScore;
      }
      return (b.badgesCount || 0) - (a.badgesCount || 0);
    });

    return {
      ranking: lista,
      estudianteActivo
    };
  }

  /**
   * Inyecta la estructura HTML del widget de Ranking en la página
   */
  function inyectarEstructuraRanking() {
    if (document.getElementById('rankingSidebar')) return;

    // Sidebar de PC
    const aside = document.createElement('aside');
    aside.id = 'rankingSidebar';
    aside.className = 'ranking-sidebar' + (isSidebarCollapsed ? ' collapsed' : '');
    aside.setAttribute('aria-label', 'Salón de Honor B-13');

    aside.innerHTML = `
      <!-- Pestaña lateral para colapsar/desplegar en PC -->
      <button class="ranking-tab-handle" id="rankingTabHandle" type="button" title="Colapsar o expandir Salón de Honor">
        <span class="handle-icon">🏆</span>
        <span class="handle-label">TOP 10</span>
        <span class="handle-arrow">${isSidebarCollapsed ? '‹' : '›'}</span>
      </button>

      <div class="ranking-container">
        <!-- Encabezado Gaming con efectos -->
        <div class="ranking-header">
          <div class="ranking-header-title-row">
            <div class="ranking-trophy-vfx">🏆</div>
            <div>
              <h3 class="ranking-title">Salón de Honor B-13</h3>
              <div class="ranking-subtitle-row">
                <span class="pure-badge" title="Puntaje Puro: Suma de mejores puntajes por cada animal/desafío único. Sin repetición acumulativa.">
                  ⭐ Puntaje Puro
                </span>
                <button type="button" class="ranking-info-trigger" id="rankingInfoBtn" title="¿Qué es el Puntaje Puro?">ℹ️</button>
              </div>
            </div>
          </div>
          <button class="ranking-header-close" id="rankingHeaderCloseBtn" type="button" title="Cerrar panel">✕</button>
        </div>

        <!-- Filtros: General vs Mi Curso -->
        <div class="ranking-filter-bar">
          <button type="button" class="ranking-filter-btn ${currentFilter === 'general' ? 'active' : ''}" data-filter="general">
            <span>🌐</span> Todo el Liceo
          </button>
          <button type="button" class="ranking-filter-btn ${currentFilter === 'curso' ? 'active' : ''}" data-filter="curso">
            <span>🏫</span> Mi Curso
          </button>
        </div>

        <!-- Lista scrolleable de tarjetas con efectos -->
        <div class="ranking-list" id="rankingList">
          <div class="ranking-loading">Cargando Salón de Honor...</div>
        </div>

        <!-- Barra fija inferior con estado del estudiante actual -->
        <div class="ranking-my-status" id="rankingMyStatus"></div>
      </div>
    `;

    document.body.appendChild(aside);

    // Modal explicativo de Puntaje Puro
    const infoModal = document.createElement('div');
    infoModal.id = 'pureScoreInfoModal';
    infoModal.className = 'overlay';
    infoModal.style.display = 'none';
    infoModal.innerHTML = `
      <div class="card" style="max-width:440px;text-align:center;padding:22px 20px;">
        <button class="close-btn" id="closePureInfoBtn" aria-label="Cerrar">✕</button>
        <div style="font-size:3rem;margin-bottom:8px;">⚖️⭐</div>
        <h3 style="margin:0 0 8px;font-family:'Fraunces',serif;color:var(--grass-dark);font-size:1.3rem;">
          ¿Qué es el Puntaje Puro?
        </h3>
        <p style="font-size:0.88rem;line-height:1.5;color:var(--ink);text-align:left;margin-bottom:14px;">
          En <b>La Granja B-13</b> premiamos el conocimiento auténtico y el aprendizaje integral de todas las especies.
        </p>
        <div style="background:var(--paper-dark);border:2px solid var(--ink);border-radius:8px;padding:12px 14px;text-align:left;font-size:0.83rem;line-height:1.45;margin-bottom:16px;">
          ✔️ <b>Sin Repetición:</b> Cada quiz que rindes te otorga hasta 90 puntos puros. Si reintentas el quiz para mejorar, solo se conserva tu <b>mejor calificación</b> en esa especie.
          <br><br>
          🚫 <b>Juego Limpio:</b> Repetir el mismo animal varias veces no suma puntos extra infinitos. ¡Para llegar al <b>Top 1</b> debes dominar todos los animales y zonas de la granja!
        </div>
        <button type="button" class="tool-btn" id="acceptPureInfoBtn" style="width:100%;padding:10px;background:var(--hay);color:var(--ink);font-weight:700;border:2px solid var(--ink);border-radius:6px;cursor:pointer;">
          ¡Entendido! 🚀
        </button>
      </div>
    `;
    document.body.appendChild(infoModal);

    // Botón flotante para móviles en pantallas pequeñas
    if (!document.getElementById('mobileRankingFloatBtn')) {
      const floatBtn = document.createElement('button');
      floatBtn.id = 'mobileRankingFloatBtn';
      floatBtn.className = 'mobile-ranking-float-btn';
      floatBtn.type = 'button';
      floatBtn.title = 'Abrir Salón de Honor B-13';
      floatBtn.innerHTML = `
        <span class="float-trophy">🏆</span>
        <span class="float-txt">TOP</span>
      `;
      floatBtn.addEventListener('click', toggleRankingWidget);
      document.body.appendChild(floatBtn);
    }

    // Configurar listeners de interacción
    document.getElementById('rankingTabHandle').addEventListener('click', toggleSidebarCollapse);
    document.getElementById('rankingHeaderCloseBtn').addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        aside.classList.remove('mobile-open');
      } else {
        toggleSidebarCollapse();
      }
    });

    document.getElementById('rankingInfoBtn').addEventListener('click', () => {
      infoModal.style.display = 'flex';
      infoModal.classList.add('active');
    });

    const cerrarInfo = () => {
      infoModal.style.display = 'none';
      infoModal.classList.remove('active');
    };
    document.getElementById('closePureInfoBtn').addEventListener('click', cerrarInfo);
    document.getElementById('acceptPureInfoBtn').addEventListener('click', cerrarInfo);

    // Pestañas de filtro
    aside.querySelectorAll('.ranking-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        aside.querySelectorAll('.ranking-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter || 'general';
        renderizarRanking();
      });
    });

    // Conectar botón en la barra superior si existe
    const topBarBtn = document.getElementById('leaderboardBtn');
    if (topBarBtn) {
      topBarBtn.addEventListener('click', toggleRankingWidget);
    }
  }

  function toggleSidebarCollapse() {
    const aside = document.getElementById('rankingSidebar');
    if (!aside) return;

    if (window.innerWidth < 1024) {
      aside.classList.toggle('mobile-open');
      return;
    }

    isSidebarCollapsed = !isSidebarCollapsed;
    aside.classList.toggle('collapsed', isSidebarCollapsed);
    const arrow = aside.querySelector('.handle-arrow');
    if (arrow) arrow.textContent = isSidebarCollapsed ? '‹' : '›';

    try {
      localStorage.setItem('granja_ranking_collapsed', isSidebarCollapsed ? 'true' : 'false');
    } catch (e) {}
  }

  function toggleRankingWidget() {
    const aside = document.getElementById('rankingSidebar');
    if (!aside) return;

    if (window.innerWidth < 1024) {
      aside.classList.toggle('mobile-open');
    } else {
      if (aside.classList.contains('collapsed')) {
        toggleSidebarCollapse();
      } else {
        aside.scrollIntoView({ behavior: 'smooth' });
      }
    }
    renderizarRanking();
  }
  window.toggleRankingWidget = toggleRankingWidget;

  /**
   * Renderiza las tarjetas del ranking aplicando los efectos especiales del Top 3
   */
  async function renderizarRanking() {
    const listEl = document.getElementById('rankingList');
    const myStatusEl = document.getElementById('rankingMyStatus');
    if (!listEl) return;

    const data = await obtenerListaRanking();
    let ranking = data.ranking || [];
    const estudianteActivo = data.estudianteActivo;

    // Filtrar por curso si corresponde
    if (currentFilter === 'curso') {
      const miCurso = (estudianteActivo && estudianteActivo.studentGrade) ? estudianteActivo.studentGrade.trim().toLowerCase() : '';
      if (miCurso) {
        ranking = ranking.filter(s => (s.studentGrade || '').trim().toLowerCase() === miCurso);
      } else {
        listEl.innerHTML = `
          <div class="ranking-empty-msg">
            <span>🏫</span>
            <p>Ingresa como estudiante con tu curso para ver la competencia de tu sala.</p>
          </div>
        `;
        actualizarMiEstado(myStatusEl, estudianteActivo, ranking);
        return;
      }
    }

    if (ranking.length === 0) {
      listEl.innerHTML = `
        <div class="ranking-empty-msg">
          <span>🌾</span>
          <p>No hay estudiantes registrados en este curso aún.<br>¡Sé el primero en el podio!</p>
        </div>
      `;
      actualizarMiEstado(myStatusEl, estudianteActivo, ranking);
      return;
    }

    // Identificar posición del estudiante activo
    let miPosicion = -1;
    if (estudianteActivo) {
      miPosicion = ranking.findIndex(s => s.id === estudianteActivo.id) + 1;
    }

    let html = '';
    // 1. Mostrar los estudiantes reales registrados (máx 10)
    const realCount = Math.min(ranking.length, 10);

    for (let i = 0; i < realCount; i++) {
      const st = ranking[i];
      const rankNum = i + 1;
      const isTop1 = (rankNum === 1);
      const isTop2 = (rankNum === 2);
      const isTop3 = (rankNum === 3);
      const isMe = estudianteActivo && (st.id === estudianteActivo.id);

      let cardClass = 'ranking-card ';
      if (isTop1) cardClass += 'rank-1 ';
      else if (isTop2) cardClass += 'rank-2 ';
      else if (isTop3) cardClass += 'rank-3 ';
      else cardClass += 'rank-other ';

      if (isMe) cardClass += 'is-me ';

      // Efectos especiales y badges según puesto
      let badgeHtml = '';
      let crownVfx = '';
      let shimmerVfx = '';
      let particleVfx = '';

      if (isTop1) {
        crownVfx = `<span class="vfx-crown" title="Gran Campeón/a B-13">👑</span>`;
        shimmerVfx = `<div class="shimmer-wrapper"><div class="vfx-shimmer gold-shimmer"></div></div>`;
        particleVfx = `<span class="vfx-sparkle s1">✨</span><span class="vfx-sparkle s2">⭐</span>`;
        badgeHtml = `<span class="rank-pos-badge gold-badge"><span class="badge-num">1°</span> ORO</span>`;
      } else if (isTop2) {
        shimmerVfx = `<div class="shimmer-wrapper"><div class="vfx-shimmer silver-shimmer"></div></div>`;
        particleVfx = `<span class="vfx-sparkle silver-spark">✨</span>`;
        badgeHtml = `<span class="rank-pos-badge silver-badge"><span class="badge-num">2°</span> PLATA</span>`;
      } else if (isTop3) {
        badgeHtml = `<span class="rank-pos-badge bronze-badge"><span class="badge-num">3°</span> BRONCE</span>`;
      } else {
        badgeHtml = `<span class="rank-pos-badge other-badge">#${rankNum}</span>`;
      }

      html += `
        <div class="${cardClass}" data-rank="${rankNum}">
          ${shimmerVfx}
          ${particleVfx}
          <div class="ranking-card-left">
            <div class="ranking-avatar-wrap">
              ${crownVfx}
              <div class="ranking-avatar-box">
                <span class="ranking-avatar-icon">${st.avatarIcon || '🧑‍🌾'}</span>
              </div>
            </div>
            <div class="ranking-user-info">
              <div class="ranking-name-row">
                <span class="ranking-name" title="${st.studentName}">${st.studentName}</span>
                ${isMe ? '<span class="me-tag">¡TÚ! 🌟</span>' : ''}
              </div>
              <div class="ranking-grade-tag">
                <span>🏫</span> ${st.studentGrade || 'Enseñanza Media'}
              </div>
            </div>
          </div>
          <div class="ranking-card-right">
            ${badgeHtml}
            <div class="ranking-pts-box">
              <b class="ranking-pts-val">${st.pureScore}</b>
              <span class="ranking-pts-lbl">pts puros</span>
            </div>
          </div>
        </div>
      `;
    }

    // 2. Rellenar los espacios vacíos restantes hasta completar el Top 10 estilo demo de juego
    for (let j = realCount; j < 10; j++) {
      const slotNum = j + 1;
      const isPodiumSlot = slotNum <= 3;
      const slotBadge = slotNum === 1
        ? `<span class="rank-pos-badge empty-gold-badge">1° ORO</span>`
        : (slotNum === 2
          ? `<span class="rank-pos-badge empty-silver-badge">2° PLATA</span>`
          : (slotNum === 3
            ? `<span class="rank-pos-badge empty-bronze-badge">3° BRONCE</span>`
            : `<span class="rank-pos-badge other-badge">#${slotNum}</span>`));

      html += `
        <div class="ranking-card slot-empty rank-other ${isPodiumSlot ? 'podium-empty' : ''}" data-rank="${slotNum}">
          <div class="ranking-card-left">
            <div class="ranking-avatar-wrap">
              <div class="ranking-avatar-box empty-avatar-box">
                <span class="ranking-avatar-icon">${isPodiumSlot ? '🏆' : '🌱'}</span>
              </div>
            </div>
            <div class="ranking-user-info">
              <div class="ranking-name-row">
                <span class="ranking-name empty-name">[Espacio Disponible]</span>
              </div>
              <div class="ranking-grade-tag empty-grade">
                <span>⭐</span> ¡Rinde quizzes para reclamar!
              </div>
            </div>
          </div>
          <div class="ranking-card-right">
            ${slotBadge}
            <div class="ranking-pts-box">
              <b class="ranking-pts-val empty-pts">---</b>
              <span class="ranking-pts-lbl">pts puros</span>
            </div>
          </div>
        </div>
      `;
    }

    listEl.innerHTML = html;
    actualizarMiEstado(myStatusEl, estudianteActivo, ranking, miPosicion);
  }

  /**
   * Actualiza el pie fijo del ranking con la posición del estudiante conectado
   */
  function actualizarMiEstado(container, estudianteActivo, ranking, miPosicion) {
    if (!container) return;

    if (!estudianteActivo) {
      container.innerHTML = `
        <div class="my-status-box guest">
          <div class="my-status-ic">🧭</div>
          <div class="my-status-text">
            <b>Modo Visita Activo</b>
            <span>Ingresa como estudiante para sumar puntos puros y entrar al Salón de Honor.</span>
          </div>
        </div>
      `;
      return;
    }

    const posTxt = (miPosicion > 0) ? `#${miPosicion} Lugar` : 'Sin Clasificar';
    const pts = estudianteActivo.pureScore || 0;

    let mensajeMotivacional = '¡Rinde desafíos en el Mapa 3D para subir posiciones! 🚀';
    if (miPosicion === 1) mensajeMotivacional = '👑 ¡Eres el Campeón Supremo de La Granja B-13!';
    else if (miPosicion === 2 || miPosicion === 3) mensajeMotivacional = '🔥 ¡Estás en el Podio de Honor! ¡Defiende tu lugar!';
    else if (miPosicion <= 10 && miPosicion > 0) mensajeMotivacional = '✨ ¡Estás dentro del TOP 10 oficial del Liceo!';

    container.innerHTML = `
      <div class="my-status-box active-student">
        <div class="my-status-avatar-box">
          <span class="my-status-avatar">${estudianteActivo.avatarIcon || '🧑‍🌾'}</span>
        </div>
        <div class="my-status-info">
          <div class="my-status-top-row">
            <span class="my-status-name">${estudianteActivo.studentName}</span>
            <span class="my-status-rank-pill">${posTxt}</span>
          </div>
          <div class="my-status-bottom-row">
            <span class="my-status-pts"><b>${pts}</b> pts puros</span>
            <span class="my-status-motto">${mensajeMotivacional}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Refresco público accesible desde cualquier evento del juego
  window.refreshRankingWidget = function() {
    renderizarRanking();
  };

  // Inicializar al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      inyectarEstructuraRanking();
      renderizarRanking();
    });
  } else {
    inyectarEstructuraRanking();
    renderizarRanking();
  }
})();
