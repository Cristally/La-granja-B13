/*
  data.js — Todo el contenido educativo de La Granja B13.
  Este archivo NO tiene lógica de interfaz: solo datos.
  Pensado para que la persona a cargo de "investigar la información de cada
  animal" (ver formulario, sección 3) pueda editar este archivo sin tocar
  el resto del código.
*/

// Colores disponibles para personalizar la etiqueta de cada animal
const COLORS = ['#A94A3D', '#E3A83B', '#435E3A', '#4A6C8C', '#7A4E8C', '#2F8F7A'];

// IDs de las especies que caminan libremente en el Potrero del Liceo B-13.
// Representa a los animales reales de la granja: Gallo, Gallina, Conejo, Catitas y Agapornis.
const POTRERO_IDS = ['gallo', 'gallina', 'conejo', 'catita', 'agapornis'];

// Accesorios disponibles en la pestaña "Personalizar"
const ACCESSORIES = [
  { id: 'none', label: 'Ninguno', emoji: '' },
  { id: 'bow', label: 'Moño Rosa', emoji: '🎀' },
  { id: 'hat', label: 'Sombrero Campestre', emoji: '👒' },
  { id: 'cowboy', label: 'Sombrero Vaquero', emoji: '🤠' },
  { id: 'cap', label: 'Gorra Deportiva', emoji: '🧢' },
  { id: 'flower', label: 'Flor de Cerezo', emoji: '🌸' },
  { id: 'sunflower', label: 'Girasol', emoji: '🌻' },
  { id: 'glasses', label: 'Lentes de Sol', emoji: '🕶️' },
  { id: 'crown', label: 'Corona Dorada', emoji: '👑' }
];

// Helper para resolver el accesorio adecuado según especie (Menos al gallo: sombrero vaquero 🤠 en lugar de pamela 👒)
function getAnimalAccessoryEmoji(animalId, accId) {
  if (!accId || accId === 'none') return '';
  if (accId === 'hat') {
    return (animalId === 'gallo') ? '🤠' : '👒';
  }
  const found = ACCESSORIES.find(x => x.id === accId);
  return (found && found.emoji) ? found.emoji : '';
}

// Normas de comportamiento antes de visitar la granja física
// (basadas en la sección "Problemática u Oportunidad" del formulario)
const RULES = [
  'Observa con respeto y en silencio: los ruidos fuertes asustan y estresan a los animales.',
  'No alimentes a los animales sin autorización de un profesor o del encargado de la granja.',
  'Mantén una distancia adecuada; no todos los animales aceptan ser tocados constantemente.',
  'Lávate las manos antes y después de tener contacto con los animales o su entorno.',
  'No corras ni hagas movimientos bruscos cerca de los animales.',
  'Sigue siempre las indicaciones del profesor o encargado de la granja.'
];

// Insignias / logros oficiales del sistema de gamificación
const BADGES = [
  { id: 'explorador', icon: '🧭', label: 'Explorador/a de la Granja', desc: 'Descubriste los 5 animales del potrero.' },
  { id: 'cuadernista', icon: '📓', label: 'Cuaderno de Campo', desc: 'Completaste el quiz de al menos un animal del potrero.' },
  { id: 'guardian', icon: '🛡️', label: 'Guardián/a Responsable', desc: 'Completaste el quiz de los 5 animales del potrero.' },
  { id: 'precision', icon: '⭐', label: 'Precisión Perfecta', desc: 'Respondiste todas las preguntas de un quiz correctamente a la primera.' },
  { id: 'zoologo', icon: '🔎', label: 'Zoólogo/a de Campo', desc: 'Descubriste a los 10 animales del Mapa de la Granja.' },
  { id: 'veterinario', icon: '🩺', label: 'Veterinario/a de la Granja', desc: 'Completaste el quiz de los 10 animales del Mapa de la Granja.' },
  { id: 'maestro_arcade', icon: '🕹️', label: 'Maestro/a del Arcade Zootécnico', desc: 'Jugaste y obtuviste puntaje en los minijuegos de la granja.' },
  { id: 'podio_honor', icon: '🏆', label: 'Podio de Honor B-13', desc: 'Alcanzaste uno de los 3 primeros puestos (Oro, Plata o Bronce) en el Ranking.' },
  { id: 'cuaderno_dorado', icon: '📖', label: 'Cuaderno Dorado de Pistas', desc: 'Recolectaste más de 5 pistas zootécnicas en tu cuaderno de aprendizaje.' },
  { id: 'velocista_granero', icon: '⚡', label: 'Velocista del Granero', desc: 'Completaste un desafío de plataformas zootécnicas con gran agilidad.' },
  { id: 'ojo_halcon', icon: '🦅', label: 'Ojo de Halcón Zootécnico', desc: 'Encontraste 5 o más palabras técnicas en la Sopa de Letras Comunitaria.' },
  { id: 'memoria_fotografica', icon: '🧠', label: 'Memoria Zootécnica', desc: 'Emparejaste todas las cartas de especies en el Memorice de Campo.' },
  { id: 'estilista_campo', icon: '🎨', label: 'Estilista del Corral', desc: 'Personalizaste tu avatar o los accesorios de un animal de la granja.' },
  { id: 'cosecha_decimas', icon: '🌾', label: 'Cosecha de Décimas', desc: 'Acumulaste al menos 50 puntos puros en quizzes formativos.' }
];

// Logros Ocultos y Curiosidades (Easter Eggs) descubribles durante la exploración
const SECRET_BADGES = [
  {
    id: 'noctambulo',
    icon: '🌙',
    label: 'Noctámbulo/a de la Granja',
    secretHint: 'La granja tiene misterios que solo se revelan cuando cae la noche...',
    desc: '¡Exploraste la granja bajo las estrellas! (Actividad nocturna registrada)',
    category: 'secret'
  },
  {
    id: 'susurrador',
    icon: '👂',
    label: 'Susurrador/a de Animales',
    secretHint: 'Escuchar con atención es el primer paso para entender la naturaleza...',
    desc: 'Escuchaste las vocalizaciones de 5 animales o especies distintas.',
    category: 'secret'
  },
  {
    id: 'anatomista',
    icon: '🔬',
    label: 'Anatomista de Terreno',
    secretHint: 'La verdadera ciencia se oculta bajo la superficie del cuerpo...',
    desc: 'Inspeccionaste 6 órganos anatómicos en las radiografías interactivas.',
    category: 'secret'
  },
  {
    id: 'devoralibros',
    icon: '📜',
    label: 'Guardián/a de la Bioética',
    secretHint: 'El respeto y los protocolos son la base del cuidado animal escolar...',
    desc: 'Leíste las Normas de la Granja y los compromisos de sustentabilidad (ODS 15).',
    category: 'secret'
  },
  {
    id: 'relampago',
    icon: '⚡',
    label: 'Científico/a Relámpago',
    secretHint: 'La rapidez y la precisión son virtudes de los grandes observadores...',
    desc: 'Lograste una racha de 3 respuestas correctas seguidas a la primera.',
    category: 'secret'
  },
  {
    id: 'cecotrofia_master',
    icon: '🥕',
    label: 'Maestro/a de Nutrición',
    secretHint: 'Los conejos poseen un asombroso secreto digestivo que pocos conocen...',
    desc: 'Descubriste y respondiste con exactitud el enigma de la cecotrofia.',
    category: 'secret'
  },
  {
    id: 'cert_unlocked',
    icon: '🎓',
    label: 'Honor Oficial Liceo B-13',
    secretHint: 'El máximo reconocimiento espera a los estudiantes más comprometidos...',
    desc: '¡Completaste tu recorrido y desbloqueaste tu Certificado Oficial firmado digitalmente!',
    category: 'secret'
  },
  {
    id: 'pesadilla_conquistada',
    icon: '👹',
    label: 'Pesadilla Conquistada',
    secretHint: 'Solo los más valientes desafían los peligros extremos del potrero...',
    desc: '¡Te atreviste a jugar o sobrevivir en la dificultad Difícil / Extrema del Arcade!',
    category: 'secret'
  },
  {
    id: 'dash_celeste',
    icon: '💨',
    label: 'Reflejos de Celeste',
    secretHint: 'Un impulso aéreo cargado de energía te espera en las alturas...',
    desc: '¡Ejecutaste más de 10 impulsos Dash aéreos en el juego de plataformas zootécnicas!',
    category: 'secret'
  },
  {
    id: 'parry_cuphead',
    icon: '🥊',
    label: 'Espíritu de Campeón',
    secretHint: '¡A brawl is surely brewing! No dejes que el fango te toque ni un milímetro...',
    desc: '¡Completaste una partida de plataformas sin recibir daño por caída en el lodo!',
    category: 'secret'
  },
  {
    id: 'comediante_corral',
    icon: '😂',
    label: 'Comediante del Corral',
    secretHint: 'La risa es el mejor remedio biológico de la granja...',
    desc: '¡Descubriste y revelaste los remates de al menos 3 chistes de los animalitos!',
    category: 'secret'
  },
  {
    id: 'superpoder_detective',
    icon: '🦸',
    label: 'Detective de Superpoderes',
    secretHint: 'Los animales guardan habilidades dignas de superhéroes biológicos...',
    desc: '¡Descubriste los superpoderes biológicos de 4 especies diferentes en sus fichas!',
    category: 'secret'
  },
  {
    id: 'zen_granja',
    icon: '🧘',
    label: 'Tranquilidad Campestre',
    secretHint: 'La paciencia y el silencio son la clave de la observación zootécnica...',
    desc: '¡Permaneciste explorando la granja con calma y serenidad durante más de 3 minutos!',
    category: 'secret'
  },
  {
    id: 'amigo_nesquik',
    icon: '🍫',
    label: 'Club Oficial Nesquik',
    secretHint: 'Un conejo esponjoso color chocolate tiene un secreto para ti...',
    desc: '¡Descubriste la ficha de Nesquik y su historia como conejo decano del Liceo B-13!',
    category: 'secret'
  },
  {
    id: 'diploma_dorado',
    icon: '✨',
    label: 'Embajador/a Zootécnico/a',
    secretHint: 'Quien domina todos los sentidos se convierte en el mayor embajador de la granja...',
    desc: '¡Inspeccionaste radiografías, escuchaste vocalizaciones y respetaste las normas oficiales!',
    category: 'secret'
  }
];

// Opciones de personalización de Avatar para estudiantes de secundaria,
// organizadas por categorías: Fauna Oficial B-13, Estilo Femenino & Flores, y Estilo Masculino & Aventura.
const STUDENT_AVATARS = [
  // --- Fauna Oficial de La Granja B-13 ---
  { id: 'avatar_conejo', icon: '🐰', name: 'Conejo Oficial B-13', desc: 'Inspirado en Nesquik, Vainilla, Tasmi y Quesito', category: 'fauna' },
  { id: 'avatar_agapornis', icon: '🦜', name: 'Agapornis Inseparable', desc: 'Ave afectuosa y monógama del aviario escolar', category: 'fauna' },
  { id: 'avatar_catita', icon: '🐦', name: 'Catita Australiana', desc: 'Periquito colorido y sociable del aviario', category: 'fauna' },
  { id: 'avatar_gallina', icon: '🐔', name: 'Gallina Criolla Ponedora', desc: 'Noble productora de huevos frescos y libre de jaula', category: 'fauna' },
  { id: 'avatar_gallito', icon: '🐓', name: 'Gallito Japonés (Matías y Vicente)', desc: 'Raza Bantam de plumaje sedoso y porte elegante', category: 'fauna' },
  { id: 'avatar_pato', icon: '🦆', name: 'Pato de la Granja', desc: 'Ave acuática de plumaje impermeable y nado ágil', category: 'fauna' },

  // --- Estilo Femenino, Moños & Flores ---
  { id: 'avatar_mono', icon: '🎀', name: 'Moño Rosa Coquette', desc: 'Elegancia, ternura y detalle en el cuaderno de campo', category: 'fem' },
  { id: 'avatar_cerezo', icon: '🌸', name: 'Flor de Cerezo (Sakura)', desc: 'Belleza primaveral y renovación de los ciclos naturales', category: 'fem' },
  { id: 'avatar_girasol', icon: '🌻', name: 'Girasol Dorado', desc: 'Energía solar, optimismo y vitalidad del huerto', category: 'fem' },
  { id: 'avatar_hibisco', icon: '🌺', name: 'Flor de Hibisco', desc: 'Biodiversidad botánica y colorido vivo', category: 'fem' },
  { id: 'avatar_tulipan', icon: '🌷', name: 'Tulipán Primaveral', desc: 'Cuidado delicado y dedicación hortícola', category: 'fem' },
  { id: 'avatar_margarita', icon: '🌼', name: 'Margarita Silvestre', desc: 'Alegría simple y frescura de la pradera escolar', category: 'fem' },
  { id: 'avatar_rosa', icon: '🌹', name: 'Rosa de Jardín', desc: 'Pasión por las ciencias y respeto ambiental', category: 'fem' },
  { id: 'avatar_mariposa', icon: '🦋', name: 'Mariposa Polinizadora', desc: 'Símbolo de metamorfosis y conservación (ODS 15)', category: 'fem' },
  { id: 'avatar_estudiante_f', icon: '👩‍🎓', name: 'Estudiante Secundaria (Liceana)', desc: 'Compromiso académico, liderazgo y excelencia B-13', category: 'fem' },
  { id: 'avatar_biologa_f', icon: '👩‍🔬', name: 'Científica de Terreno', desc: 'Rigor experimental, análisis biológico y datos', category: 'fem' },
  { id: 'avatar_cuidadora_f', icon: '👩‍🌾', name: 'Guardiana del Potrero', desc: 'Bienestar animal diario y trabajo sustentable', category: 'fem' },

  // --- Estilo Masculino, Gorros & Aventura ---
  { id: 'avatar_gorra', icon: '🧢', name: 'Gorra Deportiva Juvenil', desc: 'Estilo dinámico, moderno y activo en terreno', category: 'masc' },
  { id: 'avatar_sombrero', icon: '🤠', name: 'Sombrero Campestre', desc: 'Tradición de campo y protección solar en el potrero', category: 'masc' },
  { id: 'avatar_galera', icon: '🎩', name: 'Galera de Honor', desc: 'Distinción, elegancia y cortesía académica', category: 'masc' },
  { id: 'avatar_corbata', icon: '👔', name: 'Corbata Institucional', desc: 'Presentación formal de proyectos y liderazgo', category: 'masc' },
  { id: 'avatar_corona', icon: '👑', name: 'Corona de Aprendizaje', desc: 'Máximo mérito, décimas ganadas e insignias doradas', category: 'masc' },
  { id: 'avatar_laurel', icon: '🌿', name: 'Laurel Ecológico', desc: 'Victoria sustentable y armonía con el medio ambiente', category: 'masc' },
  { id: 'avatar_gafas', icon: '🕶️', name: 'Gafas de Observación', desc: 'Ojo clínico, atención a los detalles y estilo', category: 'masc' },
  { id: 'avatar_lupa', icon: '🔍', name: 'Lupa Taxonómica', desc: 'Curiosidad científica y espíritu inquisitivo', category: 'masc' },
  { id: 'avatar_estudiante_m', icon: '👨‍🎓', name: 'Estudiante Secundario (Liceano)', desc: 'Esfuerzo constante, compañerismo y superación', category: 'masc' },
  { id: 'avatar_investigador_m', icon: '👨‍🔬', name: 'Investigador de Fauna', desc: 'Estudio de campo, taxonomía y bienestar animal', category: 'masc' },
  { id: 'avatar_veterinario_m', icon: '🧑‍⚕️', name: 'Veterinario/a Escolar', desc: 'Salud preventiva, nutrición y bioética animal', category: 'masc' }
];

const AVATAR_FRAMES = [
  { id: 'gold', name: 'Oro B-13', color: '#ffd83d', border: '3px solid #ffd83d' },
  { id: 'emerald', name: 'Esmeralda', color: '#2ec4b6', border: '3px solid #2ec4b6' },
  { id: 'ruby', name: 'Rubí Carmesí', color: '#e63946', border: '3px solid #e63946' },
  { id: 'sapphire', name: 'Zafiro Océano', color: '#4361ee', border: '3px solid #4361ee' },
  { id: 'amethyst', name: 'Amatista', color: '#9d4edd', border: '3px solid #9d4edd' },
  { id: 'sunset', name: 'Atardecer Norte', color: '#f77f00', border: '3px solid #f77f00' }
];

const STUDENT_TITLES = [
  'Explorador/a de Campo',
  'Observador/a de Aves',
  'Amigo/a de los Conejos',
  'Protector/a de la Biodiversidad',
  'Veterinario/a Honorífico/a',
  'Científico/a Juvenil B-13',
  'Guardián/a de la Granja'
];

// Mensaje final al completar los 5 quizzes del potrero (texto del formulario, sección ODS 4)
const FINAL_MESSAGE = '¡Felicitaciones! Completaste el recorrido de La Granja B13. Ahora conoces mejor a los animales, sus necesidades y la importancia de protegerlos. Recuerda que aprender también significa actuar con respeto, responsabilidad y compartir tus conocimientos con los demás.';

// Mensaje final al completar los 10 quizzes del Mapa de la Granja
const MAP_FINAL_MESSAGE = '¡Excelente trabajo de campo! Recorriste todo el Mapa de la Granja B13 y conociste a cada uno de sus habitantes, con nombre y todo. Eso es justamente lo que buscamos: acercar la ciencia a la vida real, un animal a la vez.';

// Mensaje al responder correctamente (texto del formulario, sección Propuesta de Valor)
const CORRECT_MESSAGE = '¡Respuesta correcta! Ganaste 10 puntos por aprender a cuidar responsablemente a los animales.';

