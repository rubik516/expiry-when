import { en, registerTranslation } from "react-native-paper-dates";

import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/contexts/DialogManagerContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import ProtectedApp from "@/navigations/ProtectedApp";

export default function App() {
  registerTranslation("en", en);

  return (
    <LoadingProvider>
      <DialogProvider>
        <AuthProvider>
          <ProtectedApp />
        </AuthProvider>
      </DialogProvider>
    </LoadingProvider>
  );
}
