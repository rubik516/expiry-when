import { NavigationContainer } from "@react-navigation/native";
import { en, registerTranslation } from "react-native-paper-dates";
import BottomTabs from "./navigation/BottomTabs";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  registerTranslation("en", en);

  return (
    <AuthProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
    </AuthProvider>
  );
}
