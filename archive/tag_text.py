import codecs

with codecs.open('templates/home.html', 'r', 'utf-8') as f:
    text = f.read()

replacements = {
    "👋 Assalomu alaykum, men Dasturchi va Dizaynerman": "👋 {% trans \"Assalomu alaykum, men Dasturchi va Dizaynerman\" %}",
    "RAQAMLI <br>": "{% trans \"RAQAMLI\" %} <br>",
    "<span class=\"gradient-text type-effect\">SHEDEVRLAR</span>": "<span class=\"gradient-text type-effect\">{% trans \"SHEDEVRLAR\" %}</span>",
    "YARATAMIZ": "{% trans \"YARATAMIZ\" %}",
    "Men ajoyib vizual dizayn va mukammal arxitekturani o'zaro bog'layman. Python, Django va zamonaviy frontend texnologiyalari ustasiman.": "{% trans \"Men ajoyib vizual dizayn va mukammal arxitekturani o'zaro bog'layman. Python, Django va zamonaviy frontend texnologiyalari ustasiman.\" %}",
    "Barcha Loyihalar": "{% trans \"Barcha Loyihalar\" %}",
    "Bog'lanish": "{% trans \"Bog'lanish\" %}",
    "Shunchaki <span": "{% trans \"Shunchaki\" %} <span",
    "<span class=\"gradient-text\">Kod Yozishdan</span>": "<span class=\"gradient-text\">{% trans \"Kod Yozishdan\" %}</span>",
    "</span> Narida": "</span> {% trans \"Narida\" %}",
    "Mening asosiy maqsadim aqlli platformalar va yuqori tezlikda ishlovchi ilovalar yaratish. Men shunchaki kod yozmayman, men to'liq raqamli ekotizim qanaqa bo'lishi kerakligini rejalashtiraman.": "{% trans \"Mening asosiy maqsadim aqlli platformalar va yuqori tezlikda ishlovchi ilovalar yaratish. Men shunchaki kod yozmayman, men to'liq raqamli ekotizim qanaqa bo'lishi kerakligini rejalashtiraman.\" %}",
    "Yillik Tajriba": "{% trans \"Yillik Tajriba\" %}",
    "Muvaffaqiyatli Loyihalar": "{% trans \"Muvaffaqiyatli Loyihalar\" %}",
    "O'qitilgan O'quvchilar": "{% trans \"O'qitilgan O'quvchilar\" %}",
    "Sifat Kafolati": "{% trans \"Sifat Kafolati\" %}",
    "Mening <span": "{% trans \"Mening\" %} <span",
    "<span class=\"gradient-text\">Xizmatlarim</span>": "<span class=\"gradient-text\">{% trans \"Xizmatlarim\" %}</span>",
    "Muhim va to'liq yechimlarni taqdim etaman.": "{% trans \"Muhim va to'liq yechimlarni taqdim etaman.\" %}",
    "Veb Dasturlash": "{% trans \"Veb Dasturlash\" %}",
    "Django qudrati va zamonaviy JS texnologiyalaridan foydalangan holda murakkab veb-saytlar qurish.": "{% trans \"Django qudrati va zamonaviy JS texnologiyalaridan foydalangan holda murakkab veb-saytlar qurish.\" %}",
    "Mobil Ilovalar": "{% trans \"Mobil Ilovalar\" %}",
    "REST API bilan integratsiya qilingan eng sifatli hamda tezkor iOS va Android ilovalar.": "{% trans \"REST API bilan integratsiya qilingan eng sifatli hamda tezkor iOS va Android ilovalar.\" %}",
    "UI/UX Dizayn": "{% trans \"UI/UX Dizayn\" %}",
    "Foydalanuvchilarni e'tiborini tortuvchi noodatiy shishali ko'rinish va jozibador interfeyslar chizish.": "{% trans \"Foydalanuvchilarni e'tiborini tortuvchi noodatiy shishali ko'rinish va jozibador interfeyslar chizish.\" %}",
    "Mentorlik": "{% trans \"Mentorlik\" %}",
    "Karyerasini endi boshlayotgan yoshlarga dasturlash olamidagi muvaffaqiyat sirlarini o'rgatish.": "{% trans \"Karyerasini endi boshlayotgan yoshlarga dasturlash olamidagi muvaffaqiyat sirlarini o'rgatish.\" %}",
    "Bosib O'tgan <span": "{% trans \"Bosib O'tgan\" %} <span",
    "<span class=\"gradient-text\">Yo'lim</span>": "<span class=\"gradient-text\">{% trans \"Yo'lim\" %}</span>",
    "2023 - Hozirgi kun": "{% trans \"2023 - Hozirgi kun\" %}",
    "Senior AI & Veb Dasturchi": "{% trans \"Senior AI & Veb Dasturchi\" %}",
    "IT Akademik Yechimlar": "{% trans \"IT Akademik Yechimlar\" %}",
    "Minglab foydalanuvchilar ishlatsa ham sekinlashmaydigan yuqori murakkablikdagi tizimlarni joriy qildim.": "{% trans \"Minglab foydalanuvchilar ishlatsa ham sekinlashmaydigan yuqori murakkablikdagi tizimlarni joriy qildim.\" %}",
    "Full-Stack Veb Dasturchi": "{% trans \"Full-Stack Veb Dasturchi\" %}",
    "Raqamli Avlod MChJ": "{% trans \"Raqamli Avlod MChJ\" %}",
    "Ajoyib elektron tijorat portallari va biznesni avtomatlashtiruvchi backend kodlarini barpo etdim.": "{% trans \"Ajoyib elektron tijorat portallari va biznesni avtomatlashtiruvchi backend kodlarini barpo etdim.\" %}",
    "UI/UX va Frontend Dasturchi": "{% trans \"UI/UX va Frontend Dasturchi\" %}",
    "Startap Guruhlari": "{% trans \"Startap Guruhlari\" %}",
    "Ilk loyihalarni vizual taraflama ideal qilish ustida ishlab bir qancha muvaffaqiyatlarga erishdik.": "{% trans \"Ilk loyihalarni vizual taraflama ideal qilish ustida ishlab bir qancha muvaffaqiyatlarga erishdik.\" %}",
    "Saralangan <span": "{% trans \"Saralangan\" %} <span",
    "<span class=\"gradient-text\">Loyihalar</span>": "<span class=\"gradient-text\">{% trans \"Loyihalar\" %}</span>",
    "Tez orada loyihalar kiritiladi...": "{% trans \"Tez orada loyihalar kiritiladi...\" %}",
    "Keling, <span": "{% trans \"Keling,\" %} <span",
    "<span class=\"gradient-text\">Bog'lanamiz</span>": "<span class=\"gradient-text\">{% trans \"Bog'lanamiz\" %}</span>",
    "Miyangizda o'zgacha loyiha g'oyasi bormi? Uni real voqelikka aylantirishni menga qo'yib bering.": "{% trans \"Miyangizda o'zgacha loyiha g'oyasi bormi? Uni real voqelikka aylantirishni menga qo'yib bering.\" %}",
    ">Ismingiz<": ">{% trans \"Ismingiz\" %}<",
    ">Elektron pochtangiz<": ">{% trans \"Elektron pochtangiz\" %}<",
    ">Xabar Mavzusi<": ">{% trans \"Xabar Mavzusi\" %}<",
    ">Xabar Metni...<": ">{% trans \"Xabar Metni...\" %}<",
    "<span>Xabarni Yuborish</span>": "<span>{% trans \"Xabarni Yuborish\" %}</span>"
}

for k, v in replacements.items():
    text = text.replace(k, v)

with codecs.open('templates/home.html', 'w', 'utf-8') as f:
    f.write(text)
print("Tagging matched successfully.")
