import { useState } from "react";
import {
  StyleSheet,
  Button,
  ScrollView,
  Pressable,
  Text,
  View,
} from "react-native";
import InputField from "../components/InputField";
import DateTimePickerField from "../components/DateTimePickerField";
import { Field } from "../types/field";
import { useGlobalTheme } from "../contexts/Themes";
import RoundedPressable from "../components/RoundedPressable";
import { NOW } from "../utils/formatDate";

const NewEntryForm: React.FC = () => {
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
      justifyContent: "space-between",
    },
    groupRowMargin: {
      marginBottom: theme.spacing.sm,
    },
    label: {
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

  const updateField = <K extends keyof typeof fields>(
    fieldKey: K,
    value: (typeof fields)[K]["value"]
  ) => {
    console.log("updating field", fieldKey);
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
      <DateTimePickerField
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
          <View style={[styles.goodForGroupRow, styles.groupRowMargin]}>
            <RoundedPressable
              label="6 months"
              onPress={() => {
                setCustomDuration(false);
                fields.duration.value = "6";
              }}
            />
            <RoundedPressable
              label="9 months"
              onPress={() => {
                setCustomDuration(false);
                fields.duration.value = "9";
              }}
            />
            <RoundedPressable
              label="12 months"
              onPress={() => {
                setCustomDuration(false);
                fields.duration.value = "12";
              }}
            />
          </View>
          <View style={styles.goodForGroupRow}>
            <RoundedPressable
              label="18 months"
              onPress={() => {
                setCustomDuration(false);
                fields.duration.value = "18";
              }}
            />
            <RoundedPressable
              label="24 months"
              onPress={() => {
                setCustomDuration(false);
                fields.duration.value = "24";
              }}
            />
            <RoundedPressable
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
      <DateTimePickerField
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
