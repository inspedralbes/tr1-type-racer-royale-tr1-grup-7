<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import communicationManager from '../services/communicationManager.js';

// Banco de palabras para el modo de juego
const WORD_BANK = [
  'javascript', 'python', 'typescript', 'react', 'vue', 'angular', 'node',
  'express', 'database', 'server', 'client', 'frontend', 'backend', 'fullstack',
  'component', 'function', 'variable', 'constant', 'array', 'object', 'string',
  'number', 'boolean', 'async', 'await', 'promise', 'callback', 'event',
  'handler', 'method', 'class', 'interface', 'type', 'generic', 'module',
  'import', 'export', 'default', 'return', 'void', 'null', 'undefined',
  'algorithm', 'structure', 'pattern', 'design', 'architecture', 'framework',
  'library', 'package', 'dependency', 'version', 'deploy', 'build', 'compile',
  'debug', 'console', 'terminal', 'command', 'script', 'syntax', 'semantic'
];

const emit = defineEmits(['back-to-lobby']);

// Props (podrían venir de la configuración de la sala)
const props = defineProps({
  tematica: {
    type: String,
    default: 'aleatori'
  },
  timeLimit: {
    type: Number,
    default: 60
  },
  players: {
    type: Array,
    default: () => []
  },
  gameText: {
    type: String,
    default: null
  },
  gameWords: {
    type: Array,
    default: null
  }
});

// Estado del juego
const errors = ref(0);
const totalErrors = ref(0);
const currentWord = ref('');
const currentWordIndex = ref(0);
const wordsCompleted = ref(0);
const userInput = ref('');
const timeRemaining = ref(props.timeLimit);
const typingInputRef = ref(null);
const serverWordList = ref([]);

// Cuenta atrás y visibilidad del contenido
const showCountdown = ref(true);
const countdownNumber = ref(5);
const showContent = ref(false);
let countdownTimer = null;
let gameTimer = null;
const gameStartTime = ref(null);

// Estado por carácter: 'pending' | 'correct' | 'incorrect' | 'corrected'
const charStatuses = ref([]);
// Si alguna vez fue incorrecto (para mostrar ámbar al corregir)
const everIncorrect = ref([]);

// Tecla activa en el teclado visual
const activeKey = ref(null);
let activeKeyTimer = null;

// --- MULTIJUGADOR: Estado de otros jugadores ---
const playersState = ref([]);

// Función para generar una palabra aleatoria
const generateRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
  return WORD_BANK[randomIndex];
};

// Inicializar el juego cuando se monta el componente
onMounted(async () => {
  console.log('🎮 Componente montado');
  console.log('🎮 Props gameWords:', props.gameWords);
  initializeGame();
  initializePlayersState();
  setupMultiplayerListeners();
  // Iniciar countdown automáticamente
  console.log('🎮 Iniciando countdown...');
  startCountdown();
});

onUnmounted(() => {
  cleanupMultiplayerListeners();
  if (countdownTimer) clearInterval(countdownTimer);
  if (gameTimer) clearInterval(gameTimer);
});

// Inicializar estado de jugadores desde las props
const initializePlayersState = () => {
  playersState.value = props.players.map(p => ({
    id: p.id,
    name: p.name,
    wordsCompleted: 0,
    wpm: 0,
    errors: 0,
    isTyping: false,
    lastKey: null
  }));
  
  // Log para debug
  console.log('👥 Jugadores inicializados:', playersState.value);
  console.log('🔑 Mi socket ID:', communicationManager.getSocketId?.());
};

// Inicializar el juego
const initializeGame = () => {
  console.log('🎮 Inicializando juego de palabras...');
  
  // Si hay palabras del servidor, usarlas. Si no, generar aleatoriamente
  if (props.gameWords && props.gameWords.length > 0) {
    wordList.value = [...props.gameWords];
    currentWordIndex.value = 0;
    currentWord.value = wordList.value[0];
    console.log('🎮 Usando palabras sincronizadas del servidor:', wordList.value.length, 'palabras');
    console.log('🎮 Primera palabra:', currentWord.value);
  } else {
    // Fallback: generar palabra aleatoria
    currentWord.value = generateRandomWord();
    console.log('🎮 Modo fallback - palabra aleatoria');
    console.log('🎮 Primera palabra:', currentWord.value);
  }
  
  userInput.value = '';
  errors.value = 0;
  totalErrors.value = 0;
  wordsCompleted.value = 0;
  
  // Inicializar estados por carácter para la primera palabra
  charStatuses.value = Array.from({ length: currentWord.value.length }, () => 'pending');
  everIncorrect.value = Array.from({ length: currentWord.value.length }, () => false);
};

