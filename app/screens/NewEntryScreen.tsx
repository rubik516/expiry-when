import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import { RouteParamList } from "../types/navigation";
import NewEntryForm from "../containers/NewEntryForm";
import RouteName from "../types/navigation";

const NewEntryScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.NewEntry>
> = ({ navigation }) => {
  const submitEntry = () => {
    console.log("Submit entry");
    goBackToHome();
  };

  const goBackToHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <NewEntryForm />
    </SafeAreaView>
  );
};

export default NewEntryScreen;
