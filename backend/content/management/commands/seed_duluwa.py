"""Loads the starter content (18 paintings, collections, home page, artist, journal, shop options). Safe to re-run."""
from pathlib import Path

from django.conf import settings
from django.core.files import File
from django.core.management.base import BaseCommand

from content import models as m

SEED = Path(settings.BASE_DIR) / 'seed_images'

COLLECTIONS = [
    ('himalayan-faces', 'Himalayan Faces', 'Elders, children, ceremony.', 'Faces that have carried weather, work and festival. Painted slowly, in layers of grey and warm earth.', 'ceremonial-headdress'),
    ('mountain-paths', 'Mountain Paths', 'Porters, villages, yaks and peaks.', 'Trails, caravans and hill houses under the fishtail peak. Every path leads somewhere high.', 'yak-caravan'),
    ('wild-and-small', 'Wild & Small', 'Sparrows, bison, small companions.', 'The quiet lives at the edges of the frame: birds, beasts and the soft animals of home.', 'bison'),
    ('portraits-of-youth', 'Portraits of Youth', 'Young faces, direct looks.', 'Musicians and thinkers, caught between a question and an answer.', 'young-woman-earrings'),
]

# slug, file, title, series, category, w, h, year, type, npr, status, 1of1, just_painted, description, tags
ARTWORKS = [
    ('porter-in-the-mist', '10881B7E-C6A1-44E2-8932-59B8F6C3C18A.JPEG', 'Porter in the Mist', 'mountain-paths', 'landscape', 40, 30, 2024, 'original', 48000, 'available', False, False, 'A porter and his doko disappear into a forest that breathes fog. The path is long; the load is light only in the painting.', 'forest,porter,mist'),
    ('the-warm-bowl', 'A16277BC-5E32-4E2D-B061-6F25C3935CED.jpg', 'The Warm Bowl', 'himalayan-faces', 'portrait', 30, 40, 2024, 'original', 62000, 'available', False, False, 'A child drinks from a bowl held in both hands. Blue wool, grey wash, and one bright, unguarded eye.', 'child,portrait'),
    ('two-sparrows-wet-ink', 'IMG_20230519_0002.jpeg', 'Two Sparrows, Wet Ink', 'wild-and-small', 'wildlife', 40, 30, 2023, 'print', 4500, 'available', False, False, 'Two sparrows on a bare branch, the paper spattered with rain and ink.', 'sparrow,birds,ink'),
    ('the-guitarist', 'IMG_20230521_0003.jpeg', 'The Guitarist', 'portraits-of-youth', 'portrait', 30, 40, 2023, 'print', 5500, 'available', False, False, 'A guitarist emerging from a storm of grey wash, the strings caught in white paper.', 'music,grey wash'),
    ('village-under-machhapuchhre', 'IMG_20230610_0005.jpeg', 'Village under Machhapuchhre', 'mountain-paths', 'landscape', 40, 30, 2023, 'original', 85000, 'available', False, False, 'A hill house, a haystack, and the fishtail peak watching over both.', 'village,machhapuchhre,mountain'),
    ('the-headdress', 'IMG_20261005_0001.jpeg', 'The Headdress', 'himalayan-faces', 'portrait', 30, 45, 2026, 'original', 110000, 'available', True, False, 'A child in ceremonial gold and beads, eyes lowered. Quiet before the festival begins.', 'child,ceremony,gold'),
    ('two-guinea-pigs', 'IMG_20261005_0002.jpeg', 'Two Guinea Pigs', 'wild-and-small', 'wildlife', 40, 30, 2026, 'print', 3500, 'available', False, False, 'Soft shapes, soft edges. Two small companions dissolving into a cloud of wash.', 'animals,soft'),
    ('smoke-breath', 'IMG_20261006_0001.jpg', 'Smoke Breath', 'himalayan-faces', 'portrait', 30, 45, 2026, 'original', 72000, 'sold', False, False, 'An elder in a dhaka topi exhales smoke into cold air. The original has found its home.', 'elder,dhaka topi'),
    ('the-bearded-elder', 'IMG_20261010_0001.jpg', 'The Bearded Elder', 'himalayan-faces', 'portrait', 40, 32, 2026, 'original', 68000, 'available', False, False, 'A weathered face under a soft hat, every year of wind held in the beard.', 'elder,beard'),
    ('yak-caravan-on-snow', 'IMG_20261010_0002.jpg', 'Yak Caravan on Snow', 'mountain-paths', 'landscape', 40, 29, 2026, 'original', 95000, 'available', False, False, 'A caravan of yaks crosses a snowfield beneath giant peaks. Cold light, slow steps.', 'yak,snow,caravan'),
    ('lighting-up', 'IMG_20261010_0003.jpg', 'Lighting Up', 'himalayan-faces', 'portrait', 40, 36, 2026, 'original', 78000, 'available', False, False, 'A patterned topi, closed eyes, and a small flame cupped in worn hands.', 'elder,dhaka topi,hands'),
    ('towards-the-fishtail', 'IMG_20261010_0004.jpg', 'Towards the Fishtail', 'mountain-paths', 'landscape', 40, 33, 2026, 'original', 88000, 'available', False, True, 'Travellers cross an autumn meadow toward Machhapuchhre, tiny against the ridge.', 'travellers,machhapuchhre,meadow'),
    ('sparrows-in-blue-blossom', 'IMG_20261010_0005.jpg', 'Sparrows in Blue Blossom', 'wild-and-small', 'wildlife', 40, 35, 2026, 'original', 52000, 'sold', False, False, 'Three sparrows huddle close among blue blossoms. Warmth made of feathers.', 'sparrow,blossom'),
    ('hut-and-stone-steps', 'IMG_20261010_0006.jpg', 'Hut and Stone Steps', 'mountain-paths', 'landscape', 40, 29, 2026, 'print', 5000, 'available', False, False, 'A tin-roofed hut at the end of a stone path, the valley opening behind it.', 'hut,valley,steps'),
    ('bison', 'IMG_20261010_0007.jpg', 'Bison', 'wild-and-small', 'wildlife', 30, 43, 2026, 'print', 6500, 'available', False, False, 'A bison head rising from sepia wash, horns sharp against a pale sky.', 'bison,horns'),
    ('hands-at-the-collar', 'IMG_20261010_0008.jpg', 'Hands at the Collar', 'portraits-of-youth', 'portrait', 30, 49, 2026, 'original', 74000, 'available', False, True, 'A young woman, hands clasped at her collar, a direct look and a dark, deep ground.', 'young woman,portrait'),
    ('red-earrings', 'IMG_20261010_0009.jpg', 'Red Earrings', 'portraits-of-youth', 'portrait', 40, 37, 2026, 'original', 82000, 'available', False, True, 'Hair across her face and heavy earrings. She looks away, thinking about something far.', 'young woman,earrings'),
    ('smoke-breath-ii', 'IMG_4559.jpg', 'Smoke Breath II', 'himalayan-faces', 'portrait', 30, 48, 2026, 'print', 7500, 'available', False, False, "A second pass at the elder's breath on the cold air, offered as a signed print.", 'elder,print'),
]

