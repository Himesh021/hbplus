import { Redirect } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../providers/AuthProvider";

export default function DashboardScreen() {
  const { user, loading, signOut, error } = useAuth();
  const metadata = user?.user_metadata ?? {};
  const name =
    (typeof metadata.full_name === "string" && metadata.full_name) ||
    (typeof metadata.name === "string" && metadata.name) ||
    user?.email?.split("@")[0] ||
    "HBPlus member";
  const avatar =
    (typeof metadata.avatar_url === "string" && metadata.avatar_url) ||
    (typeof metadata.picture === "string" && metadata.picture) ||
    null;
  const initials = useMemo(
    () => name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase(),
    [name],
  );

  if (loading) {
    return (
      <View style={styles.loadingPage}>
        <ActivityIndicator size="large" color="#A64224" />
      </View>
    );
  }

  if (!user) return <Redirect href="/" />;

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
            <Text style={styles.eyebrowText}>MEMBER ACCOUNT</Text>
          </View>
          <Text style={styles.title}>Welcome to HBPlus</Text>
          <Text style={styles.subtitle}>You’re signed in successfully with your official company account.</Text>

          <View style={styles.profile}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} accessibilityLabel={`${name} profile photo`} />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.initials}>{initials}</Text>
              </View>
            )}
            <View style={styles.profileDetails}>
              <Text style={styles.profileLabel}>SIGNED IN AS</Text>
              <Text style={styles.name} numberOfLines={1}>{name}</Text>
              <Text style={styles.email} numberOfLines={2}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.status} accessibilityLabel="Authorized account">
            <Text style={styles.statusCheck}>✓</Text>
            <Text style={styles.statusText}>Authorized account</Text>
          </View>

          {!!error && <Text style={styles.errorText} accessibilityRole="alert">{error}</Text>}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log out of HBPlus"
            accessibilityState={{ disabled: loading, busy: loading }}
            disabled={loading}
            onPress={() => void signOut()}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, loading && styles.buttonDisabled]}
          >
            <Text style={styles.buttonText}>Log out</Text>
          </Pressable>
        </View>
        <Text style={styles.footer}>© HBPlus · Secure company sign-in</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingPage: { flex: 1, minHeight: "100%", backgroundColor: "#F8F5F0", alignItems: "center", justifyContent: "center" },
  page: { flex: 1, minHeight: "100%", backgroundColor: "#F8F5F0", alignItems: "center", justifyContent: "center", paddingHorizontal: 22, paddingVertical: 36 },
  content: { width: "100%", maxWidth: 480, alignItems: "center" },
  brand: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  brandH: { color: "#A64224", fontFamily: "Georgia", fontSize: 36, fontWeight: "700", letterSpacing: -3 },
  brandPlus: { color: "#A64224", fontFamily: "Georgia", fontSize: 22, fontWeight: "700", alignSelf: "flex-start", marginTop: 1 },
  brandName: { color: "#777168", fontSize: 11, fontWeight: "700", letterSpacing: 3, marginLeft: 12 },
  card: { width: "100%", paddingHorizontal: 34, paddingVertical: 38, borderRadius: 18, backgroundColor: "#FFFFFF", alignItems: "center", borderWidth: 1, borderColor: "#E8E0D6", shadowColor: "#4C3526", shadowOpacity: 0.07, shadowRadius: 24, shadowOffset: { width: 0, height: 10 }, elevation: 3 },
  eyebrow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  eyebrowDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#A64224", marginRight: 8 },
  eyebrowText: { color: "#777168", fontSize: 10, fontWeight: "700", letterSpacing: 1.7 },
  title: { fontSize: 29, lineHeight: 36, fontFamily: "Georgia", fontWeight: "700", color: "#292720", textAlign: "center" },
  subtitle: { marginTop: 10, marginBottom: 27, color: "#777168", textAlign: "center", lineHeight: 23, fontSize: 15 },
  profile: { width: "100%", flexDirection: "row", alignItems: "center", padding: 18, borderRadius: 12, backgroundColor: "#F8F5F0", borderWidth: 1, borderColor: "#E8E0D6" },
  avatar: { width: 58, height: 58, borderRadius: 29, marginRight: 16 },
  avatarFallback: { backgroundColor: "#E9D9CA", alignItems: "center", justifyContent: "center" },
  initials: { color: "#8E361D", fontSize: 18, fontWeight: "700" },
  profileDetails: { flex: 1, minWidth: 0 },
  profileLabel: { color: "#8B857C", fontSize: 10, letterSpacing: 1.3, fontWeight: "700", marginBottom: 5 },
  name: { color: "#292720", fontSize: 16, fontWeight: "700", marginBottom: 3 },
  email: { color: "#777168", fontSize: 13, lineHeight: 18 },
  status: { alignSelf: "flex-start", marginTop: 19, paddingHorizontal: 12, paddingVertical: 9, borderRadius: 20, backgroundColor: "#EEF5ED", flexDirection: "row", alignItems: "center" },
  statusCheck: { color: "#3D7144", fontWeight: "800", marginRight: 7, fontSize: 13 },
  statusText: { color: "#3D7144", fontSize: 12, fontWeight: "700" },
  errorText: { width: "100%", marginTop: 14, color: "#A12D26", fontSize: 13, textAlign: "center" },
  button: { width: "100%", minHeight: 52, borderRadius: 9, backgroundColor: "#A64224", alignItems: "center", justifyContent: "center", marginTop: 25 },
  buttonPressed: { backgroundColor: "#8E361D" },
  buttonDisabled: { opacity: 0.75 },
  buttonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
  footer: { color: "#999187", fontSize: 11, marginTop: 24, textAlign: "center" },
});
