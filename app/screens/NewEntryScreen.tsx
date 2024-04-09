import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useState } from "react";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import { StackParamList } from "../types/navigation";
import NewEntryForm from "../containers/NewEntryForm";

const NewEntryScreen: React.FC<
  NativeStackScreenProps<StackParamList, "NewEntry">
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
