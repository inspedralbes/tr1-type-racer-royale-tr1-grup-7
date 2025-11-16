import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier origen
  },
});

const PORT = 8080;

// Estructuras de datos para gestionar el estado
const players = {}; // Almacena información de cada jugador conectado
const activeRooms = {}; // Almacena las salas activas y sus detalles

console.log(`Servidor Socket.IO escuchando en el puerto ${PORT}`);

const textosPerTematica = {
  aleatori: {
    facil: [
      "El sol és una estrella. Ens dona llum i calor. Surt cada matí. Es pon a la tarda. És important per la vida.",
      "L'aigua és transparent. La bevem per viure. També la fem servir per rentar-nos. Els rius porten aigua. El mar és ple d'aigua salada.",
      "Els llibres expliquen històries. Tenen moltes pàgines. M'agrada llegir contes. Aprenc coses noves. La biblioteca és plena de llibres.",
      "La meva casa és gran. Té finestres i una porta. Hi ha una cuina i un llit. És un lloc còmode. M'hi sento segur.",
      "El cotxe té quatre rodes. Serveix per viatjar. Fa soroll quan arrenca. Necessita benzina. Pot anar molt ràpid.",
      "Porto sabates als peus. Em protegeixen del terra. N'hi ha de molts colors. M'agrada cordar-me-les. Són còmodes per caminar.",
      "El vermell és un color bonic. El cel és de color blau. L'herba és verda. El groc és com el sol. M'agraden tots els colors.",
      "M'agrada molt menjar. La fruita és molt sana. Les verdures també són bones. El xocolate és dolç. Cal menjar de tot.",
      "A la nit cal dormir. Tanco els ulls al llit. Els somnis són divertits. Dormir em dona energia. Descanso molt bé.",
      "Vaig a l'escola cada dia. Hi aprenc a llegir i escriure. Jugo amb els meus amics. La mestra ensenya coses. M'agrada anar a l'escola.",
    ],
    normal: [
      "Viatjar enriqueix la ment i obre noves perspectives. Conèixer altres cultures ens fa més tolerants. Cada país té les seves pròpies tradicions i gastronomia. Preparar la maleta és el primer pas de l'aventura. Els records d'un viatge duren per sempre. Alguns prefereixen la platja, altres la muntanya. La tecnologia actual facilita molt planificar les rutes.",
      "La cuina mediterrània és coneguda pels seus beneficis per a la salut. Utilitza oli d'oliva, verdures fresques i peix. Preparar un bon àpat requereix paciència i bons ingredients. Els sabors tradicionals es barregen amb tècniques modernes. Moltes receptes passen de generació en generació. La presentació del plat també és important. Gaudir d'un bon menjar amb amics és un gran plaer.",
      "L'estudi de la història ens permet entendre el nostre present. Els esdeveniments passats tenen un impacte directe en la societat actual. Els historiadors analitzen documents i fonts antigues. Cal evitar repetir els errors del passat. Cada època té els seus propis reptes i assoliments. La memòria col·lectiva és fonamental per a la identitat d'un poble. Els museus conserven objectes de gran valor històric.",
      "L'art és una forma d'expressió humana universal. Pot manifestar-se en pintura, escultura, música o dansa. Cada artista té un estil únic per transmetre emocions. Els museus d'art contemporani desafien la nostra percepció. El valor d'una obra pot ser subjectiu. L'art urbà, com el graffiti, ha guanyat reconeixement. L'educació artística és important per al desenvolupament creatiu.",
      "La ciència busca explicacions racionals sobre el funcionament del món. El mètode científic es basa en l'observació i l'experimentació. Els descobriments científics han transformat la nostra vida quotidiana. La medicina moderna ha augmentat l'esperança de vida. Encara queden molts misteris per resoldre a l'univers. La col·laboració internacional és clau en projectes grans. La divulgació científica ajuda a apropar el coneixement al públic.",
      "El treball dignifica la persona i és una font d'ingressos. Trobar un equilibri entre la vida laboral i la personal és essencial. L'automatització està canviant molts sectors professionals. La formació contínua és necessària per adaptar-se als canvis. L'ambient de treball influeix molt en la productivitat. Algunes persones trien emprendre els seus propis negocis. El teletreball s'ha popularitzat en els últims anys.",
      "La protecció del medi ambient és un repte global urgent. El canvi climàtic ja mostra els seus efectes arreu del món. Reciclar els residus és una acció senzilla que tothom pot fer. Cal reduir la nostra dependència dels combustibles fòssils. Les energies renovables són el futur de la producció energètica. La pèrdua de biodiversitat amenaça l'equilibri dels ecosistemes. La conscienciació social és vital per impulsar canvis polítics.",
      "Aprendre un nou idioma obre moltes portes professionals i personals. El cervell es torna més àgil i flexible. Permet comunicar-se amb persones d'altres cultures. Cada llengua té una estructura i una sonoritat diferents. La immersió lingüística és el mètode més eficaç. La tecnologia ofereix moltes eines per practicar. L'anglès és considerat l'idioma internacional actual.",
      "L'amistat és una de les relacions humanes més valuoses. Els veritables amics es donen suport en els bons i mals moments. La confiança mútua és la base de qualsevol amistat sòlida. Requereix esforç i dedicació per mantenir-la viva. Compartir aficions i interessos enforteix el vincle. De vegades, les amistats canvien amb el pas del temps. És important ser honest i lleial amb els amics.",
      "Les grans ciutats ofereixen moltes oportunitats culturals i laborals. No obstant això, també pateixen problemes de contaminació i trànsit. La vida urbana sol ser molt ràpida i estressant. L'arquitectura dels edificis explica la història de la ciutat. El transport públic és essencial per a la mobilitat. Els parcs urbans són oasis de natura necessaris. Cada barri té la seva pròpia identitat i ambient.",
    ],
    dificil: [
      "La neurociència cognitiva contemporània investiga els substrats neurals subjacents als processos mentals superiors, com la memòria, l'atenció i la presa de decisions. Mitjançant tècniques de neuroimatge funcional, com la ressonància magnètica funcional (fMRI), els investigadors poden observar l'activació de xarxes cerebrals específiques en temps real. Aquests estudis han revelat la sorprenent plasticitat del cervell, fins i tot en edats adultes. La comprensió d'aquests mecanismes és fonamental per desenvolupar tractaments per a trastorns neurològics i psiquiàtrics. L'heterogeneïtat de les respostes individuals suggereix una interacció complexa entre la genètica i l'entorn. Els models computacionals intenten simular aquestes complexes interaccions dinàmiques. La recerca se centra ara en la connectivitat funcional, és a dir, com diferents regions col·laboren. L'ètica de la neurociència també és un camp de debat creixent, especialment pel que fa a la millora cognitiva. La interdisciplinarietat és, per tant, essencial per avançar en aquest camp fascinant. Queden per desxifrar els mecanismes precisos de la consciència subjectiva.",
      "La globalització econòmica ha reconfigurat les dinàmiques de producció i consum a escala planetària, establint cadenes de subministrament altament optimitzades però vulnerables. Aquest model interdependent ha facilitat un creixement sense precedents en algunes regions, tot exacerbant les desigualtats estructurals en altres. Les crisis financeres recents han demostrat la rapidesa amb què els xocs locals poden propagar-se sistèmicament. Els organismes multilaterals intenten regular aquests fluxos de capital volàtils amb un èxit limitat. La transició cap a una economia verda presenta un altre desafiament estructural que requereix inversions massives. La digitalització i l'economia de plataformes estan transformant els mercats laborals tradicionals. Les tensions geopolítiques afegeixen una capa addicional d'incertesa al comerç internacional. Els economistes debaten sobre la sostenibilitat a llarg termini d'aquest model d'hiperconnexió. L'anàlisi de dades massives (Big Data) s'ha convertit en una eina crucial per predir tendències macroeconòmiques. Calen nous marcs teòrics per abordar la complexitat d'aquesta nova realitat econòmica.",
      "La mecànica quàntica descriu el comportament de la matèria i l'energia a escales subatòmiques, revelant una realitat contraintuïtiva que desafia la nostra percepció clàssica. Principis fonamentals com la superposició i l'entrellaçament (entanglement) no tenen anàlegs en el món macroscòpic. El principi d'incertesa de Heisenberg estableix límits inherents a la precisió amb què podem conèixer simultàniament certes propietats d'una partícula. L'equació de Schrödinger governa l'evolució temporal de la funció d'ona, una descripció probabilística de l'estat d'un sistema. Aquestes idees han permès el desenvolupament de tecnologies revolucionàries com els làsers i els transistors. Actualment, la computació quàntica promet resoldre problemes inabordables per als ordinadors clàssics. Els reptes tècnics, com la decoherència, són immensos però s'estan aconseguint progressos significatius. La interpretació filosòfica d'aquests postulats continua sent objecte d'intens debat entre els físics teòrics. La recerca de la gravetat quàntica intenta unificar aquest marc amb la relativitat general d'Einstein. L'experimentació en acceleradors de partícules continua posant a prova els límits del Model Estàndard.",
"L'arquitectura gòtica, que va florir a Europa durant l'Alta i Baixa Edat Mitjana, es caracteritza per elements estructurals distintius com l'arc ogival, la volta de creueria i els contraforts volants. Aquestes innovacions van permetre construir edificis, especialment catedrals, d'una alçada i lluminositat sense precedents, simbolitzant l'aspiració espiritual. Els vitralls policromats van adquirir un paper central, no només com a element decoratiu, sinó com a mitjà narratiu per instruir una població majoritàriament analfabeta. L'anàlisi estructural d'aquests edificis revela un coneixement empíric sofisticat de la distribució de càrregues. La transició del romànic al gòtic no va ser uniforme, presentant nombroses variacions regionals. L'escolàstica, el corrent filosòfic dominant de l'època, es reflecteix en l'ordre i la complexitat lògica d'aquestes estructures. Els gremis d'artesans, com paletes i mestres vidriers, van assolir un alt grau d'especialització tècnica. Aquest estil va transcendir l'arquitectura religiosa, influint en palaus i edificis civils. La seva revalorització durant el neogòtic al segle XIX demostra el seu impacte perdurable. L'estudi detallat d'aquests monuments continua oferint noves perspectives sobre la societat medieval.",
      "La política monetària, executada pels bancs centrals, és una eina macroeconòmica fonamental per a la gestió de l'estabilitat de preus i el foment del creixement econòmic. El seu principal instrument sol ser la fixació dels tipus d'interès oficials, que influeixen en el cost del crèdit a tota l'economia. En períodes d'inflació elevada, el banc central pot optar per una política restrictiva, apujant els tipus per refredar la demanda agregada. Per contra, en una recessió, s'aplica una política expansiva, reduint els tipus per estimular la inversió i el consum. Recentment, davant la trampa de liquiditat, s'han popularitzat eines no convencionals, com l'expansió quantitativa (Quantitative Easing). Aquesta consisteix en la compra massiva de deute públic o privat per injectar liquiditat al sistema financer. La independència del banc central respecte al poder polític és considerada crucial per garantir la credibilitat de les seves accions. Els mecanismes de transmissió de la política monetària a l'economia real són complexos i operen amb retards significatius. L'objectiu d'inflació (inflation targeting) és el marc operatiu més comú actualment. Els mandats duals, que inclouen també la plena ocupació, presenten reptes addicionals de calibratge. L'era digital i les criptomonedes plantegen nous desafiaments per al control monetari tradicional.",
    ],
  },

  animals: {
    facil: [
      "El lleó és el rei de la selva. Té una gran cabellera. Viu a la sabana africana. Caça altres animals per menjar. Els lleons petits juguen molt.",
      "Les formigues són insectes petits. Treballen molt en equip. Construeixen grans formiguers sota terra. Transporten fulles i menjar. Són molt fortes.",
      "Els dofins viuen al mar. Salten fora de l'aigua. Són animals molt intel·ligents. Neden en grups. Fan sorolls per comunicar-se.",
      "L'àguila vola molt alt. Té una vista excel·lent. Caça des de l'aire. Té urpes fortes. Fa el seu niu a les muntanyes.",
      "La tortuga camina a poc a poc. Porta la seva casa a l'esquena. Pot viure molts anys. Algunes neden al mar. Ponen ous a la sorra.",
      "Les granotes són amfibis. Poden viure a l'aigua i a la terra. Salten molt lluny. Mengem insectes amb la llengua. Fan un soroll que es diu 'raucar'.",
      "L'elefant és un animal enorme. Té una trompa molt llarga. La fa servir per agafar coses. També té unes orelles grans. Li agrada banyar-se.",
      "Els pingüins viuen al fred. No poden volar. Són grans nedadors. Caminen de manera divertida. Mengem peixos del mar.",
      "El cavall corre molt ràpid. La gent el munta. Menja herba i civada. Viu a les granges. Fa un so que es diu 'renillar'.",
      "La papallona té ales de colors. Vola de flor en flor. Abans era una eruga. Li agrada el sol. És un insecte molt bonic.",
    ],
    normal: [
      "Les girafes destaquen pel seu coll extremadament llarg, una adaptació evolutiva per assolir les fulles més altes dels arbres. Malgrat la seva longitud, el coll té només set vèrtebres cervicals, igual que els humans. Són els remugants més alts del món. El seu pelatge tacat els proporciona un camuflatge eficaç a la sabana africana. Es comuniquen amb infrasons, sons de baixa freqüència que els humans no podem sentir. La seva llengua prènsil és de color fosc per evitar cremades solars. Viuen en grups socials no gaire cohesionats i passen gran part del dia menjant.",
      "Les abelles són insectes socials vitals per a la pol·linització de nombrosos cultius. Viuen en colònies altament organitzades, anomenades ruscos, amb una estructura jeràrquica clara. Hi ha una reina, obreres (femelles estèrils) i abellots (mascles). Les obreres realitzen totes les tasques: des de buscar nèctar fins a defensar el rusc. Es comuniquen la ubicació de les flors mitjançant una complexa dansa. La producció de mel és el seu mètode per emmagatzemar aliment per a l'hivern. La seva supervivència està amenaçada per factors com els pesticides i el canvi climàtic.",
      "El camuflatge és una estratègia de supervivència clau en el regne animal. Permet als animals amagar-se dels depredadors o, al contrari, apropar-se a les preses sense ser detectats. Existeixen diferents tipus, com la cripsi, que consisteix a assemblar-se a l'entorn. Un altre exemple és el mimetisme, on una espècie imita l'aparença d'una altra més perillosa. Alguns animals, com el camaleó o el pop, poden canviar activament el seu color i textura. Aquesta adaptació és el resultat de milions d'anys de selecció natural. La lluita per la supervivència ha generat solucions visuals sorprenents.",
      "Els primats són un ordre de mamífers que inclou els lèmurs, els micos i els grans simis, inclosos els humans. La majoria viuen en regions tropicals o subtropicals. Es caracteritzen per tenir cervells relativament grans i una bona visió estereoscòpica. Tenen mans i peus adaptats per agafar objectes, amb polzes sovint oposables. Són animals molt socials, amb estructures de grup complexes. La comunicació vocal i gestual és fonamental en les seves interaccions. Moltes espècies de primats estan actualment en perill d'extinció. La desforestació és la seva amenaça principal.",
      "La migració animal és un fenomen estacional que implica el desplaçament massiu de poblacions. Els animals es mouen des dels seus llocs de cria cap a zones d'alimentació o hibernació. Aquests viatges poden cobrir milers de quilòmetres, com en el cas de la balena grisa o l'estèrn àrtic. Els animals s'orienten utilitzant el sol, les estrelles, el camp magnètic terrestre o l'olfacte. Aquest comportament instintiu requereix una despesa energètica enorme. Els canvis en el clima poden alterar aquestes rutes ancestrals. La conservació d'aquests corredors migratoris és essencial.",
      "Els coralls, malgrat semblar plantes, són en realitat colònies de petits animals anomenats pòlips. Aquests organismes marins construeixen estructures calcàries massives conegudes com a esculls. Els esculls de corall són un dels ecosistemes més diversos del planeta. Proporcionen refugi i aliment a milers d'espècies marines. Molts pòlips viuen en simbiosi amb unes microalgues anomenades zooxantel·les. Aquestes algues els donen color i els proporcionen nutrients mitjançant la fotosíntesi. L'augment de la temperatura de l'aigua provoca el 'blanquejament' del corall. Aquest fenomen amenaça la supervivència dels esculls a tot el món.",
      "Els ossos polars estan perfectament adaptats a la vida a l'Àrtic. El seu pelatge blanc els camufla a la neu, tot i que la seva pell és negra. Tenen una capa de greix molt gruixuda que els aïlla del fred extrem. Són nedadors excel·lents i poden recórrer llargues distàncies entre plaques de gel. La seva dieta principal es basa en les foques, que cacen esperant-les als forats de respiració. El canvi climàtic està reduint dràsticament el seu hàbitat de gel marí. Això dificulta la seva capacitat per caçar i els posa en perill. Són considerats una espècie vulnerable.",
      "El llop és un depredador social que viu en estructures familiars anomenades llopades. Aquestes llopades tenen una jerarquia estricta, liderada per una parella alfa reproductora. Cacen de forma coordinada per abatre preses grans, com cérvols o ants. La seva comunicació es basa en udols, llenguatge corporal i senyals olfactius. Els udols serveixen per reunir la llopada i marcar el territori. Van ser perseguits pels humans durant segles, però ara estan sent reintroduïts en alguns hàbitats. Com a depredadors superiors, juguen un paper clau en l'equilibri dels ecosistemes.",
    ],
    dificil: [
      "L'ornitorrinc (Ornithorhynchus anatinus) representa una anomalia evolutiva fascinant, sent un mamífer monotrema endèmic de l'est d'Austràlia. Aquesta espècie semiaquàtica pon ous en lloc de donar a llum cries vives, una característica ancestral que comparteix amb els rèptils. A més, posseeix un bec similar al d'un ànec, però equipat amb milers d'electroreceptors sensibles per detectar els camps elèctrics de les preses sota l'aigua. Els mascles són verinosos, ja que disposen d'un agulló als turmells que pot inocular un verí potent. El seu genoma és un mosaic complex que presenta trets de mamífers, aus i rèptils. L'estudi del seu metabolisme revela una termoregulació menys eficient que la dels mamífers placentaris. La seva singularitat biològica desafia les classificacions taxonòmiques tradicionals. La conservació del seu hàbitat fluvial és crucial davant l'expansió urbana i la sequera. L'anàlisi de la seva lactància, que es produeix sense mugrons a través de porus a la pell, ofereix pistes sobre l'evolució primerenca dels mamífers. La seva fisiologia única el converteix en un subjecte d'estudi primordial per a la biologia evolutiva.",
      "La bioacústica marina estudia els sons produïts pels animals marins i la seva importància ecològica i conductual. Els cetacis, com les balenes i els dofins, han desenvolupat sistemes de comunicació acústica altament sofisticats. Les balenes geperudes, per exemple, produeixen cants llargs i complexos que evolucionen culturalment cada temporada d'aparellament. Els odontocets, o cetacis dentats, utilitzen l'ecolocalització (biosonar) per navegar i caçar en aigües tèrboles. Aquest sistema consisteix a emetre clics d'alta freqüència i interpretar-ne els ecos. L'augment del soroll antropogènic als oceans, provinent del trànsit marítim i les prospeccions sísmiques, interfereix greument amb aquestes comunicacions. Aquesta contaminació acústica pot provocar desorientació, estrès crònic i fins i tot danys físics en els mamíers marins. La investigació en aquest camp utilitza hidròfons i algorismes d'aprenentatge automàtic per desxifrar aquests llenguatges aquàtics. La comprensió d'aquestes vocalitzacions és vital per implementar mesures de conservació efectives. La complexitat d'aquests senyals suggereix nivells de cognició social encara poc compresos.",
      "El pop (Octopoda) exhibeix un nivell d'intel·ligència i plasticitat conductual extraordinari entre els invertebrats, rivalitzant en certs aspectes amb alguns vertebrats. El seu sistema nerviós és extremadament gran i distribuït, amb una majoria de neurones situades als seus vuit braços. Cada braç posseeix una autonomia considerable, capaç de processar informació sensorial i executar moviments complexos sense intervenció directa del cervell central. Són mestres del camuflatge, capaços de canviar instantàniament el color i la textura de la seva pell gràcies a cèl·lules especialitzades anomenades cromatòfors. Aquesta habilitat s'utilitza tant per a la cripsi com per a la comunicació social. Han demostrat en experiments de laboratori una notable capacitat d'aprenentatge per observació i la resolució de laberints complexos. La seva curta esperança de vida, però, limita l'acumulació de coneixement individual. No tenen esquelet, la qual cosa els permet passar per escletxes minúscules. La seva fisiologia, basada en l'hemocianina (una proteïna de transport d'oxigen basada en coure), és única. L'estudi de la seva cognició desafia les nostres concepcions antropocèntriques sobre l'evolució de la intel·ligència. La seva capacitat per utilitzar eines, com closques de coco per refugiar-se, és un indicador d'habilitats cognitives avançades.",
      "Els insectes socials, com les formigues, les termites i certes abelles, han desenvolupat estructures societàries d'una complexitat sorprenent, basades en l'eusocialitat. Aquest sistema es defineix per la cura cooperativa de la descendència, la superposició de generacions dins la colònia i una divisió del treball reproductiu. La majoria dels individus de la colònia són castes estèrils (obreres) que treballen en benefici d'una elit reproductora (reines). Aquest aparent altruisme reproductiu va ser un trencaclosques per a Darwin, resolt posteriorment per la teoria de la selecció de parentiu de W.D. Hamilton. Les obreres, en ser altament emparentades, maximitzen la seva aptitud inclusiva (inclusive fitness) ajudant a criar les seves germanes en lloc de reproduir-se elles mateixes. Aquestes colònies funcionen com a 'superorganismes', on la selecció natural actua a nivell de colònia. La comunicació química, mitjançant feromones, és el pilar fonamental que cohesiona aquestes societats. Aquestes substàncies regulen comportaments com la recerca d'aliment, l'alarma o el reconeixement de membres. L'arquitectura dels seus nius, com els termiters, presenta solucions d'enginyeria sofisticades per a la termoregulació i la defensa. L'estudi d'aquests sistemes ofereix paral·lelismes fascinants amb l'organització de sistemes complexos.",
      "La bioluminescència és el procés mitjançant el qual els organismes vius produeixen i emeten llum, un fenomen que ha evolucionat de manera independent en múltiples llinatges. Aquesta 'llum freda' és el resultat d'una reacció química on una molècula (luciferina) és oxidada per un enzim (luciferasa). Aquesta adaptació és especialment prevalent en l'oceà profund, on la llum solar no arriba. Allà, compleix funcions vitals com l'atracció de preses, la defensa contra depredadors (com en el calamar que expulsa tinta lluminosa) o la comunicació per a l'aparellament. En alguns casos, com el del peix pescador (anglerfish), la llum és produïda per bacteris simbiòtics que viuen en un apèndix especialitzat. A terra, l'exemple més conegut són les cuques de llum, que utilitzen patrons de parpelleig específics per a la selecció sexual. La diversitat de luciferines i luciferases indica una convergència evolutiva notable. La investigació biotecnològica ha aprofitat aquests sistemes, utilitzant-los com a marcadors genètics en recerca biomèdica. L'eficiència quàntica d'aquestes reaccions és extremadament alta, convertint gairebé tota l'energia en llum en lloc de calor. L'estudi d'aquests mecanismes revela la increïble creativitat de l'evolució en entorns extrems.",
      "L'ecologia tròfica estudia les relacions alimentàries entre les espècies dins d'un ecosistema, és a dir, qui menja a qui. Aquestes interaccions determinen el flux d'energia i nutrients a través de la xarxa tròfica. Els organismes es classifiquen en nivells tròfics: productors (plantes), consumidors primaris (herbívors), consumidors secundaris (carnívors) i descomponedors. La pèrdua d'un depredador superior (top-down control) pot desencadenar una 'cascada tròfica'. Aquest fenomen es va observar a Yellowstone amb la reintroducció dels llops, que va canviar el comportament dels ants i va permetre la recuperació dels boscos de ribera. Alternativament, la disponibilitat de nutrients a la base (bottom-up control) també regula la biomassa dels nivells superiors. La complexitat d'aquestes xarxes proporciona estabilitat a l'ecosistema. Tanmateix, les espècies invasores poden alterar dràsticament aquestes connexions establertes. L'ús d'isòtops estables en l'anàlisi de teixits animals permet als ecòlegs determinar la dieta precisa i la posició tròfica d'un individu. Aquesta informació és crucial per a la gestió de la conservació i la comprensió dels impactes humans sobre la biodiversitat.",
    ],
  },

  "pel·licules": {
    facil: [
      "Ahir vaig veure una pel·lícula. Era de pirates. Tenien un vaixell molt gran. Buscaven un tresor amagat. Al final el van trobar. Va ser molt emocionant.",
      "M'agraden les pel·lícules de riure. Els actors fan coses molt gracioses. Tota la sala del cinema riu. Sempre menjo crispetes. Són les meves preferides.",
      "Els superherois porten capa. Tenen poders especials. Salven el món dels dolents. Volen molt ràpid. Són molt forts i valents.",
      "A casa mirem pel·lícules al sofà. Ens tapem amb una manta. Apaguem els llums. És com un cinema petit. És un pla molt divertit.",
      "La meva pel·lícula preferida és de dibuixos. Els animals parlen i canten. Els colors són molt bonics. La música és alegre. L'he vista moltes vegades.",
      "Avui hem anat al cinema. La pantalla era gegant. El so era molt fort. Hem comprat les entrades abans. Hi havia molta gent a la sala.",
      "Les pel·lícules de por fan por. De vegades surten monstres. La gent crida a la sala. Jo tanco els ulls. Després no puc dormir bé.",
      "M'agraden les pel·lícules de l'espai. Surten naus espacials i planetes. Els astronautes viatgen lluny. És un món molt diferent. Són pel·lícules de ciència-ficció.",
      "El director diu 'acció'. Els actors comencen a actuar. Porten vestits diferents. El càmera ho grava tot. Fer una pel·lícula és difícil.",
      "Hi ha pel·lícules antigues. Són en blanc i negre. Els actors no parlaven. La música era molt important. Els meus avis les veien.",
    ],
    normal: [
      "El gènere del cinema negre (film noir) va ser molt popular als Estats Units durant els anys quaranta i cinquanta. Aquestes pel·lícules es caracteritzen per una il·luminació en clarobscur, plena d'ombres i contrastos forts. L'atmosfera que creen és generalment pessimista i cínica. L'argument sol girar al voltant d'un crim. El protagonista és sovint un detectiu privat cansat del món. La 'femme fatale' és un altre arquetip comú, una dona seductora, misteriosa i perillosa. Aquest estil visual reflectia l'ansietat i el desencant de la societat de la postguerra.",
      "L'animació 'stop-motion' és una tècnica cinematogràfica que requereix una paciència extrema. Consisteix a fotografiar objectes o ninots, moure'ls lleugerament i tornar-los a fotografiar. Cada segon de pel·lícula necessita vint-i-quatre d'aquestes fotografies individuals (fotogrames). Els animadors han de manipular els models amb una precisió mil·limètrica. Directors com Tim Burton o l'estudi Aardman són famosos per utilitzar aquesta tècnica artesanal. Encara que la tecnologia digital ha avançat, l''stop-motion' conserva un encant visual únic i tangible. El procés pot durar anys per a un sol llargmetratge.",
      "Les bandes sonores són un component essencial de l'experiència cinematogràfica. La música té el poder de subratllar les emocions d'una escena, ja sigui tensió, alegria o tristesa. Un 'leitmotiv' és un tema musical recurrent associat a un personatge o idea específica. Compositors com John Williams o Ennio Morricone han creat melodies que són reconegudes a l'instant. De vegades, el silenci estratègic pot ser tan efectiu com la música més èpica. La banda sonora guia l'espectador sense que aquest se n'adoni. La tria de cançons preexistents també pot definir l'època i el to d'un film.",
      "El guió cinematogràfic és el pla mestre sobre el qual es construeix tota la pel·lícula. No és només diàleg, sinó que descriu les accions, els escenaris i l'atmosfera. L'estructura clàssica de tres actes (plantejament, nus i desenllaç) és la més utilitzada. Un bon guió ha de crear conflicte i desenvolupar els personatges de manera creïble. Els guionistes sovint treballen durant mesos o anys en una sola història. El format del guió és molt tècnic i específic per a la indústria. Moltes pel·lícules considerades clàssiques deuen el seu èxit a un guió sòlid i ben estructurat.",
      "Els efectes especials (FX) han revolucionat la indústria del cinema des dels seus inicis. Al principi, s'aconseguien amb trucs de càmera, maquetes i efectes pràctics. Pel·lícules com 'Metropolis' o 'King Kong' van ser pioneres en tècniques visuals. Amb l'arribada de la tecnologia digital, els 'efectes visuals' (VFX) han pres el relleu. La 'imatgeria generada per ordinador' (CGI) permet crear mons i criatures impossibles. Tanmateix, molts directors encara prefereixen la sensació tangible dels efectes pràctics. La clau és barrejar ambdues tècniques de manera que siguin invisibles per a l'espectador.",
      "El 'cinema independent' es defineix per produir-se fora dels grans estudis de Hollywood. Aquestes pel·lícules solen tenir pressupostos molt més baixos. Això obliga els creadors a ser més enginyosos i creatius. Sovint, el cinema independent aborda temes més arriscats, personals o controvertits que el cinema comercial. Festivals com Sundance o Cannes són plataformes clau per donar a conèixer aquestes obres. Molts directors de renom van començar la seva carrera en el circuit independent. Tot i les dificultats de finançament, ofereix una llibertat artística més gran.",
      "La direcció de fotografia és l'art de crear la imatge visual d'una pel·lícula. El director de fotografia és el responsable de la il·luminació, l'enquadrament i l'elecció de lents. Col·labora estretament amb el director per traduir la visió narrativa en imatges. La llum pot ser càlida o freda per transmetre diferents estats d'ànim. La composició de cada pla està curosament planificada. L'ús del color (o la seva absència) és una decisió estètica fonamental. Un bon treball de fotografia pot elevar una història senzilla a la categoria d'art.",
    ],
    dificil: [
      "La teoria del cinema d'autor (politique des auteurs), promoguda per la revista francesa Cahiers du Cinéma als anys cinquanta, va redefinir la crítica cinematogràfica. Aquesta perspectiva postula que el director és l'autor principal i la força creativa central d'un film, anàleg a un novel·lista o pintor. S'analitza la filmografia completa d'un director buscant una 'mise-en-scène' (posada en escena) coherent, un estil visual distintiu i temes recurrents. Directors de Hollywood prèviament considerats simples artesans, com Alfred Hitchcock o Howard Hawks, van ser revaloritzats com a artistes complexos. Aquesta teoria va influir directament en els cineastes de la Nouvelle Vague francesa, com Jean-Luc Godard o François Truffaut. Ells van aplicar aquests principis a les seves pròpies creacions, trencant les convencions narratives establertes. Els crítics posteriors, especialment els estructurals i feministes, van qüestionar l'èmfasi excessiu en el director, assenyalant la naturalesa intrínsecament col·laborativa del mitjà cinematogràfic. Tanmateix, el concepte d'autor, encara que matisat, continua sent una eina analítica fonamental en els estudis fílmics contemporanis. La tensió entre l'autoria individual i la producció industrial segueix sent un debat central. La noció de 'càmera-stylo' d'Astruc va prefigurar aquesta idea de la càmera com a eina d'expressió personal.",
      "El muntatge cinematogràfic, o edició, és sovint descrit com el llenguatge invisible del cinema, l'art de juxtaposar plans per crear significat, ritme i continuïtat narrativa. Teòrics soviètics com Lev Kuleixov i Serguei Eisenstein van ser els primers a explorar el seu poder psicològic. L''efecte Kuleixov' va demostrar que la percepció de l'actuació d'un actor canviava radicalment segons el pla que se li juxtaposava, fos un plat de sopa o un taüt. Eisenstein va desenvolupar la teoria del 'muntatge d'atraccions', defensant una col·lisió de plans per generar idees intel·lectuals en l'espectador, en lloc de la continuïtat fluida de Hollywood. El muntatge clàssic (o edició de continuïtat) busca ser invisible, preservant la il·lusió de temps i espai reals mitjançant tècniques com el 'raccord' o l'eix de mirades. En canvi, el muntatge modern, influenciat per la Nouvelle Vague, sovint utilitza 'jump cuts' (salts d'eix) per desorientar conscientment l'espectador. El ritme de l'edició, ja sigui lent i contemplatiu o frenètic i ràpid, és crucial per establir el to de la pel·lícula. L'editor és, en essència, el darrer escriptor del guió, donant forma final al material filmat.",
      "La semiòtica cinematogràfica, iniciada per teòrics com Christian Metz, aplica els principis de la lingüística estructural de Saussure a l'anàlisi fílmica. Aquest enfocament no tracta el cinema com un llenguatge (langue), sinó com un llenguatge artístic (langage) que utilitza codis específics per generar significat. Metz va intentar identificar la 'gran sintagmàtica', una gramàtica dels tipus de seqüències de plans possibles (com el pla-seqüència o el muntatge alternat). L'anàlisi semiòtica descompon el film en els seus 'signes' constituents, diferenciant entre elements icònics (la semblança visual), indicials (la connexió física, com el fum) i simbòlics (els significats culturals arbitraris). L'objectiu és desxifrar com la combinació d'imatges, sons, música i muntatge construeix sistemes de significació complexos. Aquesta metodologia s'allunya de la simple crítica avaluativa (si una pel·lícula és 'bona' o 'dolenta') per centrar-se en els mecanismes subjacents de producció de sentit. Va ser un camp particularment influent en els estudis cinematogràfics dels anys seixanta i setanta. Encara que posteriorment criticada per la seva rigidesa estructuralista, va establir les bases per a anàlisis més contextuals, com les psicoanalítiques o les ideològiques. La semiòtica ens ensenya a 'llegir' una pel·lícula amb una consciència més profunda dels seus artificis.",
      "La fenomenologia del cinema és una branca de la teoria cinematogràfica que s'enfoca en l'experiència corporitzada i perceptiva de l'espectador davant la pantalla. En lloc de centrar-se en l'anàlisi textual o ideològica, s'interessa per com el film interpel·la els nostres sentits i la nostra consciència pre-reflexiva. Teòrics com Vivian Sobchack, inspirant-se en Merleau-Ponty, argumenten que l'espectador té una doble percepció: percebem el món 'a' la pantalla i, simultàniament, percebem l'acte mateix de percebre aquestes imatges. El cinema, per tant, no és només un objecte d'estudi, sinó un subjecte que 'mira' i 'sent' amb nosaltres. Aquesta perspectiva emfatitza la materialitat de la imatge: la textura, el moviment de la càmera i el ritme del muntatge no només 'signifiquen' coses, sinó que es 'senten' físicament. Per exemple, una càmera en mà tremolosa transmet una sensació visceral d'immediatesa i ansietat. L'anàlisi fenomenològica valora la sinestèsia, la capacitat del so de modificar la nostra percepció de la imatge i viceversa. Aquesta teoria revaloritza l'aspecte afectiu i somàtic de l'experiència cinematogràfica. Considera la sala de cinema com un espai on els cossos de la pel·lícula i de l'espectador entren en un diàleg perceptiu complex. Aquest enfocament ha guanyat terreny com a alternativa als models d'anàlisi dominats pel text i la representació.",
      "El disseny de so en el cinema contemporani és una disciplina artística complexa que va molt més enllà de la simple gravació del diàleg. Es considera que el so és, com a mínim, el cinquanta per cent de l'experiència fílmica, operant sovint a nivell subliminal. Teòrics com Michel Chion han encunyat termes com 'acusmàtic' per descriure el so que se sent sense que se'n vegi la font, generant misteri o poder. El dissenyador de so construeix el paisatge sonor (soundscape) complet, que inclou el diàleg, la música (score), els efectes de so (FX) i l'ambient (room tone). Els artistes 'foley' són essencials, recreant de manera artesanal sons sincronitzats com passos, frecs de roba o cops. El so 'diegètic' és aquell que pertany al món de la pel·lícula (una ràdio sonant), mentre que el so 'no-diegètic' és extern (la banda sonora). Directors com David Lynch utilitzen el disseny de so de manera expressiva, creant atmosferes inquietants amb sons industrials de baixa freqüència. La mescla de so envoltant (com el Dolby Atmos) permet posicionar el so en un espai tridimensional, augmentant la immersió. El silenci s'utilitza estratègicament per crear tensió dramàtica. Un disseny de so efectiu guia l'atenció de l'espectador i transmet emoció de manera invisible.",
    ],
  },

  programacio: {
    facil: [
      "El meu mòbil té una pantalla. Puc trucar als meus pares. També fa fotos. M'agrada jugar amb les apps. S'ha de carregar cada nit. S'ha trencat un cop.",
      "Un ordinador té un teclat. Té molts botons amb lletres. Serveix per escriure. El ratolí mou la fletxa. M'agrada fer dibuixos.",
      "Una pàgina web té text. També té imatges i botons. Fem clic als enllaços. Ens porta a altres pàgines. És com llegir un llibre interactiu.",
      "El robot de la cuina fa menjar. Li dono els ingredients. Ell barreja i cou. És una màquina molt útil. M'estalvia molta feina.",
      "El codi són instruccions. L'ordinador les llegeix. Li diuen què ha de fer. És com un idioma especial. S'ha d'escriure amb cura.",
      "M'agraden els videojocs. Tinc una consola. Jugo amb els meus amics. Passem de nivell. El personatge salta i corre.",
      "Internet connecta el món. Puc buscar informació. Miro vídeos divertits. Parlo amb la meva àvia. És una xarxa molt gran.",
      "El correu electrònic és ràpid. Escric un missatge. L'envio a un amic. Ell el rep a l'instant. És millor que una carta.",
    ],
    normal: [
      "El llenguatge de programació Python ha guanyat una immensa popularitat en l'última dècada. La seva sintaxi clara, llegible i propera a l'anglès el fa ideal per a principiants. S'utilitza en una àmplia gamma d'aplicacions, des del desenvolupament web (amb 'frameworks' como Django) fins a la ciència de dades. Moltes biblioteques potents, com NumPy o Pandas, faciliten tasques matemàtiques i anàlisi de dades complexes. La seva comunitat de desenvolupadors és molt gran i activa, oferint molt de suport. La gestió de memòria és automàtica, cosa que simplifica el codi. Tot i ser un llenguatge interpretat, el seu rendiment és suficient per a la majoria de tasques.",
      "Un 'framework' de desenvolupament web és una estructura de programari que simplifica la creació d'aplicacions web. Proporciona un conjunt d'eines i biblioteques que resolen problemes comuns. Per exemple, gestiona les rutes (URLs), l'accés a bases de dades i la seguretat. Això permet als desenvolupadors centrar-se en la lògica específica de la seva aplicació. Hi ha 'frameworks' per al 'backend' (costat del servidor), com Express o Laravel, i per al 'frontend' (costat del client), com React o Angular. L'ús d'un 'framework' accelera el desenvolupament i promou bones pràctiques de codi. L'elecció del 'framework' adequat depèn de les necessitats del projecte.",
      "Git és un sistema de control de versions distribuït, essencial en el desenvolupament de programari modern. Permet als equips de programadors treballar en el mateix projecte simultàniament. Cada desenvolupador té una còpia completa de l'historial del projecte. Git registra cada canvi fet al codi, permetent tornar a versions anteriors si alguna cosa falla. Facilita la creació de 'branques', que són línies de desenvolupament independents. Així, es poden provar noves funcionalitats sense afectar el codi principal. Un cop la funcionalitat està llesta, es fusiona (merge) amb la branca principal. Plataformes com GitHub o GitLab faciliten l'allotjament i la col·laboració en aquests projectes.",
      "Una API (Interfície de Programació d'Aplicacions) actua com un contracte o un pont entre dues peces de programari. Permet que diferents aplicacions es comuniquin i comparteixin dades entre elles. Per exemple, quan una aplicació mòbil del temps mostra la previsió, està utilitzant una API per demanar aquestes dades a un servidor meteorològic. Les API defineixen les regles: quines peticions es poden fer i quin format tindrà la resposta. Les API REST, que utilitzen HTP, són les més comunes actualment. Aquest model ha permès la creació d'ecosistemes d'aplicacions interconnectades. La seguretat, mitjançant claus (API keys), és fonamental per controlar l'accés.",
      "Les bases de dades relacionals han estat l'estàndard de la indústria durant dècades. Organitzen la informació en taules, que estan compostes per files i columnes. Cada fila representa un registre (com un usuari) i cada columna un atribut (com el nom o l'email). La 'relació' prové de la capacitat de vincular dades entre diferents taules mitjançant claus (keys). S'utilitza el llenguatge SQL (Structured Query Language) per consultar, inserir o modificar aquestes dades. Aquest model garanteix la integritat i consistència de les dades mitjançant transaccions (propietats ACID). Exemples populars inclouen MySQL, PostgreSQL o SQL Server.",
      "El 'Frontend' i el 'Backend' són els dos pilars del desenvolupament web. El 'frontend' és la part que l'usuari veu i amb la qual interactua: la interfície gràfica. Es construeix principalment amb HTML (estructura), CSS (estil) i JavaScript (interactivitat). Els dissenyadors s'asseguren que sigui intuïtiu i atractiu. El 'backend', en canvi, és el costat del servidor, invisible per a l'usuari. S'encarrega de la lògica de negoci, l'autenticació d'usuaris i la connexió amb la base de dades. Utilitza llenguatges com Python, Java o Node.js. Ambdós costats es comuniquen constantment per oferir una experiència fluida.",
      "La ciberseguretat és la pràctica de protegir sistemes, xarxes i dades d'atacs digitals. Aquests atacs busquen accedir, modificar o destruir informació sensible. Les tècniques d'atac són variades, incloent el 'phishing' (suplantació d'identitat), el 'malware' (programari maliciós) o els atacs de denegació de servei (DDoS). Una bona defensa implica múltiples capes. Això inclou 'firewalls' (tallafocs), programari antivirus i polítiques de contrasenyes robustes. L'autenticació de dos factors (2FA) afegeix una capa addicional de seguretat. La formació dels usuaris és crucial, ja que l'error humà és sovint el punt més feble.",
    ],
    dificil: [
      "La programació funcional és un paradigma de programació que tracta la computació com l'avaluació de funcions matemàtiques i evita l'ús de dades en estat mutable. Es basa en funcions 'pures', que donada la mateixa entrada, sempre retornaran la mateixa sortida, sense causar efectes secundaris (side effects) observables. Aquest enfocament promou la immutabilitat, on les estructures de dades no es modifiquen un cop creades, sinó que es generen noves versions. Llenguatges com Haskell són purament funcionals, mentre que altres, com JavaScript o Python, han incorporat conceptes funcionals (com funcions d'ordre superior i expressions lambda). Aquest paradigma facilita la concurrència i el paral·lelisme, ja que l'absència d'estat compartit mutable elimina molts problemes de sincronització. La composició de funcions es converteix en l'eina principal per construir lògica complexa. Conceptes com els 'mònades' (monads) s'utilitzen per gestionar efectes secundaris, com l'entrada/sortida, de manera controlada i pura. La seva adopció en sistemes distribuïts i d'anàlisi de dades massives (Big Data) ha crescut exponencialment. L'ús de la recursivitat és preferit per sobre de les estructures iteratives (bucles) tradicionals. La verificació formal del codi també resulta més senzilla gràcies a la seva base matemàtica.",
      "L'arquitectura de microserveis ha emergit com un paradigma dominant per al disseny d'aplicacions empresarials escalables i resilients. Aquest enfocament descompon una aplicació monolítica complexa en un conjunt de serveis petits, autònoms i feblement acoblats. Cada servei s'executa en el seu propi procés i es comunica amb els altres mitjançant API lleugeres, sovint sobre HTP/REST o protocols de missatgeria asíncrona. Aquesta granularitat permet que equips independents desenvolupin, despleguin i escalin els seus serveis de manera autònoma. L'ús de contenidors, com Docker, i orquestradors, com Kubernetes, ha estat fonamental per gestionar la complexitat operativa d'aquest model. No obstant això, l'arquitectura de microserveis introdueix nous reptes significatius. La gestió de la comunicació entre serveis, la latència de xarxa i la consistència de dades distribuïdes (utilitzant patrons com 'Saga') són problemes no trivials. El concepte de 'service mesh' (malla de serveis), com Istio o Linkerd, ha sorgit per gestionar la seguretat, l'observabilitat i la fiabilitat de les comunicacions a nivell d'infraestructura. La implementació de patrons de resiliència com el 'Circuit Breaker' és essencial per evitar fallades en cascada. La transició d'un monòlit a microserveis requereix una planificació estratègica acurada i una maduresa organitzativa en pràctiques DevOps.",
      "L'aprenentatge profund (Deep Learning) és una subbranca de l'aprenentatge automàtic (Machine Learning) basada en xarxes neuronals artificials amb múltiples capes (arquitectures profundes). Aquestes xarxes s'inspiren en l'estructura del cervell humà per aprendre representacions de dades de forma jeràrquica. Les xarxes neuronals convolucionals (CNN) han revolucionat el camp de la visió per computador, sent extremadament eficaces en el reconeixement d'imatges. Per la seva banda, les xarxes neuronals recurrents (RNN) i, més recentment, els 'Transformers' (basats en mecanismes d'atenció), dominen el processament del llenguatge natural (NLP). L'èxit del Deep Learning rau en la seva capacitat per aprendre automàticament característiques (features) rellevants directament des de grans volums de dades no estructurades, eliminant la necessitat d'enginyeria de característiques manual. L'entrenament d'aquests models massius requereix una potència computacional considerable, principalment a través d'unitats de processament gràfic (GPU) o TPU. El procés d'entrenament es realitza mitjançant l'algorisme de retropropagació (backpropagation) per ajustar milions de paràmetres (pesos) del model. L'optimització d'hiperparàmetres és un pas crucial per assolir un bon rendiment. Malgrat el seu èxit, la 'caixa negra' (black box) d'aquests models, és a dir, la dificultat per interpretar les seves decisions, continua sent un repte actiu de recerca.",
      "La gestió de la concurrència i el paral·lelisme és un dels reptes més complexos en el disseny de sistemes de programari moderns, especialment amb l'adveniment de les CPU multinucli. La concurrència es refereix a la capacitat d'un sistema de gestionar múltiples tasques que s'executen en períodes de temps superposats, encara que no necessàriament alhora. El paral·lelisme, en canvi, implica l'execució simultània real d'aquestes tasques, normalment en diferents nuclis de processador. Els problemes clàssics de concurrència sorgeixen de l'accés compartit a recursos mutables, donant lloc a condicions de cursa (race conditions) i punts morts (deadlocks). Els mecanismes tradicionals per gestionar-ho inclouen l'ús de semàfors, panys (locks) i monitors per garantir l'exclusió mútua. Tanmateix, aquests mecanismes són propensos a errors i difícils de raonar. Models més moderns, com el model d'actors (utilitzat a Erlang o Akka) o la comunicació mitjançant canals (com a Go), promouen l'estat no compartit (share nothing) i la transmissió de missatges. Els llenguatges funcionals, amb la seva èmfasi en la immutabilitat, eviten molts d'aquests problemes per defecte. L'ús de programació asíncrona, mitjançant 'futures' o 'promises' i 'async/await', permet gestionar operacions d'entrada/sortida (I/O) sense bloquejar el fil d'execució principal. La correcta implementació d'aquests patrons és vital per a l'escalabilitat i el rendiment dels sistemes actuals.",
      "Els sistemes de tipus (type systems) en els llenguatges de programació són un component fonamental que classifica les dades en categories (tipus) i aplica regles sobre com aquests tipus poden interactuar. L'objectiu principal és garantir la correcció del programa, prevenint errors en temps d'execució, com ara sumar un número a una cadena de text. Els llenguatges es poden classificar com a 'tipats estàticament' (com Java o C++), on les comprovacions de tipus es fan en temps de compilació, o 'tipats dinàmicament' (com Python o JavaScript), on es fan en temps d'execució. L'avantatge del tipat estàtic és la detecció primerenca d'errors i l'optimització del rendiment, a costa d'una major verbositat. El tipat dinàmic ofereix més flexibilitat i rapidesa en el prototipatge. Un altre eix de classificació és 'fort' vs 'feble'. Un tipat fort (com Python) impedeix mescles de tipus implícites, mentre que un de feble (com JavaScript) realitza conversions automàtiques (coercions) que poden ser font d'errors subtils. Sistemes de tipus més avançats, com els presents a Haskell o Rust, inclouen conceptes com la inferència de tipus (on el compilador dedueix els tipus automàticament) i tipus algebraics de dades (ADTs). L'estudi de la teoria de tipus és una branca activa de la informàtica teòrica, amb connexions profundes amb la lògica matemàtica.",
    ],
  },

  esports: {
    facil: [
      "M'agrada jugar a futbol. Xuto la pilota amb el peu. Intento marcar un gol. Corro molt pel camp. El meu equip sempre guanya.",
      "A l'estiu vaig a la piscina. M'agrada molt nedar. Faig crol i esquena. Em submergeixo sota l'aigua. És un esport molt refrescant. Cal portar banyador.",
      "El bàsquet es juga amb les mans. Cal encistellar la pilota. La cistella és molt alta. Els jugadors salten molt. El meu jugador preferit és alt.",
      "Vaig en bicicleta els diumenges. Porto un casc al cap. Pujo i baixo muntanyes. Vaig molt ràpid. És un esport cansat.",
      "El tennis es juga amb una raqueta. La pilota és groga. Cal passar-la per sobre la xarxa. Es pot jugar sol o en parella. M'agrada el soroll del cop.",
      "L'atletisme té moltes proves. Hi ha curses de velocitat. També hi ha salts. El llançament de pes és difícil. Els atletes entrenen cada dia.",
      "A l'hivern m'agrada esquiar. La neu és blanca i freda. Baixo per la muntanya. He de mantenir l'equilibri. Porto un anorac i guants.",
      "El judo és un art marcial. Es lluita sobre un tatami. Els lluitadors porten un kimono. Cal fer caure el contrincant. S'aprèn molt de respecte.",
      "La vela és un esport de mar. Es necessita un vaixell i vent. Les veles s'inflen. El vaixell es mou ràpid. M'agrada sentir l'aigua.",
      "El golf és un esport tranquil. Es colpeja una pilota petita. S'ha de ficar al forat. El camp és d'herba verda. Es necessita molta precisió.",
    ],
    normal: [
      "La Fórmula 1 és considerada la categoria reina de l'automobilisme internacional. Els cotxes, anomenats monoplaces, assoleixen velocitats superiors als 350 quilòmetres per hora. La temporada consisteix en una sèrie de curses, anomenades Grans Premis, celebrades arreu del món. L'aerodinàmica és un factor absolutament crucial per al rendiment del vehicle. Els pilots han de tenir uns reflexos extraordinaris i una gran resistència física per suportar les forces G. Els equips inverteixen centenars de milions d'euros en investigació i desenvolupament. L'estratègia de parada a boxs per canviar pneumàtics pot decidir el resultat d'una cursa.",
      "El surf és un esport aquàtic que consisteix a lliscar sobre les onades dempeus sobre una planxa. Es va originar a la Polinèsia i es va popularitzar a Hawaii. Requereix un gran equilibri, força al tronc superior i un profund coneixement del mar. Els surfistes busquen 'l'onada perfecta'. Hi ha diferents modalitats, com el 'longboard' (planxa llarga) o el 'shortboard' (més maniobrable). L'entorn on es practica, la platja i l'oceà, és un dels seus grans atractius. Respectar les normes locals i la prioritat a l'onada és fonamental. Recentment ha estat inclòs com a esport olímpic.",
      "Els Jocs Olímpics moderns van ser instaurats pel baró Pierre de Coubertin el 1896. Se celebren cada quatre anys, alternant les edicions d'estiu i d'hivern. Representen la competició esportiva més important a nivell mundial. Atletes de gairebé tots els països hi participen. La cerimònia d'inauguració és un espectacle que representa la cultura del país amfitrió. La flama olímpica simbolitza la pau i l'esperit de l'esdeveniment. Guanyar una medalla olímpica és el somni de la majoria d'esportistes d'elit. Els Jocs fomenten valors com l'amistat, el respecte i l'excel·lència.",
      "L'escalada esportiva ha experimentat un creixement de popularitat massiu. A diferència de l'alpinisme clàssic, se centra en la dificultat tècnica de la paret. Es practica en rocòdroms interiors o en parets de roca naturals equipades amb assegurances fixes (parabolts). Els escaladors utilitzen peus de gat, arnès i corda. La força dels dits i la flexibilitat són claus. Existeixen tres disciplines principals: dificultat (arribar el més alt possible), bloc (resoldre moviments curts i explosius) i velocitat. La resolució de problemes, trobar la seqüència de moviments, és una part fonamental de l'esport.",
      "El rugbi és un esport d'equip de contacte intens. Es juga entre dos equips de quinze jugadors (en la modalitat Union). L'objectiu és portar una pilota ovalada darrere la línia d'assaig de l'equip contrari. La pilota només es pot passar amb la mà cap enrere. També es pot avançar xutant-la amb el peu. La 'melé' (scrum) és una formació fixa per reiniciar el joc després d'una falta. Tot i la seva duresa física, és conegut pels seus valors de companyonia i respecte, resumits en el 'tercer temps'. El respecte a l'àrbitre és absolut.",
      "Una marató és una cursa de llarga distància que cobreix exactament 42,195 quilòmetres. El seu origen commemora la llegenda del soldat grec Filípides. És considerada una de les proves de resistència física i mental més dures. Els corredors han de seguir un pla d'entrenament rigorós durant mesos. La nutrició i la hidratació durant la cursa són crítiques per evitar 'el mur'. 'El mur' és el punt, vora el quilòmetre 30, on les reserves de glucogen s'esgoten. Córrer una marató requereix disciplina, sacrifici i una gran força de voluntat. Creuar la línia de meta és un èxit personal immens per a la majoria.",
      "El ciclisme en pista es disputa en un velòdrom, una pista ovalada amb corbes peraltades. Les bicicletes són de pinyó fix i no tenen frens, la qual cosa requereix una gran habilitat tècnica. Hi ha una gran varietat de proves. Algunes són de velocitat pura, com l'esprint individual o el keirin. Altres són de resistència, com la cursa per punts o el madison (per parelles). L'estratègia de córrer darrere d'un altre ciclista (agafar el rebuf) és fonamental per conservar energia. Les proves són molt tàctiques i explosives. És una disciplina olímpica des dels primers jocs moderns.",
    ],
    dificil: [
      "La fisiologia de l'exercici d'alt rendiment analitza les adaptacions metabòliques i neuromusculars que permeten als atletes d'elit assolir nivells extraordinaris de potència, resistència i precisió. L'entrenament sistemàtic indueix canvis profunds, com l'augment de la densitat mitocondrial al teixit muscular, millorant la capacitat oxidativa. Paral·lelament, l'entrenament en condicions d'hipòxia intermitent estimula l'eritropoesi, augmentant el transport d'oxigen (VO2 màx). La periodització nutricional és clau, manipulant la ingesta de macronutrients per maximitzar la supercompensació de glucogen hepàtic i muscular. A nivell neuromuscular, l'entrenament de força pliomètric optimitza el cicle d'escurçament-estirament (SSC) muscular, millorant l'eficiència mecànica i la taxa de desenvolupament de força (RFD). La gestió de la fatiga del sistema nerviós central (SNC), i no només la perifèrica, s'ha convertit en un focus recent d'investigació. Les anàlisis biomecàniques tridimensionals mitjançant captura de moviment permeten polir la cinemàtica de l'atleta per minimitzar el dispendi energètic. La variabilitat de la freqüència cardíaca (VFC) s'utilitza com un indicador no invasiu de l'estrès del sistema nerviós autònom i l'estat de recuperació. Els avenços en genòmica esportiva comencen a identificar polimorfismes associats amb predisposicions atlètiques específiques. La interacció sinèrgica de tots aquests factors multidisciplinaris és el que finalment diferencia el rendiment d'elit.",
      "L'escac modern d'alta competició ha transcendit el joc de taula per convertir-se en un camp de batalla híbrid on la cognició humana es fusiona amb la preparació computacional massiva. Els Grans Mestres (GM) ja no només estudien partides clàssiques; la seva preparació (opening prep) es basa en l'anàlisi de 'motors' d'escacs (com Stockfish o AlphaZero) que calculen milions de variants a profunditats inimaginables. Aquests motors han revolucionat la teoria de les obertures, trobant recursos defensius i atacs subtils en posicions considerades prèviament tabús. Durant la partida, però, l'atleta ha de gestionar la immensa càrrega cognitiva del càlcul de variants sota pressió de temps, un procés anomenat 'profilaxi'. La psicologia esportiva és fonamental per mantenir la concentració i gestionar l'estrès durant hores. La precisió de les partides es mesura ara amb eines estadístiques (ACPL - Average Centipawn Loss) que comparen cada moviment humà amb la millor jugada del motor. El concepte d''avantatge' ja no és només material, sinó posicional, dinàmic i, sovint, contraintuïtiu. L'estratègia a llarg termini ha de conviure amb la precisió tàctica immediata. La memòria eidètica per a patrons i estructures de peons és una habilitat subjacent crucial. L'endurance mental és tan important com la potència de càlcul.",
      "La biomecànica del llançament de beisbol (pitching) és un dels moviments més violents i complexos en l'esport, on el cos actua com una cadena cinètica per maximitzar la velocitat angular de l'espatlla. El procés comença amb la generació de força des del terra (ground reaction forces), transferida des de la cama de pivot. Aquesta energia es transmet de manera proximal a distal: des dels malucs, passant per una rotació explosiva del tronc (separació maluc-espatlla), fins a l'extremitat superior. L'espatlla experimenta una rotació externa extrema (fins a 180 graus) durant la fase d'armat (late cocking phase), acumulant energia elàstica als lligaments. La posterior acceleració angular del braç és un dels moviments més ràpids del cos humà. Les forces que actuen sobre el lligament col·lateral cubital (UCL) del colze durant aquesta fase són astronòmiques, superant sovint la seva capacitat de tensió. Això explica l'alta incidència de lesions que requereixen la cirurgia reconstructiva coneguda com 'Tommy John'. L'eficiència del llançament no rau només en la força bruta, sinó en la seqüenciació temporal precisa (timing) d'aquesta transferència d'energia. La desacceleració de l'espatlla després de deixar anar la bola és igualment crítica i extremadament exigent per a la manegueta dels rotatoris.",
      "El 'drafting' o rebuf (slipstreaming) és un principi aerodinàmic fonamental en esports de velocitat com el ciclisme, l'automobilisme i fins i tot la natació en aigües obertes. Aquest fenomen es produeix quan un atleta o vehicle es col·loca directament darrere d'un altre, entrant a la seva 'bombolla' de baixa pressió d'aire (o aigua). El líder ha de vèncer la resistència aerodinàmica principal, creant una estela de turbulència i menor pressió. L'atleta que segueix experimenta una reducció dràstica de la resistència de l'aire (drag), que pot suposar un estalvi energètic de fins al 40% en el ciclisme. Aquesta energia conservada és un recurs tàctic vital que es pot utilitzar posteriorment per a un atac o un esprint final. En l'automobilisme, com la NASCAR, el 'drafting' és tan potent que permet als cotxes assolir velocitats superiors a les que podrien aconseguir en solitari. La tàctica del 'drafting' transforma aquests esports en un joc col·laboratiu i estratègic, on els equips treballen junts per protegir el seu líder. No obstant això, seguir massa a prop augmenta el risc de col·lisió a causa de la reducció del temps de reacció. La dinàmica de fluids computacional (CFD) s'utilitza per optimitzar la forma dels vehicles i les posicions dels atletes per maximitzar aquest efecte.",
      "El dopatge genètic representa la propera frontera, i potser la més alarmant, en la millora del rendiment esportiu, plantejant dilemes ètics i de detecció sense precedents. A diferència del dopatge farmacològic tradicional, que introdueix substàncies exògenes, el dopatge genètic modifica l'expressió gènica del propi atleta per millorar el rendiment. Les tècniques de teràpia gènica, desenvolupades per tractar malalties com la distròfia muscular, són les candidates potencials. Per exemple, es podria introduir el gen de l'eritropoetina (EPO) per estimular permanentment la producció de glòbuls vermells i la resistència. Un altre objectiu podria ser la inhibició del gen de la miostatina, la qual cosa provocaria un creixement muscular hipertròfic. La tecnologia d'edició genètica CRISPR-Cas9 abarateix i facilita aquestes modificacions. El principal desafiament per a les agències antidopatge, com l'AMA, és la detecció. Com es pot diferenciar una expressió gènica elevada naturalment d'una induïda artificialment? Els canvis es produirien a nivell cel·lular (somàtic) i no serien fàcilment detectables en sang o orina. Això requeriria anàlisis de teixit (biòpsies) o la cerca de vectors virals utilitzats per a la transferència gènica. El 'passaport biològic de l'atleta' podria oferir pistes si s'observen canvis fisiològics longitudinals anòmals. Aquest avenç qüestiona la pròpia definició d'esport 'natural'.",
    ],
  },
};

