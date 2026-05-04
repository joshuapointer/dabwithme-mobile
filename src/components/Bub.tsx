import React, { useEffect, useImperativeHandle, useMemo, useRef, forwardRef } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, RadialGradient, Stop, G, Path } from 'react-native-svg';
import { colors } from '../theme';
import type { EyeState, Mood } from '../data/catalog';

// Mood -> { core, edge, halo } colors. Hex approximations of the OKLCH set in
// the brand spec — close enough that the warmth/coolness reads correctly.
const moodColors: Record<Mood, { core: string; edge: string; halo: string }> = {
  idle: { core: '#F1B898', edge: '#E8DAE8', halo: 'rgba(232, 188, 168, 0.4)' },
  curious: { core: '#EFA683', edge: '#E5D2E0', halo: 'rgba(238, 156, 123, 0.45)' },
  eager: { core: '#EC9A75', edge: '#E5D6E0', halo: 'rgba(238, 154, 117, 0.55)' },
  heat: { core: '#E26B3D', edge: '#F1A467', halo: 'rgba(226, 107, 61, 0.85)' },
  cool: { core: '#7CCFB1', edge: '#B0DFD2', halo: 'rgba(124, 207, 177, 0.55)' },
  dab: { core: '#E8825E', edge: '#E5BFD5', halo: 'rgba(232, 130, 94, 0.7)' },
  dunk: { core: '#7CB1D8', edge: '#B7CCE2', halo: 'rgba(124, 177, 216, 0.55)' },
  clean: { core: '#B6D9A0', edge: '#D6E5C7', halo: 'rgba(182, 217, 160, 0.5)' },
  done: { core: '#C9A0DC', edge: '#DEC9E8', halo: 'rgba(201, 160, 220, 0.65)' },
};

const sizeMap = {
  default: 220,
  small: 170,
  tiny: 130,
} as const;

export type BubSize = keyof typeof sizeMap;

export interface BubHandle {
  poke: () => void;
}

interface Props {
  mood: Mood;
  eye?: EyeState;
  size?: BubSize;
  onTap?: () => void;
  onHoldComplete?: () => void;
  holdLabel?: string;
  /** Override body colors mid-phase (e.g. cool phase tracks live temp). */
  tintOverride?: { core: string; edge: string; halo: string };
}

const HOLD_MS = 720;
const RING_R = 0.5; // relative — drawn as svg circle radius factor

