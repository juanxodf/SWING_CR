import './style.css';
import { App } from './app.js';
import { renderFormulario } from './ui/formulario.js';
import { renderCalendario, activarDragDrop } from './ui/calendario.js';
import { DIAS } from './utils/constantes.js';
import { decimalAHora } from './models/Evento.js';
import { mostrarModal } from './ui/modal.js';

const app = new App();
let diaActivo = 'Viernes';

document.querySelector('#app').innerHTML = `
  <div class="header">
    <div class="header-marca">
      <h1>♪ Swing CR Planner</h1>
      <p>VIII Festival · Ciudad Real 2026</p>
    </div>
    <button class="btn-primario" id="btn-nueva-entrada">+ Nueva entrada</button>
  </div>

  <nav class="dias-nav">
    ${DIAS.map((dia, i) => `
      <button class="dia-btn ${i === 0 ? 'activo' : ''}" data-dia="${dia}">${dia}</button>
    `).join('')}
  </nav>

  <div class="contenido">
    <aside id="contenedor-lista" class="panel-lateral"></aside>
    <div id="contenedor-calendario" class="calendario-contenedor"></div>
  </div>

  <div id="contenedor-formulario"></div>
`;

const formContenedor = document.querySelector('#contenedor-formulario');
const listaContenedor = document.querySelector('#contenedor-lista');
const calContenedor = document.querySelector('#contenedor-calendario');

function pintarLista() {
  const eventosDia = app.eventos
    .filter(e => e.dia === diaActivo)
    .sort((a, b) => a.horaInicio - b.horaInicio);

  if (eventosDia.length === 0) {
    listaContenedor.innerHTML = `
      <h2>Eventos del ${diaActivo}</h2>
      <div class="panel-vacio">
        <span>♪</span>
        <p>Sin eventos</p>
      </div>
    `;
    return;
  }

  listaContenedor.innerHTML = `
    <h2>Eventos del ${diaActivo}</h2>
    ${eventosDia.map(e => {
    const tipo = e.tipo === 'clase' ? 'clase' : e.tipoActividad?.toLowerCase();
    return `
        <div class="evento-item tipo-${tipo}">
          <div class="evento-item-titulo">${e.titulo}</div>
          <div class="evento-item-info">
            ${decimalAHora(e.horaInicio)}–${decimalAHora(e.horaFin)} · ${e.ubicacion}
          </div>
          <div class="evento-item-acciones">
            <button class="btn-secundario btn-editar"  data-id="${e.id}">Editar</button>
            <button class="btn-peligro   btn-eliminar" data-id="${e.id}">Eliminar</button>
          </div>
        </div>
      `;
  })}
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
    mostrarModal(evento, (ev) => abrirFormulario(ev), (id) => {
      app.eliminarEvento(id);
      pintarTodo();
    });
  });

  activarDragDrop(calContenedor, (id, nuevoDia, nuevaInicio) => {
    const evento = app.eventos.find(e => e.id === id);
    if (!evento) return { ok: false, error: 'Evento no encontrado.' };
    const duracion = evento.horaFin - evento.horaInicio;
    const resultado = app.moverEvento(id, nuevoDia, nuevaInicio, nuevaInicio + duracion);
    if (resultado.ok) pintarTodo();
    return resultado;
  });
}

function abrirFormulario(eventoEditar = null) {
  const overlay = document.createElement('div');
  overlay.className = 'formulario-overlay';
  overlay.id = 'formulario-overlay';
  document.body.appendChild(overlay);

  renderFormulario(overlay, app.eventos, (datos, tipo) => {
    const resultado = app.guardarEvento(datos, tipo);
    if (resultado.ok) {
      overlay.remove();
      pintarTodo();
    } else {
      alert(`Error: ${resultado.error}`);
    }
  }, eventoEditar);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });
}

document.querySelector('#btn-nueva-entrada').addEventListener('click', () => {
  abrirFormulario();
});

document.querySelectorAll('.dia-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.dia-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    diaActivo = btn.dataset.dia;
    pintarTodo();
  });
});

function pintarTodo() {
  pintarLista();
  pintarCalendario();
}

pintarTodo();