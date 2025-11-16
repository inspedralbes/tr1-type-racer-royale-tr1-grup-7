<template>
  <div class="mode-select-screen">
    <div class="mode-container">
      <h1 class="screen-title">MODE DE JOC</h1>
      <p class="screen-subtitle">Tria el teu estil de batalla</p>

      <div class="modes-grid">
        <div class="mode-card" @click="selectMode('palabras')">
          <div class="mode-icon">⚡</div>
          <h2 class="mode-title">Paraules</h2>
          <p class="mode-description">
            Escriu paraules individuals el més ràpid possible
          </p>
          <div class="mode-badge">RÀPID</div>
        </div>

        <div class="mode-card" @click="selectMode('texto')">
          <div class="mode-icon">📄</div>
          <h2 class="mode-title">Text</h2>
          <p class="mode-description">
            Escriu paràgrafs complets amb precisió
          </p>
          <div class="mode-badge">PRECÍS</div>
        </div>
      </div>

      <button @click="goBack" class="btn-back-simple">← TORNAR</button>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["selectMode", "back"]);

const selectMode = (mode) => {
  emit("selectMode", mode);
};

const goBack = () => {
  emit("back");
};
</script>

<style scoped>
.mode-select-screen {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
  position: relative;
  overflow: hidden;
  padding-top: 0;
  margin-top: 0;
}

.mode-select-screen::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(138, 43, 226, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(30, 144, 255, 0.25) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 50%, rgba(255, 20, 147, 0.2) 0%, transparent 60%);
  pointer-events: none;
  animation: bgFloat 15s ease-in-out infinite;
}

@keyframes bgFloat {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.mode-container {
  max-width: 1000px;
  width: 90%;
  padding: 2rem;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
}

.screen-title {
  font-size: 3.5rem;
  font-weight: 900;
  color: #ffffff;
  margin: 0 0 0.5rem 0;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  letter-spacing: 0.4rem;
  position: relative;
  animation: titlePulse 3s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(138, 43, 226, 1),
               0 0 40px rgba(30, 144, 255, 0.9),
               0 0 60px rgba(255, 20, 147, 0.8),
               0 0 80px rgba(138, 43, 226, 0.7),
               0 0 100px rgba(30, 144, 255, 0.6);
  text-transform: uppercase;
}

@keyframes titlePulse {
  0%, 100% {
    text-shadow: 0 0 20px rgba(138, 43, 226, 1),
                 0 0 40px rgba(30, 144, 255, 0.9),
                 0 0 60px rgba(255, 20, 147, 0.8),
                 0 0 80px rgba(138, 43, 226, 0.7),
                 0 0 100px rgba(30, 144, 255, 0.6);
  }
  50% {
    text-shadow: 0 0 30px rgba(138, 43, 226, 1),
                 0 0 60px rgba(30, 144, 255, 1),
                 0 0 90px rgba(255, 20, 147, 1),
                 0 0 120px rgba(138, 43, 226, 0.9),
                 0 0 150px rgba(30, 144, 255, 0.8);
  }
}

.screen-subtitle {
  font-size: 1.4rem;
  color: #ffffff;
  margin: 0 0 2rem 0;
  font-family: "Share Tech Mono", monospace;
  text-align: center;
  letter-spacing: 0.25rem;
  animation: subtitleGlow 2.5s ease-in-out infinite alternate;
  font-weight: 600;
  text-shadow: 0 0 15px rgba(255, 20, 147, 0.9),
               0 0 30px rgba(138, 43, 226, 0.7),
               0 0 45px rgba(30, 144, 255, 0.6);
}

@keyframes subtitleGlow {
  0% {
    text-shadow: 0 0 15px rgba(255, 20, 147, 0.9),
                 0 0 30px rgba(138, 43, 226, 0.7),
                 0 0 45px rgba(30, 144, 255, 0.6);
  }
  100% {
    text-shadow: 0 0 25px rgba(255, 20, 147, 1),
                 0 0 50px rgba(138, 43, 226, 0.9),
                 0 0 75px rgba(30, 144, 255, 0.8);
  }
}

.modes-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 1.5rem 0;
}

.mode-card {
  background: linear-gradient(145deg, rgba(30, 20, 60, 0.85), rgba(20, 15, 45, 0.9));
  backdrop-filter: blur(15px);
  border: 3px solid transparent;
  background-image: linear-gradient(145deg, rgba(30, 20, 60, 0.85), rgba(20, 15, 45, 0.9)),
                    linear-gradient(135deg, #8a2be2, #1e90ff, #ff1493);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  border-radius: 20px;
  padding: 2rem 1.8rem;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: center;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.6),
              0 0 40px rgba(138, 43, 226, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: cardFloat 4s ease-in-out infinite;
}

.mode-card:nth-child(1) {
  animation-delay: 0s;
}

.mode-card:nth-child(2) {
  animation-delay: 1.5s;
}

@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.mode-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    rgba(138, 43, 226, 0.25),
    rgba(30, 144, 255, 0.2),
    rgba(255, 20, 147, 0.15)
  );
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 0;
}

.mode-card::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  background: linear-gradient(
    45deg,
    #8a2be2,
    #1e90ff,
    #ff1493,
    #8a2be2
  );
  background-size: 300% 300%;
  border-radius: 25px;
  opacity: 0;
  z-index: -1;
  filter: blur(25px);
  transition: opacity 0.5s ease;
  animation: borderRotate 6s linear infinite;
}

