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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a192f;
  padding: clamp(1vh, 2vh, 4vh) clamp(2vw, 4vw, 6vw);
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
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
  width: clamp(400px, 40vw, 70vw);
  height: auto;
  max-height: 90vh;
  min-height: auto;
  padding: clamp(1rem, 2vh, 3vh) clamp(1.5rem, 3vw, 4vw);
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
  gap: clamp(0.8rem, 1.5vh, 2vh);
  overflow-y: auto;
  margin: clamp(1vh, 2vh, 3vh) 0;
}

.game-title {
  font-size: clamp(1.8rem, 3.5vw, 4rem);
  font-weight: 700;
  color: #f021b9;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.8),
    0 0 20px rgba(240, 33, 185, 0.5), 0 0 30px rgba(240, 33, 185, 0.3);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  animation: glitch 3s infinite alternate;
  letter-spacing: clamp(0.08rem, 0.25vw, 0.3rem);
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
  font-size: clamp(0.6rem, 1vw, 1rem);
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: clamp(0.08rem, 0.15vw, 0.25rem);
  text-transform: uppercase;
}

.welcome-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(1rem, 2.5vw, 3rem);
  align-items: start;
  padding: clamp(0.5rem, 1vh, 1.5rem) 0;
  margin: clamp(0.5rem, 1vh, 1.5rem) 0;
}

.input-label {
  font-size: clamp(0.7rem, 1.1vw, 1.1rem);
  color: #00f0ff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
  font-family: "Share Tech Mono", monospace;
  letter-spacing: clamp(0.08rem, 0.18vw, 0.25rem);
  text-transform: uppercase;
  margin-bottom: clamp(0.6rem, 1vh, 1.2rem);
  display: block;
  text-align: center;
}

.player-input {
  padding: clamp(0.8rem, 1.5vh, 2rem) clamp(1rem, 2vw, 2.5rem);
  font-size: clamp(1rem, 1.3vw, 1.5rem);
  font-family: "Fira Code", monospace;
  background: rgba(10, 25, 47, 0.6);
  color: #00f0ff;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
  min-height: clamp(40px, 5vh, 65px);
  width: 100%;
  box-sizing: border-box;
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
  gap: clamp(0.8rem, 1.2vh, 1.5rem);
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 2vh, 2.5rem) clamp(0.8rem, 1.5vw, 2rem);
  background: rgba(10, 25, 47, 0.4);
  border-radius: 10px;
  width: 100%;
  box-sizing: border-box;
}

.avatar-preview {
  width: clamp(40px, 4vw, 70px);
  height: clamp(40px, 4vw, 70px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1.2rem, 2vw, 2.2rem);
  font-weight: 700;
  color: #0a192f;
  box-shadow: 0 0 15px currentColor;
  transition: all 0.3s ease;
  font-family: "Fira Code", monospace;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.color-input {
  width: 100%;
  height: clamp(30px, 3vh, 50px);
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
  gap: clamp(0.4rem, 0.8vw, 0.8rem);
  flex-wrap: wrap;
  justify-content: center;
  max-width: 100%;
  padding: 0 clamp(0.5rem, 1vw, 1rem);
}

.color-preset {
  width: clamp(25px, 2.5vw, 45px);
  height: clamp(25px, 2.5vw, 45px);
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
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
  padding: clamp(0.6rem, 1.2vh, 1.5rem) clamp(1.5rem, 3vw, 4rem);
  min-height: clamp(40px, 4vh, 55px);
  font-size: clamp(0.8rem, 1.1vw, 1.2rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  color: #0a192f;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: clamp(0.1rem, 0.18vw, 0.25rem);
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.4);
  position: relative;
  overflow: hidden;
  grid-column: 1 / -1;
  justify-self: center;
  width: clamp(200px, 22vw, 350px);
  margin-top: clamp(0.3rem, 0.8vh, 1rem);
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
@media (max-height: 800px) {
  /* Ventanas con altura limitada */
  .welcome-screen {
    padding: 1vh 2vw;
    align-items: flex-start;
    justify-content: center;
    padding-top: 2vh;
  }
  
  .welcome-container {
    width: clamp(380px, 38vw, 65vw);
    max-height: 95vh;
    padding: clamp(0.8rem, 1.5vh, 2vh) clamp(1.2rem, 2.5vw, 3vw);
    gap: clamp(0.5rem, 1vh, 1.2vh);
    margin: 1vh 0;
  }
  
  .welcome-form {
    gap: clamp(0.8rem, 1.8vw, 2rem);
    padding: clamp(0.3rem, 0.6vh, 0.8rem) 0;
    margin: clamp(0.3rem, 0.6vh, 0.8rem) 0;
  }
  
  .game-title {
    font-size: clamp(1.5rem, 3vw, 3.2rem);
  }
  
  .btn-continue {
    margin-top: clamp(0.2rem, 0.5vh, 0.6rem);
  }
}

@media (max-width: 1400px) and (max-height: 900px) {
  /* Laptops estándar */
  .welcome-container {
    width: clamp(350px, 35vw, 60vw);
    padding: clamp(1rem, 2vh, 2.5vh) clamp(1.2rem, 2.5vw, 3.5vw);
  }
}

@media (max-width: 1200px) {
  .welcome-screen {
    padding: 3vh 4vw;
  }
  
  .welcome-container {
    width: clamp(400px, 45vw, 75vw);
  }
}

@media (max-width: 768px) {
  .welcome-screen {
    padding: 2vh 2vw;
  }

  .welcome-container {
    padding: 1.5rem 1.2rem;
    width: clamp(350px, 90vw, 95vw);
  }

  .welcome-form {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .game-title {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
  }

  .subtitle {
    font-size: clamp(0.7rem, 2vw, 1rem);
  }

  .btn-continue {
    width: 90%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .welcome-screen {
    padding: 1vh 1vw;
  }

  .welcome-container {
    padding: 1rem 0.8rem;
    width: 95vw;
  }

  .game-title {
    font-size: clamp(1.5rem, 6vw, 2rem);
  }

  .subtitle {
    font-size: clamp(0.6rem, 3vw, 0.8rem);
  }
}
</style>
