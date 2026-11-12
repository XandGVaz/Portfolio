"""Gera o GIF em estilo terminal da janela "Sobre Mim": um sensor envia uma
leitura por rádio para a nuvem (broker e banco de dados), que a entrega a um
computador. Protocolos e serviços ficam genéricos de propósito.

Uso: python3 scripts/terminal-gif.py

Saída (em src/assets/about/), para cada idioma (pt, en):
- pipeline-<idioma>.gif / .png: versão larga (1000 px), para telas grandes;
- pipeline-<idioma>-sm.gif / .png: versão compacta (600 px, texto
  proporcionalmente maior), para celulares;
o .png é o quadro parado, usado com animação reduzida.
Precisa da fonte "JetBrainsMono Nerd Font" instalada (ícones do diagrama).
"""
import subprocess
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent.parent / 'src' / 'assets' / 'about'


def font_path(style: str) -> str:
    out = subprocess.run(['fc-match', '-f', '%{file}', f'JetBrainsMono Nerd Font:style={style}'],
                         capture_output=True, text=True, check=True).stdout
    return out


REG, BOLD = font_path('Regular'), font_path('Bold')
FPS_MS = 80

# Medidas de cada versão. `subs`: mostra as legendas secundárias dos nós.
LAYOUTS = {
    'wide': dict(W=1000, H=520, prompt=26, log=26, label=26, small=21, icon=92, wave=40,
                 nodes=[190, 500, 810], icon_y=86, link_y=132, link_pad=(70, 80),
                 label_y=206, sub_y=244, log_top=318, log_line=38, subs=True),
    'sm': dict(W=600, H=462, prompt=23, log=23, label=24, small=20, icon=72, wave=32,
               nodes=[100, 300, 500], icon_y=78, link_y=114, link_pad=(52, 62),
               label_y=172, sub_y=206, log_top=268, log_line=35, subs=False),
}
L = {}  # versão em uso (preenchida por use())


def use(name):
    L.clear()
    L.update(LAYOUTS[name])
    L['f_prompt'] = ImageFont.truetype(REG, L['prompt'])
    L['f_log'] = ImageFont.truetype(REG, L['log'])
    L['f_label'] = ImageFont.truetype(BOLD, L['label'])
    L['f_small'] = ImageFont.truetype(REG, L['small'])
    L['f_icon'] = ImageFont.truetype(REG, L['icon'])
    L['f_wave'] = ImageFont.truetype(REG, L['wave'])

BG = '#0b1020'
BORDER = '#25304a'
TEXT = '#d5dce7'
DIM = '#66758f'
GREEN = '#7ee787'
BLUE = '#8cc8ff'
YELLOW = '#f2cc60'
LINE = '#2c3954'

ICON_SENSOR = chr(0xF2DB)  # microchip
ICON_WAVE = chr(0xF0003)  # access point
ICON_CLOUD = chr(0xF015F)
ICON_PC = chr(0xF0A07)  # monitor dashboard

LOG_ROWS = 5

READINGS = [  # temp (°C), umidade (%), RSSI (dBm), latência da API (ms)
    (24.3, 61, -97, 18),
    (24.6, 60, -95, 21),
    (24.4, 62, -98, 17),
]

TEXTS = {
    'pt': {
        'labels': ['sensor', 'nuvem', 'computador'],
        'subs': ['nó sensor', 'broker · banco de dados', None],
        'links': ['rádio', 'HTTPS'],
        'lines': lambda t, u, r, ms: [
            ('[sensor]', f'temp={t:.1f}°C umid={u}%'),
            ('[rádio]', f'uplink enviado · RSSI {r} dBm'),
            ('[nuvem]', 'broker → banco de dados ✓'),
            ('[api]', f'GET /leituras 200 · {ms} ms'),
            ('[pc]', 'painel atualizado'),
        ],
    },
    'en': {
        'labels': ['sensor', 'cloud', 'computer'],
        'subs': ['sensor node', 'broker · database', None],
        'links': ['radio', 'HTTPS'],
        'lines': lambda t, u, r, ms: [
            ('[sensor]', f'temp={t:.1f}°C hum={u}%'),
            ('[radio]', f'uplink sent · RSSI {r} dBm'),
            ('[cloud]', 'broker → database ✓'),
            ('[api]', f'GET /readings 200 · {ms} ms'),
            ('[pc]', 'dashboard updated'),
        ],
    },
}

