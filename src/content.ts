export type Lang = 'pt' | 'en'
export type Localized<T = string> = Record<Lang, T>

export type Area = 'embedded' | 'backend' | 'iot'

export interface Project {
  id: string
  title: Localized
  context: string
  short: Localized
  journey?: string
  period: string
  areas: Area[]
  stack: string[]
  summary: Localized
  highlights: Localized<string[]>
  badge?: { icon: 'trophy' | 'target' | 'antenna' | 'growth' | 'speed'; title: Localized; detail: Localized }
  repo?: string
}

export type JourneyIcon = 'iot' | 'rocket' | 'cart' | 'chip'

export interface Experience {
  slug: string
  role: Localized
  org: Localized
  unit: string
  icon: JourneyIcon
  period: Localized
  points: Localized<string[]>
}

export const profile = {
  name: 'Vitor Alexandre Garcia Vaz',
  location: 'São Carlos, SP — Brasil',
  email: 'vitorgarciavaz@gmail.com',
  github: 'https://github.com/XandGVaz',
  linkedin: 'https://www.linkedin.com/in/vitor-alexandre-garcia-vaz-6757962aa/',
}

export const ui = {
  pt: {
    nav: { about: 'Sobre', projects: 'Projetos', experience: 'Jornada', skills: 'Tecnologias', contact: 'Contato' },
    role: 'Engenharia de Computação · USP São Carlos',
    tagline: 'Do Hardware à Nuvem',
    pipelineAlt: 'Animação em estilo terminal: um sensor envia uma leitura de temperatura e umidade por rádio para a nuvem, que a passa por um broker de mensagens, a guarda num banco de dados e a entrega por HTTPS a um computador, que atualiza o painel.',
    headline: ['Desenvolvimento Web, IoT e Sistemas\u00a0Embarcados'],
    summary:
      'Sou apaixonado por **IoT**, **aviônica** e **resolução de problemas**. Gosto de enxergar o sistema inteiro, do sensor no campo ao dado na tela, e de transformar desafios técnicos em soluções que funcionam de verdade.',
    ctaProjects: 'Ver projetos',
    ctaContact: 'Entrar em contato',
    downloadCv: 'Baixar CV',
    cvMenuLabel: 'Escolha a área do currículo',
    cvEnglishOnly: 'disponível em inglês',
    projectsEyebrow: 'Portfólio',
    projectsTitle: ['Projetos', 'em destaque'],
    projectsLead: 'Os projetos que mais aparecem nos meus currículos.',
    filters: { all: 'Todos', embedded: 'Embarcados', backend: 'Back-end & Dados', iot: 'IoT' },
    privateCode: 'Código privado',
    viewCode: 'Ver código',
    aboutEyebrow: 'Formação & trajetória',
    aboutTitle: ['Sobre', 'Mim'],
    aboutFile: '~/sobre/vitor_vaz.md',
    heroFile: '~/inicio/monitor.sh',
    aboutGroups: 'Grupos de extensão',
    aboutSeeJourney: 'Ver a jornada',
    experienceEyebrow: 'Linha do tempo',
    experienceTitle: ['Jornada', 'Profissional'],
    journeyMore: 'Ver a jornada completa',
    journeyProjectOpen: 'Ver projeto',
    journeyBack: 'Voltar para a jornada',
    journeyStack: 'Tecnologias',
    statSeeCheckpoint: 'ver na linha do tempo',
    statSeeFlight: 'ver no gráfico do voo',
    flightTitle: 'O voo do Atlas',
    flightLead: 'Altitude medida no voo da LASC 2026. Escolha uma fase, ou um dos números acima, para ver o trecho correspondente.',
    flightStagesLabel: 'Fases do voo',
    flightOurs: 'Altitude do Atlas',
    flightRef: 'Altímetro comercial (referência no apogeu)',
    flightSeeAtlas: 'Ver o Atlas na linha do tempo',
    flightEvents: { liftoff: 'Decolagem', burnout: 'Fim da queima', apogee: 'Apogeu', apogeeRef: 'Altímetro comercial', drogue: 'Drogue', main: 'Principal', landing: 'Pouso' },
    flightLocale: 'pt-BR',
    archTitle: 'O caminho de uma leitura',
    archLead: 'Do nó em campo à interface: cada ponto é uma leitura, na cor do seu protocolo. Escolha uma camada, ou clique nela no diagrama, para ver como funciona.',
    archFile: '~/lasdpc/testbed/fluxo-de-dados',
    archPartsLabel: 'Camadas da arquitetura',
    archPlay: 'Reproduzir o fluxo',
    archPause: 'Pausar o fluxo',
    archAlt: 'Diagrama animado da arquitetura do testbed, em camadas: nós mioty, LoRaWAN, NB-IoT e Sigfox enviam leituras aos network servers, que as passam por MQTT à bridge; a bridge as entrega por TCP ao servidor de aplicação, e a interface web as consulta por HTTP. O monitoramento acompanha o servidor de aplicação.',
    archDevices: 'Dispositivos {p}',
    archDevicesShort: 'dispositivos',
    statSeeArch: 'ver na arquitetura',
    flightFile: '~/topus/atlas/voo_lasc2026.log',
    flightPlay: 'Reproduzir o voo',
    flightPause: 'Pausar',
    flightReplay: 'Reproduzir de novo',
    flightSpeed: 'Velocidade da reprodução',
    flightRealTime: 'o tempo real',
    flightSeek: 'Tempo de voo',
    flightAlt: 'ALT',
    flightPad: 'Na rampa',
    flightIgnition: 'Ignição',
    checkpoint: 'Checkpoint',
    photosPrev: 'Fotos anteriores',
    photosNext: 'Próximas fotos',
    photoOpen: 'Ampliar foto',
    journeyPrev: 'Anterior',
    journeyNext: 'Próxima',
    journeyNotFound: 'Esta parte da jornada não existe.',
    closeImage: 'Fechar imagem',
    awardsEyebrow: 'Conquistas',
    awardsTitle: ['Prêmios', 'e Reconhecimentos'],
    awardsLead: 'Clique em um prêmio para ver o artigo ou o projeto por trás dele.',
    awardsNewTab: '(abre em nova aba)',
    skillsEyebrow: 'Stack técnica',
    skillsTitle: ['Tecnologias', 'e Ferramentas'],
    skillsLead: 'Clique numa tecnologia para ver onde eu a usei.',
    skillUsedIn: 'Onde usei',
    skillProjects: 'Projetos',
    skillJourney: 'Jornada',
    skillClear: 'Fechar',
    contactTitle: 'Vamos conversar',
    contactLead: 'Aberto a estágios e projetos em embarcados, IoT e back-end.',
    themeToggle: 'Alternar tema',
    langToggle: 'Switch to English',
    footer: 'Feito com React + TypeScript · hospedado no GitHub Pages',
  },
  en: {
    nav: { about: 'About', projects: 'Projects', experience: 'Journey', skills: 'Skills', contact: 'Contact' },
    role: 'Computer Engineering · University of São Paulo',
    tagline: 'From Hardware to the Cloud',
    pipelineAlt: 'Terminal-style animation: a sensor sends a temperature and humidity reading over radio to the cloud, which passes it through a message broker, stores it in a database and delivers it over HTTPS to a computer that updates its dashboard.',
    headline: ['Web Development, IoT and Embedded\u00a0Systems'],
    summary:
      "I'm passionate about **IoT**, **avionics** and **problem solving**. I like to see the whole system, from the sensor in the field to the data on the screen, and to turn technical challenges into solutions that actually work.",
    ctaProjects: 'See projects',
    ctaContact: 'Get in touch',
    downloadCv: 'Download resume',
    cvMenuLabel: 'Choose the resume focus',
    cvEnglishOnly: 'English only',
    projectsEyebrow: 'Portfolio',
    projectsTitle: ['Featured', 'Projects'],
    projectsLead: 'The projects that show up most across my resumes.',
    filters: { all: 'All', embedded: 'Embedded', backend: 'Back-end & Data', iot: 'IoT' },
    privateCode: 'Private code',
    viewCode: 'View code',
    aboutEyebrow: 'Education & background',
    aboutTitle: ['About', 'Me'],
    aboutFile: '~/about/vitor_vaz.md',
    heroFile: '~/home/monitor.sh',
    aboutGroups: 'Student teams',
    aboutSeeJourney: 'See the journey',
    experienceEyebrow: 'Career timeline',
    experienceTitle: ['Professional', 'Journey'],
    journeyMore: 'See the full story',
    journeyProjectOpen: 'See project',
    journeyBack: 'Back to the journey',
    journeyStack: 'Stack',
    statSeeCheckpoint: 'see it on the timeline',
    statSeeFlight: 'see it on the flight chart',
    flightTitle: 'The Atlas flight',
    flightLead: 'Altitude measured during the LASC 2026 flight. Pick a phase, or one of the numbers above, to see that stretch.',
    flightStagesLabel: 'Flight phases',
    flightOurs: 'Atlas altitude',
    flightRef: 'Commercial altimeter (apogee reference)',
    flightSeeAtlas: 'See Atlas on the timeline',
    flightEvents: { liftoff: 'Lift-off', burnout: 'Burnout', apogee: 'Apogee', apogeeRef: 'Commercial altimeter', drogue: 'Drogue', main: 'Main', landing: 'Landing' },
    flightLocale: 'en-US',
    archTitle: 'The path of a reading',
    archLead: 'From the node in the field to the interface: each dot is a reading, in the color of its protocol. Pick a layer, or click it in the diagram, to see how it works.',
    archFile: '~/lasdpc/testbed/data-flow',
    archPartsLabel: 'Architecture layers',
    archPlay: 'Play the flow',
    archPause: 'Pause the flow',
    archAlt: 'Animated layered diagram of the testbed architecture: mioty, LoRaWAN, NB-IoT and Sigfox sensor devices send readings to the network servers, which pass them over MQTT to the bridge; the bridge delivers them over TCP to the application server, and the web interface queries them over HTTP. Monitoring watches the application server.',
    archDevices: '{p} devices',
    archDevicesShort: 'devices',
    statSeeArch: 'see it in the architecture',
    flightFile: '~/topus/atlas/flight_lasc2026.log',
    flightPlay: 'Play the flight',
    flightPause: 'Pause',
    flightReplay: 'Play again',
    flightSpeed: 'Playback speed',
    flightRealTime: 'real time',
    flightSeek: 'Flight time',
    flightAlt: 'ALT',
    flightPad: 'On the pad',
    flightIgnition: 'Ignition',
    checkpoint: 'Checkpoint',
    photosPrev: 'Previous photos',
    photosNext: 'Next photos',
    photoOpen: 'Enlarge photo',
    journeyPrev: 'Previous',
    journeyNext: 'Next',
    journeyNotFound: 'This part of the journey does not exist.',
    closeImage: 'Close image',
    awardsEyebrow: 'Achievements',
    awardsTitle: ['Awards', '& Recognition'],
    awardsLead: 'Click an award to see the paper or the project behind it.',
    awardsNewTab: '(opens in a new tab)',
    skillsEyebrow: 'Tech stack',
    skillsTitle: ['Skills', '& Tools'],
    skillsLead: 'Click a technology to see where I used it.',
    skillUsedIn: 'Where I used',
    skillProjects: 'Projects',
    skillJourney: 'Journey',
    skillClear: 'Close',
    contactTitle: "Let's talk",
    contactLead: 'Open to internships and projects in embedded, IoT and back-end.',
    themeToggle: 'Toggle theme',
    langToggle: 'Mudar para português',
    footer: 'Built with React + TypeScript · hosted on GitHub Pages',
  },
} satisfies Record<Lang, unknown>

