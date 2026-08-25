# La Granja B13 🐓🐇🐄🐑

Prototipo web educativo y gamificado de **La Granja B13** — postulación *Go Innova, Hecho Proyecto B-13*.

El proyecto tiene **dos vistas**, conectadas por la misma barra de navegación y el mismo
progreso guardado:

- **🌾 Potrero** (`index.html`) — los 4 animales "de manual" (gallo, conejo, vaca, oveja)
  caminando libremente, para enseñar la biología de cada especie.
- **🗺️ Mapa de la Granja** (`mapa.html`) — el mapa ilustrado de la granja real del liceo:
  cada zona se puede explorar y muestra a los animales *reales*, con nombre propio y foto.

---

## 1. Estructura del proyecto

```
la-granja-b13/
├── index.html            → Vista 1: el Potrero
├── mapa.html               → Vista 2: el Mapa de la Granja
├── README.md
├── css/
│   └── styles.css          → todos los estilos de ambas vistas
├── js/
│   ├── data.js               → CONTENIDO del Potrero: las 6 especies (biología,
│   │                            anatomía, quiz), normas, insignias, mensajes
│   ├── map-data.js            → CONTENIDO del Mapa: las 11 zonas y los 10
│   │                            animales/grupos reales (liga cada uno a su
│   │                            especie en data.js para no repetir biología)
│   ├── audio.js                → efectos de sonido: tonos generados por código
│   │                               (correcto/incorrecto/logro) + reproductor de los
│   │                               audios reales (conejo, gallina, gallo, aves, gato)
│   ├── state.js                  → guardado del progreso (localStorage),
│   │                                compartido entre las dos vistas
│   ├── card.js                    → MOTOR COMPARTIDO: la ficha con sus 3
│   │                                pestañas, el quiz, las insignias, las
│   │                                normas y el panel docente. Lo usan
│   │                                ambas páginas.
│   ├── app.js                      → solo lo propio del Potrero (animales
│   │                                caminando)
│   └── map-app.js                   → solo lo propio del Mapa (pines sobre
│                                     la imagen, mini-vista por zona)
└── assets/
    ├── img/
    │   ├── map/mapa-granja.jpg       → imagen de fondo del mapa
    │   ├── animals/*.png               → foto de cada animal/grupo del mapa
    │   └── anatomy/                     → ilustraciones reales de anatomía (conejo,
    │                                     gallina, aves) usadas en la pestaña Anatomía
    └── audio/*.mp3                        → sonidos reales (conejo, gallina, gallo,
                                            aves, gato) para el botón "🔊 Sonido real"
```

**¿Por qué está separado así?** Para que el equipo pueda repartirse el trabajo tal como lo
describen en el formulario: quien investiga biología edita `data.js`/`map-data.js`; quien arma
el mapa o los animales reales edita `map-data.js` y las fotos en `assets/img/`; quien programa
la interacción trabaja en `app.js`/`map-app.js`; quien diseña visualmente ajusta
`css/styles.css`. `card.js` es el único archivo "delicado" porque lo comparten ambas vistas —
conviene que lo edite una sola persona a la vez.

---

## 2. Paso a paso para abrirlo en VSCode

1. **Descarga y descomprime** el archivo `.zip` que te compartí. Guarda la carpeta
   `la-granja-b13` donde prefieras (por ejemplo, en `Documentos/Proyectos`).
2. Abre **Visual Studio Code**.
3. Ve a `Archivo → Abrir carpeta...` (`File → Open Folder...`) y selecciona la carpeta
   `la-granja-b13` (la que contiene `index.html` y `mapa.html`).
4. **Para verla funcionando**, instala la extensión **Live Server**:
   - Ícono de Extensiones (`Ctrl+Shift+X`) → busca `Live Server` (de Ritwick Dey) → Instalar.
   - Clic derecho sobre `index.html` → **"Open with Live Server"**.
   - Se abre el navegador en algo como `http://127.0.0.1:5500/index.html`, recargando solo al
     guardar. Desde ahí, el botón **🗺️ Mapa de la Granja** de arriba lleva a la otra vista.
