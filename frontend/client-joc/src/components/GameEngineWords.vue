<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from "vue";
import communicationManager from "../services/communicationManager.js";

// Banco de palabras para el modo de juego
const WORD_BANK = [
  // Tecnología (originales)
  "javascript",
  "python",
  "typescript",
  "react",
  "vue",
  "angular",
  "node",
  "express",
  "database",
  "server",
  "client",
  "frontend",
  "backend",
  "fullstack",
  "component",
  "function",
  "variable",
  "constant",
  "array",
  "object",
  "string",
  "number",
  "boolean",
  "async",
  "await",
  "promise",
  "callback",
  "event",
  "handler",
  "method",
  "class",
  "interface",
  "type",
  "generic",
  "module",
  "import",
  "export",
  "default",
  "return",
  "void",
  "null",
  "undefined",
  "algorithm",
  "structure",
  "pattern",
  "design",
  "architecture",
  "framework",
  "library",
  "package",
  "dependency",
  "version",
  "deploy",
  "build",
  "compile",
  "debug",
  "console",
  "terminal",
  "command",
  "script",
  "syntax",
  "semantic",

  // Animales
  "perro",
  "gato",
  "elefante",
  "tigre",
  "leon",
  "jirafa",
  "cebra",
  "rinoceronte",
  "hipopotamo",
  "cocodrilo",
  "serpiente",
  "aguila",
  "halcon",
  "buho",
  "loro",
  "pinguino",
  "delfin",
  "ballena",
  "tiburon",
  "pulpo",
  "medusa",
  "tortuga",
  "rana",
  "sapo",
  "lagarto",
  "camaleon",
  "iguana",
  "koala",
  "panda",
  "oso",
  "lobo",
  "zorro",
  "conejo",
  "liebre",
  "ardilla",
  "castor",
  "nutria",
  "foca",
  "morsa",
  "canguro",
  "koala",
  "ornitorrinco",
  "murcielago",
  "raton",
  "rata",
  "hamster",
  "cobaya",
  "caballo",
  "burro",
  "cebra",
  "vaca",
  "toro",
  "cerdo",
  "oveja",
  "cabra",
  "gallina",
  "gallo",
  "pato",
  "ganso",
  "pavo",
  "paloma",
  "canario",
  "jilguero",
  "golondrina",
  "cuervo",
  "grulla",
  "flamenco",
  "cisne",

  // Comida
  "pizza",
  "hamburguesa",
  "pasta",
  "arroz",
  "paella",
  "sushi",
  "taco",
  "burrito",
  "enchilada",
  "quesadilla",
  "empanada",
  "croqueta",
  "tortilla",
  "bocadillo",
  "sandwich",
  "ensalada",
  "sopa",
  "gazpacho",
  "salmorejo",
  "pan",
  "queso",
  "jamon",
  "chorizo",
  "salchichon",
  "morcilla",
  "patata",
  "tomate",
  "lechuga",
  "cebolla",
  "ajo",
  "zanahoria",
  "pepino",
  "pimiento",
  "berenjena",
  "calabacin",
  "espinaca",
  "brocoli",
  "coliflor",
  "repollo",
  "col",
  "guisante",
  "judia",
  "lenteja",
  "garbanzo",
  "alubia",
  "manzana",
  "pera",
  "platano",
  "naranja",
  "mandarina",
  "limon",
  "pomelo",
  "uva",
  "fresa",
  "frambuesa",
  "arandano",
  "cereza",
  "melocoton",
  "albaricoque",
  "ciruela",
  "kiwi",
  "mango",
  "papaya",
  "piña",
  "sandia",
  "melon",
  "chocolate",
  "caramelo",
  "galleta",
  "tarta",
  "pastel",
  "helado",
  "flan",
  "natillas",
  "yogur",
  "leche",
  "cafe",
  "te",

  // Objetos cotidianos
  "mesa",
  "silla",
  "sofa",
  "cama",
  "armario",
  "estanteria",
  "lampara",
  "espejo",
  "ventana",
  "puerta",
  "llave",
  "cerradura",
  "cortina",
  "alfombra",
  "cojin",
  "almohada",
  "manta",
  "sabana",
  "toalla",
  "jabon",
  "champu",
  "cepillo",
  "peine",
  "tijeras",
  "pinza",
  "alicate",
  "martillo",
  "destornillador",
  "llave",
  "clavo",
  "tornillo",
  "tuerca",
  "cable",
  "enchufe",
  "interruptor",
  "bombilla",
  "vela",
  "cerilla",
  "mechero",
  "paraguas",
  "reloj",
  "calendario",
  "agenda",
  "libreta",
  "lapiz",
  "boligrafo",
  "rotulador",
  "goma",
  "sacapuntas",
  "regla",
  "compas",
  "libro",
  "revista",
  "periodico",
  "carta",
  "sobre",
  "sello",
  "paquete",
  "caja",
  "bolsa",
  "mochila",
  "maleta",
  "cartera",
  "monedero",
  "gafas",
  "reloj",
  "anillo",
  "collar",
  "pulsera",
  "pendiente",
  "sombrero",
  "gorra",
  "bufanda",
  "guante",

  // Ropa
  "camisa",
  "camiseta",
  "pantalon",
  "vaqueros",
  "falda",
  "vestido",
  "chaqueta",
  "abrigo",
  "jersey",
  "sudadera",
  "chaleco",
  "corbata",
  "pajarita",
  "cinturon",
  "zapato",
  "zapatilla",
  "bota",
  "sandalia",
  "calcetin",
  "media",
  "pijama",
  "bañador",
  "bikini",
  "ropa",
  "traje",
  "uniforme",
  "delantal",
  "bata",

  // Naturaleza
  "arbol",
  "flor",
  "rosa",
  "margarita",
  "tulipan",
  "girasol",
  "orquidea",
  "lirio",
  "jazmin",
  "violeta",
  "clavel",
  "petunia",
  "hoja",
  "rama",
  "tronco",
  "raiz",
  "semilla",
  "fruto",
  "bosque",
  "selva",
  "pradera",
  "campo",
  "montana",
  "colina",
  "valle",
  "rio",
  "lago",
  "mar",
  "ocean",
  "playa",
  "isla",
  "desierto",
  "oasis",
  "cueva",
  "roca",
  "piedra",
  "arena",
  "tierra",
  "barro",
  "nube",
  "lluvia",
  "nieve",
  "granizo",
  "viento",
  "tormenta",
  "rayo",
  "trueno",
  "arcoiris",
  "sol",
  "luna",
  "estrella",
  "planeta",
  "cometa",
  "galaxia",
  "universo",
  "cielo",

  // Deportes
  "futbol",
  "baloncesto",
  "tenis",
  "voleibol",
  "balonmano",
  "rugby",
  "beisbol",
  "hockey",
  "golf",
  "natacion",
  "atletismo",
  "gimnasia",
  "esgrima",
  "boxeo",
  "karate",
  "judo",
  "taekwondo",
  "ciclismo",
  "esqui",
  "snowboard",
  "surf",
  "skateboard",
  "escalada",
  "alpinismo",
  "senderismo",
  "running",
  "yoga",
  "pilates",
  "crossfit",
  "pesas",
  "balon",
  "raqueta",
  "red",
  "porteria",

  // Profesiones
  "medico",
  "enfermera",
  "dentista",
  "farmaceutico",
  "veterinario",
  "profesor",
  "maestro",
  "abogado",
  "juez",
  "policia",
  "bombero",
  "soldado",
  "piloto",
  "azafata",
  "marinero",
  "capitan",
  "ingeniero",
  "arquitecto",
  "constructor",
  "carpintero",
  "fontanero",
  "electricista",
  "mecanico",
  "pintor",
  "escultor",
  "musico",
  "cantante",
  "actor",
  "bailarin",
  "escritor",
  "periodista",
  "fotografo",
  "cocinero",
  "camarero",
  "panadero",
  "pastelero",
  "carnicero",
  "pescadero",
  "frutero",
  "tendero",
  "cajero",
  "contador",
  "secretario",
  "recepcionista",

  // Transportes
  "coche",
  "autobus",
  "camion",
  "moto",
  "bicicleta",
  "patinete",
  "tren",
  "metro",
  "tranvia",
  "avion",
  "helicoptero",
  "barco",
  "lancha",
  "yate",
  "velero",
  "canoa",
  "kayak",
  "submarino",
  "cohete",
  "nave",
  "taxi",
  "ambulancia",
  "policia",

  // Lugares
  "casa",
  "piso",
  "apartamento",
  "chalet",
  "mansion",
  "castillo",
  "palacio",
  "iglesia",
  "catedral",
  "mezquita",
  "templo",
  "sinagoga",
  "escuela",
  "colegio",
  "universidad",
  "biblioteca",
  "museo",
  "teatro",
  "cine",
  "circo",
  "estadio",
  "parque",
  "jardin",
  "zoo",
  "acuario",
  "hospital",
  "clinica",
  "farmacia",
  "supermercado",
  "tienda",
  "mercado",
  "restaurante",
  "cafeteria",
  "bar",
  "pub",
  "discoteca",
  "hotel",
  "hostal",
  "camping",
  "playa",
  "puerto",
  "aeropuerto",
  "estacion",
  "oficina",
  "fabrica",
  "taller",
  "garaje",
  "parking",
  "banco",

  // Emociones y conceptos
  "feliz",
  "triste",
  "alegre",
  "enfadado",
  "sorprendido",
  "asustado",
  "nervioso",
  "tranquilo",
  "calmado",
  "emocionado",
  "aburrido",
  "cansado",
  "energico",
  "fuerte",
  "debil",
  "rapido",
  "lento",
  "grande",
  "pequeño",
  "alto",
  "bajo",
  "gordo",
  "delgado",
  "bonito",
  "feo",
  "nuevo",
  "viejo",
  "moderno",
  "antiguo",
  "limpio",
  "sucio",
  "ordenado",
  "desordenado",
  "facil",
  "dificil",
  "simple",
  "complejo",
  "claro",
  "oscuro",
  "brillante",
  "opaco",
  "caliente",
  "frio",
  "templado",
  "helado",
  "tibio",
  "dulce",
  "salado",
  "amargo",
  "agrio",
  "picante",

  // Colores
  "rojo",
  "azul",
  "verde",
  "amarillo",
  "naranja",
  "morado",
  "rosa",
  "marron",
  "negro",
  "blanco",
  "gris",
  "dorado",
  "plateado",
  "turquesa",
  "violeta",

  // Números y tiempo
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "veinte",
  "treinta",
  "cien",
  "mil",
  "millon",
  "primero",
  "segundo",
  "tercero",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
  "primavera",
  "verano",
  "otoño",
  "invierno",
  "mañana",
  "tarde",
  "noche",
  "mediodia",
  "medianoche",
  "amanecer",
  "atardecer",
  "hora",
  "minuto",
  "segundo",
  "dia",
  "semana",
  "mes",
  "año",
  "siglo",
  "pasado",
  "presente",
  "futuro",
];

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
  gameWords: {
    type: Array,
    default: null,
  },
  isRoomAdmin: {
    type: Boolean,
    default: false,
  },
});