export type UI = (typeof ui)['pt']

export const projects: Project[] = [
  {
    id: 'iot-platform',
    title: {
      pt: 'Plataforma de Monitoramento IoT na Cafeicultura',
      en: 'IoT Monitoring Platform for Coffee Farming',
    },
    context: 'LaSDPC — ICMC-USP',
    short: { pt: 'Monitoramento IoT', en: 'IoT Monitoring' },
    journey: 'lasdpc',
    period: '06/2026 – 09/2026',
    areas: ['backend', 'iot'],
    stack: ['Java 21', 'Spring Boot', 'Swagger', 'Kafka', 'PostgreSQL', 'TimescaleDB', 'MQTT', 'JavaScript', 'Docker', 'Docker Compose', 'Prometheus'],
    summary: {
      pt: 'Plataforma que ingere, processa e armazena em tempo real os dados de sensores LoRaWAN no campo.',
      en: 'Platform that ingests, processes and stores LoRaWAN field-sensor data in real time.',
    },
    highlights: {
      pt: [
        'Ingestão MQTT → Kafka → Postgres; um serviço de stream em Spring Boot persiste as leituras no TimescaleDB',
        'API REST em Spring Boot com JWT, CRUDs e envio de downlinks para os dispositivos',
        'Métricas no Prometheus e toda a stack orquestrada com Docker Compose',
      ],
      en: [
        'MQTT → Kafka → Postgres ingestion; a Spring Boot stream service persists readings to TimescaleDB',
        'Spring Boot REST API with JWT, CRUD endpoints and device downlinks',
        'Prometheus metrics, with the whole stack orchestrated by Docker Compose',
      ],
    },
  },
  {
    id: 'ground-station',
    title: { pt: 'Flex Ground Station', en: 'Flex Ground Station' },
    context: 'TOPUS — EESC-USP',
    short: { pt: 'Flex Ground Station', en: 'Flex Ground Station' },
    journey: 'topus',
    period: '05/2026 – 09/2026',
    areas: ['embedded'],
    stack: ['ESP32', 'C++', 'FreeRTOS', 'LoRa', 'KiCad', 'I2C/SPI'],
    summary: {
      pt: 'Estação de solo portátil, com PCB e firmware próprios, que recebe a telemetria dos foguetes do grupo.',
      en: "Portable ground station, with its own PCB and firmware, that receives the group's rocket telemetry.",
    },
    highlights: {
      pt: [
        'PCB própria em KiCad integrando ESP32, rádio RFM95W, display OLED e bateria',
        '5 tasks do FreeRTOS fixadas nos dois núcleos: travar a interface nunca derruba um pacote do foguete',
        'Rádio ajustável em campo (RSSI/SNR) e protocolo JSON via serial com a interface visual',
      ],
      en: [
        'Custom KiCad PCB integrating ESP32, RFM95W radio, OLED display and battery',
        '5 FreeRTOS tasks pinned across both cores: a UI stall never drops a rocket packet',
        'Field-tunable radio (RSSI/SNR) and a JSON-over-serial protocol to the visual interface',
      ],
    },
    badge: {
      icon: 'antenna',
      title: { pt: '2 km de alcance de telemetria', en: '2 km telemetry range' },
      detail: {
        pt: 'link mantido com o foguete em voo, em tempo real',
        en: 'link held with the rocket in flight, in real time',
      },
    },
  },
  {
    id: 'telemetry-dashboard',
    title: { pt: 'Painel de Telemetria em Tempo Real', en: 'Real-Time Telemetry Dashboard' },
    context: 'TOPUS — EESC-USP',
    short: { pt: 'Painel de Telemetria', en: 'Telemetry Dashboard' },
    journey: 'topus',
    period: '09/2025 – 08/2026',
    areas: ['backend', 'embedded'],
    stack: ['Python', 'FastAPI', 'WebSocket', 'React', 'TypeScript', 'HTML', 'CSS', 'Docker Compose'],
    summary: {
      pt: 'Interface web que acompanha o voo do foguete ao vivo, alimentada pela estação de solo.',
      en: "Web interface that follows the rocket's flight live, fed by the ground station.",
    },
    highlights: {
      pt: [
        'Leitura serial → WebSocket com fan-out para vários clientes simultâneos',
        'Gráficos em tempo real, visualização 3D da atitude do foguete e simulador de voo',
        'Gravação em CSV e esquema de pacote tolerante a campos opcionais',
      ],
      en: [
        'Serial → WebSocket fan-out to multiple simultaneous clients',
        "Live charts, 3D view of the rocket's attitude and a flight simulator",
        'CSV recording and a packet schema tolerant to optional fields',
      ],
    },
    badge: {
      icon: 'trophy',
      title: { pt: '2º lugar — categoria CubeSat', en: '2nd place — CubeSat category' },
      detail: { pt: 'Latin American Space Challenge 2026', en: 'Latin American Space Challenge 2026' },
    },
  },
  {
    id: 'saecomp-store',
    title: { pt: 'Back-End da Loja SAEComp', en: 'SAEComp Store Back-End' },
    context: 'SAEComp — USP',
    short: { pt: 'Back-End da Loja', en: 'Store Back-End' },
    journey: 'saecomp',
    period: '08/2025 – 02/2026',
    areas: ['backend'],
    stack: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Zod', 'Swagger'],
    summary: {
      pt: 'Back-end da loja on-line da secretaria acadêmica, em produção, com pagamentos PIX.',
      en: "Back-end of the student association's online store, in production, with PIX payments.",
    },
    highlights: {
      pt: [
        'Carrinho, pedidos, estoque, pontuação e comentários em arquitetura controllers → services → repositories',
        'PIX via Mercado Pago com confirmação em tempo real por Server-Sent Events e cancelamento automático',
        'Documentação OpenAPI gerada a partir dos esquemas Zod',
      ],
      en: [
        'Cart, orders, inventory, points and reviews in a controllers → services → repositories architecture',
        'PIX via Mercado Pago with real-time confirmation over Server-Sent Events and automatic cancellation',
        'OpenAPI docs generated from the Zod schemas',
      ],
    },
    badge: {
      icon: 'growth',
      title: { pt: '75× no lucro da secretaria', en: "75× growth in the office's profit" },
      detail: {
        pt: 'loja on-line em produção com pagamentos PIX',
        en: 'online store in production with PIX payments',
      },
    },
    repo: 'https://github.com/SAEComp/site-saecomp-back-lojinha',
  },
  {
    id: 'lpwan-bridge',
    title: { pt: 'Bridge LPWAN ↔ Aplicação', en: 'LPWAN ↔ Application Bridge' },
    context: 'LaSDPC — ICMC-USP',
    short: { pt: 'Bridge LPWAN', en: 'LPWAN Bridge' },
    journey: 'lasdpc',
    period: '05/2026 – 09/2026',
    areas: ['backend', 'iot'],
    stack: ['Python', 'MQTT', 'Pydantic', 'Redis', 'Prometheus', 'Docker Compose'],
    summary: {
      pt: 'Resolve a incompatibilidade entre as identidades de dispositivo do Network Server e as da aplicação.',
      en: "Resolves the mismatch between the Network Server's and the application's device identities.",
    },
    highlights: {
      pt: [
        'Bridge MQTT bidirecional que mapeia identidades DevEUI ↔ MAC no Redis',
        'Validação de todas as mensagens com Pydantic',
        'Métricas de operação expostas no Prometheus',
      ],
      en: [
        'Bidirectional MQTT bridge mapping DevEUI ↔ MAC identities in Redis',
        'Every message validated with Pydantic',
        'Operational metrics exposed to Prometheus',
      ],
    },
  },
  {
    id: 'atlas',
    title: { pt: 'Computador de Voo — Foguete Atlas 3 km', en: 'Flight Computer — Atlas 3 km Rocket' },
    context: 'TOPUS — EESC-USP',
    short: { pt: 'Computador de Voo', en: 'Flight Computer' },
    journey: 'topus',
    period: '03/2026 – 09/2026',
    areas: ['embedded'],
    stack: ['ESP32', 'C++', 'FreeRTOS', 'CMake', 'KiCad', 'Kalman', 'Madgwick', 'LoRa', 'GNSS'],
    summary: {
      pt: 'Aviônica do foguete Atlas, lançado na Latin American Space Challenge 2026.',
      en: 'Avionics for the Atlas rocket, launched at the Latin American Space Challenge 2026.',
    },
    highlights: {
      pt: [
        'Pilha de PCBs modulares: telemetria LoRa, GNSS, microSD, IMU, barômetro e acionamento pirotécnico',
        'Máquina de estados de voo em C++/FreeRTOS que retoma a fase de voo após um reboot em pleno ar',
        'Filtros de Kalman (altitude/velocidade) e Madgwick (atitude) rodando em paralelo',
      ],
      en: [
        'Modular PCB stack: LoRa telemetry, GNSS, microSD, IMU, barometer and pyrotechnic deployment',
        'C++/FreeRTOS flight state machine that resumes the flight phase after an airborne reboot',
        'Kalman (altitude/velocity) and Madgwick (attitude) filters running concurrently',
      ],
    },
    badge: {
      icon: 'target',
      title: { pt: '99,89% de exatidão no apogeu', en: '99.89% apogee accuracy' },
      detail: {
        pt: 'vs. altímetro certificado — voo de 3 km na LASC 2026',
        en: 'vs. certified altimeter — 3 km flight at LASC 2026',
      },
    },
  },
  {
    id: 'parallel-stats',
    title: { pt: 'Pipeline Estatístico Paralelo', en: 'Parallel Statistics Pipeline' },
    context: 'ICMC-USP',
    short: { pt: 'Pipeline Paralelo', en: 'Parallel Pipeline' },
    period: '03/2026 – 04/2026',
    areas: ['backend'],
    stack: ['C', 'OpenMP', 'Linux', 'CMake'],
    summary: {
      pt: 'Agregação estatística em 4 níveis (aluno, cidade, região, país) sobre 3 bilhões de notas.',
      en: '4-level statistics aggregation (student, city, region, country) over three billion grades.',
    },
    highlights: {
      pt: [
        'Reduções SIMD nos laços e omp task para as agregações independentes',
        'Granularidade da paralelização ajustada por etapa, evitando threads em laços finos',
      ],
      en: [
        'SIMD reductions in the loops and omp task for independent aggregations',
        'Parallelization granularity tuned per stage, skipping threads on fine-grained loops',
      ],
    },
    badge: {
      icon: 'speed',
      title: { pt: '2,9× de speedup sobre o sequencial', en: '2.9× speedup over sequential' },
      detail: {
        pt: '3 bilhões de notas processadas com OpenMP',
        en: 'three billion grades processed with OpenMP',
      },
    },
  },
]

