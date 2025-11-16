<template>
  <div class="welcome-screen">
    <button class="settings-button" @click.stop="openSettings" title="Configuració">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
      </svg>
    </button>
    
    <transition name="settings-fade">
      <div v-if="showSettings" class="settings-overlay" @click="closeSettings">
        <div class="settings-panel" :class="{ 'animate-in': shouldAnimate }" @click.stop>
          <div class="settings-header">
            <h2>⚙️ Configuració</h2>
            <button class="close-button" @click="closeSettings">✕</button>
          </div>
          
          <div class="settings-content">
            <div class="setting-item volume-item">
              <div class="volume-header">
                <span class="volume-icon">🔊</span>
                <label>Volum d'efectes</label>
                <span class="value">{{ soundVolume }}%</span>
              </div>
              <div class="slider-container">
                <input type="range" min="0" max="100" v-model="soundVolume" @input="autoSaveSettings" class="slider">
                <div class="slider-fill" :style="{ width: soundVolume + '%' }"></div>
              </div>
            </div>
            
            <div class="setting-item volume-item">
              <div class="volume-header">
                <span class="volume-icon">🎵</span>
                <label>Volum de música</label>
                <span class="value">{{ musicVolume }}%</span>
              </div>
              <div class="slider-container">
                <input type="range" min="0" max="100" v-model="musicVolume" @input="autoSaveSettings" class="slider">
                <div class="slider-fill" :style="{ width: musicVolume + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <div class="welcome-container">
      <h1 class="game-title">
        <span class="letter letter-1">T</span>
        <span class="letter letter-2">E</span>
        <span class="letter letter-3">C</span>
        <span class="letter letter-4">L</span>
        <span class="letter letter-5">A</span>
        <span class="letter letter-6">Z</span>
        <span class="letter letter-7">O</span>
        <span class="emoji">🎮</span>
      </h1>

      <div class="welcome-form">
        <label for="playerName" class="input-label">INTRODUEIX EL TEU NOM</label>
        <input
          type="text"
          id="playerName"
          v-model="playerName"
          @keyup.enter="handleSubmit"
          placeholder="Jugador..."
          class="player-input"
          maxlength="20"
          autofocus
        />

        <label for="avatarColor" class="input-label">TRIA EL TEU COLOR</label>
        <div class="color-selector">
          <div
            class="avatar-preview"
            :style="{ backgroundColor: selectedColor }"
          >
            {{ playerName ? playerName.charAt(0).toUpperCase() : "?" }}
          </div>
          <input
            type="color"
            id="avatarColor"
            v-model="selectedColor"
            class="color-input"
          />
          <div class="color-presets">
            <button
              v-for="color in presetColors"
              :key="color"
              @click="selectedColor = color"
              class="color-preset"
              :style="{ backgroundColor: color }"
              :class="{ active: selectedColor === color }"
              type="button"
            ></button>
          </div>
        </div>

        <button
          @click="handleSubmit"
          class="btn-continue"
          :disabled="!playerName.trim()"
        >
          CONTINUA
        </button>
      </div>

      <div class="welcome-footer">
        <p class="hint">Prem ENTER per continuar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const playerName = ref("");
const selectedColor = ref("#F021B9");

const presetColors = [
  "#F021B9", // Rosa neón
  "#00F0FF", // Cian
  "#39FF14", // Verde neón
  "#FF0000", // Rojo
  "#FFD700", // Dorado
  "#FF6600", // Naranja
  "#9D00FF", // Púrpura
  "#00FF88", // Verde agua
  "#FF1493", // Rosa fuerte
  "#00CED1", // Turquesa
];

// Settings panel
const showSettings = ref(false);
const shouldAnimate = ref(false);
const soundVolume = ref(70);
const musicVolume = ref(50);

const emit = defineEmits(["continue"]);

const handleSubmit = () => {
  if (playerName.value.trim()) {
    emit("continue", {
      name: playerName.value.trim(),
      color: selectedColor.value,
    });
  }
};

const openSettings = () => {
  showSettings.value = true;
  shouldAnimate.value = true;
  // Remover la clase de animación después de que termine
  setTimeout(() => {
    shouldAnimate.value = false;
  }, 500);
};

