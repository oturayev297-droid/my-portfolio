from django.contrib import admin
from django.utils.safestring import mark_safe
from .models import Experience, Project, ContactMessage, AIOrder

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'start_date', 'end_date')
    search_fields = ('company', 'role')
    list_filter = ('start_date',)

@admin.register(AIOrder)
class AIOrderAdmin(admin.ModelAdmin):
    list_display = ('client_name', 'estimated_price', 'created_at', 'is_processed')
    list_filter = ('is_processed', 'created_at')
    search_fields = ('client_name', 'project_brief')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('display_image', 'title', 'category')
    search_fields = ('title', 'tech_stack')
    list_filter = ('category',)
    
    def display_image(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="60" style="border-radius: 5px;" />')
        return "No Image"
    display_image.short_description = 'Preview'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'telegram', 'subject', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    readonly_fields = ('created_at',)