export const experience: Experience[] = [
  {
    role: { pt: 'Iniciação Científica', en: 'Undergraduate Research' },
    slug: 'lasdpc',
    org: { pt: 'LaSDPC', en: 'LaSDPC' },
    unit: 'ICMC-USP',
    icon: 'iot',
    period: { pt: '04/2025 – Atual', en: '04/2025 – Present' },
    points: {
      pt: [
        'Plataforma em Java/Spring Boot que ingere, processa e armazena dados de dispositivos IoT em tempo real',
        'API REST que expõe os dados e envia comandos aos dispositivos, com autenticação e monitoramento em produção',
        'Bridge em Python que traduz e valida mensagens entre o Network Server e a aplicação',
      ],
      en: [
        'Java/Spring Boot platform that ingests, processes and stores IoT device data in real time',
        'REST API that exposes the data and sends commands to devices, with authentication and monitoring in production',
        'Python bridge that translates and validates messages between the Network Server and the application',
      ],
    },
  },
  {
    role: { pt: 'Coordenador de Aviônica', en: 'Avionics Coordinator' },
    slug: 'topus',
    org: { pt: 'TOPUS Projetos Aeroespaciais', en: 'TOPUS Aerospace Projects' },
    unit: 'EESC-USP',
    icon: 'rocket',
    period: { pt: '05/2025 – 09/2026', en: '05/2025 – 09/2026' },
    points: {
      pt: [
        'Firmware em C++/FreeRTOS usado em 5 lançamentos de foguetes: sensores, máquina de estados de voo e sistemas críticos',
        'Padronizei a comunicação por rádio e a persistência de dados em bibliotecas C++ reutilizáveis',
      ],
      en: [
        'C++/FreeRTOS firmware used in 5 rocket launches: sensors, flight state machine and critical systems',
        'Standardized radio communication and data persistence into reusable C++ libraries',
      ],
    },
  },
  {
    role: { pt: 'Gerente de Projeto', en: 'Project Manager' },
    slug: 'saecomp',
    org: { pt: 'SAEComp', en: 'SAEComp' },
    unit: 'USP',
    icon: 'cart',
    period: { pt: '05/2025 – 03/2026', en: '05/2025 – 03/2026' },
    points: {
      pt: [
        'Levantei requisitos, modelei o banco PostgreSQL e coordenei a equipe da loja on-line em Node.js/TypeScript',
        'Integrei PIX com confirmação automática, eliminando a conferência manual; a loja aumentou o lucro em 75 vezes',
      ],
      en: [
        'Gathered requirements, modeled the PostgreSQL database and led the Node.js/TypeScript online store team',
        'Integrated PIX with automatic confirmation, removing manual reconciliation; the store grew profit 75-fold',
      ],
    },
  },
  {
    role: { pt: 'Diretor do Departamento de Embarcados', en: 'Embedded Systems Department Director' },
    slug: 'zenith',
    org: { pt: 'Zenith Aerospace', en: 'Zenith Aerospace' },
    unit: 'EESC-USP',
    icon: 'chip',
    period: { pt: '03/2024 – 06/2025', en: '03/2024 – 06/2025' },
    points: {
      pt: [
        'Capacitei novos membros e geri o subsistema de embarcados',
        'Camada de abstração reutilizável em C para STM32, Arduino e ESP32, eliminando drivers duplicados',
      ],
      en: [
        'Trained new members and managed the embedded subsystem',
        'Reusable C abstraction layer across STM32, Arduino and ESP32, removing duplicated drivers',
      ],
    },
  },
]

