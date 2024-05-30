// RUD.js

import { cargarArchivo, listarVehiculos, editarVehiculo, borrarVehiculo, ConsultarVehiculo } from '../Conection/functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tablaBody = document.getElementById('tablaBody');
    const buscarInput = document.getElementById('buscarInput');

    // Función para renderizar los vehículos en la tabla
    const renderizarVehiculos = async () => {
        const vehiculos = await listarVehiculos();
        tablaBody.innerHTML = '';
        vehiculos.forEach((vehiculo) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vehiculo.Placa}</td>
                <td>${vehiculo.Marca}</td>
                <td>${vehiculo.Modelo}</td>
                <td>${vehiculo.Año}</td>
                <td>${vehiculo.Capacidad_Carga}</td>
                <td>${vehiculo.Estado}</td>
                <td><a href="${vehiculo.SoatURL}" target="_blank">Ver SOAT</a></td>
                <td>
                    <button class="editar" data-id="${vehiculo.id}">Editar</button>
                    <button class="borrar" data-id="${vehiculo.id}">Borrar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    };

    // Llamar a la función para renderizar los vehículos al cargar la página
    await renderizarVehiculos();

    // Función para filtrar vehículos por placa al escribir en el buscador
    buscarInput.addEventListener('input', async () => {
        const searchTerm = buscarInput.value.toLowerCase();
        const vehiculos = await listarVehiculos();
        const vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo.Placa.toLowerCase().includes(searchTerm));
        tablaBody.innerHTML = '';
        vehiculosFiltrados.forEach((vehiculo) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vehiculo.Placa}</td>
                <td>${vehiculo.Marca}</td>
                <td>${vehiculo.Modelo}</td>
                <td>${vehiculo.Año}</td>
                <td>${vehiculo.Capacidad_Carga}</td>
                <td>${vehiculo.Estado}</td>
                <td><a href="${vehiculo.SoatURL}" target="_blank">Ver SOAT</a></td>
                <td>
                    <button class="editar" data-id="${vehiculo.id}">Editar</button>
                    <button class="borrar" data-id="${vehiculo.id}">Borrar</button>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    });

    // En el evento de clic en el botón de editar o borrar
    tablaBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('editar')) {
            const id = e.target.dataset.id; // Obtenemos el ID del vehículo desde el atributo data-id
            console.log(`Editar vehículo con ID: ${id}`);
            // Obtener los datos del vehículo a partir del ID
            const vehiculo = await ConsultarVehiculo(id);
            // Mostrar el formulario de edición con los datos del vehículo
            mostrarFormularioEdicion(vehiculo);
        } else if (e.target.classList.contains('borrar')) {
            const id = e.target.dataset.id; // Obtenemos el ID del vehículo desde el atributo data-id
            if (confirm('¿Estás seguro de que deseas borrar este vehículo?')) {
                await borrarVehiculo(id);
                await renderizarVehiculos();
            }
        }
    });

    // Función para mostrar el formulario de edición con los datos del vehículo
    function mostrarFormularioEdicion(vehiculo) {
        // Mostrar el formulario de edición y completarlo con los datos del vehículo
        const formulario = document.getElementById('formularioEdicion');
        formulario.style.display = 'block';
        formulario['marca'].value = vehiculo.Marca;
        formulario['modelo'].value = vehiculo.Modelo;
        formulario['anio'].value = vehiculo.Año;
        formulario['capacidad'].value = vehiculo.Capacidad_Carga;
        formulario['estado'].value = vehiculo.Estado;

        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nuevosDatos = {
                Marca: formulario['marca'].value,
                Modelo: formulario['modelo'].value,
                Año: formulario['anio'].value,
                Capacidad_Carga: formulario['capacidad'].value,
                Estado: formulario['estado'].value
            };

            const fileInput = formulario['Soat'];
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                const downloadURL = await cargarArchivo(file, vehiculo.Placa);
                console.log('URL de descarga del archivo ha sido actualizado'); // Agregar console.log aquí
                nuevosDatos.SoatURL = downloadURL;
            }

            await editarVehiculo(vehiculo.Placa, nuevosDatos);
            formulario.style.display = 'none';
            await renderizarVehiculos();
        });
    }
});
