import io

from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import override_settings
from PIL import Image
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from . import models as m

import tempfile

TMP = tempfile.mkdtemp()


def png(color=(180, 60, 60), size=(300, 200)):
    b = io.BytesIO()
    Image.new('RGB', size, color).save(b, 'PNG')
    return SimpleUploadedFile('t.png', b.getvalue(), content_type='image/png')


@override_settings(MEDIA_ROOT=TMP, ALLOWED_HOSTS=['testserver'], REST_FRAMEWORK={
    **__import__('django.conf', fromlist=['settings']).settings.REST_FRAMEWORK, 'DEFAULT_THROTTLE_CLASSES': []})
class ApiTests(APITestCase):
    @classmethod
    def setUpTestData(cls):
        call_command('seed_duluwa', verbosity=0)
        cls.admin = get_user_model().objects.create_superuser('admin@123', '', 'admin123')

    def staff(self):
        tok, _ = Token.objects.get_or_create(user=self.admin)
        self.client.credentials(HTTP_AUTHORIZATION=f'Token {tok.key}')

    # ---- public reads
    def test_catalogue_and_filters(self):
        r = self.client.get('/api/artworks/')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(r.json()['count'], 18)
        first = r.json()['results'][0]
        for k in ('slug', 'renditions', 'blur_data_url', 'aspect', 'price_usd', 'orientation'):
            self.assertIn(k, first)
        self.assertEqual(self.client.get('/api/artworks/?type=print').json()['count'], 6)
        self.assertEqual(self.client.get('/api/artworks/?status=sold').json()['count'], 2)
        self.assertEqual(self.client.get('/api/artworks/?just_painted=true').json()['count'], 3)
        self.assertEqual(self.client.get('/api/artworks/?series=wild-and-small').json()['count'], 4)
        self.assertTrue(self.client.get('/api/artworks/?search=yak').json()['count'] >= 1)
        cheap = self.client.get('/api/artworks/?max_price=6000').json()['results']
        self.assertTrue(all(a['price_npr'] <= 6000 for a in cheap))
        d = self.client.get('/api/artworks/bison/').json()
        self.assertEqual(len(d['related']), 8)

    def test_home_site_artist_config(self):
        h = self.client.get('/api/home/').json()
        self.assertEqual(len(h['hero']['lines']), 4)
        self.assertEqual(h['shop']['originals']['count'], 10)
        self.assertEqual(h['shop']['prints']['count'], 6)
        self.assertEqual(len(h['hero']['layers']), 8)
        self.assertEqual(len(h['footer_fan']), 3)
        self.assertEqual(len(h['cta_panels']), 2)
        self.assertEqual(self.client.get('/api/site/').json()['instagram_url'], 'https://www.instagram.com/duluwa_art/')
        self.assertEqual(len(self.client.get('/api/artist/').json()['stages']), 5)
        self.assertEqual(len(self.client.get('/api/collections/').json()), 4)
        self.assertEqual(self.client.get('/api/collections/mountain-paths/').json()['artwork_count'], 5)
        self.assertEqual(len(self.client.get('/api/shop-config/').json()['print_sizes']), 3)
        self.assertEqual(self.client.get('/api/journal/').json()['count'], 3)

    def test_unpublished_hidden(self):
        m.Artwork.objects.filter(slug='bison').update(is_published=False)
        self.assertEqual(self.client.get('/api/artworks/bison/').status_code, 404)

    # ---- public writes
    def test_order_prices_are_server_side_and_originals_sell(self):
        body = {'name': 'T', 'email': 'a@b.co', 'phone': '1', 'country': 'NP', 'address': 'x', 'city': 'y', 'payment_method': 'esewa',
                'shipping_method': 'standard', 'items': [{'artwork': 'bison', 'qty': 2, 'size_index': 1, 'paper_index': 1},
                                                         {'artwork': 'the-warm-bowl', 'qty': 5}]}
        r = self.client.post('/api/orders/', body, format='json')
        self.assertEqual(r.status_code, 201, r.content)
        out = r.json()
        # bison print: 6500*1.7+1500 = 12550 -> rounded to 12600 ; original 62000 (qty forced to 1)
        self.assertEqual(out['subtotal_npr'], 2 * 12600 + 62000)
        self.assertEqual(out['total_npr'], out['subtotal_npr'] + 2500)
        order = m.Order.objects.get(order_id=out['order_id'])
        order.status = 'paid'
        order.save()
        self.assertEqual(m.Artwork.objects.get(slug='the-warm-bowl').status, 'sold')
        again = self.client.post('/api/orders/', body, format='json')
        self.assertEqual(again.status_code, 400)  # already sold
        look = self.client.get(f"/api/orders/{out['order_id']}/?email=a@b.co")
        self.assertEqual(look.status_code, 200)
        self.assertEqual(self.client.get(f"/api/orders/{out['order_id']}/?email=x@y.co").status_code, 404)

    def test_commission_with_references_newsletter_contact(self):
        r = self.client.post('/api/commissions/', {'name': 'N', 'email': 'n@x.co', 'size': 'Medium', 'subject': 'Portrait', 'budget': 'x',
                                                   'similar': 'smoke-breath', 'references': [png(), png()]}, format='multipart')
        self.assertEqual(r.status_code, 201, r.content)
        self.assertEqual(m.CommissionReference.objects.count(), 2)
        self.assertEqual(self.client.post('/api/newsletter/', {'email': 'A@B.co'}, format='json').status_code, 201)
        self.assertEqual(self.client.post('/api/newsletter/', {'email': 'a@b.co'}, format='json').status_code, 201)
        self.assertEqual(m.NewsletterSubscriber.objects.count(), 1)
        self.assertEqual(self.client.post('/api/contact/', {'name': 'N', 'email': 'n@x.co', 'message': 'hi'}, format='json').status_code, 201)

    # ---- staff
    def test_staff_endpoints_require_auth(self):
        self.assertIn(self.client.get('/api/manage/artworks/').status_code, (401, 403))
        self.assertIn(self.client.patch('/api/manage/home/', {'hero_lines': 'x'}, format='json').status_code, (401, 403))

    def test_token_login_and_cms_editing(self):
        t = self.client.post('/api/auth/token/', {'username': 'admin@123', 'password': 'admin123'}, format='json')
        self.assertEqual(t.status_code, 200)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + t.json()['token'])

        # upload a new painting
        col = m.Collection.objects.first()
        r = self.client.post('/api/manage/artworks/', {'title': 'Brand New', 'series': col.pk, 'price_npr': 9999, 'category': 'portrait',
                                                       'type': 'original', 'image': png(size=(800, 1000))}, format='multipart')
        self.assertEqual(r.status_code, 201, r.content)
        pub = self.client.get('/api/artworks/brand-new/').json()
        self.assertEqual(pub['orientation'], 'portrait')
        self.assertTrue(pub['renditions']['480'].endswith('.webp'))

        # edit price + replace image
        r = self.client.patch('/api/manage/artworks/%d/' % r.json()['id'], {'price_npr': 12345, 'image': png(size=(1200, 800))}, format='multipart')
        self.assertEqual(r.status_code, 200)
        self.assertEqual(self.client.get('/api/artworks/brand-new/').json()['orientation'], 'landscape')

        # edit the home page, site settings and artist
        self.assertEqual(self.client.patch('/api/manage/home/', {'hero_lines': 'One\nTwo'}, format='json').status_code, 200)
        self.assertEqual(self.client.get('/api/home/').json()['hero']['lines'], ['One', 'Two'])
        self.assertEqual(self.client.patch('/api/manage/site-settings/', {'tagline': 'New tagline'}, format='json').status_code, 200)
        self.assertEqual(self.client.get('/api/site/').json()['tagline'], 'New tagline')
        self.assertEqual(self.client.patch('/api/manage/artist/', {'headline': 'Hi'}, format='json').status_code, 200)

        # sections: journal, marquee, hero layer, orders list
        self.assertEqual(self.client.post('/api/manage/journal/', {'title': 'A post', 'body': 'p1\n\np2'}, format='json').status_code, 201)
        self.assertEqual(self.client.get('/api/journal/a-post/').json()['paragraphs'], ['p1', 'p2'])
        self.assertEqual(self.client.post('/api/manage/marquee/', {'text': 'New strip item'}, format='json').status_code, 201)
        self.assertEqual(self.client.get('/api/manage/orders/').status_code, 200)
        self.assertEqual(self.client.get('/api/manage/commissions/').status_code, 200)
        self.assertEqual(self.client.delete('/api/manage/marquee/%d/' % m.MarqueeItem.objects.get(text='New strip item').pk).status_code, 204)