export const about = {
  title: {
    pt: 'Engenheiro de Computação em Formação',
    en: 'Computer Engineer in Training',
  },
  paragraphs: {
    pt: [
      'Moro em São Carlos (SP) e curso Engenharia de Computação na USP, um curso compartilhado entre a Escola de Engenharia de São Carlos (EESC) e o Instituto de Ciências Matemáticas e de Computação (ICMC). Desde 2024 participo de grupos de extensão: dirigi o departamento de embarcados da Zenith Aerospace, coordenei a aviônica da TOPUS e gerenciei o projeto da loja on-line da SAEComp.',
      'Na iniciação científica no LaSDPC, trabalho com redes LPWAN aplicadas à cafeicultura, do firmware e da PCB do nó sensor ao testbed de campo e à plataforma de dados que recebe as leituras. Também sou coautor de um artigo premiado com Best Paper no IEEE SmartIoT 2026.',
      'No dia a dia, uso agentes de IA como ferramenta de trabalho, do diagnóstico de falhas à documentação, sempre revisando e integrando o que eles produzem.',
    ],
    en: [
      "I live in São Carlos, Brazil, and study Computer Engineering at the University of São Paulo, a program shared between the São Carlos School of Engineering (EESC) and the Institute of Mathematical and Computer Sciences (ICMC). Since 2024 I've been part of student engineering teams: I directed Zenith Aerospace's embedded department, coordinated TOPUS's avionics and managed SAEComp's online store project.",
      "In my undergraduate research at LaSDPC, I work on LPWAN networks for coffee farming, from the sensor node's firmware and PCB to the field testbed and the data platform that receives its readings. I'm also a co-author of a paper that won the Best Paper Award at IEEE SmartIoT 2026.",
      'Day to day, I use AI agents as a working tool, from fault diagnosis to documentation, always reviewing and integrating what they produce.',
    ],
  } satisfies Localized<string[]>,
  minis: [
    {
      icon: 'rocket',
      label: { pt: 'Aviônica', en: 'Avionics' },
      detail: {
        pt: 'Coordenei a aviônica do Atlas, foguete de 3 km lançado na LASC 2026: computador de voo em pilha de PCBs próprias, FreeRTOS nos dois núcleos do ESP32, filtros de Kalman e Madgwick e 99,89% de exatidão no apogeu.',
        en: 'I coordinated the avionics of Atlas, a 3 km rocket launched at LASC 2026: a flight computer on a stack of custom PCBs, FreeRTOS on both ESP32 cores, Kalman and Madgwick filters and 99.89% apogee accuracy.',
      },
    },
    {
      icon: 'firmware',
      label: { pt: 'Firmware', en: 'Firmware' },
      detail: {
        pt: 'Firmware em C/C++ com FreeRTOS para ESP32 e STM32: computadores de voo, estações de solo, nós LoRaWAN de baixo consumo e bibliotecas de LoRa, EEPROM e filtro de Kalman usadas por toda a TOPUS.',
        en: 'C/C++ firmware with FreeRTOS for ESP32 and STM32: flight computers, ground stations, low-power LoRaWAN nodes, and LoRa, EEPROM and Kalman filter libraries used across TOPUS.',
      },
    },
    {
      icon: 'chip',
      label: { pt: 'Hardware & PCBs', en: 'Hardware & PCBs' },
      detail: {
        pt: 'Projeto de PCBs no KiCad: a pilha modular do computador de voo do Atlas, a estação de solo portátil e o nó sensor LoRaWAN da pesquisa, numa caixa à prova de intempéries.',
        en: "PCB design in KiCad: the Atlas flight computer's modular stack, the portable ground station and the research's LoRaWAN sensor node, in a weatherproof enclosure.",
      },
    },
    {
      icon: 'web',
      label: { pt: 'Web', en: 'Web' },
      detail: {
        pt: 'APIs e interfaces web: o back-end da loja SAEComp em Node.js/TypeScript com PIX, a plataforma IoT em Spring Boot e o painel de telemetria em React e FastAPI.',
        en: "APIs and web interfaces: the SAEComp store's Node.js/TypeScript back end with PIX, the Spring Boot IoT platform and the React and FastAPI telemetry dashboard.",
      },
    },
    {
      icon: 'iot',
      label: { pt: 'Pesquisador de IoT', en: 'IoT Researcher' },
      highlight: true,
      detail: {
        pt: 'Iniciação científica com bolsa FAPESP no LaSDPC (ICMC-USP), comparando protocolos LPWAN para a cafeicultura de precisão. Coautor de um artigo premiado com Best Paper no IEEE SmartIoT 2026.',
        en: 'FAPESP-funded undergraduate research at LaSDPC (ICMC-USP), comparing LPWAN protocols for precision coffee farming. Co-author of a paper that won the Best Paper Award at IEEE SmartIoT 2026.',
      },
    },
  ] as {
    icon: 'rocket' | 'firmware' | 'chip' | 'web' | 'sparkles' | 'iot'
    label: Localized
    detail: Localized
    highlight?: true
  }[],
  background: [
    {
      period: { pt: '2023 – 2027', en: '2023 – 2027' },
      place: 'São Carlos, SP',
      title: { pt: 'Universidade de São Paulo (USP)', en: 'University of São Paulo (USP)' },
      subtitle: { pt: 'Bacharelado em Engenharia de Computação', en: "Bachelor's in Computer Engineering" },
      note: { pt: 'EESC e ICMC · conclusão prevista para 2027', en: 'EESC and ICMC · expected graduation in 2027' },
      groups: ['zenith', 'topus', 'saecomp'],
    },
    {
      period: { pt: '2025 – atual', en: '2025 – present' },
      place: 'ICMC-USP',
      title: { pt: 'LaSDPC', en: 'LaSDPC' },
      subtitle: { pt: 'Iniciação Científica', en: 'Undergraduate Research' },
      note: { pt: 'Redes LPWAN e IoT aplicadas à cafeicultura', en: 'LPWAN networks and IoT for coffee farming' },
      href: '#/journey/lasdpc',
    },
  ] as {
    period: Localized
    place: string
    title: Localized
    subtitle: Localized
    note: Localized
    href?: string
    groups?: string[]
  }[],
}

