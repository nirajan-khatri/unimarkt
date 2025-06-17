from rest_framework import serializers
from product.models import Product, Category, SubCategory
from uniMarktAuth.models import User,Role

from skill.models import Skill,Department,Degree,SkillCategory,AvailableTimeSlot



class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'
        ref_name = 'AdminDashboardDepartmentSerializer'



class DegreeSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    department_id = serializers.PrimaryKeyRelatedField(queryset=Department.objects.all(), source='department', write_only=True)
    class Meta:
        model = Degree
        fields = '__all__'
        ref_name = 'AdminDashboardDegreeSerializer'


class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = '__all__'
        ref_name = 'AdminDashboardSkillCategorySerializer'



class AvailableTimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailableTimeSlot
        fields = ['day', 'start_time', 'end_time', 'status']
        ref_name = 'AdminDashboardAvailableTimeSlotSerializer'
        
class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'name']
        ref_name = 'AdminDashboardRoleSerializer'


class UserSerializer(serializers.ModelSerializer):
    role = RoleSerializer( read_only=True)
    role_id = serializers.PrimaryKeyRelatedField(queryset=Role.objects.all(), source='role', write_only=True)


    class Meta:
        model = User
        fields = ['id','is_superuser', 'name', 'email', 'contact_number', 'is_active', 'is_staff','is_admin','status', 'role', 'role_id']

        ref_name = 'AdminDashboardUserSerializer'  # Unique name to avoid conflict

class SubCategorySerializer(serializers.ModelSerializer):
    
    subcategories = serializers.ListField(child=serializers.CharField(), allow_null=True, required=False, default=list)  # dummy nullable list field

    class Meta:
        model = SubCategory
        fields = ['id', 'name', 'color','slug', 'category_id','subcategories']
        ref_name = 'AdminDashboardSubCategorySerializer'  # Unique name to avoid conflict


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    category_id = serializers.CharField(allow_null=True, required=False, default=None)  # dummy nullable field

    class Meta:
        model = Category
        fields = ['id', 'name','color','slug', 'category_id','subcategories']
        ref_name = 'AdminDashboardCategorySerializer'  # Unique name to avoid conflict

        


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    sub_category = SubCategorySerializer(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Product
        fields = '__all__'  # Or list fields explicitly
        ref_name = 'AdminDashboardProductSerializer'  # Unique name to avoid conflict
        

class ProductStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['product_id', 'name', 'status']  # Adjust fields as needed

class SkillSerializer(serializers.ModelSerializer):
    available_time_week = AvailableTimeSlotSerializer(many=True)
    skill_category = SkillCategorySerializer(read_only=True)
    department = DepartmentSerializer(read_only=True)
    degree = DegreeSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Skill
        fields = '__all__'  # Or list fields explicitly
        ref_name = 'AdminDashboardSkillSerializer'  # Unique name to avoid conflict

class SkillStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ['status']