import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, GRADIENTS } from '../constants/colors';

const { width, height } = Dimensions.get('window');

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
}

const ParticleItem = ({ particle }: { particle: Particle }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    setTimeout(() => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500 }),
          withTiming(0.1, { duration: 1500 }),
        ),
        -1,
        true,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(-20, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(20, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    }, particle.delay);
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        style,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: particle.color,
          shadowColor: particle.color,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: particle.size * 2,
        },
      ]}
    />
  );
};

const PARTICLE_COLORS = [
  COLORS.NEON_CYAN,
  COLORS.NEON_PINK,
  COLORS.NEON_PURPLE,
  COLORS.NEON_GREEN,
];

const particles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 4 + 2,
  color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
  delay: Math.random() * 2000,
}));

interface AnimatedBackgroundProps {
  variant?: 'default' | 'chaos' | 'recovery';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ variant = 'default' }) => {
  const gradient = variant === 'chaos' ? GRADIENTS.CHAOS
    : variant === 'recovery' ? GRADIENTS.RECOVERY
    : GRADIENTS.BG;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <LinearGradient
        colors={gradient}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Scanline overlay effect */}
      <View style={styles.scanlines} />
      {/* Floating particles */}
      {particles.map((p, i) => (
        <ParticleItem key={i} particle={p} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  particle: {
    position: 'absolute',
  },
  scanlines: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: 'transparent',
  },
});

export default AnimatedBackground;