// Iniciar cuenta atrás y mostrar contenido al finalizar
const startCountdown = () => {
  console.log('⏱️ Iniciando countdown...');
  showCountdown.value = true;
  showContent.value = false;
  countdownNumber.value = 5;
  if (countdownTimer) clearInterval(countdownTimer);
  
  countdownTimer = setInterval(async () => {
    if (countdownNumber.value > 1) {
      countdownNumber.value -= 1;
      console.log('⏱️ Countdown:', countdownNumber.value);
    } else {
      console.log('⏱️ Countdown terminado, iniciando juego...');
      clearInterval(countdownTimer);
      countdownTimer = null;
      showCountdown.value = false;
      showContent.value = true;
      gameStartTime.value = Date.now();
      startGameTimer();
      await nextTick();
      // Focus en el input para empezar inmediatamente
      try { 
        typingInputRef.value?.focus(); 
        console.log('✅ Input enfocado');
      } catch (e) {
        console.error('❌ Error al enfocar input:', e);
      }
    }
  }, 1000);
};

// Iniciar el timer del juego (cuenta atrás)
const startGameTimer = () => {
  if (gameTimer) clearInterval(gameTimer);
  timeRemaining.value = props.timeLimit;
  
  gameTimer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(gameTimer);
      // Aquí podrías emitir evento de fin de juego
      console.log('⏱️ Tiempo terminado!');
    }
  }, 1000);
};

// Actualizar estados por carácter a partir del texto tipeado
const updateStatuses = (typed) => {
  const expected = currentWord.value;
  let currentErrors = 0;
  
  for (let i = 0; i < expected.length; i++) {
    if (i < typed.length) {
      if (typed[i] === expected[i]) {
        charStatuses.value[i] = everIncorrect.value[i] ? 'corrected' : 'correct';
      } else {
        charStatuses.value[i] = 'incorrect';
        
        if (!everIncorrect.value[i]) {
          totalErrors.value++;
          everIncorrect.value[i] = true;
        }
        currentErrors++;
      }
    } else {
      charStatuses.value[i] = 'pending';
    }
  }
  
  errors.value = totalErrors.value;
};

// Avanzar a la siguiente palabra
const nextWord = () => {
  wordsCompleted.value++;
  console.log('✅ Palabra completada! Total:', wordsCompleted.value);
  
  // Si hay lista del servidor, iterar por ella. Si no, generar aleatoriamente
  if (wordList.value.length > 0) {
    currentWordIndex.value++;
    // Si llegamos al final de la lista, volver al inicio (loop infinito)
    if (currentWordIndex.value >= wordList.value.length) {
      currentWordIndex.value = 0;
      console.log('🔄 Lista de palabras completada, reiniciando desde el principio');
    }
    currentWord.value = wordList.value[currentWordIndex.value];
  } else {
    // Modo fallback: generar palabra aleatoria
    currentWord.value = generateRandomWord();
  }
  
  userInput.value = '';
  charStatuses.value = Array.from({ length: currentWord.value.length }, () => 'pending');
  everIncorrect.value = Array.from({ length: currentWord.value.length }, () => false);
  
  // Emitir progreso inmediatamente después de completar palabra
  emitProgress();
  
  nextTick(() => {
    typingInputRef.value?.focus();
  });
};

// Manejar entrada del usuario (v-model actualiza userInput automáticamente)
const handleInput = (event) => {
  const typed = event.target.value;
  updateStatuses(typed);
  
  // Si la palabra está completa y correcta, avanzar automáticamente
  if (typed === currentWord.value) {
    nextWord();
  } else {
    // Solo emitir progreso si no se completó la palabra (nextWord ya lo hace)
    emitProgress();
  }
};

