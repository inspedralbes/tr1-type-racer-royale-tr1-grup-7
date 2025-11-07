import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier origen
  }
});

const PORT = 8080;

// Estructuras de datos para gestionar el estado
const players = {}; // Almacena información de cada jugador conectado
const activeRooms = {}; // Almacena las salas activas y sus detalles

console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);

// --- GENERADOR DE TEXTOS ---
const textosPerTematica = {
  informatica: [
    "La programació orientada a objectes és un paradigma fonamental en el desenvolupament de programari modern.",
    "Els algorismes de cerca i ordenació són essencials per optimitzar el rendiment de les aplicacions.",
  ],
  historia: [
    "La Revolució Francesa de mil set-cents vuitanta-nou va marcar un punt d'inflexió en la història europea.",
    "L'Imperi Romà va dominar la Mediterrània durant segles, deixant un llegat cultural i arquitectònic immens.",
  ],
  ciencia: [
    "La teoria de la relativitat d'Einstein va revolucionar la nostra comprensió de l'espai, el temps i la gravetat.",
    "El cicle de l'aigua és fonamental per mantenir la vida al planeta Terra mitjançant l'evaporació i la precipitació.",
  ],
  aleatori: [
    "Els gats són animals independents i curiosos que han estat companys dels humans durant milers d'anys.",
    "El cafè és una de les begudes més consumides al món i prové de les llavors torrades del cafeter.",
  ]
};

function generarTexto(tematica = 'aleatori', numFrases = 6) {
  const tematicaNormalizada = tematica.toLowerCase();
  const textos = textosPerTematica[tematicaNormalizada] || textosPerTematica.aleatori;
  
  const textosDisponibles = [...textos];
  const frasesSeleccionadas = [];
  
  for (let i = 0; i < Math.min(numFrases, textosDisponibles.length); i++) {
    const indexAleatori = Math.floor(Math.random() * textosDisponibles.length);
    frasesSeleccionadas.push(textosDisponibles[indexAleatori]);
    textosDisponibles.splice(indexAleatori, 1);
  }
  
  return frasesSeleccionadas.join(' ');
}

// --- FUNCIONES AUXILIARES ---

// Envía la lista de salas actualizada a todos los clientes
function broadcastRoomList() {
  const roomList = Object.values(activeRooms).map(room => ({
    name: room.name,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    isPrivate: room.isPrivate,
  }));
  console.log('📢 Broadcasting room list:', roomList);
  io.emit('updateRoomList', roomList);
}

// Envía la lista de jugadores de una sala específica a todos en esa sala
function broadcastPlayerList(roomName) {
  if (activeRooms[roomName]) {
    const playerList = activeRooms[roomName].players.map(id => players[id]);
    console.log(`📢 Broadcasting player list for room ${roomName}:`, playerList);
    io.to(roomName).emit('updatePlayerList', playerList);
  }
}

// --- LÓGICA DE CONEXIÓN DE SOCKET.IO ---