@keyframes borderRotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.mode-card:hover {
  transform: translateY(-25px) scale(1.1);
  box-shadow: 0 0 80px rgba(138, 43, 226, 1),
              0 0 120px rgba(30, 144, 255, 0.8),
              0 0 160px rgba(255, 20, 147, 0.6),
              0 25px 60px rgba(0, 0, 0, 0.7),
              inset 0 0 60px rgba(138, 43, 226, 0.3);
  animation: cardBounce 0.7s ease-in-out;
}

@keyframes cardBounce {
  0%, 100% {
    transform: translateY(-25px) scale(1.08);
  }
  50% {
    transform: translateY(-30px) scale(1.1);
  }
}

.mode-card:hover::before {
  opacity: 1;
}

.mode-card:hover::after {
  opacity: 0.8;
}

.mode-card:active {
  transform: translateY(-8px) scale(1.02);
  animation: none;
}

.mode-icon {
  font-size: 4rem;
  margin-bottom: 0;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 0 20px rgba(138, 43, 226, 0.8))
          drop-shadow(0 0 40px rgba(30, 144, 255, 0.6));
  transition: all 0.4s ease;
  animation: iconPulse 2.5s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 20px rgba(138, 43, 226, 0.8))
            drop-shadow(0 0 40px rgba(30, 144, 255, 0.6));
  }
  50% {
    transform: scale(1.15);
    filter: drop-shadow(0 0 40px rgba(138, 43, 226, 1))
            drop-shadow(0 0 70px rgba(30, 144, 255, 0.9));
  }
}

.mode-card:hover .mode-icon {
  transform: scale(1.3) rotate(15deg);
  filter: drop-shadow(0 0 50px rgba(138, 43, 226, 1))
          drop-shadow(0 0 90px rgba(30, 144, 255, 1))
          drop-shadow(0 0 120px rgba(255, 20, 147, 0.8));
  animation: iconBounce 0.6s ease-in-out infinite;
}

@keyframes iconBounce {
  0%, 100% {
    transform: scale(1.3) rotate(15deg) translateY(0);
  }
  50% {
    transform: scale(1.35) rotate(15deg) translateY(-8px);
  }
}

.mode-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.2rem;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 15px rgba(30, 144, 255, 1),
               0 0 30px rgba(138, 43, 226, 0.8),
               0 0 45px rgba(255, 20, 147, 0.6);
  text-transform: uppercase;
}

.mode-description {
  font-size: 0.85rem;
  color: #ffffff;
  font-family: "Fira Code", monospace;
  margin: 0;
  line-height: 1.5;
  position: relative;
  z-index: 1;
  max-width: 280px;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.6),
               0 0 20px rgba(30, 144, 255, 0.4);
}

.mode-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: linear-gradient(
    135deg,
    rgba(138, 43, 226, 0.5),
    rgba(30, 144, 255, 0.5)
  );
  border: 2px solid #8a2be2;
  border-radius: 25px;
  color: #fff;
  font-size: 0.85rem;
  font-weight: 800;
  font-family: "Share Tech Mono", monospace;
  letter-spacing: 0.15rem;
  text-shadow: 0 0 15px rgba(138, 43, 226, 1),
               0 0 30px rgba(30, 144, 255, 0.8);
  position: relative;
  z-index: 1;
  box-shadow: 0 0 25px rgba(138, 43, 226, 0.7),
              0 0 50px rgba(30, 144, 255, 0.5);
  transition: all 0.4s ease;
  text-transform: uppercase;
}

.mode-card:hover .mode-badge {
  background: linear-gradient(
    135deg,
    rgba(138, 43, 226, 0.8),
    rgba(30, 144, 255, 0.8)
  );
  border-color: #ff1493;
  box-shadow: 0 0 40px rgba(138, 43, 226, 1),
              0 0 70px rgba(30, 144, 255, 0.9),
              0 0 100px rgba(255, 20, 147, 0.7);
  transform: scale(1.1);
}

.btn-back-simple {
  display: block;
  margin: 1.5rem auto 0;
  padding: 1rem 3rem;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: "Share Tech Mono", monospace;
  background: linear-gradient(135deg, rgba(30, 20, 60, 0.8), rgba(20, 15, 45, 0.9));
  color: #ffffff;
  border: 2.5px solid rgba(138, 43, 226, 0.6);
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  letter-spacing: 0.15rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4),
              0 0 30px rgba(138, 43, 226, 0.3);
  text-transform: uppercase;
  backdrop-filter: blur(10px);
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.8),
               0 0 20px rgba(30, 144, 255, 0.6);
}

.btn-back-simple:hover {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.4), rgba(30, 144, 255, 0.4));
  border-color: #1e90ff;
  color: #fff;
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 0 40px rgba(138, 43, 226, 0.8),
              0 0 70px rgba(30, 144, 255, 0.6),
              0 10px 30px rgba(0, 0, 0, 0.5);
  text-shadow: 0 0 15px rgba(30, 144, 255, 1),
               0 0 30px rgba(138, 43, 226, 0.9);
}

.btn-back-simple:active {
  transform: translateY(-2px) scale(1.02);
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
