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
  gameMode: {
    type: String,
    default: "texto",
  },
});

const emit = defineEmits(["startGame", "leaveRoom", "kickPlayer"]);

function handleStartGame() {
  emit("startGame");
}

function handleLeaveRoom() {
  emit("leaveRoom");
}

function handleKickPlayer(playerId) {
  // Eliminem el confirm natiu: la confirmació es gestiona ara a App.vue amb un diàleg personalitzat
  emit("kickPlayer", playerId);
}

// Mapeo de valores a texto legible
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
</script>

<template>
  <div class="lobby-container">
    <div class="header-section">
      <button @click="handleLeaveRoom" class="btn-back">← Salir</button>
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
            <span class="config-text"
              >{{ players.length }}/{{
                roomConfig?.maxPlayers || 4
              }}
              jugadores</span
            >
          </div>

          <div class="config-row">
            <span class="config-icon">⏱️</span>
            <span class="config-text"
              >{{ roomConfig?.timeLimit || 3 }} minutos</span
            >
          </div>

          <div class="config-row" v-if="gameMode === 'texto'">
            <span class="config-icon">🔄</span>
            <span class="config-text"
              >{{ roomConfig?.numRounds || 3 }} rondas</span
            >
          </div>

          <div class="config-row" v-if="gameMode === 'texto'">
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
                v-if="
                  isAdmin && !player.isAdmin && player.id !== currentPlayerId
                "
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

          <!-- Botón de inicio (solo para admin) -->
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

        <!-- Panel derecho: Botones laterales -->
        <div class="side-actions">
          <button @click="handleLeaveRoom" class="btn-action btn-sortir">
            SALIR
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lobby-container {
  display: flex;
  flex-direction: column;
  flex: 1; /* Ocupa el espacio restante bajo el título */
  height: calc(
    100vh - clamp(60px, 10vh, 120px)
  ); /* Ajuste dinámico restando área del título/header */
  padding: clamp(1.2vh, 2vh, 2.4vh) clamp(1.2vw, 2vw, 2.4vw)
    clamp(2vh, 3vh, 3.2vh) clamp(1.2vw, 2vw, 2.4vw);
  gap: clamp(1.2vh, 2vh, 2.4vh);
  background: #0a192f;
  box-sizing: border-box;
  position: relative;
  overflow: hidden; /* Evitar scroll interno según petición */
}

.lobby-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 25% 35%,
      rgba(57, 255, 20, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 65%,
      rgba(240, 33, 185, 0.08) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.header-section {
  display: flex;
  align-items: center;
  gap: 2vw;
  padding: 0;
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

.room-name-title {
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
  flex-direction: column;
  gap: clamp(1.2vh, 2vh, 2.4vh);
  flex: 1;
  align-items: center;
  justify-content: flex-start; /* Empieza bajo el header sin centrar verticalmente */
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.panel-title {
  color: #00f0ff;
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  margin: 0 0 2vh 0;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
  letter-spacing: 0.1rem;
  text-transform: uppercase;
}

/* Panel superior de resumen */
.summary-panel {
  background: rgba(26, 42, 74, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid #00f0ff;
  border-radius: 16px;
  padding: 2vh 3vw;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.3),
    inset 0 0 20px rgba(0, 240, 255, 0.05);
  width: 100%;
}

/* Sección inferior con jugadores y botones */
.bottom-section {
  display: flex;
  gap: clamp(1.5vw, 2vw, 2.5vw);
  align-items: stretch;
  justify-content: center;
  width: 100%;
  flex: 1;
  overflow: hidden; /* Evitar que salga por abajo */
}

/* Panel de jugadores */
.players-panel {
  background: rgba(26, 42, 74, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid #f021b9;
  border-radius: 16px;
  padding: clamp(1.4vh, 2vh, 2.2vh) clamp(2vw, 3vw, 3.2vw);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.3),
    inset 0 0 20px rgba(240, 33, 185, 0.05);
  flex: 1;
  max-width: 680px;
  display: flex;
  flex-direction: column;
  gap: clamp(1.2vh, 1.6vh, 2vh);
  overflow: hidden; /* contener lista */
}

.players-list {
  display: flex;
  flex-direction: column;
  gap: clamp(0.8vh, 1.2vh, 1.5vh);
  flex: 1;
  overflow-y: auto; /* scroll interno solo aquí si hace falta */
}

.player-item {
  background: rgba(10, 25, 47, 0.6);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 10px;
  padding: 1.5vh 2vw;
  display: flex;
  align-items: center;
  gap: 1.5vw;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
}

.player-item:not(.player-empty) {
  border-color: rgba(0, 240, 255, 0.5);
  background: rgba(0, 240, 255, 0.1);
}

.player-item:not(.player-empty):hover {
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.3);
}

.player-empty {
  opacity: 0.4;
  border-style: dashed;
  border-color: rgba(0, 240, 255, 0.2);
}

.player-number {
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  color: #0a192f;
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  border-radius: 50%;
  width: clamp(35px, 4vw, 45px);
  height: clamp(35px, 4vw, 45px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: clamp(1rem, 1.2vw, 1.1rem);
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.4);
}

.player-name {
  color: #00f0ff;
  font-size: clamp(1.1rem, 1.4vw, 1.3rem);
  font-weight: 600;
  font-family: "Fira Code", monospace;
  flex: 1;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.admin-badge {
  font-size: clamp(1.3rem, 1.8vw, 1.6rem);
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.8));
}

.btn-kick {
  background: rgba(255, 50, 50, 0.3);
  border: 2px solid rgba(255, 50, 50, 0.6);
  border-radius: 8px;
  padding: 0.75vh 1vw;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: clamp(0.9rem, 1.1vw, 1rem);
  margin-left: auto;
}

.btn-kick:hover {
  background: rgba(255, 50, 50, 0.6);
  border-color: rgba(255, 50, 50, 0.9);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(255, 50, 50, 0.5);
}

.player-self {
  border-color: #39ff14 !important;
  background: rgba(57, 255, 20, 0.15) !important;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.2) !important;
}

