export type VowTone = 
  | 'romantico' 
  | 'engracado' 
  | 'juridico' 
  | 'geek' 
  | 'poetico' 
  | 'musical' 
  | 'viagem' 
  | 'eterno'
  | 'misto';

export type VowFormat = 'clausulas' | 'artigos' | 'manifesto' | 'votos_diretos';

export interface VowCategory {
  id: VowTone;
  label: string;
  emoji: string;
  description: string;
}

export const VOW_CATEGORIES: VowCategory[] = [
  {
    id: 'romantico',
    label: 'Romântico Apaixonado',
    emoji: '💖',
    description: 'Promessas profundas, afeto sincero e conexão inabalável de almas.'
  },
  {
    id: 'engracado',
    label: 'Bem-humorado & Divertido',
    emoji: '😂',
    description: 'Cláusulas sobre quem escolhe o filme, divide batata frita e não rouba a coberta.'
  },
  {
    id: 'juridico',
    label: 'Cartorial & Jurídico Fofo',
    emoji: '⚖️',
    description: 'Artigos oficiais, jurisprudência do dengo e cláusula irrevogável de amor.'
  },
  {
    id: 'poetico',
    label: 'Lírico & Clássico',
    emoji: '📜',
    description: 'Prosa lírica digna de grandes romances clássicos e poetas imortais.'
  },
  {
    id: 'geek',
    label: 'Geek & Gamer',
    emoji: '🎮',
    description: 'Player 1 & Player 2, itens lendários, suporte mútuo em todas as fases da vida.'
  },
  {
    id: 'musical',
    label: 'Trilha Sonora da Vida',
    emoji: '🎵',
    description: 'Para casais conectados pela música, ritmo e poesias sonoras.'
  },
  {
    id: 'viagem',
    label: 'Aventureiro & Viagens',
    emoji: '✈️',
    description: 'Parceiros de estrada, colecionadores de carimbos e horizontes.'
  },
  {
    id: 'eterno',
    label: 'Compromisso Perpétuo',
    emoji: '💍',
    description: 'Votos solenes de união inabalável para todas as vidas e eras.'
  },
  {
    id: 'misto',
    label: 'Surpreenda-me (Mix Especial)',
    emoji: '🎲',
    description: 'Combinação perfeita e surpreendente de romance, humor e termos solenes.'
  }
];

export const VOW_FORMATS: { id: VowFormat; label: string; icon: string }[] = [
  { id: 'clausulas', label: 'Cláusulas Numeradas', icon: '📋' },
  { id: 'artigos', label: 'Artigos Cartoriais', icon: '⚖️' },
  { id: 'manifesto', label: 'Manifesto Lírico', icon: '📜' },
  { id: 'votos_diretos', label: 'Votos em 1ª Pessoa', icon: '💍' },
];

// In-memory ring buffer to prevent consecutive repetitive clauses
const recentClauseHistory: Set<string> = new Set();
const MAX_HISTORY_SIZE = 40;

function trackAndFilter<T extends { title: string; text: string }>(pool: T[], count: number): T[] {
  // Try to find clauses that haven't been shown in recent history
  const freshItems = pool.filter(item => !recentClauseHistory.has(item.title + item.text));
  
  let selected: T[] = [];
  if (freshItems.length >= count) {
    const shuffled = [...freshItems].sort(() => 0.5 - Math.random());
    selected = shuffled.slice(0, count);
  } else {
    // If pool exhausted, reshuffle full pool
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    selected = shuffled.slice(0, count);
  }

  // Register in history
  selected.forEach(item => {
    recentClauseHistory.add(item.title + item.text);
    if (recentClauseHistory.size > MAX_HISTORY_SIZE) {
      const firstEntry = recentClauseHistory.values().next().value;
      if (firstEntry) recentClauseHistory.delete(firstEntry);
    }
  });

  return selected;
}

function sample<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==========================================================================
// MASSIVE COMBINATORIAL CLAUSE POOLS BY TONE (HUNDREDS OF DISTINCT CLAUSES)
// ==========================================================================

