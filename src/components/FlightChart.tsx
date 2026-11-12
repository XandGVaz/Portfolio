import { useEffect, useRef, useState } from 'react'
import type { Lang, UI } from '../content.ts'
import { flightStages, type FlightStage } from '../journey.ts'
import { easyMini, events, topus } from '../flightData.ts'

// Gráfico do voo do Atlas (dados reais, ver scripts/atlas-flight.py).
// Cada fase do voo tem um enquadramento próprio; trocar de fase (pelos botões,
// clicando numa faixa do gráfico ou num card de número acima) anima o
// enquadramento até o novo trecho. O SVG é desenhado no tamanho real em pixels,
// para que marcadores e textos não se deformem.

type View = { x0: number; x1: number; y0: number; y1: number }
type Stage = Exclude<FlightStage, 'flight'>
// Eventos desenhados (o fim da queima segundo o EasyMini fica só nos dados, para conferência).
const EVENTS = ['liftoff', 'burnout', 'apogee', 'apogeeRef', 'drogue', 'main', 'landing'] as const
type EventKey = (typeof EVENTS)[number]

const STAGES: FlightStage[] = ['flight', 'boost', 'coast', 'apogee', 'drogue', 'main']

const VIEWS: Record<FlightStage, View> = {
  flight: { x0: -3, x1: 152, y0: 0, y1: 2100 },
  boost: { x0: -0.6, x1: 4.2, y0: 0, y1: 1150 },
  coast: { x0: 1.5, x1: 22, y0: 600, y1: 2020 },
  apogee: { x0: 17.4, x1: 21.65, y0: 1864, y1: 1901 },
  drogue: { x0: 16, x1: 118, y0: 150, y1: 2020 },
  main: { x0: 106, x1: 152, y0: 0, y1: 620 },
}

// Faixas de tempo de cada fase, contíguas: do apogeu ao disparo do drogue
// conta como "apogeu".
const BANDS: Record<Stage, [number, number]> = {
  boost: [0, events.burnout.t],
  coast: [events.burnout.t, events.apogee.t],
  apogee: [events.apogee.t, events.drogue.t],
  drogue: [events.drogue.t, events.main.t],
  main: [events.main.t, events.landing.t],
}

// Eventos com rótulo em cada enquadramento (os demais aparecem só como ponto).
const LABELED: Record<FlightStage, EventKey[]> = {
  flight: ['apogee', 'main'],
  boost: ['liftoff', 'burnout'],
  coast: ['burnout', 'apogee'],
  apogee: ['apogee', 'apogeeRef'],
  drogue: ['drogue', 'main'],
  main: ['main', 'landing'],
}

// Onde fica o rótulo em relação à curva: na subida, acima e à esquerda; no pico,
// centrado (TOPUS acima, EasyMini abaixo); na descida, acima e à direita.
// Se não couber desse lado, vai para o lado oposto, abaixo da curva.
const SHAPE: Record<EventKey, 'up' | 'peak' | 'peakBelow' | 'down'> = {
  liftoff: 'up',
  burnout: 'up',
  apogee: 'peak',
  apogeeRef: 'peakBelow',
  drogue: 'down',
  main: 'down',
  landing: 'down', // à direita do pouso a curva já acabou
}
const REF_EVENTS: EventKey[] = ['apogeeRef'] // o apogeu do EasyMini, em cinza, como referência

