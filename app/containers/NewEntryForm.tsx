import { useState } from "react";
import { StyleSheet, Button, ScrollView, Pressable, Text } from "react-native";
import InputField from "../components/InputField";
import DateTimePickerField from "../components/DateTimePickerField";
import { Field } from "../types/field";

const NewEntryForm: React.FC = () => {
  const [showStartDate, setShowStartDate] = useState<boolean>(false);
  const [showBestBefore, setShowBestBefore] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState<boolean>(false);
  const [fields, setFields] = useState({
    entryTitle: new Field("", (value) => value.length > 0),
    startDate: new Field<Date>(new Date(), (value) => !!value),
    duration: new Field(""),
    bestBefore: new Field<Date>(new Date()),
  });

  const updateField = (
    fieldKey: keyof typeof fields,
    field: (typeof fields)[keyof typeof fields]
  ) => {
    console.log("updating field", fieldKey);
    setFields({ ...fields, [fieldKey]: field });
  };

  const submitEntry = () => {
    console.log("Submit entry", {
      startDate: fields.startDate.value,
      duration: fields.duration.value,
      bestBefore: fields.bestBefore.value,
    });
  };

  return (
    <ScrollView>
      <InputField
        label="Product"
        onUpdate={(value) => updateField("entryTitle", value)}
        placeholder="Enter product"
        field={fields.entryTitle}
      />
      <DateTimePickerField
        label="Start Date"
        field={fields.startDate}
        onUpdate={(value) => updateField("startDate", value)}
        placeholder="Choose a date"
        showPicker={showStartDate}
        setShowPicker={setShowStartDate}
      />
      <>
        <Pressable
          onPress={() => {
            setCustomDuration(false);
            fields.duration.value = "6";
          }}
        >
          <Text>6 months</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setCustomDuration(false);
            fields.duration.value = "9";
          }}
        >
          <Text>9 months</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setCustomDuration(false);
            fields.duration.value = "12";
          }}
        >
          <Text>12 months</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setCustomDuration(true);
            fields.duration.value = "";
          }}
        >
          <Text>Custom</Text>
        </Pressable>
        {!!customDuration && (
          <InputField
            label="Good For"
            onUpdate={(value) => updateField("duration", value)}
            field={fields.duration}
          />
        )}
      </>
      <DateTimePickerField
        label="Best Before"
        field={fields.bestBefore}
        onUpdate={(value) => updateField("bestBefore", value)}
        placeholder="Choose a date"
        showPicker={showBestBefore}
        setShowPicker={setShowBestBefore}
      />
      <Button onPress={submitEntry} title="Add new entry" />
    </ScrollView>
  );
};

export default NewEntryForm;
