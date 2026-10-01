/*
  map-data.js — Datos específicos de la vista "Mapa de la Granja".
  Se carga DESPUÉS de data.js (usa ANIMALS para traer la biología de cada
  especie) y ANTES de card.js / map-app.js.

  FARM_ZONES: las áreas dibujadas en assets/img/map/mapa-granja.jpg.
  Cada zona tiene su posición como porcentaje de la imagen (left/top),
  para que el pin quede bien puesto sin importar el tamaño de pantalla.

  MAP_ANIMALS: los animales reales del liceo. Cada uno reutiliza la
  biología (facts/organs/quiz) de su especie en ANIMALS — así el dato
  verificado no se escribe dos veces — y agrega su propia foto, nombre
  y una breve descripción de identidad.
*/

function speciesFacts(id) {
  const sp = ANIMALS.find(a => a.id === id);
  return sp ? {
    facts: sp.facts, organs: sp.organs, quiz: sp.quiz, lat: sp.lat,
    sound: sp.sound, anatomyImage: sp.anatomyImage
  } : null;
}

const FARM_ZONES_CLASSIC = [
  { id: 'almacen', label: 'Almacén de Granja', kind: 'deco', icon: '📦', left: 20.0, top: 10.5,
    flavor: 'Aquí se almacenan los alimentos (granos, heno, forraje) y herramientas del liceo. Mantenerlo seco, limpio y ordenado evita plagas y asegura que los animales reciban alimento en óptimas condiciones.',
    image: 'assets/img/real/canasto_huevos_taller.jpg' },
  { id: 'conejos', label: 'Conejeras Oficiales', kind: 'animals', icon: '🐇', left: 47.0, top: 20.0,
    intro: 'La conejera del liceo con sus 9 conejos oficiales. Toca a cada uno para abrir su ficha de campo y quiz.',
    animalIds: ['nesquik', 'vainilla', 'tasmi', 'quesito', 'narizita', 'canela', 'chaucha', 'segunda', 'ceniza'] },
  { id: 'plantas', label: 'Huerto Escolar', kind: 'deco', icon: '🌱', left: 74.7, top: 20.0,
    flavor: 'El huerto vegetal del liceo. Parte de lo que se cosecha aquí complementa la dieta fresca de los animales, promoviendo la sustentabilidad y el cuidado vegetal.',
    image: 'assets/img/real/huerto_bancales.jpg' },
  { id: 'lista', label: 'Pizarrón de Tareas', kind: 'deco', icon: '📋', left: 31.3, top: 40.5,
    flavor: 'Pizarrón de tareas y turnos de la granja. Aquí el equipo de estudiantes y profesores coordina la alimentación, limpieza de bebederos y revisión del bienestar de cada animal.' },
  { id: 'huerto', label: 'Huerto de Bayas', kind: 'deco', icon: '🫐', left: 62.3, top: 45.0,
    flavor: 'Arbustos y frutos del huerto. Proporciona sombra natural y frutos que enriquecen el ecosistema de la granja.',
    image: 'assets/img/real/tomates_maceta.jpg' },
  { id: 'patos', label: 'Recinto de los Patos', kind: 'animals', icon: '🦆', left: 83.8, top: 45.0,
    intro: 'El recinto de los patos del liceo donde habitan Sal y Pimienta. Toca para ver su ficha y curiosidades.',
    animalIds: ['sal', 'pimienta'],
    image: 'assets/img/animals/sal.png' },
  { id: 'pozo', label: 'Pozo de Agua Histórico', kind: 'deco', icon: '🪣', left: 55.0, top: 38.0,
    flavor: 'Antiguo pozo de agua de la granja del liceo. Históricamente abastecía el regadío del huerto y el aseo de los corrales.',
    image: 'assets/img/real/pozo_real.jpg' },
  { id: 'arboleda', label: 'Arboleda de Nidos', kind: 'animals', icon: '🦜', left: 11.5, top: 68.0,
    intro: 'El árbol y aviario donde habitan Pastelito, Los manguitos y Las Catitas.',
    animalIds: ['pastelito', 'los_manguitos', 'las_catitas'] },
  { id: 'gallinas', label: 'Gallinero y Gallos', kind: 'animals', icon: '🐔', left: 41.0, top: 70.0,
    intro: 'El gallinero del liceo con sus 9 gallinas y gallos oficiales. Toca a cada ave para abrir su ficha.',
    animalIds: ['vicente', 'matias', 'cleo', 'tormenta', 'milagro', 'mama', 'violeta', 'fernanda_chica', 'avellana'] },
  { id: 'jaula-gallo', label: 'Jaula del Gallo', kind: 'animals', icon: '🐓', left: 34.5, top: 79.0,
    intro: 'El recinto superior de aves y reyes del corral.',
    animalIds: ['avellana', 'vicente'] },
  { id: 'paja', label: 'Zona de Paja y Cama', kind: 'deco', icon: '🌾', left: 68.4, top: 72.0,
    flavor: 'Zona de acopio de paja y heno seco. Se utiliza como cama térmica y absorbente en el gallinero y conejeras.',
    image: 'assets/img/real/canasto_huevos_taller.jpg' },
  { id: 'gato', label: 'Gato de la Granja', kind: 'deco', icon: '🐈', left: 83.0, top: 63.0,
    flavor: 'El felino guardián de la granja. Ronda los alrededores del almacén y los corrales, ayudando de forma natural en el control biológico de roedores.',
    sound: 'assets/audio/gato.mp3' }
];

