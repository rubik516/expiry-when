import { en, registerTranslation } from "react-native-paper-dates";

import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/contexts/DialogManagerContext";
import ProtectedApp from "@/navigations/ProtectedApp";

export default function App() {
  registerTranslation("en", en);

  return (
    <DialogProvider>
      <AuthProvider>
        <ProtectedApp />
      </AuthProvider>
    </DialogProvider>
  );
}