// EasyMini: em cinza só na janela do apogeu (comparação com o Kalman de bordo);
// do disparo do drogue ao pouso, é a própria curva do voo, em azul.
const REF_FROM = VIEWS.apogee.x0
const refPart = easyMini.filter(([s]) => s >= REF_FROM && s <= events.drogue.t)
// Entre a última amostra gravada a bordo e o drogue, o foguete está em queda
// livre (velocidade baixa, arrasto desprezível): a curva azul segue a parábola
// h(τ) = h0 + v0·τ − g·τ²/2 que passa pelos dois pontos. Com os dados do voo,
// ela dá −4,1 m/s no início (bordo: ≈ −3,6 m/s, ainda acelerando) e −19,3 m/s
// no fim (EasyMini no drogue: −19,5 m/s).
//
// O mesmo vale para o buraco do cartão logo antes do apogeu (18,27 → 19,44 s):
// a parábola dá +10,4 m/s no início (bordo: +11,0) e −1,1 m/s no fim (bordo:
// ≈ −0,9), com pico de 1.894,66 m (apogeu registrado a bordo: 1.894,63 m).
//
// Para o trecho ter a textura dos dados reais, leva um ruído pequeno, medido nos
// próprios dados (desvio em torno de uma parábola ajustada): ≈ 0,06 m no Kalman
// de bordo (gravado em passos de 0,1 m, a cada 0,02 s) e ≈ 0,39 m no EasyMini
// perto do apogeu (a cada 0,05 s). O ruído vai a zero nas pontas, para emendar
// sem degrau, e usa semente fixa: o desenho é sempre o mesmo.
const G = 9.81

// Gerador pseudoaleatório com semente (mulberry32) + normal padrão (Box-Muller).
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
  step: number // s entre amostras
  sigma: [number, number] // desvio do ruído no início e no fim do trecho (m)
  round?: number // resolução de gravação (m)
  seed: number
}

// Pontos internos do trecho balístico entre `from` e `to` (as pontas ficam de fora).
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

// Curva de bordo com o buraco antes do apogeu preenchido (os pontos de amostra
// desenhados no zoom continuam sendo só os gravados, em `topus`).
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

const M = { top: 26, right: 14, bottom: 34, left: 66 }

// Passo "redondo" (1, 2 ou 5 × 10^n) para ~`count` divisões.
function ticks(a: number, b: number, count: number) {
  const raw = (b - a) / count
  const mag = 10 ** Math.floor(Math.log10(raw))
  const step = [1, 2, 5, 10].map((k) => k * mag).find((s) => s >= raw) ?? raw
  const out: number[] = []
  for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(6))
  return out
}

// Anima o enquadramento até `target` (sem animação com movimento reduzido).
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

