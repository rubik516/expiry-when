import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import InputField from "@/components/InputField";
import SingleDatePicker from "@/components/SingleDatePicker";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import { Field } from "@/utils/field";

import type { SingleChangeParams } from "@/types/datePicker";

interface DatePickerFieldProps {
  error?: string;
  field: Field<Date | undefined>;
  label: string;
  onUpdate: (value: Date) => void;
  placeholder?: string;
  setShowPicker: (value: boolean) => void;
  showError?: boolean;
  showPicker: boolean;
  style?: ViewStyle;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  error,
  field,
  label,
  onUpdate,
  placeholder,
  setShowPicker,
  showError,
  showPicker,
  style,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    input: {
      height: theme.width.lg,
      margin: theme.spacing.md,
      borderWidth: 1,
      padding: theme.spacing.sm,
    },
    fieldWrapper: {
      position: "relative",
    },
    pickerWrapper: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
  });

  const closePicker = () => {
    setShowPicker(false);
  };

  const onConfirmChange = (params: SingleChangeParams) => {
    const { date } = params;
    onUpdate(date as Date);
    closePicker();
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={[styles.fieldWrapper, style]}>
      <InputField
        editable={false}
        error={error}
        field={field}
        label={label}
        placeholder={placeholder}
        showError={showError}
      />

      <Pressable onPress={openPicker} style={styles.pickerWrapper}>
        <SingleDatePicker
          date={field.value ? new Date(field.value) : new Date()}
          onConfirm={onConfirmChange}
          onDismiss={closePicker}
          visible={showPicker}
        />
      </Pressable>
    </View>
  );
};

export default DatePickerField;
