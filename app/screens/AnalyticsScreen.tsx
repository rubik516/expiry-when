import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function AnalyticsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Analytics</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "turquoise",
    width: "100%",
    height: "100%",
  },
});
