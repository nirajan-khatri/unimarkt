from rest_framework import serializers
from product.models import Product
from skill.models import Skill

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  # Or list fields explicitly
        ref_name = 'AdminDashboardProductSerializer'  # Unique name to avoid conflict


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'  # Or list fields explicitly
        ref_name = 'AdminDashboardSkillSerializer'  # Unique name to avoid conflict

