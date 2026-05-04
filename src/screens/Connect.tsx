import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Bub } from '../components/Bub';
import { Eyebrow, H1, Lede, Mark } from '../components/ui';
import { ble } from '../lib/ble';
import type { Action, State } from '../store';

interface Props {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export function ConnectScreen({ state, dispatch }: Props) {
  useEffect(() => {
    if (!state.scanning) return;
    let cancelled = false;
    (async () => {
      const device = await ble.scan();
      if (cancelled) return;
      await ble.connect(device.id, device.name);
      if (cancelled) return;
      dispatch({ type: 'connected' });
    })();
    return () => {
      cancelled = true;
    };
  }, [state.scanning]);

  const onHold = () => dispatch({ type: 'startScan' });

  return (
    <View style={styles.wrap}>
      <View style={styles.bubCell}>
        <Bub
          mood={state.scanning ? 'curious' : 'idle'}
          eye={state.scanning ? 'wide' : 'default'}
          onHoldComplete={!state.scanning ? onHold : undefined}
          holdLabel={!state.scanning ? 'hold to scan' : undefined}
        />
      </View>
      <View style={styles.stage}>
        {state.scanning ? (
          <>
            <Eyebrow>no device · pairing</Eyebrow>
            <H1>
              looking for your <Mark>dabrite</Mark>…
            </H1>
            <Lede>flick the IR thermometer on. i&apos;ll catch the bluetooth handshake and we&apos;re live.</Lede>
          </>
        ) : (
          <>
            <Eyebrow>no device · let&apos;s pair</Eyebrow>
            <H1>
              hey. wake up your <Mark>dabrite</Mark>.
            </H1>
            <Lede>press &amp; hold bub to start the scan. flick the IR thermometer on and i&apos;ll do the rest.</Lede>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
  },
  bubCell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    height: 320,
  },
  stage: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 12,
  },
});
