<template>
  <div class="room-action-screen">
    <div class="action-container">
      <h1 class="screen-title">ELIGE UNA OPCIÓN</h1>
      <p class="screen-subtitle">Crea tu propia sala o únete a una existente</p>

      <div class="actions-grid">
        <div class="action-card create" @click="selectAction('crear')">
          <div class="action-icon">➕</div>
          <h2 class="action-title">CREAR SALA</h2>
          <p class="action-description">
            Configura una nueva sala y espera a que otros jugadores se unan
          </p>
          <div class="action-arrow">→</div>
        </div>

        <div class="action-card join" @click="selectAction('unirse')">
          <div class="action-icon">🔍</div>
          <h2 class="action-title">UNIRSE A SALA</h2>
          <p class="action-description">
            Busca salas disponibles y únete a una partida
          </p>
          <div class="action-arrow">→</div>
        </div>
      </div>

      <button @click="goBack" class="btn-back-simple">← VOLVER</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["selectAction", "back"]);

const selectAction = (action) => {
  emit("selectAction", action);
};

const goBack = () => {
  emit("back");
};
</script>

<style scoped>
.room-action-screen {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0a192f;
  position: relative;
  overflow: hidden;
}

.room-action-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
      circle at 25% 35%,
      rgba(57, 255, 20, 0.08) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 75% 65%,
      rgba(240, 33, 185, 0.08) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.action-container {
  width: 90vw;
  height: 85vh;
  padding: 2vh 3vw;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 3vh;
}

.screen-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: #f021b9;
  text-shadow: 0 0 10px rgba(240, 33, 185, 0.8),
    0 0 20px rgba(240, 33, 185, 0.5);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  letter-spacing: 0.2rem;
}

.screen-subtitle {
  font-size: clamp(0.9rem, 1.4vw, 1.1rem);
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  letter-spacing: 0.1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4vw;
  flex: 1;
  align-items: center;
}

.action-card {
  background: rgba(26, 42, 74, 0.6);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(0, 240, 255, 0.3);
  border-radius: 20px;
  padding: 5vh 3vw;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2vh;
}

.action-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.6s ease;
}

.action-card:hover::before {
  left: 100%;
}

.action-card.create:hover {
  border-color: #39ff14;
  transform: translateY(-10px);
  box-shadow: 0 0 40px rgba(57, 255, 20, 0.5),
    inset 0 0 20px rgba(57, 255, 20, 0.1);
}

.action-card.join:hover {
  border-color: #00f0ff;
  transform: translateY(-10px);
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.5),
    inset 0 0 20px rgba(0, 240, 255, 0.1);
}

.action-icon {
  font-size: clamp(5rem, 10vw, 8rem);
  margin-bottom: 0;
  position: relative;
  z-index: 1;
}

.action-card.create .action-icon {
  filter: drop-shadow(0 0 10px rgba(57, 255, 20, 0.5));
}

.action-card.join .action-icon {
  filter: drop-shadow(0 0 10px rgba(0, 240, 255, 0.5));
}

.action-title {
  font-size: clamp(2rem, 3.5vw, 3rem);
  font-weight: 700;
  color: #00f0ff;
  text-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.2rem;
  position: relative;
  z-index: 1;
}

.action-card.create:hover .action-title {
  color: #39ff14;
  text-shadow: 0 0 10px rgba(57, 255, 20, 0.8);
}

.action-description {
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  color: rgba(255, 255, 255, 0.7);
  font-family: "Fira Code", monospace;
  margin: 0;
  line-height: 1.6;
  position: relative;
  z-index: 1;
}

.action-arrow {
  font-size: clamp(2.5rem, 4vw, 3.5rem);
  color: #f021b9;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
}

.action-card:hover .action-arrow {
  transform: translateX(10px);
}

.action-card.create:hover .action-arrow {
  color: #39ff14;
}

.action-card.join:hover .action-arrow {
  color: #00f0ff;
}

.btn-back-simple {
  display: block;
  margin: 0 auto;
  padding: 1vh 3vw;
  min-height: 50px;
  font-size: clamp(0.9rem, 1.2vw, 1.1rem);
  font-weight: 600;
  font-family: "Share Tech Mono", monospace;
  background: rgba(26, 42, 74, 0.6);
  color: #00f0ff;
  border: 2px solid #00f0ff;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  letter-spacing: 0.1rem;
}

.btn-back-simple:hover {
  background: rgba(240, 33, 185, 0.2);
  border-color: #f021b9;
  color: #f021b9;
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .screen-title {
    font-size: 2rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .action-card {
    padding: 2rem 1.5rem;
  }

  .action-icon {
    font-size: 3rem;
  }

  .action-title {
    font-size: 1.5rem;
  }
}
</style>
