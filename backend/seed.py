import os
import sys
import django

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "duluwa_backend.settings")
django.setup()

from backend.collections.models import Collection
from artworks.models import Artwork, ProcessStep, Testimonial
from core.models import SiteMedia, CommissionPricing, CommissionTier

# Clear existing
Artwork.objects.all().delete()
Collection.objects.all().delete()
ProcessStep.objects.all().delete()
Testimonial.objects.all().delete()
SiteMedia.objects.all().delete()
CommissionTier.objects.all().delete()
CommissionPricing.objects.all().delete()

# Collections
cols = [
    ("himalaya", "01", "Himalayan Landscapes", 3, 200, "First light on snow, monsoon valleys and the long blue distance of the high passes.", "/art/drawing-09.jpg"),
    ("culture", "02", "Cultural Heritage", 3, 150, "Festivals, prayer flags and the quiet rituals of the courtyards of Kathmandu.", "/art/drawing-03.jpg"),
    ("portrait", "03", "Portrait Studies", 3, 30, "Faces weathered by altitude and devotion — studies in patience and pigment.", "/art/drawing-02.jpg"),
    ("wildlife", "04", "Wildlife Series", 3, 100, "The tiger, the danphe, the river otter — each caught in a single held breath of water.", "/art/drawing-12.jpg"),
    ("lifestyle", "05", "Lifestyle Moments", 3, 55, "Tea fields, terraced farms and the slow choreography of mountain daily life.", "/art/drawing-13.jpg"),
    ("sketches", "06", "Quick Sketches", 3, 250, "Loose, fast, unguarded — the notebook where every finished work begins.", "/art/drawing-16.jpg"),
]
for c in cols:
    Collection.objects.create(id=c[0], no=c[1], title=c[2], count=c[3], hue=c[4], blurb=c[5], cover=c[6])

# Artworks - from the drawing collection in frontend/public/art
arts = [
    # Himalayan Landscapes
    ("a1", "Machhapuchhre, First Light", "2024", "Watercolour on cotton rag", "90 × 60 cm", "himalaya", 218, 0.7, True, 1800, "IN_SALE", "The fishtail summit emerging from the cold blue of dawn.", "/art/drawing-09.jpg", ""),
    ("a2", "Monsoon Valley", "2023", "Watercolour on rag", "60 × 45 cm", "himalaya", 210, 1.33, False, 1100, "IN_SALE", "Clouds rolling over the terraces after the rain.", "/art/drawing-07.jpg", ""),
    ("a3", "Annapurna Sanctuary", "2023", "Watercolour on cotton rag", "100 × 56 cm", "himalaya", 224, 0.56, True, 2200, "IN_SALE", "A panorama held in one continuous wet wash.", "/art/drawing-08.jpg", ""),

    # Cultural Heritage
    ("a4", "The Lama's Hands", "2023", "Watercolour & graphite", "40 × 50 cm", "culture", 42, 1.28, True, 650, "IN_SALE", "A study of stillness — beads, knuckles, ninety winters.", "/art/drawing-03.jpg", ""),
    ("a5", "Kumari at Dashain", "2023", "Watercolour on rag", "55 × 40 cm", "culture", 28, 1.2, False, 980, "IN_SALE", "The living goddess in ceremonial red.", "/art/drawing-04.jpg", ""),
    ("a6", "Indra Jatra, Dusk", "2024", "Watercolour on cotton rag", "76 × 56 cm", "culture", 26, 0.78, True, 1200, "IN_SALE", "Masked dancers under the last copper light of the festival square.", "/art/drawing-05.jpg", ""),

    # Portrait Studies
    ("a7", "Woman of Mustang", "2023", "Watercolour & graphite", "42 × 56 cm", "portrait", 38, 0.75, True, 850, "IN_SALE", "Coral, turquoise and a gaze that has crossed the high desert.", "/art/drawing-02.jpg", ""),
    ("a8", "Sherpa Elder", "2024", "Watercolour on cotton rag", "48 × 38 cm", "portrait", 45, 1.18, False, 920, "IN_SALE", "Weathered by wind and time.", "/art/drawing-18.jpg", ""),
    ("a9", "Child of Khumbu", "2023", "Watercolour & graphite", "35 × 40 cm", "portrait", 36, 0.88, False, 580, "IN_SALE", "Laughter above the tree line.", "/art/drawing-06.jpg", ""),

    # Wildlife Series
    ("a10", "Bengal Tiger, Bardiya", "2023", "Watercolour on rag", "70 × 50 cm", "wildlife", 92, 0.82, True, 1400, "IN_SALE", "Wet-in-wet stripes dissolving into the tall grass.", "/art/drawing-10.jpg", ""),
    ("a11", "Danphe in Snow", "2024", "Watercolour on rag", "38 × 46 cm", "wildlife", 200, 0.84, True, 720, "IN_SALE", "The Himalayan monal — iridescence built in transparent layers.", "/art/drawing-11.jpg", ""),
    ("a12", "River Otter, Karnali", "2022", "Watercolour sketch", "28 × 28 cm", "wildlife", 70, 1.0, False, 350, "IN_SALE", "A quick gesture — wet fur, wet paper, wet light.", "/art/drawing-12.jpg", ""),

    # Lifestyle Moments
    ("a13", "Tea Pickers, Ilam", "2022", "Watercolour on cotton rag", "64 × 48 cm", "lifestyle", 62, 1.18, True, 950, "IN_SALE", "Bent backs and baskets across the green terraces.", "/art/drawing-13.jpg", ""),
    ("a14", "Mountain Village", "2023", "Watercolour on cotton rag", "50 × 40 cm", "lifestyle", 58, 1.1, False, 800, "IN_SALE", "Traditional stone houses nestled in the hills.", "/art/drawing-14.jpg", ""),
    ("a15", "Farmer at Harvest", "2022", "Watercolour on rag", "45 × 35 cm", "lifestyle", 55, 1.15, False, 680, "IN_SALE", "Rice terraces at the golden hour.", "/art/drawing-15.jpg", ""),

    # Quick Sketches
    ("a16", "Boudhanath in Rain", "2024", "Watercolour sketch", "30 × 30 cm", "sketches", 34, 1.0, True, 380, "IN_SALE", "Fifteen minutes, one brush, the great stupa under monsoon.", "/art/drawing-16.jpg", ""),
    ("a17", "Sacred Stupa", "2024", "Watercolour sketch", "25 × 25 cm", "sketches", 32, 1.0, False, 320, "IN_SALE", "Morning light on the ancient stupa.", "/art/drawing-17.jpg", ""),
    ("a18", "Street Vendor", "2023", "Watercolour sketch", "20 × 25 cm", "sketches", 40, 0.8, False, 280, "IN_SALE", "Quick study at Asan Tole market.", "/art/drawing-01.jpg", ""),
]
for a in arts:
    Artwork.objects.create(id=a[0], title=a[1], year=a[2], medium=a[3], size=a[4], collection_id=a[5], hue=a[6], ratio=a[7], featured=a[8], price=a[9], status=a[10], note=a[11], image=a[12], video=a[13])