// Puntos de anatomía compartidos por las aves pequeñas (catita y agapornis),
// ubicados sobre assets/img/anatomy/ave-general.jpg.
const AVE_ORGANS = [
  { id: 'yugular', label: 'Yugular', desc: 'Vena que devuelve la sangre desde la cabeza hacia el corazón.', left: 36.9, top: 20.5 },
  { id: 'carotida', label: 'Carótida', desc: 'Arteria que lleva sangre oxigenada desde el corazón hacia la cabeza.', left: 42.0, top: 24.8 },
  { id: 'traquea', label: 'Tráquea', desc: 'Conduce el aire desde la boca hasta los pulmones y los sacos aéreos.', left: 22.0, top: 32.6 },
  { id: 'esofago', label: 'Esófago', desc: 'Tubo que transporta el alimento desde la boca hasta el buche y luego hacia el resto del sistema digestivo.', left: 21.7, top: 38.7 },
  { id: 'pulmon', label: 'Pulmón', desc: 'Órgano respiratorio rígido conectado a sacos aéreos que hacen la respiración de las aves muy eficiente.', left: 44.9, top: 35.2 },
  { id: 'bazo', label: 'Bazo', desc: 'Filtra la sangre y forma parte del sistema inmunológico.', left: 52.5, top: 32.1 },
  { id: 'ovario', label: 'Ovario', desc: 'Órgano reproductor femenino donde se forman los óvulos que darán origen a los huevos.', left: 60.4, top: 33.0 },
  { id: 'rinon', label: 'Riñón', desc: 'Filtra desechos de la sangre para formar orina.', left: 63.5, top: 39.9 },
  { id: 'buche', label: 'Buche', desc: 'Bolsa donde el alimento se almacena y se humedece antes de continuar la digestión; no absorbe nutrientes.', left: 22.3, top: 51.0 },
  { id: 'corazon', label: 'Corazón', desc: 'Bombea la sangre por todo el cuerpo; en las aves late mucho más rápido que en los mamíferos grandes.', left: 24.2, top: 60.4 },
  { id: 'oviducto', label: 'Oviducto', desc: 'Conduce el óvulo desde el ovario; es donde se forma la cáscara del huevo antes de la puesta.', left: 66.1, top: 56.1 },
  { id: 'higado', label: 'Hígado', desc: 'Produce bilis para digerir grasas y filtra sustancias de la sangre.', left: 23.4, top: 73.2 },
  { id: 'pancreas', label: 'Páncreas', desc: 'Produce enzimas digestivas y hormonas que regulan el metabolismo.', left: 66.9, top: 66.0 },
  { id: 'esternon', label: 'Esternón', desc: 'Hueso plano y grande que ancla los potentes músculos de vuelo.', left: 28.3, top: 81.1 },
  { id: 'molleja', label: 'Molleja', desc: 'Estómago muscular que tritura el alimento —a veces con ayuda de piedrecillas— cumpliendo la función de los dientes, que las aves no tienen.', left: 40.3, top: 81.6 },
  { id: 'ureter', label: 'Uréter', desc: 'Conduce la orina desde el riñón hacia la cloaca.', left: 70.0, top: 72.4 },
  { id: 'cloaca', label: 'Cloaca', desc: 'Abertura final común para los sistemas digestivo, urinario y reproductor de las aves.', left: 55.2, top: 85.1 },
  { id: 'intestino', label: 'Intestino', desc: 'Zona principal de absorción de nutrientes hacia la sangre.', left: 49.8, top: 93.2 }
];

// Perfiles divertidos, chistes de corral, superpoderes biológicos y frases carismáticas
// Diseñado para enriquecer la experiencia de los estudiantes y hacer que cada ficha sea divertida y amigable.
const ANIMAL_FUN_PROFILES = {
  gallo: {
    quote: "¡Kikirikí! Soy el despertador biológico oficial del Liceo B-13. Si te quedas dormido en clases, ¡te canto al oído!",
    joke: {
      question: "¿Por qué el gallo de la granja canta con tanta fuerza a las 6 de la mañana?",
      punchline: "¡Porque si cantara a mediodía, las gallinas se reirían de su cresta despeinada! ⏰🐓 ¡Y para que nadie llegue atrasado a la primera hora!"
    },
    superpower: {
      name: "⚡ Reloj Circadiano de Precisión",
      desc: "Su cerebro posee un cronómetro interno guiado por células fotosensibles que le permite saber cuándo amanece ¡incluso dentro de un gallinero a oscuras!"
    },
    curiosity: "¡Su cresta no es solo adorno! Funciona como un radiador de automóvil: disipa el calor corporal para mantenerlo fresco en las tardes soleadas de Antofagasta."
  },
  gallina: {
    quote: "¡Cloc cloc! Mientras tú estudias para la prueba de ciencias, yo sintetizo cáscaras perfectas con carbonato de calcio. ¡Pura química de corral!",
    joke: {
      question: "¿Qué le dijo una gallina a otra al ver que el profe avisó prueba sorpresa de Ciencias?",
      punchline: "¡Tranquila comadre, si no sabemos la respuesta... ¡por lo menos cacareamos con estilo hasta que toque el timbre! 😂🐔 ¡Y si nos sacamos un 7, ponemos un huevo de oro!"
    },
    superpower: {
      name: "⚡ Visión Tetracromática Ultravioleta",
      desc: "Las gallinas ven en 4 canales de color (nosotros solo 3) y pueden percibir luz ultravioleta para encontrar granos microscópicos e insectos ocultos en el suelo."
    },
    curiosity: "Pueden recordar e identificar más de 100 rostros diferentes entre aves y personas humanas. ¡Saben exactamente quién las cuida con cariño!"
  },
  conejo: {
    quote: "¡Boing boing! Mis orejas no son antenas parabólicas de wifi, ¡pero escucho el crujido de una ramita a 50 metros de distancia!",
    joke: {
      question: "¿Por qué los conejos de la granja son los mejores alumnos en matemáticas?",
      punchline: "¡Porque en menos de tres meses se multiplican que da miedo! 🐰✖️➕ ¡No necesitan ni calculadora científica!"
    },
    superpower: {
      name: "⚡ Radar Auditivo 360° y Cecotrofia",
      desc: "Gira sus orejas hasta 270 grados de forma independiente para vigilar cualquier dirección, y fermenta en su ciego para aprovechar el 100% de la fibra vegetal."
    },
    curiosity: "Cuando un conejo está inmensamente feliz realiza un salto acrobático girando en el aire llamado 'binky'. ¡Es la señal máxima de bienestar animal!"
  },
  catita: {
    quote: "¡Pío pío! Hablo más rápido que tu profesor cuando faltan 2 minutos para que toque el timbre del recreo.",
    joke: {
      question: "¿Qué hace una catita parada encima del router de WiFi del liceo?",
      punchline: "¡Pasa todo el recreo enviando tuits reales sin gastar el plan de datos móviles! 🐦📡 ¡Pío, pío y retuit con décimas!"
    },
    superpower: {
      name: "⚡ Percepción Visual Ultra Rápida",
      desc: "Procesa imágenes a más de 150 fotogramas por segundo (el ojo humano a 60 fps). Para ellas, nosotros nos movemos en cámara lenta."
    },
    curiosity: "Las plumas de su coronilla tienen pigmentos fluorescentes que brillan bajo luz ultravioleta. ¡Entre ellas ven coronas luminosas que nosotros no vemos!"
  },
  agapornis: {
    quote: "¡Los inseparables del B-13! Siempre en pareja, compartiendo semillas y secretos. ¡El amor y la lealtad más linda del aviario!",
    joke: {
      question: "¿Por qué los agapornis nunca juegan a las escondidas en el aviario?",
      punchline: "¡Porque si uno se esconde dos segundos, el otro se desespera, empieza a chillar y le arruina el escondite a todo el colegio! 🦜😂 ¡El amor del corral no sabe guardar secretos!"
    },
    superpower: {
      name: "⚡ Vínculo Monógamo Inquebrantable",
      desc: "Desarrollan lazos de pareja para toda la vida, coordinan sus vocalizaciones y se acicalan mutuamente reduciendo sus niveles de estrés biológico."
    },
    curiosity: "Las hembras cortan tiras perfectas de corteza o papel con el pico y se las meten entre las plumas de la rabadilla como si tuvieran una mochila para llevarlas al nido."
  },
  matias_vicente: {
    quote: "¡Dúo de honor Bantam! Seremos pequeños y esponjosos, pero tenemos más porte, estilo y plumas en las patitas que cualquier modelo de pasarela.",
    joke: {
      question: "¿Por qué Matías y Vicente caminan con el pecho tan inflado por todo el gallinero?",
      punchline: "¡Porque miden apenas 20 centímetros pero juran que son los guardaespaldas oficiales de Jurassic Park! 🦖🐓 ¡Cuidado con los dinosaurios de bolsillo!"
    },
    superpower: {
      name: "⚡ Plumaje Sedoso y Porte Ornamental",
      desc: "Raza Pekín / Bantam japonesa con tarsos emplumados y un temperamento extremadamente dócil y curioso ante las visitas de los estudiantes."
    },
    curiosity: "A pesar de su tamaño compacto, son excelentes guardianes y siempre caminan juntos vigilando cada rincón de su área de descanso."
  },
  nesquik: {
    quote: "¡Hola, soy Nesquik! Tengo pelito café chocolate súper esponjoso, soy algo tímido al inicio pero un amor cuando me traes heno fresco.",
    joke: {
      question: "¿Por qué Nesquik se esconde cada vez que un estudiante abre una mochila en el recreo?",
      punchline: "¡Porque tiene miedo de que lo confundan con un brownie gigante de chocolate y le den un mordisco! 🍫🐰 ¡'Ojo chiquillos: soy conejo zootécnico, no colación escolar'!"
    },
    superpower: {
      name: "⚡ Pelaje Térmico Extra Esponjoso",
      desc: "Su pelaje denso y multicapa lo aísla tanto del frío de la noche como de la radiación diurna del desierto costero."
    },
    curiosity: "Es el conejo decano de la granja (3 años). Prefiere los rincones tranquilos donde puede descansar como una pequeña bolita de chocolate."
  },
  vainilla: {
    quote: "¡Hola! Soy Vainilla, el más tierno y regalón de la conejera. ¡Tengo manchitas café claro en las orejas y me derrito por una caricia suave!",
    joke: {
      question: "¿Cuál es el superpoder secreto de Vainilla el conejo?",
      punchline: "¡Hacerse el profundamente dormido apenas ve que van a limpiar la conejera! 😴🥕 Pero cuando escucha el crujido de heno fresco... ¡milagro, resucitó al segundo!"
    },
    superpower: {
      name: "⚡ Efecto Relajante Antiestrés",
      desc: "Su carácter dócil y ronroneo dental transmiten serenidad y reducen los niveles de estrés en los estudiantes que interactúan con él."
    },
    curiosity: "Es el más veterano con 5 años de sabiduría conejil. Le fascina que le rasquen suavemente entre las orejitas mientras mastica heno."
  },
  tasmi: {
    quote: "¡Aquí viene Tasmi el revoltoso! Si dejas una caja de cartón cerca mío... ¡en 5 minutos será confeti! ¡Energía y saltos al máximo!",
    joke: {
      question: "¿Qué título profesional tiene Tasmi el conejo?",
      punchline: "¡Ingeniero en demolición de cajas de cartón y trituración express de tareas escolares! 📦💥 'Profe, se lo juro por mi vida: mi conejo se comió la cartulina'."
    },
    superpower: {
      name: "⚡ Dientes Autoafilables de Crecimiento Infinito",
      desc: "Sus incisivos crecen hasta 12 cm al año; al roer heno fibroso desgasta sus dientes manteniéndolos perfectamente afilados y sanos."
    },
    curiosity: "¡Tiene 2 años y es el más curioso de la conejera! Siempre busca túneles secretos y esquinas donde esconderse a descansar."
  },
  quesito: {
    quote: "¡Soy Quesito! Blanco como la nieve, con ojitos azules brillantes y súper metiche. ¡Si hay algo nuevo en el corral, yo voy primero a mirar!",
    joke: {
      question: "¿Por qué Quesito tiene los ojos tan abiertos y siempre está asomado en primera fila?",
      punchline: "¡Porque es más copuchento que grupo de WhatsApp del curso! Si pasa algo en la granja, ¡él ya lo sabe antes que la inspectora general! 🧀👀"
    },
    superpower: {
      name: "⚡ Ojos Azules y Curiosidad Suprema",
      desc: "Visión panorámica de alta sensibilidad crepuscular adaptada para distinguir movimientos rápidos tanto de día como al atardecer."
    },
    curiosity: "¡Es el más joven de la pandilla (1 año)! Es el primero en acercarse a la puerta a saludar moviendo la naricita cuando llegan los alumnos."
  },
  vaca: {
    quote: "¡Muuuuuy buenas! Tengo 4 compartimentos estomacales trabajando en equipo. Mientras tú te cansas mascando chicle, ¡yo rumio todo el día feliz!",
    joke: {
      question: "¿Qué le respondió la vaca al estudiante que le preguntó si podía darle leche chocolatada?",
      punchline: "¡Muuuuy gracioso! Si quieres chocolate, cómprate un helado en el kiosko; ¡yo produzco calcio puro y pasto procesado, no milagros de repostería! 🐄🍫"
    },
    superpower: {
      name: "⚡ Rumiación Simbiótica Multicámara",
      desc: "Rumen, retículo, omaso y abomaso con miles de millones de bacterias beneficiosas que convierten pasto fibroso en proteína nutritiva."
    },
    curiosity: "Tienen un sentido del olfato prodigioso: ¡pueden percibir olores de pasto verde y agua fresca a más de 8 kilómetros de distancia!"
  },
  oveja: {
    quote: "¡Beee-nvenidos! Mi lana es la maravilla textil más asombrosa de la naturaleza: térmica, impermeable, transpirable y 100% biodegradable.",
    joke: {
      question: "¿Qué hace una oveja cuando se enoja con las demás en el potrero?",
      punchline: "¡Les hace la ley del hielo y se va balando: '¡No me miren, que me da la lana!' 🐑🧶 ¡Puro drama textil de alta costura!"
    },
    superpower: {
      name: "⚡ Memoria Facial de Rebaño",
      desc: "Pueden recordar y diferenciar más de 50 rostros individuales de ovejas y personas humanas durante más de 2 años sin olvidarlos."
    },
    curiosity: "Sus pupilas son rectangulares y horizontales, otorgándoles un campo visual de casi 300 grados para vigilar depredadores sin mover el cuello."
  },
  pato: {
    quote: "¡Cuak cuak! Mis plumas tienen tecnología impermeable natural. ¡El agua resbala por completo y yo nado seco, ligero y con estilo!",
    joke: {
      question: "¿Qué le dijo un pato al otro antes de tirarse un piquero en el estanque?",
      punchline: "—¡Tírate con confianza, compadre! ¡Si fuéramos gallinas nos daría frío, pero nosotros venimos impermeables de fábrica y con salvavidas incorporado! 🦆💦"
    },
    superpower: {
      name: "⚡ Manto Hidrofóbico Uropígeo",
      desc: "Esparce aceite de su glándula uropígea sobre sus plumas, creando un colchón de aire microscópico que le permite flotar sin esfuerzo alguno."
    },
    curiosity: "Sus patitas no se congelan en agua fría gracias a un intercambiador de calor biológico en sus venas y arterias llamado flujo contracorriente."
  }
};

// Aliases para identificadores en mapas y minijuegos
ANIMAL_FUN_PROFILES.m_rooster = ANIMAL_FUN_PROFILES.gallo;
ANIMAL_FUN_PROFILES.m_gallinas_grupo = ANIMAL_FUN_PROFILES.gallina;
ANIMAL_FUN_PROFILES.m_conejo_grupo = ANIMAL_FUN_PROFILES.conejo;
ANIMAL_FUN_PROFILES.m_matias_vicente = ANIMAL_FUN_PROFILES.matias_vicente;
ANIMAL_FUN_PROFILES.m_catitas = ANIMAL_FUN_PROFILES.catita;
ANIMAL_FUN_PROFILES.m_agapornis = ANIMAL_FUN_PROFILES.agapornis;

