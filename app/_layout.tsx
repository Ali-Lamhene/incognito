import * as NavigationBar from "expo-navigation-bar";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from 'expo-font';
import { Montserrat_400Regular, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import * as SplashScreen from 'expo-splash-screen';
import { SessionProvider } from "../context/SessionContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = 'dark';
  const isDark = true;

  const [loaded, error] = useFonts({
    'BebasNeue-Bold': BebasNeue_400Regular,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Regular': Montserrat_400Regular,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      // Configuration de la barre de navigation solide
      NavigationBar.setButtonStyleAsync('light');
      NavigationBar.setBackgroundColorAsync('#000000');
      NavigationBar.setPositionAsync('relative');
    }
  }, [colorScheme, isDark]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <SafeAreaProvider>
        <SessionProvider>
          <StatusBar style="light" backgroundColor="transparent" translucent={true} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#000',
              },
            }}
          />
        </SessionProvider>
      </SafeAreaProvider>
    </View>
  );
}