// Estado del juego
const errors = ref(0);
const totalErrors = ref(0);
const currentWord = ref("");
const currentWordIndex = ref(0);
const wordsCompleted = ref(0);
const userInput = ref("");
const timeRemaining = ref(props.timeLimit);
const typingInputRef = ref(null);
const wordList = ref([]);

// Cuenta atrás y visibilidad del contenido
const showCountdown = ref(true);
const countdownNumber = ref(5);
const showContent = ref(false);
const gameFinished = ref(false);
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

// --- SISTEMA DE RACHAS ---
const currentStreak = ref(0); // Racha actual del jugador local
const showStreakPopup = ref(false);
const streakPlayerName = ref("");
const streakCount = ref(0);
let streakPopupTimer = null;

// Función para generar una palabra aleatoria
const generateRandomWord = () => {
  const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
  return WORD_BANK[randomIndex];
};

// Inicializar el juego cuando se monta el componente
onMounted(async () => {
  console.log("🎮 Componente montado");
  console.log("🎮 Props gameWords:", props.gameWords);
  initializeGame();
  initializePlayersState();
  setupMultiplayerListeners();
  // Iniciar countdown automáticamente
  console.log("🎮 Iniciando countdown...");
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
    color: p.color, // Añadir el color del jugador
    wordsCompleted: 0,
    wpm: 0,
    errors: 0,
    isTyping: false,
    lastKey: null,
    streak: 0,
    hasStreak: false,
  }));

  // Log para debug
  console.log("👥 Jugadores inicializados:", playersState.value);
  console.log("🔑 Mi socket ID:", communicationManager.getSocketId?.());
};

