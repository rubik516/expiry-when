import { StyleSheet, Pressable, View, ViewStyle, Button } from "react-native";
import { Field } from "../types/field";
import InputField from "./InputField";
import { getMonthDDYYYY } from "../utils/formatDate";
import { DatePickerModal } from "react-native-paper-dates";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface DateTimePickerFieldProps {
  field: Field<Date>;
  label: string;
  onUpdate: (value: Date) => void;
  placeholder?: string;
  showPicker: boolean;
  setShowPicker: (value: boolean) => void;
  style?: ViewStyle;
}

const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
  field,
  label,
  onUpdate,
  showPicker,
  setShowPicker,
  style,
}) => {
  const {theme} = useGlobalTheme()
  const paperTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.color.secondary,
      secondary: "yellow",
      onSurface: theme.color.onPrimary,
      onSurfaceVariant: theme.color.primary,
    },
  };
  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
    },
    fieldWrapper: {
      position: "relative",
    },
    pickerWrapper: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    picker: {
      right: 0,
      top: "40%",
      position: "absolute",
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
        placeholder="Enter product"
        field={field}
        editable={false}
      />

      <Pressable onPress={openPicker} style={styles.pickerWrapper}>
        <PaperProvider theme={paperTheme}>
          <DatePickerModal
            locale="en"
            mode="single"
            visible={showPicker}
            onDismiss={closePicker}
            date={new Date(field.value)}
            onConfirm={onConfirmChange}
          />
        </PaperProvider>
      </Pressable>
    </View>
  );
};

export default DateTimePickerField;
