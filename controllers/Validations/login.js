import { iniciar_sesion} from '../Conection/functions.js';


  const validar = document.getElementById('btnLogin');
  
  let procesoEnCurso = false; 


    async function Login() {
      if (procesoEnCurso) {
        return;
      }

      const usuario = document.getElementById('correo').value;
      const clave = document.getElementById('contraseña').value;

      procesoEnCurso = true; 

      try {
        const confirmar = await iniciar_sesion(usuario, clave);
        const user = confirmar.user;
        console.log(user);
        alert('El usuario ha iniciado sesión.');
        window.location.href = "templates/principal.html";
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode + errorMessage);
        alert('El usuario no ha podido iniciar sesión.');
      }

      procesoEnCurso = false; 
    }

    window.addEventListener('DOMContentLoaded', () => {
      validar.addEventListener('click', Login);
      
    });
