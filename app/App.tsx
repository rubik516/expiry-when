import { en, registerTranslation } from "react-native-paper-dates";
import { NavigationContainer } from "@react-navigation/native";

import { AuthProvider } from "@/contexts/AuthContext";
import { DialogProvider } from "@/contexts/DialogManagerContext";
import BottomTabs from "@/navigations/BottomTabs";

export default function App() {
  registerTranslation("en", en);

  return (
    <DialogProvider>
      <AuthProvider>
        <NavigationContainer>
          <BottomTabs />
        </NavigationContainer>
      </AuthProvider>
    </DialogProvider>
  );
}
