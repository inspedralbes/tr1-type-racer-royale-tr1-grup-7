<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  rooms: {
    type: Array,
    default: () => []
  },
  playerName: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['joinRoom', 'createRoom', 'back', 'notify']);

const searchQuery = ref('');

// Debug: Ver qué rooms estamos recibiendo
watch(() => props.rooms, (newRooms) => {
  console.log('🔍 RoomList recibió rooms:', newRooms);
  console.log('🔍 Tipo:', typeof newRooms, 'Es Array:', Array.isArray(newRooms));
  console.log('🔍 Longitud:', newRooms?.length);
}, { immediate: true });

// Filtrar salas según la búsqueda
const filteredRooms = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.rooms;
  }
  return props.rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

function handleJoinRoom(room) {
  if (!props.playerName.trim()) {
    emit('notify', { message: 'Per favor, introdueix el teu nom primer.', type: 'warning' });
    return;
  }
  if (room) emit('joinRoom', room.name);
}

function handleCreateRoom() {
  emit('createRoom');
}

function handleBack() {
  emit('back');
}

// Eliminat InfoDialog local: notificacions s'envien a App.vue
</script>

<template>
  <div class="room-list-container">
    <!-- Header con título centrado y botón atrás -->
    <div class="header-section">
      <div class="header-center">
        <h2 class="page-title">SALAS</h2>
      </div>
      <div class="header-right">
        <button @click="handleBack" class="btn-back">← ATRÁS</button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="main-panel">
        <!-- Buscador -->
        <div class="search-box">
          <div class="search-icon">🔍</div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar sala..."
            class="search-input"
          />
        </div>

        <!-- Lista de salas -->
        <div class="rooms-section">
          <div class="rooms-grid">
            <template v-if="filteredRooms.length > 0">
              <button 
                v-for="room in filteredRooms" 
                :key="room.name"
                @click="handleJoinRoom(room)"
                class="room-card"
              >
                <div class="room-icon">🎮</div>
                <div class="room-info">
                  <div class="room-name">{{ room.name }}</div>
                  <div class="room-details">
                    {{ room.playerCount }}/{{ room.maxPlayers }} jugadors
                    <span v-if="room.isPrivate" class="badge">🔒</span>
                  </div>
                </div>
              </button>
            </template>
            
            <div v-else class="no-rooms">
              <div class="no-rooms-icon">{{ searchQuery.trim() ? '🔍' : '🎲' }}</div>
              <div class="no-rooms-text">
                {{ searchQuery.trim() ? 'No s\'han trobat sales amb aquest nom' : 'No hi ha sales disponibles en aquest moment' }}
              </div>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="action-buttons">
          <button @click="handleCreateRoom" class="btn-action btn-crear">CREAR</button>
          <button @click="handleJoinRoom(filteredRooms[0])" class="btn-action btn-unirse" :disabled="filteredRooms.length === 0">UNIRSE</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

.room-list-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a0b2e 0%, #2d1654 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: "Share Tech Mono", monospace;
}

/* Header */
.header-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.2rem 2rem;
  background: rgba(26, 11, 46, 0.8);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  z-index: 10;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  position: absolute;
  right: 2rem;
}

.page-title {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 0.25rem;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8),
               0 0 40px rgba(240, 33, 185, 0.6);
  margin: 0;
}

.btn-back {
  padding: 0.7rem 1.6rem;
  background-color: transparent;
  color: #00f0ff;
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 900;
  letter-spacing: 0.12rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.35);
}

.btn-back:hover {
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.7),
              0 0 45px rgba(240, 33, 185, 0.5);
  transform: scale(1.05);
  text-shadow: 0 0 12px rgba(0, 240, 255, 1);
}

.content-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 5rem;
  overflow: hidden;
}

.main-panel {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

/* Buscador */
.search-box {
  background: rgba(26, 11, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}

.search-box:focus-within {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5),
              0 0 35px rgba(240, 33, 185, 0.3);
}

.search-icon {
  font-size: 1.3rem;
  opacity: 0.7;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ffffff;
  font-size: 1rem;
  font-family: "Share Tech Mono", monospace;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Lista de salas */
.rooms-section {
  flex: 1;
  overflow: hidden;
}

.rooms-grid {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  max-height: 50vh;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.rooms-grid::-webkit-scrollbar {
  width: 8px;
}

.rooms-grid::-webkit-scrollbar-track {
  background: rgba(26, 11, 46, 0.3);
  border-radius: 10px;
}

.rooms-grid::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #00f0ff, #f021b9);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.5);
}

.rooms-grid::-webkit-scrollbar-thumb:hover {
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.7);
}

.room-card {
  background: rgba(26, 11, 46, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 12px;
  padding: 1rem 1.3rem;
  display: flex;
  align-items: center;
  gap: 1.2rem;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;
}

.room-card:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5),
              0 0 35px rgba(240, 33, 185, 0.3);
  transform: translateX(5px);
}

.room-icon {
  font-size: 2rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.5));
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  text-align: left;
}

.room-name {
  font-size: 1.05rem;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.room-details {
  font-size: 0.85rem;
  color: #00f0ff;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.badge {
  font-size: 0.8rem;
}

.no-rooms {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  text-align: center;
  padding: 2rem;
  min-height: 200px;
}

.no-rooms-icon {
  font-size: 3rem;
  opacity: 0.3;
  filter: grayscale(100%);
}

.no-rooms-text {
  font-size: 1rem;
  font-weight: 500;
  color: #00f0ff;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

/* Botones de acción */
.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1rem 0;
}

.btn-action {
  padding: 1rem 2.8rem;
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

.btn-action:hover:not(:disabled) {
  box-shadow: 0 0 45px rgba(0, 240, 255, 1),
              0 0 65px rgba(240, 33, 185, 0.8);
  transform: scale(1.06);
  text-shadow: 0 0 18px rgba(255, 255, 255, 1),
               0 0 35px rgba(0, 240, 255, 1);
}

.btn-action:active:not(:disabled) {
  transform: scale(0.97);
}

.btn-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: 0 0 15px rgba(100, 100, 100, 0.3);
}

@media (max-width: 1200px) {
  .content-wrapper {
    padding: 1.5rem 4rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 1.5rem 2rem;
  }

  .page-title {
    font-size: 1.4rem;
  }

  .btn-action {
    padding: 0.85rem 2rem;
    font-size: 0.95rem;
  }

  .btn-back {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 1rem 1.5rem;
  }

  .room-card {
    padding: 0.8rem;
  }

  .btn-action {
    padding: 0.7rem 1.5rem;
    font-size: 0.85rem;
  }
}
</style>
