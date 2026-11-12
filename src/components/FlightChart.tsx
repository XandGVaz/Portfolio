import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import type { Lang, UI } from '../content.ts'
import { flightStages, type FlightStage } from '../journey.ts'
import { easyMini, events, topus } from '../flightData.ts'

type View = { x0: number; x1: number; y0: number; y1: number }
type Stage = Exclude<FlightStage, 'flight'>
const EVENTS = ['liftoff', 'burnout', 'apogee', 'apogeeRef', 'drogue', 'main', 'landing'] as const
type EventKey = (typeof EVENTS)[number]

const STAGES: FlightStage[] = ['flight', 'boost', 'coast', 'apogee', 'drogue', 'main']

const VIEWS: Record<FlightStage, View> = {
  flight: { x0: -19, x1: 152, y0: 0, y1: 2100 },
  boost: { x0: -0.6, x1: 4.2, y0: 0, y1: 1150 },
  coast: { x0: 1.5, x1: 22, y0: 600, y1: 2020 },
  apogee: { x0: 17.4, x1: 21.65, y0: 1864, y1: 1901 },
  drogue: { x0: 16, x1: 118, y0: 150, y1: 2020 },
  main: { x0: 106, x1: 152, y0: 0, y1: 620 },
}

const BANDS: Record<Stage, [number, number]> = {
  boost: [0, events.burnout.t],
  coast: [events.burnout.t, events.apogee.t],
  apogee: [events.apogee.t, events.drogue.t],
  drogue: [events.drogue.t, events.main.t],
  main: [events.main.t, events.landing.t],
}

const BAND_KEYS = Object.keys(BANDS) as Stage[]

const tone = (s: Stage) => ({ '--stage': `var(--fc-${s})` }) as CSSProperties
const stageAt = (s: number): Stage => BAND_KEYS.find((k) => s < BANDS[k][1]) ?? 'main'
const EVENT_STAGE: Record<Exclude<EventKey, 'apogeeRef'>, Stage> = {
  liftoff: 'boost',
  burnout: 'coast',
  apogee: 'apogee',
  drogue: 'drogue',
  main: 'main',
  landing: 'main',
}

const LABELED: Record<FlightStage, EventKey[]> = {
  flight: ['apogee', 'main'],
  boost: ['liftoff', 'burnout'],
  coast: ['burnout', 'apogee'],
  apogee: ['apogee', 'apogeeRef'],
  drogue: ['drogue', 'main'],
  main: ['main', 'landing'],
}

const SHAPE: Record<EventKey, 'up' | 'peak' | 'peakBelow' | 'down'> = {
  liftoff: 'up',
  burnout: 'up',
  apogee: 'peak',
  apogeeRef: 'peakBelow',
  drogue: 'down',
  main: 'down',
  landing: 'down',
}
const REF_EVENTS: EventKey[] = ['apogeeRef']

const REF_FROM = VIEWS.apogee.x0
const refPart = easyMini.filter(([s]) => s >= REF_FROM && s <= events.drogue.t)
const G = 9.81

function noise(seed: number) {
  let a = seed
  const uniform = () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
  return () => Math.sqrt(-2 * Math.log(1 - uniform())) * Math.cos(2 * Math.PI * uniform())
}

interface Texture {
  step: number
  sigma: [number, number]
  round?: number
  seed: number
}

function ballistic(from: [number, number], to: [number, number], tex: Texture): [number, number][] {
  const [t0, h0] = from
  const T = to[0] - t0
  const v0 = (to[1] - h0 + (G * T * T) / 2) / T
  const n = Math.max(2, Math.round(T / tex.step))
  const gauss = noise(tex.seed)
  const pts: [number, number][] = []
  for (let i = 1; i < n; i++) {
    const tau = (T * i) / n
    const sigma = tex.sigma[0] + ((tex.sigma[1] - tex.sigma[0]) * i) / n
    let h = h0 + v0 * tau - (G * tau * tau) / 2 + gauss() * sigma * Math.sin((Math.PI * i) / n)
    if (tex.round) h = Math.round(h / tex.round) * tex.round
    pts.push([t0 + tau, h])
  }
  return pts
}

