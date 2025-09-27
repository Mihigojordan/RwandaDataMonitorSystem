import { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter(); // Proper hook usage
  const { t } = useTranslation();

  // Use useRef for Animated.Values to persist across re-renders
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    // Logo animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Title animation
    setTimeout(() => {
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, 600);

    // Subtitle animation
    setTimeout(() => {
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    }, 1000);

    // Navigate to home screen after 4 seconds
    const timer = setTimeout(() => {
      router.replace("tabs/Home"); // Works correctly now
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <ImageBackground
      source={require("../Assets/Images/plaza.avif")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View
          style={{ opacity: logoOpacity, transform: [{ scale: logoScale }], zIndex: 10 }}
        >
          <Image
            source={require("../Assets/Images/Logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Animated.View style={[styles.titleContainer, { opacity: titleOpacity }]}>
          <Text style={styles.mainTitle}>{t("RWANDA")}</Text>
          <Text style={styles.subtitle}>{t("DATA MONITOR")}</Text>
        </Animated.View>

        {/* Description */}
        <Animated.View style={[styles.descriptionContainer, { opacity: subtitleOpacity }]}>
          <Text style={styles.description}>
            {t("Get quick access to statistics on")}{'\n'}
            {t("Rwanda and its status on the SDGs")}
          </Text>
        </Animated.View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: subtitleOpacity }]}>
          <Text style={styles.poweredBy}>{t("Powered by")}</Text>
          <Text style={styles.institute}>
            {t("NATIONAL INSTITUTE OF")}{'\n'}
            {t("STATISTICS OF RWANDA")}
          </Text>
        </Animated.View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#005CAB",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 103, 214, 0.9)",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  logo: {
    width: 200,
    height: 160,
    marginBottom: 10,
    marginTop: -100,
    borderRadius: 10,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 50,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 40,
    fontWeight: "500",
    color: "#FFFFFF",
    letterSpacing: 4,
    textAlign: "center",
    marginTop: 5,
  },
  descriptionContainer: {
    marginBottom: 60,
  },
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  footer: {
    position: "absolute",
    bottom: 60,
    alignItems: "center",
  },
  poweredBy: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 5,
  },
  institute: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
  },
});
