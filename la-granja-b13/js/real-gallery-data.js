/*
  real-gallery-data.js — Datos estructurados del recorrido fotográfico real
  de la Granja del Liceo Domingo Herrera Rivera B-13 y su correspondencia interactiva con el juego.
*/

const REAL_GALLERY_ITEMS = [
  {
    id: 'cartel-vainilla',
    category: 'fauna',
    title: 'Conejo Vainilla — Cartel Oficial de Identidad',
    subtitle: 'Corral de Conejos del Liceo B-13',
    photo: 'assets/img/real/cartel_vainilla.png',
    gameRef: {
      type: 'map',
      label: 'Corral de Conejos (Vainilla)',
      icon: '🐇',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Edad', v: '5 Años' },
      { k: 'Carácter', v: 'Enamoradizo y tierno' },
      { k: 'Pelaje', v: 'Blanco con manchas café claro en orejas y ojitos, pelito corto' },
      { k: 'Ubicación', v: 'Corral exterior con pasto y madriguera de madera' }
    ],
    desc: 'Cartel informativo real instalado en el liceo para que los estudiantes aprendan a reconocer a Vainilla por sus rasgos físicos y respeten su temperamento dócil.',
    pedagogy: '💡 Fomenta el respeto hacia la individualidad de cada animal y el aprendizaje de rasgos fenotípicos en biología.'
  },
  {
    id: 'cartel-nesquik',
    category: 'fauna',
    title: 'Conejo Nesquik — Cartel Oficial de Identidad',
    subtitle: 'Corral de Conejos del Liceo B-13',
    photo: 'assets/img/real/cartel_nesquik.jpg',
    gameRef: {
      type: 'map',
      label: 'Corral de Conejos (Nesquik)',
      icon: '🐰',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Edad', v: '3 Años' },
      { k: 'Carácter', v: 'Introvertido e impredecible' },
      { k: 'Pelaje', v: 'Color café con manchas oscuras, pelo largo y esponjoso' },
      { k: 'Cuidados', v: 'Cepillado frecuente de pelaje y ambiente silencioso' }
    ],
    desc: 'Cartel oficial de Nesquik. A diferencia de Vainilla, Nesquik es más reservado y necesita un acercamiento pausado sin ruidos fuertes.',
    pedagogy: '💡 Enseña a los alumnos sobre el bienestar y manejo de mamíferos menores bajo normas de etología.'
  },
  {
    id: 'cartel-tasmi',
    category: 'fauna',
    title: 'Conejo Tasmi — Cartel Oficial de Identidad',
    subtitle: 'Corral de Conejos del Liceo B-13',
    photo: 'assets/img/real/cartel_tasmi.png',
    gameRef: {
      type: 'map',
      label: 'Corral de Conejos (Tasmi)',
      icon: '🐇',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Edad', v: '2 Años' },
      { k: 'Carácter', v: 'Revoltoso y destructor' },
      { k: 'Pelaje', v: 'Color blanco con manchas café claro en las orejitas, pelo corto' },
      { k: 'Comportamiento', v: 'Muy activo y juguetón, le gusta mordisquear ramas' }
    ],
    desc: 'Cartel oficial de Tasmi. Es conocido por su energía desbordante y curiosidad incesante dentro de la conejera.',
    pedagogy: '💡 Explica la necesidad de proveer heno fibroso y maderas seguras para el desgaste dental natural de los lagomorfos.'
  },
  {
    id: 'cartel-quesito',
    category: 'fauna',
    title: 'Conejo Quesito — Cartel Oficial de Identidad',
    subtitle: 'Corral de Conejos del Liceo B-13',
    photo: 'assets/img/real/cartel_quesito.png',
    gameRef: {
      type: 'map',
      label: 'Corral de Conejos (Quesito)',
      icon: '🐇',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Edad', v: '1 Año' },
      { k: 'Carácter', v: 'Metiche y amistoso' },
      { k: 'Pelaje', v: 'Color blanco, largo y esponjoso' },
      { k: 'Ojos', v: 'Ojos azules brillantes (rasgo genético distintivo)' }
    ],
    desc: 'Cartel oficial de Quesito, el más joven y sociable de la conejera. Destaca por su pelaje blanco tupido y sus singulares ojos azules.',
    pedagogy: '💡 Permite analizar la herencia de rasgos genéticos recesivos como la coloración ocular en conejos domésticos.'
  },
  {
    id: 'gallitos-japoneses-cartel',
    category: 'fauna',
    title: 'Gallitos Japoneses: Matías y Vicente',
    subtitle: 'Jaula y hábitat de gallos de raza japonesa',
    photo: 'assets/img/real/gallitos_japoneses_cartel.jpg',
    extraPhoto: 'assets/img/real/gallitos_japoneses_zoom.jpg',
    gameRef: {
      type: 'map',
      label: 'Jaula de Gallitos Japoneses',
      icon: '🐔',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Nombres', v: 'Matías y Vicente' },
      { k: 'Raza', v: 'Gallo Japonés / Sedosa / Chabo' },
      { k: 'Carácter', v: 'Muy amorosos y sociables' },
      { k: 'Alimentación', v: 'Granos seleccionados, agua fresca y suplementos' }
    ],
    desc: 'Cartel de bienvenida: "Somos dos Gallitos Japoneses muy amorosos, nuestros nombres son Matías y Vicente". Viven en un recinto protegido con bebedero y comedero elevado.',
    pedagogy: '💡 Destaca la diversidad de razas aviares y el apego afectivo positivo en la educación agroecológica.'
  },
  {
    id: 'gallo-guardian',
    category: 'fauna',
    title: 'Gallo Guardián de la Granja',
    subtitle: 'Recinto de aves y gallinero',
    photo: 'assets/img/real/gallo_jaula_real.png',
    gameRef: {
      type: 'potrero',
      label: 'Gallo en el Potrero y Gallinero',
      icon: '🐓',
      link: 'index.html'
    },
    specs: [
      { k: 'Especie', v: 'Gallus gallus domesticus' },
      { k: 'Rasgos', v: 'Cresta roja prominente, barbillones y plumaje dorado' },
      { k: 'Rol', v: 'Líder del grupo, alerta y vocalización al amanecer' }
    ],
    desc: 'Fotografía real del gallo guardián en su recinto de malla y madera en el Liceo B-13. Se observa su plumaje lustroso y porte vigilante.',
    pedagogy: '💡 Permite analizar la anatomía de las crestas (termorregulación) y la comunicación animal.'
  },
  {
    id: 'conejo-pasto',
    category: 'fauna',
    title: 'Conejos en el Área Verde de Ejercicio',
    subtitle: 'Corral de esparcimiento',
    photo: 'assets/img/real/conejo_pasto_real.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Conejo libre en Potrero',
      icon: '🐇',
      link: 'index.html'
    },
    specs: [
      { k: 'Actividad', v: 'Pastoreo y enriquecimiento físico' },
      { k: 'Suelo', v: 'Césped sintético limpio con sombra natural' },
      { k: 'Beneficio', v: 'Evita pododermatitis y estimula la movilidad' }
    ],
    desc: 'Uno de los conejos blancos recorriendo el sector verde acondicionado de la granja del liceo, diseñado para permitirles corretear con seguridad.',
    pedagogy: '💡 Demuestra la aplicación práctica del ODS 15 en instalaciones de tenencia responsable.'
  },
  {
    id: 'aviario-real',
    category: 'espacios',
    title: 'El Aviario Escolar de Agapornis y Catitas',
    subtitle: 'Ecosistema aéreo con ramas y nidos',
    photo: 'assets/img/real/aviario_real.jpg',
    gameRef: {
      type: 'map',
      label: 'Arboleda de Nidos (Catitas y Agapornis)',
      icon: '🦜',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Especies', v: 'Agapornis personatus / Fischeri y Catitas australianas' },
      { k: 'Estructura', v: 'Pajarera de madera con ramas reales y bebederos de tubo' },
      { k: 'Enriquecimiento', v: 'Cadenetas colgantes, cajas nido de madera natural' }
    ],
    desc: 'Fotografía del aviario real del liceo. Muestra los nidos en diferentes alturas y las ramas naturales que permiten el vuelo y la socialización.',
    pedagogy: '💡 Explica el comportamiento gregario de los psitácidos y su necesidad de estímulos visuales y motores.'
  },
  {
    id: 'pozo-real',
    category: 'espacios',
    title: 'El Pozo de Agua Tradicional y Jardín',
    subtitle: 'Infraestructura hídrica y paisajismo',
    photo: 'assets/img/real/pozo_real.jpg',
    gameRef: {
      type: 'map',
      label: 'Pozo de Agua en el Mapa',
      icon: '🪣',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Materiales', v: 'Brocal de listones de madera, techo a dos aguas y polea' },
      { k: 'Entorno', v: 'Banca de descanso, plantas trepadoras y sombra' },
      { k: 'Simbolismo', v: 'El agua como recurso vital para la vida y el riego sustentable' }
    ],
    desc: 'El pozo rústico real construido en la granja del Liceo B-13, idéntico al que los estudiantes exploran en el mapa interactivo.',
    pedagogy: '💡 Conexión directa entre el elemento gráfico del mapa y la construcción física real en la escuela.'
  },
  {
    id: 'invernadero-bancas',
    category: 'huerto',
    title: 'El Invernadero y Área de Clases al Aire Libre',
    subtitle: 'Sector pedagógico vegetal',
    photo: 'assets/img/real/invernadero_bancas.jpg',
    gameRef: {
      type: 'map',
      label: 'Huerto de Plantas y Almacén',
      icon: '🌱',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Cubierta', v: 'Malla Rachel / Toldo a rayas para protección solar del desierto' },
      { k: 'Mobiliario', v: 'Bancas de madera para observación y toma de notas' },
      { k: 'Propósito', v: 'Taller práctico de botánica y bioalfabetización' }
    ],
    desc: 'Área de sombra e invernadero donde los estudiantes asisten a clases prácticas sobre cultivo de hortalizas en el clima árido de Antofagasta.',
    pedagogy: '💡 Ejemplo concreto de adaptación climática y agricultura urbana escolar en el norte de Chile.'
  },
  {
    id: 'huerto-bancales',
    category: 'huerto',
    title: 'Bancales de Cultivo y Plantas Aromáticas',
    subtitle: 'Jardineras elevadas de producción',
    photo: 'assets/img/real/huerto_bancales.jpg',
    gameRef: {
      type: 'map',
      label: 'Sector de Siembra y Cultivo',
      icon: '🌿',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Cultivos', v: 'Hierbas aromáticas, plantas medicinales y flores polinizadoras' },
      { k: 'Sistema', v: 'Macetas plásticas recicladas y cajoneras de madera' },
      { k: 'Riego', v: 'Riego localizado para máxima eficiencia del agua' }
    ],
    desc: 'Bancales con gran variedad botánica. Los estudiantes aprenden a preparar sustratos, podar y cosechar hojas aromáticas.',
    pedagogy: '💡 Vinculación directa con ODS 12 (Producción responsable) y ODS 15 (Ecosistemas terrestres).'
  },
  {
    id: 'mesa-cultivo-flores',
    category: 'huerto',
    title: 'Mesa de Trabajo Botánico y Propagación',
    subtitle: 'Taller de esquejes y flores',
    photo: 'assets/img/real/mesa_cultivo_flores.jpg',
    gameRef: {
      type: 'map',
      label: 'Zona de Plantas en el Mapa',
      icon: '🌸',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Especies', v: 'Geranios, flores de pascua (Poinsettia), menta, ruda' },
      { k: 'Técnica', v: 'Propagación por esquejes e injertos' },
      { k: 'Mesa', v: 'Carrete de cable industrial reciclado como mesa de trabajo' }
    ],
    desc: 'Mesa circular de propagación botánica donde los alumnos realizan trasplantes de plántulas y experimentos de germinación.',
    pedagogy: '💡 Enseña economía circular mediante la reutilización de materiales industriales para el huerto.'
  },
  {
    id: 'tomates-maceta',
    category: 'huerto',
    title: 'Cultivo de Tomates Cherry en Macetero',
    subtitle: 'Producción de frutos en espacios reducidos',
    photo: 'assets/img/real/tomates_maceta.jpg',
    gameRef: {
      type: 'map',
      label: 'Cultivo de Frutos y Bayas',
      icon: '🍅',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Planta', v: 'Solanum lycopersicum (Tomate Cherry)' },
      { k: 'Soporte', v: 'Tutores de caña para sostener las ramas con frutos' },
      { k: 'Decoración', v: 'Estatua decorativa y macetero estilizado' }
    ],
    desc: 'Planta de tomates en plena fructificación en la granja del liceo, demostrando que es posible producir alimentos frescos en macetas urbanas.',
    pedagogy: '💡 Demuestra el ciclo de vida de las angiospermas (floración, polinización y fructificación).'
  },
  {
    id: 'nidos-huevos',
    category: 'nidos',
    title: 'Nidos de Incubación y Canastos de Postura',
    subtitle: 'Sector de postura aviar',
    photo: 'assets/img/real/canasto_huevos_taller.jpg',
    extraPhoto: 'assets/img/real/nido_huevos_1.jpg',
    gameRef: {
      type: 'map',
      label: 'Huevos y Nidos en el Mapa',
      icon: '🥚',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Materiales', v: 'Canasto de mimbre, paja de trigo seca y plumas naturales' },
      { k: 'Función', v: 'Aislamiento térmico y amortiguación para proteger los huevos' },
      { k: 'Monitoreo', v: 'Registro diario de recolección para trazabilidad escolar' }
    ],
    desc: 'Cestas y cajas nido reales utilizadas en el gallinero del Liceo B-13 para la recolección higiénica de huevos y estudio de la cáscara calcárea.',
    pedagogy: '💡 Permite estudiar la formación del huevo amniota y el rol del calcio en la nutrición animal.'
  },
  {
    id: 'estanque-rocalla',
    category: 'espacios',
    title: 'Estanque de Rocalla y Bebedero Natural',
    subtitle: 'Punto de hidratación para fauna libre',
    photo: 'assets/img/real/estanque_rocalla.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Bebederos del Potrero',
      icon: '🪨',
      link: 'index.html'
    },
    specs: [
      { k: 'Estructura', v: 'Cuenco excavado en roca natural con agua limpia' },
      { k: 'Elementos', v: 'Troncos secos para posarse, piedras de orilla y decoración' },
      { k: 'Visitantes', v: 'Aves silvestres de Antofagasta, gorriones y fauna local' }
    ],
    desc: 'Sector de rocalla con fuente de agua que sirve como bebedero para los animales de la granja y aves silvestres de la ciudad.',
    pedagogy: '💡 Muestra la creación de micro-hábitats para apoyar la biodiversidad urbana en el desierto costero.'
  }
];
