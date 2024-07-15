import { useCallback, useState } from "react";
import {
  Text,
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  SectionList,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { DialogRole } from "../components/Dialog";
import FloatingActionButton from "../components/FloatingActionButton";
import ProductItemCard from "../components/ProductItemCard";
import { useAuth } from "../contexts/AuthContext";
import { useDialogManager } from "../contexts/DialogManagerContext";
import { useGlobalTheme } from "../contexts/ThemeContext";
import RouteName, { RouteParamList } from "../types/navigation";
import Product from "../types/product";
import formatResponse from "../utils/formatResponse";
import request from "../utils/request";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

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

  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const { addDialogItem } = useDialogManager();

  const fetchProducts = async () => {
    if (!user) {
      return;
    }

    const response = await request("get_products_by_user");
    if (!response || !response.ok) {
      addDialogItem({
        message: "Retrieving products failed!",
        role: DialogRole.Danger,
      });
      return;
    }

    const json = await response.json();
    const products = json.data.map((product: unknown) =>
      formatResponse(product)
    );
    setProducts(products);
  };

  const activeProducts = products.filter((product) => product.isActive);
  const inactiveProducts = products.filter(
    (product) => !product.isActive && product.finishDate
  );
  const futureProducts = products.filter(
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

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [user])
  );

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
