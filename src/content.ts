// Todo o conteúdo do site fica aqui, em PT e EN.
// Para editar textos, projetos ou experiências, mexa apenas neste arquivo.

export type Lang = 'pt' | 'en'
export type Localized<T = string> = Record<Lang, T>

export type Area = 'embedded' | 'backend' | 'iot'

export interface Project {
  id: string
  title: Localized
  context: string
  period: string
  areas: Area[]
  stack: string[]
  summary: Localized
  highlights: Localized<string[]>
  metric?: { value: string; label: Localized }
  repo?: string
}

export interface Experience {
  role: Localized
  org: string
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
    nav: { projects: 'Projetos', experience: 'Experiência', skills: 'Tecnologias', contact: 'Contato' },
    role: 'Engenharia de Computação · USP São Carlos',
    headline: 'Sistemas embarcados, IoT e back-end — do firmware à API.',
    summary:
      'Construo APIs REST, serviços orientados a eventos, pipelines de dados em tempo real e firmware embarcado, com código em produção em uma loja on-line com pagamentos PIX, em plataformas de telemetria e IoT e em foguetes de competição.',
    ctaProjects: 'Ver projetos',
    ctaContact: 'Entrar em contato',
    projectsTitle: 'Projetos em destaque',
    projectsLead: 'Os projetos que mais aparecem nos meus currículos.',
    filters: { all: 'Todos', embedded: 'Embarcados', backend: 'Back-end & Dados', iot: 'IoT' },
    privateCode: 'Código privado',
    viewCode: 'Ver código',
    experienceTitle: 'Experiência',
    educationTitle: 'Formação',
    education: {
      school: 'Universidade de São Paulo (USP) — EESC e ICMC',
      degree: 'Bacharelado em Engenharia de Computação',
      period: '2023 – 2027 (previsão)',
    },
    awardsTitle: 'Prêmios',
    skillsTitle: 'Tecnologias',
    contactTitle: 'Vamos conversar',
    contactLead: 'Aberto a estágios e projetos em embarcados, IoT e back-end.',
    themeToggle: 'Alternar tema',
    langToggle: 'Switch to English',
    footer: 'Feito com React + TypeScript · hospedado no GitHub Pages',
  },
  en: {
    nav: { projects: 'Projects', experience: 'Experience', skills: 'Skills', contact: 'Contact' },
    role: 'Computer Engineering · University of São Paulo',
    headline: 'Embedded systems, IoT and back-end — from firmware to API.',
    summary:
      'I build REST APIs, event-driven services, real-time data pipelines and embedded firmware, with code in production in an online store with PIX payments, in telemetry and IoT platforms, and in competition rockets.',
    ctaProjects: 'See projects',
    ctaContact: 'Get in touch',
    projectsTitle: 'Featured projects',
    projectsLead: 'The projects that show up most across my resumes.',
    filters: { all: 'All', embedded: 'Embedded', backend: 'Back-end & Data', iot: 'IoT' },
    privateCode: 'Private code',
    viewCode: 'View code',
    experienceTitle: 'Experience',
    educationTitle: 'Education',
    education: {
      school: 'University of São Paulo (USP) — EESC and ICMC',
      degree: "Bachelor's in Computer Engineering",
      period: '2023 – 2027 (expected)',
    },
    awardsTitle: 'Awards',
    skillsTitle: 'Skills',
    contactTitle: "Let's talk",
    contactLead: 'Open to internships and projects in embedded, IoT and back-end.',
    themeToggle: 'Toggle theme',
    langToggle: 'Mudar para português',
    footer: 'Built with React + TypeScript · hosted on GitHub Pages',
  },
} satisfies Record<Lang, unknown>

export type UI = (typeof ui)['pt']

