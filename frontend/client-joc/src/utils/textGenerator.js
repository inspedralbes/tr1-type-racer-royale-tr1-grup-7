// Generador de textos por temática para el juego

const textosPerTematica = {
  informatica: [
    "La programació orientada a objectes és un paradigma fonamental en el desenvolupament de programari modern.",
    "Els algorismes de cerca i ordenació són essencials per optimitzar el rendiment de les aplicacions.",
    "Les bases de dades relacionals utilitzen SQL per gestionar i consultar informació de manera eficient.",
    "La ciberseguretat és crucial per protegir les dades i sistemes contra atacs maliciosos i vulnerabilitats.",
    "El desenvolupament web ha evolucionat amb frameworks com React, Vue i Angular per crear interfícies dinàmiques.",
    "La intel·ligència artificial i el machine learning estan transformant la manera com interactuem amb la tecnologia.",
    "Els sistemes operatius gestionen els recursos del hardware i proporcionen una interfície per als usuaris.",
    "El cloud computing permet emmagatzemar i processar dades en servidors remots accessibles per internet.",
    "Les API REST faciliten la comunicació entre diferents aplicacions i serveis web de manera estandarditzada.",
    "La programació funcional promou l'ús de funcions pures i immutabilitat per crear codi més predictible."
  ],
  
  historia: [
    "La Revolució Francesa de mil set-cents vuitanta-nou va marcar un punt d'inflexió en la història europea.",
    "L'Imperi Romà va dominar la Mediterrània durant segles, deixant un llegat cultural i arquitectònic immens.",
    "El Renaixement va ser un període de gran floració artística i cultural a Europa durant els segles XIV al XVI.",
    "La Revolució Industrial va transformar les societats agràries en societats industrialitzades durant el segle XVIII.",
    "Les dues guerres mundials del segle XX van canviar radicalment el mapa polític i social del món.",
    "La caiguda del Mur de Berlín el mil nou-cents vuitanta-nou va simbolitzar el final de la Guerra Freda.",
    "L'antiga Grècia va establir les bases de la democràcia i la filosofia occidental que perduren avui dia.",
    "La descoberta d'Amèrica per Cristòfor Colom el mil quatre-cents noranta-dos va obrir noves rutes comercials.",
    "L'Edat Mitjana europea es caracteritzà pel feudalisme i el paper dominant de l'Església Catòlica.",
    "La Il·lustració va promoure valors com la raó, la ciència i el progrés durant el segle XVIII."
  ],
  
  ciencia: [
    "La teoria de la relativitat d'Einstein va revolucionar la nostra comprensió de l'espai, el temps i la gravetat.",
    "El cicle de l'aigua és fonamental per mantenir la vida al planeta Terra mitjançant l'evaporació i la precipitació.",
    "Les cèl·lules són les unitats bàsiques de la vida i es divideixen en procariotes i eucariotes.",
    "La fotosíntesi permet a les plantes convertir la llum solar en energia química mitjançant la clorofil·la.",
    "El sistema periòdic dels elements classifica tots els elements químics coneguts segons les seves propietats.",
    "La genètica estudia l'herència i la variació dels organismes a través del DNA i els gens.",
    "Les lleis de Newton descriuen el moviment dels objectes i les forces que actuen sobre ells.",
    "L'evolució per selecció natural explica com les espècies canvien i s'adapten al seu entorn al llarg del temps.",
    "El mètode científic és un procés sistemàtic d'observació, hipòtesi, experimentació i conclusió.",
    "La teoria del Big Bang explica l'origen i l'evolució de l'univers fa aproximadament tretze mil set-cents milions d'anys."
  ],
  
  literatura: [
    "Don Quixot de la Manxa és considerada una de les obres més importants de la literatura universal.",
    "El realisme màgic combina elements fantàstics amb la realitat quotidiana de manera natural i convincent.",
    "Shakespeare va revolucionar el teatre amb les seves tragèdies, comèdies i sonets immortals.",
    "La poesia romàntica va explorar els sentiments, la natura i la imaginació durant el segle XIX.",
    "Les novel·les de cavallers van ser molt populars durant l'Edat Mitjana i el Renaixement.",
    "El modernisme català va produir grans escriptors com Joan Maragall i Jacint Verdaguer.",
    "Les faules utilitzen animals parlants per transmetre ensenyaments morals i lliçons de vida.",
    "El surrealisme literari explora el subconscient i els somnis de manera innovadora i provocadora.",
    "Les cròniques medievals van documentar esdeveniments històrics des d'una perspectiva contemporània.",
    "La novel·la gòtica combina elements de terror, misteri i romanticisme en ambientacions tètriques."
  ],
  
  esports: [
    "El futbol és l'esport més popular del món amb milions de seguidors i practicants a tots els continents.",
    "Els Jocs Olímpics reuneixen atletes de tot el món per competir en nombroses disciplines esportives.",
    "El bàsquet es juga entre dos equips de cinc jugadors que intenten encistellar la pilota al cistell contrari.",
    "El tennis requereix gran agilitat, resistència i precisió per colpejar la pilota sobre la xarxa.",
    "L'atletisme inclou proves de velocitat, fons, salts i llançaments que demostren les capacitats humanes.",
    "La natació és un esport complet que treballa tots els músculs del cos i millora la resistència cardiovascular.",
    "El ciclisme combina resistència física i estratègia en carreres de carretera o muntanya.",
    "Les arts marcials combinen tècniques de defensa i atac amb disciplina mental i espiritual.",
    "El voleibol és un esport d'equip que requereix coordinació, reflexos ràpids i treball col·lectiu.",
    "L'escalada esportiva ha guanyat popularitat com a disciplina olímpica que combina força i agilitat."
  ],
  
  geografia: [
    "Els continents són grans masses terrestres separades per oceans i mars que cobreixen la superfície terrestre.",
    "El clima varia segons la latitud, altitud i proximitat als cossos d'aigua de cada regió.",
    "Les muntanyes es formen per processos tectònics com la col·lisió de plaques o l'activitat volcànica.",
    "Els rius transporten aigua i sediments des de les muntanyes fins als mars i oceans.",
    "Els deserts són regions àrides amb escassa precipitació i vegetació adaptada a condicions extremes.",
    "Els ecosistemes marins alberguen una biodiversitat immensa i són crucials pel clima global.",
    "Les ciutats creixen al voltant de recursos naturals, rutes comercials o centres administratius.",
    "La població mundial està distribuïda de manera desigual, concentrant-se en zones costaneres i fèrtils.",
    "Els volcans són obertures a l'escorça terrestre que alliberen magma, gasos i cendres.",
    "Les zones polars experimenten temperatures extremes i nits i dies que duren mesos."
  ],
  
  musica: [
    "La música clàssica ha evolucionat durant segles amb compositors com Bach, Mozart i Beethoven.",
    "El jazz va néixer a Nova Orleans combinant ritmes africans amb harmonia europea.",
    "El rock and roll va revolucionar la música popular durant els anys cinquanta i seixanta.",
    "La música electrònica utilitza sintetitzadors i ordinadors per crear sons innovadors i experimentals.",
    "L'òpera combina música vocal i instrumental amb teatre per narrar històries dramàtiques.",
    "Els instruments de corda com el violí i la guitarra produeixen so per vibració de les cordes.",
    "El blues va influir enormement en el desenvolupament del rock, el jazz i altres estils moderns.",
    "Les bandes simfòniques interpreten obres orquestrals amb una gran varietat d'instruments de vent i percussió.",
    "El reggae va sorgir a Jamaica durant els anys seixanta amb missatges socials i ritmes relaxats.",
    "La música folk preserva tradicions culturals i històries transmeses de generació en generació."
  ],
  
  aleatori: [
    "Els gats són animals independents i curiosos que han estat companys dels humans durant milers d'anys.",
    "El cafè és una de les begudes més consumides al món i prové de les llavors torrades del cafeter.",
    "Les estacions de l'any es produeixen per la inclinació de l'eix terrestre durant la seva òrbita solar.",
    "Els arbres són essencials per produir oxigen i absorbir diòxid de carboni de l'atmosfera.",
    "La cuina mediterrània es caracteritza per l'ús d'oli d'oliva, verdures fresques i peix.",
    "Els núvols es formen per la condensació del vapor d'aigua en l'atmosfera terrestre.",
    "El xocolata es produeix a partir de les llavors de cacau que creixen en regions tropicals.",
    "Les biblioteques són espais públics que preserven el coneixement i fomenten la lectura.",
    "Els ponts connecten regions separades per rius, valls o altres obstacles naturals.",
    "El reciclatge ajuda a reduir els residus i protegir el medi ambient per a futures generacions."
  ]
};

