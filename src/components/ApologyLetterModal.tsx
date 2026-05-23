import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Audio } from 'expo-av';
import { COLORS } from '../constants/colors';

interface ApologyLetterModalProps {
  visible: boolean;
  onSuccess: () => void;
  onFail: () => void;
}

const { width } = Dimensions.get('window');

const CustomCheckbox = ({ label, checked, onPress }: { label: string, checked: boolean, onPress: () => void }) => (
  <Pressable style={styles.checkboxRow} onPress={onPress}>
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
  </Pressable>
);

const ApologyLetterModal: React.FC<ApologyLetterModalProps> = ({ visible, onSuccess, onFail }) => {
  const [box1, setBox1] = useState(false);
  const [box2, setBox2] = useState(false);
  const [box3, setBox3] = useState(false);
  
  const [stamp, setStamp] = useState<'HUMILIATED' | null>(null);

  const stampScale = useSharedValue(5);
  const stampOpacity = useSharedValue(0);

  // Helper to play sound
  const playSound = async (soundFile: any) => {
    try {
      const { sound } = await Audio.Sound.createAsync(soundFile);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if ('didJustFinish' in status && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (visible) {
      playSound(require('../../assets/sounds/crickets.mp3'));
    }
  }, [visible]);

  const allChecked = box1 && box2 && box3;

  const handleBox1 = () => {
    if (stamp !== null) return;
    if (!box1) {
      Alert.alert(
        "Are you sure?",
        "By checking this box, you are legally admitting you have absolutely zero skills and it is entirely your fault.",
        [
          { text: "I have a skill issue", onPress: () => setBox1(true) },
          { text: "Cancel", onPress: () => {} }
        ]
      );
    } else {
      setBox1(false);
    }
  };

  const handleSend = () => {
    if (!allChecked) return;

    setStamp('HUMILIATED');
    playSound(require('../../assets/sounds/yippee.mp3'));

    // Slam the stamp down
    stampOpacity.value = 1;
    stampScale.value = withSequence(
      withSpring(1, { damping: 10, stiffness: 100 }),
      withTiming(1, { duration: 1500 })
    );

    // Call callback after showing stamp
    setTimeout(() => {
      onSuccess();
      // Reset state for next time
      setStamp(null);
      setBox1(false);
      setBox2(false);
      setBox3(false);
      stampOpacity.value = 0;
      stampScale.value = 5;
    }, 2000);
  };

  const stampStyle = useAnimatedStyle(() => ({
    opacity: stampOpacity.value,
    transform: [{ scale: stampScale.value }, { rotate: '-15deg' }],
  }));

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.modal}>
        <Text style={styles.title}>TERMS OF FORGIVENESS</Text>
        <Text style={styles.instructions}>
          To receive a lifeline and repair your phone, you must legally sign away your pride by agreeing to the following terms:
        </Text>

        <View style={styles.checkboxesContainer}>
          <CustomCheckbox 
            label="I admit that I have a massive skill issue and am bad at this quiz." 
            checked={box1} 
            onPress={handleBox1} 
          />
          <CustomCheckbox 
            label="I sincerely apologize to my poor phone for physically abusing it." 
            checked={box2} 
            onPress={() => stamp === null && setBox2(!box2)} 
          />
          <CustomCheckbox 
            label="I legally swear that Burhan Hamid's team deserves to win 1st Place at this Hackathon." 
            checked={box3} 
            onPress={() => stamp === null && setBox3(!box3)} 
          />
        </View>

        <Pressable
          style={[styles.sendButton, (!allChecked || stamp !== null) && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!allChecked || stamp !== null}
        >
          <Text style={styles.sendButtonText}>Sign Away My Pride</Text>
        </Pressable>

        {stamp && (
          <Animated.View style={[styles.stampContainer, stampStyle]}>
            <Text style={styles.stampText}>{stamp}</Text>
            <Text style={styles.stampSubText}>& ACCEPTED</Text>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 10000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#000',
    marginBottom: 12,
    textAlign: 'center',
  },
  instructions: {
    fontSize: 14,
    color: '#444',
    marginBottom: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
  checkboxesContainer: {
    marginBottom: 24,
    gap: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#222',
    flexShrink: 1,
    lineHeight: 20,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#00cc66',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stampContainer: {
    position: 'absolute',
    top: '35%',
    left: '5%',
    right: '5%',
    borderWidth: 6,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderColor: '#00cc66',
  },
  stampText: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#00cc66',
  },
  stampSubText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00cc66',
    marginTop: 4,
  },
});

export default ApologyLetterModal;
