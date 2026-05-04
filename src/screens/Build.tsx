import React, { useState, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bub } from '../components/Bub';
import { BangerIllo, ConcIllo, WallIllo } from '../components/Illos';
import { BackChip, Eyebrow, H1, Lede, Mark, Stepper } from '../components/ui';
import {
  BANGER_CATS,
  BANGERS,
  CONC_CATS,
  CONCS,
  WALLS,
  computeDab,
  heatSecondsForBanger,
  type Banger,
  type Concentrate,
} from '../data/catalog';
import { colors, fonts, radii, shadow } from '../theme';
import type { Action, State } from '../store';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function BuildScreen({ state, dispatch }: Props) {
  const step = state.buildStep;
  const onBack = () => {
    if (step === 0) dispatch({ type: 'setStage', stage: 'choose' });
    else dispatch({ type: 'setBuildStep', step: (step - 1) as 0 | 1 | 2 });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.bubCell}>
        <Bub
          mood={step === 3 ? 'eager' : 'curious'}
          eye="wide"
          size="small"
          onHoldComplete={
            step === 3
              ? () => dispatch({ type: 'startSession' })
              : undefined
          }
          holdLabel={step === 3 ? 'hold to light it up' : undefined}
        />
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.stage} showsVerticalScrollIndicator={false}>
        <Stepper
          count={4}
          current={step}
          onJump={(i) => dispatch({ type: 'setBuildStep', step: i as 0 | 1 | 2 | 3 })}
        />
        <BackChip label={step === 0 ? 'home' : 'back'} onPress={onBack} />

        {step === 0 && <BangerStep state={state} dispatch={dispatch} />}
        {step === 1 && <ConcStep state={state} dispatch={dispatch} />}
        {step === 2 && <WallStep state={state} dispatch={dispatch} />}
        {step === 3 && <ReviewStep state={state} />}
      </ScrollView>
    </View>
  );
}

