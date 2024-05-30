import { registrarUsuario } from '../Conection/functions.js';

const registrar = document.getElementById('btnRegistro');

let procesoEnCurso = false;

async function Register() {
  if (procesoEnCurso) {
    return;
  }

  procesoEnCurso = true;

  const password = document.getElementById('contraseñaR').value;
  const passwordConfirm = document.getElementById('VcontrasenaR').value;

  const correo = document.getElementById('correoR').value;

  if (password.length < 8) {
    alert('La contraseña debe tener al menos 8 caracteres.');
    procesoEnCurso = false;
    return;
  }

  if (password !== passwordConfirm) {
    alert('Las contraseñas no coinciden. Por favor, inténtelo de nuevo.');
    procesoEnCurso = false;
    return;
  }

  try {
    // Registra el usuario y la información adicional
    await registrarUsuario(password, correo);
    alert('El usuario se registró exitosamente, ya te puedes logear dandole a boton de ingresar.');
    // Limpia los campos después de un registro exitoso
    document.getElementById('correo').value = '';
    document.getElementById('contraseñaR').value = '';
    document.getElementById('VcontrasenaR').value = '';

  } catch (error) {
    // Limpia los campos en caso de error
    alert('Habido algún error intentelo de nuevo');

    document.getElementById('contraseñaR').value = '';
    document.getElementById('VcontrasenaR').value = '';

  }

  procesoEnCurso = false;
}

window.addEventListener('DOMContentLoaded', () => {
  registrar.addEventListener('click', Register);
});
