import { auth, db, storage, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, doc, setDoc, getDocs, getDoc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL } from './firebase.js';

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

export const cargarArchivo = async (file, placa, tipoDocumento) => {
  const storageRef = ref(storage, `${tipoDocumento}/${placa}/${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const AgregarVehiculo = (tipo, marca, modelo, año, placa, capacidad, estado, soatURL, fechaSoat, email, 
  peritajeURL, fechaPeritaje, tarjetaOperacionURL, fechaTarjetaOperacion, extractoContratoURL, fechaExtractoContrato,
  quintaRuedaURL, fechaQuintaRueda, kingPinURL, fechaKingPin) => {

  const docRef = doc(db, "Vehiculos", placa);
  console.log("Document Reference:", docRef);

  const vehiculoData = {
      Tipo: tipo,
      Marca: marca,
      Modelo: modelo,
      Año: año,
      Placa: placa,
      Capacidad_Carga: capacidad,
      Estado: estado,
      SoatURL: soatURL,
      FechaSoat: fechaSoat,
      Email: email
  };

  if (tipo === "vehiculo_ligero") {
      vehiculoData.PeritajeURL = peritajeURL;
      vehiculoData.FechaPeritaje = fechaPeritaje;
      vehiculoData.TarjetaOperacionURL = tarjetaOperacionURL;
      vehiculoData.FechaTarjetaOperacion = fechaTarjetaOperacion;
      vehiculoData.ExtractoContratoURL = extractoContratoURL;
      vehiculoData.FechaExtractoContrato = fechaExtractoContrato;
  } else if (tipo === "vehiculo_articulado") {
      vehiculoData.QuintaRuedaURL = quintaRuedaURL;
      vehiculoData.FechaQuintaRueda = fechaQuintaRueda;
      vehiculoData.KingPinURL = kingPinURL;
      vehiculoData.FechaKingPin = fechaKingPin;
  }

  return setDoc(docRef, vehiculoData)
      .then(() => {
          console.log("Document successfully written!");
          return docRef; 
      })
      .catch((error) => {
          console.error("Error writing document: ", error);
          throw error;
      });
};


export const listarVehiculos = async () => {
  const querySnapshot = await getDocs(collection(db, "Vehiculos"));
  const vehiculos = [];
  querySnapshot.forEach((doc) => {
    vehiculos.push({ id: doc.id, ...doc.data() });
  });
  return vehiculos;
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

export const editarVehiculo = async (placa, nuevosDatos) => {
  const docRef = doc(db, "Vehiculos", placa);
  await setDoc(docRef, nuevosDatos, { merge: true });
};

export const borrarVehiculo = async (placa) => {
  const docRef = doc(db, "Vehiculos", placa);
  await deleteDoc(docRef);
};


export const obtenerDireccionesCorreo = async () => {
  try {
    const vehiculosSnapshot = await getDocs(collection(db, 'Vehiculos'));
    const direccionesCorreo = [];
    vehiculosSnapshot.forEach((doc) => {
      const vehiculo = doc.data();  
      if (vehiculo.Email) {
        direccionesCorreo.push(vehiculo.Email);
      }
    });
    return direccionesCorreo;
  } catch (error) {
    console.error('Error obteniendo direcciones de correo electrónico:', error);
    throw error;
  }
};