// Manejar evento keydown para mostrar la tecla en el teclado visual
const onKeyDown = (event) => {
  const key = event.key;
  // Normalizar: letras en mayúscula
  let displayKey = null;
  if (key === ' ') displayKey = 'SPACE';
  else if (key === 'Backspace') displayKey = 'BACKSPACE';
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
    case 'correct': return 'char-correct';
    case 'incorrect': return 'char-incorrect';
    case 'corrected': return 'char-corrected';
    default: return '';
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
  communicationManager.removeListener?.('playerProgress');
  communicationManager.removeListener?.('playerKeyPress');
};

// Actualizar progreso de un jugador
const updatePlayerProgress = (data) => {
  const { playerId, wordsCompleted: playerWords, progress, wpm, errors: playerErrors } = data;
  const playerIndex = playersState.value.findIndex(p => p.id === playerId);
  const myPlayerId = communicationManager.getSocketId?.();
  
  console.log('📥 Progreso recibido:');
  console.log('   - PlayerId recibido:', playerId);
  console.log('   - Palabras:', playerWords);
  console.log('   - Mi Socket ID:', myPlayerId);
  console.log('   - Índice encontrado:', playerIndex);
  console.log('   - Jugadores en lista:', playersState.value.map(p => ({ id: p.id, name: p.name })));
  
  if (playerIndex === -1) {
    console.error('❌ No se encontró el jugador con ID:', playerId);
    return;
  }
  
  const newWordsCompleted = playerWords !== undefined ? playerWords : (progress || 0);
  const currentWords = playersState.value[playerIndex].wordsCompleted || 0;
  const playerName = playersState.value[playerIndex].name;
  
  // Si es el jugador local, solo actualizar si viene un valor válido y mayor
  if (playerId === myPlayerId) {
    // Solo actualizar si el valor del servidor es mayor que el local
    if (newWordsCompleted > currentWords) {
      console.log(`✅ Actualizando jugador LOCAL "${playerName}" (índice ${playerIndex}): ${currentWords} -> ${newWordsCompleted}`);
      playersState.value[playerIndex].wordsCompleted = newWordsCompleted;
    } else {
      console.log(`⏭️ Manteniendo valor local de "${playerName}": ${currentWords} (servidor: ${newWordsCompleted})`);
    }
  } else {
    // Para otros jugadores, actualizar si el valor es mayor o igual
    if (newWordsCompleted >= currentWords) {
      console.log(`📊 Actualizando jugador REMOTO "${playerName}" (índice ${playerIndex}): ${currentWords} -> ${newWordsCompleted}`);
      playersState.value[playerIndex].wordsCompleted = newWordsCompleted;
    }
  }
  
  // Siempre actualizar WPM y errores
  playersState.value[playerIndex].wpm = wpm || 0;
  playersState.value[playerIndex].errors = playerErrors || 0;
};

// Actualizar tecla presionada por un jugador
const updatePlayerKeyPress = (data) => {
  const { playerId, key } = data;
  const playerIndex = playersState.value.findIndex(p => p.id === playerId);
  
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
  playerList.forEach(p => {
    const existingIndex = playersState.value.findIndex(ps => ps.id === p.id);
    if (existingIndex === -1) {
      // Nuevo jugador
      playersState.value.push({
        id: p.id,
        name: p.name,
        wordsCompleted: 0,
        wpm: 0,
        errors: 0,
        isTyping: false,
        lastKey: null
      });
    } else {
      // Actualizar nombre si cambió
      playersState.value[existingIndex].name = p.name;
    }
  });
  
  // Eliminar jugadores que ya no están
  playersState.value = playersState.value.filter(ps => 
    playerList.some(p => p.id === ps.id)
  );
};

// Computed: Jugadores ordenados por palabras completadas (mayor primero)
const sortedPlayers = computed(() => {
  return [...playersState.value].sort((a, b) => b.wordsCompleted - a.wordsCompleted);
});

