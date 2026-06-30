import { createContext, useContext, useState } from 'react'

const translations = {
  uz: {
    nav: { home: 'Asosiy', about: 'Haqimda', services: 'Xizmatlar', experience: 'Tajriba', projects: 'Loyihalar', contact: 'Aloqa' },
    hero: { subtitle: 'Ozodbek Turayev', title1: 'RAQAMLI', title2: 'SHEDEVRLAR', title3: 'YARATAMIZ', desc: 'Men ajoyib vizual dizayn va mukammal arxitekturani o\'zaro bog\'layman. Python, Django va zamonaviy frontend texnologiyalari ustasiman.', cta: 'Barcha Loyihalar', cta2: 'Bog\'lanish' },
     about: { title: 'Shunchaki', titleGrad: 'Kod Yozishdan', titleEnd: 'Narida', desc: 'Qadimiy va navqiron Buxoro farzandi sifatidagi mas\'uliyatni his etgan holda, 2023-yildan buyon raqamli dunyoda o\'zligimni va professional cho\'qqilarni zabt etib kelmoqdaman. Bugungi kunda Middle darajadagi mutaxassis sifatida, jamoamiz bilan birga eng murakkab texnologik muammolarga ham mukammal yechimlar topishga qodirmiz.', stat0: 'Yillik Tajriba', stat1: 'Muvaffaqiyatli Loyihalar', stat2: 'Muvaffaqiyatli Shogirdlar', stat3: 'Sifat Kafolati', aiTitle: 'Sun\'iy Intellekt bilan', aiTitleGrad: 'Mukammal Ishlayman', aiDesc: 'Sun\'iy intellekt texnologiyalarini chuqur o\'zlashtirgan holda, loyihalaringizni yanada aqlli va samarali qilish uchun eng so\'nggi AI modellaridan foydalanaman. Har bir loyihada AI integratsiyasi orqali mijozlarga raqobatbardosh ustunlik yaratib beraman.', ai1: 'ChatGPT / OpenAI', ai2: 'Google Gemini', ai3: 'Claude (Anthropic)', ai4: 'GitHub Copilot', ai5: 'Midjourney / DALL-E', ai6: 'Hugging Face', ai7: 'TensorFlow / PyTorch', ai8: 'Stable Diffusion' },
    services: { title: 'Mening', titleGrad: 'Xizmatlarim', subtitle: 'Muhim va to\'liq yechimlarni taqdim etaman.', s1: 'Veb Dasturlash', s1d: 'Django qudrati va zamonaviy JS texnologiyalaridan foydalangan holda murakkab veb-saytlar qurish.', s2: 'Mobil Ilovalar', s2d: 'REST API bilan integratsiya qilingan eng sifatli hamda tezkor iOS va Android ilovalar.', s3: 'UI/UX Dizayn', s3d: 'Foydalanuvchilarni e\'tiborini tortuvchi noodatiy shishali ko\'rinish va jozibador interfeyslar chizish.', s4: 'AI & IT Mentorlik', s4d: 'Karyerasini boshlayotgan yoshlarga sun\'iy intellektdan unumli foydalangan holda dasturlash muvaffaqiyat sirlarini o\'rgatish.', s5: 'AI Integratsiyasi', s5d: 'Sun\'iy intellekt qudrati bilan murakkab va professional darajadagi veb sayt hamda mobil ilovalarni kafolatlangan holda sifatli yaratib berish.', s6: 'Telegram Botlar', s6d: 'Biznesingizni avtomatlashtirish, xizmat ko\'rsatishni yengillashtirish uchun foydali va sun\'iy intellektga asoslangan aqlli Telegram botlar ishlab chiqish.' },
    pricing: { title: 'Loyiha', titleGrad: 'Narxlari', subtitle: 'Sizning vizyoningiz - Mening e\'tiborimda.', p1: '1 Sahifali Sayt', p1p: '$500 - 1000$', p2: 'Sayt va Ilovalar', p2p: '$300 - 10000+$', p3: 'Telegram Bot', p3p: '$300 - 5000+$', f1: 'Eksklyuziv UI/UX Dizayn', f2: 'Adaptiv versiya', f3: 'Animatsiyalar', f4: 'SEO xizmati', f5: 'Admin Panel', f6: 'Ma\'lumotlar Bazasi', f7: 'API Integratsiyalari', f8: 'Mobil Ilova', f9: 'AI Integratsiya', f10: 'To\'lov tizimlari', f11: 'Statistika', f12: 'Guruh boshqaruvi', popular: 'Ommabop', btn: 'Buyurtma berish' },
    experience: { title: 'Bosib O\'tgan', titleGrad: 'Yo\'lim' },
    projects: { title: 'Saralangan', titleGrad: 'Loyihalar', empty: 'Tez orada loyihalar kiritiladi...', footer: 'Ko\'p ishlarim bor lekin ishlarimni kiritish shart emas chunki sizga bu qiziq emas hozir qiladigan ishim qiziq axir' },
    contact: { title: 'Keling', titleGrad: 'Bog\'lanamiz', intro: 'Miyangizda o\'zgacha loyiha g\'oyasi bormi? Uni real voqelikka aylantirishni menga qo\'yib bering.', telegram: 'Telegram', location: 'Manzil', locationV: 'O\'zbekiston, Toshkent / Samarqand / Buxoro', avail: 'Hozir mavjud — yangi loyihalarga ochiqman!', formTitle: 'Xabar Yuborish', formSub: 'Javob 24 soat ichida beriladi', nameLabel: 'Ismingiz', tgLabel: 'Telegram URL yoki Username', subjLabel: 'Mavzu', msgLabel: 'Sizning xabaringiz...', btn: 'Xabarni Yuborish', sending: 'Yuborilmoqda...', success: 'Xabaringiz muvaffaqiyatli yuborildi!', error: 'Xatolik yuz berdi. Iltimos, qaytadan urunib ko\'ring.' },
    footer: { desc: 'Zamonaviy veb-texnologiyalar orqali biznesingizni yangi bosqichga olib chiqamiz.', sections: 'Bo\'limlar', servicesTitle: 'Xizmatlar', contactTitle: 'Aloqa', copyright: 'Barcha huquqlar himoyalangan.' },
    ai: { placeholder: 'Xabaringizni yozing...' },
    exp1date: '2026 - Hozirgi kun', exp1title: 'Middle AI & Mobile Innovator', exp1company: 'Startuplar va Jamoaviy Loyihalar',
    exp1desc: 'Sun\'iy intellekt va murakkab dasturiy yechimlar olamida professional jamoa hamda tajribali mentorlar bilan hamkorlikda, iOS va Android platformalari uchun 100% samarali va innovatsion tizimlar yaratib kelmoqdaman.',
    exp2date: '2023 - 2026', exp2title: 'Professional Faoliyat va Mentorlik', exp2company: 'Toshkent, Samarqand, Buxoro',
    exp2desc: 'Xususiy tashkilotlarda real loyihalar ustida ishladim, IT markazlarida dars berdim.',
    exp3date: '2022 - 2024', exp3title: 'O\'rganish va Ilk Qadamlar', exp3company: 'Buxoro, Shaxsiy Rivojlanish',
    exp3desc: '2022-yildan dasturlashni o\'rganishni boshladim. 2023-yildan boshlab esa to\'liq professional faoliyatimga start berdim.',
    exp4date: '2022 - 2023', exp4title: 'UI/UX va Frontend Dasturchi', exp4company: 'Startap Guruhlari',
    exp4desc: 'Ilk loyihalarni vizual taraflama ideal qilish ustida ishlab bir qancha muvaffaqiyatlarga erishdik.',
  },
  ru: {
    nav: { home: 'Главная', about: 'Обо мне', services: 'Услуги', experience: 'Опыт', projects: 'Проекты', contact: 'Контакты' },
    hero: { subtitle: 'Озодбек Тураев', title1: 'СОЗДАЁМ', title2: 'ЦИФРОВЫЕ', title3: 'ШЕДЕВРЫ', desc: 'Я соединяю потрясающий визуальный дизайн и безупречную архитектуру. Мастер Python, Django и современных frontend технологий.', cta: 'Все Проекты', cta2: 'Связаться' },
     about: { title: 'Больше', titleGrad: 'Чем Просто', titleEnd: 'Написание Кода', desc: 'Осознавая ответственность как сын древней и вечно молодой Бухары, с 2023 года я покоряю цифровой мир и профессиональные вершины. Сегодня, как специалист уровня Middle, вместе с нашей командой мы находим идеальные решения даже для самых сложных технологических задач.', stat0: 'Лет Опыта', stat1: 'Успешных Проектов', stat2: 'Успешных Учеников', stat3: 'Гарантия Качества', aiTitle: 'Работаю с', aiTitleGrad: 'Искусственным Интеллектом', aiDesc: 'Глубоко освоив технологии ИИ, я использую новейшие AI модели, чтобы сделать ваши проекты умнее и эффективнее. В каждом проекте я создаю конкурентное преимущество для клиентов через интеграцию искусственного интеллекта.', ai1: 'ChatGPT / OpenAI', ai2: 'Google Gemini', ai3: 'Claude (Anthropic)', ai4: 'GitHub Copilot', ai5: 'Midjourney / DALL-E', ai6: 'Hugging Face', ai7: 'TensorFlow / PyTorch', ai8: 'Stable Diffusion' },
    services: { title: 'Мои', titleGrad: 'Услуги', subtitle: 'Предоставляю важные и комплексные решения.', s1: 'Веб-Разработка', s1d: 'Создание сложных веб-сайтов с использованием Django и современных JS технологий.', s2: 'Мобильные Приложения', s2d: 'Качественные и быстрые iOS и Android приложения с REST API интеграцией.', s3: 'UI/UX Дизайн', s3d: 'Создание необычных стеклянных интерфейсов, привлекающих внимание пользователей.', s4: 'AI и IT Менторство', s4d: 'Обучение секретам программирования с использованием искусственного интеллекта.', s5: 'AI Интеграция', s5d: 'Создание профессиональных веб-сайтов и мобильных приложений с гарантированным качеством.', s6: 'Telegram Боты', s6d: 'Разработка умных Telegram ботов на базе ИИ для автоматизации бизнеса.' },
    pricing: { title: 'Цены на', titleGrad: 'Проекты', subtitle: 'Ваше видение - в моём фокусе.', p1: 'Одностраничный Сайт', p1p: '$500 - 1000$', p2: 'Сайты и Приложения', p2p: '$300 - 10000+$', p3: 'Telegram Бот', p3p: '$300 - 5000+$', f1: 'Эксклюзивный UI/UX', f2: 'Адаптивная версия', f3: 'Анимации', f4: 'SEO услуги', f5: 'Админ Панель', f6: 'База Данных', f7: 'API Интеграции', f8: 'Моб. Приложение', f9: 'AI Интеграция', f10: 'Платёжные системы', f11: 'Статистика', f12: 'Управление группой', popular: 'Популярно', btn: 'Заказать' },
    experience: { title: 'Мой', titleGrad: 'Путь' },
    projects: { title: 'Избранные', titleGrad: 'Проекты', empty: 'Скоро проекты будут добавлены...', footer: 'У меня много работ, но не обязательно их все показывать, ведь вас интересует то, что я могу сделать сейчас' },
    contact: { title: 'Давайте', titleGrad: 'Свяжемся', intro: 'У вас есть уникальная идея проекта? Доверьте мне превратить её в реальность.', telegram: 'Telegram', location: 'Адрес', locationV: 'Узбекистан, Ташкент / Самарканд / Бухара', avail: 'Сейчас доступен — открыт для новых проектов!', formTitle: 'Отправить Сообщение', formSub: 'Ответ в течение 24 часов', nameLabel: 'Ваше Имя', tgLabel: 'Telegram URL или Username', subjLabel: 'Тема', msgLabel: 'Ваше сообщение...', btn: 'Отправить', sending: 'Отправляется...', success: 'Сообщение успешно отправлено!', error: 'Произошла ошибка. Пожалуйста, попробуйте снова.' },
    footer: { desc: 'Выводим ваш бизнес на новый уровень с помощью современных веб-технологий.', sections: 'Разделы', servicesTitle: 'Услуги', contactTitle: 'Контакты', copyright: 'Все права защищены.' },
    ai: { placeholder: 'Напишите сообщение...' },
    exp1date: '2026 - Настоящее время', exp1title: 'Middle AI и Mobile Инноватор', exp1company: 'Стартапы и Командные Проекты',
    exp1desc: 'Создание эффективных и инновационных систем для iOS и Android совместно с профессиональной командой и опытными менторами.',
    exp2date: '2023 - 2026', exp2title: 'Профессиональная Деятельность и Менторство', exp2company: 'Ташкент, Самарканд, Бухара',
    exp2desc: 'Работал над реальными проектами в частных организациях, преподавал в IT центрах.',
    exp3date: '2022 - 2024', exp3title: 'Обучение и Первые Шаги', exp3company: 'Бухара, Личное Развитие',
    exp3desc: 'Начал изучать программирование в 2022 году. С 2023 года начал полноценную профессиональную деятельность.',
    exp4date: '2022 - 2023', exp4title: 'UI/UX и Frontend Разработчик', exp4company: 'Стартап Группы',
    exp4desc: 'Работал над визуальной составляющей первых проектов, добившись ряда успехов.',
  },
  en: {
    nav: { home: 'Home', about: 'About', services: 'Services', experience: 'Experience', projects: 'Projects', contact: 'Contact' },
    hero: { subtitle: 'Ozodbek Turayev', title1: 'CREATING', title2: 'DIGITAL', title3: 'MASTERPIECES', desc: 'I bridge stunning visual design with flawless architecture. Master of Python, Django, and modern frontend technologies.', cta: 'All Projects', cta2: 'Get in Touch' },
     about: { title: 'Beyond', titleGrad: 'Just Writing', titleEnd: 'Code', desc: 'As a son of ancient yet ever-young Bukhara, since 2023 I have been conquering the digital world and professional peaks. Today, as a Middle-level specialist, together with my team we find perfect solutions even for the most complex technological challenges.', stat0: 'Years Experience', stat1: 'Successful Projects', stat2: 'Successful Students', stat3: 'Quality Guarantee', aiTitle: 'Working Perfectly', aiTitleGrad: 'With AI', aiDesc: 'Having deeply mastered AI technologies, I use the latest AI models to make your projects smarter and more efficient. In every project, I create a competitive advantage for clients through artificial intelligence integration.', ai1: 'ChatGPT / OpenAI', ai2: 'Google Gemini', ai3: 'Claude (Anthropic)', ai4: 'GitHub Copilot', ai5: 'Midjourney / DALL-E', ai6: 'Hugging Face', ai7: 'TensorFlow / PyTorch', ai8: 'Stable Diffusion' },
    services: { title: 'My', titleGrad: 'Services', subtitle: 'Providing important and complete solutions.', s1: 'Web Development', s1d: 'Building complex websites using Django and modern JS technologies.', s2: 'Mobile Apps', s2d: 'High-quality iOS and Android apps with REST API integration.', s3: 'UI/UX Design', s3d: 'Creating unusual glass-style interfaces that capture users\' attention.', s4: 'AI & IT Mentoring', s4d: 'Teaching programming success secrets to beginners using AI.', s5: 'AI Integration', s5d: 'Creating professional websites and mobile apps with guaranteed quality.', s6: 'Telegram Bots', s6d: 'Developing smart AI-powered Telegram bots for business automation.' },
    pricing: { title: 'Project', titleGrad: 'Pricing', subtitle: 'Your vision - In my focus.', p1: 'Single Page Site', p1p: '$500 - 1000$', p2: 'Sites & Apps', p2p: '$300 - 10000+$', p3: 'Telegram Bot', p3p: '$300 - 5000+$', f1: 'Exclusive UI/UX', f2: 'Responsive Design', f3: 'Animations', f4: 'SEO Service', f5: 'Admin Panel', f6: 'Database', f7: 'API Integrations', f8: 'Mobile App', f9: 'AI Integration', f10: 'Payment Systems', f11: 'Statistics', f12: 'Group Management', popular: 'Popular', btn: 'Order Now' },
    experience: { title: 'My', titleGrad: 'Journey' },
    projects: { title: 'Featured', titleGrad: 'Projects', empty: 'Projects coming soon...', footer: 'I have many works but listing them all is not necessary because you are more interested in what I can do for you now' },
    contact: { title: "Let's", titleGrad: 'Connect', intro: 'Do you have a unique project idea? Let me turn it into reality.', telegram: 'Telegram', location: 'Location', locationV: 'Uzbekistan, Tashkent / Samarkand / Bukhara', avail: 'Available now — open for new projects!', formTitle: 'Send Message', formSub: 'Reply within 24 hours', nameLabel: 'Your Name', tgLabel: 'Telegram URL or Username', subjLabel: 'Subject', msgLabel: 'Your message...', btn: 'Send Message', sending: 'Sending...', success: 'Your message has been sent successfully!', error: 'An error occurred. Please try again.' },
    footer: { desc: 'Taking your business to the next level with modern web technologies.', sections: 'Sections', servicesTitle: 'Services', contactTitle: 'Contact', copyright: 'All rights reserved.' },
    ai: { placeholder: 'Type your message...' },
    exp1date: '2026 - Present', exp1title: 'Middle AI & Mobile Innovator', exp1company: 'Startups and Team Projects',
    exp1desc: 'Creating effective and innovative systems for iOS and Android platforms with a professional team and experienced mentors.',
    exp2date: '2023 - 2026', exp2title: 'Professional Activity & Mentoring', exp2company: 'Tashkent, Samarkand, Bukhara',
    exp2desc: 'Worked on real projects in private organizations, taught at IT centers.',
    exp3date: '2022 - 2024', exp3title: 'Learning & First Steps', exp3company: 'Bukhara, Personal Development',
    exp3desc: 'Started learning programming in 2022. Began full professional activity from 2023.',
    exp4date: '2022 - 2023', exp4title: 'UI/UX & Frontend Developer', exp4company: 'Startup Groups',
    exp4desc: 'Worked on making the visual side of early projects ideal, achieving several successes.',
  },
}

const LangContext = createContext()

export function LangProvider({ children }) {
  const [lang, setLang] = useState('uz')

  const t = (path) => {
    const keys = path.split('.')
    let obj = translations[lang]
    for (const key of keys) {
      if (obj && obj[key] !== undefined) obj = obj[key]
      else return path
    }
    return obj
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used within LangProvider')
  return ctx
}
