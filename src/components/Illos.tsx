import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, RadialGradient, Rect, Stop, Text as SvgText } from 'react-native-svg';
import type { IconName } from '../data/catalog';
import { colors } from '../theme';

const Q_LIGHT = '#F8F2F8';
const Q_MID = '#E5DAE0';
const Q_STROKE = '#7C6E7E';

export function BangerIllo({ id, size = 92 }: { id: string; size?: number }) {
  if (id === 'flat') {
    return (
      <Svg width={size} height={size * 1.1} viewBox="0 0 100 110">
        <Ellipse cx="50" cy="100" rx="32" ry="4" fill="rgba(110,90,130,0.18)" />
        <Rect x="42" y="6" width="16" height="14" rx="2" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.4" />
        <Ellipse cx="50" cy="22" rx="22" ry="4" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.4" />
        <Path
          d="M28 22 L28 86 Q28 96 38 96 L62 96 Q72 96 72 86 L72 22"
          fill={Q_MID}
          stroke={Q_STROKE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <Ellipse cx="50" cy="22" rx="14" ry="2.4" fill="#CBC0CB" opacity="0.7" />
      </Svg>
    );
  }
  if (id === 'banger') {
    return (
      <Svg width={size} height={size * 1.1} viewBox="0 0 100 110">
        <Ellipse cx="50" cy="100" rx="34" ry="4" fill="rgba(110,90,130,0.18)" />
        <Rect x="42" y="4" width="16" height="14" rx="2" fill="#EFE5C7" stroke="#9A7A22" strokeWidth="1.4" />
        <Ellipse cx="50" cy="20" rx="24" ry="4.5" fill="#EFE5C7" stroke="#9A7A22" strokeWidth="1.4" />
        <Path
          d="M26 20 L26 84 Q26 98 40 98 L60 98 Q74 98 74 84 L74 20"
          fill="#EBE3CE"
          stroke="#9A7A22"
          strokeWidth="1.7"
          strokeLinejoin="round"
        />
        <Path d="M30 20 L30 80" stroke="rgba(255,255,255,0.6)" strokeWidth="2" fill="none" strokeLinecap="round" />
      </Svg>
    );
  }
  if (id === 'slurper') {
    return (
      <Svg width={size} height={size * 1.1} viewBox="0 0 100 110">
        <Ellipse cx="50" cy="100" rx="32" ry="4" fill="rgba(110,90,130,0.18)" />
        <Rect x="42" y="6" width="16" height="14" rx="2" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.4" />
        <Ellipse cx="50" cy="22" rx="22" ry="4" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.4" />
        <Path
          d="M28 22 L28 70 Q28 96 50 96 Q72 96 72 70 L72 22"
          fill={Q_MID}
          stroke={Q_STROKE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <Rect x="42" y="58" width="3" height="22" rx="1.5" fill="rgba(255,255,255,0.85)" stroke="rgba(124,110,126,0.5)" strokeWidth="0.6" />
        <Rect x="55" y="58" width="3" height="22" rx="1.5" fill="rgba(255,255,255,0.85)" stroke="rgba(124,110,126,0.5)" strokeWidth="0.6" />
        <Circle cx="50" cy="84" r="5" fill={colors.lilac} stroke="#6D4D88" strokeWidth="0.8" />
        <Circle cx="48.5" cy="82.5" r="1.5" fill="rgba(255,255,255,0.7)" />
      </Svg>
    );
  }
  if (id === 'opaque') {
    return (
      <Svg width={size} height={size * 1.1} viewBox="0 0 100 110">
        <Ellipse cx="50" cy="100" rx="32" ry="4" fill="rgba(110,90,130,0.18)" />
        <Rect x="42" y="6" width="16" height="14" rx="2" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.4" />
        <Ellipse cx="50" cy="22" rx="22" ry="4" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.4" />
        <Path
          d="M28 22 L28 86 Q28 96 38 96 L62 96 Q72 96 72 86 L72 22"
          fill="#E0D5DF"
          stroke={Q_STROKE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <Rect x="30" y="55" width="40" height="14" rx="2" fill="rgba(238, 156, 123, 0.65)" />
        <SvgText x="50" y="65" fontFamily="monospace" fontSize="6" fill={colors.accentDeep} textAnchor="middle" fontWeight="700">
          HOT
        </SvgText>
      </Svg>
    );
  }
  return null;
}

export function ConcIllo({ id, size = 92 }: { id: string; size?: number }) {
  return (
    <Svg width={size} height={size * 1.1} viewBox="0 0 100 110">
      <Defs>
        <LinearGradient id="r1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#E5B077" />
          <Stop offset="1" stopColor="#B76A3B" />
        </LinearGradient>
        <LinearGradient id="r2" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#F0CB7E" />
          <Stop offset="1" stopColor="#C99055" />
        </LinearGradient>
        <LinearGradient id="resin" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#F0CD64" />
          <Stop offset="1" stopColor="#B58F38" />
        </LinearGradient>
        <RadialGradient id="dia" cx="50%" cy="50%" rx="50%" ry="50%">
          <Stop offset="0" stopColor="#FFFCFD" />
          <Stop offset="0.5" stopColor="#E5D0EE" />
          <Stop offset="1" stopColor="#A380C8" />
        </RadialGradient>
      </Defs>
      <Rect x="14" y="22" width="72" height="68" rx="6" fill="#F4ECDA" stroke="#D7C496" strokeWidth="1.2" />

      {id === 'rosin-cold' && (
        <>
          <Path
            d="M30 56 Q34 34 50 38 Q70 30 72 52 Q80 68 60 76 Q40 84 32 72 Q24 64 30 56Z"
            fill="url(#r1)"
            stroke="#7B4220"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <Ellipse cx="42" cy="48" rx="6" ry="3" fill="rgba(255, 240, 180, 0.7)" />
        </>
      )}
      {id === 'live-rosin' && (
        <>
          <Path
            d="M22 60 Q26 40 50 38 Q74 38 78 60 Q82 76 60 80 Q38 82 28 76 Q18 70 22 60Z"
            fill="url(#r2)"
            stroke="#A06820"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <Ellipse cx="38" cy="48" rx="14" ry="4" fill="rgba(255, 245, 200, 0.85)" />
        </>
      )}
      {id === 'live-resin' && (
        <>
          <Circle cx="38" cy="58" r="9" fill="url(#resin)" stroke="#8E6A1F" strokeWidth="1" />
          <Circle cx="58" cy="50" r="7" fill="url(#resin)" stroke="#8E6A1F" strokeWidth="1" />
          <Circle cx="64" cy="68" r="6" fill="url(#resin)" stroke="#8E6A1F" strokeWidth="1" />
          <Circle cx="48" cy="74" r="5" fill="url(#resin)" stroke="#8E6A1F" strokeWidth="1" />
        </>
      )}
      {id === 'diamonds' && (
        <>
          <Path d="M40 38 L52 30 L62 40 L56 52 L44 52 Z" fill="url(#dia)" stroke="#6D4D88" strokeWidth="1" strokeLinejoin="round" />
          <Path d="M58 48 L70 42 L76 54 L68 64 L60 60 Z" fill="url(#dia)" stroke="#6D4D88" strokeWidth="1" strokeLinejoin="round" />
          <Path d="M32 56 L42 52 L50 62 L44 72 L30 68 Z" fill="url(#dia)" stroke="#6D4D88" strokeWidth="1" strokeLinejoin="round" />
          <SvgText x="68" y="32" fontSize="9" fill={colors.lilac}>✦</SvgText>
        </>
      )}
    </Svg>
  );
}

export function WallIllo({ id, size = 56 }: { id: string; size?: number }) {
  const inset = id === 'thin' ? 4 : id === 'standard' ? 7 : 11;
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      <Rect x="6" y="6" width="44" height="44" rx="6" fill={Q_LIGHT} stroke={Q_STROKE} strokeWidth="1.6" />
      <Rect
        x={6 + inset}
        y={6 + inset}
        width={44 - inset * 2}
        height={44 - inset * 2}
        rx={Math.max(2, 6 - inset / 2)}
        fill="rgba(124,110,126,0.5)"
        stroke={Q_STROKE}
        strokeWidth="1"
      />
    </Svg>
  );
}

export function Icon({ name, size = 22, color = colors.fg }: { name: IconName; size?: number; color?: string }) {
  const sw = 1.7;
  switch (name) {
    case 'plus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path d="M12 5v14M5 12h14" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
        </Svg>
      );
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-7h-6v7H5a1 1 0 0 1-1-1z"
            stroke={color}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'leaf':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M5 19c0-7 5-12 14-12-1 9-6 14-13 14-1 0-1 0-1-2z"
            stroke={color}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
          <Path d="M6 18l8-8" stroke={color} strokeWidth={sw} strokeLinecap="round" />
        </Svg>
      );
    case 'moon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M20 14a8 8 0 1 1-10-10c-1 5 4 11 10 10z"
            stroke={color}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'cloud':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Path
            d="M7 18a4 4 0 0 1 .8-7.9A6 6 0 0 1 19 12a3.5 3.5 0 0 1-.5 7H7z"
            stroke={color}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </Svg>
      );
    case 'sun':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth={sw} />
          <Path
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
          />
        </Svg>
      );
    default:
      return null;
  }
}

export function Glyph({
  tone,
  children,
  size = 48,
}: {
  tone: 'peach' | 'mint' | 'butter' | 'lilac' | 'neutral';
  children: React.ReactNode;
  size?: number;
}) {
  const grad: Record<string, string> = {
    peach: '#FCE5D7',
    mint: '#D7EDDF',
    butter: '#F5EBC2',
    lilac: '#E5D5EE',
    neutral: '#EFE5EE',
  };
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 16,
        backgroundColor: grad[tone],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
}
