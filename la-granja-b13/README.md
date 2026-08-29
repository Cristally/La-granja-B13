# 🌾🦜 La Granja B13 — Aprendizaje Gamificado 🐓🐇

<div align="center">
  <img src="assets/img/logo.png" alt="Escudo Oficial Granja B-13" width="160" />
  <p><b>Plataforma web educativa y gamificada para el aprendizaje y cuidado de la fauna escolar</b></p>
  <p><b>Liceo Domingo Herrera Rivera B-13 — Antofagasta, Chile</b></p>
  <p><i>Postulación Go Innova — Vinculado a ODS 4 (Educación de Calidad) y ODS 15 (Vida de Ecosistemas Terrestres)</i></p>

  [![Render](https://img.shields.io/badge/Web_App-En_Línea_en_Render-success?style=for-the-badge&logo=render)](https://la-granja-b13.onrender.com)
  [![Node.js](https://img.shields.io/badge/Backend-Node.js_Express-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
</div>

---

## 🌟 Descripción del Proyecto

**La Granja B13** es una iniciativa pedagógica y tecnológica desarrollada para fortalecer la **bioalfabetización** y el bienestar animal en la comunidad educativa del Liceo Domingo Herrera Rivera B-13. A través de dinámicas lúdicas e interactivas, los estudiantes exploran los animales reales del liceo, conocen su anatomía y normas de respeto, y responden desafíos formativos acumulando puntaje y décimas académicas.

---

## 🎮 Las 3 Vistas de la Plataforma

La plataforma cuenta con 3 vistas conectadas por una barra de navegación fluida y una sesión de estudiante sincronizada:

### 1. 🌾 El Potrero (`index.html`)
* **Simulación Escénica:** Paisaje ilustrado con colinas, flores, granero de madera y animales caminando libremente.
* **Ciclo Día / Noche:** Modo nocturno con luna brillante, cielo estrellado parpadeante y animales durmiendo plácidamente con burbujas de sueño.
* **Fichas de Campo:** Biología, hábitat, nutrición, anatomía interactiva con pines de órganos y personalización estética.
* **Quizzes con Feedback:** Preguntas formativas con puntajes, explicaciones botánicas/zoológicas y audio de victoria.

### 2. 🗺️ El Mapa de la Granja (`mapa.html`)
* **Exploración por Zonas:** Mapa ilustrado de las instalaciones físicas del liceo (Almacén, Conejeras, Huerto, Pozo, Arboleda, Gallinero).
* **Animales Reales:** Fichas individuales de los animales del colegio (Matías y Vicente, Vainilla, Nesquik, Tasmi, Quesito, Gallo Guardián).
* **Mini-retratos y Pines Interactivos:** Conteo de exploración por zona y desafíos específicos.

### 3. 📸 Granja Real B-13 (`galeria-real.html`)
* **Registro Fotográfico Real:** 17 fotografías en alta resolución de la granja del Liceo B-13.
* **Carteles Oficiales de Identidad:** Fichas reales de los conejos (Vainilla, Nesquik, Tasmi, Quesito) y gallitos japoneses con sus edades y temperamentos.
* **Correlación "Realidad vs. Juego":** Botones directos que conectan cada rincón físico con su elemento en el videojuego.
* **Filtros y Visor Lightbox:** Exploración por categorías (*Fauna*, *Huerto*, *Espacios*, *Nidos*) y ampliación en pantalla completa.

---

## 🎒 Sistema de Evaluación y Cuaderno de Campo

* **Identificación del Estudiante:** Registro seguro por nombre y curso que previene ingresos anómalos o duplicados.
* **Logros e Insignias (6 Desafíos):**
  - 🧭 *Explorador/a de la Granja*
  - 📓 *Cuaderno de Campo*
  - 🛡️ *Guardián/a Responsable*
  - ⭐ *Precisión Perfecta*
  - 🔎 *Zoólogo/a de Campo*
  - 🩺 *Veterinario/a de la Granja*
* **Panel Docente:** Resumen de avance, cálculo automático de décimas formativas, historial multi-perfil y exportación a informe oficial (`.txt`) o planilla consolidada (`.csv`).

---

## 📁 Estructura del Repositorio

```
la-granja-b13/
├── index.html                  → Vista 1: El Potrero
├── mapa.html                   → Vista 2: El Mapa de la Granja
├── galeria-real.html           → Vista 3: Granja Real B-13
├── server.js                   → Backend en Node.js Express con base de datos JSON
├── package.json                → Configuración de scripts y dependencias
├── css/
│   └── styles.css              → Estilos responsivos, ciclo día/noche y modales
├── js/
│   ├── data.js                 → Especies del Potrero, anatomía y quizzes
│   ├── map-data.js             → Zonas y animales reales del liceo
│   ├── real-gallery-data.js    → Registros fotográficos reales y carteles
│   ├── real-gallery-app.js     → Controlador de la galería y lightbox
│   ├── audio.js                → Efectos sonoros y audio de victoria
│   ├── state.js                → Persistencia en localStorage y sincronización con API
│   ├── card.js                 → Motor de fichas, quizzes, logros y panel docente
│   ├── app.js                  → Simulación de animales en el Potrero
│   └── map-app.js              → Pines y navegación en el Mapa
└── assets/
    ├── img/
    │   ├── logo.png            → Escudo oficial del proyecto
    │   ├── real/               → 17 fotografías y carteles reales del Liceo B-13
    │   ├── map/                → Mapa ilustrado de la granja
    │   ├── animals/            → Retratos ilustrados de los animales
    │   └── anatomy/            → Diagramas anatómicos
    └── audio/                  → Efectos de sonido y cantos reales
```

---

## 🚀 Despliegue y Ejecución Local

### Ejecución en Local:
```bash
# 1. Entrar a la carpeta del proyecto
cd la-granja-b13

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor
npm start
```
Abre tu navegador en `http://localhost:3000`.

### Despliegue en la Nube (Render):
El proyecto se encuentra configurado para despliegue continuo en **Render** con:
* **Runtime:** Node.js
* **Build Command:** `npm install`
* **Start Command:** `node server.js`
* **Root Directory:** `la-granja-b13`

---

## 👥 Equipo y Créditos

* **Iniciativa:** Proyecto de Bioalfabetización — Liceo Domingo Herrera Rivera B-13 (Antofagasta).
* **Competición:** Go Innova — *Hecho Proyecto B-13*.
* **Objetivos de Desarrollo Sostenible:** ODS 4 (Educación de Calidad) y ODS 15 (Vida de Ecosistemas Terrestres).
