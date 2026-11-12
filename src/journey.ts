import type { Localized } from './content.ts'

export interface JourneyImage {
  src: string
  w: number
  h: number
  tag: Localized
  title: Localized
  caption: Localized
  fit?: 'contain' | 'screen' | 'diagram'
  featured?: true
  pos?: string
}

export interface JourneySection {
  title: Localized
  period?: Localized
  body: Localized
  images?: JourneyImage[]
  timeline?: false
  anchor?: string
}

export type StatIcon =
  | 'antenna'
  | 'graduation'
  | 'wave'
  | 'rocket'
  | 'altitude'
  | 'target'
  | 'trophy'
  | 'growth'
  | 'bolt'
  | 'money'
  | 'stock'
  | 'chip'
  | 'balloon'

export type FlightStage = 'flight' | 'boost' | 'coast' | 'apogee' | 'drogue' | 'main'

export type ArchPart = 'overview' | 'nodes' | 'network' | 'bridge' | 'app' | 'ui' | 'monitoring'

export interface JourneyStat {
  value: string | Localized
  label: Localized
  icon: StatIcon
  flight?: FlightStage
  part?: ArchPart
  section?: string
}

export interface JourneyDetail {
  intro: Localized
  stats: JourneyStat[]
  flightChart?: true
  architecture?: true
  sections: JourneySection[]
  stack: string[]
  link?: { href: string; label: Localized }
}

export const flightStages: Record<FlightStage, { title: Localized; body: Localized }> = {
  flight: {
    title: { pt: 'Voo inteiro', en: 'Whole flight' },
    body: {
      pt: 'Da decolagem ao pouso em 147 s, com o Atena, o CubeSat 2U da equipe, a bordo.',
      en: "Lift-off to landing in 147 s, with Atena, the team's 2U CubeSat, aboard.",
    },
  },
  boost: {
    title: { pt: 'Propulsão', en: 'Powered ascent' },
    body: {
      pt: 'O motor queima por 2,8 s e leva o foguete a 778 m. A máquina de estados do firmware registrou a decolagem a 211 m e o fim da queima a 778 m.',
      en: 'The motor burns for 2.8 s and takes the rocket to 778 m. The firmware state machine logged lift-off at 211 m and burnout at 778 m.',
    },
  },
  coast: {
    title: { pt: 'Subida sem motor', en: 'Coast' },
    body: {
      pt: 'Sem empuxo, o foguete sobe por inércia de 778 m até o apogeu, em 16,7 s. O filtro de Kalman do firmware funde os sensores para estimar altitude e velocidade a bordo.',
      en: "With no thrust, the rocket coasts from 778 m up to apogee in 16.7 s. The firmware's Kalman filter fuses the sensors to estimate altitude and velocity on board.",
    },
  },
  apogee: {
    title: { pt: 'Apogeu', en: 'Apogee' },
    body: {
      pt: 'O Kalman de bordo marcou 1.894,6 m; o altímetro comercial, independente e no mesmo foguete, 1.892,6 m. A diferença de 2,0 m dá 99,89% de exatidão.',
      en: 'The on-board Kalman filter reported 1,894.6 m; the commercial altimeter, independent and in the same rocket, 1,892.6 m. The 2.0 m difference means 99.89% accuracy.',
    },
  },
  drogue: {
    title: { pt: 'Descida com drogue', en: 'Drogue descent' },
    body: {
      pt: 'O paraquedas drogue foi acionado a 1.875 m, e o foguete desceu a cerca de 15 m/s até 499 m.',
      en: 'The drogue parachute deployed at 1,875 m, and the rocket descended at about 15 m/s down to 499 m.',
    },
  },
  main: {
    title: { pt: 'Paraquedas principal', en: 'Main parachute' },
    body: {
      pt: 'O paraquedas principal foi acionado a 499 m, e o foguete pousou 35 s depois, a cerca de 14 m/s.',
      en: 'The main parachute deployed at 499 m, and the rocket landed 35 s later at about 14 m/s.',
    },
  },
}