// Emitir progreso propio al servidor
const emitProgress = () => {
  const wpm = calculateWPM();
  const myPlayerId = communicationManager.getSocketId?.();
  
  const progressData = {
    playerId: myPlayerId,
    wordsCompleted: wordsCompleted.value,
    wpm,
    errors: errors.value
  };
  
  console.log('📤 Emitiendo progreso:', progressData);
  communicationManager.emitPlayerProgress?.(progressData);
  
  // Actualizar también el estado local del jugador inmediatamente
  if (myPlayerId) {
    const myPlayerIndex = playersState.value.findIndex(p => p.id === myPlayerId);
    if (myPlayerIndex !== -1) {
      console.log('🔄 Actualizando jugador local en índice:', myPlayerIndex, 'ID:', myPlayerId, 'Palabras:', wordsCompleted.value);
      playersState.value[myPlayerIndex].wordsCompleted = wordsCompleted.value;
      playersState.value[myPlayerIndex].wpm = wpm;
      playersState.value[myPlayerIndex].errors = errors.value;
    } else {
      console.warn('⚠️ No se encontró el jugador local en playersState. Socket ID:', myPlayerId);
      console.warn('⚠️ Jugadores disponibles:', playersState.value.map(p => ({ id: p.id, name: p.name })));
    }
  }
};

// Emitir tecla presionada al servidor
const emitKeyPress = (key) => {
  communicationManager.emitPlayerKeyPress?.({ key });
};

// Calcular WPM (palabras por minuto)
const calculateWPM = () => {
  if (!gameStartTime.value) return 0;
  
  const timeElapsedMs = Date.now() - gameStartTime.value;
  const timeElapsedMinutes = timeElapsedMs / 60000; // convertir a minutos
  
  if (timeElapsedMinutes === 0) return 0;
  
  return Math.round(wordsCompleted.value / timeElapsedMinutes);
};

// Obtener el color del jugador según su posición
const getPlayerColor = (index) => {
  const colors = ['#F021B9', '#00F0FF', '#39FF14', '#FF0000', '#FFD700'];
  return colors[index % colors.length];
};
</script>

<template>
  <div class="game-view">
    <!-- Overlay de cuenta atrás -->
    <div v-if="showCountdown" class="countdown-overlay">
      <div class="countdown-circle">
        <span key="countdown-{{countdownNumber}}" class="countdown-number">{{ countdownNumber }}</span>
        <div class="countdown-ring">
          <div class="ring-fill" :style="{ animationDuration: '1s' }"></div>
        </div>
      </div>
      <div class="countdown-label">PREPARATS...</div>
    </div>
    <!-- Barra superior: Tiempo, palabras completadas y errores -->
    <div class="game-header">
      <div class="time-section">
        <div class="time-label">Temps</div>
        <div class="time-value">{{ timeRemaining }}s</div>
      </div>
      <div class="words-section">
        <div class="words-label">Paraules Acertades</div>
        <div class="words-value">{{ wordsCompleted }}</div>
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
                <div class="player-avatar" :style="{ backgroundColor: getPlayerColor(index) }">
                  {{ player.name.charAt(0).toUpperCase() }}
                </div>
                <div class="player-info">
                  <div class="player-name">{{ player.name }}</div>
                  <div class="player-stats">
                    <span class="stat-wpm">{{ player.wpm || 0 }} WPM</span>
                  </div>
                </div>
              </div>
              <div class="player-bottom">
                <span class="player-words">{{ player.wordsCompleted || 0 }} paraules</span>
                <span class="player-errors">{{ player.errors || 0 }} errors</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Área de texto principal -->
        <div class="text-area-wrapper">
          <div class="word-display">
            <div class="current-word">
              <span 
                v-for="(ch, idx) in currentWord.split('')" 
                :key="idx" 
                :class="statusClass(charStatuses[idx])"
              >
                {{ ch }}
              </span>
            </div>
            <div class="word-counter">
              Paraules acertades: {{ wordsCompleted }}
            </div>
          </div>
          
          <div class="input-area">
            <input 
              type="text" 
              v-model="userInput" 
              @input="handleInput"
              @keydown="onKeyDown"
              placeholder="Escriu la paraula..."
              class="typing-input"
              :disabled="!showContent"
              ref="typingInputRef"
              autofocus
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
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
              'other-player-press': playersState.some(p => p.isTyping && p.lastKey === letter)
            }"
          >
            {{ letter }}
            <span 
              v-for="(player, pIndex) in playersState.filter(p => p.isTyping && p.lastKey === letter)" 
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
              'other-player-press': playersState.some(p => p.isTyping && p.lastKey === letter)
            }"
          >
            {{ letter }}
            <span 
              v-for="(player, pIndex) in playersState.filter(p => p.isTyping && p.lastKey === letter)" 
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
              'other-player-press': playersState.some(p => p.isTyping && p.lastKey === letter)
            }"
          >
            {{ letter }}
            <span 
              v-for="(player, pIndex) in playersState.filter(p => p.isTyping && p.lastKey === letter)" 
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
              'other-player-press': playersState.some(p => p.isTyping && p.lastKey === 'SPACE')
            }"
          >
            Space
            <span 
              v-for="(player, pIndex) in playersState.filter(p => p.isTyping && p.lastKey === 'SPACE')" 
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
          <div 
            class="key backspace" 
            :class="{ 
              pressed: activeKey === 'BACKSPACE',
              'other-player-press': playersState.some(p => p.isTyping && p.lastKey === 'BACKSPACE')
            }"
          >
            ⌫
            <span 
              v-for="(player, pIndex) in playersState.filter(p => p.isTyping && p.lastKey === 'BACKSPACE')" 
              :key="player.id"
              class="key-player-indicator"
              :style="{ backgroundColor: getPlayerColor(pIndex) }"
            ></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón flotante para volver al lobby -->
    <button @click="emit('back-to-lobby')" class="btn-back">
      ← Lobby
    </button>
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
  background: radial-gradient(circle at 50% 50%, rgba(0,240,255,0.15), rgba(0,0,0,0));
}

