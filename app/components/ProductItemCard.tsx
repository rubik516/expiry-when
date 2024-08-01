import { StyleSheet, Text, View, ViewStyle } from "react-native";

import Button, { Variant } from "@/components/Button";
import { DialogRole } from "@/components/Dialog";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import { useLoading } from "@/contexts/LoadingContext";
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
  onDelete: (product: Product) => void;
  onUpdate: (product: Product) => void;
  product: Product;
  style?: ViewStyle;
}

const ProductItemCard: React.FC<ProductItemCardProps> = ({
  onDelete,
  onUpdate,
  product,
  style,
}) => {
  const { activateLoading, deactivateLoading } = useLoading();
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

  const deleteProduct = async () => {
    const productPayload = formatPayload({
      productId: product.id,
    });
    activateLoading();
    const response = await request("delete_product", {
      method: "DELETE",
      body: JSON.stringify(productPayload),
    });
    if (response && !response.ok) {
      addDialogItem({
        message: "Deleting product failed!",
        role: DialogRole.Danger,
      });
      deactivateLoading();
      return;
    }

    onDelete(product);
    addDialogItem({
      message: "Successfully deleted product.",
      role: DialogRole.Success,
    });
    deactivateLoading();
  };

  const finishProduct = async () => {
    const productPayload = formatPayload({
      productId: product.id,
    });
    activateLoading();
    const response = await request("finish_product_today", {
      method: "PATCH",
      body: JSON.stringify(productPayload),
    });
    if (!response || !response.ok) {
      addDialogItem({
        message: "Updating product failed!",
        role: DialogRole.Danger,
      });
      deactivateLoading();
      return;
    }

    const updatedProduct = formatResponse(
      (await response.json()).data
    ) as Product;
    onUpdate(updatedProduct);
    addDialogItem({
      message: "Successfully updated product.",
      role: DialogRole.Success,
    });
    deactivateLoading();
  };

  const startProduct = async () => {
    const productPayload = formatPayload({
      productId: product.id,
    });
    activateLoading();
    const response = await request("start_product_today", {
      method: "PATCH",
      body: JSON.stringify(productPayload),
    });
    if (!response || !response.ok) {
      addDialogItem({
        message: "Updating product failed!",
        role: DialogRole.Danger,
      });
      deactivateLoading();
      return;
    }

    const updatedProduct = formatResponse(
      (await response.json()).data
    ) as Product;
    onUpdate(updatedProduct);
    addDialogItem({
      message: "Successfully updated product.",
      role: DialogRole.Success,
    });
    deactivateLoading();
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
        {!product.isActive && product.finishDate && (
          <Button
            onPress={deleteProduct}
            label="Delete"
            variant={Variant.Secondary}
            viewStyles={[styles.alignSelfStart]}
          />
        )}
      </View>
      <View style={[styles.buttonGroup, styles.mediumMarginTop]}>
        {product.isActive && (
          <>
            <View style={styles.buttonGroup}>
              <Button
                onPress={() => console.log("Use daytime")}
                label="Day"
                viewStyles={[styles.button, styles.smallMarginRight]}
              />
              <Button
                onPress={() => console.log("Use nighttime")}
                label="Night"
                viewStyles={[styles.button]}
              />
            </View>
          </>
        )}
        {!product.isActive && !product.openDate && (
          <Button
            onPress={startProduct}
            label="Start usage"
            viewStyles={[styles.button]}
          />
        )}
        {(product.isActive || (!product.isActive && !product.openDate)) && (
          <Button
            onPress={deleteProduct}
            label="Delete"
            variant={Variant.Secondary}
            viewStyles={[styles.smallMarginLeft, styles.alignSelfStart]}
          />
        )}
        {product.isActive && (
          <Button
            onPress={finishProduct}
            label="Finish"
            variant={Variant.Secondary}
            viewStyles={[styles.smallMarginLeft, styles.alignSelfStart]}
          />
        )}
      </View>
    </View>
  );
};

export default ProductItemCard;
