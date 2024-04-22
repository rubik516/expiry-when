import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";
import { PropsWithChildren } from "react";

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
      bottom: 0,
      margin: 15,
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
