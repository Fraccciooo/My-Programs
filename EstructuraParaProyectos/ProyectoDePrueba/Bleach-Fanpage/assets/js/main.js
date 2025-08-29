// Cargar partials
function loadPartials() {
    // Cargar header
    fetch('./partials/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-placeholder').innerHTML = data;
            // Activar el JS del navbar después de cargar
            const script = document.createElement('script');
            script.src = './assets/js/components/navbar.js';
            document.body.appendChild(script);
        });

    // Cargar footer
    fetch('./partials/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-placeholder').innerHTML = data;
        });
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadPartials();
    
    // Otras inicializaciones
    console.log('Sitio Bleach cargado!');
});