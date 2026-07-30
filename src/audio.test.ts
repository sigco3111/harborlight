import { afterEach, describe, expect, it, vi } from "vitest";
import { Soundscape } from "./audio";

class FakeParam {
  value = 0;
  readonly scheduled: Array<{ kind: string; value?: number; time: number; timeConstant?: number }> = [];

  cancelScheduledValues = vi.fn((time: number) => {
    this.scheduled.push({ kind: "cancel", time });
  });
  setTargetAtTime = vi.fn((value: number, time: number, timeConstant: number) => {
    this.scheduled.push({ kind: "target", value, time, timeConstant });
  });
  setValueAtTime = vi.fn((value: number, time: number) => {
    this.scheduled.push({ kind: "set", value, time });
  });
  exponentialRampToValueAtTime = vi.fn((value: number, time: number) => {
    this.scheduled.push({ kind: "ramp", value, time });
  });
}

class FakeNode {
  readonly connections: unknown[] = [];
  readonly disconnect = vi.fn();

  connect(target: unknown): unknown {
    this.connections.push(target);
    return target;
  }
}

class FakeGain extends FakeNode {
  readonly gain = new FakeParam();
}

class FakeFilter extends FakeNode {
  type: BiquadFilterType = "lowpass";
  readonly frequency = new FakeParam();
  readonly Q = new FakeParam();
}

class FakeSource extends FakeNode {
  buffer: AudioBuffer | null = null;
  loop = false;
  readonly starts: number[] = [];
  readonly stops: Array<number | undefined> = [];
  readonly listeners = new Map<string, EventListener>();

  start(time = 0): void {
    this.starts.push(time);
  }

  stop(time?: number): void {
    this.stops.push(time);
  }

  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void {
    if (typeof listener === "function") this.listeners.set(type, listener);
  }
}

class FakeOscillator extends FakeSource {
  type: OscillatorType = "sine";
  readonly frequency = new FakeParam();
}

