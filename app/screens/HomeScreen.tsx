import { useState } from "react";
import {
  Button,
  Text,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import RouteName, { RouteParamList } from "../types/navigation";

const HomeScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.Home>
> = ({ navigation }) => {
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    setCount(count + 1);
  };

  const handleFloatingAction = () => {
    navigation.navigate(RouteName.NewEntry);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Number of clicks: {count}</Text>
      <Button onPress={handleButtonClick} title="Click Me" />
      <Pressable onPress={handleFloatingAction} style={styles.fab}>
        <Image source={require("../assets/favicon.png")} />
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  fab: {
    backgroundColor: "#00f",
    borderRadius: 100,
    height: 60,
    shadowColor: "#111",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.6,
    width: 60,
  },
  text: {
    fontSize: 16,
  },
});

export default HomeScreen;
