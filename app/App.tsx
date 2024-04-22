import { NavigationContainer } from "@react-navigation/native";
import { en, registerTranslation } from "react-native-paper-dates";
import BottomTabs from "./navigation/BottomTabs";

export default function App() {
  registerTranslation("en", en);
  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