# Linha do tempo de cada ciclo (em quadros de 80 ms)
CYCLE = 72
LOG_AT = [0, 6, 30, 40, 60]  # quando cada linha do log aparece
UP = (6, 26)  # pacote sensor → nuvem
CLOUD = (26, 38)  # nuvem processando
DOWN = (38, 58)  # pacote nuvem → computador
PC_FLASH = (58, 66)  # computador recebe


def centered(d, x, y, text, font, fill):
    w = d.textlength(text, font=font)
    d.text((x - w / 2, y), text, font=font, fill=fill)


def link(d, x0, x1, label, active):
    LINK_Y = L['link_y']
    color = BLUE if active else LINE
    x = x0
    while x < x1 - 14:  # linha tracejada
        d.line([(x, LINK_Y), (min(x + 12, x1 - 14), LINK_Y)], fill=color, width=3)
        x += 20
    d.polygon([(x1 - 14, LINK_Y - 8), (x1, LINK_Y), (x1 - 14, LINK_Y + 8)], fill=color)
    centered(d, (x0 + x1) / 2, LINK_Y - 40, label, L['f_small'], BLUE if active else DIM)


def packet(d, x0, x1, p):
    LINK_Y = L['link_y']
    # ponto que percorre a ligação, com um rastro que vai sumindo
    for k, (r, c) in enumerate([(10, BLUE), (7, '#5b86b8'), (5, '#3b5578')]):
        q = max(0.0, p - k * 0.06)
        x = x0 + (x1 - x0) * q
        d.ellipse([x - r, LINK_Y - r, x + r, LINK_Y + r], fill=c)


