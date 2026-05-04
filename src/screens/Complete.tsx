import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Bub } from '../components/Bub';
import { Icon } from '../components/Illos';
import { Eyebrow, H1, Lede, Mark } from '../components/ui';
import { activeDabTemp, type Action, type State } from '../store';
import { colors, fonts, shadow } from '../theme';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function CompleteScreen({ state, dispatch }: Props) {
  const sec = state.sessionSeconds;
  const timer = `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
  const target = activeDabTemp(state);

  return (
    <View style={styles.wrap}>
      <View style={styles.bubCell}>
        <Bub mood="done" eye="starry" size="small" />
      </View>
      <View style={styles.stage}>
        <Eyebrow>sesh logged</Eyebrow>
        <H1>
          that was <Mark>nice</Mark>.
        </H1>
        <Lede>
          i saved it. you can pull up this exact sesh from the home screen any time — or tweak it.
        </Lede>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{timer}</Text>
            <Text style={styles.statLbl}>time on rig</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNum}>{target}°</Text>
            <Text style={styles.statLbl}>dab @</Text>
          </View>
        </View>

        <View style={styles.finishRow}>
          <Pressable
            style={[styles.finishCard, { backgroundColor: colors.surface }]}
            onPress={() => dispatch({ type: 'setStage', stage: 'choose' })}
          >
            <View style={[styles.finishIcon, { backgroundColor: '#FCE5D7' }]}>
              <Icon name="plus" size={18} color={colors.accentDeep} />
            </View>
            <Text style={styles.finishTitle}>another one</Text>
            <Text style={styles.finishSub}>same banger, same hash</Text>
          </Pressable>
          <Pressable
            style={[styles.finishCard, { backgroundColor: colors.surface }]}
            onPress={() => {
              dispatch({ type: 'setStage', stage: 'choose' });
            }}
          >
            <View style={[styles.finishIcon, { backgroundColor: '#E5D5EE' }]}>
              <Icon name="home" size={18} color="#6D4D88" />
            </View>
            <Text style={styles.finishTitle}>back home</Text>
            <Text style={styles.finishSub}>pick a different sesh</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  bubCell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 220,
  },
  stage: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: 'center',
    ...shadow.soft,
  },
  statNum: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 26,
    color: colors.fg,
    letterSpacing: -1,
  },
  statLbl: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  finishRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 'auto',
    paddingBottom: 12,
  },
  finishCard: {
    flex: 1,
    padding: 14,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
    ...shadow.soft,
  },
  finishIcon: {
    width: 36,
    height: 36,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  finishTitle: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 14.5,
    color: colors.fg,
  },
  finishSub: {
    fontSize: 11.5,
    color: colors.muted,
    lineHeight: 15,
  },
});
