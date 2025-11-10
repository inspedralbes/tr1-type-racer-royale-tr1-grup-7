<template>
  <div v-if="isOpen" class="settings-overlay" @click.self="closeSettings">
    <div class="settings-panel">
      <div class="settings-header">
        <h2 class="settings-title">CONFIGURACIÓ</h2>
        <button @click="closeSettings" class="btn-close">✕</button>
      </div>

      <div class="settings-content">
        <!-- Nombre del jugador -->
        <div class="setting-group">
          <label class="setting-label">NOM DEL JUGADOR</label>
          <input
            type="text"
            v-model="localPlayerName"
            class="setting-input"
            maxlength="20"
            placeholder="El teu nom..."
          />
        </div>

        <!-- Selector de color -->
        <div class="setting-group">
          <label class="setting-label">COLOR DE L'AVATAR</label>
          <div class="color-selector">
            <div
              class="avatar-preview"
              :style="{ backgroundColor: localPlayerColor }"
            >
              {{
                localPlayerName ? localPlayerName.charAt(0).toUpperCase() : "?"
              }}
            </div>
            <input
              type="color"
              v-model="localPlayerColor"
              class="color-input"
            />
            <div class="color-presets">
              <button
                v-for="color in presetColors"
                :key="color"
                @click="localPlayerColor = color"
                class="color-preset"
                :style="{ backgroundColor: color }"
                :class="{ active: localPlayerColor === color }"
                type="button"
              ></button>
            </div>
          </div>
        </div>

        <!-- Volumen -->
        <div class="setting-group">
          <label class="setting-label">VOLUM</label>
          <div class="volume-container">
            <input
              type="range"
              v-model="localVolume"
              min="0"
              max="100"
              class="volume-slider"
            />
            <span class="volume-value">{{ localVolume }}%</span>
          </div>
        </div>
      </div>

      <div class="settings-footer">
        <button @click="saveSettings" class="btn-save">GUARDAR</button>
        <button @click="closeSettings" class="btn-cancel">CANCEL·LAR</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: Boolean,
  playerName: String,
  playerColor: String,
  volume: Number,
});

const emit = defineEmits(["close", "save"]);

const localPlayerName = ref(props.playerName || "");
const localPlayerColor = ref(props.playerColor || "#F021B9");
const localVolume = ref(props.volume || 50);

const presetColors = [
  "#F021B9",
  "#00F0FF",
  "#39FF14",
  "#FF0000",
  "#FFD700",
  "#FF6600",
  "#9D00FF",
  "#00FF88",
  "#FF1493",
  "#00CED1",
];

watch(
  () => props.playerName,
  (newVal) => {
    localPlayerName.value = newVal || "";
  }
);

watch(
  () => props.playerColor,
  (newVal) => {
    localPlayerColor.value = newVal || "#F021B9";
  }
);

watch(
  () => props.volume,
  (newVal) => {
    localVolume.value = newVal || 50;
  }
);

const saveSettings = () => {
  emit("save", {
    playerName: localPlayerName.value.trim(),
    playerColor: localPlayerColor.value,
    volume: localVolume.value,
  });
};

const closeSettings = () => {
  emit("close");
};
</script>

<style scoped>
.settings-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.settings-panel {
  width: 90%;
  max-width: 500px;
  background: #1a2a4a;
  border: 2px solid #00f0ff;
  border-radius: 12px;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.4);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 240, 255, 0.3);
}

.settings-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #00f0ff;
  text-shadow: 0 0 10px #00f0ff;
  font-family: "Share Tech Mono", monospace;
  margin: 0;
}

.btn-close {
  width: 40px;
  height: 40px;
  background: transparent;
  color: #ff0000;
  border: 2px solid #ff0000;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  background: #ff0000;
  color: #ffffff;
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
}

.settings-content {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-height: 60vh;
  overflow-y: auto;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.setting-label {
  font-size: 0.9rem;
  color: #00f0ff;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.setting-input {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-family: "Fira Code", monospace;
  background: rgba(10, 25, 47, 0.6);
  color: #00f0ff;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
}

.setting-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.4);
}

.color-selector {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: rgba(10, 25, 47, 0.4);
  border-radius: 8px;
  border: 2px solid rgba(0, 240, 255, 0.3);
}

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #0a192f;
  box-shadow: 0 0 15px currentColor;
  font-family: "Fira Code", monospace;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.color-input {
  width: 100%;
  height: 40px;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.color-presets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.color-preset {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.color-preset:hover {
  transform: scale(1.15);
  box-shadow: 0 0 15px currentColor;
}

.color-preset.active {
  border-color: #ffffff;
  transform: scale(1.2);
  box-shadow: 0 0 20px currentColor;
}

.volume-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.volume-slider {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: rgba(0, 240, 255, 0.2);
  outline: none;
  appearance: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f021b9;
  cursor: pointer;
  box-shadow: 0 0 10px #f021b9;
}

.volume-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f021b9;
  cursor: pointer;
  box-shadow: 0 0 10px #f021b9;
  border: none;
}

.volume-value {
  min-width: 50px;
  color: #00f0ff;
  font-family: "Fira Code", monospace;
  font-weight: 600;
  text-align: right;
}

.settings-footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(0, 240, 255, 0.3);
}

.btn-save,
.btn-cancel {
  flex: 1;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: "Share Tech Mono", monospace;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.btn-save {
  background: linear-gradient(135deg, #f021b9, #ff00ff);
  color: #ffffff;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.4);
}

.btn-save:hover {
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.6);
  transform: translateY(-2px);
}

.btn-cancel {
  background: transparent;
  color: #00f0ff;
  border: 2px solid #00f0ff;
}

.btn-cancel:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
}

/* Scrollbar */
.settings-content::-webkit-scrollbar {
  width: 8px;
}

.settings-content::-webkit-scrollbar-track {
  background: rgba(10, 25, 47, 0.5);
  border-radius: 4px;
}

.settings-content::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f021b9, #00f0ff);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(240, 33, 185, 0.5);
}
</style>
