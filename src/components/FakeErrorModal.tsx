import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  runOnJS,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { FAKE_ERROR_MESSAGES } from '../constants/chaos';

const { width, height } = Dimensions.get('window');

interface FakeErrorModalProps {
  visible: boolean;
  onDismiss: () => void;
  messageIndex?: number;
}

const FakeErrorModal: React.FC<FakeErrorModalProps> = ({
  visible,
  onDismiss,
  messageIndex = 0,
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const shakeX = useSharedValue(0);
  const glitchOpacity = useSharedValue(1);

  const message = FAKE_ERROR_MESSAGES[messageIndex % FAKE_ERROR_MESSAGES.length];

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 100 });
      scale.value = withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(0.95, { duration: 80 }),
        withTiming(1.05, { duration: 60 }),
        withTiming(1, { duration: 60 }),
      );
      // Glitch flicker
      glitchOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 80 }),
          withTiming(1, { duration: 80 }),
        ),
        4,
        true,
      );
      // Shake the modal
      setTimeout(() => {
        shakeX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withTiming(10, { duration: 50 }),
          withTiming(-8, { duration: 50 }),
          withTiming(8, { duration: 50 }),
          withTiming(0, { duration: 50 }),
        );
      }, 200);
    } else {
      scale.value = withTiming(0, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateX: shakeX.value }],
    opacity: glitchOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="box-none">
      <Animated.View style={[styles.modal, modalStyle]}>
        {/* Header bar */}
        <View style={styles.titleBar}>
          <View style={styles.titleDots}>
            <View style={[styles.dot, { backgroundColor: '#ff5f56' }]} />
            <View style={[styles.dot, { backgroundColor: '#ffbd2e' }]} />
            <View style={[styles.dot, { backgroundColor: '#27c93f' }]} />
          </View>
          <Text style={styles.titleText}>{message.title}</Text>
        </View>
        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.bodyText}>{message.body}</Text>
          {/* Progress bar that just flickers */}
          <View style={styles.fakeProgressTrack}>
            <View style={styles.fakeProgressBar} />
          </View>
          <Text style={styles.errorCode}>
            {'>>> REBOOTING REALITY.EXE...'}
          </Text>
        </View>
        {/* Buttons */}
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.button, styles.buttonCancel]}
            onPress={onDismiss}
          >
            <Text style={styles.buttonCancelText}>IGNORE (BAD IDEA)</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonOk]}
            onPress={onDismiss}
          >
            <Text style={styles.buttonOkText}>OK (ALSO BAD)</Text>
          </Pressable>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: width * 0.85,
    backgroundColor: '#0d0d1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.NEON_PINK,
    shadowColor: COLORS.NEON_PINK,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  titleBar: {
    backgroundColor: '#1a0022',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.NEON_PINK,
  },
  titleDots: {
    flexDirection: 'row',
    gap: 6,
    marginRight: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  titleText: {
    color: COLORS.NEON_PINK,
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  body: {
    padding: 16,
  },
  bodyText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
    marginBottom: 12,
  },
  fakeProgressTrack: {
    height: 4,
    backgroundColor: '#1a1a2e',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  fakeProgressBar: {
    height: '100%',
    width: '47%',
    backgroundColor: COLORS.NEON_PINK,
    borderRadius: 2,
  },
  errorCode: {
    color: COLORS.NEON_GREEN,
    fontFamily: 'monospace',
    fontSize: 10,
    letterSpacing: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonCancel: {
    borderRightWidth: 1,
    borderRightColor: '#1a1a2e',
  },
  buttonOk: {
    backgroundColor: 'rgba(255,0,128,0.1)',
  },
  buttonCancelText: {
    color: COLORS.TEXT_SECONDARY,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
  },
  buttonOkText: {
    color: COLORS.NEON_PINK,
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '900',
  },
});

export default FakeErrorModal;
