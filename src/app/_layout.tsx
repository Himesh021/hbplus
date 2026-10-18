import { Stack } from "expo-router";
import { AuthProvider } from "../providers/AuthProvider";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="auth/callback" />
      </Stack>
    </AuthProvider>
  );
}
