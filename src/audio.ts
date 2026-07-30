const STORAGE_KEY = "harborlight-sound";
const MASTER_LEVEL = 0.68;

type AudioContextConstructor = new () => AudioContext;
type UiCue = "select" | "undo" | "redo" | "open" | "close" | "grid-on" | "grid-off" | "save";

interface Voice {
  readonly source: AudioScheduledSourceNode;
  readonly nodes: readonly AudioNode[];
}

interface WaterBed {
  readonly sources: readonly AudioBufferSourceNode[];
  readonly nodes: readonly AudioNode[];
  readonly lfo: OscillatorNode;
}

function readPreference(): boolean {
  try {
    return typeof window === "undefined" || window.localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function writePreference(enabled: boolean): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Sound still follows the in-memory preference when storage is unavailable.
  }
}

function clamp(value: number, minimum: number, maximum: number): number {
  if (!Number.isFinite(value)) return minimum;
  return Math.min(maximum, Math.max(minimum, value));
}

function contextConstructor(): AudioContextConstructor | null {
  if (typeof window === "undefined") return null;
  const audioWindow = window as Window & { webkitAudioContext?: AudioContextConstructor };
  return window.AudioContext ?? audioWindow.webkitAudioContext ?? null;
}

function disconnect(node: AudioNode): void {
  try {
    node.disconnect();
  } catch {
    // A node may already have been disconnected by its ended handler.
  }
}

function stop(source: AudioScheduledSourceNode): void {
  try {
    source.stop();
  } catch {
    // Stopping an ended source is harmless during teardown.
  }
}

export class Soundscape {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambience: WaterBed | null = null;
  private readonly voices = new Set<Voice>();
  private enabled = readPreference();
  private disposed = false;
  private sequence = 0;

  isEnabled(): boolean {
    return this.enabled;
  }

  setEnabled(enabled: boolean): void {
    if (this.disposed || this.enabled === enabled) return;
    this.enabled = enabled;
    writePreference(enabled);

    if (enabled) {
      this.unlock();
      return;
    }

    this.stopAmbience();
    this.stopVoices();
    const context = this.context;
    const master = this.master;
    if (context && master && context.state !== "closed") {
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.setTargetAtTime(0, context.currentTime, 0.025);
    }
  }

  /** Call from a pointer or keyboard gesture. Blocked or missing audio is intentionally silent. */
  unlock(): void {
    if (!this.enabled || this.disposed) return;
    const context = this.ensureContext();
    if (!context) return;

    if (context.state === "running") {
      this.restoreMaster();
      this.startAmbience();
      return;
    }

    if (context.state === "suspended") {
      void context
        .resume()
        .then(() => {
          if (!this.disposed && this.enabled && context.state === "running") {
            this.restoreMaster();
            this.startAmbience();
          }
        })
        .catch(() => {
          // Browsers may reject resume outside a trusted gesture. A later gesture retries.
        });
    }
  }

  /** A soft water-and-stone plop for the first occupied cell state. */
  foundation(colorIndex = 0): void {
    const context = this.runningContext();
    if (!context) return;
    const now = context.currentTime;
    const variation = this.variation(colorIndex + 11);
    this.noiseTap(now, 0.115, 560 + variation * 70, 0.032, "lowpass");
    this.tone(118 + variation * 5, 91, now, 0.16, 0.038, "sine");
    this.tone(236 + colorIndex * 2, 218, now + 0.018, 0.09, 0.014, "triangle");
  }

