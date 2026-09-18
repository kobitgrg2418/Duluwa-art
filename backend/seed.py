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
    ("culture", "01", "Nepalese Culture", 18, 28, "Festivals, prayer flags and the quiet rituals of the courtyards of Kathmandu.", "/assets/IMG_3838.jpeg"),
    ("portrait", "02", "Portraits", 24, 44, "Faces weathered by altitude and devotion — studies in patience and pigment.", "/assets/IMG_2873.jpeg"),
    ("himalaya", "03", "Himalayan Landscapes", 21, 220, "First light on snow, monsoon valleys, the long blue distance of the high passes.", "/assets/IMG_6277.jpeg"),
    ("wildlife", "04", "Wildlife", 16, 96, "The tiger, the danphe, the river otter — caught in a single held breath of water.", "/assets/IMG_0536.jpeg"),
    ("lifestyle", "05", "Traditional Lifestyle", 19, 64, "Tea fields, terraced farms and the slow choreography of mountain daily life.", "/assets/IMG_0645.jpg"),
    ("sketches", "06", "Watercolour Sketches", 32, 36, "Loose, fast, unguarded — the notebook where every finished work begins.", "/assets/IMG_3956.jpeg"),
    ("still-life", "07", "Still Life", 14, 160, "Fruit, flowers and familiar objects — stillness observed until it speaks in colour and shadow.", "/assets/IMG_3957.jpeg"),
]
for c in cols:
    Collection.objects.create(id=c[0], no=c[1], title=c[2], count=c[3], hue=c[4], blurb=c[5], cover=c[6])

