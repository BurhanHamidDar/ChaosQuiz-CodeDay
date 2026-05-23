import React, { useEffect } from 'react';
import { StyleSheet, Text, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface RunningCatProps {
  visible: boolean;
  onComplete?: () => void;
}

const CAT_FRAMES = ['🐱', '😺', '🐈', '😸', '🐱', '😼'];

const RunningCat: React.FC<RunningCatProps> = ({ visible, onComplete }) => {
  const translateX = useSharedValue(-100);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);
  const frameIndex = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      const startY = height * 0.4 + Math.random() * 100;
      translateY.value = startY;
      opacity.value = 1;
      translateX.value = -100;

      translateX.value = withTiming(
        width + 100,
        {
          duration: 2500,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            opacity.value = 0;
            if (onComplete) runOnJS(onComplete)();
          }
        },
      );

      // Bounce effect
      const bounceInterval = setInterval(() => {
        translateY.value = withSequence(
          withTiming(startY - 15, { duration: 150 }),
          withTiming(startY, { duration: 150 }),
        );
      }, 300);

      setTimeout(() => clearInterval(bounceInterval), 2600);
    }
  }, [visible]);

  const catStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.catContainer, catStyle]} pointerEvents="none">
      <Text style={styles.catEmoji}>🐱</Text>
      <Text style={styles.catSpeech}>WRONG ANSWER!</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  catContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 500,
    alignItems: 'center',
  },
  catEmoji: {
    fontSize: 48,
    transform: [{ scaleX: -1 }], // face right → left (running)
  },
  catSpeech: {
    color: '#ff0080',
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ff0080',
    marginTop: 2,
  },
});

export default RunningCat;
