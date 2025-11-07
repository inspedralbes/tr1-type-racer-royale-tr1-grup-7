<script setup>
import { ref, onMounted } from 'vue';
import GameEngine from './components/GameEngine.vue';
import GameView from './components/GameView.vue';
import RoomList from './components/RoomList.vue';
import CreateRoom from './components/CreateRoom.vue';
import LobbyRoom from './components/LobbyRoom.vue';
import WelcomeScreen from './components/WelcomeScreen.vue';
import GameModeSelect from './components/GameModeSelect.vue';
import RoomActionSelect from './components/RoomActionSelect.vue';
import PasswordDialog from './components/PasswordDialog.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';
import InfoDialog from './components/InfoDialog.vue';
import ToastContainer from './components/ToastContainer.vue';
import communicationManager from './services/communicationManager.js';

// Flujo: inicio -> modoJuego -> salaEspera -> roomList/createRoom -> lobby -> joc
const vistaActual = ref('inicio'); 
const nomJugador = ref('');
const modoJuego = ref(''); // 'palabras' o 'texto'
const nomSala = ref('');
const jugadors = ref([]);
const activeRooms = ref([]); // Salas reales del servidor
const currentRoomConfig = ref(null); // Configuración de la sala actual
const isRoomAdmin = ref(false); // Si el usuario es admin de la sala
const gameText = ref(null); // Texto sincronizado del servidor

// Estado de los diálogos
const showPasswordDialog = ref(false);
const showKickConfirmDialog = ref(false);
const pendingRoomJoin = ref(null);
const pendingPlayerKick = ref(null);
// Sistema de missatges centralitzat amb cua
const messageQueue = ref([]); // { title?, message, type: 'info'|'error'|'warning'|'success' }
const showInfoDialog = ref(false);
const currentMessage = ref(null);

// Toast notifications (no modal)
const toasts = ref([]); // { id, message, type, title?, timeoutId }
let toastIncrementalId = 0;

function addToast({ message, type='info', title, duration=3500 }) {
  const id = ++toastIncrementalId;
  const toast = { id, message, type, title };
  toasts.value.push(toast);
  if (duration > 0) {
    const timeoutId = setTimeout(() => removeToast(id), duration);
    toast.timeoutId = timeoutId;
  }
}

function removeToast(id) {
  const idx = toasts.value.findIndex(t => t.id === id);
  if (idx !== -1) {
    const toast = toasts.value[idx];
    if (toast.timeoutId) clearTimeout(toast.timeoutId);
    toasts.value.splice(idx, 1);
  }
}

function enqueueMessage(msg) {
  // Errors y warnings críticos siguen como modal; info y success van como toast
  if (msg.type === 'error' || msg.type === 'warning') {
    messageQueue.value.push(msg);
    if (!showInfoDialog.value) {
      showNextMessage();
    }
  } else {
    addToast(msg);
  }
}

function showNextMessage() {
  if (messageQueue.value.length > 0) {
    currentMessage.value = messageQueue.value.shift();
    showInfoDialog.value = true;
  } else {
    currentMessage.value = null;
    showInfoDialog.value = false;
  }
}

function closeInfoDialog() {
  showInfoDialog.value = false;
  currentMessage.value = null;
  // breu timeout per assegurar el tancament de transicions i obrir el següent
  setTimeout(showNextMessage, 0);
}

function handleNotify(payload) {
  // Normalitzar estructura
  const msg = {
    message: payload?.message || '',
    type: payload?.type || 'info',
    title: payload?.title
  };
  enqueueMessage(msg);
}

// Navegación del flujo inicial
function handleWelcome(playerName) {
  nomJugador.value = playerName;
  vistaActual.value = 'modoJuego';
}

function handleModeSelect(mode) {
  modoJuego.value = mode;
  vistaActual.value = 'salaEspera';
}