export interface Award {
  icon: 'paper' | 'satellite'
  title: Localized
  event: string
  year: string
  detail: Localized
  href: string
  external?: boolean
  cta: Localized
}

const PAPER_TITLE = 'From Deployment to Operation: A Reproducible IoT Testbed for Smart-Building HVAC with OTA and Observability'

export const awards: Award[] = [
  {
    icon: 'paper',
    title: { pt: 'Best Paper Award', en: 'Best Paper Award' },
    event: 'IEEE SmartIoT 2026',
    year: '2026',
    detail: {
      pt: `Coautor de “${PAPER_TITLE}”, sobre um testbed IoT reprodutível e observável, da implantação à operação.`,
      en: `Co-author of “${PAPER_TITLE}”, on a reproducible, observable IoT testbed, from deployment to operation.`,
    },
    href: 'https://ieeexplore.ieee.org/document/11677784',
    external: true,
    cta: { pt: 'Ler o artigo no IEEE Xplore', en: 'Read the paper on IEEE Xplore' },
  },
  {
    icon: 'satellite',
    title: { pt: '2º lugar na categoria CubeSat', en: '2nd place, CubeSat category' },
    event: 'Latin American Space Challenge',
    year: '2026',
    detail: {
      pt: 'Com o Atena, CubeSat 2U da TOPUS que voou a bordo do foguete Atlas. Co-desenvolvi o firmware e projetei a telemetria LoRa bidirecional.',
      en: "With Atena, TOPUS's 2U CubeSat that flew aboard the Atlas rocket. I co-developed its firmware and designed its two-way LoRa telemetry.",
    },
    href: '#/journey/topus/atena',
    cta: { pt: 'Ver na jornada da TOPUS', en: 'See it in the TOPUS journey' },
  },
]

