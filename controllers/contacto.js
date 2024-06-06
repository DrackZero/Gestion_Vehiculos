import { enviarCorreo } from '../adds/email.js'; 

document.addEventListener('DOMContentLoaded', () => {
  console.log('El evento DOMContentLoaded se ha activado');
  const form = document.getElementById('emailForm');
  console.log('Formulario encontrado:', form);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const to = formData.get('to'); // Este valor siempre será "revenpruebas321@gmail.com"
    const subject = formData.get('subject');
    const message = formData.get('message');
    console.log('Datos del formulario:', { to, subject, message });
    
    try {
      await enviarCorreo(to, subject, message);
      alert('Correo enviado exitosamente');
      
      form.reset();
      
      window.location.href = '../../index.html';
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      alert('Error al enviar el correo. Por favor, inténtalo de nuevo.');
    }
  });
});
