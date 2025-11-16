<script setup>
// GameView - Pantalla de juego con auto-scroll y header compacto
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from "vue";
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
  numRounds: {
    type: Number,
    default: 3,
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
let gameTimer = null;

// Sistema de rondas
const currentRound = ref(1);
const maxRounds = ref(3); // Por defecto 3 rondas

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
  maxRounds.value = props.numRounds; // Usar el número de rondas configurado
  generarNuevoTexto();
  initializePlayersState();
  setupMultiplayerListeners();
  startCountdown();
});

onUnmounted(() => {
  cleanupMultiplayerListeners();
  if (countdownTimer) clearInterval(countdownTimer);
  if (gameTimer) clearInterval(gameTimer);
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
    currentWord: '', // Paraula que estan escrivint actualment
  }));
};

// Inicializar texto recibido del servidor
const generarNuevoTexto = () => {
  console.log("🎮 Inicializando texto del servidor...");
  console.log("🎮 props.gameText:", props.gameText);
  console.log("🎮 props.gameText type:", typeof props.gameText);
  console.log("🎮 props.gameText length:", props.gameText?.length);

  // El texto SIEMPRE viene del servidor
  if (!props.gameText || props.gameText.trim() === "") {
    console.error("❌ No se recibió texto del servidor!");
    // Texto de fallback para testing
    textToType.value = "Este es un texto de prueba. El servidor debería enviar el texto real aquí. Por favor verifica la conexión con el backend.";
    console.log("⚠️ Usando texto de fallback");
  } else {
    console.log("✅ Usando texto del servidor:", props.gameText.substring(0, 100) + "...");
    textToType.value = props.gameText;
  }

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
  
  console.log("🎮 textToType inicializado con longitud:", textToType.value.length);
};

