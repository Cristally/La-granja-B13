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

const FARM_ZONES = [
  { id: 'almacen', label: 'Almacén de Granja', kind: 'deco', icon: '📦', left: 20.0, top: 10.5,
    flavor: 'Aquí se almacenan los alimentos (granos, heno, forraje) y herramientas del liceo. Mantenerlo seco, limpio y ordenado evita plagas y asegura que los animales reciban alimento en óptimas condiciones.' },
  { id: 'conejos', label: 'Conejeras', kind: 'animals', icon: '🐇', left: 47.0, top: 20.0,
    intro: 'La conejera del liceo. Toca a cada conejo para abrir su ficha de campo y quiz.',
    animalIds: ['nesquik', 'vainilla', 'tasmi', 'quesito', 'm_conejo_grupo'] },
  { id: 'plantas', label: 'Huerto Escolar', kind: 'deco', icon: '🌱', left: 74.7, top: 20.0,
    flavor: 'El huerto vegetal del liceo. Parte de lo que se cosecha aquí complementa la dieta fresca de los animales (como hojas verdes y forraje para conejos y gallinas), promoviendo la sustentabilidad y el cuidado vegetal.' },
  { id: 'lista', label: 'Pizarrón de Tareas', kind: 'deco', icon: '📋', left: 31.3, top: 40.5,
    flavor: 'Pizarrón de tareas y turnos de la granja. Aquí el equipo de estudiantes y profesores coordina la alimentación, limpieza de bebederos y revisión del bienestar de cada animal.' },
  { id: 'huerto', label: 'Huerto de Bayas', kind: 'deco', icon: '🫐', left: 62.3, top: 45.0,
    flavor: 'Arbustos y frutos del huerto. Proporciona sombra natural y frutos que enriquecen el ecosistema de la granja y sirven de estímulo para las aves del liceo.' },
  { id: 'pozo', label: 'Pozo de Agua Limpia', kind: 'deco', icon: '🪣', left: 83.8, top: 45.0,
    flavor: 'Fuente principal de agua de la granja. El acceso a agua limpia, fresca y sin impurezas es indispensable para la hidratación, digestión y salud de todas las especies.' },
  { id: 'arboleda', label: 'Arboleda de Nidos', kind: 'animals', icon: '🌳', left: 11.5, top: 68.0,
    intro: 'El árbol donde habitan las aves pequeñas de la granja (catitas y agapornis).',
    animalIds: ['m_catitas', 'm_agapornis'] },
  { id: 'gallinas', label: 'Gallinero', kind: 'animals', icon: '🐔', left: 41.0, top: 70.0,
    intro: 'El gallinero del liceo. Toca a cada ave para abrir su ficha y conocer su biología.',
    animalIds: ['m_matias_vicente', 'm_gallinas_grupo'] },
  { id: 'jaula-gallo', label: 'Jaula del Gallo', kind: 'animals', icon: '🐓', left: 34.5, top: 79.0,
    intro: 'El recinto del único gallo de la granja.',
    animalIds: ['m_rooster'] },
  { id: 'paja', label: 'Zona de Paja y Cama', kind: 'deco', icon: '🌾', left: 68.4, top: 72.0,
    flavor: 'Zona de acopio de paja y heno seco. Se utiliza como cama térmica y absorbente en el gallinero y conejeras, manteniendo a los animales secos, cómodos y abrigados.' },
  { id: 'gato', label: 'Gato de la Granja', kind: 'deco', icon: '🐈', left: 83.0, top: 63.0,
    flavor: 'El felino guardián de la granja. Ronda los alrededores del almacén y los corrales, ayudando de forma natural en el control biológico de roedores sin necesidad de químicos nocivos.',
    sound: 'assets/audio/gato.mp3' }
];

const MAP_ANIMALS = [
  {
    id: 'nesquik', name: 'Nesquik', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/nesquik.png', emoji: '🐇',
    color: COLORS[0], accessory: 'none',
    blurb: 'Conejo de pelaje canela y orejas caídas, con un pelaje más largo y esponjoso alrededor de la cara.',
    ...speciesFacts('conejo')
  },
  {
    id: 'vainilla', name: 'Vainilla', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/vainilla.png', emoji: '🐇',
    color: COLORS[1], accessory: 'none',
    blurb: 'Conejo blanco de orejas erguidas, con una mancha canela junto a una de las orejas.',
    ...speciesFacts('conejo')
  },
  {
    id: 'tasmi', name: 'Tasmi', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/tasmi.png', emoji: '🐇',
    color: COLORS[2], accessory: 'none',
    blurb: 'Conejo blanco de orejas erguidas, con una pequeña mancha canela cerca de la oreja.',
    ...speciesFacts('conejo')
  },
  {
    id: 'quesito', name: 'Quesito', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/quesito.png', emoji: '🐇',
    color: COLORS[3], accessory: 'none',
    blurb: 'Conejo blanco de pelaje largo y esponjoso, el más lanudo del grupo.',
    ...speciesFacts('conejo')
  },
  {
    id: 'm_conejo_grupo', name: 'Otros conejos', store: 'mapQuiz', zoneId: 'conejos',
    photo: 'assets/img/animals/general_rabbit.png', emoji: '🐇',
    color: COLORS[4], accessory: 'none',
    blurb: 'Representa al resto de los conejos de la conejera que todavía no tienen ficha individual propia.',
    ...speciesFacts('conejo')
  },
  {
    id: 'm_matias_vicente', name: 'Matías y Vicente', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/matias_vicente.png', emoji: '🐔',
    color: COLORS[0], accessory: 'none',
    blurb: 'Pareja de gallinas de plumaje blanco y copete esponjoso en la cabeza.',
    ...speciesFacts('gallo'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'm_gallinas_grupo', name: 'Otras gallinas', store: 'mapQuiz', zoneId: 'gallinas',
    photo: 'assets/img/animals/farm_chickens.png', emoji: '🐔',
    color: COLORS[5], accessory: 'none',
    blurb: 'Representa al resto de las gallinas del gallinero.',
    ...speciesFacts('gallo'),
    sound: 'assets/audio/gallina.mp3'
  },
  {
    id: 'm_rooster', name: 'Gallo', store: 'mapQuiz', zoneId: 'jaula-gallo',
    photo: 'assets/img/animals/rooster.png', emoji: '🐓',
    color: COLORS[2], accessory: 'none',
    blurb: 'El único gallo de la granja: plumaje anaranjado y verde oscuro, con una gran cresta roja.',
    ...speciesFacts('gallo')
  },
  {
    id: 'm_catitas', name: 'Catitas', store: 'mapQuiz', zoneId: 'arboleda',
    photo: 'assets/img/animals/catitas.png', emoji: '🦜',
    color: COLORS[4], accessory: 'none',
    blurb: 'Pareja de periquitos (catitas): uno de tono verde y amarillo, el otro celeste.',
    ...speciesFacts('catita')
  },
  {
    id: 'm_agapornis', name: 'Agapornis', store: 'mapQuiz', zoneId: 'arboleda',
    photo: 'assets/img/animals/agapornis.png', emoji: '🦜',
    color: COLORS[5], accessory: 'none',
    blurb: 'Trío de agapornis de distintos colores: uno de cabeza anaranjada, uno celeste y uno verde con anaranjado.',
    ...speciesFacts('agapornis')
  }
];

const MAP_ANIMALS_BY_ID = {};
MAP_ANIMALS.forEach(a => { MAP_ANIMALS_BY_ID[a.id] = a; });

const FARM_ZONES_BY_ID = {};
FARM_ZONES.forEach(z => { FARM_ZONES_BY_ID[z.id] = z; });
