import { StyleSheet, Text, View, ViewStyle } from "react-native";
import Product from "../types/product";
import {
  getMonthDDYYYY,
  getMonthDDYYYYFromSimpleDate,
} from "../utils/formatDate";
import { useGlobalTheme } from "../contexts/ThemeContext";
import Button, { Variant } from "./Button";

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
    alignSelfStart: {
      alignSelf: "flex-start",
    },
    buttonGroup: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: theme.spacing.md,
    },
    button: {
      flexGrow: 1,
    },
    cardContainer: {
      backgroundColor: "#fff",
      padding: theme.spacing.md,
      borderRadius: theme.border.radius.light,
      shadowColor: theme.shadow.shadowColor,
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
    },
    productInfoContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    smallMarginLeft: {
      marginLeft: theme.spacing.sm,
    },
    smallMarginRight: {
      marginRight: theme.spacing.sm,
    },
    text: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
    },
  });

  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.productInfoContainer}>
        <View>
          <Text style={styles.text}>Name: {product.name}</Text>
          <Text style={styles.text}>
            Open Date: {getMonthDDYYYY(product.openDate)}
          </Text>
          {product.finishDate && (
            <Text style={styles.text}>
              Finish Date: {getMonthDDYYYY(product.finishDate)}
            </Text>
          )}
          {product.bestBefore && (
            <Text style={styles.text}>
              Best Before: {getMonthDDYYYYFromSimpleDate(product.bestBefore)}
            </Text>
          )}
          <Text style={styles.text}>Used Within: {product.usedWithin}</Text>
          <Text style={styles.text}>Total Uses: {product.totalUses}</Text>
        </View>
        {product.isActive && (
          <Button
            onPress={() => console.log("Finish today")}
            label="Finish"
            viewStyles={[styles.smallMarginLeft, styles.alignSelfStart]}
            variant={Variant.Secondary}
          />
        )}
      </View>
      {product.isActive && (
        <>
          <View style={styles.buttonGroup}>
            <Button
              onPress={() => console.log("Use daytime")}
              label="Use daytime"
              viewStyles={[styles.button, styles.smallMarginRight]}
            />
            <Button
              onPress={() => console.log("Use nighttime")}
              label="Use nighttime"
              viewStyles={[styles.button]}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default ProductItemCard;
