import { StyleSheet, Text, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";

interface ErrorTextProps {
  text: string;
  style?: ViewStyle;
}

const ErrorText: React.FC<ErrorTextProps> = ({ text }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    error: {
      color: theme.color.onDanger,
    },
  });
  return <Text style={styles.error}>{text}</Text>;
};

export default ErrorText;
