import { SafeAreaView, StyleSheet, ScrollView, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import NewEntryForm from "@/containers/NewEntryForm";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import { RouteParamList } from "@/types/navigation";

import type RouteName from "@/types/navigation";

const NewEntryScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.NewEntry>
> = ({ navigation }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: theme.color.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
      fontSize: theme.typography.regular,
    },
    formWrapper: {
      marginTop: theme.spacing.lg,
    },
  });

  const goBackToHome = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <View style={styles.formWrapper}>
          <NewEntryForm onSubmissionCompletion={goBackToHome} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewEntryScreen;
