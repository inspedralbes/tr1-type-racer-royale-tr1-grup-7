<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import { generarTextoLlarg, obtenerTematicas } from "../utils/textGenerator.js";
import communicationManager from "../services/communicationManager.js";

const emit = defineEmits(["back-to-lobby"]);

// Props (podrían venir de la configuración de la sala)
const props = defineProps({
  tematica: {
    type: String,
    default: "aleatori",
  },
  timeLimit: {
    type: Number,
    default: 60,
  },
  players: {
    type: Array,
    default: () => [],
  },
  gameText: {
    type: String,
    default: null,
  },
});

// Estado del juego
const progress = ref(0);
const errors = ref(0);
const totalErrors = ref(0); // Total de errores acumulados (no baja aunque borres)
const textToType = ref("");
const userInput = ref("");
const timeRemaining = ref(props.timeLimit);
const typingInputRef = ref(null);

// Cuenta atrás y visibilidad del contenido
const showCountdown = ref(true);
const countdownNumber = ref(5);
const showContent = ref(false);
let countdownTimer = null;

// Estado por carácter: 'pending' | 'correct' | 'incorrect' | 'corrected'
const charStatuses = ref([]);
// Si alguna vez fue incorrecto (para mostrar ámbar al corregir)
const everIncorrect = ref([]);

// Tecla activa en el teclado visual
const activeKey = ref(null);
let activeKeyTimer = null;

// --- MULTIJUGADOR: Estado de otros jugadores ---
const playersState = ref([]);

// Inicializar el texto cuando se monta el componente
onMounted(async () => {
  generarNuevoTexto();
  initializePlayersState();
  setupMultiplayerListeners();
  startCountdown();
});

onUnmounted(() => {
  cleanupMultiplayerListeners();
});

// Inicializar estado de jugadores desde las props
const initializePlayersState = () => {
  playersState.value = props.players.map((p) => ({
    id: p.id,
    name: p.name,
    progress: 0,
    wpm: 0,
    errors: 0,
    isTyping: false,
    lastKey: null,
  }));
};

// Generar un nuevo texto según la temática
const generarNuevoTexto = () => {
  console.log("🎮 Generando texto...");

  // Si viene texto del servidor (sincronizado), usarlo
  if (props.gameText) {
    console.log("🎮 Usando texto del servidor (sincronizado)");
    textToType.value = props.gameText;
  } else {
    // Fallback: generar localmente si no viene del servidor
    console.log("🎮 Generando texto local con temática:", props.tematica);
    textToType.value = generarTextoLlarg(props.tematica);
  }

  console.log("🎮 Texto:", textToType.value.substring(0, 50) + "...");
  userInput.value = "";
  progress.value = 0;
  errors.value = 0;
  totalErrors.value = 0;
  // inicializar estados por carácter
  charStatuses.value = Array.from(
    { length: textToType.value.length },
    () => "pending"
  );
  everIncorrect.value = Array.from(
    { length: textToType.value.length },
    () => false
  );
};

// Iniciar cuenta atrás y mostrar contenido al finalizar
const startCountdown = () => {
  showCountdown.value = true;
  showContent.value = false;
  countdownNumber.value = 5;
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = setInterval(async () => {
    if (countdownNumber.value > 1) {
      countdownNumber.value -= 1;
    } else {
      clearInterval(countdownTimer);
      showCountdown.value = false;
      showContent.value = true;
      await nextTick();
      // Focus en el input para empezar inmediatamente
      try {
        typingInputRef.value?.focus();
      } catch {}
      // Iniciar el timer del juego automáticamente
      startGameTimer();
    }
  }, 1000);
};

// Timer del juego que cuenta hacia abajo
const startGameTimer = () => {
  timeRemaining.value = props.timeLimit;
  if (gameTimer) clearInterval(gameTimer);
  
  gameTimer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value -= 1;
    } else {
      clearInterval(gameTimer);
      // Fin del tiempo de esta ronda
      endRound();
    }
  }, 1000);
};

