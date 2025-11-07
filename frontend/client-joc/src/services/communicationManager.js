import { io } from 'socket.io-client';

// Como el código se ejecuta en el NAVEGADOR (no en el contenedor),
// siempre debemos usar localhost ya que el navegador no puede resolver "backend"
// El puerto 8080 está mapeado a localhost:8080 por Docker
const SOCKET_URL = 'http://localhost:8080';
console.log('🔌 Socket.IO conectando a:', SOCKET_URL);
const socket = io(SOCKET_URL, { autoConnect: false });

// Variable para controlar si ya se registró el listener de connect
let connectListenerRegistered = false;

const communicationManager = {
  
  // Conectar solo para escuchar la lista de salas (sin unirse)
  connectToListen(callback) {
    console.log('🔌 connectToListen llamado. Socket conectado:', socket.connected);
    
    // Registrar el listener de 'connect' solo una vez
    if (!connectListenerRegistered) {
      socket.on('connect', () => {
        console.log('✅ Conectado al servidor (modo escucha) con ID:', socket.id);
        this.requestRoomList();
      });
      connectListenerRegistered = true;
    }
    
    if (!socket.connected) {
      socket.connect();
      if (callback) {
        // Esperar a que se conecte antes de llamar al callback
        socket.once('connect', callback);
      }
    } else {
      console.log('✅ Ya conectado, solicitando lista...');
      this.requestRoomList();
      if (callback) callback();
    }
  },

  // Evento para crear una sala
  createRoom(roomConfig) {
    console.log('📤 Creando sala con configuración:', roomConfig);
    console.log('🔌 Socket conectado antes de crear sala:', socket.connected, 'ID:', socket.id);
    
    if (!socket.connected) {
      console.warn('⚠️ Socket no conectado, conectando antes de crear sala...');
      socket.connect();
      socket.once('connect', () => {
        console.log('✅ Conectado, ahora emitiendo createRoom');
        socket.emit('createRoom', roomConfig);
      });
    } else {
      socket.emit('createRoom', roomConfig);
    }
  },

  // Evento para unirse a una sala
  joinRoom(joinConfig) {
    console.log('📤 Uniéndose a sala:', joinConfig);
    socket.emit('joinRoom', joinConfig);
  },

  // Solicitar explícitamente la lista de salas
  requestRoomList() {
    console.log('📤 Solicitando lista de salas al servidor...');
    socket.emit('requestRoomList');
  },

  getSocketId() {
    return socket.id;
  },

  // --- Funciones para ESCOLTAR esdeveniments del servidor ---
  
  onUpdatePlayerList(callback) {
    socket.on('updatePlayerList', callback);
  },

  onUpdateRoomList(callback) {
    socket.on('updateRoomList', callback);
  },

  onRoomError(callback) {
    socket.on('roomError', callback);
  },

  onJoinedRoom(callback) {
    console.log('🎯 Registrando listener para joinedRoom');
    socket.on('joinedRoom', (data) => {
      console.log('📥 Evento joinedRoom recibido:', data);
      callback(data);
    });
  },

  onGameStarted(callback) {
    socket.on('gameStarted', callback);
  },
  
  // --- Fi de nous listeners ---

  disconnect() {
    socket.disconnect();
  },
  
  removeListener(eventName) {
    socket.off(eventName);
  },

  // Iniciar juego (solo admin)
  startGame() {
    socket.emit('startGame');
  },

  // Expulsar un jugador (solo admin)
  kickPlayer(playerId) {
    socket.emit('kickPlayer', playerId);
  },

  // Listener cuando el jugador es expulsado
  onKicked(callback) {
    socket.on('kicked', callback);
  },

  // --- EVENTOS MULTIJUGADOR EN JUEGO ---
  
  // Emitir progreso del jugador
  emitPlayerProgress(data) {
    socket.emit('playerProgress', data);
  },

  // Escuchar progreso de otros jugadores
  onPlayerProgress(callback) {
    socket.on('playerProgress', callback);
  },

  // Emitir tecla presionada
  emitPlayerKeyPress(data) {
    socket.emit('playerKeyPress', data);
  },

  // Escuchar teclas presionadas por otros jugadores
  onPlayerKeyPress(callback) {
    socket.on('playerKeyPress', callback);
  }
};

export default communicationManager;

