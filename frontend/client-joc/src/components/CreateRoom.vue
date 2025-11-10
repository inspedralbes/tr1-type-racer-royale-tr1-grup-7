<script setup>
import { ref } from "vue";

const props = defineProps({
  playerName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["createRoom", "back", "goToRoomList", "notify"]);

// Configuraciones de la sala
const roomName = ref("");
const maxPlayers = ref(4);
const roomPassword = ref("");
const isPrivate = ref(false);
const timeLimit = ref(3);
const numRounds = ref(3);
const difficulty = ref("normal");
const theme = ref("aleatori");

function handleCreateRoom() {
  if (!roomName.value.trim()) {
    emit("notify", {
      message: "Per favor, introdueix un nom per a la sala.",
      type: "warning",
    });
    return;
  }
  // Si es privada y no tiene contraseña, pedirla
  if (isPrivate.value && !roomPassword.value.trim()) {
    emit("notify", {
      message: "Per favor, introdueix una contrasenya per a la sala privada.",
      type: "warning",
    });
    return;
  }
  const roomConfig = {
    roomName: roomName.value,
    maxPlayers: maxPlayers.value,
    password: roomPassword.value,
    isPrivate: isPrivate.value,
    timeLimit: timeLimit.value,
    numRounds: numRounds.value,
    difficulty: difficulty.value,
    theme: theme.value,
  };
  emit("createRoom", roomConfig);
}

function handleBack() {
  emit("back");
}

// Eliminat InfoDialog local: les validacions s'envien a la cua global via 'notify'
</script>

<template>
  <div class="create-room-container">
    <div class="header-section">
      <button @click="handleBack" class="btn-back">← Enrere</button>
      <h2 class="page-title">Crear sala</h2>
    </div>

    <div class="content-wrapper">
      <!-- Panel central con nombre de sala -->
      <div class="center-panel">
        <div class="name-section">
          <label class="input-label">Nombre sala</label>
          <input
            v-model="roomName"
            type="text"
            placeholder="Escriu el nom de la sala..."
            class="room-input"
            @keyup.enter="handleCreateRoom"
            autofocus
          />
        </div>

        <!-- Grid de configuraciones -->
        <div class="config-grid">
          <!-- Máximo jugadores -->
          <div class="config-box">
            <label class="config-label">Número máximo de jugadors</label>
            <select v-model.number="maxPlayers" class="config-select">
              <option :value="2">2 jugadors</option>
              <option :value="4">4 jugadors</option>
              <option :value="6">6 jugadors</option>
              <option :value="8">8 jugadors</option>
            </select>
          </div>

          <!-- Contraseña -->
          <div class="config-box">
            <label class="config-label">Contrasenya (opcional)</label>
            <input
              v-model="roomPassword"
              type="text"
              placeholder="Sense contrasenya"
              class="config-input"
            />
          </div>

          <!-- Visibilidad -->
          <div class="config-box">
            <label class="config-label">Visibilitat de la sala</label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" :value="false" v-model="isPrivate" />
                <span>Pública</span>
              </label>
              <label class="radio-label">
                <input type="radio" :value="true" v-model="isPrivate" />
                <span>Privada</span>
              </label>
            </div>
          </div>

          <!-- Límite de tiempo -->
          <div class="config-box">
            <label class="config-label">Límit de temps (minuts)</label>
            <select v-model.number="timeLimit" class="config-select">
              <option :value="1">1 minut</option>
              <option :value="3">3 minuts</option>
              <option :value="5">5 minuts</option>
              <option :value="10">10 minuts</option>
            </select>
          </div>

          <!-- Número de rondas -->
          <div class="config-box">
            <label class="config-label">Nombre de rondes</label>
            <select v-model.number="numRounds" class="config-select">
              <option :value="1">1 ronda</option>
              <option :value="3">3 rondes</option>
              <option :value="5">5 rondes</option>
              <option :value="7">7 rondes</option>
            </select>
          </div>

          <!-- Dificultad -->
          <div class="config-box">
            <label class="config-label">Dificultat</label>
            <select v-model="difficulty" class="config-select">
              <option value="facil">Fàcil</option>
              <option value="normal">Normal</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>

          <!-- Temática -->
          <div class="config-box">
            <label class="config-label">Temàtica</label>
            <select v-model="theme" class="config-select">
              <option value="aleatori">Aleatori</option>
              <option value="animals">Animals</option>
              <option value="pel·licules">Pel·lícules</option>
              <option value="programacio">Programació</option>
              <option value="esports">Esports</option>
            </select>
          </div>

          <!-- Botón Crear (grande, abajo) -->
          <div class="config-box create-button-box">
            <button @click="handleCreateRoom" class="btn-create">CREAR</button>
          </div>
        </div>
      </div>

      <!-- Botones laterales -->
      <div class="side-buttons">
        <button @click="emit('goToRoomList')" class="btn-action btn-lista">
          LISTA
        </button>
        <button @click="emit('goToRoomList')" class="btn-action btn-unirse">
          UNIRSE
        </button>
      </div>
    </div>
  </div>
  <!-- InfoDialog local eliminat -->
</template>

<style scoped>
.create-room-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  padding: 2vh 2vw;
  display: flex;
  flex-direction: column;
  gap: 2vh;
  background: #0a192f;
  overflow: hidden;
}