/**
 * Genera un texto largo combinando múltiples frases de una temática
 * @param {string} tematica - La temática del texto (informatica, historia, ciencia, etc.)
 * @param {number} numFrases - Número de frases a incluir (por defecto 5-8)
 * @returns {string} - Texto generado
 */
export function generarTexto(tematica = 'aleatori', numFrases = null) {
  // Normalizar la temática
  const tematicaNormalizada = tematica.toLowerCase();
  
  // Si la temática no existe, usar aleatorio
  const textos = textosPerTematica[tematicaNormalizada] || textosPerTematica.aleatori;
  
  // Si no se especifica número de frases, generar entre 5 y 8
  const numFrasesAGenerar = numFrases || Math.floor(Math.random() * 4) + 5;
  
  // Crear una copia del array para no modificar el original
  const textosDisponibles = [...textos];
  const frasesSeleccionadas = [];
  
  // Seleccionar frases aleatorias sin repetir
  for (let i = 0; i < Math.min(numFrasesAGenerar, textosDisponibles.length); i++) {
    const indexAleatori = Math.floor(Math.random() * textosDisponibles.length);
    frasesSeleccionadas.push(textosDisponibles[indexAleatori]);
    textosDisponibles.splice(indexAleatori, 1);
  }
  
  // Unir las frases con espacios
  return frasesSeleccionadas.join(' ');
}

/**
 * Obtiene todas las temáticas disponibles
 * @returns {Array<string>} - Array con los nombres de las temáticas
 */
export function obtenerTematicas() {
  return Object.keys(textosPerTematica);
}

/**
 * Genera un texto corto para práctica (1-2 frases)
 * @param {string} tematica - La temática del texto
 * @returns {string} - Texto corto generado
 */
export function generarTextoCurt(tematica = 'aleatori') {
  return generarTexto(tematica, Math.floor(Math.random() * 2) + 1);
}

/**
 * Genera un texto medio para competición (3-5 frases)
 * @param {string} tematica - La temática del texto
 * @returns {string} - Texto medio generado
 */
export function generarTextoMitja(tematica = 'aleatori') {
  return generarTexto(tematica, Math.floor(Math.random() * 3) + 3);
}

/**
 * Genera un texto largo para competición extensa (6-8 frases)
 * @param {string} tematica - La temática del texto
 * @returns {string} - Texto largo generado
 */
export function generarTextoLlarg(tematica = 'aleatori') {
  return generarTexto(tematica, Math.floor(Math.random() * 3) + 6);
}
