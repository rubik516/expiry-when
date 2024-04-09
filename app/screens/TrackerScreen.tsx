import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function TrackerScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Tracker</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "orange",
    width: "100%",
    height: "100%",
  },
});