const gapEnd = topus.findIndex(([s]) => s >= events.apogee.t - 1e-6)
const topusLine: [number, number][] = [
  ...topus.slice(0, gapEnd),
  ...ballistic(topus[gapEnd - 1], topus[gapEnd], { step: 0.02, sigma: [0.06, 0.06], round: 0.1, seed: 1894 }),
  ...topus.slice(gapEnd),
]

const descentData = easyMini.filter(([s]) => s >= events.drogue.t)
const descent: [number, number][] = [
  topus[topus.length - 1],
  ...ballistic(topus[topus.length - 1], descentData[0], { step: 0.05, sigma: [0.06, 0.39], seed: 1875 }),
  ...descentData,
]

const T0 = topus[0][0]
const T1 = descent[descent.length - 1][0]
const BLEND_PX = 24

const PAD_S = 15
const START = T0 - PAD_S
const PAD: [number, number][] = [
  [START, topus[0][1]],
  [T0, topus[0][1]],
]

const dur = (i: number) => {
  const [a, b] = BANDS[BAND_KEYS[i]]
  return (i === BAND_KEYS.length - 1 ? T1 : b) - (i === 0 ? T0 : a)
}

function toneStops(secPerPx: number): [number, Stage][] {
  const off = (s: number) => (s - T0) / (T1 - T0)
  const stops: [number, Stage][] = [[0, BAND_KEYS[0]]]
  for (let i = 0; i < BAND_KEYS.length - 1; i++) {
    const b = BANDS[BAND_KEYS[i]][1]
    const h = Math.min(BLEND_PX * secPerPx, 0.45 * dur(i), 0.45 * dur(i + 1))
    stops.push([off(b - h), BAND_KEYS[i]], [off(b + h), BAND_KEYS[i + 1]])
  }
  stops.push([1, BAND_KEYS[BAND_KEYS.length - 1]])
  return stops
}

const FLIGHT: [number, number][] = [...topusLine, ...descent.slice(1)]
const TIME_SCALE = 20
const SPEEDS = [1, 1.5, 2, 2.5] as const
type Speed = (typeof SPEEDS)[number]

function after(pts: [number, number][], t: number) {
  let lo = 0
  let hi = pts.length
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (pts[mid][0] > t) hi = mid
    else lo = mid + 1
  }
  return lo
}

function altAt(pts: [number, number][], t: number) {
  const i = after(pts, t)
  if (i === 0) return pts[0][1]
  if (i === pts.length) return pts[pts.length - 1][1]
  const [s0, h0] = pts[i - 1]
  const [s1, h1] = pts[i]
  return h0 + ((h1 - h0) * (t - s0)) / (s1 - s0)
}

