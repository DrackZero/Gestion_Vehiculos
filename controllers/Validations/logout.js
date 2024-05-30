import {CerrarSesion, SesionState} from '../Conection/functions.js';

  SesionState()

  const botonCerrarSesion = document.getElementById('cerrar');

  async function CerrarPerfil() {
    try {
      await CerrarSesion();
      alert('¡Has cerrado sesión exitosamente!');
      window.location.href = '../index.html'; 
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('No se pudo cerrar sesión.');
    }
  }



  window.addEventListener('DOMContentLoaded', () => {

    botonCerrarSesion.addEventListener('click', CerrarPerfil);
  
  });