// Watcher para detectar cuando llega el gameText del servidor
watch(() => props.gameText, (newText, oldText) => {
  console.log("🔄 gameText ha cambiado!");
  console.log("🔄 oldText:", oldText?.substring(0, 50));
  console.log("🔄 newText:", newText?.substring(0, 50));
  
  if (newText && newText !== oldText && textToType.value === "") {
    console.log("✅ Recargando texto porque llegó del servidor");
    generarNuevoTexto();
  }
}, { immediate: true });

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
    // Hay más rondas, solicitar al backend nuevo texto
    currentRound.value += 1;
    console.log(`🎮 Solicitando nueva ronda ${currentRound.value} al servidor...`);
    
    // Pedir al servidor que genere un nuevo texto para la siguiente ronda
    communicationManager.requestNextRound();
    
    // El servidor responderá con un evento "nextRound" que contendrá el nuevo texto
    // La cuenta atrás se iniciará cuando llegue el nuevo texto
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
  
  // Auto-scroll para seguir la posición del usuario
  nextTick(() => {
    autoScrollToCurrentChar();
  });
  
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

  // Escuchar nueva ronda con nuevo texto del servidor
  communicationManager.onNextRound?.((data) => {
    console.log("🎮 Nueva ronda recibida del servidor:", data);
    const { gameText: newText, round } = data;
    
    // Actualizar el texto
    textToType.value = newText;
    userInput.value = "";
    progress.value = 0;
    errors.value = 0;
    totalErrors.value = 0;
    
    // Reiniciar estados por carácter
    charStatuses.value = Array.from(
      { length: newText.length },
      () => "pending"
    );
    everIncorrect.value = Array.from({ length: newText.length }, () => false);
    
    // Iniciar cuenta atrás para la nueva ronda
    startCountdown();
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

    // Extreure la paraula actual que està escrivint el jugador
    const playerProgress = playersState.value[playerIndex].progress;
    const currentCharIndex = Math.floor((playerProgress / 100) * textToType.value.length);
    
    // Trobar els límits de la paraula actual
    let wordStart = currentCharIndex;
    let wordEnd = currentCharIndex;
    
    // Anar enrere fins trobar un espai o l'inici del text
    while (wordStart > 0 && textToType.value[wordStart - 1] !== ' ') {
      wordStart--;
    }
    
    // Anar endavant fins trobar un espai o el final del text
    while (wordEnd < textToType.value.length && textToType.value[wordEnd] !== ' ') {
      wordEnd++;
    }
    
    // Extreure la paraula
    const currentWord = textToType.value.substring(wordStart, wordEnd).trim();
    playersState.value[playerIndex].currentWord = currentWord;

    // Limpiar después de un tiempo
    setTimeout(() => {
      if (playersState.value[playerIndex]) {
        playersState.value[playerIndex].isTyping = false;
        playersState.value[playerIndex].currentWord = '';
      }
    }, 500);
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
        currentWord: '',
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

const textArray = computed(() => {
  if (!textToType.value || typeof textToType.value !== 'string') return [];
  return textToType.value.split('');
});

// Computed: siguiente tecla que debe presionar el usuario
const nextKey = computed(() => {
  if (userInput.value.length >= textToType.value.length) return null;
  const nextChar = textToType.value[userInput.value.length];
  if (nextChar === " ") return "SPACE";
  return nextChar.toUpperCase();
});

// Ref para el contenedor del texto
const textDisplayRef = ref(null);

// Auto-scroll: hacer scroll automático para seguir la posición actual del usuario
const autoScrollToCurrentChar = () => {
  if (!textDisplayRef.value) return;
  
  // Buscar el span con la clase 'is-current'
  const currentSpan = textDisplayRef.value.querySelector('.is-current');
  if (!currentSpan) return;
  
  const container = textDisplayRef.value;
  const spanRect = currentSpan.getBoundingClientRect();
  const containerRect = container.getBoundingClientRect();
  
  // Calcular si el carácter actual está fuera de la vista
  const isAboveView = spanRect.top < containerRect.top + 60; // margen superior
  const isBelowView = spanRect.bottom > containerRect.bottom - 60; // margen inferior
  
  if (isAboveView || isBelowView) {
    // Hacer scroll para centrar el carácter actual
    const scrollOffset = spanRect.top - containerRect.top - (containerRect.height / 2) + (spanRect.height / 2);
    container.scrollBy({
      top: scrollOffset,
      behavior: 'smooth'
    });
  }
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
    <!-- Barra superior: Estadístiques del joc -->
    <div class="game-header">
      <div class="stat-card time-card">
        <div class="stat-icon">⏱️</div>
        <div class="stat-content">
          <div class="stat-label">TEMPS</div>
          <div class="stat-value" :class="{ 'warning': timeRemaining <= 10 && timeRemaining > 0 }">{{ timeRemaining }}s</div>
        </div>
      </div>
      
      <div class="stat-card wpm-card">
        <div class="stat-icon">⚡</div>
        <div class="stat-content">
          <div class="stat-label">PPM</div>
          <div class="stat-value">{{ calculateWPM() }}</div>
        </div>
      </div>
      
      <div class="stat-card round-card">
        <div class="stat-icon">🔄</div>
        <div class="stat-content">
          <div class="stat-label">RONDA</div>
          <div class="stat-value">{{ currentRound }} / {{ maxRounds }}</div>
        </div>
      </div>
      
      <div class="progress-card">
        <div class="progress-bar-wrapper">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progress + '%' }"></div>
            <!-- Avatars dels jugadors a la barra de progrés -->
            <div
              v-for="(player, index) in playersState"
              :key="'progress-avatar-' + player.id"
              class="progress-avatar"
              :style="{
                left: player.progress + '%',
                backgroundColor: getPlayerColor(index),
              }"
              :class="{ 'avatar-typing': player.isTyping }"
              :title="player.name + ' - ' + player.progress + '%'"
            >
              {{ player.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="progress-label">{{ progress }}%</div>
        </div>
      </div>
      
      <div class="stat-card errors-card">
        <div class="stat-icon">❌</div>
        <div class="stat-content">
          <div class="stat-label">ERRORS</div>
          <div class="stat-value">{{ errors }}</div>
        </div>
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
                  <div class="player-name">
                    {{ player.name }}
                    <!-- Icona "Escrivint..." -->
                    <span v-if="player.isTyping" class="typing-indicator">
                      <span class="typing-dot"></span>
                      <span class="typing-dot"></span>
                      <span class="typing-dot"></span>
                    </span>
                  </div>
                  <div class="player-stats">
                    <span class="stat-wpm">{{ player.wpm }} PPM</span>
                  </div>
                </div>
              </div>
              <!-- Previsualització de la paraula que estan escrivint -->
              <div v-if="player.isTyping && player.currentWord" class="player-current-word">
                <span class="word-label">Escrivint:</span>
                <span class="word-text">{{ player.currentWord }}</span>
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
          <div class="text-display" ref="textDisplayRef">
            <p class="text-to-type">
              <template v-if="textArray.length">
                <span
                  v-for="(ch, idx) in textArray"
                  :key="idx"
                  :class="[
                    statusClass(charStatuses[idx]),
                    { 'is-space': ch === ' ' },
                    { 'is-current': idx === userInput.length },
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
              </template>
              <template v-else>
                <span style="color:#f021b9;font-size:1.2rem;">No s'ha rebut cap text del servidor.</span>
              </template>
            </p>
          </div>

          <div class="input-area">
            <input
              type="text"
              v-model="userInput"
              @input="handleInput"
              @keydown="onKeyDown"
              placeholder="Comença a escriure..."
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
              'next-key': nextKey === letter,
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
              'next-key': nextKey === letter,
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
              'next-key': nextKey === letter,
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
              'next-key': nextKey === 'SPACE',
              'other-player-press': playersState.some(
                (p) => p.isTyping && p.lastKey === 'SPACE'
              ),
            }"
          >
            Espai
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
              'next-key': nextKey === 'BACKSPACE',
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

    <!-- Botó flotant per tornar al lobby -->
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
  background: linear-gradient(135deg, #1a0b2e 0%, #2d1654 100%);
  color: #ffffff;
  overflow: hidden;
  padding: 1rem;
  box-sizing: border-box;
  gap: 1rem;
  font-family: "Share Tech Mono", monospace;
}

/* ===== HEADER: Estadísticas del juego ===== */
.game-header {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr) 2fr repeat(1, 1fr);
  gap: 0.4rem;
  padding: 0;
}

.stat-card {
  background: rgba(26, 11, 46, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 8px;
  padding: 0.35rem 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-card:hover {
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.5),
              0 0 35px rgba(240, 33, 185, 0.3);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 1.1rem;
  filter: drop-shadow(0 0 5px rgba(0, 240, 255, 0.4));
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.02rem;
  flex: 1;
  min-width: 0;
}

.stat-label {
  font-size: 0.55rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 0.06rem;
  font-weight: 700;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.35);
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 900;
  color: #ffffff;
  text-shadow: 0 0 6px rgba(240, 33, 185, 0.4);
  line-height: 1;
}

.stat-value.warning {
  color: #ff4500;
  text-shadow: 0 0 15px #ff4500, 0 0 30px #ff4500;
  animation: pulse-warning 0.8s ease-in-out infinite;
}

@keyframes pulse-warning {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.85;
  }
}