function installAudioContext(initialState: AudioContextState = "running", rejectResume = false) {
  const state = {
    constructions: 0,
    contextState: initialState,
    gains: [] as FakeGain[],
    filters: [] as FakeFilter[],
    sources: [] as FakeSource[],
    oscillators: [] as FakeOscillator[],
  };
  const resume = vi.fn(async () => {
    if (rejectResume) throw new Error("gesture required");
    state.contextState = "running";
  });
  const close = vi.fn(async () => {
    state.contextState = "closed";
  });

  class FakeAudioContext {
    readonly destination = new FakeNode();
    readonly sampleRate = 100;
    readonly currentTime = 4;

    get state(): AudioContextState {
      return state.contextState;
    }

    constructor() {
      state.constructions += 1;
    }

    readonly resume = resume;
    readonly close = close;
    readonly createGain = vi.fn(() => {
      const gain = new FakeGain();
      state.gains.push(gain);
      return gain as unknown as GainNode;
    });
    readonly createBiquadFilter = vi.fn(() => {
      const filter = new FakeFilter();
      state.filters.push(filter);
      return filter as unknown as BiquadFilterNode;
    });
    readonly createBufferSource = vi.fn(() => {
      const source = new FakeSource();
      state.sources.push(source);
      return source as unknown as AudioBufferSourceNode;
    });
    readonly createOscillator = vi.fn(() => {
      const oscillator = new FakeOscillator();
      state.oscillators.push(oscillator);
      return oscillator as unknown as OscillatorNode;
    });
    readonly createBuffer = vi.fn((channels: number, length: number) => {
      const data = Array.from({ length: channels }, () => new Float32Array(length));
      return {
        numberOfChannels: channels,
        getChannelData: (channel: number) => data[channel],
      } as unknown as AudioBuffer;
    });
  }

  class FakeAudio {
    volume = 1;
    playbackRate = 1;
    preload = "";
    readonly play = vi.fn(async () => undefined);
    readonly pause = vi.fn();
    readonly load = vi.fn();
    readonly addEventListener = vi.fn();
    readonly removeAttribute = vi.fn();

    constructor(readonly src: string) {}
  }

  vi.stubGlobal("window", {
    AudioContext: FakeAudioContext as unknown as typeof AudioContext,
    localStorage: { getItem: vi.fn(() => null), setItem: vi.fn() },
  });
  vi.stubGlobal("Audio", FakeAudio);

  return { state, resume, close };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Soundscape", () => {
  it("lazily creates and retries a suspended Safari-style context", async () => {
    const audio = installAudioContext("suspended", true);
    const sound = new Soundscape();

    expect(audio.state.constructions).toBe(0);
    sound.unlock();
    expect(audio.state.constructions).toBe(1);
    expect(audio.resume).toHaveBeenCalledTimes(1);
    expect(audio.state.sources).toHaveLength(0);

    await Promise.resolve();
    sound.unlock();
    expect(audio.state.constructions).toBe(1);
    expect(audio.resume).toHaveBeenCalledTimes(2);
    sound.dispose();
  });

  it("routes one audible layered wave bed after unlock without stacking", () => {
    const audio = installAudioContext();
    const sound = new Soundscape();

    sound.unlock();
    sound.unlock();

    expect(audio.state.sources).toHaveLength(2);
    expect(audio.state.sources.every((source) => source.loop && source.starts.length === 1)).toBe(true);
    expect(audio.state.oscillators).toHaveLength(1);
    expect(audio.state.gains[0]?.gain.value).toBeGreaterThan(0);
    expect(audio.state.gains.slice(1).some((gain) => gain.gain.value > 0)).toBe(true);
    expect(audio.state.gains.some((gain) => gain.connections.includes(audio.state.gains[0]))).toBe(true);

    sound.dispose();
  });

  it("stops ambience on toggle, restarts once, and stays stopped after disposal", () => {
    const audio = installAudioContext();
    const sound = new Soundscape();
    sound.unlock();
    const firstSources = [...audio.state.sources];
    const firstLfo = audio.state.oscillators[0];
    const firstFilters = [...audio.state.filters];
    const firstAmbientGains = audio.state.gains.slice(1);

    sound.setEnabled(false);
    expect(firstSources.every((source) => source.stops.length === 1 && source.disconnect.mock.calls.length === 1)).toBe(true);
    expect(firstLfo?.stops).toHaveLength(1);
    expect(firstLfo?.disconnect).toHaveBeenCalledTimes(1);
    expect(firstFilters.every((filter) => filter.disconnect.mock.calls.length === 1)).toBe(true);
    expect(firstAmbientGains.every((gain) => gain.disconnect.mock.calls.length === 1)).toBe(true);

    sound.setEnabled(true);
    sound.unlock();
    expect(audio.state.sources).toHaveLength(4);
    expect(audio.state.oscillators).toHaveLength(2);

    const restartedSources = audio.state.sources.slice(2);
    const restartedLfo = audio.state.oscillators[1];
    const restartedFilters = audio.state.filters.slice(2);
    const restartedAmbientGains = audio.state.gains.slice(5);
    sound.dispose();
    expect(restartedSources.every((source) => source.stops.length === 1 && source.disconnect.mock.calls.length === 1)).toBe(true);
    expect(restartedLfo?.stops).toHaveLength(1);
    expect(restartedLfo?.disconnect).toHaveBeenCalledTimes(1);
    expect(restartedFilters.every((filter) => filter.disconnect.mock.calls.length === 1)).toBe(true);
    expect(restartedAmbientGains.every((gain) => gain.disconnect.mock.calls.length === 1)).toBe(true);
    expect(audio.close).toHaveBeenCalledTimes(1);
    sound.unlock();
    expect(audio.state.sources).toHaveLength(4);
  });

  it("gives drain, wall, and shore contacts distinct bounded transients", () => {
    const audio = installAudioContext();
    const sound = new Soundscape();
    sound.unlock();
    const ambientSourceCount = audio.state.sources.length;
    const ambientGainCount = audio.state.gains.length;

    sound.water(0.48);
    const drainFilter = audio.state.filters.at(-1);
    const drainStartFrequency = audio.state.oscillators.at(-1)?.frequency.scheduled[0]?.value;
    sound.water(0.58);
    const wallFilter = audio.state.filters.at(-2);
    const wallStartFrequency = audio.state.oscillators.at(-1)?.frequency.scheduled[0]?.value;
    sound.water(0.92);

    expect(drainFilter?.type).toBe("lowpass");
    expect(wallFilter?.type).toBe("bandpass");
    expect(wallStartFrequency).toBeGreaterThan(drainStartFrequency ?? 0);
    expect(audio.state.sources.length - ambientSourceCount).toBe(4);

    const transientGains = audio.state.gains.slice(ambientGainCount);
    const peakValues = transientGains.flatMap((gain) => [gain.gain.value, ...gain.gain.scheduled.flatMap((event) => event.value ?? [])]);
    expect(Math.max(...peakValues)).toBeLessThanOrEqual(0.06);
    for (const source of [...audio.state.sources.slice(ambientSourceCount), ...audio.state.oscillators.slice(1)]) {
      expect(source.starts.every((time) => Number.isFinite(time) && time >= 4)).toBe(true);
      expect(source.stops.every((time) => time === undefined || (Number.isFinite(time) && time > 4))).toBe(true);
    }

    sound.dispose();
  });
});
