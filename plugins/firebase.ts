import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: 'AIzaSyDd-KB1MNXZ4MnquySQY8see0YgIqUSoBM',
    authDomain: 'nuxt-fb-tailwind-ts-template.firebaseapp.com',
    databaseURL: 'https://nuxt-fb-tailwind-ts-template.firebaseio.com',
    projectId: 'nuxt-fb-tailwind-ts-template',
    storageBucket: 'nuxt-fb-tailwind-ts-template.appspot.com',
    messagingSenderId: '863546375713',
    appId: '1:863546375713:web:17ad6929e1e98b2f66ad60',
  })
}

export { firebase }