  /** A compact plaster-and-timber knock whose pitch follows color and storey. */
  build(colorIndex: number, height: number): void {
    const context = this.runningContext();
    if (!context) return;
    const safeColor = Math.round(clamp(colorIndex, 0, 31));
    const safeHeight = Math.round(clamp(height, 0, 12));
    const scale = [0, 2, 4, 7, 9];
    const semitone = scale[safeColor % scale.length] ?? 0;
    const variation = this.variation(safeColor + safeHeight * 17);
    const frequency = 184 * 2 ** ((semitone + safeHeight * 1.65) / 12) * (1 + variation * 0.012);
    const now = context.currentTime;
    this.tone(frequency, frequency * 0.982, now, 0.13, 0.048, "triangle");
    this.tone(frequency * 1.498, frequency * 1.47, now + 0.024, 0.085, 0.019, "sine");
    this.noiseTap(now, 0.047, 1280 + safeHeight * 55, 0.026, "bandpass");
  }

  /** A light original metal-and-stone cadence for completed spans and arches. */
  bridge(span = 1): void {
    const context = this.runningContext();
    if (!context) return;
    const safeSpan = clamp(span, 1, 8);
    const variation = this.variation(Math.round(safeSpan * 23));
    const root = 286 + safeSpan * 7 + variation * 6;
    const now = context.currentTime;
    this.tone(root, root * 0.993, now, 0.18, 0.032, "triangle");
    this.tone(root * 1.682, root * 1.64, now + 0.045, 0.2, 0.019, "sine");
    this.tone(root * 2.01, root * 1.96, now + 0.09, 0.15, 0.011, "sine");
    this.noiseTap(now, 0.075, 2200, 0.014, "highpass");
  }

  remove(height: number): void {
    const context = this.runningContext();
    if (!context) return;
    const safeHeight = clamp(height, 0, 12);
    const variation = this.variation(Math.round(safeHeight * 29));
    const now = context.currentTime;
    const start = 152 + safeHeight * 8 + variation * 4;
    this.tone(start, 74 + safeHeight * 2, now, 0.21, 0.04, "triangle");
    this.noiseTap(now + 0.012, 0.12, 390 + safeHeight * 18, 0.044, "lowpass");
  }

  /** A bounded water accent; intensity bands distinguish drain, wall, and open-shore contact. */
  water(intensity = 1): void {
    const context = this.runningContext();
    if (!context) return;
    const amount = clamp(intensity, 0.2, 1.25);
    const now = context.currentTime;
    const variation = this.variation(Math.round(amount * 37));

    if (amount <= 0.52) {
      // A tight downward gurgle for removal and drain-like movement.
      this.noiseTap(now, 0.105, 360 + variation * 28, 0.018 + amount * 0.012, "lowpass");
      this.tone(132 + variation * 4, 72, now + 0.008, 0.145, 0.013 + amount * 0.009, "sine");
      return;
    }

    if (amount < 0.75) {
      // A dry, short slap where water meets a wall or elevated placement.
      this.noiseTap(now, 0.07, 980 + variation * 85, 0.024 + amount * 0.011, "bandpass");
      this.tone(176 + variation * 5, 122, now, 0.095, 0.014 + amount * 0.008, "triangle");
      return;
    }

    // Open-water building gets a rounder splash with a delayed, quieter wash.
    this.noiseTap(now, 0.13, 520 + variation * 45, 0.028 + amount * 0.012, "lowpass");
    this.noiseTap(now + 0.045, 0.105, 1320 + variation * 90, 0.012 + amount * 0.006, "bandpass");
    this.tone(104 + variation * 3, 78, now, 0.17, 0.012 + amount * 0.007, "sine");
  }

  /** A short layered wing-flutter for birds startled by a build action. */
  birdTakeoff(): void {
    const context = this.runningContext();
    if (!context) return;
    const now = context.currentTime;
    for (let beat = 0; beat < 3; beat += 1) {
      this.noiseTap(now + beat * 0.052, 0.042, 1450 + beat * 260, 0.012 - beat * 0.002, "bandpass");
    }
    this.noiseTap(now + 0.018, 0.12, 2400, 0.006, "highpass");
  }

