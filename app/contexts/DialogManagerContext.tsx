import { ReactNode, createContext, useContext, useState } from "react";
import { Dimensions, FlatList, StyleSheet } from "react-native";
import "react-native-get-random-values"; // uuid depends on crypto.getRandomValues: https://github.com/LinusU/react-native-get-random-values#readme
import { v4 as uuidv4 } from "uuid";

import Dialog, { DialogItem } from "@/components/Dialog";
import { useGlobalTheme } from "@/contexts/ThemeContext";

export type DialogItemInfo = Pick<DialogItem, "message" | "role">;

interface DialogManagerProps {
  addDialogItem: (item: DialogItemInfo) => void;
  removeItem: (item: DialogItem) => void;
}

const DialogManagerContext = createContext<DialogManagerProps | undefined>(
  undefined
);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<{ [key: string]: DialogItem }>({});
  const { theme } = useGlobalTheme();
  const styles = StyleSheet.create({
    container: {
      bottom: 80,
      left: 0,
      marginHorizontal: theme.spacing.sm,
      maxWidth: Dimensions.get("window").width,
      position: "absolute",
      right: 0,
      zIndex: 10,
    },
  });

  const addDialogItem = (item: DialogItemInfo) => {
    const newItem: DialogItem = { ...item, show: true, id: uuidv4() };
    setItems((prevItems) => ({
      ...prevItems,
      [newItem.id]: newItem,
    }));
  };

  const removeItem = (dialogItem: DialogItem) => {
    const updatedItems = items;
    delete updatedItems[dialogItem.id];
    setItems(updatedItems);
  };

  return (
    <DialogManagerContext.Provider value={{ addDialogItem, removeItem }}>
      <FlatList
        style={styles.container}
        data={Object.values(items)}
        renderItem={({ item }) => (
          <Dialog item={item} removeItem={removeItem} />
        )}
        keyExtractor={(item) => item.id}
      />
      {children}
    </DialogManagerContext.Provider>
  );
};

export const useDialogManager = (): DialogManagerProps => {
  const context = useContext(DialogManagerContext);
  if (!context) {
    throw new Error(
      "useDialogManager must be used within an DialogManagerProvider"
    );
  }
  return context;
};
