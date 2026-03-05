import { DIAS, SALAS, TIPO_COLORES } from '../utils/constantes.js';
import { decimalAHora }              from '../models/Evento.js';

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
      <tbody id="cuerpo-calendario"></tbody>
    </table>
  `;

  const cuerpo = contenedor.querySelector('#cuerpo-calendario');

  const filasOcupadas = {};
  SALAS.forEach(s => filasOcupadas[s] = 0);
  filasOcupadas['externos'] = 0;

  franjas.forEach(franja => {
    const fila = document.createElement('tr');

    const celdaHora = document.createElement('td');
    celdaHora.textContent = decimalAHora(franja);
    fila.appendChild(celdaHora);

    SALAS.forEach(sala => {
      if (filasOcupadas[sala] > 0) {
        filasOcupadas[sala]--;
        return;
      }

      const celda        = document.createElement('td');
      celda.dataset.sala = sala;
      celda.dataset.hora = franja;
      celda.dataset.dia  = diaActivo;

      const evento = eventosDia.find(e =>
        e.ubicacion === sala && e.horaInicio === franja
      );

      if (evento) {
        const duracion  = Math.round((evento.horaFin - evento.horaInicio) / 0.5);
        celda.rowSpan   = duracion;
        celda.dataset.id       = evento.id;
        celda.style.background = colorEvento(evento);
        celda.style.cursor     = 'pointer';
        celda.style.verticalAlign = 'top';
        celda.innerHTML = `
          <strong>${evento.titulo}</strong><br>
          <small>${decimalAHora(evento.horaInicio)} - ${decimalAHora(evento.horaFin)}</small>
        `;
        celda.addEventListener('click', () => onClickEvento(evento));

        filasOcupadas[sala] = duracion - 1;
      }

      fila.appendChild(celda);
    });

    if (filasOcupadas['externos'] > 0) {
      filasOcupadas['externos']--;
    } else {
      const celdaExterna        = document.createElement('td');
      celdaExterna.dataset.sala = 'externos';
      celdaExterna.dataset.hora = franja;
      celdaExterna.dataset.dia  = diaActivo;
      celdaExterna.style.verticalAlign = 'top';

      const eventosExternos = eventosDia.filter(e =>
        !SALAS.includes(e.ubicacion) && e.horaInicio === franja
      );

      if (eventosExternos.length > 0) {
        const maxDuracion = Math.max(
          ...eventosExternos.map(e => Math.round((e.horaFin - e.horaInicio) / 0.5))
        );
        celdaExterna.rowSpan = maxDuracion;
        filasOcupadas['externos'] = maxDuracion - 1;

        celdaExterna.innerHTML = eventosExternos.map(e => `
          <div data-id="${e.id}"
            style="background:${colorEvento(e)}; cursor:pointer;
                   margin-bottom:2px; padding:2px 4px; border-radius:3px">
            <strong>${e.titulo}</strong><br>
            <small>${e.ubicacion} · ${decimalAHora(e.horaInicio)}-${decimalAHora(e.horaFin)}</small>
          </div>
        `).join('');

        celdaExterna.querySelectorAll('div[data-id]').forEach(div => {
          const evento = eventosExternos.find(e => e.id === div.dataset.id);
          div.addEventListener('click', () => onClickEvento(evento));
        });
      }

      fila.appendChild(celdaExterna);
    }

    cuerpo.appendChild(fila);
  });
}

function colorEvento(evento) {
  if (evento.tipo === 'clase') return TIPO_COLORES['clase'];
  return TIPO_COLORES[evento.tipoActividad?.toLowerCase()] ?? '#888';
}