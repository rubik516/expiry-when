import { TextInput, StyleSheet, Text } from "react-native";
import { Field } from "../types/field";

interface InputFieldProps {
  field: Field;
  label: string;
  onUpdate: (field: Field) => void;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  field,
  label,
  onUpdate,
  placeholder,
}) => {

  const handleChange = (value: string) => {
    field.value = value;
    onUpdate(field);
  }
  return (
    <>
      <Text>{label}</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleChange}
        value={field.value}
        placeholder="6"
        keyboardType="numeric"
      />
      
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

export default InputField;
