from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('job_posting', '0003_initial'),
    ]

    operations = [
        migrations.DeleteModel(
            name='JobApplication',
        ),
    ]
