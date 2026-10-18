import { Redirect } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../providers/AuthProvider";

export default function LoginScreen() {
  const { user, loading, initialized, error, signInWithGoogle } = useAuth();

  if (!initialized) {
    return (
      <View style={styles.loadingPage}>
        <ActivityIndicator size="large" color="#A64224" />
      </View>
    );
  }

  if (user) return <Redirect href="/dashboard" />;

  return (
    <View style={styles.page}>
      <View style={styles.content}>
        <View style={styles.brand} accessibilityLabel="HBPlus">
          <Text style={styles.brandH}>H</Text>
          <Text style={styles.brandPlus}>3+</Text>
          <Text style={styles.brandName}>HBPLUS</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrowText}>COMPANY ACCESS</Text>
          </View>
          <Text style={styles.title}>Welcome to HBPlus</Text>
          <Text style={styles.subtitle}>
            Sign in with your official company account.
          </Text>

          <View style={styles.domainNotice}>
            <Text style={styles.domainIcon}>@</Text>
            <Text style={styles.domainText}>Only @hbplus.fit accounts allowed.</Text>
          </View>

          {!!error && (
            <View style={styles.errorBox} accessibilityRole="alert">
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Pressable
            onPress={() => void signInWithGoogle()}
            style={({ pressed }) => [
              styles.button,
              pressed && !loading && styles.buttonPressed,
              loading && styles.buttonDisabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
            accessibilityState={{ disabled: loading, busy: loading }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <View style={styles.googleMark}>
                  <Text style={styles.googleG}>G</Text>
                </View>
                <Text style={styles.buttonText}>Continue with Google</Text>
              </>
            )}
          </Pressable>

          <Text style={styles.footnote}>
            Secure sign-in for authorized HBPlus team members.
          </Text>
        </View>
        <Text style={styles.footer}>© HBPlus · Secure company sign-in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingPage: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#F8F5F0",
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    flex: 1,
    minHeight: "100%",
    backgroundColor: "#F8F5F0",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 36,
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
  eyebrow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#A64224", marginRight: 8 },
  eyebrowText: { color: "#777168", fontSize: 10, fontWeight: "700", letterSpacing: 1.7 },
  title: { fontSize: 29, lineHeight: 36, fontFamily: "Georgia", fontWeight: "700", color: "#292720", textAlign: "center" },
  subtitle: { marginTop: 10, marginBottom: 25, color: "#777168", textAlign: "center", lineHeight: 23, fontSize: 15 },
  domainNotice: { width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: "#F8F5F0", borderRadius: 9, paddingVertical: 12, paddingHorizontal: 10, marginBottom: 20 },
  domainIcon: { color: "#A64224", fontSize: 14, fontWeight: "700", marginRight: 8 },
  domainText: { color: "#5D574F", fontSize: 13, fontWeight: "600", textAlign: "center" },
  errorBox: { width: "100%", borderRadius: 8, borderWidth: 1, borderColor: "#F0C8C4", backgroundColor: "#FFF5F4", padding: 12, marginBottom: 16 },
  errorText: { color: "#A12D26", fontSize: 13, lineHeight: 19, textAlign: "center" },
  button: { width: "100%", minHeight: 54, borderRadius: 9, backgroundColor: "#A64224", alignItems: "center", justifyContent: "center", flexDirection: "row", paddingHorizontal: 16 },
  buttonPressed: { backgroundColor: "#8E361D" },
  buttonDisabled: { opacity: 0.78 },
  googleMark: { width: 24, height: 24, borderRadius: 12, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center", marginRight: 11 },
  googleG: { color: "#4285F4", fontSize: 16, fontWeight: "800" },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  footnote: { marginTop: 19, color: "#8B857C", fontSize: 12, lineHeight: 18, textAlign: "center" },
  footer: { color: "#999187", fontSize: 11, marginTop: 24, textAlign: "center" },
});
