/*
  real-gallery-data.js — Datos estructurados del recorrido fotográfico real
  de la Granja del Liceo Domingo Herrera Rivera B-13 y su correspondencia interactiva con el juego.
  Todas las fotografías provienen directamente de la colección oficial 'Imagenes Granja Real B13'.
  Las tomas en ultra alta definición (4K y Réflex HD de OneDrive) se presentan en primer lugar,
  seguidas por las imágenes complementarias de espacios botánicos, fauna y actividades escolares.
*/

const REAL_GALLERY_ITEMS = [
  // =========================================================================
  // 📸 REGISTROS FOTOGRÁFICOS EN MÁXIMA RESOLUCIÓN (ONEDRIVE 4K & RÉFLEX HD)
  // Las imágenes en máxima fidelidad se muestran prioritariamente al inicio.
  // =========================================================================
  {
    id: 'pozo-huerto-hd',
    isHD: true,
    category: 'espacios',
    title: 'El Pozo Rústico & Plaza Central de la Granja (HD)',
    subtitle: 'Infraestructura hídrica artesanal y corazón verde del liceo',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07025.jpg',
    gameRef: {
      type: 'map',
      label: 'Pozo de Agua Histórico',
      icon: '🪣',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Estructura', v: 'Brocal artesanal de madera noble, cubierta protectora y polea' },
      { k: 'Entorno', v: 'Jardineras de piedras de río, enredaderas y palapas de sombra' },
      { k: 'ODS', v: 'ODS 6 (Agua limpia) y ODS 15 (Ecosistemas terrestres)' }
    ],
    desc: 'Fotografía en alta definición de la plaza central de la granja y su emblemático pozo de madera tradicional. Este espacio sirve de punto de encuentro donde convergen los senderos hacia los corrales y huertos.',
    pedagogy: '💡 Enseña el valor vital de la conservación hídrica en el desierto costero de Antofagasta y la creación de microclimas verdes mediante vegetación estratificada.'
  },
  {
    id: 'conejos-trio-conejera-hd',
    isHD: true,
    category: 'fauna',
    title: 'Trío de Conejos en la Conejera Escolar (4K UHD)',
    subtitle: 'Quesito, Vainilla y Nesquik en convivencia comunitaria',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (2).jpg',
    extraPhoto: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (3).jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Oficiales',
      icon: '🐇',
      link: 'ficha.html?id=quesito'
    },
    specs: [
      { k: 'Resolución', v: 'Ultra Alta Definición 4K Oficial' },
      { k: 'Ejemplares', v: 'Quesito (blanco ojos rubí), Vainilla (caramelo) y Nesquik (negro)' },
      { k: 'Instalación', v: 'Conejeras amplias con césped sintético higiénico y madrigueras' },
      { k: 'Dieta', v: 'Heno seco, forraje fresco de choclo, pellets y agua fresca' }
    ],
    desc: 'Captura en ultra alta resolución (4K) de tres de los conejos más queridos del Liceo B-13 reunidos pacíficamente en su conejera. Refleja su sociabilidad, curiosidad innata y el ambiente limpio que disfrutan.',
    pedagogy: '💡 Fomenta el respeto hacia la etología de pequeños mamíferos herbívoros y la tenencia responsable en proyectos pedagógicos.'
  },
  {
    id: 'matias-vicente-primer-plano-hd',
    isHD: true,
    category: 'fauna',
    title: 'Matías y Vicente: Gallitos Sedosos Japoneses (4K UHD)',
    subtitle: 'Dúo ornamental en primer plano de ultra alta definición',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (6).jpg',
    extraPhoto: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07014.jpg',
    gameRef: {
      type: 'map',
      label: 'Nidos y Gallinero Ornamental',
      icon: '🐓',
      link: 'ficha.html?id=matias'
    },
    specs: [
      { k: 'Resolución', v: 'Ultra Alta Definición 4K Oficial' },
      { k: 'Ejemplares', v: 'Matías y Vicente (Gallos Sedosos Japoneses / Silkie Chabo)' },
      { k: 'Morfología', v: 'Plumaje blanco aterciopelado sin barbicelas rígidas y cresta carmesí' },
      { k: 'Comportamiento', v: 'Totalmente dóciles, conviven en armonía y apego mutuo' }
    ],
    desc: 'Retrato nítido en resolución 4K de Matías y Vicente. Se aprecian al detalle la suavidad sedosa de sus plumas, sus tarsos emplumados y la coloración viva de sus crestas moriformes.',
    pedagogy: '💡 Enseña sobre la genética de razas aviares ornamentales y la resolución pacífica de jerarquías de parvada bajo crianza humanitaria.'
  },
  {
    id: 'pastelito-agapornis-estrella-hd',
    isHD: true,
    category: 'fauna',
    title: 'Pastelito: Agapornis Estrella del Aviario (4K UHD)',
    subtitle: 'El agapornis más fotogénico y sociable del liceo',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (1).jpg',
    gameRef: {
      type: 'map',
      label: 'Aviario de Aves Menores',
      icon: '🦜',
      link: 'ficha.html?id=pastelito'
    },
    specs: [
      { k: 'Resolución', v: 'Ultra Alta Definición 4K Oficial' },
      { k: 'Especie', v: 'Agapornis fischeri / roseicollis (Inseparable)' },
      { k: 'Coloración', v: 'Máscara naranja melocotón, cuerpo amarillo sol y pico coral' },
      { k: 'Hábitat', v: 'Aviario amplio con perchas naturales y enriquecimiento cognitivo' }
    ],
    desc: 'Fotografía en 4K UHD de Pastelito descansando erguido en su percha del aviario. Famoso en toda la comunidad escolar por saludar con curiosos trinos a visitantes y estudiantes.',
    pedagogy: '💡 Ilustra la destreza de las patas zigodáctilas prensiles y la necesidad de voladeras amplias para el bienestar de psitácidos.'
  },
  {
    id: 'los-manguitos-trio-rama-hd',
    isHD: true,
    category: 'fauna',
    title: 'Los Manguitos: Clan de Agapornis en Percha Natural (4K UHD)',
    subtitle: 'Trío de inseparables en perfecta formación social',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (7).jpg',
    gameRef: {
      type: 'map',
      label: 'Aviario Escolar B-13',
      icon: '🦜',
      link: 'ficha.html?id=los_manguitos'
    },
    specs: [
      { k: 'Resolución', v: 'Ultra Alta Definición 4K Oficial' },
      { k: 'Clan', v: 'Trío inseparable de Agapornis roseicollis' },
      { k: 'Plumaje', v: 'Tonos verdes esmeralda, amarillos mango y coronas rojas' },
      { k: 'Etología', v: 'Aseo recíproco (allopreening) y fuertes lazos afectivos' }
    ],
    desc: 'Captura vertical en resolución 4K de Los Manguitos alineados en una rama natural dentro del aviario escolar. Muestra la perfecta sincronización y afecto que caracteriza a los inseparables.',
    pedagogy: '💡 Demuestra el valor de las relaciones sociales complejas en aves y cómo el enriquecimiento ambiental estimula sus conductas instintivas.'
  },
  {
    id: 'quesito-descanso-pasto-hd',
    isHD: true,
    category: 'fauna',
    title: 'Conejo Quesito: Ojos Rubí y Descanso a la Sombra (4K UHD)',
    subtitle: 'Relajación y bienestar animal en la conejera escolar',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (4).jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Oficiales',
      icon: '🐇',
      link: 'ficha.html?id=quesito'
    },
    specs: [
      { k: 'Resolución', v: 'Ultra Alta Definición 4K Oficial' },
      { k: 'Ejemplar', v: 'Quesito (Manto blanco de pelo largo y ojos rubí)' },
      { k: 'Postura', v: 'Esfinge relajada con patas traseras recogidas' },
      { k: 'Entorno', v: 'Suelo limpio con forraje a la sombra' }
    ],
    desc: 'Fotografía en 4K de Quesito recostado plácidamente sobre el césped protegido. Su postura serena y respiración tranquila evidencian la confianza y el buen cuidado que recibe en el liceo.',
    pedagogy: '💡 Permite analizar los signos clínicos de relajación en lagomorfos domésticos y la adaptación térmica de su denso pelaje.'
  },
  {
    id: 'convivencia-caricias-estudiantes-hd',
    isHD: true,
    category: 'fauna',
    title: 'Vínculo Escolar: Caricias a Nesquik y Forrajeo de Vainilla (HD)',
    subtitle: 'Interacción afectiva y bioética entre alumnos y animales',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC06965.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Potrero y Convivencia',
      icon: '🤝',
      link: 'index.html'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Acción', v: 'Mano de estudiante acariciando suavemente la coronilla de Nesquik' },
      { k: 'Compañero', v: 'Vainilla comiendo hojas frescas de choclo en total serenidad' },
      { k: 'Beneficio', v: 'Desarrollo de empatía, reducción del estrés escolar y respeto' }
    ],
    desc: 'Fotografía que capta el instante exacto en que una alumna acaricia con delicadeza al conejo Nesquik mientras Vainilla come a su lado. Refleja la atmósfera de paz y cariño de la granja escolar.',
    pedagogy: '💡 Evidencia empírica de cómo el contacto respetuoso con animales mejora el clima escolar y fomenta habilidades socioemocionales.'
  },
  {
    id: 'conejo-vainilla-forrajeo-hd',
    isHD: true,
    category: 'fauna',
    title: 'Conejo Vainilla: Forrajeo con Chalas de Choclo (HD)',
    subtitle: 'Primer plano de nutrición natural y pelaje dorado',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC06921.jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Escolares (Vainilla)',
      icon: '🐇',
      link: 'ficha.html?id=vainilla'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Ejemplar', v: 'Vainilla (Raza cabeza de león color canela/caramelo)' },
      { k: 'Alimento', v: 'Hojas verdes de maíz dulce frescas y fibrosas' },
      { k: 'Fisiología', v: 'Desgaste dental continuo de incisivos y motilidad cecal' }
    ],
    desc: 'Primer plano en alta resolución de Vainilla masticando chalas de maíz con entusiasmo. Su pelaje esponjoso y ojos atentos reflejan excelente nutrición y vitalidad.',
    pedagogy: '💡 Destaca la importancia de la fibra cruda en la salud digestiva de los lagomorfos y el aprovechamiento de hojas vegetales frescas de la cocina escolar.'
  },
  {
    id: 'gallinero-aves-corral-hd',
    isHD: true,
    category: 'fauna',
    title: 'Gallinero Escolar y Aves de Corral B-13 (4K UHD)',
    subtitle: 'Ecosistema de aves ponedoras y gallos protectores',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (5).jpg',
    gameRef: {
      type: 'map',
      label: 'Gallinero Principal',
      icon: '🐔',
      link: 'ficha.html?id=cleo'
    },
    specs: [
      { k: 'Resolución', v: 'Ultra Alta Definición 4K Oficial' },
      { k: 'Aves', v: 'Gallina Bantam / Cleo y gallos en su corral' },
      { k: 'Instalaciones', v: 'Suelo de tierra para baños de polvo, perchas de altura y nidos' },
      { k: 'Alimentación', v: 'Maíz partido, trigo, forraje verde y lombrices composteras' }
    ],
    desc: 'Fotografía en 4K que documenta la vida cotidiana en el gallinero de la granja del Liceo B-13. Se observan las aves alimentándose activamente en un entorno seguro y sombreado.',
    pedagogy: '💡 Enseña sobre la ecología del gallinero, el rascado instintivo del suelo para desparasitación y el aporte de abono orgánico al huerto.'
  },
  {
    id: 'pergola-flora-libre-pastoreo-hd',
    isHD: true,
    category: 'espacios',
    title: 'Pérgola Botánica & Rincón de Libre Pastoreo (HD)',
    subtitle: 'Bancas de descanso bajo enredaderas con gallito en libertad',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07027.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Zona Verde y Pérgola',
      icon: '🌿',
      link: 'index.html'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Mobiliario', v: 'Banca rústica de madera bajo pérgola natural trepadora' },
      { k: 'Biodiversidad', v: 'Geranios florecidos, arbustos nativos y macetas de arcilla' },
      { k: 'Fauna libre', v: 'Gallito sedoso japonés blanco explorando libremente la sombra' }
    ],
    desc: 'Espacio pedagógico al aire libre donde la vegetación exuberante crea un oasis de frescura. En la imagen se aprecia a uno de los gallitos recorriendo calmadamente los pies de la banca.',
    pedagogy: '💡 Demuestra el concepto de enriquecimiento botánico y bienestar de libre pastoreo, donde los animales pueden explorar la naturaleza escolar con total seguridad.'
  },
  {
    id: 'sendero-aviario-compostera-hd',
    isHD: true,
    category: 'espacios',
    title: 'Sendero Ecológico, Estación de Herramientas & Aviario (HD)',
    subtitle: 'Circuito de reciclaje con Sansevierias, pallets y compost',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07035.jpg',
    gameRef: {
      type: 'map',
      label: 'Almacén y Herramientas',
      icon: '🛠️',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Sendero', v: 'Pasarela de durmientes de madera noble frente a la voladera' },
      { k: 'Reciclaje', v: 'Canteros de Sansevierias (Lengua de suegra) en botellas plásticas' },
      { k: 'Operación', v: 'Cajón de compostaje con pallets, palas, rastrillos y mangueras' }
    ],
    desc: 'Vista panorámica de la zona de trabajo ecológico. Muestra la pasarela de madera, los canteros reciclados que adornan el frontis del aviario y el rincón ordenado de compostaje y herramientas.',
    pedagogy: '💡 Promueve las 3R (Reducir, Reutilizar, Reciclar) aplicadas al diseño de áreas verdes y bioética ambiental.'
  },
  {
    id: 'porton-lapices-mural-hd',
    isHD: true,
    category: 'espacios',
    title: 'Portón de los Lápices de Colores & Mural B-13 (HD)',
    subtitle: 'Acceso principal artístico e identidad comunitaria',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07037.jpg',
    gameRef: {
      type: 'map',
      label: 'Entrada Oficial de la Granja',
      icon: '🚪',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Resolución', v: 'Cámara Réflex HD Oficial Liceo B-13' },
      { k: 'Acceso', v: 'Portón de madera pintado simulando lápices de colores gigantes' },
      { k: 'Mural', v: '"Podemos Lograrlo" con insignia institucional y huellas de manos' },
      { k: 'Flora de entrada', v: 'Pérgola de parra, cantero de Aloe Vera y contenedor orgánico' }
    ],
    desc: 'El emblemático umbral de entrada a la Granja B-13. Con su portal de lápices multicolores y mural colectivo, recibe con calidez y alegría a estudiantes, profesores y visitas escolares.',
    pedagogy: '💡 Fortalece el sentido de pertenencia y el trabajo comunitario, vinculando las artes plásticas con el proyecto educativo medioambiental.'
  },

  // =========================================================================
  // 🌿 REGISTROS COMPLEMENTARIOS: FAUNA REAL, BOTÁNICA Y APRENDIZAJE VIVO
  // Retratos cercanos de animales, flora polinizadora y talleres ecológicos.
  // =========================================================================
  {
    id: 'patos-duo-criollo-real',
    category: 'fauna',
    title: 'Los Patos de la Granja: Dúo Criollo Sal y Pimienta',
    subtitle: 'Fotografía auténtica de los patos en su corral y zona de agua',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.02.jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.03.jpeg',
    gameRef: {
      type: 'map',
      label: 'Estanque de los Patos',
      icon: '🦆',
      link: 'ficha.html?id=sal'
    },
    specs: [
      { k: 'Ejemplares', v: 'Pato negro tornasolado y pato blanco con carúnculas rojas' },
      { k: 'Especie', v: 'Cairina moschata (Pato criollo / mudo)' },
      { k: 'Instalación', v: 'Caseta de madera rústica, césped y sector de agua limpia' },
      { k: 'Alimentación', v: 'Vegetales picados, granos enteros y suplementos sin pan procesado' }
    ],
    desc: 'Fotografía real y cercana de los patos de la Granja B-13. El ejemplar negro muestra el característico plumaje iridiscente verde esmeralda y ambos exhiben las carúnculas rojas faciales típicas de la especie.',
    pedagogy: '💡 Reemplaza representaciones gráficas con la biología real de las anátidas criollas, enseñando la termorregulación hidrofóbica y la prohibición del pan blanco en su dieta.'
  },
  {
    id: 'aviario-periquitos-mano-estudiantes',
    category: 'fauna',
    title: 'Confianza en el Aviario: Periquitos Comiendo en la Mano',
    subtitle: 'Interacción directa de estudiantes con catitas australianas',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.10 (3).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.10 (4).jpeg',
    gameRef: {
      type: 'map',
      label: 'Arboleda de Nidos (Catitas)',
      icon: '🦜',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Aves', v: 'Cuatro periquitos comiendo a la vez (verde, celeste, gris perla y blanco)' },
      { k: 'Especie', v: 'Melopsittacus undulatus (Periquito australiano / Catita)' },
      { k: 'Contacto', v: 'Posados en los dedos del alumno sin timidez ni sobresalto' },
      { k: 'Ambiente', v: 'Silencio y movimientos suaves que construyen confianza mutua' }
    ],
    desc: 'Fotografía inolvidable de las catitas del liceo comiendo granos directamente en la mano de una alumna. Esta imagen refleja el fruto de meses de cariño, respeto y educación libre de estrés en el aviario.',
    pedagogy: '💡 Desarrolla el autocontrol motor y la autorregulación emocional en los alumnos para lograr la confianza voluntaria de aves sensibles.'
  },
  {
    id: 'aviario-comunidad-agapornis',
    category: 'fauna',
    title: 'Comunidad de Agapornis: Belleza y Vínculo Social',
    subtitle: 'Bandada multicolor de inseparables en el aviario escolar',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.11 (2).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.06 (2).jpeg',
    gameRef: {
      type: 'map',
      label: 'Aviario de Aves Menores',
      icon: '🦜',
      link: 'ficha.html?id=los_manguitos'
    },
    specs: [
      { k: 'Bandada', v: 'Siete agapornis de variedades ancestral verde, amarilla lutina y pastel' },
      { k: 'Especie', v: 'Agapornis roseicollis (Aves inseparables africanas)' },
      { k: 'Percha', v: 'Travesaño de madera junto a bebedero automático de dosificación lenta' },
      { k: 'Convivencia', v: 'Monogamia duradera, llamados vocales en coro y aseo cooperativo' }
    ],
    desc: 'Fotografía que muestra una hilera armónica de agapornis posados juntos en el aviario bajo un techo de cañizo. Sus plumajes intensos contrastan con la madera cálida del recinto.',
    pedagogy: '💡 Enseña a identificar las mutaciones de plumaje en psitácidos y la importancia de proporcionar bebederos limpios y desinfectados periódicamente.'
  },
  {
    id: 'cotorra-argentina-aviario',
    category: 'fauna',
    title: 'Cotorra Argentina en el Aviario Escolar',
    subtitle: 'Myiopsitta monachus observando desde las vigas altas de la voladera',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.11 (1).jpeg',
    gameRef: {
      type: 'map',
      label: 'Aviario Escolar',
      icon: '🦜',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Especie', v: 'Myiopsitta monachus (Cotorra argentina / cotorra monje)' },
      { k: 'Rasgos', v: 'Frente y pecho grisáceo, cuerpo verde esmeralda y alas azuladas' },
      { k: 'Instalación', v: 'Vigas superiores y troncos secos para enriquecimiento locomotor' },
      { k: 'Compañeras', v: 'Catitas australianas visibles en las secciones laterales' }
    ],
    desc: 'Fotografía en el aviario donde la cotorra de la granja posa vigilante sobre un madero transversal. Se aprecia su capacidad prensil y el diseño espacioso de la jaula voladera.',
    pedagogy: '💡 Permite analizar la biología de los nidos comunales de las cotorras y su adaptación climática a la costa del norte grande.'
  },
  {
    id: 'maternidad-gallina-clueca-pollito',
    category: 'nidos',
    title: 'Maternidad Aviar: Gallina Clueca Protegiendo a su Pollito',
    subtitle: 'Instinto maternal y nacimiento de nueva vida en el gallinero',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.13 (2).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (12).jpeg',
    gameRef: {
      type: 'map',
      label: 'Huevos y Nidos en el Mapa',
      icon: '🐣',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Madre', v: 'Gallina Bantam negra de plumaje azabache y patas emplumadas' },
      { k: 'Cría', v: 'Pollito rayado recién eclosionado abrigado entre las plumas' },
      { k: 'Conducta', v: 'Celo maternal protector, calor constante y llamado cloc-cloc' },
      { k: 'Nido', v: 'Rincón resguardado con sustrato seco y comedero de iniciación' }
    ],
    desc: 'Conmovedora fotografía de la granja que documenta el nacimiento de un pollito junto a su madre. La gallina se posa sobre él para mantener los 37°C vitales requeridos en sus primeros días de vida.',
    pedagogy: '💡 Aprendizaje vivencial del ciclo ontogenético de las aves: desarrollo embrionario, eclosión y cuidado parental activo sin incubadoras artificiales.'
  },
  {
    id: 'pollito-en-manos-crianza',
    category: 'nidos',
    title: 'Crianza y Ternura: Pollito Descansando en Manos de Alumnas',
    subtitle: 'Sensibilización y educación en el valor sagrado de la vida',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (14).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.10.jpeg',
    gameRef: {
      type: 'map',
      label: 'Nidos y Crianza del Corral',
      icon: '🐥',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Ejemplar', v: 'Pollito recién nacido de plumón dorado con antifaz marrón' },
      { k: 'Sujeción', v: 'Palma cóncava sin presión que brinda calor suave y contención' },
      { k: 'Reacción', v: 'El pollito cierra sus ojos en sueño plácido y seguro' },
      { k: 'Norma', v: 'Lavado riguroso de manos antes y después de la interacción' }
    ],
    desc: 'Fotografía en primer plano de un pollito descansando profundamente en la mano de una alumna del liceo. La serenidad del ave refleja el ambiente de afecto y calma que reina en la granja.',
    pedagogy: '💡 Estimula la empatía con animales frágiles y enseña protocolos de bioseguridad higiénica básicos en granjas pedagógicas.'
  },
  {
    id: 'conejo-tasmi-curiosidad',
    category: 'fauna',
    title: 'Conejo Tasmi: Curiosidad y Energía en Dos Patitas',
    subtitle: 'Comportamiento explorador en el corral de conejos',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.03 (2).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.06.jpeg',
    gameRef: {
      type: 'map',
      label: 'Corral de Conejos (Tasmi)',
      icon: '🐇',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Ejemplar', v: 'Tasmi (Conejo jaspeado gris perla y blanco, pelo esponjoso)' },
      { k: 'Postura', v: 'Bípeda de alerta curiosa apoyado en patitas traseras' },
      { k: 'Carácter', v: 'Activo, juguetón y siempre atento a las voces de los alumnos' },
      { k: 'Espacio', v: 'Corral con césped sintético lavable y banquetas escolares' }
    ],
    desc: 'Fotografía espontánea de Tasmi parándose en dos patitas al ver acercarse a los estudiantes. Su mirada pícara y orejas erguidas muestran el dinamismo y alegría que aporta a la conejera.',
    pedagogy: '💡 Explica la conducta de vigilancia lagomorfa (periscopio) y la estimulación motriz mediante desniveles en el corral.'
  },
  {
    id: 'conejo-nesquik-camastro-heno',
    category: 'fauna',
    title: 'Conejo Nesquik en su Camastro de Heno Fresco',
    subtitle: 'Madriguera protegida y hábitos de descanso',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (17).jpeg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Escolares (Nesquik)',
      icon: '🐰',
      link: 'ficha.html?id=nesquik'
    },
    specs: [
      { k: 'Ejemplar', v: 'Nesquik (Conejo negro azabache de pelo corto lustroso)' },
      { k: 'Cama', v: 'Capa gruesa de paja de trigo seca y heno aromático limpio' },
      { k: 'Refugio', v: 'Zona techada con aislamiento térmico contra viento costero' },
      { k: 'Hábito', v: 'Descanso diurno sereno con picos de actividad al atardecer' }
    ],
    desc: 'Fotografía de Nesquik reposando plácidamente en su cama de heno seco en la conejera techada. El lecho limpio garantiza aislamiento higiénico y confort articular.',
    pedagogy: '💡 Enseña la importancia de sustratos orgánicos secos para prevenir la pododermatitis en conejos y facilitar el compostaje posterior.'
  },
  {
    id: 'mural-mensajes-positivos-jardineria',
    category: 'espacios',
    title: 'Mural de Mensajes Positivos & Jardinería Vertical',
    subtitle: 'Espacio reflexivo y colección botánica de suculentas',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.03 (1).jpeg',
    gameRef: {
      type: 'map',
      label: 'Mural y Pizarra Ecológica',
      icon: '📝',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Mural', v: 'Pizarra comunitaria con mensajes ecológicos escritos por estudiantes' },
      { k: 'Botánica', v: 'Sedum morganianum (Cola de burro colgante), echeverias y cactus' },
      { k: 'Arte', v: 'Bordura de piedras de río pintadas con motivos de la naturaleza' },
      { k: 'Mensaje', v: '\"Nuestro trabajo no sería nada sin personas como ustedes... verdaderos agentes de cambio\"' }
    ],
    desc: 'Rincón de la granja que combina el arte y la reflexión ética escolar con una colección de plantas crasas y suculentas colgantes adaptadas a la radiación solar de Antofagasta.',
    pedagogy: '💡 Integra la educación socioemocional y la expresión escrita con el cultivo de especies xerófitas de bajo consumo de agua.'
  },
  {
    id: 'mesa-redonda-vivero-propagacion',
    category: 'huerto',
    title: 'Mesa de Propagación Botánica & Vivero de Flores',
    subtitle: 'Estación de esquejes, Poinsettias y plantas medicinales',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.04 (2).jpeg',
    gameRef: {
      type: 'map',
      label: 'Zona de Plantas y Vivero',
      icon: '🌸',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Estructura', v: 'Mesa circular reciclada a partir de carrete de bobina industrial' },
      { k: 'Flora', v: 'Poinsettias (Flores de Pascua rojas y durazno), geranios y ruda' },
      { k: 'Macetas', v: 'Envases plásticos reutilizados con orificios de drenaje óptimo' },
      { k: 'Técnica', v: 'Multiplicación vegetativa por esquejes y acodos en sustrato orgánico' }
    ],
    desc: 'Fotografía de la mesa circular de jardinería donde los estudiantes realizan trasplantes, poda de esquejes y cuidados botánicos. Muestra la gran variedad de plantas en desarrollo activo.',
    pedagogy: '💡 Enseña la propagación asexual de plantas superiores y la reutilización de elementos industriales para la agricultura urbana escolar.'
  },
  {
    id: 'cultivo-tomates-cherry-maceta',
    category: 'huerto',
    title: 'Cultivo de Tomates Cherry Amarillos y Rojos en Macetas',
    subtitle: 'Agricultura urbana y producción de frutos en espacios escolares',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (5).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (16).jpeg',
    gameRef: {
      type: 'map',
      label: 'Cultivo de Frutos y Hortalizas',
      icon: '🍅',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Variedades', v: 'Solanum lycopersicum (Tomates perita amarillos y cherrys rojos maduros)' },
      { k: 'Soporte', v: 'Tutores de caña natural para sostener las ramas con peso de frutos' },
      { k: 'Suelo', v: 'Tierra abonada con humus de lombriz producido en la granja' },
      { k: 'Cosecha', v: 'Frutos sanos sin pesticidas químicos, cultivados por los alumnos' }
    ],
    desc: 'Fotografía en primer plano de tomates cherry madurando en ramas robustas dentro del huerto escolar. Demuestra que con suelo fértil y cuidado diario es posible cosechar alimentos frescos en la ciudad.',
    pedagogy: '💡 Aborda el ciclo reproductivo vegetal, la maduración por etileno y la importancia de la soberanía alimentaria escolar (ODS 2 Hambre Cero).'
  },
  {
    id: 'cultivo-algodon-fibras-naturales',
    category: 'huerto',
    title: 'Cultivo de Algodón y Fibras Vegetales Educativas',
    subtitle: 'Capullos maduros de algodón natural en el huerto escolar',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.13 (1).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (3).jpeg',
    gameRef: {
      type: 'map',
      label: 'Sector de Siembra y Botánica',
      icon: '🌱',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Planta', v: 'Gossypium hirsutum (Planta de algodón)' },
      { k: 'Capullo', v: 'Cápsula dehiscente madura liberando fibras de celulosa blanca pura' },
      { k: 'Condición', v: 'Excelente resistencia al calor diurno y radiación nortina' },
      { k: 'Pedagogía', v: 'Permite ver y tocar el origen vegetal de la ropa que vestimos' }
    ],
    desc: 'Fotografía macro de un copo de algodón abriéndose en una de las plantas del huerto del liceo. Es una pieza botánica viva sumamente valiosa para que los alumnos descubran el origen botánico textil.',
    pedagogy: '💡 Conecta la botánica agrícola con la historia humana de las fibras naturales y el consumo sustentable frente al poliéster sintético.'
  },
  {
    id: 'jardin-polinizadores-flores',
    category: 'huerto',
    title: 'Jardín Floral de Polinizadores: Cardenales, Gazanias y Margaritas',
    subtitle: 'Santuario floral para abejas, mariposas y biodiversidad urbana',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (21).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.13.jpeg',
    gameRef: {
      type: 'map',
      label: 'Sector Floral en el Mapa',
      icon: '🌺',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Especies', v: 'Pelargonium (Cardenal fucsia), Gazanias bicolores, Osteospermum blanco' },
      { k: 'Función', v: 'Atracción continua de insectos polinizadores (abejas, mariposas, abejorros)' },
      { k: 'Riego', v: 'Eficiencia hídrica con acolchado orgánico que retiene humedad' },
      { k: 'Impacto', v: 'Asegura la fructificación de las hortalizas del huerto vecino' }
    ],
    desc: 'Fotografía de los macizos florales en plena eclosión en la granja. Los colores vivos y el néctar dulce transforman este espacio escolar en un imán biológico para polinizadores autóctonos.',
    pedagogy: '💡 Demuestra el servicio ecosistémico indispensable de la polinización cruzada y la protección activa de la entomofauna en ciudades costeras.'
  },
  {
    id: 'sedosos-japoneses-morfologia-alumnos',
    category: 'fauna',
    title: 'Gallitos Sedosos Japoneses: Morfología y Manejo Afectivo',
    subtitle: 'Estudiantes aprendiendo sobre anatomía aviar y docilidad',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.12 (8).jpeg',
    extraPhoto: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.04 (4).jpeg',
    gameRef: {
      type: 'potrero',
      label: 'Gallitos en el Potrero',
      icon: '🐔',
      link: 'index.html'
    },
    specs: [
      { k: 'Ave', v: 'Gallito Sedoso Japonés (Silkie) sostenido con ternura en brazos' },
      { k: 'Rasgos únicos', v: 'Lóbulos auriculares turquesa, piel oscura y plumaje plumoso' },
      { k: 'Patas', v: 'Cinco dedos emplumados (polidactilia genética característica)' },
      { k: 'Manejo', v: 'Trato sereno que genera un apego extraordinario con los alumnos' }
    ],
    desc: 'Fotografía en primer plano de una alumna sosteniendo a uno de los gallitos sedosos durante una visita guiada. Se aprecian sus particulares orejillas turquesas y su dócil temperamento.',
    pedagogy: '💡 Explica mutaciones genéticas ancestrales en aves domésticas y derriba prejuicios sobre la supuesta agresividad de los gallos mediante crianza positiva.'
  },
  {
    id: 'gallinita-blanca-visita-escolar',
    category: 'fauna',
    title: 'Aves Jóvenes del Corral: Docilidad y Cuidado Responsable',
    subtitle: 'Gallinita blanca sostenida en brazos durante jornada de campo',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.04 (1).jpeg',
    gameRef: {
      type: 'map',
      label: 'Gallinero Protegido',
      icon: '🐔',
      link: 'ficha.html?id=cleo'
    },
    specs: [
      { k: 'Ejemplar', v: 'Gallinita joven blanca de cresta naciente y pico claro' },
      { k: 'Técnica', v: 'Sujeción correcta por debajo del cuerpo que aporta seguridad y apoyo' },
      { k: 'Conducta', v: 'Mirada atenta sin intentos de escape ni aleteos bruscos' },
      { k: 'Salud', v: 'Revisión periódica de plumas, peso y alimentación natural' }
    ],
    desc: 'Fotografía de una estudiante cargando calmadamente a una joven gallinita blanca en el patio de la granja. Refleja la práctica real de las normas de bienestar animal impartidas en las aulas.',
    pedagogy: '💡 Capacita a los alumnos en el examen físico y manipulación segura de aves sin causar estrés ni dolor.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REAL_GALLERY_ITEMS };
}
