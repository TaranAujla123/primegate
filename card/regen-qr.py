"""Regenerate the inline QR SVG in card/index.html from taran-aujla.vcf.

Run from build-v2/card/:
    python regen-qr.py

Then paste the printed <svg> block over the existing QR SVG on the line
inside <div class="qr" role="img">. Update viewBox modules if the version
changes.

Params match the original inline SVG:
    stroke color #C9A961 on transparent background
    ECC level M (15%)
    zero-module border (padding handled by CSS)
    horizontal-run path notation (M x y.5 h N ...) for compactness
"""
import qrcode

with open('taran-aujla.vcf', 'rb') as f:
    vcf = f.read().decode('utf-8')

qr = qrcode.QRCode(
    error_correction=qrcode.constants.ERROR_CORRECT_M,
    box_size=1,
    border=0,
)
qr.add_data(vcf)
qr.make(fit=True)
size = qr.modules_count
matrix = qr.modules

path_parts = []
for y in range(size):
    x = 0
    row_parts = []
    prev_end = 0
    while x < size:
        if matrix[y][x]:
            run_start = x
            while x < size and matrix[y][x]:
                x += 1
            run_len = x - run_start
            if row_parts:
                gap = run_start - prev_end
                row_parts.append(f'm{gap} 0h{run_len}')
            else:
                row_parts.append(f'M{run_start} {y + 0.5}h{run_len}')
            prev_end = x
        else:
            x += 1
    if row_parts:
        path_parts.append(''.join(row_parts))

d = ''.join(path_parts)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
    f'shape-rendering="crispEdges">'
    f'<path stroke="#C9A961" d="{d}"/>'
    f'</svg>'
)
print(f'# QR modules: {size}x{size}')
print(svg)
