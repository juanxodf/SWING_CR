import { Evento } from './Evento.js';

export class Clase extends Evento {
  constructor(datos) {
    super(datos);   // Llama al padre para inicializar los campos comunes a todos los eventos
    this.tipo         = 'clase'; // identificador de tipo, siempre fijo
    this.instructores = datos.instructores ?? []; 
    this.estilo       = datos.estilo ?? '';
    this.nivel        = datos.nivel ?? 'Libre';
  }

  // Sobreescribimos la función toJSON para incluir también los campos propios de Clase
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