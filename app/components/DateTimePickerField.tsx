import { TextInput, StyleSheet, Text, Pressable } from "react-native";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { Field } from "../types/field";

interface DateTimePickerFieldProps {
  field: Field<Date>;
  label: string;
  onUpdate: (field: Field<Date>) => void;
  placeholder?: string;
  showPicker: boolean;
  setShowPicker: (value: boolean) => void;
}

const DateTimePickerField: React.FC<DateTimePickerFieldProps> = ({
  field,
  label,
  onUpdate,
  placeholder,
  showPicker,
  setShowPicker,
}) => {
  const onPickerChange = (event: DateTimePickerEvent, _?: Date) => {
    const {
      type,
      nativeEvent: { timestamp },
    } = event;
    console.log("type", type)
    field.value = new Date(timestamp);
    onUpdate(field);
    if (type === "dismissed") {
      setShowPicker(false);
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  return (
    <>
      <Text>{label}</Text>
      <Pressable onPress={openPicker}>
        <TextInput
          style={styles.input}
          value={field.value.toString()}
          placeholder={placeholder}
          keyboardType="numeric"
          editable={false}
        />
        {showPicker && (
          <DateTimePicker
            mode="date"
            display="default"
            value={new Date(field.value)}
            onChange={onPickerChange}
          />
        )}
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default DateTimePickerField;