export const archParts: Record<ArchPart, { title: Localized; tech?: string; body: Localized }> = {
  overview: {
    title: { pt: 'Visão geral', en: 'Overview' },
    body: {
      pt: 'Cada nó envia suas leituras pelo seu protocolo. Os network servers as recebem e as passam por MQTT à bridge, que as padroniza e entrega por TCP ao servidor de aplicação; ele as guarda, e a interface as consulta por HTTP. Escolha uma camada para ver como ela funciona.',
      en: 'Each sensor device sends its readings over its own protocol. The network servers receive them and pass them over MQTT to the bridge, which normalizes them and delivers them over TCP to the application server; it stores them, and the interface queries them over HTTP. Pick a layer to see how it works.',
    },
  },
  nodes: {
    title: { pt: 'Nós sensores', en: 'Sensor devices' },
    body: {
      pt: 'Cada protocolo comparado (mioty, LoRaWAN, NB-IoT e Sigfox) tem seus nós em campo. Nos de LoRaWAN e NB-IoT, com PCB que projetei, um ESP32 lê temperatura e umidade (DHT22), luz (LDR) e o consumo de energia (INA226), e o firmware em C++ com FreeRTOS separa leitura, envio e economia de bateria em tarefas.',
      en: 'Each protocol under comparison (mioty, LoRaWAN, NB-IoT and Sigfox) has its own sensor devices in the field. On the LoRaWAN and NB-IoT devices, built on PCBs I designed, an ESP32 reads temperature and humidity (DHT22), light (LDR) and power draw (INA226), and the C++/FreeRTOS firmware splits reading, sending and battery saving into tasks.',
    },
  },
  network: {
    title: { pt: 'Network servers', en: 'Network servers' },
    tech: 'mioty Go · ChirpStack · TIM/Vivo · Sigfox Cloud',
    body: {
      pt: 'Cada rede tem o seu: mioty Go para o mioty, o ChirpStack v4 (que implantei com Docker, na faixa AU915) para o LoRaWAN, a rede da operadora (TIM e Vivo) para o NB-IoT e a Sigfox Cloud para o Sigfox. Eles recebem os pacotes de rádio, identificam o dispositivo e passam a mensagem adiante por MQTT.',
      en: 'Each network has its own: mioty Go for mioty, ChirpStack v4 (which I deployed with Docker, on the AU915 band) for LoRaWAN, the carrier network (TIM and Vivo) for NB-IoT and Sigfox Cloud for Sigfox. They receive the radio packets, identify the device and pass the message on over MQTT.',
    },
  },
  bridge: {
    title: { pt: 'Bridge', en: 'Bridge' },
    tech: 'MQTT (Mosquitto) · Python · Redis',
    body: {
      pt: 'Liga as quatro redes à aplicação. As mensagens chegam num broker MQTT, e um serviço em Python que escrevi consulta no Redis o mapeamento entre o identificador do dispositivo em cada rede e o sensor cadastrado na aplicação, converte tudo para um formato único e entrega ao servidor de aplicação por TCP. A tradução funciona nos dois sentidos, e a aplicação não precisa conhecer os detalhes de cada rede.',
      en: "Connects the four networks to the application. Messages arrive at an MQTT broker, and a Python service I wrote looks up in Redis the mapping between each network's device ID and the sensor registered in the application, converts everything to a single format and delivers it to the application server over TCP. The translation works both ways, and the application doesn't need to know the details of each network.",
    },
  },
  app: {
    title: { pt: 'Servidor de aplicação', en: 'Application server' },
    tech: 'Kafka · Spring · PostgreSQL/TimescaleDB · Spring Boot',
    body: {
      pt: 'Recebe, guarda e serve os dados; construí essa camada. As mensagens entram num Kafka, que as mantém em ordem num log: se o processamento atrasa, as leituras esperam em vez de se perder. Um serviço em Spring as consome e grava no PostgreSQL com TimescaleDB, feito para séries temporais, e uma API REST em Spring Boot, documentada com Swagger, entrega os dados à interface.',
      en: 'Receives, stores and serves the data; I built this layer. Messages enter a Kafka log that keeps them in order: if processing falls behind, readings wait instead of being lost. A Spring service consumes them and writes them to PostgreSQL with TimescaleDB, built for time series, and a Spring Boot REST API, documented with Swagger, serves the data to the interface.',
    },
  },
  ui: {
    title: { pt: 'Interface web', en: 'Web interface' },
    tech: 'Angular',
    body: {
      pt: 'A interface, em Angular, consulta a API por HTTP e mostra as leituras de cada sensor e de cada protocolo. Por ela, os usuários também enviam comandos aos atuadores e atualizam os dispositivos; esses pedidos fazem o mesmo caminho no sentido inverso, da API até o campo.',
      en: 'The Angular interface queries the API over HTTP and shows the readings for each sensor and each protocol. Users can also send commands to actuators and update the devices from it; these requests travel the same path in reverse, from the API down to the field.',
    },
  },
  monitoring: {
    title: { pt: 'Monitoramento', en: 'Monitoring' },
    tech: 'Prometheus · Grafana',
    body: {
      pt: 'O Prometheus coleta periodicamente as métricas dos serviços do servidor de aplicação, e o Grafana as mostra em dashboards. Além de acompanhar a saúde do testbed, isso dá observabilidade sobre os próprios dados: quantas leituras chegam de cada protocolo, com que atraso e onde houve falhas de entrega.',
      en: "Prometheus periodically scrapes metrics from the application server's services, and Grafana shows them in dashboards. Besides tracking the testbed's health, this gives observability over the data itself: how many readings arrive from each protocol, with what delay, and where deliveries failed.",
    },
  },
}