// Finalizar ronda actual
const endRound = () => {
  console.log(`🏁 Ronda ${currentRound.value} finalizada`);
  
  // Detener el timer
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  
  if (currentRound.value < maxRounds.value) {
    // Hay más rondas, preparar la siguiente
    currentRound.value += 1;
    console.log(`🎮 Preparando ronda ${currentRound.value}...`);
    
    // Generar nuevo texto para la siguiente ronda
    generarNuevoTexto();
    
    // Reiniciar la cuenta atrás y el contenido
    startCountdown();
  } else {
    // Fin del juego
    console.log('🎉 ¡Juego terminado!');
    showContent.value = false;
    showCountdown.value = false;
    // Volver al lobby después de 2 segundos
    setTimeout(() => {
      emit('back-to-lobby');
    }, 2000);
  }
};

// Actualizar estados por carácter a partir del texto tipeado
const updateStatuses = (typed) => {
  const expected = textToType.value;
  let currentErrors = 0;

  for (let i = 0; i < expected.length; i++) {
    if (i < typed.length) {
      if (typed[i] === expected[i]) {
        // Si anteriormente fue incorrecto alguna vez -> corrected (amarillo-naranja)
        charStatuses.value[i] = everIncorrect.value[i]
          ? "corrected"
          : "correct";
      } else {
        // Error actual
        charStatuses.value[i] = "incorrect";

        // Solo incrementar totalErrors si es la primera vez que se marca como error
        if (!everIncorrect.value[i]) {
          totalErrors.value++;
          everIncorrect.value[i] = true;
        }
        currentErrors++;
      }
    } else {
      charStatuses.value[i] = "pending";
    }
  }

  errors.value = totalErrors.value; // Mostrar total acumulado
  progress.value = Math.floor(
    (Math.min(typed.length, expected.length) / expected.length) * 100
  );
};

// Manejar entrada del usuario (v-model actualiza userInput automáticamente)
const handleInput = (event) => {
  const typed = event.target.value;
  updateStatuses(typed);
  emitProgress(); // Emitir progreso a otros jugadores
  
  // Verificar si el jugador ha completado el texto
  if (typed.length >= textToType.value.length && progress.value === 100) {
    // Verificar que todo el texto es correcto
    let allCorrect = true;
    for (let i = 0; i < textToType.value.length; i++) {
      if (typed[i] !== textToType.value[i]) {
        allCorrect = false;
        break;
      }
    }
    
    if (allCorrect) {
      console.log('✅ ¡Texto completado correctamente!');
      // Finalizar la ronda actual
      endRound();
    }
  }
};

// Manejar evento keydown para mostrar la tecla en el teclado visual
const onKeyDown = (event) => {
  const key = event.key;
  // Normalizar: letras en mayúscula
  let displayKey = null;
  if (key === " ") displayKey = "SPACE";
  else if (key === "Backspace") displayKey = "BACKSPACE";
  else displayKey = String(key).toUpperCase();

  activeKey.value = displayKey;
  emitKeyPress(displayKey); // Emitir tecla a otros jugadores

  if (activeKeyTimer) clearTimeout(activeKeyTimer);
  activeKeyTimer = setTimeout(() => {
    activeKey.value = null;
  }, 180);
};

// Clase de estado para cada caracter
const statusClass = (status) => {
  switch (status) {
    case "correct":
      return "char-correct";
    case "incorrect":
      return "char-incorrect";
    case "corrected":
      return "char-corrected";
    default:
      return "";
  }
};

// --- FUNCIONES MULTIJUGADOR ---

// Configurar listeners para eventos multijugador
const setupMultiplayerListeners = () => {
  // Escuchar actualizaciones de progreso de otros jugadores
  communicationManager.onPlayerProgress?.((data) => {
    updatePlayerProgress(data);
  });

  // Escuchar teclas presionadas por otros jugadores
  communicationManager.onPlayerKeyPress?.((data) => {
    updatePlayerKeyPress(data);
  });

  // Escuchar lista de jugadores actualizada
  communicationManager.onUpdatePlayerList?.((playerList) => {
    updatePlayerList(playerList);
  });
};

// Limpiar listeners al desmontar
const cleanupMultiplayerListeners = () => {
  communicationManager.removeListener?.("playerProgress");
  communicationManager.removeListener?.("playerKeyPress");
};