// Inicializar el juego
const initializeGame = () => {
  console.log("🎮 Inicializando juego de palabras...");

  // Si hay palabras del servidor, usarlas. Si no, generar aleatoriamente
  if (props.gameWords && props.gameWords.length > 0) {
    wordList.value = [...props.gameWords];
    currentWordIndex.value = 0;
    currentWord.value = wordList.value[0];
    console.log(
      "🎮 Usando palabras sincronizadas del servidor:",
      wordList.value.length,
      "palabras"
    );
    console.log("🎮 Primera palabra:", currentWord.value);
  } else {
    // Fallback: generar palabra aleatoria
    currentWord.value = generateRandomWord();
    console.log("🎮 Modo fallback - palabra aleatoria");
    console.log("🎮 Primera palabra:", currentWord.value);
  }

  userInput.value = "";
  errors.value = 0;
  totalErrors.value = 0;
  wordsCompleted.value = 0;

  // Inicializar estados por carácter para la primera palabra
  charStatuses.value = Array.from(
    { length: currentWord.value.length },
    () => "pending"
  );
  everIncorrect.value = Array.from(
    { length: currentWord.value.length },
    () => false
  );
};

// Iniciar cuenta atrás y mostrar contenido al finalizar
const startCountdown = () => {
  console.log("⏱️ Iniciando countdown...");
  showCountdown.value = true;
  showContent.value = false;
  countdownNumber.value = 5;
  if (countdownTimer) clearInterval(countdownTimer);

  countdownTimer = setInterval(async () => {
    if (countdownNumber.value > 1) {
      countdownNumber.value -= 1;
      console.log("⏱️ Countdown:", countdownNumber.value);
    } else {
      console.log("⏱️ Countdown terminado, iniciando juego...");
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
        console.log("✅ Input enfocado");
      } catch (e) {
        console.error("❌ Error al enfocar input:", e);
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
      console.log("⏱️ Tiempo terminado!");
      finishGame();
    }
  }, 1000);
};

// Finalizar el juego y mostrar resultados
const finishGame = () => {
  gameFinished.value = true;
  showContent.value = false;
  
  // Emitir progreso final
  emitProgress();
  
  console.log("🏁 Juego finalizado!");
  console.log("📊 Resultados finales:", {
    jugadores: playersState.value,
    miProgreso: {
      palabras: wordsCompleted.value,
      errores: errors.value,
      wpm: calculateWPM()
    }
  });
};

// Actualizar estados por carácter a partir del texto tipeado
const updateStatuses = (typed) => {
  const expected = currentWord.value;
  let currentErrors = 0;

  for (let i = 0; i < expected.length; i++) {
    if (i < typed.length) {
      if (typed[i] === expected[i]) {
        charStatuses.value[i] = everIncorrect.value[i]
          ? "corrected"
          : "correct";
      } else {
        charStatuses.value[i] = "incorrect";

        if (!everIncorrect.value[i]) {
          totalErrors.value++;
          everIncorrect.value[i] = true;

          // Resetear racha cuando se comete un error
          if (currentStreak.value > 0) {
            console.log("❌ Error! Racha perdida:", currentStreak.value);
            currentStreak.value = 0;
            emitStreakUpdate(0);
          }
        }
        currentErrors++;
      }
    } else {
      charStatuses.value[i] = "pending";
    }
  }

  errors.value = totalErrors.value;
};

// Avanzar a la siguiente palabra
const nextWord = () => {
  wordsCompleted.value++;

  // Verificar si la palabra se completó sin errores (racha)
  const wordHadErrors = everIncorrect.value.some((error) => error === true);

  if (!wordHadErrors) {
    // Incrementar racha
    currentStreak.value++;
    console.log("🔥 Racha actual:", currentStreak.value);

    // Mostrar popup en rachas específicas: 3, 10, 20, 30, 40...
    const shouldShowPopup =
      currentStreak.value === 3 ||
      (currentStreak.value >= 10 && currentStreak.value % 10 === 0);

    if (shouldShowPopup) {
      const myPlayerId = communicationManager.getSocketId();
      const myPlayer = playersState.value.find((p) => p.id === myPlayerId);
      const myName = myPlayer?.name || "Tu";
      showStreakNotification(myPlayerId, myName, currentStreak.value);
    }

    // Emitir actualización de racha
    emitStreakUpdate(currentStreak.value);
  }

  console.log("✅ Palabra completada! Total:", wordsCompleted.value);

  // Si hay lista del servidor, iterar por ella. Si no, generar aleatoriamente
  if (wordList.value.length > 0) {
    currentWordIndex.value++;
    // Si llegamos al final de la lista, volver al inicio (loop infinito)
    if (currentWordIndex.value >= wordList.value.length) {
      currentWordIndex.value = 0;
      console.log(
        "🔄 Lista de palabras completada, reiniciando desde el principio"
      );
    }
    currentWord.value = wordList.value[currentWordIndex.value];
  } else {
    // Modo fallback: generar palabra aleatoria
    currentWord.value = generateRandomWord();
  }

  userInput.value = "";
  charStatuses.value = Array.from(
    { length: currentWord.value.length },
    () => "pending"
  );
  everIncorrect.value = Array.from(
    { length: currentWord.value.length },
    () => false
  );

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

// Mostrar notificación de racha
const showStreakNotification = (playerId, playerName, streak) => {
  streakPlayerName.value = playerName;
  streakCount.value = streak;
  showStreakPopup.value = true;

  console.log(`🔥 ${playerName} tiene una racha de ${streak}!`);

  // Ocultar el popup después de 3 segundos
  if (streakPopupTimer) clearTimeout(streakPopupTimer);
  streakPopupTimer = setTimeout(() => {
    showStreakPopup.value = false;
  }, 3000);
};

// Emitir actualización de racha al servidor
const emitStreakUpdate = (streak) => {
  const myPlayerId = communicationManager.getSocketId?.();
  communicationManager.emitPlayerStreak?.({
    playerId: myPlayerId,
    streak: streak,
  });

  // Actualizar estado local
  const myPlayerIndex = playersState.value.findIndex(
    (p) => p.id === myPlayerId
  );
  if (myPlayerIndex !== -1) {
    playersState.value[myPlayerIndex].streak = streak;
    playersState.value[myPlayerIndex].hasStreak = streak >= 3;
  }
};

// Actualizar racha de otros jugadores
const updatePlayerStreak = (data) => {
  const { playerId, streak } = data;
  const playerIndex = playersState.value.findIndex((p) => p.id === playerId);
  const myPlayerId = communicationManager.getSocketId?.();

  if (playerIndex !== -1) {
    playersState.value[playerIndex].streak = streak;
    playersState.value[playerIndex].hasStreak = streak >= 3;

    // Mostrar notificación solo en rachas específicas: 3, 10, 20, 30...
    const shouldShowPopup = streak === 3 || (streak >= 10 && streak % 10 === 0);

    if (playerId !== myPlayerId && shouldShowPopup) {
      const playerName = playersState.value[playerIndex].name;
      showStreakNotification(playerId, playerName, streak);
    }
  }
};

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

  // Escuchar actualizaciones de rachas
  communicationManager.onPlayerStreak?.((data) => {
    updatePlayerStreak(data);
  });
};

