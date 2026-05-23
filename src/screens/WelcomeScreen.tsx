import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withSpring,
  Easing,
  interpolate,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AnimatedBackground from '../components/AnimatedBackground';
import GlitchText from '../components/GlitchText';
import { COLORS, GRADIENTS } from '../constants/colors';
import { triggerMediumHaptic } from '../utils/haptics';
import { getHighScore, getGamesPlayed } from '../utils/storage';

type RootStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  Results: { wrongAnswers: number; score: number };
};

type WelcomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Welcome'>;
};

const { width, height } = Dimensions.get('window');

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  const buttonScale = useSharedValue(1);
  const logoY = useSharedValue(-50);
  const logoOpacity = useSharedValue(0);
  const subtitleOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const buttonGlow = useSharedValue(0);
  const easterEggCount = useRef(0);
  const easterEggTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [highScore, setHighScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [easterEggActivated, setEasterEggActivated] = useState(false);

  useEffect(() => {
    // Load stats
    getHighScore().then(setHighScore);
    getGamesPlayed().then(setGamesPlayed);

    // Entrance animations
    setTimeout(() => {
      logoY.value = withSpring(0, { damping: 12, stiffness: 90 });
      logoOpacity.value = withTiming(1, { duration: 600 });
    }, 200);

    setTimeout(() => {
      subtitleOpacity.value = withTiming(1, { duration: 800 });
    }, 900);

    setTimeout(() => {
      buttonOpacity.value = withTiming(1, { duration: 600 });
    }, 1400);

    // Pulsing button glow
    setTimeout(() => {
      buttonGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 900 }),
          withTiming(0.3, { duration: 900 }),
        ),
        -1,
        true,
      );
    }, 1600);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: logoY.value }],
    opacity: logoOpacity.value,
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  const buttonGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: buttonGlow.value,
    shadowRadius: interpolate(buttonGlow.value, [0, 1], [8, 25]),
  }));

  const handleStart = () => {
    triggerMediumHaptic();
    buttonScale.value = withSequence(
      withTiming(0.93, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
    setTimeout(() => {
      navigation.navigate('Quiz');
    }, 200);
  };

  const handleLogoTap = () => {
    easterEggCount.current += 1;

    // Reset timer
    if (easterEggTimer.current) clearTimeout(easterEggTimer.current);
    easterEggTimer.current = setTimeout(() => {
      easterEggCount.current = 0;
    }, 3000);

    if (easterEggCount.current >= 5) {
      easterEggCount.current = 0;
      setEasterEggActivated(true);
      setTimeout(() => setEasterEggActivated(false), 3000);
      triggerMediumHaptic();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#06060f" />
      <AnimatedBackground variant="default" />

      <View style={styles.content}>
        {/* Logo area */}
        <Pressable onPress={handleLogoTap}>
          <Animated.View style={[styles.logoContainer, logoStyle]}>
            <Text style={styles.logoEmoji}>💥</Text>
            <GlitchText
              text="CHAOS QUIZ"
              fontSize={38}
              color={COLORS.NEON_CYAN}
              intense={easterEggActivated}
            />
            <Text style={styles.logoSubTitle}>WRONG ANSWER DISASTER</Text>
            {easterEggActivated && (
              <View style={styles.easterEggBadge}>
                <Text style={styles.easterEggText}>🥚 DEVELOPER MODE: ACTIVATED 🥚</Text>
              </View>
            )}
          </Animated.View>
        </Pressable>

        {/* Subtitle */}
        <Animated.View style={[styles.subtitleContainer, subtitleStyle]}>
          <Text style={styles.subtitleMain}>The Fragile Quiz</Text>
          <Text style={styles.subtitleNote}>
            Warning: Our developers ran out of budget. The app is highly unstable.
            Incorrect answers will cause physical damage to your phone.
          </Text>
        </Animated.View>

        {/* Start button */}
        <Animated.View style={[styles.buttonWrapper, buttonContainerStyle]}>
          <Animated.View style={[styles.buttonGlow, buttonGlowStyle]}>
            <Pressable
              style={({ pressed }) => [styles.startButton, pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }]}
              onPress={handleStart}
              id="start-quiz-button"
            >
              <View style={styles.startButtonInner}>
                <Text style={styles.startButtonText}>Start Quiz</Text>
              </View>
            </Pressable>
          </Animated.View>
        </Animated.View>

        {/* Stats row */}
        {gamesPlayed > 0 && (
          <Animated.View style={[styles.statsRow, subtitleStyle]}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{gamesPlayed}</Text>
              <Text style={styles.statLabel}>GAMES</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{highScore}</Text>
              <Text style={styles.statLabel}>BEST CHAOS</Text>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Footer */}
      <Animated.View style={[styles.footer, subtitleStyle]}>
        <Text style={styles.footerText}>CodeDay Kashmir 2026</Text>
        <Text style={styles.footerSubtext}>Head Dev: Burhan Hamid | Team: Aqsa, Tabiya</Text>
        <Text style={styles.footerTip}>Built with ☕ and zero sleep.</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 24,
  },
  logoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  logoEmoji: {
    fontSize: 64,
    marginBottom: 4,
  },
  logoSubTitle: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 6,
    fontWeight: '700',
    marginTop: 4,
  },
  easterEggBadge: {
    backgroundColor: 'rgba(128,0,255,0.2)',
    borderWidth: 1,
    borderColor: COLORS.NEON_PURPLE,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 8,
  },
  easterEggText: {
    color: COLORS.NEON_PURPLE,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitleContainer: {
    alignItems: 'center',
    gap: 8,
  },
  subtitleLine1: {
    color: COLORS.NEON_YELLOW,
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 3,
  },
  subtitleMain: {
    color: COLORS.TEXT_PRIMARY,
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 1,
  },
  subtitleNote: {
    color: COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
  },
  buttonWrapper: {
    alignItems: 'center',
    marginTop: 8,
  },
  buttonGlow: {
    shadowColor: COLORS.NEON_CYAN,
    shadowOffset: { width: 0, height: 0 },
    borderRadius: 30,
  },
  startButton: {
    borderRadius: 16,
    backgroundColor: '#6b4ce6',
    borderWidth: 2,
    borderColor: '#8d73ff',
    minWidth: 200,
    elevation: 4,
    shadowColor: '#6b4ce6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  startButtonInner: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a1a35',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.NEON_CYAN,
    fontFamily: 'monospace',
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    fontSize: 9,
    letterSpacing: 2,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#1a1a35',
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 12,
    letterSpacing: 1,
  },
  footerSubtext: {
    color: COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1,
  },
  footerTip: {
    color: COLORS.NEON_PURPLE,
    fontFamily: 'monospace',
    fontSize: 10,
    marginTop: 4,
  },
});

export default WelcomeScreen;
