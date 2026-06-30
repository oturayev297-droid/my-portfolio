import django
import os
os.environ['DJANGO_SETTINGS_MODULE'] = 'config.settings'
django.setup()
from django.urls import get_resolver

resolver = get_resolver()
for u in resolver.url_patterns:
    if hasattr(u, 'pattern'):
        print(f"  {u.pattern}")
    elif hasattr(u, 'url_patterns'):
        for sub in u.url_patterns:
            if hasattr(sub, 'name') and sub.name:
                print(f"  {u.pattern} {sub.pattern}  [{sub.name}]")
            elif hasattr(sub, 'pattern'):
                print(f"  {u.pattern} {sub.pattern}")
