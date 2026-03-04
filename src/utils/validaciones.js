// esto es posiblemente lo que más odio, pero me va a facilitar la vida 
import { SALAS, UBICACIONES_EXTERNAS } from './constantes.js';


// No sabía como hacerlo pero esta función comprueba si dos franjas horarias se superponen
// Ejemplo: [20:00-21:30] y [21:00-22:00] SÍ se superponen
// Ejemplo: [20:00-21:00] y [21:00-22:00] NO se superponen 
function seSuperponen(aInicio, aFin, bInicio, bFin) {
  return aInicio < bFin && aFin > bInicio;
}

// Devuelve qué salas están ocupadas en un día y franja horaria concretos
// excludeId es el id del evento que estamos editando, esta para no bloquearse a sí mismo, que ya me ha pasado varias veces al probarlo
export function salasOcupadas(eventos, dia, horaInicio, horaFin, excludeId = null) {
  return eventos
    .filter(evento =>
      evento.dia       === dia &&
      evento.id        !== excludeId &&
      SALAS.includes(evento.ubicacion) &&
      seSuperponen(horaInicio, horaFin, evento.horaInicio, evento.horaFin)
    )
    .map(evento => evento.ubicacion);
}

// Devuelve las salas que están libres
export function salasLibres(eventos, dia, horaInicio, horaFin, excludeId = null) {
  const ocupadas = salasOcupadas(eventos, dia, horaInicio, horaFin, excludeId);
  return SALAS.filter(sala => !ocupadas.includes(sala));
}