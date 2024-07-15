import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "@/screens/HomeScreen";
import NewEntryScreen from "@/screens/NewEntryScreen";
import RouteName, { RouteParamList } from "@/types/navigation";

const Stack = createNativeStackNavigator<RouteParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name={RouteName.Home} component={HomeScreen} />
      <Stack.Screen name={RouteName.NewEntry} component={NewEntryScreen} />
    </Stack.Navigator>
  );
}