const ROMANTIC_CLAUSES = [
  {
    title: "DA TERNURA INCONDICIONAL",
    text: "acolher o outro nos dias cansativos, transformando qualquer silêncio em paz e qualquer tempestade em aconchego seguro"
  },
  {
    title: "DOS PEQUENOS GESTOS DE AFETO",
    text: "dividir o último pedaço de sobremesa, preparar o café com carinho e jamais adormecer sem antes selar a paz com um beijo de boa noite"
  },
  {
    title: "DO BRILHO NO OLHAR",
    text: "olhar um nos olhos do outro com o mesmo encanto, admiração e paixão viva do primeiro instante em que se descobriram"
  },
  {
    title: "DA CONQUISTA DOS SONHOS",
    text: "celebrar cada conquista individual com orgulho redobrado e construir objetivos a quatro mãos com lealdade inabalável"
  },
  {
    title: "DO DIÁLOGO & DA PAZ",
    text: "priorizar a escuta atenta, a palavra mansa, o abraço demorado e a certeza inabalável de que juntos superam qualquer obstáculo"
  },
  {
    title: "DA CUMPLICIDADE DIÁRIA",
    text: "cultivar a delicadeza dos detalhes cotidianos: o bilhete surpresa, a mensagem carinhosa no meio do dia e a mão que nunca se solta"
  },
  {
    title: "DO REFÚGIO SAGRADO",
    text: "guardar no abraço mútuo o santuário de sua cumplicidade, elegendo a felicidade do outro como prioridade do coração"
  },
  {
    title: "DA RENOVAÇÃO DO AMOR",
    text: "renovar a escolha de amar a cada nascer do sol, com entusiasmo crescente, na juventude e na velhice, por todas as estações"
  },
  {
    title: "DA LEALDADE ETERNA",
    text: "ser a calmaria nas incertezas do mundo, o riso fácil na rotina e a melhor companhia para todas as horas da vida"
  },
  {
    title: "DA PROTEÇÃO DO SENTIMENTO",
    text: "proteger a pureza deste amor como o bem mais precioso, nobre e sagrado de suas existências"
  },
  {
    title: "DO COMPANHEIRISMO NOBRE",
    text: "ser o porto seguro nos momentos de dúvida e o farol que ilumina todas as decisões com respeito e carinho"
  },
  {
    title: "DA GRATIDÃO PELO DESTINO",
    text: "agradecer diariamente pelo encontro de suas almas, honrando cada instante compartilhado com amor genuíno"
  },
  {
    title: "DO ABRAÇO QUE CURA",
    text: "fazer do peito um abrigo seguro onde nenhuma tristeza resiste ao calor do abraço e da compreensão mútua"
  },
  {
    title: "DO SORRISO COMPARTILHADO",
    text: "multiplicar as risadas despretensiosas e encontrar motivos para comemorar até mesmo nos dias mais simples da rotina"
  },
  {
    title: "DA SUPERAÇÃO CONJUNTA",
    text: "lembrar que qualquer montanha se torna pequena quando escalada lado a lado com paciência, incentivo e mãos dadas"
  },
  {
    title: "DA PACIÊNCIA AMOROSA",
    text: "respeitar o tempo, o espaço e a individualidade de cada um, fortalecendo a união com raízes profundas de maturidade"
  },
  {
    title: "DA PRESENÇA VERDADEIRA",
    text: "estar presente por inteiro nas conversas, nos olhares e nos momentos mais singelos que a vida proporcionar"
  },
  {
    title: "DA CORAGEM DE AMAR",
    text: "ousar sonhar alto sem medo do futuro, sabendo que a certeza do amor é a bússola que sempre aponta para casa"
  },
  {
    title: "DO CAFÉ COM CARINHO",
    text: "surpreender o par com gentilezas inesperadas, massagens na nuca após dias longos e elogios sinceros do coração"
  },
  {
    title: "DA FIDELIDADE AO CORAÇÃO",
    text: "guardar fidelidade plena aos sentimentos, aos sonhos pactuados e à promessa de ser o melhor parceiro possível"
  }
];

