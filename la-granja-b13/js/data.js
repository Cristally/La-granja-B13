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
  { id: 'bow', label: 'Moño', emoji: '🎀' },
  { id: 'hat', label: 'Sombrero', emoji: '🤠' },
  { id: 'glasses', label: 'Lentes', emoji: '🕶️' }
];

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
  { id: 'veterinario', icon: '🩺', label: 'Veterinario/a de la Granja', desc: 'Completaste el quiz de los 10 animales del Mapa de la Granja.' }
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
  }
];

// Opciones de personalización de Avatar para estudiantes de secundaria
const STUDENT_AVATARS = [
  { id: 'avatar_explorador', icon: '🧑‍🌾', name: 'Explorador/a de Campo', desc: 'Amante de la naturaleza y el trabajo en terreno' },
  { id: 'avatar_biologa', icon: '👩‍🔬', name: 'Científica B-13', desc: 'Rigor biológico y método experimental' },
  { id: 'avatar_investigador', icon: '👨‍🔬', name: 'Investigador de Fauna', desc: 'Pasión por la taxonomía y la genética animal' },
  { id: 'avatar_veterinaria', icon: '🧑‍⚕️', name: 'Veterinario/a Juvenil', desc: 'Dedicado/a a la salud y bienestar animal' },
  { id: 'avatar_botanica', icon: '🌱', name: 'Guardián/a Verde', desc: 'Especialista en huertos y agricultura escolar' },
  { id: 'avatar_fotografo', icon: '📸', name: 'Fotógrafo/a de Campo', desc: 'Ojo observador para registrar cada detalle' },
  { id: 'avatar_zoologo', icon: '🦊', name: 'Espíritu Silvestre', desc: 'Conexión con el instinto y la etología' },
  { id: 'avatar_conejo', icon: '🐰', name: 'Amigo/a de las Conejeras', desc: 'Fan de Nesquik, Tasmi, Quesito y Vainilla' },
  { id: 'avatar_gallo', icon: '🐓', name: 'Líder del Gallinero', desc: 'Puntualidad, energía y madrugador/a' },
  { id: 'avatar_estudiante', icon: '🎒', name: 'Estudiante B-13', desc: 'Compromiso escolar, superación y aprendizaje continuo' }
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
  }
];