.countdown-number {
  font-size: 8rem;
  font-weight: 800;
  color: #F021B9;
  text-shadow: 0 0 30px #F021B9, 0 0 60px #F021B9;
  animation: pop 1s ease forwards;
  font-family: 'Share Tech Mono', monospace;
}

@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  30% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
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
  border: 6px solid #00F0FF;
  border-top-color: transparent;
  border-right-color: transparent;
  border-radius: 50%;
  animation: sweep 1s linear infinite;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6);
}

@keyframes sweep {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.countdown-label {
  margin-top: 1rem;
  color: #00F0FF;
  font-size: 1.2rem;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
  text-shadow: 0 0 12px #00F0FF;
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
  background: #0A192F;
  background-image: 
    repeating-linear-gradient(
      0deg,
      rgba(0, 240, 255, 0.03) 0px,
      transparent 1px,
      transparent 2px,
      rgba(0, 240, 255, 0.03) 3px
    );
  color: #E0E0E0;
  overflow: hidden;
  padding: 0.75rem;
  box-sizing: border-box;
  gap: 0.75rem;
  font-family: 'Share Tech Mono', monospace;
}

/* ===== HEADER: Tiempo, Progreso, Errores ===== */
.game-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: #1A2A4A;
  backdrop-filter: blur(10px);
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: 2px solid #00F0FF;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.05);
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
  color: #00F0FF;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
}

.time-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #F021B9;
  text-shadow: 0 0 10px #F021B9, 0 0 20px #F021B9;
  font-family: 'Fira Code', monospace;
}

.words-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  align-items: center;
}

.words-label {
  font-size: 0.85rem;
  color: #00F0FF;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
}

.words-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #39FF14;
  text-shadow: 0 0 10px #39FF14, 0 0 20px #39FF14;
  font-family: 'Fira Code', monospace;
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
  color: #00F0FF;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-family: 'Share Tech Mono', monospace;
}

.errors-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF0000;
  text-shadow: 0 0 10px #FF0000, 0 0 20px #FF0000;
  font-family: 'Fira Code', monospace;
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

.word-display {
  background: #1A2A4A;
  backdrop-filter: blur(10px);
  padding: 3rem 2rem;
  border-radius: 10px;
  border: 2px solid #00F0FF;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.05);
  gap: 2rem;
}

