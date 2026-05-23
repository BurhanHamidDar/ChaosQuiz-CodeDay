import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

interface GlitchTextProps {
  text: string;
  style?: object;
  fontSize?: number;
  color?: string;
  intense?: boolean;
}

const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  style,
  fontSize = 24,
  color = COLORS.NEON_CYAN,
  intense = false,
}) => {
  const offsetX = useSharedValue(0);
  const offsetX2 = useSharedValue(0);
  const glitchOpacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const speed = intense ? 60 : 150;
    const glitchFrequency = intense ? 800 : 2000;

    const runGlitch = () => {
      offsetX.value = withSequence(
        withTiming(Math.random() * 6 - 3, { duration: speed }),
        withTiming(-(Math.random() * 6 - 3), { duration: speed }),
        withTiming(Math.random() * 4 - 2, { duration: speed }),
        withTiming(0, { duration: speed }),
      );
      offsetX2.value = withSequence(
        withTiming(-(Math.random() * 8 - 4), { duration: speed }),
        withTiming(Math.random() * 8 - 4, { duration: speed }),
        withTiming(0, { duration: speed * 2 }),
      );
      glitchOpacity.value = withSequence(
        withTiming(0.8, { duration: speed }),
        withTiming(0, { duration: speed }),
        withTiming(0.6, { duration: speed }),
        withTiming(0, { duration: speed }),
      );
      if (intense) {
        scale.value = withSequence(
          withTiming(1.02, { duration: speed }),
          withTiming(0.98, { duration: speed }),
          withTiming(1, { duration: speed }),
        );
      }
    };

    const interval = setInterval(runGlitch, glitchFrequency + Math.random() * 1000);
    return () => clearInterval(interval);
  }, [intense]);

  const mainStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offsetX.value }, { scale: scale.value }],
  }));

  const glitch1Style = useAnimatedStyle(() => ({
    opacity: glitchOpacity.value * 0.6,
    transform: [{ translateX: offsetX.value + 3 }],
  }));

  const glitch2Style = useAnimatedStyle(() => ({
    opacity: glitchOpacity.value * 0.4,
    transform: [{ translateX: offsetX2.value - 3 }],
  }));

  const textStyle = {
    fontSize,
    fontFamily: 'monospace',
    fontWeight: '900' as const,
    letterSpacing: 2,
    color,
    ...style,
  };

  return (
    <Animated.View style={styles.container}>
      {/* Glitch layer 1 - cyan */}
      <Animated.Text
        style={[textStyle, styles.glitchLayer, { color: COLORS.NEON_CYAN }, glitch1Style]}
      >
        {text}
      </Animated.Text>
      {/* Glitch layer 2 - pink */}
      <Animated.Text
        style={[textStyle, styles.glitchLayer, { color: COLORS.NEON_PINK }, glitch2Style]}
      >
        {text}
      </Animated.Text>
      {/* Main text */}
      <Animated.Text style={[textStyle, mainStyle]}>{text}</Animated.Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  glitchLayer: {
    position: 'absolute',
  },
});

export default GlitchText;
