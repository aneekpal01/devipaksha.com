// Web Audio API Dhak (ঢাক) & Kansor (কাঁসর) Synthesizer + YouTube Audio Bridge

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a resonant deep Dhak bass strike ("ধা")
 */
export function playDhakDha(velocity = 1.0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  
  // Fundamental oscillator (membrane pitch bend)
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(145, now);
  osc.frequency.exponentialRampToValueAtTime(58, now + 0.18);
  
  gain.gain.setValueAtTime(0.9 * velocity, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

  // Wooden shell resonance
  const woodOsc = ctx.createOscillator();
  const woodGain = ctx.createGain();
  woodOsc.type = 'triangle';
  woodOsc.frequency.setValueAtTime(95, now);
  woodOsc.frequency.exponentialRampToValueAtTime(45, now + 0.22);
  woodGain.gain.setValueAtTime(0.5 * velocity, now);
  woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  // Connect
  osc.connect(gain);
  gain.connect(ctx.destination);

  woodOsc.connect(woodGain);
  woodGain.connect(ctx.destination);

  osc.start(now);
  woodOsc.start(now);

  osc.stop(now + 0.4);
  woodOsc.stop(now + 0.3);
}

/**
 * Play a sharp Dhak rim strike ("ক্রিং" / "তা")
 */
export function playDhakKring(velocity = 1.0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Noise burst for sharp stick slap
  const bufferSize = ctx.sampleRate * 0.05;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 3200;
  noiseFilter.Q.value = 3.0;

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.7 * velocity, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  // High ping tone
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(620, now);
  osc.frequency.exponentialRampToValueAtTime(320, now + 0.12);

  oscGain.gain.setValueAtTime(0.8 * velocity, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  noise.start(now);
  osc.start(now);
  noise.stop(now + 0.09);
  osc.stop(now + 0.15);
}

/**
 * Play a light rim tick ("তিং")
 */
export function playDhakTing(velocity = 1.0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(540, now + 0.08);

  gain.gain.setValueAtTime(0.5 * velocity, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * Play Kansor Ghonta bell / gong chime ("কাঁসর ঘণ্টা")
 */
export function playKansor(velocity = 1.0) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const frequencies = [1180, 1640, 2350, 3100, 4800];
  const decays = [1.2, 0.9, 0.7, 0.5, 0.3];
  const gains = [0.45, 0.35, 0.25, 0.18, 0.1];

  frequencies.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(gains[idx] * velocity, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + decays[idx]);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + decays[idx] + 0.1);
  });
}

/**
 * Play sacred Conch Shell / Shankha sound ("শঙ্খধ্বনি")
 */
export function playShankha() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.linearRampToValueAtTime(380, now + 0.8);
  osc.frequency.linearRampToValueAtTime(370, now + 2.2);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(750, now);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.4, now + 0.4);
  gain.gain.setValueAtTime(0.4, now + 1.8);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 2.6);
}

// Interactive Rhythm Loop Engine
let loopInterval = null;

export const RHYTHM_PATTERNS = {
  dhunuchi: {
    name: "Dhunuchi Naach (ধুনুচি নাচ)",
    bpm: 138,
    pattern: [
      { step: 0, hit: 'dha', vel: 1.0 },
      { step: 1, hit: 'ting', vel: 0.7 },
      { step: 2, hit: 'kring', vel: 0.9 },
      { step: 3, hit: 'ting', vel: 0.6 },
      { step: 4, hit: 'dha', vel: 1.0 },
      { step: 4, hit: 'kansor', vel: 0.8 },
      { step: 5, hit: 'kring', vel: 0.8 },
      { step: 6, hit: 'dha', vel: 0.9 },
      { step: 7, hit: 'kring', vel: 1.0 },
      { step: 8, hit: 'kansor', vel: 0.9 },
      { step: 9, hit: 'ting', vel: 0.6 },
      { step: 10, hit: 'dha', vel: 1.0 },
      { step: 11, hit: 'kring', vel: 0.9 },
    ],
    totalSteps: 12
  },
  sandhi: {
    name: "Sandhi Puja Aarti (সন্ধিপূজা আরতি)",
    bpm: 160,
    pattern: [
      { step: 0, hit: 'dha', vel: 1.0 },
      { step: 0, hit: 'kansor', vel: 1.0 },
      { step: 1, hit: 'kring', vel: 0.9 },
      { step: 2, hit: 'kring', vel: 0.8 },
      { step: 3, hit: 'dha', vel: 1.0 },
      { step: 4, hit: 'kansor', vel: 0.9 },
      { step: 4, hit: 'kring', vel: 0.9 },
      { step: 5, hit: 'ting', vel: 0.7 },
      { step: 6, hit: 'dha', vel: 1.0 },
      { step: 7, hit: 'kring', vel: 1.0 }
    ],
    totalSteps: 8
  },
  agomoni: {
    name: "Agomoni Welcome (আগমনি ঢাক)",
    bpm: 115,
    pattern: [
      { step: 0, hit: 'dha', vel: 0.9 },
      { step: 2, hit: 'ting', vel: 0.7 },
      { step: 4, hit: 'dha', vel: 1.0 },
      { step: 4, hit: 'kansor', vel: 0.7 },
      { step: 6, hit: 'kring', vel: 0.8 },
      { step: 7, hit: 'ting', vel: 0.6 }
    ],
    totalSteps: 8
  }
};

export function startRhythmLoop(patternKey, bpmOverride, onStepCallback) {
  stopRhythmLoop();
  const config = RHYTHM_PATTERNS[patternKey] || RHYTHM_PATTERNS.dhunuchi;
  const bpm = bpmOverride || config.bpm;
  const stepMs = (60 * 1000) / (bpm * 2); // sixteenth / eighth notes

  let currentStep = 0;

  loopInterval = setInterval(() => {
    // Find hits at currentStep
    const hits = config.pattern.filter(p => p.step === currentStep);
    hits.forEach(h => {
      if (h.hit === 'dha') playDhakDha(h.vel);
      else if (h.hit === 'kring') playDhakKring(h.vel);
      else if (h.hit === 'ting') playDhakTing(h.vel);
      else if (h.hit === 'kansor') playKansor(h.vel);
    });

    if (onStepCallback) {
      onStepCallback(currentStep, hits.map(h => h.hit));
    }

    currentStep = (currentStep + 1) % config.totalSteps;
  }, stepMs);

  return true;
}

export function stopRhythmLoop() {
  if (loopInterval) {
    clearInterval(loopInterval);
    loopInterval = null;
  }
}

export function isRhythmLoopRunning() {
  return loopInterval !== null;
}
