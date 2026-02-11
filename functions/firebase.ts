import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyCwJTYBxGlTdIxxowpt5sMpJHJBikneYOE',
  authDomain: 'mayalok-ventures.firebaseapp.com',
  projectId: 'mayalok-ventures',
  storageBucket: 'mayalok-ventures.firebasestorage.app',
  messagingSenderId: '6750906250',
  appId: '1:6750906250:web:c4fa192df9fc18beee0a73',
  measurementId: 'G-68BYZ14PBC',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app, 'risk-fortress')

export { app, db }
