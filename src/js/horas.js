(function(){
    // Seleccionar el elemento con el id "horas"
    const horas = document.querySelector('#horas')

    // Verificar si el elemento existe
    if(horas) {
        // Seleccionar elementos necesarios
        const categoria = document.querySelector('[name="categoria_id"]')
        const dias = document.querySelectorAll('[name="dia"]');
        const inputHiddenDia = document.querySelector('[name="dia_id"]');
        const inputHiddenHora = document.querySelector('[name="hora_id"]');

        // Agregar oyentes de eventos para cambios en la categoría y en los días
        categoria.addEventListener('change', terminoBusqueda)
        dias.forEach( dia => dia.addEventListener('change', terminoBusqueda))

        // Crear objeto para almacenar los criterios de búsqueda
        let busqueda = {
            categoria_id: +categoria.value || '',
            dia: +inputHiddenDia.value || ''
        }

        // Realizar búsqueda si los criterios no están vacíos
        if(!Object.values(busqueda).includes('')) {
            (async () => {
                await buscarEventos();

                // Obtener el id de la hora
                const id = inputHiddenHora.value;

                // Resaltar la hora actual
                const horaSeleccionada = document.querySelector(`[data-hora-id="${id}"]`)
                horaSeleccionada.classList.remove('horas__hora--deshabilitada')
                horaSeleccionada.classList.add('horas__hora--seleccionada')

                // Asignar función de selección de hora al hacer clic en ella
                horaSeleccionada.onclick = seleccionarHora;
            })()
        }

        // Función para manejar cambios en la búsqueda
        function terminoBusqueda(e) {
            busqueda[e.target.name] = e.target.value;

            // Reiniciar campos ocultos y selector de horas
            inputHiddenHora.value = '';
            inputHiddenDia.value = '';
            
            const horaPrevia = document.querySelector('.horas__hora--seleccionada')
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada')
            }

            // Realizar búsqueda si los criterios no están vacíos
            if(Object.values(busqueda).includes('')) {
                return
            }

            buscarEventos();
        }

        // Función para buscar eventos
        async function buscarEventos() {
            const { dia, categoria_id } = busqueda
            const url = `/api/eventos-horario?dia_id=${dia}&categoria_id=${categoria_id}`;

            const resultado = await fetch(url);
            const eventos = await resultado.json();
            obtenerHorasDisponibles(eventos);
        }

        // Función para obtener las horas disponibles
        function obtenerHorasDisponibles(eventos) {
            // Reiniciar las horas
            const listadoHoras = document.querySelectorAll('#horas li');
            listadoHoras.forEach(li => li.classList.add('horas__hora--deshabilitada'))

            // Comprobar eventos ya tomados y habilitar horas disponibles
            const horasTomadas = eventos.map( evento => evento.hora_id);            
            const listadoHorasArray = Array.from(listadoHoras);

            const resultado = listadoHorasArray.filter( li =>  !horasTomadas.includes(li.dataset.horaId) );
            resultado.forEach( li => li.classList.remove('horas__hora--deshabilitada'))

            const horasDisponibles = document.querySelectorAll('#horas li:not(.horas__hora--deshabilitada)');
            horasDisponibles.forEach( hora => hora.addEventListener('click', seleccionarHora));
        }

        // Función para seleccionar una hora
        function seleccionarHora(e) {
            // Deshabilitar la hora previa, si hay un nuevo clic
            const horaPrevia = document.querySelector('.horas__hora--seleccionada')
            if(horaPrevia) {
                horaPrevia.classList.remove('horas__hora--seleccionada')
            }

            // Agregar clase de seleccionado a la hora clicada
            e.target.classList.add('horas__hora--seleccionada')

            // Asignar el valor de la hora seleccionada al campo oculto de hora
            inputHiddenHora.value = e.target.dataset.horaId

            // Asignar el valor del día seleccionado al campo oculto de día
            inputHiddenDia.value = document.querySelector('[name="dia"]:checked').value
        }
    }
    
})();
