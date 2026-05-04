import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { colors, fonts } from '../theme';

interface Props {
  status: 'offline' | 'connected';
  onDisconnect?: () => void;
}

export function Wordmark({ status, onDisconnect }: Props) {
  const breathe = useSharedValue(0.7);
  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0.7, { duration: 1200 }),
      ),
      -1,
      false,
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    opacity: status === 'connected' ? breathe.value : 1,
  }));

  return (
    <View style={styles.wrap}>
      <View style={styles.brand}>
        <Text style={styles.brandText}>dabwith</Text>
        <Text style={[styles.brandText, styles.accent]}>.</Text>
        <Text style={[styles.brandText, styles.accent, { fontWeight: '800' }]}>me</Text>
      </View>

      {status === 'connected' && onDisconnect ? (
        <Pressable onPress={onDisconnect} style={styles.disconnect}>
          <Animated.View style={[styles.dot, { backgroundColor: colors.mintDeep }, dotStyle]} />
          <Text style={styles.statusText}>disconnect</Text>
        </Pressable>
      ) : (
        <View style={styles.status}>
          <View style={[styles.dot, { backgroundColor: colors.border }]} />
          <Text style={styles.statusText}>offline</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 6,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  brandText: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 21,
    letterSpacing: -0.7,
    color: colors.fg,
  },
  accent: {
    color: colors.accent,
    fontWeight: '800',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 240, 247, 0.7)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  disconnect: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 240, 247, 0.5)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
