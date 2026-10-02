/*
  ranking-page.js — Lógica de la vista dedicada Salón de Honor y Leaderboard (ranking.html).
  Obtiene la lista consolidada de estudiantes desde el servidor y localStorage,
  renderiza el podio Top 3 de honor y la tabla interactiva filtrable por Curso o Juegos.
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

  let currentFilter = 'general'; // 'general' | 'curso' | 'juegos'
  let searchQuery = '';
  let allStudentsData = [];

  function parseMinigamesStats(src) {
    if (!src) return { memScore: 0, wsScore: 0, platScore: 0, gamesScore: 0 };
    const mg = src.minigames || {};
    const memScore = (mg.memory && typeof mg.memory.bestScore === 'number') ? mg.memory.bestScore : 0;
    const wsScore = (mg.wordsearch && typeof mg.wordsearch.bestScore === 'number') ? mg.wordsearch.bestScore : 0;
    const platScore = (mg.platformer && typeof mg.platformer.bestScore === 'number') ? mg.platformer.bestScore : 0;
    const gamesScore = memScore + wsScore + platScore;
    return { memScore, wsScore, platScore, gamesScore };
  }

  async function fetchAllStudents() {
    let list = [];

    // 1. Servidor
    try {
      if (typeof fetch === 'function') {
        const res = await fetch('/api/ranking');
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.ranking) && json.ranking.length > 0) {
            list = json.ranking;
          }
        }
      }
    } catch (e) {}

    // 2. Perfiles locales
    let localProfiles = {};
    if (typeof loadAllProfiles === 'function') {
      try {
        localProfiles = loadAllProfiles() || {};
      } catch (e) {}
    }

    const mapa = new Map();
    list.forEach(item => {
      const k = (item.studentName || '').trim().toLowerCase();
      if (k) mapa.set(k, { ...item });
    });

    Object.entries(localProfiles).forEach(([id, st]) => {
      if (!st || !st.studentName) return;
      const k = st.studentName.trim().toLowerCase();
      const purePts = (typeof computePureScore === 'function') ? computePureScore(st) : (st.pureScore || st.score || 0);
      const mg = parseMinigamesStats(st);
      const badgesCount = (st.badges || []).length + (st.secretBadges || []).length;
      const decimas = typeof calcularDecimasTotales === 'function' ? calcularDecimasTotales(st) : (purePts * 0.05).toFixed(1);

      if (!mapa.has(k) || purePts > (mapa.get(k).pureScore || 0)) {
        mapa.set(k, {
          id: id,
          studentName: st.studentName,
          studentGrade: st.studentGrade || '2°B',
          avatarIcon: st.avatarIcon || '🧑‍🌾',
          avatarColor: st.avatarColor || '#ffd83d',
          studentTitle: st.studentTitle || 'Explorador/a de Campo',
          pureScore: purePts,
          minigamesScore: mg.gamesScore,
          badgesCount: badgesCount,
          decimas: decimas
        });
      }
    });

    // Agregar estudiante actual si no está
    if (state && state.studentName) {
      const k = state.studentName.trim().toLowerCase();
      const purePts = (typeof computePureScore === 'function') ? computePureScore(state) : (state.pureScore || state.score || 0);
      const mg = parseMinigamesStats(state);
      const badgesCount = (state.badges || []).length + (state.secretBadges || []).length;
      const decimas = typeof calcularDecimasTotales === 'function' ? calcularDecimasTotales(state) : (purePts * 0.05).toFixed(1);

      if (!mapa.has(k) || purePts >= (mapa.get(k).pureScore || 0)) {
        mapa.set(k, {
          id: 'me',
          studentName: state.studentName,
          studentGrade: state.studentGrade || sesion.curso || '2°B',
          avatarIcon: state.avatarIcon || '🧑‍🌾',
          avatarColor: state.avatarColor || '#ffd83d',
          studentTitle: state.studentTitle || 'Explorador/a de Campo',
          pureScore: purePts,
          minigamesScore: mg.gamesScore,
          badgesCount: badgesCount,
          decimas: decimas
        });
      }
    }

    allStudentsData = Array.from(mapa.values());
    render();
  }

  function render() {
    let filtered = [...allStudentsData];

    // Ordenar según filtro activo
    if (currentFilter === 'juegos') {
      filtered.sort((a, b) => (b.minigamesScore || 0) - (a.minigamesScore || 0));
    } else {
      filtered.sort((a, b) => (b.pureScore || 0) - (a.pureScore || 0));
    }

    // Filtrar por curso
    if (currentFilter === 'curso') {
      const myCourse = (state && state.studentGrade) ? state.studentGrade.trim().toLowerCase() : (sesion.curso || '').trim().toLowerCase();
      if (myCourse) {
        filtered = filtered.filter(s => (s.studentGrade || '').trim().toLowerCase() === myCourse);
      }
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        (s.studentName || '').toLowerCase().includes(q) ||
        (s.studentGrade || '').toLowerCase().includes(q) ||
        (s.studentTitle || '').toLowerCase().includes(q)
      );
    }

    renderPodium(filtered);
    renderTable(filtered);

    // Actualizar badge del encabezado
    const badgeEl = document.getElementById('rankingActiveFilterBadge');
    if (badgeEl) {
      badgeEl.textContent = (currentFilter === 'juegos') ? '🎮 Récords Arcade' : (currentFilter === 'curso') ? '🏫 Mi Curso' : '⭐ Puntaje Puro';
    }

    const thScore = document.getElementById('thScoreHeader');
    if (thScore) {
      thScore.textContent = (currentFilter === 'juegos') ? 'Pts Arcade' : 'Puntaje Puro';
    }
  }

  function renderPodium(list) {
    const podiumEl = document.getElementById('podiumContainer');
    if (!podiumEl) return;

    if (list.length === 0) {
      podiumEl.innerHTML = '';
      return;
    }

    const first = list[0] || null;
    const second = list[1] || null;
    const third = list[2] || null;

    const scoreProp = (currentFilter === 'juegos') ? 'minigamesScore' : 'pureScore';

    podiumEl.innerHTML = `
      ${second ? `
        <div class="podium-spot second">
          <div class="podium-rank-badge">🥈 2° LUGAR</div>
          <div class="podium-avatar" style="border-color:${second.avatarColor || '#94a3b8'}">${second.avatarIcon || '🧑‍🌾'}</div>
          <div class="podium-name">${second.studentName}</div>
          <div style="font-size:0.75rem;color:#64748b;">${second.studentGrade || ''}</div>
          <div class="podium-score">${second[scoreProp] || 0} pts</div>
        </div>
      ` : ''}

      ${first ? `
        <div class="podium-spot first">
          <div class="podium-crown">👑</div>
          <div class="podium-rank-badge">🥇 1° LUGAR ORO</div>
          <div class="podium-avatar" style="border-color:${first.avatarColor || '#ffd83d'}">${first.avatarIcon || '🧑‍🌾'}</div>
          <div class="podium-name">${first.studentName}</div>
          <div style="font-size:0.8rem;color:#78350f;">${first.studentGrade || ''} · ${first.studentTitle || 'Campeón/a'}</div>
          <div class="podium-score">${first[scoreProp] || 0} pts</div>
        </div>
      ` : ''}

      ${third ? `
        <div class="podium-spot third">
          <div class="podium-rank-badge">🥉 3° LUGAR</div>
          <div class="podium-avatar" style="border-color:${third.avatarColor || '#f97316'}">${third.avatarIcon || '🧑‍🌾'}</div>
          <div class="podium-name">${third.studentName}</div>
          <div style="font-size:0.75rem;color:#64748b;">${third.studentGrade || ''}</div>
          <div class="podium-score">${third[scoreProp] || 0} pts</div>
        </div>
      ` : ''}
    `;
  }

  function renderTable(list) {
    const tbody = document.getElementById('rankingTableBody');
    if (!tbody) return;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center;padding:30px;color:#64748b;">
            🔍 No se encontraron estudiantes para los criterios seleccionados.
          </td>
        </tr>
      `;
      return;
    }

    const myName = (state && state.studentName) ? state.studentName.trim().toLowerCase() : '';
    const scoreProp = (currentFilter === 'juegos') ? 'minigamesScore' : 'pureScore';

    tbody.innerHTML = list.map((st, idx) => {
      const isMe = myName && (st.studentName || '').trim().toLowerCase() === myName;
      const rankMedal = (idx === 0) ? '🥇 1' : (idx === 1) ? '🥈 2' : (idx === 2) ? '🥉 3' : `#${idx + 1}`;

      return `
        <tr class="${isMe ? 'my-row' : ''}">
          <td class="rank-num">${rankMedal}</td>
          <td>
            <div class="student-col">
              <div class="student-avatar" style="border-color:${st.avatarColor || '#ffd83d'}">${st.avatarIcon || '🧑‍🌾'}</div>
              <div>
                <div style="font-weight:800;color:#1e293b;">${st.studentName} ${isMe ? '<span style="font-size:0.75rem;background:#10b981;color:#fff;padding:1px 6px;border-radius:4px;margin-left:4px;">Tú</span>' : ''}</div>
              </div>
            </div>
          </td>
          <td><span style="font-family:'Space Mono',monospace;font-size:0.85rem;background:#f1f5f9;padding:2px 8px;border-radius:6px;">${st.studentGrade || '2°B'}</span></td>
          <td><span style="font-size:0.85rem;color:#475569;">${st.studentTitle || 'Explorador/a'}</span></td>
          <td><b>${st.badgesCount || 0}</b> 🎖️</td>
          <td class="pts-val">${st[scoreProp] || 0} pts</td>
          <td><span style="font-weight:700;color:#15803d;">+${st.decimas || '0.0'}</span></td>
        </tr>
      `;
    }).join('');
  }

  // Controles de filtro
  document.querySelectorAll('.ranking-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.ranking-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter || 'general';
      render();
    });
  });

  // Buscador
  const searchInput = document.getElementById('rankingSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      render();
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

  fetchAllStudents();

})();