// Limpiar listeners al desmontar
const cleanupMultiplayerListeners = () => {
  communicationManager.removeListener?.("playerProgress");
  communicationManager.removeListener?.("playerKeyPress");
  communicationManager.removeListener?.("playerStreak");
};

// Actualizar progreso de un jugador
const updatePlayerProgress = (data) => {
  const {
    playerId,
    wordsCompleted: playerWords,
    progress,
    wpm,
    errors: playerErrors,
  } = data;
  const playerIndex = playersState.value.findIndex((p) => p.id === playerId);
  const myPlayerId = communicationManager.getSocketId?.();

  console.log("📥 Progreso recibido:");
  console.log("   - PlayerId recibido:", playerId);
  console.log("   - Palabras:", playerWords);
  console.log("   - Mi Socket ID:", myPlayerId);
  console.log("   - Índice encontrado:", playerIndex);
  console.log(
    "   - Jugadores en lista:",
    playersState.value.map((p) => ({ id: p.id, name: p.name }))
  );

  if (playerIndex === -1) {
    console.error("❌ No se encontró el jugador con ID:", playerId);
    return;
  }

  const newWordsCompleted =
    playerWords !== undefined ? playerWords : progress || 0;
  const currentWords = playersState.value[playerIndex].wordsCompleted || 0;
  const playerName = playersState.value[playerIndex].name;

  // Si es el jugador local, solo actualizar si viene un valor válido y mayor
  if (playerId === myPlayerId) {
    // Solo actualizar si el valor del servidor es mayor que el local
    if (newWordsCompleted > currentWords) {
      console.log(
        `✅ Actualizando jugador LOCAL "${playerName}" (índice ${playerIndex}): ${currentWords} -> ${newWordsCompleted}`
      );
      playersState.value[playerIndex].wordsCompleted = newWordsCompleted;
    } else {
      console.log(
        `⏭️ Manteniendo valor local de "${playerName}": ${currentWords} (servidor: ${newWordsCompleted})`
      );
    }
  } else {
    // Para otros jugadores, actualizar si el valor es mayor o igual
    if (newWordsCompleted >= currentWords) {
      console.log(
        `📊 Actualizando jugador REMOTO "${playerName}" (índice ${playerIndex}): ${currentWords} -> ${newWordsCompleted}`
      );
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
        color: p.color, // Añadir el color del jugador
        wordsCompleted: 0,
        wpm: 0,
        errors: 0,
        isTyping: false,
        lastKey: null,
        streak: 0,
        hasStreak: false,
      });
    } else {
      // Actualizar nombre y color si cambiaron
      playersState.value[existingIndex].name = p.name;
      if (p.color) {
        playersState.value[existingIndex].color = p.color;
      }
    }
  });

  // Eliminar jugadores que ya no están
  playersState.value = playersState.value.filter((ps) =>
    playerList.some((p) => p.id === ps.id)
  );
};

// Computed: Jugadores ordenados por palabras completadas (mayor primero)
const sortedPlayers = computed(() => {
  return [...playersState.value].sort(
    (a, b) => b.wordsCompleted - a.wordsCompleted
  );
});

