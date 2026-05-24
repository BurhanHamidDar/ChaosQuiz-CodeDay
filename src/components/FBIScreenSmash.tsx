import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import ProceduralCrackedGlass from './ProceduralCrackedGlass';

interface FBIScreenSmashProps {
  visible: boolean;
  onComplete?: () => void;
}

const { width, height } = Dimensions.get('window');

const FBIScreenSmash: React.FC<FBIScreenSmashProps> = ({ visible, onComplete }) => {
  const [smashed, setSmashed] = useState(false);
  
  const hammerRotation = useSharedValue(-90);
  const hammerScale = useSharedValue(0.1);
  const hammerOpacity = useSharedValue(0);

  useEffect(() => {
    if (visible && !smashed) {
      // Bring in the hammer
      hammerOpacity.value = 1;
      hammerScale.value = withTiming(3, { duration: 300 });
      hammerRotation.value = withSequence(
        withTiming(20, { duration: 300 }), // swing back
        withTiming(-45, { duration: 150 }, () => {
          // HIT!
          runOnJS(triggerSmash)();
          
          // Hammer disappears
          hammerOpacity.value = withTiming(0, { duration: 200 });
        })
      );
    }
  }, [visible]);

  const triggerSmash = async () => {
    setSmashed(true);
    
    // Play loud smash (simulate with overlapping boom/error sounds)
    try {
      const { sound: s1 } = await Audio.Sound.createAsync(require('../../assets/sounds/boom.mp3'));
      const { sound: s2 } = await Audio.Sound.createAsync(require('../../assets/sounds/error.mp3'));
      s1.playAsync();
      s2.playAsync();
      setTimeout(() => s1.unloadAsync(), 2000);
      setTimeout(() => s2.unloadAsync(), 2000);
    } catch (e) {
      // ignore
    }

    if (onComplete) {
      setTimeout(onComplete, 1200);
    }
  };

  const hammerStyle = useAnimatedStyle(() => ({
    opacity: hammerOpacity.value,
    transform: [
      { scale: hammerScale.value },
      { rotate: `${hammerRotation.value}deg` }
    ],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.hammerContainer, hammerStyle]}>
        <Text style={styles.hammer}>🔨</Text>
      </Animated.View>
      
      {smashed && <ProceduralCrackedGlass severity={3} />}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000, // Topmost
    justifyContent: 'center',
    alignItems: 'center',
  },
  hammerContainer: {
    position: 'absolute',
    top: height / 3,
    right: 40,
  },
  hammer: {
    fontSize: 100,
  },
  crackedGlass: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    height: height,
    opacity: 0.8,
  },
});

export default FBIScreenSmash;
