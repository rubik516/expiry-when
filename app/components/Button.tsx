import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";

export const Variant = {
  Primary: "primary",
  Secondary: "secondary",
} as const;

interface ButtonProps {
  label: string;
  onPress: () => void;
  viewStyles?: ViewStyle[];
  variant?: (typeof Variant)[keyof typeof Variant];
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  viewStyles = [],
  variant = Variant.Primary,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: "center",
      borderRadius: theme.border.radius.rounded,
      flex: 0,
      justifyContent: "center",
      padding: theme.spacing.md,
      paddingHorizontal: theme.spacing.md,
      shadowColor: theme.shadow.shadowColor,
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
    },
    label: {
      fontSize: theme.typography.regular,
    },
    onPrimary: {
      color: "white",
    },
    onSecondary: {
      color: theme.color.onPrimary,
    },
    primary: {
      backgroundColor: "black",
    },
    secondary: {
      backgroundColor: "white",
      borderColor: theme.color.primary,
      borderStyle: "solid",
      borderWidth: theme.border.width.thin,
    },
  });

  const variantContainerStyle = {
    [Variant.Primary]: styles.primary,
    [Variant.Secondary]: styles.secondary,
  }[variant];

  const variantLabelStyle = {
    [Variant.Primary]: styles.onPrimary,
    [Variant.Secondary]: styles.onSecondary,
  }[variant];

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, variantContainerStyle, ...viewStyles]}
    >
      <Text style={[styles.label, variantLabelStyle]}>{label}</Text>
    </Pressable>
  );
};

export default Button;