JOURNAL = [
    ('painting-the-porter', 'Painting the porter', '2026-10-12', 'Process', 'How a single figure and a lot of fog became a painting about weight and patience.', 'porter-in-the-mist',
     "The porter is the smallest thing in the painting and the reason for it. Everything else, the trees, the mist, the path, exists to make him look as heavy and as light as he feels.\n\nI started with wet paper and let the greens bleed into grey. The figure came last, a few dark strokes, a doko, the lean forward that every porter on a Himalayan trail knows.\n\nWatercolor does not forgive hesitation. This one took about forty minutes, and three days of looking before I knew it was finished."),
    ('faces-of-the-hills', 'Faces of the hills', '2026-09-28', 'Series', 'Why the elders keep ending up in my paintings, and what the paper remembers.', 'the-bearded-elder',
     "An old face is a map. I like to paint the creases first and the eyes last, so that when the eyes arrive the whole painting looks back.\n\nThe dhaka topi, the smoke, the hands: small details that carry whole afternoons. I try not to explain them. I try to get the grey right."),
    ('caring-for-watercolor', 'Caring for a watercolor at home', '2026-09-10', 'Care', 'Light, glass, humidity and a few small habits that keep paper and pigment alive for decades.', 'village-under-machhapuchhre',
     "Watercolor is light-sensitive. Hang it away from direct sun, and if you can, behind UV-filtering glass.\n\nLet the paper breathe: use a mat so the painting never touches the glass, and avoid bathrooms and kitchens.\n\nDust the frame, not the paper. If something ever looks wrong, write to me before you touch it."),
]

