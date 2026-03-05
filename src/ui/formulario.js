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
  const horas = generarOpcionesHora();
  const tipoInicial = eventoEditar?.tipo ?? 'clase';

  contenedor.innerHTML = `
    <div class="formulario-panel">
      <h2>${eventoEditar ? 'Editar entrada' : 'Nueva entrada'}</h2>

      <div class="tipo-toggle">
        <button id="btn-tipo-clase"
          class="toggle-btn ${tipoInicial === 'clase' ? 'activo' : ''}">
          CLASE
        </button>
        <button id="btn-tipo-actividad"
          class="toggle-btn ${tipoInicial !== 'clase' ? 'activo' : ''}">
          ACTIVIDAD
        </button>
      </div>

      <div class="campo">
        <label>Título</label>
        <input id="f-titulo" type="text"
          value="${eventoEditar?.titulo ?? ''}"
          placeholder="Nombre del evento" />
      </div>

      <div class="campo">
        <label>Día</label>
        <select id="f-dia">
          ${DIAS.map(d => `
            <option value="${d}" ${eventoEditar?.dia === d ? 'selected' : ''}>${d}</option>
          `).join('')}
        </select>
      </div>

      <div class="fila-dos">
        <div class="campo">
          <label>Inicio</label>
          <select id="f-inicio">
            ${horas.map(h => `<option value="${h}">${h}</option>`).join('')}
          </select>
        </div>
        <div class="campo">
          <label>Fin</label>
          <select id="f-fin">
            ${horas.map(h => `<option value="${h}">${h}</option>`).join('')}
          </select>
        </div>
      </div>

      <div class="campo">
        <label>Ubicación</label>
        <select id="f-ubicacion">
          <option value="">— elige día y hora primero —</option>
        </select>
      </div>

      <p id="f-feedback"></p>

      <div id="campos-clase">
        <div class="campo">
          <label>Instructores (separados por coma)</label>
          <input id="f-instructores" type="text"
            value="${eventoEditar?.instructores?.join(', ') ?? ''}"
            placeholder="Ana García, Marco Ruiz" />
        </div>
        <div class="campo">
          <label>Estilo</label>
          <select id="f-estilo-clase">
            <option value="">— sin especificar —</option>
            ${ESTILOS.map(e => `
              <option value="${e}" ${eventoEditar?.estilo === e ? 'selected' : ''}>${e}</option>
            `).join('')}
          </select>
        </div>
        <div class="campo">
          <label>Nivel</label>
          <select id="f-nivel">
            ${NIVELES.map(n => `
              <option value="${n}" ${eventoEditar?.nivel === n ? 'selected' : ''}>${n}</option>
            `).join('')}
          </select>
        </div>
      </div>

      <div id="campos-actividad" style="display:none">
        <div class="campo">
          <label>Tipo de actividad</label>
          <select id="f-tipo-actividad">
            ${TIPOS_ACTIVIDAD.map(t => `
              <option value="${t}" ${eventoEditar?.tipoActividad === t ? 'selected' : ''}>${t}</option>
            `).join('')}
          </select>
        </div>
        <div class="campo">
          <label>Banda en directo</label>
          <input id="f-banda" type="text"
            value="${eventoEditar?.banda ?? ''}"
            placeholder="Nombre de la banda (opcional)" />
        </div>
        <div class="campo">
          <label>Profesores</label>
          <input id="f-profesores" type="text"
            value="${eventoEditar?.profesores?.join(', ') ?? ''}"
            placeholder="Nombre/s" />
        </div>
        <div class="campo">
          <label>Estilo</label>
          <select id="f-estilo-actividad">
            <option value="">— sin especificar —</option>
            ${ESTILOS.map(e => `
              <option value="${e}" ${eventoEditar?.estilo === e ? 'selected' : ''}>${e}</option>
            `).join('')}
          </select>
        </div>
        <div class="campo">
          <label>Descripción</label>
          <textarea id="f-descripcion" rows="3"
            placeholder="Información adicional">${eventoEditar?.descripcion ?? ''}</textarea>
        </div>
      </div>

      <div class="formulario-acciones">
        <button class="btn-cancelar" id="btn-cancelar">Cancelar</button>
        <button class="btn-guardar"  id="btn-guardar" disabled>Guardar</button>
      </div>
    </div>
  `;

  const selDia = contenedor.querySelector('#f-dia');
  const selInicio = contenedor.querySelector('#f-inicio');
  const selFin = contenedor.querySelector('#f-fin');
  const selUbicacion = contenedor.querySelector('#f-ubicacion');
  const feedback = contenedor.querySelector('#f-feedback');
  const btnGuardar = contenedor.querySelector('#btn-guardar');
  const camposClase = contenedor.querySelector('#campos-clase');
  const camposActiv = contenedor.querySelector('#campos-actividad');

  let tipoActual = tipoInicial;

  contenedor.querySelector('#btn-tipo-clase').addEventListener('click', () => {
    tipoActual = 'clase';
    contenedor.querySelector('#btn-tipo-clase').classList.add('activo');
    contenedor.querySelector('#btn-tipo-actividad').classList.remove('activo');
    camposClase.style.display = 'block';
    camposActiv.style.display = 'none';
    actualizarUbicaciones();
  });

  contenedor.querySelector('#btn-tipo-actividad').addEventListener('click', () => {
    tipoActual = 'actividad';
    contenedor.querySelector('#btn-tipo-actividad').classList.add('activo');
    contenedor.querySelector('#btn-tipo-clase').classList.remove('activo');
    camposClase.style.display = 'none';
    camposActiv.style.display = 'block';
    actualizarUbicaciones();
  });

  function actualizarUbicaciones() {
    const dia = selDia.value;
    const inicio = horaADecimal(selInicio.value);
    const fin = horaADecimal(selFin.value);

    if (inicio >= fin) {
      feedback.textContent = 'La hora de fin debe ser posterior al inicio.';
      feedback.className = 'feedback-error';
      selUbicacion.innerHTML = '<option value="">— revisa las horas —</option>';
      btnGuardar.disabled = true;
      return;
    }

    const rangoOk = validarRangoFestival(dia, inicio, fin);
    if (!rangoOk.valido) {
      feedback.textContent = rangoOk.mensaje;
      feedback.className = 'feedback-error';
      selUbicacion.innerHTML = '<option value="">— no disponible —</option>';
      btnGuardar.disabled = true;
      return;
    }

    const disponibles = tipoActual === 'clase'
      ? salasLibres(eventos, dia, inicio, fin, eventoEditar?.id)
      : ubicacionesDisponibles(eventos, dia, inicio, fin, eventoEditar?.id);

    if (disponibles.length === 0) {
      feedback.textContent = 'No hay ubicaciones libres en ese horario.';
      feedback.className = 'feedback-error';
      selUbicacion.innerHTML = '<option value="">— no hay sitio —</option>';
      btnGuardar.disabled = true;
    } else {
      feedback.textContent = '✓ ' + disponibles.length + ' ubicación/es disponibles';
      feedback.className = 'feedback-ok';
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
      feedback.textContent = 'El título es obligatorio.';
      feedback.className = 'feedback-error';
      contenedor.querySelector('#f-titulo').focus();
      return;
    }

    if (!selUbicacion.value) {
      feedback.textContent = 'Debes seleccionar una ubicación.';
      feedback.className = 'feedback-error';
      return;
    }

    const datosComunes = {
      id: eventoEditar?.id,
      titulo,
      dia: selDia.value,
      horaInicio: horaADecimal(selInicio.value),
      horaFin: horaADecimal(selFin.value),
      ubicacion: selUbicacion.value,
    };

    let datos;
    if (tipoActual === 'clase') {
      datos = {
        ...datosComunes,
        tipo: 'clase',
        instructores: contenedor.querySelector('#f-instructores').value
          .split(',').map(s => s.trim()).filter(Boolean),
        estilo: contenedor.querySelector('#f-estilo-clase').value,
        nivel: contenedor.querySelector('#f-nivel').value,
      };
    } else {
      datos = {
        ...datosComunes,
        tipoActividad: contenedor.querySelector('#f-tipo-actividad').value,
        banda: contenedor.querySelector('#f-banda').value.trim(),
        profesores: contenedor.querySelector('#f-profesores').value
          .split(',').map(s => s.trim()).filter(Boolean),
        estilo: contenedor.querySelector('#f-estilo-actividad').value,
        descripcion: contenedor.querySelector('#f-descripcion').value.trim(),
      };
    }

    onGuardar(datos, tipoActual);
  });

  contenedor.querySelector('#btn-cancelar').addEventListener('click', () => {
    contenedor.remove();
  });
}