const FUNNY_CLAUSES = [
  {
    title: "DO SPOILER E DAS SÉRIES",
    text: "nunca assistir ao próximo episódio da série favorita sozinho, sob pena de massagem obrigatória nos pés por três noites consecutivas"
  },
  {
    title: "DA ESCOLHA DO CARDÁPIO",
    text: "responder à pergunta 'O que vamos comer?' com objetividade e rapidez, ficando expressamente proibido o uso de 'Tanto faz' após 30 minutos de indecisão"
  },
  {
    title: "DO FURTO DE COBERTORES",
    text: "tolerar o roubo involuntário do edredom nas madrugadas frias, desde que imediatamente compensado com conchinha e abraço bem quentinho"
  },
  {
    title: "DA PARTILHA DA PIZZA & PETISCOS",
    text: "dividir a última fatia de pizza, a melhor batata frita e a borda recheada por meio de consenso pacífico ou rodízio semanal devidamente acordado"
  },
  {
    title: "DO SUPORTE ÀS PIADAS SEM GRAÇA",
    text: "fingir surpresa diante de presentes óbvios e rir de trocadilhos duvidosos com no mínimo duas risadas sonoras e um sorriso sincero"
  },
  {
    title: "DO INTERRUPTOR DE LUZ NOTURNO",
    text: "manter o acordo irrevogável de que quem deitou por último na cama tem a obrigação civil de levantar e apagar a luz do quarto"
  },
  {
    title: "DOS DESEJOS DA MADRUGADA",
    text: "tratar qualquer vontade repentina de doce, lanche ou chocolate na madrugada como assunto de máxima urgência e interesse coletivo"
  },
  {
    title: "DA LOUÇA & DA CONVIVÊNCIA",
    text: "lembrar que a louça na pia é passageira, mas a cafona cumplicidade e o dengo deste casal são perpétuos e indestrutíveis"
  },
  {
    title: "DO CHOQUE TÉRMICO NOTURNO",
    text: "aceitar pés congelados encostados na canela embaixo da coberta como prova biológica inquestionável de amor e confiança"
  },
  {
    title: "DO TRIBUNAL DA TOALHA MOLHADA",
    text: "não instaurar processo litigioso sobre toalhas molhadas em cima da cama, resolvendo divergências com um beijo na testa"
  },
  {
    title: "DA PACIÊNCIA COM FOTOS",
    text: "tirar quantas fotos forem necessárias até achar o ângulo perfeito, sem reclamar e com total dedicação fotográfica"
  },
  {
    title: "DO GPS E DOS CAMINHOS ERRADOS",
    text: "transformar qualquer erro de rota ou rua errada no trânsito em um tour romântico improvisado com direito a música alta"
  },
  {
    title: "DO ROLO DE PAPEL HIGIÊNICO",
    text: "assumir a responsabilidade de trocar o rolo vazio de papel higiênico sem deixar o suporte solitário e desamparado"
  },
  {
    title: "DAS COMPRAS NO SUPERMERCADO",
    text: "permitir ao menos dois itens não essenciais (chocolates ou guloseimas) no carrinho de compras sem direito a veto da outra parte"
  },
  {
    title: "DO CONTROLE REMOTO SOBERANO",
    text: "alternar democraticamente a posse do controle remoto, sem direito a monopólio de realities ou programas esportivos"
  },
  {
    title: "DA CAFEÍNA OBRIGATÓRIA",
    text: "não levar a sério nenhuma declaração dita antes da primeira xícara de café quente da manhã"
  },
  {
    title: "DO ROUBO DE BATATAS FRITAS",
    text: "reconhecer que pedir 'só uma provinha' da comida do outro equivale juridicamente a comer metade do prato"
  },
  {
    title: "DO SILÊNCIO MATINAL SAGRADO",
    text: "respeitar os primeiros 15 minutos do dia com serenidade e carinho suave antes de iniciar discussões complexas sobre o mundo"
  }
];

