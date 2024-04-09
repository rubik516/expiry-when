import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import RouteName from "../types/navigation";

const BottomNav: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <SafeAreaView>
      <View style={styles.nav}>
        <Pressable
          onPress={() => navigation.navigate(RouteName.Home)}
          style={styles.navItem}
        >
          <Text>Home</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate(RouteName.Tracker)}
          style={styles.navItem}
        >
          <Text>Tracker</Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate(RouteName.Analytics)}
          style={styles.navItem}
        >
          <Text>Analytics</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  nav: {
    flexDirection: "row",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-around",
  },
  navItem: {
    paddingTop: 20,
  },
});

export default BottomNav;