.progress-card {
  background: rgba(26, 11, 46, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 8px;
  padding: 0.35rem 0.6rem;
  display: flex;
  align-items: center;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  grid-column: span 2;
}

.progress-bar-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 12px;
  background: rgba(10, 15, 30, 0.8);
  border-radius: 999px;
  overflow: hidden;
  border: 2px solid rgba(0, 240, 255, 0.3);
  position: relative;
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.5);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00f0ff 0%, #f021b9 100%);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.8);
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
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.progress-label {
  font-size: 0.75rem;
  color: #00f0ff;
  font-weight: 900;
  min-width: 35px;
  text-align: right;
  text-shadow: 0 0 5px rgba(0, 240, 255, 0.4);
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

/* ===== CONTENT: Layout Centrado y Jerárquico ===== */
.game-content {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  min-height: 0;
  overflow: hidden;
}

.game-content-wrapper {
  display: flex;
  gap: 1.5rem;
  width: 100%;
}

.text-area-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
}

.text-display {
  background: linear-gradient(135deg, rgba(10,15,30,0.95) 0%, rgba(26,11,46,0.95) 100%);
  border: 4px solid;
  border-image: linear-gradient(90deg, #00f0ff, #f021b9) 1;
  border-radius: 20px;
  padding: 3rem 4rem;
  width: 100%;
  max-width: 1100px;
  overflow-y: auto;
  box-shadow: 0 0 50px rgba(0,240,255,0.4), 
              0 0 80px rgba(240,33,185,0.25),
              inset 0 0 30px rgba(0,240,255,0.08);
  position: relative;
  min-height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.text-to-type {
  font-size: 2.4rem;
  line-height: 2.6;
  color: #ffffff;
  text-align: left;
  margin: 0;
  letter-spacing: 0.08em;
  word-wrap: break-word;
  white-space: normal;
  width: 100%;
  font-family: "Share Tech Mono", monospace;
  position: relative;
  z-index: 10;
  text-shadow: 0 0 15px rgba(0,240,255,0.6), 0 0 25px rgba(240,33,185,0.4);
  background: transparent;
  padding: 0;
  font-weight: 600;
}

.text-to-type span {
  display: inline;
  transition: all 0.15s ease;
}

/* ===== FOOTER: Teclado Visual ===== */
.game-footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

.keyboard-visual {
  background: rgba(26, 11, 46, 0.7);
  backdrop-filter: blur(12px);
  padding: 1rem 1.5rem;
  border-radius: 14px;
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 900px;
  width: 100%;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.4), inset 0 0 15px rgba(0, 240, 255, 0.05);
  margin: 0 auto;
  box-sizing: border-box;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.key {
  position: relative;
  min-width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, rgba(10, 15, 30, 0.9), rgba(20, 25, 45, 0.9));
  border: 2px solid rgba(0, 240, 255, 0.5);
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 700;
  color: #00f0ff;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: default;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.25), inset 0 2px 4px rgba(0, 240, 255, 0.1);
  font-family: "Share Tech Mono", monospace;
  overflow: hidden;
}

.key::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.1) 0%,
    transparent 50%,
    rgba(240, 33, 185, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.key:hover::before {
  opacity: 1;
}

.key:hover {
  background: linear-gradient(145deg, rgba(10, 15, 30, 1), rgba(30, 35, 55, 1));
  border-color: #f021b9;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.7),
              0 8px 15px rgba(0, 0, 0, 0.4);
  color: #f021b9;
}

/* Efecto brillo sutil en teclas */
.key::after {
  content: "";
  position: absolute;
  top: -150%;
  left: -50%;
  width: 100%;
  height: 300%;
  transform: rotate(25deg);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
  transition: transform 0.6s ease;
}

.key:hover::after {
  transform: translateX(200%) rotate(25deg);
}

/* Tecla presionada activamente */
.key.pressed {
  transform: translateY(2px) scale(0.98);
  background: linear-gradient(180deg, #f021b9, #d01a9f);
  color: #ffffff;
  border-color: #f021b9;
  box-shadow: 0 0 35px rgba(240, 33, 185, 1),
              inset 0 0 20px rgba(240, 33, 185, 0.6);
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);

/* Siguiente tecla a presionar - destacada con animación */
.key.next-key {
  background: linear-gradient(145deg, rgba(0, 240, 255, 0.3), rgba(0, 200, 220, 0.3)) !important;
  border-color: #00f0ff !important;
  border-width: 3px !important;
  color: #00f0ff !important;
  box-shadow: 0 0 35px rgba(0, 240, 255, 0.9),
              0 0 50px rgba(0, 240, 255, 0.6),
              inset 0 0 25px rgba(0, 240, 255, 0.3) !important;
  animation: nextKeyPulse 1.5s ease-in-out infinite;
  transform: scale(1.1);
  z-index: 10;
}

@keyframes nextKeyPulse {
  0%, 100% {
    box-shadow: 0 0 35px rgba(0, 240, 255, 0.9),
                0 0 50px rgba(0, 240, 255, 0.6),
                inset 0 0 25px rgba(0, 240, 255, 0.3);
    transform: scale(1.1);
  }
  50% {
    box-shadow: 0 0 50px rgba(0, 240, 255, 1),
                0 0 75px rgba(0, 240, 255, 0.8),
                inset 0 0 35px rgba(0, 240, 255, 0.5);
    transform: scale(1.15);
  }
}
}

.key.wide {
  flex: 1 1 auto;
  min-width: 220px;
  max-width: 450px;
}

.key.backspace {
  min-width: 110px;
  font-size: 1.3rem;
}

/* Estados de los caracteres del texto */
.text-to-type span {
  display: inline;
  transition: color 0.2s ease, text-shadow 0.2s ease;
  position: relative;
  padding: 0; /* evitar desplazamientos */
}

/* Correcto: verde neón brillante */
.char-correct {
  color: #39ff14;
  text-shadow: 0 0 8px #39ff14, 0 0 12px #39ff14;
  font-weight: 700;
}

/* Incorrecto: rojo intenso con animación */
.char-incorrect {
  color: #ff1744 !important;
  text-shadow: 0 0 12px rgba(255, 23, 68, 0.9) !important;
}

@keyframes errorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-3px); }
  75% { transform: translateX(3px); }
}

