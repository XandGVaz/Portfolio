import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import type { Lang, UI } from '../content.ts'
import { archParts, type ArchPart } from '../journey.ts'
import { ActivityIcon, AntennaIcon, BridgeIcon, ChipIcon, IoTIcon, MonitorIcon, ServerIcon } from './Icons.tsx'

type Pt = [number, number]

type BoxId = Exclude<ArchPart, 'overview' | 'nodes'> | `node${number}`
type LayerId = Exclude<BoxId, `node${number}`>

interface Box {
  id: BoxId
  part: ArchPart
  x: number
  y: number
  w: number
  h: number
  name: string
  sub?: string
  tone?: string
}

const PROTOCOLS = [
  { label: 'mioty', tone: 'var(--fc-boost)' },
  { label: 'LoRaWAN', tone: 'var(--fc-main)' },
  { label: 'NB-IoT', tone: 'var(--fc-drogue)' },
  { label: 'Sigfox', tone: 'var(--fc-apogee)' },
] as const

interface Geo {
  W: number
  H: number
  layers: { id: LayerId; x: number; y: number; w: number; h: number }[]
  protoX: number[]
  node: { y: number; w: number; h: number }
  devices: number[]
  dev: { cy: number; w: number; h: number; antenna: number; antennaDx: number; ledDx: number; led: number }
  netBottom: number
  netToBridge: Pt[]
  bridgeToApp: Pt[]
  appToUi: Pt[]
  scrape: Pt[]
  wires: { text: string; x: number; y: number }[]
  icon: number
  packet: number
}

const WIDE: Geo = {
  W: 1000,
  H: 592,
  layers: [
    { id: 'app', x: 40, y: 24, w: 600, h: 100 },
    { id: 'ui', x: 720, y: 24, w: 240, h: 100 },
    { id: 'bridge', x: 40, y: 184, w: 600, h: 100 },
    { id: 'monitoring', x: 720, y: 184, w: 240, h: 100 },
    { id: 'network', x: 40, y: 344, w: 920, h: 100 },
  ],
  protoX: [160, 387, 613, 840],
  node: { y: 486, w: 200, h: 86 },
  devices: [-56, 0, 56],
  dev: { cy: 520, w: 30, h: 20, antenna: 9, antennaDx: 8, ledDx: -7, led: 2.6 },
  netBottom: 444,
  netToBridge: [
    [340, 344],
    [340, 284],
  ],
  bridgeToApp: [
    [340, 184],
    [340, 124],
  ],
  appToUi: [
    [640, 74],
    [720, 74],
  ],
  scrape: [
    [600, 124],
    [600, 154],
    [840, 154],
    [840, 184],
  ],
  wires: [
    { text: 'MQTT', x: 340, y: 314 },
    { text: 'TCP', x: 340, y: 154 },
    { text: 'HTTP', x: 680, y: 74 },
  ],
  icon: 30,
  packet: 5,
}

const NARROW: Geo = {
  W: 400,
  H: 600,
  layers: [
    { id: 'ui', x: 16, y: 16, w: 180, h: 80 },
    { id: 'monitoring', x: 204, y: 16, w: 180, h: 80 },
    { id: 'app', x: 16, y: 136, w: 368, h: 80 },
    { id: 'bridge', x: 16, y: 256, w: 368, h: 80 },
    { id: 'network', x: 16, y: 376, w: 368, h: 80 },
  ],
  protoX: [59, 153, 247, 341],
  node: { y: 496, w: 86, h: 92 },
  devices: [-26, 0, 26],
  dev: { cy: 528, w: 19, h: 13, antenna: 7, antennaDx: 5, ledDx: -4.5, led: 1.9 },
  netBottom: 456,
  netToBridge: [
    [200, 376],
    [200, 336],
  ],
  bridgeToApp: [
    [200, 256],
    [200, 216],
  ],
  appToUi: [
    [106, 136],
    [106, 96],
  ],
  scrape: [
    [294, 136],
    [294, 96],
  ],
  wires: [
    { text: 'MQTT', x: 200, y: 356 },
    { text: 'TCP', x: 200, y: 236 },
    { text: 'HTTP', x: 106, y: 116 },
  ],
  icon: 24,
  packet: 4.5,
}

