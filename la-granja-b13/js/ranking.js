/*
  ranking.js — Salón de Honor y Leaderboard Oficial de La Granja B-13.
  Sistema de Ranking por Puntaje Puro (sin repetición de quizzes),
  con efectos especiales tipo videojuego para el Top 3 (Oro 👑, Plata 🥈, Bronce 🥉),
  soporte para vista lateral en PC y modal desplegable en dispositivos móviles.
*/

(function() {
  'use strict';

  // Detectar si estamos en la vista de minijuegos para priorizar la pestaña correspondiente
  const isJuegosPage = typeof window !== 'undefined' && window.location && window.location.pathname.includes('juegos');
  let currentFilter = isJuegosPage ? 'juegos' : 'general'; // 'general' | 'curso' | 'juegos'
  let isSidebarCollapsed = true;

  // Cargar preferencia de colapso desde localStorage si el usuario ya interactuó
  try {
    const savedCol = localStorage.getItem('granja_ranking_collapsed');
    if (savedCol !== null) isSidebarCollapsed = (savedCol === 'true');
  } catch (e) {}

  function parseMinigamesStats(src) {
    if (!src) return { memScore: 0, wsScore: 0, platScore: 0, gamesScore: 0 };
    const mg = src.minigames || {};
    const memScore = (mg.memory && typeof mg.memory.bestScore === 'number') ? mg.memory.bestScore : 0;
    const wsScore = (mg.wordsearch && typeof mg.wordsearch.bestScore === 'number') ? mg.wordsearch.bestScore : 0;
    const platScore = (mg.platformer && typeof mg.platformer.bestScore === 'number') ? mg.platformer.bestScore : 0;
    const gamesScore = memScore + wsScore + platScore;
    return { memScore, wsScore, platScore, gamesScore };
  }

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
      const activeMg = parseMinigamesStats(state);
      estudianteActivo = {
        id: (state.studentName.trim() + '_' + (state.studentGrade || '').trim()).toLowerCase(),
        studentName: state.studentName.trim(),
        studentGrade: (state.studentGrade || '').trim() || 'Liceo B-13',
        avatarIcon: state.avatarIcon || '🧑‍🌾',
        pureScore: pure,
        score: pure,
        quizzesCount: (Object.keys(state.mapQuiz || {}).filter(k => state.mapQuiz[k] && state.mapQuiz[k].completed).length),
        badgesCount: (state.badges || []).length,
        memScore: activeMg.memScore,
        wsScore: activeMg.wsScore,
        platScore: activeMg.platScore,
        gamesScore: activeMg.gamesScore,
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
        quizzesCount: 0,
        memScore: 0,
        wsScore: 0,
        platScore: 0,
        gamesScore: 0
      });
    });

    // B. Perfiles reales en localStorage vinculados a cuentas
    Object.values(perfilesLocales).forEach(p => {
      if (!p.studentName || p.studentName.trim() === '') return;
      const id = (p.studentName.trim() + '_' + (p.studentGrade || '').trim()).toLowerCase();
      const pure = typeof window.computePureScore === 'function'
        ? window.computePureScore(p.stateData || p)
        : (p.pureScore || p.score || 0);

      const pMg = parseMinigamesStats(p.stateData || p);
      const existing = mapaEstudiantes.get(id);
      mapaEstudiantes.set(id, {
        id,
        studentName: p.studentName.trim(),
        studentGrade: (p.studentGrade || '').trim() || 'Liceo B-13',
        avatarIcon: p.avatarIcon || (existing ? existing.avatarIcon : '🧑‍🌾'),
        pureScore: pure,
        score: pure,
        badgesCount: p.badgesCount || 0,
        quizzesCount: (p.mapQuizCompleted || 0),
        memScore: pMg.memScore || (existing ? existing.memScore : 0),
        wsScore: pMg.wsScore || (existing ? existing.wsScore : 0),
        platScore: pMg.platScore || (existing ? existing.platScore : 0),
        gamesScore: pMg.gamesScore || (existing ? existing.gamesScore : 0)
      });
    });

    // C. Datos del servidor si existían
    if (listaServidor) {
      listaServidor.forEach(s => {
        if (!s.studentName) return;
        const id = (s.studentName.trim() + '_' + (s.studentGrade || '').trim()).toLowerCase();
        const pure = Number.isFinite(s.pureScore) ? s.pureScore : (s.score || 0);
        const existing = mapaEstudiantes.get(id);
        const sMg = parseMinigamesStats(s);
        mapaEstudiantes.set(id, {
          id,
          studentName: s.studentName.trim(),
          studentGrade: (s.studentGrade || '').trim() || 'Liceo B-13',
          avatarIcon: s.avatarIcon || (existing ? existing.avatarIcon : '🧑‍🌾'),
          pureScore: pure,
          score: pure,
          badgesCount: s.badgesCount || (existing ? existing.badgesCount : 0),
          quizzesCount: s.quizzesCount || (existing ? existing.quizzesCount : 0),
          memScore: sMg.memScore || (existing ? existing.memScore : 0),
          wsScore: sMg.wsScore || (existing ? existing.wsScore : 0),
          platScore: sMg.platScore || (existing ? existing.platScore : 0),
          gamesScore: sMg.gamesScore || (existing ? existing.gamesScore : 0)
        });
      });
    }

    // D. Sobrescribir con estudiante activo actual
    if (estudianteActivo) {
      mapaEstudiantes.set(estudianteActivo.id, estudianteActivo);
    }

    // Convertir a lista y ordenar según el filtro activo
    const lista = Array.from(mapaEstudiantes.values()).sort((a, b) => {
      if (currentFilter === 'juegos') {
        const diffGames = (b.gamesScore || 0) - (a.gamesScore || 0);
        if (diffGames !== 0) return diffGames;
        return (b.pureScore || 0) - (a.pureScore || 0);
      }
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
      </button>

      <div class="ranking-container">
        <!-- Encabezado Gaming con efectos -->
        <div class="ranking-header">
          <div class="ranking-header-title-row">
            <div class="ranking-trophy-vfx">🏆</div>
            <div>
              <h3 class="ranking-title">Salón de Honor B-13</h3>
              <div class="ranking-subtitle-row">
                <span class="pure-badge" id="rankingBadgeType" title="Modo de puntuación activo">
                  ${currentFilter === 'juegos' ? '🎮 Récords Arcade' : '⭐ Puntaje Puro'}
                </span>
                <button type="button" class="ranking-info-trigger" id="rankingInfoBtn" title="¿Cómo funciona este Ranking?">ℹ️</button>
              </div>
            </div>
          </div>
          <button class="ranking-header-close" id="rankingHeaderCloseBtn" type="button" title="Cerrar panel">✕</button>
        </div>

        <!-- Filtros: General vs Mi Curso vs Minijuegos -->
        <div class="ranking-filter-bar">
          <button type="button" class="ranking-filter-btn ${currentFilter === 'general' ? 'active' : ''}" data-filter="general">
            <span>🌐</span> Todo el Liceo
          </button>
          <button type="button" class="ranking-filter-btn ${currentFilter === 'curso' ? 'active' : ''}" data-filter="curso">
            <span>🏫</span> Mi Curso
          </button>
          <button type="button" class="ranking-filter-btn ${currentFilter === 'juegos' ? 'active' : ''}" data-filter="juegos">
            <span>🎮</span> Minijuegos
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

    // Modal explicativo de Puntaje y Récords
    const infoModal = document.createElement('div');
    infoModal.id = 'pureScoreInfoModal';
    infoModal.className = 'overlay';
    infoModal.style.display = 'none';
    infoModal.innerHTML = `
      <div class="card" style="max-width:460px;text-align:center;padding:22px 20px;">
        <button class="close-btn" id="closePureInfoBtn" aria-label="Cerrar">✕</button>
        <div id="pureInfoModalContent"></div>
      </div>
    `;
    document.body.appendChild(infoModal);

    // Backdrop para oscurecer el fondo en PC y móvil
    let backdrop = document.getElementById('rankingBackdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'rankingBackdrop';
      backdrop.className = 'ranking-backdrop';
      document.body.appendChild(backdrop);
    }

    const cerrarRanking = () => {
      aside.classList.remove('mobile-open');
      isSidebarCollapsed = true;
      aside.classList.add('collapsed');
      if (backdrop) backdrop.classList.remove('visible');
      try {
        localStorage.setItem('granja_ranking_collapsed', 'true');
      } catch (e) {}
    };

    backdrop.addEventListener('click', cerrarRanking);
    document.getElementById('rankingHeaderCloseBtn').addEventListener('click', cerrarRanking);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!aside.classList.contains('collapsed') || aside.classList.contains('mobile-open')) {
          cerrarRanking();
        }
      }
    });

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

    const renderInfoModalContent = () => {
      const contentEl = document.getElementById('pureInfoModalContent');
      if (!contentEl) return;
      if (currentFilter === 'juegos') {
        contentEl.innerHTML = `
          <div style="font-size:3rem;margin-bottom:8px;">🎮🏆</div>
          <h3 style="margin:0 0 8px;font-family:'Fraunces',serif;color:var(--grass-dark);font-size:1.3rem;">
            Ranking de Minijuegos Arcade
          </h3>
          <p style="font-size:0.88rem;line-height:1.5;color:var(--ink);text-align:left;margin-bottom:14px;">
            El Salón Arcade premia tu destreza, agilidad y dominio zootécnico en los tres juegos educativos de La Granja B-13:
          </p>
          <div style="background:var(--paper-dark);border:2px solid var(--ink);border-radius:8px;padding:12px 14px;text-align:left;font-size:0.83rem;line-height:1.45;margin-bottom:16px;">
            🃏 <b>Parejas de Curiosidades:</b> Empareja animales y curiosidades. Las dificultades Media y Difícil otorgan multiplicadores de x1.5 y x2.0.<br><br>
            🔤 <b>Sopa de Letras:</b> Descubre vocabulario clave en matrices de 10x10, 12x12 y 14x14 con diagonales y palabras invertidas.<br><br>
            🏃 <b>Aventura 2D (Plataformas):</b> Llega al Granero Rojo sorteando obstáculos y fango. ¡El nivel Extremo activa Air Dash estilo Celeste y Pink Parries de Cuphead!<br><br>
            ⭐ <b>Puntaje Total Arcade:</b> Suma tus mejores récords en las tres disciplinas.
          </div>
          <button type="button" class="tool-btn" id="acceptPureInfoBtn" style="width:100%;padding:10px;background:var(--hay);color:var(--ink);font-weight:700;border:2px solid var(--ink);border-radius:6px;cursor:pointer;">
            ¡A Jugar! 🕹️
          </button>
        `;
      } else {
        contentEl.innerHTML = `
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
        `;
      }
      const closeBtn = document.getElementById('acceptPureInfoBtn');
      if (closeBtn) closeBtn.onclick = cerrarInfo;
    };

    document.getElementById('rankingInfoBtn').addEventListener('click', () => {
      renderInfoModalContent();
      infoModal.style.display = 'flex';
      infoModal.classList.add('active');
    });

    const cerrarInfo = () => {
      infoModal.style.display = 'none';
      infoModal.classList.remove('active');
    };
    document.getElementById('closePureInfoBtn').addEventListener('click', cerrarInfo);

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
    const backdrop = document.getElementById('rankingBackdrop');
    if (!aside) return;

    if (window.innerWidth < 1024) {
      const isOpen = aside.classList.toggle('mobile-open');
      if (backdrop) backdrop.classList.toggle('visible', isOpen);
      return;
    }

    isSidebarCollapsed = !isSidebarCollapsed;
    aside.classList.toggle('collapsed', isSidebarCollapsed);
    if (backdrop) backdrop.classList.toggle('visible', !isSidebarCollapsed);

    try {
      localStorage.setItem('granja_ranking_collapsed', isSidebarCollapsed ? 'true' : 'false');
    } catch (e) {}
  }

  function toggleRankingWidget() {
    const aside = document.getElementById('rankingSidebar');
    if (!aside) return;
    toggleSidebarCollapse();
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

    // Actualizar badge de encabezado
    const badgeType = document.getElementById('rankingBadgeType');
    if (badgeType) {
      badgeType.textContent = (currentFilter === 'juegos') ? '🎮 Récords Arcade' : '⭐ Puntaje Puro';
    }

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
      if (miPosicion >= 1 && miPosicion <= 3 && typeof window.unlockBadge === 'function') {
        window.unlockBadge('podio_honor');
      }
    }

    const isGames = (currentFilter === 'juegos');
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

      if (isTop1) {
        crownVfx = `<span class="vfx-crown" title="Gran Campeón/a B-13">👑</span>`;
        shimmerVfx = `<div class="shimmer-wrapper"><div class="vfx-shimmer gold-shimmer"></div></div>`;
        badgeHtml = `<span class="rank-pos-badge gold-badge"><span class="badge-num">1°</span> ORO</span>`;
      } else if (isTop2) {
        shimmerVfx = `<div class="shimmer-wrapper"><div class="vfx-shimmer silver-shimmer"></div></div>`;
        badgeHtml = `<span class="rank-pos-badge silver-badge"><span class="badge-num">2°</span> PLATA</span>`;
      } else if (isTop3) {
        badgeHtml = `<span class="rank-pos-badge bronze-badge"><span class="badge-num">3°</span> BRONCE</span>`;
      } else {
        badgeHtml = `<span class="rank-pos-badge other-badge">#${rankNum}</span>`;
      }

      const scoreValue = isGames ? (st.gamesScore || 0) : st.pureScore;
      const scoreLabel = isGames ? 'pts arcade' : 'pts puros';
      const breakdownOrGrade = isGames
        ? `<span>🎮</span> 🃏 ${st.memScore || 0} · 🔤 ${st.wsScore || 0} · 🏃 ${st.platScore || 0}`
        : `<span>🏫</span> ${st.studentGrade || 'Enseñanza Media'}`;

      html += `
        <div class="${cardClass}" data-rank="${rankNum}">
          ${shimmerVfx}
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
                ${isMe ? '<span class="me-tag">Tú</span>' : ''}
              </div>
              <div class="ranking-grade-tag">
                ${breakdownOrGrade}
              </div>
            </div>
          </div>
          <div class="ranking-card-right">
            ${badgeHtml}
            <div class="ranking-pts-box">
              <b class="ranking-pts-val">${scoreValue}</b>
              <span class="ranking-pts-lbl">${scoreLabel}</span>
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

      const emptyScoreLabel = isGames ? 'pts arcade' : 'pts puros';
      const emptyGradeText = isGames ? '🎮 ¡Juega minijuegos para clasificar!' : '⭐ ¡Rinde quizzes para reclamar!';

      html += `
        <div class="ranking-card slot-empty rank-other ${isPodiumSlot ? 'podium-empty' : ''}" data-rank="${slotNum}">
          <div class="ranking-card-left">
            <div class="ranking-avatar-wrap">
              <div class="ranking-avatar-box empty-avatar-box">
                <span class="ranking-avatar-icon">${isPodiumSlot ? '🏆' : (isGames ? '🕹️' : '🌱')}</span>
              </div>
            </div>
            <div class="ranking-user-info">
              <div class="ranking-name-row">
                <span class="ranking-name empty-name">[Espacio Disponible]</span>
              </div>
              <div class="ranking-grade-tag empty-grade">
                <span>⭐</span> ${emptyGradeText}
              </div>
            </div>
          </div>
          <div class="ranking-card-right">
            ${slotBadge}
            <div class="ranking-pts-box">
              <b class="ranking-pts-val empty-pts">---</b>
              <span class="ranking-pts-lbl">${emptyScoreLabel}</span>
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
            <span>Ingresa como estudiante para sumar puntos y entrar al Salón de Honor.</span>
          </div>
        </div>
      `;
      return;
    }

    const isGames = (currentFilter === 'juegos');
    const posTxt = (miPosicion > 0) ? `#${miPosicion} Lugar` : 'Sin Clasificar';
    const pts = isGames ? (estudianteActivo.gamesScore || 0) : (estudianteActivo.pureScore || 0);
    const ptsUnit = isGames ? 'pts arcade' : 'pts puros';

    let mensajeMotivacional = isGames
      ? '¡Juega Parejas, Sopa de Letras y Carrera 2D para sumar puntos arcade! 🕹️'
      : '¡Rinde desafíos en el Mapa 3D para subir posiciones! 🚀';

    if (miPosicion === 1) {
      mensajeMotivacional = isGames
        ? '👑 ¡Eres el Rey / Reina del Arcade de La Granja B-13!'
        : '👑 ¡Eres el Campeón Supremo de La Granja B-13!';
    } else if (miPosicion === 2 || miPosicion === 3) {
      mensajeMotivacional = isGames
        ? '🔥 ¡Estás en el Podio Arcade! ¡Supera tus récords en Difícil/Extrema!'
        : '🔥 ¡Estás en el Podio de Honor! ¡Defiende tu lugar!';
    } else if (miPosicion <= 10 && miPosicion > 0) {
      mensajeMotivacional = isGames
        ? '✨ ¡Estás dentro del TOP 10 Arcade del Liceo!'
        : '✨ ¡Estás dentro del TOP 10 oficial del Liceo!';
    }

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
            <span class="my-status-pts"><b>${pts}</b> ${ptsUnit}</span>
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
