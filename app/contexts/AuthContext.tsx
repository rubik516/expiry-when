import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import User from "../types/user";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import formatPayload from "../utils/formatPayload";
import request from "../utils/request";
import { getFirebaseData } from "../constants/firebase_config";
import { useDialogManager } from "./DialogManagerContext";
import { DialogRole } from "../components/Dialog";

interface AuthContextProps {
  user: User | undefined;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const { addDialogItem } = useDialogManager();

  const createUser = async () => {
    if (user) {
      const userPayload = formatPayload(user);
      const response = await request("create_user", {
        method: "POST",
        body: JSON.stringify(userPayload),
      });
      if (response && !response.ok) {
        addDialogItem({
          message: "Creating new user failed!",
          role: DialogRole.Danger,
        });
      }
    }
  };

  const findUser = async () => {
    if (!user) {
      return undefined;
    }

    try {
      const response = await request(`get_user?user_id=${user["uid"]}`);
      if (response && response.ok) {
        const data = await response.json();
        return data;
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
      const savedUser = await findUser();
      if (!savedUser) {
        await createUser();
      }
    }

    createUserIfNotExisted();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user }}>
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