export const journeyDetails: Record<string, JourneyDetail> = {
  lasdpc: {
    intro: {
      pt: 'Iniciação científica com bolsa FAPESP no LaSDPC (ICMC-USP), orientada pelo Prof. Dr. Júlio Cézar Estrella, no projeto “Conectividade de Longo Alcance para Cafeicultura de Precisão”. A pesquisa compara quatro protocolos LPWAN (LoRaWAN, NB-IoT, Sigfox e mioty) em alcance, RSSI/SNR, entrega de pacotes, latência e consumo de energia.',
      en: 'FAPESP-funded undergraduate research at LaSDPC, ICMC-USP, advised by Prof. Júlio Cézar Estrella, on “Long-Range Connectivity for Precision Coffee Farming”. It compares four LPWAN protocols (LoRaWAN, NB-IoT, Sigfox and mioty) in range, RSSI/SNR, packet delivery, latency and energy consumption.',
    },
    stats: [
      { value: '4', label: { pt: 'protocolos LPWAN comparados', en: 'LPWAN protocols compared' }, icon: 'antenna', part: 'nodes' },
      { value: 'FAPESP', label: { pt: 'bolsa de iniciação científica', en: 'undergraduate research grant' }, icon: 'graduation' },
      { value: 'AU915', label: { pt: 'faixa LoRaWAN brasileira', en: 'Brazilian LoRaWAN band' }, icon: 'wave', part: 'network' },
    ],
    architecture: true,
    sections: [
      {
        title: { pt: 'Revisão da literatura', en: 'Literature review' },
        period: { pt: '04/2025 – 01/2026', en: '04/2025 – 01/2026' },
        body: {
          pt: 'Revisei a literatura sobre o desempenho de redes LPWAN na agricultura, e as conclusões definiram os requisitos do testbed que estou construindo.',
          en: 'I reviewed the literature on LPWAN performance in agriculture, and its findings shaped the requirements of the testbed I am building.',
        },
      },
      {
        title: { pt: 'Nó sensor', en: 'Sensor node' },
        period: { pt: '01/2026 – 09/2026', en: '01/2026 – 09/2026' },
        body: {
          pt: 'Projetei a PCB do nó sensor no KiCad (sensores ambientais, monitoramento de energia e alimentação por bateria, numa caixa à prova de intempéries) e escrevi o firmware multitarefa em C++ com FreeRTOS, com gerenciamento de energia para prolongar a bateria.',
          en: "I designed the sensor node's PCB in KiCad (environmental sensors, power monitoring and battery supply, in a weatherproof enclosure) and wrote its multitasking firmware in C++ with FreeRTOS, with power management to extend battery life.",
        },
        images: [
          {
            src: 'journey/lasdpc/01-lorawan-3d-iso.webp',
            w: 1568,
            h: 1176,
            tag: { pt: 'LoRaWAN · KiCad', en: 'LoRaWAN · KiCad' },
            title: { pt: 'Nó sensor LoRaWAN', en: 'LoRaWAN sensor node' },
            caption: {
              pt: 'Render 3D da placa LoRaWAN (KiCad 10): ESP32 DevKitC, rádio LoRa SX1276 de 915 MHz com antena SMA, DHT22, LDR, monitor de energia INA226 e bateria 18650 com carregador TP4056.',
              en: 'KiCad 10 3D render of the LoRaWAN board: ESP32 DevKitC, 915 MHz SX1276 LoRa radio with SMA antenna, DHT22, LDR, INA226 power monitor and an 18650 battery with a TP4056 charger.',
            },
          },
          {
            src: 'journey/lasdpc/02-lorawan-3d-topo.webp',
            w: 1568,
            h: 1176,
            tag: { pt: 'LoRaWAN · KiCad', en: 'LoRaWAN · KiCad' },
            title: { pt: 'Placa LoRaWAN, vista de cima', en: 'LoRaWAN board, top view' },
            caption: {
              pt: 'Contorno em cruz de 79,5 × 104,5 mm, desenhado para caber na caixa hermética IP66 do nó em campo.',
              en: 'Cross-shaped 79.5 × 104.5 mm outline, designed to fit the IP66 hermetic enclosure used in the field.',
            },
          },
          {
            src: 'journey/lasdpc/03-lorawan-3d-fundo.webp',
            w: 1568,
            h: 1176,
            tag: { pt: 'LoRaWAN · KiCad', en: 'LoRaWAN · KiCad' },
            title: { pt: 'Placa LoRaWAN, trilhas', en: 'LoRaWAN board, traces' },
            caption: {
              pt: 'Face inferior: placa de fenolite de face simples, com todo o cobre e o plano de terra nesta camada; as poucas ligações da frente são jumpers de fio curtos.',
              en: 'Bottom side: a single-sided phenolic board, with all copper and the ground plane on this layer; the few front connections are short wire jumpers.',
            },
          },
          {
            src: 'journey/lasdpc/04-nb-iot-3d-iso.webp',
            w: 1568,
            h: 1176,
            tag: { pt: 'NB-IoT · KiCad', en: 'NB-IoT · KiCad' },
            title: { pt: 'Nó sensor NB-IoT', en: 'NB-IoT sensor node' },
            caption: {
              pt: 'Render 3D da placa NB-IoT: mesmo contorno, alimentação e sensores da placa LoRaWAN, com o modem SIMCom SIM7000G (LTE Cat-M1 / NB-IoT) no lugar do rádio LoRa.',
              en: 'KiCad 3D render of the NB-IoT board: same outline, power and sensors as the LoRaWAN board, with a SIMCom SIM7000G modem (LTE Cat-M1 / NB-IoT) in place of the LoRa radio.',
            },
          },
          {
            src: 'journey/lasdpc/05-nb-iot-3d-topo.webp',
            w: 1568,
            h: 1176,
            tag: { pt: 'NB-IoT · KiCad', en: 'NB-IoT · KiCad' },
            title: { pt: 'Placa NB-IoT, vista de cima', en: 'NB-IoT board, top view' },
            caption: {
              pt: 'Vista de cima da placa NB-IoT, com o modem SIM7000G e o slot do chip da operadora.',
              en: 'Top view of the NB-IoT board, with the SIM7000G modem and the carrier SIM slot.',
            },
          },
        ],
      },
      {
        title: { pt: 'Infraestrutura', en: 'Infrastructure' },
        period: { pt: '05/2026 – 09/2026', en: '05/2026 – 09/2026' },
        body: {
          pt: 'Implantei um Network Server LoRaWAN (ChirpStack v4, AU915) com Docker para o gateway do laboratório. Escrevi uma bridge em Python que o conecta ao broker MQTT da aplicação, traduzindo identidades de dispositivo e formatos de mensagem entre os dois sistemas. Também construí o servidor de aplicação que ingere, armazena e serve os dados, com Kafka, PostgreSQL/TimescaleDB e uma API REST em Spring Boot, monitorado com Prometheus.',
          en: "I deployed a LoRaWAN Network Server (ChirpStack v4, AU915) with Docker for the lab's gateway. I wrote a Python bridge that connects it to the application's MQTT broker, translating device identities and message formats between the two systems. I also built the application server that ingests, stores and serves the data, with Kafka, PostgreSQL/TimescaleDB and a Spring Boot REST API, monitored with Prometheus.",
        },
        images: [
          {
            src: 'journey/lasdpc/06-arquitetura-geral.webp',
            w: 1600,
            h: 1347,
            tag: { pt: 'Arquitetura', en: 'Architecture' },
            fit: 'diagram',
            title: { pt: 'Arquitetura geral do testbed', en: 'Overall testbed architecture' },
            caption: {
              pt: 'Os nós de cada protocolo (mioty, LoRaWAN, NB-IoT e Sigfox) chegam aos seus network servers; a bridge traz todas as mensagens por MQTT para um único servidor de aplicação, com Kafka, PostgreSQL, API e interface, monitorado com Prometheus e Grafana.',
              en: "Each protocol's nodes (mioty, LoRaWAN, NB-IoT and Sigfox) reach their own network servers; the bridge brings every message over MQTT into a single application server with Kafka, PostgreSQL, an API and a user interface, monitored with Prometheus and Grafana.",
            },
          },
        ],
      },
    ],
    stack: ['ESP32', 'C/C++', 'FreeRTOS', 'PlatformIO', 'LoRaWAN', 'ChirpStack', 'MQTT', 'KiCad', 'Python', 'Redis', 'Kafka', 'Spring Boot', 'Swagger', 'JavaScript', 'PostgreSQL/TimescaleDB', 'Docker', 'Docker Compose'],
  },

  topus: {
    intro: {
      pt: 'Na equipe de aviônica da TOPUS, trabalhei nos computadores de voo e nas estações de solo de quatro veículos. Coordenei a aviônica do Atlas, o foguete de 3 km lançado na LASC 2026 (Latin American Space Challenge), em Iacanga-SP.',
      en: 'On the TOPUS avionics team, I worked on the flight computers and ground stations of four vehicles. I coordinated the avionics of Atlas, the 3 km rocket launched at LASC 2026 (Latin American Space Challenge) in Iacanga, Brazil.',
    },
    stats: [
      { value: '4', label: { pt: 'veículos com a minha aviônica', en: 'vehicles with my avionics' }, icon: 'rocket', section: 'Omega (500 m) and Rigel IV (1 km), LASC 2025' },
      { value: '1.895 m', label: { pt: 'apogeu do Atlas', en: 'Atlas apogee' }, icon: 'altitude', flight: 'apogee' },
      { value: '99,89%', label: { pt: 'de exatidão no apogeu', en: 'apogee accuracy' }, icon: 'target', flight: 'apogee' },
      { value: '2º', label: { pt: 'lugar CubeSat na LASC 2026', en: 'place, CubeSat at LASC 2026' }, icon: 'trophy', flight: 'flight' },
    ],
    flightChart: true,
    sections: [
      {
        title: { pt: 'Omega (500 m) e Rigel IV (1 km), LASC 2025', en: 'Omega (500 m) and Rigel IV (1 km), LASC 2025' },
        period: { pt: '08/2025 – 06/2026', en: '08/2025 – 06/2026' },
        body: {
          pt: 'Desenvolvi o software embarcado em C++ e a telemetria LoRa dos dois foguetes, o que permitiu acompanhar o lançamento em tempo real e recuperá-los rapidamente pelas coordenadas GPS recebidas.',
          en: 'I developed the embedded C++ software and LoRa telemetry of both rockets, allowing real-time tracking during launch and fast recovery using the received GPS coordinates.',
        },
        images: [
          {
            src: 'journey/topus/12-omega.webp',
            w: 618,
            h: 489,
            tag: { pt: 'Omega · 500 m', en: 'Omega · 500 m' },
            pos: 'center 35%',
            title: { pt: 'Com o Omega em campo', en: 'With Omega in the field' },
            caption: {
              pt: 'Com as partes do Omega, o foguete de 500 m, no campo de lançamento da LASC 2025.',
              en: 'Holding the parts of Omega, the 500 m rocket, at the LASC 2025 launch field.',
            },
          },
          {
            src: 'journey/topus/13-rigel.webp',
            w: 1080,
            h: 1080,
            tag: { pt: 'Rigel IV · 1 km', en: 'Rigel IV · 1 km' },
            pos: 'center 40%',
            title: { pt: 'A equipe com o Rigel IV', en: 'The team with Rigel IV' },
            caption: {
              pt: 'Parte da equipe com o Rigel IV, o foguete de 1 km, diante do painel de missões da LASC 2025.',
              en: 'Part of the team with Rigel IV, the 1 km rocket, in front of the LASC 2025 mission wall.',
            },
          },
          {
            src: 'journey/topus/14-omega-rigel-estande.webp',
            w: 1080,
            h: 1080,
            tag: { pt: 'LASC 2025', en: 'LASC 2025' },
            title: { pt: 'Omega e Rigel IV no estande', en: 'Omega and Rigel IV at the booth' },
            caption: {
              pt: 'Os dois foguetes expostos no estande da TOPUS, diante dos banners de cada missão.',
              en: 'Both rockets on display at the TOPUS booth, in front of each mission banner.',
            },
          },
          {
            src: 'journey/topus/15-rigel-eletronica.webp',
            w: 1080,
            h: 1080,
            tag: { pt: 'Hardware', en: 'Hardware' },
            pos: 'center 60%',
            title: { pt: 'A eletrônica do Rigel IV', en: "Rigel IV's electronics" },
            caption: {
              pt: 'As placas da aviônica na bancada, sendo testadas com o multímetro durante a competição.',
              en: 'The avionics boards on the bench, being tested with a multimeter during the competition.',
            },
          },
          {
            src: 'journey/topus/16-rigel-premio-inovacao.webp',
            w: 1080,
            h: 1080,
            tag: { pt: 'Premiação', en: 'Awards' },
            pos: 'center 40%',
            title: { pt: 'Prêmio de inovação do Rigel IV', en: "Rigel IV's innovation award" },
            caption: {
              pt: 'O telão da LASC 2025: “TOPUS Projetos Aeroespaciais · 54 - Rígel IV · Rick Maschek Award for Innovation”.',
              en: 'The LASC 2025 screen: “TOPUS Projetos Aeroespaciais · 54 - Rígel IV · Rick Maschek Award for Innovation”.',
            },
          },
        ],
      },
      {
        title: { pt: 'Segmento de solo', en: 'Ground segment' },
        period: { pt: '08/2025 – 09/2026', en: '08/2025 – 09/2026' },
        body: {
          pt: 'Desenvolvi as estações que recebem essa telemetria, incluindo uma portátil, com PCB e firmware FreeRTOS próprios, que permite ao operador mudar os parâmetros do rádio em tempo real. Os dados alimentam uma interface visual que reconstruí em React e TypeScript, com back-end em Python (FastAPI) que lê a estação pela serial e mostra gráficos ao vivo e a atitude do veículo em 3D.',
          en: "I developed the stations that receive this telemetry, including a portable one with its own PCB and FreeRTOS firmware that lets the operator change radio parameters in real time. The data feeds a visual interface I rebuilt in React and TypeScript, with a Python (FastAPI) backend that reads the station over serial and shows live charts and the vehicle's attitude in 3D.",
        },
        images: [
          {
            src: 'journey/topus/04-interface-estacao.webp',
            w: 1140,
            h: 594,
            tag: { pt: 'Software', en: 'Software' },
            fit: 'contain',
            title: { pt: 'Interface da estação durante o voo', en: 'Ground station interface during the flight' },
            caption: {
              pt: 'Painel de telemetria em tempo real (React/TypeScript e FastAPI): fase do voo, estado da recuperação, altitude e velocidade filtradas e a atitude do foguete em 3D.',
              en: "Real-time telemetry dashboard (React/TypeScript and FastAPI): flight state, recovery status, Kalman-filtered altitude and velocity, and the rocket's attitude in 3D.",
            },
          },
          {
            src: 'journey/topus/17-antena-campo.webp',
            w: 1080,
            h: 1080,
            tag: { pt: 'Rastreamento', en: 'Tracking' },
            pos: 'center 40%',
            title: { pt: 'Antena em campo', en: 'Antenna in the field' },
            caption: {
              pt: 'A equipe apontando a antena Yagi para acompanhar a telemetria dos foguetes na LASC 2025.',
              en: "The team aiming the Yagi antenna to follow the rockets' telemetry at LASC 2025.",
            },
          },
          {
            src: 'journey/topus/18-antena-rastreamento.webp',
            w: 1080,
            h: 1080,
            tag: { pt: 'Rastreamento', en: 'Tracking' },
            pos: 'center 30%',
            title: { pt: 'Rastreando o voo', en: 'Tracking the flight' },
            caption: {
              pt: 'A antena Yagi em uso durante um lançamento da LASC 2025.',
              en: 'The Yagi antenna in use during a LASC 2025 launch.',
            },
          },
        ],
      },
      {
        title: { pt: 'Projeção do filtro de Kalman multilinear', en: 'Multilinear Kalman filter design' },
        period: { pt: '02/2026 – 03/2026', en: '02/2026 – 03/2026' },
        body: {
          pt: 'Projetei a biblioteca de filtro de Kalman multilinear da TOPUS, em C++ com a biblioteca Eigen, a partir do exemplo de estimativa de altitude de foguete do livro Kalman Filter, de Alex Becker. O filtro estima altitude e velocidade usando a altitude do barômetro como medida e a aceleração da IMU como entrada de controle. Validei o filtro com os dados reais do lançamento do Rigel IV: a velocidade derivada do barômetro chegava a picos de 1.111 m/s por causa do ruído, enquanto a estimada pelo filtro teve pico de 242 m/s; na descida, o desvio-padrão da velocidade caiu de 12,7 m/s para 0,66 m/s. A mesma biblioteca roda no computador de voo do Atlas e no CubeSat Atena.',
          en: "I designed TOPUS's multilinear Kalman filter library, in C++ with the Eigen library, based on the rocket altitude estimation example from Alex Becker's book Kalman Filter. The filter estimates altitude and velocity using the barometer altitude as the measurement and the IMU acceleration as the control input. I validated it with real launch data from Rigel IV: the velocity derived from the barometer reached noise spikes of 1,111 m/s, while the filter's estimate peaked at 242 m/s; during the descent, the velocity standard deviation dropped from 12.7 m/s to 0.66 m/s. The same library runs on the Atlas flight computer and on the Atena CubeSat.",
        },
        images: [
          {
            src: 'journey/topus/20-kalman-altitude-rigel.webp',
            w: 1800,
            h: 960,
            tag: { pt: 'Dados de voo · Rigel IV', en: 'Flight data · Rigel IV' },
            fit: 'contain',
            title: { pt: 'Altitude antes e depois do filtro', en: 'Altitude before and after the filter' },
            caption: {
              pt: 'Primeiros 12 s da subida do Rigel IV: a altitude do barômetro (laranja) é atualizada em degraus; o filtro de Kalman (azul), alimentado também pela aceleração da IMU, produz uma estimativa contínua.',
              en: "First 12 s of Rigel IV's ascent: the barometer altitude (orange) updates in steps; the Kalman filter (blue), also fed with IMU acceleration, produces a continuous estimate.",
            },
          },
          {
            src: 'journey/topus/21-kalman-velocidade-rigel.webp',
            w: 1800,
            h: 960,
            tag: { pt: 'Dados de voo · Rigel IV', en: 'Flight data · Rigel IV' },
            fit: 'contain',
            title: { pt: 'Velocidade antes e depois do filtro', en: 'Velocity before and after the filter' },
            caption: {
              pt: 'Voo inteiro do Rigel IV: a velocidade derivada do barômetro (laranja) tem picos de ruído de até 1.111 m/s; a velocidade estimada pelo filtro de Kalman (azul) chega a 242 m/s e fica estável na descida.',
              en: "Rigel IV's whole flight: the velocity derived from the barometer (orange) has noise spikes of up to 1,111 m/s; the Kalman filter's estimate (blue) peaks at 242 m/s and stays steady during the descent.",
            },
          },
        ],
      },
      {
        title: { pt: 'Atlas, foguete de 3 km (LASC 2026)', en: 'Atlas, 3 km rocket (LASC 2026)' },
        period: { pt: '03/2026 – 09/2026', en: '03/2026 – 09/2026' },
        body: {
          pt: 'O computador de voo do Atlas é uma pilha modular de PCBs próprias (comunicação, processamento e sensoriamento, alimentação e acionamento da recuperação) rodando tasks do FreeRTOS nos dois núcleos do ESP32. Ele funde os sensores com um filtro de Kalman próprio (altitude e velocidade) e um filtro de Madgwick (atitude), conduz uma máquina de estados de voo e guarda os dados críticos em EEPROM para se recuperar de um reboot em pleno voo. O apogeu calculado a bordo teve 99,89% de exatidão em relação a um altímetro comercial independente. Também escrevi a revisão pós-voo e fui coautor do Mission Report da LASC 2026.',
          en: 'The Atlas flight computer is a modular stack of custom PCBs (communication, processing and sensing, power, and recovery deployment) running FreeRTOS tasks on both ESP32 cores. It fuses sensor data with an in-house Kalman filter (altitude and velocity) and a Madgwick filter (attitude), drives a flight state machine, and keeps critical data in EEPROM to recover from a reboot mid-flight. The apogee computed on board reached 99.89% accuracy against an independent commercial altimeter. I also wrote the post-flight review and co-authored the LASC 2026 Mission Report.',
        },
        images: [
          {
            src: 'journey/topus/01-atlas-voo.webp',
            w: 720,
            h: 772,
            tag: { pt: 'Lançamento', en: 'Launch' },
            pos: 'center 40%',
            title: { pt: 'Decolagem do Atlas', en: 'Atlas lift-off' },
            caption: {
              pt: 'O Atlas decolando em 5 de setembro de 2026, na LASC, em Iacanga-SP.',
              en: 'Atlas lifting off on September 5, 2026, at LASC in Iacanga, Brazil.',
            },
          },
          {
            src: 'journey/topus/02-vitor-atlas.webp',
            w: 1200,
            h: 1600,
            tag: { pt: 'LASC 2026', en: 'LASC 2026' },
            pos: 'center 28%',
            title: { pt: 'Com o Atlas na LASC 2026', en: 'With Atlas at LASC 2026' },
            caption: {
              pt: 'Ao lado do Atlas, diante do painel de missões da competição.',
              en: "Next to Atlas, in front of the competition's mission wall.",
            },
          },
          {
            src: 'journey/topus/03-eletronica-atlas.webp',
            w: 1170,
            h: 1560,
            tag: { pt: 'Hardware', en: 'Hardware' },
            pos: 'center 45%',
            title: { pt: 'Computador de voo e estação de solo', en: 'Flight computer and ground station' },
            caption: {
              pt: 'A pilha de aviônica do Atlas (comunicação, processamento e sensoriamento, alimentação e recuperação) ao lado da estação de solo portátil LoRa.',
              en: 'The Atlas avionics stack (communication, processing and sensing, power and recovery boards) next to the portable LoRa ground station.',
            },
          },
          {
            src: 'journey/topus/05-visao-geral-voo.webp',
            w: 1600,
            h: 1348,
            tag: { pt: 'Dados de voo', en: 'Flight data' },
            fit: 'contain',
            title: { pt: 'Visão geral do voo', en: 'Flight overview' },
            caption: {
              pt: 'Altitude e velocidade vertical estimadas a bordo pelo filtro de Kalman, e a aceleração vertical, da ignição ao apogeu, com as fases detectadas pela máquina de estados ao fundo.',
              en: 'Altitude and vertical velocity estimated on board by the Kalman filter, plus vertical acceleration, from ignition to apogee, with the flight phases detected by the state machine in the background.',
            },
          },
          {
            src: 'journey/topus/06-apogeu-easymini.webp',
            w: 1600,
            h: 1012,
            tag: { pt: 'Dados de voo', en: 'Flight data' },
            fit: 'contain',
            title: { pt: 'Apogeu: TOPUS × altímetro comercial', en: 'Apogee: TOPUS vs. commercial altimeter' },
            caption: {
              pt: 'Altitude perto do apogeu medida pelo nosso computador de voo e por um altímetro comercial independente no mesmo foguete: 1.894,63 m contra 1.892,62 m, 99,89% de exatidão no apogeu.',
              en: 'Altitude around apogee from our flight computer and from an independent commercial altimeter in the same rocket: 1,894.63 m vs. 1,892.62 m, 99.89% apogee accuracy.',
            },
          },
          {
            src: 'journey/topus/07-atlas-estande.webp',
            w: 720,
            h: 1280,
            tag: { pt: 'LASC 2026', en: 'LASC 2026' },
            pos: 'center 45%',
            title: { pt: 'O Atlas no estande', en: 'Atlas at the booth' },
            caption: {
              pt: 'O Atlas de pé no estande da TOPUS, antes do lançamento.',
              en: 'Atlas standing at the TOPUS booth before launch.',
            },
          },
        ],
      },
      {
        title: { pt: 'Arquitetura de firmware do Atlas', en: 'Atlas firmware architecture' },
        period: { pt: '03/2026 – 09/2026', en: '03/2026 – 09/2026' },
        body: {
          pt: 'O firmware do Atlas divide o trabalho em tasks do FreeRTOS distribuídas nos dois núcleos do ESP32. No núcleo 1, três tasks leem os sensores e decidem o voo: a do altímetro BMP390 (filtro de Kalman), a da IMU LSM6DS3 (filtro de Madgwick) e a da máquina de estados, que aciona os atuadores pirotécnicos e grava os dados críticos na EEPROM. Todas atualizam um conjunto de objetos globais que representam o estado vivo do voo. No núcleo 0, tasks independentes leem o GPS e montam as saídas: um pacote binário compacto para o rádio LoRa e uma linha CSV para o cartão SD. Separar leitura, decisão e saída assim mantém cada task no seu prazo: ler a IMU a cada 1 ms é bem mais urgente do que atualizar o GPS a cada 100 ms.',
          en: "The Atlas firmware splits the work into FreeRTOS tasks spread across both ESP32 cores. On core 1, three tasks read the sensors and drive the flight: the BMP390 altimeter task (Kalman filter), the LSM6DS3 IMU task (Madgwick filter) and the state machine task, which fires the pyrotechnic actuators and saves critical data to EEPROM. All of them update a set of global objects that hold the live state of the flight. On core 0, independent tasks read the GPS and build the outputs: a compact binary packet for the LoRa radio and a CSV line for the SD card. Splitting reading, decision and output this way keeps every task within its deadline: reading the IMU every 1 ms is far more urgent than updating the GPS every 100 ms.",
        },
        images: [
          {
            src: 'journey/topus/19-arquitetura-firmware-atlas.webp',
            w: 1946,
            h: 800,
            tag: { pt: 'Firmware · FreeRTOS', en: 'Firmware · FreeRTOS' },
            fit: 'contain',
            title: { pt: 'Arquitetura de firmware do Atlas', en: 'Atlas firmware architecture' },
            caption: {
              pt: 'Fluxo de dados: sensores → tasks de leitura → objetos globais (estado do voo) → saídas. A task da IMU publica a aceleração vertical usada pelo filtro de Kalman; a máquina de estados lê o filtro, decide a fase do voo e grava em CurrentState. As regiões tracejadas agrupam as tasks pelo núcleo do ESP32 em que rodam.',
              en: 'Data flow: sensors → reading tasks → global objects (flight state) → outputs. The IMU task publishes the vertical acceleration used by the Kalman filter; the state machine reads the filter, decides the flight phase and writes back to CurrentState. Dashed regions group the tasks by the ESP32 core they run on.',
            },
          },
        ],
      },
      {
        title: { pt: 'Atena, CubeSat 2U (2º lugar na LASC 2026)', en: 'Atena, 2U CubeSat (2nd place at LASC 2026)' },
        anchor: 'atena',
        period: { pt: '03/2026 – 09/2026', en: '03/2026 – 09/2026' },
        body: {
          pt: 'O Atena voou a bordo do Atlas. Co-desenvolvi o firmware, que estima altitude, velocidade e orientação e reconhece cada fase do voo, e projetei a telemetria LoRa bidirecional (duplex): o satélite envia seus dados e, entre um pacote e outro, escuta a estação de solo. O Atena voou e se comunicou com sucesso com a nossa estação.',
          en: 'Atena flew aboard Atlas. I co-developed its firmware, which estimates altitude, speed and orientation and recognizes each flight phase, and designed its two-way (duplex) LoRa telemetry: the satellite sends its data and, between packets, listens for the ground station. Atena flew and communicated successfully with our station.',
        },
        images: [
          {
            src: 'journey/topus/08-premio-atena.webp',
            w: 720,
            h: 1280,
            tag: { pt: 'Premiação', en: 'Awards' },
            pos: 'center 30%',
            title: { pt: 'O troféu do Atena', en: "Atena's trophy" },
            caption: {
              pt: 'Com o troféu de 2º lugar na categoria CubeSat da LASC 2026.',
              en: 'With the 2nd place trophy in the CubeSat category at LASC 2026.',
            },
          },
          {
            src: 'journey/topus/09-atena-trofeu.webp',
            w: 800,
            h: 796,
            tag: { pt: 'Hardware', en: 'Hardware' },
            pos: 'center 55%',
            title: { pt: 'O Atena e o troféu', en: 'Atena and the trophy' },
            caption: {
              pt: 'O CubeSat 2U Atena aberto, com as placas visíveis, ao lado do troféu.',
              en: 'The Atena 2U CubeSat open, with its boards visible, next to the trophy.',
            },
          },
          {
            src: 'journey/topus/10-premiacao-atena.webp',
            w: 720,
            h: 1280,
            tag: { pt: 'Premiação', en: 'Awards' },
            pos: 'center 38%',
            title: { pt: 'O anúncio no palco', en: 'The announcement on stage' },
            caption: {
              pt: 'O telão da premiação: “TOPUS Projetos Aeroespaciais · #240 Atena · 2nd Place – CubeSat”.',
              en: 'The awards screen: “TOPUS Projetos Aeroespaciais · #240 Atena · 2nd Place – CubeSat”.',
            },
          },
          {
            src: 'journey/topus/11-atena-montagem.webp',
            w: 1200,
            h: 1600,
            tag: { pt: 'Bastidores', en: 'Behind the scenes' },
            pos: 'center 50%',
            title: { pt: 'O Atena em montagem', en: 'Atena under assembly' },
            caption: {
              pt: 'A estrutura 2U do Atena na bancada, durante a integração.',
              en: "Atena's 2U structure on the bench during integration.",
            },
          },
        ],
      },
      {
        title: { pt: 'Bibliotecas compartilhadas', en: 'Shared libraries' },
        timeline: false,
        body: {
          pt: 'Sou o autor das bibliotecas de LoRa, de persistência em EEPROM e de filtro de Kalman usadas em todos os projetos de aviônica da TOPUS.',
          en: 'I am the author of the LoRa, EEPROM persistence and Kalman filter libraries shared across TOPUS avionics projects.',
        },
      },
    ],
    stack: ['ESP32', 'C/C++', 'FreeRTOS', 'PlatformIO', 'CMake', 'LoRa', 'Kalman', 'Madgwick', 'KiCad', 'Python', 'FastAPI', 'React', 'TypeScript', 'HTML', 'CSS', 'Docker Compose'],
  },

  saecomp: {
    intro: {
      pt: 'Trabalhei no planejamento, no levantamento de requisitos e no desenvolvimento do back-end da loja da secretaria acadêmica, com o objetivo de permitir compras via PIX, verificar os pagamentos automaticamente e deixar a administração do sistema nas mãos dos outros membros da equipe.',
      en: 'I worked on the planning, requirements analysis and back-end development of the store run by the academic office, so that products could be bought via PIX, payments verified automatically and the system managed by other team members.',
    },
    stats: [
      { value: '75×', label: { pt: 'no lucro da secretaria', en: "growth in the office's profit" }, icon: 'growth' },
      { value: 'PIX', label: { pt: 'pagamentos confirmados em tempo real', en: 'payments confirmed in real time' }, icon: 'bolt', section: 'Automated payments' },
      { value: 'R$', label: { pt: 'processamento real de dinheiro', en: 'real money processing' }, icon: 'money', section: 'Automated payments' },
      { value: { pt: 'Estoque', en: 'Stock' }, label: { pt: 'gestão de estoque, preços e reposição', en: 'stock, price and restock management' }, icon: 'stock', section: 'Store management' },
    ],
    sections: [
      {
        title: { pt: 'Gestão da loja', en: 'Store management' },
        period: { pt: '08/2025 – 01/2026', en: '08/2025 – 01/2026' },
        body: {
          pt: 'Repor o estoque, ajustar preços e controlar as quantidades disponíveis ficou mais simples para a equipe. A API em Node.js/TypeScript foi estruturada em camadas (controllers → services → repositories), com validação via Zod, tratamento de erros centralizado e documentação no Swagger.',
          en: 'Restocking, price changes and managing available quantities became simpler for the team. The Node.js/TypeScript API is layered (controllers → services → repositories), with Zod validation, centralized error handling and Swagger documentation.',
        },
        images: [
          {
            src: 'journey/saecomp/01-catalogo-loja.webp',
            w: 1280,
            h: 522,
            tag: { pt: 'Front-end', en: 'Front-end' },
            fit: 'contain',
            title: { pt: 'Catálogo da loja SAEComp', en: 'SAEComp store catalog' },
            caption: {
              pt: 'A página inicial da loja, com produtos por categoria, preços e carrinho. O back-end que desenvolvi fornece os produtos, os preços e o estoque, além dos pagamentos PIX, da pontuação e da área de administração.',
              en: "The store's home page, with products by category, prices and cart. The back end I developed provides the products, prices and stock, as well as PIX payments, user points and the admin area.",
            },
          },
        ],
      },
      {
        title: { pt: 'Pagamentos automáticos', en: 'Automated payments' },
        period: { pt: '09/2025 – 02/2026', en: '09/2025 – 02/2026' },
        body: {
          pt: 'O sistema automatizou o pagamento dos produtos, por QR Code ou PIX copia e cola, com confirmação em tempo real via Mercado Pago e cancelamento automático do pedido quando a cobrança falha, eliminando a conferência manual que existia antes.',
          en: 'The system automated product payments, via QR code or PIX copy-and-paste, with real-time confirmation through Mercado Pago and automatic order cancellation when a charge fails, removing the manual reconciliation that existed before.',
        },
      },
      {
        title: { pt: 'Gamificação', en: 'Gamification' },
        period: { pt: '09/2025 – 02/2026', en: '09/2025 – 02/2026' },
        body: {
          pt: 'Os pagamentos confirmados pelo back-end viram pontos para o usuário, e a loja ganhou um sistema de pontuação e comentários dos produtos.',
          en: 'Payments confirmed by the back end turn into points for the user, and the store gained a points and product review system.',
        },
      },
      {
        title: { pt: 'Apresentação e entrega da lojinha', en: 'Store presentation and handover' },
        period: { pt: '03/2026', en: '03/2026' },
        body: {
          pt: 'Para encerrar o projeto, apresentamos a lojinha aos membros da SAEComp: por que ela era necessária, o processo de compra, o sistema de pontuação, o gerenciamento pela equipe e as próximas melhorias. Depois da apresentação, a loja foi entregue e a administração passou para os outros membros da equipe.',
          en: 'To wrap up the project, we presented the store to the SAEComp members: why it was needed, the purchase flow, the points system, management by the team and the next improvements. After the presentation, the store was handed over and its administration passed to the other team members.',
        },
        images: [
          {
            src: 'journey/saecomp/03-apresentacao-lojinha.webp',
            w: 1280,
            h: 960,
            tag: { pt: 'Apresentação', en: 'Presentation' },
            title: { pt: 'Apresentação da lojinha', en: 'Presenting the store' },
            caption: {
              pt: 'A apresentação da lojinha para os membros da SAEComp, com a agenda: por que a loja, processo de compra, sistema de pontuação, gerenciamento e melhorias.',
              en: "Presenting the store to the SAEComp members, with the agenda: why the store, purchase flow, points system, management and improvements.",
            },
            pos: 'center 45%',
          },
          {
            src: 'journey/saecomp/02-equipe-lojinha.webp',
            w: 1280,
            h: 989,
            tag: { pt: 'Equipe', en: 'Team' },
            title: { pt: 'Equipe da lojinha', en: 'The store team' },
            caption: {
              pt: 'A equipe que desenvolveu a lojinha, no dia da apresentação e entrega do projeto.',
              en: 'The team that built the store, on the day the project was presented and handed over.',
            },
            pos: 'center 40%',
          },
        ],
      },
    ],
    stack: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Zod', 'Swagger', 'Mercado Pago', 'Server-Sent Events'],
    link: {
      href: 'https://github.com/SAEComp/site-saecomp-back-lojinha',
      label: { pt: 'Ver o código no GitHub', en: 'View the code on GitHub' },
    },
  },

  zenith: {
    intro: {
      pt: 'Na Zenith Aerospace, grupo de sondas atmosféricas da EESC-USP, comecei como membro do departamento de software embarcado e depois passei a coordená-lo.',
      en: "At Zenith Aerospace, EESC-USP's atmospheric probe team, I started as a member of the embedded software department and later became its coordinator.",
    },
    stats: [
      { value: '3', label: { pt: 'famílias de microcontroladores na mesma biblioteca', en: 'microcontroller families in one library' }, icon: 'chip', section: 'The Platform library' },
      { value: '>10 km', label: { pt: 'altitude das sondas atmosféricas', en: 'atmospheric probe altitude' }, icon: 'balloon', section: 'Drivers for atmospheric probes' },
    ],
    sections: [
      {
        title: { pt: 'Drivers para sondas atmosféricas', en: 'Drivers for atmospheric probes' },
        period: { pt: '2024', en: '2024' },
        body: {
          pt: 'Como membro, enfrentamos o desafio de coletar os dados trocados entre uma sonda e a estação base, o que exigiu novos drivers de sensores e a programação do microcontrolador STM32. Nesse projeto, desenvolvi uma biblioteca em C para o sensor MPX5700, usado para medir a pressão externa nas altitudes das sondas atmosféricas (acima de 10 km), com o GitHub como base para versionamento e revisão de código.',
          en: 'As a member, we faced the challenge of collecting the data exchanged between a probe and a base station, which required new sensor drivers and programming the STM32 microcontroller. In that project, I developed a C library for the MPX5700 sensor, used to measure external pressure at atmospheric probe altitudes (above 10 km), with GitHub at the core of version control and code review.',
        },
      },
      {
        title: { pt: 'A biblioteca Platform', en: 'The Platform library' },
        period: { pt: '02/2025 – 03/2025', en: '02/2025 – 03/2025' },
        body: {
          pt: 'Como coordenador, concluí a biblioteca Platform, em C/C++, que permite usar os drivers de sensores e dispositivos do grupo em diferentes microcontroladores (STM32, ESP32 e Arduino Uno). Ela já abstraía GPIOs e os protocolos de comunicação (UART, I2C e SPI) e passou a incluir leitura analógica (ADC) e modulação por largura de pulso (PWM).',
          en: "As coordinator, I completed the Platform library in C/C++, which lets the group's sensor and device drivers run on different microcontrollers (STM32, ESP32 and Arduino Uno). It already abstracted GPIOs and communication protocols (UART, I2C and SPI), and now also covers analog reading (ADC) and pulse-width modulation (PWM).",
        },
      },
      {
        title: { pt: 'Capacitação de novos membros', en: 'Training new members' },
        period: { pt: '2025', en: '2025' },
        body: {
          pt: 'Planejei e dei aulas no programa de capacitação de novos membros, sobre programação de microcontroladores com PlatformIO, protocolos de comunicação e leitura e modulação de sinais analógicos.',
          en: 'I planned and taught classes in the training program for new members, on microcontroller programming with PlatformIO, communication protocols, and reading and modulating analog signals.',
        },
      },
    ],
    stack: ['STM32', 'ESP32', 'Arduino', 'C/C++', 'PlatformIO', 'STM32CubeIDE', 'UART', 'I2C', 'SPI', 'ADC', 'PWM', 'Git'],
  },
}
