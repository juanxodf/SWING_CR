import './style.css'
import { App } from './app.js';

const app = new App();
app.init();
console.log('Aplicación de Swing CR iniciandose....')

// Esto lo he dejado aquí para ver que la app llega a este punto
document.querySelector('#app').innerHTML = `
  <h1>Swing CR</h1>
  <p>VIII Festival · Ciudad Real 2026</p>
`