STAGES = [
    ('Sketch', 'A few light pencil lines to place the face, the horizon, the weight. Nothing more. Watercolor needs room to breathe.'),
    ('First wash', 'Clean water, then the palest pigment, pushed across wet paper. Edges dissolve. This is where the mood is decided.'),
    ('Layers', 'Once the paper dries, darker glazes go on, one over another, until shadows have depth and the light has somewhere to live.'),
    ('Details', 'The eyes, the hands, the fabric. Small brushes, steady breath, and the discipline to stop before it is too much.'),
    ('Signature', 'A red signature in the lower corner, the last mark. After that, the painting belongs to whoever hangs it.'),
]

LAYERS = [  # slug, left, width, start, speed, mobile
    ('the-warm-bowl', 6, 19, 52, 1.0, True), ('village-under-machhapuchhre', 62, 27, 88, 1.4, True),
    ('the-bearded-elder', 33, 22, 120, 0.7, False), ('the-headdress', 78, 15, 150, 1.1, True),
    ('two-sparrows-wet-ink', 3, 25, 175, 1.6, False), ('bison', 47, 16, 200, 0.9, True),
    ('hut-and-stone-steps', 16, 26, 228, 1.25, False), ('hands-at-the-collar', 70, 14, 255, 0.8, True),
]


