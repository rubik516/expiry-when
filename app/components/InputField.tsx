import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";

import ErrorText from "@/components/ErrorText";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import { Field } from "@/utils/field";

interface InputFieldProps<T> extends TextInputProps {
  displayValue: string;
  error?: string;
  field: Field<T>;
  label: string;
  onUpdate?: (value: string) => void;
  showError?: boolean;
  style?: ViewStyle;
}

const InputField = <T,>({
  displayValue,
  error,
  field,
  label,
  onUpdate,
  showError,
  style,
  ...props
}: InputFieldProps<T>) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    fieldContainer: {
      flexDirection: "column",
    },
    error: {
      color: theme.color.onDanger,
    },
    input: {
      backgroundColor: "white",
      borderRadius: theme.border.radius.light,
      borderColor: theme.color.primary,
      borderStyle: "solid",
      borderWidth: theme.border.width.thin,
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      height: theme.width.lg,
      padding: theme.spacing.sm,
      shadowColor: theme.shadow.shadowColor,
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
      width: "100%",
    },
    label: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      marginBottom: theme.spacing.sm,
      paddingLeft: theme.spacing.sm,
    },
  });

  const handleChange = (value: string) => {
    onUpdate?.(value);
  };

  return (
    <View style={[styles.fieldContainer, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={handleChange}
        placeholderTextColor={theme.color.primaryContainer}
        style={styles.input}
        value={displayValue}
        {...props}
      />
      {showError && <ErrorText text={error ?? "Something happened"} />}
    </View>
  );
};

export default InputField;
