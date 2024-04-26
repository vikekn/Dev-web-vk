// scroll.js


document.addEventListener('DOMContentLoaded', function() {
    const urlActual = window.location.href;
    const url = `${location.origin}/login`;

    if (urlActual === url) {
        // Obtener el enlace de Iniciar Sesión
        var enlaceInicioSesion = document.querySelector('.header__enlace[href="/login"]');

        // Definir una función para el clic
        var clicEnlaceInicioSesion = function(event) {
            // Prevenir el comportamiento predeterminado del enlace
            event.preventDefault();
            
            // Obtener el elemento al que deseamos desplazarnos
            var inicioSesionElement = document.getElementById('inicioSesion');
            
            // Hacer scroll suavemente hasta el elemento
            inicioSesionElement.scrollIntoView({ behavior: 'smooth' });
            
            // Eliminar el listener después del primer clic
            enlaceInicioSesion.removeEventListener('click', clicEnlaceInicioSesion);
        };
        
        // Agregar un evento de clic al enlace
        enlaceInicioSesion.addEventListener('click', clicEnlaceInicioSesion);
        
        // Simular un clic automáticamente
        enlaceInicioSesion.click();
    }
});


