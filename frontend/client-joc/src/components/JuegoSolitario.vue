<script setup>
import { ref, computed, onMounted, onUnmounted, defineEmits, watch, nextTick } from 'vue';
import { nombreUsuario, modoOscuro, t } from '../services/configStore.js';
import NavButtons from './NavButtons.vue';
import audioManager from '../services/audioManager.js';

const emit = defineEmits(['back', 'home', 'config']);

// Referencia al elemento de entrada de texto
const entradaTextoRef = ref(null);

// Estado del juego
const cuentaRegresiva = ref(3);
const mostrarCuentaRegresiva = ref(true);
const juegoIniciado = ref(false);
const juegoTerminado = ref(false);
const tiempo = ref(0);
const errores = ref(0);
const intervalId = ref(null);

// Textos aleatorios sobre diferentes temas (sin espacios al final)
const textosDisponibles = [
  'La programación es el arte de resolver problemas mediante código. Cada línea que escribimos es una solución creativa a un desafío único',
  'El desarrollo web evoluciona constantemente. Las tecnologías modernas nos permiten crear experiencias increíbles para los usuarios',
  'La inteligencia artificial está transformando nuestro mundo. Los algoritmos aprenden y mejoran con cada iteración del proceso',
  'Los datos son el nuevo petróleo del siglo veintiuno. El análisis correcto puede revelar patrones ocultos y oportunidades únicas',
  'La ciberseguridad es fundamental en la era digital. Proteger la información es responsabilidad de todos los desarrolladores',
  'El trabajo en equipo hace la diferencia. La colaboración entre programadores genera soluciones más robustas y eficientes',
  'La nube ha revolucionado la infraestructura tecnológica. Ahora podemos escalar servicios de forma instantánea y global',
  'Los videojuegos combinan arte y tecnología. Cada frame renderizado es el resultado de complejos cálculos matemáticos',
  'El código abierto impulsa la innovación mundial. Miles de desarrolladores colaboran para mejorar herramientas que todos usamos'
];

const textoCompleto = ref('');
const textoEscrito = ref('');
const letraActualIndex = ref(0);
const letrasEstado = ref([]);
const teclaPresionada = ref('');

// Teclado layout
const tecladoFilas = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

// Generar texto aleatorio
function generarTexto() {
  const indiceAleatorio = Math.floor(Math.random() * textosDisponibles.length);
  textoCompleto.value = textosDisponibles[indiceAleatorio];
  letrasEstado.value = Array(textoCompleto.value.length).fill('pending');
}

// Iniciar cuenta regresiva
function iniciarCuentaRegresiva() {
  const intervalo = setInterval(() => {
    cuentaRegresiva.value--;
    
    // Reproducir beep de cuenta regresiva
    if (cuentaRegresiva.value > 0) {
      audioManager.playCountdownBeep();
    }
    
    if (cuentaRegresiva.value === 0) {
      clearInterval(intervalo);
      mostrarCuentaRegresiva.value = false;
      iniciarJuego();
    }
  }, 1000);
}

// Iniciar juego
function iniciarJuego() {
  juegoIniciado.value = true;
  juegoTerminado.value = false;
  tiempo.value = 0;
  
  // Reproducir sonido de inicio
  audioManager.playGameStart();
  
  // Iniciar contador de tiempo
  intervalId.value = setInterval(() => {
    tiempo.value++;
  }, 1000);
}

