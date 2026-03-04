// Las tres salas donde se imparten clases
export const SALAS = ['Be Hopper', 'New Orleans', 'Savoy'];

// Ubicaciones externas donde solo van actividades
export const UBICACIONES_EXTERNAS = [
  'Antiguo Casino de Ciudad Real',
  'Parque de Gasset',
  'Prado'
];

// Todos los lugares juntos
export const TODAS_UBICACIONES = [...SALAS, ...UBICACIONES_EXTERNAS];

// Los tres días del festival
export const DIAS = ['Viernes', 'Sábado', 'Domingo'];

// Horario límite del festival
export const FESTIVAL = {
  inicio: { dia: 'Viernes', hora: 20 },
  fin:    { dia: 'Domingo', hora: 20 },
};

// Opciones de los desplegables del formulario
export const ESTILOS = ['Lindy Hop', 'Shag', 'Solo Jazz', 'Charleston', 'Balboa', 'Blues'];
export const NIVELES = ['Libre', 'Básico', 'Intermedio', 'Avanzado'];
export const TIPOS_ACTIVIDAD = ['Taster', 'Social', 'Concierto', 'Mix & Match'];

// Color de cada tipo de evento en el calendario
export const TIPO_COLORES = {
  'clase':       '#2a9d8f',
  'social':      '#c0435a',
  'concierto':   '#6a4c93',
  'taster':      '#d4a017',
  'mix & match': '#e76f51',
};