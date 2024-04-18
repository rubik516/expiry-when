import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface RoundedPressableProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

const RoundedPressable: React.FC<RoundedPressableProps> = ({
  label,
  onPress,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.sm,
      backgroundColor: theme.color.primary,
      borderRadius: theme.border.radius.rounded,
      paddingHorizontal: theme.spacing.md,
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

export default RoundedPressable;