// Emitir progreso propio al servidor
const emitProgress = () => {
  const wpm = calculateWPM();
  const myPlayerId = communicationManager.getSocketId?.();

  const progressData = {
    playerId: myPlayerId,
    wordsCompleted: wordsCompleted.value,
    wpm,
    errors: errors.value,
  };

  console.log("📤 Emitiendo progreso:", progressData);
  communicationManager.emitPlayerProgress?.(progressData);

  // Actualizar también el estado local del jugador inmediatamente
  if (myPlayerId) {
    const myPlayerIndex = playersState.value.findIndex(
      (p) => p.id === myPlayerId
    );
    if (myPlayerIndex !== -1) {
      console.log(
        "🔄 Actualizando jugador local en índice:",
        myPlayerIndex,
        "ID:",
        myPlayerId,
        "Palabras:",
        wordsCompleted.value
      );
      playersState.value[myPlayerIndex].wordsCompleted = wordsCompleted.value;
      playersState.value[myPlayerIndex].wpm = wpm;
      playersState.value[myPlayerIndex].errors = errors.value;
    } else {
      console.warn(
        "⚠️ No se encontró el jugador local en playersState. Socket ID:",
        myPlayerId
      );
      console.warn(
        "⚠️ Jugadores disponibles:",
        playersState.value.map((p) => ({ id: p.id, name: p.name }))
      );
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

// Obtener el ganador (jugador con más palabras correctas)
const getWinner = () => {
  if (playersState.value.length === 0) return null;
  
  const winner = [...playersState.value].sort((a, b) => {
    // Ordenar por palabras completadas (descendente)
    if (b.wordsCompleted !== a.wordsCompleted) {
      return b.wordsCompleted - a.wordsCompleted;
    }
    // En caso de empate, ordenar por menos errores
    return a.errors - b.errors;
  })[0];
  
  return winner;
};

// Obtener resultados finales ordenados
const getFinalResults = () => {
  return [...playersState.value].sort((a, b) => {
    // Ordenar por palabras completadas (descendente)
    if (b.wordsCompleted !== a.wordsCompleted) {
      return b.wordsCompleted - a.wordsCompleted;
    }
    // En caso de empate, ordenar por menos errores
    return a.errors - b.errors;
  });
};

// Reiniciar el juego
const restartGame = () => {
  gameFinished.value = false;
  showContent.value = false;
  showCountdown.value = false;
  
  // Resetear estadísticas
  errors.value = 0;
  totalErrors.value = 0;
  wordsCompleted.value = 0;
  currentStreak.value = 0;
  
  // Reinicializar el juego
  initializeGame();
  
  // Reiniciar countdown
  startCountdown();
  
  console.log("🔄 Juego reiniciado");
};

// Salir al lobby
const exitToLobby = () => {
  emit('back-to-lobby');
};

// Verificar si el usuario actual es el admin/creador de la sala
const isRoomCreator = computed(() => {
  return props.isRoomAdmin;
});
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

    <!-- Popup de Racha -->
    <div v-if="showStreakPopup" class="streak-popup">
      <div class="streak-content">
        <div class="streak-flame">🔥</div>
        <div class="streak-text">
          <div class="streak-player">{{ streakPlayerName }}</div>
          <div class="streak-message">està en ratxa de {{ streakCount }}!</div>
        </div>
        <div class="streak-flame">🔥</div>
      </div>
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
                <div
                  class="player-avatar"
                  :style="{ backgroundColor: getPlayerColor(index) }"
                >
                  {{ player.name.charAt(0).toUpperCase() }}
                </div>
                <div class="player-info">
                  <div class="player-name">
                    {{ player.name }}
                    <span v-if="player.hasStreak" class="player-streak-icon">
                      🔥<span class="streak-number">{{ player.streak }}</span>
                    </span>
                  </div>
                  <div class="player-stats">
                    <span class="stat-wpm">{{ player.wpm || 0 }} WPM</span>
                  </div>
                </div>
              </div>
              <div class="player-bottom">
                <span class="player-words"
                  >{{ player.wordsCompleted || 0 }} paraules</span
                >
                <span class="player-errors"
                  >{{ player.errors || 0 }} errors</span
                >
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

    <!-- Pantalla de Resultados Finales -->
    <div v-if="gameFinished" class="results-overlay">
      <div class="results-container">
        <!-- Título y Ganador -->
        <div class="results-header">
          <div class="results-title">🏆 FINAL DEL JUEGO 🏆</div>
          <div class="winner-section" v-if="getWinner()">
            <div class="winner-label">GANADOR</div>
            <div class="winner-name">{{ getWinner().name }}</div>
            <div class="winner-stats">
              {{ getWinner().wordsCompleted }} paraules correctes
            </div>
          </div>
        </div>

        <!-- Tabla de Resultados -->
        <div class="results-table">
          <div class="table-header">
            <div class="header-pos">Pos</div>
            <div class="header-name">Jugador</div>
            <div class="header-words">Paraules</div>
            <div class="header-errors">Errors</div>
            <div class="header-wpm">WPM</div>
          </div>
          
          <div class="table-body">
            <div 
              v-for="(player, index) in getFinalResults()" 
              :key="player.id" 
              class="result-row"
              :class="{ 'winner-row': index === 0 }"
            >
              <div class="pos-cell">
                <span class="position-number">{{ index + 1 }}</span>
                <span v-if="index === 0" class="trophy-icon">👑</span>
              </div>
              <div class="name-cell">
                <div 
                  class="player-avatar-small"
                  :style="{ backgroundColor: getPlayerColor(index) }"
                >
                  {{ player.name.charAt(0).toUpperCase() }}
                </div>
                <span class="player-name-text">{{ player.name }}</span>
              </div>
              <div class="words-cell">{{ player.wordsCompleted || 0 }}</div>
              <div class="errors-cell">{{ player.errors || 0 }}</div>
              <div class="wpm-cell">{{ player.wpm || 0 }}</div>
            </div>
          </div>
        </div>

        <!-- Botones de Acción -->
        <div class="results-actions">
          <button 
            v-if="isRoomCreator" 
            @click="restartGame()" 
            class="btn-restart"
          >
            🔄 VOLVER A JUGAR
          </button>
          <button @click="exitToLobby()" class="btn-exit">
            🚪 SALIR AL LOBBY
          </button>
        </div>

        <!-- Mensaje informativo para jugadores que no son creadores -->
        <div v-if="!isRoomCreator" class="creator-only-message">
          <p>Solo el creador de la sala puede reiniciar el juego</p>
        </div>
      </div>
    </div>

    <!-- Botón flotante para volver al lobby -->
    <button @click="emit('back-to-lobby')" class="btn-back" v-if="!gameFinished">← Lobby</button>
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

/* ===== POPUP DE RACHA ===== */
.streak-popup {
  position: fixed;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  animation: streakSlideDown 0.4s ease-out;
}

@keyframes streakSlideDown {
  0% {
    transform: translate(-50%, -100%);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, 10%);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.streak-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(
    135deg,
    rgba(240, 33, 185, 0.95),
    rgba(255, 100, 0, 0.95)
  );
  padding: 1rem 2rem;
  border-radius: 15px;
  border: 3px solid #ffd700;
  box-shadow: 0 0 40px rgba(255, 215, 0, 0.8), 0 0 80px rgba(240, 33, 185, 0.6),
    inset 0 0 30px rgba(255, 255, 255, 0.2);
}

.streak-flame {
  font-size: 2.5rem;
  animation: flameFlicker 0.5s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 10px #ff6600);
}

@keyframes flameFlicker {
  0% {
    transform: scale(1) rotate(-5deg);
  }
  100% {
    transform: scale(1.1) rotate(5deg);
  }
}

.streak-text {
  text-align: center;
}

.streak-player {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 20px #ffd700, 0 0 40px #ff6600;
  font-family: "Fira Code", monospace;
  margin-bottom: 0.3rem;
}

.streak-message {
  font-size: 1rem;
  font-weight: 600;
  color: #ffd700;
  text-shadow: 0 0 15px #ff6600;
  font-family: "Share Tech Mono", monospace;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.game-view {
  position: relative;
  min-height: 100%;
  width: 100%;
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
  padding: 1rem;
  box-sizing: border-box;
  gap: 1rem;
  font-family: "Share Tech Mono", monospace;
}

/* ===== HEADER: Tiempo, Progreso, Errores ===== */
.game-header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 2rem;
  background: #1a2a4a;
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-radius: 12px;
  border: 2px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3),
    inset 0 0 10px rgba(0, 240, 255, 0.05);
  min-height: 80px;
}

.time-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 120px;
}

.time-label {
  font-size: 0.9rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: "Share Tech Mono", monospace;
}

.time-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f021b9;
  text-shadow: 0 0 10px #f021b9, 0 0 20px #f021b9;
  font-family: "Fira Code", monospace;
}

