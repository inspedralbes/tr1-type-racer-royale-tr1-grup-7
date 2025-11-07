# TECLAZO 🎮

## Joc Multijugador de Mecanografia en Temps Real

**TECLAZO** és un joc competitiu de mecanografia multijugador on els jugadors competeixen en temps real per veure qui pot escriure més ràpid i amb menys errors.

---

## 👥 Integrants del Grup 7
* [Nom dels membres del grup]

---

## 📝 Descripció del Projecte
TECLAZO és una aplicació web multijugador que combina l'aprenentatge de mecanografia amb la diversió de la competició en temps real. Els jugadors poden:
- Crear sales privades o unir-se a sales existents
- Competir amb altres jugadors en temps real
- Veure el progrés dels rivals durant la partida
- Personalitzar la configuració de les partides (temps, rondes, dificultat, temàtica)
- Visualitzar estadístiques com WPM (paraules per minut) i errors

---

## 🔗 Enllaços del Projecte
* **Gestor de tasques**: [URL de Taiga/Jira/Trello]
* **Prototip gràfic**: [URL de Figma/Penpot]
* **URL de producció**: [Pendent]

---

## 🚀 Estat del Projecte
**En desenvolupament** - Funcionalitats implementades:
- ✅ Sistema de sales multijugador
- ✅ Interfície de joc amb visualització en temps real
- ✅ Panel lateral de jugadors amb estadístiques
- ✅ Teclat visual amb indicadors multijugador
- ✅ Sistema d'admin per gestionar sales
- ✅ Generador de textos per temàtiques
- ✅ Flujo completo de usuario (bienvenida → modo → sala → juego)
- 🔄 Sincronització WebSocket (en proves)

---

## 🎮 Flujo del Juego

El juego sigue este flujo de navegación:

```
1. BIENVENIDA (WelcomeScreen)
   ↓ [Ingresar nombre]
   
2. MODO DE JUEGO (GameModeSelect)
   ↓ [Elegir: Palabras o Texto]
   
3. ACCIÓN DE SALA (RoomActionSelect)
   ↓ [Elegir: Crear Sala o Unirse a Sala]
   
4a. LISTA DE SALAS (RoomList)        4b. CREAR SALA (CreateRoom)
    ↓ [Seleccionar sala]                  ↓ [Configurar sala]
    └─────────┬──────────────────────────┘
              ↓
              
5. LOBBY (LobbyRoom)
   ↓ [Esperar jugadores + Admin inicia]
   
6. JUEGO (GameView)
   ↓ [Competir en tiempo real]
   
7. RESULTADOS
   ↓ [Volver al lobby o salir]
```

### Características del Flujo:
- **Pantalla de Bienvenida**: Input simple para el nombre del jugador
- **Selección de Modo**: Palabras (rápido) o Texto (preciso)
- **Acción de Sala**: Decisión entre crear o unirse
- **Lista de Salas**: Ver salas activas y unirse
- **Crear Sala**: Configurar parámetros (jugadores, tiempo, rondas, etc.)
- **Lobby**: Sala de espera con lista de jugadores
- **Juego**: Competencia en tiempo real con visualización multijugador

---

## 🛠️ Tecnologies Utilitzades
- **Frontend**: Vue.js 3, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Base de dades**: MariaDB
- **Contenidors**: Docker, Docker Compose
