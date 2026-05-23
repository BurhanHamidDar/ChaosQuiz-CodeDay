import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

const NOTIFICATION_MESSAGES = [
  "Mom: Are you really this dumb?",
  "Duolingo: You missed your reality lesson. I'm outside.",
  "System: Brain.exe has stopped working.",
  "Bank: Your IQ account is overdrawn.",
  "NASA: We detected a black hole forming in your head.",
  "FBI: Don't move.",
];

interface MockNotificationsProps {
  chaosLevel: number;
  triggerCount: number; // Increment to trigger a new notification
}

const MockNotifications: React.FC<MockNotificationsProps> = ({ chaosLevel, triggerCount }) => {
  const [message, setMessage] = useState('');
  const translateY = useSharedValue(-150);

  useEffect(() => {
    if (triggerCount > 0 && chaosLevel >= 1) {
      const randomMsg = NOTIFICATION_MESSAGES[Math.floor(Math.random() * NOTIFICATION_MESSAGES.length)];
      setMessage(randomMsg);
      
      // Drop down, hold, go back up
      translateY.value = withSequence(
        withSpring(20, { damping: 12 }),
        withTiming(20, { duration: 2500 }),
        withSpring(-150)
      );
    }
  }, [triggerCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!message) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]} pointerEvents="none">
      <View style={styles.notification}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🔔</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>New Message</Text>
          <Text style={styles.body}>{message}</Text>
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
    backgroundColor: 'rgba(20, 20, 30, 0.95)',
    width: '90%',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  body: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 13,
  },
});

export default MockNotifications;
