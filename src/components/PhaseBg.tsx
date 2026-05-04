import React, { useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient as SvgRadial, Stop, Rect } from 'react-native-svg';

export type PhaseBgKind = 'idle' | 'heat' | 'cool' | 'dab' | 'dunk' | 'clean' | 'complete';

interface Props {
  kind: PhaseBgKind;
  /** 0..1 — how full the heat-fill rises from the bottom. Driven by torch listener. */
  heatProgress?: number;
  /** Whether the torch is currently "on" — bumps glow intensity. */
  torchOn?: boolean;
}

export function PhaseBg({ kind, heatProgress = 0, torchOn = false }: Props) {
  return (
    <View style={styles.fill} pointerEvents="none">
      {kind === 'heat' && <HeatBg progress={heatProgress} torchOn={torchOn} />}
      {kind === 'cool' && <CoolBg />}
      {kind === 'dab' && <DabBg />}
      {kind === 'dunk' && <DunkBg />}
      {kind === 'clean' && <CleanBg />}
      {kind === 'complete' && <CompleteBg />}
    </View>
  );
}

function HeatBg({ progress, torchOn }: { progress: number; torchOn: boolean }) {
  const glow = useSharedValue(0);
  useEffect(() => {
    glow.value = withRepeat(
      withSequence(withTiming(1, { duration: 1800 }), withTiming(0, { duration: 1800 })),
      -1,
      false,
    );
    return () => cancelAnimation(glow);
  }, []);
  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.2 + 0.5 * glow.value * (torchOn ? 1 : 0.4),
    transform: [{ translateY: -6 * glow.value }],
  }));
  return (
    <>
      <Animated.View style={[styles.fill, glowStyle]}>
        <Svg width="100%" height="100%">
          <Defs>
            <SvgRadial id="heat" cx="60%" cy="105%" rx="80%" ry="50%" fx="60%" fy="105%">
              <Stop offset="0" stopColor="#F2A55C" stopOpacity={0.55} />
              <Stop offset="1" stopColor="#F2A55C" stopOpacity={0} />
            </SvgRadial>
          </Defs>
          <Rect x="0" y="0" width="100%" height="100%" fill="url(#heat)" />
        </Svg>
      </Animated.View>
      <View
        style={[
          styles.fillBottom,
          {
            height: `${Math.max(0, Math.min(100, progress * 100))}%`,
            backgroundColor: 'rgba(232, 142, 70, 0.32)',
          },
        ]}
      />
      {torchOn && <Sparks />}
    </>
  );
}

function Sparks() {
  return (
    <View style={styles.fill}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Spark key={i} delay={i * 600} left={`${15 + i * 17}%`} />
      ))}
    </View>
  );
}

function Spark({ delay, left }: { delay: number; left: DimensionValue }) {
  const y = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(withTiming(-700, { duration: 3200, easing: Easing.out(Easing.quad) }), -1, false),
    );
    op.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 600 }),
          withTiming(0, { duration: 2600 }),
        ),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(y);
      cancelAnimation(op);
    };
  }, []);
  const sty = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateY: y.value }],
  }));
  return (
    <Animated.View
      style={[
        sty,
        {
          position: 'absolute',
          bottom: 0,
          left,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#FFC57A',
          shadowColor: '#F2A55C',
          shadowOpacity: 0.8,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 0 },
        },
      ]}
    />
  );
}

function CoolBg() {
  return (
    <>
      <View style={[styles.fill, { backgroundColor: 'rgba(176, 215, 232, 0.35)' }]} />
      {[0, 1, 2, 3, 4].map((i) => (
        <Vapor key={i} delay={i * 1500} left={`${15 + i * 18}%`} />
      ))}
    </>
  );
}

function Vapor({ delay, left }: { delay: number; left: DimensionValue }) {
  const y = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(withTiming(-800, { duration: 8000, easing: Easing.out(Easing.quad) }), -1, false),
    );
    op.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(0.7, { duration: 1500 }), withTiming(0, { duration: 6500 })),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(y);
      cancelAnimation(op);
    };
  }, []);
  const sty = useAnimatedStyle(() => ({
    opacity: op.value,
    transform: [{ translateY: y.value }],
  }));
  return (
    <Animated.View
      style={[
        sty,
        {
          position: 'absolute',
          bottom: -20,
          left,
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: 'rgba(220, 235, 244, 0.65)',
        },
      ]}
    />
  );
}

