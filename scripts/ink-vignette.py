"""
Turns an engraving (black ink on white, e.g. the generated vignettes) into printing ink: the white
paper becomes transparent and the lines take the given colour, so the vignette sits on the site's
misty paper like it was printed there. Output is WebP with alpha.

  python3 scripts/ink-vignette.py <in.png> <out.webp> <hex colour> [max width]
"""
import sys
from PIL import Image, ImageOps

src, out, colour = sys.argv[1], sys.argv[2], sys.argv[3].lstrip("#")
max_w = int(sys.argv[4]) if len(sys.argv) > 4 else 1200

im = Image.open(src).convert("L")
if im.width > max_w:
    im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
# ink amount = darkness; lift the near-white paper to fully clear and deepen the lines a little
ink = ImageOps.invert(im).point(lambda v: 0 if v < 14 else min(255, int((v - 14) * 1.25)))
r, g, b = (int(colour[i : i + 2], 16) for i in (0, 2, 4))
layer = Image.new("RGBA", im.size, (r, g, b, 0))
layer.putalpha(ink)
layer.save(out, "WEBP", quality=88, method=6)
print(out, layer.size)
