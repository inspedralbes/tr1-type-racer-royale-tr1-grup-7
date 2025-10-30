import { io } from 'socket.io-client';

// Permite configurar el backend vía variable de entorno de Vite en Docker
// Fallback a localhost:8080 para desarrollo fuera de Docker
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:8080';
const socket = io(SOCKET_URL, { autoConnect: false });

const communicationManager = {
  
  connect(playerName, roomName) {
    socket.connect();
    socket.on('connect', () => {
      console.log('Connectat al servidor amb ID:', socket.id);
      socket.emit('setPlayerName', { name: playerName, room: roomName });
    });
  },

  getSocketId() {
    return socket.id;
  },

  // --- Funcions per ESCOLTAR esdeveniments del servidor ---
  
  onUpdatePlayerList(callback) {
    socket.on('updatePlayerList', callback);
  },

  // --- NOU: Listeners per a la llista de sales ---
  onCurrentRooms(callback) {
    socket.on('currentRooms', callback);
  },

  onUpdateRoomList(callback) { // Ja existia, però ara sabem que rep la llista de sales
    socket.on('updateRoomList', callback);
  },
  // --- Fi de nous listeners ---

  disconnect() {
    socket.disconnect();
  },
  
  removeListener(eventName) {
    socket.off(eventName);
  }
};

export default communicationManager;