export type SkillIcon = 'code' | 'iot' | 'data' | 'front' | 'tools'

export const skills: { icon: SkillIcon; group: Localized; items: string[] }[] = [
  { icon: 'code', group: { pt: 'Linguagens', en: 'Languages' }, items: ['C', 'C++', 'Python', 'TypeScript', 'JavaScript', 'Java', 'SQL'] },
  {
    icon: 'iot',
    group: { pt: 'Embarcados & IoT', en: 'Embedded & IoT' },
    items: ['ESP32', 'STM32', 'Raspberry Pi', 'FreeRTOS', 'PlatformIO', 'KiCad', 'LoRa / LoRaWAN', 'MQTT', 'OpenMP'],
  },
  {
    icon: 'data',
    group: { pt: 'Back-end & Dados', en: 'Back-end & Data' },
    items: ['Node.js', 'Express', 'Spring Boot', 'FastAPI', 'PostgreSQL', 'TimescaleDB', 'Redis', 'Apache Kafka'],
  },
  { icon: 'front', group: { pt: 'Front-end', en: 'Front-end' }, items: ['React', 'HTML', 'CSS'] },
  {
    icon: 'tools',
    group: { pt: 'DevOps & Ferramentas', en: 'DevOps & Tools' },
    items: ['Docker', 'Docker Compose', 'Prometheus', 'Git', 'Linux', 'CMake', 'Swagger'],
  },
]

export interface Resume {
  id: string
  label: Localized
  files: { pt?: string; en: string }
}

export const resumes: Resume[] = [
  {
    id: 'development',
    label: { pt: 'Desenvolvimento', en: 'Software Development' },
    files: { pt: 'cv/vitor-vaz-cv-desenvolvimento.pdf', en: 'cv/vitor-vaz-resume-development.pdf' },
  },
  {
    id: 'systems',
    label: { pt: 'Engenharia de Sistemas', en: 'Systems Engineering' },
    files: { pt: 'cv/vitor-vaz-cv-engenharia-de-sistemas.pdf', en: 'cv/vitor-vaz-resume-systems-engineer.pdf' },
  },
  {
    id: 'embedded',
    label: { pt: 'Sistemas Embarcados', en: 'Embedded Systems' },
    files: { pt: 'cv/vitor-vaz-cv-embarcados.pdf', en: 'cv/vitor-vaz-resume-embedded.pdf' },
  },
]
