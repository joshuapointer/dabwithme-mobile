import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Wordmark } from './src/components/Wordmark';
import { PhaseBg, type PhaseBgKind } from './src/components/PhaseBg';
import { ConnectScreen } from './src/screens/Connect';
import { ChooseScreen } from './src/screens/Choose';
import { BuildScreen } from './src/screens/Build';
import { SessionScreen } from './src/screens/Session';
import { CompleteScreen } from './src/screens/Complete';
import { useAppState } from './src/store';
import { ble } from './src/lib/ble';
import { PHASES } from './src/data/catalog';
import { colors } from './src/theme';

export default function App() {
  const [state, dispatch] = useAppState();
  const [bgKind, setBgKind] = useState<PhaseBgKind>('idle');
  const [bgExtras, setBgExtras] = useState<{ heatProgress?: number; torchOn?: boolean }>({});

  // Pick the right bg per stage/phase whenever state changes.
  React.useEffect(() => {
    if (!state.hydrated) return;
    if (state.stage === 'session') {
      setBgKind(PHASES[state.phaseIdx] as PhaseBgKind);
    } else if (state.stage === 'complete') {
      setBgKind('complete');
    } else {
      setBgKind('idle');
    }
  }, [state.stage, state.phaseIdx, state.hydrated]);

  if (!state.hydrated) {
    return (
      <View style={[styles.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={styles.root}>
          <StatusBar barStyle="dark-content" />
          {/* Phase background — drifts behind everything */}
          <PhaseBg kind={bgKind} heatProgress={bgExtras.heatProgress ?? 0} torchOn={bgExtras.torchOn ?? false} />

          <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
            <Wordmark
              status={state.connected ? 'connected' : 'offline'}
              onDisconnect={() => {
                ble.disconnect();
                dispatch({ type: 'disconnect' });
              }}
            />
            <View style={{ flex: 1 }}>
              {state.stage === 'connect' && <ConnectScreen state={state} dispatch={dispatch} />}
              {state.stage === 'choose' && <ChooseScreen state={state} dispatch={dispatch} />}
              {state.stage === 'build' && <BuildScreen state={state} dispatch={dispatch} />}
              {state.stage === 'session' && (
                <SessionScreen
                  state={state}
                  dispatch={dispatch}
                  onPhaseBg={(kind, extra) => {
                    setBgKind(kind as PhaseBgKind);
                    if (extra) setBgExtras(extra);
                  }}
                />
              )}
              {state.stage === 'complete' && <CompleteScreen state={state} dispatch={dispatch} />}
            </View>
          </SafeAreaView>
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
