<template>
  <div class="user-avatar-container">
    <div class="avatar-circle" :style="{ backgroundColor: playerColor }">
      {{ playerName ? playerName.charAt(0).toUpperCase() : "?" }}
    </div>
    <span class="player-name-text">{{ playerName }}</span>
    <button @click="goHome" class="btn-home" title="Volver al inicio">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="home-icon"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </button>
    <button @click="openSettings" class="btn-settings" title="Configuración">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="settings-icon"
      >
        <path
          d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
        />
      </svg>
    </button>
  </div>
</template>

<script setup>
defineProps({
  playerName: {
    type: String,
    required: true,
  },
  playerColor: {
    type: String,
    default: "#F021B9",
  },
});

const emit = defineEmits(["open-settings", "go-home"]);

const openSettings = () => {
  emit("open-settings");
};

const goHome = () => {
  emit("go-home");
};
</script>

<style scoped>
.user-avatar-container {
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(30, 20, 60, 0.9), rgba(20, 15, 45, 0.95));
  backdrop-filter: blur(15px);
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  border: 3px solid transparent;
  background-image: linear-gradient(135deg, rgba(30, 20, 60, 0.9), rgba(20, 15, 45, 0.95)),
                    linear-gradient(90deg, #8a2be2, #1e90ff, #ff1493);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  box-shadow: 0 0 40px rgba(138, 43, 226, 0.5),
              0 0 70px rgba(30, 144, 255, 0.3),
              0 8px 25px rgba(0, 0, 0, 0.4);
  z-index: 1100;
  animation: avatarFloat 3s ease-in-out infinite;
}

@keyframes avatarFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

.avatar-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 0 25px currentColor,
              0 0 40px rgba(255, 255, 255, 0.5),
              inset 0 0 20px rgba(0, 0, 0, 0.3);
  font-family: "Share Tech Mono", monospace;
  border: 3px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  transition: all 0.3s ease;
}

.avatar-circle:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 0 35px currentColor,
              0 0 60px rgba(255, 255, 255, 0.7);
}

.player-name-text {
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(90deg, #1e90ff, #8a2be2, #ff1493);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-family: "Share Tech Mono", monospace;
  filter: drop-shadow(0 0 8px rgba(30, 144, 255, 0.8));
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  letter-spacing: 0.05rem;
}

.btn-settings {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.3), rgba(255, 20, 147, 0.3));
  border: 2.5px solid #8a2be2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease;
  flex-shrink: 0;
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.4);
}

.btn-home {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, rgba(30, 144, 255, 0.3), rgba(138, 43, 226, 0.3));
  border: 2.5px solid #1e90ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease;
  flex-shrink: 0;
  box-shadow: 0 0 15px rgba(30, 144, 255, 0.4);
}

.home-icon {
  width: 22px;
  height: 22px;
  color: #1e90ff;
  transition: all 0.4s ease;
  filter: drop-shadow(0 0 5px rgba(30, 144, 255, 0.8));
}

.settings-icon {
  width: 22px;
  height: 22px;
  color: #8a2be2;
  transition: all 0.4s ease;
  filter: drop-shadow(0 0 5px rgba(138, 43, 226, 0.8));
}

.btn-home:hover {
  background: linear-gradient(135deg, #1e90ff, #8a2be2);
  border-color: #fff;
  box-shadow: 0 0 30px rgba(30, 144, 255, 0.9),
              0 0 50px rgba(138, 43, 226, 0.6);
  transform: scale(1.15);
}

.btn-home:hover .home-icon {
  color: #fff;
  transform: scale(1.1);
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1));
}

.btn-settings:hover {
  background: linear-gradient(135deg, #8a2be2, #ff1493);
  border-color: #fff;
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.9),
              0 0 50px rgba(255, 20, 147, 0.6);
  transform: rotate(180deg) scale(1.15);
}

.btn-settings:hover .settings-icon {
  color: #fff;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 1));
}

@media (max-width: 768px) {
  .user-avatar-container {
    padding: 0.4rem 0.75rem;
  }

  .avatar-circle {
    width: 35px;
    height: 35px;
    font-size: 1rem;
  }

  .player-name-text {
    font-size: 0.9rem;
    max-width: 100px;
  }

  .btn-settings {
    width: 32px;
    height: 32px;
  }

  .btn-home {
    width: 32px;
    height: 32px;
  }

  .settings-icon {
    width: 18px;
    height: 18px;
  }

  .home-icon {
    width: 18px;
    height: 18px;
  }
}
</style>
