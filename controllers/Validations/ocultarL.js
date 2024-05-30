document.getElementById("mostrarRegistro").addEventListener("click", function() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("registroForm").style.display = "block";
    document.getElementById("mostrarConsulta").style.display = "none";
    document.getElementById("vehiculoInfo").style.display = "none";  
    document.getElementById("consultaForm").style.display = "none";     
});

document.getElementById("mostrarLogin").addEventListener("click", function() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("registroForm").style.display = "none";
    document.getElementById("mostrarConsulta").style.display = "block";



   
});
document.getElementById("mostrarConsulta").addEventListener("click", function() {
    document.getElementById("consultaForm").style.display = "block";
    document.getElementById("mostrarConsulta").style.display = "none";


   
});