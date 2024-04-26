(function() {

    const tagsInput = document.querySelector('#tags_input')

    if(tagsInput) {

        const tagsDiv = document.querySelector('#tags');
        const tagsInputHidden = document.querySelector('[name="tags"]');

        let tags = [];

        // Recuperar del input oculto
        if(tagsInputHidden.value !== '') {
            tags = tagsInputHidden.value.split(',');
            mostrarTags();
        }
 
        // Escuchar los cambios en el input
        tagsInput.addEventListener('keypress', guardarTag)

        function guardarTag(e) {
            if(e.keyCode === 44) {
                if(e.target.value.trim() === '' || e.target.value < 1) { 
                    //trim elimina espacios en blanco
                    return
                }
                //evita que usuario esciba en ese campo(elimina la coma)
                e.preventDefault();
                tags = [...tags, e.target.value.trim()];
                tagsInput.value = '';
                mostrarTags();
            }
        }

        function mostrarTags() {
            tagsDiv.textContent = '';
            tags.forEach(tag => {
                const etiqueta = document.createElement('LI');
                etiqueta.classList.add('formulario__tag')
                etiqueta.textContent = tag;
                etiqueta.ondblclick = eliminarTag
                tagsDiv.appendChild(etiqueta)
            })
            actualizarInputHidden();
        }   

        function eliminarTag(e) {
            //lo elimina de pantalla (del DOM)
            e.target.remove()
            //lo elimina del arreglo
            tags = tags.filter(tag => tag !== e.target.textContent)
            actualizarInputHidden();
        }
        
        function actualizarInputHidden() {
            tagsInputHidden.value = tags.toString();
        }
    }

})();