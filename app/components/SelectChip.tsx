import { PropsWithChildren } from "react";
import { FormattedMessage } from "react-intl";
import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";
import getDefaultMessage from "@/utils/getDefaultMessage";

interface SelectChipProps extends PropsWithChildren {
  label?: string;
  onPress: () => void;
  selected: boolean;
  style?: ViewStyle;
}

const SelectChip: React.FC<SelectChipProps> = ({
  children,
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
      <Text style={styles.label}>
        {label && (
          <FormattedMessage
            id={label}
            defaultMessage={getDefaultMessage(label)}
          />
        )}
        {children}
      </Text>
    </Pressable>
  );
};

export default SelectChip;