5. **Alternativa sin extensión:** doble clic en `index.html` o `mapa.html` desde el explorador
   de archivos de tu computador. Funciona igual, solo que no se recarga automáticamente.
6. Para subirlo a GitHub más adelante (recomendado para el plan de continuidad del formulario):
   `git init`, `git add .`, `git commit -m "La Granja B13"`, y luego conectarlo a un repositorio
   vacío que crees en GitHub (`git remote add origin ...`, `git push`).

---

## 3. La vista nueva: Mapa de la Granja

Está construida a partir de las dos imágenes que enviaste:

- El **mapa** (`assets/img/map/mapa-granja.jpg`) se usa tal cual como fondo. Encima se
  dibujan **pines** invisibles-hasta-que-los-tocas en cada una de las 11 zonas (Almacén,
  Conejos, Plantas, Lista, Huerto de Bayas, Pozo, Arboleda de Nidos, Gallinas, Jaula del Gallo,
  Paja, Gato), posicionados en `js/map-data.js` como porcentaje de la imagen — así el mapa se
  ve bien en cualquier tamaño de pantalla.
- Al tocar una zona **con animales** (Conejos, Gallinas, Jaula del Gallo, Arboleda de Nidos) se
  abre una **mini-vista** con las fotos recortadas de la segunda imagen que mandaste — Nesquik,
  Vainilla, Tasmi, Quesito, Matías y Vicente, el Gallo, Catitas, Agapornis, y los grupos
  genéricos "Otros conejos" / "Otras gallinas".
- Al tocar a un animal ahí, se abre **la misma ficha con 3 pestañas** que ya tenías en el
  Potrero (Ficha / Personalizar / Quiz) — mismo motor (`card.js`), mismo sistema de puntaje,
  mismas insignias. Cada animal individual usa la biología ya verificada de su especie (un
  conejo real como Tasmi muestra la misma ficha de conejo que el "Conejo" genérico del
  Potrero), y agrega arriba una breve descripción de su aspecto y en qué zona vive.
- Las zonas **sin animales** (Almacén, Plantas, Lista, Huerto de Bayas, Pozo, Paja, Gato) 
  muestran un mensaje corto al tocarlas, para que el mapa completo se sienta interactivo sin
  inventar fichas biológicas donde no correspondía.
- Se agregaron **2 especies nuevas** a `data.js` para poder documentar a las catitas y los
  agapornis (periquito común y agapornis cachetes rosados): clasificación, hábitat,
  alimentación, agua, comportamiento, reproducción, cuidados y un dato de campo — con la misma
  exigencia de fuentes que usaste para el gallo y el conejo.
- Se agregaron **2 insignias nuevas** (Zoólogo/a de Campo y Veterinario/a de la Granja) por
  descubrir y completar el quiz de los 10 animales del mapa, además de las 4 insignias
  originales del Potrero. El puntaje es el mismo para las dos vistas: todo suma al mismo
  cuaderno.

### Un supuesto que hice (revísalo)

En tu mapa aparece un cartel "gallitos japoneses" junto al árbol de Arboleda de Nidos, pero no
venía una foto de referencia para esa ave puntual. Para no inventar una especie que no pude
verificar, dejé esa zona con las Catitas y los Agapornis (que sí tenían foto e info) y mencioné
"gallitos japoneses" solo como un dato de ambientación en el texto de la zona — **no le puse
ficha de biología propia**. Si me confirmas qué ave es exactamente, le armo su ficha completa
en la próxima vuelta.

---

## 4. Sonido real y anatomía con fotos reales

Esta vuelta agregó dos mejoras que tocan **todas las vistas** (Potrero y Mapa):

