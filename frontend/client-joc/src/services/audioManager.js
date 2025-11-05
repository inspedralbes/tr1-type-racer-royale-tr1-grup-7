// Gestor de audio para la aplicación
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.musicGainNode = null;
    this.sfxGainNode = null;
    this.musicSource = null;
    this.isMusicPlaying = false;
    this.volume = 0.5;
  }

  // Inicializar contexto de audio
  init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Nodo de ganancia para música
      this.musicGainNode = this.audioContext.createGain();
      this.musicGainNode.gain.value = 0.6; // Volumen más alto para música de fondo
      this.musicGainNode.connect(this.audioContext.destination);
      
      // Nodo de ganancia para efectos de sonido
      this.sfxGainNode = this.audioContext.createGain();
      this.sfxGainNode.gain.value = 0.2; // Volumen moderado para efectos
      this.sfxGainNode.connect(this.audioContext.destination);
    }
  }

  // Generar música lofi tranquila usando síntesis
  async startLofiMusic() {
    this.init();
    
    if (this.isMusicPlaying) return;
    
    this.isMusicPlaying = true;
    this.playLofiLoop();
  }

  // Loop de música animada con melodía
  playLofiLoop() {
    if (!this.isMusicPlaying) return;

    const now = this.audioContext.currentTime;
    
    // Melodía animada (canción pegadiza)
    const melody = [
      { note: 523.25, duration: 0.3 },  // C5
      { note: 587.33, duration: 0.3 },  // D5
      { note: 659.25, duration: 0.3 },  // E5
      { note: 587.33, duration: 0.3 },  // D5
      { note: 523.25, duration: 0.6 },  // C5
      { note: 392.00, duration: 0.3 },  // G4
      { note: 440.00, duration: 0.3 },  // A4
      { note: 493.88, duration: 0.6 },  // B4
      { note: 523.25, duration: 0.3 },  // C5
      { note: 587.33, duration: 0.3 },  // D5
      { note: 659.25, duration: 0.3 },  // E5
      { note: 698.46, duration: 0.3 },  // F5
      { note: 783.99, duration: 0.6 },  // G5
      { note: 659.25, duration: 0.3 },  // E5
      { note: 523.25, duration: 0.6 },  // C5
      { note: 440.00, duration: 0.6 },  // A4
    ];

    // Bajo rítmico
    const bassLine = [
      { note: 130.81, duration: 0.6 },  // C3
      { note: 146.83, duration: 0.6 },  // D3
      { note: 164.81, duration: 0.6 },  // E3
      { note: 146.83, duration: 0.6 },  // D3
      { note: 130.81, duration: 0.6 },  // C3
      { note: 196.00, duration: 0.6 },  // G3
      { note: 174.61, duration: 0.6 },  // F3
      { note: 164.81, duration: 0.6 },  // E3
    ];
    
    let currentTime = now;
    
    // Tocar melodía
    melody.forEach((note) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(note.note, currentTime);
      
      gain.gain.setValueAtTime(0, currentTime);
      gain.gain.linearRampToValueAtTime(0.15, currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, currentTime + note.duration - 0.1);
      gain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
      
      osc.connect(gain);
      gain.connect(this.musicGainNode);
      
      osc.start(currentTime);
      osc.stop(currentTime + note.duration);
      
      currentTime += note.duration;
    });

    // Tocar bajo
    let bassTime = now;
    bassLine.forEach((note) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(note.note, bassTime);
      
      gain.gain.setValueAtTime(0, bassTime);
      gain.gain.linearRampToValueAtTime(0.08, bassTime + 0.05);
      gain.gain.setValueAtTime(0.08, bassTime + note.duration - 0.1);
      gain.gain.linearRampToValueAtTime(0, bassTime + note.duration);
      
      osc.connect(gain);
      gain.connect(this.musicGainNode);
      
      osc.start(bassTime);
      osc.stop(bassTime + note.duration);
      
      bassTime += note.duration;
    });

    // Calcular duración total
    const totalDuration = melody.reduce((sum, note) => sum + note.duration, 0);
    
    // Repetir el loop
    setTimeout(() => {
      if (this.isMusicPlaying) {
        this.playLofiLoop();
      }
    }, totalDuration * 1000);
  }

  // Detener música
  stopMusic() {
    this.isMusicPlaying = false;
    if (this.musicSource) {
      this.musicSource.stop();
      this.musicSource = null;
    }
  }

  // Sonido de tecla presionada (clic suave)
  playKeySound() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    // Oscilador para el sonido de tecla
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    // Frecuencia aleatoria para variación
    const baseFreq = 800 + Math.random() * 200;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.05);
    
    osc.type = 'sine';
    
    // Envelope rápido (clic corto)
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Sonido de error (tecla incorrecta)
  playErrorSound() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.1);
  }

  // Sonido de éxito (letra correcta)
  playSuccessSound() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(1000, now + 0.05);
    
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.05);
  }

  // Sonido de clic en botón
  playButtonClick() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
    
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.08);
  }

  // Sonido de cuenta regresiva (3, 2, 1)
  playCountdownBeep() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.frequency.setValueAtTime(880, now);
    osc.type = 'sine';
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(this.sfxGainNode);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }

  // Sonido de inicio de juego (GO!)
  playGameStart() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    // Melodía ascendente rápida
    const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5
    
    notes.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      const startTime = now + (index * 0.08);
      
      osc.frequency.setValueAtTime(freq, startTime);
      osc.type = 'square';
      
      gain.gain.setValueAtTime(0.3, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);
      
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }

  // Sonido de victoria (juego terminado)
  playVictorySound() {
    if (!this.audioContext) this.init();

    const now = this.audioContext.currentTime;
    
    // Fanfarria de victoria
    const melody = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 0.12 },  // E5
      { freq: 783.99, time: 0.24 },  // G5
      { freq: 1046.50, time: 0.36 }, // C6
      { freq: 783.99, time: 0.50 },  // G5
      { freq: 1046.50, time: 0.62 }, // C6
    ];
    
    melody.forEach(({ freq, time }) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      
      const startTime = now + time;
      
      osc.frequency.setValueAtTime(freq, startTime);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
      
      osc.connect(gain);
      gain.connect(this.sfxGainNode);
      
      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  }

  // Ajustar volumen general
  setVolume(volume) {
    this.volume = volume / 100;
    if (this.musicGainNode) {
      this.musicGainNode.gain.value = this.volume * 0.6; // Volumen más alto
    }
    if (this.sfxGainNode) {
      this.sfxGainNode.gain.value = this.volume * 0.2;
    }
  }

  // Reanudar contexto de audio (necesario después de interacción del usuario)
  resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }
}

// Instancia singleton
const audioManager = new AudioManager();

export default audioManager;
