from django.db import models
import uuid


class Collection(models.Model):
    id = models.CharField(max_length=50, primary_key=True, default=uuid.uuid4)
    no = models.CharField(max_length=10, unique=True)
    title = models.CharField(max_length=200)
    count = models.IntegerField(default=0)
    hue = models.IntegerField(default=0)
    blurb = models.TextField(blank=True, default="")
    cover = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "collections"
        ordering = ["no"]

    def __str__(self):
        return self.title