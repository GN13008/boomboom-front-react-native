import {router} from "expo-router";
import React, {useEffect, useRef} from "react";
import {Animated, ImageStyle, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

import girlBackground from "../src/assets/girl.png";
import {BaseButtonIconPosition} from "../src/components/Buttons/BaseButton";
import {LueurButton} from "../src/components/Buttons/LueurButton";
import {Logo} from "../src/components/Logo";
import {LueurBackground} from "../src/components/LueurBackground";
import useEStyles from "../src/hooks/useEStyles";
import {RootStackScreen} from "../src/navigation/RootStackScreenNavigator/RootStack";
import AuthService from "../src/services/AuthService/AuthService";
import ConfigurationService from "../src/services/ConfigurationService/ConfigurationService";
import LanguageService from "../src/services/LanguageService/LanguageService";
import ServiceInterface from "../src/tsyringe/ServiceInterface";
import {getGlobalInstance} from "../src/tsyringe/diUtils";

export default function AuthScreen(): JSX.Element {
  const languageService = getGlobalInstance<LanguageService>(
    ServiceInterface.LanguageServiceI,
  );
  const configurationService = getGlobalInstance<ConfigurationService>(
    ServiceInterface.ConfigurationService,
  );
  const authService = getGlobalInstance<AuthService>(
    ServiceInterface.AuthService,
  );
  const I18n = languageService.useTranslation();
  const styles = useEStyles({
    mainContainer: {
      flex: 1,
      backgroundColor: "$backgroundColor",
    },
    logoContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    girlBackgroundContainer: {
      flex: 4,
      position: "relative",
      alignItems: "center",
    },
    girlBackground: {
      resizeMode: "contain",
      width: "100%",
      height: "100%",
    },
    logoImageText: {
      width: "3rem",
      height: "3rem",
      marginRight: "$spacer4",
    },
    contentContainer: {
      flex: 1,
      paddingHorizontal: "$spacer6",
      justifyContent: "flex-end",
      bottom: "$spacer6",
      gap: "$spacer4",
    },
    text: {
      color: "$secondaryColor",
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",
    },
    button: {},
  });

  const authenticate = async () => {
    if (configurationService.isAppInMockMode()) {
      await authService.authenticateUser();
      router.replace(`/${RootStackScreen.LOGIN_SUCCESSFUL}`);
      return;
    }
    router.push(`/${RootStackScreen.OAUTH_SCREEN}`);
  };

  const fadeInAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  const translateYImage = fadeInAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });

  const translateYText = fadeInAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [100, 0],
  });

  const opacity = fadeInAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.girlBackgroundContainer}>
        <Animated.Image
          source={girlBackground}
          style={
            {
              ...styles.girlBackground,
              opacity,
              transform: [{ translateY: translateYImage }],
            } as ImageStyle
          }
        />
      </View>
      <LueurBackground />
      <Animated.View
        style={{
          ...styles.contentContainer,
          opacity,
          transform: [{ translateY: translateYText }],
        }}
      >
        <Logo />
        <Text style={styles.text}>{I18n.t("screen.SignInScreen.title")}</Text>
        <LueurButton
          onPress={authenticate}
          style={styles.button}
          iconPosition={BaseButtonIconPosition.LEFT}
          icon="spotify"
          content={I18n.t("screen.SignInScreen.spotifySignInButtonLabel")}
        />
      </Animated.View>
    </SafeAreaView>
  );
}
