<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  roomName: {
    type: String,
    required: true
  },
  players: {
    type: Array,
    default: () => []
  },
  roomConfig: {
    type: Object,
    default: () => ({
      maxPlayers: 4,
      timeLimit: 3,
      numRounds: 3,
      difficulty: 'normal',
      theme: 'aleatori',
      isPrivate: false
    })
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  currentPlayerId: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['startGame', 'leaveRoom', 'kickPlayer']);

function handleStartGame() {
  emit('startGame');
}

function handleLeaveRoom() {
  emit('leaveRoom');
}

function handleKickPlayer(playerId) {
  // Eliminem el confirm natiu: la confirmació es gestiona ara a App.vue amb un diàleg personalitzat
  emit('kickPlayer', playerId);
}

// Mapeo de valores a texto legible
const difficultyText = computed(() => {
  const map = {
    'facil': 'Fàcil',
    'normal': 'Normal',
    'dificil': 'Difícil'
  };
  return map[props.roomConfig?.difficulty] || 'Normal';
});

const themeText = computed(() => {
  const map = {
    'aleatori': 'Aleatori',
    'animals': 'Animals',
    'pel·licules': 'Pel·lícules',
    'programacio': 'Programació',
    'esports': 'Esports'
  };
  return map[props.roomConfig?.theme] || 'Aleatori';
});
</script>

<template>
  <div class="lobby-container">
    <div class="header-section">
      <button @click="handleLeaveRoom" class="btn-back">← Sortir</button>
      <h2 class="room-name-title">{{ roomName }}</h2>
    </div>

    <div class="content-wrapper">
      <!-- Panel superior: Resumen de la partida -->
      <div class="summary-panel">
        <h3 class="panel-title">Nombre sala</h3>
        <div class="room-name-display">{{ roomName }}</div>

        <div class="config-details">
          <div class="config-row">
            <span class="config-icon">👥</span>
            <span class="config-text">{{ players.length }}/{{ roomConfig?.maxPlayers || 4 }} jugadors</span>
          </div>
          
          <div class="config-row">
            <span class="config-icon">⏱️</span>
            <span class="config-text">{{ roomConfig?.timeLimit || 3 }} minuts</span>
          </div>
          
          <div class="config-row">
            <span class="config-icon">🔄</span>
            <span class="config-text">{{ roomConfig?.numRounds || 3 }} rondes</span>
          </div>
          
          <div class="config-row">
            <span class="config-icon">⚡</span>
            <span class="config-text">{{ difficultyText }}</span>
          </div>
          
          <div class="config-row">
            <span class="config-icon">🎯</span>
            <span class="config-text">{{ themeText }}</span>
          </div>

          <div class="config-row" v-if="roomConfig?.isPrivate">
            <span class="config-icon">🔒</span>
            <span class="config-text">Sala privada</span>
          </div>
        </div>
      </div>

      <!-- Sección inferior con jugadores y botones -->
      <div class="bottom-section">
        <!-- Panel central: Jugadores -->
        <div class="players-panel">
          <h3 class="panel-title">Lista jugadores</h3>
          <div class="players-list">
            <div 
              v-for="(player, index) in players" 
              :key="player.id"
              class="player-item"
              :class="{ 'player-self': player.id === currentPlayerId }"
            >
              <span class="player-number">{{ index + 1 }}</span>
              <span class="player-name">{{ player.name }}</span>
              <span v-if="player.isAdmin" class="admin-badge">👑</span>
              <button 
                v-if="isAdmin && !player.isAdmin && player.id !== currentPlayerId"
                @click="handleKickPlayer(player.id)"
                class="btn-kick"
                title="Expulsar jugador"
              >
                ❌
              </button>
            </div>
            
            <!-- Slots vacíos -->
            <div 
              v-for="i in ((roomConfig?.maxPlayers || 4) - players.length)" 
              :key="'empty-' + i"
              class="player-item player-empty"
            >
              <span class="player-number">{{ players.length + i }}</span>
              <span class="player-name">Esperant...</span>
            </div>
          </div>

          <!-- Botón de inicio (solo para admin) -->
          <button 
            v-if="isAdmin" 
            @click="handleStartGame"
            :disabled="players.length < 2"
            class="btn-start"
            :class="{ 'btn-disabled': players.length < 2 }"
          >
            COMENÇAR PARTIDA
          </button>
          <div v-else class="waiting-text">
            Esperant que l'administrador comenci...
          </div>
        </div>

        <!-- Panel derecho: Botones laterales -->
        <div class="side-actions">
          <button @click="handleLeaveRoom" class="btn-action btn-sortir">
            SORTIR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lobby-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  padding: 1.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
}

