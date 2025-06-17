from rest_framework import serializers
from .models import Category, SubCategory, Product
from uniMarktAuth.models import User
from uniMarktAuth.serializers import UserSerializer


class SubCategorySerializer(serializers.ModelSerializer):
    
    subcategories = serializers.ListField(child=serializers.CharField(), read_only=True, allow_null=True, required=False, default=list)  # dummy nullable list field
    category_id = serializers.PrimaryKeyRelatedField(
            queryset=Category.objects.all(),
            source='category'  # maps category_id -> category FK in model
        )
    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'color','slug', 'category_id','subcategories']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    category_id = serializers.ReadOnlyField(source='id')  

    class Meta:
        model = Category
        fields = ['id', 'name','color','slug', 'category_id','subcategories']

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

