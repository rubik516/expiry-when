import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface SelectChipProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

const SelectChip: React.FC<SelectChipProps> = ({ label, onPress }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.sm,
      backgroundColor: theme.color.primary,
      borderRadius: theme.border.radius.rounded,
    },
    label: {
      fontSize: theme.typography.regular,
      color: "white",
    },
  });
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default SelectChip;