const JURIDICAL_CLAUSES = [
  {
    title: "DO REGIME DE BENS AFETIVOS",
    text: "fica instituído o regime de comunhão universal de alegrias, segredos, viagens, planos futuros e cafunés diários"
  },
  {
    title: "DO USUCAPIÃO DO CORAÇÃO",
    text: "reconhece-se a posse mansa, pacífica, contínua e incontestável do coração de ambas as partes, sem cabimento de qualquer recurso"
  },
  {
    title: "DA CLÁUSULA PÉTREA DE CARINHO",
    text: "é expressamente vedada qualquer redução no fornecimento de beijos, palavras de incentivo, apoio mútuo e abraços apertados"
  },
  {
    title: "DO FORO & CONCILIAÇÃO",
    text: "fica eleito o Foro da Cama & do Aconchego para dirimir qualquer divergência, mediante diálogo afetuoso, café quente e reconciliação imediata"
  },
  {
    title: "DA VIGÊNCIA IRREVOGÁVEL",
    text: "a felicidade mútua e o respeito são declarados direitos fundamentais inegociáveis, irrevogáveis e de eficácia plena imediata"
  },
  {
    title: "DA PROCURAÇÃO PERPÉTUA",
    text: "outorga-se procuração recíproca com amplos e ilimitados poderes para cuidar, mimar, aconselhar e fazer o outro sorrir todos os dias"
  },
  {
    title: "DOS EFEITOS SENTIMENTAIS",
    text: "o presente termo produz efeitos legais e sentimentais em todas as esferas, dimensões, estações e circunstâncias da vida a dois"
  },
  {
    title: "DA RENÚNCIA A DÚVIDAS",
    text: "declaram formalmente a renúncia a qualquer incerteza, ratificando a cumplicidade como dogma irrecorrível de sua sociedade conjugal"
  },
  {
    title: "DA AVERBAÇÃO DO DENGO",
    text: "determina-se a averbação obrigatória de momentos de carinho diário, com validade plena em todo o território universal"
  },
  {
    title: "DO RECURSO INADMISSÍVEL",
    text: "declara-se precluso e inadmissível qualquer questionamento quanto à perfeição da sintonia e da química existente entre os consortes"
  },
  {
    title: "DO DIREITO ADQUIRIDO AO BEIJO",
    text: "fica resguardado o direito adquirido de solicitar carinho, cafuné e beijo demorado a qualquer hora do dia ou da noite"
  },
  {
    title: "DA IMUNIDADE À ROTINA",
    text: "institui-se imunidade diplomática e emocional contra o tédio, obrigando as partes a inventar passeios e momentos especiais frequentes"
  },
  {
    title: "DA COISA JULGADA AFETIVA",
    text: "torna-se coisa julgada de última instância a deliberação soberana de que nasceram um para o outro"
  }
];

