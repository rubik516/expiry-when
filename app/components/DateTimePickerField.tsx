import { StyleSheet, Pressable, View, ViewStyle } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Field } from "../types/field";
import InputField from "./InputField";
import { getMonthDDYYYY } from "../utils/formatDate";
import { useGlobalTheme } from "../contexts/Themes";

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
  placeholder,
  showPicker,
  setShowPicker,
  style,
}) => {
  const { theme } = useGlobalTheme();
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

  const onPickerChange = (event: DateTimePickerEvent, _?: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
    console.log("type", type);
    onUpdate(new Date(timestamp));
    if (type === "dismissed") {
      setShowPicker(false);
    }
  };

  const openPicker = () => {
    console.log("something is tap");
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
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="calendar"
            value={new Date(field.value)}
            onChange={onPickerChange}
            style={styles.picker}
          />
        )}
      </Pressable>
    </View>
  );
};

export default DateTimePickerField;
