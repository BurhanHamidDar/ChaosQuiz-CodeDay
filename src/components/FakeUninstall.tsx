import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

interface FakeUninstallProps {
  visible: boolean;
}

const FakeUninstall: React.FC<FakeUninstallProps> = ({ visible }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visible) {
      setProgress(0);
      const interval = setInterval(() => {
        setProgress(p => {
          if (p >= 99) {
            clearInterval(interval);
            return 99;
          }
          return p + Math.floor(Math.random() * 15);
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.dialog}>
        <Text style={styles.title}>System Security Alert</Text>
        <Text style={styles.message}>
          Critical reality failure detected. To protect your device, ChaosQuiz is uninstalling itself permanently...
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${Math.min(progress, 100)}%` }]} />
        </View>
        <Text style={styles.progressText}>{Math.min(progress, 100)}%</Text>
        
        <View style={styles.buttonRow}>
          <View style={[styles.button, styles.disabledButton]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 9990,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 8,
    padding: 24,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    marginBottom: 24,
  },
  progressContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF', // iOS blue
  },
  progressText: {
    alignSelf: 'flex-end',
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  disabledButton: {
    backgroundColor: '#f0f0f0',
  },
  buttonText: {
    color: '#aaa',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default FakeUninstall;
