import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";
import { useState } from "react";

export enum DialogRole {
  Danger = "danger",
  Warning = "warning",
  Info = "info",
  Success = "success",
}

export interface DialogItem {
  id: string;
  message: string;
  role?: DialogRole;
  show?: boolean;
}
interface DialogProps {
  item: DialogItem;
  removeItem: (item: DialogItem) => void;
  style?: ViewStyle;
}

const Dialog: React.FC<DialogProps> = (props) => {
  const { item, removeItem, style } = props;
  const [showing, setShowing] = useState<boolean>(item.show || true);
  const { theme } = useGlobalTheme();

  const backgroundVariant = (role: DialogRole) => {
    switch (role) {
      case DialogRole.Danger:
        return theme.color.danger;
      case DialogRole.Info:
        return theme.color.info;
      case DialogRole.Success:
        return theme.color.success;
      case DialogRole.Warning:
        return theme.color.warning;
      default:
        return theme.color.info;
    }
  };

  const onBackgroundVariant = (role: DialogRole) => {
    switch (role) {
      case DialogRole.Danger:
        return theme.color.onDanger;
      case DialogRole.Info:
        return theme.color.onInfo;
      case DialogRole.Success:
        return theme.color.onSuccess;
      case DialogRole.Warning:
        return theme.color.onWarning;
      default:
        return theme.color.onInfo;
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: backgroundVariant(item.role ?? DialogRole.Info),
      borderRadius: theme.border.radius.light,
      padding: theme.spacing.md,
      flexDirection: "row",
      justifyContent: "space-between",
      borderColor: onBackgroundVariant(item.role ?? DialogRole.Info),
      borderStyle: "solid",
      borderWidth: theme.border.width.thin,
      marginTop: theme.spacing.sm,
    },
    message: {
      fontSize: theme.typography.regular,
      fontWeight: "600",
      color: onBackgroundVariant(item.role ?? DialogRole.Info),
    },
  });

  const closeDialog = () => {
    setShowing(false);
    removeItem(item);
  };

  return (
    <>
      {showing && (
        <View style={styles.container}>
          <Text style={styles.message}>{item.message}</Text>
          <Pressable onPress={closeDialog}>
            <Text>Close</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default Dialog;
