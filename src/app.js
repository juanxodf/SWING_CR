import { ControlAlmacenamiento } from './storage/ControlAlmacenamiento.js';

export class App {
  constructor() {
    this.storage = new ControlAlmacenamiento();
    this.eventos = this.storage.cargar();
  }

  init() {
    console.log('App iniciada. Eventos cargados:', this.eventos.length);
  }
}
