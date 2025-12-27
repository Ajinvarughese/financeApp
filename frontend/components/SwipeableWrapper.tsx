import { Platform, View } from "react-native";
import { Swipeable, SwipeableProps } from "react-native-gesture-handler";
import React, { ReactNode } from "react";

interface WrapperProps extends SwipeableProps {
    children: ReactNode;
}

export default function SwipeableWrapper({ children, ...props }: WrapperProps) {
    // Disable swipe on Web → prevents warnings
    if (Platform.OS === "web") {
        return <View>{children}</View>;
    }

    return <Swipeable {...props}>{children}</Swipeable>;
}