function handleRoomAction(action) {
  // Asegurarse de que estamos conectados en ambos casos
  communicationManager.connectToListen();
  
  if (action === 'crear') {
    vistaActual.value = 'createRoom';
  } else {
    vistaActual.value = 'roomList';
  }
}

function backToRoomAction() {
  vistaActual.value = 'salaEspera';
}

function backToModeSelect() {
  vistaActual.value = 'modoJuego';
}

function backToWelcome() {
  nomJugador.value = '';
  modoJuego.value = '';
  vistaActual.value = 'inicio';
}

// --- NOU: Funció per unir-se a una sala existent ---
function joinRoom(roomName) {
  // Verificar si necesita contraseña
  const room = activeRooms.value.find(r => r.name === roomName);
  
  if (!room) {
    enqueueMessage({ message: 'La sala no existeix.', type: 'error' });
    return;
  }

  // Convertir isPrivate a booleano si es string
  const isPrivate = room.isPrivate === true || room.isPrivate === 'true';
  
  if (isPrivate) {
    // Mostrar diálogo personalizado para pedir contraseña
    pendingRoomJoin.value = roomName;
    showPasswordDialog.value = true;
  } else {
    // Unirse directamente sin contraseña
    joinRoomWithPassword(roomName, null);
  }
}

function joinRoomWithPassword(roomName, password) {
  const joinConfig = {
    roomName: roomName,
    playerName: nomJugador.value,
    password: password
  };

  // Actualizar el estado local
  nomSala.value = roomName;
  isRoomAdmin.value = false; // No somos admin al unirnos

  // Enviar solicitud de unión
  communicationManager.joinRoom(joinConfig);
}

function handlePasswordConfirm(password) {
  showPasswordDialog.value = false;
  if (pendingRoomJoin.value && password) {
    joinRoomWithPassword(pendingRoomJoin.value, password);
  }
  pendingRoomJoin.value = null;
}

function handlePasswordCancel() {
  showPasswordDialog.value = false;
  pendingRoomJoin.value = null;
}

function goToRoomList() {
  vistaActual.value = 'roomList';
}

function goToCreateRoom() {
  vistaActual.value = 'createRoom';
}

// Refactorizada para usar el nuevo evento 'createRoom'
function createRoom(roomConfig) {
  const fullRoomConfig = {
    ...roomConfig, // viene de CreateRoom.vue
    playerName: nomJugador.value,
    gameMode: modoJuego.value,
  };

  // Guardar el nombre de la sala localmente
  nomSala.value = roomConfig.roomName;

  console.log('🚀 Creando sala con configuración:', fullRoomConfig);
  // Llamar al communicationManager para que emita el evento
  communicationManager.createRoom(fullRoomConfig);

  // NO cambiar a lobby aquí - esperar el evento 'joinedRoom' del servidor
  // El cambio de vista se hará en el listener onJoinedRoom en onMounted
}

function leaveRoom() {
  // Desconectar del servidor
  communicationManager.disconnect?.();
  // Resetear estado
  nomSala.value = '';
  jugadors.value = [];
  currentRoomConfig.value = null;
  isRoomAdmin.value = false;
  // Volver a la selección de acción
  vistaActual.value = 'salaEspera';
  
  // Reconectar para escuchar la lista de salas actualizada
  communicationManager.connectToListen();
}

function startGame() {
  if (isRoomAdmin.value) {
    console.log('Admin iniciando partida...');
    // Emitir evento al servidor para iniciar el juego para todos
    communicationManager.startGame();
    // El servidor responderá con 'gameStarted' para todos los jugadores
  }
}

function kickPlayer(playerId) {
  if (isRoomAdmin.value) {
    const player = jugadors.value.find(p => p.id === playerId);
    if (player) {
      pendingPlayerKick.value = { id: playerId, name: player.name };
      showKickConfirmDialog.value = true;
    }
  }
}

function handleKickConfirm() {
  showKickConfirmDialog.value = false;
  if (pendingPlayerKick.value) {
    console.log('Expulsando jugador:', pendingPlayerKick.value.id);
    communicationManager.kickPlayer(pendingPlayerKick.value.id);
  }
  pendingPlayerKick.value = null;
}

