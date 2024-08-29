import { listarVehiculos, ConsultarVehiculo, editarVehiculo, borrarVehiculo, cargarArchivo } from '../Conection/functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tablaBodyDocumentos = document.getElementById('tablaBodyDocumentos');
    const buscarInput = document.getElementById('buscarInput');
    const ventanaEmergenteDocumentos = document.getElementById('ventanaEmergenteDocumentos');
    const formularioEdicionDocumentos = document.getElementById('formularioEdicionDocumentos');
    const cerrarVentanaBtn = document.getElementById('cerrarV');

    const renderizarDocumentos = async () => {
        const documentos = await listarVehiculos();
        tablaBodyDocumentos.innerHTML = '';
        documentos.forEach(async (vehiculo) => {
            const vehiculoData = await ConsultarVehiculo(vehiculo.Placa);
            const {
                Placa,
                SoatURL,
                TarjetaOperacionURL,
                TarjetaPropiedadURL,
                RevisionTecURL
            } = vehiculoData;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${Placa}</td>
                <td>${vehiculo.Tipo.replace('_', ' ')}</td> 
                <td><a href="${SoatURL}" target="_blank">Ver SOAT</a></td>
                <td><a href="${TarjetaOperacionURL}" target="_blank">Ver Tarjeta de Operación</a></td>
                <td><a href="${TarjetaPropiedadURL}" target="_blank">Ver Tarjeta de Propiedad</a></td>
                <td><a href="${RevisionTecURL}" target="_blank">Ver Revisión Técnico Mecánica</a></td>
                <td>
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.Placa}"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.Placa}"></img>
                </td>
            `;
            tablaBodyDocumentos.appendChild(fila);
        });
    };

    await renderizarDocumentos();

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
                TarjetaOperacionURL,
                TarjetaPropiedadURL,
                RevisionTecURL
            } = vehiculoData;
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${Placa}</td>
                <td>${vehiculo.Tipo.replace('_', ' ')}</td> 
                <td><a href="${SoatURL}" target="_blank">Ver SOAT</a></td>
                <td><a href="${TarjetaOperacionURL}" target="_blank">Ver Tarjeta de Operación</a></td>
                <td><a href="${TarjetaPropiedadURL}" target="_blank">Ver Tarjeta de Propiedad</a></td>
                <td><a href="${RevisionTecURL}" target="_blank">Ver Revisión Técnico Mecánica</a></td>
                <td>
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.Placa}"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.Placa}"></img>
                </td>
            `;
            tablaBodyDocumentos.appendChild(fila);
        });
    });

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
                TarjetaOperacionURL: await manejarArchivoSubido(formularioEdicionDocumentos.tarjetaOperacion),
                FechaTO: formularioEdicionDocumentos.FechaT.value,
                TarjetaPropiedadURL: await manejarArchivoSubido(formularioEdicionDocumentos.tarjetaPropiedad),
                FechaTP: formularioEdicionDocumentos.FechaTP.value,
                RevisionTecURL: await manejarArchivoSubido(formularioEdicionDocumentos.revisionTecMec),
                FechaRT: formularioEdicionDocumentos.FechaRT.value,
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


