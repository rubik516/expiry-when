import { useState } from "react";
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DatePickerField from "../components/DatePickerField";
import { useGlobalTheme } from "../contexts/ThemeContext";
import usages from "../mock-data/usages";
import { Field } from "../utils/field";
import { NOW } from "../utils/formatDate";

export default function TrackerScreen() {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: theme.color.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
    },
    heading: {
      color: theme.color.onPrimary,
      fontWeight: "600",
      fontSize: theme.typography.heading,
      marginTop: theme.spacing.lg,
    },
  });

  const [dateField, setDateField] = useState(
    new Field<Date>(NOW, (value) => !!value)
  );
  const [showPicker, setShowPicker] = useState(false);

  const updateDate = (value: Date) => {
    setDateField((prevField) => {
      const newField = prevField;
      newField.value = value;
      return newField;
    });
  };

  const isSameDate = (date: Date, otherDate: Date) => {
    return (
      date.getFullYear() === otherDate.getFullYear() &&
      date.getMonth() === otherDate.getMonth() &&
      date.getDate() === otherDate.getDate()
    );
  };

  const sections = [
    {
      title: "Daytime",
      data: usages.filter(
        (usage) =>
          isSameDate(new Date(Number(usage.useDate)), dateField.value) &&
          usage.useTime === "daytime"
      ),
    },
    {
      title: "Nighttime",
      data: usages.filter(
        (usage) =>
          isSameDate(new Date(Number(usage.useDate)), dateField.value) &&
          usage.useTime === "nighttime"
      ),
    },
  ];

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.heading}>Tracker</Text>
        <DatePickerField
          label="Date"
          field={dateField}
          onUpdate={updateDate}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
        <SectionList
          sections={sections}
          renderItem={({ item }) => <Text>{item.productName}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={styles.heading}>{section.title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
