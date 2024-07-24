import { StyleSheet, Text, View, ViewStyle } from "react-native";

import Button, { Variant } from "@/components/Button";
import { DialogRole } from "@/components/Dialog";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import Product from "@/types/product";
import {
  formatDuration,
  getMonthDDYYYY,
  getMonthDDYYYYFromSimpleDate,
} from "@/utils/formatDate";
import formatPayload from "@/utils/formatPayload";
import formatResponse from "@/utils/formatResponse";
import request from "@/utils/request";

interface ProductItemCardProps {
  onUpdate: (product: Product) => void;
  product: Product;
  style?: ViewStyle;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  onUpdate,
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
    mediumMarginTop: {
      marginTop: theme.spacing.md,
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
  const { addDialogItem } = useDialogManager();

  const finishProduct = async () => {
    const productPayload = formatPayload({
      productId: product.id,
    });
    const response = await request("finish_product_today", {
      method: "PATCH",
      body: JSON.stringify(productPayload),
    });
    if (response && !response.ok) {
      addDialogItem({
        message: "Updating product failed!",
        role: DialogRole.Danger,
      });
      return;
    }

    const updatedProduct = formatResponse(
      (await response?.json()).data
    ) as Product;
    onUpdate(updatedProduct);
    addDialogItem({
      message: "Successfully updated product.",
      role: DialogRole.Success,
    });
  };

  const startProduct = async () => {
    const productPayload = formatPayload({
      productId: product.id,
    });
    const response = await request("start_product_today", {
      method: "PATCH",
      body: JSON.stringify(productPayload),
    });
    if (response && !response.ok) {
      addDialogItem({
        message: "Updating product failed!",
        role: DialogRole.Danger,
      });
      return;
    }

    const updatedProduct = formatResponse(
      (await response?.json()).data
    ) as Product;
    onUpdate(updatedProduct);
    addDialogItem({
      message: "Successfully updated product.",
      role: DialogRole.Success,
    });
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.productInfoContainer}>
        <View>
          <Text style={styles.text}>Name: {product.name}</Text>
          {product.openDate && (
            <Text style={styles.text}>
              Open Date: {getMonthDDYYYY(product.openDate)}
            </Text>
          )}
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
          <Text style={styles.text}>
            Used Within: {product.usedWithin} months
          </Text>
          {!product.isActive && product.openDate && product.finishDate && (
            <Text style={styles.text}>
              Usage duration:{" "}
              {formatDuration(product.openDate, product.finishDate)}
            </Text>
          )}
          {!!product.totalUses && (
            <Text style={styles.text}>Total Uses: {product.totalUses}</Text>
          )}
        </View>
        {product.isActive && (
          <Button
            onPress={finishProduct}
            label="Finish"
            variant={Variant.Secondary}
            viewStyles={[styles.smallMarginLeft, styles.alignSelfStart]}
          />
        )}
      </View>
      {product.isActive && (
        <>
          <View style={[styles.buttonGroup, styles.mediumMarginTop]}>
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
      {!product.isActive && !product.openDate && (
        <Button
          onPress={startProduct}
          label="Start usage"
          viewStyles={[styles.button, styles.mediumMarginTop]}
        />
      )}
    </View>
  );
};

export default ProductItemCard;
