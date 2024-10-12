import { cargarArchivo, listarVehiculos, editarVehiculo, borrarVehiculo, ConsultarVehiculo } from '../Conection/functions.js';

document.addEventListener('DOMContentLoaded', async () => {
    const tablaBody = document.getElementById('tablaBody');
    const buscarInput = document.getElementById('buscarInput');
    const formulario = document.getElementById('formularioEdicion');
    const ventanaEmergente = document.getElementById('ventanaEmergente');
    const cerrarVentanaBtn = document.getElementById('cerrarV');

    // Función para renderizar los vehículos
    const renderizarVehiculos = async () => {
        try {
            const vehiculos = await listarVehiculos();
            tablaBody.innerHTML = '';
            vehiculos.forEach((vehiculo) => {
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td>${vehiculo.Placa}</td>
                    <td>${vehiculo.Tipo.replace('_', ' ')}</td> 
                    <td>${vehiculo.Marca}</td>
                    <td>${vehiculo.Modelo}</td>
                    <td>${vehiculo.Año}</td>
                    <td>${vehiculo.Capacidad_Carga}KG</td>
                    <td>${vehiculo.Estado}</td>
                    <td><a href="${vehiculo.SoatURL}" target="_blank">Ver SOAT</a></td>
                    <td>
                        <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.id}" alt="Editar"></img>
                        <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.id}" alt="Borrar"></img>
                    </td>
                `;
                tablaBody.appendChild(fila);
            });
        } catch (error) {
            console.error("Error al renderizar los vehículos:", error);
        }
    };

    // Renderizar vehículos al cargar la página
    await renderizarVehiculos();

    // Búsqueda de vehículos
    buscarInput.addEventListener('input', async () => {
        const searchTerm = buscarInput.value.toLowerCase();
        const vehiculos = await listarVehiculos();
        const vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo.Placa.toLowerCase().includes(searchTerm));
        tablaBody.innerHTML = '';
        vehiculosFiltrados.forEach((vehiculo) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vehiculo.Placa}</td>
                <td>${vehiculo.Tipo}</td> 
                <td>${vehiculo.Marca}</td>
                <td>${vehiculo.Modelo}</td>
                <td>${vehiculo.Año}</td>
                <td>${vehiculo.Capacidad_Carga}</td>
                <td>${vehiculo.Estado}</td>
                <td><a href="${vehiculo.SoatURL}" target="_blank">Ver SOAT</a></td>
                <td>
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.id}" alt="Editar"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.id}" alt="Borrar"></img>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    });

    // Escuchar eventos de editar o borrar en la tabla
    tablaBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('editar')) {
            const id = e.target.dataset.id;
            const vehiculo = await ConsultarVehiculo(id);
            mostrarFormularioEdicion(vehiculo); // Mostrar el formulario con los datos del vehículo
        } else if (e.target.classList.contains('borrar')) {
            const id = e.target.dataset.id;
            if (confirm('¿Estás seguro de que deseas borrar este vehículo?')) {
                await borrarVehiculo(id);
                await renderizarVehiculos(); // Volver a cargar la lista después de eliminar
            }
        }
    });

    // Mostrar formulario de edición con los datos del vehículo
    function mostrarFormularioEdicion(vehiculo) {
        formulario.style.display = 'block';
        formulario['marca'].value = vehiculo.Marca;
        formulario['modelo'].value = vehiculo.Modelo;
        formulario['anio'].value = vehiculo.Año;
        formulario['capacidad'].value = vehiculo.Capacidad_Carga;
        formulario['estado'].value = vehiculo.Estado;
        if (vehiculo.FechaS) {
            formulario['FechaS'].value = vehiculo.FechaS;
        } else {
            formulario['FechaS'].value = '';  // O podrías dejarlo vacío
        }
        
        formulario.dataset.placa = vehiculo.Placa; // Guardar la placa en el dataset del formulario
        ventanaEmergente.style.display = 'block'; // Mostrar la ventana emergente
    }

    // Manejo del evento de cierre del formulario
    cerrarVentanaBtn.addEventListener('click', () => {
        ventanaEmergente.style.display = 'none'; // Cerrar la ventana emergente
    });

    // Manejo del evento submit para editar el vehículo
    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        const placa = formulario.dataset.placa;
        const nuevosDatos = {
            Marca: formulario['marca'].value,
            Modelo: formulario['modelo'].value,
            Año: formulario['anio'].value,
            Capacidad_Carga: formulario['capacidad'].value,
            Estado: formulario['estado'].value,
            FechaSoat: new Date(formulario['FechaS'].value)  // Convertir a ISO string

        };

        // Verificar si se ha subido un archivo de SOAT
        const fileInput = formulario['Soat'];
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const downloadURL = await cargarArchivo(file, placa);
            nuevosDatos.SoatURL = downloadURL;
        }

        await editarVehiculo(placa, nuevosDatos); // Actualizar los datos del vehículo
        ventanaEmergente.style.display = 'none'; // Cerrar la ventana emergente
        await renderizarVehiculos(); // Recargar los vehículos en la tabla
    });
});

