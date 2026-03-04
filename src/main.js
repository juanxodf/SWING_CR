import './style.css'
import { App } from './app.js';

const app = new App();
app.init();
console.log('Aplicación de Swing CR iniciandose....')

document.querySelector('#app').innerHTML = `
  <h1>Swing CR</h1>
  <p>VIII Festival · Ciudad Real 2026</p>
`

