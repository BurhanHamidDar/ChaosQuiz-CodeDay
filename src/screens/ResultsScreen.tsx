import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  StatusBar,
  ScrollView,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withRepeat,
  withDelay,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import AnimatedBackground from '../components/AnimatedBackground';
import GlitchText from '../components/GlitchText';
import { COLORS } from '../constants/colors';
import { RECOVERY_MESSAGES } from '../constants/chaos';
import { saveHighScore, saveMostWrongAnswers, incrementGamesPlayed } from '../utils/storage';
import { triggerSuccessHaptic, triggerMediumHaptic } from '../utils/haptics';

type RootStackParamList = {
  Welcome: undefined;
  Quiz: undefined;
  Results: { wrongAnswers: number; score: number };
};

type ResultsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route: RouteProp<RootStackParamList, 'Results'>;
};

const { width, height } = Dimensions.get('window');

const ResultsScreen: React.FC<ResultsScreenProps> = ({ navigation, route }) => {
  const { wrongAnswers, score } = route.params;

  const contentOpacity = useSharedValue(0);
  const emojiScale = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const statsScale = useSharedValue(0);

  const chaosKey = Math.min(wrongAnswers, 4) as 0 | 1 | 2 | 3 | 4;
  const ending = RECOVERY_MESSAGES[chaosKey];

  const getChaosLevelColor = () => {
    if (wrongAnswers === 0) return COLORS.NEON_GREEN;
    if (wrongAnswers === 1) return COLORS.NEON_CYAN;
    if (wrongAnswers === 2) return COLORS.NEON_YELLOW;
    if (wrongAnswers === 3) return COLORS.NEON_ORANGE;
    return COLORS.NEON_PINK;
  };

  useEffect(() => {
    // Save stats
    incrementGamesPlayed();
    saveHighScore(wrongAnswers);
    saveMostWrongAnswers(wrongAnswers);

    if (wrongAnswers === 0) triggerSuccessHaptic();
    else triggerMediumHaptic();

    // Staggered entrance animations
    contentOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    emojiScale.value = withDelay(
      300,
      withSequence(
        withSpring(1.3, { damping: 8, stiffness: 120 }),
        withSpring(1, { damping: 12, stiffness: 80 }),
      ),
    );

    statsScale.value = withDelay(600, withSpring(1, { damping: 10, stiffness: 80 }));

    glowOpacity.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withTiming(0.3, { duration: 800 }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const emojiStyle = useAnimatedStyle(() => ({
    transform: [{ scale: emojiScale.value }],
  }));

  const statsStyle = useAnimatedStyle(() => ({
    transform: [{ scale: statsScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
    shadowOpacity: glowOpacity.value,
    shadowRadius: 20,
  }));

  const handlePlayAgain = () => {
    triggerMediumHaptic();
    buttonScale.value = withSequence(
      withTiming(0.93, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
    setTimeout(() => {
      navigation.navigate('Quiz');
    }, 200);
  };

  const handleGoHome = () => {
    triggerMediumHaptic();
    navigation.navigate('Welcome');
  };

  const chaosColor = getChaosLevelColor();
  const isVictory = wrongAnswers === 0;
  const isCatastrophic = wrongAnswers >= 4;

  const getChaosScoreLabel = () => {
    if (wrongAnswers === 0) return 'REALITY INTACT';
    if (wrongAnswers === 1) return 'MINOR CHAOS';
    if (wrongAnswers === 2) return 'MODERATE CHAOS';
    if (wrongAnswers === 3) return 'SEVERE CHAOS';
    return 'MAXIMUM CHAOS';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AnimatedBackground variant={isCatastrophic ? 'chaos' : isVictory ? 'recovery' : 'default'} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.content, contentStyle]}>
          {/* Recovery header */}
          <View style={styles.recoveryHeader}>
            <Text style={[styles.recoveryLabel, { color: chaosColor }]}>
              {isCatastrophic ? '💀 SYSTEM MELTDOWN 💀' : '✅ REALITY RESTORED'}
            </Text>
            <Text style={styles.recoverySubLabel}>
              Please avoid dangerous answers.
            </Text>
          </View>

          {/* Main emoji */}
          <Animated.View style={[styles.emojiContainer, emojiStyle]}>
            <Text style={styles.mainEmoji}>{ending.emoji}</Text>
          </Animated.View>

          {/* Ending title */}
          <GlitchText
            text={ending.title}
            fontSize={22}
            color={chaosColor}
            intense={isCatastrophic}
          />

          <Text style={[styles.endingSubtitle, { color: chaosColor }]}>
            {ending.subtitle}
          </Text>

          {/* Funny body text */}
          <View style={styles.messageCard}>
            <Text style={styles.messageText}>{ending.body}</Text>
          </View>

          {/* Stats */}
          <Animated.View style={[styles.statsGrid, statsStyle]}>
            <View style={[styles.statCard, { borderColor: COLORS.NEON_CYAN }]}>
              <Text style={[styles.statValue, { color: COLORS.NEON_CYAN }]}>{score}</Text>
              <Text style={styles.statLabel}>SCORE</Text>
            </View>
            <View style={[styles.statCard, { borderColor: chaosColor }]}>
              <Text style={[styles.statValue, { color: chaosColor }]}>{wrongAnswers}</Text>
              <Text style={styles.statLabel}>WRONG</Text>
            </View>
            <View style={[styles.statCard, { borderColor: COLORS.NEON_PURPLE }]}>
              <Text style={[styles.statValue, { color: COLORS.NEON_PURPLE }]}>
                {10 - wrongAnswers}
              </Text>
              <Text style={styles.statLabel}>CORRECT</Text>
            </View>
          </Animated.View>

          {/* Chaos Level Badge */}
          <View style={[styles.chaosBadge, { borderColor: chaosColor }]}>
            <LinearGradient
              colors={[`${chaosColor}15`, 'transparent']}
              style={styles.chaosBadgeGradient}
            >
              <Text style={[styles.chaosLevelText, { color: chaosColor }]}>
                CHAOS LEVEL: {getChaosScoreLabel()}
              </Text>
              <View style={styles.chaosMeter}>
                {[0, 1, 2, 3, 4].map(i => (
                  <View
                    key={i}
                    style={[
                      styles.chaosBlock,
                      {
                        backgroundColor: i < wrongAnswers ? chaosColor : '#1a1a2e',
                        shadowColor: i < wrongAnswers ? chaosColor : 'transparent',
                        shadowOpacity: 1,
                        shadowRadius: 4,
                      },
                    ]}
                  />
                ))}
              </View>
            </LinearGradient>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Animated.View style={[buttonStyle, { shadowColor: COLORS.NEON_GREEN }]}>
              <Pressable
                id="play-again-button"
                style={[styles.primaryButton, { borderColor: COLORS.NEON_GREEN }]}
                onPress={handlePlayAgain}
              >
                <LinearGradient
                  colors={['rgba(0,255,136,0.12)', 'transparent']}
                  style={styles.buttonGradient}
                >
                  <Text style={[styles.primaryButtonText, { color: COLORS.NEON_GREEN }]}>
                    🔄 BREAK REALITY AGAIN
                  </Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>

            <Pressable
              id="home-button"
              style={styles.secondaryButton}
              onPress={handleGoHome}
            >
              <Text style={styles.secondaryButtonText}>⬅ BACK TO SAFETY</Text>
            </Pressable>
          </View>

          {/* Footer */}
          <Text style={styles.footer}>
            Chaos Quiz · by Burhan Hamid · Hackathon 2026
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_PRIMARY,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    gap: 20,
  },
  recoveryHeader: {
    alignItems: 'center',
    gap: 4,
  },
  recoveryLabel: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
  },
  recoverySubLabel: {
    color: COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    fontSize: 11,
    letterSpacing: 1,
  },
  emojiContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainEmoji: {
    fontSize: 80,
  },
  endingSubtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
    padding: 18,
    width: '100%',
  },
  messageText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 13,
    lineHeight: 22,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.BG_CARD,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 28,
    fontWeight: '900',
  },
  statLabel: {
    color: COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  chaosBadge: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  chaosBadgeGradient: {
    padding: 16,
    alignItems: 'center',
    gap: 10,
  },
  chaosLevelText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  chaosMeter: {
    flexDirection: 'row',
    gap: 8,
  },
  chaosBlock: {
    width: 40,
    height: 12,
    borderRadius: 4,
    elevation: 4,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 2,
  },
  secondaryButton: {
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a4a',
  },
  secondaryButtonText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
  footer: {
    color: COLORS.TEXT_MUTED,
    fontFamily: 'monospace',
    fontSize: 10,
    textAlign: 'center',
    letterSpacing: 1,
    marginTop: 8,
  },
});

export default ResultsScreen;
