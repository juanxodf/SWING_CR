import { Evento } from './Evento.js';

export class Clase extends Evento {
  constructor(datos) {
    super(datos);   
    this.tipo         = 'clase'; 
    this.instructores = datos.instructores ?? []; 
    this.estilo       = datos.estilo ?? '';
    this.nivel        = datos.nivel ?? 'Libre';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      tipo:         this.tipo,
      instructores: this.instructores,
      estilo:       this.estilo,
      nivel:        this.nivel,
    };
  }
}