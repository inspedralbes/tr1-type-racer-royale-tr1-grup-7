<template>
  <div class="mode-select-screen">
    <div class="mode-container">
      <h1 class="screen-title">MODO DE JUEGO</h1>
      <p class="screen-subtitle">Elige tu estilo de batalla</p>
      
      <div class="modes-grid">
        <div 
          class="mode-card"
          @click="selectMode('palabras')"
        >
          <div class="mode-icon">⚡</div>
          <h2 class="mode-title">PALABRAS</h2>
          <p class="mode-description">
            Escribe palabras individuales lo más rápido posible
          </p>
          <div class="mode-badge">RÁPIDO</div>
        </div>
        
        <div 
          class="mode-card"
          @click="selectMode('texto')"
        >
          <div class="mode-icon">📝</div>
          <h2 class="mode-title">TEXTO</h2>
          <p class="mode-description">
            Escribe párrafos completos con precisión
          </p>
          <div class="mode-badge">PRECISO</div>
        </div>
      </div>
      
      <button @click="goBack" class="btn-back-simple">
        ← VOLVER
      </button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(['selectMode', 'back']);

const selectMode = (mode) => {
  emit('selectMode', mode);
};

const goBack = () => {
  emit('back');
};
</script>

<style scoped>
.mode-select-screen {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0A192F;
  position: relative;
  overflow: hidden;
}

.mode-select-screen::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(circle at 30% 40%, rgba(240, 33, 185, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(0, 240, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.mode-container {
  max-width: 900px;
  width: 90%;
  padding: 3rem 2rem;
  position: relative;
  z-index: 1;
}

.screen-title {
  font-size: 3rem;
  font-weight: 700;
  color: #F021B9;
  text-shadow: 
    0 0 10px rgba(240, 33, 185, 0.8),
    0 0 20px rgba(240, 33, 185, 0.5);
  margin: 0 0 0.5rem 0;
  font-family: 'Share Tech Mono', monospace;
  text-align: center;
  letter-spacing: 0.2rem;
}

.screen-subtitle {
  font-size: 1rem;
  color: #00F0FF;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0 0 3rem 0;
  font-family: 'Share Tech Mono', monospace;
  text-align: center;
  letter-spacing: 0.15rem;
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.mode-card {
  background: rgba(26, 42, 74, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.mode-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(240, 33, 185, 0.1), rgba(0, 240, 255, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.mode-card:hover {
  border-color: #F021B9;
  transform: translateY(-8px);
  box-shadow: 
    0 0 40px rgba(240, 33, 185, 0.5),
    inset 0 0 20px rgba(240, 33, 185, 0.1);
}

.mode-card:hover::before {
  opacity: 1;
}

.mode-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 10px rgba(240, 33, 185, 0.5));
}

.mode-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #00F0FF;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0 0 1rem 0;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.15rem;
  position: relative;
  z-index: 1;
}

.mode-description {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Fira Code', monospace;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.mode-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, rgba(240, 33, 185, 0.3), rgba(0, 240, 255, 0.3));
  border: 1px solid #F021B9;
  border-radius: 20px;
  color: #F021B9;
  font-size: 0.85rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
  letter-spacing: 0.1rem;
  text-shadow: 0 0 8px rgba(240, 33, 185, 0.6);
  position: relative;
  z-index: 1;
}

.btn-back-simple {
  display: block;
  margin: 2rem auto 0;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
  background: rgba(26, 42, 74, 0.6);
  color: #00F0FF;
  border: 2px solid #00F0FF;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1rem;
}

.btn-back-simple:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #F021B9;
  color: #F021B9;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .screen-title {
    font-size: 2rem;
  }
  
  .modes-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .mode-card {
    padding: 2rem 1.5rem;
  }
  
  .mode-icon {
    font-size: 3rem;
  }
  
  .mode-title {
    font-size: 1.5rem;
  }
}
</style>
