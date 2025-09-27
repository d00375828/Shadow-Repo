import React from "react";
import { Modal, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = React.ComponentProps<typeof Modal> & {
  children: React.ReactNode;
  backgroundColor?: string;
  contentStyle?: ViewStyle | ViewStyle[];
  padTop?: number;
  padBottom?: number;
  padHorizontal?: number;
};

export default function SafeModal({
  children,
  backgroundColor = "#000",
  contentStyle,
  padTop = 12,
  padBottom = 16,
  padHorizontal = 16,
  ...modalProps
}: Props) {
  const insets = useSafeAreaInsets();
  return (
    <Modal {...modalProps}>
      <View
        style={[
          {
            flex: 1,
            backgroundColor,
            paddingTop: insets.top + padTop,
            paddingBottom: insets.bottom + padBottom,
            paddingHorizontal: padHorizontal,
          },
          contentStyle,
        ]}
      >
        {children}
      </View>
    </Modal>
  );
}
