# Guía de Base de Datos y Despliegue en la Nube — La Granja B13

Esta guía explica cómo funciona el almacenamiento de datos de la plataforma y cómo desplegarla de forma **100% gratuita** en servicios como **Render**, **Supabase** o **Vercel/Netlify**.

---

## 1. ¿Cómo se guardan los datos actualmente? (Arquitectura Híbrida LocalFirst)

La plataforma cuenta con un sistema **híbrido**:
1. **En el Navegador (LocalStorage):**
   - El progreso, puntajes, décimas e insignias de cada estudiante se guardan de forma instantánea y segura en el dispositivo local.
   - **Ventaja:** Funciona sin internet, sin caídas de servidor y con velocidad inmediata en la sala de clases o en la granja física.
2. **En la Nube / Servidor (Sincronización Automática en Segundo Plano):**
   - Cada vez que un estudiante responde una pregunta o actualiza su cuaderno, la función `syncWithServer()` envía automáticamente los datos a la API (`POST /api/sync`).
   - El servidor guarda el registro consolidado en la base de datos para que el profesor pueda consultar las notas de todos los alumnos de la escuela desde cualquier computador.

---

## 2. Opción Recomendada: Despliegue Gratuito en Render (Node.js + Base de Datos)

El proyecto ya incluye todos los archivos necesarios (`package.json`, `server.js`).

### Pasos para publicar en Render (Paso a Paso):

1. **Subir el proyecto a GitHub:**
   - Crea un repositorio en GitHub (ej: `la-granja-b13`) y sube todos los archivos de esta carpeta.
2. **Crear cuenta en Render:**
   - Ingresa a [https://render.com](https://render.com) e inicia sesión con tu cuenta de GitHub.
3. **Crear un nuevo Web Service:**
   - En el panel de Render, haz clic en **"New +"** → **"Web Service"**.
   - Selecciona tu repositorio `la-granja-b13`.
4. **Configurar los parámetros:**
   - **Name:** `la-granja-b13` (o el nombre que elijas).
   - **Region:** Ohio (US East) o Frankfurt.
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** `Free` ($0/mes)
5. **Hacer clic en "Create Web Service":**
   - En unos 2 minutos, Render compilará el proyecto y te entregará una URL pública segura (ej: `https://la-granja-b13.onrender.com`).
   - ¡Cualquier estudiante o profesor podrá acceder desde su teléfono, tablet o computador!

### Endpoints Útiles del Servidor para los Docentes:
- `https://tu-url.onrender.com/` → Acceso al juego (Potrero y Mapa).
- `https://tu-url.onrender.com/api/students` → Lista en JSON de todos los alumnos evaluados y sus puntajes.
- `https://tu-url.onrender.com/api/export-csv` → **Descarga automática de una planilla Excel/CSV** con las notas y décimas de todos los estudiantes del liceo.

> [!NOTE]
> **Sobre el plan gratuito de Render:**
> En el plan gratuito de Render, el servidor entra en reposo después de 15 minutos sin visitas. Al recibir una nueva visita, tarda unos 40 segundos en reactivarse. Gracias a la arquitectura híbrida que creamos, **el juego no se detiene nunca** y los estudiantes pueden jugar de inmediato mientras el servidor despierta en segundo plano.

---

## 3. Alternativa Serverless Gratuita: Supabase (PostgreSQL en la Nube)

Si prefieres una base de datos SQL que **nunca entre en reposo**:
1. Crea una cuenta gratuita en [https://supabase.com](https://supabase.com).
2. Crea un proyecto y una tabla `evaluaciones_estudiantes`:
   - `id` (text, primary key)
   - `nombre_estudiante` (text)
   - `curso` (text)
   - `puntaje` (integer)
   - `quizzes_completados` (integer)
   - `decimas_sugeridas` (numeric)
   - `datos_completos` (jsonb)
   - `fecha_actualizacion` (timestamp)
3. Conectar Supabase permite que el panel docente tenga actualizaciones en tiempo real y panel administrativo web integrado.

---

## 4. Pruebas Locales en tu Computador

Si deseas probar el servidor y la base de datos localmente antes de subir a Render:
```bash
# 1. Abrir terminal en la carpeta del proyecto
cd "c:\Users\stebr\Downloads\la-granja-b13 2.0\la-granja-b13"

# 2. Iniciar el servidor
node server.js
```
Abre tu navegador en `http://localhost:3000` para probar el juego y la base de datos local en `data/database.json`.
