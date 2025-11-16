import { io } from "socket.io-client";

// Determina dinàmicament l'URL del servidor de Socket.IO per suportar producció i dev.
// Prioritza:
// 1) window.__SOCKET_URL__ injectat (si existeix)
// 2) import.meta.env.VITE_SOCKET_URL (en temps de build amb Vite)
// 3) El mateix origen (ideal darrere d'un proxy Nginx que redirigeixi /socket.io cap al backend)
function resolveSocketUrl() {
  try {
    if (typeof window !== "undefined") {
      const injected = window.__SOCKET_URL__;
      if (injected && typeof injected === "string") return injected;
      const viteEnv = typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SOCKET_URL;
      if (viteEnv && typeof viteEnv === "string") return viteEnv;
      // Per defecte, mateix origen
      return `${window.location.protocol}//${window.location.host}`;
    }
  } catch (e) {
    // fallback silenciós
  }
  // Fallback final (dev local clàssic)
  return "http://localhost:8080";
}

const SOCKET_URL = resolveSocketUrl();
console.log("🔌 Socket.IO conectando a:", SOCKET_URL);
const socket = io(SOCKET_URL, { autoConnect: false });

// Variable para controlar si ya se registró el listener de connect
let connectListenerRegistered = false;

const communicationManager = {
  // Conectar solo para escuchar la lista de salas (sin unirse)
  connectToListen(callback) {
    console.log(
      "🔌 connectToListen llamado. Socket conectado:",
      socket.connected
    );

    // Registrar el listener de 'connect' solo una vez
    if (!connectListenerRegistered) {
      socket.on("connect", () => {
        console.log(
          "✅ Conectado al servidor (modo escucha) con ID:",
          socket.id
        );
        this.requestRoomList();
      });
      connectListenerRegistered = true;
    }

    if (!socket.connected) {
      socket.connect();
      if (callback) {
        // Esperar a que se conecte antes de llamar al callback
        socket.once("connect", callback);
      }
    } else {
      console.log("✅ Ya conectado, solicitando lista...");
      this.requestRoomList();
      if (callback) callback();
    }
  },

  // Evento para crear una sala
  createRoom(roomConfig) {
    console.log("📤 Creando sala con configuración:", roomConfig);
    console.log(
      "🔌 Socket conectado antes de crear sala:",
      socket.connected,
      "ID:",
      socket.id
    );

    if (!socket.connected) {
      console.warn("⚠️ Socket no conectado, conectando antes de crear sala...");
      socket.connect();
      socket.once("connect", () => {
        console.log("✅ Conectado, ahora emitiendo createRoom");
        socket.emit("createRoom", roomConfig);
      });
    } else {
      socket.emit("createRoom", roomConfig);
    }
  },

  // Evento para unirse a una sala
  joinRoom(joinConfig) {
    console.log("📤 Uniéndose a sala:", joinConfig);
    socket.emit("joinRoom", joinConfig);
  },

  // Solicitar explícitamente la lista de salas
  requestRoomList() {
    console.log("📤 Solicitando lista de salas al servidor...");
    socket.emit("requestRoomList");
  },

  getSocketId() {
    return socket.id;
  },

  // --- Funciones para ESCOLTAR esdeveniments del servidor ---

  onUpdatePlayerList(callback) {
    socket.on("updatePlayerList", callback);
  },

  onUpdateRoomList(callback) {
    socket.on("updateRoomList", callback);
  },

  onRoomError(callback) {
    socket.on("roomError", callback);
  },

  onJoinedRoom(callback) {
    console.log("🎯 Registrando listener para joinedRoom");
    socket.on("joinedRoom", (data) => {
      console.log("📥 Evento joinedRoom recibido:", data);
      callback(data);
    });
  },

  onGameStarted(callback) {
    socket.on("gameStarted", callback);
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
    socket.emit("startGame");
  },

  // Expulsar un jugador (solo admin)
  kickPlayer(playerId) {
    socket.emit("kickPlayer", playerId);
  },

  // Listener cuando el jugador es expulsado
  onKicked(callback) {
    socket.on("kicked", callback);
  },

  // --- EVENTOS MULTIJUGADOR EN JUEGO ---

  // Emitir progreso del jugador
  emitPlayerProgress(data) {
    socket.emit("playerProgress", data);
  },

  // Escuchar progreso de otros jugadores
  onPlayerProgress(callback) {
    socket.on("playerProgress", callback);
  },

  // Emitir tecla presionada
  emitPlayerKeyPress(data) {
    socket.emit('keyPressed', data);
  },

  // Escuchar teclas presionadas por otros jugadores
  onPlayerKeyPress(callback) {
    socket.on('keyPressed', callback);
  },

  // --- EVENTOS DE RACHA ---

  // Emitir racha del jugador
  emitPlayerStreak(data) {
    socket.emit("playerStreak", data);
  },

  // Escuchar rachas de otros jugadores
  onPlayerStreak(callback) {
    socket.on("playerStreak", callback);
  },

  // Solicitar nueva ronda al servidor
  requestNextRound() {
    console.log("📤 Solicitando nueva ronda al servidor...");
    socket.emit('requestNextRound');
  },

  // Escuchar nueva ronda con nuevo texto del servidor
  onNextRound(callback) {
    socket.on('nextRound', callback);
  }
};

export default communicationManager;
