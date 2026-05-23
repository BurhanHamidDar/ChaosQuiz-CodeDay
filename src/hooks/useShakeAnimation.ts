import { useRef, useCallback } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

export const useShakeAnimation = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);

  const shake = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-15, { duration: 50 }),
      withTiming(15, { duration: 50 }),
      withTiming(-12, { duration: 50 }),
      withTiming(12, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-4, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
    translateY.value = withSequence(
      withTiming(-8, { duration: 60 }),
      withTiming(8, { duration: 60 }),
      withTiming(-5, { duration: 60 }),
      withTiming(5, { duration: 60 }),
      withTiming(0, { duration: 60 }),
    );
  }, [translateX, translateY]);

  const heavyShake = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-25, { duration: 40 }),
      withTiming(25, { duration: 40 }),
      withTiming(-20, { duration: 40 }),
      withTiming(20, { duration: 40 }),
      withTiming(-15, { duration: 40 }),
      withTiming(15, { duration: 40 }),
      withTiming(-10, { duration: 40 }),
      withTiming(10, { duration: 40 }),
      withTiming(-5, { duration: 40 }),
      withTiming(0, { duration: 40 }),
    );
    translateY.value = withSequence(
      withTiming(-15, { duration: 50 }),
      withTiming(15, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-5, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
    rotate.value = withSequence(
      withTiming(-5, { duration: 50 }),
      withTiming(5, { duration: 50 }),
      withTiming(-3, { duration: 50 }),
      withTiming(3, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }, [translateX, translateY, rotate]);

  const continuousShake = useCallback(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 60 }),
        withTiming(10, { duration: 60 }),
      ),
      -1,
      true,
    );
  }, [translateX]);

  const stopShake = useCallback(() => {
    translateX.value = withTiming(0, { duration: 100 });
    translateY.value = withTiming(0, { duration: 100 });
    rotate.value = withTiming(0, { duration: 100 });
  }, [translateX, translateY, rotate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return { shake, heavyShake, continuousShake, stopShake, animatedStyle };
};

export const useGravityFlip = () => {
  const flipY = useSharedValue(1);
  const isFlipped = useRef(false);

  const flip = useCallback(() => {
    isFlipped.current = !isFlipped.current;
    flipY.value = withTiming(isFlipped.current ? -1 : 1, {
      duration: 600,
      easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
    });
  }, [flipY]);

  const resetFlip = useCallback(() => {
    isFlipped.current = false;
    flipY.value = withTiming(1, { duration: 400 });
  }, [flipY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: flipY.value }],
  }));

  return { flip, resetFlip, animatedStyle, isFlipped };
};

export const usePulseAnimation = () => {
  const scale = useSharedValue(1);

  const startPulse = useCallback(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 600 }),
        withTiming(0.95, { duration: 600 }),
      ),
      -1,
      true,
    );
  }, [scale]);

  const stopPulse = useCallback(() => {
    scale.value = withTiming(1, { duration: 200 });
  }, [scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { startPulse, stopPulse, animatedStyle };
};
