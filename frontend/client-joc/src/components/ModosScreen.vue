<script setup>
import { defineEmits } from 'vue';
import { nombreUsuario, modoOscuro, t } from '../services/configStore.js';

const emit = defineEmits(['selectMode']);

const modosTraducciones = {
  es: {
    bienvenido: 'Bienvenid@',
    modoDeJuego: 'Modos de juego',
    solo: 'Solo',
    multijugador: 'Multijugador',
    modoSolo: 'Modo de Juego',
    modoMulti: 'Modo de Juego'
  },
  ca: {
    bienvenido: 'Benvingut@',
    modoDeJuego: 'Modes de joc',
    solo: 'Sol',
    multijugador: 'Multijugador',
    modoSolo: 'Mode de Joc',
    modoMulti: 'Mode de Joc'
  },
  en: {
    bienvenido: 'Welcome',
    modoDeJuego: 'Game modes',
    solo: 'Solo',
    multijugador: 'Multiplayer',
    modoSolo: 'Game Mode',
    modoMulti: 'Game Mode'
  }
};

function getTexto(key) {
  const idioma = localStorage.getItem('teclazo_config') 
    ? JSON.parse(localStorage.getItem('teclazo_config')).idioma || 'es'
    : 'es';
  return modosTraducciones[idioma]?.[key] || modosTraducciones.es[key];
}

function seleccionarModo(modo) {
  emit('selectMode', modo);
}
</script>

<template>
  <div class="modos-container" :class="{ 'modo-oscuro': modoOscuro }">
    <div class="modos-content">
      <h1 class="modos-titulo">{{ getTexto('bienvenido') }} {{ nombreUsuario || 'Jugador' }}</h1>
      <h2 class="modos-subtitulo">{{ getTexto('modoDeJuego') }}</h2>
      
      <div class="modos-grid">
        <!-- Modo Solo -->
        <button @click="seleccionarModo('solo')" class="modo-card modo-solo">
          <div class="modo-icono">🎮</div>
          <h3 class="modo-nombre">{{ getTexto('modoSolo') }}</h3>
          <p class="modo-descripcion">{{ getTexto('solo') }}</p>
        </button>

        <!-- Modo Multijugador -->
        <button @click="seleccionarModo('multi')" class="modo-card modo-multi">
          <div class="modo-icono">👥</div>
          <h3 class="modo-nombre">{{ getTexto('modoMulti') }}</h3>
          <p class="modo-descripcion">{{ getTexto('multijugador') }}</p>
        </button>
      </div>

      <div class="modos-footer">
        <button @click="$emit('back')" class="btn-atras">
          ← {{ t('volver') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modos-container {
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

.modos-container.modo-oscuro {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.modos-container::before {
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

.modos-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.modos-titulo {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 900;
  color: #fff;
  text-align: center;
  margin: 0;
  text-shadow: 
    0 0 20px rgba(255, 255, 255, 0.5),
    0 5px 15px rgba(0, 0, 0, 0.3);
}

.modo-oscuro .modos-titulo {
  color: #f093fb;
  text-shadow: 
    0 0 20px rgba(240, 147, 251, 0.8),
    0 5px 15px rgba(0, 0, 0, 0.5);
}

.modos-subtitulo {
  font-size: clamp(1.2rem, 3vw, 1.8rem);
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin: 0;
  padding: 0.8rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 25px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.modo-oscuro .modos-subtitulo {
  background: rgba(30, 30, 30, 0.5);
  border-color: rgba(240, 147, 251, 0.3);
}

.modos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 700px;
  margin: 1rem 0;
}

.modo-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 30px;
  padding: 3rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.modo-oscuro .modo-card {
  background: rgba(30, 30, 30, 0.95);
  border-color: rgba(255, 255, 255, 0.1);
}

.modo-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.modo-card:hover::before {
  left: 100%;
}

.modo-card:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modo-solo {
  border-color: #FF69B4;
}

.modo-solo:hover {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.2), rgba(255, 255, 255, 0.95));
  border-color: #FF1493;
  box-shadow: 0 20px 60px rgba(255, 20, 147, 0.4);
}

.modo-oscuro .modo-solo:hover {
  background: linear-gradient(135deg, rgba(255, 105, 180, 0.3), rgba(30, 30, 30, 0.95));
}

.modo-multi {
  border-color: #667eea;
}

.modo-multi:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(255, 255, 255, 0.95));
  border-color: #764ba2;
  box-shadow: 0 20px 60px rgba(118, 75, 162, 0.4);
}

.modo-oscuro .modo-multi:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(30, 30, 30, 0.95));
}

.modo-icono {
  font-size: 4rem;
  margin-bottom: 0.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.modo-nombre {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.modo-oscuro .modo-nombre {
  color: #f093fb;
}

.modo-descripcion {
  font-size: 1.2rem;
  font-weight: 600;
  color: #666;
  margin: 0;
  text-align: center;
  padding: 0.5rem 1.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 20px;
}

.modo-oscuro .modo-descripcion {
  color: #bbb;
  background: rgba(255, 255, 255, 0.1);
}

.modos-footer {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.btn-atras {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
}

.btn-atras:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.modo-oscuro .btn-atras {
  background: rgba(30, 30, 30, 0.5);
  border-color: rgba(240, 147, 251, 0.3);
}

.modo-oscuro .btn-atras:hover {
  background: rgba(40, 40, 40, 0.7);
  border-color: rgba(240, 147, 251, 0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .modos-grid {
    grid-template-columns: 1fr;
    max-width: 350px;
  }
  
  .modo-card {
    padding: 2.5rem 1.5rem;
  }
}
</style>
