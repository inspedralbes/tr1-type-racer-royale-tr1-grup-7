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
  console.log('🔍 RoomListWords recibió rooms:', newRooms);
  console.log('🔍 Tipo:', typeof newRooms, 'Es Array:', Array.isArray(newRooms));
  console.log('🔍 Longitud:', newRooms?.length);
  newRooms?.forEach((room, index) => {
    console.log(`🔍 Room ${index}:`, {
      name: room.name,
      gameMode: room.gameMode,
      isPrivate: room.isPrivate,
      playerCount: room.playerCount
    });
  });
}, { immediate: true });

// Filtrar salas SOLO DE PALABRAS
const filteredRooms = computed(() => {
  console.log('🔍 Filtrando salas de PALABRAS');
  
  // Filtrar salas de palabras (incluir salas sin gameMode por compatibilidad)
  const wordsRooms = props.rooms.filter(room => {
    const isWordsRoom = room.gameMode === 'palabras' || !room.gameMode || room.gameMode === '';
    console.log(`🔍 Sala ${room.name}: gameMode="${room.gameMode}" -> incluir en palabras: ${isWordsRoom}`);
    return isWordsRoom;
  });
  
  console.log('🔍 Salas de palabras encontradas:', wordsRooms);

  if (!searchQuery.value.trim()) {
    // Sin búsqueda: mostrar TODAS las salas de palabras (ya no hay privadas, todas son públicas)
    console.log('🔍 Mostrando TODAS las salas de palabras (sin filtrar por privacidad):', wordsRooms);
    return wordsRooms;
  }
  
  // Con búsqueda: mostrar tanto públicas como privadas de palabras que coincidan
  const searchResults = wordsRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
  console.log('🔍 Resultados de búsqueda en palabras:', searchResults);
  return searchResults;
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
</script>

<template>
  <div class="room-list-container">
    <div class="header-section">
      <button @click="handleBack" class="btn-back">← Enrere</button>
      <h2 class="page-title">Salas PALABRAS ({{ filteredRooms.length }})</h2>
    </div>

    <div class="content-wrapper">
      <!-- Panel principal de salas -->
      <div class="rooms-panel">
        <div class="panel-header">
          <h3>SALAS DE PALABRAS</h3>
        </div>
        <div class="rooms-grid">
          <template v-if="filteredRooms.length > 0">
            <button 
              v-for="room in filteredRooms" 
              :key="room.name"
              @click="handleJoinRoom(room)"
              class="room-card"
            >
              <div class="room-icon">🔤</div>
              <div class="room-info">
                <div class="room-name">{{ room.name }}</div>
                <div class="room-details">
                  {{ room.playerCount }} / {{ room.maxPlayers }} jugadors
                  <span v-if="room.isPrivate" class="private-badge">🔒</span>
                  <span v-else-if="room.password" class="password-badge">🔑</span>
                </div>
              </div>
            </button>
          </template>
          
          <div v-else class="no-rooms">
            <div class="no-rooms-icon">{{ searchQuery.trim() ? '🔍' : '🔤' }}</div>
            <div class="no-rooms-text">
              {{ searchQuery.trim() ? 'No s\'han trobat salas de palabras amb aquest nom' : 'No hi ha salas de PALABRAS creades' }}
            </div>
            <div class="no-rooms-subtext">
              {{ searchQuery.trim() ? 'Prova amb un altre nom o crea una nova sala' : 'Totes les salas creades apareixen aquí automàticament. Usa el buscador per filtrar per nom quan hi hagi moltes salas.' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción y buscador lateral -->
      <div class="action-buttons">
        <!-- Buscador de salas -->
        <div class="search-container">
          <div class="search-icon">🔍</div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar sala de palabras..."
            class="search-input"
          />
        </div>
        
        <button @click="handleCreateRoom" class="btn-action btn-creator">
          CREAR
        </button>
        <button @click="handleJoinRoom(filteredRooms[0])" class="btn-action btn-unirse" :disabled="filteredRooms.length === 0">
          UNIRSE
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.room-list-container {
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
  background: #0A192F;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  position: relative;
}

.btn-back {
  background: rgba(26, 42, 74, 0.8);
  border: 2px solid #00F0FF;
  color: #00F0FF;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'Share Tech Mono', monospace;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.btn-back:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #F021B9;
  color: #F021B9;
  transform: translateX(-3px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
}

.page-title {
  font-size: 2.5rem;
  color: #39FF14;
  font-family: 'Share Tech Mono', monospace;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
  letter-spacing: 0.1rem;
}

.content-wrapper {
  display: flex;
  gap: 2rem;
  flex: 1;
  min-height: 0;
}

.rooms-panel {
  flex: 1;
  background: rgba(26, 42, 74, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid #39FF14;
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.4);
}

.panel-header {
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.3), rgba(0, 240, 255, 0.3));
  border: 2px solid #39FF14;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  text-align: center;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.4);
}

.panel-header h3 {
  margin: 0;
  color: #00F0FF;
  font-size: 1.8rem;
  font-family: 'Share Tech Mono', monospace;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
}

.rooms-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
  padding-right: 0.5rem;
}

.rooms-grid::-webkit-scrollbar {
  width: 8px;
}

.rooms-grid::-webkit-scrollbar-track {
  background: rgba(10, 25, 47, 0.5);
  border-radius: 10px;
}

.rooms-grid::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #39FF14, #00F0FF);
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(57, 255, 20, 0.5);
}

.rooms-grid::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00F0FF, #39FF14);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

.room-card {
  background: rgba(26, 42, 74, 0.4);
  border: 2px solid rgba(57, 255, 20, 0.4);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  font-family: 'Fira Code', monospace;
}

.room-card:hover {
  background: rgba(57, 255, 20, 0.2);
  border-color: #39FF14;
  transform: translateX(10px);
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
}

.room-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.5));
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  text-align: left;
}