.header-section {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0 1rem;
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

.room-name-title {
  font-size: 2.5rem;
  color: white;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  flex: 1;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.panel-title {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  margin: 0 0 1.5rem 0;
}

/* Panel superior de resumen */
.summary-panel {
  background: linear-gradient(145deg, rgba(200, 0, 255, 0.2), rgba(150, 0, 255, 0.3));
  border: 3px solid rgba(200, 0, 255, 0.5);
  border-radius: 20px;
  padding: 2.5rem 4rem;
  box-shadow: 0 8px 32px rgba(200, 0, 255, 0.2);
  backdrop-filter: blur(10px);
  width: 100%;
}

/* Sección inferior con jugadores y botones */
.bottom-section {
  display: flex;
  gap: 3rem;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  flex: 1;
}

/* Panel de jugadores */
.players-panel {
  background: linear-gradient(145deg, rgba(200, 0, 255, 0.2), rgba(150, 0, 255, 0.3));
  border: 3px solid rgba(200, 0, 255, 0.5);
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: 0 8px 32px rgba(200, 0, 255, 0.2);
  backdrop-filter: blur(10px);
  flex: 1;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  flex: 1;
}

.player-item {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
}

.player-item:not(.player-empty) {
  border-color: rgba(255, 0, 255, 0.4);
  background: rgba(255, 0, 255, 0.1);
}

.player-empty {
  opacity: 0.5;
  border-style: dashed;
}

.player-number {
  background: rgba(255, 0, 255, 0.4);
  color: white;
  font-weight: 700;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.player-name {
  color: white;
  font-size: 1.3rem;
  font-weight: 500;
  flex: 1;
}

.admin-badge {
  font-size: 1.5rem;
}

.btn-kick {
  background: rgba(255, 50, 50, 0.6);
  border: 2px solid rgba(255, 50, 50, 0.8);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  margin-left: auto;
}

.btn-kick:hover {
  background: rgba(255, 50, 50, 0.9);
  transform: scale(1.1);
  box-shadow: 0 2px 10px rgba(255, 50, 50, 0.5);
}

.player-self {
  border-color: rgba(66, 184, 131, 0.6) !important;
  background: rgba(66, 184, 131, 0.15) !important;
}

.room-name-display {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  color: white;
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 1.5rem;
}

.config-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.config-row {
  background: rgba(255, 255, 255, 0.08);
  border: 2px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  padding: 1.25rem 1.75rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
}

.config-row:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 0, 255, 0.3);
}

.config-icon {
  font-size: 1.8rem;
  min-width: 40px;
  text-align: center;
}

.config-text {
  color: white;
  font-size: 1.2rem;
  font-weight: 500;
}

.btn-start {
  width: 100%;
  padding: 1.75rem 3rem;
  font-size: 1.6rem;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 2px;
  background: linear-gradient(135deg, rgba(0, 255, 100, 0.7), rgba(0, 200, 80, 0.9));
  color: white;
  border: 2px solid rgba(0, 255, 100, 0.8);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  margin-top: auto;
}

.btn-start:hover:not(.btn-disabled) {
  background: linear-gradient(135deg, rgba(0, 255, 100, 0.9), rgba(0, 200, 80, 1));
  transform: scale(1.02);
  box-shadow: 0 6px 25px rgba(0, 255, 100, 0.4);
}

.btn-start.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: rgba(100, 100, 100, 0.3);
  border-color: rgba(100, 100, 100, 0.5);
}

.waiting-text {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.2rem;
  font-style: italic;
  padding: 1.75rem;
  margin-top: auto;
}

/* Botones laterales */
.side-actions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 180px;
}

.btn-action {
  padding: 2rem 2.5rem;
  font-size: 1.3rem;
  font-weight: 700;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn-sortir {
  background: linear-gradient(135deg, rgba(255, 50, 50, 0.7), rgba(200, 0, 0, 0.9));
  color: white;
  border: 2px solid rgba(255, 50, 50, 0.8);
}

.btn-sortir:hover {
  background: linear-gradient(135deg, rgba(255, 50, 50, 0.9), rgba(200, 0, 0, 1));
  transform: scale(1.05);
  box-shadow: 0 6px 25px rgba(255, 50, 50, 0.4);
}

@media (max-width: 1200px) {
  .lobby-container {
    padding: 1.5rem 2rem;
  }
  
  .content-wrapper {
    gap: 2rem;
  }
  
  .summary-panel {
    padding: 2rem 2.5rem;
  }
  
  .config-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .bottom-section {
    flex-direction: column;
    align-items: center;
  }
  
  .players-panel {
    max-width: 100%;
    width: 100%;
  }
  
  .side-actions {
    flex-direction: row;
    justify-content: center;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .lobby-container {
    padding: 1rem;
  }
  
  .header-section {
    padding: 0;
  }
  
  .room-name-title {
    font-size: 2rem;
  }
  
  .summary-panel {
    padding: 1.5rem;
  }
  
  .room-name-display {
    font-size: 1.4rem;
    padding: 1rem;
  }
  
  .config-details {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .config-row {
    padding: 1rem 1.25rem;
  }
  
  .config-icon {
    font-size: 1.5rem;
  }
  
  .config-text {
    font-size: 1rem;
  }
  
  .players-panel {
    padding: 1.5rem;
  }
  
  .player-item {
    padding: 1rem 1.25rem;
  }
  
  .player-name {
    font-size: 1.1rem;
  }
}
</style>
