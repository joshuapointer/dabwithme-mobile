import React from 'react';
import { Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import { colors, fonts, radii, shadow } from '../theme';

export function Eyebrow({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.eyebrow, style]}>{children}</Text>;
}

export function H1({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.h1, style]}>{children}</Text>;
}

export function Mark({ children }: { children: React.ReactNode }) {
  return <Text style={{ color: colors.accent }}>{children}</Text>;
}

export function Lede({ children, style }: { children: React.ReactNode; style?: TextStyle }) {
  return <Text style={[styles.lede, style]}>{children}</Text>;
}

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({ children, onPress, variant = 'primary', disabled, style }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'ghost' ? styles.btnGhost : styles.btnPrimary,
        pressed ? { transform: [{ scaleY: 0.92 }, { scaleX: 1.02 }] } : null,
        disabled ? { opacity: 0.55 } : null,
        style,
      ]}
    >
      <Text style={[styles.btnText, variant === 'ghost' ? { color: colors.fg } : { color: '#FFFEFD' }]}>
        {children}
      </Text>
    </Pressable>
  );
}

interface CardProps {
  onPress?: () => void;
  selected?: boolean;
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ onPress, selected, children, style }: CardProps) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper
      onPress={onPress}
      style={({ pressed }: any) => [
        styles.card,
        selected ? styles.cardSelected : null,
        pressed ? { transform: [{ scale: 0.98 }] } : null,
        style,
      ]}
    >
      {children}
    </Wrapper>
  );
}

export function Pill({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'peach' | 'mint' | 'butter' | 'lilac';
  children: React.ReactNode;
}) {
  const tones: Record<string, { bg: string; fg: string }> = {
    neutral: { bg: '#F0E8F0', fg: colors.muted },
    peach: { bg: '#FCE5D7', fg: colors.accentDeep },
    mint: { bg: '#D7EDDF', fg: colors.mintDeep },
    butter: { bg: '#F5EBC2', fg: '#9A7A22' },
    lilac: { bg: '#E5D5EE', fg: '#6D4D88' },
  };
  const t = tones[tone] ?? tones.neutral;
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }]}>
      <Text style={[styles.pillText, { color: t.fg }]}>{children}</Text>
    </View>
  );
}

export function Stepper({
  count,
  current,
  onJump,
}: {
  count: number;
  current: number;
  onJump?: (i: number) => void;
}) {
  return (
    <View style={styles.stepper}>
      {Array.from({ length: count }).map((_, i) => (
        <Pressable
          key={i}
          onPress={() => (i < current && onJump ? onJump(i) : null)}
          style={[
            styles.stepDot,
            i < current ? styles.stepDone : null,
            i === current ? styles.stepCurrent : null,
          ]}
        />
      ))}
    </View>
  );
}

export function PhaseStrip({ count, current }: { count: number; current: number }) {
  return (
    <View style={styles.phaseStrip}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.phaseStep,
            i < current ? styles.stepDone : null,
            i === current ? styles.stepCurrent : null,
          ]}
        />
      ))}
    </View>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <View style={styles.divider}>
      <View style={styles.rule} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.rule} />
    </View>
  );
}

export function BackChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.backChip}>
      <Text style={styles.backChipText}>‹  {label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  h1: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 30,
    lineHeight: 32,
    letterSpacing: -1,
    color: colors.fg,
  },
  lede: {
    fontFamily: fonts.body,
    fontSize: 14.5,
    lineHeight: 22,
    color: colors.muted,
  },
  btn: {
    minHeight: 52,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnPrimary: {
    backgroundColor: colors.accent,
    ...shadow.pop,
  },
  btnGhost: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  btnText: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.soft,
  },
  cardSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  stepper: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  stepDot: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  stepDone: {
    backgroundColor: colors.accent,
  },
  stepCurrent: {
    backgroundColor: colors.accent,
    opacity: 0.7,
  },
  phaseStrip: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 14,
  },
  phaseStep: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  rule: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerLabel: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  backChip: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingRight: 4,
    marginBottom: 6,
  },
  backChipText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.muted,
  },
});
