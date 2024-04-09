import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NewEntryScreen from "./screens/NewEntryScreen";
import { StackParamList } from "./types/navigation";

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewEntry" component={NewEntryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