const closeSettings = () => {
  showSettings.value = false;
};

const autoSaveSettings = () => {
  console.log("Configuració desada automàticament:", {
    soundVolume: soundVolume.value,
    musicVolume: musicVolume.value,
  });
  // Aquí puedes añadir lógica adicional como guardar en localStorage
  // localStorage.setItem('soundVolume', soundVolume.value);
  // localStorage.setItem('musicVolume', musicVolume.value);
};
</script>

<style scoped>
.welcome-screen {
  width: 100vw;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a192f;
  padding: 2rem;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
}

.settings-button {
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(30, 20, 60, 0.95), rgba(20, 15, 45, 0.95));
  backdrop-filter: blur(15px);
  border: 3px solid transparent;
  background-image: linear-gradient(135deg, rgba(30, 20, 60, 0.95), rgba(20, 15, 45, 0.95)),
                    linear-gradient(135deg, #8a2be2, #1e90ff);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: #8a2be2;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  z-index: 900;
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.5),
              0 0 50px rgba(30, 144, 255, 0.3);
  animation: settingsAppear 0.8s ease-out, settingsPulse 4s ease-in-out infinite;
}

@keyframes settingsAppear {
  from {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

@keyframes settingsPulse {
  0%, 100% {
    box-shadow: 0 0 30px rgba(138, 43, 226, 0.5),
                0 0 50px rgba(30, 144, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 50px rgba(138, 43, 226, 0.8),
                0 0 80px rgba(30, 144, 255, 0.6);
  }
}

.settings-button svg {
  width: 30px;
  height: 30px;
  transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0 8px rgba(138, 43, 226, 0.8));
}

.settings-button:hover {
  background-image: linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(30, 144, 255, 0.4)),
                    linear-gradient(135deg, #ff1493, #8a2be2, #1e90ff);
  color: #fff;
  transform: scale(1.15);
  box-shadow: 0 0 60px rgba(138, 43, 226, 1),
              0 0 100px rgba(30, 144, 255, 0.8),
              0 0 140px rgba(255, 20, 147, 0.6);
  animation: none;
}

.settings-button:hover svg {
  transform: rotate(180deg) scale(1.2);
  filter: drop-shadow(0 0 15px rgba(255, 255, 255, 1))
          drop-shadow(0 0 30px rgba(138, 43, 226, 1));
}

.settings-button:active {
  transform: scale(1.05);
  box-shadow: 0 0 40px rgba(138, 43, 226, 0.8),
              0 0 70px rgba(30, 144, 255, 0.6);
}

.settings-button:active svg {
  transform: rotate(360deg) scale(1.1);
}

/* Settings Panel Overlay */
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
  box-sizing: border-box;
}

.settings-panel {
  width: 100%;
  max-width: 550px;
  background: linear-gradient(145deg, rgba(26, 42, 74, 0.98), rgba(15, 30, 55, 0.98));
  border: 2px solid #00f0ff;
  border-radius: 24px;
  box-shadow: 0 0 80px rgba(0, 240, 255, 0.6),
    inset 0 0 40px rgba(0, 240, 255, 0.08),
    0 20px 60px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  animation: panelSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(10px);
}

@keyframes panelSlideIn {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-50px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.settings-header {
  background: linear-gradient(135deg, rgba(240, 33, 185, 0.15), rgba(0, 240, 255, 0.15));
  padding: 1.8rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid rgba(0, 240, 255, 0.4);
  position: relative;
  overflow: hidden;
}

.settings-header::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 240, 255, 0.1), transparent);
  animation: headerShine 3s ease-in-out infinite;
}

@keyframes headerShine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

.settings-header h2 {
  margin: 0;
  font-size: 1.6rem;
  color: #00f0ff;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 15px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.4);
  animation: headerGlow 2s ease-in-out infinite;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 1;
}

@keyframes headerGlow {
  0%, 100% {
    text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  }
  50% {
    text-shadow: 0 0 20px rgba(0, 240, 255, 0.9), 0 0 30px rgba(0, 240, 255, 0.5);
  }
}

.close-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(240, 33, 185, 0.15);
  border: 2px solid rgba(240, 33, 185, 0.5);
  color: #f021b9;
  font-size: 1.6rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  box-shadow: 0 4px 12px rgba(240, 33, 185, 0.3);
}

