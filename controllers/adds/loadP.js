export function showLoaderOnFormSubmit() {
    const btnGuardar = document.getElementById('btnsave');
    const loaderContainer = document.getElementById('loader-container');

    btnGuardar.addEventListener('click', function(event) {
        // Mostrar la pantalla de carga
        loaderContainer.style.display = 'block';
    });
}
