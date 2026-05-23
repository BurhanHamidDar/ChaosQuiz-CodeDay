import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';

interface RealityMeterProps {
  stability: number; // 0-100
  chaosLevel: number;
}

const RealityMeter: React.FC<RealityMeterProps> = ({ stability, chaosLevel }) => {
  const progress = useSharedValue(100);
  const glitchOffset = useSharedValue(0);

  useEffect(() => {
    progress.value = withSpring(stability, { damping: 12, stiffness: 80 });
  }, [stability]);

  useEffect(() => {
    if (chaosLevel > 0) {
      glitchOffset.value = withTiming(2, { duration: 80 });
      setTimeout(() => {
        glitchOffset.value = withTiming(-2, { duration: 80 });
        setTimeout(() => {
          glitchOffset.value = withTiming(0, { duration: 80 });
        }, 80);
      }, 80);
    }
  }, [stability]);

  const barStyle = useAnimatedStyle(() => {
    const color =
      progress.value > 75
        ? COLORS.METER_FULL
        : progress.value > 50
        ? COLORS.METER_MID
        : progress.value > 25
        ? COLORS.METER_LOW
        : COLORS.METER_CRITICAL;

    return {
      width: `${progress.value}%`,
      backgroundColor: color,
      shadowColor: color,
    };
  });

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: glitchOffset.value }],
  }));

  const getMeterColor = () => {
    if (stability > 75) return COLORS.METER_FULL;
    if (stability > 50) return COLORS.METER_MID;
    if (stability > 25) return COLORS.METER_LOW;
    return COLORS.METER_CRITICAL;
  };

  const getStatusText = () => {
    if (stability >= 100) return '✅ STABLE';
    if (stability >= 75) return '⚠️ NOMINAL';
    if (stability >= 50) return '🟡 DEGRADED';
    if (stability >= 25) return '🔴 CRITICAL';
    return '💀 CATASTROPHIC';
  };

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.header}>
        <Text style={styles.label}>REALITY STABILITY</Text>
        <Text style={[styles.status, { color: getMeterColor() }]}>
          {getStatusText()}
        </Text>
      </View>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.bar,
            barStyle,
            {
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 8,
            },
          ]}
        />
        {/* Tick marks */}
        {[25, 50, 75].map(tick => (
          <View
            key={tick}
            style={[styles.tick, { left: `${tick}%` as any }]}
          />
        ))}
      </View>
      <Text style={[styles.percentage, { color: getMeterColor() }]}>
        {Math.round(stability)}%
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    color: COLORS.TEXT_SECONDARY,
    fontSize: 10,
    fontFamily: 'monospace',
    letterSpacing: 2,
    fontWeight: '700',
  },
  status: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    letterSpacing: 1,
  },
  track: {
    height: 10,
    backgroundColor: '#1a1a2e',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333355',
    position: 'relative',
  },
  bar: {
    height: '100%',
    borderRadius: 5,
  },
  tick: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  percentage: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
    textAlign: 'right',
    marginTop: 4,
    letterSpacing: 1,
  },
});

export default RealityMeter;
