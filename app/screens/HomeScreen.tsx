import { useState } from "react";
import {
  Text,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from "react-native";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import RouteName, { RouteParamList } from "../types/navigation";
import allProducts from "../mock-data/products";
import ProductItemCard from "../components/ProductItemCard";
import Product from "../types/product";
import { useGlobalTheme } from "../contexts/Themes";

const HomeScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.Home>
> = ({ navigation }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: "#0af",
      paddingHorizontal: theme.spacing.sm,
    },
    fab: {
      position: "absolute",
      right: 0,
      bottom: 0,
      margin: 15,
      backgroundColor: "#f00",
      borderRadius: 100,
      height: 65,
      width: 65,
      shadowColor: "#111",
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
    },
    heading: {
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

  const handleFloatingAction = () => {
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
      <Pressable onPress={handleFloatingAction} style={styles.fab}>
        <Image source={require("../assets/favicon.png")} />
      </Pressable>
    </SafeAreaView>
  );
};

export default HomeScreen;
