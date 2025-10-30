<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  mensaje: String,
  tipo: {
    type: String,
    default: 'success' // success, error, info
  }
});

const visible = ref(true);

watch(() => props.mensaje, () => {
  visible.value = true;
  setTimeout(() => {
    visible.value = false;
  }, 3000);
});
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="visible" class="notificacion" :class="tipo">
      <div class="notificacion-icono">
        <span v-if="tipo === 'success'">✓</span>
        <span v-if="tipo === 'error'">✗</span>
        <span v-if="tipo === 'info'">ℹ</span>
      </div>
      <div class="notificacion-contenido">
        <p class="notificacion-mensaje">{{ mensaje }}</p>
      </div>
      <button @click="visible = false" class="notificacion-cerrar">×</button>
    </div>
  </Transition>
</template>

<style scoped>
.notificacion {
  position: fixed;
  top: 2rem;
  right: 2rem;
  min-width: 350px;
  max-width: 450px;
  padding: 1.5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 
    0 10px 40px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 9999;
  backdrop-filter: blur(10px);
  animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounce-in {
  0% {
    transform: translateY(-100px) scale(0.5);
    opacity: 0;
  }
  50% {
    transform: translateY(10px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

.notificacion.success {
  background: linear-gradient(135deg, #00C9FF 0%, #92FE9D 100%);
  color: #1a1a1a;
}

.notificacion.error {
  background: linear-gradient(135deg, #FF416C 0%, #FF4B2B 100%);
  color: white;
}

.notificacion.info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.notificacion-icono {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  flex-shrink: 0;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.notificacion-contenido {
  flex: 1;
}

.notificacion-mensaje {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.4;
}

.notificacion-cerrar {
  width: 30px;
  height: 30px;
  border: none;
  background: rgba(255, 255, 255, 0.3);
  color: inherit;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
  line-height: 1;
  padding: 0;
}

.notificacion-cerrar:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: rotate(90deg);
}

/* Transición */
.slide-fade-enter-active {
  transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateY(-100px) scale(0.5);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .notificacion {
    top: 1rem;
    right: 1rem;
    left: 1rem;
    min-width: auto;
    max-width: none;
  }
}
</style>