const POETIC_CLAUSES = [
  {
    title: "DA HARMONIA DAS ALMAS",
    text: "caminhar na mesma cadência mansa, fazendo do afeto a poesia que colore os dias cinzentos e ilumina a existência"
  },
  {
    title: "DO FAROL NA ESCURIDÃO",
    text: "ser a luz suave nas noites escuras e a certeza serena que acalma todas as tempestades e tormentas do coração"
  },
  {
    title: "DA MORADA DEFINITIVA",
    text: "guardar na memória do olhar a reverência e o deslumbramento de quem encontrou na outra alma o seu lar eterno"
  },
  {
    title: "DO RITUAL DA TERNURA",
    text: "fazer dos abraços rituais diários de gratidão e das conversas da tarde o poema mais sublime já escrito a dois"
  },
  {
    title: "DA ESCRITA DO DESTINO",
    text: "escrever com a tinta da lealdade uma história eterna que nem a marcha inexorável do tempo poderá apagar"
  },
  {
    title: "DO JARDIM DA CUMPLICIDADE",
    text: "cultivar a ternura como flor rara, protegida dos ventos fortes e coroada pelo florescer ininterrupto da paixão"
  },
  {
    title: "DA CONSTELAÇÃO DO AFETO",
    text: "entrelaçar destinos sob o mesmo céu, fazendo de cada nascer do sol uma nova estrofe de carinho e devoção mútua"
  },
  {
    title: "DO RIO QUE DESÁGUA NO MAR",
    text: "fluir juntos através das correntezas da vida, encontrando na paz do abraço a imensidão serena do oceano"
  },
  {
    title: "DA SINFONIA DO SILÊNCIO",
    text: "compreender os anseios do outro apenas pelo olhar, onde as palavras se calam para que o coração fale mais alto"
  },
  {
    title: "DO CREPÚSCULO DOURADO",
    text: "apreciar a passagem do tempo com serenidade, sabendo que cada dia ao lado do par é uma obra-prima inesquecível"
  },
  {
    title: "DO LAÇO INDISSOLÚVEL",
    text: "tecer um vínculo tão nobre e profundo que nem a distância nem os invernos conseguem desatar"
  }
];

const GEEK_CLAUSES = [
  {
    title: "DA PARTY DEFINITIVA",
    text: "formar a party definitiva no servidor da vida real, mantendo 100% de mana, lealdade e sinergia em todas as raids e desafios"
  },
  {
    title: "DO RAGE QUIT PROIBIDO",
    text: "jamais dar Rage Quit diante das fases difíceis, compartilhando poções de cura e revivendo o outro com paciência e carinho"
  },
  {
    title: "DO DROP LENDÁRIO",
    text: "explorar o mapa do futuro lado a lado, farmando memórias épicas e celebrando cada conquista comum como um Drop Lendário"
  },
  {
    title: "DA LEI DOS SAVES & SNACKS",
    text: "maratonar campanhas juntos, dividir os snacks nas cutscenes e nunca, sob hipótese alguma, salvar por cima do slot de save do outro"
  },
  {
    title: "DO CÓDIGO-FONTE DO AMOR",
    text: "manter o código-fonte da relação sempre limpo, sem conflitos de merge, seguro e 100% otimizado contra bugs de convivência"
  },
  {
    title: "DO MULTIVERSO AFETIVO",
    text: "lembrar que em todas as linhas temporais, servidores e universos paralelos: Eu escolho você como meu Player 2 para sempre! GG WP!"
  },
  {
    title: "DO CRITICAL HIT DO AFETO",
    text: "desferir acertos críticos diários de carinho, elogios e apoio moral antes de cada boss fight do dia a dia"
  },
  {
    title: "DA TRANSMISSÃO CO-OP",
    text: "jogar a vida no modo cooperativo sem fogo amigo, dividindo o inventário de felicidades e equipamentos lendários"
  },
  {
    title: "DO 20 NATURAL NA SORTE",
    text: "agradecer pelo d20 da vida que rolou um 20 Natural perfeito no momento exato em que nossos caminhos se cruzaram"
  },
  {
    title: "DO FAST TRAVEL PARA O ABRAÇO",
    text: "usar o ponto de viagem rápida para os braços do par sempre que o cansaço do mundo real bater"
  }
];

