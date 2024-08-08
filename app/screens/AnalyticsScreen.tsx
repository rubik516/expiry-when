import { FormattedMessage } from "react-intl";
import { SafeAreaView, StyleSheet, Text } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";
import getDefaultMessage from "@/utils/getDefaultMessage";

export default function TrackerScreen() {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: theme.color.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
    },
    heading: {
      color: theme.color.onPrimary,
      fontWeight: "600",
      fontSize: theme.typography.heading,
      marginTop: theme.spacing.lg,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>
        <FormattedMessage
          id="screens.analytics"
          defaultMessage={getDefaultMessage("screens.analytics")}
        />
      </Text>
    </SafeAreaView>
  );
}