function handleKickCancel() {
  showKickConfirmDialog.value = false;
  pendingPlayerKick.value = null;
}

onMounted(() => {
  // Conectar para escuchar la lista de salas al iniciar
  communicationManager.connectToListen();

  // Escuchamos la lista de jugadores cuando estamos en una sala
  communicationManager.onUpdatePlayerList((playerList) => {
    console.log('Lista de jugadores actualizada:', playerList);
    jugadors.value = playerList;
  });

  // Escuchamos la lista de salas actualizada
  communicationManager.onUpdateRoomList((roomList) => {
    console.log('📡 App.vue - Lista de salas actualizada:', roomList);
    activeRooms.value = roomList;
  });
  
  // Escuchar errores del servidor (ej: sala ya existe)
  communicationManager.onRoomError((error) => {
    enqueueMessage({ message: error.message || 'Error desconegut', type: 'error' });
    vistaActual.value = 'roomList';
  });

  // Escuchar cuando nos unimos exitosamente a una sala
  communicationManager.onJoinedRoom((data) => {
    console.log('✅ Unido exitosamente a la sala:', data);
    currentRoomConfig.value = data.roomConfig;
    isRoomAdmin.value = data.isAdmin;
    console.log('🔄 Cambiando vista a lobby. Vista actual antes:', vistaActual.value);
    console.log('📋 Estado antes de cambiar:', {
      nomSala: nomSala.value,
      jugadors: jugadors.value,
      currentRoomConfig: currentRoomConfig.value,
      isRoomAdmin: isRoomAdmin.value,
      socketId: communicationManager.getSocketId()
    });
    vistaActual.value = 'lobby';
    console.log('🔄 Vista actual después:', vistaActual.value);
  });

  // Escuchar cuando el juego inicia (para todos los jugadores)
  communicationManager.onGameStarted((data) => {
    console.log('🎮 El juego ha comenzado!', data);
    console.log('🎮 roomConfig recibido:', data.roomConfig);
    console.log('🎮 gameText recibido:', data.gameText?.substring(0, 50) + '...');
    
    // Actualizar la configuración si viene del servidor
    if (data.roomConfig) {
      currentRoomConfig.value = data.roomConfig;
    }
    
    // Guardar el texto sincronizado
    if (data.gameText) {
      gameText.value = data.gameText;
    }
    
    vistaActual.value = 'joc';
  });

  // Escuchar si el jugador ha sido expulsado
  communicationManager.onKicked(() => {
    enqueueMessage({ message: 'Has estat expulsat de la sala per l\'administrador', type: 'warning', title: 'Expulsat' });
    leaveRoom();
  });
});
</script>

