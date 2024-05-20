import { NavigationContainer } from "@react-navigation/native";
import { en, registerTranslation } from "react-native-paper-dates";
import BottomTabs from "./navigation/BottomTabs";
import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeApp as initializeFirebaseApp,
  getApp,
  getApps,
} from "firebase/app";
import FIREBASE_CONFIG from "./constants/firebase";
import { useEffect, useState } from "react";
import formatPayload from "./utils/formatPayload";
import User from "./types/user";

export default function App() {
  registerTranslation("en", en);
  const [user, setUser] = useState<User | undefined>(undefined);

  const createUser = async () => {
    if (user) {
      const userPayload = formatPayload(user);
      const response = await fetch(
        "https://us-central1-expirywhen.cloudfunctions.net/create_user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userPayload),
        }
      );
    }
  };

  const findUser = async () => {
    if (!user) {
      return undefined;
    }
    const response = await fetch(
      `https://us-central1-expirywhen.cloudfunctions.net/get_user?user_id=${user["uid"]}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return undefined;
  };

  useEffect(() => {
    async function createAnonymousUser() {
      const { auth } = getAnonymousFirebaseAuth();
      signInAnonymously(auth);
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const currentUser: User = {
            createdAt: user["metadata"]["creationTime"],
            isAnonymous: user["isAnonymous"],
            lastLoginAt: user["metadata"]["lastSignInTime"],
            uid: user["uid"],
          };
          setUser(currentUser);
        }
      });
    }

    createAnonymousUser();
  }, []);

  useEffect(() => {
    async function createUserIfNotExisted() {
      const savedUser = await findUser();
      if (!savedUser) {
        await createUser();
      }
    }

    createUserIfNotExisted();
  }, [user]);

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}

const firebaseConfig = {
  apiKey: `${FIREBASE_CONFIG.apiKey}`,
  authDomain: `${FIREBASE_CONFIG.projectId}.firebaseapp.com`,
  databaseURL: `https://${FIREBASE_CONFIG.databaseName}.firebaseio.com`,
  projectId: `${FIREBASE_CONFIG.projectId}`,
  storageBucket: `${FIREBASE_CONFIG.projectId}.appspot.com`,
  // messagingSenderId: "SENDER_ID",
  // appId: "APP_ID",
};
function getAnonymousFirebaseAuth() {
  if (getApps().length < 1) {
    try {
      const app = initializeFirebaseApp(firebaseConfig);
      const auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
      return { app, auth };
    } catch (error) {
      console.log("Error initializing Firebase app: " + error);
    }
  }
  const app = getApp();
  const auth = getAuth(app);
  return { app, auth };
}
