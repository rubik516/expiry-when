import { ReactNode, createContext, useContext, useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";

import LoadingSpinner from "@/components/LoadingSpinner";
import { useGlobalTheme } from "@/contexts/ThemeContext";

interface LoadingProps {
  activateLoading: () => void;
  deactivateLoading: () => void;
}

const LoadingContext = createContext<LoadingProps | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    bg: {
      position: "absolute",
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
      backgroundColor: "white",
      opacity: 0.8,
    },
    spinnerContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      width: Dimensions.get("window").width,
      paddingHorizontal: Dimensions.get("window").width / 4,
    },
    spinnerDot: {
      width: theme.spinnerDot.lg,
      height: theme.spinnerDot.lg,
    },
  });

  const activateLoading = () => {
    setLoading(true);
  };

  const deactivateLoading = () => {
    setLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ activateLoading, deactivateLoading }}>
      {children}
      {loading && (
        <>
          <View style={styles.bg} />
          <LoadingSpinner
            viewStyles={[styles.spinnerContainer, styles.spinnerDot]}
          />
        </>
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingProps => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within an LoadingProvider");
  }
  return context;
};
