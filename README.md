# 🎷 Swing CR — VIII Festival de Swing Ciudad Real (2026)

Aplicación web para la **gestión, planificación y visualización del programa oficial** del  
**VIII Festival de Swing Ciudad Real (2026)**.

Este proyecto simula una herramienta real de organización de eventos culturales, permitiendo registrar, editar y visualizar **clases, actividades sociales, conciertos y talleres** que se desarrollan durante un fin de semana de festival.


## 🕺 ¿Qué es este proyecto?

**Swing CR** es una aplicación web desarrollada como proyecto académico para aplicar de forma integrada:

- Diseño de interfaces web (UX/UI)
- Programación en JavaScript moderno
- Programación Orientada a Objetos
- Gestión de eventos y formularios
- Persistencia en el navegador
- Arquitectura modular
- Metodología ágil SCRUM

El proyecto recrea un escenario real: la organización del programa del  
**VIII Festival de Swing Ciudad Real (2026)**, un evento que se celebra desde el viernes a las 20:00 hasta el domingo a las 20:00.


## 🎼 ¿Qué permite hacer?

La aplicación permite a la organización del festival:

### 📅 1. Registrar eventos y clases
A través de un formulario se pueden crear:

#### Clases
- Profesores/as
- Estilo (Lindy Hop, Shag, Solo Jazz…)
- Nivel (básico, intermedio, avanzado…)
- Sala (Be Hopper, New Orleans o Savoy)

#### Actividades
- Tipo (Taster, social, concierto, mix & match…)
- Banda en directo
- Profesores implicados
- Estilo
- Descripción
- Ubicación (Casino, Parque de Gasset, Prado o salas si están libres)

El sistema comprueba automáticamente:
- Disponibilidad de salas
- Conflictos de horario
- Si el registro es viable o no


### 🗂️ 2. Generar automáticamente el programa del festival
Cada actividad o clase aparece en una **tabla de programación visual** organizada por día y hora.

Cada evento se representa como una **tarjeta** que muestra:
- Nombre
- Ubicación

Al pulsar una tarjeta se abre un **modal** con toda la información detallada.


### 🔀 3. Reorganizar eventos con Drag & Drop
Las tarjetas pueden moverse a otra franja horaria arrastrándolas con el ratón, siempre que:
- La ubicación siga estando disponible
- No se solapen clases en las salas


## 🎨 Diseño y experiencia de usuario

El proyecto cuida especialmente la experiencia del usuario:

- Interfaz inspirada en la estética **swing & jazz**
- Diseño responsive para móvil, tablet y escritorio
- Uso de grid y flexbox
- Paleta de colores temática
- Navegación clara y visual

Se incluyen **wireframes y mockups** previos como parte del proceso de diseño.


## 🧠 Arquitectura y tecnología

El proyecto está construido con:

- **Vite** como entorno de desarrollo
- **HTML5 + CSS3**
- **JavaScript ES6+**
- **Programación Orientada a Objetos**
- **LocalStorage** para persistencia
- Arquitectura modular (`import` / `export`)
- Gestión de eventos y formularios
- Validación de datos



## 🗃️ Metodología de trabajo

El desarrollo sigue una aproximación a **SCRUM**:

- Funcionalidades organizadas por **historias de usuario**
- Trabajo dividido en **sprints**
- Seguimiento mediante **Github**
- Commits progresivos y coherentes


## 🧩 Finalidad del proyecto

Este proyecto no solo pretende resolver un problema técnico, sino **simular una aplicación real** que podría usar la organización de un festival para:

- Evitar solapamientos
- Gestionar espacios
- Publicar el programa
- Facilitar cambios de última hora


## 📌 Autoría

Proyecto desarrollado por  
**Juan Caravantes Martín-Pozuelo**  
como parte de las asignaturas de **Desarrollo Web en Entorno Cliente** y **Diseño de Interfaces Web**.


> _“Un buen festival no se improvisa… se coreografía.”_ 🎶  
> Swing CR convierte la programación en una pista de baile.
