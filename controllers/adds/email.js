emailjs.init('cbR3L-HxfB6AOoXrg');

export async function enviarCorreo(to, subject, message) {
  try {
    const response = await emailjs.send('service_amsct1t', 'template_1tbre4m', {
        to_email: to,
        subject: subject,
        message: message 
         });

    console.log('Correo electrónico enviado:', response);
    alert('Correo electrónico enviado con éxito.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    alert('Error al enviar el correo electrónico. Por favor, inténtalo de nuevo más tarde.');
  }
}