  ui(cue: number | UiCue = "select"): void {
    const context = this.runningContext();
    if (!context) return;
    const frequencies: Record<UiCue, number> = {
      select: 520,
      undo: 360,
      redo: 460,
      open: 575,
      close: 430,
      "grid-on": 640,
      "grid-off": 350,
      save: 700,
    };
    const requested = typeof cue === "number" ? cue : frequencies[cue];
    const frequency = clamp(requested, 110, 1800);
    const now = context.currentTime;
    this.tone(frequency, frequency * 0.992, now, 0.06, 0.016, "sine");
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stopAmbience();
    this.stopVoices();

    const master = this.master;
    const context = this.context;
    this.master = null;
    this.context = null;
    if (master) disconnect(master);
    if (context && context.state !== "closed") {
      void context.close().catch(() => {
        // Closing may fail if the platform is already tearing audio down.
      });
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.disposed || !this.enabled) return null;
    const currentContext = this.context;
    if (currentContext && currentContext.state !== "closed") return currentContext;
    const Context = contextConstructor();
    if (!Context) return null;
    try {
      const context = new Context();
      const master = context.createGain();
      master.gain.value = MASTER_LEVEL;
      master.connect(context.destination);
      this.context = context;
      this.master = master;
      return context;
    } catch {
      this.context = null;
      this.master = null;
      return null;
    }
  }

  private runningContext(): AudioContext | null {
    if (!this.enabled || this.disposed) return null;
    const context = this.ensureContext();
    if (!context) return null;
    if (context.state !== "running") {
      this.unlock();
      return null;
    }
    this.restoreMaster();
    this.startAmbience();
    return context;
  }

