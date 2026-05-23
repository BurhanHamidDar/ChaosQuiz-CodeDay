import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';

interface FragileRepairModalProps {
  visible: boolean;
  onLifeline: () => void;
  hasLifeline: boolean;
}

const FragileRepairModal: React.FC<FragileRepairModalProps> = ({ visible, onLifeline, hasLifeline }) => {
  const [show, setShow] = useState(false);
  const buttonX = useSharedValue(0);
  const buttonY = useSharedValue(0);

  useEffect(() => {
    let soundObj: Audio.Sound | null = null;

    const playCreepyLoop = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/creepy.mp3'),
          { shouldPlay: true, isLooping: true }
        );
        soundObj = sound;
      } catch (e) {
        console.log('Error playing creepy loop', e);
      }
    };

    if (visible) {
      setTimeout(() => {
        setShow(true);
        playCreepyLoop();
      }, 2500);
    } else {
      setShow(false);
    }

    return () => {
      if (soundObj) {
        soundObj.stopAsync().then(() => soundObj?.unloadAsync());
      }
    };
  }, [visible]);

  const handlePayHover = () => {
    // Make button jump away when they try to press it
    buttonX.value = withSpring(Math.random() * 100 - 50);
    buttonY.value = withSpring(Math.random() * -100 - 50);
  };

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: buttonX.value },
      { translateY: buttonY.value }
    ]
  }));

  if (!show) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>⚠️ APP INTEGRITY DESTROYED</Text>
        <Text style={styles.message}>
          Your screen has sustained critical physical damage from incorrect answers.
        </Text>
        <Text style={styles.cost}>Repair Cost: $5,999.99</Text>
        
        <View style={styles.buttonRow}>
          {hasLifeline && (
            <Pressable style={styles.lifelineButton} onPress={onLifeline}>
              <Text style={styles.lifelineText}>Beg Mom for Lifeline</Text>
            </Pressable>
          )}

          <Animated.View style={buttonStyle}>
            <Pressable 
              style={styles.payButton}
              onPressIn={handlePayHover} // Triggers when touched
            >
              <Text style={styles.payText}>Pay Now</Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ff3b30',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 16,
  },
  cost: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginBottom: 30,
  },
  buttonRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 60,
  },
  payButton: {
    backgroundColor: '#34c759',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 5,
  },
  payText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  lifelineButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    elevation: 5,
  },
  lifelineText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 14,
  },
});

export default FragileRepairModal;