.room-name-display {
  background: rgba(10, 25, 47, 0.6);
  border: 2px solid rgba(240, 33, 185, 0.5);
  border-radius: 12px;
  padding: 2vh 3vw;
  color: #f021b9;
  font-size: clamp(1.4rem, 2vw, 1.8rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  margin-bottom: 2vh;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.6);
  box-shadow: inset 0 0 15px rgba(240, 33, 185, 0.1);
}

.config-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5vh 1.5vw;
}

.config-row {
  background: rgba(10, 25, 47, 0.6);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 10px;
  padding: 1.5vh 2vw;
  display: flex;
  align-items: center;
  gap: 1.5vw;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
}

.config-row:hover {
  background: rgba(10, 25, 47, 0.8);
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.3);
}

.config-icon {
  font-size: clamp(1.5rem, 2vw, 1.8rem);
  min-width: 40px;
  text-align: center;
  filter: drop-shadow(0 0 8px rgba(0, 240, 255, 0.5));
}

.config-text {
  color: #00f0ff;
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-weight: 600;
  font-family: "Fira Code", monospace;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

.btn-start {
  width: 100%;
  padding: 2vh 3vw;
  min-height: 60px;
  font-size: clamp(1.2rem, 1.8vw, 1.6rem);
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  background: linear-gradient(135deg, #39ff14, #00f0ff);
  color: #0a192f;
  border: 2px solid transparent;
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.4);
  margin-top: auto;
  position: relative;
  overflow: hidden;
}

.btn-start::before {
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

.btn-start:hover:not(.btn-disabled)::before {
  left: 100%;
}

.btn-start:hover:not(.btn-disabled) {
  transform: scale(1.02);
  box-shadow: 0 0 40px rgba(57, 255, 20, 0.6);
}

.btn-start.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: rgba(100, 100, 100, 0.3);
  border: 2px solid rgba(100, 100, 100, 0.5);
  box-shadow: none;
}

.waiting-text {
  text-align: center;
  color: rgba(0, 240, 255, 0.7);
  font-size: clamp(1rem, 1.3vw, 1.2rem);
  font-family: "Fira Code", monospace;
  font-style: italic;
  padding: 2vh 2vw;
  margin-top: auto;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
}

/* Botones laterales */
.side-actions {
  display: flex;
  flex-direction: column;
  gap: 2vh;
  min-width: 150px;
  justify-content: center;
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
  box-shadow: 0 0 20px rgba(255, 50, 50, 0.3);
}

.btn-sortir {
  background: linear-gradient(
    135deg,
    rgba(255, 50, 50, 0.3),
    rgba(200, 0, 0, 0.4)
  );
  color: #ff3232;
  border: 2px solid rgba(255, 50, 50, 0.6);
  text-shadow: 0 0 8px rgba(255, 50, 50, 0.6);
}

.btn-sortir:hover {
  background: linear-gradient(
    135deg,
    rgba(255, 50, 50, 0.5),
    rgba(200, 0, 0, 0.6)
  );
  transform: scale(1.05);
  box-shadow: 0 0 30px rgba(255, 50, 50, 0.5);
  border-color: #ff3232;
}

@media (max-width: 1200px) {
  .lobby-container {
    padding: 1.5vh 2vw;
  }

  .content-wrapper {
    gap: 2vh;
  }

  .summary-panel {
    padding: 2vh 2.5vw;
  }

  .config-details {
    grid-template-columns: repeat(2, 1fr);
    gap: 1vh 1vw;
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
    padding: 1vh 1.5vw;
  }

  .header-section {
    padding: 0;
  }

  .room-name-title {
    font-size: 2rem;
  }

  .summary-panel {
    padding: 1.5vh 2vw;
  }

  .room-name-display {
    font-size: 1.4rem;
    padding: 1vh 2vw;
  }

  .config-details {
    grid-template-columns: 1fr;
    gap: 1vh;
  }

  .config-row {
    padding: 1vh 2vw;
  }

  .config-icon {
    font-size: 1.5rem;
  }

  .config-text {
    font-size: 1rem;
  }

  .players-panel {
    padding: 1.5vh 2vw;
  }

  .player-item {
    padding: 1vh 2vw;
  }

  .player-name {
    font-size: 1.1rem;
  }
}
</style>
