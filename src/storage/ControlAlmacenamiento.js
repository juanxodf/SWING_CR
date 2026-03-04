export class ControlAlmacenamiento {
    constructor() {
        console.log('ControlAlmacenamiento inicializado');
    }

    cargar() {
        try {
            const texto = localStorage.getItem(CLAVE);
            if (!texto) return []; 
            const datos = JSON.parse(texto);
            return datos.map(item => desdeJSON(item));
        } catch (error) {
            console.log('No se pudieron cargar los datos:', error);
            return [];
        }
    }

    // Convierte los objetos a JSON y los guarda
    guardar(eventos) {
        const datos = eventos.map(e => e.toJSON());
        localStorage.setItem(CLAVE, JSON.stringify(datos));
    }

    // Borra todo
    limpiar() {
        localStorage.removeItem(CLAVE);
    }
}

// Decide qué clase instanciar según el campo 'tipo'
function desdeJSON(datos) {
    if (datos.tipo === 'clase') {
        return new Clase(datos);
    }
    return new Actividad(datos);
}