/* Corregido: naranja/amarillo con fondo */
.char-corrected {
  color: #ffa726;
  text-shadow: 0 0 10px #ffa726, 0 0 15px #ff9800;
}

/* Cursor actual con animación de pulso */
.text-to-type span.is-current {
  background: transparent !important;
}

.text-to-type span.is-current::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -5px;
  transform: translateX(-50%);
  width: 80%;
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, #00f0ff, #f021b9);
  box-shadow: 0 0 15px rgba(0, 240, 255, 1),
              0 0 25px rgba(240, 33, 185, 0.9);
  animation: lineGlow 1s ease-in-out infinite;
}

@keyframes currentPulse {
  0%, 100% {
    background: linear-gradient(135deg, rgba(0, 240, 255, 0.3), rgba(240, 33, 185, 0.3));
    box-shadow: 0 0 20px rgba(0, 240, 255, 0.8), 0 0 30px rgba(240, 33, 185, 0.6);
  }
  50% {
    background: linear-gradient(135deg, rgba(0, 240, 255, 0.5), rgba(240, 33, 185, 0.5));
    box-shadow: 0 0 30px rgba(0, 240, 255, 1), 0 0 45px rgba(240, 33, 185, 0.9);
  }
}

@keyframes lineGlow {
  0%, 100% {
    box-shadow: 0 0 15px rgba(0, 240, 255, 1), 0 0 25px rgba(240, 33, 185, 0.9);
  }
  50% {
    box-shadow: 0 0 25px rgba(0, 240, 255, 1), 0 0 40px rgba(240, 33, 185, 1);
  }
}

