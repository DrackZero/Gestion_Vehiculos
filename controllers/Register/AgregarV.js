import { cargarArchivo, AgregarVehiculo } from '../Conection/functions.js';


async function guardarVehiculo(event) {
    event.preventDefault();

    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'flex';

    const tipo = document.getElementById('tipo').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const año = parseInt(document.getElementById('año').value); 
    const placa = document.getElementById('placa').value;
    const capacidad = parseInt(document.getElementById('capacidad').value);
    const estado = document.getElementById('estado').value;
    const soatFile = document.getElementById('Soat').files[0];
    const fechaSoat = new Date(document.getElementById('fechaS').value + 'T00:00:00-05:00');
    const email = document.getElementById('email').value;

    const revisionTecFile = document.getElementById('revisionTec').files[0];
    const tarjetaPropiedadFile = document.getElementById('tarjetaPropiedad').files[0];
    const tarjetaOperacionFile = document.getElementById('tarjetaOperacion').files[0];
    const fechaRevisionTec = new Date(document.getElementById('fechaRT').value + 'T00:00:00-05:00');
    const fechaTarjetaOperacion = new Date(document.getElementById('fechaT').value + 'T00:00:00-05:00');
    const fechaTarjetaPropiedad = new Date(document.getElementById('fechaTP').value + 'T00:00:00-05:00');


    if (!fechaRevisionTec || !fechaTarjetaOperacion) {
        alert('Por favor complete todos los campos obligatorios.');
        return;
    }

    try {
        let soatURL = '', revisionTecURL = '', tarjetaPropiedadURL = '', tarjetaOperacionURL = '';

        if (soatFile) {
            soatURL = await cargarArchivo(soatFile, placa, 'soat');
        }
        if (revisionTecFile) {
            revisionTecURL = await cargarArchivo(revisionTecFile, placa, 'revisionTec');
        }
        if (tarjetaPropiedadFile) {
            tarjetaPropiedadURL = await cargarArchivo(tarjetaPropiedadFile, placa, 'tarjetaPropiedad');
        }
        if (tarjetaOperacionFile) {
            tarjetaOperacionURL = await cargarArchivo(tarjetaOperacionFile, placa, 'tarjetaOperacion');
        }

        const verificar = await AgregarVehiculo(
            tipo, marca, modelo, año, placa, capacidad, estado, soatURL, fechaSoat, email,
            revisionTecURL, fechaRevisionTec, tarjetaPropiedadURL, fechaTarjetaPropiedad, tarjetaOperacionURL, fechaTarjetaOperacion
        );
        alert('Registro exitoso.');
        console.log("Document written with ID: ", verificar.id);
    } catch (e) {
        console.error("Error adding document: ", e);
        alert('Registro fallido.');
    } finally {
        loaderContainer.style.display = 'none';
    }
}



window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('vehicleForm');
    form.addEventListener('submit', guardarVehiculo);

});