// Manejar entrada de teclado
function manejarTecla(event) {
  if (!juegoIniciado.value || juegoTerminado.value) return;
  
  const tecla = event.key;
  
  // Mostrar tecla presionada
  if (tecla.length === 1) {
    teclaPresionada.value = tecla.toUpperCase();
    setTimeout(() => {
      teclaPresionada.value = '';
    }, 200);
  }
  
  // Ignorar teclas especiales excepto backspace y espacio
  if (tecla.length > 1 && tecla !== 'Backspace') return;
  
  if (tecla === 'Backspace') {
    if (letraActualIndex.value > 0) {
      letraActualIndex.value--;
      textoEscrito.value = textoEscrito.value.slice(0, -1);
      // No resetear el estado, mantenerlo para ver el historial
    }
    return;
  }
  
  // Verificar si la letra/espacio es correcta
  const caracterEsperado = textoCompleto.value[letraActualIndex.value];
  const esCorrecta = tecla === caracterEsperado;
  
  if (!esCorrecta) {
    errores.value++;
    // Reproducir sonido de error
    audioManager.playErrorSound();
    
    // Si ya estaba incorrecta y se corrige, marcar como corregida
    if (letrasEstado.value[letraActualIndex.value] === 'incorrect') {
      letrasEstado.value[letraActualIndex.value] = 'corrected';
    } else {
      letrasEstado.value[letraActualIndex.value] = 'incorrect';
    }
  } else {
    // Reproducir sonido de éxito
    audioManager.playSuccessSound();
    
    // Si está corrigiendo una letra incorrecta
    if (letrasEstado.value[letraActualIndex.value] === 'incorrect') {
      letrasEstado.value[letraActualIndex.value] = 'corrected';
    } else {
      letrasEstado.value[letraActualIndex.value] = 'correct';
    }
  }
  
  textoEscrito.value += tecla;
  letraActualIndex.value++;
  
  // Reproducir sonido de tecla
  audioManager.playKeySound();
  
  // Si terminó todo el texto, verificar automáticamente e inmediatamente
  if (letraActualIndex.value >= textoCompleto.value.length) {
    // Verificar que NO haya letras incorrectas (rojas)
    const sinErrores = letrasEstado.value.every(estado => estado === 'correct' || estado === 'corrected');
    
    if (sinErrores) {
      // Terminar inmediatamente si todo está en verde o amarillo (sin rojas)
      terminarJuego();
    }
    // Si hay letras incorrectas (rojas), no terminar (debe corregir)
  }
}

// Terminar juego
function terminarJuego() {
  juegoTerminado.value = true;
  
  // Reproducir sonido de victoria
  audioManager.playVictorySound();
  
  if (intervalId.value) {
    clearInterval(intervalId.value);
    intervalId.value = null;
  }
}

// Reiniciar juego
function reiniciarJuego() {
  // Reproducir sonido de botón
  audioManager.playButtonClick();
  
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
  
  cuentaRegresiva.value = 3;
  mostrarCuentaRegresiva.value = true;
  juegoIniciado.value = false;
  juegoTerminado.value = false;
  tiempo.value = 0;
  errores.value = 0;
  letraActualIndex.value = 0;
  textoEscrito.value = '';
  teclaPresionada.value = '';
  
  generarTexto();
  iniciarCuentaRegresiva();
}