.close-button::before {
  content: "";
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.close-button:hover {
  background: rgba(240, 33, 185, 0.3);
  border-color: #f021b9;
  transform: rotate(90deg) scale(1.15);
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.8), 0 0 40px rgba(240, 33, 185, 0.4);
}

.close-button:hover::before {
  opacity: 0.2;
}

.settings-content {
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-height: 420px;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(0, 240, 255, 0.03) 0%, transparent 100%);
}

.settings-content::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track {
  background: rgba(0, 240, 255, 0.1);
  border-radius: 10px;
}

.settings-content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  border-radius: 10px;
}

.setting-item {
  padding: 1.5rem;
  background: rgba(10, 25, 47, 0.6);
  border-radius: 16px;
  border: 2px solid rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
  animation: itemFadeIn 0.5s ease-out backwards;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.setting-item:nth-child(1) { animation-delay: 0.1s; }
.setting-item:nth-child(2) { animation-delay: 0.2s; }
.setting-item:nth-child(3) { animation-delay: 0.3s; }

@keyframes itemFadeIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.setting-item:hover {
  background: rgba(10, 25, 47, 0.8);
  border-color: rgba(240, 33, 185, 0.5);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 33, 185, 0.2);
}

/* Volume Settings */
.volume-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.2rem;
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.05), rgba(240, 33, 185, 0.05));
  border-radius: 12px;
  border: 1px solid rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.volume-item:hover {
  background: linear-gradient(135deg, rgba(0, 240, 255, 0.08), rgba(240, 33, 185, 0.08));
  border-color: rgba(0, 240, 255, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 240, 255, 0.2);
}

.volume-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.volume-icon {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.6));
}

.volume-header label {
  flex: 1;
  font-size: 1rem;
  color: #00f0ff;
  font-family: "Share Tech Mono", monospace;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.4);
}

.value {
  font-size: 1.1rem;
  color: #f021b9;
  font-family: "Fira Code", monospace;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.6);
  min-width: 50px;
  text-align: right;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 20px;
  background: linear-gradient(180deg, rgba(5, 15, 30, 0.9), rgba(10, 25, 47, 0.8));
  border-radius: 14px;
  border: 2px solid rgba(0, 240, 255, 0.4);
  overflow: hidden;
  box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.5),
              0 2px 8px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.slider-container:hover {
  border-color: rgba(0, 240, 255, 0.6);
  box-shadow: inset 0 3px 10px rgba(0, 0, 0, 0.5),
              0 0 15px rgba(0, 240, 255, 0.3);
}

.slider-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: linear-gradient(90deg, #f021b9 0%, #ff1493 50%, #00f0ff 100%);
  transition: width 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(255, 255, 255, 0.3);
  border-radius: 14px;
  pointer-events: none;
  z-index: 1;
}

.slider-fill::after {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  width: 40%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2));
  animation: shimmer 2s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(300%);
  }
}

.slider {
  position: relative;
  width: 100%;
  height: 20px;
  background: transparent;
  outline: none;
  -webkit-appearance: none;
  cursor: grab;
  z-index: 2;
}

.slider:active {
  cursor: grabbing;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f021b9 0%, #ff1493 50%, #00f0ff 100%);
  cursor: grab;
  box-shadow: 0 0 25px rgba(240, 33, 185, 1), 
              0 0 40px rgba(0, 240, 255, 0.7),
              0 8px 15px rgba(0, 0, 0, 0.6),
              inset 0 2px 5px rgba(255, 255, 255, 0.5),
              inset 0 -2px 5px rgba(0, 0, 0, 0.3);
  border: 4px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.slider::-webkit-slider-thumb::before {
  content: "⋮⋮";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: bold;
  letter-spacing: -2px;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  cursor: grab;
  box-shadow: 0 0 35px rgba(240, 33, 185, 1), 
              0 0 50px rgba(0, 240, 255, 1),
              0 10px 25px rgba(0, 0, 0, 0.7),
              inset 0 2px 8px rgba(255, 255, 255, 0.7);
  border-color: rgba(255, 255, 255, 1);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(1.15);
  cursor: grabbing;
  box-shadow: 0 0 45px rgba(240, 33, 185, 1), 
              0 0 65px rgba(0, 240, 255, 1),
              0 12px 30px rgba(0, 0, 0, 0.8);
}

/* Firefox slider styles */
.slider::-moz-range-thumb {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f021b9 0%, #ff1493 50%, #00f0ff 100%);
  cursor: grab;
  box-shadow: 0 0 25px rgba(240, 33, 185, 1), 
              0 0 40px rgba(0, 240, 255, 0.7),
              0 8px 15px rgba(0, 0, 0, 0.6);
  border: 4px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 0 35px rgba(240, 33, 185, 1), 
              0 0 50px rgba(0, 240, 255, 1),
              0 10px 25px rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 1);
}

