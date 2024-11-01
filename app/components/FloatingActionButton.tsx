import { PropsWithChildren } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";

interface FloatingActionButtonProps extends PropsWithChildren {
  onPress: () => void;
  viewStyles?: ViewStyle[];
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  children,
  onPress,
  viewStyles = [],
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    fab: {
      position: "absolute",
      right: 0,
      bottom: theme.spacing.lg,
      margin: theme.spacing.md,
      backgroundColor: theme.color.onSecondary,
      borderRadius: theme.border.radius.rounded,
      height: theme.width.lg,
      width: theme.width.lg,
      shadowColor: theme.shadow.shadowColor,
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
    },
  });

  return (
    <Pressable onPress={onPress} style={[styles.fab, ...viewStyles]}>
      {children}
    </Pressable>
  );
};

export default FloatingActionButton;
