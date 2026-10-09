/*
  real-gallery-data.js — Datos estructurados del recorrido fotográfico real
  de la Granja del Liceo Domingo Herrera Rivera B-13 y su correspondencia interactiva con el juego.
  Todas las fotografías provienen directamente de la colección oficial 'Imagenes Granja Real B13'.
  El trío de conejos se presenta como primera imagen oficial de bienvenida, seguido por los espacios
  e instalaciones, fauna y rincones botánicos con explicaciones biológicas claras y pedagógicas.
*/

const REAL_GALLERY_ITEMS = [
  // =========================================================================
  // 📸 FOTOGRAFÍAS OFICIALES DESTACADAS DE LA GRANJA B-13
  // =========================================================================
  {
    id: 'conejos-trio-conejera-hd',
    isHD: true,
    category: 'fauna',
    title: 'Trío de Conejos en la Conejera Escolar',
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
      { k: 'Especie', v: 'Conejos domésticos (Oryctolagus cuniculus)' },
      { k: 'Amigos', v: 'Quesito (blanco), Vainilla (caramelo) y Nesquik (negro)' },
      { k: 'Hogar', v: 'Conejeras amplias con madrigueras y sombra protegida' },
      { k: 'Alimentación', v: 'Heno seco para sus dientes, hojas verdes de huerto y agua limpia' }
    ],
    desc: 'Aquí vemos a Quesito, Vainilla y Nesquik compartiendo juntos en la conejera. Los conejos son animales muy sociables que viven en grupos organizados. Les encanta acicalarse entre ellos y descansar bien pegaditos para sentirse seguros y darse calor. Si te fijas bien, siempre tienen sus orejitas atentas a cualquier sonido del colegio.',
    pedagogy: '💡 Como profesor de biología te cuento un secreto: los conejos son animales de presa en la naturaleza, por eso son asustadizos por instinto. Que aquí se muestren tan tranquilos y curiosos demuestra la enorme confianza y cariño que les entregan los estudiantes que los cuidan día a día.'
  },
  {
    id: 'pozo-huerto-hd',
    isHD: true,
    category: 'espacios',
    title: 'El Pozo Rústico y Plaza Central de la Granja',
    subtitle: 'Corazón verde y punto de encuentro de la granja escolar',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07025.jpg',
    gameRef: {
      type: 'map',
      label: 'Pozo de Agua Histórico',
      icon: '🪣',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Ubicación', v: 'Plaza central y corazón de la granja escolar' },
      { k: 'Construcción', v: 'Madera tradicional con polea y cubierta protectora' },
      { k: 'Función', v: 'Punto de riego y frescura para los animales y huertos' },
      { k: 'Entorno', v: 'Jardineras de piedras de río, enredaderas y sombra natural' }
    ],
    desc: 'El pozo tradicional es el punto de encuentro de toda la granja. A su alrededor convergen los caminos hacia los corrales de los animales y las zonas de cultivo. Gracias a la sombra de los árboles y enredaderas, en este lugar se crea un microclima fresco y agradable, ideal para descansar y protegerse del calor.',
    pedagogy: '💡 En una ciudad desértica como Antofagasta, cada gota de agua es un tesoro biológico. Las plantas que rodean el pozo ayudan a mantener la humedad en el suelo y bajan la temperatura ambiente, demostrando cómo la vegetación protege la vida animal en climas secos.'
  },
  {
    id: 'matias-vicente-primer-plano-hd',
    isHD: true,
    category: 'fauna',
    title: 'Matías y Vicente: Gallitos Sedosos Japoneses',
    subtitle: 'Dúo ornamental de plumaje suave como el algodón',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (6).jpg',
    extraPhoto: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07014.jpg',
    gameRef: {
      type: 'map',
      label: 'Nidos y Gallinero Ornamental',
      icon: '🐓',
      link: 'ficha.html?id=matias'
    },
    specs: [
      { k: 'Raza', v: 'Gallos Sedosos Japoneses (Silkie Chabo)' },
      { k: 'Plumaje', v: 'Plumas sin barbicelas rígidas, suaves al tacto como pompón' },
      { k: 'Curiosidad', v: 'Cresta carnosa carmesí y cinco dedos en cada pata' },
      { k: 'Carácter', v: 'Totalmente mansos, tranquilos y muy apegados el uno al otro' }
    ],
    desc: 'Matías y Vicente son los dos gallitos más consentidos del liceo. Sus plumas son tan finas y suaves que no parecen plumas de ave normal, sino motas de algodón o pelaje de mamífero. Aunque ambos son machos, crecieron juntos desde pequeños y no pelean: comparten el comedero, se protegen mutuamente y se dejan tomar en brazos con total tranquilidad.',
    pedagogy: '💡 En biología animal esto se llama mutación genética: sus plumas carecen de los ganchitos microscópicos que unen las plumas comunes, lo que les impide volar pero los hace lucir esponjosos. Además, su convivencia pacífica nos enseña que el comportamiento animal se moldea con cariño y un espacio sin estrés.'
  },
  {
    id: 'pastelito-agapornis-estrella-hd',
    isHD: true,
    category: 'fauna',
    title: 'Pastelito: Agapornis Estrella del Aviario',
    subtitle: 'El agapornis más fotogénico y sociable del liceo',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (1).jpg',
    gameRef: {
      type: 'map',
      label: 'Aviario de Aves Menores',
      icon: '🦜',
      link: 'ficha.html?id=pastelito'
    },
    specs: [
      { k: 'Especie', v: 'Agapornis roseicollis (Inseparable)' },
      { k: 'Colores', v: 'Carita naranja melocotón, cuerpo verde y pico de marfil' },
      { k: 'Habilidad', v: 'Pico fuerte que usa como tercera pata para trepar' },
      { k: 'Personalidad', v: 'Curioso, alegre y cantor frente a las visitas' }
    ],
    desc: 'Pastelito es la verdadera estrella del aviario escolar. Es un pequeño loro inseparable que se acerca volando apenas escucha que llegan alumnos o visitas al colegio. Usa su pico curvo no solo para partir semillas duras, sino también como una verdadera tercera pata que le permite trepar con gran agilidad por las ramas y mallas.',
    pedagogy: '💡 Fíjate en sus patitas: tienen dos dedos hacia adelante y dos hacia atrás (patas zigodáctilas). Esta adaptación evolutiva les da un agarre firme como pinzas para sostener frutos y ramas mientras cantan y hacen piruetas aéreas.'
  },
  {
    id: 'los-manguitos-trio-rama-hd',
    isHD: true,
    category: 'fauna',
    title: 'Los Manguitos: Clan de Agapornis en Percha Natural',
    subtitle: 'Trío de inseparables en su rama favorita del aviario',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (7).jpg',
    gameRef: {
      type: 'map',
      label: 'Aviario Escolar B-13',
      icon: '🦜',
      link: 'ficha.html?id=los_manguitos'
    },
    specs: [
      { k: 'Grupo', v: 'Trío inseparable de agapornis' },
      { k: 'Plumaje', v: 'Verde lima, amarillo mango y toques coral' },
      { k: 'Comportamiento', v: 'Se acicalan las plumas mutuamente (allopreening)' },
      { k: 'Vínculo', v: 'Vuelan y duermen siempre juntos en la misma percha' }
    ],
    desc: 'Bautizados como "Los Manguitos" por sus vivos colores de fruta madura, estos tres agapornis son inseparables de verdad. Pasan el día alineados en la misma rama, peinándose las plumas unos a otros con el pico. Si uno vuela a un extremo de la voladera, los otros dos lo siguen de inmediato cantando al unísono.',
    pedagogy: '💡 En la naturaleza, el acicalamiento mutuo fortalece los lazos del grupo y ayuda a limpiar las plumas de la cabeza, donde el ave no alcanza sola. En el liceo aprendemos que los loros son aves sumamente inteligentes que necesitan compañía y afecto para no sentirse tristes.'
  },
  {
    id: 'quesito-descanso-pasto-hd',
    isHD: true,
    category: 'fauna',
    title: 'Conejo Quesito: Descanso a la Sombra',
    subtitle: 'Un momento de paz y siesta sobre el césped protegido',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (4).jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Oficiales',
      icon: '🐇',
      link: 'ficha.html?id=quesito'
    },
    specs: [
      { k: 'Conejo', v: 'Quesito (pelaje blanco puro y ojos rojizos rubí)' },
      { k: 'Postura', v: 'Tumbado con patitas recogidas (señal de calma total)' },
      { k: 'Sentidos', v: 'Nariz móvil olfateando el aire constantemente' },
      { k: 'Cuidado', v: 'Suelo limpio, sombra fresca y heno a libre disposición' }
    ],
    desc: 'Quesito es un conejo albino de pelaje blanco como la nieve. Aquí lo vemos en su postura favorita: recostado relajado a la sombra después de comer. Cuando un conejo estira su cuerpo y baja las orejas, los biólogos sabemos que se siente 100% seguro en su entorno y sabe que nadie le hará daño.',
    pedagogy: '💡 ¿Sabías que los ojos rubí de los conejos albinos no tienen pigmento de color? Lo que vemos es el reflejo de sus vasitos sanguíneos. Por eso tienen la vista un poco más sensible a la luz directa del sol y agradecen mucho los rincones con sombra que les preparamos en el colegio.'
  },
  {
    id: 'convivencia-caricias-estudiantes-hd',
    isHD: true,
    category: 'fauna',
    title: 'Vínculo Escolar: Caricias a Nesquik y Forrajeo de Vainilla',
    subtitle: 'Respeto, calma y cariño entre estudiantes y conejos',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC06965.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Potrero y Convivencia',
      icon: '🤝',
      link: 'index.html'
    },
    specs: [
      { k: 'Protagonistas', v: 'Alumna del liceo acariciando a Nesquik junto a Vainilla' },
      { k: 'Técnica correcta', v: 'Acariciar suavemente en la frente y lomo, sin ruidos fuertes' },
      { k: 'Alimento', v: 'Hojas frescas de choclo ricas en fibra natural' },
      { k: 'Efecto', v: 'Calma el estrés escolar y enseña empatía real hacia los seres vivos' }
    ],
    desc: 'En esta foto se resume la magia de la Granja B-13: una alumna acaricia la frente de Nesquik con suavidad mientras Vainilla disfruta sus hojas de choclo. Los animales no se asustan ni huyen porque saben que las manos de los estudiantes solo traen mimos, alimento y respeto.',
    pedagogy: '💡 Los estudios de biología y psicología demuestran que compartir con animales disminuye el ritmo cardíaco y alivia la ansiedad de las pruebas. Acariciar a un conejo de forma respetuosa nos enseña a ser más empáticos y pacientes con todos los seres que nos rodean.'
  },
  {
    id: 'conejo-vainilla-forrajeo-hd',
    isHD: true,
    category: 'fauna',
    title: 'Conejo Vainilla: Comiendo Chalas de Choclo',
    subtitle: 'Pelaje dorado y apetito saludable con forraje fresco',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC06921.jpg',
    gameRef: {
      type: 'map',
      label: 'Conejeras Escolares (Vainilla)',
      icon: '🐇',
      link: 'ficha.html?id=vainilla'
    },
    specs: [
      { k: 'Conejo', v: 'Vainilla (raza cabeza de león color canela dorado)' },
      { k: 'Alimento favorito', v: 'Chalas verdes de choclo bien lavadas y crujientes' },
      { k: 'Salud dental', v: 'Masticar fibra dura gasta sus dientes delanteros' },
      { k: 'Digestión', v: 'Fibra vegetal indispensable para que su estómago funcione bien' }
    ],
    desc: 'Aquí vemos a Vainilla saboreando una hoja de choclo. A los conejos les fascina masticar forraje verde, y además es fundamental para su salud: a diferencia de nosotros, sus dientes nunca paran de crecer a lo largo de toda su vida. Masticar fibras duras como heno y chalas los mantiene en el tamaño perfecto.',
    pedagogy: '💡 En el sistema digestivo de los conejos, la fibra es el motor que mantiene en movimiento su intestino. Por eso en la granja les damos heno fresco a diario y aprovechamos las chalas de choclo que sobran, transformando restos vegetales en nutrición sana.'
  },
  {
    id: 'gallinero-aves-corral-hd',
    isHD: true,
    category: 'fauna',
    title: 'Gallinero Escolar y Aves de Corral B-13',
    subtitle: 'Un hogar seguro para gallinas, gallos y pollitos',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/1 (5).jpg',
    gameRef: {
      type: 'map',
      label: 'Gallinero Principal',
      icon: '🐔',
      link: 'ficha.html?id=cleo'
    },
    specs: [
      { k: 'Habitantes', v: 'Gallinas ponedoras, gallitos ornamentales y polluelos' },
      { k: 'Instalaciones', v: 'Perchas para dormir alto, nidos cómodos y sombra protegida' },
      { k: 'Costumbres', v: 'Escarbar la tierra y darse baños de polvo seco' },
      { k: 'Dieta', v: 'Granos mixtos, hojas verdes de huerto y lombrices' }
    ],
    desc: 'El gallinero del liceo está pensado para que las aves vivan como en la naturaleza: tienen tierra seca para escarbar con sus patas, perchas de madera a distintas alturas para dormir protegidas de noche y nidos acolchados con paja donde las gallinas pueden poner sus huevos con total privacidad.',
    pedagogy: '💡 ¿Sabías que las gallinas se bañan en tierra seca? No usan agua: frotan su plumaje contra la tierra para quitarse parásitos y regular el aceite de sus plumas. Además, sus restos fertilizan la tierra del huerto escolar, cerrando un ciclo natural perfecto.'
  },
  {
    id: 'pergola-flora-libre-pastoreo-hd',
    isHD: true,
    category: 'espacios',
    title: 'Pérgola Botánica y Rincón de Libre Pastoreo',
    subtitle: 'Sombra de enredaderas y paseo libre de los gallitos',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07027.jpg',
    gameRef: {
      type: 'potrero',
      label: 'Zona Verde y Pérgola',
      icon: '🌿',
      link: 'index.html'
    },
    specs: [
      { k: 'Vegetación', v: 'Geranios en flor, parras trepadoras y arbustos nativos' },
      { k: 'Espacio', v: 'Bancas de madera para lectura y observación de la naturaleza' },
      { k: 'Visitante especial', v: 'Gallito explorando tranquilamente bajo la sombra' },
      { k: 'Microclima', v: 'Humedad y frescor que amortiguan el calor de la tarde' }
    ],
    desc: 'Bajo esta pérgola verde, los gallitos pueden salir a pasear libremente entre las flores y la sombra. Es un rincón donde los estudiantes se sientan a leer o conversar mientras los animales caminan curiosos cerca de sus pies, buscando pequeñas ramitas o semillas en el suelo.',
    pedagogy: '💡 Permitir que las aves caminen en libertad en espacios protegidos se llama libre pastoreo. Esto estimula su curiosidad, ejercita sus músculos y reduce el aburrimiento, garantizando animales felices y activos.'
  },
  {
    id: 'sendero-aviario-compostera-hd',
    isHD: true,
    category: 'espacios',
    title: 'Sendero Ecológico, Estación de Herramientas y Aviario',
    subtitle: 'Caminos de madera, reciclaje creativo y abono orgánico',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07035.jpg',
    gameRef: {
      type: 'map',
      label: 'Almacén y Herramientas',
      icon: '🛠️',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Sendero', v: 'Pasarela rústica de maderas frente a las voladeras de aves' },
      { k: 'Jardineras', v: 'Plantas resistentes sembradas en botellas recicladas' },
      { k: 'Compostaje', v: 'Cajón de pallets donde los desechos orgánicos se hacen abono' },
      { k: 'Herramientas', v: 'Palas, rastrillos y regaderas ordenadas para el trabajo escolar' }
    ],
    desc: 'Este sendero conecta el aviario con la zona de compostaje del liceo. Todo lo que ves aquí fue construido con materiales reutilizados: pallets de madera convertidos en composteras y botellas plásticas transformadas en maceteros colgantes para plantas que purifican el aire.',
    pedagogy: '💡 En ecología nada se pierde: las cáscaras de fruta de las colaciones y el heno viejo se transforman en abono rico en nutrientes gracias a lombrices y microorganismos. ¡Así los estudiantes aprenden economía circular en vivo!'
  },
  {
    id: 'porton-lapices-mural-hd',
    isHD: true,
    category: 'espacios',
    title: 'Portón de los Lápices de Colores y Mural Escolar',
    subtitle: 'La alegre bienvenida a la granja del Liceo B-13',
    photo: 'assets/Imagenes Granja Real B13/OneDrive_1_8-10-2026/DSC07037.jpg',
    gameRef: {
      type: 'map',
      label: 'Entrada Oficial de la Granja',
      icon: '🚪',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Entrada', v: 'Portón artesanal decorado como lápices gigantes de colores' },
      { k: 'Mural', v: '"Podemos Lograrlo", pintado con huellas y manos de alumnos' },
      { k: 'Entorno', v: 'Pérgola con parras verdes y plantas de Aloe vera' },
      { k: 'Mensaje', v: 'Aprender ciencias cuidando y respetando la vida' }
    ],
    desc: 'El portón de lápices gigantes de colores es la puerta de entrada a este rincón verde. Fue diseñado por los propios estudiantes y docentes para recordar que la granja es una sala de clases viva al aire libre, donde cada rincón enseña sobre respeto, naturaleza y trabajo en equipo.',
    pedagogy: '💡 Cruzar este portón significa cambiar la pantalla por la tierra húmeda, el canto de las aves y el contacto directo con los seres vivos. Es educación ambiental aplicada al corazón de los estudiantes.'
  },

  // =========================================================================
  // 🌿 REGISTROS DE FAUNA REAL, BOTÁNICA Y APRENDIZAJE VIVO
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
      { k: 'Amigos', v: 'Pimienta (plumaje tornasolado) y Sal (blanco)' },
      { k: 'Especie', v: 'Pato criollo (Cairina moschata)' },
      { k: 'Instalaciones', v: 'Caseta rústica, césped y tinaja con agua fresca' },
      { k: 'Alimentación', v: 'Verduras picadas, granos y agua (prohibido pan blanco)' }
    ],
    desc: 'Sal y Pimienta son los dos patos residentes de la granja. Si miras de cerca a Pimienta cuando le da el sol, sus plumas negras brillan con destellos verdes y violetas como una esmeralda. Alrededor de sus ojos y pico tienen una piel rojiza llamada carúncula, muy típica y natural en esta especie de patos.',
    pedagogy: '💡 ¡Dato biológico clave! Los patos tienen una glándula aceitosa cerca de la cola llamada uropígea. Con el pico esparcen ese aceite por sus plumas para volverse impermeables al agua. Y una regla de oro en el liceo: nunca darles pan blanco, porque daña sus alas y su digestión.'
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
      { k: 'Aves', v: 'Catitas australianas de tonos verdes, celestes y amarillos' },
      { k: 'Especie', v: 'Periquito australiano (Melopsittacus undulatus)' },
      { k: 'Interacción', v: 'Comiendo semillas directamente de la palma de la mano' },
      { k: 'Clave', v: 'Movimientos lentos y voz baja para no asustarlas' }
    ],
    desc: 'Lograr que un ave pequeña se pose en tu mano requiere paciencia y respeto. Las catitas son muy observadoras: si entras al aviario despacio, sin gritar y con granos en la palma abierta, ellas mismas se acercan curiosas a comer. Esta foto muestra el premio a semanas de cariño y cuidado constante de los alumnos.',
    pedagogy: '💡 En etología (ciencia que estudia el comportamiento animal), la confianza no se impone: se gana. Los estudiantes aprenden a respirar hondo y controlar sus movimientos, comprendiendo que un animal pequeño necesita sentirse seguro para interactuar.'
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
      { k: 'Bandada', v: 'Siete agapornis de variedades verde, amarilla y pastel' },
      { k: 'Especie', v: 'Agapornis roseicollis (Inseparables africanos)' },
      { k: 'Percha', v: 'Travesaño de madera junto a bebedero de dosificación limpia' },
      { k: 'Convivencia', v: 'Monogamia de por vida, llamados en coro y aseo cooperativo' }
    ],
    desc: 'En esta percha descansa un grupo de agapornis de distintos colores. Los inseparables son aves profundamente comunitarias: conversan con silbidos alegres todo el día, comen juntos y eligen una pareja para toda la vida. Por eso en la granja nunca los tenemos solos, siempre en pareja o en pequeñas bandadas familiares.',
    pedagogy: '💡 Estas aves son nativas de las sabanas de África. Aunque en la naturaleza suelen ser verdes para camuflarse entre las hojas, con los años han surgido variedades amarillas y azuladas. En el liceo cuidamos que siempre tengan agua limpia para beber y bañarse.'
  },
  {
    id: 'cotorra-argentina-aviario',
    category: 'fauna',
    title: 'Cotorra Argentina en el Aviario Escolar',
    subtitle: 'Curiosidad y agilidad desde las vigas altas de la voladera',
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
      { k: 'Instalación', v: 'Vigas superiores y troncos secos para trepar y ejercitarse' },
      { k: 'Compañeras', v: 'Catitas australianas en las secciones laterales del aviario' }
    ],
    desc: 'Desde lo alto de una de las vigas del aviario, la cotorra argentina observa todo lo que pasa en la granja con ojos curiosos. Tiene plumas verde brillante y un pecho grisáceo muy elegante. Son aves muy listas que aprenden a imitar sonidos y reconocen a los alumnos que las alimentan a diario.',
    pedagogy: '💡 En estado silvestre, las cotorras son famosas por tejer nidos comunales gigantescos con ramas secas, como verdaderos "edificios" donde viven varias familias. En el aviario les colocamos ramas naturales para que ejerciten su pico y sus patas.'
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
      { k: 'Cría', v: 'Pollito rayado recién nacido abrigado entre las plumas' },
      { k: 'Conducta', v: 'Celo maternal protector, calor constante y llamado cloc-cloc' },
      { k: 'Nido', v: 'Rincón resguardado con sustrato seco y comedero especial' }
    ],
    desc: 'Aquí vemos el milagro de la vida en la granja: una gallina que acaba de ser mamá abriga a su pollito recién nacido bajo sus plumas. Los pollitos no pueden regular su temperatura corporal solos los primeros días, por lo que necesitan el calor constante del cuerpo de su madre para sobrevivir y crecer fuertes.',
    pedagogy: '💡 Cuando una gallina se pone "clueca", su cuerpo eleva la temperatura y desarrolla un instinto protector asombroso. Pasa 21 días incubando sus huevos con paciencia absoluta, volteándolos con su pico para que el calor se reparta parejo. ¡Es biología pura y hermosa!'
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
      { k: 'Sujeción', v: 'Palma cóncava sin presión que brinda calor suave y apoyo' },
      { k: 'Reacción', v: 'El pollito cierra sus ojos en sueño plácido y seguro' },
      { k: 'Norma', v: 'Lavado riguroso de manos antes y después de la interacción' }
    ],
    desc: 'Este pollito dorado duerme profundamente sintiendo el calor de las manos de una alumna. Las manos forman una especie de nido protector sin apretarlo. Cuando los pollitos sienten un calor suave y suave contacto, cierran sus ojitos al instante porque les recuerda el abrigo de las plumas de su mamá.',
    pedagogy: '💡 Sostener a un ser vivo tan pequeño y frágil despierta un sentido de responsabilidad único en los jóvenes. Además, siempre enseñamos la regla básica de bioseguridad: lavarse muy bien las manos con agua y jabón antes y después de tocar a los animales.'
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
      { k: 'Espacio', v: 'Corral con césped limpio, refugios y zonas para corretear' }
    ],
    desc: '¡Tasmi en pose de explorador! Cuando los conejos ven algo nuevo o escuchan que alguien se acerca con comida rica, se paran sobre sus patas traseras como si fueran pequeños periscopios. Así amplían su campo visual y huelen el aire con su naricita inquieta.',
    pedagogy: '💡 Esta postura bípeda es un comportamiento instintivo que los conejos silvestres usan en el campo para vigilar si hay depredadores a lo lejos. Que Tasmi lo haga frente a los estudiantes demuestra que está despierto, sano y lleno de energía.'
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
      { k: 'Ejemplar', v: 'Nesquik (Conejo negro azabache de pelo corto y brillante)' },
      { k: 'Cama', v: 'Capa gruesa de paja de trigo seca y heno aromático limpio' },
      { k: 'Refugio', v: 'Zona techada con protección contra el viento costero' },
      { k: 'Hábito', v: 'Descanso diurno sereno con más energía al amanecer y atardecer' }
    ],
    desc: 'Nesquik descansando plácidamente sobre una cama de heno recién puesto. El heno seco no es solo el alimento principal de los conejos; también sirve como un colchón suave, térmico y seco que aísla sus patitas del frío y del suelo duro.',
    pedagogy: '💡 Las plantas de las patas de los conejos no tienen almohadillas de goma como los perros o gatos, sino solo pelo. Por eso es vital mantener su cama siempre seca y acolchada con paja y heno, evitando lesiones en su piel.'
  },
  {
    id: 'mural-mensajes-positivos-jardineria',
    category: 'espacios',
    title: 'Mural de Mensajes Positivos y Jardinería Vertical',
    subtitle: 'Espacio reflexivo y colección botánica de suculentas',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.03 (1).jpeg',
    gameRef: {
      type: 'map',
      label: 'Mural y Pizarra Ecológica',
      icon: '📝',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Mural', v: 'Pizarra comunitaria con reflexiones ecológicas escritas por alumnos' },
      { k: 'Botánica', v: 'Sedum (Cola de burro colgante), echeverias y cactus' },
      { k: 'Arte', v: 'Bordura de piedras de río pintadas con motivos de la naturaleza' },
      { k: 'Mensaje', v: '"Nuestro trabajo no sería nada sin personas como ustedes... verdaderos agentes de cambio"' }
    ],
    desc: 'En este rincón, las piedras pintadas y los mensajes escritos por los estudiantes acompañan una colección de suculentas y cactus colgantes. Estas plantas carnosas almacenan agua en sus hojas gorditas, lo que les permite soportar el fuerte sol nortino sin marchitarse.',
    pedagogy: '💡 La biología vegetal nos enseña sobre adaptación al medio: las suculentas y cactus son expertas en sobrevivir con poquísima agua. Combinar botánica con mensajes de ánimo crea un espacio donde la naturaleza inspira a la comunidad escolar.'
  },
  {
    id: 'mesa-redonda-vivero-propagacion',
    category: 'huerto',
    title: 'Mesa de Propagación Botánica y Vivero de Flores',
    subtitle: 'Estación de esquejes, Poinsettias y plantas medicinales',
    photo: 'assets/Imagenes Granja Real B13/Imagenes menos HD que vayan complementando a las otras del OneDrive y las mas HD Que se muestren primero/WhatsApp Image 2026-10-08 at 20.08.04 (2).jpeg',
    gameRef: {
      type: 'map',
      label: 'Zona de Plantas y Vivero',
      icon: '🌸',
      link: 'mapa.html'
    },
    specs: [
      { k: 'Estructura', v: 'Mesa circular reciclada a partir de un gran carrete de bobina' },
      { k: 'Flora', v: 'Poinsettias (Flores de Pascua), geranios y ruda medicinal' },
      { k: 'Macetas', v: 'Envases plásticos reutilizados con buen drenaje de agua' },
      { k: 'Técnica', v: 'Multiplicación de plantas por esquejes (tallitos en tierra húmeda)' }
    ],
    desc: 'Construida a partir de un gran carrete de madera reciclado, esta mesa redonda es el laboratorio botánico de los alumnos. Aquí aprenden a cortar pequeñas ramitas (esquejes), ponerlas en tierra húmeda y ver cómo brotan raíces nuevas para crear plantas independientes.',
    pedagogy: '💡 Muchas plantas tienen la asombrosa capacidad de multiplicarse sin necesidad de semillas (reproducción asexual). Los estudiantes descubren que con solo cuidar una ramita pueden reforestar patios y llenar de flores los hogares.'
  },
  {
    id: 'cultivo-tomates-cherry-maceta',
    category: 'huerto',
    title: 'Cultivo de Tomates Cherry en Macetas',
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
      { k: 'Variedades', v: 'Tomates perita amarillos y cherrys rojos dulces' },
      { k: 'Soporte', v: 'Tutores de caña para sostener las ramas con peso de tomates' },
      { k: 'Suelo', v: 'Tierra abonada con humus de lombriz producido en la granja' },
      { k: 'Cosecha', v: 'Frutos sanos sin químicos, sembrados y cuidados por alumnos' }
    ],
    desc: 'Tomates cherry creciendo en maceteros dentro de la granja del liceo. Con tutores de caña para afirmar las ramas cargadas de frutos, los estudiantes aprenden a regar, desmalezar y cosechar tomates dulces y saludables sin usar ningún pesticida químico.',
    pedagogy: '💡 Ver cómo una flor amarilla polinizada se convierte en un tomatito verde y luego en uno rojo maduro enseña el ciclo vegetal como ningún libro de texto. Además, muestra que en cualquier patio o balcón se pueden cultivar alimentos sanos.'
  },
  {
    id: 'cultivo-algodon-fibras-naturales',
    category: 'huerto',
    title: 'Cultivo de Algodón y Fibras Vegetales',
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
      { k: 'Planta', v: 'Planta de algodón (Gossypium hirsutum)' },
      { k: 'Capullo', v: 'Cápsula madura que se abre liberando motas blancas suaves' },
      { k: 'Condición', v: 'Gran resistencia al calor y al sol directo del norte' },
      { k: 'Aprendizaje', v: 'Permite tocar y conocer de dónde nacen las telas naturales' }
    ],
    desc: '¡Muchos niños se sorprenden al ver que el algodón sale de una planta! En el huerto del liceo cultivamos plantas de algodón donde, al secarse el fruto, estallan cápsulas con copos de fibra blanca purísima que protegen a las semillas en su interior.',
    pedagogy: '💡 En la naturaleza, las fibras de algodón ayudan a que el viento disperse las semillas. Para la humanidad, es la fibra vegetal más importante de la historia. Tocar una mota de algodón en la planta conecta la ciencia con la ropa que vestimos todos los días.'
  },
  {
    id: 'jardin-polinizadores-flores',
    category: 'huerto',
    title: 'Jardín Floral de Polinizadores: Cardenales y Margaritas',
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
      { k: 'Especies', v: 'Cardenales fucsias, gazanias bicolores y margaritas blancas' },
      { k: 'Función', v: 'Atraer insectos polinizadores (abejas, mariposas y abejorros)' },
      { k: 'Riego', v: 'Cuidado eficiente del agua con acolchado que guarda humedad' },
      { k: 'Beneficio', v: 'Ayuda a que los tomates y frutos del huerto den buena cosecha' }
    ],
    desc: 'Un mar de flores de colores intensos recibe a abejas, abejorros y mariposas en la granja. Las flores ofrecen néctar dulce a los insectos, y a cambio, ellos transportan el polen de flor en flor, permitiendo que las hortalizas y árboles frutales del huerto den cosecha.',
    pedagogy: '💡 Este fenómeno biológico se llama mutualismo: ambas especies ganan. Sin los insectos polinizadores, más de un tercio de los alimentos que comemos en el planeta desaparecerían. En el liceo protegemos a las abejas plantando flores todo el año.'
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
      { k: 'Ave', v: 'Gallito Sedoso Japonés sostenido con ternura en brazos' },
      { k: 'Rasgos únicos', v: 'Orejas de color turquesa brillante y plumas como peluche' },
      { k: 'Patas', v: 'Cinco dedos cubiertos de plumas en vez de cuatro' },
      { k: 'Manejo', v: 'Trato suave que crea una conexión de confianza con los alumnos' }
    ],
    desc: 'Una alumna sostiene con delicadeza a uno de los gallitos sedosos. Fíjate en los detalles únicos de su cara: tiene unas manchitas de color azul turquesa brillante en sus orejas y una pequeña cresta carmesí. Su plumaje es tan dócil y esponjoso que parece un peluche vivo.',
    pedagogy: '💡 A diferencia de la creencia popular de que los gallos son ariscos, si crecen con buen trato y cariño desde polluelos, desarrollan un temperamento pacífico y disfrutan que los tomen en brazos para escuchar los latidos de su corazón.'
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
      { k: 'Ejemplar', v: 'Gallinita joven blanca de cresta naciente y mirada curiosa' },
      { k: 'Técnica', v: 'Sujeción correcta por debajo del cuerpo que da apoyo y calma' },
      { k: 'Conducta', v: 'Total tranquilidad sin aleteos bruscos ni intentos de escape' },
      { k: 'Salud', v: 'Revisión periódica de plumas, peso y alimentación natural' }
    ],
    desc: 'Una estudiante sostiene a una gallinita blanca apoyando su cuerpecito sobre el antebrazo. Al sostener las patas y alas suavemente contra el pecho, el ave no se asusta, no aletea y se siente totalmente protegida mientras explora con la mirada el patio.',
    pedagogy: '💡 En bienestar animal enseñamos la regla fundamental: nunca tomar a un ave por las alas ni por las patas colgando. Sostenerlas por debajo del abdomen les da equilibrio y evita el pánico, demostrando que la ciencia se practica con compasión y cuidado.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { REAL_GALLERY_ITEMS };
}