.slider::-moz-range-thumb:active {
  cursor: grabbing;
  transform: scale(1.15);
}

.slider::-moz-range-track {
  background: transparent;
  border: none;
}

/* Transition animations */
.settings-fade-enter-active {
  transition: opacity 0.3s ease;
}

.settings-fade-leave-active {
  transition: opacity 0.25s ease;
}

.settings-fade-enter-from,
.settings-fade-leave-to {
  opacity: 0;
}

/* Animación solo al abrir */
.settings-panel.animate-in {
  animation: panelSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes panelSlideIn {
  0% {
    transform: scale(0.8) translateY(-50px);
    opacity: 0;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

.welcome-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 50%,
      rgba(240, 33, 185, 0.15) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 50%,
      rgba(0, 240, 255, 0.15) 0%,
      transparent 50%
    );
  pointer-events: none;
  z-index: 0;
  animation: bgPulse 8s ease-in-out infinite;
}

@keyframes bgPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.welcome-screen::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(0, 240, 255, 0.5), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(240, 33, 185, 0.5), transparent),
    radial-gradient(1px 1px at 50% 50%, rgba(255, 255, 255, 0.3), transparent),
    radial-gradient(1px 1px at 80% 10%, rgba(0, 240, 255, 0.4), transparent),
    radial-gradient(2px 2px at 90% 60%, rgba(240, 33, 185, 0.4), transparent);
  background-size: 200% 200%;
  animation: particlesFloat 20s linear infinite;
  pointer-events: none;
  z-index: 0;
}

@keyframes particlesFloat {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 100% 100%;
  }
}

