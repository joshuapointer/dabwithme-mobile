import { useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { computeDab, heatSecondsForBanger, BANGERS, CONCS, SESHES, WALLS } from './data/catalog';

const STORAGE_KEY = 'dabwithme.flow.state.v1';

export type Stage = 'connect' | 'choose' | 'build' | 'session' | 'complete';

export interface State {
  stage: Stage;
  connected: boolean;
  scanning: boolean;
  buildStep: 0 | 1 | 2 | 3;
  bangerId: string | null;
  concId: string | null;
  wallId: string;
  activePresetId: string | null;
  phaseIdx: number;
  sessionSeconds: number;
  heatSecondsLeft: number;
  coolTemp: number;
  hydrated: boolean;
}

export const initialState: State = {
  stage: 'connect',
  connected: false,
  scanning: false,
  buildStep: 0,
  bangerId: null,
  concId: null,
  wallId: 'standard',
  activePresetId: null,
  phaseIdx: 0,
  sessionSeconds: 0,
  heatSecondsLeft: 30,
  coolTemp: 0,
  hydrated: false,
};

export type Action =
  | { type: 'hydrate'; payload: Partial<State> }
  | { type: 'setStage'; stage: Stage }
  | { type: 'startScan' }
  | { type: 'connected' }
  | { type: 'disconnect' }
  | { type: 'startBuild' }
  | { type: 'setBuildStep'; step: 0 | 1 | 2 | 3 }
  | { type: 'pickBanger'; id: string }
  | { type: 'pickConc'; id: string }
  | { type: 'pickWall'; id: string }
  | { type: 'applyPreset'; id: string }
  | { type: 'startSession' }
  | { type: 'setPhase'; idx: number }
  | { type: 'tickSession' }
  | { type: 'setHeatLeft'; seconds: number }
  | { type: 'setCoolTemp'; temp: number }
  | { type: 'reset' };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'hydrate':
      return { ...s, ...a.payload, hydrated: true };
    case 'setStage':
      return { ...s, stage: a.stage };
    case 'startScan':
      return { ...s, scanning: true };
    case 'connected':
      return { ...s, scanning: false, connected: true, stage: 'choose' };
    case 'disconnect':
      return {
        ...s,
        connected: false,
        scanning: false,
        activePresetId: null,
        bangerId: null,
        concId: null,
        stage: 'connect',
      };
    case 'startBuild':
      return {
        ...s,
        activePresetId: null,
        bangerId: null,
        concId: null,
        wallId: 'standard',
        buildStep: 0,
        stage: 'build',
      };
    case 'setBuildStep':
      return { ...s, buildStep: a.step };
    case 'pickBanger':
      return { ...s, bangerId: a.id };
    case 'pickConc':
      return { ...s, concId: a.id };
    case 'pickWall':
      return { ...s, wallId: a.id };
    case 'applyPreset': {
      const p = SESHES.find((x) => x.id === a.id);
      if (!p) return s;
      return {
        ...s,
        activePresetId: a.id,
        bangerId: p.banger,
        concId: p.conc,
        wallId: 'standard',
        phaseIdx: 0,
        sessionSeconds: 0,
        heatSecondsLeft: heatSecondsForBanger(BANGERS.find((b) => b.id === p.banger) ?? null),
        stage: 'session',
      };
    }
    case 'startSession': {
      const b = BANGERS.find((x) => x.id === s.bangerId) ?? null;
      return {
        ...s,
        phaseIdx: 0,
        sessionSeconds: 0,
        heatSecondsLeft: heatSecondsForBanger(b),
        stage: 'session',
      };
    }
    case 'setPhase':
      return { ...s, phaseIdx: a.idx };
    case 'tickSession':
      return { ...s, sessionSeconds: s.sessionSeconds + 1 };
    case 'setHeatLeft':
      return { ...s, heatSecondsLeft: a.seconds };
    case 'setCoolTemp':
      return { ...s, coolTemp: a.temp };
    case 'reset':
      return { ...initialState, hydrated: true };
    default:
      return s;
  }
}

export function useAppState() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Hydrate once on mount
  useEffect(() => {
    let alive = true;
    AsyncStorage.getItem(STORAGE_KEY).then((raw) => {
      if (!alive) return;
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          dispatch({ type: 'hydrate', payload: parsed });
          return;
        } catch {}
      }
      dispatch({ type: 'hydrate', payload: {} });
    });
    return () => {
      alive = false;
    };
  }, []);

  // Persist on every change once hydrated.
  useEffect(() => {
    if (!state.hydrated) return;
    const { hydrated, ...rest } = state;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(rest)).catch(() => {});
  }, [state]);

  return [state, dispatch] as const;
}

export function activeBanger(s: State) {
  if (s.activePresetId) {
    const p = SESHES.find((x) => x.id === s.activePresetId);
    if (p) return BANGERS.find((b) => b.id === p.banger) ?? null;
  }
  return BANGERS.find((b) => b.id === s.bangerId) ?? null;
}

export function activeConc(s: State) {
  if (s.activePresetId) {
    const p = SESHES.find((x) => x.id === s.activePresetId);
    if (p) return CONCS.find((c) => c.id === p.conc) ?? null;
  }
  return CONCS.find((c) => c.id === s.concId) ?? null;
}

export function activeDabTemp(s: State): number {
  const preset = SESHES.find((x) => x.id === s.activePresetId);
  if (preset) return preset.dab;
  const w = WALLS.find((w) => w.id === s.wallId) ?? null;
  return computeDab(activeConc(s), activeBanger(s), w);
}

export function activeDunkTemp(s: State): number {
  const preset = SESHES.find((x) => x.id === s.activePresetId);
  if (preset) return preset.dunk;
  return Math.round(activeDabTemp(s) * 0.45);
}

export function activeHeatSeconds(s: State): number {
  return heatSecondsForBanger(activeBanger(s));
}
