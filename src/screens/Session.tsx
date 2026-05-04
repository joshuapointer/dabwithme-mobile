import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Bub } from '../components/Bub';
import { Eyebrow, H1, Lede, PhaseStrip } from '../components/ui';
import { PHASE_COPY, PHASES } from '../data/catalog';
import { ble } from '../lib/ble';
import {
  activeBanger,
  activeDabTemp,
  activeHeatSeconds,
  type Action,
  type State,
} from '../store';
import { colors, fonts, radii, shadow } from '../theme';

type PhaseBgKind = 'idle' | 'heat' | 'cool' | 'dab' | 'dunk' | 'clean' | 'complete';
type PhaseBgFn = (kind: PhaseBgKind, extra?: { heatProgress?: number; torchOn?: boolean }) => void;

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
  onPhaseBg: PhaseBgFn;
}

interface RunnerProps {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function SessionScreen({ state, dispatch, onPhaseBg }: Props) {
  const phase = PHASES[state.phaseIdx];
  const copy = PHASE_COPY[phase];

  // Tick session seconds
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: 'tickSession' }), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.wrap}>
      <View style={styles.bubCell}>
        <PhaseBub state={state} dispatch={dispatch} />
      </View>
      <View style={styles.stage}>
        <PhaseStrip count={PHASES.length} current={state.phaseIdx} />
        {phase === 'cool' ? <CoolBanner state={state} dispatch={dispatch} /> : null}
        <Eyebrow>
          {copy.eyebrow} · {fmt(state.sessionSeconds)}
        </Eyebrow>
        <H1>{copy.title}</H1>
        <Lede>{copy.sub}</Lede>
        {phase === 'heat' ? (
          <HeatBanner state={state} dispatch={dispatch} onPhaseBg={onPhaseBg} />
        ) : null}
        {phase === 'dab' ? <DabRunner state={state} dispatch={dispatch} /> : null}
        {phase === 'dunk' ? <DunkRunner state={state} dispatch={dispatch} /> : null}
        {phase === 'clean' ? <CleanRunner state={state} dispatch={dispatch} /> : null}
      </View>
    </View>
  );
}

