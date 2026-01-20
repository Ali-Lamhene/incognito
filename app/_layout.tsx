import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "../constants/Colors";
import { SessionProvider } from "../context/SessionContext";

export default function RootLayout() {
  const colorScheme = 'dark';
  const isDark = true;

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configuration de la barre de navigation solide
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setPositionAsync('relative');
    }
  }, [colorScheme, isDark]);

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <StatusBar style="light" backgroundColor="#000000" translucent={false} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: Colors[colorScheme].background,
            },
          }}
        />
      </SessionProvider>
    </SafeAreaProvider>
  );
}
