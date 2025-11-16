<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  roomName: {
    type: String,
    required: true,
  },
  players: {
    type: Array,
    default: () => [],
  },
  roomConfig: {
    type: Object,
    default: () => ({
      maxPlayers: 4,
      timeLimit: 3,
      numRounds: 3,
      difficulty: "normal",
      theme: "aleatori",
      isPrivate: false,
      gameMode: "texto",
    }),
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  currentPlayerId: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(['startGame', 'leaveRoom', 'kickPlayer']);

const difficultyText = computed(() => {
  const map = {
    facil: "Fácil",
    normal: "Normal",
    dificil: "Difícil",
  };
  return map[props.roomConfig?.difficulty] || "Normal";
});

const themeText = computed(() => {
  const map = {
    aleatori: "Aleatorio",
    animals: "Animales",
    "pel·licules": "Películas",
    programacio: "Programación",
    esports: "Deportes",
  };
  return map[props.roomConfig?.theme] || "Aleatorio";
});

const gameMode = computed(() => {
  return props.roomConfig?.gameMode || "texto";
});

const timeLimitText = computed(() => {
  const minutes = props.roomConfig?.timeLimit || 3;
  if (minutes < 1) {
    const seconds = Math.round(minutes * 60);
    return `${seconds} segundos`;
  }
  return `${minutes} minuto${minutes !== 1 ? 's' : ''}`;
});

function handleLeaveRoom() {
  emit('leaveRoom');
}

function handleStartGame() {
  emit('startGame');
}

function handleKickPlayer(playerId) {
  emit('kickPlayer', playerId);
}
</script>

<template>
  <div class="lobby-container">
    <!-- Header solo con título centrado y botón cancelar -->
    <div class="header-section">
      <div class="header-center">
        <h2 class="room-name-title">{{ roomName }}</h2>
      </div>
      <div class="header-right">
        <button @click="handleLeaveRoom" class="btn-cancel">✕ CANCEL·LAR</button>
      </div>
    </div>

    <div class="content-wrapper">
      <div class="main-panel">
        <!-- Configuración en grid -->
        <div class="config-grid" v-if="gameMode === 'texto'">
          <div class="config-box">
            <div class="config-label">👥 Jugadors</div>
            <div class="config-value">{{ players.length }}/{{ roomConfig?.maxPlayers || 4 }}</div>
          </div>

          <div class="config-box">
            <div class="config-label">⏱️ Temps</div>
            <div class="config-value">{{ timeLimitText }}</div>
          </div>

          <div class="config-box">
            <div class="config-label">🔄 Rondes</div>
            <div class="config-value">{{ roomConfig?.numRounds || 3 }}</div>
          </div>

          <div class="config-box">
            <div class="config-label">⚡ Dificultat</div>
            <div class="config-value">{{ difficultyText }}</div>
          </div>

          <div class="config-box">
            <div class="config-label">🎯 Temàtica</div>
            <div class="config-value">{{ themeText }}</div>
          </div>
        </div>

        <!-- Configuración simplificada para modo palabras -->
        <div class="config-grid config-grid-simple" v-else>
          <div class="config-box">
            <div class="config-label">👥 Jugadors</div>
            <div class="config-value">{{ players.length }}/{{ roomConfig?.maxPlayers || 4 }}</div>
          </div>

          <div class="config-box">
            <div class="config-label">⏱️ Temps</div>
            <div class="config-value">{{ timeLimitText }}</div>
          </div>

          <div class="config-box">
            <div class="config-label">🎯 Temàtica</div>
            <div class="config-value">{{ themeText }}</div>
          </div>
        </div>

        <!-- Lista de jugadores -->
        <div class="players-section">
          <h3 class="section-title">LISTA JUGADORES</h3>
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
              v-for="i in (roomConfig?.maxPlayers || 4) - players.length"
              :key="'empty-' + i"
              class="player-item player-empty"
            >
              <span class="player-number">{{ players.length + i }}</span>
              <span class="player-name">Esperando...</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón de inicio -->
    <div class="footer-buttons">
      <button
        v-if="isAdmin"
        @click="handleStartGame"
        :disabled="players.length < 2"
        class="btn-start"
        :class="{ 'btn-disabled': players.length < 2 }"
      >
        COMENZAR PARTIDA
      </button>
      <div v-else class="waiting-text">
        Esperando que el administrador comience...
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

/* Contenedor principal */
.lobby-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #1a0b2e 0%, #2d1654 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  font-family: "Share Tech Mono", monospace;
}

