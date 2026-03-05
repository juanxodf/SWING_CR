import './style.css';
import { App }              from './app.js';
import { renderFormulario } from './ui/formulario.js';
import { DIAS }             from './utils/constantes.js';
import { decimalAHora }     from './models/Evento.js';

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
  <hr>
  <div id="contenedor-lista"></div>
  <div id="contenedor-formulario"></div>
`;

const formContenedor  = document.querySelector('#contenedor-formulario');
const listaContenedor = document.querySelector('#contenedor-lista');

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
        pintarLista();
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

function abrirFormulario(eventoEditar = null) {
  renderFormulario(formContenedor, app.eventos, (datos, tipo) => {
    const resultado = app.guardarEvento(datos, tipo);
    if (resultado.ok) {
      formContenedor.innerHTML = '';
      pintarLista();
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
    pintarLista();
  });
});

pintarLista();