# Artworks - using actual asset files
arts = [
    # Featured Artworks (featured=True)
    ("a1", "Indra Jatra, Dusk", "2024", "Watercolour on cotton rag", "76 × 56 cm", "culture", 26, 0.78, True, 1200, "IN_SALE", "Masked dancers under the last copper light of the festival square.", "/assets/IMG_3838.jpeg", ""),
    ("a2", "The Lama's Hands", "2023", "Watercolour & graphite", "40 × 50 cm", "portrait", 42, 1.28, True, 650, "IN_SALE", "A study of stillness — beads, knuckles, ninety winters.", "/assets/IMG_20230519_0002.jpeg", ""),
    ("a3", "Machhapuchhre, First Light", "2024", "Watercolour on cotton rag", "90 × 60 cm", "himalaya", 218, 0.7, True, 1800, "IN_SALE", "The fishtail summit emerging from the cold blue of dawn.", "/assets/IMG_6277.jpeg", ""),
    ("a4", "Bengal Tiger, Bardiya", "2023", "Watercolour on rag", "70 × 50 cm", "wildlife", 92, 0.82, True, 1400, "IN_SALE", "Wet-in-wet stripes dissolving into the tall grass.", "/assets/IMG_0536.jpeg", ""),
    ("a5", "Tea Pickers, Ilam", "2022", "Watercolour on cotton rag", "64 × 48 cm", "lifestyle", 62, 1.18, True, 950, "IN_SALE", "Bent backs and baskets across the green terraces.", "/assets/IMG_0645.jpg", ""),
    ("a6", "Boudhanath in Rain", "2024", "Watercolour sketch", "30 × 30 cm", "sketches", 34, 1.0, True, 380, "IN_SALE", "Fifteen minutes, one brush, the great stupa under monsoon.", "/assets/IMG_0798.jpeg", ""),
    ("a7", "Woman of Mustang", "2023", "Watercolour & graphite", "42 × 56 cm", "portrait", 38, 0.75, True, 850, "IN_SALE", "Coral, turquoise and a gaze that has crossed the high desert.", "/assets/IMG_2873.jpeg", ""),
    ("a8", "Danphe in Snow", "2024", "Watercolour on rag", "38 × 46 cm", "wildlife", 200, 0.84, True, 720, "IN_SALE", "The Himalayan monal — iridescence built in transparent layers.", "/assets/IMG_2875.jpeg", ""),
    
    # Culture Collection
    ("a9", "Prayer Flags, Langtang", "2022", "Watercolour on cotton rag", "80 × 54 cm", "culture", 30, 0.74, False, 1100, "IN_SALE", "Lungta scattering colour across a thin mountain wind.", "/assets/IMG_2877.jpeg", ""),
    ("a19", "Festival Procession", "2024", "Watercolour on cotton rag", "70 × 50 cm", "culture", 25, 0.71, False, 1300, "IN_SALE", "Colors of Indra Jatra in the streets.", "/assets/IMG_0286.jpg", ""),
    ("a21", "Kumari at Dashain", "2023", "Watercolour on rag", "55 × 40 cm", "culture", 28, 1.2, False, 980, "IN_SALE", "The living goddess in ceremonial red.", "/assets/IMG_20230521_0003.jpeg", ""),
    
    # Himalaya Collection
    ("a10", "Annapurna Sanctuary", "2023", "Watercolour on rag", "100 × 56 cm", "himalaya", 224, 0.56, False, 2200, "IN_SALE", "A panorama held in one continuous wet wash.", "/assets/IMG_3246.jpeg", ""),
    ("a15", "Monsoon Landscape", "2023", "Watercolour on rag", "60 × 45 cm", "himalaya", 210, 0.85, False, 1100, "IN_SALE", "Clouds rolling over the valley.", "/assets/IMG_9195.jpeg", ""),
    ("a22", "Everest Base Camp", "2024", "Watercolour on cotton rag", "75 × 50 cm", "himalaya", 215, 0.67, False, 1650, "IN_SALE", "Dawn at 5,364 meters — the world held in ice.", "/assets/IMG_3246.jpeg", ""),
    
    # Wildlife Collection
    ("a16", "Tiger Study", "2022", "Watercolour & graphite", "35 × 45 cm", "wildlife", 88, 0.78, False, 750, "IN_SALE", "Graphite study for the Bardiya tiger.", "/assets/A16277BC-5E32-4E2D-B061-6F25C3935CED.PNG", ""),
    ("a17", "Wild Elephant", "2024", "Watercolour on cotton rag", "55 × 40 cm", "wildlife", 95, 1.1, False, 900, "IN_SALE", "Gentle giant in the river.", "/assets/CF57082C-0CAD-4BBE-AA1B-090556A12968.JPG", ""),
    ("a23", "Red Panda in Fog", "2023", "Watercolour on rag", "40 × 40 cm", "wildlife", 10, 1.0, False, 820, "IN_SALE", "The firefox of the eastern hills.", "/assets/667D8324-F724-4A89-84B6-F923E92CD51D.JPEG", ""),
    ("a24", "Snow Leopard", "2024", "Watercolour on cotton rag", "60 × 45 cm", "wildlife", 190, 0.75, False, 1550, "SOLD_OUT", "The ghost cat of the high peaks.", "/assets/A16277BC-5E32-4E2D-B061-6F25C3935CED_1780587105686.PNG", ""),
    
    # Lifestyle Collection
    ("a11", "Potter of Bhaktapur", "2024", "Watercolour sketch", "32 × 40 cm", "lifestyle", 48, 0.8, False, 420, "IN_SALE", "Clay, wheel, and hands that have never hurried.", "/assets/IMG_3956.jpeg", ""),
    ("a13", "Mountain Village", "2023", "Watercolour on cotton rag", "50 × 40 cm", "lifestyle", 58, 1.1, False, 800, "IN_SALE", "Traditional stone houses nestled in the hills.", "/assets/IMG_8651.jpg", ""),
    ("a25", "Farmer at Harvest", "2022", "Watercolour on rag", "45 × 35 cm", "lifestyle", 55, 1.15, False, 680, "IN_SALE", "Rice terraces at the golden hour.", "/assets/IMG_9965.jpg", ""),
    
    # Sketches Collection
    ("a12", "River Otter, Karnali", "2022", "Watercolour sketch", "28 × 28 cm", "sketches", 70, 1.0, False, 350, "IN_SALE", "A quick gesture — wet fur, wet paper, wet light.", "/assets/IMG_3957.jpeg", ""),
    ("a14", "Sacred Stupa", "2024", "Watercolour sketch", "25 × 25 cm", "sketches", 32, 1.0, False, 320, "IN_SALE", "Morning light on the ancient stupa.", "/assets/IMG_3956_1780590402771.jpeg", ""),
    ("a26", "Street Vendor", "2023", "Watercolour sketch", "20 × 25 cm", "sketches", 40, 0.8, False, 280, "IN_SALE", "Quick study at Asan Tole market.", "/assets/IMG_3956_1780591903077.jpeg", ""),
    ("a27", "Mountain Path", "2024", "Watercolour sketch", "22 × 30 cm", "sketches", 220, 0.73, False, 300, "IN_SALE", "Trail to Tengboche in fifteen minutes.", "/assets/IMG_3956_1780592186018.jpeg", ""),
    
    # Portrait Collection
    ("a18", "Portrait of a Monk", "2023", "Watercolour & graphite", "30 × 40 cm", "portrait", 40, 0.75, False, 600, "IN_SALE", "Eyes that have seen generations.", "/assets/667D8324-F724-4A89-84B6-F923E92CD51D_1780553377572.JPEG", ""),
    ("a28", "Sherpa Elder", "2024", "Watercolour on cotton rag", "48 × 38 cm", "portrait", 45, 1.18, False, 920, "IN_SALE", "Weathered by wind and time.", "/assets/IMG_2873.jpeg", ""),
    ("a29", "Child of Khumbu", "2023", "Watercolour & graphite", "35 × 40 cm", "portrait", 36, 0.88, False, 580, "IN_SALE", "Laughter above the tree line.", "/assets/CF57082C-0CAD-4BBE-AA1B-090556A12968_1780587249024.JPG", ""),
    
    # Still Life Collection
    ("a20", "Still Life with Tea", "2023", "Watercolour on rag", "30 × 30 cm", "still-life", 155, 1.0, False, 450, "IN_SALE", "Traditional tea set in morning light.", "/assets/IMG_3957.jpeg", ""),
    ("a30", "Himalayan Flowers", "2024", "Watercolour on cotton rag", "35 × 25 cm", "still-life", 165, 1.4, False, 520, "IN_SALE", "Rhododendrons in a brass vessel.", "/assets/IMG_0286.jpg", ""),
    ("a31", "Prayer Beads", "2023", "Watercolour on rag", "25 × 25 cm", "still-life", 150, 1.0, False, 380, "IN_SALE", "Sandalwood mala on aged cotton.", "/assets/IMG_0798.jpeg", ""),
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