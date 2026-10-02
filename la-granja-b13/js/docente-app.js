/**
 * LA GRANJA B-13 — Panel Docente y Gestión Pedagógica (docente-app.js)
 * Liceo Domingo Herrera Rivera B-13 | Proyecto Go Innova ODS 4 & 15
 */

(function () {
  'use strict';

  // Variables de Estado
  let activeTab = 'calificaciones';
  let currentActivityFilter = 'all';
  let activityPollingTimer = null;
  let selectedStudentKey = null;

  function sanitize(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(msg) {
    let t = document.getElementById('docenteToast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'docenteToast';
      t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e293b;color:#fff;padding:12px 20px;border-radius:10px;font-family:Karla,sans-serif;font-weight:700;font-size:0.9rem;box-shadow:0 6px 20px rgba(0,0,0,0.25);z-index:99999;transition:all 0.3s ease;transform:translateY(100px);opacity:0;pointer-events:none;';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.transform = 'translateY(0)';
    t.style.opacity = '1';
    setTimeout(() => {
      t.style.transform = 'translateY(100px)';
      t.style.opacity = '0';
    }, 3200);
  }

  /* ============================================================
     1. VERIFICACIÓN DE SESIÓN Y SEGURIDAD DOCENTE
     ============================================================ */

  function checkTeacherAuth() {
    const sesion = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function')
      ? Auth.getSesion()
      : null;

    const lockScreen = document.getElementById('teacherLockScreen');
    const workspace = document.getElementById('teacherWorkspace');
    const badge = document.getElementById('teacherSessionBadge');

    const isTeacher = sesion && (sesion.rol === 'profesor' || sesion.rol === 'admin');

    if (isTeacher) {
      if (lockScreen) lockScreen.style.display = 'none';
      if (workspace) workspace.style.display = 'block';
      if (badge) {
        badge.innerHTML = `🟢 ${sesion.rol === 'admin' ? 'Administrador' : 'Docente'}: <u>${sanitize(sesion.nombre)}</u>`;
      }
      initTeacherDashboard();
    } else {
      if (lockScreen) lockScreen.style.display = 'block';
      if (workspace) workspace.style.display = 'none';
      if (badge) {
        badge.innerHTML = `🔒 Acceso Bloqueado`;
        badge.style.color = 'var(--clay)';
      }
      setupUnlockForm();
    }
  }

  function setupUnlockForm() {
    const form = document.getElementById('formTeacherUnlock');
    if (!form) return;

    form.onsubmit = function (e) {
      e.preventDefault();
      const pass = (document.getElementById('teacherPassInput')?.value || '').trim();
      const errEl = document.getElementById('teacherUnlockError');

      // Claves docentes autorizadas para acceso al panel
      const validPasswords = ['profesor1234', '1234', 'admin1234', 'profesorb13', 'granja123'];

      if (validPasswords.includes(pass) || pass.toLowerCase() === 'docente') {
        const sesionDocente = {
          nombre: 'Profesor/a B-13',
          correo: 'docente@liceob13.cl',
          rol: 'profesor',
          curso: 'Equipo Docente'
        };
        try {
          localStorage.setItem('granjaSesion', JSON.stringify(sesionDocente));
        } catch (err) {}

        if (errEl) errEl.style.display = 'none';
        showToast('¡Bienvenido/a al Panel Docente de la Granja B-13!');
        checkTeacherAuth();
      } else {
        if (errEl) {
          errEl.textContent = '❌ Contraseña o PIN incorrecto. Intenta con "profesor1234" o inicia sesión.';
          errEl.style.display = 'block';
        }
      }
    };
  }

  /* ============================================================
     2. GESTIÓN DE PESTAÑAS
     ============================================================ */

  function setupTabs() {
    const tabButtons = document.querySelectorAll('.docente-tab-btn');
    const tabContents = {
      calificaciones: document.getElementById('tabDocenteCalificaciones'),
      quizzes: document.getElementById('tabDocenteQuizzes'),
      metricas: document.getElementById('tabDocenteMetricas'),
      historial: document.getElementById('tabDocenteHistorial')
    };

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        if (!target) return;

        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        Object.keys(tabContents).forEach(key => {
          if (tabContents[key]) {
            tabContents[key].style.display = (key === target) ? 'block' : 'none';
          }
        });

        activeTab = target;

        // Render o actualización específica al abrir pestaña
        if (target === 'calificaciones') {
          renderTabCalificaciones();
        } else if (target === 'quizzes') {
          renderTabQuizzes();
        } else if (target === 'metricas') {
          renderTabMetricas();
        } else if (target === 'historial') {
          renderTabHistorial();
        }
      });
    });
  }

  /* ============================================================
     3. PESTAÑA 1: CALIFICACIONES & DÉCIMAS
     ============================================================ */

  function getAllStudentProfiles() {
    const list = [];
    
    // 1. Perfil activo en progreso local
    let currentState = null;
    try {
      currentState = JSON.parse(localStorage.getItem('lagranjaB13.progress.v2'));
    } catch (e) {}

    if (currentState && currentState.studentName) {
      list.push({
        id: 'active_local',
        name: currentState.studentName,
        course: currentState.studentGrade || 'Sin curso',
        score: currentState.score || 0,
        stateData: currentState,
        isActive: true
      });
    }

    // 2. Perfiles guardados en lagranjaB13.profiles.v1
    try {
      const savedProfiles = JSON.parse(localStorage.getItem('lagranjaB13.profiles.v1')) || {};
      Object.keys(savedProfiles).forEach(key => {
        const p = savedProfiles[key];
        if (p && p.stateData && p.stateData.studentName) {
          if (!list.some(x => x.name.toLowerCase() === p.stateData.studentName.toLowerCase())) {
            list.push({
              id: key,
              name: p.stateData.studentName,
              course: p.stateData.studentGrade || 'Sin curso',
              score: p.stateData.score || 0,
              stateData: p.stateData,
              isActive: false
            });
          }
        }
      });
    } catch (e) {}

    // 3. Estudiantes registrados en Auth
    if (typeof Auth !== 'undefined' && typeof Auth.getEstudiantes === 'function') {
      const regStudents = Auth.getEstudiantes();
      regStudents.forEach(est => {
        if (!list.some(x => x.name.toLowerCase() === est.nombre.toLowerCase())) {
          list.push({
            id: `auth_${est.id || est.correo}`,
            name: est.nombre,
            course: est.curso || 'Sin curso',
            score: est.puntajeTotal || 0,
            stateData: null,
            isActive: false
          });
        }
      });
    }

    if (list.length === 0) {
      list.push({
        id: 'default_guest',
        name: 'Estudiante Explorador/a',
        course: '1° Medio A',
        score: 0,
        stateData: {
          studentName: 'Estudiante Explorador/a',
          studentGrade: '1° Medio A',
          score: 0,
          quiz: {},
          mapQuiz: {},
          discovered: [],
          badges: []
        },
        isActive: true
      });
    }

    return list;
  }

  function renderTabCalificaciones() {
    const select = document.getElementById('studentSelect');
    if (!select) return;

    const students = getAllStudentProfiles();

    // Guardar selección previa
    const currentVal = selectedStudentKey || select.value || students[0]?.id;

    select.innerHTML = students.map(s => {
      const selected = (s.id === currentVal) ? 'selected' : '';
      return `<option value="${s.id}" ${selected}>${sanitize(s.name)} — ${sanitize(s.course)} (${s.score} pts)</option>`;
    }).join('');

    selectedStudentKey = select.value || students[0]?.id;

    select.onchange = () => {
      selectedStudentKey = select.value;
      updateStudentGradingView();
    };

    updateStudentGradingView();
  }

  function updateStudentGradingView() {
    const students = getAllStudentProfiles();
    const stObj = students.find(s => s.id === selectedStudentKey) || students[0];
    if (!stObj) return;

    const stData = stObj.stateData || {
      studentName: stObj.name,
      studentGrade: stObj.course,
      score: stObj.score || 0,
      quiz: {},
      mapQuiz: {},
      discovered: [],
      badges: []
    };

    // Cálculos de Potrero y Quizzes
    const potreroAnimals = (typeof ANIMALS !== 'undefined')
      ? ANIMALS.filter(a => typeof POTRERO_IDS !== 'undefined' && POTRERO_IDS.includes(a.id))
      : [];

    const discoveredSet = new Set(stData.discovered || []);
    const potreroDone = potreroAnimals.filter(a => stData.quiz && stData.quiz[a.id] && stData.quiz[a.id].completed).length;

    const mapAnimals = (typeof getMapAnimals === 'function') ? getMapAnimals() : [];
    const mapDone = mapAnimals.filter(a => stData.mapQuiz && stData.mapQuiz[a.id] && stData.mapQuiz[a.id].completed).length;

    // Décimas sugeridas
    let decimas = 0;
    if (typeof calculateDecimas === 'function') {
      decimas = calculateDecimas(potreroDone, mapDone);
    } else {
      decimas = Math.min(1.0, Number(((potreroDone * 0.1) + (mapDone * 0.1)).toFixed(1)));
    }

    // Actualizar KPI Chips
    const elName = document.getElementById('kpiStudentName');
    const elScore = document.getElementById('kpiStudentScore');
    const elDecimas = document.getElementById('kpiStudentDecimas');
    const elBadges = document.getElementById('kpiStudentBadges');
    const elPotrero = document.getElementById('kpiStudentPotrero');

    if (elName) elName.textContent = stObj.name;
    if (elScore) elScore.textContent = `${stData.score || 0} pts`;
    if (elDecimas) elDecimas.textContent = `+${decimas} déc.`;
    if (elBadges) elBadges.textContent = `${(stData.badges || []).length} / 15`;
    if (elPotrero) elPotrero.textContent = `${potreroDone} / ${potreroAnimals.length || 7}`;

    // Renderizar Filas de Actividades
    const tbody = document.getElementById('studentActivitiesBody');
    if (!tbody) return;

    let rowsHtml = '';

    // Animales del Potrero
    potreroAnimals.forEach(anim => {
      const isDisc = discoveredSet.has(anim.id);
      const q = (stData.quiz && stData.quiz[anim.id]) || { completed: false, results: [] };
      const numCorrect = (q.results || []).filter(Boolean).length;
      const totalPreg = (anim.quiz || []).length || 3;

      const estadoDiscHtml = isDisc
        ? `<span class="badge-tag success">🐾 Descubierto</span>`
        : `<span class="badge-tag pending">⏳ No visitado</span>`;

      const estadoQuizHtml = q.completed
        ? `<span class="badge-tag success">✅ Completado (${numCorrect}/${totalPreg})</span>`
        : `<span class="badge-tag pending">⏳ Pendiente</span>`;

      const pts = q.completed ? (numCorrect * 10) : 0;

      rowsHtml += `
        <tr>
          <td>
            <strong>${sanitize(anim.name)}</strong> (${sanitize(anim.defaultName)})
            <div style="font-size:0.75rem;color:#64748b;">Potrero Principal</div>
          </td>
          <td>${estadoDiscHtml}</td>
          <td>${estadoQuizHtml}</td>
          <td style="font-family:'Space Mono',monospace;font-weight:700;">+${pts} pts</td>
        </tr>
      `;
    });

    // Zonas del Mapa Real (si existen)
    mapAnimals.forEach(mAnim => {
      const q = (stData.mapQuiz && stData.mapQuiz[mAnim.id]) || { completed: false, results: [] };
      const numCorrect = (q.results || []).filter(Boolean).length;
      const estadoQuizHtml = q.completed
        ? `<span class="badge-tag success">✅ Quiz Aprobado (${numCorrect})</span>`
        : `<span class="badge-tag pending">⏳ Pendiente</span>`;

      rowsHtml += `
        <tr>
          <td>
            <strong>${sanitize(mAnim.name)}</strong>
            <div style="font-size:0.75rem;color:#64748b;">Mapa Real / Bioética</div>
          </td>
          <td><span class="badge-tag info">🗺️ Zona Activa</span></td>
          <td>${estadoQuizHtml}</td>
          <td style="font-family:'Space Mono',monospace;font-weight:700;">+${q.completed ? 15 : 0} pts</td>
        </tr>
      `;
    });

    tbody.innerHTML = rowsHtml || `<tr><td colspan="4" style="text-align:center;color:#64748b;">No hay actividades registradas aún.</td></tr>`;
  }

  // Descargas de informes
  function setupExportButtons() {
    const btnTxt = document.getElementById('btnExportTxt');
    const btnCsv = document.getElementById('btnExportCsv');

    if (btnTxt) {
      btnTxt.onclick = () => {
        const students = getAllStudentProfiles();
        const stObj = students.find(s => s.id === selectedStudentKey) || students[0];
        if (!stObj) return;

        const stData = stObj.stateData || {};
        const lines = [
          '========================================================================',
          '        LA GRANJA B13 — INFORME OFICIAL DE EVALUACIÓN Y RENDIMIENTO     ',
          '             Liceo Domingo Herrera Rivera B-13 (Antofagasta)            ',
          '               Proyecto Go Innova — Vinculado a ODS 4 y ODS 15          ',
          '========================================================================',
          '',
          `ESTUDIANTE:          ${stObj.name}`,
          `CURSO / NIVEL:       ${stObj.course}`,
          `FECHA DE EMISIÓN:    ${new Date().toLocaleString('es-CL')}`,
          `PUNTAJE ACUMULADO:   ${stObj.score || 0} pts`,
          `DÉCIMAS SUGERIDAS:   +${document.getElementById('kpiStudentDecimas')?.textContent || '0.0'}`,
          `INSIGNIAS OBTENIDAS: ${document.getElementById('kpiStudentBadges')?.textContent || '0/15'}`,
          '',
          'RESUMEN FORMATIVO:',
          '- Reconocimiento de especies locales y bienestar animal acreditado.',
          '- Actividades interactivas validadas pedagógicamente según rúbrica.',
          '',
          '========================================================================',
          'Firma Profesor/a: ___________________________   Fecha: _________________',
          '========================================================================'
        ];

        const blob = new Blob([lines.join('\r\n')], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const cleanName = stObj.name.replace(/[^a-zA-Z0-9]/g, '_');
        a.download = `informe_granja_b13_${cleanName}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('Informe oficial (.txt) descargado');
      };
    }

    if (btnCsv) {
      btnCsv.onclick = () => {
        const students = getAllStudentProfiles();
        const csvRows = [
          ['Nombre Estudiante', 'Curso', 'Puntaje Total', 'Insignias', 'Estado']
        ];

        students.forEach(s => {
          const badgesCount = (s.stateData?.badges || []).length;
          csvRows.push([
            `"${s.name.replace(/"/g, '""')}"`,
            `"${s.course.replace(/"/g, '""')}"`,
            s.score || 0,
            badgesCount,
            s.score >= 50 ? 'Destacado' : 'En progreso'
          ]);
        });

        const csvContent = '\uFEFF' + csvRows.map(e => e.join(';')).join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nomina_calificaciones_granja_b13_${new Date().toISOString().slice(0,10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('Planilla de calificaciones (.csv) descargada');
      };
    }

    const btnReset = document.getElementById('btnResetStudentData');
    if (btnReset) {
      btnReset.onclick = () => {
        if (confirm('¿Deseas reiniciar los datos locales de progreso de este navegador? Esta acción no se puede deshacer.')) {
          if (typeof resetState === 'function') {
            resetState();
          } else {
            localStorage.removeItem('lagranjaB13.progress.v2');
          }
          showToast('Datos reiniciados con éxito');
          renderTabCalificaciones();
        }
      };
    }
  }

  /* ============================================================
     4. PESTAÑA 2: CREADOR Y GESTOR DE QUIZZES EN EL MAPA
     ============================================================ */

  const DEFAULT_MAP_ZONES = [
    { id: 'corral_patos', label: '🦆 Corral de los Patos' },
    { id: 'gallinero', label: '🐔 Gallinero B-13' },
    { id: 'conejera', label: '🐇 Sector de Conejos' },
    { id: 'huerto', label: '🌱 Huerto y Bancales' },
    { id: 'pozo', label: '🪣 Pozo de Agua Histórico' },
    { id: 'invernadero', label: '🌿 Invernadero Hidropónico' },
    { id: 'compostera', label: '🍂 Área de Compostaje' },
    { id: 'biodiversidad', label: '🐝 Rincón de Polinizadores' }
  ];

  function renderTabQuizzes() {
    const zoneSelect = document.getElementById('quizZoneSelect');
    if (zoneSelect) {
      const zones = (typeof MAP_ZONES !== 'undefined' && Array.isArray(MAP_ZONES))
        ? MAP_ZONES
        : DEFAULT_MAP_ZONES;

      zoneSelect.innerHTML = zones.map(z => {
        return `<option value="${z.id}">${sanitize(z.label || z.name || z.id)}</option>`;
      }).join('');
    }

    renderPublishedQuizzesList();
    setupQuizCreatorForm();
  }

  function renderPublishedQuizzesList() {
    const container = document.getElementById('publishedQuizzesContainer');
    if (!container) return;

    const quizzesDocente = (typeof TeacherQuizzes !== 'undefined') ? TeacherQuizzes.getAll() : {};
    const zoneEntries = Object.entries(quizzesDocente);

    if (zoneEntries.length === 0 || zoneEntries.every(([_, list]) => list.length === 0)) {
      container.innerHTML = `
        <div style="text-align:center;padding:24px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:8px;color:#64748b;">
          📭 No hay quizzes personalizados creados en el mapa todavía. Usa el formulario superior para publicar uno.
        </div>
      `;
      return;
    }

    let html = '';
    zoneEntries.forEach(([zoneId, qList]) => {
      if (!Array.isArray(qList) || qList.length === 0) return;

      const zoneObj = (typeof MAP_ZONES !== 'undefined' ? MAP_ZONES : DEFAULT_MAP_ZONES).find(z => z.id === zoneId);
      const zoneLabel = zoneObj ? (zoneObj.label || zoneObj.name) : zoneId;

      qList.forEach((quiz, idx) => {
        html += `
          <div style="background:#ffffff;border:2px solid var(--ink);border-radius:10px;padding:14px;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;box-shadow:0 2px 6px rgba(0,0,0,0.04);">
            <div style="flex:1;">
              <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap;">
                <span class="badge-tag info">📍 ${sanitize(zoneLabel)}</span>
                <span class="badge-tag success">⭐ +${quiz.decimas || 0.3} décimas</span>
                <span style="font-size:0.75rem;color:#64748b;">Por: <b>${sanitize(quiz.autor || 'Docente')}</b></span>
              </div>
              <strong style="font-size:0.95rem;color:var(--ink);display:block;margin-bottom:6px;">${sanitize(quiz.pregunta)}</strong>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:0.82rem;color:#475569;">
                ${quiz.opciones.map((op, oIdx) => `
                  <div style="${oIdx === quiz.correcta ? 'font-weight:800;color:#15803d;' : ''}">
                    ${String.fromCharCode(65 + oIdx)}) ${sanitize(op)} ${oIdx === quiz.correcta ? '✅' : ''}
                  </div>
                `).join('')}
              </div>
            </div>
            <button type="button" class="btn-del-quiz tool-btn" data-zid="${zoneId}" data-idx="${idx}" style="color:var(--clay);padding:6px 10px;font-size:0.8rem;border-color:var(--clay);" title="Eliminar pregunta del mapa">
              🗑️ Eliminar
            </button>
          </div>
        `;
      });
    });

    container.innerHTML = html;

    container.querySelectorAll('.btn-del-quiz').forEach(btn => {
      btn.addEventListener('click', () => {
        const zId = btn.dataset.zid;
        const idx = parseInt(btn.dataset.idx, 10);
        if (confirm('¿Seguro/a que deseas retirar esta pregunta del mapa?')) {
          if (typeof TeacherQuizzes !== 'undefined') {
            TeacherQuizzes.remove(zId, idx);
            showToast('Pregunta retirada del mapa.');
            renderPublishedQuizzesList();
          }
        }
      });
    });
  }

  function setupQuizCreatorForm() {
    const form = document.getElementById('formCreateTeacherQuiz');
    if (!form) return;

    form.onsubmit = function (e) {
      e.preventDefault();
      const zoneId = document.getElementById('quizZoneSelect')?.value;
      const question = (document.getElementById('quizQuestionInput')?.value || '').trim();
      const optA = (document.getElementById('quizOptA')?.value || '').trim();
      const optB = (document.getElementById('quizOptB')?.value || '').trim();
      const optC = (document.getElementById('quizOptC')?.value || '').trim();
      const optD = (document.getElementById('quizOptD')?.value || '').trim();
      const correct = parseInt(document.getElementById('quizCorrectSelect')?.value || '0', 10);
      const decimas = parseFloat(document.getElementById('quizDecimasInput')?.value || '0.3');

      if (!zoneId || !question || !optA || !optB || !optC || !optD) {
        alert('Por favor completa todos los campos del desafío.');
        return;
      }

      const ses = (typeof Auth !== 'undefined' && typeof Auth.getSesion === 'function')
        ? Auth.getSesion()
        : { nombre: 'Profesor/a B-13' };

      if (typeof TeacherQuizzes !== 'undefined') {
        const res = TeacherQuizzes.add(zoneId, question, [optA, optB, optC, optD], correct, decimas, ses.nombre);
        if (!res.ok) {
          alert(res.error || 'No se pudo guardar el quiz.');
          return;
        }

        // Registrar en feed de actividad
        try {
          const logs = JSON.parse(localStorage.getItem('granjaActivityLogs')) || [];
          logs.unshift({
            type: 'quiz_created',
            user: ses.nombre,
            role: 'profesor',
            description: `Publicó una nueva pregunta en "${zoneId}" con +${decimas} décimas.`,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('granjaActivityLogs', JSON.stringify(logs.slice(0, 80)));
        } catch (err) {}

        showToast('¡Desafío formativo publicado en el Mapa 3D!');
        form.reset();
        document.getElementById('quizDecimasInput').value = '0.3';
        renderPublishedQuizzesList();
      }
    };
  }

  /* ============================================================
     5. PESTAÑA 3: MÉTRICAS DEL LICEO
     ============================================================ */

  function renderTabMetricas() {
    const students = (typeof Auth !== 'undefined' && typeof Auth.getEstudiantes === 'function')
      ? Auth.getEstudiantes()
      : getAllStudentProfiles();

    let respuestasTotales = [];
    try {
      respuestasTotales = JSON.parse(localStorage.getItem('granjaRespuestasQuiz')) || [];
    } catch (e) {}

    const totalCorrectas = respuestasTotales.filter(r => r.correcta).length;
    const pct = respuestasTotales.length ? Math.round((totalCorrectas / respuestasTotales.length) * 100) : 0;

    const quizzesDocente = (typeof TeacherQuizzes !== 'undefined') ? TeacherQuizzes.getAll() : {};
    const zonasActivas = Object.keys(quizzesDocente).filter(k => quizzesDocente[k]?.length > 0).length;

    // Actualizar KPIs
    const elTotEst = document.getElementById('kpiTotalEstudiantes');
    const elTotResp = document.getElementById('kpiTotalRespuestas');
    const elTasa = document.getElementById('kpiTasaAciertos');
    const elZonAct = document.getElementById('kpiZonasActivas');

    if (elTotEst) elTotEst.textContent = students.length;
    if (elTotResp) elTotResp.textContent = respuestasTotales.length;
    if (elTasa) elTasa.textContent = `${pct}%`;
    if (elZonAct) elZonAct.textContent = `${zonasActivas} zonas`;

    // Ranking de Visitas a Zonas
    const zoneRankingCont = document.getElementById('zoneVisitsRankingContainer');
    if (zoneRankingCont) {
      let visitasZonas = {};
      try {
        visitasZonas = JSON.parse(localStorage.getItem('granjaVisitasZonas')) || {};
      } catch (e) {}

      const entries = Object.entries(visitasZonas).sort((a, b) => b[1] - a[1]);
      if (entries.length === 0) {
        zoneRankingCont.innerHTML = `<span style="color:#64748b;font-size:0.85rem;">Aún no hay visitas registradas por los estudiantes en el mapa.</span>`;
      } else {
        zoneRankingCont.innerHTML = `
          <ul style="margin:0;padding-left:20px;font-size:0.88rem;line-height:1.7;">
            ${entries.map(([zid, cnt]) => {
              const zObj = (typeof MAP_ZONES !== 'undefined' ? MAP_ZONES : DEFAULT_MAP_ZONES).find(z => z.id === zid);
              const label = zObj ? (zObj.label || zObj.name) : zid;
              return `<li><b>${sanitize(label)}:</b> ${cnt} visitas de estudiantes</li>`;
            }).join('')}
          </ul>
        `;
      }
    }

    // Tabla de Nómina Oficial
    const rosterBody = document.getElementById('studentsRosterBody');
    if (rosterBody) {
      if (students.length === 0) {
        rosterBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:#64748b;">No hay estudiantes registrados.</td></tr>`;
      } else {
        rosterBody.innerHTML = students.map(s => {
          const rolBadge = (s.rol === 'admin' || s.rol === 'profesor')
            ? `<span class="badge-tag success">${s.rol.toUpperCase()}</span>`
            : `<span class="badge-tag info">Estudiante</span>`;

          return `
            <tr>
              <td><strong>${sanitize(s.nombre || s.name)}</strong></td>
              <td>${sanitize(s.curso || s.course || 'Sin curso')}</td>
              <td>${sanitize(s.correo || 'local@b13.cl')}</td>
              <td>${rolBadge}</td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  /* ============================================================
     6. PESTAÑA 4: HISTORIAL EN VIVO (MONITOREO EN TIEMPO REAL)
     ============================================================ */

  async function renderTabHistorial(silent = false) {
    const container = document.getElementById('liveActivityFeedList');
    if (!container) return;

    if (!silent) {
      container.innerHTML = '<div style="text-align:center;padding:24px;color:#64748b;font-size:0.85rem;">⏳ Consultando actividad en vivo...</div>';
    }

    let logs = [];
    try {
      const res = await fetch(`/api/activity?limit=50&filter=${encodeURIComponent(currentActivityFilter)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.logs) logs = data.logs;
      }
    } catch (e) {
      try {
        logs = JSON.parse(localStorage.getItem('granjaActivityLogs')) || [];
        if (currentActivityFilter !== 'all') {
          logs = logs.filter(l => l.type === currentActivityFilter);
        }
      } catch (err) {}
    }

    if (!logs || logs.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:28px 12px;background:#f8fafc;border:1.5px dashed #cbd5e1;border-radius:10px;">
          <span style="font-size:2rem;display:block;margin-bottom:6px;">🌾</span>
          <strong style="color:#1e293b;font-size:0.95rem;">No hay actividades registradas en esta categoría aún.</strong>
          <p style="color:#64748b;font-size:0.82rem;margin:4px 0 0;">Las acciones de estudiantes y docentes se transmitirán aquí en vivo.</p>
        </div>
      `;
      return;
    }

    const iconsByType = {
      register: '🎓',
      login: '🔑',
      score_up: '⭐',
      quiz_created: '📝',
      comment: '💬',
      system: '⚙️'
    };

    container.innerHTML = logs.map(l => {
      const icon = iconsByType[l.type] || '📌';
      const dateObj = new Date(l.timestamp);
      const timeStr = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : 'Reciente';

      const isTeacher = l.role === 'profesor' || l.role === 'admin';
      const roleBadge = isTeacher
        ? `<span class="badge-tag success">Docente</span>`
        : `<span class="badge-tag info">Estudiante</span>`;

      return `
        <div class="activity-item-card type-${l.type || 'system'}">
          <div class="act-icon-box">${icon}</div>
          <div style="flex:1;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;flex-wrap:wrap;gap:6px;">
              <div>
                <strong>${sanitize(l.user || 'Usuario B-13')}</strong>
                ${roleBadge}
              </div>
              <span style="font-size:0.75rem;color:#64748b;font-family:'Space Mono',monospace;">🕒 ${timeStr}</span>
            </div>
            <p style="margin:0;font-size:0.85rem;color:#334155;">${sanitize(l.description || '')}</p>
          </div>
        </div>
      `;
    }).join('');
  }

  function setupHistorialEvents() {
    const filterButtons = document.querySelectorAll('.act-filter-btn');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentActivityFilter = btn.dataset.filter || 'all';
        renderTabHistorial(false);
      });
    });

    const refreshBtn = document.getElementById('btnRefreshFeed');
    if (refreshBtn) {
      refreshBtn.onclick = () => renderTabHistorial(false);
    }

    const clearBtn = document.getElementById('btnClearFeed');
    if (clearBtn) {
      clearBtn.onclick = () => {
        if (confirm('¿Deseas vaciar el registro local de actividades?')) {
          localStorage.removeItem('granjaActivityLogs');
          renderTabHistorial(false);
          showToast('Registro de actividades limpiado.');
        }
      };
    }

    // Polling cada 4 segundos si la pestaña está activa
    if (activityPollingTimer) clearInterval(activityPollingTimer);
    activityPollingTimer = setInterval(() => {
      if (activeTab === 'historial') {
        renderTabHistorial(true);
      }
    }, 4000);
  }

  /* ============================================================
     7. CERRAR SESIÓN NAVBAR & INICIALIZACIÓN
     ============================================================ */

  function setupLogout() {
    const logoutBtn = document.getElementById('navBtnCambiarModo');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (typeof Auth !== 'undefined' && typeof Auth.logout === 'function') {
          Auth.logout();
        } else {
          localStorage.removeItem('granjaSesion');
          window.location.href = 'login.html';
        }
      });
    }
  }

  function initTeacherDashboard() {
    setupTabs();
    setupExportButtons();
    setupHistorialEvents();
    renderTabCalificaciones();
  }

  document.addEventListener('DOMContentLoaded', () => {
    setupLogout();
    checkTeacherAuth();
  });

})();
