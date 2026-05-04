// BLE stubs for the dabrite IR thermometer + torch listener.
//
// Today this is a pure simulator — no native modules, runs in Expo Go.
// When the project ejects to a CNG (continuous native generation) build,
// swap the implementations of `scan`, `connect`, `disconnect`, and the
// internal `simulateStream` to use `react-native-ble-plx` (or whichever
// native BLE library you settle on). The shape of the public API and the
// event contract below should not change — all callers (Connect screen,
// Heat phase, Cool phase, Dab phase) subscribe through `subscribe()` and
// react to the same event types.
//
// Migration notes (read this before swapping in real BLE):
// 1. `scan()` should resolve with `{ id, name }` for the first dabrite-
//    advertising peripheral the central radio sees. It currently fakes a
//    single device after 1.6s.
// 2. `connect()` maps the device id -> active GATT connection. On real
//    BLE: discover the temperature notify characteristic and wire it to
//    emit('temp', …). For the torch we listen via the device microphone
//    on the host phone (web prototype), but on the device-paired flow
//    the dabrite reports a mic-derived "torch on" boolean directly.
// 3. `disconnect()` should cancel any in-flight notifications and tear
//    down the connection cleanly. It currently just kills the simulator.
// 4. `subscribe()` returns an unsubscribe fn; preserve that contract so
//    every screen's cleanup path keeps working.
//
// Until then, the simulator below mirrors what the web prototype does in
// JS: kicks off after a short grace period, ramps temperature down,
// flips torch on after listening, etc.

export type BleDevice = { id: string; name: string };

export type BleEvent =
  | { type: 'connected'; device: BleDevice }
  | { type: 'disconnected' }
  | { type: 'temp'; fahrenheit: number; celsius: number; timestamp: number }
  | { type: 'torch'; on: boolean; level: number };

type Listener = (e: BleEvent) => void;

class Emitter {
  private listeners = new Set<Listener>();
  on(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
  emit(e: BleEvent) {
    this.listeners.forEach((l) => l(e));
  }
  clear() {
    this.listeners.clear();
  }
}

const emitter = new Emitter();
let connectedDevice: BleDevice | null = null;
let activeStream: ReturnType<typeof setInterval> | null = null;
let activeTimers: ReturnType<typeof setTimeout>[] = [];

/** Stub: simulate finding a dabrite over the air. */
export async function scan(): Promise<BleDevice> {
  await delay(1600);
  return { id: 'dabrite-stub-001', name: 'dabrite (stub)' };
}

/** Stub: simulate the GATT handshake. */
export async function connect(deviceId: string, deviceName = 'dabrite (stub)'): Promise<BleDevice> {
  await delay(280);
  connectedDevice = { id: deviceId, name: deviceName };
  emitter.emit({ type: 'connected', device: connectedDevice });
  return connectedDevice;
}

export async function disconnect(): Promise<void> {
  stopStreams();
  if (connectedDevice) {
    connectedDevice = null;
    emitter.emit({ type: 'disconnected' });
  }
}

export function isConnected(): boolean {
  return connectedDevice !== null;
}

export function getDevice(): BleDevice | null {
  return connectedDevice;
}

export function subscribe(listener: Listener): () => void {
  return emitter.on(listener);
}

/**
 * Heat phase: subscribe to the torch listener. On a real device this is
 * a notify characteristic; in the stub we fake it: silent for ~1.5s
 * (giving the user time to read the screen and reach for the torch),
 * then auto-on. Returns an unsubscribe fn.
 */
export function startTorchListener(opts: { graceMs?: number } = {}): () => void {
  const { graceMs = 1500 } = opts;
  let cancelled = false;
  const startTimer = setTimeout(() => {
    if (cancelled) return;
    emitter.emit({ type: 'torch', on: true, level: 0.92 });
  }, graceMs);
  activeTimers.push(startTimer);
  return () => {
    cancelled = true;
    clearTimeout(startTimer);
  };
}

/**
 * Cool phase: subscribe to the temperature stream. On a real device this
 * is a notify characteristic at ~6 Hz. In the stub we fake a linear
 * cooldown from `peak` °F towards ambient. Stops when `dispose()` is
 * called or when temp hits ambient.
 */
export function startTempStream(opts: { peakF: number; ambientF?: number; dropPerSec?: number }): () => void {
  const { peakF, ambientF = 80, dropPerSec = 4 } = opts;
  stopStreams();
  const startedAt = Date.now();
  activeStream = setInterval(() => {
    const elapsedSec = (Date.now() - startedAt) / 1000;
    const tF = Math.max(ambientF, peakF - dropPerSec * elapsedSec);
    const tC = ((tF - 32) * 5) / 9;
    emitter.emit({
      type: 'temp',
      fahrenheit: tF,
      celsius: tC,
      timestamp: Date.now(),
    });
    if (tF <= ambientF + 0.001) {
      stopStreams();
    }
  }, 160);
  return () => stopStreams();
}

/** Force the temperature stream to drop to ambient (e.g. user lifted the banger). */
export function reportLifted(ambientF = 76): void {
  const tC = ((ambientF - 32) * 5) / 9;
  emitter.emit({
    type: 'temp',
    fahrenheit: ambientF,
    celsius: tC,
    timestamp: Date.now(),
  });
}

function stopStreams() {
  if (activeStream) {
    clearInterval(activeStream);
    activeStream = null;
  }
  activeTimers.forEach((t) => clearTimeout(t));
  activeTimers = [];
}

function delay(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

export const ble = {
  scan,
  connect,
  disconnect,
  isConnected,
  getDevice,
  subscribe,
  startTorchListener,
  startTempStream,
  reportLifted,
};
