import { useFocusEffect } from "@react-navigation/native";

import { useCallback, useState } from "react";
import { FormattedMessage, FormattedTime } from "react-intl";
import {
  Image,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";

import favicon from "@/assets/favicon.png";
import { DialogRole } from "@/components/Dialog";
import FloatingActionButton from "@/components/FloatingActionButton";
import LoadingSpinner from "@/components/LoadingSpinner";
import ProductItemCard from "@/components/ProductItemCard";
import { useAuth } from "@/contexts/AuthContext";
import { useDialogManager } from "@/contexts/DialogManagerContext";
import { useGlobalTheme } from "@/contexts/ThemeContext";
import RouteName, { RouteParamList } from "@/types/navigation";
import Product from "@/types/product";
import { convertToLocalDateTime } from "@/utils/formatDate";
import formatResponse from "@/utils/formatResponse";
import getDefaultMessage from "@/utils/getDefaultMessage";
import request from "@/utils/request";

import type { NativeStackScreenProps } from "@react-navigation/native-stack";

const HomeScreen: React.FC<
  NativeStackScreenProps<RouteParamList, typeof RouteName.Home>
> = ({ navigation }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      position: "relative",
      minHeight: "100%",
      minWidth: "100%",
      backgroundColor: theme.color.primaryContainer,
      paddingHorizontal: theme.spacing.sm,
    },
    emptyMessage: {
      color: theme.color.onPrimary,
      fontSize: theme.typography.regular,
      marginTop: theme.spacing.md,
    },
    footer: {
      color: theme.color.onPrimary,
      paddingVertical: theme.spacing.sm,
      textAlign: "center",
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
    mediumBottomPadding: {
      paddingBottom: theme.spacing.md,
    },
    spinnerContainer: {
      width: 80,
      height: 80,
    },
    spinnerDot: {
      width: theme.spinnerDot.sm,
      height: theme.spinnerDot.sm,
    },
  });

  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addDialogItem } = useDialogManager();

  const activeProducts = products.filter((product) => product.isActive);
  const inactiveProducts = products.filter(
    (product) => !product.isActive && product.finishDate
  );
  const futureProducts = products.filter(
    (product) => !product.isActive && !product.openDate
  );
  const sections = [
    {
      title: "products.section.present",
      data: activeProducts,
    },
    {
      title: "products.section.future",
      data: futureProducts,
    },
    {
      title: "products.section.past",
      data: inactiveProducts,
    },
  ];

  const fetchProducts = async () => {
    const response = await request("get_products_by_user");
    if (!response || !response.ok) {
      addDialogItem({
        message: "error.products.retrieve_failure",
        role: DialogRole.Danger,
      });
      setLoading(false);
      return;
    }

    await response
      .json()
      .then((response) => {
        const products = response.data.map((product: unknown) =>
          formatResponse(product)
        );
        setProducts(products);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const goToNewEntry = () => {
    navigation.navigate(RouteName.NewEntry);
  };

  const onProductDelete = (deletedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== deletedProduct.id)
    );
  };

  const onProductUpdate = (updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      )
    );
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
          contentContainerStyle={styles.mediumBottomPadding}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductItemCard
              key={item.id}
              onDelete={onProductDelete}
              onUpdate={onProductUpdate}
              product={item}
              style={styles.itemCard}
            />
          )}
          renderSectionHeader={({ section }) => (
            <Text style={styles.heading}>
              <FormattedMessage
                id={section.title}
                defaultMessage={getDefaultMessage(section.title)}
              />
            </Text>
          )}
          renderSectionFooter={({ section }) =>
            section.data.length === 0 ? (
              loading ? (
                <LoadingSpinner
                  viewStyles={[styles.spinnerContainer, styles.spinnerDot]}
                />
              ) : (
                <Text style={styles.emptyMessage}>
                  <FormattedMessage
                    id="products.section.empty_list"
                    defaultMessage={getDefaultMessage(
                      "products.section.empty_list"
                    )}
                  />
                </Text>
              )
            ) : null
          }
          sections={sections}
          stickySectionHeadersEnabled={false}
        />
        {user && user.lastLoginAt && (
          <Text style={styles.footer}>
            <FormattedMessage
              id="user.last_login_at"
              defaultMessage={getDefaultMessage("user.last_login_at")}
            />
            <FormattedTime
              value={convertToLocalDateTime(new Date(user.lastLoginAt))}
              weekday="long"
              hour12={false}
              hour="numeric"
              minute="numeric"
              second="numeric"
              year="numeric"
              month="long"
              day="2-digit"
              timeZoneName="long"
              timeZone="Canada/Pacific" // TODO: currently default to Canada/Pacific; need to detect correct user's timezone
            />
          </Text>
        )}
        <FloatingActionButton onPress={goToNewEntry}>
          <Image source={favicon} />
        </FloatingActionButton>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