.welcome-container {
  width: 100%;
  max-width: 420px;
  padding: 1.5rem 1.8rem;
  background: rgba(26, 42, 74, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #00f0ff;
  border-radius: 20px;
  box-shadow: 0 0 50px rgba(0, 240, 255, 0.4),
    inset 0 0 30px rgba(0, 240, 255, 0.05);
  text-align: center;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  animation: fadeInScale 0.6s ease-out, borderGlow 3s ease-in-out infinite;
}

@keyframes borderGlow {
  0%, 100% {
    border-color: #00f0ff;
    box-shadow: 0 0 50px rgba(0, 240, 255, 0.4),
      inset 0 0 30px rgba(0, 240, 255, 0.05);
  }
  50% {
    border-color: #f021b9;
    box-shadow: 0 0 60px rgba(240, 33, 185, 0.6),
      inset 0 0 40px rgba(240, 33, 185, 0.1);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.game-title {
  font-size: 2.8rem;
  font-weight: 700;
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.1rem;
}

.letter {
  display: inline-block;
  animation: letterFloat 3s ease-in-out infinite, glitch 3s infinite alternate;
  transition: all 0.3s ease;
}

.letter:hover {
  transform: scale(1.3) rotate(10deg);
  animation: none;
}

.letter-1 {
  color: #ff0080;
  text-shadow: 0 0 20px #ff0080, 0 0 40px #ff0080;
  animation-delay: 0s;
}

.letter-2 {
  color: #00f0ff;
  text-shadow: 0 0 20px #00f0ff, 0 0 40px #00f0ff;
  animation-delay: 0.1s;
}

.letter-3 {
  color: #39ff14;
  text-shadow: 0 0 20px #39ff14, 0 0 40px #39ff14;
  animation-delay: 0.2s;
}

.letter-4 {
  color: #ff6600;
  text-shadow: 0 0 20px #ff6600, 0 0 40px #ff6600;
  animation-delay: 0.3s;
}

.letter-5 {
  color: #ffd700;
  text-shadow: 0 0 20px #ffd700, 0 0 40px #ffd700;
  animation-delay: 0.4s;
}

.letter-6 {
  color: #9d00ff;
  text-shadow: 0 0 20px #9d00ff, 0 0 40px #9d00ff;
  animation-delay: 0.5s;
}

.letter-7 {
  color: #ff1493;
  text-shadow: 0 0 20px #ff1493, 0 0 40px #ff1493;
  animation-delay: 0.6s;
}

.emoji {
  font-size: 2.2rem;
  display: inline-block;
  animation: emojiSpin 4s linear infinite;
  margin-left: 0.5rem;
  filter: drop-shadow(0 0 15px rgba(240, 33, 185, 0.6));
}

@keyframes letterFloat {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-10px) scale(1.05);
  }
}

@keyframes emojiSpin {
  0%, 90% {
    transform: rotate(0deg);
  }
  95% {
    transform: rotate(20deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

@keyframes glitch {
  0%,
  90%,
  100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, -2px);
  }
  98% {
    transform: translate(2px, 2px);
  }
}

.welcome-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  animation: slideInUp 0.8s ease-out 0.2s both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.input-label {
  font-size: 0.75rem;
  color: #00f0ff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
  display: block;
  text-align: left;
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.player-input {
  padding: 0.75rem 1rem;
  font-size: 0.95rem;
  font-family: "Fira Code", monospace;
  background: rgba(10, 25, 47, 0.6);
  color: #00f0ff;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 12px;
  outline: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
  width: 100%;
  box-sizing: border-box;
}

.player-input::placeholder {
  color: rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}

.player-input:hover {
  border-color: rgba(0, 240, 255, 0.7);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3),
    inset 0 0 15px rgba(0, 240, 255, 0.15);
}

.player-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.5),
    inset 0 0 20px rgba(240, 33, 185, 0.15);
  color: #f021b9;
  transform: scale(1.02);
  animation: inputPulse 1.5s ease-in-out infinite;
}

@keyframes inputPulse {
  0%, 100% {
    box-shadow: 0 0 25px rgba(240, 33, 185, 0.5),
      inset 0 0 20px rgba(240, 33, 185, 0.15);
  }
  50% {
    box-shadow: 0 0 35px rgba(240, 33, 185, 0.7),
      inset 0 0 25px rgba(240, 33, 185, 0.2);
  }
}

.color-selector {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(10, 25, 47, 0.4);
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(0, 240, 255, 0.1);
  transition: all 0.3s ease;
}

.color-selector:hover {
  background: rgba(10, 25, 47, 0.6);
  border-color: rgba(0, 240, 255, 0.3);
}

.avatar-preview {
  width: 55px;
  height: 55px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 700;
  color: #0a192f;
  box-shadow: 0 0 20px currentColor, 0 0 40px currentColor;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: "Fira Code", monospace;
  border: 3px solid rgba(255, 255, 255, 0.3);
  animation: avatarFloat 3s ease-in-out infinite;
}

@keyframes avatarFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-8px) rotate(5deg);
  }
}

.avatar-preview:hover {
  transform: scale(1.15) rotate(10deg);
  box-shadow: 0 0 30px currentColor, 0 0 60px currentColor;
}

.color-input {
  width: 100%;
  height: 35px;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 10px;
  cursor: pointer;
  background: transparent;
  transition: all 0.3s ease;
}

.color-input:hover {
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.4);
  transform: scale(1.02);
}

.color-presets {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  width: 100%;
  max-width: 260px;
}

.color-preset {
  width: 100%;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 10px rgba(255, 255, 255, 0.1);
  min-width: 30px;
  min-height: 30px;
  position: relative;
  animation: colorAppear 0.5s ease-out backwards;
}

