import { useState } from "react";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";

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
  const { item, removeItem } = props;
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
    closeButton: {
      marginLeft: theme.spacing.sm,
    },
    container: {
      backgroundColor: backgroundVariant(item.role ?? DialogRole.Info),
      borderRadius: theme.border.radius.light,
      padding: theme.spacing.md,
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      borderColor: onBackgroundVariant(item.role ?? DialogRole.Info),
      borderStyle: "solid",
      borderWidth: theme.border.width.thin,
      marginTop: theme.spacing.sm,
    },
    message: {
      fontSize: theme.typography.regular,
      fontWeight: "600",
      color: onBackgroundVariant(item.role ?? DialogRole.Info),
      maxWidth: "90%",
    },
    submessage: {
      borderColor: onBackgroundVariant(item.role ?? DialogRole.Info),
      borderRadius: theme.border.radius.extraLight,
      borderWidth: theme.border.width.thin,
      color: onBackgroundVariant(item.role ?? DialogRole.Info),
      padding: theme.spacing.sm / 2,
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
          <Pressable onPress={closeDialog} style={styles.closeButton}>
            <Text style={styles.submessage}>Close</Text>
          </Pressable>
        </View>
      )}
    </>
  );
};

export default Dialog;
