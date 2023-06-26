import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBzRO43szfMPjn_vVRAdJ0jirvjOv3GpKc",
    authDomain: "aonyxtts-85115.firebaseapp.com",
    projectId: "aonyxtts-85115",
    storageBucket: "aonyxtts-85115.appspot.com",
    messagingSenderId: "44885192949",
    appId: "1:44885192949:web:9e12bca22301ec1500d5bc",
    measurementId: "G-D5WBTJ6PQ4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userDataKey = `users`;

export async function getData(_key){
    const ref = doc(db, `${userDataKey}`, `${_key}`);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()){
        return snapshot.data();
    }else{
        return null;
    }
}

export async function setData(_key, _data){
    const ref = doc(db, `${userDataKey}`, `${_key}`);
    await setDoc(ref, _data);
}