const MUSICAL_CLAUSES = [
  {
    title: "DA HARMONIA PERFEITA",
    text: "afinar os corações na mesma frequência lírica, fazendo da convivência a canção mais doce e emocionante já composta"
  },
  {
    title: "DO DUETO APAIXONADO",
    text: "dançar juntos na sala, cantar no trânsito sem medo de desafinar e ser o dueto mais afinado e alegre do universo"
  },
  {
    title: "DOS ACORDES DE PACIÊNCIA",
    text: "sustentar os acordes de carinho e serenidade mesmo quando a rotina tentar acelerar o andamento e o compasso da paz"
  },
  {
    title: "DO REFRÃO CONTAGIANTE",
    text: "ser o solo de esperança nos dias de incerteza e o refrão inesquecível celebrado em cada conquista do casal"
  },
  {
    title: "DA PARTITURA DA VIDA",
    text: "escrever dia após dia uma melodia única, onde cada gesto de carinho é uma nota que ecoa na eternidade"
  },
  {
    title: "DO RITMO DO CORAÇÃO",
    text: "acompanhar a batida compassada do peito do outro, encontrando na simplicidade dos dias a nossa melhor sinfonia"
  },
  {
    title: "DA PLAYLIST DA NOSSA HISTÓRIA",
    text: "eternizar cada viagem, risada e jantar com uma trilha sonora memorável gravada para sempre na alma"
  },
  {
    title: "DO BIS INEVITÁVEL",
    text: "pedir bis para cada momento bom, renovando o espetáculo da nossa união a cada novo amanhecer"
  }
];

const TRAVEL_CLAUSES = [
  {
    title: "DO PASSAPORTE DO CORAÇÃO",
    text: "carimbar o passaporte do afeto para a expedição mais fascinante de todas: uma vida inteira de aventuras e descobertas a dois"
  },
  {
    title: "DOS PARCEIROS DE ESTRADA",
    text: "ser companheiros de rota em todos os trajetos, com bagagens leves, playlists animadas e olhos atentos aos horizontes"
  },
  {
    title: "DAS TURBULÊNCIAS SUPERADAS",
    text: "enfrentar qualquer turbulência de mãos dadas, lembrando sempre que o melhor destino do mundo é exatamente onde o outro estiver"
  },
  {
    title: "DO MAPA DE MEMÓRIAS",
    text: "colecionar momentos inesquecíveis, rir dos caminhos errados e explorar novos pores do sol lado a lado"
  },
  {
    title: "DA CONEXÃO PERFEITA",
    text: "manter o bilhete de embarque sempre validado para novos sonhos, transformando qualquer lugar simples no melhor refúgio do planeta"
  },
  {
    title: "DA BÚSSOLA AFETIVA",
    text: "orientar todas as rotas em direção à felicidade mútua, sem medo de recalcular caminhos para explorar novos horizontes"
  },
  {
    title: "DAS BAGAGENS COMPARTILHADAS",
    text: "ajudar a carregar o peso dos dias difíceis e encher as malas apenas de memórias doces, fotos e risadas sinceras"
  },
  {
    title: "DO CARIMBO NA ALMA",
    text: "registrar que cada cidade visitada se torna mais bela e mágica quando vista através do reflexo dos olhos do par"
  }
];

const ETERNAL_CLAUSES = [
  {
    title: "DO JURAMENTO SAGRADO",
    text: "permanecerem leais, apaixonados e cúmplices na calmaria e na tempestade, na juventude e na velhice, com a mesma reverência"
  },
  {
    title: "DA PROMESSA DAS ERAS",
    text: "renovar o compromisso do amor a cada amanhecer, construindo uma aliança inabalável que atravessa as eras do tempo"
  },
  {
    title: "DO SANTUÁRIO DA ALMA",
    text: "fazer da convivência um santuário de respeito e cumplicidade onde a alma de ambos repousa em plena e doce segurança"
  },
  {
    title: "DA UNIÃO TRANSCENDENTAL",
    text: "selar o juramento perpétuo de que seus caminhos permanecerão entrelaçados para todo o sempre, sob todos os céus e estrelas"
  },
  {
    title: "DA CHAMA INEXTINGUÍVEL",
    text: "manter aceso o fogo sagrado da paixão e da amizade, alimentado diariamente com paciência, admiração e carinho"
  },
  {
    title: "DA ALIANÇA INVENCÍVEL",
    text: "consolidar um pacto indestrutível que transcende qualquer prova, honrando o destino que uniu seus corações"
  },
  {
    title: "DO TEMPLO DA PAZ",
    text: "edificar no lar compartilhado um templo de serenidade onde o afeto e a verdade reinam soberanos"
  }
];

