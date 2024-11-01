import { NavigationContainer } from "@react-navigation/native";
import { FormattedMessage } from "react-intl";
import { StyleSheet, Text, View } from "react-native";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useAuth } from "@/contexts/AuthContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import BottomTabs from "@/navigations/BottomTabs";
import getDefaultMessage from "@/utils/getDefaultMessage";

export default function ProtectedApp() {
  const { user, loading } = useAuth();
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
      width: theme.spinnerDot.lg,
      height: theme.spinnerDot.lg,
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

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>
          <FormattedMessage
            id="error.no_user"
            defaultMessage={getDefaultMessage("error.no_user")}
          />
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <BottomTabs />
    </NavigationContainer>
  );
}
