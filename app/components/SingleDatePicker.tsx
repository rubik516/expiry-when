import { DatePickerModal } from "react-native-paper-dates";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import { useGlobalTheme } from "../contexts/ThemeContext";

interface SingleDatePickerProps {
  date: Date;
  onConfirm: (params: any) => void;
  onDismiss: () => void;
  visible: boolean;
}

const SingleDatePicker: React.FC<SingleDatePickerProps> = ({
  date,
  onConfirm,
  onDismiss,
  visible,
}) => {
  const { theme } = useGlobalTheme();
  const paperTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.color.secondary,
      secondary: "yellow",
      onSurface: theme.color.onPrimary,
      onSurfaceVariant: theme.color.primary,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <DatePickerModal
        date={date}
        locale="en"
        mode="single"
        onDismiss={onDismiss}
        onConfirm={onConfirm}
        visible={visible}
      />
    </PaperProvider>
  );
};

export default SingleDatePicker;
