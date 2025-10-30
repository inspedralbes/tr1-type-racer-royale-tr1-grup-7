<script setup>
import { defineEmits } from 'vue';
import { nombreUsuario, modoOscuro, t } from '../services/configStore.js';

const emit = defineEmits(['comenzar']);

function comenzar() {
  if (nombreUsuario.value.trim() === '') {
    alert(t('ingreseNombre'));
    return;
  }
  emit('comenzar');
}
</script>

<template>
  <div class="chat-container" :class="{ 'modo-oscuro': modoOscuro }">
    <h1 class="titulo-principal">{{ t('teclazo') }}</h1>

    <div class="form-container">
      <input 
        v-model="nombreUsuario"
        type="text" 
        :placeholder="t('ingresarNombre')"
        class="input-nombre"
      />
      
      <button @click="comenzar" class="btn-comentar">
        {{ t('comenzar') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.chat-container {
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

.chat-container.modo-oscuro {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.chat-container::before {
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

.titulo-principal {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 900;
  letter-spacing: clamp(0.5rem, 1.5vw, 1rem);
  margin-bottom: 4rem;
  color: #fff;
  text-transform: uppercase;
  text-shadow: 
    0 0 10px rgba(255, 255, 255, 0.5),
    0 0 20px rgba(255, 255, 255, 0.4),
    0 0 30px rgba(255, 105, 180, 0.6),
    0 5px 15px rgba(0, 0, 0, 0.3),
    0 10px 25px rgba(0, 0, 0, 0.2);
  animation: glow 2s ease-in-out infinite alternate;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  word-wrap: break-word;
  max-width: 100%;
}

.modo-oscuro .titulo-principal {
  color: #f093fb;
  text-shadow: 
    0 0 20px rgba(240, 147, 251, 0.8),
    0 0 30px rgba(240, 147, 251, 0.6),
    0 0 40px rgba(102, 126, 234, 0.4),
    0 5px 15px rgba(0, 0, 0, 0.5);
}

@keyframes glow {
  from {
    text-shadow: 
      0 0 10px rgba(255, 255, 255, 0.5),
      0 0 20px rgba(255, 255, 255, 0.4),
      0 0 30px rgba(255, 105, 180, 0.6),
      0 5px 15px rgba(0, 0, 0, 0.3);
  }
  to {
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.8),
      0 0 30px rgba(255, 255, 255, 0.6),
      0 0 40px rgba(255, 105, 180, 0.8),
      0 0 50px rgba(255, 105, 180, 0.6),
      0 5px 15px rgba(0, 0, 0, 0.3);
  }
}

.form-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  align-items: center;
  position: relative;
  z-index: 1;
}

.input-nombre {
  width: 100%;
  max-width: 450px;
  padding: 1.5rem 2rem;
  font-size: 1.3rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.5);
  color: #333;
  box-sizing: border-box;
}

.modo-oscuro .input-nombre {
  background: rgba(30, 30, 30, 0.95);
  border-color: rgba(255, 255, 255, 0.2);
  color: #e0e0e0;
}

.input-nombre::placeholder {
  color: #aaa;
  text-align: center;
}

.modo-oscuro .input-nombre::placeholder {
  color: #888;
}

.input-nombre:focus {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 1);
  box-shadow: 
    0 12px 40px rgba(255, 105, 180, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.modo-oscuro .input-nombre:focus {
  background: rgba(40, 40, 40, 0.98);
  border-color: #f093fb;
  box-shadow: 
    0 12px 40px rgba(240, 147, 251, 0.4),
    inset 0 2px 4px rgba(255, 255, 255, 0.1);
}

.btn-comentar {
  padding: 1.5rem 4rem;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #FF1493 0%, #FF69B4 100%);
  color: white;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.2rem;
  box-shadow: 
    0 10px 30px rgba(255, 20, 147, 0.4),
    0 5px 15px rgba(0, 0, 0, 0.2),
    inset 0 -3px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  max-width: 100%;
  box-sizing: border-box;
}

.btn-comentar::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-comentar:hover::before {
  left: 100%;
}

.btn-comentar:hover {
  background: linear-gradient(135deg, #FF006E 0%, #FF1493 100%);
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 15px 40px rgba(255, 20, 147, 0.5),
    0 8px 20px rgba(0, 0, 0, 0.3),
    inset 0 -3px 0 rgba(0, 0, 0, 0.2);
}

.btn-comentar:active {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 
    0 8px 25px rgba(255, 20, 147, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
