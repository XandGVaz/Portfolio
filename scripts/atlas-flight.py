"""Gera src/flightData.ts, os dados do gráfico de voo do Atlas na página da TOPUS.

Uso: python3 scripts/atlas-flight.py <pasta docs/data do repositório eletronica-atlas-3km>

Fontes (do próprio repositório do Atlas):
- FlightDataAtlas.csv: log do cartão SD do computador de voo da TOPUS
  (Kalman_Alt: altitude estimada pelo filtro de Kalman do firmware; State: fase);
- EasyMiniDataAtlas.csv: altímetro comercial EasyMini que voou junto (referência).

Tratamento, o mesmo do relatório de voo (relatorio_voo_atlas):
- relógios alinhados pelo trecho de coast (TOPUS - 320,2 s = EasyMini); t = 0 na
  detecção de decolagem do EasyMini;
- a amostra do EasyMini em 22,38 s (1916 m) é o degrau de pressão da ejeção do
  drogue, não altitude, e fica de fora;
- o log do cartão vai da ignição até 0,5 s depois do apogeu e tem intervalos sem
  gravação (até ~1,2 s); as amostras saem como estão, sem interpolar;
- apogeus: Kalman_MaxAlt da TOPUS e a altitude do EasyMini na entrada do
  estado drogue (o apogeu anunciado por cada computador);
- pouso: a primeira amostra do EasyMini em que a altura chega a 0 m (o estado
  "landed" só é declarado ~15 s depois); em solo o barômetro marca cerca de
  -2,6 m, e a curva termina 2 s após o pouso, no chão (0 m).
"""
import csv
import sys
from pathlib import Path

OFFSET = 320.2  # s: tempo da TOPUS - OFFSET = tempo do EasyMini
EJECTION = (21.9, 22.8)  # s: janela do degrau de pressão da ejeção (EasyMini)

data = Path(sys.argv[1])
out = Path(__file__).resolve().parent.parent / 'src' / 'flightData.ts'

# EasyMini: 1 ponto a cada 0,05 s até 25 s (subida e apogeu), depois a cada 0,5 s
em, last, events = [], None, {}
prev_state, drogue_v0 = None, None
for line in (data / 'EasyMiniDataAtlas.csv').read_text().splitlines():
    if line.startswith('#'):
        continue
    c = [x.strip() for x in line.split(',')]
    t, state, h, drogue_v = float(c[3]), c[5], float(c[9]), float(c[12])
    if drogue_v0 is None:
        drogue_v0 = drogue_v
    if state != prev_state:
        if state == 'coast':
            events['burnoutRef'] = (t, h)
        elif state == 'drogue':
            events['apogeeRef'] = (t, h)
        elif state == 'main':
            events['main'] = (t, h)
        prev_state = state
    if 'main' in events and 'landing' not in events and h <= 0:
        events['landing'] = (t, 0.0)
    if 'landing' in events and t > events['landing'][0] + 2:
        break
    # carga do drogue disparada: a tensão do canal cai
    if 'drogue' not in events and drogue_v < drogue_v0 - 0.3:
        events['drogue'] = (t, h)
    if EJECTION[0] <= t <= EJECTION[1]:
        continue
    step = 0.05 if t < 25 or 'landing' in events else 0.5
    if last is None or t - last >= step - 1e-9:
        em.append((t, max(h, 0) if 'landing' in events else h))
        last = t

# TOPUS: todas as amostras do cartão desde 1,2 s antes da decolagem
ours, max_alt, prev_state = [], 0.0, None
for r in csv.DictReader((data / 'FlightDataAtlas.csv').open()):
    t = int(r['Millis']) / 1000 - OFFSET
    a, state = float(r['Kalman_Alt']), r['State']
    max_alt = max(max_alt, float(r['Kalman_MaxAlt']))
    if state != prev_state:
        name = {'1': 'liftoff', '2': 'burnout', '3': 'apogee'}.get(state)
        if name:
            events[name] = (t, a)
        prev_state = state
    if t >= -1.2:
        ours.append((t, a))
events['apogee'] = (events['apogee'][0], max_alt)


def pts(points):
    return '[' + ', '.join(f'[{t:.2f}, {h:.1f}]' for t, h in points) + ']'


order = ['liftoff', 'burnout', 'burnoutRef', 'apogee', 'apogeeRef', 'drogue', 'main', 'landing']
out.write_text(
    '// Gerado por scripts/atlas-flight.py a partir dos dados do repositório do Atlas.\n'
    '// Não edite à mão: rode o script de novo.\n'
    '// Pares [tempo desde a decolagem (s), altitude acima da rampa (m)].\n\n'
    '// Altímetro comercial EasyMini (referência), do início ao pouso.\n'
    f'export const easyMini: [number, number][] = {pts(em)}\n\n'
    '// Kalman de bordo da TOPUS (cartão SD), da ignição até 0,5 s depois do apogeu.\n'
    f'export const topus: [number, number][] = {pts(ours)}\n\n'
    '// Eventos: *Ref = EasyMini; os demais, máquina de estados da TOPUS.\n'
    'export const events = {\n'
    + ''.join(f'  {k}: {{ t: {events[k][0]:.2f}, h: {events[k][1]:.2f} }},\n' for k in order)
    + '}\n'
)
ap, ref = events['apogee'][1], events['apogeeRef'][1]
print(f'{out}: {len(em)} pontos do EasyMini, {len(ours)} da TOPUS')
for k in order:
    print(f'  {k:11s} t={events[k][0]:7.2f} s  h={events[k][1]:8.2f} m')
print(f'apogeu {ap:.2f} x {ref:.2f} m: {ap - ref:+.2f} m, {100 * (1 - abs(ap - ref) / ref):.2f}% de exatidão')
