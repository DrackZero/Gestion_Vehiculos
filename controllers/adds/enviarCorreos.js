import { enviarCorreo } from './email.js';  
import { obtenerDireccionesCorreo, listarVehiculos } from '../Conection/functions.js';

const enviarAdvertenciaCorreo = async (email, tipoDocumento, placa, fechaVencimiento, diasFaltantes) => {
    const asunto = `Advertencia: Su ${tipoDocumento} para el vehículo ${placa} vence en ${diasFaltantes} días`;

    const fechaFormateada = fechaVencimiento instanceof Date ? fechaVencimiento : new Date(fechaVencimiento);


    const mensaje = `
        Estimado usuario,

        Le informamos que su ${tipoDocumento} para el vehículo con placa ${placa} vence en ${diasFaltantes} días.
        La fecha de vencimiento es el ${fechaFormateada.toLocaleDateString()}.

        Por favor, renueve el documento antes de esa fecha para evitar sanciones.

        Atentamente,
        El equipo de gestión de vehículos.
    `;

    const uniqueKey = `${email}-${tipoDocumento}-${placa}-${fechaVencimiento}`;
    
    if (localStorage.getItem(uniqueKey)) {
        console.log(`El correo ya fue enviado a ${email} para el ${tipoDocumento}.`);
        return; 
    }

    console.log(`Enviando correo a: ${email} sobre el ${tipoDocumento} del vehículo ${placa}`);
    try {
        await enviarCorreo(email, asunto, mensaje);  
        console.log(`Correo enviado exitosamente a: ${email}`);
        localStorage.setItem(uniqueKey, 'sent'); 
    } catch (error) {
        console.error(`Error al enviar correo a ${email}:`, error);
    }
};

export const verificarVencimientosYEnviarCorreos = async () => {
    try {
        const vehiculos = await listarVehiculos();
        console.log('Vehículos obtenidos:', vehiculos);
        const fechaHoy = new Date();  // Fecha actual
  
        for (const vehiculo of vehiculos) {
            console.log('Revisando vehículo:', vehiculo);
            const { FechaSoat, FechaRevisionTec, FechaTarjetaOperacion, Email, Placa } = vehiculo;

            const fechaSoat = FechaSoat instanceof Date ? FechaSoat : (FechaSoat && FechaSoat.toDate ? FechaSoat.toDate() : new Date(FechaSoat));
            const fechaRevisionTec = FechaRevisionTec instanceof Date ? FechaRevisionTec : (FechaRevisionTec && FechaRevisionTec.toDate ? FechaRevisionTec.toDate() : new Date(FechaRevisionTec));
            const fechaTarjetaOperacion = FechaTarjetaOperacion instanceof Date ? FechaTarjetaOperacion : (FechaTarjetaOperacion && FechaTarjetaOperacion.toDate ? FechaTarjetaOperacion.toDate() : new Date(FechaTarjetaOperacion));

            if (!isNaN(fechaSoat.getTime())) {
                const diasHastaSoat = Math.ceil((fechaSoat - fechaHoy) / (1000 * 60 * 60 * 24));
                if (diasHastaSoat <= 30 && diasHastaSoat > 0) {
                    console.log(`El SOAT del vehículo ${Placa} vence en ${diasHastaSoat} días. Enviando correo...`);
                    await enviarAdvertenciaCorreo(Email, 'SOAT', Placa, fechaSoat, diasHastaSoat);
                }
            } else {
                console.error(`Fecha SOAT inválida para el vehículo con placa ${Placa}`);
            }

            if (!isNaN(fechaRevisionTec.getTime())) {
                const diasHastaRevisionTec = Math.ceil((fechaRevisionTec - fechaHoy) / (1000 * 60 * 60 * 24));
                if (diasHastaRevisionTec <= 30 && diasHastaRevisionTec > 0) {
                    console.log(`La Revisión Técnica del vehículo ${Placa} vence en 30 días. Enviando correo...`);
                    await enviarAdvertenciaCorreo(Email, 'Revisión Técnico Mecánica', Placa, fechaRevisionTec, diasHastaRevisionTec);
                }
            } else {
                console.error(`Fecha Revisión Técnica inválida para el vehículo con placa ${Placa}`);
            }

            if (!isNaN(fechaTarjetaOperacion.getTime())) {
                const diasHastaTarjetaOperacion = Math.ceil((fechaTarjetaOperacion - fechaHoy) / (1000 * 60 * 60 * 24));
                if (diasHastaTarjetaOperacion <= 30 && diasHastaTarjetaOperacion > 0) {
                    console.log(`La Tarjeta de Operación del vehículo ${Placa} vence en 30 días. Enviando correo...`);
                    await enviarAdvertenciaCorreo(Email, 'Tarjeta de Operación', Placa, fechaTarjetaOperacion, diasHastaTarjetaOperacion);
                }
            } else {
                console.error(`Fecha Tarjeta de Operación inválida para el vehículo con placa ${Placa}`);
            }
        }
    } catch (error) {
        console.error('Error verificando vencimientos y enviando correos:', error);
    }
};

export const enviarAdvertenciasPorEmail = async () => {
    try {
        const direccionesCorreo = await obtenerDireccionesCorreo();
        console.log('Direcciones de correo obtenidas:', direccionesCorreo);
  
        await verificarVencimientosYEnviarCorreos(); 
  
        console.log('Correos enviados a:', direccionesCorreo);
    } catch (error) {
        console.error('Error al enviar advertencias de correo:', error);
    }
};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('El evento DOMContentLoaded se ha activado');
        await enviarAdvertenciasPorEmail(); 
    } catch (error) {
        console.error('Error al cargar la página:', error);
    }
});
