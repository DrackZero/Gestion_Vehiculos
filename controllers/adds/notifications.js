import { db } from '../Conection/firebase.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

export async function updateNotifications() {
    console.log('updateNotifications function called');
    const now = new Date();
    const warningDays = 30; 
    const notificationContainer = document.getElementById('notificationContainer');
    const notificationCount = document.getElementById('notificationCount');

    if (!notificationContainer || !notificationCount) {
        console.error('notificationContainer or notificationCount element not found');
        return;
    }

    let count = 0;
    let notifications = [];

    try {
        const querySnapshot = await getDocs(collection(db, "Vehiculos"));
        console.log('Fetched vehicles data', querySnapshot);

        querySnapshot.forEach((doc) => {
            const vehicle = doc.data();
            console.log('Vehicle data:', vehicle);

            const documents = [
                { name: 'SOAT', expiryDate: vehicle.FechaSoat },
                { name: 'Peritaje', expiryDate: vehicle.FechaPeritaje },
                { name: 'Tarjeta de Operación', expiryDate: vehicle.FechaTarjetaOperacion },
                { name: 'Extracto de Contrato', expiryDate: vehicle.FechaExtractoContrato },
                { name: 'Quinta Rueda', expiryDate: vehicle.FechaQuintaRueda },
                { name: 'King Pin', expiryDate: vehicle.FechaKingPin }
            ];

            documents.forEach(doc => {
                if (doc.expiryDate) {
                    const expiryDate = doc.expiryDate.toDate();
                    const timeDiff = expiryDate - now;
                    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    console.log(`${doc.name} - Days until expiry:`, dayDiff);

                    if (dayDiff <= warningDays) {
                        count++;
                        notifications.push(`El ${doc.name} del vehículo con placa ${vehicle.Placa} está próximo a vencer el ${expiryDate.toLocaleDateString()}.`);
                    }
                }
            });
        });

        notificationCount.textContent = count > 0 ? count : '';

        if (notifications.length > 0) {
            notificationContainer.innerHTML = '';
            
            notifications.forEach(notification => {
                const notificationElement = document.createElement('div');
                notificationElement.classList.add('notification');
                notificationElement.textContent = notification;
                notificationContainer.appendChild(notificationElement);
            });
        } else {
            notificationContainer.style.display = 'none';
        }

    } catch (error) {
        console.error('Error fetching vehicle data:', error);
    }
}

export async function toggleNotificationContainer() {
    const notificationContainer = document.getElementById('notificationContainer');
    const displayStyle = getComputedStyle(notificationContainer).display;
    
    if (displayStyle === 'none') {
        await updateNotifications(); 
        notificationContainer.style.display = 'block'; 
    } else {
        notificationContainer.style.display = 'none'; 
    }
}


document.addEventListener('DOMContentLoaded', updateNotifications);

document.getElementById('notificationBell').addEventListener('click', toggleNotificationContainer);

document.addEventListener('DOMContentLoaded', () => {
    const notificationContainer = document.getElementById('notificationContainer');

    const hideNotifications = () => {
        notificationContainer.style.display = 'none';
    };

    const notificationBell = document.getElementById('notificationBell');
    notificationBell.addEventListener('click', toggleNotificationContainer);

    document.addEventListener('click', (event) => {
        if (!notificationContainer.contains(event.target) && event.target !== notificationBell) {
            hideNotifications();
        }
    });

    notificationContainer.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    window.addEventListener('scroll', hideNotifications);
});
