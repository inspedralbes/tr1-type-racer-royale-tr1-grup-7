<template>
  <div class="welcome-screen">
    <div class="welcome-container">
      <h1 class="game-title">TECLAZO 🎮</h1>
      <p class="subtitle">TYPING BATTLE ROYALE</p>

      <div class="welcome-form">
        <label for="playerName" class="input-label">INGRESA TU NOMBRE</label>
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

        <label for="avatarColor" class="input-label">ELIGE TU COLOR</label>
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
          CONTINUAR
        </button>
      </div>

      <div class="welcome-footer">
        <p class="hint">Presiona ENTER para continuar</p>
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

const emit = defineEmits(["continue"]);

const handleSubmit = () => {
  if (playerName.value.trim()) {
    emit("continue", {
      name: playerName.value.trim(),
      color: selectedColor.value,
    });
  }
};
</script>

<style scoped>
.welcome-screen {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a192f;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
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
      rgba(240, 33, 185, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 50%,
      rgba(0, 240, 255, 0.1) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.welcome-container {
  width: 85vw;
  height: 75vh;
  max-width: none;
  padding: 2vh 3vw;
  background: rgba(26, 42, 74, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #00f0ff;
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.4),
    inset 0 0 20px rgba(0, 240, 255, 0.05);
  text-align: center;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2vh;
  overflow: hidden;
}

.game-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #f021b9;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.8),
    0 0 20px rgba(240, 33, 185, 0.5), 0 0 30px rgba(240, 33, 185, 0.3);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  animation: glitch 3s infinite alternate;
  letter-spacing: clamp(0.2rem, 0.5vw, 0.5rem);
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

.subtitle {
  font-size: clamp(0.85rem, 1.3vw, 1rem);
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: clamp(0.2rem, 0.4vw, 0.4rem);
  text-transform: uppercase;
}

.welcome-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5vw;
  align-items: center;
  padding: 0;
}

.input-label {
  font-size: clamp(0.85rem, 1.2vw, 1rem);
  color: #00f0ff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
  font-family: "Share Tech Mono", monospace;
  letter-spacing: clamp(0.1rem, 0.2vw, 0.2rem);
  text-transform: uppercase;
  margin-bottom: 1vh;
}

.player-input {
  padding: 1.5vh 2vw;
  font-size: clamp(1rem, 1.4vw, 1.3rem);
  font-family: "Fira Code", monospace;
  background: rgba(10, 25, 47, 0.6);
  color: #00f0ff;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
  min-height: 50px;
}

.player-input::placeholder {
  color: rgba(0, 240, 255, 0.3);
}

.player-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4),
    inset 0 0 15px rgba(240, 33, 185, 0.1);
  color: #f021b9;
  transform: scale(1.02);
}

.color-selector {
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
  align-items: center;
  justify-content: center;
  padding: 2vh 2vw;
  background: rgba(10, 25, 47, 0.4);
  border-radius: 10px;
}

.avatar-preview {
  width: clamp(60px, 7vw, 80px);
  height: clamp(60px, 7vw, 80px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.8rem, 2.5vw, 2.5rem);
  font-weight: 700;
  color: #0a192f;
  box-shadow: 0 0 20px currentColor;
  transition: all 0.3s ease;
  font-family: "Fira Code", monospace;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.color-input {
  width: 100%;
  height: 45px;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
  transition: all 0.3s ease;
}

.color-input:hover {
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.4);
}

.color-presets {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.color-preset {
  width: clamp(35px, 4.5vw, 50px);
  height: clamp(35px, 4.5vw, 50px);
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.color-preset:hover {
  transform: scale(1.2);
  box-shadow: 0 0 20px currentColor;
}

.color-preset.active {
  border-color: #ffffff;
  transform: scale(1.3);
  box-shadow: 0 0 25px currentColor;
}

.btn-continue {
  padding: 1.8vh 4vw;
  min-height: 55px;
  font-size: clamp(1rem, 1.6vw, 1.3rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  color: #0a192f;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: clamp(0.15rem, 0.3vw, 0.25rem);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
  position: relative;
  overflow: hidden;
  grid-column: 1 / -1;
  justify-self: center;
  width: 40%;
  min-width: 250px;
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
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.5s ease;
}

.btn-continue:hover::before {
  left: 100%;
}

.btn-continue:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.6);
}

.btn-continue:active {
  transform: scale(0.98);
}

.btn-continue:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn-continue:disabled:hover {
  transform: none;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
}

.welcome-footer {
  margin-top: 0;
}

.hint {
  font-size: 0.75rem;
  color: rgba(0, 240, 255, 0.5);
  font-family: "Share Tech Mono", monospace;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .game-title {
    font-size: 3rem;
  }

  .subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.2rem;
  }

  .welcome-container {
    padding: 2rem 1.5rem;
  }
}
</style>
