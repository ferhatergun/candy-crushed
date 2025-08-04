import { SoundProvider } from "@/utils/SoundContext";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "LilyScriptOne-Regular": require("../assets/fonts/LilyScriptOne-Regular.ttf"),
    "SedgwickAveDisplay-Regular": require("../assets/fonts/SedgwickAveDisplay-Regular.ttf"),
    "TwinkleStar-Regular": require("../assets/fonts/TwinkleStar-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SoundProvider>
        <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
      </SoundProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
