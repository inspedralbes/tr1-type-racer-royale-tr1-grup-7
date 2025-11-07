<script setup>
import { ref } from 'vue';

const props = defineProps({
  playerName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['createRoom', 'back', 'goToRoomList', 'notify']);

// Configuraciones de la sala
const roomName = ref('');
const maxPlayers = ref(4);
const roomPassword = ref('');
const isPrivate = ref(false);
const timeLimit = ref(3);
const numRounds = ref(3);
const difficulty = ref('normal');
const theme = ref('aleatori');

function handleCreateRoom() {
  if (!roomName.value.trim()) {
    emit('notify', { message: 'Per favor, introdueix un nom per a la sala.', type: 'warning' });
    return;
  }
  // Si es privada y no tiene contraseña, pedirla
  if (isPrivate.value && !roomPassword.value.trim()) {
    emit('notify', { message: 'Per favor, introdueix una contrasenya per a la sala privada.', type: 'warning' });
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
    theme: theme.value
  };
  emit('createRoom', roomConfig);
}

function handleBack() {
  emit('back');
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
            <button @click="handleCreateRoom" class="btn-create">
              CREAR
            </button>
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
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header-section {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.btn-back {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-3px);
}

.page-title {
  font-size: 2.5rem;
  color: white;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  flex: 1;
  align-items: flex-start;
  justify-content: center;
  overflow-y: auto;
}

.center-panel {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
  width: 100%;
}

.name-section {
  background: linear-gradient(145deg, rgba(200, 0, 255, 0.2), rgba(150, 0, 255, 0.3));
  border: 3px solid rgba(200, 0, 255, 0.5);
  border-radius: 20px;
  padding: 2rem 3rem;
  box-shadow: 0 8px 32px rgba(200, 0, 255, 0.2);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-label {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
}

.room-input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  padding: 1rem;
  color: white;
  font-size: 1.2rem;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.room-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.room-input:focus {
  border-color: rgba(255, 0, 255, 0.8);
  box-shadow: 0 0 20px rgba(200, 0, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.config-box {
  background: linear-gradient(145deg, rgba(200, 0, 255, 0.15), rgba(150, 0, 255, 0.25));
  border: 2px solid rgba(200, 0, 255, 0.4);
  border-radius: 15px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.create-button-box {
  grid-column: span 4;
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.config-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

.config-select,
.config-input {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0.75rem;
  color: white;
  font-size: 1rem;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  font-family: 'Poppins', sans-serif;
}

.config-select option {
  background: #1a1a2e;
  color: white;
}

.config-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.config-select:focus,
.config-input:focus {
  border-color: rgba(255, 0, 255, 0.6);
  box-shadow: 0 0 15px rgba(200, 0, 255, 0.2);
  background: rgba(255, 255, 255, 0.15);
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.radio-label:hover {
  background: rgba(255, 255, 255, 0.05);
}

.radio-label input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: rgb(255, 0, 255);
}

.btn-create {
  width: 100%;
  padding: 1.5rem 3rem;
  font-size: 1.5rem;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.7), rgba(200, 0, 255, 0.9));
  color: white;
  border: 2px solid rgba(255, 0, 255, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-create:hover {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.9), rgba(200, 0, 255, 1));
  transform: scale(1.02);
  box-shadow: 0 6px 25px rgba(255, 0, 255, 0.4);
}

.side-buttons {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 150px;
}

.btn-action {
  padding: 1.5rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.7), rgba(200, 0, 255, 0.9));
  color: white;
  border: 2px solid rgba(255, 0, 255, 0.8);
}

.btn-action:hover {
  background: linear-gradient(135deg, rgba(255, 0, 255, 0.9), rgba(200, 0, 255, 1));
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(255, 0, 255, 0.4);
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
