import { ConsultarVehiculo } from '../Conection/functions.js';

const infoVehiculoTable = document.getElementById('infoVehiculo');
const vehiculoAtributos = document.getElementById('vehiculoAtributos');
const vehiculoValores = document.getElementById('vehiculoValores');

function mostrarInfoVehiculo(vehiculo) {
    const ordenAtributos = ['Placa', 'Marca', 'Modelo', 'Año', 'Estado', 'Capacidad_Carga', 'SoatURL'];

    vehiculoAtributos.innerHTML = '';
    vehiculoValores.innerHTML = '';

    for (const atributo of ordenAtributos) {
        const th = document.createElement('th');
        th.textContent = atributo === 'SoatURL' ? 'SOAT' : atributo;
        vehiculoAtributos.appendChild(th);

        const td = document.createElement('td');
        if (atributo === 'SoatURL') {
            const link = document.createElement('a');
            link.href = vehiculo[atributo];
            link.target = '_blank';
            link.textContent = 'Ver SOAT';
            td.appendChild(link);
        } else {
            td.textContent = vehiculo[atributo];
        }
        vehiculoValores.appendChild(td);
    }

    const cerrarTablaButton = document.createElement('button');
    cerrarTablaButton.textContent = 'Cerrar';
    cerrarTablaButton.id = 'cerrarTablaButton';
    cerrarTablaButton.addEventListener('click', () => {
        document.getElementById('vehiculoInfo').style.display = 'none';

    });

    cerrarTablaButton.style.backgroundColor = '#f44336'; 
    cerrarTablaButton.style.color = 'white'; 
    cerrarTablaButton.style.padding = '10px 20px';
    cerrarTablaButton.style.border = 'none'; 
    cerrarTablaButton.style.borderRadius = '5px'; 
    cerrarTablaButton.style.cursor = 'pointer'; 
    cerrarTablaButton.style.transition = 'background-color 0.3s'; 

    cerrarTablaButton.addEventListener('mouseover', () => {
        cerrarTablaButton.style.backgroundColor = '#d32f2f'; 
    });

    const cerrarTablaTd = document.createElement('td');
    cerrarTablaTd.colSpan = ordenAtributos.length;
    cerrarTablaTd.style.textAlign = 'center';
    cerrarTablaTd.appendChild(cerrarTablaButton);

    const cerrarTablaTr = document.createElement('tr');
    cerrarTablaTr.appendChild(cerrarTablaTd);

    infoVehiculoTable.querySelector('tbody').appendChild(cerrarTablaTr);
}

document.getElementById('btnConsultar').addEventListener('click', async (event) => {
    event.preventDefault();
    const placa = document.getElementById('placaConsulta').value;
    const vehiculoInfo = await ConsultarVehiculo(placa);

    if (vehiculoInfo) {
        document.getElementById('vehiculoInfo').style.display = 'block';
        mostrarInfoVehiculo(vehiculoInfo);
    } else {
        alert('No se encontró el vehículo.');
    }
});