.words-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: center;
}

.words-label {
  font-size: 0.9rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: "Share Tech Mono", monospace;
}

.words-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #39ff14;
  text-shadow: 0 0 10px #39ff14, 0 0 20px #39ff14;
  font-family: "Fira Code", monospace;
}

.errors-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 120px;
}

.errors-label {
  font-size: 0.9rem;
  color: #00f0ff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: "Share Tech Mono", monospace;
}

.errors-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #ff0000;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  font-family: "Fira Code", monospace;
}

/* ===== CONTENT: Texto y Input ===== */
.game-content {
  flex: 1;
  display: flex;
  gap: 2rem;
  min-height: 0;
  overflow: hidden;
}

.game-content-wrapper {
  display: flex;
  width: 100%;
  gap: 2rem;
  align-items: stretch;
  flex: 1;
  min-height: 0;
}

/* === PANEL DE JUGADORES === */
.players-panel {
  flex: 0 0 350px;
  min-width: 300px;
  max-width: 400px;
  background: rgba(26, 42, 74, 0.85);
  backdrop-filter: blur(15px);
  border: 3px solid #39ff14;
  border-radius: 20px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 0 30px rgba(57, 255, 20, 0.5),
    inset 0 0 20px rgba(57, 255, 20, 0.1);
  overflow: hidden;
}

.panel-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #39ff14;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  margin: 0;
  text-shadow: 0 0 20px #39ff14, 0 0 30px #39ff14;
  font-family: "Share Tech Mono", monospace;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(57, 255, 20, 0.3);
}

.player-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;
  flex: 1;
}

.player-card {
  background: rgba(10, 25, 47, 0.7);
  border: 2px solid rgba(57, 255, 20, 0.4);
  border-radius: 15px;
  padding: 1.2rem 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(57, 255, 20, 0.2);
}

.player-card.is-typing {
  border-color: #f021b9;
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.6);
  animation: typingPulse 0.8s ease-in-out infinite alternate;
}

@keyframes typingPulse {
  0% {
    box-shadow: 0 0 25px rgba(240, 33, 185, 0.6);
  }
  100% {
    box-shadow: 0 0 35px rgba(240, 33, 185, 0.8);
  }
}

.player-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.player-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  font-family: "Fira Code", monospace;
}

.player-info {
  flex: 1;
}

.player-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #00f0ff;
  text-shadow: 0 0 10px #00f0ff;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
  font-family: "Fira Code", monospace;
}

.player-streak-icon {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1rem;
  animation: flameFlicker 1s ease-in-out infinite alternate;
}

.streak-number {
  font-size: 0.85rem;
  font-weight: 800;
  color: #ffd700;
  text-shadow: 0 0 8px #ff6600;
}

.player-stats {
  font-size: 1rem;
  color: #39ff14;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(57, 255, 20, 0.6);
  font-family: "Share Tech Mono", monospace;
}

.player-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-family: "Share Tech Mono", monospace;
}

.player-words {
  color: #00f0ff;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
}

.player-errors {
  color: #ff6666;
  font-weight: 600;
  text-shadow: 0 0 8px rgba(255, 102, 102, 0.6);
}

/* === ÁREA DE TEXTO PRINCIPAL === */
.text-area-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  min-height: 0;
}

.word-display {
  background: rgba(26, 42, 74, 0.85);
  backdrop-filter: blur(15px);
  padding: 3rem 2.5rem;
  border-radius: 25px;
  border: 3px solid #00f0ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 800px;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.4),
    inset 0 0 30px rgba(0, 240, 255, 0.1);
  gap: 3rem;
  min-height: 400px;
}

.current-word {
  font-size: 4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.3em;
  font-family: "Fira Code", monospace;
  text-align: center;
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.current-word span {
  display: inline-block;
  transition: color 0.15s ease, transform 0.15s ease;
}

.word-counter {
  font-size: 1.3rem;
  color: #39ff14;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-family: "Share Tech Mono", monospace;
  font-weight: 700;
  text-shadow: 0 0 15px #39ff14, 0 0 30px #39ff14;
  background: rgba(57, 255, 20, 0.1);
  padding: 1rem 1.5rem;
  border-radius: 15px;
  border: 2px solid rgba(57, 255, 20, 0.3);
}

.input-area {
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
}

.typing-input {
  width: 100%;
  max-width: 600px;
  min-width: 300px;
  padding: 1.5rem 2rem;
  font-size: 1.3rem;
  font-family: "Fira Code", monospace;
  font-weight: 600;
  background: rgba(10, 25, 47, 0.95);
  color: #00f0ff;
  border: 3px solid #00f0ff;
  border-radius: 20px;
  outline: none;
  transition: all 0.4s ease;
  margin: 0 auto;
  box-sizing: border-box;
  text-align: center;
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.4),
    inset 0 0 20px rgba(0, 240, 255, 0.1);
  letter-spacing: 0.1em;
}

.typing-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 40px rgba(240, 33, 185, 0.8),
    inset 0 0 25px rgba(240, 33, 185, 0.15);
  background: rgba(10, 25, 47, 1);
  color: #f021b9;
  transform: translateY(-3px);
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
  height: 250px;
}

.keyboard-visual {
  background: rgba(26, 42, 74, 0.9);
  backdrop-filter: blur(15px);
  padding: 1.5rem 2rem;
  border-radius: 25px;
  border: 3px solid #f021b9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1200px;
  width: 100%;
  box-shadow: 0 0 40px rgba(240, 33, 185, 0.5),
    inset 0 0 25px rgba(240, 33, 185, 0.1);
  margin: 0 auto;
  box-sizing: border-box;
  height: 100%;
}

