import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import BottomTabs from "@/navigations/BottomTabs";

export default function ProtectedApp() {
  const { firebaseUser, loading } = useAuth();
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: theme.color.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
    },
    message: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      marginTop: theme.spacing.md,
    },
    spinnerContainer: {
      width: 200,
      height: 200,
    },
    spinnerDot: {
      width: 30,
      height: 30,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}>
        <LoadingSpinner
          viewStyles={[styles.spinnerContainer, styles.spinnerDot]}
        />
      </View>
    );
  }

  if (!firebaseUser) {
    return (
      <View style={styles.container}>
        <Text>No user found</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
