<template>
  <Transition name="info-fade-scale" appear>
    <div v-if="isOpen" class="dialog-overlay" @click.self="close">
      <div class="dialog-box" :class="typeClass">
        <div class="dialog-header">
          <span class="dialog-icon">{{ icon }}</span>
          <h3 class="dialog-title">{{ titleComputed }}</h3>
        </div>
        <p class="dialog-message">{{ message }}</p>
        <div class="dialog-buttons">
          <button @click="close" class="btn-ok">D'acord</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  title: { type: String, default: '' },
  message: { type: String, default: '' },
  type: { type: String, default: 'info' } // info | error | warning | success
});

const emit = defineEmits(['close']);

const icons = {
  info: 'ℹ️',
  error: '❌',
  warning: '⚠️',
  success: '✅'
};

const icon = computed(() => icons[props.type] || icons.info);

const titleComputed = computed(() => {
  if (props.title) return props.title;
  switch (props.type) {
    case 'error': return 'Error';
    case 'warning': return 'Atenció';
    case 'success': return 'Fet';
    default: return 'Informació';
  }
});

const typeClass = computed(() => `type-${props.type}`);

function close() {
  emit('close');
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Transition animations */
.info-fade-scale-enter-active,
.info-fade-scale-leave-active { transition: opacity 0.25s ease, transform 0.25s ease; }
.info-fade-scale-enter-from,
.info-fade-scale-leave-to { opacity: 0; transform: scale(0.85); }
.info-fade-scale-enter-to,
.info-fade-scale-leave-from { opacity: 1; transform: scale(1); }

.dialog-box {
  min-width: 360px;
  max-width: 90vw;
  padding: 1.5rem 1.75rem;
  border-radius: 14px;
  border: 2px solid;
  background: #0F1A2F;
  box-shadow: 0 0 30px rgba(0,0,0,0.3), inset 0 0 20px rgba(255,255,255,0.05);
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.dialog-icon { font-size: 1.4rem; }
.dialog-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  font-family: 'Share Tech Mono', monospace;
}

.dialog-message {
  margin: 0.5rem 0 1rem 0;
  color: #E0E0E0;
  font-family: 'Fira Code', monospace;
}

.dialog-buttons { display: flex; justify-content: center; }

.btn-ok {
  padding: 0.6rem 1.5rem;
  border: 2px solid;
  border-radius: 8px;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-weight: 600;
  font-family: 'Share Tech Mono', monospace;
}

/* Type styles */
.type-info { border-color: #00F0FF; color: #00F0FF; }
.type-error { border-color: #FF3B3B; color: #FF3B3B; }
.type-warning { border-color: #FFC107; color: #FFC107; }
.type-success { border-color: #39FF14; color: #39FF14; }

.type-info .btn-ok { border-color: #00F0FF; }
.type-error .btn-ok { border-color: #FF3B3B; }
.type-warning .btn-ok { border-color: #FFC107; }
.type-success .btn-ok { border-color: #39FF14; }
</style>