class Command(BaseCommand):
    help = 'Load starter content for the Duluwa Art site (idempotent).'

    def handle(self, *a, **kw):
        cfg = m.SiteSettings.load()
        cfg.save()

        for i, t in enumerate(['Free worldwide shipping on originals', 'Original watercolors', 'Signed & certified', 'Painted in Nepal', 'Prints on archival paper']):
            m.MarqueeItem.objects.get_or_create(text=t, defaults={'order': i})
        for i, (l, h, p) in enumerate([('Shop', '/shop', 'menu'), ('Collections', '/collections', 'menu'), ('Artist', '/artist', 'menu'), ('Commission', '/commission', 'menu'), ('Journal', '/journal', 'menu'),
                                       ('Shop', '/shop', 'footer'), ('Collections', '/collections', 'footer'), ('Artist', '/artist', 'footer'), ('Commission', '/commission', 'footer'), ('Contact', '#contact', 'footer')]):
            m.MenuLink.objects.get_or_create(label=l, placement=p, defaults={'href': h, 'order': i})

        if not m.PrintSize.objects.exists():
            for i, (l, mult) in enumerate([('A4 · 21 × 30 cm', 1), ('A3 · 30 × 42 cm', 1.7), ('A2 · 42 × 59 cm', 2.8)]):
                m.PrintSize.objects.create(label=l, multiplier=mult, order=i)
        if not m.PrintPaper.objects.exists():
            for i, (l, add) in enumerate([('Matte cotton', 0), ('Archival rag', 1500)]):
                m.PrintPaper.objects.create(label=l, add_npr=add, order=i)
        for i, (k, l, d, p) in enumerate([('standard', 'Tracked standard', '10–16 days', 2500), ('express', 'Express courier', '4–7 days', 6500)]):
            m.ShippingMethod.objects.get_or_create(key=k, defaults={'label': l, 'days': d, 'price_npr': p, 'order': i})

        cols = {}
        for i, (slug, title, blurb, intro, _cover) in enumerate(COLLECTIONS):
            cols[slug], _ = m.Collection.objects.get_or_create(slug=slug, defaults={'title': title, 'blurb': blurb, 'intro': intro, 'order': i})

        arts = {}
        for i, row in enumerate(ARTWORKS):
            slug, file, title, series, cat, w, h, year, typ, npr, status, one, jp, desc, tags = row
            a = m.Artwork.objects.filter(slug=slug).first()
            if not a:
                a = m.Artwork(slug=slug, title=title, series=cols[series], category=cat, width_cm=w, height_cm=h, year=year, type=typ,
                              price_npr=npr, status=status, one_of_one=one, just_painted=jp, description=desc, tags=tags, order=i)
                with open(SEED / file, 'rb') as fh:
                    a.image.save(file.rsplit('.', 1)[0].lower() + '.jpg' if False else file, File(fh), save=False)
                a.save()
                self.stdout.write(f'  + {title}')
            arts[slug] = a
        cover_by_slug = {'himalayan-faces': 'the-headdress', 'mountain-paths': 'yak-caravan-on-snow', 'wild-and-small': 'bison', 'portraits-of-youth': 'red-earrings'}
        for slug, aslug in cover_by_slug.items():
            c = cols[slug]
            if not c.cover_artwork:
                c.cover_artwork = arts[aslug]
                c.save()

        home = m.HomePage.load()
        if not home.hero_finale_artwork:
            home.hero_finale_artwork = arts['yak-caravan-on-snow']
            home.care_tall_artwork = arts['hands-at-the-collar']
            home.care_wide_artwork = arts['village-under-machhapuchhre']
            home.quote_artwork = arts['yak-caravan-on-snow']
            home.save()
        if not home.hero_layers.exists():
            for i, (slug, left, w, start, speed, mob) in enumerate(LAYERS):
                m.HeroLayer.objects.create(home=home, artwork=arts[slug], left_vw=left, width_vw=w, start_vh=start, speed=speed, show_on_mobile=mob, order=i)
        if not home.info_tiles.exists():
            for i, (l, v, s) in enumerate([('Shipping', 'Worldwide, tracked', 'Framed or rolled, fully insured.'), ('Payment', 'eSewa · Khalti · Card', 'Or bank transfer.'),
                                           ('Authenticity', 'Signed original + certificate', 'Each piece is 1 of 1.'), ('WhatsApp / Email', 'hello@duluwa.art', 'Replies within a day.')]):
                m.InfoTile.objects.create(home=home, label=l, value=v, sub=s, order=i)
        if not home.cta_panels.exists():
            m.CTAPanel.objects.create(home=home, title='Get a print', note='Archival paper, signed & numbered.', button_label='Shop prints', href='/shop?type=print', background='#111111', order=0)
            m.CTAPanel.objects.create(home=home, title='Commission yours', note='A face, a path, a mountain of your own.', button_label='Start a commission', href='/commission', background='#0b0b0b', order=1)
        if not home.fan_cards.exists():
            for i, slug in enumerate(['the-headdress', 'yak-caravan-on-snow', 'red-earrings']):
                m.FooterFanCard.objects.create(home=home, artwork=arts[slug], order=i)

        artist = m.ArtistProfile.load()
        if not artist.bio:
            artist.bio = ("I am a watercolor artist from Pokhara, Nepal, working on cotton paper with a limited palette and a lot of water. My subjects are the faces of elders and children, porters and yaks on high trails, the small wild lives at the edge of villages, and the fishtail peak that watches over all of it.\n\n"
                          "Watercolor is honest. It shows hesitation, and it rewards trust. Each painting is a conversation between pigment, paper and the minute I decide to stop.\n\n"
                          "Every original is signed in red and shipped with a certificate. Prints are made in small, numbered editions on archival paper.")
            artist.portrait_artwork = arts['the-warm-bowl']
            artist.process_artwork = arts['the-headdress']
            artist.save()
        if not artist.stages.exists():
            for i, (t, d) in enumerate(STAGES):
                m.ProcessStage.objects.create(artist=artist, title=t, description=d, order=i)

        for slug, title, date, tag, excerpt, cover, body in JOURNAL:
            m.JournalPost.objects.get_or_create(slug=slug, defaults={'title': title, 'date': date, 'tag': tag, 'excerpt': excerpt, 'body': body, 'cover_artwork': arts[cover]})

        self.stdout.write(self.style.SUCCESS('Seed complete.'))