// Actualizar progreso de un jugador
const updatePlayerProgress = (data) => {
  const {
    playerId,
    progress: playerProgress,
    wpm,
    errors: playerErrors,
  } = data;
  const playerIndex = playersState.value.findIndex((p) => p.id === playerId);

  if (playerIndex !== -1) {
    playersState.value[playerIndex].progress = playerProgress;
    playersState.value[playerIndex].wpm = wpm;
    playersState.value[playerIndex].errors = playerErrors;
  }
};

// Actualizar tecla presionada por un jugador
const updatePlayerKeyPress = (data) => {
  const { playerId, key } = data;
  const playerIndex = playersState.value.findIndex((p) => p.id === playerId);

  if (playerIndex !== -1) {
    playersState.value[playerIndex].lastKey = key;
    playersState.value[playerIndex].isTyping = true;

    // Limpiar después de un tiempo
    setTimeout(() => {
      if (playersState.value[playerIndex]) {
        playersState.value[playerIndex].isTyping = false;
      }
    }, 200);
  }
};

// Actualizar lista de jugadores
const updatePlayerList = (playerList) => {
  // Actualizar o agregar jugadores nuevos
  playerList.forEach((p) => {
    const existingIndex = playersState.value.findIndex((ps) => ps.id === p.id);
    if (existingIndex === -1) {
      // Nuevo jugador
      playersState.value.push({
        id: p.id,
        name: p.name,
        progress: 0,
        wpm: 0,
        errors: 0,
        isTyping: false,
        lastKey: null,
      });
    } else {
      // Actualizar nombre si cambió
      playersState.value[existingIndex].name = p.name;
    }
  });

  // Eliminar jugadores que ya no están
  playersState.value = playersState.value.filter((ps) =>
    playerList.some((p) => p.id === ps.id)
  );
};

// Computed: Jugadores ordenados por progreso (mayor progreso primero)
const sortedPlayers = computed(() => {
  return [...playersState.value].sort((a, b) => b.progress - a.progress);
});

// Emitir progreso propio al servidor
const emitProgress = () => {
  const wpm = calculateWPM();
  communicationManager.emitPlayerProgress?.({
    progress: progress.value,
    wpm,
    errors: errors.value,
  });
};

// Emitir tecla presionada al servidor
const emitKeyPress = (key) => {
  communicationManager.emitPlayerKeyPress?.({ key });
};

// Calcular WPM (palabras por minuto)
const calculateWPM = () => {
  const timeElapsed = (props.timeLimit - timeRemaining.value) / 60; // en minutos
  if (timeElapsed === 0) return 0;
  const wordsTyped = userInput.value.length / 5; // promedio de 5 caracteres por palabra
  return Math.round(wordsTyped / timeElapsed);
};

// Obtener el color del jugador (personalizado o por defecto)
const getPlayerColor = (index) => {
  const player = sortedPlayers.value[index];
  // Si el jugador tiene color personalizado, usarlo; si no, usar colores por defecto
  if (player && player.color) {
    return player.color;
  }
  const colors = ["#F021B9", "#00F0FF", "#39FF14", "#FF0000", "#FFD700"];
  return colors[index % colors.length];
};

// Obtener el indicador de posición del jugador en el texto
const getPlayerIndicator = (playerProgress) => {
  return Math.floor((playerProgress / 100) * textToType.value.length);
};
</script>

