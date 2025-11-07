<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="cancel">
    <div class="dialog-box">
      <h3 class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>
      <input 
        v-model="password" 
        type="password" 
        class="dialog-input"
        placeholder="Introdueix la contrasenya..."
        @keyup.enter="confirm"
        autofocus
      />
      <div class="dialog-buttons">
        <button @click="confirm" class="btn-confirm">Aceptar</button>
        <button @click="cancel" class="btn-cancel">Cancel·lar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: 'Contrasenya requerida'
  },
  message: {
    type: String,
    default: 'Aquesta sala és privada. Introdueix la contrasenya:'
  }
});

const emit = defineEmits(['confirm', 'cancel']);

const password = ref('');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    password.value = '';
  }
});

const confirm = () => {
  emit('confirm', password.value);
  password.value = '';
};

const cancel = () => {
  emit('cancel');
  password.value = '';
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
  border: 2px solid #00F0FF;
  border-radius: 16px;
  padding: 2rem;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.5), inset 0 0 20px rgba(0, 240, 255, 0.1);
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #F021B9;
  margin: 0 0 1rem 0;
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  text-shadow: 0 0 10px #F021B9;
}

.dialog-message {
  font-size: 1rem;
  color: #E0E0E0;
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-family: 'Fira Code', monospace;
}

.dialog-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-family: 'Fira Code', monospace;
  background: rgba(10, 25, 47, 0.8);
  color: #00F0FF;
  border: 2px solid #00F0FF;
  border-radius: 8px;
  outline: none;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.dialog-input:focus {
  border-color: #F021B9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5);
  color: #F021B9;
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
  background: linear-gradient(135deg, #00F0FF, #0088FF);
  color: #0A192F;
  border: 2px solid #00F0FF;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
}

.btn-confirm:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.6);
}

.btn-cancel {
  background: transparent;
  color: #FF0000;
  border: 2px solid #FF0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.btn-cancel:hover {
  background: rgba(255, 0, 0, 0.1);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}
</style>
