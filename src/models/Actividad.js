import { Evento } from './Evento.js';

export class Actividad extends Evento {
  constructor(datos) {
    super(datos);
    this.tipo          = 'actividad';   
    this.tipoActividad = datos.tipoActividad ?? 'Social';   
    this.banda         = datos.banda ?? '';        
    this.profesores    = datos.profesores ?? [];   
    this.estilo        = datos.estilo ?? '';
    this.descripcion   = datos.descripcion ?? '';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tipo:          this.tipo,
      tipoActividad: this.tipoActividad,
      banda:         this.banda,
      profesores:    this.profesores,
      estilo:        this.estilo,
      descripcion:   this.descripcion,
    };
  }
}