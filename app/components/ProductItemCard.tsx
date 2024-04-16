import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Product from "../types/product";
import {
  getMonthDDYYYY,
  getMonthDDYYYYFromSimpleDate,
} from "../utils/formatDate";
import { useGlobalTheme } from "../contexts/Themes";

interface ProductItemCardProps {
  product: Product;
  style?: ViewStyle;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  style,
}) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    cardContainer: {
      backgroundColor: "#fff",
      padding: theme.spacing.sm,
      borderRadius: theme.border.radius.light,
      shadowColor: "#111",
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
    },
    text: {
      fontSize: theme.typography.regular,
    },
  });

  return (
    <View style={[styles.cardContainer, style]}>
      <Text style={styles.text}>Name: {product.name}</Text>
      <Text style={styles.text}>
        Open Date: {getMonthDDYYYY(product.openDate)}
      </Text>
      <Text style={styles.text}>
        Finish Date: {product.finishDate && getMonthDDYYYY(product.finishDate)}
      </Text>
      <Text style={styles.text}>
        Best Before:{" "}
        {product.bestBefore && getMonthDDYYYYFromSimpleDate(product.bestBefore)}
      </Text>
      <Text style={styles.text}>Used Within: {product.usedWithin}</Text>
      <Text style={styles.text}>Total Uses: {product.totalUses}</Text>
    </View>
  );
};

export default ProductItemCard;
