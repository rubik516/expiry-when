import { StyleSheet, Pressable, View, ViewStyle } from "react-native";
import { Field } from "../types/field";
import InputField from "./InputField";
import { getMonthDDYYYY } from "../utils/formatDate";
import { useGlobalTheme } from "../contexts/ThemeContext";
import SingleDatePicker from "./SingleDatePicker";

interface DatePickerFieldProps {
  field: Field<Date>;
  label: string;
  onUpdate: (value: Date) => void;
  placeholder?: string;
  showPicker: boolean;
  setShowPicker: (value: boolean) => void;
  style?: ViewStyle;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({
  field,
  label,
  onUpdate,
  showPicker,
  setShowPicker,
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

  const onConfirmChange = (params: any) => {
    const { date } = params;
    onUpdate(date);
    closePicker();
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <View style={[styles.fieldWrapper, style]}>
      <InputField
        displayValue={getMonthDDYYYY(field.value.getTime().toString())}
        label={label}
        field={field}
        editable={false}
      />

      <Pressable onPress={openPicker} style={styles.pickerWrapper}>
        <SingleDatePicker
          date={new Date(field.value)}
          onConfirm={onConfirmChange}
          onDismiss={closePicker}
          visible={showPicker}
        />
      </Pressable>
    </View>
  );
};

export default DatePickerField;
