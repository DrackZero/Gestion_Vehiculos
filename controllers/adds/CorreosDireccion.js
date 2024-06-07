import { obtenerDireccionesCorreo } from '../Conection/functions.js';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('El evento DOMContentLoaded se ha activado');
    
    const direccionesCorreo = await obtenerDireccionesCorreo();
    console.log('Direcciones de correo electrónico obtenidas:', direccionesCorreo);

    const selectElement = document.getElementById('to');
    console.log('Elemento select encontrado:', selectElement);

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

import { enviarCorreo } from '../adds/email.js'; 
const form = document.getElementById('emailForm');
console.log('Formulario encontrado:', form);

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const to = formData.get('to');
  const subject = formData.get('subject');
  const message = formData.get('message');
  console.log('Datos del formulario:', { to, subject, message });
  
  try {
    await enviarCorreo(to, subject, message);
    alert('Correo enviado exitosamente');
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    alert('Error al enviar el correo. Por favor, inténtalo de nuevo.');
  }
});
