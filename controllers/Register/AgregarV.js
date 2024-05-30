import { cargarArchivo, AgregarVehiculo } from '../Conection/functions.js';

const guardar = document.getElementById('btnsave');

async function guardarVehiculo(event) {
    event.preventDefault();

    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const año = parseInt(document.getElementById('año').value); // Convertir a número
    const placa = document.getElementById('placa').value;
    const capacidad = parseInt(document.getElementById('capacidad').value); // Convertir a número
    const estado = document.getElementById('estado').value;
    const soatFile = document.getElementById('Soat').files[0];
    const fechaInput = document.getElementById('fechaS');
    const fechaSeleccionada = new Date(fechaInput.value);
    const email = document.getElementById('email').value;


    try {
        let soatURL = '';
        if (soatFile) {
            soatURL = await cargarArchivo(soatFile, placa);
        }

        const verificar = await AgregarVehiculo(marca, modelo, año, placa, capacidad, estado, soatURL, fechaSeleccionada,email );
        alert('Registro exitoso.');
        console.log("Document written with ID: ", verificar.id);
    } catch (e) {
        console.error("Error adding document: ", e);
        alert('Registro fallido.');
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('vehicleForm');
    form.addEventListener('submit', guardarVehiculo);
});
