// import and configure firebase
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyBsLGrmeybpw9Bv0Bw3X9qyb6okJGtWjJo",
    authDomain: "joyeria-valery.firebaseapp.com",
    databaseURL: "https://joyeria-valery.firebaseio.com",
    projectId: "joyeria-valery",
    storageBucket: "joyeria-valery.appspot.com",
    messagingSenderId: "406707881837"
}
export const firebaseApp = firebase.initializeApp(firebaseConfig)
