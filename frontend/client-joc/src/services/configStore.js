import { ref, watch } from 'vue';

// Estados globales de configuración
export const nombreUsuario = ref('');
export const idioma = ref('es');
export const modoOscuro = ref(false);
export const volumenSonido = ref(50);

// Textos en diferentes idiomas
export const traducciones = {
  es: {
    teclazo: 'TECLAZO',
    ingresarNombre: 'ingresar nombre',
    comenzar: 'COMENZAR',
    configuracion: 'CONFIGURACIÓN',
    nombreUsuario: 'Nombre de Usuario',
    tuNombre: 'Tu nombre',
    idioma: 'Idioma',
    modoOscuro: 'Modo Oscuro',
    volumen: 'Volumen',
    guardar: 'GUARDAR',
    volver: 'VOLVER',
    configGuardada: 'Configuración guardada correctamente',
    ingreseNombre: 'Por favor, ingrese su nombre primero'
  },
  ca: {
    teclazo: 'TECLAZO',
    ingresarNombre: 'introduïr nom',
    comenzar: 'COMENÇAR',
    configuracion: 'CONFIGURACIÓ',
    nombreUsuario: 'Nom d\'Usuari',
    tuNombre: 'El teu nom',
    idioma: 'Idioma',
    modoOscuro: 'Mode Fosc',
    volumen: 'Volum',
    guardar: 'GUARDAR',
    volver: 'TORNAR',
    configGuardada: 'Configuració guardada correctament',
    ingreseNombre: 'Si us plau, introdueix el teu nom primer'
  },
  en: {
    teclazo: 'TECLAZO',
    ingresarNombre: 'enter name',
    comenzar: 'START',
    configuracion: 'SETTINGS',
    nombreUsuario: 'Username',
    tuNombre: 'Your name',
    idioma: 'Language',
    modoOscuro: 'Dark Mode',
    volumen: 'Volume',
    guardar: 'SAVE',
    volver: 'BACK',
    configGuardada: 'Settings saved successfully',
    ingreseNombre: 'Please enter your name first'
  }
};

// Función para obtener texto traducido
export function t(key) {
  return traducciones[idioma.value]?.[key] || traducciones.es[key];
}

// Cargar configuración desde localStorage
export function cargarConfiguracion() {
  const config = localStorage.getItem('teclazo_config');
  if (config) {
    try {
      const datos = JSON.parse(config);
      nombreUsuario.value = datos.nombreUsuario || '';
      idioma.value = datos.idioma || 'es';
      modoOscuro.value = datos.modoOscuro || false;
      volumenSonido.value = datos.volumenSonido || 50;
    } catch (e) {
      console.error('Error cargando configuración:', e);
    }
  }
}

// Guardar configuración en localStorage
export function guardarConfiguracion() {
  const config = {
    nombreUsuario: nombreUsuario.value,
    idioma: idioma.value,
    modoOscuro: modoOscuro.value,
    volumenSonido: volumenSonido.value
  };
  localStorage.setItem('teclazo_config', JSON.stringify(config));
}

// Watch para guardar automáticamente cuando cambian los valores
watch([nombreUsuario, idioma, modoOscuro, volumenSonido], () => {
  guardarConfiguracion();
});

// Cargar configuración al inicio
cargarConfiguracion();