.color-preset:nth-child(1) { animation-delay: 0.05s; }
.color-preset:nth-child(2) { animation-delay: 0.1s; }
.color-preset:nth-child(3) { animation-delay: 0.15s; }
.color-preset:nth-child(4) { animation-delay: 0.2s; }
.color-preset:nth-child(5) { animation-delay: 0.25s; }
.color-preset:nth-child(6) { animation-delay: 0.3s; }
.color-preset:nth-child(7) { animation-delay: 0.35s; }
.color-preset:nth-child(8) { animation-delay: 0.4s; }
.color-preset:nth-child(9) { animation-delay: 0.45s; }
.color-preset:nth-child(10) { animation-delay: 0.5s; }

@keyframes colorAppear {
  from {
    opacity: 0;
    transform: scale(0) rotate(180deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

.color-preset:hover {
  transform: scale(1.25) rotate(15deg);
  box-shadow: 0 0 25px currentColor, 0 0 40px currentColor;
  z-index: 10;
}

.color-preset.active {
  border-color: #ffffff;
  transform: scale(1.3);
  box-shadow: 0 0 30px currentColor, 0 0 50px currentColor, inset 0 0 15px rgba(255, 255, 255, 0.3);
  animation: activeColorPulse 1.5s ease-in-out infinite;
}

@keyframes activeColorPulse {
  0%, 100% {
    transform: scale(1.3);
    box-shadow: 0 0 30px currentColor, 0 0 50px currentColor;
  }
  50% {
    transform: scale(1.35);
    box-shadow: 0 0 40px currentColor, 0 0 70px currentColor;
  }
}

.btn-continue {
  padding: 0.8rem 2rem;
  font-size: 0.95rem;
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  color: #0a192f;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  width: 100%;
  margin-top: 0.3rem;
  animation: buttonBreathe 2s ease-in-out infinite;
}

@keyframes buttonBreathe {
  0%, 100% {
    box-shadow: 0 0 20px rgba(240, 33, 185, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  50% {
    box-shadow: 0 0 30px rgba(240, 33, 185, 0.6), 0 5px 20px rgba(0, 0, 0, 0.4);
  }
}

.btn-continue::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  transition: left 0.6s ease;
}

.btn-continue::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.btn-continue:hover::before {
  left: 100%;
}

.btn-continue:hover::after {
  width: 300px;
  height: 300px;
}

.btn-continue:hover {
  transform: scale(1.05) translateY(-3px);
  box-shadow: 0 0 40px rgba(240, 33, 185, 0.8), 0 8px 25px rgba(0, 0, 0, 0.4);
  animation: none;
}

.btn-continue:active {
  transform: scale(0.98) translateY(0);
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.6), 0 2px 10px rgba(0, 0, 0, 0.3);
}

.btn-continue:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
  animation: none;
}

.btn-continue:disabled:hover {
  transform: none;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4), 0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-continue:disabled::before,
.btn-continue:disabled::after {
  display: none;
}

.welcome-footer {
  margin-top: -0.8rem;
  animation: fadeIn 1s ease-out 0.5s both;
}

.hint {
  font-size: 0.65rem;
  color: rgba(0, 240, 255, 0.5);
  font-family: "Share Tech Mono", monospace;
  margin: 0;
  animation: hintBlink 3s ease-in-out infinite;
}

@keyframes hintBlink {
  0%, 100% {
    opacity: 0.5;
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .welcome-screen {
    padding: 1rem;
  }
  
  .welcome-container {
    max-width: 100%;
    padding: 1.5rem 1.2rem;
    gap: 1rem;
  }
  
  .game-title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 0.7rem;
  }
  
  .avatar-preview {
    width: 50px;
    height: 50px;
    font-size: 1.6rem;
  }
  
  .color-presets {
    grid-template-columns: repeat(5, 1fr);
    gap: 0.5rem;
    max-width: 240px;
  }
  
  .color-preset {
    min-width: 28px;
    min-height: 28px;
  }
}

@media (max-width: 480px) {
  .welcome-container {
    padding: 1.5rem 1rem;
  }
  
  .game-title {
    font-size: 2rem;
    letter-spacing: 0.2rem;
  }
  
  .subtitle {
    font-size: 0.75rem;
    letter-spacing: 0.15rem;
  }
  
  .input-label {
    font-size: 0.8rem;
  }
  
  .player-input {
    font-size: 1rem;
    padding: 0.9rem 1.2rem;
  }
  
  .btn-continue {
    font-size: 1rem;
    padding: 0.9rem 2rem;
  }
}
</style>
