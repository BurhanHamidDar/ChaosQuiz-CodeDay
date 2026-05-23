import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FakeBSODProps {
  visible: boolean;
}

const FakeBSOD: React.FC<FakeBSODProps> = ({ visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        A fatal exception 0E has occurred at 0028:C0011E36 in VXD VMM(01) + 00010E36. The current application will be terminated.
        {'\n\n'}
        * Press any key to terminate the current application.
        {'\n'}
        * Press CTRL+ALT+DEL again to restart your computer. You will lose any unsaved information in all applications.
        {'\n\n'}
        Error: REALITY_CORRUPTION_DETECTED
        {'\n\n'}
        Press any key to continue _
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0000AA', // Classic BSOD blue
    zIndex: 10000,
    padding: 24,
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 24,
  },
});

export default FakeBSOD;
