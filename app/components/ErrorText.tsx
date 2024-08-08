import { FormattedMessage } from "react-intl";
import { StyleSheet, Text, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";
import getDefaultMessage from "@/utils/getDefaultMessage";

interface ErrorTextProps {
  text?: string;
  style?: ViewStyle;
}

const ErrorText: React.FC<ErrorTextProps> = ({ text }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    error: {
      color: theme.color.onDanger,
    },
  });
  return (
    <Text style={styles.error}>
      {text ? (
        <FormattedMessage id={text} defaultMessage={getDefaultMessage(text)} />
      ) : (
        <FormattedMessage
          id="error.something_happened"
          defaultMessage={getDefaultMessage("error.something_happened")}
        />
      )}
    </Text>
  );
};

export default ErrorText;