io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id}`);
  
  // Registrar jugador
  players[socket.id] = { id: socket.id, name: null, room: null };

  // Enviar la lista de salas actual al nuevo cliente
  socket.on('requestRoomList', () => {
    const roomList = Object.values(activeRooms).map(room => ({
      name: room.name,
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers,
      isPrivate: room.isPrivate,
    }));
    console.log(`📥 Enviando lista de salas a ${socket.id}:`, roomList);
    socket.emit('updateRoomList', roomList);
  });


  // Evento para crear una nueva sala
  socket.on('createRoom', (roomConfig) => {
    const { roomName, playerName, maxPlayers, isPrivate, password } = roomConfig;

    // Validar si la sala ya existe
    if (activeRooms[roomName]) {
      socket.emit('roomError', { message: `La sala "${roomName}" ya existe.` });
      return;
    }

    // Normalizar privacidad: si hay contraseña no vacía, la sala es privada
    const hasPassword = typeof password === 'string' ? password.trim().length > 0 : Boolean(password);
    const roomIsPrivate = Boolean(isPrivate) || hasPassword;

    // Crear la nueva sala
    activeRooms[roomName] = {
      name: roomName,
      players: [socket.id],
      maxPlayers: maxPlayers || 2,
      isPrivate: roomIsPrivate,
      password: hasPassword ? password : null,
      admin: socket.id,
      config: roomConfig,
    };

    // Asegurar que la configuración compartida refleja correctamente la privacidad
    activeRooms[roomName].config.isPrivate = roomIsPrivate;
    if (roomIsPrivate && hasPassword) {
      activeRooms[roomName].config.password = password;
    }

    // Actualizar datos del jugador
    players[socket.id].name = playerName;
    players[socket.id].room = roomName;
    players[socket.id].isAdmin = true;

    // Unir al jugador a la sala de Socket.IO
    socket.join(roomName);

    console.log(`✅ Sala "${roomName}" creada por ${playerName}.`);
    
    // Emitir confirmación al creador de la sala
    const confirmData = {
      roomConfig: activeRooms[roomName].config,
      isAdmin: true
    };
    console.log('📤 Enviando joinedRoom al creador:', socket.id, confirmData);
    socket.emit('joinedRoom', confirmData);
    
    // Notificar a todos sobre la nueva sala
    broadcastRoomList();
    // Notificar a los de la sala sobre el nuevo jugador
    broadcastPlayerList(roomName);
  });

  // Evento para unirse a una sala existente
  socket.on('joinRoom', (joinConfig) => {
    const { roomName, playerName, password } = joinConfig;

    // Validar si la sala existe
    if (!activeRooms[roomName]) {
      socket.emit('roomError', { message: `La sala "${roomName}" no existe.` });
      return;
    }

    const room = activeRooms[roomName];

    // Validar si la sala está llena
    if (room.players.length >= room.maxPlayers) {
      socket.emit('roomError', { message: `La sala "${roomName}" está llena.` });
      return;
    }

    // Validar contraseña si es sala privada
    if (room.isPrivate && room.password && room.password !== password) {
      socket.emit('roomError', { message: 'Contraseña incorrecta.' });
      return;
    }

    // Añadir jugador a la sala
    room.players.push(socket.id);

    // Actualizar datos del jugador
    players[socket.id].name = playerName;
    players[socket.id].room = roomName;
    players[socket.id].isAdmin = false;

    // Unir al jugador a la sala de Socket.IO
    socket.join(roomName);

    console.log(`✅ ${playerName} se unió a la sala "${roomName}".`);
    
    // Notificar éxito al jugador que se unió
    socket.emit('joinedRoom', { 
      roomName, 
      roomConfig: room.config,
      isAdmin: false 
    });

    // Actualizar lista de salas para todos (por si cambió el número de jugadores)
    broadcastRoomList();
    // Notificar a los de la sala sobre el nuevo jugador
    broadcastPlayerList(roomName);
  });

  // Cuando un usuari es desconnecta
  socket.on('disconnect', () => {
    console.log(`🔌 Usuario desconectado: ${socket.id}`);
    
    const player = players[socket.id];
    if (player && player.room) {
      const roomName = player.room;
      const room = activeRooms[roomName];

      if (room) {
        // Eliminar al jugador de la sala
        room.players = room.players.filter(playerId => playerId !== socket.id);
        console.log(`- Jugador ${player.name || socket.id} eliminado de la sala ${roomName}.`);

        // Si la sala queda vacía, eliminarla
        if (room.players.length === 0) {
          delete activeRooms[roomName];
          console.log(`🗑️ Sala "${roomName}" eliminada por estar vacía.`);
        } else {
          // Si el admin se va, nombrar a otro
          if (room.admin === socket.id) {
            room.admin = room.players[0];
            console.log(`👑 Nuevo admin para la sala "${roomName}": ${players[room.admin].name}`);
          }
          // Actualizar la lista de jugadores para los que quedan
          broadcastPlayerList(roomName);
        }
        
        // Actualizar la lista de salas para todos
        broadcastRoomList();
      }
    }

    // Eliminar al jugador del registro general
    delete players[socket.id];
  });

  // --- EVENTOS MULTIJUGADOR ---
  
  // Expulsar jugador (solo admin)
  socket.on('kickPlayer', (playerId) => {
    const admin = players[socket.id];
    const playerToKick = players[playerId];
    
    if (admin && admin.room && playerToKick && admin.room === playerToKick.room) {
      const room = activeRooms[admin.room];
      
      // Verificar que el que expulsa sea el admin
      if (room && room.admin === socket.id) {
        console.log(`👢 Admin ${admin.name} expulsa a ${playerToKick.name} de la sala "${admin.room}"`);
        
        // Notificar al jugador expulsado
        const socketToKick = io.sockets.sockets.get(playerId);
        if (socketToKick) {
          socketToKick.emit('kicked', { message: 'Has estat expulsat de la sala per l\'administrador' });
          socketToKick.disconnect(true);
        }
        
        // Eliminar al jugador de la sala
        room.players = room.players.filter(id => id !== playerId);
        delete players[playerId];
        
        // Actualizar listas
        broadcastPlayerList(admin.room);
        broadcastRoomList();
      }
    }
  });
  
  // Evento para iniciar el juego (solo admin)
  socket.on('startGame', () => {
    const player = players[socket.id];
    if (player && player.room) {
      const room = activeRooms[player.room];
      
      // Verificar que el jugador sea el admin
      if (room && room.admin === socket.id) {
        console.log(`🎮 Admin ${player.name} está iniciando el juego en la sala "${player.room}"`);
        
        // Generar el texto para todos basado en la temática
        const theme = room.config?.theme || 'aleatori';
        const gameText = generarTexto(theme, 6);
        
        console.log(`📝 Texto generado para la sala "${player.room}":`, gameText.substring(0, 50) + '...');
        
        // Emitir evento a todos los jugadores de la sala con el mismo texto
        io.to(player.room).emit('gameStarted', {
          roomConfig: room.config,
          gameText: gameText // NUEVO: El mismo texto para todos
        });
      }
    }
  });
  
  // Cuando un jugador envía su progreso
  socket.on('playerProgress', (data) => {
    const player = players[socket.id];
    if (player && player.room) {
      io.to(player.room).emit('playerProgress', {
        playerId: socket.id,
        playerName: player.name,
        progress: data.progress,
        wpm: data.wpm,
        errors: data.errors
      });
    }
  });
});

server.listen(PORT);