// Formatear tiempo
const tiempoFormateado = computed(() => {
  const minutos = Math.floor(tiempo.value / 60);
  const segundos = tiempo.value % 60;
  return `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
});

// Calcular palabras por minuto
const palabrasPorMinuto = computed(() => {
  if (tiempo.value === 0) return 0;
  const palabrasEscritas = textoEscrito.value.trim().split(/\s+/).length;
  return Math.round((palabrasEscritas / tiempo.value) * 60);
});

// Calcular precisión
const precision = computed(() => {
  if (letraActualIndex.value === 0) return 100;
  return Math.round(((letraActualIndex.value - errores.value) / letraActualIndex.value) * 100);
});

// Progreso
const progreso = computed(() => {
  if (textoCompleto.value.length === 0) return 0;
  return (letraActualIndex.value / textoCompleto.value.length) * 100;
});

// Watch para hacer scroll automático cuando cambia el texto escrito
watch(textoEscrito, () => {
  nextTick(() => {
    if (entradaTextoRef.value) {
      entradaTextoRef.value.scrollLeft = entradaTextoRef.value.scrollWidth;
    }
  });
});

// Lifecycle hooks
onMounted(() => {
  generarTexto();
  iniciarCuentaRegresiva();
  document.addEventListener('keydown', manejarTecla);
});

onUnmounted(() => {
  document.removeEventListener('keydown', manejarTecla);
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});
</script>

<template>
  <div class="juego-container" :class="{ 'modo-oscuro': modoOscuro }">
    <NavButtons 
      :mostrar-volver="true"
      :mostrar-home="true"
      :mostrar-config="true"
      @back="emit('back')"
      @home="emit('home')"
      @config="emit('config')"
    />

    <!-- Cuenta regresiva -->
    <div v-if="mostrarCuentaRegresiva" class="cuenta-regresiva">
      <div class="numero-grande">{{ cuentaRegresiva }}</div>
    </div>

    <!-- Juego principal -->
    <div v-else class="juego-content">
      <!-- Barra superior con estadísticas -->
      <div class="stats-bar">
        <div class="stat">
          <span class="stat-icon">⏱️</span>
          <span class="stat-value">{{ tiempoFormateado }}</span>
        </div>
        
        <div class="stat">
          <span class="stat-icon">❌</span>
          <span class="stat-value">{{ errores }}</span>
        </div>
        
        <div class="stat">
          <span class="stat-icon">📊</span>
          <span class="stat-value">{{ precision }}%</span>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div class="barra-progreso">
        <div class="barra-fill" :style="{ width: `${progreso}%` }"></div>
      </div>

      <!-- Área de texto -->
      <div class="texto-container">
        <div class="texto-display">
          <span
            v-for="(letra, index) in textoCompleto"
            :key="index"
            class="letra"
            :class="{
              'letra-correcta': letrasEstado[index] === 'correct',
              'letra-incorrecta': letrasEstado[index] === 'incorrect',
              'letra-corregida': letrasEstado[index] === 'corrected',
              'letra-actual': index === letraActualIndex
            }"
          >
            {{ letra }}
          </span>
        </div>
      </div>

      <!-- Línea de entrada -->
      <div class="linea-entrada">
        <div class="entrada-label">{{ t('escrito') || 'Escribiendo' }}:</div>
        <div class="entrada-texto" ref="entradaTextoRef">{{ textoEscrito }}</div>
        <div class="cursor"></div>
      </div>

      <!-- Teclado virtual -->
      <div class="teclado">
        <div v-for="(fila, index) in tecladoFilas" :key="index" class="teclado-fila">
          <button
            v-for="tecla in fila"
            :key="tecla"
            class="tecla"
            :class="{ 
              'tecla-activa': teclaPresionada === tecla,
              'tecla-objetivo': textoCompleto[letraActualIndex] && 
                              textoCompleto[letraActualIndex].toUpperCase() === tecla
            }"
          >
            {{ tecla }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de resultados -->
    <div v-if="juegoTerminado" class="modal-resultados">
      <div class="modal-content">
        <h2>{{ t('juegoTerminado') || '¡Juego Terminado!' }}</h2>
        <div class="resultados">
          <div class="resultado-item">
            <span class="resultado-label">{{ t('tiempoTotal') || 'Tiempo total' }}:</span>
            <span class="resultado-valor">{{ tiempoFormateado }}</span>
          </div>
          <div class="resultado-item">
            <span class="resultado-label">{{ t('errores') || 'Errores' }}:</span>
            <span class="resultado-valor">{{ errores }}</span>
          </div>
          <div class="resultado-item">
            <span class="resultado-label">{{ t('precision') || 'Precisión' }}:</span>
            <span class="resultado-valor">{{ precision }}%</span>
          </div>
          <div class="resultado-item destacado">
            <span class="resultado-label">{{ t('palabrasPorMinuto') || 'Palabras por minuto' }}:</span>
            <span class="resultado-valor">{{ palabrasPorMinuto }} WPM</span>
          </div>
        </div>
        <button @click="reiniciarJuego" class="btn-nuevo">
          {{ t('nuevoJuego') || 'Nuevo Juego' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.juego-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

.juego-container.modo-oscuro {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

/* Cuenta regresiva */
.cuenta-regresiva {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.numero-grande {
  font-size: 20rem;
  font-weight: 900;
  color: white;
  text-shadow: 
    0 0 40px rgba(255, 255, 255, 0.8),
    0 0 80px rgba(255, 105, 180, 0.6),
    0 10px 30px rgba(0, 0, 0, 0.5);
  animation: pulso 1s ease-in-out;
}

@keyframes pulso {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Contenido del juego */
.juego-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 75px 1.5rem 1.5rem;
  box-sizing: border-box;
  gap: 0.8rem;
}

/* Barra de estadísticas */
.stats-bar {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.2rem;
  color: white;
  font-weight: 700;
}

.stat-icon {
  font-size: 1.5rem;
}

/* Barra de progreso */
.barra-progreso {
  width: 100%;
  height: 8px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.barra-fill {
  height: 100%;
  background: linear-gradient(90deg, #FF1493, #FF69B4);
  transition: width 0.3s ease;
  border-radius: 10px;
}

/* Área de texto */
.texto-container {
  flex: 1;
  display: flex;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: 0;
  scroll-behavior: smooth;
}

.texto-container::-webkit-scrollbar {
  width: 8px;
}

.texto-container::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.texto-container::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.texto-container::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

.modo-oscuro .texto-container {
  background: rgba(30, 30, 30, 0.95);
}

.modo-oscuro .texto-container::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.modo-oscuro .texto-container::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
}

.modo-oscuro .texto-container::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.texto-display {
  font-size: clamp(1.5rem, 2.5vw, 2rem);
  font-weight: 600;
  font-family: 'Courier New', monospace;
  line-height: 1.8;
  color: #666;
  word-wrap: break-word;
  width: 100%;
}

.modo-oscuro .texto-display {
  color: #aaa;
}

.letra {
  transition: all 0.2s ease;
}

.letra-correcta {
  color: #2ecc71;
  font-weight: 700;
}

.letra-incorrecta {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.3);
  padding: 0 2px;
  border-radius: 3px;
  font-weight: 700;
}

.letra-corregida {
  color: #f39c12;
  background: rgba(243, 156, 18, 0.2);
  padding: 0 2px;
  border-radius: 3px;
  font-weight: 700;
}

.letra-actual {
  background: #3498db;
  color: white;
  padding: 0 2px;
  border-radius: 3px;
  animation: blink 1s infinite;
  font-weight: 700;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.5; }
}

/* Línea de entrada */
.linea-entrada {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  min-height: 50px;
  flex-shrink: 0;
}

.modo-oscuro .linea-entrada {
  background: rgba(30, 30, 30, 0.95);
}

.entrada-label {
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  flex-shrink: 0;
}

.modo-oscuro .entrada-label {
  color: #aaa;
}

.entrada-texto {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: 'Courier New', monospace;
  color: #333;
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  scroll-behavior: smooth;
  scrollbar-width: thin;
}

.entrada-texto::-webkit-scrollbar {
  height: 4px;
}

.entrada-texto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.entrada-texto::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
}

.entrada-texto::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.5);
}

.modo-oscuro .entrada-texto {
  color: #f093fb;
}

.modo-oscuro .entrada-texto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.modo-oscuro .entrada-texto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
}

.modo-oscuro .entrada-texto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.cursor {
  width: 3px;
  height: 25px;
  background: #3498db;
  animation: blink 1s infinite;
  flex-shrink: 0;
}

/* Teclado virtual */
.teclado {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  align-items: center;
  padding: 0.8rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.teclado-fila {
  display: flex;
  gap: 0.4rem;
}

.tecla {
  width: clamp(35px, 4vw, 45px);
  height: clamp(35px, 4vw, 45px);
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  font-weight: 700;
  color: #333;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modo-oscuro .tecla {
  background: rgba(60, 60, 60, 0.9);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

.tecla-activa {
  background: #3498db !important;
  color: white !important;
  transform: scale(0.95);
  box-shadow: 0 0 20px rgba(52, 152, 219, 0.6);
}

.tecla-objetivo {
  background: linear-gradient(135deg, #FF1493, #FF69B4) !important;
  color: white !important;
  animation: pulse-objetivo 1s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(255, 20, 147, 0.6);
}

@keyframes pulse-objetivo {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Modal de resultados */
.modal-resultados {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 2rem;
}

.modal-content {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 240, 240, 0.95));
  border-radius: 30px;
  padding: 3rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-content h2 {
  color: #333;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  text-align: center;
}

.resultados {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.resultado-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  border: 2px solid rgba(0, 0, 0, 0.1);
}

.resultado-item.destacado {
  background: linear-gradient(135deg, #FF1493, #FF69B4);
  border: none;
}

.resultado-item.destacado .resultado-label,
.resultado-item.destacado .resultado-valor {
  color: white;
}

.resultado-label {
  color: #666;
  font-weight: 500;
}

.resultado-valor {
  color: #333;
  font-weight: 700;
  font-size: 1.2rem;
}

.btn-nuevo {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.btn-nuevo:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .juego-content {
    padding: 70px 0.8rem 0.8rem;
    gap: 0.6rem;
  }
  
  .texto-display {
    font-size: clamp(1.2rem, 2vw, 1.5rem);
    line-height: 1.6;
  }
  
  .tecla {
    width: clamp(28px, 3.5vw, 35px);
    height: clamp(28px, 3.5vw, 35px);
    font-size: clamp(0.8rem, 1.2vw, 0.9rem);
  }
  
  .stat {
    font-size: 1rem;
    gap: 0.3rem;
  }
  
  .stat-icon {
    font-size: 1.2rem;
  }
  
  .entrada-texto {
    font-size: 1.2rem;
  }
  
  .entrada-label {
    font-size: 0.9rem;
  }
  
  .numero-grande {
    font-size: 12rem;
  }
  
  .texto-container {
    padding: 1rem;
  }
  
  .stats-bar {
    gap: 1rem;
    padding: 0.6rem;
  }
  
  .teclado {
    padding: 0.6rem;
    gap: 0.3rem;
  }
  
  .teclado-fila {
    gap: 0.3rem;
  }
}
</style>
