import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const [message, setMessage] = useState("Completing sign-in...");
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "web") return;

    let active = true;

    async function completeSignIn() {
      try {
        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");

        if (!code) {
          throw new Error("No authorization code was returned.");
        }

        const { data, error } =
          await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          throw new Error(`Session exchange failed: ${error.message}`);
        }

        const email = data.session?.user.email?.trim().toLowerCase();
        const verified = Boolean(data.session?.user.email_confirmed_at);

        if (!email || !email.endsWith("@hbplus.fit")) {
          await supabase.auth.signOut();

          if (active) {
            setFailed(true);
            setMessage(
              "Access restricted. Sign in with your official @hbplus.fit Google account.",
            );
          }
          return;
        }

        if (!verified) {
          await supabase.auth.signOut();

          if (active) {
            setFailed(true);
            setMessage(
              "Google could not verify this email. Select an active, verified @hbplus.fit account.",
            );
          }
          return;
        }

        if (active) {
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("OAuth callback failed:", error);

        if (active) {
          setFailed(true);
          setMessage(
            error instanceof Error
              ? error.message
              : "Sign-in failed. Please try again.",
          );
        }
      }
    }

    void completeSignIn();

    return () => {
      active = false;
    };
  }, []);

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.brand} accessibilityLabel="HBPlus">
          <Text style={styles.brandH}>H</Text>
          <Text style={styles.brandPlus}>3+</Text>
          <Text style={styles.brandName}>HBPLUS</Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.icon, failed ? styles.errorIcon : styles.loadingIcon]}>
            {failed ? (
              <Text style={styles.errorGlyph}>!</Text>
            ) : (
              <ActivityIndicator size="small" color="#A64224" />
            )}
          </View>
          <Text style={styles.eyebrow}>
            {failed ? "SIGN-IN UNAVAILABLE" : "SECURE COMPANY ACCESS"}
          </Text>
          <Text style={styles.title}>
            {failed ? "We couldn’t sign you in" : "Finishing sign-in"}
          </Text>
          <Text style={[styles.message, failed && styles.errorMessage]} accessibilityRole={failed ? "alert" : undefined}>
            {message}
          </Text>

          {failed && (
            <Pressable
              onPress={() => router.replace("/")}
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Return to login"
            >
              <Text style={styles.buttonText}>Return to login</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.footer}>© HBPlus · Secure company sign-in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    minHeight: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingVertical: 36,
    backgroundColor: "#F8F5F0",
  },
  content: { width: "100%", maxWidth: 440, alignItems: "center" },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  brandH: { color: "#A64224", fontFamily: "Georgia", fontSize: 36, fontWeight: "700", letterSpacing: -3 },
  brandPlus: { color: "#A64224", fontFamily: "Georgia", fontSize: 22, fontWeight: "700", alignSelf: "flex-start", marginTop: 1 },
  brandName: { color: "#777168", fontSize: 11, fontWeight: "700", letterSpacing: 3, marginLeft: 12 },
  card: {
    width: "100%",
    paddingHorizontal: 34,
    paddingVertical: 38,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E0D6",
    shadowColor: "#4C3526",
    shadowOpacity: 0.07,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 18 },
  loadingIcon: { backgroundColor: "#F8F5F0" },
  errorIcon: { backgroundColor: "#FFF1EF" },
  errorGlyph: { color: "#A64224", fontSize: 23, fontWeight: "700" },
  eyebrow: { color: "#777168", fontSize: 10, fontWeight: "700", letterSpacing: 1.7, marginBottom: 12 },
  title: { color: "#292720", fontFamily: "Georgia", fontSize: 26, lineHeight: 34, fontWeight: "700", textAlign: "center" },
  message: { color: "#777168", fontSize: 14, lineHeight: 22, textAlign: "center", marginTop: 11 },
  errorMessage: { color: "#5D574F" },
  button: { width: "100%", minHeight: 52, borderRadius: 9, backgroundColor: "#A64224", alignItems: "center", justifyContent: "center", marginTop: 25, paddingHorizontal: 16 },
  buttonPressed: { backgroundColor: "#8E361D" },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  footer: { color: "#999187", fontSize: 11, marginTop: 24, textAlign: "center" },
});
