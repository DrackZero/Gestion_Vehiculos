import { obtenerDireccionesCorreo } from '../Conection/functions.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Obtiene las direcciones de correo electrónico de los vehículos registrados
    const direccionesCorreo = await obtenerDireccionesCorreo();

    // Obtiene el select del formulario
    const selectElement = document.getElementById('to');

    // Itera sobre las direcciones de correo electrónico y crea opciones para el select
    direccionesCorreo.forEach((direccion) => {
      const option = document.createElement('option');
      option.value = direccion;
      option.textContent = direccion;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error cargando direcciones de correo electrónico:', error);
  }
});

// Agrega el código para enviar correos aquí
import { enviarCorreo } from '../adds/email.js'; // Suponiendo que esta función está definida en CorreosDireccion.js
const form = document.getElementById('emailForm');
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const to = formData.get('to');
  const subject = formData.get('subject');
  const message = formData.get('message');
  try {
    await enviarCorreo(to, subject, message);
    alert('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    alert('Error al enviar el correo. Por favor, inténtalo de nuevo.');
  }
});
