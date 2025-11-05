<script setup>
import { defineEmits, ref } from 'vue';
import { nombreUsuario, idioma, modoOscuro, volumenSonido, guardarConfiguracion, t } from '../services/configStore.js';
import Notificacion from './Notificacion.vue';
import NavButtons from './NavButtons.vue';
import audioManager from '../services/audioManager.js';

const emit = defineEmits(['close', 'home']);

const idiomas = [
  { value: 'es', label: 'Español' },
  { value: 'ca', label: 'Català' },
  { value: 'en', label: 'English' }
];

const mostrarNotificacion = ref(false);
const mensajeNotificacion = ref('');

function guardarYCerrar() {
  audioManager.playButtonClick();
  guardarConfiguracion();
  mensajeNotificacion.value = t('configGuardada');
  mostrarNotificacion.value = true;
  
  // Reiniciar para mostrar la notificación de nuevo
  setTimeout(() => {
    mostrarNotificacion.value = false;
  }, 3100);
}

function handleClose() {
  audioManager.playButtonClick();
  emit('close');
}
</script>

<template>
  <div class="config-container" :class="{ 'modo-oscuro': modoOscuro }">
    <NavButtons 
      :mostrar-volver="true"
      :mostrar-home="true"
      :mostrar-config="false"
      @back="emit('close')"
      @home="emit('home')"
    />
    
    <Notificacion 
      v-if="mostrarNotificacion" 
      :mensaje="mensajeNotificacion" 
      tipo="success" 
    />
    
    <div class="config-content">
      <h1 class="config-titulo">{{ t('configuracion') }}</h1>
      
      <div class="config-form">
        <!-- Nombre de usuario -->
        <div class="config-item">
          <label class="config-label">
            <span class="label-icon">👤</span>
            {{ t('nombreUsuario') }}
          </label>
          <input 
            v-model="nombreUsuario"
            type="text" 
            :placeholder="t('tuNombre')"
            class="config-input"
          />
        </div>

        <!-- Idioma -->
        <div class="config-item">
          <label class="config-label">
            <span class="label-icon">🌐</span>
            {{ t('idioma') }}
          </label>
          <select v-model="idioma" class="config-select">
            <option v-for="lang in idiomas" :key="lang.value" :value="lang.value">
              {{ lang.label }}
            </option>
          </select>
        </div>

        <!-- Modo Oscuro -->
        <div class="config-item config-item-toggle">
          <label class="config-label">
            <span class="label-icon">{{ modoOscuro ? '🌙' : '☀️' }}</span>
            {{ t('modoOscuro') }}
          </label>
          <label class="toggle-switch">
            <input type="checkbox" v-model="modoOscuro">
            <span class="toggle-slider"></span>
          </label>
        </div>

        <!-- Volumen -->
        <div class="config-item">
          <label class="config-label">
            <span class="label-icon">🔊</span>
            {{ t('volumen') }}: {{ volumenSonido }}%
          </label>
          <input 
            v-model="volumenSonido"
            type="range" 
            min="0"
            max="100"
            class="config-range"
          />
        </div>
      </div>

      <div class="config-botones">
        <button @click="guardarYCerrar" class="btn-guardar">
          {{ t('guardar') }}
        </button>
        <button @click="handleClose" class="btn-volver">
          {{ t('volver') }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.config-container {
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
  transition: all 0.3s ease;
  box-sizing: border-box;
  max-width: 100vw;
}

.config-container.modo-oscuro {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.config-container::before {
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

.config-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 600px;
  height: calc(100vh - 4rem);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 30px;
  padding: 2.5rem;
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.3),
    0 0 100px rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-sizing: border-box;
  margin: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modo-oscuro .config-content {
  background: rgba(30, 30, 30, 0.95);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.config-titulo {
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 900;
  letter-spacing: 0.5rem;
  margin-bottom: 2rem;
  color: #764ba2;
  text-align: center;
  text-shadow: 
    0 0 20px rgba(118, 75, 162, 0.3),
    0 5px 15px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
}

.modo-oscuro .config-titulo {
  color: #f093fb;
  text-shadow: 
    0 0 20px rgba(240, 147, 251, 0.5),
    0 5px 15px rgba(0, 0, 0, 0.3);
}

.config-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  margin-bottom: 1.5rem;
  padding-right: 0.5rem;
}

.config-form::-webkit-scrollbar {
  width: 6px;
}

.config-form::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.config-form::-webkit-scrollbar-thumb {
  background: rgba(118, 75, 162, 0.5);
  border-radius: 10px;
}

.config-form::-webkit-scrollbar-thumb:hover {
  background: rgba(118, 75, 162, 0.7);
}

.modo-oscuro .config-form::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.modo-oscuro .config-form::-webkit-scrollbar-thumb {
  background: rgba(240, 147, 251, 0.5);
}

.modo-oscuro .config-form::-webkit-scrollbar-thumb:hover {
  background: rgba(240, 147, 251, 0.7);
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.config-item-toggle {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.config-label {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modo-oscuro .config-label {
  color: #e0e0e0;
}

.label-icon {
  font-size: 1.5rem;
}

.config-input,
.config-select {
  width: 100%;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid #ddd;
  border-radius: 15px;
  background: white;
  outline: none;
  transition: all 0.3s ease;
  font-family: inherit;
}

.modo-oscuro .config-input,
.modo-oscuro .config-select {
  background: #2a2a2a;
  border-color: #444;
  color: #e0e0e0;
}

.config-input:focus,
.config-select:focus {
  border-color: #764ba2;
  box-shadow: 0 0 20px rgba(118, 75, 162, 0.3);
  transform: translateY(-2px);
}

.modo-oscuro .config-input:focus,
.modo-oscuro .config-select:focus {
  border-color: #f093fb;
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
}

.config-range {
  width: 100%;
  height: 8px;
  border-radius: 5px;
  background: linear-gradient(to right, #667eea, #764ba2);
  outline: none;
  -webkit-appearance: none;
  cursor: pointer;
}

.config-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
}

.config-range::-webkit-slider-thumb:hover {
  transform: scale(1.2);
  box-shadow: 0 6px 20px rgba(118, 75, 162, 0.5);
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 30px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 30px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 22px;
  width: 22px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: 0.4s;
  border-radius: 50%;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

input:checked + .toggle-slider:before {
  transform: translateX(30px);
}

/* Botones */
.config-botones {
  display: flex;
  gap: 1.5rem;
  margin-top: 0;
  flex-shrink: 0;
}

.btn-guardar,
.btn-volver {
  flex: 1;
  padding: 1.2rem 2rem;
  font-size: 1.2rem;
  font-weight: 700;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  position: relative;
  overflow: hidden;
}

.btn-guardar {
  background: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);
  color: #1a1a1a;
  box-shadow: 0 8px 25px rgba(0, 201, 255, 0.3);
}

.btn-guardar:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(0, 201, 255, 0.4);
}

.btn-volver {
  background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(255, 20, 147, 0.3);
}

.btn-volver:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 20, 147, 0.4);
}

.btn-guardar:active,
.btn-volver:active {
  transform: translateY(-1px);
}
</style>