export const Bub = forwardRef<BubHandle, Props>(function Bub(
  { mood, eye = 'default', size = 'default', onTap, onHoldComplete, holdLabel, tintOverride },
  ref,
) {
  const px = sizeMap[size];

  // Idle wobble (rotate -2.5° to 2.5° over 4.5s)
  const wobble = useSharedValue(0);
  // Breathe (scale 1 -> 0.97 -> 1 over 3.2s)
  const breathe = useSharedValue(1);
  // Squish on tap
  const squish = useSharedValue(0);
  // Blink — scaleY of eyes
  const blink = useSharedValue(1);
  // Hold ring progress 0..1
  const hold = useSharedValue(0);

  useEffect(() => {
    wobble.value = withRepeat(
      withSequence(
        withTiming(-2.5, { duration: 2250, easing: Easing.inOut(Easing.sin) }),
        withTiming(2.5, { duration: 2250, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    breathe.value = withRepeat(
      withSequence(
        withTiming(0.97, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
    return () => {
      cancelAnimation(wobble);
      cancelAnimation(breathe);
    };
  }, []);

  // Random blink loop
  useEffect(() => {
    let alive = true;
    function scheduleBlink() {
      const next = 3500 + Math.random() * 2500;
      const t = setTimeout(() => {
        if (!alive) return;
        blink.value = withSequence(
          withTiming(0.05, { duration: 60 }),
          withTiming(1, { duration: 80 }),
        );
        scheduleBlink();
      }, next);
      return t;
    }
    const t0 = setTimeout(() => scheduleBlink(), 2000);
    return () => {
      alive = false;
      clearTimeout(t0);
    };
  }, []);

  // Hold gesture
  const holdRaf = useRef<number | null>(null);
  const holdStart = useRef<number | null>(null);
  const consumed = useRef(false);

  const cancelHold = () => {
    if (holdRaf.current != null) {
      cancelAnimationFrame(holdRaf.current);
      holdRaf.current = null;
    }
    holdStart.current = null;
    hold.value = withTiming(0, { duration: 240 });
  };

  const startHold = () => {
    if (!onHoldComplete) return;
    holdStart.current = Date.now();
    consumed.current = false;
    const tick = () => {
      if (holdStart.current == null) return;
      const pct = Math.min(1, (Date.now() - holdStart.current) / HOLD_MS);
      hold.value = pct;
      if (pct >= 1) {
        consumed.current = true;
        holdStart.current = null;
        holdRaf.current = null;
        squish.value = withSequence(
          withTiming(1, { duration: 160, easing: Easing.bezierFn(0.34, 1.56, 0.64, 1) }),
          withTiming(0, { duration: 320, easing: Easing.bezierFn(0.34, 1.56, 0.64, 1) }),
        );
        onHoldComplete();
        setTimeout(() => {
          hold.value = withTiming(0, { duration: 200 });
        }, 200);
        return;
      }
      holdRaf.current = requestAnimationFrame(tick);
    };
    holdRaf.current = requestAnimationFrame(tick);
  };

  const handleTap = () => {
    if (consumed.current) {
      consumed.current = false;
      return;
    }
    squish.value = withSequence(
      withTiming(1, { duration: 160, easing: Easing.bezierFn(0.34, 1.56, 0.64, 1) }),
      withTiming(0, { duration: 320, easing: Easing.bezierFn(0.34, 1.56, 0.64, 1) }),
    );
    onTap?.();
  };

  useImperativeHandle(ref, () => ({
    poke: handleTap,
  }), []);

  const wrapStyle = useAnimatedStyle(() => {
    // Squish: at peak (squish=1), scaleY 0.86 / scaleX 1.10
    const scaleY = 1 - squish.value * 0.14 + (squish.value > 0.5 ? (squish.value - 0.5) * 0.1 : 0);
    const scaleX = 1 + squish.value * 0.10 - (squish.value > 0.5 ? (squish.value - 0.5) * 0.08 : 0);
    return {
      transform: [
        { rotate: `${wobble.value}deg` },
        { scale: breathe.value },
        { scaleX },
        { scaleY },
      ],
    };
  });

  const eyeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleY: blink.value }],
    };
  });

  const ringStyle = useAnimatedStyle(() => {
    return {
      opacity: hold.value > 0 ? 1 : 0,
    };
  });

  const tint = tintOverride ?? moodColors[mood];

  // Eye style mappings
  const eyeMod = useMemo(() => {
    switch (eye) {
      case 'wide':
        return { scale: 1.2, opacity: 1, height: 1.3, kind: 'oval' as const };
      case 'surprised':
        return { scale: 1.3, opacity: 1, height: 1.0, kind: 'oval' as const };
      case 'concentrating':
        return { scale: 0.95, opacity: 1, height: 0.12, kind: 'line' as const };
      case 'happy':
      case 'tidy':
        return { scale: 1.0, opacity: 1, height: 0.5, kind: 'arc' as const };
      case 'starry':
        return { scale: 1.0, opacity: 1, height: 1.0, kind: 'starry' as const };
      default:
        return { scale: 1.0, opacity: 1, height: 1.3, kind: 'oval' as const };
    }
  }, [eye]);

  const eyeWidth = 0.12 * px;
  const eyeHeight = eyeWidth * eyeMod.height * eyeMod.scale;

  return (
    <View style={[styles.cell, { width: px + 80, height: px + 80 }]}>
      {/* Hold ring — SVG circle whose stroke-dasharray fills around Bub */}
      <Animated.View style={[styles.ring, ringStyle, { width: px + 60, height: px + 60 }]} pointerEvents="none">
        <HoldRing pct={hold} size={px + 60} color={colors.accent} dim={colors.border} />
      </Animated.View>

      <Pressable
        onPressIn={startHold}
        onPressOut={cancelHold}
        onPress={handleTap}
        hitSlop={20}
        style={{ width: px, height: px }}
      >
        <Animated.View style={[styles.body, { width: px, height: px }, wrapStyle]}>
          {/* Halo behind */}
          <View style={[styles.halo, { backgroundColor: tint.halo, width: px + 56, height: px + 56, top: -28, left: -28 }]} />
          {/* Body sphere */}
          <Svg width={px} height={px} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="hi" cx="32" cy="28" rx="36" ry="36" fx="32" fy="28">
                <Stop offset="0" stopColor="#FFFCFD" stopOpacity={0.95} />
                <Stop offset="0.5" stopColor="#FFFCFD" stopOpacity={0} />
              </RadialGradient>
              <RadialGradient id="core" cx="65" cy="72" rx="60" ry="60" fx="65" fy="72">
                <Stop offset="0" stopColor={tint.core} stopOpacity={1} />
                <Stop offset="0.7" stopColor={tint.edge} stopOpacity={1} />
                <Stop offset="1" stopColor={tint.edge} stopOpacity={1} />
              </RadialGradient>
            </Defs>
            <Circle cx="50" cy="50" r="50" fill="url(#core)" />
            <Circle cx="50" cy="50" r="50" fill="url(#hi)" />
            {/* Cheeks */}
            <Circle cx="22" cy="62" r="6" fill="#EE9C7B" opacity={0.45} />
            <Circle cx="78" cy="62" r="6" fill="#EE9C7B" opacity={0.45} />
          </Svg>

          {/* Eyes layer */}
          <View style={[styles.face, { paddingTop: 0.06 * px }]}>
            <Eye
              x={px}
              width={eyeWidth}
              height={eyeHeight}
              kind={eyeMod.kind}
              animatedStyle={eyeStyle}
            />
            <View style={{ width: 0.12 * px }} />
            <Eye
              x={px}
              width={eyeWidth}
              height={eyeHeight}
              kind={eyeMod.kind}
              animatedStyle={eyeStyle}
            />
          </View>

          {/* Mouth — only on certain moods */}
          {(eye === 'happy' || eye === 'tidy' || eye === 'starry') && (
            <View
              style={{
                position: 'absolute',
                bottom: '30%',
                left: '50%',
                width: 0.18 * px,
                height: 0.08 * px,
                marginLeft: -0.09 * px,
                borderBottomWidth: 2,
                borderColor: '#3F3447',
                borderBottomLeftRadius: 0.12 * px,
                borderBottomRightRadius: 0.12 * px,
                opacity: 0.7,
              }}
            />
          )}
          {eye === 'surprised' && (
            <View
              style={{
                position: 'absolute',
                bottom: '30%',
                left: '50%',
                width: 0.08 * px,
                height: 0.08 * px,
                marginLeft: -0.04 * px,
                borderRadius: 100,
                borderWidth: 2,
                borderColor: '#3F3447',
                opacity: 0.7,
              }}
            />
          )}
        </Animated.View>
      </Pressable>

      {holdLabel ? (
        <View style={styles.hint}>
          <Text style={styles.hintText}>{holdLabel}</Text>
        </View>
      ) : null}
    </View>
  );
});

function Eye({
  width,
  height,
  kind,
  animatedStyle,
}: {
  x: number;
  width: number;
  height: number;
  kind: 'oval' | 'line' | 'arc' | 'starry';
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
}) {
  if (kind === 'starry') {
    return (
      <Animated.View style={[{ width, height }, animatedStyle]}>
        <Text style={{ fontSize: width * 1.4, color: '#D17855', textAlign: 'center', lineHeight: width * 1.6 }}>✦</Text>
      </Animated.View>
    );
  }
  if (kind === 'arc') {
    return (
      <Animated.View
        style={[
          {
            width: width * 1.5,
            height: height * 1.4,
            borderBottomWidth: 2.5,
            borderColor: '#312640',
            borderBottomLeftRadius: width,
            borderBottomRightRadius: width,
          },
          animatedStyle,
        ]}
      />
    );
  }
  if (kind === 'line') {
    return (
      <Animated.View
        style={[
          {
            width,
            height: Math.max(2, height),
            backgroundColor: '#312640',
            borderRadius: 2,
          },
          animatedStyle,
        ]}
      />
    );
  }
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: '#312640',
          borderRadius: width,
          overflow: 'hidden',
        },
        animatedStyle,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          top: '18%',
          left: '28%',
          width: '32%',
          height: '32%',
          borderRadius: width / 2,
          backgroundColor: 'rgba(255,255,255,0.85)',
        }}
      />
    </Animated.View>
  );
}

function HoldRing({
  pct,
  size,
  color,
  dim,
}: {
  pct: SharedValue<number>;
  size: number;
  color: string;
  dim: string;
}) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={dim} strokeWidth={4} fill="none" />
        <RingArc cx={size / 2} cy={size / 2} r={r} c={c} pct={pct} color={color} />
      </Svg>
    </View>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function RingArc({
  cx,
  cy,
  r,
  c,
  pct,
  color,
}: {
  cx: number;
  cy: number;
  r: number;
  c: number;
  pct: SharedValue<number>;
  color: string;
}) {
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: c * (1 - pct.value),
  }));
  return (
    <AnimatedCircle
      cx={cx}
      cy={cy}
      r={r}
      stroke={color}
      strokeWidth={4}
      fill="none"
      strokeDasharray={`${c} ${c}`}
      strokeLinecap="round"
      transform={`rotate(-90 ${cx} ${cy})`}
      animatedProps={animatedProps}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.9,
  },
  face: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    position: 'absolute',
    bottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 240, 230, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(208, 130, 100, 0.6)',
    borderStyle: 'dashed',
  },
  hintText: {
    fontFamily: colors.fg, // placeholder, overridden inline below
    fontSize: 10,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: '#C97455',
    fontWeight: '700',
  },
});