function upTo(pts: [number, number][], t: number): [number, number][] {
  if (!pts.length || t < pts[0][0]) return []
  const i = after(pts, t)
  if (i === pts.length) return pts
  return [...pts.slice(0, i), [t, altAt(pts, t)]]
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

function useFlightClock(root: RefObject<HTMLElement | null>) {
  const [time, setTimeState] = useState(() => (reducedMotion() ? T1 : START))
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState<Speed>(1)
  const now = useRef(time)

  const seek = (v: number) => {
    now.current = Math.min(T1, Math.max(START, v))
    setTimeState(now.current)
  }

  useEffect(() => {
    if (!playing) return
    let last = performance.now()
    let frame = requestAnimationFrame(function step(ts) {
      const dt = Math.min(0.1, (ts - last) / 1000)
      last = ts
      now.current = Math.min(T1, now.current + dt * speed * TIME_SCALE)
      setTimeState(now.current)
      if (now.current >= T1) setPlaying(false)
      else frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [playing, speed])

  useEffect(() => {
    const el = root.current
    if (!el || reducedMotion()) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        setPlaying(true)
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [root])

  const toggle = () => {
    if (playing) return setPlaying(false)
    if (now.current >= T1) seek(START)
    setPlaying(true)
  }

  return { time, playing, speed, setSpeed, seek, toggle, pause: () => setPlaying(false) }
}

function Rocket(p: {
  x: number
  y: number
  angle: number
  flame: boolean
  chute: 'drogue' | 'main' | null
}) {
  const w = p.chute === 'main' ? 13 : 7
  const h = p.chute === 'main' ? 9 : 6
  const base = -31
  return (
    <g className="fc-rocket" transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
      {p.chute && (
        <g className="fc-chute" key={p.chute}>
          <path className="fc-chute-lines" d={`M${-w} ${base}L0 -23M${w} ${base}L0 -23`} />
          <path className="fc-chute-canopy" d={`M${-w} ${base}A${w} ${h} 0 0 1 ${w} ${base}Z`} />
        </g>
      )}
      <g className="fc-rocket-body" style={{ transform: `rotate(${p.angle.toFixed(1)}deg)` }}>
        {p.flame && (
          <g className="fc-flame">
            <path className="fc-flame-outer" d="M0 -3Q-26 0 0 3Z" />
            <path className="fc-flame-inner" d="M0 -1.6Q-14 0 0 1.6Z" />
          </g>
        )}
        <path className="fc-rocket-fin" d="M1 -3.4L-3 -7.8L7 -3.4ZM1 3.4L-3 7.8L7 3.4Z" />
        <path className="fc-rocket-hull" d="M0 -3.6H15Q20 -3.6 23.5 0Q20 3.6 15 3.6H0Z" />
        <circle className="fc-rocket-window" cx={13} cy={0} r={1.7} />
      </g>
    </g>
  )
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
const ReplayIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
)

const M = { top: 26, right: 14, bottom: 34, left: 66 }

function ticks(a: number, b: number, count: number) {
  const raw = (b - a) / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 5, 10].map((k) => k * mag).find((s) => s >= raw) ?? raw
  const out: number[] = []
  for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(6))
  return out
}

function useAnimatedView(target: View) {
  const [view, setView] = useState(target)
  const current = useRef(target)
  useEffect(() => {
    const from = current.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = target
      setView(target)
      return
    }
    const start = performance.now()
    const duration = 650
    let frame = requestAnimationFrame(function step(now) {
      const p = Math.min(1, (now - start) / duration)
      const e = p < 0.5 ? 4 * p * p * p : 1 - (-2 * p + 2) ** 3 / 2
      const v = {
        x0: from.x0 + (target.x0 - from.x0) * e,
        x1: from.x1 + (target.x1 - from.x1) * e,
        y0: from.y0 + (target.y0 - from.y0) * e,
        y1: from.y1 + (target.y1 - from.y1) * e,
      }
      current.current = v
      setView(v)
      if (p < 1) frame = requestAnimationFrame(step)
    })
    return () => cancelAnimationFrame(frame)
  }, [target])
  return view
}

function EventLabel(p: { text: string; x: number; y: number; shape: (typeof SHAPE)[EventKey]; left: number; right: number }) {
  const w = p.text.length * 7.9
  const gap = 10
  let anchor: 'start' | 'middle' | 'end'
  let x = p.x
  let y = p.y - gap
  if (p.shape === 'peak' || p.shape === 'peakBelow') {
    anchor = 'middle'
    if (p.shape === 'peakBelow') y = p.y + gap + 8
    x = Math.min(Math.max(x, p.left + w / 2), p.right - w / 2)
  } else if (p.shape === 'up') {
    if (p.x - gap - w >= p.left) {
      anchor = 'end'
      x = p.x - gap
    } else {
      anchor = 'start'
      x = p.x + gap
      y = p.y + gap + 8
    }
  } else {
    if (p.x + gap + w <= p.right) {
      anchor = 'start'
      x = p.x + gap
    } else {
      anchor = 'end'
      x = p.x - gap
      y = p.y + gap + 8
    }
  }
  return (
    <text x={x} y={y} textAnchor={anchor}>
      {p.text}
    </text>
  )
}

interface Props {
  t: UI
  lang: Lang
  stage: FlightStage
  onStage: (s: FlightStage) => void
  onSeeAtlas: () => void
}

export default function FlightChart({ t, lang, stage, onStage, onSeeAtlas }: Props) {
  const card = useRef<HTMLElement>(null)
  const box = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const clock = useFlightClock(card)
  const { time } = clock
  const done = time >= T1

  const view = useAnimatedView(VIEWS[stage])
  const fmt = (v: number, digits = 0) =>
    v.toLocaleString(t.flightLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const height = Math.round(Math.min(360, Math.max(240, width * 0.42)))
  const iw = Math.max(0, width - M.left - M.right)
  const ih = height - M.top - M.bottom
  const X = (s: number) => M.left + ((s - view.x0) / (view.x1 - view.x0)) * iw
  const Y = (h: number) => M.top + (1 - (h - view.y0) / (view.y1 - view.y0)) * ih

  const span = view.x1 - view.x0
  const inView = (pts: [number, number][]) => {
    const a = Math.max(0, after(pts, view.x0 - span * 0.05) - 1)
    const b = after(pts, view.x1 + span * 0.05) + 1
    return pts.slice(a, b)
  }
  const line = (pts: [number, number][]) =>
    pts.map(([s, h], i) => `${i ? 'L' : 'M'}${X(s).toFixed(1)} ${Y(h).toFixed(1)}`).join('')

  const flown = inView(upTo(FLIGHT, time))
  const flownD = line(flown)
  const base = (M.top + ih).toFixed(1)
  const areaD =
    flown.length > 1
      ? `${flownD}L${X(flown[flown.length - 1][0]).toFixed(1)} ${base}L${X(flown[0][0]).toFixed(1)} ${base}Z`
      : ''

  const showSamples = span <= 6
  const xTicks = ticks(view.x0, view.x1, width < 520 ? 4 : 7)
  const yTicks = ticks(view.y0, view.y1, 4)

  const label = (k: EventKey) => {
    const e = events[k]
    if (k === 'landing') return `${t.flightEvents[k]} ${fmt(e.t)} s`
    const digits = stage === 'apogee' ? 1 : 0
    return `${t.flightEvents[k]} ${fmt(e.h, digits)} m`
  }

  const info = flightStages[stage]
  const timeRange =
    stage === 'flight'
      ? `0 – ${fmt(events.landing.t, 1)} s`
      : stage === 'apogee'
        ? `${fmt(events.apogee.t, 1)} s`
        : `${fmt(BANDS[stage][0], 1)} – ${fmt(BANDS[stage][1], 1)} s`

  const alt = altAt(FLIGHT, time)
  const headStage = stageAt(time)
  const areaStage: Stage = done && stage !== 'flight' ? stage : headStage
  const onPad = time < T0
  const phase = onPad
    ? t.flightPad
    : time < 0
      ? t.flightIgnition
      : time >= events.landing.t
        ? t.flightEvents.landing
        : flightStages[headStage].title[lang]
  const clockText = `${time < 0 ? '−' : '+'}${fmt(Math.abs(time), 1)} s`
  const progress = ((time - START) / (T1 - START)) * 100
  const hx = X(time)
  const hy = Y(alt)
  const inPlot = (x: number) => x >= M.left && x <= M.left + iw
  const showHead = !done && inPlot(onPad ? X(T0) : hx)
  const rx = onPad ? X(T0) : hx
  const ry = onPad ? Y(PAD[0][1]) : hy
  const showDot = onPad && time > START && inPlot(hx)
  const padTone = { '--stage': 'var(--text-muted)' } as CSSProperties
  const dt = Math.max(span * 0.008, 0.02)
  const ta = Math.max(T0, time - dt)
  const tb = Math.min(T1, time + dt)
  const chute = time >= events.main.t ? 'main' : time >= events.drogue.t ? 'drogue' : null
  const angle = chute || time < 0
    ? -90
    : (Math.atan2(Y(altAt(FLIGHT, tb)) - Y(altAt(FLIGHT, ta)), X(tb) - X(ta)) * 180) / Math.PI
  const playLabel = clock.playing ? t.flightPause : done ? t.flightReplay : t.flightPlay

  const track = [
    <span key="pad" className="is-pad" style={{ ...padTone, flex: `${PAD_S} 1 0` }} />,
    ...BAND_KEYS.map((s, i) => <span key={s} style={{ ...tone(s), flex: `${dur(i)} 1 0` }} />),
  ]

  return (
    <section ref={card} className="card flight-card" aria-labelledby="flight-title">
      <div className="window-bar">
        <span className="window-dots" aria-hidden="true">
          <i /> <i /> <i />
        </span>
        <span className="mono window-path">{t.flightFile}</span>
        <div className="flight-controls">
          <button
            type="button"
            className={`fc-play ${clock.playing ? 'is-playing' : ''}`}
            onClick={clock.toggle}
            aria-label={playLabel}
            title={playLabel}
          >
            {clock.playing ? <PauseIcon /> : done ? <ReplayIcon /> : <PlayIcon />}
          </button>
          <div className="fc-speeds" role="group" aria-label={t.flightSpeed}>
            {SPEEDS.map((v) => (
              <button
                key={v}
                type="button"
                className={`fc-speed mono ${clock.speed === v ? 'is-on' : ''}`}
                aria-pressed={clock.speed === v}
                title={`${fmt(v * TIME_SCALE)}× ${t.flightRealTime}`}
                onClick={() => clock.setSpeed(v)}
              >
                {fmt(v, v % 1 ? 1 : 0)}×
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flight-body">
        <h2 id="flight-title" className="flight-title">{t.flightTitle}</h2>
        <p className="muted flight-lead">{t.flightLead}</p>

        <div className={`flight-stages-wrap ${done ? 'is-shown' : ''}`} inert={!done}>
          <div>
            <div className="filters flight-stages" role="group" aria-label={t.flightStagesLabel}>
              {STAGES.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip ${stage === s ? 'is-active' : ''}`}
                  aria-pressed={stage === s}
                  aria-controls="flight-stage"
                  onClick={() => onStage(s)}
                >
                  {flightStages[s].title[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fc-hud mono" aria-hidden="true">
          <span className="fc-readout">
            <small>T</small>
            <b>{clockText}</b>
          </span>
          <span className="fc-readout">
            <small>{t.flightAlt}</small>
            <b>{fmt(alt, 1)} m</b>
          </span>
          <span className={`fc-phase ${clock.playing ? 'is-live' : ''}`} style={onPad ? padTone : tone(headStage)}>
            {phase}
          </span>
        </div>

        <div className="flight-plot" ref={box} style={{ height }}>
          {width > 0 && (
            <svg width={width} height={height} aria-hidden="true">
              <defs>
                <clipPath id="flight-clip">
                  <rect x={M.left} y={M.top} width={iw} height={ih} />
                </clipPath>
                <linearGradient id="flight-tone" gradientUnits="userSpaceOnUse" x1={X(T0)} x2={X(T1)} y1={0} y2={0}>
                  {toneStops(span / Math.max(1, iw)).map(([offset, s], i) => (
                    <stop key={i} offset={offset} style={{ stopColor: `var(--fc-${s})` }} />
                  ))}
                </linearGradient>
                <linearGradient id="flight-fade" gradientUnits="userSpaceOnUse" x1={0} x2={0} y1={M.top} y2={M.top + ih}>
                  <stop offset={0} stopColor="#fff" stopOpacity={1} />
                  <stop offset={1} stopColor="#fff" stopOpacity={0} />
                </linearGradient>
                <mask id="flight-area-mask" maskUnits="userSpaceOnUse">
                  <rect x={M.left} y={M.top} width={iw} height={ih} fill="url(#flight-fade)" />
                </mask>
              </defs>

              <rect className="fc-bg" x={M.left} y={M.top} width={iw} height={ih} rx={6} />

              {yTicks.map((v) => (
                <g key={`y${v}`}>
                  <line className="fc-grid" x1={M.left} x2={M.left + iw} y1={Y(v)} y2={Y(v)} />
                  <text className="fc-axis" x={M.left - 8} y={Y(v)} textAnchor="end" dominantBaseline="middle">
                    {fmt(v)} m
                  </text>
                </g>
              ))}
              {xTicks.map((v) => (
                <text key={`x${v}`} className="fc-axis" x={X(v)} y={M.top + ih + 21} textAnchor="middle">
                  {fmt(v, span <= 6 ? 1 : 0)} s
                </text>
              ))}

              <g clipPath="url(#flight-clip)">
                {BAND_KEYS.map((s) => {
                  const [a, b] = BANDS[s]
                  return (
                    <rect
                      key={s}
                      className={`fc-band ${stage === s ? 'is-on' : ''}`}
                      style={tone(s)}
                      x={X(a)}
                      y={M.top}
                      width={Math.max(2, X(b) - X(a))}
                      height={ih}
                      onClick={() => onStage(stage === s ? 'flight' : s)}
                    />
                  )
                })}

                {areaD && <path className="fc-area" style={tone(areaStage)} d={areaD} mask="url(#flight-area-mask)" />}
                <path className="fc-ref" d={line(inView(upTo(refPart, time)))} />
                <path className="fc-pad" d={line(inView(upTo(PAD, time)))} />
                <path className="fc-ours" d={flownD} />
                {showSamples &&
                  topus
                    .filter(([s]) => s >= view.x0 && s <= view.x1 && s <= time)
                    .map(([s, h]) => (
                      <circle key={s} className="fc-sample" style={tone(stageAt(s))} cx={X(s)} cy={Y(h)} r={2.2} />
                    ))}

                {stage === 'apogee' && time >= 20.4 && (
                  <g className="fc-diff">
                    <line x1={X(20.4)} x2={X(20.4)} y1={Y(events.apogee.h)} y2={Y(events.apogeeRef.h)} />
                    <line x1={X(events.apogee.t)} x2={X(20.4)} y1={Y(events.apogee.h)} y2={Y(events.apogee.h)} />
                    <line x1={X(events.apogeeRef.t)} x2={X(20.4)} y1={Y(events.apogeeRef.h)} y2={Y(events.apogeeRef.h)} />
                    <text x={X(20.4) + 8} y={(Y(events.apogee.h) + Y(events.apogeeRef.h)) / 2} dominantBaseline="middle">
                      {fmt(events.apogee.h - events.apogeeRef.h, 1)} m
                    </text>
                  </g>
                )}

                {(showDot || (showHead && !onPad)) && (
                  <line
                    className="fc-playhead"
                    style={onPad ? padTone : tone(headStage)}
                    x1={hx}
                    x2={hx}
                    y1={M.top}
                    y2={M.top + ih}
                  />
                )}
              </g>

              <g>
                {EVENTS.map((k) => {
                  const e = events[k]
                  if (time < e.t) return null
                  const x = X(e.t)
                  const y = Y(e.h)
                  if (x < M.left - 4 || x > M.left + iw + 4 || y < M.top - 4 || y > M.top + ih + 4) return null
                  const text = LABELED[stage].includes(k) ? label(k) : null
                  return (
                    <g
                      key={k}
                      className={`fc-event ${REF_EVENTS.includes(k) ? 'is-ref' : ''}`}
                      style={k === 'apogeeRef' ? undefined : tone(EVENT_STAGE[k])}
                    >
                      <circle cx={x} cy={y} r={4.5} />
                      {text && <EventLabel text={text} x={x} y={y} shape={SHAPE[k]} left={M.left} right={M.left + iw} />}
                    </g>
                  )
                })}
              </g>

              {!done && time < events.liftoff.t && inPlot(X(T0)) && (
                <path
                  className="fc-rail"
                  d={`M${(X(T0) - 6).toFixed(1)} ${Y(PAD[0][1]).toFixed(1)}v-30M${(X(T0) - 11).toFixed(1)} ${Y(PAD[0][1]).toFixed(1)}h22`}
                />
              )}
              {showHead && (
                <g style={tone(headStage)}>
                  <Rocket
                    x={rx}
                    y={ry}
                    angle={angle}
                    flame={!onPad && time < events.burnout.t}
                    chute={chute}
                  />
                </g>
              )}
              {showDot && (
                <g className="fc-pad-head" style={padTone}>
                  <circle className="fc-head-pulse" cx={hx} cy={hy} r={11} />
                  <circle className="fc-head-dot" cx={hx} cy={hy} r={4.5} />
                </g>
              )}
            </svg>
          )}
        </div>

        <div className="fc-timeline">
          <div className="fc-track" aria-hidden="true">{track}</div>
          <div className="fc-track is-fill" aria-hidden="true" style={{ clipPath: `inset(0 ${100 - progress}% 0 0)` }}>
            {track}
          </div>
          <input
            type="range"
            className="fc-seek"
            style={tone(headStage)}
            min={START}
            max={T1}
            step={0.01}
            value={time}
            aria-label={t.flightSeek}
            aria-valuetext={`T${clockText}, ${fmt(alt)} m, ${phase}`}
            onChange={(e) => {
              clock.pause()
              clock.seek(Number(e.target.value))
            }}
          />
        </div>

        <div className="flight-legend" aria-hidden="true">
          <span className="flight-key is-ours">{t.flightOurs}</span>
          <span className="flight-key is-ref">{t.flightRef}</span>
        </div>

        <div id="flight-stage" className="flight-stage" aria-live="polite">
          <p className="flight-stage-head">
            <strong>{info.title[lang]}</strong> <span className="mono muted">{timeRange}</span>
          </p>
          <p>{info.body[lang]}</p>
          <button type="button" className="bg-card-toggle" onClick={onSeeAtlas}>
            {t.flightSeeAtlas} ↓
          </button>
        </div>
      </div>
    </section>
  )
}
