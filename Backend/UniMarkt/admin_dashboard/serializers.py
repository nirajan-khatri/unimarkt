from rest_framework import serializers
from product.models import Product
from uniMarktAuth.models import User

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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        ref_name = 'AdminDashboardUserSerializer'  # Unique name to avoid conflict
