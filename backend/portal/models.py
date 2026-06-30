from django.db import models

class Experience(models.Model):
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    description = models.TextField()

    def __str__(self):
        return f"{self.role} at {self.company}"

class Project(models.Model):
    title = models.CharField(max_length=200)
    category = models.CharField(max_length=100, default="Veb Loyiha")
    description = models.TextField()
    tech_stack = models.CharField(
        max_length=300, 
        help_text="Vergul bilan ajratib yozing: Django, JS, Redis"
    )
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    link = models.URLField(default="#")
    
    def get_tech_list(self):
        return [tech.strip() for tech in self.tech_stack.split(',')]

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    full_name = models.CharField(max_length=200)
    telegram = models.CharField(
        max_length=200, 
        verbose_name="Telegram URL yoki Username"
    )
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"From {self.full_name} - {self.subject}"


class AIOrder(models.Model):
    client_name = models.CharField(max_length=200, verbose_name="Mijoz Ismi")
    project_brief = models.TextField(verbose_name="Loyiha haqida")
    estimated_price = models.CharField(max_length=100, verbose_name="Taxminiy Narx")
    chat_transcript = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_processed = models.BooleanField(default=False)

    def __str__(self):
        return f"Order from {self.client_name} - {self.estimated_price}"
