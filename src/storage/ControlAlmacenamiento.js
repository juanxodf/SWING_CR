import { Clase }     from '../models/Clase.js';
import { Actividad } from '../models/Actividad.js';

export class ControlAlmacenamiento {
    constructor() {
        console.log('ControlAlmacenamiento inicializado');
    }

    cargar() {
        try {
            const texto = localStorage.getItem('CLAVE_EVENTOS');
            if (!texto) return []; 
            const datos = JSON.parse(texto);
            return datos.map(item => desdeJSON(item));
        } catch (error) {
            console.log('No se pudieron cargar los datos:', error);
            return [];
        }
    }

    guardar(eventos) {
        const datos = eventos.map(e => e.toJSON());
        localStorage.setItem('CLAVE_EVENTOS', JSON.stringify(datos));
    }

    limpiar() {
        localStorage.removeItem('CLAVE_EVENTOS');
    }
}

function desdeJSON(datos) {
    if (datos.tipo === 'clase') {
        return new Clase(datos);
    }
    return new Actividad(datos);
}