<template>
  <div class="game-view">
    <!-- Overlay de cuenta atrás -->
    <div v-if="showCountdown" class="countdown-overlay">
      <div class="countdown-circle">
        <span key="countdown-{{countdownNumber}}" class="countdown-number">{{
          countdownNumber
        }}</span>
        <div class="countdown-ring">
          <div class="ring-fill" :style="{ animationDuration: '1s' }"></div>
        </div>
      </div>
      <div class="countdown-label">PREPARATS...</div>
    </div>
    <!-- Barra superior: Tiempo, WPM, progreso y errores -->
    <div class="game-header">
      <div class="time-section">
        <div class="time-label">Temps</div>
        <div class="time-value" :class="{ 'warning': timeRemaining <= 10 && timeRemaining > 0 }">{{ timeRemaining }}s</div>
      </div>
      <div class="wpm-section">
        <div class="wpm-label">WPM</div>
        <div class="wpm-value">{{ calculateWPM() }}</div>
      </div>
      <div class="round-section">
        <div class="round-label">Ronda</div>
        <div class="round-value">{{ currentRound }} / {{ maxRounds }}</div>
      </div>
      <div class="progress-section">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="progress-text">{{ progress }}%</div>
      </div>
      <div class="errors-section">
        <div class="errors-label">Errors</div>
        <div class="errors-value">{{ errors }}</div>
      </div>
    </div>

    <!-- Área central: Texto a escribir -->
    <div class="game-content" v-show="showContent">
      <div class="game-content-wrapper">
        <!-- Panel lateral de jugadores -->
        <div class="players-panel">
          <h3 class="panel-title">Jugadors</h3>
          <div class="player-list">
            <div
              v-for="(player, index) in sortedPlayers"
              :key="player.id"
              class="player-card"
              :class="{ 'is-typing': player.isTyping }"
            >
              <div class="player-header">
                <div
                  class="player-avatar"
                  :style="{ backgroundColor: getPlayerColor(index) }"
                >
                  {{ player.name.charAt(0).toUpperCase() }}
                </div>
                <div class="player-info">
                  <div class="player-name">{{ player.name }}</div>
                  <div class="player-stats">
                    <span class="stat-wpm">{{ player.wpm }} WPM</span>
                  </div>
                </div>
              </div>
              <div class="player-progress-bar">
                <div
                  class="player-progress-fill"
                  :style="{
                    width: player.progress + '%',
                    backgroundColor: getPlayerColor(index),
                  }"
                ></div>
              </div>
              <div class="player-bottom">
                <span class="player-progress-text">{{ player.progress }}%</span>
                <span class="player-errors">{{ player.errors }} errors</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Área de texto principal -->
        <div class="text-area-wrapper">
          <div class="text-display">
            <p class="text-to-type">
              <span
                v-for="(ch, idx) in textToType.split('')"
                :key="idx"
                :class="[
                  statusClass(charStatuses[idx]),
                  { 'is-space': ch === ' ' },
                ]"
              >
                <!-- Indicadores de posición de otros jugadores -->
                <span
                  v-for="(player, pIndex) in playersState.filter(
                    (p) => getPlayerIndicator(p.progress) === idx
                  )"
                  :key="'indicator-' + player.id"
                  class="player-indicator"
                  :style="{ backgroundColor: getPlayerColor(pIndex) }"
                  :title="player.name"
                ></span>
                {{ ch === " " ? "\u00A0" : ch }}
              </span>
            </p>
          </div>

          <div class="input-area">
            <input
              type="text"
              v-model="userInput"
              @input="handleInput"
              @keydown="onKeyDown"
              placeholder="Empieza a escribir..."
              class="typing-input"
              :disabled="!showContent"
              ref="typingInputRef"
              autofocus
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Área inferior: Teclado visual con indicadores multijugador -->
    <div class="game-footer">
      <div class="keyboard-visual">
        <div class="keyboard-row">
          <div
            class="key"
            v-for="letter in 'QWERTYUIOP'"
            :key="letter"
            :class="{
              pressed: activeKey === letter,
              'other-player-press': playersState.some(
                (p) => p.isTyping && p.lastKey === letter
              ),
            }"
          >
            {{ letter }}
            <span
              v-for="(player, pIndex) in playersState.filter(
                (p) => p.isTyping && p.lastKey === letter
              )"
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
        </div>
        <div class="keyboard-row">
          <div
            class="key"
            v-for="letter in 'ASDFGHJKL'"
            :key="letter"
            :class="{
              pressed: activeKey === letter,
              'other-player-press': playersState.some(
                (p) => p.isTyping && p.lastKey === letter
              ),
            }"
          >
            {{ letter }}
            <span
              v-for="(player, pIndex) in playersState.filter(
                (p) => p.isTyping && p.lastKey === letter
              )"
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
        </div>
        <div class="keyboard-row">
          <div
            class="key"
            v-for="letter in 'ZXCVBNM'"
            :key="letter"
            :class="{
              pressed: activeKey === letter,
              'other-player-press': playersState.some(
                (p) => p.isTyping && p.lastKey === letter
              ),
            }"
          >
            {{ letter }}
            <span
              v-for="(player, pIndex) in playersState.filter(
                (p) => p.isTyping && p.lastKey === letter
              )"
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
        </div>
        <div class="keyboard-row special-row">
          <div
            class="key wide"
            :class="{
              pressed: activeKey === 'SPACE',
              'other-player-press': playersState.some(
                (p) => p.isTyping && p.lastKey === 'SPACE'
              ),
            }"
          >
            Space
            <span
              v-for="(player, pIndex) in playersState.filter(
                (p) => p.isTyping && p.lastKey === 'SPACE'
              )"
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
          <div
            class="key backspace"
            :class="{
              pressed: activeKey === 'BACKSPACE',
              'other-player-press': playersState.some(
                (p) => p.isTyping && p.lastKey === 'BACKSPACE'
              ),
            }"
          >
            ⌫
            <span
              v-for="(player, pIndex) in playersState.filter(
                (p) => p.isTyping && p.lastKey === 'BACKSPACE'
              )"
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón flotante para volver al lobby -->
    <button @click="emit('back-to-lobby')" class="btn-back">← Lobby</button>
  </div>