.text-to-type span.is-space.is-current::after {
  width: 40%;
}

.btn-back {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 0.7rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  background: rgba(26, 11, 46, 0.9);
  color: #00f0ff;
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(12px);
  z-index: 100;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.btn-back:hover {
  background: rgba(240, 33, 185, 0.2);
  color: #f021b9;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.7),
              0 5px 15px rgba(0, 0, 0, 0.3);
}

.btn-back:active {
  transform: translateY(-1px) scale(1.02);
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
  position: relative; /* para posicionar el panel de jugadores fijo dentro del contenedor */
}

/* Panel de jugadores (abajo a la izquierda) */
.players-panel {
  position: fixed;
  left: 0.8rem;
  bottom: 0.8rem;
  width: 230px;
  max-height: 40vh;
  background: rgba(26, 11, 46, 0.8);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  border: 2px solid;
  border-image: linear-gradient(135deg, #00f0ff, #f021b9) 1;
  padding: 0.7rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1200;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.05);
}

/* Asegurar contexto de posicionamiento */
.game-content-wrapper { position: relative; }

.panel-title {
  font-size: 0.9rem;
  font-weight: 900;
  color: #00f0ff;
  margin: 0 0 0.6rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 12px #00f0ff, 0 0 20px rgba(0, 240, 255, 0.4);
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(0, 240, 255, 0.3);
}

.player-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  flex: 1;
  overflow-y: auto;
}

