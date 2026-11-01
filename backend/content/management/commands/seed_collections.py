from django.core.management.base import BaseCommand
from content.models import Collection


class Command(BaseCommand):
    help = 'Seed collections from local data'

    def handle(self, *args, **options):
        collections_data = [
            {
                'slug': 'himalayan-faces',
                'title': 'Himalayan Faces',
                'blurb': 'Elders, children, ceremony.',
                'intro': 'Faces that have carried weather, work and festival. Painted slowly, in layers of grey and warm earth.',
                'cover_artwork': None,  # Will be set manually or via artwork slug lookup
                'order': 1,
            },
            {
                'slug': 'mountain-paths',
                'title': 'Mountain Paths',
                'blurb': 'Porters, villages, yaks and peaks.',
                'intro': 'Trails, caravans and hill houses under the fishtail peak. Every path leads somewhere high.',
                'cover_artwork': None,
                'order': 2,
            },
            {
                'slug': 'wild-and-small',
                'title': 'Wild & Small',
                'blurb': 'Sparrows, bison, small companions.',
                'intro': 'The quiet lives at the edges of the frame: birds, beasts and the soft animals of home.',
                'cover_artwork': None,
                'order': 3,
            },
            {
                'slug': 'portraits-of-youth',
                'title': 'Portraits of Youth',
                'blurb': 'Young faces, direct looks.',
                'intro': 'Musicians and thinkers, caught between a question and an answer.',
                'cover_artwork': None,
                'order': 4,
            },
        ]

        created = 0
        updated = 0

        for data in collections_data:
            slug = data.pop('slug')
            collection, created_flag = Collection.objects.update_or_create(
                slug=slug,
                defaults=data
            )
            if created_flag:
                created += 1
                self.stdout.write(self.style.SUCCESS(f'Created collection: {collection.title}'))
            else:
                updated += 1
                self.stdout.write(self.style.WARNING(f'Updated collection: {collection.title}'))

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded collections: {created} created, {updated} updated'
            )
        )
