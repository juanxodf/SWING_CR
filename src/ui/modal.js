import { decimalAHora } from '../models/Evento.js';

export function mostrarModal(evento, onEditar, onEliminar) {
  document.querySelector('#modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id    = 'modal-overlay';
  overlay.style.cssText = `
    position:fixed; inset:0;
    background:rgba(0,0,0,0.5);
    display:flex; align-items:center; justify-content:center;
  `;

  const infoExtra = evento.tipo === 'clase'
    ? `
      <p><strong>Instructores:</strong> ${evento.instructores?.join(', ') || '—'}</p>
      <p><strong>Nivel:</strong> ${evento.nivel}</p>
      <p><strong>Estilo:</strong> ${evento.estilo || '—'}</p>
    `
    : `
      <p><strong>Tipo:</strong> ${evento.tipoActividad}</p>
      <p><strong>Banda:</strong> ${evento.banda || '—'}</p>
      <p><strong>Profesores:</strong> ${evento.profesores?.join(', ') || '—'}</p>
      <p><strong>Estilo:</strong> ${evento.estilo || '—'}</p>
      <p><strong>Descripción:</strong> ${evento.descripcion || '—'}</p>
    `;

  overlay.innerHTML = `
    <div style="background:white; color:black; padding:24px;
                border-radius:8px; max-width:400px; width:90%">

      <h2>${evento.titulo}</h2>
      <p><strong>Tipo:</strong> ${evento.tipo}</p>
      <p><strong>Día:</strong> ${evento.dia}</p>
      <p><strong>Horario:</strong>
        ${decimalAHora(evento.horaInicio)} — ${decimalAHora(evento.horaFin)}
        (${evento.duracionMinutos} min)
      </p>
      <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>

      <hr>
      ${infoExtra}
      <hr>

      <button id="modal-editar">Editar</button>
      <button id="modal-eliminar">Eliminar</button>
      <button id="modal-cerrar">Cerrar</button>
    </div>
  `;

  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.remove();
  });

  overlay.querySelector('#modal-cerrar').addEventListener('click', () => {
    overlay.remove();
  });

  overlay.querySelector('#modal-editar').addEventListener('click', () => {
    overlay.remove();
    onEditar(evento);
  });

  overlay.querySelector('#modal-eliminar').addEventListener('click', () => {
    if (confirm(`¿Eliminar "${evento.titulo}"?`)) {
      overlay.remove();
      onEliminar(evento.id);
    }
  });

  document.body.appendChild(overlay);
}