<script setup>
import { defineEmits, defineProps } from 'vue';
import audioManager from '../services/audioManager.js';

const props = defineProps({
  mostrarVolver: {
    type: Boolean,
    default: false
  },
  mostrarHome: {
    type: Boolean,
    default: false
  },
  mostrarConfig: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['back', 'home', 'config']);

function handleBack() {
  audioManager.playButtonClick();
  emit('back');
}

function handleHome() {
  audioManager.playButtonClick();
  emit('home');
}

function handleConfig() {
  audioManager.playButtonClick();
  emit('config');
}
</script>

<template>
  <div class="nav-buttons" :class="{ 'has-back': mostrarVolver }">
    <!-- Flecha volver (arriba izquierda) -->
    <button v-if="mostrarVolver" @click="handleBack" class="nav-btn btn-back" title="Volver">
      ←
    </button>

    <!-- Casa (arriba derecha, junto a config) -->
    <div class="nav-right">
      <button v-if="mostrarHome" @click="handleHome" class="nav-btn btn-home" title="Inicio">
        🏠
      </button>
      
      <!-- Config (arriba derecha) -->
      <button v-if="mostrarConfig" @click="handleConfig" class="nav-btn btn-config" title="Configuración">
        ⚙️
      </button>
    </div>
  </div>
</template>

<style scoped>
.nav-buttons {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  pointer-events: none;
  padding: 1.5rem;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
}

.nav-buttons.has-back {
  justify-content: space-between;
}

.nav-btn {
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  pointer-events: all;
  color: white;
  font-weight: bold;
}

.nav-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.btn-back {
  font-size: 2rem;
  line-height: 1;
}

.btn-config:hover {
  transform: rotate(90deg) scale(1.1);
}

.nav-right {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
  .nav-buttons {
    padding: 1rem;
  }
  
  .nav-btn {
    width: 45px;
    height: 45px;
    font-size: 1.3rem;
  }
}
</style>
