import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import BottomNav from "@/components/BottomNav";
import HomeStack from "@/navigations/HomeStack";
import AnalyticsScreen from "@/screens/AnalyticsScreen";
import TrackerScreen from "@/screens/TrackerScreen";
import { RouteParamList } from "@/types/navigation";

const Tab = createBottomTabNavigator<RouteParamList>();

export default function BottomTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <BottomNav {...props} />}>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
    </Tab.Navigator>
  );
}