<template>
  <main class="app-container">
    <!-- Header solo se muestra después de la pantalla de inicio -->
    <header v-if="vistaActual !== 'inicio'">
      <h1 class="main-title">
        TECLAZO 🎮
      </h1>
    </header>
    
      
      <!-- VISTA 0: PANTALLA DE BIENVENIDA -->
      <WelcomeScreen 
        v-if="vistaActual === 'inicio'"
        @continue="handleWelcome"
        key="welcome"
      />

      <!-- VISTA 1: SELECCIÓN MODO DE JUEGO -->
      <GameModeSelect 
        v-else-if="vistaActual === 'modoJuego'"
        @selectMode="handleModeSelect"
        @back="backToWelcome"
        key="modeSelect"
      />

      <!-- VISTA 2: CREAR O UNIRSE A SALA -->
      <RoomActionSelect 
        v-else-if="vistaActual === 'salaEspera'"
        @selectAction="handleRoomAction"
        @back="backToModeSelect"
        key="roomAction"
      />

      <!-- VISTA 3: LLISTA DE SALES -->
      <RoomList 
        v-else-if="vistaActual === 'roomList'"
        :rooms="activeRooms"
        :player-name="nomJugador"
        @join-room="joinRoom"
          @notify="handleNotify"
        @create-room="goToCreateRoom"
        @back="backToRoomAction"
        key="roomList"
      />

      <!-- VISTA 4: CREAR SALA -->
      <CreateRoom 
        v-else-if="vistaActual === 'createRoom'"
        :player-name="nomJugador"
        @create-room="createRoom"
          @notify="handleNotify"
        @go-to-room-list="vistaActual = 'roomList'"
        @back="backToRoomAction"
        key="createRoom"
      />

      <!-- VISTA 5: LOBBY -->
      <LobbyRoom 
        v-else-if="vistaActual === 'lobby'"
        :room-name="nomSala || 'Sala'"
        :players="jugadors"
        :room-config="currentRoomConfig || {}"
        :is-admin="isRoomAdmin"
        :current-player-id="communicationManager.getSocketId() || ''"
        @start-game="startGame"
        @leave-room="leaveRoom"
        @kick-player="kickPlayer"
        key="lobby"
      />

      <!-- VISTA 5: JOC -->
      <GameView 
        v-else-if="vistaActual === 'joc'"
        :players="jugadors"
        :tematica="currentRoomConfig?.theme || 'aleatori'"
        :timeLimit="(currentRoomConfig?.timeLimit || 3) * 60"
        :gameText="gameText"
        @back-to-lobby="vistaActual = 'lobby'"
        key="joc"
      />
      
    

    <!-- Diálogos personalizados -->
    <PasswordDialog 
      :isOpen="showPasswordDialog"
      @confirm="handlePasswordConfirm"
      @cancel="handlePasswordCancel"
    />

    <ConfirmDialog 
      :isOpen="showKickConfirmDialog"
      title="Expulsar jugador"
      :message="`Estàs segur que vols expulsar a ${pendingPlayerKick?.name}?`"
      @confirm="handleKickConfirm"
      @cancel="handleKickCancel"
    />
    <InfoDialog
      :isOpen="showInfoDialog"
      :title="currentMessage?.title"
      :message="currentMessage?.message || ''"
      :type="currentMessage?.type || 'info'"
      @close="closeInfoDialog"
    />
    <ToastContainer :toasts="toasts" @dismiss="removeToast" />
  </main>
</template>

<style scoped>
/* Transició de fosa entre vistes */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Contenidor principal */
.app-container {
  width: 100%;
  max-width: 900px;
  padding: 1rem 2rem;
  text-align: center;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
  color: #F021B9;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.8rem;
  filter: drop-shadow(0 0 20px #F021B9) drop-shadow(0 0 40px #F021B9);
  animation: glitch 3s infinite;
  position: relative;
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, -2px);
  }
}

.title-accent {
  color: #00F0FF;
}

/* --- Estils per a les Noves Vistes --- */
.vista-container {
  width: 100%;
  background: #1A2A4A;
  backdrop-filter: blur(10px);
  border: 2px solid #00F0FF;
  padding: 2.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.05);
}

