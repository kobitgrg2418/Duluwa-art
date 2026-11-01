"""Creates (or resets) the CMS superuser. Defaults to the demo credentials; override with flags or env vars."""
import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or update the CMS superuser.'

    def add_arguments(self, p):
        p.add_argument('--username', default=os.getenv('CMS_ADMIN_USER', 'admin@123'))
        p.add_argument('--password', default=os.getenv('CMS_ADMIN_PASSWORD', 'admin123'))
        p.add_argument('--email', default=os.getenv('CMS_ADMIN_EMAIL', ''))

    def handle(self, *a, username, password, email, **kw):
        User = get_user_model()
        u, created = User.objects.get_or_create(username=username, defaults={'email': email})
        u.is_staff = u.is_superuser = u.is_active = True
        u.set_password(password)
        u.save()
        self.stdout.write(self.style.SUCCESS(f'{"Created" if created else "Updated"} superuser "{username}"'))