// Ordenados pela frequência com que aparecem nos currículos.
export const projects: Project[] = [
  {
    id: 'iot-platform',
    title: {
      pt: 'Plataforma de Monitoramento IoT na Cafeicultura',
      en: 'IoT Monitoring Platform for Coffee Farming',
    },
    context: 'LaSDPC — ICMC-USP',
    period: '06/2026 – 09/2026',
    areas: ['backend', 'iot'],
    stack: ['Java 21', 'Spring Boot', 'Kafka', 'PostgreSQL', 'TimescaleDB', 'MQTT', 'Docker', 'Prometheus'],
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
    metric: { value: '2 km', label: { pt: 'de alcance de telemetria em voo', en: 'in-flight telemetry range' } },
  },
  {
    id: 'telemetry-dashboard',
    title: { pt: 'Painel de Telemetria em Tempo Real', en: 'Real-Time Telemetry Dashboard' },
    context: 'TOPUS — EESC-USP',
    period: '09/2025 – 08/2026',
    areas: ['backend', 'embedded'],
    stack: ['FastAPI', 'WebSocket', 'React', 'TypeScript', 'Recharts', 'three.js', 'Docker Compose'],
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
  },
  {
    id: 'saecomp-store',
    title: { pt: 'API da Loja SAEComp', en: 'SAEComp Store API' },
    context: 'SAEComp — USP',
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
    metric: { value: '75×', label: { pt: 'no lucro da secretaria', en: "growth in the office's profit" } },
    repo: 'https://github.com/SAEComp/site-saecomp-back-lojinha',
  },
  {
    id: 'lpwan-bridge',
    title: { pt: 'Bridge LPWAN ↔ Aplicação', en: 'LPWAN ↔ Application Bridge' },
    context: 'LaSDPC — ICMC-USP',
    period: '05/2026 – 09/2026',
    areas: ['backend', 'iot'],
    stack: ['Python', 'MQTT', 'Pydantic', 'Redis', 'Prometheus'],
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
    period: '03/2026 – 09/2026',
    areas: ['embedded'],
    stack: ['ESP32', 'C++', 'FreeRTOS', 'KiCad', 'Kalman', 'Madgwick', 'LoRa', 'GNSS'],
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
    metric: { value: '0,11%', label: { pt: 'de erro no apogeu vs. altímetro certificado', en: 'apogee error vs. certified altimeter' } },
  },
  {
    id: 'parallel-stats',
    title: { pt: 'Pipeline Estatístico Paralelo', en: 'Parallel Statistics Pipeline' },
    context: 'ICMC-USP',
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
    metric: { value: '2,9×', label: { pt: 'de speedup sobre o sequencial', en: 'speedup over sequential' } },
  },
]

export const experience: Experience[] = [
  {
    role: { pt: 'Iniciação Científica', en: 'Undergraduate Research' },
    org: 'LaSDPC — ICMC-USP',
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
    org: 'TOPUS Projetos Aeroespaciais — EESC-USP',
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
    org: 'SAEComp — USP',
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
    org: 'Zenith Aerospace — EESC-USP',
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

export const awards: Localized<string>[] = [
  {
    pt: 'Best Paper Award — IEEE SmartIoT 2026, coautor de um trabalho sobre testbed IoT reprodutível e observável',
    en: 'Best Paper Award — IEEE SmartIoT 2026, co-author of a paper on a reproducible, observable IoT testbed',
  },
  {
    pt: '2º lugar na categoria CubeSat — Latin American Space Challenge 2026, com o CubeSat Atena (TOPUS)',
    en: '2nd place, CubeSat category — Latin American Space Challenge 2026, with the Atena CubeSat (TOPUS)',
  },
]

export const skills: { group: Localized; items: string[] }[] = [
  { group: { pt: 'Linguagens', en: 'Languages' }, items: ['C', 'C++', 'Python', 'TypeScript', 'JavaScript', 'Java', 'SQL'] },
  {
    group: { pt: 'Embarcados & IoT', en: 'Embedded & IoT' },
    items: ['ESP32', 'STM32', 'Raspberry Pi', 'FreeRTOS', 'PlatformIO', 'KiCad', 'LoRa / LoRaWAN', 'MQTT', 'OpenMP'],
  },
  {
    group: { pt: 'Back-end & Dados', en: 'Back-end & Data' },
    items: ['Node.js', 'Express', 'Spring Boot', 'FastAPI', 'PostgreSQL', 'TimescaleDB', 'Redis', 'Apache Kafka'],
  },
  { group: { pt: 'Front-end', en: 'Front-end' }, items: ['React', 'Vite', 'Recharts', 'three.js'] },
  {
    group: { pt: 'DevOps & Ferramentas', en: 'DevOps & Tools' },
    items: ['Docker', 'Docker Compose', 'Prometheus', 'Git', 'Linux', 'CMake', 'Swagger'],
  },
]
