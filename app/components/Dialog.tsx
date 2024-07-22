import { useEffect, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";

const DIALOG_SHOWING_TIME = 5000;

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
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>();
  const { theme } = useGlobalTheme();
  const [borderColor] = useState(new Animated.Value(0));
  const [opacity] = useState(new Animated.Value(1));

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

  const interpolatedBorderColor = borderColor.interpolate({
    inputRange: [0, 1],
    outputRange: [
      onBackgroundVariant(item.role ?? DialogRole.Info),
      "transparent",
    ],
  });

  const styles = StyleSheet.create({
    closeButton: {
      marginLeft: theme.spacing.sm,
    },
    container: {
      backgroundColor: backgroundVariant(item.role ?? DialogRole.Info),
      borderRadius: theme.border.radius.light,
      borderStyle: "solid",
      borderWidth: theme.border.width.thin,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    message: {
      color: onBackgroundVariant(item.role ?? DialogRole.Info),
      fontSize: theme.typography.regular,
      fontWeight: "600",
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

  const runAnimation = () => {
    Animated.parallel([
      Animated.timing(borderColor, {
        toValue: 1,
        duration: DIALOG_SHOWING_TIME,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        delay: DIALOG_SHOWING_TIME - 1500,
        duration: 1500,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    runAnimation();
    const time = setTimeout(() => {
      setShowing(false);
    }, DIALOG_SHOWING_TIME);
    setTimer(time);
  }, []);

  useEffect(() => {
    if (!showing) {
      clearTimeout(timer);
      setTimer(undefined);
    }
  }, [showing]);

  return (
    <>
      {showing && (
        <Animated.View
          style={[
            styles.container,
            {
              borderColor: interpolatedBorderColor,
              opacity: opacity,
            },
          ]}
        >
          <Text style={styles.message}>{item.message}</Text>
          <Pressable onPress={closeDialog} style={styles.closeButton}>
            <Text style={styles.submessage}>Close</Text>
          </Pressable>
        </Animated.View>
      )}
    </>
  );
};

export default Dialog;
