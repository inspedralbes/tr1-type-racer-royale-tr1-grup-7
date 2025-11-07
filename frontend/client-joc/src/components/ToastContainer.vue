<template>
  <div class="toast-container" :class="positionClass">
    <div v-for="t in toasts" :key="t.id" class="toast" :class="`toast-${t.type || 'info'}`">
      <div class="toast-content">
        <span class="toast-icon">{{ iconFor(t.type) }}</span>
        <div class="toast-text">
          <div v-if="t.title" class="toast-title">{{ t.title }}</div>
          <div class="toast-message">{{ t.message }}</div>
        </div>
      </div>
      <button class="toast-close" @click="$emit('dismiss', t.id)">✕</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  toasts: { type: Array, default: () => [] },
  position: { type: String, default: 'top-right' } // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
});

const positionClass = `pos-${props.position}`;

function iconFor(type) {
  switch (type) {
    case 'success': return '✅';
    case 'warning': return '⚠️';
    case 'error': return '❌';
    default: return 'ℹ️';
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  pointer-events: none; /* allow clicks through gaps */
}
.pos-top-right { top: 10px; right: 10px; }
.pos-top-left { top: 10px; left: 10px; }
.pos-bottom-right { bottom: 10px; right: 10px; }
.pos-bottom-left { bottom: 10px; left: 10px; }

.toast {
  pointer-events: auto; /* clickable */
  min-width: 260px;
  max-width: 420px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 2px solid rgba(255,255,255,0.15);
  background: rgba(10, 25, 47, 0.95);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  color: #E0E0E0;
  animation: toast-in 160ms ease-out;
}

.toast-content { display: flex; gap: 10px; align-items: center; }
.toast-icon { font-size: 18px; }
.toast-text { display: flex; flex-direction: column; }
.toast-title { font-weight: 700; font-family: 'Share Tech Mono', monospace; }
.toast-message { font-family: 'Fira Code', monospace; font-size: 0.95rem; }
.toast-close {
  background: transparent; border: none; color: inherit; font-size: 14px; cursor: pointer;
  opacity: 0.8; transition: opacity 0.2s ease;
}
.toast-close:hover { opacity: 1; }

.toast-info { border-color: #00F0FF; color: #00F0FF; }
.toast-success { border-color: #39FF14; color: #39FF14; }
.toast-warning { border-color: #FFC107; color: #FFC107; }
.toast-error { border-color: #FF3B3B; color: #FF3B3B; }

@keyframes toast-in {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
