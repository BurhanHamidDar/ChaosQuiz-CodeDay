import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Props {
  severity: number;
}

// Highly realistic cracked glass component using the downloaded PNG
const RealisticCrackedGlass: React.FC<Props> = ({ severity }) => {
  const opacity1 = useSharedValue(0);
  const opacity2 = useSharedValue(0);
  const opacity3 = useSharedValue(0);

  useEffect(() => {
    if (severity >= 1) opacity1.value = withTiming(0.8, { duration: 100 }); // Partial opacity for single crack
    if (severity >= 2) opacity2.value = withTiming(0.9, { duration: 100 });
    if (severity >= 3) opacity3.value = withTiming(1, { duration: 100 }); // Full blast
  }, [severity]);

  const style1 = useAnimatedStyle(() => ({ opacity: opacity1.value }));
  const style2 = useAnimatedStyle(() => ({ opacity: opacity2.value }));
  const style3 = useAnimatedStyle(() => ({ opacity: opacity3.value }));

  // We use the same high-quality transparent PNG but scale/rotate it to look like different cracks
  return (
    <View style={styles.container} pointerEvents="none">
      
      {/* Strike 1: A smaller crack originating from top left */}
      <Animated.View style={[StyleSheet.absoluteFill, style1, styles.layer]}>
        <Image 
          source={require('../../assets/cracked_real.png')} 
          style={[styles.image, { transform: [{ scale: 1.5 }, { translateX: -50 }, { translateY: -100 }] }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Strike 2: Another crack from bottom right, flipped */}
      <Animated.View style={[StyleSheet.absoluteFill, style2, styles.layer]}>
        <Image 
          source={require('../../assets/cracked_real.png')} 
          style={[styles.image, { transform: [{ scale: 1.8 }, { rotate: '180deg' }, { translateX: -30 }, { translateY: -150 }] }]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Strike 3: Massive center shatter */}
      <Animated.View style={[StyleSheet.absoluteFill, style3, styles.layer]}>
        <Image 
          source={require('../../assets/cracked_real.png')} 
          style={[styles.image, { transform: [{ scale: 1.2 }, { rotate: '45deg' }] }]}
          resizeMode="cover"
        />
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999, // Render on top of everything
  },
  layer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: height,
    opacity: 0.9, // Slight transparency to blend with the UI behind it
  }
});

export default RealisticCrackedGlass;
