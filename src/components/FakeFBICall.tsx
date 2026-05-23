import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';

interface FakeFBICallProps {
  visible: boolean;
  onDismiss: () => void;
}

const FakeFBICall: React.FC<FakeFBICallProps> = ({ visible, onDismiss }) => {
  const shakeX = useSharedValue(0);
  const ringScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      shakeX.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 50 }),
          withTiming(5, { duration: 50 })
        ),
        -1,
        true
      );
      ringScale.value = withRepeat(
        withSequence(
          withSpring(1.2),
          withSpring(1)
        ),
        -1,
        true
      );

      // Play FBI sound when call comes in
      const playSound = async () => {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../../assets/sounds/fbi.mp3'),
            { shouldPlay: true }
          );
          sound.setOnPlaybackStatusUpdate((status) => {
            if ('didJustFinish' in status && status.didJustFinish) {
              sound.unloadAsync();
            }
          });
        } catch (e) {
          console.log('Error playing FBI sound', e);
        }
      };
      playSound();
    } else {
      shakeX.value = 0;
      ringScale.value = 1;
    }
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, containerStyle]}>
      <View style={styles.content}>
        <Text style={styles.callerID}>FBI - REALITY POLICE</Text>
        <Text style={styles.status}>Incoming Chaos...</Text>
        
        <Animated.View style={[styles.avatarPlaceholder, ringStyle]}>
          <Text style={styles.avatarIcon}>🚨</Text>
        </Animated.View>

        <View style={styles.actions}>
          <Pressable style={[styles.button, styles.declineButton]} onPress={onDismiss}>
            <Text style={styles.buttonText}>Decline</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.acceptButton]} onPress={onDismiss}>
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  callerID: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'monospace',
    textAlign: 'center',
  },
  status: {
    color: COLORS.TEXT_MUTED,
    fontSize: 18,
    marginBottom: 60,
  },
  avatarPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORS.WRONG,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
    borderWidth: 4,
    borderColor: '#ff4444',
  },
  avatarIcon: {
    fontSize: 70,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  declineButton: {
    backgroundColor: '#ff3b30',
  },
  acceptButton: {
    backgroundColor: '#34c759',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FakeFBICall;
