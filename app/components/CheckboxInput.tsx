import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface CheckboxInputProps {
  checked: boolean;
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  checked,
  label,
  onPress,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    checkbox: {
      alignItems: "center",
      backgroundColor: "white",
      borderColor: theme.color.primary,
      borderRadius: theme.border.radius.light,
      borderWidth: theme.border.width.thin,
      height: theme.width.md,
      justifyContent: "center",
      width: theme.width.md,
    },
    checked: {
      backgroundColor: theme.color.primary,
      borderRadius: theme.border.radius.light,
      height: theme.width.sm * 1.25,
      width: theme.width.sm * 1.25,
    },
    container: {
      alignItems: "center",
      flexDirection: "row",
      padding: theme.spacing.sm,
    },
    label: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      paddingLeft: theme.spacing.sm,
    },
  });
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View style={styles.checkbox}>
        {checked && <View style={styles.checked} />}
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default CheckboxInput;
