from django.db import models
from backend.collections.models import Collection
import uuid


class Artwork(models.Model):
    STATUS_CHOICES = [
        ("IN_SALE", "In Sale"),
        ("SOLD_OUT", "Sold Out"),
    ]

    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=200)
    year = models.CharField(max_length=10)
    medium = models.CharField(max_length=100)
    size = models.CharField(max_length=100, blank=True, default="")
    collection = models.ForeignKey(Collection, on_delete=models.CASCADE, related_name="artworks")
    hue = models.IntegerField(default=0)
    ratio = models.FloatField(default=1.0)
    featured = models.BooleanField(default=False)
    note = models.TextField(blank=True, default="")
    image = models.TextField(blank=True, default="")
    video = models.TextField(blank=True, default="")
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="IN_SALE")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "artworks"
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ProcessStep(models.Model):
    no = models.CharField(max_length=10, unique=True)
    title = models.CharField(max_length=100)
    hue = models.IntegerField(default=0)
    text = models.TextField(blank=True, default="")

    class Meta:
        db_table = "process_steps"
        ordering = ["no"]

    def __str__(self):
        return f"{self.no}: {self.title}"


class Testimonial(models.Model):
    quote = models.TextField()
    who = models.CharField(max_length=100)
    role = models.CharField(max_length=100, blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "testimonials"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.who}: {self.quote[:50]}"