</template>

<style scoped>
.countdown-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(10, 25, 47, 0.85);
  z-index: 9999;
  backdrop-filter: blur(3px);
}

.countdown-circle {
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(0, 240, 255, 0.15),
    rgba(0, 0, 0, 0)
  );
}

.countdown-number {
  font-size: 8rem;
  font-weight: 800;
  color: #f021b9;
  text-shadow: 0 0 30px #f021b9, 0 0 60px #f021b9;
  animation: pop 1s ease forwards;
  font-family: "Share Tech Mono", monospace;
}

@keyframes pop {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  30% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.countdown-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
}

.ring-fill {
  position: absolute;
  inset: 0;
  border: 6px solid #00f0ff;
  border-top-color: transparent;
  border-right-color: transparent;
  border-radius: 50%;
  animation: sweep 1s linear infinite;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6);
}

@keyframes sweep {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.countdown-label {
  margin-top: 1rem;
  color: #00f0ff;
  font-size: 1.2rem;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
  text-shadow: 0 0 12px #00f0ff;
}

.game-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0a192f;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(0, 240, 255, 0.03) 0px,
    transparent 1px,
    transparent 2px,
    rgba(0, 240, 255, 0.03) 3px
  );
  color: #e0e0e0;
  overflow: hidden;
  padding: 0.75rem;
  box-sizing: border-box;
  gap: 0.75rem;
  font-family: "Share Tech Mono", monospace;
}

/* ===== HEADER: Tiempo, Progreso, Errores ===== */
.game-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #1a2a4a;
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: 2px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3),
    inset 0 0 10px rgba(0, 240, 255, 0.05);
}

.time-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.time-label {
  font-size: 0.85rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "Share Tech Mono", monospace;
}

.time-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f021b9;
  text-shadow: 0 0 10px #f021b9, 0 0 20px #f021b9;
  font-family: "Fira Code", monospace;
}

.time-value.warning {
  color: #ff9500;
  text-shadow: 0 0 10px #ff9500, 0 0 20px #ff9500;
  animation: pulse-warning 1s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.wpm-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.wpm-label {
  font-size: 0.85rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "Share Tech Mono", monospace;
}

.wpm-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #39FF14;
  text-shadow: 0 0 10px #39FF14, 0 0 20px #39FF14;
  font-family: "Fira Code", monospace;
}

.round-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.round-label {
  font-size: 0.85rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "Share Tech Mono", monospace;
}

.round-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f021b9;
  text-shadow: 0 0 10px #f021b9, 0 0 20px #f021b9;
  font-family: "Fira Code", monospace;
}

.progress-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background: rgba(10, 25, 47, 0.8);
  border-radius: 999px;
  overflow: hidden;
  border: 1px solid #00f0ff;
  position: relative;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.2);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #00f0ff 0%, #f021b9 100%);
  transition: width 0.3s ease;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.8);
  position: relative;
}

.progress-fill::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-text {
  font-size: 0.75rem;
  color: #00f0ff;
  font-weight: 600;
  font-family: "Fira Code", monospace;
}

.errors-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 80px;
}

.errors-label {
  font-size: 0.85rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: "Share Tech Mono", monospace;
}

.errors-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ff0000;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  font-family: "Fira Code", monospace;
}

/* ===== CONTENT: Texto y Input ===== */
.game-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 0;
  overflow: hidden;
}

