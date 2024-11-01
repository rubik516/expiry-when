import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import Button, { Variant } from "@/components/Button";
import CheckboxInput from "@/components/CheckboxInput";
import DatePickerField from "@/components/DatePickerField";
import { DialogRole } from "@/components/Dialog";
import ErrorText from "@/components/ErrorText";
import InputField from "@/components/InputField";
import SelectChip from "@/components/SelectChip";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import Product from "@/types/product";
import { getLastDayOfMonth } from "@/utils/date";
import { Field } from "@/utils/field";
import { getMonthDDYYYY, getMonthYYYY, NOW } from "@/utils/formatDate";
import formatPayload from "@/utils/formatPayload";
import getDefaultMessage from "@/utils/getDefaultMessage";
import request from "@/utils/request";
import { isFuture, isPastOf } from "@/utils/validateDate";

interface NewEntryFormProps {
  onSubmissionCompletion?: () => void;
  style?: ViewStyle;
}

const NewEntryForm: React.FC<NewEntryFormProps> = ({
  onSubmissionCompletion,
}) => {
  const intl = useIntl();
  const { activateLoading, deactivateLoading } = useLoading();
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
  const [isSubmissionTriggered, setIsSubmissionTriggered] =
    useState<boolean>(false);
  const [fields, setFields] = useState({
    entryTitle: new Field({
      value: "",
    }),
    startDate: new Field<Date | undefined>({
      value: NOW,
      format: (value) =>
        value
          ? getMonthDDYYYY(value.getTime(), intl)
          : getMonthDDYYYY(NOW.getTime(), intl),
    }),
    duration: new Field({
      value: "",
    }),
    bestBefore: new Field<Date | undefined>({
      value: undefined,
    }),
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
    activateLoading();
    const response = await request("create_product", {
      method: "POST",
      body: JSON.stringify(productPayload),
    });

    if (response && !response.ok) {
      return false;
    }
    return true;
  };

  const handleBestBeforeField = (value: Date) => {
    updateField("bestBefore", value);
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };
      updatedFields["startDate"].update(); // validate start date field as its validity depends on best before
      return updatedFields;
    });

    if (isSubmissionTriggered) {
      validateBestBeforeField();
      validateStartDateField();
    }
  };

  const handleDurationField = (value: string) => {
    updateField("duration", value);
    if (isSubmissionTriggered) {
      validateDurationField();
    }
  };

  const handleProductNameField = (value: string) => {
    updateField("entryTitle", value);
    if (isSubmissionTriggered) {
      validateProductNameField();
    }
  };

  const handleStartDateField = (value: Date) => {
    updateField("startDate", value);
    setFields((prevFields) => {
      const updatedFields = { ...prevFields };
      updatedFields["bestBefore"].update(); // validate best before field as its validity depends on start date
      return updatedFields;
    });

    if (isSubmissionTriggered) {
      validateStartDateField();
      validateBestBeforeField();
    }
  };

  const onEndEditingCustomDurationInput = () => {
    if (goodForOptions.includes(Number(fields.duration.value))) {
      setCustomDuration(false);
    }
  };

  const submit = async () => {
    setIsSubmissionTriggered(true);
    const canSubmit = validateInputs();
    if (canSubmit) {
      const isSuccessful = await createProduct();
      if (isSuccessful) {
        addDialogItem({
          message: "dialog.products.create_success",
          role: DialogRole.Success,
        });
        deactivateLoading();
        onSubmissionCompletion?.();
        return;
      }
      addDialogItem({
        message: "error.products.create_failure",
        role: DialogRole.Danger,
      });
      deactivateLoading();
      return;
    }

    addDialogItem({
      message: "error.products.fix_all_prompt",
      role: DialogRole.Danger,
    });
  };

  const toggleBestBeforeIncluded = () => {
    setBestBeforeIncluded(!bestBeforeIncluded);
  };

  const toggleIsSimpleBestBefore = () => {
    setIsSimpleBestBefore(!isSimpleBestBefore);
  };

  const toggleSavedForFuture = () => {
    setSavedForFuture(!savedForFuture);
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
      const isPastOfStart =
        !!fields.startDate.value &&
        !!bestBefore &&
        isPastOf(fields.startDate.value, bestBefore);
      const isPastOfNow = !!bestBefore && isPastOf(NOW, bestBefore);
      const isValid = !isPastOfNow && !isPastOfStart;
      return isValid;
    }
    return true;
  };

  const validateBestBeforeField = () => {
    if (bestBeforeIncluded && !fields.bestBefore.value) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["bestBefore"] = "error.new_product.best_before.absent";
        return updatedErrors;
      });
      return;
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
            "error.new_product.best_before.precedes_start";
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
            "error.new_product.best_before.invalid_past_best_before";
          return updatedErrors;
        });
      }
    }
  };

  const validateDurationField = () => {
    if (!fields.duration.value) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["duration"] = customDuration
          ? "error.new_product.duration.custom"
          : "error.new_product.duration";
        return updatedErrors;
      });
    }
  };

  const validateInputs = () => {
    validateProductNameField();
    validateDurationField();
    validateStartDateField();
    validateBestBeforeField();
    const canSubmit = Object.values(fields).every((field) => field.isValid);
    return canSubmit;
  };

  const validateProductNameField = () => {
    if (!fields.entryTitle.value) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["entryTitle"] = "error.new_product.name";
        return updatedErrors;
      });
    }
  };

  const validateStartDate: (startDate: Date | undefined) => boolean = (
    startDate: Date | undefined
  ) => {
    if (!savedForFuture) {
      return !!startDate && !isFuture(startDate);
    }
    return true;
  };

  const validateStartDateField = () => {
    if (!savedForFuture && !fields.startDate.value) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["startDate"] = "error.new_product.start_date.absent";
        return updatedErrors;
      });
      return;
    }

    if (
      !savedForFuture &&
      fields.startDate.value &&
      isFuture(fields.startDate.value)
    ) {
      setFormErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        updatedErrors["startDate"] =
          "error.new_product.start_date.invalid_future_start";
        return updatedErrors;
      });
    }
  };

  useEffect(() => {
    validateDurationField();
  }, [customDuration]);

  useEffect(() => {
    setFields((prevFields) => ({
      ...prevFields,
      startDate: new Field<Date | undefined>({
        value: prevFields.startDate.value,
        validate: (value) => validateStartDate(value),
        format: (value) =>
          value
            ? getMonthDDYYYY(value.getTime(), intl)
            : getMonthDDYYYY(NOW.getTime(), intl),
      }),
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
      bestBefore: new Field<Date | undefined>({
        value: prevFields.bestBefore.value,
        validate: (value) => validateBestBefore(value),
        format: (value) =>
          value
            ? getMonthDDYYYY(value.getTime(), intl)
            : getMonthDDYYYY(NOW.getTime(), intl),
      }),
    }));

    if (bestBeforeIncluded) {
      const oneDay = 24 * 60 * 60 * 1000;
      const defaultBestBefore =
        fields.startDate.value && isFuture(fields.startDate.value)
          ? new Date(fields.startDate.value?.getTime() + oneDay)
          : new Date(NOW.getTime() + oneDay);
      updateField("bestBefore", defaultBestBefore);
      return;
    }
    updateField("bestBefore", undefined);
  }, [bestBeforeIncluded]);

  useEffect(() => {
    setFields((prevFields) => ({
      ...prevFields,
      bestBefore: new Field<Date | undefined>({
        value: getLastDayOfMonth(prevFields.bestBefore.value ?? new Date()), // set the default best before date to the last day of the month
        validate: (value) => validateBestBefore(value),
        format: (value) =>
          value
            ? isSimpleBestBefore
              ? getMonthYYYY(value.getTime(), intl)
              : getMonthDDYYYY(value.getTime(), intl)
            : getMonthDDYYYY(NOW.getTime(), intl),
      }),
    }));
  }, [isSimpleBestBefore]);

  return (
    <>
      <InputField
        error={formErrors.entryTitle}
        label="product.new_item.name"
        onUpdate={(value) => handleProductNameField(value)}
        placeholder="product.new_item.name.placeholder"
        field={fields.entryTitle}
        showError={isSubmissionTriggered && !fields.entryTitle.isValid}
        style={styles.field}
      />
      {!savedForFuture && (
        <DatePickerField
          error={formErrors.startDate}
          label="product.new_item.start_date"
          field={fields.startDate}
          onUpdate={(value) => handleStartDateField(value)}
          placeholder="product.new_item.start_date.placeholder"
          showPicker={showStartDate}
          setShowPicker={setShowStartDate}
          showError={isSubmissionTriggered && !fields.startDate.isValid}
          style={styles.field}
        />
      )}
      <CheckboxInput
        checked={savedForFuture}
        label="product.new_item.start_date.save_for_future"
        onPress={toggleSavedForFuture}
      />
      <View style={styles.goodForContainer}>
        <Text style={styles.label}>
          <FormattedMessage
            id="product.new_item.used_within"
            defaultMessage={getDefaultMessage("product.new_item.used_within")}
          />
        </Text>
        <View style={styles.goodForGroup}>
          <View style={[styles.goodForGroupRow]}>
            {goodForOptions.map((option) => (
              <SelectChip
                key={option}
                onPress={() => {
                  setCustomDuration(false);
                  handleDurationField(option.toString());
                }}
                selected={fields.duration.value === option.toString()}
              >
                <FormattedMessage
                  id="product.new_item.used_within.months"
                  defaultMessage={getDefaultMessage(
                    "product.new_item.used_within.months"
                  )}
                  values={{
                    usedWithin: option,
                  }}
                />
              </SelectChip>
            ))}
            <SelectChip
              label="product.new_item.used_within.custom"
              onPress={() => {
                setCustomDuration(true);
                handleDurationField("");
              }}
              selected={customDuration}
            />
          </View>
        </View>
        {!customDuration &&
          isSubmissionTriggered &&
          !fields.duration.isValid && <ErrorText text={formErrors.duration} />}
        {!!customDuration && (
          <InputField
            error={formErrors.duration}
            field={fields.duration}
            keyboardType="numeric"
            label="product.new_item.used_within.custom.input_label"
            onEndEditing={onEndEditingCustomDurationInput}
            onUpdate={(value) => handleDurationField(value)}
            placeholder="product.new_item.used_within.custom.placeholder"
            showError={
              isSubmissionTriggered &&
              customDuration &&
              !fields.duration.isValid
            }
            style={styles.field}
          />
        )}
      </View>
      <CheckboxInput
        checked={bestBeforeIncluded}
        label="product.new_item.best_before.include_prompt"
        onPress={toggleBestBeforeIncluded}
      />
      {bestBeforeIncluded && (
        <>
          <DatePickerField
            error={formErrors.bestBefore}
            label="product.new_item.best_before"
            field={fields.bestBefore}
            onUpdate={(value) => handleBestBeforeField(value)}
            setShowPicker={setShowBestBefore}
            showError={isSubmissionTriggered && !fields.bestBefore.isValid}
            showPicker={showBestBefore}
            style={styles.field}
          />
          <CheckboxInput
            checked={isSimpleBestBefore}
            label="product.new_item.best_before.exclude_date_prompt"
            onPress={toggleIsSimpleBestBefore}
          />
        </>
      )}
      <Button
        onPress={submit}
        label="product.new_item.add_button"
        variant={Variant.Primary}
      />
    </>
  );
};

export default NewEntryForm;
