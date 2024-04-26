(function() {
    // Obtener el input de búsqueda de ponentes
    const ponentesInput = document.querySelector('#ponentes');

    // Verificar si el input de búsqueda existe
    if(ponentesInput) {
        // Declarar arreglos para almacenar los ponentes y los ponentes filtrados
        let ponentes = [];
        let ponentesFiltrados = [];

        // Obtener el contenedor de la lista de ponentes
        const listadoPonentes = document.querySelector('#listado-ponentes');

        // Obtener el input oculto que almacena el id del ponente seleccionado
        const ponenteHidden = document.querySelector('[name="ponente_id"]');

        // Llamar a la función para obtener los ponentes
        obtenerPonentes();

        // Agregar un listener al input de búsqueda para filtrar los ponentes
        ponentesInput.addEventListener('input', buscarPonentes);

        // Si existe un ponente seleccionado previamente, obtenerlo y mostrarlo
        if(ponenteHidden.value) {
            (async() => {
                const ponente = await obtenerPonente(ponenteHidden.value);
                const { nombre, apellido } = ponente;

                // Insertar en el HTML
                const ponenteDOM = document.createElement('LI');
                ponenteDOM.classList.add('listado-ponentes__ponente', 'listado-ponentes__ponente--seleccionado');
                ponenteDOM.textContent = `${nombre} ${apellido}`;

                listadoPonentes.appendChild(ponenteDOM);
            })();
        }

        // Función para obtener todos los ponentes
        async function obtenerPonentes() {
            const url = `/api/ponentes`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            formatearPonentes(resultado);
        }

        // Función para obtener un ponente por su id
        async function obtenerPonente(id) {
            const url = `/api/ponente?id=${id}`;
            const respuesta = await fetch(url);
            const resultado = await respuesta.json();
            return resultado;
        }

        // Función para formatear los ponentes obtenidos
        function formatearPonentes(arrayPonentes = []) {
            ponentes = arrayPonentes.map( ponente => {
                return {
                    nombre: `${ponente.nombre.trim()} ${ponente.apellido.trim()}`,
                    id: ponente.id
                };
            });
        }

        // Función para buscar ponentes según el texto ingresado
        function buscarPonentes(e) {
            const busqueda = e.target.value;

            if(busqueda.length > 3) {
                 //expresion regulares para buscar un patron en un valor 
                 //i no importa que lo que se busque esté en may o min
                const expresion = new RegExp(busqueda, "i");
                ponentesFiltrados = ponentes.filter(ponente => {
                    if(ponente.nombre.toLowerCase().search(expresion) != -1) {
                        return ponente;
                    }
                });
            } else {
                ponentesFiltrados = [];
            }

            mostrarPonentes();
        }

        // Función para mostrar los ponentes filtrados
        function mostrarPonentes() {
            // Limpiar el listado de ponentes previo
            while(listadoPonentes.firstChild) {
                listadoPonentes.removeChild(listadoPonentes.firstChild);
            }

            if(ponentesFiltrados.length > 0) {
                // Mostrar los ponentes filtrados
                ponentesFiltrados.forEach(ponente => {
                    const ponenteHTML = document.createElement('LI');
                    ponenteHTML.classList.add('listado-ponentes__ponente');
                    ponenteHTML.textContent = ponente.nombre;
                    ponenteHTML.dataset.ponenteId = ponente.id;
                    ponenteHTML.onclick = seleccionarPonente;

                    // Añadir al DOM
                    listadoPonentes.appendChild(ponenteHTML);
                });
            } else {
                // Mostrar un mensaje si no hay resultados
                const noResultados = document.createElement('P');
                noResultados.classList.add('listado-ponentes__no-resultado');
                noResultados.textContent = 'No hay resultados para tu búsqueda';
                listadoPonentes.appendChild(noResultados);              
            }
        }

        // Función para seleccionar un ponente al hacer clic en él
        function seleccionarPonente(e) {
            const ponente = e.target; //donde presionemos

            // Remover la clase de seleccionado de cualquier ponente previamente seleccionado
            const ponentePrevio = document.querySelector('.listado-ponentes__ponente--seleccionado');
            if(ponentePrevio) {
                ponentePrevio.classList.remove('listado-ponentes__ponente--seleccionado');
            }
            ponente.classList.add('listado-ponentes__ponente--seleccionado');

            // Asignar el id del ponente seleccionado al input oculto
            ponenteHidden.value = ponente.dataset.ponenteId;
        }
    }
})();