/* Header con 2 columnas */
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

.room-name-title {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 0.25rem;
  text-transform: uppercase;
  text-shadow: 0 0 20px rgba(0, 240, 255, 0.8),
               0 0 40px rgba(240, 33, 185, 0.6);
  margin: 0;
}

.btn-cancel {
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

.btn-cancel:hover {
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
  position: relative;
  z-index: 1;
  padding: 1.5rem 5rem;
  overflow: hidden;
}

.main-panel {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  position: relative;
}

/* Secciones */
.players-section {
  margin: 0.8rem 0 0 0;
}

.section-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  text-align: center;
  letter-spacing: 0.15rem;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6),
               0 0 20px rgba(240, 33, 185, 0.4);
  margin-bottom: 0.9rem;
}

/* Grid de configuración */
.config-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
}

.config-grid-simple {
  grid-template-columns: repeat(3, 1fr);
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
  gap: 0.5rem;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
  text-align: center;
}

.config-box:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5),
              0 0 35px rgba(240, 33, 185, 0.3);
  transform: translateY(-2px);
}

.config-label {
  color: #ffffff;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08rem;
  text-transform: uppercase;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6),
               0 0 20px rgba(240, 33, 185, 0.4);
}

.config-value {
  color: #00f0ff;
  font-size: 0.95rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

/* Lista de jugadores */
.players-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.player-item {
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
}

.player-item:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5),
              0 0 35px rgba(240, 33, 185, 0.3);
  transform: translateX(5px);
}

.player-self {
  border-image: linear-gradient(135deg, #f021b9, #00f0ff) 1;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5),
              0 0 30px rgba(0, 240, 255, 0.3);
}

.player-empty {
  opacity: 0.4;
  border-image: linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(240, 33, 185, 0.3)) 1;
}

.player-number {
  background: linear-gradient(135deg, #00f0ff, #f021b9);
  color: #ffffff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1rem;
  flex-shrink: 0;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.6);
}

.player-name {
  flex: 1;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.admin-badge {
  font-size: 1.5rem;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
  flex-shrink: 0;
}

.btn-kick {
  background: transparent;
  border: 2px solid rgba(240, 33, 185, 0.5);
  border-radius: 8px;
  padding: 0.4rem 0.6rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-kick:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.6);
  transform: scale(1.1);
}

/* Botones de acción */
.footer-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem 0 1.8rem 0;
  position: relative;
  z-index: 1;
}

.btn-start {
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

.btn-start:hover:not(.btn-disabled) {
  box-shadow: 0 0 45px rgba(0, 240, 255, 1),
              0 0 65px rgba(240, 33, 185, 0.8);
  transform: scale(1.06);
  text-shadow: 0 0 18px rgba(255, 255, 255, 1),
               0 0 35px rgba(0, 240, 255, 1);
}

.btn-start:active:not(.btn-disabled) {
  transform: scale(0.97);
}

.btn-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: 0 0 15px rgba(100, 100, 100, 0.3);
}

.waiting-text {
  color: #00f0ff;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .config-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .content-wrapper {
    padding: 2rem 4rem;
  }
}

@media (max-width: 768px) {
  .config-grid,
  .config-grid-simple {
    grid-template-columns: 1fr;
  }
  
  .content-wrapper {
    padding: 1.5rem 2rem;
  }
  
  .room-name-title {
    font-size: 1.4rem;
  }
  
  .btn-start {
    padding: 0.85rem 2rem;
    font-size: 0.95rem;
  }
  
  .btn-cancel {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .content-wrapper {
    padding: 1rem 1.5rem;
  }
  
  .config-box,
  .player-item {
    padding: 0.8rem;
  }
  
  .btn-start,
  .btn-cancel {
    padding: 0.7rem 1.5rem;
    font-size: 0.85rem;
  }
}
</style>