.create-room-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 20% 30%,
      rgba(240, 33, 185, 0.1) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(0, 240, 255, 0.1) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 2vw;
  position: relative;
  z-index: 1;
}

.btn-back {
  background: rgba(26, 42, 74, 0.6);
  border: 2px solid #00f0ff;
  color: #00f0ff;
  padding: 1vh 2vw;
  border-radius: 8px;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
  font-family: "Share Tech Mono", monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1rem;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.btn-back:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #f021b9;
  color: #f021b9;
  transform: translateX(-3px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
}

.page-title {
  font-size: clamp(2rem, 4vw, 3rem);
  color: #f021b9;
  font-weight: 700;
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.8),
    0 0 20px rgba(240, 33, 185, 0.5);
  letter-spacing: 0.15rem;
}

.content-wrapper {
  display: flex;
  gap: 2vw;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
  position: relative;
  z-index: 1;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  max-width: 900px;
  width: 100%;
}

.name-section {
  background: rgba(26, 42, 74, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid #f021b9;
  border-radius: 16px;
  padding: 2vh 3vw;
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.3),
    inset 0 0 20px rgba(240, 33, 185, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.5vh;
}

.input-label {
  color: #00f0ff;
  font-size: clamp(0.95rem, 1.2vw, 1.1rem);
  font-weight: 600;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

.room-input {
  background: rgba(10, 25, 47, 0.6);
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 10px;
  padding: 1.5vh 2vw;
  color: #00f0ff;
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  font-family: "Fira Code", monospace;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
}

.room-input::placeholder {
  color: rgba(0, 240, 255, 0.3);
}

.room-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4),
    inset 0 0 15px rgba(240, 33, 185, 0.1);
  color: #f021b9;
  transform: scale(1.01);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5vh 1.5vw;
}

.config-box {
  background: rgba(26, 42, 74, 0.6);
  backdrop-filter: blur(5px);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 12px;
  padding: 1.5vh 1vw;
  display: flex;
  flex-direction: column;
  gap: 1vh;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.config-box:hover {
  border-color: #f021b9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.3);
}

.create-button-box {
  grid-column: span 3;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
  margin-top: 1vh;
}

.create-button-box:hover {
  border: none;
  box-shadow: none;
}

.config-label {
  color: #00f0ff;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
  font-weight: 600;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
  letter-spacing: 0.05rem;
}

.config-select,
.config-input {
  background: rgba(10, 25, 47, 0.6);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 8px;
  padding: 1vh 0.5vw;
  color: #00f0ff;
  font-size: clamp(0.85rem, 1.1vw, 1rem);
  font-family: "Fira Code", monospace;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 8px rgba(0, 240, 255, 0.1);
}

.config-select option {
  background: #0a192f;
  color: #00f0ff;
}

.config-input::placeholder {
  color: rgba(0, 240, 255, 0.3);
}

.config-select:focus,
.config-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.3),
    inset 0 0 10px rgba(240, 33, 185, 0.1);
  color: #f021b9;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.5vh;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5vw;
  color: #00f0ff;
  font-size: clamp(0.8rem, 1vw, 0.95rem);
  font-family: "Fira Code", monospace;
  cursor: pointer;
  padding: 0.5vh 0.5vw;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.radio-label:hover {
  background: rgba(0, 240, 255, 0.1);
}

.radio-label input[type="radio"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #f021b9;
}

.btn-create {
  width: 100%;
  padding: 2vh 3vw;
  min-height: 60px;
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  color: #0a192f;
  border: 2px solid transparent;
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-create::before {
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

.btn-create:hover::before {
  left: 100%;
}

.btn-create:hover {
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(240, 33, 185, 0.6);
}

.side-buttons {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  min-width: 150px;
}

.btn-action {
  padding: 2vh 2vw;
  min-height: 80px;
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.3),
    rgba(240, 33, 185, 0.3)
  );
  color: #00f0ff;
  border: 2px solid #00f0ff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.btn-action:hover {
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.4),
    rgba(240, 33, 185, 0.4)
  );
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.5);
  border-color: #f021b9;
  color: #f021b9;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.8);
}

@media (max-width: 1200px) {
  .config-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .create-button-box {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }

  .config-grid {
    grid-template-columns: 1fr;
  }

  .create-button-box {
    grid-column: span 1;
  }

  .side-buttons {
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
}
</style>
