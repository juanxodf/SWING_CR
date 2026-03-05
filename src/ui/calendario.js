import { DIAS, SALAS, TIPO_COLORES } from '../utils/constantes.js';
import { decimalAHora }              from '../models/Evento.js';

// Genera franjas de 30 en 30 minutos de 20:00 a 04:00
function generarFranjas() {
  const franjas = [];
  for (let h = 20; h <= 27.5; h += 0.5) {
    franjas.push(h);
  }
  return franjas;
}

export function renderCalendario(contenedor, eventos, diaActivo, onClickEvento) {
  const franjas    = generarFranjas();
  const eventosDia = eventos.filter(e => e.dia === diaActivo);

  // Tabla básica: columna de hora + una columna por sala + columna externos
  contenedor.innerHTML = `
    <h2>Programa del ${diaActivo}</h2>
    <table border="1" cellpadding="4" cellspacing="0">
      <thead>
        <tr>
          <th>Hora</th>
          ${SALAS.map(s => `<th>${s}</th>`).join('')}
          <th>Otros espacios</th>
        </tr>
      </thead>
      <tbody id="cuerpo-calendario">
      </tbody>
    </table>
  `;

  const cuerpo = contenedor.querySelector('#cuerpo-calendario');

  // Una fila por cada franja horaria
  franjas.forEach(franja => {
    const fila = document.createElement('tr');

    // Celda de hora
    const celdaHora = document.createElement('td');
    celdaHora.textContent = decimalAHora(franja);
    fila.appendChild(celdaHora);

    // Una celda por sala
    SALAS.forEach(sala => {
      const celda       = document.createElement('td');
      celda.dataset.sala = sala;
      celda.dataset.hora = franja;
      celda.dataset.dia  = diaActivo;

      // Busca si hay un evento que empiece en esta celda
      const evento = eventosDia.find(e =>
        e.ubicacion === sala && e.horaInicio === franja
      );

      if (evento) {
        const duracion  = (evento.horaFin - evento.horaInicio) / 0.5;
        celda.rowSpan   = duracion; // ocupa varias filas según duración
        celda.style.background = colorEvento(evento);
        celda.style.cursor     = 'pointer';
        celda.innerHTML = `
          <strong>${evento.titulo}</strong><br>
          <small>${decimalAHora(evento.horaInicio)} - ${decimalAHora(evento.horaFin)}</small>
        `;
        celda.addEventListener('click', () => onClickEvento(evento));
      }

      fila.appendChild(celda);
    });

    // Celda de otros espacios (actividades externas)
    const celdaExterna       = document.createElement('td');
    celdaExterna.dataset.sala = 'externos';
    celdaExterna.dataset.hora = franja;
    celdaExterna.dataset.dia  = diaActivo;

    const eventoExterno = eventosDia.find(e =>
      !SALAS.includes(e.ubicacion) && e.horaInicio === franja
    );

    if (eventoExterno) {
      celdaExterna.style.background = colorEvento(eventoExterno);
      celdaExterna.style.cursor     = 'pointer';
      celdaExterna.innerHTML = `
        <strong>${eventoExterno.titulo}</strong><br>
        <small>${eventoExterno.ubicacion}</small>
      `;
      celdaExterna.addEventListener('click', () => onClickEvento(eventoExterno));
    }

    fila.appendChild(celdaExterna);
    cuerpo.appendChild(fila);
  });
}

function colorEvento(evento) {
  if (evento.tipo === 'clase') return TIPO_COLORES['clase'];
  return TIPO_COLORES[evento.tipoActividad?.toLowerCase()] ?? '#888';
}