// Zonas oficiales calibradas sobre el render 3D realista (mapa3.jpg)
const FARM_ZONES_3D = [
  { id: 'patos', label: 'Recinto de los Patos', kind: 'animals', icon: '🦆', left: 80.5, top: 8.5,
    intro: 'El recinto superior de patos del liceo donde conviven Sal y Pimienta bajo el toldo protegido. Toca para ver sus fichas.',
    animalIds: ['sal', 'pimienta'],
    image: 'assets/img/animals/sal.png' },
  { id: 'pozo', label: 'Pozo de Agua Histórico', kind: 'deco', icon: '🪣', left: 49.7, top: 8.5,
    flavor: 'Antiguo pozo de piedra y agua del liceo, utilizado para regadío sustentable y abastecimiento de las áreas verdes escolares.',
    image: 'assets/img/real/pozo_real.jpg' },
  { id: 'almacen', label: 'Almacén de Granja', kind: 'deco', icon: '📦', left: 22.0, top: 9.5,
    flavor: 'Aquí se almacenan los alimentos (granos, heno, forraje) y herramientas del liceo. Mantenerlo seco, limpio y ordenado evita plagas y asegura que los animales reciban alimento en óptimas condiciones.',
    image: 'assets/img/real/canasto_huevos_taller.jpg' },
  { id: 'plantas', label: 'Huerto Escolar y Bancales', kind: 'deco', icon: '🌱', left: 20.0, top: 20.0,
    flavor: 'El huerto vegetal del liceo. Parte de lo que se cosecha aquí complementa la dieta fresca de los animales (como hojas verdes y forraje para conejos y gallinas), promoviendo la sustentabilidad y el cuidado vegetal (ODS 15).',
    image: 'assets/img/real/huerto_bancales.jpg' },
  { id: 'conejos', label: 'Conejeras Oficiales', kind: 'animals', icon: '🐇', left: 80.5, top: 25.0,
    intro: 'El recinto de conejeras del liceo con césped protegido y sus 9 conejos oficiales. Toca a cada uno para abrir su ficha y quiz.',
    animalIds: ['nesquik', 'vainilla', 'tasmi', 'quesito', 'narizita', 'canela', 'chaucha', 'segunda', 'ceniza'] },
  { id: 'huerto', label: 'Bancales de Cultivo', kind: 'deco', icon: '🫐', left: 20.0, top: 48.0,
    flavor: 'Bancales y cultivos vegetales complementarios para enriquecimiento ambiental y nutrición zootécnica.',
    image: 'assets/img/real/tomates_maceta.jpg' },
  { id: 'gallinas', label: 'Gallinero Principal', kind: 'animals', icon: '🐔', left: 80.5, top: 45.0,
    intro: 'El gallinero del liceo con Vicente, Matías, Cleo, Mamá, Violeta y Fernanda chica. Toca a cada ave para abrir su ficha y quiz.',
    animalIds: ['vicente', 'matias', 'cleo', 'mama', 'violeta', 'fernanda_chica'] },
  { id: 'jaula-gallo', label: 'Nidos y Crianza del Corral', kind: 'animals', icon: '🐓', left: 80.5, top: 63.0,
    intro: 'Sector de nidos protegidos, crianza y descanso de gallos y ponedoras.',
    animalIds: ['avellana', 'vicente'] },
  { id: 'mesa', label: 'Mesa de Trabajo Botánico', kind: 'deco', icon: '🪴', left: 48.0, top: 60.0,
    flavor: 'Mesa de cultivo circular y banco de trabajo botánico para la propagación de esquejes, siembra en maceteros y toma de notas de campo al aire libre.',
    image: 'assets/img/real/mesa_cultivo_flores.jpg' },
  { id: 'arboleda', label: 'Aviario de Aves Menores', kind: 'animals', icon: '🦜', left: 80.5, top: 83.0,
    intro: 'El aviario escolar donde habitan Pastelito, Los manguitos y Las Catitas entre ramas y nidos.',
    animalIds: ['pastelito', 'los_manguitos', 'las_catitas'] },
  { id: 'taller', label: 'Taller de Palets y Camas', kind: 'deco', icon: '🌾', left: 22.0, top: 81.0,
    flavor: 'Sector de acopio de paja, sustratos y herramientas de cultivo construidas con maderas recicladas de la comunidad.',
    image: 'assets/img/real/canasto_huevos_taller.jpg' },
  { id: 'nido-tormenta-milagro', label: 'Nido de Tormenta y Milagro', kind: 'animals', icon: '🐔', left: 64.0, top: 58.0,
    intro: 'El cajón de descanso y postura protegido donde conviven y empollandan las queridas gallinas Tormenta y Milagro.',
    animalIds: ['tormenta', 'milagro'] },
  { id: 'gato', label: 'Gato Guardián de la Granja', kind: 'deco', icon: '🐈', left: 35.0, top: 16.0,
    flavor: 'El felino guardián de la granja. Ronda sigilosamente sobre los muros de piedra y techos de madera del almacén, controlando roedores de forma biológica y cuidando a la comunidad sin químicos dañinos.',
    sound: 'assets/audio/gato.mp3' }
];

