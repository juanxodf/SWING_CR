import { ControlAlmacenamiento } from './storage/ControlAlmacenamiento.js';
import { Clase } from './models/Clase.js';
import { Actividad } from './models/Actividad.js';
import { validarRangoFestival, validarUbicacion } from './utils/validaciones.js';

export class App {
  constructor() {
    this.storage = new ControlAlmacenamiento();
    this.eventos = this.storage.cargar();
  }

  init() {
    console.log('App iniciada. Eventos:', this.eventos.length);
  }

  guardarEvento(datos, tipo) {
    const rangoOk = validarRangoFestival(datos.dia, datos.horaInicio, datos.horaFin);
    if (!rangoOk.valido) return { ok: false, error: rangoOk.mensaje };

    const instancia = tipo === 'clase' ? new Clase(datos) : new Actividad(datos);

    const ubicacionOk = validarUbicacion(this.eventos, instancia);
    if (!ubicacionOk.valido) return { ok: false, error: ubicacionOk.mensaje };

    if (datos.id) {
      this.eventos = this.eventos.filter(e => e.id !== datos.id);
      instancia.id = datos.id;
    }

    this.eventos.push(instancia);
    this.storage.guardar(this.eventos);

    return { ok: true, evento: instancia };
  }

  eliminarEvento(id) {
    this.eventos = this.eventos.filter(e => e.id !== id);
    this.storage.guardar(this.eventos);
  }

  moverEvento(id, nuevoDia, nuevaHoraInicio, nuevaHoraFin) {
    const evento = this.eventos.find(e => e.id === id);
    if (!evento) return { ok: false, error: 'Evento no encontrado.' };

    const original = {
      dia: evento.dia,
      horaInicio: evento.horaInicio,
      horaFin: evento.horaFin
    };

    evento.dia = nuevoDia;
    evento.horaInicio = nuevaHoraInicio;
    evento.horaFin = nuevaHoraFin;

    const rangoOk = validarRangoFestival(nuevoDia, nuevaHoraInicio, nuevaHoraFin);
    const ubicacionOk = validarUbicacion(this.eventos, evento);

    if (!rangoOk.valido || !ubicacionOk.valido) {
      evento.dia = original.dia;
      evento.horaInicio = original.horaInicio;
      evento.horaFin = original.horaFin;
      return { ok: false, error: rangoOk.mensaje ?? ubicacionOk.mensaje };
    }

    this.storage.guardar(this.eventos);
    return { ok: true };
  }

}