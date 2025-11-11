<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="cancel">
    <div class="dialog-box">
      <h3 class="dialog-title">{{ title }}</h3>
      <p class="dialog-message">{{ message }}</p>
      <input
        v-model="password"
        type="password"
        class="dialog-input"
        placeholder="Introduce la contraseña..."
        @keyup.enter="confirm"
        autofocus
      />
      <div class="dialog-buttons">
        <button @click="confirm" class="btn-confirm">Aceptar</button>
        <button @click="cancel" class="btn-cancel">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: "Contraseña requerida",
  },
  message: {
    type: String,
    default: "Esta sala es privada. Introduce la contraseña:",
  },
});

const emit = defineEmits(["confirm", "cancel"]);

const password = ref("");

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      password.value = "";
    }
  }
);

const confirm = () => {
  emit("confirm", password.value);
  password.value = "";
};

const cancel = () => {
  emit("cancel");
  password.value = "";
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
  background: linear-gradient(145deg, #1a2a4a, #0f1a2f);
  border: 2px solid #00f0ff;
  border-radius: 16px;
  padding: 2rem;
  min-width: 400px;
  max-width: 90%;
  box-shadow: 0 0 40px rgba(0, 240, 255, 0.5),
    inset 0 0 20px rgba(0, 240, 255, 0.1);
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f021b9;
  margin: 0 0 1rem 0;
  text-align: center;
  font-family: "Share Tech Mono", monospace;
  text-shadow: 0 0 10px #f021b9;
}

.dialog-message {
  font-size: 1rem;
  color: #e0e0e0;
  margin: 0 0 1.5rem 0;
  text-align: center;
  font-family: "Fira Code", monospace;
}

.dialog-input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-family: "Fira Code", monospace;
  background: rgba(10, 25, 47, 0.8);
  color: #00f0ff;
  border: 2px solid #00f0ff;
  border-radius: 8px;
  outline: none;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
  transition: all 0.3s ease;
}

.dialog-input:focus {
  border-color: #f021b9;
  box-shadow: 0 0 20px rgba(240, 33, 185, 0.5);
  color: #f021b9;
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
  font-family: "Share Tech Mono", monospace;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-confirm {
  background: linear-gradient(135deg, #00f0ff, #0088ff);
  color: #0a192f;
  border: 2px solid #00f0ff;
  box-shadow: 0 0 15px rgba(0, 240, 255, 0.4);
}

.btn-confirm:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(0, 240, 255, 0.6);
}

.btn-cancel {
  background: transparent;
  color: #ff0000;
  border: 2px solid #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
}

.btn-cancel:hover {
  background: rgba(255, 0, 0, 0.1);
  box-shadow: 0 0 20px rgba(255, 0, 0, 0.5);
}
</style>
