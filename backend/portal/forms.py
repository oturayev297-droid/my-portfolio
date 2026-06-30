import re
from django import forms
from .models import ContactMessage


class ContactForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['full_name', 'telegram', 'subject', 'message']

    def clean_full_name(self):
        name = self.cleaned_data['full_name'].strip()
        if len(name) < 2:
            raise forms.ValidationError("Ism kamida 2 belgidan iborat bo'lishi kerak.")
        return name

    def clean_telegram(self):
        tg = self.cleaned_data['telegram'].strip()
        if tg and not re.match(r'^@?\w{3,}$', tg):
            raise forms.ValidationError("Telegram username noto'g'ri formatda (@username yoki username).")
        return tg

    def clean_message(self):
        msg = self.cleaned_data['message'].strip()
        if len(msg) < 10:
            raise forms.ValidationError("Xabar kamida 10 belgidan iborat bo'lishi kerak.")
        return msg