function generarTexto(tematica = "aleatori", dificultad = "normal") {
  const tematicaNormalizada = tematica.toLowerCase();
  const dificultadNormalizada = dificultad.toLowerCase();
  
  // Obtener el conjunto de textos para la temática (con fallback a aleatori)
  const conjuntoTematica = textosPerTematica[tematicaNormalizada] || textosPerTematica.aleatori;
  
  // Obtener los textos específicos para el nivel de dificultad (con fallback a normal)
  const textosNivel = conjuntoTematica[dificultadNormalizada] || conjuntoTematica.normal;
  
  // Seleccionar un texto aleatorio del nivel correspondiente
  const indexAleatori = Math.floor(Math.random() * textosNivel.length);
  return textosNivel[indexAleatori];
}

// --- GENERADOR DE PALABRAS PARA MODO PALABRAS ---
const WORD_BANK = [
  // Tecnología (originales)
  "javascript",
  "python",
  "typescript",
  "react",
  "vue",
  "angular",
  "node",
  "express",
  "database",
  "server",
  "client",
  "frontend",
  "backend",
  "fullstack",
  "component",
  "function",
  "variable",
  "constant",
  "array",
  "object",
  "string",
  "number",
  "boolean",
  "async",
  "await",
  "promise",
  "callback",
  "event",
  "handler",
  "method",
  "class",
  "interface",
  "type",
  "generic",
  "module",
  "import",
  "export",
  "default",
  "return",
  "void",
  "null",
  "undefined",
  "algorithm",
  "structure",
  "pattern",
  "design",
  "architecture",
  "framework",
  "library",
  "package",
  "dependency",
  "version",
  "deploy",
  "build",
  "compile",
  "debug",
  "console",
  "terminal",
  "command",
  "script",
  "syntax",
  "semantic",

  // Animales
  "perro",
  "gato",
  "elefante",
  "tigre",
  "leon",
  "jirafa",
  "cebra",
  "rinoceronte",
  "hipopotamo",
  "cocodrilo",
  "serpiente",
  "aguila",
  "halcon",
  "buho",
  "loro",
  "pinguino",
  "delfin",
  "ballena",
  "tiburon",
  "pulpo",
  "medusa",
  "tortuga",
  "rana",
  "sapo",
  "lagarto",
  "camaleon",
  "iguana",
  "koala",
  "panda",
  "oso",
  "lobo",
  "zorro",
  "conejo",
  "liebre",
  "ardilla",
  "castor",
  "nutria",
  "foca",
  "morsa",
  "canguro",
  "koala",
  "ornitorrinco",
  "murcielago",
  "raton",
  "rata",
  "hamster",
  "cobaya",
  "caballo",
  "burro",
  "cebra",
  "vaca",
  "toro",
  "cerdo",
  "oveja",
  "cabra",
  "gallina",
  "gallo",
  "pato",
  "ganso",
  "pavo",
  "paloma",
  "canario",
  "jilguero",
  "golondrina",
  "cuervo",
  "grulla",
  "flamenco",
  "cisne",

  // Comida
  "pizza",
  "hamburguesa",
  "pasta",
  "arroz",
  "paella",
  "sushi",
  "taco",
  "burrito",
  "enchilada",
  "quesadilla",
  "empanada",
  "croqueta",
  "tortilla",
  "bocadillo",
  "sandwich",
  "ensalada",
  "sopa",
  "gazpacho",
  "salmorejo",
  "pan",
  "queso",
  "jamon",
  "chorizo",
  "salchichon",
  "morcilla",
  "patata",
  "tomate",
  "lechuga",
  "cebolla",
  "ajo",
  "zanahoria",
  "pepino",
  "pimiento",
  "berenjena",
  "calabacin",
  "espinaca",
  "brocoli",
  "coliflor",
  "repollo",
  "col",
  "guisante",
  "judia",
  "lenteja",
  "garbanzo",
  "alubia",
  "manzana",
  "pera",
  "platano",
  "naranja",
  "mandarina",
  "limon",
  "pomelo",
  "uva",
  "fresa",
  "frambuesa",
  "arandano",
  "cereza",
  "melocoton",
  "albaricoque",
  "ciruela",
  "kiwi",
  "mango",
  "papaya",
  "piña",
  "sandia",
  "melon",
  "chocolate",
  "caramelo",
  "galleta",
  "tarta",
  "pastel",
  "helado",
  "flan",
  "natillas",
  "yogur",
  "leche",
  "cafe",
  "te",

  // Objetos cotidianos
  "mesa",
  "silla",
  "sofa",
  "cama",
  "armario",
  "estanteria",
  "lampara",
  "espejo",
  "ventana",
  "puerta",
  "llave",
  "cerradura",
  "cortina",
  "alfombra",
  "cojin",
  "almohada",
  "manta",
  "sabana",
  "toalla",
  "jabon",
  "champu",
  "cepillo",
  "peine",
  "tijeras",
  "pinza",
  "alicate",
  "martillo",
  "destornillador",
  "llave",
  "clavo",
  "tornillo",
  "tuerca",
  "cable",
  "enchufe",
  "interruptor",
  "bombilla",
  "vela",
  "cerilla",
  "mechero",
  "paraguas",
  "reloj",
  "calendario",
  "agenda",
  "libreta",
  "lapiz",
  "boligrafo",
  "rotulador",
  "goma",
  "sacapuntas",
  "regla",
  "compas",
  "libro",
  "revista",
  "periodico",
  "carta",
  "sobre",
  "sello",
  "paquete",
  "caja",
  "bolsa",
  "mochila",
  "maleta",
  "cartera",
  "monedero",
  "gafas",
  "reloj",
  "anillo",
  "collar",
  "pulsera",
  "pendiente",
  "sombrero",
  "gorra",
  "bufanda",
  "guante",

  // Ropa
  "camisa",
  "camiseta",
  "pantalon",
  "vaqueros",
  "falda",
  "vestido",
  "chaqueta",
  "abrigo",
  "jersey",
  "sudadera",
  "chaleco",
  "corbata",
  "pajarita",
  "cinturon",
  "zapato",
  "zapatilla",
  "bota",
  "sandalia",
  "calcetin",
  "media",
  "pijama",
  "bañador",
  "bikini",
  "ropa",
  "traje",
  "uniforme",
  "delantal",
  "bata",

  // Naturaleza
  "arbol",
  "flor",
  "rosa",
  "margarita",
  "tulipan",
  "girasol",
  "orquidea",
  "lirio",
  "jazmin",
  "violeta",
  "clavel",
  "petunia",
  "hoja",
  "rama",
  "tronco",
  "raiz",
  "semilla",
  "fruto",
  "bosque",
  "selva",
  "pradera",
  "campo",
  "montana",
  "colina",
  "valle",
  "rio",
  "lago",
  "mar",
  "ocean",
  "playa",
  "isla",
  "desierto",
  "oasis",
  "cueva",
  "roca",
  "piedra",
  "arena",
  "tierra",
  "barro",
  "nube",
  "lluvia",
  "nieve",
  "granizo",
  "viento",
  "tormenta",
  "rayo",
  "trueno",
  "arcoiris",
  "sol",
  "luna",
  "estrella",
  "planeta",
  "cometa",
  "galaxia",
  "universo",
  "cielo",

  // Deportes
  "futbol",
  "baloncesto",
  "tenis",
  "voleibol",
  "balonmano",
  "rugby",
  "beisbol",
  "hockey",
  "golf",
  "natacion",
  "atletismo",
  "gimnasia",
  "esgrima",
  "boxeo",
  "karate",
  "judo",
  "taekwondo",
  "ciclismo",
  "esqui",
  "snowboard",
  "surf",
  "skateboard",
  "escalada",
  "alpinismo",
  "senderismo",
  "running",
  "yoga",
  "pilates",
  "crossfit",
  "pesas",
  "balon",
  "raqueta",
  "red",
  "porteria",

  // Profesiones
  "medico",
  "enfermera",
  "dentista",
  "farmaceutico",
  "veterinario",
  "profesor",
  "maestro",
  "abogado",
  "juez",
  "policia",
  "bombero",
  "soldado",
  "piloto",
  "azafata",
  "marinero",
  "capitan",
  "ingeniero",
  "arquitecto",
  "constructor",
  "carpintero",
  "fontanero",
  "electricista",
  "mecanico",
  "pintor",
  "escultor",
  "musico",
  "cantante",
  "actor",
  "bailarin",
  "escritor",
  "periodista",
  "fotografo",
  "cocinero",
  "camarero",
  "panadero",
  "pastelero",
  "carnicero",
  "pescadero",
  "frutero",
  "tendero",
  "cajero",
  "contador",
  "secretario",
  "recepcionista",

  // Transportes
  "coche",
  "autobus",
  "camion",
  "moto",
  "bicicleta",
  "patinete",
  "tren",
  "metro",
  "tranvia",
  "avion",
  "helicoptero",
  "barco",
  "lancha",
  "yate",
  "velero",
  "canoa",
  "kayak",
  "submarino",
  "cohete",
  "nave",
  "taxi",
  "ambulancia",
  "policia",

  // Lugares
  "casa",
  "piso",
  "apartamento",
  "chalet",
  "mansion",
  "castillo",
  "palacio",
  "iglesia",
  "catedral",
  "mezquita",
  "templo",
  "sinagoga",
  "escuela",
  "colegio",
  "universidad",
  "biblioteca",
  "museo",
  "teatro",
  "cine",
  "circo",
  "estadio",
  "parque",
  "jardin",
  "zoo",
  "acuario",
  "hospital",
  "clinica",
  "farmacia",
  "supermercado",
  "tienda",
  "mercado",
  "restaurante",
  "cafeteria",
  "bar",
  "pub",
  "discoteca",
  "hotel",
  "hostal",
  "camping",
  "playa",
  "puerto",
  "aeropuerto",
  "estacion",
  "oficina",
  "fabrica",
  "taller",
  "garaje",
  "parking",
  "banco",

  // Emociones y conceptos
  "feliz",
  "triste",
  "alegre",
  "enfadado",
  "sorprendido",
  "asustado",
  "nervioso",
  "tranquilo",
  "calmado",
  "emocionado",
  "aburrido",
  "cansado",
  "energico",
  "fuerte",
  "debil",
  "rapido",
  "lento",
  "grande",
  "pequeño",
  "alto",
  "bajo",
  "gordo",
  "delgado",
  "bonito",
  "feo",
  "nuevo",
  "viejo",
  "moderno",
  "antiguo",
  "limpio",
  "sucio",
  "ordenado",
  "desordenado",
  "facil",
  "dificil",
  "simple",
  "complejo",
  "claro",
  "oscuro",
  "brillante",
  "opaco",
  "caliente",
  "frio",
  "templado",
  "helado",
  "tibio",
  "dulce",
  "salado",
  "amargo",
  "agrio",
  "picante",

  // Colores
  "rojo",
  "azul",
  "verde",
  "amarillo",
  "naranja",
  "morado",
  "rosa",
  "marron",
  "negro",
  "blanco",
  "gris",
  "dorado",
  "plateado",
  "turquesa",
  "violeta",

  // Números y tiempo
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
  "diez",
  "veinte",
  "treinta",
  "cien",
  "mil",
  "millon",
  "primero",
  "segundo",
  "tercero",
  "lunes",
  "martes",
  "miercoles",
  "jueves",
  "viernes",
  "sabado",
  "domingo",
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
  "primavera",
  "verano",
  "otoño",
  "invierno",
  "mañana",
  "tarde",
  "noche",
  "mediodia",
  "medianoche",
  "amanecer",
  "atardecer",
  "hora",
  "minuto",
  "segundo",
  "dia",
  "semana",
  "mes",
  "año",
  "siglo",
  "pasado",
  "presente",
  "futuro",
];

