import {
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  SectionList,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import RouteName, { RouteParamList } from "../types/navigation";
import allProducts from "../mock-data/products";
import ProductItemCard from "../components/ProductItemCard";
import { useGlobalTheme } from "../contexts/ThemeContext";
import FloatingActionButton from "../components/FloatingActionButton";

const HomeScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.Home>
> = ({ navigation }) => {
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
    itemCard: {
      marginTop: theme.spacing.md,
    },
  });

  const activeProducts = allProducts.filter((product) => product.isActive);
  const inactiveProducts = allProducts.filter(
    (product) => !product.isActive && product.finishDate
  );
  const futureProducts = allProducts.filter(
    (product) => !product.isActive && !product.openDate
  );
  const sections = [
    {
      title: "Currently using",
      data: activeProducts,
    },
    {
      title: "Saved for future",
      data: futureProducts,
    },
    {
      title: "Previously used",
      data: inactiveProducts,
    },
  ];

  const goToNewEntry = () => {
    navigation.navigate(RouteName.NewEntry);
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <SectionList
          sections={sections}
          renderItem={({ item }) => (
            <ProductItemCard
              key={item.id}
              product={item}
              style={styles.itemCard}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.heading}>{section.title}</Text>
          )}
          stickySectionHeadersEnabled={false}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <FloatingActionButton onPress={goToNewEntry}>
        <Image source={require("../assets/favicon.png")} />
      </FloatingActionButton>
    </SafeAreaView>
  );
};

export default HomeScreen;
