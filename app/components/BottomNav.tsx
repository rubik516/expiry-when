import { FormattedMessage } from "react-intl";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";
import RouteName from "@/types/navigation";
import getDefaultMessage from "@/utils/getDefaultMessage";

import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const BottomNav: React.FC<BottomTabBarProps> = ({ navigation, state }) => {
  const { theme } = useGlobalTheme();
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
    navText: {
      color: theme.color.onPrimary,
    },
    navTextHighlight: {
      fontWeight: "600",
    },
  });

  const isRouteFocused = (route: string) => {
    return state.routes[state.index].name === route;
  };

  return (
    <SafeAreaView>
      <View style={styles.nav}>
        <Pressable
          onPress={() => navigation.navigate(RouteName.Home)}
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navText,
              isRouteFocused(RouteName.HomeStack)
                ? styles.navTextHighlight
                : null,
            ]}
          >
            <FormattedMessage
              id="screens.home"
              defaultMessage={getDefaultMessage("screens.home")}
            />
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate(RouteName.Tracker)}
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navText,
              isRouteFocused(RouteName.Tracker)
                ? styles.navTextHighlight
                : null,
            ]}
          >
            <FormattedMessage
              id="screens.tracker"
              defaultMessage={getDefaultMessage("screens.tracker")}
            />
          </Text>
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate(RouteName.Analytics)}
          style={styles.navItem}
        >
          <Text
            style={[
              styles.navText,
              isRouteFocused(RouteName.Analytics)
                ? styles.navTextHighlight
                : null,
            ]}
          >
            <FormattedMessage
              id="screens.analytics"
              defaultMessage={getDefaultMessage("screens.analytics")}
            />
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default BottomNav;
