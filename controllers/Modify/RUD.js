import { cargarArchivo, listarVehiculos, editarVehiculo, borrarVehiculo, ConsultarVehiculo } from '../Conection/functions.js';


document.addEventListener('DOMContentLoaded', async () => {
    const tablaBody = document.getElementById('tablaBody');
    const buscarInput = document.getElementById('buscarInput');

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
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.id}"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.id}"></img>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    } catch (error) {
        console.error("Error al renderizar los vehículos:", error);
    }
};

 
    await renderizarVehiculos();

    buscarInput.addEventListener('input', async () => {
        const searchTerm = buscarInput.value.toLowerCase();
        const vehiculos = await listarVehiculos();
        const vehiculosFiltrados = vehiculos.filter(vehiculo => vehiculo.Placa.toLowerCase().includes(searchTerm));
        tablaBody.innerHTML = '';
        vehiculosFiltrados.forEach((vehiculo) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${vehiculo.Placa}</td>
                <td>${vehiculo.Tipo.replace('_', ' ')}</td> 
                <td>${vehiculo.Marca}</td>
                <td>${vehiculo.Modelo}</td>
                <td>${vehiculo.Año}</td>
                <td>${vehiculo.Capacidad_Carga}</td>
                <td>${vehiculo.Estado}</td>
                <td><a href="${vehiculo.SoatURL}" target="_blank">Ver SOAT</a></td>
                <td>
                    <img src="../resources/img/editar.png" class="editar" data-id="${vehiculo.id}"></img>
                    <img src="../resources/img/borrar.png" class="borrar" data-id="${vehiculo.id}"></img>
                </td>
            `;
            tablaBody.appendChild(fila);
        });
    });

    tablaBody.addEventListener('click', async (e) => {
        if (e.target.classList.contains('editar')) {
            const id = e.target.dataset.id; 
            console.log(`Editar vehículo con ID: ${id}`);

            const vehiculo = await ConsultarVehiculo(id);
         
            mostrarFormularioEdicion(vehiculo);
            document.getElementById('ventanaEmergente').style.display = 'block'; 
        } else if (e.target.classList.contains('borrar')) {
            const id = e.target.dataset.id; 
            if (confirm('¿Estás seguro de que deseas borrar este vehículo?')) {
                await borrarVehiculo(id);
                await renderizarVehiculos();
            }
        }
    });

    function mostrarFormularioEdicion(vehiculo) {
        const formulario = document.getElementById('formularioEdicion');
        const ventanaE = document.getElementById('ventanaEmergente');

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
                console.log('URL de descarga del archivo ha sido actualizado'); 
                nuevosDatos.SoatURL = downloadURL;
            }

            await editarVehiculo(vehiculo.Placa, nuevosDatos);
            formulario.style.display = 'none';
            ventanaE.style.display = 'none';
            await renderizarVehiculos();
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const abrirVentanaBtns = document.querySelectorAll('.editar');
    const ventanaEmergente = document.getElementById('ventanaEmergente');

    abrirVentanaBtns.forEach(abrirVentanaBtn => {
        abrirVentanaBtn.addEventListener('click', () => {
            ventanaEmergente.style.display = 'block';
        }); 
    });

    const cerrarVentanaBtn = document.getElementById('cerrarV');
    cerrarVentanaBtn.addEventListener('click', () => {
        ventanaEmergente.style.display = 'none';
    });
});