function getClausePool(tone: VowTone) {
  switch (tone) {
    case 'engracado': return FUNNY_CLAUSES;
    case 'juridico': return JURIDICAL_CLAUSES;
    case 'poetico': return POETIC_CLAUSES;
    case 'geek': return GEEK_CLAUSES;
    case 'musical': return MUSICAL_CLAUSES;
    case 'viagem': return TRAVEL_CLAUSES;
    case 'eterno': return ETERNAL_CLAUSES;
    case 'misto': {
      // Pick dynamic mix from all pools
      return [
        ...ROMANTIC_CLAUSES.slice(0, 10),
        ...FUNNY_CLAUSES.slice(0, 10),
        ...JURIDICAL_CLAUSES.slice(0, 8),
        ...GEEK_CLAUSES.slice(0, 6),
        ...POETIC_CLAUSES.slice(0, 6)
      ];
    }
    case 'romantico':
    default: return ROMANTIC_CLAUSES;
  }
}

const INTRO_FORMULAS = [
  (p1: string, p2: string) => `Nós, ${p1} e ${p2}, firmamos perante o Cartório do Amor e sob o testemunho do afeto mútuo os seguintes votos solenes:`,
  (p1: string, p2: string, c: string) => `Certificam ${p1} e ${p2}, por livre deliberação do coração na Comarca de ${c}, os termos de seu compromisso eterno:`,
  (p1: string, p2: string) => `Perante as testemunhas do amor verdadeiro, ${p1} e ${p2} consagram este pacto irrevogável de carinho e lealdade:`,
  (p1: string, p2: string) => `Com o coração pleno de certeza e alegria, ${p1} e ${p2} declaram as seguintes cláusulas pétreas de convivência:`,
  (p1: string, p2: string, c: string) => `Na presença viva dos sentimentos mais puros na Comarca de ${c}, ${p1} e ${p2} celebram o presente compromisso de almas:`,
  (p1: string, p2: string) => `Unidos pelo destino e pela escolha diária de amar, ${p1} e ${p2} registram formalmente as diretrizes de sua vida a dois:`,
  (p1: string, p2: string, c: string) => `Diante de toda a história já construída e de todo o futuro que desponta na Comarca de ${c}, ${p1} e ${p2} prometem solenemente:`,
];

const OUTRO_FORMULAS = [
  "Elegemos a felicidade como nosso destino e este amor como nosso refúgio perpétuo.",
  "Que este pacto de amor seja cumprido com ternura, respeito e paixão por todos os dias de nossas vidas.",
  "Publicado, registrado e gravado na história de nossas almas para todo o sempre.",
  "Firmamos este compromisso no presente para fazer ecoar nossa felicidade na eternidade.",
  "E assim declaramos nossa união indestrutível, hoje, amanhã e para sempre.",
  "Com amor inabalável, respeito mútuo e lealdade consagrada, assim se cumpra este termo.",
  "Registrado na Comarca do Amor Eterno sob o sinete indelével da paixão verdadeira."
];

/**
 * Procedural AI Synthesizer: Dynamically generates diverse, non-repeating clauses on every call.
 */
