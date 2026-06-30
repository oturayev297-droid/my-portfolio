document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    if (!isTouchDevice && window.innerWidth > 1024) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Immediate dot Follow
            cursorDot.style.left = `${mouseX - 4}px`;
            cursorDot.style.top = `${mouseY - 4}px`;
        });

        // Smooth ring Follow via GSAP Ticker
        gsap.ticker.add(() => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX - 20}px`;
            cursorRing.style.top = `${ringY - 20}px`;
        });

        // Add Hover Effect on Interactive Elements
        const interactables = document.querySelectorAll('a, button, .glass-card, input, textarea');
        interactables.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });
    } else {
        // Completely disable on mobile or touch
        if(cursorDot) cursorDot.style.display = 'none';
        if(cursorRing) cursorRing.style.display = 'none';
        document.body.classList.add('mobile-no-cursor');
    }


    // --- Gentle Magnetic Hover ---
    const magnets = document.querySelectorAll('.hover-lift');
    if (!isTouchDevice) {
        magnets.forEach(mag => {
            mag.addEventListener('mousemove', (e) => {
                const rect = mag.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width/2;
                const y = e.clientY - rect.top - rect.height/2;
                gsap.to(mag, {x: x*0.1, y: y*0.1, scale: 1.01, rotation: 0, duration: 0.5, ease: 'power2.out'});
            });
            mag.addEventListener('mouseleave', () => {
                gsap.to(mag, {x: 0, y: 0, scale: 1, rotation: 0, duration: 1, ease: 'elastic.out(1, 0.3)'});
            });
        });
    }

    // --- 2. Header Scroll Effect ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Initial Hero Reveal Animations ---
    const tl = gsap.timeline();
    tl.to('.ambient-wrapper', { opacity: 1, duration: 2, ease: "power2.inOut" })
      .from('.fade-up', { y: 50, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out" }, "-=1.5")
      .from('.float-element', { scale: 0, opacity: 0, rotation: 180, duration: 1, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.5");

    // Floating elements autonomous motion
    gsap.utils.toArray('.float-element').forEach((el, i) => {
        gsap.to(el, {
            y: "random(-20, 20)",
            x: "random(-20, 20)",
            rotation: "random(-15, 15)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2
        });
    });

    // Magic Click Explosion Effect
    document.querySelectorAll('.magic-trigger').forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            const glow = document.createElement('div');
            glow.className = 'magic-glow-pulse';
            
            // Adjust size and position
            const size = 150;
            glow.style.width = glow.style.height = `${size}px`;
            glow.style.left = `${e.clientX - size/2}px`;
            glow.style.top = `${e.clientY - size/2}px`;
            glow.style.position = 'fixed';
            
            document.body.appendChild(glow);
            
            gsap.to(glow, {
                scale: 2,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                onComplete: () => glow.remove()
            });

            // "Charog'on" icon reaction
            const icon = this.querySelector('i');
            gsap.to(icon, {
                scale: 1.8,
                filter: "brightness(3) saturate(2)",
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        });
    });

    // Float element mouse parallax
    document.addEventListener('mousemove', (e) => {
        const xAxis = (window.innerWidth / 2 - e.pageX) / 40;
        const yAxis = (window.innerHeight / 2 - e.pageY) / 40;
        
        gsap.to('.float-element', { 
            xPercent: (i) => i % 2 === 0 ? xAxis : -xAxis,
            yPercent: (i) => i % 2 === 0 ? yAxis : -yAxis,
            duration: 1.5,
            ease: 'power2.out'
        });
    });


    // --- 4. ScrollTrigger Configurations ---
    gsap.registerPlugin(ScrollTrigger);

    // Unified Mobile Navigation Logic
    const menuBtn = document.querySelector('.menu-btn');
    const menuOverlay = document.querySelector('.mobile-menu-overlay');
    const closeBtn = document.querySelector('.close-btn');
    const mobileLinks = document.querySelectorAll('.mobile-nav .nav-link');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            gsap.from('.mobile-nav .nav-link', {
                y: 50, opacity: 0, stagger: 0.1, duration: 0.5, ease: 'power4.out'
            });
        });
    }

    const closeMenu = () => {
        if (menuOverlay) {
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));

    // GSAP Scroll Animations with Responsive Check
    gsap.utils.toArray('.scroll-reveal').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%", 
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Timeline Block animations
    document.querySelectorAll('.timeline-block').forEach((block, i) => {
        gsap.from(block, {
            scrollTrigger: {
                trigger: block,
                start: "top 85%"
            },
            x: window.innerWidth > 768 ? (i % 2 === 0 ? -50 : 50) : 0,
            y: window.innerWidth <= 768 ? 30 : 0,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Flash Matrix Cards Interaction
    document.querySelectorAll('.flash-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none"
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1
        });
    });

    // --- 5. Counters Logic ---
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,
            onEnter: () => {
                const target = +counter.getAttribute('data-target');
                gsap.to(counter, {
                    innerHTML: target,
                    duration: 2.5,
                    snap: { innerHTML: 1 },
                    ease: "power2.out"
                });
            }
        });
    });

    // --- 6. AI Chat Widget Logic ---
    const aiTrigger = document.getElementById('ai-trigger');
    const aiWindow = document.getElementById('ai-chat-window');
    const aiClose = document.getElementById('close-chat');
    const aiForm = document.getElementById('ai-chat-form');
    const aiInput = document.getElementById('ai-input');
    const aiMessages = document.getElementById('ai-chat-messages');

    let chatHistory = [
        { role: 'model', content: "Assalomu alaykum! Men Ozodbekning virtual yordamchisiman. Sizga qanday loyiha kerak? (Landing, E-commerce, Mobile App...)" }
    ]; 

    const addMessage = (text, sender) => {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${sender}`;
        msg.textContent = text;
        aiMessages.appendChild(msg);
        aiMessages.scrollTo({ top: aiMessages.scrollHeight, behavior: 'smooth' });
        
        // Save to context (Gemini format: user / model)
        chatHistory.push({ role: sender === 'user' ? 'user' : 'model', content: text });
    };

    if (aiTrigger) {
        aiTrigger.addEventListener('click', () => {
            aiWindow.classList.toggle('active');
            if (aiWindow.classList.contains('active')) aiInput.focus();
        });
    }

    if (aiClose) aiClose.addEventListener('click', () => aiWindow.classList.remove('active'));

    if (aiForm) {
        aiForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const userMsg = aiInput.value.trim();
            if (!userMsg) return;

            addMessage(userMsg, 'user');
            aiInput.value = '';

            // Loading state
            const loadingMsg = document.createElement('div');
            loadingMsg.className = 'chat-msg bot loading';
            loadingMsg.textContent = '...';
            aiMessages.appendChild(loadingMsg);

            try {
                const response = await fetch('/ai-chat/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                    },
                    body: JSON.stringify({
                        message: userMsg,
                        history: chatHistory.slice(0, -1)
                    })
                });

                if (!response.ok) throw new Error(`Server responded with ${response.status}`);

                const data = await response.json();
                loadingMsg.remove();
                
                addMessage(data.response, 'bot');

            } catch (err) {
                loadingMsg.remove();
                console.error('AI Chat Error:', err);
                addMessage('Uzr, texnik xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.', 'bot');
            }
        });
    }
});