.vista-title {
  font-size: 2rem;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
  color: #00F0FF;
  text-transform: uppercase;
  letter-spacing: 0.3rem;
  text-shadow: 0 0 10px #00F0FF, 0 0 20px #00F0FF;
}
.vista-subtitle {
  font-size: 1.1rem;
  color: #E0E0E0;
  margin-top: 0rem;
  margin-bottom: -0.5rem;
  font-family: 'Fira Code', monospace;
}
.sala-actual {
  color: #F021B9;
  font-weight: 600;
  background-color: rgba(240, 33, 185, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid #F021B9;
  box-shadow: 0 0 10px rgba(240, 33, 185, 0.3);
}

.form-grup {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 350px;
  margin-top: 1rem;
}

.input-nom {
  width: 100%;
  padding: 1rem;
  font-size: 1.2rem;
  font-family: 'Fira Code', monospace;
  text-align: center;
  background-color: rgba(10, 25, 47, 0.8);
  color: #00F0FF;
  border: 2px solid #00F0FF;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
}
.input-nom:focus {
  border-color: #F021B9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5), inset 0 0 10px rgba(240, 33, 185, 0.1);
  color: #F021B9;
}
.input-nom::placeholder {
  color: rgba(0, 240, 255, 0.5);
}

/* --- NOU: Estils Llista de Sales --- */
.sala-existent-container {
  width: 100%;
  max-width: 450px;
  border-top: 1px solid #333;
  padding-top: 1.5rem;
  margin-top: 1rem;
}
.sala-buida {
  color: #777;
  font-style: italic;
  margin-top: 1rem;
}
.llista-sales {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1rem;
  max-height: 150px;
  overflow-y: auto;
  padding: 5px;
}
.btn-sala {
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  background-color: rgba(255, 255, 255, 0.1);
  color: #f0f0f0;
  border: 1px solid #555;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-sala:hover {
  background-color: #42b883;
  color: #1a1a1a;
  border-color: #42b883;
  transform: translateY(-2px);
}
.crear-sala-container {
  width: 100%;
  max-width: 450px;
  border-top: 1px solid #333;
  padding-top: 1.5rem;
}
.form-grup-inline {
  flex-direction: row;
  max-width: 450px;
  gap: 0.75rem;
}
.form-grup-inline .input-nom {
  flex-grow: 1; /* L'input ocupa l'espai sobrant */
  text-align: left;
  padding-left: 1.2rem;
}
.btn-crear {
  flex-shrink: 0; /* Evita que el botó s'encongeixi */
  padding: 1rem 1.5rem;
}

/* --- Nuevos estilos para opciones --- */
.opciones-container {
  width: 100%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 1rem;
}

.btn-unirse-sala {
  width: 100%;
  padding: 1.25rem 2rem;
  font-size: 1.3rem;
}

.separador {
  text-align: center;
  position: relative;
  margin: 0.5rem 0;
}

.separador span {
  background: rgba(0, 0, 0, 0.2);
  padding: 0 1rem;
  color: #888;
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

.separador::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: #333;
}

.crear-sala-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
/* --- Fi Estils Llista de Sales --- */

/* Botons */
.btn-primary {
  font-size: 1.2rem;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #F021B9 0%, #FF00FF 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5), 0 4px 15px rgba(240, 33, 185, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  position: relative;
  overflow: hidden;
}
.btn-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}
.btn-primary:hover::before {
  left: 100%;
}
.btn-primary:hover {
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.8), 0 6px 20px rgba(240, 33, 185, 0.5);
  transform: translateY(-2px);
}

.btn-secondary {
  font-size: 1rem;
  font-weight: 500;
  font-family: 'Share Tech Mono', monospace;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #00F0FF;
  border: 2px solid #00F0FF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 1.5rem;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}
.btn-secondary:hover {
  background-color: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.5);
  border-color: #00F0FF;
}

.btn-començar {
  margin-top: 1rem;
  background-color: #3498db;
  box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);
}
.btn-començar:hover {
  background-color: #5dade2;
  box-shadow: 0 6px 20px rgba(52, 152, 219, 0.3);
}

/* Llista de jugadors */
.lobby-contingut {
  width: 100%;
  max-width: 450px;
  text-align: left;
  border-top: 1px solid #333;
  border-bottom: 1px solid #333;
  padding: 1.5rem 0;
}
.lobby-contingut h3 {
  text-align: center;
  margin-bottom: 1rem;
  color: #ccc;
  font-weight: 500;
}
.llista-jugadors {
  list-style: none;
  padding: 0;
  max-height: 200px;
  overflow-y: auto;
}
.llista-jugadors li {
  font-size: 1.1rem;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  color: #f0f0f0;
}
.room-label {
  font-style: italic;
  color: #aaa;
  font-size: 0.9rem;
}
.tu-label {
  font-style: italic;
  color: #42b883;
  font-weight: 600;
}
</style>

