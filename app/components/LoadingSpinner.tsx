import { useEffect } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";

import { useGlobalTheme } from "@/contexts/ThemeContext";

interface LoadingSpinnerProps {
  viewStyles?: ViewStyle[];
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ viewStyles = [] }) => {
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      margin: "auto",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      padding: theme.spacing.md,
      alignItems: "center",
    },
    dot: {
      borderRadius: theme.border.radius.rounded,
      backgroundColor: theme.color.secondary,
    },
  });

  const [spinnerContainer, spinnerDot] = viewStyles;
  const dotDimension = spinnerDot
    ? spinnerDot
    : {
        width: 15,
        height: 15,
      };

  const dotTransform = (position: Animated.Value) => {
    return {
      transform: [
        {
          translateY: position.interpolate({
            inputRange: [0, 0.25, 0.5, 0.75, 1],
            outputRange: [0, 10, 20, 10, 0],
          }),
        },
      ],
    };
  };

  const dotPositions = Array.from({ length: 3 }, () => new Animated.Value(0));
  const runAnimation = () => {
    dotPositions.forEach((dot, index) => {
      Animated.loop(
        Animated.timing(dot, {
          delay: index * 300,
          duration: 1500,
          easing: Easing.linear,
          toValue: 1,
          useNativeDriver: true,
        })
      ).start();
    });
  };

  useEffect(() => runAnimation(), []);

  return (
    <View style={[spinnerContainer, styles.container]}>
      {dotPositions.map((dot, index) => {
        return (
          <Animated.View
            key={index}
            style={[styles.dot, dotDimension, dotTransform(dot)]}
          />
        );
      })}
    </View>
  );
};

export default LoadingSpinner;
