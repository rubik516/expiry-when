import {
  TextInput,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextInputProps,
} from "react-native";
import { Field } from "../types/field";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface InputFieldProps<T> extends TextInputProps {
  displayValue: string;
  field: Field<T>;
  label: string;
  onUpdate?: (value: string) => void;
  style?: ViewStyle;
}

const InputField = <T,>({
  displayValue,
  field,
  label,
  onUpdate,
  style,
  ...props
}: InputFieldProps<T>) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    fieldContainer: {
      flex: 1,
      flexDirection: "column",
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
        style={styles.input}
        onChangeText={handleChange}
        placeholderTextColor={theme.color.primaryContainer}
        value={displayValue}
        {...props}
      />
    </View>
  );
};

export default InputField;
