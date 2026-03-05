import './style.css';
import { App }              from './app.js';
import { renderFormulario } from './ui/formulario.js';
import { renderCalendario, activarDragDrop } from './ui/calendario.js';
import { DIAS }             from './utils/constantes.js';
import { decimalAHora }     from './models/Evento.js';
import { mostrarModal }     from './ui/modal.js';

const app = new App();
let diaActivo = 'Viernes';

document.querySelector('#app').innerHTML = `
  <h1>Swing CR Planner</h1>
  <p>VIII Festival · Ciudad Real 2026</p>
  <hr>
  <button id="btn-nueva-entrada">+ Nueva entrada</button>
  <hr>
  <div>
    ${DIAS.map(dia => `<button class="dia-btn" data-dia="${dia}">${dia}</button>`).join('')}
  </div>
  <div id="contenedor-lista"></div>
  <div id="contenedor-formulario"></div>
  <div id="contenedor-calendario"></div>
`;

const formContenedor  = document.querySelector('#contenedor-formulario');
const listaContenedor = document.querySelector('#contenedor-lista');
const calContenedor   = document.querySelector('#contenedor-calendario');

function pintarLista() {
  const eventosDia = app.eventos
    .filter(e => e.dia === diaActivo)
    .sort((a, b) => a.horaInicio - b.horaInicio);

  if (eventosDia.length === 0) {
    listaContenedor.innerHTML = `<p>No hay eventos el ${diaActivo}.</p>`;
    return;
  }

  listaContenedor.innerHTML = `
    <h2>Eventos del ${diaActivo}</h2>
    <ul>
      ${eventosDia.map(e => `
        <li>
          <strong>${e.titulo}</strong>
          — ${decimalAHora(e.horaInicio)} a ${decimalAHora(e.horaFin)}
          — ${e.ubicacion}
          — ${e.tipo === 'clase' ? 'Clase · ' + e.nivel : e.tipoActividad}
          <button class="btn-editar"   data-id="${e.id}">Editar</button>
          <button class="btn-eliminar" data-id="${e.id}">Eliminar</button>
        </li>
      `).join('')}
    </ul>
  `;

  listaContenedor.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('¿Eliminar este evento?')) {
        app.eliminarEvento(btn.dataset.id);
        pintarTodo();
      }
    });
  });

  listaContenedor.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', () => {
      const evento = app.eventos.find(e => e.id === btn.dataset.id);
      if (evento) abrirFormulario(evento);
    });
  });
}

function pintarCalendario() {
  renderCalendario(calContenedor, app.eventos, diaActivo, (evento) => {
    mostrarModal(evento,(ev) => abrirFormulario(ev),(id) => {
        app.eliminarEvento(id);
        pintarTodo();
      }
    );
  });

  activarDragDrop(calContenedor, (id, nuevoDia, nuevaInicio) => {
    const evento = app.eventos.find(e => e.id === id);
    if (!evento) return { ok: false, error: 'Evento no encontrado.' };
    const duracion  = evento.horaFin - evento.horaInicio;
    const resultado = app.moverEvento(id, nuevoDia, nuevaInicio, nuevaInicio + duracion);
    if (resultado.ok) pintarTodo();
    return resultado;
  });
}

function abrirFormulario(eventoEditar = null) {
  renderFormulario(formContenedor, app.eventos, (datos, tipo) => {
    const resultado = app.guardarEvento(datos, tipo);
    if (resultado.ok) {
      formContenedor.innerHTML = '';
      pintarTodo();
    } else {
      alert(`Error: ${resultado.error}`);
    }
  }, eventoEditar);
}

document.querySelector('#btn-nueva-entrada').addEventListener('click', () => {
  abrirFormulario();
});

document.querySelectorAll('.dia-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    diaActivo = btn.dataset.dia;
    pintarTodo();
  });
});

function pintarTodo() {
  pintarLista();
  pintarCalendario();
}

pintarTodo();