# Creative Django Portfolio sequence

This repository contains a highly unique, unusual creative portfolio.
Frontend driven by HTML5 Canvas, GSAP, and Modern Space-Cyber CSS concepts.
Backend powered by Python Django.

## Instructions to run

1. Install Python.
2. Initialize environment:
   ```bash
   python -m venv env
   source env/bin/activate  # (or env\Scripts\activate on Windows)
   ```
3. Install Django:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py makemigrations portal
   python manage.py migrate
   ```
5. Run server:
   ```bash
   python manage.py runserver
   ```
   
## Domain Hosting deployment
- Make sure to update `ALLOWED_HOSTS` in `config/settings.py` to match your domain (e.g. `['myapp.uz']`).
- Use Gunicorn / Nginx or setup a platform like Render / Railway which seamlessly deploys Django apps.
- Serve static files using WhiteNoise or Nginx static mapping.

## GitHub deployment
- The project is already a git repository locally.
- Run:
  `git add .`
  `git commit -m "Initialize amazing portfolio"`
  `git branch -M main`
  `git remote add origin https://github.com/USERNAME/REPO.git`
  `git push -u origin main`
