import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

import { DialogRole } from "@/components/Dialog";
import { getFirebaseData } from "@/constants/firebase_config";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import User from "@/types/user";
import formatPayload from "@/utils/formatPayload";
import request from "@/utils/request";

interface AuthContextProps {
  loading: boolean;
  firebaseUser: User | undefined;
  user: User | undefined;
}

const WAIT_TIME_THRESHOLD = 10000; // wait for 10 seconds maximum to load initial data (user) from the server

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [firebaseUser, setFirebaseUser] = useState<User | undefined>();
  const { addDialogItem } = useDialogManager();

  const createUser = async () => {
    if (user) {
      const userPayload = formatPayload(user);
      const response = await request("create_user", {
        method: "POST",
        body: JSON.stringify(userPayload),
      });
      if (!response || !response.ok) {
        addDialogItem({
          message: "Creating new user failed!",
          role: DialogRole.Danger,
        });
        return;
      }

      const createdUser = await response.json();
      setFirebaseUser(createdUser);
    }
  };

  const getFirebaseUser = async () => {
    if (!user) {
      return undefined;
    }

    try {
      const response = await request("get_user");

      if (response && response.ok) {
        const json = await response.json();
        const retrievedUser = json.data as User;
        setFirebaseUser(retrievedUser);
        return retrievedUser;
      }
      return undefined;
    } catch (error) {
      addDialogItem({
        message: "Fail retrieving user",
        role: DialogRole.Danger,
      });
    }
  };

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, WAIT_TIME_THRESHOLD);
    setTimer(loadingTimer);
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      clearTimeout(timer);
      setTimer(undefined);
      setLoading(false);
    }
  }, [firebaseUser]);

  useEffect(() => {
    async function createAnonymousUser() {
      const { auth } = getFirebaseData();
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
      const savedUser = await getFirebaseUser();
      if (!savedUser) {
        await createUser();
      }
    }

    createUserIfNotExisted();
  }, [user]);

  return (
    <AuthContext.Provider value={{ loading, user, firebaseUser }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
