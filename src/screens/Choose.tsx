import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bub } from '../components/Bub';
import { Glyph, Icon } from '../components/Illos';
import { Card, Divider, Eyebrow, H1, Mark, Pill } from '../components/ui';
import { SESHES } from '../data/catalog';
import { colors, fonts } from '../theme';
import type { Action, State } from '../store';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function ChooseScreen({ dispatch }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.bubCell}>
        <Bub mood="curious" eye="wide" size="small" />
      </View>
      <View style={styles.stage}>
        <Eyebrow>ready when you are</Eyebrow>
        <H1>
          pick a <Mark>sesh</Mark>.
        </H1>
        <ScrollView style={styles.list} contentContainerStyle={{ gap: 10, paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          <Card onPress={() => dispatch({ type: 'startBuild' })}>
            <Glyph tone="peach">
              <Icon name="plus" size={22} />
            </Glyph>
            <View style={{ flex: 1, paddingHorizontal: 14 }}>
              <Text style={styles.title}>a fresh sesh</Text>
              <Text style={styles.sub}>tell me your banger and what you&apos;re dabbing.</Text>
            </View>
            <Text style={styles.chev}>›</Text>
          </Card>

          <Divider label="your saved seshes" />

          {SESHES.map((p) => (
            <Card key={p.id} onPress={() => dispatch({ type: 'applyPreset', id: p.id })}>
              <Glyph tone={p.glyph}>
                <Icon name={p.icon} size={22} />
              </Glyph>
              <View style={{ flex: 1, paddingHorizontal: 14, gap: 4 }}>
                <Text style={styles.title}>{p.name}</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <Pill tone={p.glyph}>dab {p.dab}°</Pill>
                  <Pill>dunk {p.dunk}°</Pill>
                </View>
                <Text style={styles.sub} numberOfLines={1}>
                  {p.sub}
                </Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Card>
          ))}
        </ScrollView>
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
    gap: 8,
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
  title: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 15.5,
    color: colors.fg,
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 12.5,
    color: colors.muted,
    lineHeight: 16,
  },
  chev: {
    fontSize: 22,
    color: colors.muted,
    opacity: 0.7,
    paddingHorizontal: 4,
  },
});