def frame(lang, f, log, shown_value):
    T = TEXTS[lang]
    W, H, NODES, ICON_Y = L['W'], L['H'], L['nodes'], L['icon_y']
    F_PROMPT, F_LOG, F_LABEL, F_SMALL = L['f_prompt'], L['f_log'], L['f_label'], L['f_small']
    F_ICON, F_WAVE = L['f_icon'], L['f_wave']
    LOG_TOP, LOG_LINE = L['log_top'], L['log_line']
    pa, pb = L['link_pad']
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    # sem moldura: no site o terminal ocupa a parte de baixo da janela, de borda a borda

    # prompt
    user = 'vitor@usp:~$ '
    d.text((28, 22), user, font=F_PROMPT, fill=GREEN)
    d.text((28 + d.textlength(user, font=F_PROMPT), 22), './monitor --live', font=F_PROMPT, fill=TEXT)

    t = f % CYCLE
    sending = UP[0] <= t < UP[1]
    processing = CLOUD[0] <= t < CLOUD[1]
    receiving = DOWN[0] <= t < DOWN[1]
    flash = PC_FLASH[0] <= t < PC_FLASH[1]

    # ligações e pacotes
    xs, xc, xp = NODES
    link(d, xs + pa, xc - pb, T['links'][0], sending)
    link(d, xc + pb, xp - pa, T['links'][1], receiving)
    if sending:
        packet(d, xs + pa, xc - pb, (t - UP[0]) / (UP[1] - UP[0] - 1))
    if receiving:
        packet(d, xc + pb, xp - pa, (t - DOWN[0]) / (DOWN[1] - DOWN[0] - 1))

    # nós
    sensor_on = t < UP[0] + 4 or (sending and (t // 3) % 2 == 0)
    centered(d, xs, ICON_Y, ICON_SENSOR, F_ICON, BLUE if t < UP[1] else TEXT)
    d.text((xs + L['icon'] * 0.37, ICON_Y - L['wave'] * 0.75), ICON_WAVE, font=F_WAVE, fill=BLUE if sensor_on and t < UP[1] else DIM)
    cloud_color = BLUE if processing and (t // 2) % 2 == 0 else (BLUE if processing else TEXT)
    centered(d, xc, ICON_Y, ICON_CLOUD, F_ICON, cloud_color)
    centered(d, xp, ICON_Y, ICON_PC, F_ICON, BLUE if flash else TEXT)

    for x, label, sub in zip(NODES, T['labels'], T['subs']):
        centered(d, x, L['label_y'], label, F_LABEL, TEXT)
        if sub and L['subs']:
            centered(d, x, L['sub_y'], sub, F_SMALL, DIM)
    temp, hum = shown_value
    centered(d, xp, L['sub_y'], f'{temp:.1f}°C · {hum}%', F_SMALL, YELLOW if flash else DIM)

    # log
    d.line([(28, LOG_TOP - 18), (W - 28, LOG_TOP - 18)], fill=LINE, width=2)
    for i, (tag, msg) in enumerate(log[-LOG_ROWS:]):
        y = LOG_TOP + i * LOG_LINE
        d.text((28, y), tag, font=F_LOG, fill=BLUE)
        x = 28 + d.textlength('[sensor] ', font=F_LOG)
        if msg.endswith('✓'):
            d.text((x, y), msg[:-1], font=F_LOG, fill=TEXT)
            d.text((x + d.textlength(msg[:-1], font=F_LOG), y), '✓', font=F_LOG, fill=GREEN)
        else:
            d.text((x, y), msg, font=F_LOG, fill=TEXT)
    # cursor piscando no fim do log
    if (f // 5) % 2 == 0:
        last = log[-1]
        y = LOG_TOP + (min(len(log), LOG_ROWS) - 1) * LOG_LINE
        x = 28 + d.textlength('[sensor] ' + last[1] + ' ', font=F_LOG)
        d.rectangle([x, y + 4, x + L['log'] * 0.54, y + L['log'] * 1.15], fill=TEXT)
    return im


def render(lang):
    T = TEXTS[lang]
    cycles = [T['lines'](*r) for r in READINGS]
    # o log começa com as linhas do último ciclo, para o loop emendar sem salto
    log = list(cycles[-1])
    value = READINGS[-1][:2]
    frames = []
    for c, lines in enumerate(cycles):
        for t in range(CYCLE):
            for k, at in enumerate(LOG_AT):
                if t == at:
                    log.append(lines[k])
            if t == PC_FLASH[0]:
                value = READINGS[c][:2]
            frames.append(frame(lang, c * CYCLE + t, log, value))
    return frames


def save(frames, gif, png):
    # paleta única para todos os quadros (sem pontilhado, para o texto ficar limpo)
    pal = frames[CYCLE + PC_FLASH[0] + 2].quantize(colors=64, method=Image.Quantize.MEDIANCUT)
    q = [f.quantize(palette=pal, dither=Image.Dither.NONE) for f in frames]
    q[0].save(gif, save_all=True, append_images=q[1:], duration=FPS_MS, loop=0, optimize=True)
    frames[CYCLE - 4].save(png, optimize=True)  # quadro parado: ciclo completo, log cheio


if __name__ == '__main__':
    for layout, suffix in (('wide', ''), ('sm', '-sm')):
        use(layout)
        for lang in ('pt', 'en'):
            frames = render(lang)
            gif, png = OUT / f'pipeline-{lang}{suffix}.gif', OUT / f'pipeline-{lang}{suffix}.png'
            save(frames, gif, png)
            print(f'{gif.name}: {len(frames)} quadros, {gif.stat().st_size / 1024:.0f} KB | {png.name}: {png.stat().st_size / 1024:.0f} KB')
