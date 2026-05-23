import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { COUNTDOWN_MESSAGES } from '../constants/chaos';

const { width, height } = Dimensions.get('window');

interface CountdownOverlayProps {
  visible: boolean;
  onComplete?: () => void;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ visible, onComplete }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const countNum = useSharedValue(5);
  const flashOpacity = useSharedValue(0);
  const shakeX = useSharedValue(0);

  const message = COUNTDOWN_MESSAGES[Math.floor(Math.random() * COUNTDOWN_MESSAGES.length)];

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 200 });

      // Shake the whole overlay
      shakeX.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 60 }),
          withTiming(8, { duration: 60 }),
        ),
        -1,
        true,
      );

      // Flash effect
      flashOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 300 }),
          withTiming(0, { duration: 300 }),
        ),
        10,
        true,
      );

      // Countdown from 5
      let count = 5;
      const tick = () => {
        if (count <= 0) {
          // Final flash
          flashOpacity.value = withTiming(1, { duration: 100 }, () => {
            flashOpacity.value = withTiming(0, { duration: 300 });
          });
          shakeX.value = withTiming(0, { duration: 100 });
          opacity.value = withTiming(0, { duration: 500 }, (finished) => {
            if (finished && onComplete) runOnJS(onComplete)();
          });
          return;
        }
        scale.value = withSequence(
          withTiming(1.4, { duration: 150 }),
          withTiming(1.0, { duration: 150 }),
        );
        count--;
        setTimeout(tick, 1000);
      };
      setTimeout(tick, 500);
    } else {
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: shakeX.value }],
  }));

  const numStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      {/* Red flash background */}
      <Animated.View style={[styles.flash, flashStyle]} />
      <Text style={styles.messageText}>{message}</Text>
      <Animated.Text style={[styles.countText, numStyle]}>5</Animated.Text>
      <Text style={styles.subText}>{'⚠️ BRACE YOURSELF ⚠️'}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,0,0,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 900,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#ff0000',
  },
  messageText: {
    color: COLORS.NEON_PINK,
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  countText: {
    color: '#ff0000',
    fontFamily: 'monospace',
    fontSize: 120,
    fontWeight: '900',
    lineHeight: 130,
    textShadowColor: '#ff0000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
  },
  subText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 20,
  },
});

export default CountdownOverlay;