let FARM_ZONES = FARM_ZONES_3D;

const MAP_ANIMALS = [
  // --- CONEJOS OFICIALES (9) ---
  {
    id: 'nesquik', name: 'Nesquik', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/nesquik.png', emoji: '🐇',
    color: '#6c3012', accessory: 'none', group: 'conejos',
    blurb: 'Edad: 3 años. Carácter: Introvertido e impredecible. Pelaje: Café chocolate con manchas oscuras, pelo largo y esponjoso.',
    ...speciesFacts('conejo')
  },
  {
    id: 'vainilla', name: 'Vainilla', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/vainilla.png', emoji: '🐇',
    color: '#d97706', accessory: 'none', group: 'conejos',
    blurb: 'Edad: 5 años. Carácter: Enamoradizo y tierno. Pelaje: Blanco con manchas café claro en las orejas y ojitos, pelito corto.',
    ...speciesFacts('conejo')
  },
  {
    id: 'tasmi', name: 'Tasmi', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/tasmi.png', emoji: '🐇',
    color: '#b45309', accessory: 'none', group: 'conejos',
    blurb: 'Edad: 2 años. Carácter: Revoltoso y destructor. Pelaje: Blanco con manchas café claro en las orejitas, pelo corto.',
    ...speciesFacts('conejo')
  },
  {
    id: 'quesito', name: 'Quesito', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/quesito.png', emoji: '🐇',
    color: '#0284c7', accessory: 'none', group: 'conejos',
    blurb: 'Edad: 1 año. Carácter: Metiche y amistoso. Pelaje: Blanco nieve, largo y esponjoso, ojos azules celestiales.',
    ...speciesFacts('conejo')
  },
  {
    id: 'narizita', name: 'Narizita', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/narizita.png', emoji: '🐇',
    color: '#475569', accessory: 'none', group: 'conejos',
    blurb: 'Carácter: Curioso y perspicaz. Pelaje: Blanco brillante con una distinguida mancha negra en su nariz tipo mostacho.',
    ...speciesFacts('conejo')
  },
  {
    id: 'canela', name: 'Canela', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/canela.png', emoji: '🐇',
    color: '#c2410c', accessory: 'none', group: 'conejos',
    blurb: 'Carácter: Veloz, alerta y observador. Pelaje: Color canela y ámbar tostado, orejas largas y esbeltas siempre erguidas.',
    ...speciesFacts('conejo')
  },
  {
    id: 'chaucha', name: 'Chaucha', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/chaucha.png', emoji: '🐇',
    color: '#4c1d95', accessory: 'none', group: 'conejos',
    blurb: 'Carácter: Regalón y pacífico. Pelaje: Negro azabache profundo, orejas caídas de raza Belier y mirada tierna.',
    ...speciesFacts('conejo')
  },
  {
    id: 'segunda', name: 'Segunda', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/segunda.png', emoji: '🐇',
    color: '#0f766e', accessory: 'none', group: 'conejos',
    blurb: 'Carácter: Tranquilo, sabio y paciente. Pelaje: Negro brillante como la noche, orejas caídas y porte elegante.',
    ...speciesFacts('conejo')
  },
  {
    id: 'ceniza', name: 'Ceniza', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/ceniza.png', emoji: '🐇',
    color: '#64748b', accessory: 'none', group: 'conejos',
    blurb: 'Carácter: Explorador y sociable. Pelaje: Gris ceniza perlado con motas plata tipo chinchilla, orejas caídas.',
    ...speciesFacts('conejo')
  },

  // --- GALLINAS Y GALLOS OFICIALES (9) ---
  {
    id: 'vicente', name: 'Vicente', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/vicente.png', emoji: '🐓',
    color: '#be123c', accessory: 'none', group: 'gallinas',
    blurb: 'Gallo japonés Bantam de plumaje blanco sedoso, cresta roja altiva y patas emplumadas. Guardián del gallinero.',
    ...speciesFacts('gallo'),
    sound: 'assets/audio/gallo.mp3'
  },
  {
    id: 'matias', name: 'Matías', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/matias.png', emoji: '🐓',
    color: '#2563eb', accessory: 'none', group: 'gallinas',
    blurb: 'Gallo japonés Bantam color crema marfil sedoso, carácter afectuoso, patas calzadas de plumas y canto afinado.',
    ...speciesFacts('gallo'),
    sound: 'assets/audio/gallo.mp3'
  },
  {
    id: 'cleo', name: 'Cleo', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/cleo.png', emoji: '🐔',
    color: '#a16207', accessory: 'none', group: 'gallinas',
    blurb: 'Gallina de plumaje barrado silvestre en blanco y negro, líder de forrajeo en el corral y experta cazadora de insectos.',
    ...speciesFacts('gallina'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'tormenta', name: 'Tormenta', store: 'mapQuiz', zoneId: 'nido-tormenta-milagro',
    photo: 'assets/img/animals/tormenta.png', emoji: '🐔',
    color: '#4b5563', accessory: 'none', group: 'gallinas',
    blurb: 'Gallina sedosa japonesa de tono gris nube esponjoso. Su plumaje es suave como el algodón y tiene un carácter muy dócil.',
    ...speciesFacts('gallina'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'milagro', name: 'Milagro', store: 'mapQuiz', zoneId: 'nido-tormenta-milagro',
    photo: 'assets/img/animals/milagro.png', emoji: '🐔',
    color: '#b45309', accessory: 'none', group: 'gallinas',
    blurb: 'Gallina con singular copete de plumas en la cabeza tono capuchino y beige. Alegre, curiosa y muy querida en el liceo.',
    ...speciesFacts('gallina'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'mama', name: 'Mamá', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/mama.png', emoji: '🐔',
    color: '#c2410c', accessory: 'none', group: 'gallinas',
    blurb: 'Gallina aperdizada moteada, matriarca cariñosa del corral. Cuida y abriga con ternura a los polluelos de la granja.',
    ...speciesFacts('gallina'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'violeta', name: 'Violeta', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/violeta.png', emoji: '🐔',
    color: '#dc2626', accessory: 'none', group: 'gallinas',
    blurb: 'Gallina dorada brillante de postura erguida y cresta roja viva. Excelente ponedora y de temperamento muy sereno.',
    ...speciesFacts('gallina'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'fernanda_chica', name: 'Fernanda chica', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/fernanda_chica.png', emoji: '🐔',
    color: '#3f3f46', accessory: 'none', group: 'gallinas',
    blurb: 'Gallina de plumaje en damero blanco y negro moteado. Ágil, rápida para trepar a las perchas y de tamaño compacto.',
    ...speciesFacts('gallina'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'avellana', name: 'Avellana', store: 'mapQuiz', zoneId: 'jaula-gallo',
    photo: 'assets/img/animals/avellana.png', emoji: '🐓',
    color: '#059669', accessory: 'none', group: 'gallinas',
    blurb: 'Gallo flor de haba con manto dorado color avellana y cola larga con deslumbrantes reflejos verde esmeralda al sol.',
    ...speciesFacts('gallo'),
    sound: 'assets/audio/gallo.mp3'
  },

  // --- LOROS Y AVES OFICIALES (3) ---
  {
    id: 'pastelito', name: 'Pastelito', store: 'mapQuiz', zoneId: 'arboleda',
    photo: 'assets/img/animals/pastelito.png', emoji: '🦜',
    color: '#16a34a', accessory: 'none', group: 'loros',
    blurb: 'Agapornis estrella del liceo: plumaje verde manzana, máscara rosada melocotón y pico color marfil. Acróbata cantor.',
    ...speciesFacts('agapornis'),
    sound: 'assets/audio/aves.mp3'
  },
  {
    id: 'los_manguitos', name: 'Los manguitos', store: 'mapQuiz', zoneId: 'arboleda',
    photo: 'assets/img/animals/los_manguitos.png', emoji: '🦜',
    color: '#ea580c', accessory: 'none', group: 'loros',
    blurb: 'Grupo sociable de agapornis inseparables con tonalidades de mango maduro, lima y coral. Súper conversadores y unidos.',
    ...speciesFacts('agapornis'),
    sound: 'assets/audio/aves.mp3'
  },
  {
    id: 'las_catitas', name: 'Las Catitas', store: 'mapQuiz', zoneId: 'arboleda',
    photo: 'assets/img/animals/las_catitas.png', emoji: '🦜',
    color: '#0284c7', accessory: 'none', group: 'loros',
    blurb: 'Dúo de periquitos australianos: una de manto verde y amarillo con ondulaciones negras, y otra de azul cielo cristalino.',
    ...speciesFacts('catita'),
    sound: 'assets/audio/aves.mp3'
  },

  // --- PATOS OFICIALES (2) ---
  {
    id: 'sal', name: 'Sal', store: 'mapQuiz', zoneId: 'patos',
    photo: 'assets/img/animals/sal.png', emoji: '🦆',
    color: '#0284c7', accessory: 'none', group: 'patos',
    blurb: 'Pato Pekín blanco níveo de pico y patas anaranjadas. Amante del nado sincronizado, el agua fresca y el buceo.',
    ...speciesFacts('pato'),
    sound: 'assets/audio/aves.mp3'
  },
  {
    id: 'pimienta', name: 'Pimienta', store: 'mapQuiz', zoneId: 'patos',
    photo: 'assets/img/animals/pimienta.png', emoji: '🦆',
    color: '#065f46', accessory: 'none', group: 'patos',
    blurb: 'Pato Cayuga de plumaje negro azabache con intensos reflejos tornasolados verde esmeralda bajo el sol del norte.',
    ...speciesFacts('pato'),
    sound: 'assets/audio/aves.mp3'
  }
];

// Aliases para compatibilidad con estados y quizzes anteriores
const LEGACY_ALIASES = {
  m_matias_vicente: 'vicente',
  m_rooster: 'avellana',
  m_gallinas_grupo: 'cleo',
  m_conejo_grupo: 'canela',
  m_catitas: 'las_catitas',
  m_agapornis: 'pastelito'
};

const MAP_ANIMALS_BY_ID = {};
MAP_ANIMALS.forEach(a => { MAP_ANIMALS_BY_ID[a.id] = a; });
Object.keys(LEGACY_ALIASES).forEach(legacyId => {
  const targetId = LEGACY_ALIASES[legacyId];
  if (MAP_ANIMALS_BY_ID[targetId]) {
    MAP_ANIMALS_BY_ID[legacyId] = Object.assign({}, MAP_ANIMALS_BY_ID[targetId], { id: legacyId });
  }
});

const FARM_ZONES_BY_ID = {};
FARM_ZONES_CLASSIC.forEach(z => { FARM_ZONES_BY_ID[z.id] = z; });
FARM_ZONES_3D.forEach(z => { FARM_ZONES_BY_ID[z.id] = z; });
