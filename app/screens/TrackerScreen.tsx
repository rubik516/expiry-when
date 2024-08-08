import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import DatePickerField from "@/components/DatePickerField";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import usages from "@/mock-data/usages";
import { UseTime } from "@/types/usage";
import { Field } from "@/utils/field";
import { getMonthDDYYYY, NOW } from "@/utils/formatDate";
import getDefaultMessage from "@/utils/getDefaultMessage";

export default function TrackerScreen() {
  const intl = useIntl();
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
    new Field<Date | undefined>({
      value: NOW,
      format: (value) =>
        value
          ? getMonthDDYYYY(value.getTime(), intl)
          : getMonthDDYYYY(NOW.getTime(), intl),
    })
  );
  const [showPicker, setShowPicker] = useState(false);

  const updateDate = (value: Date) => {
    setDateField((prevField) => {
      const newField = prevField;
      newField.value = value;
      newField.update();
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
      title: "usages.section.daytime",
      data: usages.filter(
        (usage) =>
          dateField.value &&
          isSameDate(new Date(Number(usage.useDate)), dateField.value) &&
          usage.useTime === UseTime.Daytime
      ),
    },
    {
      title: "usages.section.nighttime",
      data: usages.filter(
        (usage) =>
          dateField.value &&
          isSameDate(new Date(Number(usage.useDate)), dateField.value) &&
          usage.useTime === UseTime.Nighttime
      ),
    },
  ];

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Text style={styles.heading}>
          <FormattedMessage
            id="screens.tracker"
            defaultMessage={getDefaultMessage("screens.tracker")}
          />
        </Text>
        <DatePickerField
          label="usage.new_item.date"
          field={dateField}
          onUpdate={updateDate}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
        <SectionList
          sections={sections}
          renderItem={({ item }) => <Text>{item.productName}</Text>}
          renderSectionHeader={({ section }) => (
            <Text style={styles.heading}>
              <FormattedMessage
                id={section.title}
                defaultMessage={getDefaultMessage(section.title)}
              />
            </Text>
          )}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </SafeAreaView>
  );
}