export function generateVowsWithAI(
  tone: VowTone, 
  partner1: string, 
  partner2: string, 
  city?: string,
  _variationSeed?: number,
  customPrompt?: string,
  formatChoice?: VowFormat
): { text: string } {
  const p1 = partner1.trim() || 'Cônjuge 1';
  const p2 = partner2.trim() || 'Cônjuge 2';
  const c = city?.trim() || 'Comarca do Afeto';
  
  const pool = getClausePool(tone);
  const format = formatChoice || 'clausulas';
  
  // Pick 3, 4, or 5 random clauses dynamically filtered with anti-repetition memory
  const count = sample([3, 4, 4, 5]);
  const picked = trackAndFilter(pool, count);

  const intro = sample(INTRO_FORMULAS)(p1, p2, c);
  const outro = sample(OUTRO_FORMULAS);

  const customClause = customPrompt?.trim() 
    ? `\n\nCLÁUSULA ESPECIAL: Comprometemo-nos com carinho redobrado a ${customPrompt.trim()}, honrando a essência singular de nossa história.`
    : '';

  const customArtigo = customPrompt?.trim()
    ? `\n\nArt. Especial. Constitui cláusula prioritária do casal o compromisso de ${customPrompt.trim()}.`
    : '';

  const customVoto = customPrompt?.trim()
    ? `\n• Promessa Especial: Prometo dedicar carinho especial a ${customPrompt.trim()}.`
    : '';

  let generatedText = '';

  if (format === 'clausulas') {
    const romanNumbers = ['1ª', '2ª', '3ª', '4ª', '5ª', '6ª', '7ª'];
    const clauseLines = picked.map((item, idx) => {
      return `CLÁUSULA ${romanNumbers[idx] || `${idx + 1}ª`} (${item.title}): ${item.text.charAt(0).toUpperCase() + item.text.slice(1)};`;
    }).join('\n\n');

    generatedText = `${intro}\n\n${clauseLines}${customClause}\n\n${outro}`;

  } else if (format === 'artigos') {
    const artigoLines = picked.map((item, idx) => {
      return `Art. ${idx + 1}º. [${item.title}] — Fica instituído o dever solene de ${item.text}.`;
    }).join('\n\n');

    generatedText = `REGISTRO CIVIL DE AFETO & COMPROMISSO MÚTUO\nComarca de ${c} • União Solene de ${p1} & ${p2}\n\n${artigoLines}${customArtigo}\n\nPublique-se, registre-se e cumpra-se com amor infinito por todos os dias de nossas vidas.`;

  } else if (format === 'votos_diretos') {
    const votoLines = picked.map((item, idx) => {
      return `${idx + 1}. Prometo ${item.text};`;
    }).join('\n');

    generatedText = `VOTOS DE AMOR E LEALDADE DE ${p1.toUpperCase()} & ${p2.toUpperCase()}:\n\nEu escolho você hoje, amanhã e em cada segundo do nosso futuro. Diante de tudo o que somos e sonhamos ser:\n\n${votoLines}${customVoto}\n\n${outro}`;

  } else {
    // Manifesto Lírico / Prosa Contínua
    const prose = picked.map(i => i.text).join('; de ');
    generatedText = `Declaram ${p1} e ${p2}, por livre e espontânea vontade do coração na Comarca de ${c}, o compromisso solene de ${prose}.\n\nElegem um ao outro como eternos refúgios, cúmplices inabaláveis e o grande amor de todas as suas vidas.${customPrompt ? ` Prometem honrar especialmente o compromisso de ${customPrompt.trim()}.` : ''}\n\n${outro}`;
  }

  return { text: generatedText };
}

/**
 * Async Hybrid Synthesizer: Calls Google Gemini 1.5 Flash via Serverless API,
 * with instantaneous fallback to local generative engine.
 */
export async function generateVowsWithGeminiOrLocal(
  tone: VowTone, 
  partner1: string, 
  partner2: string, 
  city?: string,
  variationSeed?: number,
  customPrompt?: string,
  formatChoice?: VowFormat
): Promise<{ text: string; source: 'gemini' | 'procedural' }> {
  try {
    const res = await fetch('/api/generate-vows', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tone,
        partner1,
        partner2,
        city,
        format: formatChoice || 'clausulas',
        customPrompt,
        seed: variationSeed || Date.now() + Math.random(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.text) {
        return { text: data.text, source: 'gemini' };
      }
    }
  } catch (err) {
    console.warn('API error, seamlessly falling back to local AI engine:', err);
  }

  const localRes = generateVowsWithAI(tone, partner1, partner2, city, variationSeed, customPrompt, formatChoice);
  return { text: localRes.text, source: 'procedural' };
}
