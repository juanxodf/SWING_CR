import { SALAS, UBICACIONES_EXTERNAS } from './constantes.js';
import { DIAS, FESTIVAL } from './constantes.js';

function seSuperponen(aInicio, aFin, bInicio, bFin) {
  return aInicio < bFin && aFin > bInicio;
}

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

export function salasLibres(eventos, dia, horaInicio, horaFin, excludeId = null) {
  const ocupadas = salasOcupadas(eventos, dia, horaInicio, horaFin, excludeId);
  return SALAS.filter(sala => !ocupadas.includes(sala));
}

export function ubicacionesDisponibles(eventos, dia, horaInicio, horaFin, excludeId = null) {
  const salasConClase = eventos
    .filter(evento =>
      evento.tipo      === 'clase'   &&
      evento.dia       === dia       &&
      evento.id        !== excludeId && 
      seSuperponen(horaInicio, horaFin, evento.horaInicio, evento.horaFin)
    ).map(evento => evento.ubicacion);

  const salasDisponibles = SALAS.filter(sala => !salasConClase.includes(sala));
  return [...salasDisponibles, ...UBICACIONES_EXTERNAS];
}


export function validarUbicacion(eventos, evento) {
  const { tipo, dia, horaInicio, horaFin, ubicacion, id } = evento;

  if (tipo === 'clase') {
    const libres = salasLibres(eventos, dia, horaInicio, horaFin, id);
    if (!libres.includes(ubicacion)) {
      return {
        valido: false,
        mensaje: `${ubicacion} ya está ocupada en ese horario.`
      };
    }
  } else {
    const disponibles = ubicacionesDisponibles(eventos, dia, horaInicio, horaFin, id);
    if (!disponibles.includes(ubicacion)) {
      return {
        valido: false,
        mensaje: `${ubicacion} tiene una clase en ese horario y no puede usarse.`
      };
    }
  }

  return { valido: true };
}

export function validarRangoFestival(dia, horaInicio, horaFin) {
  const indiceDia    = DIAS.indexOf(dia);
  const indiceInicio = DIAS.indexOf(FESTIVAL.inicio.dia); // 0 (Viernes)
  const indiceFin    = DIAS.indexOf(FESTIVAL.fin.dia);    // 2 (Domingo)

  if (indiceDia < indiceInicio || indiceDia > indiceFin) {
    return { valido: false, mensaje: 'El día está fuera del festival (Viernes–Domingo).' };
  }

  if (indiceDia === indiceInicio && horaInicio < FESTIVAL.inicio.hora) {
    return { valido: false, mensaje: 'El festival empieza el Viernes a las 20:00.' };
  }

  if (indiceDia === indiceFin && horaFin > FESTIVAL.fin.hora) {
    return { valido: false, mensaje: 'El festival termina el Domingo a las 20:00.' };
  }

  if (horaInicio >= horaFin) {
    return { valido: false, mensaje: 'La hora de inicio debe ser anterior a la de fin.' };
  }

  return { valido: true };
}