function fmt(sec: number) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`;
}

function PhaseBub({ state, dispatch }: RunnerProps) {
  const phase = PHASES[state.phaseIdx];
  const copy = PHASE_COPY[phase];
  const onTap = () => {
    // Heat phase: tap-to-skip
    if (phase === 'heat') {
      dispatch({ type: 'setPhase', idx: 1 });
    }
  };
  return <Bub mood={copy.mood} eye={copy.eye} onTap={onTap} />;
}

function HeatBanner({
  state,
  dispatch,
  onPhaseBg,
}: RunnerProps & { onPhaseBg: PhaseBgFn }) {
  const total = activeHeatSeconds(state) || state.heatSecondsLeft || 30;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [torchOn, setTorchOn] = useState(false);
  const heatedMsRef = useRef(0);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    onPhaseBg('heat', { heatProgress: 0, torchOn: false });
    // Subscribe to torch listener (BLE stub fakes "torch on" after grace period).
    const stop = ble.startTorchListener({ graceMs: 1500 });
    const offBus = ble.subscribe((e) => {
      if (e.type === 'torch') setTorchOn(e.on);
    });
    return () => {
      stop();
      offBus();
    };
  }, []);

  // Drive countdown — only ticks while torch is on.
  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      const dt = now - lastTickRef.current;
      lastTickRef.current = now;
      if (torchOn) heatedMsRef.current += dt;
      const left = Math.max(0, Math.ceil(total - heatedMsRef.current / 1000));
      setSecondsLeft(left);
      const progress = Math.min(1, heatedMsRef.current / 1000 / total);
      onPhaseBg('heat', { heatProgress: progress, torchOn });
      if (left <= 0) {
        clearInterval(id);
        const peak = activeDabTemp(state) + 110;
        dispatch({ type: 'setCoolTemp', temp: peak });
        setTimeout(() => dispatch({ type: 'setPhase', idx: 1 }), 280);
      }
    }, 200);
    lastTickRef.current = Date.now();
    return () => clearInterval(id);
  }, [torchOn]);

  return (
    <View style={[styles.heatBanner, torchOn ? styles.heatBannerOn : styles.heatBannerListening]}>
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={[
              styles.heatDot,
              {
                backgroundColor: torchOn ? '#E5762E' : '#7CA3D5',
                shadowColor: torchOn ? '#E5762E' : '#7CA3D5',
              },
            ]}
          />
          <Text style={styles.heatLabel}>{torchOn ? 'torch on' : 'listening'}</Text>
        </View>
        <Text style={styles.heatHint}>
          {torchOn ? 'low · even · sweep' : "spark the torch — i'll start the timer"}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text style={styles.heatNum}>{secondsLeft}</Text>
        <Text style={styles.heatU}>sec</Text>
      </View>
    </View>
  );
}

function CoolBanner({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  const target = activeDabTemp(state);
  const peak = target + 110;
  const [temp, setTemp] = useState(peak);
  const [inWindow, setInWindow] = useState(false);
  const [dwellPct, setDwellPct] = useState(0);
  const [advanced, setAdvanced] = useState(false);
  const inWindowSinceRef = useRef<number | null>(null);
  const DWELL_MS = 1700;

  useEffect(() => {
    const stop = ble.startTempStream({ peakF: peak, dropPerSec: 4 });
    const off = ble.subscribe((e) => {
      if (e.type !== 'temp' || advanced) return;
      const t = e.fahrenheit;
      setTemp(Math.round(t));
      dispatch({ type: 'setCoolTemp', temp: Math.round(t) });
      const inW = t <= target + 15 && t >= target - 15;
      setInWindow(inW);
      if (inW && inWindowSinceRef.current == null) {
        inWindowSinceRef.current = Date.now();
      } else if (!inW) {
        inWindowSinceRef.current = null;
        setDwellPct(0);
      }
      if (inWindowSinceRef.current) {
        const dwell = Date.now() - inWindowSinceRef.current;
        setDwellPct(Math.min(100, (dwell / DWELL_MS) * 100));
        if (dwell >= DWELL_MS) {
          setAdvanced(true);
          stop();
          off();
          ble.reportLifted();
          setTimeout(() => dispatch({ type: 'setPhase', idx: 2 }), 360);
        }
      }
      // Missed the window — auto reheat
      if (t <= target - 30) {
        setAdvanced(true);
        stop();
        off();
        setTimeout(() => dispatch({ type: 'setPhase', idx: 0 }), 480);
      }
    });
    return () => {
      stop();
      off();
    };
  }, []);

  const lifted = dwellPct >= 100;
  return (
    <View
      style={[
        styles.tempBanner,
        inWindow ? styles.tempBannerInWindow : null,
        lifted ? styles.tempBannerLifted : null,
      ]}
    >
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={styles.tempNum}>{temp}</Text>
        <Text style={styles.tempUnit}>°F</Text>
      </View>
      <View style={styles.tempSep} />
      <Text
        style={[
          styles.tempLabel,
          inWindow ? { color: colors.mintDeep, fontWeight: '700' } : null,
          lifted ? { color: colors.accentDeep } : null,
        ]}
      >
        {lifted ? 'lifted' : inWindow ? "lift now — i'll catch it" : temp > target ? 'cooling' : 'too cold'}
      </Text>
      <View style={[styles.tempFill, inWindow ? { opacity: 1 } : null]}>
        <View
          style={[
            styles.tempFillBar,
            { width: `${dwellPct}%` },
            lifted ? { width: '100%', backgroundColor: colors.accent } : null,
          ]}
        />
      </View>
    </View>
  );
}

function DabRunner({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'setPhase', idx: 3 }), 5000);
    return () => clearTimeout(t);
  }, []);
  return null;
}

function DunkRunner({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'setPhase', idx: 4 }), 5000);
    return () => clearTimeout(t);
  }, []);
  return null;
}

function CleanRunner({ state, dispatch }: { state: State; dispatch: React.Dispatch<Action> }) {
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'setStage', stage: 'complete' }), 6000);
    return () => clearTimeout(t);
  }, []);
  return null;
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  bubCell: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  stage: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 8,
  },
  // heat
  heatBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    padding: 14,
    marginTop: 12,
    borderRadius: 18,
    borderWidth: 1,
  },
  heatBannerListening: {
    backgroundColor: 'rgba(220, 232, 244, 0.6)',
    borderColor: 'rgba(124, 163, 213, 0.3)',
  },
  heatBannerOn: {
    backgroundColor: 'rgba(248, 226, 200, 0.8)',
    borderColor: 'rgba(229, 118, 46, 0.4)',
  },
  heatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 0.85,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  heatLabel: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 15,
    color: colors.fg,
  },
  heatHint: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  heatNum: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 30,
    color: colors.fg,
    letterSpacing: -1,
  },
  heatU: {
    fontFamily: fonts.mono,
    fontSize: 9.5,
    fontWeight: '600',
    letterSpacing: 1.8,
    color: colors.muted,
    textTransform: 'uppercase',
  },
  // cool
  tempBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
    ...shadow.soft,
  },
  tempBannerInWindow: {
    borderColor: colors.mint,
    backgroundColor: '#DEF1E6',
  },
  tempBannerLifted: {
    borderColor: colors.accent,
    backgroundColor: '#FCE6D7',
  },
  tempNum: {
    fontFamily: fonts.display,
    fontWeight: '800',
    fontSize: 30,
    letterSpacing: -1.2,
    color: colors.fg,
  },
  tempUnit: {
    fontFamily: fonts.display,
    fontWeight: '700',
    fontSize: 16,
    color: colors.muted,
    marginLeft: 1,
  },
  tempSep: {
    width: 1,
    height: 22,
    backgroundColor: colors.border,
  },
  tempLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.muted,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  tempFill: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EFE5EE',
    overflow: 'hidden',
    marginLeft: 4,
    opacity: 0.6,
  },
  tempFillBar: {
    height: '100%',
    width: 0,
    backgroundColor: colors.mint,
    borderRadius: 3,
  },
});
