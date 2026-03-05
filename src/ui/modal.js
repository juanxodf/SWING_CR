import { decimalAHora } from '../models/Evento.js';

export function mostrarModal(evento, onEditar, onEliminar) {
    document.querySelector('#modal-overlay')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.className = 'modal-overlay';

    const infoExtra = evento.tipo === 'clase'
        ? `
      <div class="ficha">
        <span class="ficha-etiqueta">Instructores</span>
        <span class="ficha-valor">${evento.instructores?.join(', ') || '—'}</span>
      </div>
      <div class="ficha">
        <span class="ficha-etiqueta">Nivel</span>
        <span class="ficha-valor">${evento.nivel || '—'}</span>
      </div>
      <div class="ficha">
        <span class="ficha-etiqueta">Estilo</span>
        <span class="ficha-valor">${evento.estilo || '—'}</span>
      </div>
    `
        : `
      <div class="ficha">
        <span class="ficha-etiqueta">Tipo</span>
        <span class="ficha-valor">${evento.tipoActividad}</span>
      </div>
      <div class="ficha">
        <span class="ficha-etiqueta">Banda</span>
        <span class="ficha-valor">${evento.banda || '—'}</span>
      </div>
      <div class="ficha">
        <span class="ficha-etiqueta">Estilo</span>
        <span class="ficha-valor">${evento.estilo || '—'}</span>
      </div>
      ${evento.descripcion ? `
        <div class="ficha ficha-full">
          <span class="ficha-etiqueta">Descripción</span>
          <span class="ficha-valor">${evento.descripcion}</span>
        </div>
      ` : ''}
    `;

    overlay.innerHTML = `
    <div class="modal-caja">
      <div class="modal-tipo">${evento.tipo === 'clase' ? 'CLASE' : evento.tipoActividad?.toUpperCase()}</div>
      <h2 class="modal-titulo">${evento.titulo}</h2>

      <div class="modal-fichas">
        <div class="ficha">
          <span class="ficha-etiqueta">Día</span>
          <span class="ficha-valor">${evento.dia}</span>
        </div>
        <div class="ficha">
          <span class="ficha-etiqueta">Horario</span>
          <span class="ficha-valor">
            ${decimalAHora(evento.horaInicio)} — ${decimalAHora(evento.horaFin)}
          </span>
        </div>
        <div class="ficha">
          <span class="ficha-etiqueta">Ubicación</span>
          <span class="ficha-valor">${evento.ubicacion}</span>
        </div>
        <div class="ficha">
          <span class="ficha-etiqueta">Duración</span>
          <span class="ficha-valor">${evento.duracionMinutos} min</span>
        </div>
        ${infoExtra}
      </div>

      <div class="modal-acciones">
        <button class="btn-secundario" id="modal-cerrar">Cerrar</button>
        <button class="btn-secundario" id="modal-editar">Editar</button>
        <button class="btn-peligro"    id="modal-eliminar">Eliminar</button>
      </div>
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