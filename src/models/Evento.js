// Clase base: lo que tienen en común TODOS los eventos
export class Evento {
  constructor({ id, titulo, dia, horaInicio, horaFin, ubicacion }) {
    this.id         = id ?? crypto.randomUUID();
    this.titulo     = titulo;
    this.dia        = dia;        
    this.horaInicio = horaInicio;       
    this.horaFin    = horaFin;
    this.ubicacion  = ubicacion;
    this.creadoEn   = new Date().toISOString();
  }

  get duracionMinutos() {
    return (this.horaFin - this.horaInicio) * 60;
  }

  get horaInicioTexto() {
    return decimalAHora(this.horaInicio);
  }

  get horaFinTexto() {
    return decimalAHora(this.horaFin);
  }

  // Necesario para poder guardarlo en localStorage como JSON
  toJSON() {
    return { ...this };
  }
}

// Función que transforma el número decimal a formato "HH:MM" 
export function decimalAHora(decimal) {
  const horas   = Math.floor(decimal);
  const minutos = (decimal % 1) * 60;
  return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`;
}

// Función que hace lo contrario que decimalAHora
export function horaADecimal(horaTexto) {
  const [h, m] = horaTexto.split(':').map(Number);
  return h + m / 60;
}