# Process
steps = [
    ("01", "The Paper", 40, "Every painting begins with cold-pressed cotton rag, torn by hand and stretched the night before. The tooth and weight of the paper decide how the water will pool, bleed and settle."),
    ("02", "Wet on Wet", 28, "The paper is soaked and pigment is dropped into the wet surface — colours bloom, merge and push into one another with a life of their own. This wet-on-wet technique creates the soft, atmospheric washes that no dry brush can imitate. Timing is everything: too early and the colour vanishes, too late and hard edges appear."),
    ("03", "Building Light", 52, "Once the first wash dries, transparent glazes are layered one over another. The light is never painted — it is the white of the paper, carefully protected. Each new layer deepens tone while preserving luminosity beneath."),
    ("04", "The Detail", 36, "Only at the end, with a near-dry brush, do the eyes, the stitch, the single blade of grass arrive. Restraint is the whole discipline — knowing when to stop is what separates watercolour from every other medium."),
]
for s in steps:
    ProcessStep.objects.create(no=s[0], title=s[1], hue=s[2], text=s[3])

# Testimonials
testis = [
    ("Kobit paints water with water. Standing before the Machhapuchhre piece, I felt the cold of that dawn on my own skin.", "Aruna Rana", "Curator, Kathmandu Contemporary"),
    ("A self-taught mastery that institutions spend lifetimes chasing. The restraint is what undoes you — he knows exactly what to leave as paper.", "Daniel Hofmann", "Collector, Zürich"),
    ("The portraits do not flatter; they remember. Each face carries the altitude it was painted at.", "Sushila Pradhan", "Editor, Himal Review"),
]
for t in testis:
    Testimonial.objects.create(quote=t[0], who=t[1], role=t[2])

# Site Media
SiteMedia.objects.create(key="hero_image", value="/assets/auth-brushes.png", label="Hero Background Image")
SiteMedia.objects.create(key="video_src", value="/assets/1733206571917552.mov", label="Studio Video Source")
SiteMedia.objects.create(key="video_poster", value="/assets/IMG_9195.jpeg", label="Studio Video Poster Image")

# Commission Pricing
pricing = CommissionPricing.objects.create()
tiers = [
    ("Portrait (A3)", 15000, "Watercolour portrait on cotton rag, A3 size, framed", 1),
    ("Landscape (A2)", 25000, "Watercolour landscape on cotton rag, A2 size, framed", 2),
    ("Wildlife (A2)", 28000, "Watercolour wildlife on cotton rag, A2 size, framed", 3),
    ("Custom Size", 0, "Price varies by size, complexity, and framing", 4),
]
for t in tiers:
    CommissionTier.objects.create(pricing=pricing, label=t[0], price=t[1], description=t[2], order=t[3])

print("Seeded successfully with all assets!")