.keyboard-row {
  display: flex;
  justify-content: center;
  gap: 0.8rem;
  flex: 1;
}

.key {
  min-width: 60px;
  height: 50px;
  flex: 1;
  max-width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #1a2a4a, #0f1a2f);
  border: 3px solid #00f0ff;
  border-radius: 15px;
  font-size: 1.2rem;
  font-weight: 700;
  color: #00f0ff;
  transition: all 0.2s ease;
  cursor: default;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.4),
    inset 0 0 10px rgba(0, 240, 255, 0.1);
  font-family: "Share Tech Mono", monospace;
  position: relative;
}

.key:hover {
  background: linear-gradient(145deg, #1f3557, #142135);
  border-color: #f021b9;
  transform: translateY(-5px);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.8);
  color: #f021b9;
}

/* Tecla presionada (efecto cuando el usuario pulsa una tecla física) */
.key.pressed {
  transform: translateY(4px) scale(0.95);
  background: linear-gradient(180deg, #f021b9, #ff00ff);
  color: #ffffff;
  box-shadow: 0 0 40px rgba(240, 33, 185, 1) inset,
    0 0 35px rgba(240, 33, 185, 0.9);
  border-color: #ffffff;
  text-shadow: 0 0 10px #ffffff;
}

.key.wide {
  flex: 3;
  min-width: 300px;
  max-width: none;
}
.key.backspace {
  flex: 1.5;
  min-width: 130px;
  font-size: 1.4rem;
}

/* Indicadores de otros jugadores en las teclas */
.key-player-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.8);
  z-index: 1;
}

/* Estados de los caracteres del texto */
.text-to-type span {
  display: inline;
  transition: all 0.3s ease;
}

.current-word span {
  display: inline-block;
  transition: all 0.3s ease;
  padding: 0.3rem 0.2rem;
  border-radius: 8px;
  margin: 0 0.2rem;
}

/* Correcto: color verde neón brillante */
.char-correct {
  color: #39ff14;
  text-shadow: 0 0 15px #39ff14, 0 0 30px #39ff14;
  background: rgba(57, 255, 20, 0.15);
  transform: scale(1.05);
}

/* Incorrecto: color rojo brillante con efecto de error */
.char-incorrect {
  color: #ff3366;
  text-shadow: 0 0 15px #ff3366, 0 0 30px #ff0000;
  background: rgba(255, 51, 102, 0.2);
  animation: errorShake 0.5s ease;
  transform: scale(1.1);
}

@keyframes errorShake {
  0%, 100% {
    transform: scale(1.1) translateX(0);
  }
  25% {
    transform: scale(1.1) translateX(-3px);
  }
  75% {
    transform: scale(1.1) translateX(3px);
  }
  50% {
    opacity: 0.5;
  }
}

/* Corregido: color amarillo-naranja neón brillante */
.char-corrected {
  color: #ffd700;
  text-shadow: 0 0 15px #ffd700, 0 0 30px #ffa500;
  background: rgba(255, 215, 0, 0.15);
  transform: scale(1.05);
  animation: correctedGlow 0.6s ease;
}

@keyframes correctedGlow {
  0% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
}

.btn-back {
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(26, 42, 74, 0.9);
  border: 2px solid #00f0ff;
  color: #00f0ff;
  padding: 1rem 1.5rem;
  border-radius: 15px;
  font-size: 1rem;
  font-family: 'Share Tech Mono', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.btn-back:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #f021b9;
  color: #f021b9;
  transform: translateX(-5px) scale(1.05);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.6);
}

/* === RESPONSIVE BREAKPOINTS PARA LAYOUT === */
@media (max-width: 1200px) {
  .game-content-wrapper {
    flex-direction: column;
    gap: 2rem;
  }
  
  .players-panel {
    flex: 0 0 auto;
    min-width: auto;
    max-width: none;
    width: 100%;
    max-height: 300px;
  }
  
  .player-list {
    flex-direction: row;
    overflow-x: auto;
    gap: 2rem;
  }
  
  .player-card {
    min-width: 250px;
    flex-shrink: 0;
  }
  
  .word-display {
    max-width: 1000px;
  }
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
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.player-streak-icon {
  font-size: 1rem;
  animation: streakPulse 1s ease-in-out infinite;
  filter: drop-shadow(0 0 5px #ff6600);
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.streak-number {
  font-size: 0.7rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 8px #ff6600, 0 0 12px #ffd700;
  font-family: "Fira Code", monospace;
}

@keyframes streakPulse {
  0%,
  100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px #ff6600);
  }
  50% {
    transform: scale(1.2);
    filter: drop-shadow(0 0 10px #ffd700);
  }
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

.player-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  font-family: "Fira Code", monospace;
  margin-top: 0.4rem;
}

.player-words {
  color: #39ff14;
  font-weight: 600;
  text-shadow: 0 0 5px #39ff14;
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
}

/* ===== PANTALLA DE RESULTADOS FINALES ===== */
.results-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(10, 25, 47, 0.95);
  z-index: 10000;
  backdrop-filter: blur(8px);
  animation: resultsSlideIn 0.6s ease-out;
  padding: 2rem;
  box-sizing: border-box;
}

@keyframes resultsSlideIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

.results-container {
  background: linear-gradient(135deg, rgba(26, 42, 74, 0.95), rgba(15, 30, 50, 0.95));
  border: 4px solid #f021b9;
  border-radius: 25px;
  padding: 3rem 2.5rem;
  box-shadow: 
    0 0 60px rgba(240, 33, 185, 0.8),
    inset 0 0 40px rgba(240, 33, 185, 0.1);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  animation: containerGlow 2s ease-in-out infinite alternate;
}

@keyframes containerGlow {
  0% {
    box-shadow: 
      0 0 60px rgba(240, 33, 185, 0.8),
      inset 0 0 40px rgba(240, 33, 185, 0.1);
  }
  100% {
    box-shadow: 
      0 0 80px rgba(240, 33, 185, 1),
      inset 0 0 50px rgba(240, 33, 185, 0.15);
  }
}

/* === HEADER DE RESULTADOS === */
.results-header {
  text-align: center;
}

.results-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #f021b9;
  text-shadow: 0 0 30px #f021b9, 0 0 60px #f021b9;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.2em;
  margin-bottom: 2rem;
  animation: titlePulse 1.5s ease-in-out infinite alternate;
}

@keyframes titlePulse {
  0% {
    text-shadow: 0 0 30px #f021b9, 0 0 60px #f021b9;
  }
  100% {
    text-shadow: 0 0 40px #f021b9, 0 0 80px #f021b9;
  }
}

.winner-section {
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.2), rgba(0, 240, 255, 0.2));
  border: 3px solid #39ff14;
  border-radius: 20px;
  padding: 2rem;
  margin-top: 1.5rem;
  box-shadow: 0 0 40px rgba(57, 255, 20, 0.6);
  animation: winnerGlow 1.8s ease-in-out infinite alternate;
}

