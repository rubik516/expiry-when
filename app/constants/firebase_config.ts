import {
  getApp,
  getApps,
  initializeApp as initializeFirebaseApp,
} from "firebase/app";
import FIREBASE from "./firebase";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const FIREBASE_CONFIG = {
  apiKey: `${FIREBASE.apiKey}`,
  authDomain: `${FIREBASE.projectId}.firebaseapp.com`,
  databaseURL: `https://${FIREBASE.databaseName}.firebaseio.com`,
  projectId: `${FIREBASE.projectId}`,
  storageBucket: `${FIREBASE.projectId}.appspot.com`,
};

const getFirebaseData = () => {
  if (getApps().length < 1) {
    try {
      const app = initializeFirebaseApp(FIREBASE_CONFIG);
      const auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
      const currentUser = auth.currentUser || undefined;
      return { app, auth, currentUser };
    } catch (error) {
      console.log("Error initializing Firebase app: " + error);
    }
  }
  const app = getApp();
  const auth = getAuth(app);
  const currentUser = auth.currentUser || undefined;
  return { app, auth, currentUser };
};

export default getFirebaseData;
