# TECLAZO 🎮⚡

### _Joc Multijugador de Mecanografia en Temps Real_

**TECLAZO** és una aplicació web competitiva de mecanografia multijugador on els jugadors competeixen en temps real per demostrar qui pot escriure més ràpid i amb menys errors. Combina l'aprenentatge de mecanografia amb la diversió de la competició en directe.

---

## 📋 Taula de Continguts

- [Modes de Joc](#-modes-de-joc)
- [Flux del Joc](#-flux-del-joc)
- [Característiques Principals](#-característiques-principals)
- [Disposició de Pantalles](#-disposició-de-pantalles)
- [Tecnologies Utilitzades](#️-tecnologies-utilitzades)
- [Instal·lació i Desplegament](#-installació-i-desplegament)
- [Ús de l'Aplicació](#-ús-de-laplicació)
- [Estat del Projecte](#-estat-del-projecte)

---

## 🎯 Modes de Joc

TECLAZO ofereix dos modes de joc diferents per adaptar-se a diferents estils de competició:

### ⚡ Mode Paraules

**Velocitat i Reflexos**

En aquest mode, els jugadors han d'escriure paraules individuals que apareixen a la pantalla el més ràpid possible.

**Característiques:**

- Paraules aleatòries del banc de paraules configurat
- Enfocament en velocitat i temps de reacció
- Comptador d'errors en temps real
  -Progressió paraula a paraula
- Ideal per a partides ràpides i dinàmiques

**Mecànica:**

1. Apareix una paraula a la pantalla
2. El jugador l'escriu al camp d'entrada
3. En prémer `Espai` o acabar la paraula, es valida
4. Immediatament apareix la següent paraula
5. Les estadístiques es calculen en finalitzar

### 📝 Mode Text

**Precisió i Consistència**

En aquest mode, els jugadors han d'escriure paràgrafs complets amb la màxima precisió possible.

**Característiques:**

- Textos complets generats segons temàtica seleccionada
- Enfocament en precisió i fluïdesa d'escriptura
- Indicador visual de progrés caràcter a caràcter
- Detecció d'errors lletra per lletra
- Ideal per a mesurar habilitat global de mecanografia

**Mecànica:**

1. Es mostra un text complet a la pantalla
2. El jugador escriu caràcter a caràcter
3. Cada lletra es valida instantàniament
4. Les lletres correctes es marquen en verd
5. Les lletres incorrectes es marquen en vermell
6. La barra de progrés indica l'avanç percentual

---

## 🎮 Flux del Joc

El joc segueix un flux d'usuari intuïtiu i ben estructurat:

```
1. PANTALLA DE BIENVENIDA
   │
   ├─► Ingressar nom d'usuari
   │
   ↓
2. SELECCIÓ DE MODE DE JOC
   │
   ├─► Modo Paraules (⚡ Ràpid)
   ├─► Modo Text (📝 Precís)
   │
   ↓
3. ACCIÓ DE SALA
   │
   ├─► Crear Nova Sala
   └─► Unir-se a Sala Existent
   │
   ↓
4a. CREAR SALA                    4b. LLISTA DE SALES
   │                                 │
   ├─► Configurar paràmetres        ├─► Buscar sales actives
   ├─► Nom de sala                  ├─► Seleccionar sala
   ├─► Número de jugadors           └─► Unir-se (+ contrasenya si cal)
   ├─► Temps per ronda              │
   ├─► Nombre de rondes             │
   ├─► Dificultat                   │
   └─► Temàtica (només mode text)   │
   │                                 │
   └─────────────┬──────────────────┘
                 ↓
5. LOBBY / SALA D'ESPERA
   │
   ├─► Veure jugadors connectats
   ├─► Veure configuració de la sala
   ├─► Poder eliminar jugadors (admin)
   └─► L'admin inicia la partida
   │
   ↓
6. PARTIDA EN CURS
   │
   ├─► Motor de joc (paraules o text)
   ├─► Visualització en temps real
   ├─► Progressió de tots els jugadors
   ├─► Estadístiques instantànies
   ├─► Teclat visual multijugador
   │
   ↓
7. PANTALLA DE RESULTATS
   │
   ├─► Classificació final
   ├─► Estadístiques individuals
   ├─► WPM, precisió, errors
   └─► Opcions: Tornar al lobby o Sortir
```

---

## ✨ Característiques Principals

### 🎯 **Pantalla de Bienvenida**

- Input senzill per al nom del jugador
- Validació de nom d'usuari
- Interfície neon amb estètica futurista

### 🎮 **Selecció de Mode**

- Dos modes de joc clarament diferenciats
- Targetes visuals amb descripcions
- Badges indicant l'estil de cada mode

### 🚪 **Gestió de Sales**

- **Crear Sala:**

  - Configuració personalitzable
  - Nombre de jugadors (2-10)
  - Temps per ronda
  - Nombre de rondes
  - Dificultat del text
  - Temàtica del contingut
  - Opció de contrasenya

- **Unir-se a Sala:**
  - Llista de sales actives
  - Filtrat per mode de joc
  - Informació visible de cada sala
  - Suport per sales amb contrasenya

### 👥 **Lobby / Sala d'Espera**

- Llista de jugadors en temps real
- Indicador de qui és l'admin
- Configuració visible de la partida
- Funcionalitat per expulsar jugadors (admin)
- Botó d'inici només per l'admin

### 🏁 **Motor de Joc**

- Sincronització en temps real via WebSockets
- Visualització del progrés de tots els jugadors
- Estadístiques en directe (WPM, errors, precisió)
- Teclat visual amb indicadors multijugador
- Efectes visuals i sonors
- Barra de progrés individual

### 📊 **Pantalla de Resultats**

- Classificació final ordenada
- Estadístiques detallades per jugador
- Temps total, WPM, precisió, errors
- Opcions per continuar o sortir

### 🔧 **Altres Funcionalitats**

- Sistema de notificacions toast
- Diàlegs de confirmació
- Gestió d'errors i validacions
- Efectes de so opcionals
- Disseny responsive
- Tema fosc amb estètica cyberpunk

---

## 🖼️ Disposició de Pantalles

El següent diagrama mostra la disposició i navegació entre les diferents pantalles del joc:

![Disposició de Pantalles](docs/disposicion-pantallas.png)

---

## 🛠️ Tecnologies Utilitzades

### **Frontend**

- **Vue.js 3** - Framework progressiu de JavaScript
- **Vite** - Eina de construcció ràpida
- **Socket.IO Client** - Comunicació en temps real
- **CSS3** - Estils personalitzats amb efectes neon

### **Backend**

- **Node.js** - Entorn d'execució JavaScript
- **Express** - Framework web minimalista
- **Socket.IO** - WebSockets per comunicació bidireccional

### **Base de Dades**

- **MariaDB** - Sistema de gestió de bases de dades relacionals

### **DevOps i Desplegament**

- **Docker** - Contenidorització d'aplicacions
- **Docker Compose** - Orquestració de contenidors
- **Nodemon** - Reinici automàtic en desenvolupament

### **Eines de Desenvolupament**

- **Git** - Control de versions
- **npm** - Gestor de paquets
- **ESM** - Mòduls ECMAScript

---

## 🚀 Instal·lació i Desplegament

### **Prerequisits**

Assegura't de tenir instal·lat al teu sistema:

- **Docker** (versió 20.10 o superior)
- **Docker Compose** (versió 2.0 o superior)

### **Desplegament amb Docker (Recomanat)**

#### **1. Clonar el Repositori**

```bash
git clone https://github.com/inspedralbes/tr1-type-racer-royale-tr1-grup-7.git
cd tr1-type-racer-royale-tr1-grup-7
```

#### **2. Iniciar els Contenidors**

```bash
docker-compose up -d
```

Aquest comandament farà:

- ✅ Crear i iniciar el contenidor del backend (Node.js + Express + Socket.IO)
- ✅ Crear i iniciar el contenidor del frontend (Vue.js + Vite)
- ✅ Crear i iniciar el contenidor de la base de dades (MariaDB)
- ✅ Instal·lar automàticament totes les dependències
- ✅ Configurar la xarxa entre contenidors

#### **3. Accedir a l'Aplicació**

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080
- **Base de dades:** localhost:3306 (internament dins de Docker)

#### **4. Aturar els Contenidors**

```bash
docker-compose down
```

#### **5. Veure els Logs**

```bash
# Tots els contenidors
docker-compose logs -f

# Només frontend
docker-compose logs -f frontend

# Només backend
docker-compose logs -f backend
```

---

### **Desplegament Manual (Desenvolupament Local)**

Si prefereixes executar l'aplicació sense Docker:

#### **1. Instal·lar Dependències**

**Backend:**

```bash
cd backend
npm install
```

**Frontend:**

```bash
cd frontend/client-joc
npm install --legacy-peer-deps
```

#### **2. Configurar Variables d'Entorn**

Crea un fitxer `.env` al directori `backend/` amb:

```env
DB_HOST=localhost
DB_USER=grup7_user
DB_PASSWORD=grup7_pass
DB_NAME=grup7
PORT=8080
```

#### **3. Iniciar la Base de Dades**

Assegura't que MariaDB estigui executant-se localment o via Docker:

```bash
docker run -d \
  --name grup7_db \
  -e MARIADB_ROOT_PASSWORD=grup7_root_pass \
  -e MARIADB_DATABASE=grup7 \
  -e MARIADB_USER=grup7_user \
  -e MARIADB_PASSWORD=grup7_pass \
  -p 3306:3306 \
  mariadb:10.6
```

#### **4. Executar els Serveis**

**Backend (Terminal 1):**

```bash
cd backend
npm run dev
```

**Frontend (Terminal 2):**

```bash
cd frontend/client-joc
npm run dev
```

#### **5. Accedir a l'Aplicació**

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:8080

---

## 📖 Ús de l'Aplicació

### **Tutorial Pas a Pas**

#### **1. Registre / Bienvenida**

1. Obre http://localhost:5173 al teu navegador
2. Introdueix el teu nom d'usuari
3. Prem "COMENÇAR"

#### **2. Selecció de Mode**

1. Tria entre **Paraules** (ràpid) o **Text** (precís)
2. Cada mode té característiques diferents

#### **3. Crear o Unir-se a una Sala**

**Opció A: Crear Sala**

1. Selecciona "CREAR SALA"
2. Configura els paràmetres:
   - Nom de la sala
   - Número màxim de jugadors
   - Temps per ronda (segons)
   - Nombre de rondes
   - Dificultat (si aplica)
   - Temàtica (només mode text)
   - Contrasenya (opcional)
3. Prem "CREAR"

**Opció B: Unir-se a Sala**

1. Selecciona "UNIR-SE A SALA"
2. Navega per la llista de sales disponibles
3. Filtra per mode de joc si cal
4. Clica "UNIR-SE" a la sala desitjada
5. Introdueix la contrasenya si és necessari

#### **4. Lobby / Espera**

1. Espera que altres jugadors s'uneixin
2. L'admin pot expulsar jugadors si cal
3. Quan tots estiguin llestos, l'admin prem "INICIAR PARTIDA"

#### **5. Jugar la Partida**

**Mode Paraules:**

1. Escriu cada paraula que apareix
2. Prem `Espai` o acaba la paraula per validar
3. Continua fins completar totes les rondes

**Mode Text:**

1. Escriu el text que es mostra caràcter a caràcter
2. Les lletres correctes es marquen en verd
3. Les lletres incorrectes es marquen en vermell
4. Continua fins completar el text

#### **6. Veure Resultats**

1. Revisa la classificació final
2. Consulta les teves estadístiques (WPM, precisió, errors)
3. Tria "TORNAR AL LOBBY" o "SORTIR"

---

## 📊 Estat del Projecte

**Versió Actual:** 1.0.0  
**Estat:** En desenvolupament actiu

### **Funcionalitats Implementades** ✅

- ✅ Sistema complet de sales multijugador
- ✅ Dos modes de joc (Paraules i Text)
- ✅ Interfície de joc amb visualització en temps real
- ✅ Panel lateral de jugadors amb estadístiques
- ✅ Teclat visual amb indicadors multijugador
- ✅ Sistema d'administrador per gestionar sales
- ✅ Generador de textos per temàtiques
- ✅ Flux complet d'usuari (bienvenida → mode → sala → joc → resultats)
- ✅ Sincronització WebSocket en temps real
- ✅ Sistema de notificacions i diàlegs
- ✅ Efectes de so opcionals
- ✅ Disseny responsive i accessible
- ✅ Contenidorització amb Docker

### **Problemes Coneguts** 🐛

- ⚠️ Possibles problemes de sincronització amb connexions lentes
- ⚠️ Optimització de rendiment per a sales amb molts jugadors
- ⚠️ Validació addicional de dades en el backend

---

## 👥 Autors

**Grup 7 - TR1 Type Racer Royale**

_Institut Pedralbes - Desenvolupament d'Aplicacions Web_

---

## 📄 Llicència

Aquest projecte està desenvolupat com a treball acadèmic per l'Institut Pedralbes.

---

## 🤝 Contribucions

Aquest és un projecte acadèmic. Per a suggeriments o millores, si us plau contacta amb els membres del grup.

---

## 📞 Contacte i Suport

Per a qualsevol dubte o problema:

- Revisa la documentació al directori `/docs`
- Consulta els logs amb `docker-compose logs`
- Contacta amb els desenvolupadors del projecte

---

**Fet amb ❤️ i ⌨️ per l'equip del Grup 7**
