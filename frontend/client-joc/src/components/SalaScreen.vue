<script setup>
import { defineProps, defineEmits } from 'vue';
import { nombreUsuario, modoOscuro } from '../services/configStore.js';
import NavButtons from './NavButtons.vue';
import audioManager from '../services/audioManager.js';

const props = defineProps({
  modo: String
});

const emit = defineEmits(['back', 'home', 'config', 'jugar']);

const modosTraducciones = {
  es: {
    solo: 'Modo Solo',
    multi: 'Modo Multijugador',
    esperando: 'Esperando jugadores...',
    crear: 'Crear',
    unirse: 'Unirse'
  },
  ca: {
    solo: 'Mode Sol',
    multi: 'Mode Multijugador',
    esperando: 'Esperant jugadors...',
    crear: 'Crear',
    unirse: 'Unir-se'
  },
  en: {
    solo: 'Solo Mode',
    multi: 'Multiplayer Mode',
    esperando: 'Waiting for players...',
    crear: 'Create',
    unirse: 'Join'
  }
};

function getTexto(key) {
  const idioma = localStorage.getItem('teclazo_config') 
    ? JSON.parse(localStorage.getItem('teclazo_config')).idioma || 'es'
    : 'es';
  return modosTraducciones[idioma]?.[key] || modosTraducciones.es[key];
}

function getModoTexto() {
  return props.modo === 'solo' ? getTexto('solo') : getTexto('multi');
}

function handleCrear() {
  audioManager.playButtonClick();
  if (props.modo === 'solo') {
    emit('jugar');
  } else {
    // Lógica para crear sala multijugador
    console.log('Crear sala multijugador');
  }
}

function handleUnirse() {
  audioManager.playButtonClick();
  if (props.modo === 'solo') {
    emit('jugar');
  } else {
    // Lógica para unirse a sala multijugador
    console.log('Unirse a sala multijugador');
  }
}
</script>

<template>
  <div class="sala-container" :class="{ 'modo-oscuro': modoOscuro }">
    <NavButtons 
      :mostrar-volver="true"
      :mostrar-home="true"
      :mostrar-config="true"
      @back="emit('back')"
      @home="emit('home')"
      @config="emit('config')"
    />
    
    <div class="sala-content">
      <div class="sala-header">
        <h1 class="sala-titulo">{{ nombreUsuario }}</h1>
        <h2 class="sala-modo">{{ getModoTexto() }}</h2>
      </div>

      <div class="sala-botones">
        <button class="btn-accion btn-crear" @click="handleCrear">
          {{ getTexto('crear') }}
        </button>
        
        <button class="btn-accion btn-unirse" @click="handleUnirse">
          {{ getTexto('unirse') }}
        </button>
      </div>

      <p class="sala-estado">{{ getTexto('esperando') }}</p>
    </div>
  </div>
</template>

<style scoped>
.sala-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  margin: 0;
  padding: 2rem;
  transition: background 0.5s ease;
  box-sizing: border-box;
}

.sala-container.modo-oscuro {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.sala-container::before {
  content: '';
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveGrid 20s linear infinite;
  opacity: 0.3;
}

@keyframes moveGrid {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.sala-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
}

.sala-header {
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.sala-titulo {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  color: #fff;
  margin: 0;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 5px 15px rgba(0, 0, 0, 0.3);
  word-wrap: break-word;
}

.modo-oscuro .sala-titulo {
  color: #f093fb;
  text-shadow: 
    0 0 20px rgba(240, 147, 251, 0.8),
    0 5px 15px rgba(0, 0, 0, 0.5);
}

.sala-modo {
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  display: inline-block;
}

.modo-oscuro .sala-modo {
  background: rgba(30, 30, 30, 0.5);
  border-color: rgba(240, 147, 251, 0.3);
}

.sala-botones {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 500px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-accion {
  flex: 1;
  min-width: 200px;
  padding: 2rem 3rem;
  font-size: clamp(1.3rem, 3vw, 1.8rem);
  font-weight: 800;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.btn-accion::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-accion:hover::before {
  left: 100%;
}

.btn-crear {
  background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
}

.btn-crear:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(255, 20, 147, 0.5);
}

.btn-unirse {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-unirse:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 15px 40px rgba(118, 75, 162, 0.5);
}

.btn-accion:active {
  transform: translateY(-2px) scale(1.02);
}

.sala-estado {
  font-size: clamp(1rem, 2.5vw, 1.3rem);
  color: rgba(255, 255, 255, 0.8);
  font-style: italic;
  margin: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.modo-oscuro .sala-estado {
  color: rgba(240, 147, 251, 0.8);
}

/* Responsive */
@media (max-width: 768px) {
  .sala-botones {
    flex-direction: column;
  }
  
  .btn-accion {
    min-width: auto;
    width: 100%;
  }
}
</style>