/* Tarjeta de jugador */
.player-card {
  background: rgba(10, 15, 30, 0.65);
  border: 2px solid rgba(0, 240, 255, 0.35);
  border-radius: 10px;
  padding: 0.6rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.18);
  position: relative;
  overflow: hidden;
}

.player-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 240, 255, 0.05) 0%,
    transparent 50%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
}

.player-card:hover::before {
  opacity: 1;
}

.player-card.is-typing {
  transform: translateX(4px);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.7),
              0 0 15px rgba(0, 240, 255, 0.3);
  border-color: #f021b9;
  background: rgba(240, 33, 185, 0.15);
}

.player-card.is-typing::before {
  background: linear-gradient(
    135deg,
    rgba(240, 33, 185, 0.15) 0%,
    transparent 50%
  );
  opacity: 1;
}

.player-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
}

.player-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 900;
  color: #1a0b2e;
  flex-shrink: 0;
  border: 2px solid rgba(0, 240, 255, 0.5);
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  transition: all 0.3s ease;
}

.player-card.is-typing .player-avatar {
  border-color: #f021b9;
  box-shadow: 0 0 15px rgba(240, 33, 185, 0.6);
  transform: scale(1.1);
}

.player-info {
  flex: 1;
  min-width: 0;
}

.player-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: #00f0ff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
  margin-bottom: 0.2rem;
}

.player-stats {
  font-size: 0.75rem;
  color: #c0c0c0;
  font-family: "Share Tech Mono", monospace;
  display: flex;
  gap: 0.5rem;
}

.stat-wpm {
  font-weight: 700;
  color: #39ff14;
  text-shadow: 0 0 8px #39ff14;
}

.player-progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(10, 15, 30, 0.9);
  border-radius: 999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
  border: 1px solid rgba(0, 240, 255, 0.3);
  box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.4);
}

.player-progress-fill {
  height: 100%;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 999px;
  box-shadow: 0 0 12px currentColor;
  position: relative;
}

.player-progress-fill::after {
  content: '';
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

.player-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-family: "Share Tech Mono", monospace;
  font-weight: 700;
}

.player-progress-text {
  color: #00f0ff;
  text-shadow: 0 0 6px rgba(0, 240, 255, 0.6);
}

.player-errors {
  color: #ff1744;
  text-shadow: 0 0 8px #ff1744;
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

/* ===== AVATARS A LA BARRA DE PROGRÉS ===== */
.progress-bar {
  position: relative; /* Per posicionar els avatars */
}

.progress-avatar {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
  font-weight: 900;
  color: #1a0b2e;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 12px currentColor, 0 0 20px rgba(0, 0, 0, 0.5);
  transition: left 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease;
  z-index: 100;
  cursor: pointer;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
}

.progress-avatar:hover {
  transform: translate(-50%, -50%) scale(1.3);
  z-index: 150;
  border-width: 3px;
}

.progress-avatar.avatar-typing {
  animation: avatarPulse 0.6s ease-in-out infinite;
  border-width: 3px !important;
  box-shadow: 0 0 20px currentColor, 0 0 35px currentColor !important;
}

@keyframes avatarPulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
  }
}

/* ===== INDICADOR "ESCRIVINT..." ===== */
.typing-indicator {
  display: inline-flex;
  gap: 3px;
  margin-left: 0.5rem;
  align-items: center;
}

