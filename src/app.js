import { ControlAlmacenamiento } from './storage/ControlAlmacenamiento.js';
import { Clase }                 from './models/Clase.js';
import { Actividad }             from './models/Actividad.js';
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
    // Validamos rango del festival
    const rangoOk = validarRangoFestival(datos.dia, datos.horaInicio, datos.horaFin);
    if (!rangoOk.valido) return { ok: false, error: rangoOk.mensaje };

    // Crear clase o actividad (depende del boton que se pulse)
    const instancia = tipo === 'clase' ? new Clase(datos) : new Actividad(datos);

    // Mostramos la ubicación que está libre ( si está ocupada no se muestra ese sitio )
    const ubicacionOk = validarUbicacion(this.eventos, instancia);
    if (!ubicacionOk.valido) return { ok: false, error: ubicacionOk.mensaje };

    // Si es edición, eliminar el evento anterior
    if (datos.id) {
      this.eventos = this.eventos.filter(e => e.id !== datos.id);
      instancia.id = datos.id;
    }

    // Añadir y guardar
    this.eventos.push(instancia);
    this.storage.guardar(this.eventos);

    return { ok: true, evento: instancia };
  }

  eliminarEvento(id) {
    this.eventos = this.eventos.filter(e => e.id !== id);
    this.storage.guardar(this.eventos);
  }

}