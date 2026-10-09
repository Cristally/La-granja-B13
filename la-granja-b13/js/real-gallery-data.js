/*
  real-gallery-data.js — Datos estructurados del recorrido fotográfico real
  de la Granja del Liceo Domingo Herrera Rivera B-13 y su correspondencia interactiva con el juego.
*/

const REAL_GALLERY_ITEMS = [
  // ========================================================
  // 📸 REGISTROS FOTOGRÁFICOS HD OFICIALES (ONEDRIVE B-13)
  // Las imágenes en máxima resolución se presentan en primer lugar.
  // ========================================================
  {
    id: 'pozo-huerto-hd',
    category: 'espacios',
    title: 'El Pozo Histórico & Jardín Botánico (HD)',
    subtitle: 'Infraestructura hídrica sustentable y paisajismo escolar',
    photo: 'assets/img/real/pozo_huerto_hd.jpg',
    extraPhoto: 'assets/img/real/huerto_pozo_panoramica.jpg',
    gameRef: {
      type: 'map',
      label: 'Pozo de Agua Histórico',
      icon: '🪣',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Estructura', v: 'Brocal artesanal de madera, techo a dos aguas y polea' },
      { k: 'Entorno', v: 'Jardineras de piedra, plantas trepadoras y huerto medicinal' },
      { k: 'ODS', v: 'ODS 6 (Agua limpia) y ODS 15 (Vida de ecosistemas)' }
    ],
    desc: 'Fotografía en alta definición del pozo de madera tradicional construido en la granja del Liceo B-13, rodeado de vegetación cuidada por profesores y estudiantes.',
    pedagogy: '💡 Muestra el valor de conservar fuentes de agua limpia y crear microclimas verdes en el desierto costero de Antofagasta.'
  },
  {
    id: 'conejos-tres-amigos-hd',
    category: 'fauna',
    title: 'Conejeras Escolares: Quesito, Ceniza y Canela (HD)',
    subtitle: 'Comunidad de conejos junto a cartel de bioética energética',
    photo: 'assets/img/real/conejos_tres_amigos_cartel.jpg',
    extraPhoto: 'assets/img/real/conejos_nesquik_quesito_canela.jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Oficiales',
      icon: '🐇',
      link: 'ficha.html?id=quesito'
    },
    specs: [
      { k: 'Ejemplares', v: 'Quesito (blanco ojos azules), Ceniza (gris) y Canela (ámbar)' },
      { k: 'Cartel', v: '"La energía también necesita de nuestro cuidado"' },
      { k: 'Instalación', v: 'Conejeras con pasto sintético higiénico y madrigueras térmicas' },
      { k: 'Comportamiento', v: 'Animales sociables que se acercan curiosos a la malla' }
    ],
    desc: 'Primer plano en alta resolución de tres de los queridos conejos del liceo asomándose en su corral, con el cartel ambiental escolar al fondo.',
    pedagogy: '💡 Vincula el respeto zootécnico a pequeños mamíferos con la conciencia de sustentabilidad energética escolar.'
  },
  {
    id: 'matias-vicente-duo-hd',
    category: 'fauna',
    title: 'Matías y Vicente: Gallitos Japoneses Bantam (HD)',
    subtitle: 'Retrato en primer plano de los reyes ornamentales del corral',
    photo: 'assets/img/real/matias_vicente_duo_hd.jpg',
    extraPhoto: 'assets/img/real/jaula_matias_vicente_cartel.jpg',
    gameRef: {
      type: 'map',
      label: 'Nidos y Crianza del Corral',
      icon: '🐓',
      link: 'ficha.html?id=matias'
    },
    specs: [
      { k: 'Ejemplares', v: 'Matías y Vicente (Gallitos Japoneses / Bantam)' },
      { k: 'Plumaje', v: 'Blanco sedoso, crestas rojas vivas y tarsos emplumados' },
      { k: 'Convivencia', v: 'Conviven en total armonía sin rivalidad de corral' },
      { k: 'Cartel oficial', v: '"Somos dos Gallitos Japoneses muy amorosos..."' }
    ],
    desc: 'Retrato nítido en HD de Matías y Vicente. Se aprecian los detalles anatómicos de sus crestas termorreguladoras y su plumaje esponjoso.',
    pedagogy: '💡 Enseña a los alumnos sobre genética de razas enanas (Bantam) y resolución pacífica de jerarquías sociales en aves.'
  },
  {
    id: 'los-manguitos-rama-hd',
    category: 'fauna',
    title: 'Los Manguitos: Trío de Agapornis en el Aviario (HD)',
    subtitle: 'Clan de agapornis inseparables descansando en percha natural',
    photo: 'assets/img/real/los_manguitos_rama_hd.jpg',
    extraPhoto: 'assets/img/real/pastelito_malla_hd.jpg',
    gameRef: {
      type: 'map',
      label: 'Aviario de Aves Menores',
      icon: '🦜',
      link: 'ficha.html?id=los_manguitos'
    },
    specs: [
      { k: 'Especie', v: 'Agapornis roseicollis (Inseparables)' },
      { k: 'Coloración', v: 'Máscara facial coral melocotón, cuerpo amarillo mango y lima' },
      { k: 'Pata', v: 'Zigodáctila (dos dedos adelante y dos atrás para trepar)' },
      { k: 'Hábitat', v: 'Aviario con perchas de madera natural y enriquecimiento' }
    ],
    desc: 'Fotografía vertical en alta definición de Los Manguitos alineados en una rama natural dentro del aviario escolar.',
    pedagogy: '💡 Ilustra la etología social de los psitácidos, el acicalamiento cooperativo y la importancia de jaulas voladeras espaciosas.'
  },
  {
    id: 'quesito-ojos-azules-hd',
    category: 'fauna',
    title: 'Conejo Quesito: Ojos Azules y Descanso Térmico (HD)',
    subtitle: 'El conejo decano más joven y esponjoso de la conejera',
    photo: 'assets/img/real/quesito_ojos_azules_hd.jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Oficiales (Quesito)',
      icon: '🐇',
      link: 'ficha.html?id=quesito'
    },
    specs: [
      { k: 'Edad', v: '1 Año' },
      { k: 'Fenotipo', v: 'Manto blanco de pelo largo y ojos azul zafiro' },
      { k: 'Comportamiento', v: 'Muy metiche, se refugia en sombra bajo bancos' },
      { k: 'Bienestar', v: 'Suelo limpio con forraje y libre de corrientes frías' }
    ],
    desc: 'Fotografía en primer plano de Quesito descansando tranquilamente sobre el césped protegido de la conejera escolar.',
    pedagogy: '💡 Analiza las adaptaciones fisiológicas del pelaje térmico y la variación de pigmentación en lagomorfos domésticos.'
  },
  {
    id: 'almacen-herramientas-aviario-hd',
    category: 'espacios',
    title: 'Almacén de Granja, Herramientas & Aviario (HD)',
    subtitle: 'Sector de aperos de cultivo, compostaje y letrero de respeto',
    photo: 'assets/img/real/almacen_herramientas_aviario.jpg',
    gameRef: {
      type: 'map',
      label: 'Almacén de Granja',
      icon: '📦',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Herramientas', v: 'Palas, rastrillos, mangueras y cajoneras de madera reciclada' },
      { k: 'Letrero', v: '"Si entras a este lugar por naturaleza sentirás olor a desechos..."' },
      { k: 'Organización', v: 'Sector de acopio de paja y sustratos de lombricultura' },
      { k: 'Valores', v: 'Trabajo colaborativo, orden y bioética zootécnica' }
    ],
    desc: 'Vista amplia del taller exterior y frontis del aviario. Muestra las herramientas con las que los estudiantes cuidan a los animales y huertos.',
    pedagogy: '💡 Enseña a naturalizar la biología animal y la responsabilidad del mantenimiento higiénico sin prejuicios.'
  },
  {
    id: 'porton-lapices-mural-hd',
    category: 'espacios',
    title: 'Portón de Lápices de Colores & Mural B-13 (HD)',
    subtitle: 'Entrada artística e identitaria a la granja escolar',
    photo: 'assets/img/real/porton_lapices_mural.jpg',
    gameRef: {
      type: 'map',
      label: 'Entrada Oficial de la Granja',
      icon: '🚪',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Arte', v: 'Portón de madera pintado como lápices de colores' },
      { k: 'Mural', v: 'Mural comunitario: "Podemos Lograrlo" con insignia B-13' },
      { k: 'Sombra', v: 'Parra y enredaderas que cobijan el umbral de entrada' },
      { k: 'Identidad', v: 'Punto de encuentro de las delegaciones de estudiantes' }
    ],
    desc: 'El portón emblemático de la granja del Liceo B-13 con sus lápices de colores y mural motivacional, dando la bienvenida al espacio verde.',
    pedagogy: '💡 Vincula el arte, la pertenencia escolar y la educación ambiental en un espacio pedagógico integrador.'
  },
  {
    id: 'conejos-caricia-estudiantes-hd',
    category: 'fauna',
    title: 'Convivencia Pacífica: Caricias y Cuidado Animal (HD)',
    subtitle: 'Estudiantes del liceo interactuando con los conejos',
    photo: 'assets/img/real/conejos_caricia_estudiantes.jpg',
    extraPhoto: 'assets/img/real/canela_pasto_hd.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Potrero y Convivencia',
      icon: '🤝',
      link: 'index.html'
    },
    specs: [
      { k: 'Norma', v: 'Movimientos suaves, sin ruidos molestos ni manipulación forzada' },
      { k: 'Reacción', v: 'Conejo negro dócil aceptando caricias con serenidad' },
      { k: 'Enriquecimiento', v: 'Chalas de choclo y forraje fresco de colación' },
      { k: 'Impacto', v: 'Reducción de ansiedad escolar y fomento de empatía' }
    ],
    desc: 'Muestra a un estudiante acariciando suavemente a uno de los conejos del liceo mientras otro come hojas de choclo fresco al lado.',
    pedagogy: '💡 Evidencia concreta del cumplimiento del Decálogo de Normas y el impacto socioemocional positivo de la granja.'
  },
  {
    id: 'gallinero-cleo-hd',
    category: 'fauna',
    title: 'Gallinero Escolar: Cleo y Aves de Corral (HD)',
    subtitle: 'Vida cotidiana en el recinto protegido de gallinas',
    photo: 'assets/img/real/gallinero_cleo_hd.jpg',
    gameRef: {
      type: 'map',
      label: 'Gallinero Principal',
      icon: '🐔',
      link: 'ficha.html?id=cleo'
    },
    specs: [
      { k: 'Ave principal', v: 'Cleo (plumaje barrado y cresta roja)' },
      { k: 'Entorno', v: 'Suelo de tierra para baños de arena y perchas de madera' },
      { k: 'Protección', v: 'Malla gallinera resistente y sombra contra el sol nortino' },
      { k: 'Comportamiento', v: 'Curiosidad y vocalización calmada de corral' }
    ],
    desc: 'Primer plano de Cleo observando con curiosidad detrás de la malla del gallinero en una jornada de clases del liceo.',
    pedagogy: '💡 Permite analizar la visión tetracromática aviar y las pautas de enriquecimiento en avicultura escolar.'
  },

  // ========================================================
  // 📋 PÓSTERS Y CARTELES OFICIALES DE IDENTIDAD
  // ========================================================
  {
    id: 'poster-conejos',
    category: 'fauna',
    title: 'Póster Oficial: Nuestros Conejos B-13',
    subtitle: 'Conejeras Escolares — 9 Ejemplares Oficiales',
    photo: 'assets/img/animals/poster_conejos.png',
    gameRef: {
      type: 'map',
      label: 'Conejeras Oficiales',
      icon: '🐇',
      link: 'ficha.html?id=nesquik'
    },
    specs: [
      { k: 'Ejemplares', v: 'Nesquik, Vainilla, Tasmi, Quesito, Narizita, Canela, Chaucha, Segunda, Ceniza' },
      { k: 'Especie', v: 'Oryctolagus cuniculus domesticus' },
      { k: 'Hábitat', v: 'Conejeras con madrigueras térmicas y zona de forrajeo' },
      { k: 'Dieta', v: 'Heno de alfalfa, pellets balanceados y verduras frescas del huerto' }
    ],
    desc: 'Póster oficial de campo con los 9 conejos del Liceo B-13. Cada uno cuenta con rasgos fenotípicos y personalidades únicas que los estudiantes reconocen y cuidan a diario.',
    pedagogy: '💡 Fomenta el respeto hacia la individualidad y etología lagomorfa en la granja pedagógica.'
  },
  {
    id: 'poster-gallinas',
    category: 'fauna',
    title: 'Póster Oficial: Nuestras Gallinas y Gallos B-13',
    subtitle: 'Gallinero Escolar — 9 Ejemplares Oficiales',
    photo: 'assets/img/animals/poster_gallinas.jpg',
    gameRef: {
      type: 'map',
      label: 'Gallinero Protegido',
      icon: '🐔',
      link: 'ficha.html?id=vicente'
    },
    specs: [
      { k: 'Ejemplares', v: 'Vicente, Matías, Cleo, Tormenta, Milagro, Mamá, Violeta, Fernanda chica, Avellana' },
      { k: 'Especie', v: 'Gallus gallus domesticus (Razas Sedosa, Bantam, Barrada y Criolla)' },
      { k: 'Hábitat', v: 'Gallinero protegido con toldo, perchas y nidos de postura' },
      { k: 'Nutrición', v: 'Granos partidos, forraje verde y suplemento de calcio' }
    ],
    desc: 'Póster de identificación oficial de las aves de corral del liceo: gallos Bantam de patas calzadas, gallinas sedosas japonesas y ponedoras rústicas.',
    pedagogy: '💡 Enseña diversidad genética aviar, jerarquías de parvada y producción agroecológica escolar.'
  },
  {
    id: 'poster-loros',
    category: 'fauna',
    title: 'Póster Oficial: Nuestros Loros y Aves B-13',
    subtitle: 'Aviario Escolar — Agapornis y Periquitos',
    photo: 'assets/img/animals/poster_loros.jpg',
    gameRef: {
      type: 'map',
      label: 'Aviario de Aves Menores',
      icon: '🦜',
      link: 'ficha.html?id=pastelito'
    },
    specs: [
      { k: 'Grupos', v: 'Pastelito (Agapornis estrella), Los manguitos (clan inseparables), Las Catitas (periquitos)' },
      { k: 'Especies', v: 'Agapornis roseicollis & Melopsittacus undulatus' },
      { k: 'Hábitat', v: 'Aviario amplio con perchas naturales y enriquecimiento ambiental' },
      { k: 'Dieta', v: 'Mix de semillas balanceadas, brotes frescos y frutas' }
    ],
    desc: 'Cartel oficial de las aves psitácidas del liceo, destacando la inteligencia, sociabilidad y cuidados específicos de estas especies trepadoras.',
    pedagogy: '💡 Aprendizaje sobre aves psitaciformes, motricidad zigodáctila y bienestar animal en cautiverio educativo.'
  },
  {
    id: 'poster-patos',
    category: 'fauna',
    title: 'Póster Oficial: Nuestros Patos B-13',
    subtitle: 'Estanque y Pozo de Agua — Sal y Pimienta',
    photo: 'assets/img/animals/poster_patos.png',
    gameRef: {
      type: 'map',
      label: 'Estanque de los Patos',
      icon: '🦆',
      link: 'ficha.html?id=sal'
    },
    specs: [
      { k: 'Ejemplares', v: 'Sal (Pato blanco Pekín) y Pimienta (Pato negro Cayuga iridiscente)' },
      { k: 'Especie', v: 'Anas platyrhynchos domesticus' },
      { k: 'Hábitat', v: 'Estanque con agua limpia para sumersión cefálica y nado' },
      { k: 'Alimentación', v: 'Vegetales flotantes, guisantes, forraje fresco y granos triturados' }
    ],
    desc: 'Póster oficial de Sal y Pimienta, los dos patos emblemáticos de la granja escolar, expertos en natación y termorregulación hidrofóbica.',
    pedagogy: '💡 Sensibiliza sobre las necesidades anatómicas acuáticas y prohíbe la alimentación dañina con pan procesado.'
  },
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
      { k: 'Propósito', v: 'Taller práctico de botánica y educación ambiental' }
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
