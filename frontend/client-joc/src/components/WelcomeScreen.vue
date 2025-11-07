<template>
  <div class="welcome-screen">
    <div class="welcome-container">
      <h1 class="game-title">TECLAZO 🎮</h1>
      <p class="subtitle">TYPING BATTLE ROYALE</p>
      
      <div class="welcome-form">
        <label for="playerName" class="input-label">INGRESA TU NOMBRE</label>
        <input 
          type="text" 
          id="playerName"
          v-model="playerName"
          @keyup.enter="handleSubmit"
          placeholder="Jugador..."
          class="player-input"
          maxlength="20"
          autofocus
        />
        
        <button 
          @click="handleSubmit" 
          class="btn-continue"
          :disabled="!playerName.trim()"
        >
          CONTINUAR
        </button>
      </div>
      
      <div class="welcome-footer">
        <p class="hint">Presiona ENTER para continuar</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const playerName = ref('');

const emit = defineEmits(['continue']);

const handleSubmit = () => {
  if (playerName.value.trim()) {
    emit('continue', playerName.value.trim());
  }
};
</script>

<style scoped>
.welcome-screen {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A192F;
  position: relative;
  overflow: hidden;
}

.welcome-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 20% 50%, rgba(240, 33, 185, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 50%, rgba(0, 240, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.welcome-container {
  max-width: 500px;
  width: 90%;
  padding: 3rem 2rem;
  background: rgba(26, 42, 74, 0.8);
  backdrop-filter: blur(10px);
  border: 2px solid #00F0FF;
  border-radius: 16px;
  box-shadow: 
    0 0 40px rgba(0, 240, 255, 0.4),
    inset 0 0 20px rgba(0, 240, 255, 0.05);
  text-align: center;
  position: relative;
  z-index: 1;
}

.game-title {
  font-size: 4rem;
  font-weight: 700;
  color: #F021B9;
  text-shadow: 
    0 0 10px rgba(240, 33, 185, 0.8),
    0 0 20px rgba(240, 33, 185, 0.5),
    0 0 30px rgba(240, 33, 185, 0.3);
  margin: 0 0 0.5rem 0;
  font-family: 'Share Tech Mono', monospace;
  animation: glitch 3s infinite alternate;
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
  }
  92% {
    transform: translate(-2px, 2px);
  }
  94% {
    transform: translate(2px, -2px);
  }
  96% {
    transform: translate(-2px, -2px);
  }
  98% {
    transform: translate(2px, 2px);
  }
}

.subtitle {
  font-size: 1rem;
  color: #00F0FF;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0 0 3rem 0;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
}

.welcome-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.input-label {
  font-size: 0.9rem;
  color: #00F0FF;
  text-shadow: 0 0 8px rgba(0, 240, 255, 0.6);
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.15rem;
  text-transform: uppercase;
}

.player-input {
  padding: 1rem 1.5rem;
  font-size: 1.2rem;
  font-family: 'Fira Code', monospace;
  background: rgba(10, 25, 47, 0.6);
  color: #00F0FF;
  border: 2px solid rgba(0, 240, 255, 0.4);
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  text-align: center;
  box-shadow: inset 0 0 10px rgba(0, 240, 255, 0.1);
}

.player-input::placeholder {
  color: rgba(0, 240, 255, 0.3);
}

.player-input:focus {
  border-color: #F021B9;
  box-shadow: 
    0 0 20px rgba(240, 33, 185, 0.4),
    inset 0 0 15px rgba(240, 33, 185, 0.1);
  color: #F021B9;
}

.btn-continue {
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
  background: linear-gradient(135deg, #F021B9, #00F0FF);
  color: #0A192F;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
  position: relative;
  overflow: hidden;
}

.btn-continue::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s ease;
}

.btn-continue:hover::before {
  left: 100%;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(240, 33, 185, 0.6);
}

.btn-continue:active {
  transform: translateY(0);
}

.btn-continue:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  transform: none;
}

.btn-continue:disabled:hover {
  transform: none;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
}

.welcome-footer {
  margin-top: 2rem;
}

.hint {
  font-size: 0.85rem;
  color: rgba(0, 240, 255, 0.5);
  font-family: 'Share Tech Mono', monospace;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .game-title {
    font-size: 3rem;
  }
  
  .subtitle {
    font-size: 0.85rem;
    letter-spacing: 0.2rem;
  }
  
  .welcome-container {
    padding: 2rem 1.5rem;
  }
}
</style>
