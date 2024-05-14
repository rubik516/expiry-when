import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useGlobalTheme } from "../contexts/ThemeContext";
import Button from "../components/Button";
import formatPayload from "../utils/formatPayload";

export default function TrackerScreen() {
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
  });

  const fetchProducts = async () => {
    const response = await fetch(
      "https://us-central1-expirywhen.cloudfunctions.net/get_products"
    );
    console.log("product response", response);

    if (response.ok) {
      console.log("getting products");
      const data = await response.json();
      console.log("data", data);
    } else {
      console.log("fail to get products");
    }
  };

  const createProduct = async () => {
    const product = {
      name: "Product 2",
      openDate: "1697435393733",
      finishDate: undefined,
      bestBefore: {
        month: 8,
        year: 2025,
      },
      usedWithin: 9,
      isActive: true,
      totalUses: 52,
      totalDaytimeUses: 52,
      totalNighttimeUses: 0,
    };
    const productPayload = formatPayload(product);

    const response = await fetch(
      "https://us-central1-expirywhen.cloudfunctions.net/create_product",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productPayload),
      }
    );
    console.log("response", response);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Analytics</Text>
      <Button label="Fetch" onPress={fetchProducts} />
      <Button label="Save product" onPress={createProduct} />
    </SafeAreaView>
  );
}