.current-word {
  font-size: 4rem;
  font-weight: 700;
  color: #E0E0E0;
  letter-spacing: 0.5rem;
  font-family: 'Fira Code', monospace;
  text-align: center;
  line-height: 1.2;
}

.current-word span {
  display: inline-block;
  transition: color 0.15s ease, transform 0.15s ease;
}

.word-counter {
  font-size: 1.2rem;
  color: #00F0FF;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 10px #00F0FF;
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
  font-family: 'Fira Code', monospace;
  background: rgba(10, 25, 47, 0.9);
  color: #00F0FF;
  border: 2px solid #00F0FF;
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
  border-color: #F021B9;
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.6), inset 0 0 15px rgba(240, 33, 185, 0.1);
  background: rgba(10, 25, 47, 1);
  color: #F021B9;
}

.typing-input::placeholder {
  color: rgba(0, 240, 255, 0.4);
  font-family: 'Share Tech Mono', monospace;
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
  background: #1A2A4A;
  backdrop-filter: blur(10px);
  padding: 1.25rem 0;
  border-radius: 12px;
  border: 2px solid #00F0FF;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
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
  min-width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #1A2A4A, #0F1A2F);
  border: 2px solid #00F0FF;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #00F0FF;
  transition: all 0.15s ease;
  cursor: default;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
  font-family: 'Share Tech Mono', monospace;
}

.key:hover {
  background: linear-gradient(145deg, #1F3557, #142135);
  border-color: #F021B9;
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.6);
  color: #F021B9;
}

/* Tecla presionada (efecto cuando el usuario pulsa una tecla física) */
.key.pressed {
  transform: translateY(2px);
  background: linear-gradient(180deg, #F021B9, #FF00FF);
  color: #FFFFFF;
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.8) inset, 0 0 20px rgba(240, 33, 185, 0.6);
  border-color: #F021B9;
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
  color: #39FF14;
  text-shadow: 0 0 5px #39FF14;
}

/* Incorrecto: color rojo brillante */
.char-incorrect { 
  color: #FF0000;
  text-shadow: 0 0 5px #FF0000;
  animation: errorPulse 0.3s ease;
}

@keyframes errorPulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Corregido: color amarillo-naranja neón */
.char-corrected { 
  color: #FFA500;
  text-shadow: 0 0 8px #FFA500, 0 0 15px #FF8C00;
}

.btn-back {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
  background: rgba(10, 25, 47, 0.9);
  color: #00F0FF;
  border: 2px solid #00F0FF;
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
  border-color: #F021B9;
  color: #F021B9;
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
  background: #1A2A4A;
  backdrop-filter: blur(10px);
  border-radius: 10px;
  border: 2px solid #00F0FF;
  padding: 1rem;
  overflow-y: auto;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 10px rgba(0, 240, 255, 0.05);
}

.panel-title {
  font-size: 1rem;
  font-weight: 600;
  color: #00F0FF;
  margin: 0 0 0.75rem 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 3px;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 10px #00F0FF;
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
  border: 1px solid #00F0FF;
  border-radius: 8px;
  padding: 0.65rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}

.player-card.is-typing {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5);
  border-color: #F021B9;
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
  color: #00F0FF;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: 'Fira Code', monospace;
}

.player-stats {
  font-size: 0.75rem;
  color: #E0E0E0;
  margin-top: 2px;
  font-family: 'Fira Code', monospace;
}

.stat-wpm {
  font-weight: 600;
  color: #39FF14;
  text-shadow: 0 0 5px #39FF14;
}

.player-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-family: 'Fira Code', monospace;
  margin-top: 0.4rem;
}

.player-words {
  color: #39FF14;
  font-weight: 600;
  text-shadow: 0 0 5px #39FF14;
}

.player-errors {
  color: #FF0000;
  text-shadow: 0 0 5px #FF0000;
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
  0%, 100% {
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
  border-color: #F021B9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.6);
  background: linear-gradient(145deg, rgba(240, 33, 185, 0.3), rgba(240, 33, 185, 0.15));
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
  background: linear-gradient(180deg, #F021B9, #00F0FF);
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(240, 33, 185, 0.5);
}

.players-panel::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #00F0FF, #F021B9);
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
