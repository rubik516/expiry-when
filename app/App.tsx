import { NavigationContainer } from "@react-navigation/native";
import { en, registerTranslation } from "react-native-paper-dates";
import BottomTabs from "./navigation/BottomTabs";
import { AuthProvider } from "./contexts/AuthContext";
import { DialogProvider } from "./contexts/DialogManagerContext";

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