.typing-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #00f0ff;
  animation: typingDotBounce 1.4s infinite ease-in-out;
  box-shadow: 0 0 8px #00f0ff;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typingDotBounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.7;
  }
  30% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* ===== PREVISUALITZACIÓ DE LA PARAULA ACTUAL ===== */
.player-current-word {
  margin-top: 0.5rem;
  padding: 0.4rem 0.6rem;
  background: rgba(0, 240, 255, 0.1);
  border-left: 3px solid #00f0ff;
  border-radius: 6px;
  font-size: 0.8rem;
  font-family: "Share Tech Mono", monospace;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  box-shadow: inset 0 0 15px rgba(0, 240, 255, 0.1);
  animation: wordFadeIn 0.3s ease;
}

@keyframes wordFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.word-label {
  color: #00f0ff;
  font-weight: 700;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.word-text {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.85rem;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.4);
  letter-spacing: 0.1em;
}

/* Responsive para pantallas pequeñas */
@media (max-height: 700px) {
  .game-view {
    padding: 0.6rem;
    gap: 0.6rem;
  }

  .stat-card {
    padding: 0.6rem 0.8rem;
  }

  .stat-icon {
    font-size: 1.4rem;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .text-to-type {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .typing-input {
    padding: 0.9rem 1.2rem;
    font-size: 1.1rem;
  }

  .keyboard-visual {
    padding: 1rem 1.5rem;
    gap: 0.5rem;
  }

  .key {
    min-width: 45px;
    height: 45px;
    font-size: 0.95rem;
  }

  .key.wide {
    min-width: 180px;
  }

  .key.backspace {
    min-width: 90px;
  }

  .players-panel {
    padding: 0.9rem;
  }

  .player-card {
    padding: 0.7rem;
  }
}

@media (max-width: 1400px) {
  .game-content {
    grid-template-columns: 1fr;
    grid-template-rows: 200px 1fr;
  }

  .players-panel {
    flex: 0 0 auto;
    width: 100%;
    max-height: 200px;
    overflow-y: auto;
  }

  .text-area-wrapper {
    min-height: 400px;
  }
}

/* Scrollbar personalizado para panel de jugadores y texto */
.players-panel::-webkit-scrollbar,
.text-display::-webkit-scrollbar {
  width: 10px;
}

.players-panel::-webkit-scrollbar-track,
.text-display::-webkit-scrollbar-track {
  background: rgba(10, 15, 30, 0.6);
  border-radius: 5px;
  border: 1px solid rgba(0, 240, 255, 0.2);
}

.players-panel::-webkit-scrollbar-thumb,
.text-display::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #00f0ff, #f021b9);
  border-radius: 5px;
  box-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
  border: 1px solid rgba(0, 240, 255, 0.3);
}

.players-panel::-webkit-scrollbar-thumb:hover,
.text-display::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #f021b9, #00f0ff);
  box-shadow: 0 0 18px rgba(240, 33, 185, 0.8);
}

@media (max-width: 768px) {
  .game-header {
    grid-template-columns: 1fr 1fr;
    gap: 0.6rem;
  }

  .progress-card {
    grid-column: span 2;
  }

  .stat-value {
    font-size: 1.2rem;
  }

  .stat-icon {
    font-size: 1.5rem;
  }

  .text-to-type {
    font-size: 1.1rem;
    line-height: 1.7;
  }

  .text-display {
    padding: 1.5rem;
  }

  .keyboard-visual {
    padding: 1rem;
    max-width: 100%;
  }

  .key {
    min-width: 38px;
    height: 38px;
    font-size: 0.85rem;
  }

  .key.wide {
    min-width: 130px;
  }

  .key.backspace {
    min-width: 75px;
    font-size: 1rem;
  }

  /* Panel de jugadores en móvil: horizontal scroll */
  .game-content {
    grid-template-rows: 180px 1fr;
  }

  .players-panel {
    max-height: 180px;
  }

  .player-list {
    flex-direction: row;
    overflow-x: auto;
    gap: 0.8rem;
  }

  .player-card {
    min-width: 190px;
    flex-shrink: 0;
  }

  .btn-back {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    bottom: 1rem;
    right: 1rem;
  }
}