function BangerStep({ state, dispatch }: Props) {
  const [cat, setCat] = useState<typeof BANGER_CATS[number]['id']>('all');
  const items = cat === 'all' ? BANGERS : BANGERS.filter((b) => b.cat === cat);
  return (
    <>
      <Eyebrow>step 1 of 4 · banger</Eyebrow>
      <H1>what&apos;s on the rig?</H1>
      <Lede>wall + material set the heat curve. swipe through and tap the closest match.</Lede>

      <CategoryRow
        cats={BANGER_CATS}
        active={cat}
        onPick={(id) => setCat(id as any)}
      />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {items.map((b) => {
          const selected = state.bangerId === b.id;
          return (
            <Pressable
              key={b.id}
              onPress={() => {
                dispatch({ type: 'pickBanger', id: b.id });
                setTimeout(() => dispatch({ type: 'setBuildStep', step: 1 }), 360);
              }}
              style={[styles.carouselOpt, selected ? styles.optSelected : null]}
            >
              <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <BangerIllo id={b.id} size={92} />
              </View>
              <Text style={styles.optName}>{b.name}</Text>
              <Text style={styles.optMeta}>{b.meta}</Text>
              {selected ? <SelectedDot /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

function ConcStep({ state, dispatch }: Props) {
  const [cat, setCat] = useState<typeof CONC_CATS[number]['id']>('all');
  const items = cat === 'all' ? CONCS : CONCS.filter((c) => c.cat === cat);
  return (
    <>
      <Eyebrow>step 2 of 4 · concentrate</Eyebrow>
      <H1>
        what are we <Mark>dabbing</Mark>?
      </H1>
      <Lede>each one wants a different heat. pick yours and i&apos;ll set the window.</Lede>

      <CategoryRow cats={CONC_CATS} active={cat} onPick={(id) => setCat(id as any)} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
        {items.map((c) => {
          const selected = state.concId === c.id;
          return (
            <Pressable
              key={c.id}
              onPress={() => {
                dispatch({ type: 'pickConc', id: c.id });
                setTimeout(() => dispatch({ type: 'setBuildStep', step: 2 }), 360);
              }}
              style={[styles.carouselOpt, selected ? styles.optSelected : null]}
            >
              <View style={{ width: 100, height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <ConcIllo id={c.id} size={92} />
              </View>
              <Text style={styles.optName}>{c.name}</Text>
              <Text style={styles.optMeta}>
                <Text style={styles.optMetaStrong}>{c.meta}</Text> · {c.blurb}
              </Text>
              {selected ? <SelectedDot /> : null}
            </Pressable>
          );
        })}
      </ScrollView>
    </>
  );
}

function WallStep({ state, dispatch }: Props) {
  return (
    <>
      <Eyebrow>step 3 of 4 · wall</Eyebrow>
      <H1>how thick is the wall?</H1>
      <Lede>guesstimate is fine. just refines the cool-down clock.</Lede>

      <View style={styles.wallGrid}>
        {WALLS.map((w) => {
          const selected = state.wallId === w.id;
          return (
            <Pressable
              key={w.id}
              onPress={() => {
                dispatch({ type: 'pickWall', id: w.id });
                setTimeout(() => dispatch({ type: 'setBuildStep', step: 3 }), 320);
              }}
              style={[styles.wallOpt, selected ? styles.optSelected : null]}
            >
              <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}>
                <WallIllo id={w.id} size={56} />
              </View>
              <Text style={styles.wallName}>{w.name.split(' ')[0]}</Text>
              <Text style={styles.wallMeta}>{w.meta}</Text>
            </Pressable>
          );
        })}
      </View>
    </>
  );
}

function ReviewStep({ state }: { state: State }) {
  const b = useMemo(() => BANGERS.find((x) => x.id === state.bangerId) ?? null, [state.bangerId]);
  const c = useMemo(() => CONCS.find((x) => x.id === state.concId) ?? null, [state.concId]);
  const w = useMemo(() => WALLS.find((x) => x.id === state.wallId) ?? null, [state.wallId]);
  const dab = computeDab(c, b, w);
  const dunk = Math.round(dab * 0.45);
  const heat = heatSecondsForBanger(b);

  return (
    <>
      <Eyebrow>step 4 of 4 · check</Eyebrow>
      <H1>all set?</H1>
      <Lede>
        press &amp; hold <Mark>bub</Mark> to start the sesh.
      </Lede>

      <View style={styles.reviewPair}>
        <View style={styles.reviewCell}>
          {b ? <BangerIllo id={b.id} size={76} /> : null}
          <Text style={styles.reviewName}>{b?.name ?? '—'}</Text>
          <Text style={styles.reviewMeta}>{b?.meta ?? ''}</Text>
        </View>
        <Text style={styles.plus}>+</Text>
        <View style={styles.reviewCell}>
          {c ? <ConcIllo id={c.id} size={76} /> : null}
          <Text style={styles.reviewName}>{c?.name ?? '—'}</Text>
          <Text style={styles.reviewMeta}>{c?.blurb ?? ''}</Text>
        </View>
      </View>

      <View style={styles.tempRow}>
        <View style={styles.tempCell}>
          <Text style={styles.tempNum}>{dab}°</Text>
          <Text style={styles.tempLbl}>dab @</Text>
        </View>
        <View style={styles.tempCell}>
          <Text style={styles.tempNum}>{dunk}°</Text>
          <Text style={styles.tempLbl}>dunk @</Text>
        </View>
        <View style={styles.tempCell}>
          <Text style={styles.tempNum}>{heat}s</Text>
          <Text style={styles.tempLbl}>torch</Text>
        </View>
      </View>
    </>
  );
}

function CategoryRow<T extends string>({
  cats,
  active,
  onPick,
}: {
  cats: { id: T; label: string }[];
  active: T;
  onPick: (id: T) => void;
}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
      {cats.map((c) => {
        const a = c.id === active;
        return (
          <Pressable
            key={c.id}
            onPress={() => onPick(c.id)}
            style={[styles.catChip, a ? styles.catChipActive : null]}
          >
            <Text style={[styles.catChipText, a ? styles.catChipTextActive : null]}>{c.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

function SelectedDot() {
  return (
    <View style={styles.selectedDot}>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12, lineHeight: 14 }}>✓</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  bubCell: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  stage: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    gap: 8,
  },
  catRow: {
    paddingVertical: 8,
    gap: 6,
  },
  catChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(248, 240, 247, 0.6)',
  },
  catChipActive: {
    backgroundColor: colors.fg,
    borderColor: colors.fg,
  },
  catChipText: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  catChipTextActive: {
    color: colors.bg,
  },
  carousel: {
    gap: 12,
    paddingVertical: 14,
    paddingRight: 24,
  },
  carouselOpt: {
    width: 168,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 14,
    alignItems: 'center',
    ...shadow.soft,
  },
  optSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  optName: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 14,
    color: colors.fg,
    letterSpacing: -0.2,
    marginBottom: 4,
    marginTop: 8,
    textAlign: 'center',
  },
  optMeta: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  optMetaStrong: {
    color: colors.accentDeep,
    fontWeight: '700',
  },
  selectedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wallGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  wallOpt: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 22,
    paddingHorizontal: 10,
    paddingVertical: 14,
    alignItems: 'center',
    ...shadow.soft,
  },
  wallName: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 13.5,
    color: colors.fg,
    marginTop: 8,
  },
  wallMeta: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    color: colors.muted,
    marginTop: 2,
    textAlign: 'center',
  },
  reviewPair: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 14,
    ...shadow.soft,
  },
  reviewCell: {
    flex: 1,
    alignItems: 'center',
  },
  reviewName: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 13,
    color: colors.fg,
    textAlign: 'center',
    marginTop: 6,
  },
  reviewMeta: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginTop: 3,
    textAlign: 'center',
  },
  plus: {
    fontFamily: fonts.display,
    fontWeight: '300',
    fontSize: 28,
    color: colors.accent,
    paddingHorizontal: 4,
  },
  tempRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
  },
  tempCell: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.small,
    paddingVertical: 10,
    alignItems: 'center',
    ...shadow.soft,
  },
  tempNum: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 22,
    color: colors.fg,
    letterSpacing: -1,
  },
  tempLbl: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
    marginTop: 4,
  },
});