.room-name {
  font-size: 1.3rem;
  font-weight: 600;
  word-break: break-word;
  color: #39FF14;
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.4);
}

.room-details {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.private-badge {
  font-size: 0.8rem;
}

.password-badge {
  font-size: 0.8rem;
}

.no-rooms {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  color: rgba(57, 255, 20, 0.6);
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.2rem;
  padding: 3rem;
  height: 100%;
}

.no-rooms-icon {
  font-size: 4rem;
  opacity: 0.3;
  filter: grayscale(100%);
}

.no-rooms-text {
  font-size: 1.3rem;
  font-weight: 500;
  color: #39FF14;
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.4);
}

.no-rooms-subtext {
  font-size: 1rem;
  opacity: 0.7;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 250px;
}

.search-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(26, 42, 74, 0.6);
  border: 2px solid rgba(57, 255, 20, 0.4);
  border-radius: 12px;
  padding: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.search-container:focus-within {
  border-color: #39FF14;
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.4);
}

.search-icon {
  font-size: 1.5rem;
  padding: 0 0.5rem;
  opacity: 0.6;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #39FF14;
  font-size: 1rem;
  font-family: 'Fira Code', monospace;
  padding: 0.5rem;
}

.search-input::placeholder {
  color: rgba(57, 255, 20, 0.4);
}

.btn-action {
  padding: 1.5rem 2.5rem;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-creator {
  background: linear-gradient(135deg, #39FF14, #00F0FF);
  color: #0A192F;
  border: 2px solid #39FF14;
}

.btn-creator:hover {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.6);
}

.btn-unirse {
  background: linear-gradient(135deg, #F021B9, #00F0FF);
  color: #0A192F;
  border: 2px solid #F021B9;
}

.btn-unirse:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.6);
}

.btn-unirse:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: grayscale(50%);
}

@media (max-width: 768px) {
  .content-wrapper {
    flex-direction: column;
  }
  
  .action-buttons {
    flex-direction: row;
    justify-content: center;
    min-width: 100%;
  }
  
  .room-card {
    padding: 1rem;
  }
  
  .room-name {
    font-size: 1.1rem;
  }
}
</style>