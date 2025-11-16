<script setup>
import { ref } from 'vue';

const props = defineProps({
  playerName: { type: String, default: '' }
});

const emit = defineEmits(['createRoom', 'back', 'goToRoomList', 'notify']);

// Configuración sala (modo TEXTO)
const roomName = ref('');
const maxPlayers = ref(4);
const roomPassword = ref('');
const isPrivate = ref(false);
const timeLimit = ref(3); // minutos
const numRounds = ref(3);
const difficulty = ref('normal');
const theme = ref('aleatori');

function handleCreateRoom() {
  if (!roomName.value.trim()) {
    emit('notify', { message: 'Per favor, introdueix un nom per a la sala.', type: 'warning' });
    return;
  }
  if (isPrivate.value && !roomPassword.value.trim()) {
    emit('notify', { message: 'Per favor, introdueix una contrasenya per a la sala privada.', type: 'warning' });
    return;
  }

  const roomConfig = {
    gameMode: 'texto',
    roomName: roomName.value,
    maxPlayers: maxPlayers.value,
    password: roomPassword.value,
    isPrivate: isPrivate.value,
    timeLimit: timeLimit.value,
    numRounds: numRounds.value,
    difficulty: difficulty.value,
    theme: theme.value,
  };

  emit('createRoom', roomConfig);
}

function handleBack() { emit('back'); }
</script>

<template>
  <div class="create-room-container">
    <div class="header-section">
      <div class="header-center">
        <h2 class="page-title">CONFIGURACIÓ DE LA PARTIDA</h2>
      </div>
      <div class="header-right">
        <button @click="handleBack" class="btn-cancel">✕ CANCEL·LAR</button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="main-panel">
        <!-- Borde neon superior -->
        <div class="neon-border neon-border-top"></div>

        <!-- Línea 1: Nombre de la sala -->
        <div class="config-row-1">
          <div class="config-box">
            <label class="config-label">📝 Nom de la Sala</label>
            <input 
              v-model="roomName" 
              type="text" 
              placeholder="Escriu el nom de la sala..."
              class="config-input"
              @keyup.enter="handleCreateRoom"
              autofocus
            />
          </div>
        </div>

        <!-- Línea 2: Jugadores, Visibilidad, Contraseña -->
        <div class="config-row-2">
          <div class="config-box">
            <label class="config-label">👥 Jugadors</label>
            <select v-model.number="maxPlayers" class="config-select">
              <option :value="2">2 jugadors</option>
              <option :value="4">4 jugadors</option>
              <option :value="6">6 jugadors</option>
              <option :value="8">8 jugadors</option>
            </select>
          </div>

          <div class="config-box">
            <label class="config-label">👁️ Visibilitat</label>
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

          <div class="config-box">
            <label class="config-label">🔒 Contrasenya (Opcional)</label>
            <input 
              v-model="roomPassword" 
              type="text" 
              placeholder="Deixar buit si és pública"
              class="config-input"
            />
          </div>
        </div>

        <!-- Línea 3: Rondes, Tiempo -->
        <div class="config-row-3">
          <div class="config-box">
            <label class="config-label">🔄 Rondes</label>
            <select v-model.number="numRounds" class="config-select">
              <option :value="1">1 ronda</option>
              <option :value="3">3 rondes</option>
              <option :value="5">5 rondes</option>
              <option :value="7">7 rondes</option>
            </select>
          </div>

          <div class="config-box">
            <label class="config-label">⏱️ Temps</label>
            <select v-model.number="timeLimit" class="config-select">
              <option :value="1">1 minut</option>
              <option :value="3">3 minuts</option>
              <option :value="5">5 minuts</option>
              <option :value="10">10 minuts</option>
            </select>
          </div>
        </div>

        <!-- Línea 4: Temática, Dificultad -->
        <div class="config-row-4">
          <div class="config-box">
            <label class="config-label">🎯 Temàtica</label>
            <select v-model="theme" class="config-select">
              <option value="aleatori">Aleatori</option>
              <option value="animals">Animals</option>
              <option value="pel·licules">Pel·lícules</option>
              <option value="programacio">Programació</option>
              <option value="esports">Esports</option>
            </select>
          </div>

          <div class="config-box">
            <label class="config-label">⚡ Dificultat</label>
            <select v-model="difficulty" class="config-select">
              <option value="facil">Fàcil</option>
              <option value="normal">Normal</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
        </div>

        <!-- Bordes neon inferiores -->
        <div class="neon-border neon-border-bottom-left"></div>
        <div class="neon-border neon-border-bottom-right"></div>
      </div>
    </div>

    <div class="footer-buttons">
      <button @click="handleCreateRoom" class="btn-create">CREAR SALA</button>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* Container sin márgenes exteriores, todo el contenido visible sin scroll */
.create-room-container {
  font-family: "Share Tech Mono", monospace;
  position: relative;
  width: 100vw;
  height: 100vh;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a0b2e 0%, #2d1654 50%, #1a0b2e 100%);
  color: #fff;
  overflow: hidden;
  box-sizing: border-box;
}

.create-room-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(138, 43, 226, 0.25) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 144, 255, 0.2) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 2rem;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
}

.header-right {
  position: absolute;
  right: 2rem;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 900;
  margin: 0;
  color: #ffffff;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8),
               0 0 40px rgba(240, 33, 185, 0.6);
}

.content-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  padding: 2rem 6rem;
  overflow: hidden;
}

.main-panel {
  width: 100%;
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
}

/* Bordes neon decorativos */
.neon-border {
  height: 3px;
  position: relative;
  margin: 0.5rem 0;
}

