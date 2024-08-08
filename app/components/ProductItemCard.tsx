import { FormattedDate, FormattedMessage, useIntl } from "react-intl";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

import Button, { Variant } from "@/components/Button";
import { DialogRole } from "@/components/Dialog";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import { useLoading } from "@/contexts/LoadingContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import Product from "@/types/product";
import {
  formatDuration,
  getMonthDDYYYYFromSimpleDate,
} from "@/utils/formatDate";
import formatPayload from "@/utils/formatPayload";
import formatResponse from "@/utils/formatResponse";
import getDefaultMessage from "@/utils/getDefaultMessage";
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
  const intl = useIntl();
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
    cardContainer: {
      backgroundColor: "#fff",
      padding: theme.spacing.md,
      borderRadius: theme.border.radius.light,
      shadowColor: theme.shadow.shadowColor,
      shadowOffset: theme.shadow.shadowOffset,
      shadowOpacity: theme.shadow.shadowOpacity,
    },
    flexGrow: {
      flexGrow: 1,
    },
    mediumMarginTop: {
      marginTop: theme.spacing.md,
    },
    productInfoContainer: {
      flex: 1,
      flexDirection: "column",
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
        message: "error.products.delete_failure",
        role: DialogRole.Danger,
      });
      deactivateLoading();
      return;
    }

    onDelete(product);
    addDialogItem({
      message: "dialog.products.delete_success",
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
        message: "error.products.update_failure",
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
      message: "dialog.products.update_success",
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
        message: "error.products.update_failure",
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
      message: "dialog.products.update_success",
      role: DialogRole.Success,
    });
    deactivateLoading();
  };

  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.productInfoContainer}>
        <Text style={styles.text}>
          <FormattedMessage
            id="products.item.name"
            defaultMessage={getDefaultMessage("products.item.name")}
          />
          {product.name}
        </Text>
        {product.openDate && (
          <Text style={styles.text}>
            <FormattedMessage
              id="products.item.open_date"
              defaultMessage={getDefaultMessage("products.item.open_date")}
            />
            <FormattedDate
              value={new Date(Number(product.openDate))}
              year="numeric"
              month="long"
              day="2-digit"
            />
          </Text>
        )}
        {product.finishDate && (
          <Text style={styles.text}>
            <FormattedMessage
              id="products.item.finish_date"
              defaultMessage={getDefaultMessage("products.item.finish_date")}
            />
            <FormattedDate
              value={new Date(Number(product.finishDate))}
              year="numeric"
              month="long"
              day="2-digit"
            />
          </Text>
        )}
        {product.bestBefore && (
          <Text style={styles.text}>
            <FormattedMessage
              id="products.item.best_before"
              defaultMessage={getDefaultMessage("products.item.best_before")}
            />
            {getMonthDDYYYYFromSimpleDate(product.bestBefore, intl)}
          </Text>
        )}
        {product.usedWithin && (
          <Text style={styles.text}>
            <FormattedMessage
              id="products.item.used_within"
              defaultMessage={getDefaultMessage("products.item.used_within")}
              values={{ usedWithin: product.usedWithin }}
              description="Duration"
            />
          </Text>
        )}
        {!product.isActive && product.openDate && product.finishDate && (
          <>
            <Text style={styles.text}>
              <FormattedMessage
                id="products.item.used_duration"
                defaultMessage={getDefaultMessage(
                  "products.item.used_duration"
                )}
              />
              {formatDuration(product.openDate, product.finishDate, intl)}
            </Text>
          </>
        )}
        {!!product.totalUses && (
          <Text style={styles.text}>
            <FormattedMessage
              id="products.item.total_uses"
              defaultMessage={getDefaultMessage("products.item.total_uses")}
            />
            {product.totalUses}
          </Text>
        )}
      </View>
      <View style={[styles.buttonGroup, styles.mediumMarginTop]}>
        {product.isActive && (
          <>
            <Button
              onPress={() => console.log("Use daytime")}
              label="products.item.use_daytime"
              viewStyles={[styles.flexGrow, styles.smallMarginRight]}
            />
            <Button
              onPress={() => console.log("Use nighttime")}
              label="products.item.use_nighttime"
              viewStyles={[styles.flexGrow]}
            />
          </>
        )}
        {!product.isActive && !product.openDate && (
          <Button
            onPress={startProduct}
            label="products.item.start_usage"
            viewStyles={[styles.flexGrow]}
          />
        )}
        <Button
          onPress={deleteProduct}
          label="shared.delete"
          variant={Variant.Secondary}
          viewStyles={[
            styles.smallMarginLeft,
            styles.alignSelfStart,
            styles.flexGrow,
          ]}
        />
        {product.isActive && (
          <Button
            onPress={finishProduct}
            label="shared.finish"
            variant={Variant.Secondary}
            viewStyles={[styles.smallMarginLeft, styles.alignSelfStart]}
          />
        )}
      </View>
    </View>
  );
};

export default ProductItemCard;