interface Step {
  pts: Pt[]
  dur: number
  at: BoxId
}
const DWELL = 0.4
const LOOP = 6.5
const SCRAPE_EVERY = 3.2
const SCRAPE_DUR = 0.7

function derive(g: Geo) {
  const antennaTop = g.dev.cy - g.dev.h / 2 - g.dev.antenna
  const radioUp = (x: number): Pt[] => [
    [x + g.dev.antennaDx, antennaTop],
    [x + g.dev.antennaDx, g.netBottom],
  ]
  const senders = PROTOCOLS.flatMap((p, i) =>
    g.devices.map((dx, j) => ({ i, j, x: g.protoX[i] + dx, tone: p.tone, slot: j * PROTOCOLS.length + i })),
  )
  const routes: Step[][] = senders.map(({ x }) => [
    { pts: radioUp(x), dur: 0.6, at: 'network' },
    { pts: g.netToBridge, dur: 0.5, at: 'bridge' },
    { pts: g.bridgeToApp, dur: 0.5, at: 'app' },
    { pts: g.appToUi, dur: 0.5, at: 'ui' },
  ])
  return {
    antennaTop,
    radio: senders.map(({ x }) => radioUp(x)),
    links: [g.netToBridge, g.bridgeToApp, g.appToUi],
    senders,
    routes,
    offsetOf: (slot: number) => (slot * LOOP) / senders.length,
  }
}
const LAYOUTS = { wide: { g: WIDE, d: derive(WIDE) }, narrow: { g: NARROW, d: derive(NARROW) } }
const NARROW_BELOW = 560

function along(pts: Pt[], f: number): Pt {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]))
  let d = f * seg.reduce((a, b) => a + b, 0)
  for (let i = 0; i < seg.length; i++) {
    if (d <= seg[i] || i === seg.length - 1) {
      const k = seg[i] ? Math.min(1, d / seg[i]) : 0
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]
    }
    d -= seg[i]
  }
  return pts[pts.length - 1]
}

function packetAt(route: Step[], tau: number): { pos?: Pt; inBox?: BoxId } {
  if (tau < 0) return {}
  let t0 = 0
  for (const step of route) {
    if (tau < t0 + step.dur) return { pos: along(step.pts, (tau - t0) / step.dur) }
    t0 += step.dur
    if (tau < t0 + DWELL) return { inBox: step.at }
    t0 += DWELL
  }
  return {}
}

const line = (pts: Pt[]) => pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('')

const ICONS: Record<ArchPart, typeof ChipIcon> = {
  overview: IoTIcon,
  nodes: ChipIcon,
  network: AntennaIcon,
  bridge: BridgeIcon,
  app: ServerIcon,
  ui: MonitorIcon,
  monitoring: ActivityIcon,
}
const PARTS = Object.keys(archParts) as ArchPart[]

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useLoopClock(root: RefObject<HTMLElement | null>) {
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(() => !reducedMotion())
  const [visible, setVisible] = useState(false)
  const now = useRef(0)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [root])

  useEffect(() => {
    if (!playing || !visible) return
    let last = performance.now()
    let frame = requestAnimationFrame(function step(ts) {
      now.current += Math.min(0.1, (ts - last) / 1000)
      last = ts
      setTime(now.current)
      frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [playing, visible])

  return { time, playing, toggle: () => setPlaying((p) => !p) }
}

const PlayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z" />
  </svg>
)
const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <rect x="5" y="4" width="5" height="16" rx="1.2" />
    <rect x="14" y="4" width="5" height="16" rx="1.2" />
  </svg>
)