const ANIMALS = [
  {
    id: 'gallo', defaultName: 'Gallo', name: 'Gallo', emoji: '🐓', lat: 'Gallus gallus domesticus',
    color: COLORS[0], accessory: 'none', y: 14,
    sound: 'assets/audio/gallo.mp3',
    anatomyImage: 'assets/img/anatomy/gallina.jpg',
    facts: {
      clasificacion: 'Ave, familia Phasianidae. Domesticado a partir del gallo bankiva del sudeste asiático.',
      habitat: 'Vive en corrales o gallineros con acceso a un espacio abierto para escarbar; sus antepasados silvestres habitan bosques y matorrales.',
      alimentacion: 'Omnívoro: granos, semillas, insectos y pequeños invertebrados.',
      agua: 'Necesita agua limpia disponible todo el día; un ave adulta puede beber entre 200 y 300 ml diarios, más en días calurosos.',
      comportamiento: 'Vive en grupos con una jerarquía social conocida como "orden de picoteo"; es diurno y dedica gran parte del día a escarbar el suelo buscando alimento.',
      reproduccion: 'La gallina puede poner un huevo casi a diario; si están fecundados, la incubación dura unos 21 días. Los pollitos nacen cubiertos de plumón y pueden caminar y comer por sí mismos pocas horas después de nacer.',
      cuidados: 'Necesita un gallinero limpio, seco, ventilado y protegido de depredadores, con espacio suficiente para moverse. El hacinamiento y la manipulación brusca afectan su bienestar.',
      dato: 'Un estudio de la Universidad de Nagoya (Japón) mostró que los gallos siguen cantando justo antes del amanecer incluso en oscuridad constante: el canto responde a un ritmo circadiano interno, no solo a la luz externa.'
    },
    organs: [
      { id: 'cresta', label: 'Cresta', desc: 'Estructura carnosa muy irrigada de sangre; ayuda a regular la temperatura del ave y es una señal visual entre gallinas y gallos.', left: 36.6, top: 17.4 },
      { id: 'pico', label: 'Pico', desc: 'Estructura córnea sin dientes que usa para tomar el alimento; la trituración ocurre más adelante, en la molleja.', left: 10.3, top: 33.2 },
      { id: 'pulmones', label: 'Pulmones', desc: 'Órganos respiratorios rígidos conectados a sacos aéreos que hacen la respiración de las aves muy eficiente.', left: 52.1, top: 30.9 },
      { id: 'buche', label: 'Buche', desc: 'Bolsa donde el alimento se almacena y se humedece antes de seguir la digestión; no digiere ni absorbe nutrientes.', left: 17.7, top: 52.4 },
      { id: 'corazon', label: 'Corazón', desc: 'Bombea la sangre por todo el cuerpo; en las aves late mucho más rápido que en los mamíferos grandes.', left: 20.6, top: 60.4 },
      { id: 'higado', label: 'Hígado', desc: 'Produce bilis para digerir grasas y filtra sustancias de la sangre.', left: 23.9, top: 67.4 },
      { id: 'molleja', label: 'Molleja', desc: 'Estómago muscular que tritura el alimento con ayuda de piedrecillas, reemplazando la función de los dientes que las aves no tienen.', left: 33.0, top: 73.4 },
      { id: 'ovario', label: 'Ovario', desc: 'Órgano reproductor donde se forman los óvulos que, fecundados o no, se convertirán en huevos.', left: 89.0, top: 43.5 },
      { id: 'cloaca', label: 'Cloaca', desc: 'Abertura final común para el sistema digestivo, urinario y reproductor de las aves.', left: 89.0, top: 50.8 },
      { id: 'intestinos', label: 'Intestinos', desc: 'Zona principal de absorción de nutrientes hacia la sangre.', left: 82.0, top: 66.2 }
    ],
    quiz: [
      { q: '¿A qué grupo taxonómico y familia pertenece el gallo doméstico?', options: ['Mamíferos carnívoros', 'Aves, familia Phasianidae', 'Reptiles escamosos', 'Anfibios de corral'], a: 1, difficulty: 'facil', points: 10, explain: 'El gallo es un ave galliforme de la familia Phasianidae, domesticado a partir del gallo bankiva.' },
      { q: '¿Qué tipo de alimentación tiene el gallo en la granja?', options: ['Herbívoro estricto', 'Omnívoro (granos, semillas e insectos)', 'Carnívoro estricto', 'Frugívoro exclusivo'], a: 1, difficulty: 'facil', points: 10, explain: 'Consume tanto granos y semillas como pequeños insectos e invertebrados que encuentra escarbando.' },
      { q: '¿Qué controla principalmente el momento en que canta el gallo al amanecer?', options: ['La temperatura del corral', 'Un ritmo circadiano interno', 'El hambre acumulada durante la noche', 'El canto de otras especies de aves'], a: 1, difficulty: 'medio', points: 15, explain: 'Estudios de cronobiología demostraron que el canto responde a un reloj circadiano endógeno independiente de la luz externa.' },
      { q: '¿Qué función fisiológica cumple la cresta muy vascularizada del gallo además del cortejo?', options: ['Audición direccional', 'Termorregulación para disipar calor corporal', 'Almacenamiento de calcio', 'Producción de saliva'], a: 1, difficulty: 'medio', points: 15, explain: 'Al ser un tejido muy irrigado de sangre, la cresta actúa como un radiador que ayuda a regular la temperatura del ave.' },
      { q: 'Dado que las aves carecen de dientes, ¿en qué órgano trituran los granos duros con ayuda de piedrecillas?', options: ['Buche', 'Hígado', 'Molleja (ventrículo muscular)', 'Ciego'], a: 2, difficulty: 'dificil', points: 20, explain: 'La molleja posee potentes paredes musculares y utiliza piedrecillas ingeridas (grit) para pulverizar el alimento fibroso.' },
      { q: 'En la etología de las aves de corral, ¿cómo se denomina su estructura jerárquica social?', options: ['Manada nómada', 'Orden de picoteo', 'Cardumen', 'Enjambre cooperativo'], a: 1, difficulty: 'dificil', points: 20, explain: 'El orden de picoteo es una jerarquía social bien definida que determina prioridades de alimentación, percha y espacio.' }
    ]
  },
  {
    id: 'gallina', defaultName: 'Gallina', name: 'Gallina', emoji: '🐔', lat: 'Gallus gallus domesticus',
    color: COLORS[5], accessory: 'none', y: 45,
    sound: 'assets/audio/gallina.mp3',
    anatomyImage: 'assets/img/anatomy/gallina.jpg',
    facts: {
      clasificacion: 'Ave galliforme, familia Phasianidae.',
      habitat: 'Vive en gallineros con suelo para escarbar, perchas para dormir y nidos limpios y secos.',
      alimentacion: 'Omnívora: granos, semillas, vegetales frescos e insectos.',
      agua: 'Requiere agua fresca y limpia todo el día; consume entre 200 y 400 ml diarios.',
      comportamiento: 'Es muy social; toma baños de tierra para cuidar su plumaje y se comunica con múltiples vocalizaciones.',
      reproduccion: 'Pone huevos casi a diario; la incubación de huevos fecundados dura unos 21 días.',
      cuidados: 'Espacio seco, ventilado, libre de humedad y con sombra en días calurosos.',
      dato: 'Las gallinas pueden comunicarse con más de 24 sonidos y vocalizaciones distintas para alertar a su grupo.'
    },
    organs: [
      { id: 'cresta', label: 'Cresta', desc: 'Estructura carnosa que ayuda a regular la temperatura corporal.', left: 36.6, top: 17.4 },
      { id: 'pico', label: 'Pico', desc: 'Estructura córnea adaptada para picotear granos e insectos.', left: 10.3, top: 33.2 },
      { id: 'pulmones', label: 'Pulmones', desc: 'Órganos respiratorios rígidos conectados a sacos aéreos.', left: 52.1, top: 30.9 },
      { id: 'buche', label: 'Buche', desc: 'Almacena y humedece el alimento antes de la digestión.', left: 17.7, top: 52.4 },
      { id: 'corazon', label: 'Corazón', desc: 'Bombea la sangre rápidamente por todo el cuerpo.', left: 20.6, top: 60.4 },
      { id: 'higado', label: 'Hígado', desc: 'Produce bilis y procesa nutrientes esenciales.', left: 23.9, top: 67.4 },
      { id: 'molleja', label: 'Molleja', desc: 'Estómago muscular que tritura los granos duros.', left: 33.0, top: 73.4 },
      { id: 'ovario', label: 'Ovario', desc: 'Donde se forman los óvulos que darán origen a los huevos.', left: 89.0, top: 43.5 },
      { id: 'cloaca', label: 'Cloaca', desc: 'Abertura final común para digestión, orina y postura.', left: 89.0, top: 50.8 },
      { id: 'intestinos', label: 'Intestinos', desc: 'Zona principal de absorción de nutrientes.', left: 82.0, top: 66.2 }
    ],
    quiz: [
      { q: '¿Cuánto dura en promedio el período de incubación de un huevo de gallina?', options: ['7 días', '21 días', '45 días', '60 días'], a: 1, difficulty: 'facil', points: 10, explain: 'Los huevos fecundados de gallina tardan 21 días de incubación constante para que los pollitos eclosionen.' },
      { q: '¿Por qué las gallinas toman baños de tierra o arena en el suelo?', options: ['Para cuidar sus plumas y limpiarse de parásitos', 'Porque no les gusta el agua fresca', 'Para mudar de plumaje en invierno', 'Para esconderse de depredadores'], a: 0, difficulty: 'facil', points: 10, explain: 'Los baños de tierra les permiten regular la grasa de sus plumas y prevenir o eliminar ectoparásitos como ácaros y piojillos.' },
      { q: '¿Qué órgano del sistema digestivo de la gallina almacena temporalmente y reblandece el alimento ingerido?', options: ['El buche', 'El páncreas', 'El riñón', 'El corazón'], a: 0, difficulty: 'medio', points: 15, explain: 'El buche es una dilatación esofágica que humedece y almacena los granos antes de que pasen a la molleja y digestión química.' },
      { q: '¿Qué mineral es imprescindible asegurar en la dieta de las gallinas ponedoras para formar cáscaras de huevo resistentes?', options: ['Hierro', 'Calcio (carbonato de calcio)', 'Sodio', 'Potasio'], a: 1, difficulty: 'medio', points: 15, explain: 'La cáscara de huevo está compuesta casi en su totalidad por carbonato de calcio; su deficiencia produce huevos frágiles.' },
      { q: '¿Qué cámara anatómica terminal común reúne las funciones digestiva, urinaria y reproductora en las gallinas?', options: ['Vejiga urinaria', 'Cloaca', 'Uréter ventral', 'Colon transverso'], a: 1, difficulty: 'dificil', points: 20, explain: 'Las aves poseen cloaca, un orificio y cámara común por donde expulsan desechos digestivos, orina concentrada y huevos.' },
      { q: 'Los pollitos nacen cubiertos de plumón, con ojos abiertos y comen por sí mismos en pocas horas. ¿Cómo se clasifica biológicamente este tipo de desarrollo?', options: ['Altricial o dependiente', 'Precocial o nidífugo', 'Marsupial', 'Larvario'], a: 1, difficulty: 'dificil', points: 20, explain: 'Las crías precociales o nidífugas nacen en un estado avanzado de desarrollo y movilidad, a diferencia de especies altriciales que nacen indefensas en el nido.' }
    ]
  },
  {
    id: 'conejo', defaultName: 'Conejo', name: 'Conejo', emoji: '🐇', lat: 'Oryctolagus cuniculus',
    color: COLORS[1], accessory: 'none', y: 60,
    sound: 'assets/audio/conejo.mp3',
    anatomyImage: 'assets/img/anatomy/conejo.jpg',
    facts: {
      clasificacion: 'Mamífero lagomorfo (no roedor), familia Leporidae.',
      habitat: 'Excava madrigueras en el suelo; en estado silvestre habita praderas, campos abiertos y zonas de vegetación baja.',
      alimentacion: 'Herbívoro estricto: pastos, heno y fibra vegetal.',
      agua: 'Debe tener agua limpia disponible en todo momento; un conejo adulto puede beber entre 50 y 150 ml por kilo de peso al día.',
      comportamiento: 'Es un animal social que vive en grupos; es más activo al amanecer y al atardecer (hábito crepuscular).',
      reproduccion: 'La gestación dura entre 28 y 31 días. Las crías nacen sin pelo, ciegas y totalmente dependientes de la madre (son altriciales), a diferencia de otros animales de la granja.',
      cuidados: 'Necesita heno disponible siempre para desgastar sus dientes, un espacio amplio para moverse, y evitar ruidos fuertes o manipulación brusca que le generan estrés.',
      dato: 'Practica cecotrofia: produce heces blandas ricas en nutrientes (vitaminas B y K, proteína bacteriana) que reingiere directamente, obteniendo así una segunda digestión. Sin este proceso desarrollaría deficiencias nutricionales.'
    },
    organs: [
      { id: 'boca', label: 'Boca', desc: 'Primer punto de contacto con el alimento. Los dientes del conejo crecen durante toda su vida, por eso necesita roer fibra constantemente para desgastarlos.', left: 93.3, top: 65.3 },
      { id: 'glandulasalival', label: 'Glándula salival', desc: 'Produce saliva que humedece el alimento y comienza a descomponer los carbohidratos antes de tragar.', left: 88.4, top: 5.7 },
      { id: 'faringe', label: 'Faringe', desc: 'Conduce el alimento masticado desde la boca hacia el esófago.', left: 62.5, top: 3.2 },
      { id: 'esofago', label: 'Esófago', desc: 'Tubo muscular que transporta el alimento desde la faringe hasta el estómago.', left: 79.1, top: 85.7 },
      { id: 'pancreas', label: 'Páncreas', desc: 'Produce enzimas digestivas y hormonas (como la insulina) que regulan el metabolismo.', left: 25.9, top: 15.8 },
      { id: 'higado', label: 'Hígado', desc: 'Produce bilis, que ayuda a digerir las grasas, y filtra sustancias de la sangre.', left: 51.3, top: 15.8 },
      { id: 'estomago', label: 'Estómago', desc: 'En el conejo tiene paredes delgadas y casi nunca está vacío; mezcla el alimento con jugos gástricos.', left: 55.2, top: 83.5 },
      { id: 'intestinodelgado', label: 'Intestino delgado', desc: 'Absorbe la mayoría de los nutrientes hacia la sangre antes de que el resto pase al intestino grueso.', left: 42.0, top: 92.4 },
      { id: 'intestinogrueso', label: 'Intestino grueso', desc: 'Incluye el ciego, una gran cámara de fermentación donde bacterias descomponen la fibra y producen los cecotrofos —heces blandas ricas en nutrientes— que el conejo reingiere.', left: 19.0, top: 92.4 },
      { id: 'ano', label: 'Ano', desc: 'Salida final del sistema digestivo. Por aquí el conejo reingiere los cecotrofos apenas los expulsa: la cecotrofia.', left: 7.3, top: 83.5 }
    ],
    quiz: [
      { q: '¿A qué orden taxonómico pertenece el conejo doméstico?', options: ['Roedores (Rodentia)', 'Lagomorfos (Lagomorpha)', 'Carnívoros (Carnivora)', 'Marsupiales (Marsupialia)'], a: 1, difficulty: 'facil', points: 10, explain: 'El conejo no es un roedor; es un lagomorfo y posee cuatro dientes incisivos superiores en lugar de dos.' },
      { q: '¿Por qué es indispensable que el conejo tenga heno seco y fibra en abundancia en todo momento?', options: ['Para desgastar sus dientes que crecen toda la vida y asegurar su motilidad digestiva', 'Para cambiar de color de pelaje estacionalmente', 'Para evitar tener que beber agua', 'Para dormir más profundamente'], a: 0, difficulty: 'facil', points: 10, explain: 'Sus incisivos y molares crecen sin parar; la fibra del heno asegura el desgaste mecánico dental y previene estasis intestinal.' },
      { q: '¿Qué patrón de actividad biológica (ritmo circadiano) caracteriza naturalmente a los conejos?', options: ['Diurno estricto', 'Crepuscular (más activos al amanecer y al atardecer)', 'Nocturno absoluto', 'Hibernante anual'], a: 1, difficulty: 'medio', points: 15, explain: 'Como presa silvestre, el conejo concentra su mayor actividad al amanecer y atardecer cuando la visibilidad de depredadores es menor.' },
      { q: '¿Qué es el proceso fisiológico de la cecotrofia en los conejos?', options: ['Un tipo de hibernación invernal', 'La reingestión de heces blandas ricas en nutrientes producidas en el ciego', 'Una infección bacteriana dental', 'La muda anual del pelaje'], a: 1, difficulty: 'medio', points: 15, explain: 'Es una adaptación digestiva vital: el conejo ingiere cecotrofos directamente del ano para absorber vitamina B, K y proteínas bacterianas.' },
      { q: 'A diferencia de los pollitos precociales, los gazapos (crías de conejo) nacen ciegos, sin pelo e indefensos. ¿Qué término describe este patrón?', options: ['Altricial o nidícola', 'Precocial o nidífugo', 'Autosuficiente', 'Metamórfico'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las crías altriciales nacen completamente indefensas y requieren protección y calor materno en la madriguera durante sus primeras semanas.' },
      { q: '¿Qué consecuencia clínica grave puede tener en un conejo la exposición a ruidos súbitos, gritos o manipulación brusca?', options: ['Aumento saludable de peso', 'Parada gastrointestinal o shock por estrés extremo', 'Mejora en su velocidad de escape', 'Pérdida temporal de la visión nocturna'], a: 1, difficulty: 'dificil', points: 20, explain: 'Por su fisiología de presa altamente reactiva, el estrés extremo libera catecolaminas que pueden paralizar su motilidad intestinal o inducir shock.' }
    ]
  },
  {
    id: 'vaca', defaultName: 'Vaca', name: 'Vaca', emoji: '🐄', lat: 'Bos taurus',
    color: COLORS[2], accessory: 'none', y: 110,
    facts: {
      clasificacion: 'Mamífero rumiante, familia Bovidae.',
      habitat: 'Vive en praderas y potreros con acceso a pasto, agua y refugio.',
      alimentacion: 'Herbívora; fermenta la fibra vegetal con ayuda de microorganismos en su estómago.',
      agua: 'Puede beber entre 30 y 50 litros de agua al día (o más en climas cálidos o si produce leche), por lo que necesita acceso constante a agua limpia.',
      comportamiento: 'Es un animal gregario que pasta en grupo y establece vínculos sociales estables; dedica gran parte del día a rumiar y descansar.',
      reproduccion: 'La gestación dura alrededor de 9 meses (283 días en promedio) y normalmente nace una sola cría (ternero), que logra ponerse de pie y caminar a los pocos minutos u horas de nacer.',
      cuidados: 'Necesita espacio para pastar y moverse, sombra o refugio ante el clima extremo, y control veterinario periódico. El manejo brusco o los ruidos fuertes también pueden generarle estrés.',
      dato: 'Su estómago tiene cuatro compartimentos (rumen, retículo, omaso y abomaso). En el rumen, microorganismos fermentan la celulosa antes de que el alimento vuelva a masticarse ("rumiar").'
    },
    organs: [
      { id: 'esofago', label: 'Esófago', desc: 'Tubo por el que el alimento va y vuelve entre la boca y el rumen durante la rumia.', x: 0.16, rx: 12, ry: 6, color: '#D8C9A3' },
      { id: 'rumen', label: 'Rumen', desc: 'El más grande de los cuatro compartimentos. Aquí microorganismos fermentan la celulosa del pasto antes de que se remastique.', x: 0.36, rx: 34, ry: 26, color: '#A94A3D' },
      { id: 'reticulo', label: 'Retículo', desc: 'Compartimento pequeño y contiguo al rumen; ayuda a separar partículas grandes que deben volver a masticarse.', x: 0.55, rx: 12, ry: 11, color: '#C97B4A' },
      { id: 'omaso', label: 'Omaso', desc: 'Absorbe agua y ácidos grasos del contenido antes de pasar al último compartimento.', x: 0.66, rx: 13, ry: 12, color: '#E3A83B' },
      { id: 'abomaso', label: 'Abomaso', desc: '"Estómago verdadero": secreta ácido y enzimas, similar al estómago de un mamífero no rumiante.', x: 0.78, rx: 16, ry: 13, color: '#7FA05C' },
      { id: 'intestino', label: 'Intestino', desc: 'Continúa la absorción de nutrientes hacia la sangre.', x: 0.92, rx: 14, ry: 9, color: '#435E3A' }
    ],
    quiz: [
      { q: '¿Qué tipo de régimen alimentario y digestivo tiene la vaca doméstica?', options: ['Herbívoro monogástrico', 'Herbívoro rumiante poligástrico', 'Omnívoro estricto', 'Carnívoro carroñero'], a: 1, difficulty: 'facil', points: 10, explain: 'La vaca es un rumiante: posee un sistema digestivo adaptado para digerir fibra vegetal mediante fermentación microbiana.' },
      { q: '¿Cuántos compartimentos integran el complejo estomacal de la vaca?', options: ['Uno', 'Dos', 'Tres', 'Cuatro (rumen, retículo, omaso y abomaso)'], a: 3, difficulty: 'facil', points: 10, explain: 'Cuenta con cuatro cavidades comunicadas: rumen, retículo, omaso y abomaso.' },
      { q: '¿En cuál de los cuatro compartimentos ocurre la mayor fermentación de celulosa mediada por bacterias y protozoos?', options: ['En el rumen (panza)', 'En el esófago ventral', 'En el colon ascendente', 'En la vesícula'], a: 0, difficulty: 'medio', points: 15, explain: 'El rumen es una gran cuba de fermentación donde millones de microorganismos descomponen la celulosa del pasto.' },
      { q: '¿Cuál de los cuatro compartimentos es considerado el "estómago verdadero" por secretar ácido clorhídrico y enzimas?', options: ['El retículo', 'El omaso', 'El abomaso (cuajar)', 'El rumen'], a: 2, difficulty: 'medio', points: 15, explain: 'El abomaso cumple la función gástrica ácida equivalente al estómago de mamíferos monogástricos como el ser humano.' },
      { q: '¿Cuánto dura en promedio el período de gestación de una vaca antes del nacimiento de su ternero?', options: ['3 meses', '6 meses', 'Aproximadamente 9 meses (283 días)', '14 meses'], a: 2, difficulty: 'dificil', points: 20, explain: 'La gestación bovina dura aproximadamente 280 a 285 días (unos 9 meses), naciendo usualmente una sola cría.' },
      { q: '¿Qué volumen promedio diario de agua limpia requiere una vaca adulta en producción o climas cálidos?', options: ['De 1 a 2 litros', 'De 5 a 10 litros', 'De 40 a 100 litros diarios', 'No necesita beber agua si come pasto fresco'], a: 2, difficulty: 'dificil', points: 20, explain: 'Por su gran masa corporal y procesos de fermentación y lactancia, consume entre 40 y 100 litros de agua limpia al día.' }
    ]
  },
  {
    id: 'oveja', defaultName: 'Oveja', name: 'Oveja', emoji: '🐑', lat: 'Ovis aries',
    color: COLORS[3], accessory: 'none', y: 158,
    facts: {
      clasificacion: 'Mamífero rumiante, familia Bovidae.',
      habitat: 'Vive en praderas abiertas con acceso a pasto y refugio ante condiciones climáticas extremas.',
      alimentacion: 'Herbívora; pasta hierbas bajas y forraje.',
      agua: 'Necesita agua limpia disponible permanentemente; puede beber entre 4 y 10 litros al día, dependiendo del clima y de si está amamantando.',
      comportamiento: 'Tiene un fuerte instinto de rebaño y sigue al grupo como estrategia de protección frente a depredadores; pasta principalmente durante el día.',
      reproduccion: 'La gestación dura alrededor de 5 meses (147 a 152 días). Generalmente nace una o dos crías (corderos), que logran ponerse de pie y seguir a la madre pocos minutos después de nacer.',
      cuidados: 'Necesita esquila periódica para evitar problemas de calor o suciedad en su lana, refugio ante lluvia intensa, y espacio para pastar y moverse en grupo.',
      dato: 'Su lana crece de forma continua durante toda la vida, a diferencia del pelaje de muchos otros mamíferos que se muda estacionalmente; por eso requiere esquila periódica.'
    },
    organs: [
      { id: 'esofago', label: 'Esófago', desc: 'Tubo por el que el alimento va y vuelve entre la boca y el rumen durante la rumia.', x: 0.16, rx: 11, ry: 6, color: '#D8C9A3' },
      { id: 'rumen', label: 'Rumen', desc: 'Compartimento más grande; microorganismos fermentan la celulosa del pasto antes de la remasticación.', x: 0.36, rx: 30, ry: 23, color: '#A94A3D' },
      { id: 'reticulo', label: 'Retículo', desc: 'Compartimento pequeño junto al rumen que ayuda a separar partículas grandes.', x: 0.55, rx: 11, ry: 10, color: '#C97B4A' },
      { id: 'omaso', label: 'Omaso', desc: 'Absorbe agua y ácidos grasos antes del último compartimento.', x: 0.66, rx: 12, ry: 11, color: '#E3A83B' },
      { id: 'abomaso', label: 'Abomaso', desc: '"Estómago verdadero": secreta ácido y enzimas digestivas.', x: 0.78, rx: 14, ry: 12, color: '#7FA05C' },
      { id: 'intestino', label: 'Intestino', desc: 'Continúa la absorción de nutrientes hacia la sangre.', x: 0.92, rx: 13, ry: 8, color: '#435E3A' }
    ],
    quiz: [
      { q: '¿A qué familia taxonómica pertenece la oveja doméstica (Ovis aries)?', options: ['Bovidae (bóvidos)', 'Felidae (felinos)', 'Suidae (suidos)', 'Equidae (équidos)'], a: 0, difficulty: 'facil', points: 10, explain: 'Al igual que la vaca y la cabra, la oveja pertenece a la familia Bovidae dentro de los rumiantes.' },
      { q: '¿Por qué la oveja doméstica necesita esquila periódica realizada por cuidadores humanos?', options: ['Porque su lana crece de forma continua sin muda estacional', 'Porque la lana cambia de especie cada mes', 'Para evitar que vuele con el viento', 'Porque no puede regular su ritmo cardíaco'], a: 0, difficulty: 'facil', points: 10, explain: 'A diferencia de sus ancestros silvestres, la lana de las razas ovinas domésticas no muda de forma natural y crece continuamente.' },
      { q: '¿Qué rasgo etológico de protección grupal caracteriza fuertemente a las ovejas?', options: ['Vida solitaria y territorial', 'Fuerte instinto de rebaño y cohesión gregaria', 'Comportamiento carroñero nocturno', 'Migraciones oceánicas'], a: 1, difficulty: 'medio', points: 15, explain: 'El gregarismo e instinto de rebaño es su principal defensa evolutiva frente a depredadores, manteniéndose siempre unidas.' },
      { q: '¿Cuánto dura aproximadamente la gestación de una oveja antes del nacimiento de los corderos?', options: ['30 días', 'Aproximadamente 5 meses (147 a 152 días)', '12 meses', '18 meses'], a: 1, difficulty: 'medio', points: 15, explain: 'La preñez de la oveja dura cerca de 5 meses (150 días en promedio), tras lo cual nace una o dos crías.' },
      { q: '¿Qué función cumple principalmente el omaso en el tracto digestivo de los rumiantes como la oveja?', options: ['Producir bilis alcalina', 'Absorber agua, ácidos grasos volátiles y minerales del alimento', 'Almacenar huesos', 'Triturar mecánicamente con dientes'], a: 1, difficulty: 'dificil', points: 20, explain: 'El omaso, compuesto por múltiples láminas o pliegues, deshidrata el bolo fermentado reabsorbiendo agua y bicarbonato.' },
      { q: 'En el bienestar animal ovino, ¿qué afección grave se previene manteniendo la lana limpia, seca y libre de humedad fecal?', options: ['Miasis cutánea (infección por larvas de moscas)', 'Resfriado común aviar', 'Crecimiento de caparazón', 'Dientes supernumerarios'], a: 0, difficulty: 'dificil', points: 20, explain: 'La humedad y materia orgánica en la lana atraen moscas que depositan huevos provocando miasis dolorosas y peligrosas.' }
    ]
  },
  {
    id: 'catita', defaultName: 'Catita', name: 'Catita', emoji: '🦜', lat: 'Melopsittacus undulatus',
    color: COLORS[4], accessory: 'none', y: 90,
    sound: 'assets/audio/aves.mp3',
    anatomyImage: 'assets/img/anatomy/ave-general.jpg',
    facts: {
      clasificacion: 'Ave, orden Psittaciformes (loros), familia Psittaculidae. Periquito pequeño originario de Australia.',
      habitat: 'En estado silvestre habita el interior árido de Australia (matorrales y praderas abiertas) y anida en huecos de árboles.',
      alimentacion: 'Principalmente granívora: semillas de pastos; en cautiverio se complementa con frutas, verduras y pellets.',
      agua: 'Necesita agua limpia disponible todos los días; suele beber por la mañana y puede tomar hasta un 5% de su peso corporal en agua al día.',
      comportamiento: 'Es muy social y gregaria: en libertad forma bandadas nómadas que siguen las lluvias y pueden juntar miles de aves; se acicala mutuamente con sus compañeras.',
      reproduccion: 'Es monógama. La hembra incuba entre 4 y 6 huevos durante unos 18 días mientras el macho la alimenta; los pichones dejan el nido entre 4 y 5 semanas después de nacer.',
      cuidados: 'Necesita una jaula amplia para volar, compañía (es muy social) y una dieta variada —no solo semillas— además de juguetes u objetos para explorar.',
      dato: 'Su nombre científico, Melopsittacus undulatus, combina el griego y el latín para decir algo así como "periquito melodioso de alas onduladas"; en libertad puede formar bandadas nómadas de miles de aves que siguen la lluvia en busca de semillas.'
    },
    organs: AVE_ORGANS,
    quiz: [
      { q: '¿De qué ecosistema y continente es originaria en libertad la catita (periquito australiano)?', options: ['Selvas amazónicas de Brasil', 'Sabana africana', 'Interior árido y praderas de Australia', 'Bosques templados de Europa'], a: 2, difficulty: 'facil', points: 10, explain: 'Melopsittacus undulatus es endémico de las zonas áridas e interiores del continente australiano.' },
      { q: '¿Cuánto dura en promedio el período de incubación de los huevos de una catita?', options: ['5 días', 'Aproximadamente 18 días', '45 días', '60 días'], a: 1, difficulty: 'facil', points: 10, explain: 'La hembra incuba la postura durante unos 18 días dentro de oquedades de árboles o nidos protegidos.' },
      { q: '¿Cómo se desplazan y organizan las catitas en su hábitat silvestre en Australia?', options: ['Son solitarias durante toda su vida', 'Forman grandes bandadas nómadas que siguen las lluvias en busca de semillas', 'Viven fijas en un solo arbusto', 'Nadan en lagos de agua dulce'], a: 1, difficulty: 'medio', points: 15, explain: 'Son aves muy gregarias y nómadas; se desplazan en bandadas de cientos o miles de individuos siguiendo los brotes vegetales tras las lluvias.' },
      { q: '¿Por qué no es saludable alimentar a una catita únicamente con semillas en su jaula?', options: ['Porque las semillas carecen de calcio y vitaminas esenciales (A, D) y aportan exceso de grasas', 'Porque no tienen pico para abrirlas', 'Porque las semillas son tóxicas de inmediato', 'Porque prefieren comer carne cruda'], a: 0, difficulty: 'medio', points: 15, explain: 'Una dieta de solo semillas provoca hipovitaminosis A, problemas óseos e hígado graso; requiere verduras frescas y pellets.' },
      { q: '¿Qué estructura anatómica del esternón en las aves voladoras brinda fijación a la musculatura de vuelo?', options: ['Fémur distal', 'Quilla o carena esternal', 'Pelvis fusionada', 'Vértebras cervicales'], a: 1, difficulty: 'dificil', points: 20, explain: 'La quilla es una proyección laminar anterior del esternón que proporciona amplia superficie a los músculos pectorales de vuelo.' },
      { q: '¿Qué característica hace al sistema respiratorio de las aves más eficiente que el de los mamíferos?', options: ['Tienen cuatro pulmones en vez de dos', 'Poseen sacos aéreos que permiten un flujo de aire unidireccional y continuo', 'Respiran a través de las plumas', 'No consumen oxígeno en altitud'], a: 1, difficulty: 'dificil', points: 20, explain: 'Los sacos aéreos actúan como fuelles que mantienen flujo unidireccional permanente de oxígeno durante inhalación y exhalación.' }
    ]
  },
  {
    id: 'agapornis', defaultName: 'Agapornis', name: 'Agapornis', emoji: '🦜', lat: 'Agapornis roseicollis',
    color: COLORS[5], accessory: 'none', y: 90,
    sound: 'assets/audio/aves.mp3',
    anatomyImage: 'assets/img/anatomy/ave-general.jpg',
    facts: {
      clasificacion: 'Ave, orden Psittaciformes (loros), familia Psittaculidae, género Agapornis. La especie más común como mascota es el agapornis cachetes rosados (Agapornis roseicollis), originario del sur de África.',
      habitat: 'En estado silvestre habita bosques abiertos, matorrales y zonas rocosas áridas del sur de África, cerca de fuentes de agua.',
      alimentacion: 'Granívora y frugívora: semillas, frutas y verduras. Una dieta solo a base de semillas es pobre en proteínas y vitaminas.',
      agua: 'Necesita agua limpia a diario; le gusta bañarse con frecuencia.',
      comportamiento: 'Es muy social y forma parejas monógamas para toda la vida que pasan gran parte del día acicalándose y posadas una junto a la otra; existen muchas variedades de color creadas en cautiverio.',
      reproduccion: 'La hembra incuba entre 4 y 6 huevos durante unos 18 a 24 días; los pichones dejan el nido entre 5 y 7 semanas después de nacer.',
      cuidados: 'Al ser tan sociales, su bienestar mejora si viven en pareja o grupo, con una jaula amplia, juguetes para explorar y una dieta variada más allá de solo semillas.',
      dato: 'Su nombre en español, "inseparables", y el nombre del género, Agapornis (del griego agape, amor, y ornis, ave), describen su comportamiento más característico: las parejas se mantienen unidas de por vida y hasta duermen posadas una junto a la otra.'
    },
    organs: AVE_ORGANS,
    quiz: [
      { q: '¿Por qué al género Agapornis se le conoce en español como "inseparables"?', options: ['Porque están unidos físicamente al nacer', 'Porque establecen parejas monógamas estrechas de por vida que se acicalan juntas', 'Porque nunca se separan del suelo', 'Porque no pueden volar de forma individual'], a: 1, difficulty: 'facil', points: 10, explain: 'Del griego agape (amor) y ornis (ave), forman vínculos monógamos muy sólidos y pasan gran parte del tiempo juntos.' },
      { q: '¿De qué continente es originaria la gran mayoría de las especies de agapornis?', options: ['África', 'Oceanía', 'América del Sur', 'Asia septentrional'], a: 0, difficulty: 'facil', points: 10, explain: 'Ocho de las nueve especies de Agapornis son nativas del continente africano y una de Madagascar.' },
      { q: '¿Qué tipo de enriquecimiento ambiental es vital para el bienestar psicológico de un agapornis?', options: ['Dejarlo completamente solo en silencio', 'Juguetes para forrajeo, ramas naturales seguras para trepar y roer, y compañía', 'Evitar todo tipo de estímulo visual', 'Mantenerlo a oscuras todo el día'], a: 1, difficulty: 'medio', points: 15, explain: 'Al ser psitácidos inteligentes y muy sociales, el enriquecimiento con ramas, interacción y forrajeo previene el estrés y picaje.' },
      { q: '¿Qué vegetales frescos seguros aportan micronutrientes indispensables para su plumaje y defensas?', options: ['Hojas verdes oscuras (acelga, espinaca), brócoli y zanahoria', 'Chocolate y café concentrado', 'Cebolla cruda y ajo picante', 'Papas crudas con brotes verdes'], a: 0, difficulty: 'medio', points: 15, explain: 'Las hojas verdes, zanahoria y brócoli aportan betacarotenos y minerales, mientras que el chocolate, cebolla y palta son tóxicos.' },
      { q: '¿Qué particularidad biomecánica posee el pico de los loros y agapornis respecto a su cráneo (cinesis craneal)?', options: ['El pico está soldado sin movimiento', 'La mandíbula superior posee una articulación móvil con el cráneo que aumenta su fuerza de palanca', 'No tiene capacidad para cortar semillas', 'Carece de inervación táctil sensitiva'], a: 1, difficulty: 'dificil', points: 20, explain: 'La cinesis craneal les permite mover la mandíbula superior hacia arriba independientemente del cráneo, generando gran fuerza prensil.' },
      { q: '¿Cómo transportan algunas hembras de agapornis el material vegetal para construir su nido?', options: ['Lo cargan empujándolo con las patas', 'Ensartan tiras de corteza y hojas entre las plumas de la rabadilla u obispillo', 'Lo tragan y lo regurgitan intacto', 'Solo usan barro húmedo'], a: 1, difficulty: 'dificil', points: 20, explain: 'Especies como Agapornis roseicollis cortan tiras de hojas o papel y las ensartan entre las plumas de su espalda para volar con ellas.' }
    ]
  },
  {
    id: 'pato', defaultName: 'Pato', name: 'Pato de la Granja', emoji: '🦆', lat: 'Anas platyrhynchos domesticus',
    color: COLORS[4], accessory: 'none', y: 70,
    sound: 'assets/audio/aves.mp3',
    anatomyImage: 'assets/img/anatomy/ave-general.jpg',
    facts: {
      clasificacion: 'Ave acuática anseriforme, familia Anatidae. Domesticado a partir del ánade real.',
      habitat: 'Estanques, orillas de agua y praderas húmedas con zonas de sombra y refugio limpio.',
      alimentacion: 'Omnívoro acuático: forrajea hierbas tiernas, semillas, algas, gusanos e insectos.',
      agua: 'Indispensable: requiere agua limpia lo suficientemente profunda para sumergir la cabeza completa y lavar sus ojos y narinas.',
      comportamiento: 'Muy gregario y sociable; le encanta chapotear y acicalar su plumaje con la grasa de su glándula uropígea.',
      reproduccion: 'La pata pone huevos con cáscara gruesa y cutícula cérea protectora. La incubación dura unos 28 días.',
      cuidados: 'Prohibido alimentar con pan blanco o masas refinadas (causa deformidad de ala de ángel). Necesita suelo no abrasivo y agua limpia.',
      dato: 'Posee una glándula uropígea sobre la base de la cola que secreta un aceite que esparce con su pico por todas las plumas para flotar e impermeabilizarse.'
    },
    organs: AVE_ORGANS,
    quiz: []
  },
  {
    id: 'matias_vicente', defaultName: 'Matías y Vicente', name: 'Gallitos Japoneses', emoji: '🐓', lat: 'Gallus gallus domesticus (var. Chabo / Bantam)',
    color: COLORS[0], accessory: 'none', y: 35,
    sound: 'assets/audio/gallina.mp3',
    anatomyImage: 'assets/img/anatomy/gallina.jpg',
    facts: {
      clasificacion: 'Ave galliforme ornamental de raza enana (Bantam o Chabo japonés).',
      habitat: 'Gallinero protegido con camas de viruta o paja seca y perchas a baja altura.',
      alimentacion: 'Omnívoros: semillas seleccionadas, granos partidos, forraje verde y pequeños invertebrados.',
      agua: 'Agua fresca en bebederos estables y a baja altura acordes a su tamaño reducido.',
      comportamiento: 'Dóciles, sociables con los estudiantes y de porte erguido con plumas en las patas.',
      reproduccion: 'Similar a las gallinas criollas pero en huevos de menor tamaño. Incubación de 21 días.',
      cuidados: 'Sus patas emplumadas requieren suelo seco para no acumular barro o humedad que dañe su piel.',
      dato: 'A pesar de ser gallitos machos, Matías y Vicente conviven en total armonía porque crecieron juntos y mantienen una jerarquía pacífica en la granja del B-13.'
    },
    organs: [
      { id: 'cresta', label: 'Cresta erguida', desc: 'Cresta carnosa roja que regula su temperatura y disipa calor corporal.', left: 36.6, top: 17.4 },
      { id: 'buche', label: 'Buche', desc: 'Almacena y humedece el grano antes de la trituración.', left: 17.7, top: 52.4 },
      { id: 'molleja', label: 'Molleja', desc: 'Estómago muscular con piedrecillas para moler el alimento.', left: 33.0, top: 73.4 },
      { id: 'patas_emplumadas', label: 'Patas emplumadas', desc: 'Característica ornamental de la raza que exige suelo seco y limpio.', left: 55.0, top: 85.0 }
    ],
    quiz: []
  }
];

/* ============================================================
   Curiosidades y Pistas de Campo para el Potrero (Bocadillos interactivos)
   ============================================================ */
const CURIOSITIES = {
  conejo: [
    '🐰 ¡El 80% de mi dieta debe ser heno seco! La fibra desgasta mis dientes, que nunca paran de crecer.',
    '🐰 ¿Sabías que practico cecotrofia? Produzco heces blandas especiales y las reingiero para absorber vitaminas B y K.',
    '🐰 ¡Nunca me bañes con agua! Mi pelaje tarda mucho en secar y puedo sufrir un shock térmico o neumonía.',
    '🐰 Mis orejas largas no solo me permiten escuchar a distancia: ¡también me ayudan a regular mi temperatura corporal!',
    '🐰 Soy un animal crepuscular: mis horas de mayor energía y apetito son el amanecer y el atardecer.',
    '🐰 Los ruidos fuertes me provocan un estrés severo que puede llegar a detener los movimientos de mi intestino.',
    '🐰 Mis crías (gazapos) nacen ciegas, sin pelo e indefensas: son crías altriciales.',
    '🐰 En mi intestino tengo un gran ciego fermentador donde bacterias amigas descomponen la celulosa.'
  ],
  gallina: [
    '🐔 ¡No tengo dientes! En mi molleja acumulo piedrecillas (grit) que trituran los granos como si fueran muelas.',
    '🐔 ¡Me encantan los baños de tierra y arena! Así elimino ácaros, parásitos y mantengo limpias mis plumas.',
    '🐔 Mi buche es una bolsita en el cuello donde almaceno y humedezco el alimento antes de digerirlo.',
    '🐔 Necesito calcio (como conchuela molida) para que la cáscara de mis huevos se forme fuerte y sana.',
    '🐔 Tengo cloaca: un único orificio por donde expulso desechos, orina y por donde salen los huevos.',
    '🐔 Mis pollitos nacen con plumón, ojos abiertos y comen por sí mismos en pocas horas: son precociales.',
    '🐔 Nos comunicamos con más de 24 sonidos y cacareos diferentes para alertar de comida o peligros.',
    '🐔 En otoño realizo una muda de plumas estacional para renovar mi plumaje antes del frío.'
  ],
  gallo: [
    '🐓 Mi canto al amanecer responde a mi reloj circadiano interno, ¡no solo a la salida del sol!',
    '🐓 Mi gran cresta roja está llena de vasos sanguíneos: actúa como un radiador para enfriar mi sangre en días calurosos.',
    '🐓 En mis patas tengo espolones córneos y afilados que utilizo para proteger al gallinero de posibles amenazas.',
    '🐓 Cuido a la parvada con cantos de alarma distintos si el peligro viene por el aire o por tierra.',
    '🐓 Tengo plumas curvadas en forma de hoz en mi cola y una golilla brillante alrededor del cuello.',
    '🐓 Mantengo el orden y la armonía del grupo respetando la jerarquía conocida como orden de picoteo.',
    '🐓 Al igual que las gallinas, desciendo del gallo silvestre Bankiva de los bosques del sudeste asiático.'
  ],
  matias_vicente: [
    '🐓 Somos Matías y Vicente, gallitos de raza japonesa (Bantam / Chabo) con plumaje blanco sedoso.',
    '🐓 Nuestras patitas son emplumadas, por lo que necesitamos un suelo limpio y seco para que no se nos pegue barro.',
    '🐓 Como somos de tamaño pequeño, tenemos un metabolismo más ágil y necesitamos perchas bajitas para dormir cómodos.',
    '🐓 Somos muy sociables y nos encanta convivir pacíficamente con los estudiantes del Liceo B-13.',
    '🐓 Las corrientes de aire frío nos afectan más que a las gallinas grandes; por eso nuestro gallinero está protegido.',
    '🐓 Tenemos un porte erguido y una cresta bien desarrollada que cuidamos a diario acicalándonos con el pico.'
  ],
  catita: [
    '🦜 ¿Quieres saber mi sexo? Si mi céreo (la zona carnosa sobre mi pico) es azul soy macho; si es marrón, soy hembra.',
    '🦜 Pertenezco al orden de los Psitaciformes: tengo patas zigodáctilas (2 dedos hacia adelante y 2 hacia atrás) para trepar.',
    '🦜 ¡No me des solo semillas! Una dieta exclusiva de semillas me provoca hígado graso (lipidosis hepática).',
    '🦜 Necesito hueso de jibia en mi jaula para afilar mi pico ganchudo y obtener calcio para mis huesos.',
    '🦜 Las ramas naturales de árboles frutales no tóxicos son ideales para ejercitar mis patitas.',
    '🦜 ¡Cuidado! La palta (aguacate) y el chocolate son venenos mortales para mí y para todas las aves.',
    '🦜 Soy muy juguetona y gregaria: en libertad viajo en bandadas por las praderas de Australia.'
  ],
  agapornis: [
    '🦜 Nos llaman «inseparables» porque formamos parejas muy unidas que se acicalan y acompañan de por vida.',
    '🦜 Somos originarios del continente africano y nos adaptamos muy bien si tenemos enriquecimiento ambiental y juego.',
    '🦜 Nuestro pico ganchudo es muy fuerte: podemos partir semillas duras y pelar ramas con gran destreza.',
    '🦜 Los humos de cocina, aerosoles y el teflón sobrecalentado de sartenes son extremadamente tóxicos para nuestros pulmones.',
    '🦜 Nos encanta bañarnos con pulverizadores de agua tibia para mantener el brillo y salud de nuestro plumaje.',
    '🦜 Necesitamos volar todos los días en un espacio seguro para no debilitar los músculos pectorales de nuestras alas.',
    '🦜 A simple vista machos y hembras somos idénticos; los veterinarios confirman nuestro sexo mediante una prueba de ADN.'
  ],
  pato: [
    '🦆 Poseo una glándula uropígea sobre mi cola que secreta un aceite especial con el que impermeabilizo todas mis plumas.',
    '🦆 En mi pico tengo laminillas filtradoras laterales que me permiten colar pequeños insectos y algas del agua.',
    '🦆 ¡Nunca me alimentes con pan blanco ni masas refinadas! Me provoca una deformación incurable llamada «ala de ángel».',
    '🦆 Necesito un estanque o recipiente con agua limpia donde pueda sumergir completamente mis ojos y orificios nasales.',
    '🦆 Mis patas tienen membranas interdigitales (palmeadas) que funcionan como remos para nadar con gran velocidad.',
    '🦆 Mis plumas tienen una capa inferior de plumón muy denso que me aísla por completo del agua helada.'
  ],
  vaca: [
    '🐄 Mi estómago tiene cuatro compartimentos: rumen, retículo, omaso y abomaso.',
    '🐄 En mi rumen habitan millones de microorganismos que fermentan la celulosa del pasto que yo sola no podría digerir.',
    '🐄 Mastico el pasto dos veces: trago el forraje, luego en reposo regurgito el bolo hacia mi boca para rumiarlo tranquilamente.',
    '🐄 Puedo beber entre 50 y 100 litros de agua limpia cada día, ¡especialmente en días calurosos de verano!',
    '🐄 Mi período de gestación dura 9 meses (unos 283 días), casi igual al de los seres humanos.'
  ],
  oveja: [
    '🐑 Soy un rumiante herbívoro y tengo una digestión especializada en fermentar pastos y forrajes.',
    '🐑 Mi lana crece de forma continua y necesito que me esquilen una vez al año para no sufrir golpes de calor en verano.',
    '🐑 Corto el pasto muy cerca del suelo con mis incisivos inferiores y mi almohadilla dental superior.',
    '🐑 Mis pezuñas hendidas deben mantenerse secas y limpias para evitar una infección bacteriana llamada pietín.',
    '🐑 Tengo un instinto gregario muy marcado: siempre me siento segura y tranquila cuando estoy junto a mi rebaño.'
  ]
};

/* ============================================================
   Gran Banco de Preguntas Zootécnicas y Científicas (Anti-Copia)
   12 a 15 preguntas rigurosas por especie, divididas en Básico, Intermedio y Avanzado.
   ============================================================ */
const QUESTION_BANK = {
  conejo: [
    { q: '¿A qué orden taxonómico pertenece el conejo doméstico (Oryctolagus cuniculus)?', options: ['Lagomorfos (Lagomorpha)', 'Roedores (Rodentia)', 'Carnívoros (Carnivora)', 'Marsupiales (Marsupialia)'], a: 0, difficulty: 'facil', points: 10, explain: 'El conejo es un lagomorfo; a diferencia de los roedores, posee cuatro dientes incisivos superiores.' },
    { q: '¿Qué porcentaje aproximado de la dieta diaria de un conejo debe ser heno seco de buena calidad?', options: ['Aproximadamente el 80%', 'El 10%', 'Menos del 25%', 'Solo cuando esté enfermo'], a: 0, difficulty: 'facil', points: 10, explain: 'El heno debe constituir el 75-80% de su alimentación para asegurar la motilidad intestinal y el desgaste dental continuo.' },
    { q: '¿Por qué los dientes del conejo crecen ininterrumpidamente durante toda su vida?', options: ['Es una adaptación evolutiva para compensar el desgaste severo de masticar fibras vegetales duras', 'Porque acumulan esmalte cada invierno', 'Para competir con los roedores silvestres', 'Por exceso de agua en la dieta'], a: 0, difficulty: 'facil', points: 10, explain: 'Al ser herbívoros adaptados a pastos fibrosos y silíceos, sus piezas dentales tienen raíz abierta y crecimiento perpetuo.' },
    { q: '¿Cuál es el patrón de actividad diaria (ritmo circadiano) natural de los conejos?', options: ['Crepuscular (máxima actividad al amanecer y al atardecer)', 'Diurno estricto al mediodía', 'Nocturno absoluto sin visión diurna', 'Hibernación continua'], a: 0, difficulty: 'facil', points: 10, explain: 'Como animales de presa, están biológicamente adaptados a estar activos en la penumbra del amanecer y el crepúsculo.' },
    { q: '¿En qué consiste el proceso digestivo vital denominado cecotrofia en el conejo?', options: ['Reingestión de heces blandas producidas en el ciego para absorber vitaminas B, K y proteínas', 'Un tipo de hibernación invernal', 'La muda periódica del pelaje', 'La expulsión forzada de bolas de pelo'], a: 0, difficulty: 'medio', points: 15, explain: 'Los cecotrofos son ricos en nutrientes microbianos sintetizados en el ciego que el conejo reingiere directamente del ano.' },
    { q: '¿Por qué los veterinarios desaconsejan bañar a los conejos con agua y jabón tradicional?', options: ['Su pelaje denso retiene humedad causando hipotermia severa y el baño provoca shock por estrés', 'Porque el agua les tiñe el pelaje de verde', 'Porque se disuelven sus garras', 'Porque pierden la capacidad de saltar'], a: 0, difficulty: 'medio', points: 15, explain: 'El agua y la manipulación forzada generan un estrés extremo que puede desencadenar paro cardíaco o hipotermia grave.' },
    { q: '¿Qué grave consecuencia fisiológica pueden provocar los gritos, persecuciones o ruidos súbitos cerca de un conejo?', options: ['Parada gastrointestinal (estasis) o colapso por shock inducido por catecolaminas', 'Aumento saludable de su agilidad', 'Mejora en su visión nocturna', 'Crecimiento más rápido de las orejas'], a: 0, difficulty: 'medio', points: 15, explain: 'El estrés agudo en conejos libera adrenalina que detiene las contracciones del estómago e intestinos, con riesgo vital.' },
    { q: 'En el aparato digestivo del conejo, ¿qué órgano actúa como una gran cuba de fermentación bacteriana?', options: ['El ciego', 'El esófago', 'La vesícula biliar', 'El bazo'], a: 0, difficulty: 'medio', points: 15, explain: 'El ciego del conejo representa más del 40% del volumen de su tracto digestivo y alberga la microbiota fermentadora de fibra.' },
    { q: '¿Cuál de los siguientes alimentos es seguro y nutritivo para un conejo en porciones frescas y controladas?', options: ['Hojas verdes oscuras frescas (cilantro, acelga, hojas de zanahoria)', 'Papas crudas con brotes verdes', 'Cebolla y ajo crudo', 'Galletas dulces con chocolate'], a: 0, difficulty: 'medio', points: 15, explain: 'Las hojas verdes variadas aportan micronutrientes, mientras que las papas crudas, cebollas y chocolates son tóxicos.' },
    { q: 'A diferencia de los pollitos que nacen caminando, los gazapos nacen ciegos, sin pelo e indefensos. ¿Cómo se clasifica este desarrollo?', options: ['Crías altriciales o nidícolas', 'Crías precociales o nidífugas', 'Desarrollo metamórfico', 'Desarrollo marsupial'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las especies altriciales dependen enteramente del cuidado, calor materno y lactancia dentro de la madriguera.' },
    { q: '¿A qué se debe que la orina del conejo sea frecuentemente turbia o con sedimentos blanquecinos?', options: ['A la eliminación renal de carbonato de calcio excedente, ya que absorben calcio de forma pasiva', 'A una infección bacteriana obligatoria', 'A que no beben suficiente agua', 'A que comen tierra del corral'], a: 0, difficulty: 'dificil', points: 20, explain: 'A diferencia de otros mamíferos, el conejo absorbe casi todo el calcio dietético y elimina el exceso a través de los riñones.' },
    { q: '¿Qué postura corporal en un conejo evidencia un estado de bienestar, relajación y confianza total en su entorno?', options: ['Tendido lateral con patas traseras completamente estiradas ("flop")', 'Agazapado con orejas pegadas al lomo y ojos desorbitados', 'Golpeteo rítmico y fuerte de las patas traseras en el suelo', 'Gruñidos con cuerpo encorvado'], a: 0, difficulty: 'dificil', points: 20, explain: 'El "flop" o estirarse de costado expone su vientre indefenso, indicando que el conejo se siente completamente a salvo.' },
    { q: '¿Cuál es el rango térmico ambiental ideal para el bienestar de los conejos y prevención de golpes de calor?', options: ['Entre 15°C y 21°C (por sobre los 27°C sufren estrés térmico grave)', 'Entre 35°C y 40°C', 'Bajo cero en todo momento', 'Sobre los 30°C constantemente'], a: 0, difficulty: 'dificil', points: 20, explain: 'Los conejos toleran mucho mejor el frío que el calor; al no transpirar, disipan calor solo por sus orejas y respiración.' },
    { q: '¿Qué parásito externo produce costras gruesas e inflamación en el canal auditivo de los conejos en granjas descuidadas?', options: ['El ácaro auricular Psoroptes cuniculi', 'La garrapata del ganado', 'La tenia intestinal', 'El piojo masticador de plumas'], a: 0, difficulty: 'dificil', points: 20, explain: 'Psoroptes cuniculi es el ácaro causante de la sarna de las orejas en conejos, muy dolorosa y prevenible con higiene.' }
  ],

  gallina: [
    { q: '¿Cuánto dura en promedio el período de incubación de un huevo fecundado de gallina?', options: ['21 días de incubación constante', '7 días', '42 días', '60 días'], a: 0, difficulty: 'facil', points: 10, explain: 'La temperatura corporal de la clocha o incubadora mantiene el huevo a 37.5°C durante 21 días hasta la eclosión.' },
    { q: '¿Para qué toman las gallinas baños diarios de tierra o arena en el corral?', options: ['Para cuidar su plumaje, eliminar ácaros y parásitos y regular la grasa de las plumas', 'Porque les disgusta el sol', 'Para enfriarse hasta tiritar', 'Para enterrar sus huevos'], a: 0, difficulty: 'facil', points: 10, explain: 'El polvo fino absorbe el exceso de aceite y sofoca ectoparásitos como piojillos y ácaros rojos del gallinero.' },
    { q: '¿Qué función cumple el buche en el sistema digestivo de las aves de corral?', options: ['Almacenar, humedecer y reblandecer temporalmente el alimento antes de la digestión', 'Triturar mecánicamente granos duros', 'Secretar ácido clorhídrico concentrado', 'Absorber la totalidad de los nutrientes'], a: 0, difficulty: 'facil', points: 10, explain: 'El buche es una dilatación esofágica que actúa como depósito de reserva para que el ave coma rápido y digiera en reposo.' },
    { q: '¿Qué mineral es imprescindible asegurar en la nutrición de las gallinas para que la cáscara del huevo sea resistente?', options: ['Calcio (carbonato de calcio en conchuela o caliza)', 'Hierro puro', 'Magnesio gaseoso', 'Sodio concentrado'], a: 0, difficulty: 'facil', points: 10, explain: 'La cáscara del huevo está compuesta por más de 95% de carbonato de calcio; su deficiencia produce huevos de cáscara blanda.' },
    { q: 'Dado que las gallinas carecen de dientes, ¿en qué órgano trituran los granos enteros con ayuda de piedrecillas?', options: ['En la molleja (ventrículo muscular)', 'En el buche', 'En el ciego doble', 'En el hígado'], a: 0, difficulty: 'medio', points: 15, explain: 'La molleja posee potentes masas musculares y un revestimiento córneo (queratina) que muele los granos junto con el grit.' },
    { q: '¿Qué cavidad terminal común reúne en las aves las funciones digestiva, urinaria y reproductora?', options: ['La cloaca', 'La uretra', 'El esfínter estomacal', 'La vesícula biliar'], a: 0, difficulty: 'medio', points: 15, explain: 'La cloaca desemboca externamente y se divide internamente en coprodeo, urodeo y proctodeo.' },
    { q: 'Los pollitos nacen con plumón, ojos abiertos y son capaces de alimentarse por sí mismos a las pocas horas. ¿Cómo se denomina esto?', options: ['Desarrollo precocial o nidífugo', 'Desarrollo altricial o nidícola', 'Metamorfosis incompleta', 'Desarrollo fetal placentario'], a: 0, difficulty: 'medio', points: 15, explain: 'Las aves nidífugas nacen listas para caminar y forrajear siguiendo las llamadas de su madre.' },
    { q: '¿Qué estímulo ambiental regula principalmente el ciclo de ovoposición y postura de huevos en las gallinas?', options: ['El fotoperiodo (cantidad de horas de luz diaria, idealmente 14-16 horas)', 'La humedad del suelo', 'El viento nocturno', 'La altitud sobre el nivel del mar'], a: 0, difficulty: 'medio', points: 15, explain: 'La luz estimula la glándula pineal y el hipotálamo, liberando hormonas gonadotrópicas que activan el ovario.' },
    { q: '¿Por qué las gallinas realizan una muda de plumas anual durante el otoño?', options: ['Para regenerar el plumaje deteriorado y preparar su aislamiento térmico para el frío invernal', 'Para cambiar de especie', 'Para atraer a depredadores', 'Porque tienen alergia a la paja'], a: 0, difficulty: 'medio', points: 15, explain: 'La muda renueva el plumaje y permite un descanso fisiológico al tracto reproductor de la gallina.' },
    { q: 'En la etología de las gallinas, ¿cómo se conoce el sistema de jerarquía social que determina prioridades de comida y descanso?', options: ['Orden de picoteo (peck order)', 'Manada migratoria', 'Banco cooperativo', 'Cardumen de corral'], a: 0, difficulty: 'dificil', points: 20, explain: 'El orden de picoteo reduce conflictos agresivos una vez que cada individuo reconoce su posición jerárquica en el grupo.' },
    { q: '¿Cuál es la temperatura corporal interna normal de una gallina sana en reposo?', options: ['Entre 41°C y 42°C (notablemente más alta que la de mamíferos)', 'Entre 36°C y 37°C', '25°C', '48°C'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las aves poseen una tasa metabólica muy elevada que mantiene su cuerpo a más de 41°C en condiciones normales.' },
    { q: '¿Qué enfermedad parasitaria intestinal prevenible afecta a los pollitos cuando las camas de paja están húmedas y calientes?', options: ['Coccidiosis aviar (Eimeria spp.)', 'Rabia canina', 'Tiña felina', 'Tétanos'], a: 0, difficulty: 'dificil', points: 20, explain: 'La coccidiosis prolifera con la humedad y calor de la cama, provocando diarreas sanguinolentas y deshidratación en pollitos.' },
    { q: '¿Por qué los bebederos del gallinero deben lavarse minuciosamente y renovarse todos los días?', options: ['Para impedir la multiplicación bacteriana (como Salmonella y E. coli) y acumulación de biofilm', 'Para que las gallinas puedan mirarse en el reflejo', 'Porque el agua se evapora en 5 minutos', 'Para evitar que las gallinas aprendan a nadar'], a: 0, difficulty: 'dificil', points: 20, explain: 'El agua estancada y contaminada con polvo o heces es la principal vía de propagación de enfermedades en un corral.' },
    { q: '¿Qué hormona sintetizada por la neurohipófisis estimula la contracción del útero para la expulsión final del huevo?', options: ['La arginina vasotocina (equivalente aviar a la oxitocina)', 'La insulina', 'El cortisol', 'La tiroxina'], a: 0, difficulty: 'dificil', points: 20, explain: 'La vasotocina y prostaglandinas desencadenan el parto u ovoposición del huevo a través de la vagina y cloaca.' }
  ],

  gallo: [
    { q: '¿A qué orden y familia zoológica pertenece el gallo doméstico?', options: ['Aves, orden Galliformes, familia Phasianidae', 'Aves, orden Falconiformes, familia Accipitridae', 'Mamíferos, familia Bovidae', 'Reptiles, orden Squamata'], a: 0, difficulty: 'facil', points: 10, explain: 'El gallo y la gallina son aves galliformes emparentadas con faisanes y perdices.' },
    { q: '¿A partir de qué especie silvestre asiática se domesticó el gallo común?', options: ['El gallo salvaje Bankiva (Gallus gallus)', 'El avestruz africano', 'El halcón peregrino', 'El cisne negro'], a: 0, difficulty: 'facil', points: 10, explain: 'Gallus gallus bankiva, originario del sudeste asiático, es el ancestro silvestre primario de las gallinas de granja.' },
    { q: '¿Qué régimen de alimentación natural tiene el gallo en la granja del Liceo B-13?', options: ['Omnívoro: consume granos, semillas, brotes verdes e insectos del suelo', 'Herbívoro estricto de solo pasto seco', 'Carnívoro depredador exclusivo', 'Frugívoro estricto'], a: 0, difficulty: 'facil', points: 10, explain: 'Escarba activamente el suelo buscando lombrices, gusanos y larvas, complementándolo con granos y hierbas.' },
    { q: '¿Qué estructura ósea y córnea afilada en el tarso posterior utiliza el gallo para proteger al gallinero?', options: ['El espolón tarsal', 'El pico ventral', 'La quilla', 'La rabadilla'], a: 0, difficulty: 'facil', points: 10, explain: 'El espolón es una defensa natural córnea que crece en la parte trasera de las patas de los machos adultos.' },
    { q: '¿Qué mecanismo fisiológico determina el momento en que el gallo canta antes del amanecer?', options: ['Un reloj circadiano endógeno independiente de la luz inmediata', 'El sonido del viento', 'El hambre acumulada en el buche', 'El canto de grillos nocturnos'], a: 0, difficulty: 'medio', points: 15, explain: 'Estudios cronobiológicos probaron que el gallo anticipa el amanecer guiado por su ritmo circadiano interno de 24 horas.' },
    { q: 'Además del cortejo reproductivo, ¿qué función termorreguladora vital cumple la gran cresta roja del gallo?', options: ['Disipar calor corporal en días calurosos gracias a su alta irrigación de sangre', 'Captar ondas sonoras lejanas', 'Almacenar reservas de agua dulce', 'Generar vitamina C'], a: 0, difficulty: 'medio', points: 15, explain: 'Al carecer de glándulas sudoríparas, la cresta y barbillones actúan como radiadores térmicos para enfriar la sangre.' },
    { q: '¿Cómo se distinguen las plumas de la cola de un gallo adulto respecto a las de una gallina?', options: ['Presenta plumas largas, curvas y brillantes en forma de hoz (hoces caudales)', 'No tiene plumas en la cola', 'Sus plumas son idénticas a las de un pato', 'Son completamente transparentes'], a: 0, difficulty: 'medio', points: 15, explain: 'Las plumas caudales en hoz son un rasgo de dimorfismo sexual secundario inducido por testosterona.' },
    { q: 'En la etología de la parvada, ¿qué rol primordial asume el gallo líder o dominante?', options: ['Actuar como centinela, alertar sobre amenazas y defender a las hembras y pollitos', 'Incubar los huevos en el nido', 'Poner huevos por la mañana', 'Expulsar a todas las aves del corral'], a: 0, difficulty: 'medio', points: 15, explain: 'El gallo vigila continuamente el entorno y guía a las hembras hacia fuentes de alimento seguras emitiendo llamadas de reclamo.' },
    { q: '¿Cómo vocaliza el gallo cuando detecta una amenaza que viene por el aire (rapaces) vs una por tierra (perros, zorros)?', options: ['Emite llamadas vocales con timbres y frecuencias claramente diferenciadas para cada tipo de depredador', 'Canta siempre exactamente igual', 'Guarda silencio absoluto', 'Comienza a aplaudir con las alas'], a: 0, difficulty: 'medio', points: 15, explain: 'Poseen un repertorio de alarma acústico específico que indica a la parvada si debe buscar refugio bajo techo o correr.' },
    { q: '¿Cómo ocurre la fecundación entre el gallo y la gallina si el gallo carece de órgano copulador externo?', options: ['Mediante la eversión y aposición directa de las cloacas ("beso cloacal")', 'Por fecundación externa en el agua', 'Por esporas aéreas', 'Mediante el contacto de sus alas'], a: 0, difficulty: 'dificil', points: 20, explain: 'El contacto cloacal permite una transferencia rápida y precisa del esperma hacia el oviducto femenino.' },
    { q: '¿Qué glándula situada sobre la rabadilla proporciona secreciones sebáceas que el gallo unta en sus plumas con el pico?', options: ['La glándula uropígea', 'La tiroides', 'La glándula mamaria', 'La glándula pineal'], a: 0, difficulty: 'dificil', points: 20, explain: 'La secreción uropigial contiene ceras y ácidos grasos que mantienen las plumas flexibles, limpias e hidrofóbicas.' },
    { q: '¿Qué afección inflamatoria de las almohadillas plantares del gallo se previene acolchando las perchas y evitando humedad?', options: ['Pododermatitis plantar o mal de patas (bumblefoot)', 'Pulmonía aviar', 'Cataratas corneales', 'Osteomielitis mandibular'], a: 0, difficulty: 'dificil', points: 20, explain: 'Superficies rugosas o húmedas generan microlesiones en la suela del pie por donde penetran bacterias estafilocócicas.' },
    { q: '¿Qué hormona esteroidea es la principal responsable del crecimiento de la cresta, desarrollo de espolones y vigor del canto?', options: ['La testosterona', 'El estrógeno ovárico', 'La progesterona', 'La prolactina'], a: 0, difficulty: 'dificil', points: 20, explain: 'La testosterona producida en los testículos testosterónicos internos regula todos los caracteres sexuales masculinos.' }
  ],

  matias_vicente: [
    { q: '¿A qué variedad o raza de gallináceas ornamentales pertenecen Matías y Vicente en La Granja B-13?', options: ['Gallitos japoneses enanos de raza Bantam (Chabo)', 'Avestruces enanos', 'Faisanes dorados silvestres', 'Gallinas ponedoras gigantes'], a: 0, difficulty: 'facil', points: 10, explain: 'Son ejemplares de gallitos ornamentales enanos (Bantam), famosos por su elegancia y pequeño porte.' },
    { q: '¿Cuál es el color y textura característicos del plumaje de Matías y Vicente en la granja escolar?', options: ['Blanco sedoso, suave y brillante con cresta roja erguida', 'Negro con manchas azules fluorescentes', 'Verde oliva con rayas amarillas', 'Gris ceniza sin plumas'], a: 0, difficulty: 'facil', points: 10, explain: 'Poseen un plumaje blanco puro y sedoso que resalta vivamente con su cresta carnosa roja.' },
    { q: '¿Qué peculiaridad anatómica presentan Matías y Vicente en la zona de sus tarsos y patas?', options: ['Patas emplumadas (calzadas) con plumas que bajan hasta los dedos', 'Patas con membranas de pato', 'Carecen de uñas en los dedos', 'Patas con tres espolones en cada dedo'], a: 0, difficulty: 'facil', points: 10, explain: 'Las razas Bantam japonesas suelen poseer plumas que cubren sus tarsos, dándoles un aspecto acolchado y aristocrático.' },
    { q: '¿Cuál es el temperamento habitual de Matías y Vicente con los alumnos y docentes del Liceo B-13?', options: ['Extremadamente dócil, tranquilo y acostumbrado al contacto respetuoso', 'Muy salvaje y agresivo hacia las personas', 'Huidizo y temeroso sin poder mirarlo', 'Solitario y hostil'], a: 0, difficulty: 'facil', points: 10, explain: 'Fueron socializados desde jóvenes en el entorno escolar, permitiendo una observación cercana y enriquecedora.' },
    { q: 'Debido a sus patas emplumadas, ¿qué cuidado indispensable requiere el suelo de su gallinero?', options: ['Mantener la cama de viruta muy seca y limpia para evitar bolas de barro en las plumas', 'Llenar el suelo de lodo húmedo', 'Usar piso de cemento rugoso sin nada encima', 'Poner piedras filosas en el suelo'], a: 0, difficulty: 'medio', points: 15, explain: 'La humedad y el barro apelmazan las plumas de las patas, favoreciendo infecciones bacterianas y hongos en la piel.' },
    { q: 'Al ser aves de tamaño reducido (enanas), ¿cómo es su tasa metabólica respecto a las gallinas de campo pesadas?', options: ['Más rápida: pierden calor corporal más rápidamente y requieren energía digestible', 'Diez veces más lenta', 'Exactamente idéntica a una vaca', 'No consumen calorías en invierno'], a: 0, difficulty: 'medio', points: 15, explain: 'Por su mayor relación superficie/volumen, los animales pequeños disipan calor más rápido y su metabolismo es más activo.' },
    { q: '¿A qué altura deben diseñarse las perchas o posaderos para gallitos japoneses como Matías y Vicente?', options: ['A baja o media altura (30-50 cm) con rampas para evitar caídas y lesiones en articulaciones', 'A más de 4 metros de altura', 'No deben tener perchas bajo ningún motivo', 'En el techo del gallinero'], a: 0, difficulty: 'medio', points: 15, explain: 'Sus patas más cortas y alas compactas dificultan saltos altos; perchas bajas previenen traumatismos óseos.' },
    { q: '¿Por qué Matías y Vicente pueden convivir juntos en el mismo recinto sin atacarse de forma violenta?', options: ['Porque crecieron juntos desde pollitos y mantienen una jerarquía social pacífica y respetada', 'Porque no se pueden ver entre ellos', 'Porque son de especies distintas que no se reconocen', 'Porque no tienen instinto social'], a: 0, difficulty: 'medio', points: 15, explain: 'Machos criados en el mismo grupo desde edad temprana consolidan vínculos de coexistencia estables si tienen espacio.' },
    { q: '¿De qué región del mundo procede ancestralmente la selección genética de la raza Chabo o gallina japonesa?', options: ['De Japón y el este de Asia, criados históricamente como aves de compañía y adorno', 'De la Antártida', 'De la selva de Madagascar', 'De los desiertos de América del Norte'], a: 0, difficulty: 'dificil', points: 20, explain: 'La raza Chabo fue seleccionada durante siglos en Japón por su docilidad, porte distinguido y colas erectas.' },
    { q: '¿Qué tipo de grano partido o pellet es el más adecuado para su alimentación debido al menor tamaño de su pico?', options: ['Granos partidos finos, semillas seleccionadas y pellets pequeños ricos en vitaminas', 'Maíz entero gigante sin partir', 'Huesos enteros duros', 'Ramas de árboles secas'], a: 0, difficulty: 'dificil', points: 20, explain: 'Su tamaño de buche y molleja requiere alimentos adaptados a su menor capacidad de ingestión mecánica.' },
    { q: 'Ante los vientos costeros y humedad nocturna de Antofagasta, ¿cómo debe protegerse su dormidero?', options: ['Con cortavientos perimetrales, ventilación superior sin corrientes directas y cama seca', 'Dejándolos a la intemperie total', 'Encendiendo fuego directo dentro de la jaula', 'Cerrando herméticamente sin ninguna entrada de aire'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las corrientes de aire directas causan coriza aviar e hipotermia en aves de tamaño enano.' },
    { q: 'En el proyecto pedagógico de La Granja B-13, ¿qué valor formativo primordial transmiten Matías y Vicente?', options: ['El respeto a la diversidad animal, la empatía, el cuidado constante y la bioética escolar', 'La producción masiva de carne industrial', 'El aislamiento de los animales', 'El ruido constante en el liceo'], a: 0, difficulty: 'dificil', points: 20, explain: 'Enseñan a la comunidad educativa que los animales merecen cariño, espacio digno y atención dedicada (ODS 15).' }
  ],

  catita: [
    { q: '¿A qué orden taxonómico pertenecen las catitas o periquitos australianos (Melopsittacus undulatus)?', options: ['Psittaciformes (loros y cotorras)', 'Passeriformes (gorriones)', 'Anseriformes (patos)', 'Strigiformes (búhos)'], a: 0, difficulty: 'facil', points: 10, explain: 'Pertenecen al orden de los loros, caracterizados por su inteligencia, pico ganchudo y patas trepadoras.' },
    { q: '¿En qué continente y bioma habita silvestremente la catita australiana?', options: ['En las sabanas, praderas y zonas semiáridas del interior de Australia', 'En la selva lluviosa del Amazonas', 'En el bosque mediterráneo chileno', 'En las tundras de Siberia'], a: 0, difficulty: 'facil', points: 10, explain: 'Son endémicas del centro árido de Australia, adaptadas a desplazarse miles de kilómetros tras las lluvias.' },
    { q: '¿Cómo se determina con facilidad el sexo de una catita adulta a través del color de su céreo?', options: ['Céreo azul intenso indica macho; marrón rugoso o beige indica hembra adulta', 'Céreo verde indica macho; céreo rojo hembra', 'Por el largo de su cola', 'Por la cantidad de plumas en sus alas'], a: 0, difficulty: 'facil', points: 10, explain: 'El céreo es la zona de piel carnosa que rodea las narinas sobre el pico; su color refleja el nivel hormonal del ave.' },
    { q: '¿Cómo están dispuestos los dedos de las patas de las catitas para trepar con gran agilidad (pata zigodáctila)?', options: ['Dos dedos orientados hacia adelante y dos hacia atrás (dedos II y III adelante, I y IV atrás)', 'Tres dedos hacia adelante y uno atrás', 'Los cuatro dedos hacia adelante con membrana', 'Un solo dedo grande con pezuña'], a: 0, difficulty: 'facil', points: 10, explain: 'La pata zigodáctila permite un agarre en pinza sumamente firme para trepar ramas verticales y sostener comida.' },
    { q: '¿Qué mineral y accesorio natural es indispensable proveer en el aviario para que la catita lime su pico?', options: ['Hueso de jibia (sepia) y bloque de calcio natural', 'Vidrio molido', 'Trozos de plástico blando', 'Papel de aluminio'], a: 0, difficulty: 'medio', points: 15, explain: 'La jibia proporciona carbonato de calcio orgánico y permite el desgaste mecánico de la queratina del pico.' },
    { q: '¿Por qué alimentar a una catita únicamente con semillas (mijo y alpiste) genera graves enfermedades crónicas?', options: ['Porque las semillas tienen exceso de lípidos y carecen de vitaminas A y D, causando hígado graso', 'Porque no pueden digerir semillas', 'Porque las semillas les cambian el color de los ojos a rojo', 'Porque las semillas son venenosas de inmediato'], a: 0, difficulty: 'medio', points: 15, explain: 'La lipidosis hepática es la principal causa de muerte en aves alimentadas a base de semillas grasas sin verduras ni pellets.' },
    { q: '¿Cuál de los siguientes alimentos es SUMAMENTE TÓXICO y potencialmente letal para las catitas y loros?', options: ['La palta (aguacate), el chocolate y el café', 'La lechuga lavada y la manzana sin semillas', 'El brócoli hervido sin sal', 'La zanahoria rallada'], a: 0, difficulty: 'medio', points: 15, explain: 'La persina presente en la palta y la teobromina del chocolate provocan insuficiencia cardíaca y muerte rápida en aves.' },
    { q: '¿Por qué se deben usar perchas de ramas de árboles frutales no tóxicos en vez de palos plásticos lisos?', options: ['Porque las texturas y grosores variables ejercitan los tendones del pie y previenen pododermatitis', 'Porque el plástico es demasiado pesado para el aviario', 'Para que las catitas no puedan posarse', 'Porque las ramas atraen lluvia'], a: 0, difficulty: 'medio', points: 15, explain: 'Las perchas uniformes causan puntos de presión constante en la planta del pie, generando úlceras dolorosas.' },
    { q: '¿Cuánto dura en promedio la incubación de los huevos de una catita dentro del nido?', options: ['Aproximadamente 18 días', '7 días', '35 días', '50 días'], a: 0, difficulty: 'medio', points: 15, explain: 'La hembra incuba de 4 a 6 huevos durante unos 18 días, naciendo los pichones en días alternos.' },
    { q: '¿Qué enfermedad bacteriana zoonótica transmisible al ser humano puede ser portada por aves psitácidas en malas condiciones?', options: ['Psitacosis o clamidiosis aviar (Chlamydia psittaci)', 'Rabia urbana', 'Mal de Chagas', 'Fiebre aftosa'], a: 0, difficulty: 'dificil', points: 20, explain: 'Chlamydia psittaci se transmite por inhalación de polvo fecal seco de aves estresadas o hacinadas; la higiene la previene.' },
    { q: '¿Qué adaptación fisiológica poseen las catitas en el desierto australiano para conservar agua al máximo?', options: ['Excretan ácido úrico semisólido concentrado y reabsorben agua en el urodeo de la cloaca', 'Tienen vejiga de almacenamiento como los perros', 'No eliminan desechos nitrogenados', 'Sudan copiosamente por las plumas'], a: 0, difficulty: 'dificil', points: 20, explain: 'La excreción de ácido úrico no requiere agua para diluirse, minimizando radicalmente la pérdida hídrica.' },
    { q: '¿Qué sonido tenue y característico emite una catita cuando frota suavemente su mandíbula antes de quedarse dormida?', options: ['Chasquido o frotamiento rítmico del pico que expresa relajación y saciedad', 'Un grito agudo de socorro', 'Un ladrido fuerte', 'Un silbido de ataque territorial'], a: 0, difficulty: 'dificil', points: 20, explain: 'El "beak grinding" o crujido de pico es el indicador sonoro más claro de que el ave se siente cómoda, segura y somnolienta.' },
    { q: '¿Por qué los gases de sartenes de cocina con teflón sobrecalentado (PTFE) son letales para catitas y aves menores?', options: ['Porque liberan vapores microscópicos que causan hemorragia pulmonar y asfixia en minutos en sus sacos aéreos', 'Porque les manchan las plumas', 'Porque les da sueño prolongado', 'Porque neutralizan el calcio de sus huesos'], a: 0, difficulty: 'dificil', points: 20, explain: 'El sistema respiratorio de flujo continuo y sacos aéreos de las aves absorbe toxinas aerotransportadas a una velocidad fulminante.' }
  ],

  agapornis: [
    { q: '¿Por qué a las aves del género Agapornis se les conoce popularmente como "inseparables"?', options: ['Porque establecen lazos monógamos estrechos y pasan el día acicalándose y descansando juntas', 'Porque nacen fusionadas físicamente', 'Porque nunca se separan del suelo', 'Porque no pueden volar sin un guía'], a: 0, difficulty: 'facil', points: 10, explain: 'Del griego agape (amor fraterno) y ornis (ave), forman parejas de por vida con conductas de apego muy intensas.' },
    { q: '¿En qué continente tienen su origen geográfico y ecológico silvestre los agapornis?', options: ['En el continente africano (y la isla de Madagascar)', 'En Australia y Nueva Zelanda', 'En las selvas de Centroamérica', 'En los fiordos de Noruega'], a: 0, difficulty: 'facil', points: 10, explain: 'Las 9 especies reconocidas del género habitan bosques abiertos, sabanas y estepas africanas.' },
    { q: '¿Qué forma y potencia presenta el pico de los agapornis adaptado a su vida natural?', options: ['Pico robusto, corto y ganchudo con potente musculatura mandibular para quebrar semillas duras', 'Pico largo y fino como una aguja para chupar néctar', 'Pico aplanado con dientes', 'Pico blando sin queratina'], a: 0, difficulty: 'facil', points: 10, explain: 'La mandíbula superior e inferior generan una tremenda presión capaz de quebrar cáscaras muy leñosas.' },
    { q: '¿Cómo se llama la conducta social en la que los agapornis se limpian y arreglan las plumas uno al otro?', options: ['Acicalamiento mutuo o alogrooming (allopreening)', 'Muda forzada', 'Agresión pasiva', 'Cortejo parasitario'], a: 0, difficulty: 'facil', points: 10, explain: 'El alopreening refuerza el vínculo afectivo de la pareja, reduce el estrés y limpia plumas inaccesibles de la cabeza.' },
    { q: '¿Por qué en la mayoría de las especies de agapornis (como roseicollis) es necesario sexaje por ADN veterinario?', options: ['Porque no presentan dimorfismo sexual evidente a simple vista (machos y hembras lucen idénticos)', 'Porque los machos no tienen plumas', 'Porque cambian de sexo cada verano', 'Porque las hembras nacen siendo peces'], a: 0, difficulty: 'medio', points: 15, explain: 'Al ser monomórficos externamente, solo un análisis molecular del ADN de pluma o sangre determina el sexo con certeza.' },
    { q: '¿Cómo transportan algunas hembras de agapornis (ej: Agapornis roseicollis) los materiales para forrar su nido?', options: ['Ensartando tiras de hojas, cortezas y papel entre las plumas de la rabadilla u obispillo', 'Cargando ramas pesadas con las garras como un águila', 'Tragando las hojas para regurgitarlas secas', 'Empujando el material rodando por el piso'], a: 0, difficulty: 'medio', points: 15, explain: 'Es una fascinante conducta etológica innata: cortan tiras precisas y las insertan en su rabadilla para volar con ellas.' },
    { q: '¿Qué enriquecimiento ambiental es indispensable para evitar que un agapornis desarrolle picaje (autoarrancarse plumas)?', options: ['Juguetes de madera no tóxica para roer, elementos de forrajeo, espacio de vuelo y compañía', 'Aislamiento en una caja pequeña a oscuras', 'Poner música a máximo volumen todo el día', 'Bañarlo con agua caliente clorada'], a: 0, difficulty: 'medio', points: 15, explain: 'El picaje psicógeno surge por aburrimiento, frustración o soledad; los desafíos cognitivos y el forrajeo lo evitan.' },
    { q: '¿Cuál es el método más seguro y placentero para que un agapornis se bañe y limpie su plumaje?', options: ['Ofrecerle un recipiente muy poco profundo con agua limpia o rociarlo suavemente con pulverizador tibio', 'Sumergirlo bajo el chorro del grifo a la fuerza', 'Echarle champú para perros en los ojos', 'Usar secador de pelo caliente directo a su cara'], a: 0, difficulty: 'medio', points: 15, explain: 'Los platos llanos y el rocío suave imitan las gotas de lluvia, evitando riesgo de asfixia o enfriamiento brusco.' },
    { q: '¿Cuánto dura aproximadamente la incubación de una nidada de agapornis antes de nacer los polluelos?', options: ['Entre 21 y 23 días', '10 días', '45 días', '60 días'], a: 0, difficulty: 'medio', points: 15, explain: 'La hembra incuba con dedicación absoluta durante algo más de tres semanas, saliendo solo brevemente a alimentarse.' },
    { q: '¿Qué nutriente es crítico aportar a una hembra de agapornis en época de cría para prevenir la retención de huevo (distocia)?', options: ['Calcio biodisponible y vitamina D3 para la contracción oviductal y formación de cáscara', 'Azúcar refinada concentrada', 'Grasa animal saturada', 'Sal común en polvo'], a: 0, difficulty: 'dificil', points: 20, explain: 'La hipocalcemia debilita el músculo liso del oviducto, impidiendo expulsar el huevo y provocando una emergencia médica mortal.' },
    { q: '¿Por qué los ambientadores en aerosol, sahumerios y vapores de cocina son especialmente dañinos para los agapornis?', options: ['Porque sus sacos aéreos y capilares pulmonares absorben partículas volátiles irritantes provocando asfixia química', 'Porque les apagan el canto de por vida', 'Porque derriten el pico de queratina', 'Porque les cambian de color las patas'], a: 0, difficulty: 'dificil', points: 20, explain: 'La extrema eficiencia del intercambio gaseoso en aves hace que cualquier aerosol tóxico ingrese velozmente al torrente sanguíneo.' },
    { q: '¿Qué articulación elástica craneal (cinesis craneal) permite a los agapornis levantar el pico superior de manera independiente?', options: ['La charnela o articulación frontonasal', 'La articulación femorotibial', 'La sínfisis púbica', 'El cartílago cricoides'], a: 0, difficulty: 'dificil', points: 20, explain: 'A diferencia de los mamíferos que tienen el maxilar soldado al cráneo, los psitácidos articulan activamente el pico superior.' },
    { q: '¿Qué signo clínico evidente advierte que un agapornis se encuentra gravemente enfermo y requiere aislamiento y calor?', options: ['Plumaje constantemente esponjado (embolado), letargo, ojos cerrados y permanencia en el suelo de la jaula', 'Volar activamente de una percha a otra', 'Cantar y comer semillas con apetito', 'Bañarse con energía'], a: 0, difficulty: 'dificil', points: 20, explain: 'Como presas, las aves ocultan sus síntomas; cuando un agapornis se embolsa y no sube a las perchas, la enfermedad está avanzada.' }
  ],

  pato: [
    { q: '¿A qué orden taxonómico pertenecen los patos domésticos (Anas platyrhynchos domesticus)?', options: ['Anseriformes, familia Anatidae', 'Galliformes, familia Phasianidae', 'Columbiformes, familia Columbidae', 'Falconiformes, familia Falconidae'], a: 0, difficulty: 'facil', points: 10, explain: 'Los patos, cisnes y gansos pertenecen al orden Anseriformes, aves adaptadas a la natación y vida acuática.' },
    { q: '¿Qué glándula sebácea situada sobre la base de la cola segrega la cera impermeable que el pato unta en sus plumas?', options: ['La glándula uropígea', 'La glándula parótida', 'La glándula tiroides', 'La glándula suprarrenal'], a: 0, difficulty: 'facil', points: 10, explain: 'El pato frota su pico en la glándula uropígea y distribuye el aceite hidrófobo por todo su cuerpo para no hundirse.' },
    { q: '¿Qué adaptación morfológica poseen las patas del pato que les permite propulsarse con gran velocidad en el agua?', options: ['Membranas interdigitales que forman patas palmeadas', 'Dedos opuestos con garras prensiles', 'Ausencia total de articulaciones', 'Pezuñas duras de queratina'], a: 0, difficulty: 'facil', points: 10, explain: 'Las patas palmeadas funcionan como aletas o remos hidráulicos que empujan un gran volumen de agua al nadar.' },
    { q: '¿Qué estructuras en los bordes interiores del pico ancho del pato le permiten colar y filtrar algas y pequeños invertebrados?', options: ['Laminillas filtradoras (pecten)', 'Dientes de marfil incisivos', 'Púas de cartílago venenoso', 'Espolones córneos'], a: 0, difficulty: 'facil', points: 10, explain: 'Las laminillas actúan como un cedazo biológico: el pato bombea agua con su lengua y retiene los bocados nutritivos.' },
    { q: '¿Por qué es extremadamente perjudicial y dañino alimentar a los patos del estanque con pan blanco o masas procesadas?', options: ['Porque causa malnutrición severa y una deformidad ósea incurable en las alas llamada "ala de ángel"', 'Porque el pan les impide flotar de inmediato', 'Porque hace que cambien de especie a paloma', 'Porque les disuelve el plumón'], a: 0, difficulty: 'medio', points: 15, explain: 'El exceso de carbohidratos simples y calorías vacías acelera el peso de las plumas antes de que las articulaciones maduren.' },
    { q: '¿Por qué los patos necesitan recipientes de agua lo suficientemente profundos para sumergir completamente la cabeza?', options: ['Para lavar sus ojos, humedecer las membranas nasales y evitar infecciones respiratorias y ceguera', 'Para aprender a respirar bajo el agua', 'Para enfriar sus patas traseras', 'Porque no pueden tragar aire seco'], a: 0, difficulty: 'medio', points: 15, explain: 'El pato debe sumergir su cabeza periódicamente para expulsar barro de sus narinas y lubricar sus globos oculares.' },
    { q: '¿Qué capa densa de plumas cortas, suaves y aislantes ubicada bajo las plumas de contorno protege al pato del agua fría?', options: ['El plumón (duvet)', 'Las rémiges primarias', 'Las timoneras caudales', 'La cresta córnea'], a: 0, difficulty: 'medio', points: 15, explain: 'El plumón atrapa una capa de aire caliente pegada a la piel que impide que el agua gélida toque el cuerpo del animal.' },
    { q: '¿Cómo nacen los patitos en cuanto a su grado de desarrollo motriz y sensorial al salir del cascarón?', options: ['Nacen precociales: cubiertos de plumón, con ojos abiertos y listos para nadar y alimentarse en pocas horas', 'Nacen ciegos y sin capacidad de moverse durante dos meses', 'Nacen en estado larvario acuático', 'Nacen dentro de una bolsa marsupial'], a: 0, difficulty: 'medio', points: 15, explain: 'Al igual que los pollitos, los patitos son nidífugos y siguen con devoción el improntado de su madre hacia el agua.' },
    { q: '¿Cuánto dura en promedio el período de incubación de los huevos de pato doméstico común?', options: ['Aproximadamente 28 días', '14 días', '45 días', '60 días'], a: 0, difficulty: 'medio', points: 15, explain: 'Los huevos de pato tardan 28 días de incubación (a diferencia de los 21 días de la gallina), exigiendo mayor humedad ambiental.' },
    { q: '¿Por qué la cáscara de los huevos de pato tiene una textura más cerosa y suave al tacto que la de los huevos de gallina?', options: ['Porque posee una cutícula lipídica gruesa que actúa como barrera impermeable contra bacterias del nido húmedo', 'Porque los patos ponen huevos de plástico', 'Porque no contienen calcio', 'Porque los patos sudan aceite sobre ellos'], a: 0, difficulty: 'dificil', points: 20, explain: 'Al nidificar cerca de cuerpos de agua o barro, la cutícula cerosa evita que la humedad excesiva asfixie los poros del embrión.' },
    { q: '¿Qué mecanismo circulatorio en las patas del pato minimiza la pérdida de calor al nadar en agua helada?', options: ['Un sistema de intercambio térmico por contracorriente (red maravillosa arteria-vena)', 'Hervir la sangre de las patas', 'Detener por completo el latido cardíaco al nadar', 'Cerrar todas las arterias del cuerpo'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las arterias calientes transfieren calor a las venas frías que suben, de modo que las patas están frías y no pierden energía en el agua.' },
    { q: '¿Cuál de los siguientes alimentos naturales es excelente y seguro para enriquecer la dieta de los patos en la granja?', options: ['Verduras de hoja picadas (lechuga romana, espinaca), guisantes descongelados, lombrices y avena', 'Pan con mantequilla y mermelada', 'Papas fritas con sal', 'Carne cruda descompuesta'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las hojas verdes flotantes y los guisantes aportan fibra, vitaminas y proteínas sin causar deformidades óseas.' }
  ],

  vaca: [
    { q: '¿A qué grupo de mamíferos herbívoros pertenecen las vacas domésticas (Bos taurus)?', options: ['Rumiantes poligástricos, familia Bovidae', 'Monogástricos omnívoros, familia Suidae', 'Carnívoros depredadores, familia Felidae', 'Roedores lagomorfos'], a: 0, difficulty: 'facil', points: 10, explain: 'La vaca es un rumiante artiodáctilo adaptado a extraer energía de la celulosa vegetal mediante fermentación.' },
    { q: '¿Cuántos compartimentos interconectados componen el estómago de un bovino?', options: ['Cuatro: rumen, retículo, omaso y abomaso', 'Dos: estómago superior e inferior', 'Uno solo idéntico al humano', 'Seis cavidades musculares'], a: 0, difficulty: 'facil', points: 10, explain: 'Los primeros tres son preestómagos de fermentación y absorción; el abomaso es el estómago glandular ácido.' },
    { q: '¿En cuál de los cuatro compartimentos ocurre la mayor fermentación de celulosa mediada por bacterias y protozoos?', options: ['En el rumen (o panza)', 'En el abomaso', 'En el esófago medio', 'En el colon descendente'], a: 0, difficulty: 'facil', points: 10, explain: 'El rumen es una inmensa cámara de fermentación de más de 100 litros poblada por billones de microorganismos simbióticos.' },
    { q: '¿Cuál de los cuatro compartimentos es considerado el "estómago verdadero" por secretar ácido clorhídrico y pepsina?', options: ['El abomaso (cuajar)', 'El retículo', 'El omaso', 'El rumen'], a: 0, difficulty: 'facil', points: 10, explain: 'El abomaso digiere enzimáticamente los nutrientes y la masa bacteriana proveniente de los preestómagos.' },
    { q: '¿Qué ocurre durante el proceso fisiológico de la rumia en las horas de reposo de la vaca?', options: ['El forraje regurgitado desde el rumen-retículo vuelve a la boca para ser masticado finamente y resalivado', 'La vaca digiere piedras para tener calcio', 'El animal expulsa gas por las fosas nasales', 'La leche se transfiere al estómago'], a: 0, difficulty: 'medio', points: 15, explain: 'Rumiar reduce el tamaño de las partículas vegetales y aporta saliva alcalina rica en bicarbonato para estabilizar el pH del rumen.' },
    { q: '¿Cuánto dura en promedio el período de gestación de una vaca antes del parto de su ternero?', options: ['Aproximadamente 9 meses (283 días en promedio)', '3 meses', '6 meses', '14 meses'], a: 0, difficulty: 'medio', points: 15, explain: 'La gestación bovina dura alrededor de 40 semanas, dando a luz normalmente a una sola cría que camina a los pocos minutos.' },
    { q: '¿Qué volumen promedio diario de agua limpia y fresca puede llegar a beber una vaca adulta en producción o en días cálidos?', options: ['Entre 50 y 100 litros diarios (o más)', 'De 2 a 5 litros', 'Menos de 1 litro', 'No necesita beber agua si el pasto está verde'], a: 0, difficulty: 'medio', points: 15, explain: 'La producción de saliva, la fermentación y la lactancia exigen un consumo hídrico masivo de agua fresca y sin impurezas.' },
    { q: '¿Qué gas de efecto invernadero producen los rumiantes como subproducto natural de la fermentación entérica en el rumen?', options: ['Metano (CH4)', 'Oxígeno puro (O2)', 'Ozono atmosférico (O3)', 'Monóxido de carbono (CO)'], a: 0, difficulty: 'medio', points: 15, explain: 'Las arqueas metanogénicas del rumen eliminan el exceso de hidrógeno combinándolo con carbono en forma de metano, eructado al exterior.' },
    { q: '¿Cómo es la organización social y comportamiento de las vacas cuando pastan en un potrero amplio?', options: ['Son animales fuertemente gregarios que establecen lazos sociales estables y jerarquías pacíficas', 'Viven completamente aisladas y atacan a sus congéneres', 'Se comportan como depredadores nocturnos', 'Cambian de manada cada hora'], a: 0, difficulty: 'medio', points: 15, explain: 'El bienestar social de los bovinos depende de convivir con su grupo, sincronizando sus horas de pastoreo y rumia.' },
    { q: '¿Cómo se denomina la primera leche altamente concentrada en anticuerpos que la madre debe suministrar al ternero en sus primeras horas?', options: ['El calostro materno', 'Suero desnatado', 'Leche pasteurizada', 'Caseína pura'], a: 0, difficulty: 'dificil', points: 20, explain: 'Dado que la placenta bovina no transfiere inmunoglobulinas, el ternero nace sin defensas y depende del calostro en sus primeras 6 horas.' },
    { q: '¿Qué función amortiguadora cumple la enorme cantidad de saliva alcalina producida durante la rumia?', options: ['Tamponar el pH del rumen para evitar una acidosis ruminal por acumulación de ácidos grasos volátiles', 'Lubricar las pezuñas de las patas', 'Eliminar parásitos de la piel', 'Enfriar los pulmones'], a: 0, difficulty: 'dificil', points: 20, explain: 'El bicarbonato y fosfato salivales neutralizan los ácidos de la fermentación, manteniendo un pH óptimo de 6.2 a 6.8.' },
    { q: '¿Qué estructura bucal sustituye a los incisivos superiores en la dentadura de la vaca para cortar el pasto?', options: ['La almohadilla dentaria (rodete gingival superior)', 'Una hilera de colmillos afilados', 'Un pico córneo', 'Una segunda lengua'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las vacas aprisionan el pasto entre los incisivos inferiores y la almohadilla superior, cortándolo mediante un tirón de cabeza.' },
    { q: '¿Cómo se llama el reflejo anatómico que permite al ternero lactante dirigir la leche directamente al abomaso?', options: ['La gotera esofágica (surco reticular)', 'El esfínter ileocecal', 'El píloro secundario', 'La válvula espiral'], a: 0, difficulty: 'dificil', points: 20, explain: 'El reflejo de succión cierra los labios del surco reticular, evitando que la leche fermente inadecuadamente en el rumen inmaduro.' }
  ],

  oveja: [
    { q: '¿A qué familia taxonómica pertenece la oveja doméstica (Ovis aries)?', options: ['Familia Bovidae (bóvidos rumiantes)', 'Familia Equidae (équidos)', 'Familia Suidae (suidos)', 'Familia Canidae (cánidos)'], a: 0, difficulty: 'facil', points: 10, explain: 'Al igual que las vacas y cabras, las ovejas son bóvidos con pezuñas hendidas y cuernos huecos o ausentes.' },
    { q: '¿Por qué la oveja doméstica precisa ser esquilada periódicamente por el ser humano para su bienestar?', options: ['Porque su lana seleccionada crece continuamente y no muda de forma natural, provocando golpes de calor y suciedad', 'Para que pueda volar con agilidad', 'Para cambiar de color cada primavera', 'Para que no se confunda con las nubes'], a: 0, difficulty: 'facil', points: 10, explain: 'Siglos de domesticación eliminaron la muda natural; sin esquila anual, el vellón acumula peso excesivo y humedad peligrosa.' },
    { q: '¿Cuál es el rasgo etológico defensivo más marcado y característico de las ovejas frente a cualquier peligro?', options: ['Un fortísimo instinto gregario de cohesión y seguimiento en rebaño', 'El ataque frontal con colmillos', 'Enterrarse bajo la arena', 'La caza solitaria de presas'], a: 0, difficulty: 'facil', points: 10, explain: 'El rebaño compacto diluye el riesgo individual frente a depredadores; una oveja aislada experimenta pánico inmediato.' },
    { q: '¿Cuánto dura en promedio el período de gestación de una oveja antes del nacimiento de los corderos?', options: ['Aproximadamente 5 meses (147 a 152 días)', '1 mes', '9 meses', '12 meses'], a: 0, difficulty: 'facil', points: 10, explain: 'La preñez dura cerca de 150 días, pariendo habitualmente uno o dos corderos que se amamantan de inmediato.' },
    { q: '¿Qué función cumple principalmente el omaso en el aparato digestivo de los rumiantes ovinos?', options: ['Absorber agua, bicarbonato y ácidos grasos volátiles de la masa fermentada', 'Moler granos con dientes internos', 'Secretar veneno digestivo', 'Almacenar oxígeno para bucear'], a: 0, difficulty: 'medio', points: 15, explain: 'Conocido como "libro" o "librillo", sus láminas paralelas filtran y deshidratan el bolo alimenticio antes del abomaso.' },
    { q: '¿Qué dolorosa infección bacteriana de las pezuñas de las ovejas se previene manteniendo el suelo y corrales secos?', options: ['El pietín o pododermatitis infecciosa ovina', 'El cólera aviar', 'La rabia paralítica', 'La viruela bovina'], a: 0, difficulty: 'medio', points: 15, explain: 'Dichelobacter nodosus prolifera en suelos encharcados y lodosos, pudriendo el tejido córneo de la pezuña y causando cojera.' },
    { q: '¿Qué grave complicación parasitaria se previene manteniendo limpia y desprovista de heces la lana de la zona perianal?', options: ['La miasis cutánea (gusanera o infestación por larvas de moscas)', 'La calvicie estacional', 'El hipo crónico', 'La fiebre tifoidea'], a: 0, difficulty: 'medio', points: 15, explain: 'Las moscas depositan sus huevos en lana sucia y húmeda; las larvas resultantes invaden la piel provocando dolorosas heridas.' },
    { q: '¿Cómo es la manera en que pastorean las ovejas comparada con el pastoreo del ganado vacuno?', options: ['Cortan el pasto muy rasante y pegado al suelo gracias a sus labios móviles y hendidos', 'Arrancan los árboles de raíz', 'Solo comen frutos caídos del suelo', 'No pueden pastar en praderas'], a: 0, difficulty: 'medio', points: 15, explain: 'Sus labios delgados y dientes afilados les permiten seleccionar brotes minúsculos muy cerca de la superficie del suelo.' },
    { q: '¿Cuántas crías (corderos) suele parir una oveja sana en cada parto?', options: ['Generalmente una o dos crías (ocasionalmente trillizos)', 'Entre ocho y doce crías', 'Una camada de veinte', 'Siempre exactamente cuatro'], a: 0, difficulty: 'medio', points: 15, explain: 'La prolificidad habitual de la especie es de 1 a 2 corderos por parto, dependiendo de la raza y la nutrición materna.' },
    { q: '¿Qué mineral indispensable para otros animales resulta extremadamente tóxico y mortal en acumulación para las ovejas?', options: ['El cobre', 'El sodio', 'El calcio', 'El potasio'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las ovejas tienen una capacidad muy limitada para excretar cobre biliar; su exceso en piensos provoca crisis hemolítica mortal.' },
    { q: '¿Qué sustancia cerosa natural secretada por las glándulas sebáceas de la piel de la oveja impermeabiliza la lana?', options: ['La lanolina', 'La queratina líquida', 'El colágeno vegetal', 'La parafina sintética'], a: 0, difficulty: 'dificil', points: 20, explain: 'La lanolina protege la fibra de lana contra el agua de lluvia y tiene múltiples aplicaciones cosméticas y farmacéuticas.' },
    { q: 'En la dinámica social del rebaño ovino, ¿qué individuo suele marcar la dirección de movimiento en situaciones de estrés?', options: ['La oveja matriarca o más experimentada del grupo (oveja guía)', 'El cordero recién nacido', 'El pájaro que vuela arriba', 'Cualquier individuo al azar sin orden'], a: 0, difficulty: 'dificil', points: 20, explain: 'Las hembras añosas que conocen las rutas y recursos guían de manera natural el movimiento de escape y pastoreo.' }
  ]
};

/* ============================================================
   Motor Anti-Copia de Muestreo Aleatorio Dinámico para Quizzes
   ============================================================ */
function sampleQuestionsForAnimal(animalOrSpeciesId, count = 6) {
  let poolKey = animalOrSpeciesId;
  if (['nesquik', 'vainilla', 'tasmi', 'quesito', 'm_conejo_grupo'].includes(poolKey)) poolKey = 'conejo';
  else if (poolKey === 'm_matias_vicente') poolKey = 'matias_vicente';
  else if (poolKey === 'm_gallinas_grupo') poolKey = 'gallina';
  else if (poolKey === 'm_rooster') poolKey = 'gallo';
  else if (poolKey === 'm_catitas') poolKey = 'catita';
  else if (poolKey === 'm_agapornis') poolKey = 'agapornis';

  const pool = QUESTION_BANK[poolKey] || QUESTION_BANK['gallina'];

  const faciles = pool.filter(q => q.difficulty === 'facil');
  const medios = pool.filter(q => q.difficulty === 'medio');
  const dificiles = pool.filter(q => q.difficulty === 'dificil');

  function pickRandom(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  // 2 fáciles (10 pts), 2 intermedias (15 pts), 2 avanzadas (20 pts)
  const selected = [
    ...pickRandom(faciles, 2),
    ...pickRandom(medios, 2),
    ...pickRandom(dificiles, 2)
  ];

  // Relleno de seguridad si faltan preguntas en alguna categoría
  while (selected.length < count && pool.length > selected.length) {
    const rem = pool.filter(q => !selected.includes(q));
    if (rem.length === 0) break;
    selected.push(rem[Math.floor(Math.random() * rem.length)]);
  }

  // Barajar el orden de preguntas y barajar las opciones A, B, C, D para anti-copia
  return selected.sort(() => Math.random() - 0.5).map(q => {
    const optsWithIndices = q.options.map((opt, idx) => ({ opt, isCorrect: idx === q.a }));
    const shuffledOpts = optsWithIndices.sort(() => Math.random() - 0.5);
    const newCorrectIdx = shuffledOpts.findIndex(o => o.isCorrect);

    return {
      q: q.q,
      options: shuffledOpts.map(o => o.opt),
      a: newCorrectIdx,
      difficulty: q.difficulty,
      points: q.points || (q.difficulty === 'dificil' ? 20 : (q.difficulty === 'medio' ? 15 : 10)),
      explain: q.explain
    };
  });
}

// Inicializar quizzes muestreados aleatoriamente para todos los animales de base
ANIMALS.forEach(a => {
  if (!a.quiz || a.quiz.length === 0) {
    a.quiz = sampleQuestionsForAnimal(a.id, 6);
  }
});
