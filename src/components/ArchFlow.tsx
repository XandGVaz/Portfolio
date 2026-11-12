import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import type { Lang, UI } from '../content.ts'
import { archParts, type ArchPart } from '../journey.ts'
import { ActivityIcon, AntennaIcon, BridgeIcon, ChipIcon, IoTIcon, MonitorIcon, ServerIcon } from './Icons.tsx'

type Pt = [number, number]
const W = 1000
const H = 592

type BoxId = Exclude<ArchPart, 'overview' | 'nodes'> | `node${number}`

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
  { label: 'mioty', x: 160, tone: 'var(--fc-boost)' },
  { label: 'LoRaWAN', x: 387, tone: 'var(--fc-main)' },
  { label: 'NB-IoT', x: 613, tone: 'var(--fc-drogue)' },
  { label: 'Sigfox', x: 840, tone: 'var(--fc-apogee)' },
] as const

const LAYERS: { id: Exclude<BoxId, `node${number}`>; x: number; y: number; w: number; h: number }[] = [
  { id: 'app', x: 40, y: 24, w: 600, h: 100 },
  { id: 'ui', x: 720, y: 24, w: 240, h: 100 },
  { id: 'bridge', x: 40, y: 184, w: 600, h: 100 },
  { id: 'monitoring', x: 720, y: 184, w: 240, h: 100 },
  { id: 'network', x: 40, y: 344, w: 920, h: 100 },
]
const NODE = { y: 486, w: 200, h: 86 }
const DEVICES = [-56, 0, 56]
const DEV = { cy: NODE.y + 34, w: 30, h: 20, antenna: 9 }
const antennaX = (x: number) => x + 8
const ANTENNA_TOP = DEV.cy - DEV.h / 2 - DEV.antenna

const RADIO_UP = (x: number): Pt[] => [
  [antennaX(x), ANTENNA_TOP],
  [antennaX(x), 444],
]
const RADIO: Pt[][] = PROTOCOLS.flatMap(({ x }) => DEVICES.map((dx) => RADIO_UP(x + dx)))
const NET_TO_BRIDGE: Pt[] = [
  [340, 344],
  [340, 284],
]
const BRIDGE_TO_APP: Pt[] = [
  [340, 184],
  [340, 124],
]
const APP_TO_UI: Pt[] = [
  [640, 74],
  [720, 74],
]
const LINKS: Pt[][] = [NET_TO_BRIDGE, BRIDGE_TO_APP, APP_TO_UI]
const SCRAPE: Pt[] = [
  [600, 124],
  [600, 154],
  [840, 154],
  [840, 184],
]
const WIRE_LABELS: { text: string; x: number; y: number }[] = [
  { text: 'MQTT', x: 340, y: 314 },
  { text: 'TCP', x: 340, y: 154 },
  { text: 'HTTP', x: 680, y: 74 },
]

interface Step {
  pts: Pt[]
  dur: number
  at: BoxId
}
const DWELL = 0.4
const SENDERS = PROTOCOLS.flatMap((p, i) =>
  DEVICES.map((dx, j) => ({ i, j, x: p.x + dx, tone: p.tone, slot: j * PROTOCOLS.length + i })),
)
const ROUTES: Step[][] = SENDERS.map(({ x }) => [
  { pts: RADIO_UP(x), dur: 0.6, at: 'network' },
  { pts: NET_TO_BRIDGE, dur: 0.5, at: 'bridge' },
  { pts: BRIDGE_TO_APP, dur: 0.5, at: 'app' },
  { pts: APP_TO_UI, dur: 0.5, at: 'ui' },
])
const LOOP = 6.5
const offsetOf = (slot: number) => (slot * LOOP) / SENDERS.length
const SCRAPE_EVERY = 3.2
const SCRAPE_DUR = 0.7

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

  const boxes: Box[] = [
    ...LAYERS.map((l): Box => ({ ...l, part: l.id, name: archParts[l.id].title[lang] })),
    ...PROTOCOLS.map(
      (p, i): Box => ({
        id: `node${i}`,
        part: 'nodes',
        x: p.x - NODE.w / 2,
        y: NODE.y,
        w: NODE.w,
        h: NODE.h,
        name: t.archDevices.replace('{p}', p.label),
        tone: p.tone,
      }),
    ),
  ]

  const loopT = clock.time % LOOP
  const packets: { key: string; pos: Pt; tone: string; small?: boolean }[] = []
  const busy = new Map<BoxId, string>()
  const sending = new Set<string>()
  if (started) {
    ROUTES.forEach((route, k) => {
      const { i, j, tone, slot } = SENDERS[k]
      const tau = (((loopT - offsetOf(slot)) % LOOP) + LOOP) % LOOP
      const s = packetAt(route, tau)
      if (s.pos) packets.push({ key: `p${k}`, pos: s.pos, tone })
      if (s.inBox) busy.set(s.inBox, tone)
      if (tau > LOOP - 0.3 || tau < 0.1) sending.add(`${i}-${j}`)
    })
    const sc = clock.time % SCRAPE_EVERY
    if (sc < SCRAPE_DUR) packets.push({ key: 'scrape', pos: along(SCRAPE, sc / SCRAPE_DUR), tone: 'var(--text-muted)', small: true })
    else if (sc < SCRAPE_DUR + 0.4) busy.set('monitoring', 'var(--brand)')
  }

  const focus = part !== 'overview'
  const info = archParts[part]

  useEffect(() => {
    const el = diagram.current
    if (!el || part === 'overview' || el.scrollWidth <= el.clientWidth) return
    const own = boxes.filter((b) => b.part === part)
    const cx = (Math.min(...own.map((b) => b.x)) + Math.max(...own.map((b) => b.x + b.w))) / 2
    const behavior: ScrollBehavior = reducedMotion() ? 'auto' : 'smooth'
    el.scrollTo({ left: (cx / W) * el.scrollWidth - el.clientWidth / 2, behavior })
  }, [part])

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
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={t.archAlt} className={focus ? 'is-focus' : ''}>
            <g className="arch-links">
              {LINKS.map((pts, i) => (
                <path key={i} d={line(pts)} />
              ))}
              {RADIO.map((pts, i) => (
                <path key={`r${i}`} className="is-radio" d={line(pts)} />
              ))}
              <path className="is-scrape" d={line(SCRAPE)} />
            </g>

            {WIRE_LABELS.map((l) => (
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
                    {DEVICES.map((dx, j) => {
                      const x = cx + dx
                      return (
                        <g key={j} className={`arch-dev ${sending.has(`${i}-${j}`) ? 'is-sending' : ''}`}>
                          <path className="arch-dev-antenna" d={`M${antennaX(x)} ${DEV.cy - DEV.h / 2}V${ANTENNA_TOP}`} />
                          <circle className="arch-dev-tip" cx={antennaX(x)} cy={ANTENNA_TOP} r={2} />
                          <rect
                            className="arch-dev-body"
                            x={x - DEV.w / 2}
                            y={DEV.cy - DEV.h / 2}
                            width={DEV.w}
                            height={DEV.h}
                            rx={4}
                          />
                          <circle className="arch-dev-led" cx={x - 7} cy={DEV.cy} r={2.6} />
                        </g>
                      )
                    })}
                    <text className="arch-name" x={cx} y={b.y + b.h - 16} textAnchor="middle">
                      {b.name}
                    </text>
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
                  <g className="arch-icon" transform={`translate(${cx - 15} ${cy - 34})`}>
                    <Icon size={30} />
                  </g>
                  <text className="arch-name" x={cx} y={cy + 22} textAnchor="middle">
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
                r={p.small ? 4 : 5}
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