interface Props {
  t: UI
  lang: Lang
  part: ArchPart
  onPart: (p: ArchPart) => void
}

export default function ArchFlow({ t, lang, part, onPart }: Props) {
  const card = useRef<HTMLElement>(null)
  const diagram = useRef<HTMLDivElement>(null)
  const clock = useLoopClock(card)
  const started = clock.playing || clock.time > 0

  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < 600)
  useEffect(() => {
    const el = diagram.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < NARROW_BELOW))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const { g, d } = LAYOUTS[narrow ? 'narrow' : 'wide']

  const boxes: Box[] = [
    ...g.layers.map((l): Box => ({ ...l, part: l.id, name: archParts[l.id].title[lang] })),
    ...PROTOCOLS.map(
      (p, i): Box => ({
        id: `node${i}`,
        part: 'nodes',
        x: g.protoX[i] - g.node.w / 2,
        y: g.node.y,
        w: g.node.w,
        h: g.node.h,
        name: narrow ? p.label : t.archDevices.replace('{p}', p.label),
        sub: narrow ? t.archDevicesShort : undefined,
        tone: p.tone,
      }),
    ),
  ]

  const loopT = clock.time % LOOP
  const packets: { key: string; pos: Pt; tone: string; small?: boolean }[] = []
  const busy = new Map<BoxId, string>()
  const sending = new Set<string>()
  if (started) {
    d.routes.forEach((route, k) => {
      const { i, j, tone, slot } = d.senders[k]
      const tau = (((loopT - d.offsetOf(slot)) % LOOP) + LOOP) % LOOP
      const s = packetAt(route, tau)
      if (s.pos) packets.push({ key: `p${k}`, pos: s.pos, tone })
      if (s.inBox) busy.set(s.inBox, tone)
      if (tau > LOOP - 0.3 || tau < 0.1) sending.add(`${i}-${j}`)
    })
    const sc = clock.time % SCRAPE_EVERY
    if (sc < SCRAPE_DUR) packets.push({ key: 'scrape', pos: along(g.scrape, sc / SCRAPE_DUR), tone: 'var(--text-muted)', small: true })
    else if (sc < SCRAPE_DUR + 0.4) busy.set('monitoring', 'var(--brand)')
  }

  const focus = part !== 'overview'
  const info = archParts[part]

  return (
    <section ref={card} className="card flight-card arch-card" aria-labelledby="arch-title">
      <div className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="mono window-path">{t.archFile}</span>
        <div className="flight-controls">
          <button
            type="button"
            className="fc-play"
            onClick={clock.toggle}
            aria-label={clock.playing ? t.archPause : t.archPlay}
            title={clock.playing ? t.archPause : t.archPlay}
          >
            {clock.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
        </div>
      </div>

      <div className="flight-body">
        <h2 id="arch-title" className="flight-title">{t.archTitle}</h2>
        <p className="muted flight-lead">{t.archLead}</p>

        <ul className="arch-parts" role="group" aria-label={t.archPartsLabel}>
          {PARTS.map((p) => {
            const Icon = ICONS[p]
            const on = part === p
            return (
              <li key={p}>
                <button
                  type="button"
                  className={`arch-chip ${on ? 'is-on' : ''}`}
                  aria-pressed={on}
                  aria-controls="arch-info"
                  onClick={() => onPart(on && p !== 'overview' ? 'overview' : p)}
                >
                  <Icon size={15} /> {archParts[p].title[lang]}
                </button>
              </li>
            )
          })}
        </ul>

        <div className="arch-diagram" ref={diagram}>
          <svg
            viewBox={`0 0 ${g.W} ${g.H}`}
            role="img"
            aria-label={t.archAlt}
            className={`${focus ? 'is-focus' : ''} ${narrow ? 'is-narrow' : ''}`}
          >
            <g className="arch-links">
              {d.links.map((pts, i) => (
                <path key={i} d={line(pts)} />
              ))}
              {d.radio.map((pts, i) => (
                <path key={`r${i}`} className="is-radio" d={line(pts)} />
              ))}
              <path className="is-scrape" d={line(g.scrape)} />
            </g>

            {g.wires.map((l) => (
              <g key={l.text} className="arch-wire">
                <rect x={l.x - 26} y={l.y - 12} width={52} height={22} rx={6} />
                <text x={l.x} y={l.y + 4} textAnchor="middle">
                  {l.text}
                </text>
              </g>
            ))}

            {boxes.map((b) => {
              const tone = busy.get(b.id)
              const node = b.part === 'nodes'
              const cls = ['arch-box', node ? 'is-node' : 'is-layer']
              if (tone) cls.push('is-busy')
              if (focus) cls.push(b.part === part ? 'is-on' : 'is-dim')
              const cx = b.x + b.w / 2
              const cy = b.y + b.h / 2
              const Icon = ICONS[b.part]
              if (node) {
                const i = Number(b.id.slice(4))
                return (
                  <g
                    key={b.id}
                    className={cls.join(' ')}
                    style={{ '--tone': b.tone } as CSSProperties}
                    onClick={() => onPart(part === b.part ? 'overview' : b.part)}
                  >
                    <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={12} />
                    {g.devices.map((dx, j) => {
                      const x = cx + dx
                      const ax = x + g.dev.antennaDx
                      return (
                        <g key={j} className={`arch-dev ${sending.has(`${i}-${j}`) ? 'is-sending' : ''}`}>
                          <path className="arch-dev-antenna" d={`M${ax} ${g.dev.cy - g.dev.h / 2}V${d.antennaTop}`} />
                          <circle className="arch-dev-tip" cx={ax} cy={d.antennaTop} r={narrow ? 1.6 : 2} />
                          <rect
                            className="arch-dev-body"
                            x={x - g.dev.w / 2}
                            y={g.dev.cy - g.dev.h / 2}
                            width={g.dev.w}
                            height={g.dev.h}
                            rx={narrow ? 3 : 4}
                          />
                          <circle className="arch-dev-led" cx={x + g.dev.ledDx} cy={g.dev.cy} r={g.dev.led} />
                        </g>
                      )
                    })}
                    <text className="arch-name" x={cx} y={b.sub ? b.y + b.h - 26 : b.y + b.h - 16} textAnchor="middle">
                      {b.name}
                    </text>
                    {b.sub && (
                      <text className="arch-sub" x={cx} y={b.y + b.h - 11} textAnchor="middle">
                        {b.sub}
                      </text>
                    )}
                  </g>
                )
              }
              return (
                <g
                  key={b.id}
                  className={cls.join(' ')}
                  style={{ '--pulse': tone ?? 'var(--brand)', '--tone': b.tone ?? 'var(--text)' } as CSSProperties}
                  onClick={() => onPart(part === b.part ? 'overview' : b.part)}
                >
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={14} />
                  <g className="arch-icon" transform={`translate(${cx - g.icon / 2} ${cy - g.icon - 4})`}>
                    <Icon size={g.icon} />
                  </g>
                  <text className="arch-name" x={cx} y={cy + (narrow ? 18 : 22)} textAnchor="middle">
                    {b.name}
                  </text>
                </g>
              )
            })}

            {packets.map((p) => (
              <circle
                key={p.key}
                className="arch-packet"
                style={{ '--pulse': p.tone } as CSSProperties}
                cx={p.pos[0]}
                cy={p.pos[1]}
                r={p.small ? 4 : g.packet}
              />
            ))}
          </svg>
        </div>

        <div id="arch-info" className="flight-stage arch-info" aria-live="polite">
          <p className="flight-stage-head">
            <strong>{info.title[lang]}</strong>
            {info.tech && <span className="mono muted">{info.tech}</span>}
          </p>
          <p>{info.body[lang]}</p>
        </div>
      </div>
    </section>
  )
}
