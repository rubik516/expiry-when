import { useState } from "react";
import { StyleSheet, Button, Text, View, ViewStyle } from "react-native";
import InputField from "../components/InputField";
import DatePickerField from "../components/DatePickerField";
import { Field } from "../types/field";
import { useGlobalTheme } from "../contexts/ThemeContext";
import SelectChip from "../components/SelectChip";
import { NOW } from "../utils/formatDate";

interface NewEntryFormProps {
  onSubmissionCompletion?: () => void;
  style?: ViewStyle;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({
  onSubmissionCompletion,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    field: {
      marginBottom: theme.spacing.lg,
    },
    goodForContainer: {
      flex: 1,
      flexDirection: "column",
    },
    goodForGroup: {
      flex: 1,
      flexDirection: "column",
      marginBottom: theme.spacing.lg,
    },
    goodForGroupRow: {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: theme.spacing.sm,
      columnGap: theme.spacing.sm / 2,
    },
    label: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      paddingLeft: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
  });
  const [showStartDate, setShowStartDate] = useState<boolean>(false);
  const [showBestBefore, setShowBestBefore] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState<boolean>(false);
  const [fields, setFields] = useState({
    entryTitle: new Field("", (value) => value.length > 0),
    startDate: new Field<Date>(NOW, (value) => !!value),
    duration: new Field(""),
    bestBefore: new Field<Date>(
      new Date(NOW.getTime() + 30 * 24 * 60 * 60 * 1000)
    ),
  });
  const goodForOptions = [6, 9, 12, 18, 24];

  const updateField = <K extends keyof typeof fields>(
    fieldKey: K,
    value: (typeof fields)[K]["value"]
  ) => {
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };
      updatedFields[fieldKey].value = value;
      return updatedFields;
    });
  };

  const submitEntry = () => {
    console.log("Submit entry", {
      startDate: fields.startDate.value,
      duration: fields.duration.value,
      bestBefore: fields.bestBefore.value,
    });
    onSubmissionCompletion?.();
  };

  return (
    <>
      <InputField
        displayValue={fields.entryTitle.value}
        label="Product"
        onUpdate={(value) => updateField("entryTitle", value)}
        placeholder="Enter product"
        field={fields.entryTitle}
        style={styles.field}
      />
      <DatePickerField
        label="Start Date"
        field={fields.startDate}
        onUpdate={(value) => updateField("startDate", value)}
        placeholder="Choose a date"
        showPicker={showStartDate}
        setShowPicker={setShowStartDate}
        style={styles.field}
      />
      <View style={styles.goodForContainer}>
        <Text style={styles.label}>Good For</Text>
        <View style={styles.goodForGroup}>
          <View style={[styles.goodForGroupRow]}>
            {goodForOptions.map((option) => (
              <SelectChip
                key={option}
                label={`${option} months`}
                onPress={() => {
                  setCustomDuration(false);
                  fields.duration.value = option.toString();
                }}
              />
            ))}
            <SelectChip
              label="Custom"
              onPress={() => {
                setCustomDuration(true);
                fields.duration.value = "";
              }}
            />
          </View>
        </View>
        {!!customDuration && (
          <InputField
            displayValue={fields.duration.value}
            field={fields.duration}
            keyboardType="numeric"
            label="Good For (months)"
            onUpdate={(value) => updateField("duration", value)}
            placeholder="6"
            style={styles.field}
          />
        )}
      </View>
      <DatePickerField
        label="Best Before"
        field={fields.bestBefore}
        onUpdate={(value) => updateField("bestBefore", value)}
        showPicker={showBestBefore}
        setShowPicker={setShowBestBefore}
        style={styles.field}
      />
      <Button onPress={submitEntry} title="Add new entry" />
    </>
  );
};

export default NewEntryForm;
