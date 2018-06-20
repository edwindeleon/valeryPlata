// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)