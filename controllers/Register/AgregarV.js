import { cargarArchivo, AgregarVehiculo } from '../Conection/functions.js';

const guardar = document.getElementById('btnsave');

async function guardarVehiculo(event) {
    event.preventDefault();

    const loaderContainer = document.getElementById('loader-container');
    loaderContainer.style.display = 'flex';

    const tipo = document.getElementById('tipo').value;
    const marca = document.getElementById('marca').value;
    const modelo = document.getElementById('modelo').value;
    const año = parseInt(document.getElementById('año').value); // Convertir a número
    const placa = document.getElementById('placa').value;
    const capacidad = parseInt(document.getElementById('capacidad').value); // Convertir a número
    const estado = document.getElementById('estado').value;
    const soatFile = document.getElementById('Soat').files[0];
    const fechaSoat = new Date(document.getElementById('fechaS').value);
    const email = document.getElementById('email').value;

    // Extra fields
    let peritajeFile = null, tarjetaOperacionFile = null, extractoContratoFile = null;
    let quintaRuedaFile = null, kingPinFile = null;
    let fechaPeritaje = null, fechaTarjetaOperacion = null, fechaExtractoContrato = null;
    let fechaQuintaRueda = null, fechaKingPin = null;
    
    if (tipo === "vehiculo_ligero") {
        peritajeFile = document.getElementById('peritaje').files[0];
        tarjetaOperacionFile = document.getElementById('tarjetaOperacion').files[0];
        extractoContratoFile = document.getElementById('extractoContrato').files[0];
        fechaPeritaje = new Date(document.getElementById('fechaP').value);
        fechaTarjetaOperacion = new Date(document.getElementById('fechaT').value);
        fechaExtractoContrato = new Date(document.getElementById('fechaE').value);
    } else if (tipo === "vehiculo_articulado") {
        quintaRuedaFile = document.getElementById('quintaRueda').files[0];
        kingPinFile = document.getElementById('kingPin').files[0];
        fechaQuintaRueda = new Date(document.getElementById('fechaQR').value);
        fechaKingPin = new Date(document.getElementById('fechaKP').value);
    }

    // Validar campos obligatorios adicionales
    if (tipo === "vehiculo_ligero") {
        if (!fechaPeritaje || !fechaTarjetaOperacion || !fechaExtractoContrato) {
            alert('Por favor complete todos los campos obligatorios para vehículo ligero.');
            return;
        }
    } else if (tipo === "vehiculo_articulado") {
        if (!fechaQuintaRueda || !fechaKingPin) {
            alert('Por favor complete todos los campos obligatorios para vehículo articulado.');
            return;
        }
    }

    try {
        let soatURL = '', peritajeURL = '', tarjetaOperacionURL = '', extractoContratoURL = '';
        let quintaRuedaURL = '', kingPinURL = '';

        if (soatFile) {
            soatURL = await cargarArchivo(soatFile, placa, 'soat');
        }
        if (peritajeFile) {
            peritajeURL = await cargarArchivo(peritajeFile, placa, 'peritaje');
        }
        if (tarjetaOperacionFile) {
            tarjetaOperacionURL = await cargarArchivo(tarjetaOperacionFile, placa, 'tarjetaOperacion');
        }
        if (extractoContratoFile) {
            extractoContratoURL = await cargarArchivo(extractoContratoFile, placa, 'extractoContrato');
        }
        if (quintaRuedaFile) {
            quintaRuedaURL = await cargarArchivo(quintaRuedaFile, placa, 'quintaRueda');
        }
        if (kingPinFile) {
            kingPinURL = await cargarArchivo(kingPinFile, placa, 'kingPin');
        }

        const verificar = await AgregarVehiculo(
            tipo, marca, modelo, año, placa, capacidad, estado, soatURL, fechaSoat, email,
            peritajeURL, fechaPeritaje, tarjetaOperacionURL, fechaTarjetaOperacion, extractoContratoURL, fechaExtractoContrato,
            quintaRuedaURL, fechaQuintaRueda, kingPinURL, fechaKingPin
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


function mostrarCamposAdicionales() {
    const tipo = document.getElementById('tipo').value;
    const ligeroFields = document.getElementById('ligeroFields');
    const articuladoFields = document.getElementById('articuladoFields');
    
    // Mostrar u ocultar campos según el tipo de vehículo
    document.getElementById('commonFields').style.display = tipo ? 'block' : 'none';
    ligeroFields.style.display = tipo === 'vehiculo_ligero' ? 'block' : 'none';
    articuladoFields.style.display = tipo === 'vehiculo_articulado' ? 'block' : 'none';
    
    // Hacer obligatorios o no los campos adicionales
    const requiredLigero = tipo === 'vehiculo_ligero';
    const requiredArticulado = tipo === 'vehiculo_articulado';
    
    // Campos de vehículo ligero
    document.getElementById('fechaP').required = requiredLigero;
    document.getElementById('fechaT').required = requiredLigero;
    document.getElementById('fechaE').required = requiredLigero;
    
    // Campos de vehículo articulado
    document.getElementById('fechaQR').required = requiredArticulado;
    document.getElementById('fechaKP').required = requiredArticulado;
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('vehicleForm');
    form.addEventListener('submit', guardarVehiculo);

    const tipoSelect = document.getElementById('tipo');
    tipoSelect.addEventListener('change', mostrarCamposAdicionales);
    
    mostrarCamposAdicionales();
});
