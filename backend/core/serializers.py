from rest_framework import serializers
from core.models import CommissionPricing, CommissionTier, SiteMedia


class CommissionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTier
        fields = ["id", "label", "price", "description", "order"]


class CommissionPricingSerializer(serializers.ModelSerializer):
    tiers = CommissionTierSerializer(many=True, read_only=True)
    tier_data = CommissionTierSerializer(many=True, write_only=True, required=False, source="tiers")

    class Meta:
        model = CommissionPricing
        fields = ["id", "tiers", "tier_data", "updated_at"]

    def create(self, validated_data):
        tiers_data = validated_data.pop("tiers", [])
        pricing = CommissionPricing.objects.create(**validated_data)
        for i, tier_data in enumerate(tiers_data):
            CommissionTier.objects.create(pricing=pricing, order=i, **tier_data)
        return pricing

    def update(self, instance, validated_data):
        tiers_data = validated_data.pop("tiers", None)
        instance.save()
        if tiers_data is not None:
            instance.tiers.all().delete()
            for i, tier_data in enumerate(tiers_data):
                CommissionTier.objects.create(pricing=instance, order=i, **tier_data)
        return instance


class SiteMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteMedia
        fields = ["key", "value", "label", "updated_at"]
        read_only_fields = ["updated_at"]