import { useEffect, useState } from "react";
import { StyleSheet, Button, Text, View, ViewStyle } from "react-native";

import CheckboxInput from "@/components/CheckboxInput";
import DatePickerField from "@/components/DatePickerField";
import { DialogRole } from "@/components/Dialog";
import ErrorText from "@/components/ErrorText";
import InputField from "@/components/InputField";
import SelectChip from "@/components/SelectChip";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import Product from "@/types/product";
import { Field } from "@/utils/field";
import { NOW } from "@/utils/formatDate";
import formatPayload from "@/utils/formatPayload";
import request from "@/utils/request";
import { isFuture, isPastOf } from "@/utils/validateDate";

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
      columnGap: theme.spacing.sm / 2,
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      rowGap: theme.spacing.sm,
    },
    label: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      marginBottom: theme.spacing.sm,
      paddingLeft: theme.spacing.sm,
    },
  });

  const { addDialogItem } = useDialogManager();
  const [savedForFuture, setSavedForFuture] = useState<boolean>(false);
  const [showStartDate, setShowStartDate] = useState<boolean>(false);
  const [bestBeforeIncluded, setBestBeforeIncluded] = useState<boolean>(false);
  const [showBestBefore, setShowBestBefore] = useState<boolean>(false);
  const [isSimpleBestBefore, setIsSimpleBestBefore] = useState<boolean>(false);
  const [customDuration, setCustomDuration] = useState<boolean>(false);
  const goodForOptions = [6, 9, 12, 18, 24];
  const [hasBeenValidated, setHasBeenValidated] = useState<boolean>(false);
  const [fields, setFields] = useState({
    entryTitle: new Field("", (value) => !!value),
    startDate: new Field<Date | undefined>(NOW, (value) => !!value),
    duration: new Field("", (value) => !!value),
    bestBefore: new Field<Date | undefined>(undefined, (value) => !!value),
  });
  const [formErrors, setFormErrors] = useState({
    entryTitle: "",
    startDate: "",
    duration: "",
    bestBefore: "",
  });

  const constructProductPayload = () => {
    const product = {
      name: fields.entryTitle.value,
      usedWithin: fields.duration.value,
      isActive: !savedForFuture,
    } as unknown as Product;

    if (!savedForFuture && fields.startDate.value && fields.startDate.isValid) {
      product["openDate"] = fields.startDate.value.getTime().toString();
      product["totalDaytimeUses"] = 0;
      product["totalNighttimeUses"] = 0;
      product["totalUses"] = 0;
    }

    if (
      bestBeforeIncluded &&
      fields.bestBefore.value &&
      fields.bestBefore.isValid
    ) {
      product["bestBefore"] = {
        month: fields.bestBefore.value.getMonth(),
        year: fields.bestBefore.value.getFullYear(),
      };
      if (!isSimpleBestBefore) {
        product["bestBefore"]["day"] = fields.bestBefore.value.getDate();
      }
    }

    return formatPayload(product);
  };

  const createProduct = async () => {
    const productPayload = constructProductPayload();
    const response = await request("create_product", {
      method: "POST",
      body: JSON.stringify(productPayload),
    });
    if (response && !response.ok) {
      addDialogItem({
        message: "Creating new product failed!",
        role: DialogRole.Danger,
      });
      return false;
    }
    return true;
  };

  const submitEntry = async () => {
    setHasBeenValidated(true);
    const canSubmit = validateInputs();
    if (canSubmit) {
      const isSuccessful = await createProduct();
      if (isSuccessful) {
        addDialogItem({
          message: "Success: New product has been created!",
          role: DialogRole.Success,
        });
        onSubmissionCompletion?.();
        return;
      }
      addDialogItem({
        message:
          "Error occurred while attempting to save your product. Please try again!",
        role: DialogRole.Danger,
      });
      return;
    }

    addDialogItem({
      message: "Please fix all the errors before continuing.",
      role: DialogRole.Danger,
    });
  };

  const updateField = <K extends keyof typeof fields>(
    fieldKey: K,
    value: (typeof fields)[K]["value"]
  ) => {
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };
      updatedFields[fieldKey].value = value;
      updatedFields[fieldKey].update();
      return updatedFields;
    });
  };

  const validateBestBefore: (bestBefore: Date | undefined) => boolean = (
    bestBefore: Date | undefined
  ) => {
    if (bestBeforeIncluded) {
      const isPastOfStart: boolean =
        !!fields.startDate.value &&
        !!bestBefore &&
        isPastOf(fields.startDate.value, bestBefore);
      const isPastOfNow: boolean = !!bestBefore && isPastOf(NOW, bestBefore);
      const isValid: boolean = !isPastOfNow && !isPastOfStart;
      return isValid;
    }
    return true;
  };

  const validateInputs = () => {
    let canSubmit = Object.values(fields).every((field) => field.isValid);
    return canSubmit;
  };

  const validateStartDate: (startDate: Date | undefined) => boolean = (
    startDate: Date | undefined
  ) => {
    if (!savedForFuture) {
      return !!startDate && !isFuture(startDate);
    }
    return true;
  };

  useEffect(() => {
    setFields((prevFields) => ({
      ...prevFields,
      startDate: new Field<Date | undefined>(
        prevFields.startDate.value,
        (value) => validateStartDate(value)
      ),
    }));
    if (!savedForFuture) {
      updateField("startDate", NOW);
      return;
    }
    updateField("startDate", undefined);
  }, [savedForFuture]);

  useEffect(() => {
    setFields((prevFields) => ({
      ...prevFields,
      bestBefore: new Field<Date | undefined>(
        prevFields.bestBefore.value,
        (value) => validateBestBefore(value)
      ),
    }));
    if (bestBeforeIncluded) {
      const defaultBestBefore =
        fields.startDate.value && isFuture(fields.startDate.value)
          ? new Date(fields.startDate.value?.getTime() + 24 * 60 * 60 * 1000)
          : NOW;
      updateField("bestBefore", defaultBestBefore);
      return;
    }
    updateField("bestBefore", undefined);
  }, [bestBeforeIncluded]);

  useEffect(() => {
    if (!fields.entryTitle.value) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["entryTitle"] = "Please enter a product name.";
        return updatedErrors;
      });
    }
  }, [fields.entryTitle.value]);

  useEffect(() => {
    if (!fields.duration.value) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["duration"] = "Please enter a duration value.";
        return updatedErrors;
      });
    }
  }, [fields.duration.value]);

  useEffect(() => {
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };
      updatedFields["startDate"].update();
      updatedFields["bestBefore"].update();
      return updatedFields;
    });

    if (
      !savedForFuture &&
      fields.startDate.value &&
      isFuture(fields.startDate.value)
    ) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["startDate"] =
          "Open date is in the future. Consider creating and saving the product for future uses.";
        return updatedErrors;
      });
    }

    if (bestBeforeIncluded) {
      const isBestBeforePastOfStart =
        !!fields.startDate.value &&
        !!fields.bestBefore.value &&
        isPastOf(fields.startDate.value, fields.bestBefore.value);
      if (isBestBeforePastOfStart) {
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          updatedErrors["bestBefore"] =
            "Best before date cannot be before the open date.";
          return updatedErrors;
        });
        return;
      }

      const isBestBeforePastOfNow =
        !!fields.bestBefore.value && isPastOf(NOW, fields.bestBefore.value);
      if (isBestBeforePastOfNow) {
        setFormErrors((prevErrors) => {
          const updatedErrors = { ...prevErrors };
          updatedErrors["bestBefore"] =
            "Best before date cannot be in the past";
          return updatedErrors;
        });
      }
    }
  }, [fields.bestBefore.value, fields.startDate.value]);

  return (
    <>
      <InputField
        displayValue={fields.entryTitle.value}
        error={formErrors.entryTitle}
        label="Product"
        onUpdate={(value) => updateField("entryTitle", value)}
        placeholder="Enter product"
        field={fields.entryTitle}
        showError={hasBeenValidated && !fields.entryTitle.isValid}
        style={styles.field}
      />
      {!savedForFuture && (
        <DatePickerField
          error={formErrors.startDate}
          label="Start Date"
          field={fields.startDate}
          onUpdate={(value) => updateField("startDate", value)}
          placeholder="Choose a date"
          showPicker={showStartDate}
          setShowPicker={setShowStartDate}
          showError={hasBeenValidated && !fields.startDate.isValid}
          style={styles.field}
        />
      )}
      <CheckboxInput
        checked={savedForFuture}
        label="Save for future use"
        onPress={() => {
          setSavedForFuture(!savedForFuture);
        }}
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
                  updateField("duration", option.toString());
                }}
                selected={fields.duration.value === option.toString()}
              />
            ))}
            <SelectChip
              label="Custom"
              onPress={() => {
                setCustomDuration(true);
                updateField("duration", "");
              }}
              selected={customDuration}
            />
          </View>
        </View>
        {!customDuration && hasBeenValidated && !fields.duration.isValid && (
          <ErrorText text={formErrors.duration} />
        )}
        {!!customDuration && (
          <InputField
            displayValue={fields.duration.value}
            error={formErrors.duration}
            field={fields.duration}
            keyboardType="numeric"
            label="Good For (months)"
            onUpdate={(value) => updateField("duration", value)}
            placeholder="6"
            showError={
              hasBeenValidated && customDuration && !fields.duration.isValid
            }
            style={styles.field}
          />
        )}
      </View>
      <CheckboxInput
        checked={bestBeforeIncluded}
        label="Include best before date"
        onPress={() => {
          setBestBeforeIncluded(!bestBeforeIncluded);
        }}
      />
      {bestBeforeIncluded && (
        <>
          <DatePickerField
            error={formErrors.bestBefore}
            label="Best Before"
            isSimpleDate={isSimpleBestBefore}
            field={fields.bestBefore}
            onUpdate={(value) => updateField("bestBefore", value)}
            setShowPicker={setShowBestBefore}
            showError={hasBeenValidated && !fields.bestBefore.isValid}
            showPicker={showBestBefore}
            style={styles.field}
          />
          <CheckboxInput
            checked={isSimpleBestBefore}
            label="Only include month and year"
            onPress={() => {
              setIsSimpleBestBefore(!isSimpleBestBefore);
            }}
          />
        </>
      )}
      <Button onPress={submitEntry} title="Add new entry" />
    </>
  );
};

export default NewEntryForm;