.neon-border-top {
  background: linear-gradient(90deg, transparent 0%, #00f0ff 50%, transparent 100%);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.8),
              0 0 20px rgba(0, 240, 255, 0.5);
  margin-bottom: 1rem;
}

.neon-border-bottom-left {
  background: linear-gradient(90deg, transparent 0%, #f021b9 50%, transparent 100%);
  box-shadow: 0 0 10px rgba(240, 33, 185, 0.8),
              0 0 20px rgba(240, 33, 185, 0.5);
  width: 45%;
  margin-right: auto;
  margin-top: 1rem;
}

.neon-border-bottom-right {
  background: linear-gradient(90deg, transparent 0%, #00f0ff 50%, transparent 100%);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.8),
              0 0 20px rgba(0, 240, 255, 0.5);
  width: 45%;
  margin-left: auto;
  margin-top: 0.3rem;
}

/* Línea 1: Nombre de la sala (ancho completo) */
.config-row-1 {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.2rem;
}

/* Línea 2: Jugadores, Visibilidad, Contraseña */
.config-row-2 {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
}

/* Línea 3: Rondas, Tiempo */
.config-row-3 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

/* Línea 4: Temática, Dificultad */
.config-row-4 {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.config-box {
  background: rgba(26, 11, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 12px;
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}

.config-box:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5),
              0 0 35px rgba(240, 33, 185, 0.3);
  transform: translateY(-2px);
}

.config-label {
  color: #ffffff;
  font-size: 0.85rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6),
               0 0 20px rgba(240, 33, 185, 0.4);
}

.config-input {
  background: rgba(45, 22, 84, 0.5);
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  color: #ffffff;
  font-size: 0.9rem;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.config-input::placeholder {
  color: rgba(0, 240, 255, 0.4);
  text-shadow: none;
}

.config-input:focus {
  border-color: rgba(0, 240, 255, 0.8);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6),
              0 0 30px rgba(240, 33, 185, 0.3);
  transform: scale(1.01);
}

.config-select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  background: rgba(45, 22, 84, 0.5);
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  padding: 0.75rem 0.9rem;
  color: #ffffff;
  font-size: 0.9rem;
  text-align: center;
  text-align-last: center;
  outline: none;
  transition: all 0.3s ease;
  font-family: "Share Tech Mono", monospace;
  cursor: pointer;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.config-select option {
  background: #0f0c29;
  color: #ffffff;
}

.config-select:focus {
  border-color: rgba(0, 240, 255, 0.8);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6),
              0 0 30px rgba(240, 33, 185, 0.3);
  transform: scale(1.01);
}

.radio-group {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  margin-top: 0.3rem;
  position: relative;
  z-index: 1;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  font-size: clamp(0.95rem, 1.1vw, 1.2rem);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.radio-label:hover span {
  color: #8a2be2;
  text-shadow: 0 0 15px rgba(138, 43, 226, 1),
               0 0 30px rgba(30, 144, 255, 0.8);
}

.radio-label span {
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.6),
               0 0 20px rgba(30, 144, 255, 0.4);
}

.radio-label input[type="radio"] {
  -webkit-appearance: none;
  appearance: none;
  background-color: transparent;
  width: 18px;
  height: 18px;
  border: 2.5px solid #00f0ff;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.7),
              0 0 20px rgba(240, 33, 185, 0.4);
}

.radio-label:hover input[type="radio"] {
  box-shadow: 0 0 20px rgba(0, 240, 255, 1),
              0 0 40px rgba(240, 33, 185, 0.6);
}

.radio-label input[type="radio"]:checked {
  background-color: rgba(0, 240, 255, 0.3);
  box-shadow: 0 0 25px rgba(0, 240, 255, 1),
              0 0 50px rgba(240, 33, 185, 0.8),
              inset 0 0 20px rgba(0, 240, 255, 0.6);
  border-color: #f021b9;
}

.radio-label input[type="radio"]:checked::before {
  content: '';
  display: block;
  width: 8px;
  height: 8px;
  background: #fff;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 15px rgba(255, 255, 255, 1),
              0 0 30px rgba(0, 240, 255, 1),
              0 0 45px rgba(240, 33, 185, 0.8);
}

/* Botones de acción */
.footer-buttons {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0 2rem 0;
}

.btn-create {
  padding: 0.9rem 2.5rem;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.15rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #00f0ff, #f021b9);
  color: #ffffff;
  text-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.6);
}

.btn-create:hover {
  box-shadow: 0 0 45px rgba(0, 240, 255, 1),
              0 0 65px rgba(240, 33, 185, 0.8);
  transform: scale(1.06);
  text-shadow: 0 0 18px rgba(255, 255, 255, 1),
               0 0 35px rgba(0, 240, 255, 1);
}

.btn-create:active {
  transform: scale(0.97);
}

.btn-cancel {
  padding: 0.65rem 1.5rem;
  background-color: transparent;
  color: #00f0ff;
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.35);
}

.btn-cancel:hover {
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.7),
              0 0 45px rgba(240, 33, 185, 0.5);
  transform: scale(1.05);
  text-shadow: 0 0 12px rgba(0, 240, 255, 1);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .config-row-2,
  .config-row-3,
  .config-row-4 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }

  .radio-group {
    gap: 1.5rem;
  }

  .btn-create {
    padding: 0.85rem 2rem;
    font-size: 0.95rem;
  }

  .btn-back,
  .btn-cancel {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .config-box {
    padding: 1rem 0.8rem;
  }

  .config-input,
  .config-select {
    padding: 0.7rem 0.8rem;
    font-size: 0.85rem;
  }

  .btn-create,
  .btn-back,
  .btn-cancel {
    padding: 0.7rem 1.5rem;
    font-size: 0.85rem;
  }
}
</style>