@keyframes winnerGlow {
  0% {
    border-color: #39ff14;
    box-shadow: 0 0 40px rgba(57, 255, 20, 0.6);
  }
  100% {
    border-color: #00f0ff;
    box-shadow: 0 0 50px rgba(0, 240, 255, 0.8);
  }
}

.winner-label {
  font-size: 1.2rem;
  font-weight: 700;
  color: #39ff14;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  margin-bottom: 1rem;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 20px #39ff14;
}

.winner-name {
  font-size: 2rem;
  font-weight: 800;
  color: #00f0ff;
  text-shadow: 0 0 25px #00f0ff, 0 0 50px #00f0ff;
  font-family: "Fira Code", monospace;
  margin-bottom: 0.8rem;
}

.winner-stats {
  font-size: 1.3rem;
  font-weight: 600;
  color: #ffd700;
  text-shadow: 0 0 15px #ffd700;
  font-family: "Share Tech Mono", monospace;
}

/* === TABLA DE RESULTADOS === */
.results-table {
  background: rgba(10, 25, 47, 0.6);
  border: 2px solid #00f0ff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.4);
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px;
  gap: 1rem;
  background: linear-gradient(135deg, #f021b9, #00f0ff);
  padding: 1.2rem 1.5rem;
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
}

.table-body {
  display: flex;
  flex-direction: column;
}

.result-row {
  display: grid;
  grid-template-columns: 80px 1fr 100px 100px 100px;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  align-items: center;
  border-bottom: 1px solid rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
  font-family: "Fira Code", monospace;
}

.result-row:hover {
  background: rgba(0, 240, 255, 0.1);
  transform: translateX(8px);
}

.result-row.winner-row {
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.15), rgba(255, 215, 0, 0.15));
  border: 2px solid #ffd700;
  border-left: 6px solid #39ff14;
  margin: 0.5rem;
  border-radius: 10px;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
}

.pos-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: #f021b9;
  text-shadow: 0 0 10px #f021b9;
}

.position-number {
  font-size: 1.4rem;
}

.trophy-icon {
  font-size: 1.5rem;
  animation: crownSpin 2s ease-in-out infinite;
}

@keyframes crownSpin {
  0%, 100% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(15deg) scale(1.1); }
}

.name-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #00f0ff;
  text-shadow: 0 0 12px #00f0ff;
}

.player-avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.player-name-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.words-cell {
  font-size: 1.2rem;
  font-weight: 700;
  color: #39ff14;
  text-shadow: 0 0 10px #39ff14;
  text-align: center;
}

.errors-cell {
  font-size: 1.1rem;
  font-weight: 600;
  color: #ff6666;
  text-shadow: 0 0 8px #ff6666;
  text-align: center;
}

.wpm-cell {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 0 0 10px #ffd700;
  text-align: center;
}

/* === BOTONES DE ACCIÓN === */
.results-actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.btn-restart,
.btn-exit {
  padding: 1.2rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  border: 3px solid;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: "Share Tech Mono", monospace;
  position: relative;
  overflow: hidden;
  min-width: 200px;
}

.btn-restart {
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.2), rgba(0, 240, 255, 0.2));
  border-color: #39ff14;
  color: #39ff14;
  box-shadow: 0 0 25px rgba(57, 255, 20, 0.5);
}

.btn-restart:hover {
  background: linear-gradient(135deg, rgba(57, 255, 20, 0.4), rgba(0, 240, 255, 0.4));
  border-color: #00f0ff;
  color: #00f0ff;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.8);
  text-shadow: 0 0 15px #00f0ff;
}

.btn-exit {
  background: linear-gradient(135deg, rgba(240, 33, 185, 0.2), rgba(255, 100, 100, 0.2));
  border-color: #f021b9;
  color: #f021b9;
  box-shadow: 0 0 25px rgba(240, 33, 185, 0.5);
}

.btn-exit:hover {
  background: linear-gradient(135deg, rgba(240, 33, 185, 0.4), rgba(255, 100, 100, 0.4));
  border-color: #ff6464;
  color: #ff6464;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 0 40px rgba(255, 100, 100, 0.8);
  text-shadow: 0 0 15px #ff6464;
}

/* === RESPONSIVE PARA RESULTADOS === */
@media (max-width: 768px) {
  .results-overlay {
    padding: 1rem;
  }

  .results-container {
    padding: 2rem 1.5rem;
    gap: 2rem;
  }

  .results-title {
    font-size: 1.8rem;
  }

  .winner-name {
    font-size: 1.5rem;
  }

  .table-header,
  .result-row {
    grid-template-columns: 60px 1fr 70px 70px 70px;
    gap: 0.5rem;
    padding: 1rem;
    font-size: 0.9rem;
  }

  .results-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .btn-restart,
  .btn-exit {
    padding: 1rem 2rem;
    font-size: 1rem;
    min-width: auto;
  }
}

/* === MENSAJE INFORMATIVO === */
.creator-only-message {
  text-align: center;
  background: rgba(255, 165, 0, 0.1);
  border: 2px solid rgba(255, 165, 0, 0.4);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-top: 1rem;
  animation: messageGlow 2s ease-in-out infinite alternate;
}

.creator-only-message p {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #ffa500;
  text-shadow: 0 0 10px rgba(255, 165, 0, 0.6);
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.1em;
}

@keyframes messageGlow {
  0% {
    border-color: rgba(255, 165, 0, 0.4);
    box-shadow: 0 0 15px rgba(255, 165, 0, 0.3);
  }
  100% {
    border-color: rgba(255, 165, 0, 0.6);
    box-shadow: 0 0 25px rgba(255, 165, 0, 0.5);
  }
}
</style>
