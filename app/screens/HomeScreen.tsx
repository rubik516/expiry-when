import {
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
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
  const inactiveProducts = allProducts.filter((product) => !product.isActive);

  const goToNewEntry = () => {
    navigation.navigate(RouteName.NewEntry);
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.heading}>Currently using</Text>
        {activeProducts.map((product) => (
          <ProductItemCard
            key={product.id}
            product={product}
            style={styles.itemCard}
          />
        ))}

        <Text style={styles.heading}>Previously used</Text>
        {inactiveProducts.map((product) => (
          <ProductItemCard
            key={product.id}
            product={product}
            style={styles.itemCard}
          />
        ))}
      </ScrollView>
      <FloatingActionButton onPress={goToNewEntry}>
        <Image source={require("../assets/favicon.png")} />
      </FloatingActionButton>
    </SafeAreaView>
  );
};

export default HomeScreen;
