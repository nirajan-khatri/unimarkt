# Generated manually for 2FA support

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('uniMarktAuth', '0002_alter_user_answer1_alter_user_answer3'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='two_factor_enabled',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='two_factor_secret',
            field=models.CharField(blank=True, max_length=32, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='backup_codes',
            field=models.JSONField(blank=True, default=list),
        ),
    ] 