/* ===== MILLORES FINALS: LAYOUT CENTRAT I JER ÀRQUIC ===== */
.game-content {
  flex: 1 !important;
  display: flex !important;
  gap: 1.5rem !important;
  min-height: 0;
  overflow: hidden;
  grid-template-columns: none !important;
}

.game-content-wrapper {
  display: flex;
  gap: 1.5rem;
  width: 100%;
  flex: 1;
}

.text-area-wrapper {
  flex: 1;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 1.5rem !important;
  padding: 2rem;
  overflow: visible !important;
}

.text-display {
  background: linear-gradient(135deg, rgba(10,15,30,0.98) 0%, rgba(26,11,46,0.98) 100%) !important;
  border: 4px solid !important;
  border-image: linear-gradient(90deg, #00f0ff, #f021b9) 1 !important;
  border-radius: 18px !important;
  padding: 2.5rem 3.5rem !important;
  width: 100% !important;
  max-width: 1400px !important;
  max-height: 420px !important;
  overflow-y: auto;
  scroll-behavior: smooth;
  box-shadow: 0 0 45px rgba(0,240,255,0.4), 0 0 75px rgba(240,33,185,0.25), inset 0 0 30px rgba(0,240,255,0.08) !important;
  position: relative;
  min-height: 260px !important;
  display: block !important;
  text-align: left !important;
}

.text-to-type {
  font-size: 2.2rem !important;
  line-height: 2.5 !important;
  color: #ffffff !important;
  text-align: left !important;
  text-shadow: 0 0 15px rgba(0,240,255,0.5), 0 0 25px rgba(240,33,185,0.4), 0 2px 5px rgba(0,0,0,0.5) !important;
  font-weight: 700 !important;
  letter-spacing: 0.02em !important;
  word-wrap: break-word !important;
  word-break: normal !important;
  overflow-wrap: break-word !important;
  white-space: normal !important;
}

.input-area {
  display: flex;
  width: 100%;
  max-width: 1400px !important;
  justify-content: center;
}

.typing-input {
  width: 100% !important;
  max-width: 1000px !important;
  padding: 0.8rem 1.2rem !important;
  font-size: 1.25rem !important;
  background: rgba(10, 15, 30, 0.95) !important;
  color: #00f0ff !important;
  text-align: center !important;
  border: 3px solid !important;
  border-image: linear-gradient(90deg, #00f0ff, #f021b9) 1 !important;
  border-radius: 12px !important;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.4), inset 0 2px 8px rgba(0, 0, 0, 0.4) !important;
  font-weight: 600 !important;
  letter-spacing: 0.02em !important;
  transition: all 0.2s ease !important;
}

.typing-input:focus {
  border-image: linear-gradient(90deg, #f021b9, #00f0ff) 1 !important;
  border-width: 5px !important;
  box-shadow: 0 0 55px rgba(240, 33, 185, 0.75), 0 0 80px rgba(0, 240, 255, 0.5), inset 0 0 25px rgba(240, 33, 185, 0.2) !important;
  color: #f021b9 !important;
  transform: translateY(-2px) scale(1.01) !important;
  outline: none !important;
} 

.player-card {
  padding: 0.6rem !important;
  margin-bottom: 0.6rem !important;
  border: 2px solid rgba(0, 240, 255, 0.3) !important;
}

.stat-card {
  background: rgba(10, 15, 30, 0.9) !important;
  border: 3px solid !important;
  padding: 1rem 1.2rem !important;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4) !important;
}

.stat-icon {
  font-size: 2rem !important;
}

.stat-label {
  font-size: 0.85rem !important;
  font-weight: 900 !important;
}

.stat-value {
  font-size: 1.8rem !important;
  font-weight: 900 !important;
}

.game-footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
}

/* Teclat compacte eliminat - es fa servir el teclat gran original */
</style>
