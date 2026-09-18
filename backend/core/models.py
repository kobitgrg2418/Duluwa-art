from django.db import models


class SiteMedia(models.Model):
    key = models.CharField(max_length=100, unique=True)
    value = models.TextField(blank=True, default="")
    label = models.CharField(max_length=200, blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "site_media"
        ordering = ["key"]

    def __str__(self):
        return self.key


class CommissionPricing(models.Model):
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "commission_pricing"

    def __str__(self):
        return f"Commission Pricing ({self.updated_at})"


class CommissionTier(models.Model):
    pricing = models.ForeignKey(CommissionPricing, on_delete=models.CASCADE, related_name="tiers")
    label = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        db_table = "commission_tier"
        ordering = ["order"]

    def __str__(self):
        return f"{self.label} - ${self.price}"