function DabBg() {
  const s = useSharedValue(0.7);
  useEffect(() => {
    s.value = withRepeat(
      withSequence(withTiming(1.15, { duration: 2200 }), withTiming(0.7, { duration: 2200 })),
      -1,
      false,
    );
    return () => cancelAnimation(s);
  }, []);
  const sty = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: 0.5 }));
  return (
    <Animated.View
      style={[
        sty,
        {
          position: 'absolute',
          left: '-10%',
          top: '10%',
          width: '120%',
          height: '80%',
          borderRadius: 9999,
          backgroundColor: 'rgba(238, 156, 123, 0.32)',
        },
      ]}
    />
  );
}

function DunkBg() {
  return (
    <>
      <View
        style={[
          styles.fill,
          {
            backgroundColor: 'rgba(124, 177, 216, 0.18)',
          },
        ]}
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Bubble key={i} delay={i * 700} left={`${10 + i * 14}%`} size={i % 2 === 0 ? 14 : 22} />
      ))}
    </>
  );
}

function Bubble({ delay, left, size }: { delay: number; left: DimensionValue; size: number }) {
  const y = useSharedValue(0);
  const op = useSharedValue(0);
  useEffect(() => {
    y.value = withDelay(
      delay,
      withRepeat(withTiming(-780, { duration: 5000, easing: Easing.out(Easing.quad) }), -1, false),
    );
    op.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 700 }), withTiming(0, { duration: 4300 })),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(y);
      cancelAnimation(op);
    };
  }, []);
  const sty = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }], opacity: op.value }));
  return (
    <Animated.View
      style={[
        sty,
        {
          position: 'absolute',
          bottom: -30,
          left,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderWidth: 1.2,
          borderColor: 'rgba(124, 177, 216, 0.8)',
        },
      ]}
    />
  );
}

function CleanBg() {
  return (
    <>
      <View style={[styles.fill, { backgroundColor: 'rgba(182, 217, 160, 0.18)' }]} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Speck key={i} delay={i * 500} left={`${8 + i * 13}%`} />
      ))}
    </>
  );
}

function Speck({ delay, left }: { delay: number; left: DimensionValue }) {
  const y = useSharedValue(-10);
  useEffect(() => {
    y.value = withDelay(delay, withRepeat(withTiming(900, { duration: 6500 }), -1, false));
    return () => cancelAnimation(y);
  }, []);
  const sty = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }] }));
  return (
    <Animated.View
      style={[
        sty,
        {
          position: 'absolute',
          top: 0,
          left,
          width: 5,
          height: 5,
          borderRadius: 3,
          backgroundColor: '#C2E1A2',
        },
      ]}
    />
  );
}

function CompleteBg() {
  return (
    <View style={styles.fill}>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Star key={i} delay={i * 400} top={`${10 + (i * 13) % 80}%`} left={`${10 + (i * 17) % 80}%`} />
      ))}
    </View>
  );
}

function Star({ delay, top, left }: { delay: number; top: DimensionValue; left: DimensionValue }) {
  const s = useSharedValue(0.6);
  const op = useSharedValue(0);
  useEffect(() => {
    s.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1.2, { duration: 1700 }), withTiming(0.6, { duration: 1700 })),
        -1,
        false,
      ),
    );
    op.value = withDelay(
      delay,
      withRepeat(
        withSequence(withTiming(1, { duration: 1700 }), withTiming(0, { duration: 1700 })),
        -1,
        false,
      ),
    );
    return () => {
      cancelAnimation(s);
      cancelAnimation(op);
    };
  }, []);
  const sty = useAnimatedStyle(() => ({ transform: [{ scale: s.value }], opacity: op.value }));
  return (
    <Animated.Text
      style={[
        sty,
        {
          position: 'absolute',
          top,
          left,
          fontSize: 16,
          color: '#EE9C7B',
        },
      ]}
    >
      ✦
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  fill: {
    ...(StyleSheet.absoluteFillObject as ViewStyle),
  },
  fillBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
