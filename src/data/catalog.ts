// Sesh presets, banger types, concentrate types, wall thicknesses, phase copy.
// Mirrors the data block in mobile/index.html so the prototype state model stays 1:1.

export type GlyphTone = 'peach' | 'mint' | 'butter' | 'lilac';
export type IconName = 'leaf' | 'moon' | 'cloud' | 'sun' | 'plus' | 'home';

export interface Sesh {
  id: string;
  name: string;
  sub: string;
  glyph: GlyphTone;
  icon: IconName;
  banger: string;
  conc: string;
  dab: number;
  dunk: number;
}

export interface Banger {
  id: string;
  name: string;
  meta: string;
  cat: 'quartz' | 'thermo';
}

export interface Concentrate {
  id: string;
  name: string;
  meta: string;
  blurb: string;
  cat: 'rosin' | 'resin' | 'diamonds';
}

export interface Wall {
  id: string;
  name: string;
  meta: string;
}

export const SESHES: Sesh[] = [
  {
    id: 'morning-rosin',
    name: 'morning rosin',
    sub: 'flat-top + cold-cure · low & slow',
    glyph: 'peach',
    icon: 'leaf',
    banger: 'flat',
    conc: 'rosin-cold',
    dab: 480,
    dunk: 220,
  },
  {
    id: 'evening-recovery',
    name: 'evening recovery',
    sub: 'quartz banger + diamonds · couch energy',
    glyph: 'lilac',
    icon: 'moon',
    banger: 'banger',
    conc: 'diamonds',
    dab: 540,
    dunk: 240,
  },
  {
    id: 'couch-lock-og',
    name: 'couch-lock OG',
    sub: 'slurper + live resin · for the long sit',
    glyph: 'mint',
    icon: 'cloud',
    banger: 'slurper',
    conc: 'live-resin',
    dab: 510,
    dunk: 230,
  },
  {
    id: 'tuesday-terps',
    name: 'tuesday terps',
    sub: 'flat-top + live rosin · daily driver',
    glyph: 'butter',
    icon: 'sun',
    banger: 'flat',
    conc: 'live-rosin',
    dab: 495,
    dunk: 225,
  },
];

export const BANGERS: Banger[] = [
  { id: 'flat', name: 'flat-top', meta: '4mm · cools fast', cat: 'quartz' },
  { id: 'banger', name: 'thick quartz', meta: '6mm · holds heat', cat: 'quartz' },
  { id: 'slurper', name: 'slurper', meta: 'pillars · marble', cat: 'quartz' },
  { id: 'opaque', name: 'opaque', meta: 'turns white when hot', cat: 'thermo' },
];

export const BANGER_CATS: { id: 'all' | 'quartz' | 'thermo'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'quartz', label: 'quartz' },
  { id: 'thermo', label: 'thermo' },
];

export const CONCS: Concentrate[] = [
  { id: 'rosin-cold', name: 'cold-cure rosin', meta: '480°', blurb: 'low & slow', cat: 'rosin' },
  { id: 'live-rosin', name: 'live rosin', meta: '505°', blurb: 'the sweet spot', cat: 'rosin' },
  { id: 'live-resin', name: 'live resin', meta: '525°', blurb: 'loud terps', cat: 'resin' },
  { id: 'diamonds', name: 'thca diamonds', meta: '555°', blurb: 'full melt', cat: 'diamonds' },
];

export const CONC_CATS: { id: 'all' | 'rosin' | 'resin' | 'diamonds'; label: string }[] = [
  { id: 'all', label: 'all' },
  { id: 'rosin', label: 'rosin' },
  { id: 'resin', label: 'resin' },
  { id: 'diamonds', label: 'diamonds' },
];

export const WALLS: Wall[] = [
  { id: 'thin', name: 'thin (3mm)', meta: 'flashy, drops fast' },
  { id: 'standard', name: 'standard (4mm)', meta: 'most rigs' },
  { id: 'thick', name: 'thick (6mm+)', meta: 'long retain' },
];

export const PHASES = ['heat', 'cool', 'dab', 'dunk', 'clean'] as const;
export type Phase = typeof PHASES[number];

export type Mood =
  | 'idle'
  | 'curious'
  | 'eager'
  | 'heat'
  | 'cool'
  | 'dab'
  | 'dunk'
  | 'clean'
  | 'done';

export type EyeState =
  | 'default'
  | 'wide'
  | 'surprised'
  | 'concentrating'
  | 'happy'
  | 'tidy'
  | 'starry';

export const PHASE_COPY: Record<Phase, {
  eyebrow: string;
  title: string;
  sub: string;
  mood: Mood;
  eye: EyeState;
}> = {
  heat: {
    eyebrow: 'phase 1 · heat',
    title: 'torch your banger.',
    sub: 'low & even sweeps until the timer hits zero. tap me to skip.',
    mood: 'heat',
    eye: 'concentrating',
  },
  cool: {
    eyebrow: 'phase 2 · cool',
    title: 'let me cool. lift when i turn green.',
    sub: "red → orange → yellow → green. lift it and i'll feel it leave the pad.",
    mood: 'cool',
    eye: 'wide',
  },
  dab: {
    eyebrow: 'phase 3 · dab',
    title: 'lift, dab, breathe in.',
    sub: "slow inhale beats a hot rip. place it back when you're done — i'll catch it.",
    mood: 'dab',
    eye: 'surprised',
  },
  dunk: {
    eyebrow: 'phase 4 · dunk',
    title: 'time for a swim.',
    sub: 'one swipe, no scrubbing. residue lifts while the quartz is still warm.',
    mood: 'dunk',
    eye: 'happy',
  },
  clean: {
    eyebrow: 'phase 5 · clean',
    title: 'final swab. cap it.',
    sub: 'last pass. drop the cap. next sesh starts cleaner this way.',
    mood: 'clean',
    eye: 'tidy',
  },
};

export function heatSecondsForBanger(b?: Banger | null): number {
  if (!b) return 30;
  if (b.id === 'flat') return 22;
  if (b.id === 'banger') return 35;
  if (b.id === 'slurper') return 40;
  if (b.id === 'opaque') return 30;
  return 30;
}

export function computeDab(
  c?: Concentrate | null,
  _b?: Banger | null,
  w?: Wall | null,
): number {
  if (!c) return 510;
  const base =
    ({ 'rosin-cold': 480, 'live-rosin': 505, 'live-resin': 525, diamonds: 555 } as Record<
      string,
      number
    >)[c.id] ?? 510;
  const wallAdj = ({ thin: -10, standard: 0, thick: 10 } as Record<string, number>)[w?.id ?? 'standard'] ?? 0;
  return base + wallAdj;
}
