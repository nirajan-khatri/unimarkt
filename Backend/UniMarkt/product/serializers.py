from rest_framework import serializers
from .models import Category, SubCategory, Product
from uniMarktAuth.models import User
from uniMarktAuth.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['category_id', 'name']

class SubCategorySerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model = SubCategory
        fields = ['sub_category_id', 'name', 'category', 'category_id']


class ProductSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    sub_category_id = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(), source='sub_category', write_only=True
    )

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )

    category = CategorySerializer(read_only=True)
    sub_category = SubCategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            'product_id', 'name', 'category', 'category_id',
            'sub_category', 'sub_category_id',
            'description', 'price', 'images',
            'user', 'user_id', 'status', 'created_at', 'pickup_location'
        ]

class ProductCreateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    sub_category_id = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(), source='sub_category', write_only=True
    )

    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category_id', 'sub_category_id', 'user_id', 'images', 'pickup_location', 'status']

class ProductUpdateSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    sub_category_id = serializers.PrimaryKeyRelatedField(
        queryset=SubCategory.objects.all(), source='sub_category', write_only=True
    )
    user_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source='user', write_only=True
    )
    class Meta:
        model = Product
        fields = ['name', 'description', 'price', 'category_id', 'sub_category_id', 'user_id', 'images', 'pickup_location', 'status']

