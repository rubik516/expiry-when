import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Product from "../types/product";
import {
  getMonthDDYYYY,
  getMonthDDYYYYFromSimpleDatte,
} from "../utils/formatDate";

interface ProductItemCardProps {
  product: Product;
  style?: ViewStyle;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  product,
  ...props
}) => {
  const { style } = props;

  return (
    <View style={[styles.cardContainer, style]}>
      <Text>Name: {product.name}</Text>
      <Text>Open Date: {getMonthDDYYYY(product.openDate)}</Text>
      <Text>
        Finish Date: {product.finishDate && getMonthDDYYYY(product.finishDate)}
      </Text>
      <Text>
        Best Before:{" "}
        {product.bestBefore &&
          getMonthDDYYYYFromSimpleDatte(product.bestBefore)}
      </Text>
      <Text>Used Within: {product.usedWithin}</Text>
      <Text>Total Uses: {product.totalUses}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#111",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.6,
  },
});

export default ProductItemCard;
