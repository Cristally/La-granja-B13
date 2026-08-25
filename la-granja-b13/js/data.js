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

// Insignias / logros del sistema de gamificación
const BADGES = [
  { id: 'explorador', icon: '🧭', label: 'Explorador/a de la Granja', desc: 'Descubriste los 5 animales del potrero.' },
  { id: 'cuadernista', icon: '📓', label: 'Cuaderno de Campo', desc: 'Completaste el quiz de al menos un animal del potrero.' },
  { id: 'guardian', icon: '🛡️', label: 'Guardián/a Responsable', desc: 'Completaste el quiz de los 5 animales del potrero.' },
  { id: 'precision', icon: '⭐', label: 'Precisión Perfecta', desc: 'Respondiste todas las preguntas de un quiz correctamente a la primera.' },
  { id: 'zoologo', icon: '🔎', label: 'Zoólogo/a de Campo', desc: 'Descubriste a los 10 animales del Mapa de la Granja.' },
  { id: 'veterinario', icon: '🩺', label: 'Veterinario/a de la Granja', desc: 'Completaste el quiz de los 10 animales del Mapa de la Granja.' }
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
      { q: '¿Qué controla principalmente el momento en que canta el gallo al amanecer?', options: ['La temperatura del corral', 'Un ritmo circadiano interno', 'El hambre acumulada', 'El sonido de otras aves'], a: 1, explain: 'Experimentos con luz constante mostraron que el canto se mantiene sincronizado con el amanecer aunque no haya cambios de luz, lo que indica un reloj biológico interno.' },
      { q: '¿A qué grupo taxonómico pertenece el gallo?', options: ['Mamíferos', 'Reptiles', 'Aves', 'Anfibios'], a: 2, explain: 'El gallo es un ave de la familia Phasianidae.' },
      { q: '¿Qué tipo de alimentación tiene el gallo doméstico?', options: ['Herbívoro estricto', 'Omnívoro', 'Carnívoro estricto', 'Filtrador'], a: 1, explain: 'Come tanto granos y semillas como insectos y pequeños invertebrados.' }
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
      { q: '¿Cuánto dura en promedio la incubación de un huevo de gallina?', options: ['7 días', '21 días', '45 días', '60 días'], a: 1, explain: 'Los huevos fecundados de gallina tardan 21 días en eclosionar.' },
      { q: '¿Por qué las gallinas toman baños de tierra o arena?', options: ['Para cuidar sus plumas y limpiarse de parásitos', 'Porque no les gusta el agua', 'Para cambiar de plumaje', 'Para no pasar frío'], a: 0, explain: 'Los baños de tierra les permiten regular la grasa de sus plumas y mantenerse libres de parásitos.' },
      { q: '¿Qué tipo de alimentación tiene la gallina de la granja?', options: ['Carnívora', 'Herbívora estricta', 'Omnívora (granos, insectos y vegetales)', 'Frugívora estricta'], a: 2, explain: 'Las gallinas se alimentan de semillas, granos, vegetales e insectos que encuentran en el suelo.' }
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
      { q: '¿Por qué los conejos necesitan alimentos ricos en fibra y heno constante?', options: ['Para desgastar sus dientes que crecen toda la vida y regular su digestión', 'Para cambiar de color de pelaje', 'Para no tener que beber agua', 'Para dormir más tiempo'], a: 0, explain: 'Sus dientes crecen durante toda la vida; la fibra del heno desgasta las piezas dentales y asegura una digestión saludable.' },
      { q: '¿Qué se debe hacer antes de tocar o alimentar a un conejo en la granja?', options: ['Gritar para llamar su atención', 'Pedir autorización al profesor/encargado y lavarse las manos', 'Correr hacia su conejera rápidamente', 'Darle cualquier alimento dulce'], a: 1, explain: 'Para no estresarlo ni transmitirle patógenos, siempre se debe consultar al profesor/encargado, mantener la calma y lavarse las manos.' },
      { q: '¿Qué puede ocurrir si un conejo está expuesto constantemente a ruidos fuertes?', options: ['Aumenta su apetito', 'Aprende a comunicarse mejor', 'Sufre altos niveles de estrés que dañan su salud', 'Mejora su velocidad'], a: 2, explain: 'Los conejos son animales presa muy sensibles a los ruidos fuertes y a la manipulación brusca; el ruido excesivo les provoca estrés.' },
      { q: '¿Qué es la cecotrofia?', options: ['Un tipo de hibernación', 'La reingestión de heces blandas ricas en nutrientes', 'Una enfermedad digestiva', 'El cambio de dientes del conejo'], a: 1, explain: 'Es una segunda digestión: el conejo reingiere heces blandas (cecotrofos) producidas en el ciego para aprovechar vitaminas B, K y proteínas bacterianas.' },
      { q: '¿A qué grupo taxonómico pertenece el conejo?', options: ['Roedores', 'Lagomorfos', 'Marsupiales', 'Insectívoros'], a: 1, explain: 'Aunque a menudo se le confunde con un roedor, el conejo pertenece al orden Lagomorpha (posee 4 incisivos superiores en vez de 2).' }
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
      { q: '¿Cuántos compartimentos tiene el estómago de la vaca?', options: ['Uno', 'Dos', 'Tres', 'Cuatro'], a: 3, explain: 'Rumen, retículo, omaso y abomaso: esta anatomía permite digerir fibra vegetal difícil de aprovechar.' },
      { q: '¿Qué significa que la vaca sea rumiante?', options: ['Que solo come de noche', 'Que remastica el alimento tras una primera fermentación', 'Que no necesita beber agua', 'Que muda de piel'], a: 1, explain: 'El alimento fermenta en el rumen, regresa a la boca y se vuelve a masticar antes de continuar la digestión.' },
      { q: '¿Qué tipo de animal social es la vaca?', options: ['Solitario', 'Gregario', 'Territorial agresivo', 'Nocturno estricto'], a: 1, explain: 'Las vacas viven y pastan en grupo, con vínculos sociales estables.' }
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
      { q: '¿Por qué las ovejas necesitan esquila periódica?', options: ['Porque su lana crece continuamente', 'Porque se enferman sin ella', 'Porque no pueden regular su temperatura de otro modo', 'Porque la lana cae sola cada año'], a: 0, explain: 'A diferencia de otros mamíferos con muda estacional, la lana de la oveja crece sin detenerse.' },
      { q: '¿Qué comportamiento social es característico de la oveja?', options: ['Vida solitaria', 'Instinto de rebaño', 'Territorialidad extrema', 'Migración individual'], a: 1, explain: 'Las ovejas tienden a agruparse y seguir al rebaño como estrategia contra depredadores.' },
      { q: '¿A qué familia pertenece la oveja?', options: ['Felidae', 'Bovidae', 'Canidae', 'Suidae'], a: 1, explain: 'Igual que la vaca y la cabra, la oveja pertenece a la familia Bovidae.' }
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
      { q: '¿De qué continente es originaria la catita (periquito)?', options: ['América', 'Australia', 'Europa', 'Asia'], a: 1, explain: 'Melopsittacus undulatus es originaria del interior árido de Australia.' },
      { q: '¿Cómo son las bandadas de catitas en estado silvestre?', options: ['Siempre solitarias', 'Nómadas, y pueden juntar miles de aves', 'Fijas en un mismo árbol toda su vida', 'Solo se juntan de a dos'], a: 1, explain: 'Siguen las lluvias en busca de semillas y pueden formar bandadas de miles de aves.' },
      { q: '¿Cuánto dura aproximadamente la incubación de sus huevos?', options: ['2 días', '8 días', '18 días', '40 días'], a: 2, explain: 'La hembra incuba los huevos durante unos 18 días mientras el macho la alimenta.' }
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
      { q: '¿Por qué a los agapornis se les llama "inseparables" en español?', options: ['Porque nunca vuelan', 'Porque forman parejas monógamas muy unidas de por vida', 'Porque solo existen en pares en la naturaleza', 'Porque no pueden separarse físicamente'], a: 1, explain: 'Las parejas de agapornis pasan gran parte del día juntas, se acicalan mutuamente y se mantienen unidas de por vida.' },
      { q: '¿De qué continente son originarios los agapornis?', options: ['África', 'Oceanía', 'América del Sur', 'Asia'], a: 0, explain: 'La mayoría de las especies de Agapornis son originarias de África (una es de Madagascar).' },
      { q: '¿Por qué no es recomendable alimentar a un agapornis solo con semillas?', options: ['Porque no le gustan', 'Porque una dieta solo de semillas es pobre en proteínas y vitaminas', 'Porque las semillas son tóxicas para ellos', 'Porque no puede digerirlas'], a: 1, explain: 'Necesita una dieta variada con frutas y verduras, ya que una dieta solo de semillas no cubre todos sus requerimientos nutricionales.' }
    ]
  }
];
