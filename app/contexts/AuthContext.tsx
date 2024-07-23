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
import formatResponse from "@/utils/formatResponse";
import request from "@/utils/request";

interface AuthContextProps {
  loading: boolean;
  user: User | undefined;
}

// maximum wait time of 10 seconds to load initial data (user) from the server
const WAIT_TIME_THRESHOLD = 10000;

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>();
  const { addDialogItem } = useDialogManager();

  const createUser = async (user: User) => {
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

    const createdUser = formatResponse((await response.json()).data) as User;
    setUser(createdUser);
  };

  const getUser = async () => {
    try {
      const response = await request("get_user");

      if (response && response.ok) {
        const retrievedUser = formatResponse(
          (await response.json()).data
        ) as User;
        setUser(retrievedUser);
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
    if (user) {
      clearTimeout(timer);
      setTimer(undefined);
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    async function registerUser() {
      const { auth } = getFirebaseData();
      signInAnonymously(auth);
      onAuthStateChanged(auth, async (anonymousUser) => {
        const savedUser = await getUser();
        if (savedUser) {
          return;
        }

        if (anonymousUser) {
          const currentUser: User = {
            createdAt: anonymousUser["metadata"]["creationTime"],
            isAnonymous: anonymousUser["isAnonymous"],
            lastLoginAt: anonymousUser["metadata"]["lastSignInTime"],
            uid: anonymousUser["uid"],
          };
          await createUser(currentUser);
        }
      });
    }

    registerUser();
  }, []);

  return (
    <AuthContext.Provider value={{ loading, user }}>
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