.text-display {
  background: #1a2a4a;
  backdrop-filter: blur(10px);
  padding: 1.25rem 2rem;
  border-radius: 10px;
  border: 2px solid #00f0ff;
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3),
    inset 0 0 15px rgba(0, 240, 255, 0.05);
}

.text-to-type {
  font-size: 1.3rem;
  line-height: 1.8;
  color: #e0e0e0;
  text-align: justify;
  text-align-last: left;
  margin: 0;
  letter-spacing: 0.5px;
  word-wrap: break-word;
  white-space: normal;
  width: 100%;
  font-family: "Fira Code", monospace;
}

.input-area {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.typing-input {
  width: 900px;
  max-width: 100%;
  padding: 1rem 0;
  font-size: 1.2rem;
  font-family: "Fira Code", monospace;
  background: rgba(10, 25, 47, 0.9);
  color: #00f0ff;
  border: 2px solid #00f0ff;
  border-radius: 10px;
  outline: none;
  transition: all 0.3s ease;
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  padding-left: 1rem;
  padding-right: 1rem;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.3);
}

.typing-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.6),
    inset 0 0 15px rgba(240, 33, 185, 0.1);
  background: rgba(10, 25, 47, 1);
  color: #f021b9;
}

.typing-input::placeholder {
  color: rgba(0, 240, 255, 0.4);
  font-family: "Share Tech Mono", monospace;
}

/* ===== FOOTER: Teclado y Botón ===== */
.game-footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.keyboard-visual {
  background: #1a2a4a;
  backdrop-filter: blur(10px);
  padding: 1.25rem 0;
  border-radius: 12px;
  border: 2px solid #00f0ff;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.4),
    inset 0 0 15px rgba(0, 240, 255, 0.05);
  margin: 0 auto;
  box-sizing: border-box;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.key {
  min-width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #1a2a4a, #0f1a2f);
  border: 2px solid #00f0ff;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #00f0ff;
  transition: all 0.15s ease;
  cursor: default;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  font-family: "Share Tech Mono", monospace;
}

.key:hover {
  background: linear-gradient(145deg, #1f3557, #142135);
  border-color: #f021b9;
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.6);
  color: #f021b9;
}

/* Tecla presionada (efecto cuando el usuario pulsa una tecla física) */
.key.pressed {
  transform: translateY(2px);
  background: linear-gradient(180deg, #f021b9, #ff00ff);
  color: #ffffff;
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.8) inset,
    0 0 20px rgba(240, 33, 185, 0.6);
  border-color: #f021b9;
}

.key.wide {
  flex: 1 1 auto;
  min-width: 200px;
  max-width: 400px;
}
.key.backspace {
  min-width: 100px;
  font-size: 1.2rem;
}

/* Estados de los caracteres del texto */
.text-to-type span {
  display: inline;
  transition: color 0.15s ease;
}

/* Correcto: color verde neón */
.char-correct {
  color: #39ff14;
  text-shadow: 0 0 5px #39ff14;
}

/* Incorrecto: color rojo brillante */
.char-incorrect {
  color: #ff0000;
  text-shadow: 0 0 5px #ff0000;
  animation: errorPulse 0.3s ease;
}

@keyframes errorPulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Corregido: color amarillo-naranja neón */
.char-corrected {
  color: #ffa500;
  text-shadow: 0 0 8px #ffa500, 0 0 15px #ff8c00;
}

.btn-back {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: "Share Tech Mono", monospace;
  background: rgba(10, 25, 47, 0.9);
  color: #00f0ff;
  border: 2px solid #00f0ff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  opacity: 0.7;
  z-index: 100;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.btn-back:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #f021b9;
  color: #f021b9;
  opacity: 1;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5);
}

/* ===== MULTIJUGADOR: Estilos ===== */

/* Contenedor principal del juego con panel lateral */
.game-content-wrapper {
  display: flex;
  gap: 1rem;
  width: 100%;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

/* Panel lateral de jugadores */
.players-panel {
  flex: 0 0 260px;
  background: #1a2a4a;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 2px solid #00f0ff;
  padding: 1rem;
  overflow-y: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3),
    inset 0 0 10px rgba(0, 240, 255, 0.05);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: #00f0ff;
  margin: 0 0 0.75rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 10px #00f0ff;
}