// Rótulo de um evento, posicionado conforme `shape` e mantido dentro do gráfico.
function EventLabel(p: { text: string; x: number; y: number; shape: (typeof SHAPE)[EventKey]; left: number; right: number }) {
  const w = p.text.length * 7.9 // largura aproximada do texto (14px, semibold)
  const gap = 10
  let anchor: 'start' | 'middle' | 'end'
  let x = p.x
  let y = p.y - gap
  if (p.shape === 'peak' || p.shape === 'peakBelow') {
    anchor = 'middle'
    if (p.shape === 'peakBelow') y = p.y + gap + 8
    x = Math.min(Math.max(x, p.left + w / 2), p.right - w / 2)
  } else if (p.shape === 'up') {
    // acima e à esquerda; sem espaço à esquerda, abaixo e à direita
    if (p.x - gap - w >= p.left) {
      anchor = 'end'
      x = p.x - gap
    } else {
      anchor = 'start'
      x = p.x + gap
      y = p.y + gap + 8
    }
  } else {
    // acima e à direita; sem espaço à direita, abaixo e à esquerda
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
  const box = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const view = useAnimatedView(VIEWS[stage])
  const fmt = (v: number, digits = 0) =>
    v.toLocaleString(t.flightLocale, { minimumFractionDigits: digits, maximumFractionDigits: digits })

  const height = Math.round(Math.min(360, Math.max(240, width * 0.42)))
  const iw = Math.max(0, width - M.left - M.right)
  const ih = height - M.top - M.bottom
  const X = (s: number) => M.left + ((s - view.x0) / (view.x1 - view.x0)) * iw
  const Y = (h: number) => M.top + (1 - (h - view.y0) / (view.y1 - view.y0)) * ih

  const span = view.x1 - view.x0
  const path = (pts: [number, number][]) => {
    let d = ''
    for (const [s, h] of pts) {
      if (s < view.x0 - span * 0.05 || s > view.x1 + span * 0.05) continue
      d += `${d ? 'L' : 'M'}${X(s).toFixed(1)} ${Y(h).toFixed(1)}`
    }
    return d
  }
  // Em enquadramentos curtos, cada amostra gravada a bordo aparece como um ponto.
  const showSamples = span <= 6
  const xTicks = ticks(view.x0, view.x1, width < 520 ? 4 : 7)
  const yTicks = ticks(view.y0, view.y1, 4)

  const label = (k: EventKey) => {
    const e = events[k]
    if (k === 'landing') return `${t.flightEvents[k]} ${fmt(e.t)} s` // no chão, o que importa é quando
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

  return (
    <section className="card flight-card" aria-labelledby="flight-title">
      <h2 id="flight-title" className="flight-title">{t.flightTitle}</h2>
      <p className="muted flight-lead">{t.flightLead}</p>

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

      <div className="flight-plot" ref={box} style={{ height }}>
        {width > 0 && (
          <svg width={width} height={height} aria-hidden="true">
            <defs>
              <clipPath id="flight-clip">
                <rect x={M.left} y={M.top} width={iw} height={ih} />
              </clipPath>
            </defs>

            {/* grade e eixos */}
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
              {/* faixas das fases: a selecionada fica destacada; clicar seleciona */}
              {(Object.keys(BANDS) as Stage[]).map((s) => {
                const [a, b] = BANDS[s]
                return (
                  <rect
                    key={s}
                    className={`fc-band ${stage === s ? 'is-on' : ''}`}
                    x={X(a)}
                    y={M.top}
                    width={Math.max(2, X(b) - X(a))}
                    height={ih}
                    onClick={() => onStage(stage === s ? 'flight' : s)}
                  />
                )
              })}

              <path className="fc-ref" d={path(refPart)} />
              <path className="fc-ours" d={path(topusLine)} />
              <path className="fc-ours" d={path(descent)} />
              {showSamples &&
                topus
                  .filter(([s]) => s >= view.x0 && s <= view.x1)
                  .map(([s, h]) => <circle key={s} className="fc-sample" cx={X(s)} cy={Y(h)} r={2.2} />)}

              {/* apogeu: diferença entre os dois computadores */}
              {stage === 'apogee' && (
                <g className="fc-diff">
                  <line x1={X(20.4)} x2={X(20.4)} y1={Y(events.apogee.h)} y2={Y(events.apogeeRef.h)} />
                  <line x1={X(events.apogee.t)} x2={X(20.4)} y1={Y(events.apogee.h)} y2={Y(events.apogee.h)} />
                  <line x1={X(events.apogeeRef.t)} x2={X(20.4)} y1={Y(events.apogeeRef.h)} y2={Y(events.apogeeRef.h)} />
                  <text x={X(20.4) + 8} y={(Y(events.apogee.h) + Y(events.apogeeRef.h)) / 2} dominantBaseline="middle">
                    {fmt(events.apogee.h - events.apogeeRef.h, 1)} m
                  </text>
                </g>
              )}

            </g>

            {/* eventos fora do recorte, para os rótulos perto da borda não serem cortados */}
            <g>
              {EVENTS.map((k) => {
                const e = events[k]
                const x = X(e.t)
                const y = Y(e.h)
                if (x < M.left - 4 || x > M.left + iw + 4 || y < M.top - 4 || y > M.top + ih + 4) return null
                const text = LABELED[stage].includes(k) ? label(k) : null
                return (
                  <g key={k} className={`fc-event ${REF_EVENTS.includes(k) ? 'is-ref' : ''}`}>
                    <circle cx={x} cy={y} r={4.5} />
                    {text && <EventLabel text={text} x={x} y={y} shape={SHAPE[k]} left={M.left} right={M.left + iw} />}
                  </g>
                )
              })}
            </g>
          </svg>
        )}
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
    </section>
  )
}
