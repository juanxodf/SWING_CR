import { DIAS, ESTILOS, NIVELES, TIPOS_ACTIVIDAD } from '../utils/constantes.js';
import { salasLibres, ubicacionesDisponibles, validarRangoFestival } from '../utils/validaciones.js';
import { horaADecimal } from '../models/Evento.js';

function generarOpcionesHora() {
  const opciones = [];
  for (let h = 20; h <= 28; h++) {
    const horaReal = h > 23 ? h - 24 : h;
    opciones.push(`${String(horaReal).padStart(2, '0')}:00`);
    if (h < 28) opciones.push(`${String(horaReal).padStart(2, '0')}:30`);
  }
  return opciones;
}

export function renderFormulario(contenedor, eventos, onGuardar, eventoEditar = null) {
  const horas       = generarOpcionesHora();
  const tipoInicial = eventoEditar?.tipo ?? 'clase';

  contenedor.innerHTML = `
    <hr>
    <h2>${eventoEditar ? 'Editar entrada' : 'Nueva entrada'}</h2>

    <p>
      <button id="btn-tipo-clase">CLASE</button>
      <button id="btn-tipo-actividad">ACTIVIDAD</button>
    </p>

    <p>
      <label>Título: 
        <input id="f-titulo" type="text" value="${eventoEditar?.titulo ?? ''}" />
      </label>
    </p>

    <p>
      <label>Día:
        <select id="f-dia">
          ${DIAS.map(d => `
            <option value="${d}" ${eventoEditar?.dia === d ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>
      </label>
    </p>

    <p>
      <label>Inicio:
        <select id="f-inicio">
          ${horas.map(h => `<option value="${h}">${h}</option>`).join('')}
        </select>
      </label>
      <label>Fin:
        <select id="f-fin">
          ${horas.map(h => `<option value="${h}">${h}</option>`).join('')}
        </select>
      </label>
    </p>

    <p>
      <label>Ubicación:
        <select id="f-ubicacion">
          <option value="">— primero elige día y hora —</option>
        </select>
      </label>
    </p>

    <p id="f-feedback"></p>

    <!-- Campos CLASE -->
    <div id="campos-clase">
      <p>
        <label>Instructores (separados por coma):
          <input id="f-instructores" type="text"
            value="${eventoEditar?.instructores?.join(', ') ?? ''}" />
        </label>
      </p>
      <p>
        <label>Estilo:
          <select id="f-estilo-clase">
            <option value="">— sin especificar —</option>
            ${ESTILOS.map(e => `
              <option value="${e}" ${eventoEditar?.estilo === e ? 'selected' : ''}>${e}</option>
            `).join('')}
          </select>
        </label>
      </p>
      <p>
        <label>Nivel:
          <select id="f-nivel">
            ${NIVELES.map(n => `
              <option value="${n}" ${eventoEditar?.nivel === n ? 'selected' : ''}>${n}</option>
            `).join('')}
          </select>
        </label>
      </p>
    </div>

    <!-- Campos ACTIVIDAD -->
    <div id="campos-actividad" style="display:none">
      <p>
        <label>Tipo de actividad:
          <select id="f-tipo-actividad">
            ${TIPOS_ACTIVIDAD.map(t => `
              <option value="${t}" ${eventoEditar?.tipoActividad === t ? 'selected' : ''}>${t}</option>
            `).join('')}
          </select>
        </label>
      </p>
      <p>
        <label>Banda en directo:
          <input id="f-banda" type="text" value="${eventoEditar?.banda ?? ''}" />
        </label>
      </p>
      <p>
        <label>Profesores:
          <input id="f-profesores" type="text"
            value="${eventoEditar?.profesores?.join(', ') ?? ''}" />
        </label>
      </p>
      <p>
        <label>Estilo:
          <select id="f-estilo-actividad">
            <option value="">— sin especificar —</option>
            ${ESTILOS.map(e => `
              <option value="${e}" ${eventoEditar?.estilo === e ? 'selected' : ''}>${e}</option>
            `).join('')}
          </select>
        </label>
      </p>
      <p>
        <label>Descripción:
          <textarea id="f-descripcion">${eventoEditar?.descripcion ?? ''}</textarea>
        </label>
      </p>
    </div>

    <p>
      <button id="btn-cancelar">Cancelar</button>
      <button id="btn-guardar" disabled>Guardar</button>
    </p>
    <hr>
  `;

  // Valor de los campos
  const selDia       = contenedor.querySelector('#f-dia');
  const selInicio    = contenedor.querySelector('#f-inicio');
  const selFin       = contenedor.querySelector('#f-fin');
  const selUbicacion = contenedor.querySelector('#f-ubicacion');
  const feedback     = contenedor.querySelector('#f-feedback');
  const btnGuardar   = contenedor.querySelector('#btn-guardar');
  const camposClase  = contenedor.querySelector('#campos-clase');
  const camposActiv  = contenedor.querySelector('#campos-actividad');

  let tipoActual = tipoInicial;

  // Cambio de tipo (clase/actividad)
  contenedor.querySelector('#btn-tipo-clase').addEventListener('click', () => {
    tipoActual = 'clase';
    camposClase.style.display = 'block';
    camposActiv.style.display = 'none';
    actualizarUbicaciones();
  });

  contenedor.querySelector('#btn-tipo-actividad').addEventListener('click', () => {
    tipoActual = 'actividad';
    camposClase.style.display = 'none';
    camposActiv.style.display = 'block';
    actualizarUbicaciones();
  });

  // Ubicaciones disponibles
  function actualizarUbicaciones() {
    const dia    = selDia.value;
    const inicio = horaADecimal(selInicio.value);
    const fin    = horaADecimal(selFin.value);

    const rangoOk = validarRangoFestival(dia, inicio, fin);
    if (!rangoOk.valido) {
      feedback.textContent       = '!! ' + rangoOk.mensaje + ' !!';
      selUbicacion.innerHTML     = '<option value="">— no disponible —</option>';
      btnGuardar.disabled        = true;
      return;
    }

    const disponibles = tipoActual === 'clase'
      ? salasLibres(eventos, dia, inicio, fin, eventoEditar?.id)
      : ubicacionesDisponibles(eventos, dia, inicio, fin, eventoEditar?.id);

    if (disponibles.length === 0) {
      feedback.textContent   = '!! No hay ubicaciones libres en ese horario. !!';
      selUbicacion.innerHTML = '<option value="">— no hay sitio —</option>';
      btnGuardar.disabled    = true;
    } else {
      feedback.textContent   = '✓ Ubicaciones disponibles: ' + disponibles.join(', ');
      selUbicacion.innerHTML = disponibles.map(u => `
        <option value="${u}" ${eventoEditar?.ubicacion === u ? 'selected' : ''}>${u}</option>
      `).join('');
      btnGuardar.disabled = false;
    }
  }

  [selDia, selInicio, selFin].forEach(el => {
    el.addEventListener('change', actualizarUbicaciones);
  });

  actualizarUbicaciones();

  btnGuardar.addEventListener('click', () => {
    const titulo = contenedor.querySelector('#f-titulo').value.trim();
    if (!titulo) {
      feedback.textContent = '!! El título es obligatorio. !!';
      return;
    }

    const datosComunes = {
      id:         eventoEditar?.id,
      titulo,
      dia:        selDia.value,
      horaInicio: horaADecimal(selInicio.value),
      horaFin:    horaADecimal(selFin.value),
      ubicacion:  selUbicacion.value,
    };

    let datos;
    if (tipoActual === 'clase') {
      datos = {
        ...datosComunes,
        tipo:         'clase',
        instructores: contenedor.querySelector('#f-instructores').value
                        .split(',').map(s => s.trim()).filter(Boolean),
        estilo:       contenedor.querySelector('#f-estilo-clase').value,
        nivel:        contenedor.querySelector('#f-nivel').value,
      };
    } else {
      datos = {
        ...datosComunes,
        tipoActividad: contenedor.querySelector('#f-tipo-actividad').value,
        banda:         contenedor.querySelector('#f-banda').value.trim(),
        profesores:    contenedor.querySelector('#f-profesores').value
                         .split(',').map(s => s.trim()).filter(Boolean),
        estilo:        contenedor.querySelector('#f-estilo-actividad').value,
        descripcion:   contenedor.querySelector('#f-descripcion').value.trim(),
      };
    }

    onGuardar(datos, tipoActual);
  });

  contenedor.querySelector('#btn-cancelar').addEventListener('click', () => {
    contenedor.innerHTML = '';
  });
}