  private restoreMaster(): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master || context.state === "closed") return;
    master.gain.cancelScheduledValues(context.currentTime);
    master.gain.setTargetAtTime(MASTER_LEVEL, context.currentTime, 0.045);
  }

  private tone(
    startFrequency: number,
    endFrequency: number,
    start: number,
    duration: number,
    volume: number,
    type: OscillatorType,
  ): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master || context.state !== "running") return;

    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(Math.max(40, startFrequency), start);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, endFrequency), start + duration);
    filter.type = "lowpass";
    filter.frequency.value = 2600;
    filter.Q.value = 0.35;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), start + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(filter).connect(gain).connect(master);
    this.trackVoice(oscillator, [oscillator, filter, gain]);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.025);
  }

  private noiseTap(
    start: number,
    duration: number,
    cutoff: number,
    volume: number,
    filterType: BiquadFilterType,
  ): void {
    const context = this.context;
    const master = this.master;
    if (!context || !master || context.state !== "running") return;

    const sampleCount = Math.max(1, Math.ceil(context.sampleRate * duration));
    const buffer = context.createBuffer(1, sampleCount, context.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = (this.sequence + 1) * 0x45d9f3b;
    for (let index = 0; index < data.length; index += 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const noise = (seed / 0xffffffff) * 2 - 1;
      const envelope = 1 - index / data.length;
      data[index] = noise * envelope * envelope;
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = filterType;
    filter.frequency.value = Math.max(80, cutoff);
    filter.Q.value = filterType === "bandpass" ? 0.8 : 0.35;
    gain.gain.value = Math.max(0, volume);
    source.connect(filter).connect(gain).connect(master);
    this.trackVoice(source, [source, filter, gain]);
    source.start(start);
  }

  private trackVoice(source: AudioScheduledSourceNode, nodes: readonly AudioNode[]): void {
    const voice: Voice = { source, nodes };
    this.voices.add(voice);
    source.addEventListener(
      "ended",
      () => {
        this.voices.delete(voice);
        for (const node of nodes) disconnect(node);
      },
      { once: true },
    );
  }



  private stopVoices(): void {
    for (const voice of this.voices) {
      stop(voice.source);
      for (const node of voice.nodes) disconnect(node);
    }
    this.voices.clear();
  }

  private startAmbience(): void {
    const context = this.context;
    const master = this.master;
    if (!this.enabled || this.disposed || !context || !master || context.state !== "running" || this.ambience) {
      return;
    }

    const seconds = 8;
    const frameCount = Math.ceil(context.sampleRate * seconds);
    const undertowBuffer = context.createBuffer(2, frameCount, context.sampleRate);
    const shoreBuffer = context.createBuffer(2, frameCount, context.sampleRate);
    for (let channel = 0; channel < 2; channel += 1) {
      const undertow = undertowBuffer.getChannelData(channel);
      const shore = shoreBuffer.getChannelData(channel);
      const breakCenters = channel === 0 ? [0.11, 0.48, 0.81] : [0.16, 0.54, 0.86];
      let state = 0x6d2b79f5 ^ (channel * 0x9e3779b9);
      let brown = 0;
      let smoothed = 0;
      for (let index = 0; index < frameCount; index += 1) {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        const white = (state / 0xffffffff) * 2 - 1;
        brown = (brown + white * 0.016) / 1.016;
        smoothed += (white - smoothed) * 0.075;
        const phase = index / frameCount;
        const slowSwell = 0.72 + Math.sin(phase * Math.PI * 2 + channel * 1.7) * 0.18;
        undertow[index] = brown * slowSwell * 0.72;

        // Three deterministic, asymmetric shore breaks keep the loop alive without sharp repetition.
        let shoreBreak = 0;
        for (const center of breakCenters) {
          const distance = phase - center;
          if (distance >= 0 && distance < 0.105) {
            const attack = Math.min(1, distance / 0.012);
            const decay = Math.exp(-distance * 30);
            shoreBreak += attack * decay;
          }
        }
        shore[index] = (white * 0.68 + smoothed * 0.32) * shoreBreak * 0.27;
      }
    }

    const undertowSource = context.createBufferSource();
    const shoreSource = context.createBufferSource();
    const undertowFilter = context.createBiquadFilter();
    const shoreFilter = context.createBiquadFilter();
    const undertowGain = context.createGain();
    const shoreGain = context.createGain();
    const swellGain = context.createGain();
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();

    undertowSource.buffer = undertowBuffer;
    shoreSource.buffer = shoreBuffer;
    undertowSource.loop = true;
    shoreSource.loop = true;
    undertowFilter.type = "lowpass";
    undertowFilter.frequency.value = 760;
    undertowFilter.Q.value = 0.32;
    shoreFilter.type = "bandpass";
    shoreFilter.frequency.value = 1180;
    shoreFilter.Q.value = 0.48;
    undertowGain.gain.value = 0.17;
    shoreGain.gain.value = 0.105;
    swellGain.gain.value = 0.82;
    lfo.type = "sine";
    lfo.frequency.value = 0.065;
    lfoGain.gain.value = 0.16;

    undertowSource.connect(undertowFilter).connect(undertowGain).connect(swellGain);
    shoreSource.connect(shoreFilter).connect(shoreGain).connect(swellGain);
    swellGain.connect(master);
    lfo.connect(lfoGain).connect(swellGain.gain);
    undertowSource.start();
    shoreSource.start();
    lfo.start();
    this.ambience = {
      sources: [undertowSource, shoreSource],
      nodes: [undertowSource, shoreSource, undertowFilter, shoreFilter, undertowGain, shoreGain, swellGain, lfo, lfoGain],
      lfo,
    };
  }

  private stopAmbience(): void {
    const ambience = this.ambience;
    if (!ambience) return;
    this.ambience = null;
    for (const source of ambience.sources) stop(source);
    stop(ambience.lfo);
    for (const node of ambience.nodes) disconnect(node);
  }

  private variation(salt: number): number {
    this.sequence = (this.sequence + 1) >>> 0;
    let value = (this.sequence ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0;
    value ^= value >>> 16;
    value = Math.imul(value, 0x7feb352d);
    value ^= value >>> 15;
    return (value >>> 0) / 0xffffffff * 2 - 1;
  }
}
