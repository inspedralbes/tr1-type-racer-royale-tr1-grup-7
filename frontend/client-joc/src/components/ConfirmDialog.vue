<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="cancel">
    <div class="dialog-box">
      <h3 class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>
      <div class="dialog-buttons">
        <button @click="confirm" class="btn-confirm">Aceptar</button>
        <button v-if="showCancel" @click="cancel" class="btn-cancel">Cancel·lar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Confirmació'
  },
  message: {
    type: String,
    default: 'Estàs segur?'
  },
  showCancel: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
  emit('confirm');
};

const cancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.dialog-box {
  background: linear-gradient(145deg, #1A2A4A, #0F1A2F);
  border: 2px solid #FF0000;
  border-radius: 16px;
  padding: 2rem;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 0 40px rgba(255, 0, 0, 0.5), inset 0 0 20px rgba(255, 0, 0, 0.1);
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #FF0000;
  margin: 0 0 1rem 0;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 10px #FF0000;
}

.dialog-message {
  font-size: 1.1rem;
  color: #E0E0E0;
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-family: 'Fira Code', monospace;
  line-height: 1.6;
}

.dialog-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm,
.btn-cancel {
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-confirm {
  background: linear-gradient(135deg, #FF0000, #CC0000);
  color: white;
  border: 2px solid #FF0000;
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
}

.btn-confirm:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(255, 0, 0, 0.6);
}

.btn-cancel {
  background: transparent;
  color: #00F0FF;
  border: 2px solid #00F0FF;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.3);
}

.btn-cancel:hover {
  background: rgba(0, 240, 255, 0.1);
  box-shadow: 0 0 20px rgba(0, 240, 255, 0.5);
}
</style>
