"""
make_worldmap_ppt.py
Creates a one-slide PPTX with Turkey, India, Thailand, Indonesia,
Vietnam, Taiwan, South Korea, China highlighted.

1.  Generates a map image (PNG)
2.  Inserts the image into a blank PPT slide
3.  (Optional) Adds entrance animations via COM if running on Windows
"""

import os
from pathlib import Path
import matplotlib.pyplot as plt
import geopandas as gpd
import cartopy.crs as ccrs
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN

################################################################################
# STEP 1 — generate highlighted world-map image
################################################################################
OUT_DIR = Path("output")
OUT_DIR.mkdir(exist_ok=True)
PNG_MAP = OUT_DIR / "highlighted_map.png"
PPTX_FILE = OUT_DIR / "Highlighted_Countries.pptx"

countries_to_show = [
    "Turkey",
    "India",
    "Thailand",
    "Indonesia",
    "Vietnam",
    "Taiwan",
    "South Korea",
    "China",
]

# Natural-Earth low-res shapes ship with GeoPandas
world = gpd.read_file(gpd.datasets.get_path("naturalearth_lowres"))
# Note: South Korea is “South Korea” in this dataset
highlight = world[world["name"].isin(countries_to_show)]

# Color palette for 8 countries (feel free to tweak)
palette = [
    "#E74C3C",  # red
    "#3498DB",  # blue
    "#2ECC71",  # green
    "#F1C40F",  # yellow
    "#9B59B6",  # purple
    "#E67E22",  # orange
    "#1ABC9C",  # teal
    "#D35400",  # dark orange
]

fig = plt.figure(figsize=(12, 6))
ax = plt.axes(projection=ccrs.Robinson())
ax.set_global()
# base map in light grey
world.plot(ax=ax, color="#EEEEEE", edgecolor="#CCCCCC", linewidth=0.4, transform=ccrs.PlateCarree())

# overlay highlighted countries
for idx, (_, row) in enumerate(highlight.iterrows()):
    color = palette[idx % len(palette)]
    gpd.GeoSeries([row["geometry"]]).plot(
        ax=ax,
        facecolor=color,
        edgecolor="#333333",
        linewidth=0.5,
        transform=ccrs.PlateCarree(),
    )
    # Add minimalistic label at centroid
    x, y = row["geometry"].centroid.coords[0]
    ax.text(
        x,
        y,
        row["name"],
        fontsize=6.5,
        ha="center",
        va="center",
        transform=ccrs.PlateCarree(),
        color="black",
        zorder=10,
    )

# focus viewport on Eurasia for clarity
ax.set_extent([20, 150, -15, 60], crs=ccrs.PlateCarree())
plt.tight_layout()
fig.savefig(PNG_MAP, dpi=300, transparent=True)
plt.close(fig)

print(f"✅ Map image saved → {PNG_MAP}")

################################################################################
# STEP 2 — insert image into a PowerPoint slide
################################################################################
prs = Presentation()
blank = prs.slide_layouts[6]  # pure blank
slide = prs.slides.add_slide(blank)

# add title
tx = slide.shapes.add_textbox(Inches(0.2), Inches(0.2), Inches(9), Inches(0.7))
p = tx.text_frame.paragraphs[0]
p.text = "Focus Countries"
p.font.size = Pt(36)
p.font.bold = True
p.alignment = PP_ALIGN.CENTER

# add the PNG map
left = Inches(0.2)
top = Inches(1.1)
height = Inches(5.3)
slide.shapes.add_picture(str(PNG_MAP), left, top, height=height)

prs.save(PPTX_FILE)
print(f"✅ PPT saved → {PPTX_FILE}")

################################################################################
# STEP 3 — (Optional) auto-animate in Windows PowerPoint via COM
################################################################################
try:
    import win32com.client as win32
    from time import sleep

    print("\n▶ Attempting to add animations with COM (Windows only)…")
    app = win32.gencache.EnsureDispatch("PowerPoint.Application")
    app.Visible = True
    pres = app.Presentations.Open(str(PPTX_FILE.resolve()))

    sld = pres.Slides(1)
    # All shapes except the title are pictures (index start at 2 here)
    for i, shape in enumerate(list(sld.Shapes)[1:], start=1):
        effect = sld.TimeLine.MainSequence.AddEffect(
            shape,  # shape object
            effectId=1,  # 1 = msoAnimEffectAppear
            trigger=0,   # 0 = on click
        )
        # Stagger timings for sequential reveal
        effect.Timing.TriggerDelayTime = i * 0.5  # seconds

    pres.Save()
    # Give PowerPoint a moment to register the changes
    sleep(1)
    pres.Close()
    app.Quit()
    print("✅ Animations added (Appear in sequence)")

except ImportError:
    print("ℹ️  pywin32 not installed or not on Windows; skipping Step 3 (animations)")
except Exception as e:
    print(f"⚠️  Couldn’t add animations automatically: {e}")