.player-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
}

/* Tarjeta de jugador */
.player-card {
  background: rgba(10, 25, 47, 0.5);
  border: 1px solid #00f0ff;
  border-radius: 8px;
  padding: 0.65rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.player-card.is-typing {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5);
  border-color: #f021b9;
  background: rgba(240, 33, 185, 0.1);
}

.player-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.6rem;
}

.player-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a1a1a;
  flex-shrink: 0;
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #00f0ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "Fira Code", monospace;
}

.player-stats {
  font-size: 0.75rem;
  color: #e0e0e0;
  margin-top: 2px;
  font-family: "Fira Code", monospace;
}

.stat-wpm {
  font-weight: 600;
  color: #39ff14;
  text-shadow: 0 0 5px #39ff14;
}

.player-progress-bar {
  width: 100%;
  height: 6px;
  background: rgba(10, 25, 47, 0.8);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.4rem;
  border: 1px solid #00f0ff;
}

.player-progress-fill {
  height: 100%;
  transition: width 0.3s ease;
  border-radius: 999px;
  box-shadow: 0 0 10px currentColor;
}

.player-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-family: "Fira Code", monospace;
}

.player-progress-text {
  color: #00f0ff;
  font-weight: 600;
}

.player-errors {
  color: #ff0000;
  text-shadow: 0 0 5px #ff0000;
}

/* Área de texto adaptada */
.text-area-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/* Indicador de posición en el texto */
.player-indicator {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.7;
    transform: translateX(-50%) scale(1.2);
  }
}

/* Indicador de tecla presionada por otro jugador */
.key {
  position: relative;
}

.key-player-indicator {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 6px;
  height: 6px;
  border-radius: 50%;
  box-shadow: 0 0 8px currentColor;
  animation: pulse 0.8s ease-in-out infinite;
}

.key.other-player-press {
  border-color: #f021b9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.6);
  background: linear-gradient(
    145deg,
    rgba(240, 33, 185, 0.3),
    rgba(240, 33, 185, 0.15)
  );
}

/* Responsive para pantallas pequeñas */
@media (max-height: 700px) {
  .game-view {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .game-header {
    padding: 0.5rem 1rem;
  }

  .text-to-type {
    font-size: 1.1rem;
  }

  .typing-input {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }

  .keyboard-visual {
    padding: 0.75rem 1rem;
    gap: 0.4rem;
  }

  .key {
    min-width: 40px;
    height: 40px;
    font-size: 0.85rem;
  }

  .key.wide {
    min-width: 150px;
  }

  .key.backspace {
    min-width: 80px;
  }

  .players-panel {
    padding: 0.75rem;
  }

  .player-card {
    padding: 0.75rem;
  }
}

@media (max-width: 1400px) {
  .game-content {
    flex-direction: column;
  }

  .main-game {
    max-width: 100%;
  }

  .players-panel {
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }

  .players-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

/* Scrollbar cyberpunk para players-panel */
.players-panel::-webkit-scrollbar {
  width: 8px;
}

.players-panel::-webkit-scrollbar-track {
  background: rgba(10, 25, 47, 0.5);
  border-radius: 4px;
}

.players-panel::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #f021b9, #00f0ff);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(240, 33, 185, 0.5);
}

.players-panel::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00f0ff, #f021b9);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
}

@media (max-width: 768px) {
  .time-value,
  .errors-value {
    font-size: 1.3rem;
  }

  .text-to-type {
    font-size: 1rem;
  }

  .keyboard-visual {
    padding: 0.75rem;
    max-width: 100%;
  }

  .key {
    min-width: 36px;
    height: 36px;
    font-size: 0.8rem;
  }

  .key.wide {
    min-width: 120px;
  }

  .key.backspace {
    min-width: 70px;
    font-size: 1rem;
  }

  /* Panel de jugadores en móvil: arriba en lugar de al lado */
  .game-content-wrapper {
    flex-direction: column;
  }

  .players-panel {
    flex: 0 0 auto;
    max-height: 180px;
  }

  .player-list {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.75rem;
  }

  .player-card {
    min-width: 180px;
  }

  .btn-back {
    padding: 0.4rem 0.75rem;
    font-size: 0.7rem;
  }
}
</style>