- **🔊 Sonido real**: junto al nombre de cada animal, cuando hay una grabación disponible
  aparece un botón "Sonido real" que reproduce el audio real de esa especie (conejo, gallo,
  gallina, o las aves pequeñas), en vez de —o además de— los tonos generados por código para
  correcto/incorrecto/logro. Vaca y Oveja todavía no tienen grabación propia, así que ese botón
  no aparece en sus fichas por ahora. Los dos audios que venían como grabaciones largas de
  ambiente (más de 1 minuto) se recortaron a un fragmento corto para que funcionen bien como
  efecto de botón; los detalles de qué se recortó están en `assets/audio/LEEME.txt`.
- **Anatomía con ilustraciones reales**: la pestaña "Ficha" ahora tiene un apartado
  **Anatomía** que, para Conejo, Gallo, Catita y Agapornis, muestra la ilustración real que
  nos compartiste (con Boca, Faringe, Hígado, Páncreas, etc. para el conejo; Cresta, Pulmones,
  Molleja, etc. para el gallo; y una ilustración general de aves —con sistema circulatorio,
  respiratorio, digestivo y reproductor— para las catitas y los agapornis). Cada parte marcada
  en la imagen se puede tocar y muestra su función, exactamente igual que antes — solo cambió
  el fondo, de un dibujo esquemático a la ilustración real. Vaca y Oveja, al no tener una
  ilustración de referencia todavía, conservan el diagrama esquemático original.

---

## 5. Qué se amplió en la primera vuelta (Potrero)

| Sección del formulario | Qué se agregó |
|---|---|
| "…alimentación, **consumo de agua**, hábitat, comportamiento, **reproducción** y **cuidados**" | La ficha de cada animal tiene esos 4 campos nuevos, además de clasificación, hábitat, alimentación y dato de campo |
| "normas de comportamiento y cuidado **antes de** visitar la granja" | Botón **📋 Normas de la granja**, con las 6 normas de tu sección de Problemática |
| "sonido de logro" al responder bien | Sonidos generados por código (Web Audio API), sin archivos ni internet |
| "animación de estrellas, barra de progreso, animal en movimiento" | Estrella animada, puntitos de progreso en el quiz, y el animal salta al acertar |
| Mensajes de acierto y de cierre redactados en el formulario | Se muestran tal cual los escribiste |
| "logros, niveles, décimas" | Sistema de insignias (6 en total, ver sección 3) |
| "panel para docentes… revisar el progreso… puntajes" | Botón **👩‍🏫 Panel docente**: resumen, tabla por animal, informe `.txt` descargable |
| Persistencia | Nombre, color, accesorio y puntaje quedan guardados en el navegador |

No se tocó el contenido biológico ya verificado por ti (cecotrofia del conejo, canto circadiano
del gallo): se mantuvo igual, solo se reorganizó dentro de `js/data.js`.

---

## 6. Lo que queda como próximo paso

- **Panel docente en la nube**: hoy el progreso vive en el navegador de cada estudiante (por
  eso el informe `.txt` descargable). Centralizarlo para todo el curso necesita un
  backend/base de datos — calza con el ítem de "financiamiento para alojamiento web" de tu
  sección de Recursos.
- **Ficha de "gallitos japoneses"**: ver el recuadro de la sección 3.
- Cualquier zona nueva que agreguen a la granja real (o animal nuevo) se suma solo editando
  `js/map-data.js` — no hace falta tocar el resto del código.

---

## 7. Sobre el ODS y la evidencia biológica

El pie de página cita ODS 4 y ODS 15 tal como los fundamentaste en el formulario. Los datos
biológicos verificados están en el campo `dato` de cada especie en `js/data.js` — junto a esos
comentarios puedes agregar la referencia bibliográfica completa si tu liceo pide citarlas.

¡Cualquier ajuste de contenido, diseño o funcionalidad que quieras, dime y seguimos
construyendo sobre esto! 🌾
