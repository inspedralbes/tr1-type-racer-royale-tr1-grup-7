<template>
  <div class="user-avatar-container">
    <div class="avatar-circle" :style="{ backgroundColor: playerColor }">
      {{ playerName ? playerName.charAt(0).toUpperCase() : "?" }}
    </div>
    <span class="player-name-text">{{ playerName }}</span>
    <button @click="goHome" class="btn-home" title="Tornar a l'inici">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        class="home-icon"
      >
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    </button>
    <button @click="openSettings" class="btn-settings" title="Configuració">
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
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(26, 42, 74, 0.8);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  border: 2px solid #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.3);
  z-index: 1000;
}

.avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: #0a192f;
  box-shadow: 0 0 15px currentColor;
  font-family: "Fira Code", monospace;
  border: 2px solid rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.player-name-text {
  font-size: 1rem;
  font-weight: 600;
  color: #00f0ff;
  font-family: "Fira Code", monospace;
  text-shadow: 0 0 5px #00f0ff;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-settings {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 2px solid #f021b9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-home {
  width: 36px;
  height: 36px;
  background: transparent;
  border: 2px solid #00f0ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.home-icon {
  width: 20px;
  height: 20px;
  color: #00f0ff;
  transition: all 0.3s ease;
}

.settings-icon {
  width: 20px;
  height: 20px;
  color: #f021b9;
  transition: all 0.3s ease;
}

.btn-home:hover {
  background: #00f0ff;
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.6);
}

.btn-home:hover .home-icon {
  color: #0a192f;
}

.btn-settings:hover {
  background: #f021b9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.6);
  transform: rotate(90deg);
}

.btn-settings:hover .settings-icon {
  color: #ffffff;
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
