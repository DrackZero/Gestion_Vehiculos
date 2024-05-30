import { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL } from './firebase.js';

// Funciones de autenticación
export const registrarUsuario = (password, correo) => createUserWithEmailAndPassword(auth, correo, password);

export const iniciar_sesion = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const CerrarSesion = () => signOut(auth);

export function SesionState() {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      console.log(uid);
    } else {
      window.location.href = "../index.html";
    }
  });
}

// Funciones de Firestore
export const cargarArchivo = async (file, placa) => {
  const storageRef = ref(storage, `soat/${placa}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const AgregarVehiculo = (marca, modelo, año, placa, capacidad, estado, soatURL, fechaSoat, email) => {
  const docRef = doc(db, "Vehiculos", placa); 
  console.log("Document Reference:", docRef);

  return setDoc(docRef, {
    Marca: marca,
    Modelo: modelo,
    Año: año,
    Placa: placa,
    Capacidad_Carga: capacidad,
    Estado: estado,
    SoatURL: soatURL,
    FechaSoat: fechaSoat,
    email
  })
  .then(() => {
    console.log("Document successfully written!");
    return docRef; 
  })
  .catch((error) => {
    console.error("Error writing document: ", error);
    throw error; 
  });
};
export const ConsultarVehiculo = async (placa) => {
  const docRef = doc(db, "Vehiculos", placa);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const soatURL = data.SoatURL;
    if (soatURL) {
      const downloadURL = await getDownloadURL(ref(storage, soatURL));
      return { ...data, downloadURL };
    } else {
      return data;
    }
  } else {
    console.log("No such document!");
    return null;
  }
};

export const listarVehiculos = async () => {
  const vehiculosSnapshot = await getDocs(collection(db, 'Vehiculos'));
  const vehiculos = [];
  vehiculosSnapshot.forEach((doc) => {
    vehiculos.push({ id: doc.id, ...doc.data() });
  });
  return vehiculos;
};

export const editarVehiculo = async (placa, nuevosDatos) => {
  const docRef = doc(db, 'Vehiculos', placa);
  await updateDoc(docRef, nuevosDatos);
};

export const borrarVehiculo = async (placa) => {
  const docRef = doc(db, 'Vehiculos', placa);
  await deleteDoc(docRef);
};


export const obtenerDireccionesCorreo = async () => {
  try {
    const vehiculosSnapshot = await getDocs(collection(db, 'Vehiculos'));
    const direccionesCorreo = [];
    vehiculosSnapshot.forEach((doc) => {
      const vehiculo = doc.data();
      if (vehiculo.email) {
        direccionesCorreo.push(vehiculo.email);
      }
    });
    return direccionesCorreo;
  } catch (error) {
    console.error('Error obteniendo direcciones de correo electrónico:', error);
    throw error;
  }
};
