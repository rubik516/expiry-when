import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet, Button, ScrollView, View } from "react-native";
import { RouteParamList } from "../types/navigation";
import NewEntryForm from "../containers/NewEntryForm";
import RouteName from "../types/navigation";
import { useGlobalTheme } from "../contexts/Themes";

const NewEntryScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.NewEntry>
> = ({ navigation }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: "#aff",
      paddingHorizontal: theme.spacing.sm,
      fontSize: theme.typography.regular,
    },
    formWrapper: {
      marginTop: theme.spacing.lg,
    },
  });

  const submitEntry = () => {
    console.log("Submit entry");
    goBackToHome();
  };

  const goBackToHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.formWrapper}>
        <NewEntryForm />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewEntryScreen;
