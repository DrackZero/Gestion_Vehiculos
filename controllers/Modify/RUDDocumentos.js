import { listarVehiculos, ConsultarVehiculo, editarVehiculo, borrarVehiculo, cargarArchivo } from '../Conection/functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tablaBodyDocumentos = document.getElementById('tablaBodyDocumentos');
    const buscarInput = document.getElementById('buscarInput');
    const ventanaEmergenteDocumentos = document.getElementById('ventanaEmergenteDocumentos');
    const formularioEdicionDocumentos = document.getElementById('formularioEdicionDocumentos');
    const cerrarVentanaBtn = document.getElementById('cerrarV');

    // Función para renderizar los documentos en la tabla
    const renderizarDocumentos = async () => {
        const documentos = await listarVehiculos();
        tablaBodyDocumentos.innerHTML = '';
        documentos.forEach(async (vehiculo) => {
            // Obtener los datos del vehículo
            const vehiculoData = await ConsultarVehiculo(vehiculo.Placa);
            const {
                Placa,
                SoatURL,
                PeritajeURL,
                TarjetaOperacionURL,
                ExtractoContratoURL,
                QuintaRuedaURL,
                KingPinURL
            } = vehiculoData;
            // Crear la fila de la tabla con los enlaces a los documentos
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${Placa}</td>
                <td>${vehiculo.Tipo.replace('_', ' ')}</td> 
                <td><a href="${SoatURL}" target="_blank">Ver SOAT</a></td>
                <td><a href="${PeritajeURL}" target="_blank">Ver Peritaje</a></td>
                <td><a href="${TarjetaOperacionURL}" target="_blank">Ver Tarjeta de Operación</a></td>
                <td><a href="${ExtractoContratoURL}" target="_blank">Ver Extracto de Contrato</a></td>
                <td><a href="${QuintaRuedaURL}" target="_blank">Ver Cert. Quinta Rueda</a></td>
                <td><a href="${KingPinURL}" target="_blank">Ver Cert. King Pin</a></td>
                <td>
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.Placa}"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.Placa}"></img>
                </td>
            `;
            tablaBodyDocumentos.appendChild(fila);
        });
    };

    await renderizarDocumentos();

    // Función para filtrar documentos por placa al escribir en el buscador
    buscarInput.addEventListener('input', async () => {
        const searchTerm = buscarInput.value.toLowerCase();
        const documentos = await listarVehiculos();
        const documentosFiltrados = documentos.filter(doc => doc.Placa.toLowerCase().includes(searchTerm));
        tablaBodyDocumentos.innerHTML = '';
        documentosFiltrados.forEach(async (vehiculo) => {
            const vehiculoData = await ConsultarVehiculo(vehiculo.Placa);
            const { 
                Placa,
                SoatURL,
                PeritajeURL,
                TarjetaOperacionURL,
                ExtractoContratoURL,
                QuintaRuedaURL,
                KingPinURL
            } = vehiculoData;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${Placa}</td>
                <td>${vehiculo.Tipo.replace('_', ' ')}</td> 
                <td><a href="${SoatURL}" target="_blank">Ver SOAT</a></td>
                <td><a href="${PeritajeURL}" target="_blank">Ver Peritaje</a></td>
                <td><a href="${TarjetaOperacionURL}" target="_blank">Ver Tarjeta de Operación</a></td>
                <td><a href="${ExtractoContratoURL}" target="_blank">Ver Extracto de Contrato</a></td>
                <td><a href="${QuintaRuedaURL}" target="_blank">Ver Cert. Quinta Rueda</a></td>
                <td><a href="${KingPinURL}" target="_blank">Ver Cert. King Pin</a></td>
                <td>
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.Placa}"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.Placa}"></img>
                </td>
            `;
            tablaBodyDocumentos.appendChild(fila);
        });
    });

    // En el evento de clic en el botón de editar o borrar
    tablaBodyDocumentos.addEventListener('click', async (e) => {
        if (e.target.classList.contains('editar')) {
            const id = e.target.dataset.id;
            const vehiculo = await ConsultarVehiculo(id);
            mostrarFormularioEdicion(vehiculo);
            ventanaEmergenteDocumentos.style.display = 'block';
        } else if (e.target.classList.contains('borrar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Estás seguro de que deseas borrar este documento?')) {
                await borrarVehiculo(id);
                await renderizarDocumentos();
            }
        }
    });

    const mostrarFormularioEdicion = (vehiculo) => {
        formularioEdicionDocumentos.onsubmit = async (e) => {
            e.preventDefault();
            const nuevosDatos = {
                SoatURL: await manejarArchivoSubido(formularioEdicionDocumentos.soat),
                FechaS: formularioEdicionDocumentos.FechaS.value,
                PeritajeURL: await manejarArchivoSubido(formularioEdicionDocumentos.peritaje),
                FechaP: formularioEdicionDocumentos.FechaP.value,
                TarjetaOperacionURL: await manejarArchivoSubido(formularioEdicionDocumentos.tarjetaOperacion),
                FechaTO: formularioEdicionDocumentos.FechaTO.value,
                ExtractoContratoURL: await manejarArchivoSubido(formularioEdicionDocumentos.extractoContrato),
                FechaEC: formularioEdicionDocumentos.FechaEC.value,
                QuintaRuedaURL: await manejarArchivoSubido(formularioEdicionDocumentos.certQuintaRueda),
                FechaQR: formularioEdicionDocumentos.FechaQR.value,
                KingPinURL: await manejarArchivoSubido(formularioEdicionDocumentos.certKingPin),
                FechaKP: formularioEdicionDocumentos.FechaKP.value,
            };
            await editarVehiculo(vehiculo.Placa, nuevosDatos);
            ventanaEmergenteDocumentos.style.display = 'none';
            await renderizarDocumentos();
        };
    };
    


    const manejarArchivoSubido = async (inputElement) => {
        if (inputElement.files.length > 0) {
            const file = inputElement.files[0];
            const urlArchivo = await cargarArchivo(file);
            return urlArchivo;
        }
        return '';
    };

    cerrarVentanaBtn.addEventListener('click', () => {
        ventanaEmergenteDocumentos.style.display = 'none';
    });
});
