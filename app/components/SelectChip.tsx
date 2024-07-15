import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface SelectChipProps {
  label: string;
  onPress: () => void;
  selected: boolean;
  style?: ViewStyle;
}

const SelectChip: React.FC<SelectChipProps> = ({
  label,
  onPress,
  selected,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: selected ? "black" : theme.color.primary,
      borderRadius: theme.border.radius.rounded,
      padding: theme.spacing.md,
    },
    label: {
      color: "white",
      fontSize: theme.typography.regular,
    },
  });
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

export default SelectChip;
