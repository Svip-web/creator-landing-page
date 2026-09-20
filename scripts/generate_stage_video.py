from pathlib import Path
import math
import subprocess

import imageio_ffmpeg
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

W, H, FPS, SECONDS = 1280, 720, 24, 6
FRAMES = FPS * SECONDS
ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "assets" / "hero-stage-loop.mp4"

y, x = np.mgrid[0:H, 0:W]
base = np.zeros((H, W, 3), dtype=np.float32)
vertical = y / H
base[..., 0] = 9 + 17 * vertical
base[..., 1] = 4 + 2 * vertical
base[..., 2] = 8 + 7 * vertical


def glow(cx, cy, sx, sy):
    return np.exp(-(((x - cx) / sx) ** 2 + ((y - cy) / sy) ** 2) * 2.0)


ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
cmd = [
    ffmpeg, "-y", "-f", "rawvideo", "-vcodec", "rawvideo", "-pix_fmt", "rgb24",
    "-s", f"{W}x{H}", "-r", str(FPS), "-i", "-", "-an", "-c:v", "libx264",
    "-preset", "medium", "-crf", "21", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    str(OUTPUT),
]

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
process = subprocess.Popen(cmd, stdin=subprocess.PIPE)

for frame in range(FRAMES):
    phase = 2 * math.pi * frame / FRAMES
    arr = base.copy()

    # Slow, perfectly looping ambient light across the presentation screen.
    left = glow(350 + 85 * math.sin(phase), 300, 430, 320)
    right = glow(920 + 90 * math.cos(phase), 330, 470, 340)
    center = glow(640, 285 + 24 * math.sin(phase * 2), 560, 290)
    arr[..., 0] += left * 44 + right * 30 + center * 17
    arr[..., 1] += left * 5 + right * 3 + center * 2
    arr[..., 2] += left * 10 + right * 8 + center * 6

    # Stage floor and a quiet reflection of the screen.
    floor_mask = np.clip((y - 472) / 248, 0, 1)
    arr[..., 0] += floor_mask * 18
    arr[..., 1] += floor_mask * 4
    arr[..., 2] += floor_mask * 6
    reflection = glow(640, 665, 430, 150)
    arr[..., 0] += reflection * (19 + 6 * math.sin(phase))
    arr[..., 1] += reflection * 6
    arr[..., 2] += reflection * 5
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    image = Image.fromarray(arr, "RGB")

    # Soft moving keynote spotlights.
    beams = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(beams)
    sway = 45 * math.sin(phase)
    bd.polygon([(155, 0), (245, 0), (500 + sway, 600), (305 + sway, 600)], fill=(235, 190, 115, 20))
    bd.polygon([(1125, 0), (1035, 0), (780 - sway, 600), (975 - sway, 600)], fill=(235, 190, 115, 17))
    bd.polygon([(560, 0), (720, 0), (795, 590), (485, 590)], fill=(165, 36, 57, 12))
    beams = beams.filter(ImageFilter.GaussianBlur(24))
    image = Image.alpha_composite(image.convert("RGBA"), beams)

    # Central stage screen, architectural frame and floor lines.
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    d.rounded_rectangle((150, 68, 1130, 492), radius=20, fill=(9, 4, 7, 92), outline=(218, 174, 103, 48), width=2)
    d.rounded_rectangle((176, 92, 1104, 466), radius=13, outline=(218, 174, 103, 22), width=1)
    d.line((0, 493, W, 493), fill=(229, 184, 105, 54), width=2)
    d.line((165, 553, 1115, 553), fill=(229, 184, 105, 22), width=1)
    d.line((255, 628, 1025, 628), fill=(229, 184, 105, 14), width=1)
    # Ceiling rig and side panels.
    d.line((0, 42, W, 42), fill=(229, 184, 105, 30), width=1)
    for px in (86, 1194):
        d.line((px, 70, px, 520), fill=(229, 184, 105, 20), width=1)
    # Small stage lights with a looping shimmer.
    pulse = int(95 + 55 * (0.5 + 0.5 * math.sin(phase * 2)))
    for px in (196, 334, 946, 1084):
        d.ellipse((px - 3, 486, px + 3, 492), fill=(245, 205, 135, pulse))
    image = Image.alpha_composite(image, overlay).convert("RGB")
    process.stdin.write(image.tobytes())

process.stdin.close()
return_code = process.wait()
if return_code:
    raise SystemExit(return_code)
print(OUTPUT)
