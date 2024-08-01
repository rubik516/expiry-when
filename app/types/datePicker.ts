import { DatePickerModalSingleProps } from "react-native-paper-dates";

export type SingleChange = DatePickerModalSingleProps["onConfirm"];
export type SingleChangeParams = Parameters<SingleChange>[0];
