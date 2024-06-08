import { ReactNode, createContext, useContext, useState } from "react";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { FlatList, StyleSheet } from "react-native";
import Dialog, { DialogItem } from "../components/Dialog";
import { useGlobalTheme } from "./ThemeContext";

interface DialogManagerProps {
  addDialogItem: (item: Pick<DialogItem, "message" | "role">) => void;
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
      position: "absolute",
      maxWidth: "100%",
      zIndex: 10,
      bottom: 80,
      left: 0,
      right: 0,
      marginHorizontal: theme.spacing.sm,
    },
  });

  const addDialogItem = (item: Pick<DialogItem, "message" | "role">) => {
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