function generarPalabras(numPalabras = 100) {
  const palabras = [];
  for (let i = 0; i < numPalabras; i++) {
    const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
    palabras.push(WORD_BANK[randomIndex]);
  }
  return palabras;
}

// --- FUNCIONES AUXILIARES ---

// Envía la lista de salas actualizada a todos los clientes
function broadcastRoomList() {
  const roomList = Object.values(activeRooms).map((room) => ({
    name: room.name,
    playerCount: room.players.length,
    maxPlayers: room.maxPlayers,
    isPrivate: room.isPrivate,
    gameMode: room.config?.gameMode || 'palabras', // Incluir gameMode
  }));
  console.log("📢 Broadcasting room list:", roomList);
  io.emit("updateRoomList", roomList);
}

// Envía la lista de jugadores de una sala específica a todos en esa sala
function broadcastPlayerList(roomName) {
  if (activeRooms[roomName]) {
    const playerList = activeRooms[roomName].players.map((id) => players[id]);
    console.log(
      `📢 Broadcasting player list for room ${roomName}:`,
      playerList
    );
    io.to(roomName).emit("updatePlayerList", playerList);
  }
}

// --- LÓGICA DE CONEXIÓN DE SOCKET.IO ---

io.on("connection", (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id}`);

  // Registrar jugador
  players[socket.id] = { id: socket.id, name: null, room: null, color: null };

  // Enviar la lista de salas actual al nuevo cliente
  socket.on("requestRoomList", () => {
    const roomList = Object.values(activeRooms).map((room) => ({
      name: room.name,
      playerCount: room.players.length,
      maxPlayers: room.maxPlayers,
      isPrivate: room.isPrivate,
      gameMode: room.config?.gameMode || 'palabras', // Incluir gameMode
    }));
    console.log(`📥 Enviando lista de salas a ${socket.id}:`, roomList);
    socket.emit("updateRoomList", roomList);
  });

  // Evento para crear una nueva sala
  socket.on("createRoom", (roomConfig) => {
    const {
      roomName,
      playerName,
      playerColor,
      maxPlayers,
      isPrivate,
      password,
    } = roomConfig;

    // Validar si la sala ya existe
    if (activeRooms[roomName]) {
      socket.emit("roomError", { message: `La sala "${roomName}" ya existe.` });
      return;
    }

    // Normalizar privacidad: si hay contraseña no vacía, la sala es privada
    const hasPassword =
      typeof password === "string"
        ? password.trim().length > 0
        : Boolean(password);
    const roomIsPrivate = Boolean(isPrivate) || hasPassword;

    // Crear la nueva sala
    activeRooms[roomName] = {
      name: roomName,
      players: [socket.id],
      maxPlayers: maxPlayers || 2,
      isPrivate: roomIsPrivate,
      password: hasPassword ? password : null,
      admin: socket.id,
      config: roomConfig,
    };

    // Asegurar que la configuración compartida refleja correctamente la privacidad
    activeRooms[roomName].config.isPrivate = roomIsPrivate;
    if (roomIsPrivate && hasPassword) {
      activeRooms[roomName].config.password = password;
    }

    // Actualizar datos del jugador
    players[socket.id].name = playerName;
    players[socket.id].color = playerColor || "#F021B9";
    players[socket.id].room = roomName;
    players[socket.id].isAdmin = true;

    // Unir al jugador a la sala de Socket.IO
    socket.join(roomName);

    console.log(`✅ Sala "${roomName}" creada por ${playerName}.`);

    // Emitir confirmación al creador de la sala
    const confirmData = {
      roomConfig: activeRooms[roomName].config,
      isAdmin: true,
    };
    console.log("📤 Enviando joinedRoom al creador:", socket.id, confirmData);
    socket.emit("joinedRoom", confirmData);

    // Notificar a todos sobre la nueva sala
    broadcastRoomList();
    // Notificar a los de la sala sobre el nuevo jugador
    broadcastPlayerList(roomName);
  });

  // Evento para unirse a una sala existente
  socket.on("joinRoom", (joinConfig) => {
    const { roomName, playerName, playerColor, password } = joinConfig;

    // Validar si la sala existe
    if (!activeRooms[roomName]) {
      socket.emit("roomError", { message: `La sala "${roomName}" no existe.` });
      return;
    }

    const room = activeRooms[roomName];

    // Validar si la sala está llena
    if (room.players.length >= room.maxPlayers) {
      socket.emit("roomError", {
        message: `La sala "${roomName}" está llena.`,
      });
      return;
    }

    // Validar contraseña si es sala privada
    if (room.isPrivate && room.password && room.password !== password) {
      socket.emit("roomError", { message: "Contraseña incorrecta." });
      return;
    }

    // Añadir jugador a la sala
    room.players.push(socket.id);

    // Actualizar datos del jugador
    players[socket.id].name = playerName;
    players[socket.id].color = playerColor || "#F021B9";
    players[socket.id].room = roomName;
    players[socket.id].isAdmin = false;

    // Unir al jugador a la sala de Socket.IO
    socket.join(roomName);

    console.log(`✅ ${playerName} se unió a la sala "${roomName}".`);

    // Notificar éxito al jugador que se unió
    socket.emit("joinedRoom", {
      roomName,
      roomConfig: room.config,
      isAdmin: false,
    });

    // Actualizar lista de salas para todos (por si cambió el número de jugadores)
    broadcastRoomList();
    // Notificar a los de la sala sobre el nuevo jugador
    broadcastPlayerList(roomName);
  });

  // Cuando un usuari es desconnecta
  socket.on("disconnect", () => {
    console.log(`🔌 Usuario desconectado: ${socket.id}`);

    const player = players[socket.id];
    if (player && player.room) {
      const roomName = player.room;
      const room = activeRooms[roomName];

      if (room) {
        // Eliminar al jugador de la sala
        room.players = room.players.filter(
          (playerId) => playerId !== socket.id
        );
        console.log(
          `- Jugador ${
            player.name || socket.id
          } eliminado de la sala ${roomName}.`
        );

        // Si la sala queda vacía, eliminarla
        if (room.players.length === 0) {
          delete activeRooms[roomName];
          console.log(`🗑️ Sala "${roomName}" eliminada por estar vacía.`);
        } else {
          // Si el admin se va, nombrar a otro
          if (room.admin === socket.id) {
            room.admin = room.players[0];
            console.log(
              `👑 Nuevo admin para la sala "${roomName}": ${
                players[room.admin].name
              }`
            );
          }
          // Actualizar la lista de jugadores para los que quedan
          broadcastPlayerList(roomName);
        }

        // Actualizar la lista de salas para todos
        broadcastRoomList();
      }
    }

    // Eliminar al jugador del registro general
    delete players[socket.id];
  });

  // --- EVENTOS MULTIJUGADOR ---

  // Expulsar jugador (solo admin)
  socket.on("kickPlayer", (playerId) => {
    const admin = players[socket.id];
    const playerToKick = players[playerId];

    if (
      admin &&
      admin.room &&
      playerToKick &&
      admin.room === playerToKick.room
    ) {
      const room = activeRooms[admin.room];

      // Verificar que el que expulsa sea el admin
      if (room && room.admin === socket.id) {
        console.log(
          `👢 Admin ${admin.name} expulsa a ${playerToKick.name} de la sala "${admin.room}"`
        );

        // Notificar al jugador expulsado
        const socketToKick = io.sockets.sockets.get(playerId);
        if (socketToKick) {
          socketToKick.emit("kicked", {
            message: "Has estat expulsat de la sala per l'administrador",
          });
          socketToKick.disconnect(true);
        }

        // Eliminar al jugador de la sala
        room.players = room.players.filter((id) => id !== playerId);
        delete players[playerId];

        // Actualizar listas
        broadcastPlayerList(admin.room);
        broadcastRoomList();
      }
    }
  });

  // Evento para iniciar el juego (solo admin)
  socket.on("startGame", () => {
    const player = players[socket.id];
    if (player && player.room) {
      const room = activeRooms[player.room];

      // Verificar que el jugador sea el admin
      if (room && room.admin === socket.id) {
        console.log(
          `🎮 Admin ${player.name} está iniciando el juego en la sala "${player.room}"`
        );

        // Generar contenido según el modo de juego
        const gameMode = room.config?.gameMode || "texto";
        let gameText = null;
        let gameWords = null;

        if (gameMode === "palabras") {
          // Modo palabras: generar lista de palabras
          gameWords = generarPalabras(100);
          console.log(
            `🎯 Palabras generadas para la sala "${player.room}":`,
            gameWords.slice(0, 10).join(", ") + "..."
          );
        } else {
          // Modo texto: generar texto con temática y dificultad
          const theme = room.config?.theme || "aleatori";
          const difficulty = room.config?.difficulty || "normal";
          gameText = generarTexto(theme, difficulty);
          console.log(
            `📝 Texto generado para la sala "${player.room}" (${difficulty}):`,
            gameText.substring(0, 50) + "..."
          );
        }

        // Emitir evento a todos los jugadores de la sala con el mismo contenido
        io.to(player.room).emit("gameStarted", {
          roomConfig: room.config,
          gameText: gameText,
          gameWords: gameWords,
        });
      }
    }
  });

  // Cuando un jugador envía su progreso
  socket.on("playerProgress", (data) => {
    const player = players[socket.id];
    if (player && player.room) {
      io.to(player.room).emit("playerProgress", {
        playerId: socket.id,
        playerName: player.name,
        progress: data.progress,
        wordsCompleted: data.wordsCompleted,
        wpm: data.wpm,
        errors: data.errors,
      });
    }
  });

  // Cuando un jugador presiona una tecla
  socket.on("playerKeyPress", (data) => {
    const player = players[socket.id];
    if (player && player.room) {
      // Emitir a todos los jugadores de la sala EXCEPTO al que la ha presionado
      socket.to(player.room).emit("playerKeyPress", {
        playerId: socket.id,
        playerName: player.name,
        key: data.key,
      });
    }
  });

  // Cuando un jugador actualiza su racha
  socket.on("playerStreak", (data) => {
    const player = players[socket.id];
    if (player && player.room) {
      io.to(player.room).emit("playerStreak", {
        playerId: socket.id,
        playerName: player.name,
        streak: data.streak,
      });
    }
  });

  // Cuando se solicita una nueva ronda (siguiente texto)
  socket.on("requestNextRound", () => {
    const player = players[socket.id];
    if (player && player.room) {
      const room = activeRooms[player.room];
      
      if (room) {
        console.log(`🔄 Solicitando nueva ronda en sala "${player.room}"`);
        
        // Generar nuevo contenido según el modo de juego
        const gameMode = room.config?.gameMode || "texto";
        let gameText = null;
        let gameWords = null;

        if (gameMode === "palabras") {
          // Modo palabras: generar nueva lista de palabras
          gameWords = generarPalabras(100);
          console.log(
            `🎯 Nuevas palabras generadas:`,
            gameWords.slice(0, 10).join(", ") + "..."
          );
        } else {
          // Modo texto: generar nuevo texto con temática y dificultad
          const theme = room.config?.theme || "aleatori";
          const difficulty = room.config?.difficulty || "normal";
          gameText = generarTexto(theme, difficulty);
          console.log(
            `📝 Nuevo texto generado (${difficulty}):`,
            gameText.substring(0, 50) + "..."
          );
        }

        // Emitir nuevo contenido a TODOS los jugadores de la sala
        io.to(player.room).emit("nextRound", {
          gameText: gameText,
          gameWords: gameWords,
        });
      }
    }
  });
});

server.listen(PORT);
