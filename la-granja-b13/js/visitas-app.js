/*
  visitas-app.js — Controlador del Apartado de Visitas Guiadas
  Liceo Domingo Herrera Rivera B-13 — Antofagasta, Chile.
  Manejo interactivo del formulario de solicitud, modo demo, derivación a correo electrónico,
  historial local en localStorage e integración con la API del servidor.
*/

(function() {
  'use strict';

  const STORAGE_KEY_VISITAS = 'granjaVisitasSolicitudes';
  const EMAIL_COORDINACION = 'ingridms@liceodomingoherrera.cl';

  // Elementos DOM
  const form = document.getElementById('visitaForm');
  const btnLlenarDemo = document.getElementById('btnLlenarDemo');
  const btnLimpiarForm = document.getElementById('btnLimpiarForm');
  const campoFecha = document.getElementById('campoFecha');
  const contenedorHistorial = document.getElementById('contenedorHistorial');
  const historialVacioMensaje = document.getElementById('historialVacioMensaje');
  const btnBorrarHistorial = document.getElementById('btnBorrarHistorial');
  const visitasCountBadge = document.getElementById('visitasCountBadge');

  // Modal
  const modal = document.getElementById('visitaModal');
  const btnCerrarModal = document.getElementById('btnCerrarModal');
  const btnCerrarModalBottom = document.getElementById('btnCerrarModalBottom');
  const btnMailtoModal = document.getElementById('btnMailtoModal');
  const btnCopiarResumen = document.getElementById('btnCopiarResumen');
  const btnImprimirComprobante = document.getElementById('btnImprimirComprobante');

  // Elementos del Voucher
  const voucherCodigo = document.getElementById('voucherCodigo');
  const voucherNombre = document.getElementById('voucherNombre');
  const voucherInstitucion = document.getElementById('voucherInstitucion');
  const voucherFechaHorario = document.getElementById('voucherFechaHorario');
  const voucherGrupoCantidad = document.getElementById('voucherGrupoCantidad');
  const voucherContacto = document.getElementById('voucherContacto');
  const voucherEnfoque = document.getElementById('voucherEnfoque');

  let ultimaSolicitud = null;

  /* ============================================================
     Inicialización
     ============================================================ */
  function init() {
    configurarFechasMinimas();
    configurarEventosFormulario();
    configurarEventosModal();
    configurarBotonesBarra();
    cargarHistorial();
  }

  // Fijar fecha mínima en el selector (mañana en adelante para visitas escolares)
  function configurarFechasMinimas() {
    if (!campoFecha) return;
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    const yyyy = manana.getFullYear();
    const mm = String(manana.getMonth() + 1).padStart(2, '0');
    const dd = String(manana.getDate()).padStart(2, '0');
    campoFecha.min = `${yyyy}-${mm}-${dd}`;
  }

  /* ============================================================
     Eventos del Formulario
     ============================================================ */
  function configurarEventosFormulario() {
    if (!form) return;

    // Enviar solicitud
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      procesarEnvio();
    });

    // Llenar datos de prueba
    if (btnLlenarDemo) {
      btnLlenarDemo.addEventListener('click', llenarDatosDePrueba);
    }

    // Limpiar formulario
    if (btnLimpiarForm) {
      btnLimpiarForm.addEventListener('click', () => {
        mostrarToast('Formulario reiniciado ↺');
      });
    }

    // Vaciar historial local
    if (btnBorrarHistorial) {
      btnBorrarHistorial.addEventListener('click', () => {
        if (confirm('¿Deseas vaciar el historial de solicitudes registradas en esta demo?')) {
          localStorage.removeItem(STORAGE_KEY_VISITAS);
          cargarHistorial();
          mostrarToast('Historial vaciado correctamente');
        }
      });
    }
  }

  /* ============================================================
     Llenar Datos de Prueba (Demo Rápida)
     ============================================================ */
  function llenarDatosDePrueba() {
    const nombres = [
      'Prof. Camila Araya Fuentes',
      'Prof. Patricio Morales Rojas',
      'Educadora Marcela Vega Contreras',
      'Prof. Roberto Santander Silva'
    ];
    const escuelas = [
      'Escuela D-68 José Papic Radnic',
      'Colegio Técnico Industrial Don Bosco Antofagasta',
      'Escuela E-88 República de Estados Unidos',
      'Jardín Infantil Sol y Cobre'
    ];

    const idx = Math.floor(Math.random() * nombres.length);

    // Calcular una fecha hábil próxima (ej. dentro de 5 días)
    const fechaPropuesta = new Date();
    fechaPropuesta.setDate(fechaPropuesta.getDate() + 5);
    // Si cae en fin de semana, moverlo al lunes siguiente
    if (fechaPropuesta.getDay() === 0) fechaPropuesta.setDate(fechaPropuesta.getDate() + 1);
    if (fechaPropuesta.getDay() === 6) fechaPropuesta.setDate(fechaPropuesta.getDate() + 2);

    const yyyy = fechaPropuesta.getFullYear();
    const mm = String(fechaPropuesta.getMonth() + 1).padStart(2, '0');
    const dd = String(fechaPropuesta.getDate()).padStart(2, '0');

    document.getElementById('campoNombre').value = nombres[idx];
    document.getElementById('campoInstitucion').value = escuelas[idx];
    document.getElementById('campoEmail').value = 'coordinacion@' + escuelas[idx].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) + '.cl';
    document.getElementById('campoTelefono').value = '+56 9 7654 3210';
    document.getElementById('campoTipoGrupo').value = 'Enseñanza Básica Inicial (1° a 4° Básico)';
    document.getElementById('campoCantidad').value = 24;
    document.getElementById('campoFecha').value = `${yyyy}-${mm}-${dd}`;
    document.getElementById('campoHorario').value = 'Jornada Mañana Bloque 1 (09:30 - 10:30 hrs)';
    document.getElementById('campoEnfoque').value = 'Bioalfabetización y Bienestar Animal (Tenencia Ética)';
    document.getElementById('campoComentarios').value = 'Asistirá un grupo de 24 estudiantes acompañados por 2 docentes y 1 apoderado. Interés especial en conocer el corral de conejos y las gallinas enanas.';
    document.getElementById('campoCompromiso').checked = true;

    if (typeof playBadge === 'function') playBadge();
    mostrarToast('🧪 Datos de prueba cargados con éxito. ¡Listo para enviar!');
  }

  /* ============================================================
     Procesamiento del Envío
     ============================================================ */
  function procesarEnvio() {
    const nombre = (document.getElementById('campoNombre').value || '').trim();
    const institucion = (document.getElementById('campoInstitucion').value || '').trim();
    const email = (document.getElementById('campoEmail').value || '').trim();
    const telefono = (document.getElementById('campoTelefono').value || '').trim();
    const tipoGrupo = document.getElementById('campoTipoGrupo').value;
    const cantidad = parseInt(document.getElementById('campoCantidad').value, 10);
    const fecha = document.getElementById('campoFecha').value;
    const horario = document.getElementById('campoHorario').value;
    const enfoque = document.getElementById('campoEnfoque').value;
    const comentarios = (document.getElementById('campoComentarios').value || '').trim();
    const compromiso = document.getElementById('campoCompromiso').checked;

    // Validaciones
    if (!nombre) {
      alert('Por favor ingresa el nombre del docente o responsable de la delegación.');
      document.getElementById('campoNombre').focus();
      return;
    }
    if (!institucion) {
      alert('Por favor ingresa la institución o colegio al que pertenece el grupo.');
      document.getElementById('campoInstitucion').focus();
      return;
    }
    if (!email || !validarEmail(email)) {
      alert('Por favor ingresa un correo electrónico válido de contacto.');
      document.getElementById('campoEmail').focus();
      return;
    }
    if (!telefono) {
      alert('Por favor ingresa un teléfono de contacto.');
      document.getElementById('campoTelefono').focus();
      return;
    }
    if (!tipoGrupo) {
      alert('Por favor selecciona el perfil o nivel educativo del grupo.');
      document.getElementById('campoTipoGrupo').focus();
      return;
    }
    if (!cantidad || cantidad < 1 || cantidad > 50) {
      alert('Por favor indica una cantidad de asistentes válida (entre 1 y 50 personas).');
      document.getElementById('campoCantidad').focus();
      return;
    }
    if (!fecha) {
      alert('Por favor selecciona la fecha propuesta para la visita.');
      document.getElementById('campoFecha').focus();
      return;
    }
    if (!horario) {
      alert('Por favor selecciona el bloque de horario preferido.');
      document.getElementById('campoHorario').focus();
      return;
    }
    if (!compromiso) {
      alert('Debes aceptar el compromiso de respeto y bienestar animal para solicitar el recorrido.');
      document.getElementById('campoCompromiso').focus();
      return;
    }

    // Generar código único de seguimiento (#VIS-B13-XXXX)
    const folioRandom = Math.floor(1000 + Math.random() * 9000);
    const codigo = `#VIS-B13-${folioRandom}`;

    const nuevaVisita = {
      id: codigo,
      codigo: codigo,
      nombre: nombre,
      institucion: institucion,
      email: email,
      telefono: telefono,
      tipoGrupo: tipoGrupo,
      cantidad: cantidad,
      fecha: fecha,
      horario: horario,
      enfoque: enfoque,
      comentarios: comentarios,
      timestamp: new Date().toISOString(),
      estado: 'Recibida en Demo'
    };

    // Guardar en localStorage
    guardarEnHistorial(nuevaVisita);

    // Intentar sincronizar con la API del backend si el servidor está levantado
    sincronizarConBackend(nuevaVisita);

    // Audio de éxito
    if (typeof playCorrect === 'function') {
      playCorrect();
    }

    // Abrir Modal de Confirmación
    abrirModalConfirmacion(nuevaVisita);

    // Resetear formulario
    form.reset();
    document.getElementById('campoCantidad').value = 20;
    configurarFechasMinimas();

    mostrarToast(`🎉 ¡Solicitud ${codigo} generada con éxito!`);
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* ============================================================
     Sincronización con el Backend (si existe servidor Node.js)
     ============================================================ */
  function sincronizarConBackend(visitaData) {
    if (window.location.protocol === 'file:') return;

    fetch('/api/visitas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitaData)
    })
    .then(r => r.json())
    .then(res => {
      if (res && res.success) {
        console.log('Visita registrada en backend:', res.id);
      }
    })
    .catch(() => {
      // Si el backend no tiene la ruta o estamos en modo estático, funciona localmente sin problemas
    });
  }

  /* ============================================================
     Historial Local en LocalStorage
     ============================================================ */
  function obtenerHistorial() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_VISITAS);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function guardarEnHistorial(item) {
    const items = obtenerHistorial();
    items.unshift(item);
    if (items.length > 20) items.pop();
    try {
      localStorage.setItem(STORAGE_KEY_VISITAS, JSON.stringify(items));
    } catch (e) {}
    cargarHistorial();
  }

  function cargarHistorial() {
    const items = obtenerHistorial();

    if (visitasCountBadge) {
      visitasCountBadge.textContent = items.length;
    }

    if (!contenedorHistorial) return;

    if (items.length === 0) {
      if (historialVacioMensaje) historialVacioMensaje.style.display = 'block';
      if (btnBorrarHistorial) btnBorrarHistorial.style.display = 'none';
      contenedorHistorial.innerHTML = `
        <div class="visitas-history-empty">
          🌾 Aún no has registrado solicitudes de visita guiada. ¡Completa el formulario de arriba para generar tu primer requerimiento en la demo!
        </div>
      `;
      return;
    }

    if (historialVacioMensaje) historialVacioMensaje.style.display = 'none';
    if (btnBorrarHistorial) btnBorrarHistorial.style.display = 'inline-block';

    let html = '';
    items.forEach(item => {
      html += `
        <div class="visitas-ticket-card">
          <div class="visitas-ticket-head">
            <span class="visitas-ticket-code">${escaparHtml(item.codigo)}</span>
            <span class="visitas-ticket-badge">🟡 ${escaparHtml(item.estado || 'Recibida en Demo')}</span>
          </div>
          <div class="visitas-ticket-body">
            <b>🏫 Institución:</b> ${escaparHtml(item.institucion)}<br>
            <b>👤 Responsable:</b> ${escaparHtml(item.nombre)} (${escaparHtml(item.telefono)})<br>
            <b>📅 Fecha & Bloque:</b> ${escaparHtml(item.fecha)} — ${escaparHtml(item.horario)}<br>
            <b>👥 Delegación:</b> ${escaparHtml(item.tipoGrupo)} · <b>${escaparHtml(String(item.cantidad))}</b> asistentes
          </div>
          <div class="visitas-ticket-actions">
            <button type="button" class="visitas-ticket-btn" onclick="window.reabrirVoucherVisita('${escaparHtml(item.codigo)}')">
              🔍 Ver Comprobante
            </button>
            <button type="button" class="visitas-ticket-btn" onclick="window.abrirCorreoVisita('${escaparHtml(item.codigo)}')">
              📧 Abrir Correo
            </button>
          </div>
        </div>
      `;
    });

    contenedorHistorial.innerHTML = html;
  }

  /* ============================================================
     Modal y Comprobante
     ============================================================ */
  function abrirModalConfirmacion(visita) {
    ultimaSolicitud = visita;

    if (voucherCodigo) voucherCodigo.textContent = visita.codigo;
    if (voucherNombre) voucherNombre.textContent = visita.nombre;
    if (voucherInstitucion) voucherInstitucion.textContent = visita.institucion;
    if (voucherFechaHorario) voucherFechaHorario.textContent = `${visita.fecha} (${visita.horario})`;
    if (voucherGrupoCantidad) voucherGrupoCantidad.textContent = `${visita.tipoGrupo} · ${visita.cantidad} personas`;
    if (voucherContacto) voucherContacto.textContent = `${visita.email} / ${visita.telefono}`;
    if (voucherEnfoque) voucherEnfoque.textContent = visita.enfoque;

    // Configurar enlace mailto
    configurarEnlaceMailto(visita);

    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
    }
  }

  function cerrarModal() {
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
    }
  }

  function configurarEventosModal() {
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModal);
    if (btnCerrarModalBottom) btnCerrarModalBottom.addEventListener('click', cerrarModal);

    // Cierre al pulsar escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        cerrarModal();
      }
    });

    // Cierre al clickear fuera del contenido
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) cerrarModal();
      });
    }

    // Copiar resumen al portapapeles
    if (btnCopiarResumen) {
      btnCopiarResumen.addEventListener('click', () => {
        if (!ultimaSolicitud) return;
        const texto = generarTextoResumen(ultimaSolicitud);
        navigator.clipboard.writeText(texto)
          .then(() => {
            mostrarToast('📋 ¡Resumen copiado al portapapeles!');
          })
          .catch(() => {
            mostrarToast('No se pudo copiar automáticamente. Puedes seleccionar el texto.');
          });
      });
    }

    // Imprimir comprobante
    if (btnImprimirComprobante) {
      btnImprimirComprobante.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /* ============================================================
     Generación de Correo Electrónico (mailto:)
     ============================================================ */
  function configurarEnlaceMailto(v) {
    if (!btnMailtoModal) return;

    const asunto = `[Granja B-13] Solicitud de Visita Guiada - ${v.institucion} (${v.codigo})`;
    const cuerpo = generarTextoResumen(v);

    const mailtoUrl = `mailto:${encodeURIComponent(EMAIL_COORDINACION)}?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    btnMailtoModal.href = mailtoUrl;
  }

  function generarTextoResumen(v) {
    return [
      `SOLICITUD DE RECORRIDO GUIADO — LA GRANJA REAL B-13`,
      `Liceo Domingo Herrera Rivera B-13, Antofagasta, Chile`,
      `----------------------------------------------------`,
      `Código de Solicitud: ${v.codigo}`,
      `Fecha de Registro: ${new Date(v.timestamp || Date.now()).toLocaleString('es-CL')}`,
      ``,
      `1. DATOS DE LA DELEGACIÓN:`,
      `- Institución / Colegio: ${v.institucion}`,
      `- Responsable a cargo: ${v.nombre}`,
      `- Correo de contacto: ${v.email}`,
      `- Teléfono / WhatsApp: ${v.telefono}`,
      ``,
      `2. DETALLES DEL RECORRIDO PROPUESTO:`,
      `- Perfil del grupo: ${v.tipoGrupo}`,
      `- Cantidad estimada: ${v.cantidad} personas`,
      `- Fecha propuesta: ${v.fecha}`,
      `- Bloque horario preferido: ${v.horario}`,
      `- Enfoque pedagógico: ${v.enfoque}`,
      ``,
      `3. OBSERVACIONES Y REQUERIMIENTOS:`,
      `${v.comentarios || 'Sin requerimientos especiales informados.'}`,
      ``,
      `Compromiso de bienestar animal: Aceptado y confirmado.`,
      `----------------------------------------------------`,
      `Enviado desde la plataforma web La Granja B-13 (Liceo Domingo Herrera Rivera).`
    ].join('\n');
  }

  /* ============================================================
     Botones Globales / Barra de Herramientas
     ============================================================ */
  function configurarBotonesBarra() {
    // Sonido
    const soundBtn = document.getElementById('soundBtn');
    if (soundBtn && typeof window.toggleSound === 'function') {
      soundBtn.onclick = () => {
        window.toggleSound();
        mostrarToast(window.isSoundOn() ? '🔊 Sonido activado' : '🔇 Sonido desactivado');
      };
    }

    // Modo Oscuro / Tema
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
      themeBtn.onclick = () => {
        if (typeof window.toggleThemeMode === 'function') {
          window.toggleThemeMode();
        } else if (typeof window.applyTheme === 'function' && typeof window.state !== 'undefined') {
          const next = (document.documentElement.classList.contains('theme-dark')) ? 'light' : 'dark';
          const bg = (next === 'dark') ? '#141c13' : '#FAF7EE';
          window.applyTheme(bg);
        } else {
          document.documentElement.classList.toggle('theme-dark');
          document.body.classList.toggle('theme-dark');
        }
        mostrarToast('🌓 Tema alternado');
      };
    }

    // Mostrar puntaje si state está presente
    if (typeof state !== 'undefined' && state && state.score !== undefined) {
      const elScore = document.getElementById('score');
      if (elScore) elScore.textContent = state.score;
    }

    // Sincronizar nombre en la píldora de estudiante
    if (typeof Auth !== 'undefined') {
      const sesion = Auth.getSesion ? Auth.getSesion() : null;
      const elNombre = document.getElementById('studentDisplayName');
      if (elNombre && sesion && sesion.nombre) {
        elNombre.textContent = sesion.nombre;
      }
    }
  }

  /* ============================================================
     Funciones Expuestas Globalmente
     ============================================================ */
  window.reabrirVoucherVisita = function(codigo) {
    const items = obtenerHistorial();
    const encontrado = items.find(i => i.codigo === codigo);
    if (encontrado) {
      abrirModalConfirmacion(encontrado);
    }
  };

  window.abrirCorreoVisita = function(codigo) {
    const items = obtenerHistorial();
    const encontrado = items.find(i => i.codigo === codigo);
    if (encontrado) {
      configurarEnlaceMailto(encontrado);
      if (btnMailtoModal && btnMailtoModal.href) {
        window.open(btnMailtoModal.href, '_blank');
      }
    }
  };

  /* ============================================================
     Utilidades
     ============================================================ */
  function mostrarToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(() => {
      t.classList.remove('show');
    }, 2800);
  }

  function escaparHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Inicializar al cargar el DOM
  document.addEventListener('DOMContentLoaded', init);

})();
