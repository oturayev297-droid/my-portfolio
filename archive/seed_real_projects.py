import os
import django
import sys

# Add project root to path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(current_dir)
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from portal.models import Project

def seed_projects():
    # Clear existing projects
    Project.objects.all().delete()
    
    projects_data = [
        {
            "title": "Upgrade Tech Store",
            "category": "E-Commerce",
            "description": "Yuqori unumdorlikka ega kompyuter va gaming jihozlari uchun ixtisoslashgan onlayn do'kon.",
            "image": "projects/upgrade_tech_store.png"
        },
        {
            "title": "Anor Travel",
            "category": "Tourism",
            "description": "O'zbekiston va Markaziy Osiyo bo'ylab premium turistik xizmatlar ko'rsatish platformasi.",
            "image": "projects/anor_travel.png"
        },
        {
            "title": "IT Academy Catalog",
            "category": "Ed-Tech",
            "description": "Professional dasturlash kurslarini boshqaruvchi va sotuvchi murakkab LMS tizimi.",
            "image": "projects/it_academy_catalog.png"
        },
        {
            "title": "Restaurantly",
            "category": "Gastronomy",
            "description": "Hashamatli restoranlar uchun onlayn menyu va stol band qilish (booking) tizimi.",
            "image": "projects/restaurantly.png"
        },
        {
            "title": "HomeSpace",
            "category": "Real Estate",
            "description": "Ko'chmas mulkni ijaraga berish va sotish bo'yicha zamonaviy qidiruv portali.",
            "image": "projects/homespace.png"
        },
        {
            "title": "Learner Platform",
            "category": "Education",
            "description": "Onlayn kurslar va masofaviy ta'limni tashkil etuvchi zamonaviy veb-platforma.",
            "image": "projects/learner_platform.png"
        }
    ]
    
    for p in projects_data:
        Project.objects.create(
            title=p['title'],
            category=p['category'],
            description=p['description'],
            image=p['image'],
            tech_stack="Django, Python, CSS3, GSAP",
            link="#"
        )
    print(f"Successfully seeded {len(projects_data)} projects.")

if __name__ == "__main__":
    seed_projects()
