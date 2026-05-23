import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

interface MomTextProps {
  visible: boolean;
}

const { width } = Dimensions.get('window');

const MomText: React.FC<MomTextProps> = ({ visible }) => {
  const translateY = useSharedValue(-150);

  useEffect(() => {
    if (visible) {
      // Slide down and stay
      translateY.value = withSpring(40, { damping: 12 });
    } else {
      translateY.value = withTiming(-150);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={styles.notification}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>👩</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Mom</Text>
          <Text style={styles.body}>Why is your phone screen cracking from the inside??? What did you download?!</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  notification: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    width: width * 0.9,
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#e0e0e0',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#000',
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 2,
  },
  body: {
    color: '#333',
    fontSize: 14,
    lineHeight: 18,
  },
});

export default MomText;
