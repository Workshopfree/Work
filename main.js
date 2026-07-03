// ==================== NETLIFY CMS CONTENT LOADER ====================

// Load all content from JSON files
async function loadAllContent() {
    try {
        // Load settings first
        const settingsRes = await fetch('content/settings.json');
        const settings = await settingsRes.json();
        window.siteSettings = settings;

        // Apply settings
        document.title = settings.site_title || 'مشاوره تحصیلی نوین';

        // Load hero
        const heroRes = await fetch('content/hero.json');
        const hero = await heroRes.json();
        renderHero(hero);

        // Load services
        const servicesRes = await fetch('content/services.json');
        const services = await servicesRes.json();
        renderServices(services);

        // Load testimonials
        const testimonialsRes = await fetch('content/testimonials.json');
        const testimonials = await testimonialsRes.json();
        renderTestimonials(testimonials);

        // Load report cards
        const reportCardsRes = await fetch('content/report-cards.json');
        const reportCards = await reportCardsRes.json();
        renderReportCards(reportCards);

        // Load blog
        const blogRes = await fetch('content/blog.json');
        const blog = await blogRes.json();
        renderBlog(blog);

        // Load FAQ
        const faqRes = await fetch('content/faq.json');
        const faq = await faqRes.json();
        renderFAQ(faq);

        // Apply settings to footer and contact
        applySettings(settings);

        // Start countdown with settings date
        startCountdown(settings.konkur_date);

    } catch (error) {
        console.error('Error loading content:', error);
    }
}

// ==================== RENDER FUNCTIONS ====================

function renderHero(hero) {
    const badge = document.querySelector('.hero-badge-text');
    if (badge) badge.textContent = hero.badge;

    const titleLines = document.querySelectorAll('.hero-title-line');
    if (titleLines[0]) titleLines[0].textContent = hero.title_line1;
    if (titleLines[1]) titleLines[1].textContent = hero.title_line2;

    const desc = document.querySelector('.hero-desc');
    if (desc) desc.textContent = hero.description;

    const heroBtn = document.querySelector('.hero-buttons .btn-primary');
    if (heroBtn) {
        heroBtn.innerHTML = `
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            ${hero.button_text}
        `;
        heroBtn.href = hero.button_url;
    }

    // Render stats
    const statNumbers = document.querySelectorAll('.hero-stat-number');
    const statLabels = document.querySelectorAll('.hero-stat-label');

    const stats = [
        { number: hero.stat1_number, label: hero.stat1_label },
        { number: hero.stat2_number, label: hero.stat2_label },
        { number: hero.stat3_number, label: hero.stat3_label }
    ];

    stats.forEach((stat, i) => {
        if (statNumbers[i]) statNumbers[i].textContent = stat.number;
        if (statLabels[i]) statLabels[i].textContent = stat.label;
    });
}

function renderServices(services) {
    const container = document.querySelector('.services-grid');
    if (!container) return;

    container.innerHTML = services.map(s => `
        <div class="service-card fade-in">
            <div class="service-icon ${s.icon_color}">${s.icon}</div>
            <h3>${s.title}</h3>
            <p>${s.description}</p>
            <a href="${s.link || '#contact'}" class="service-link">
                درخواست مشاوره
                <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M19 9l-7 7-7-7"></path>
                </svg>
            </a>
        </div>
    `).join('');

    // Re-observe for fade animation
    observeFadeElements();
}

function renderTestimonials(testimonials) {
    const container = document.querySelector('.testimonials-grid');
    if (!container) return;

    container.innerHTML = testimonials.map(t => {
        const stars = '★'.repeat(t.stars) + '☆'.repeat(5 - t.stars);
        return `
            <div class="testimonial-card fade-in">
                <div class="testimonial-stars">
                    ${stars.split('').map(s => `<span>${s}</span>`).join('')}
                </div>
                <p class="testimonial-text">"${t.text}"</p>
                <div class="testimonial-author">
                    <div class="testimonial-avatar">${t.initial}</div>
                    <div class="testimonial-author-info">
                        <h4>${t.name}</h4>
                        <p>${t.rank}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    observeFadeElements();
}

function renderReportCards(cards) {
    const carousel = document.getElementById('storyCarousel');
    if (!carousel) return;

    carousel.innerHTML = cards.map((card, index) => `
        <div class="story-item ${index === 0 ? 'active' : ''}" onclick="showStory(${index})">
            <div class="story-ring">
                <div class="story-image-wrapper">
                    <img src="${card.image || 'https://via.placeholder.com/140'}" alt="${card.name}" class="story-image">
                    <div class="story-badge">✓</div>
                </div>
            </div>
            <div class="story-name">${card.name}</div>
            <div class="story-score">معدل ${card.grade}</div>
            <div class="story-label">${card.field}</div>
        </div>
    `).join('');

    // Render detail cards
    cards.forEach((card, index) => {
        const detail = document.getElementById(`storyDetail${index}`);
        if (detail) {
            detail.innerHTML = `
                <div class="story-detail-header">
                    <img src="${card.image || 'https://via.placeholder.com/80'}" alt="${card.name}" class="story-detail-avatar">
                    <div class="story-detail-info">
                        <h3>کارنامه ${card.name}</h3>
                        <p>دانش‌آموز پایه دوازدهم رشته ${card.field}</p>
                    </div>
                </div>
                <div class="story-detail-stats">
                    <div class="story-detail-stat">
                        <div class="story-detail-stat-number">${card.grade}</div>
                        <div class="story-detail-stat-label">معدل کل</div>
                    </div>
                    <div class="story-detail-stat">
                        <div class="story-detail-stat-number">${card.total_score}</div>
                        <div class="story-detail-stat-label">نمره کل</div>
                    </div>
                    <div class="story-detail-stat">
                        <div class="story-detail-stat-number">${card.status}</div>
                        <div class="story-detail-stat-label">وضعیت</div>
                    </div>
                </div>
            `;
        }
    });

    // Update carousel dots
    const dotsContainer = document.querySelector('.carousel-nav');
    if (dotsContainer) {
        dotsContainer.innerHTML = cards.map((_, i) => `
            <button class="carousel-dot ${i === 0 ? 'active' : ''}" onclick="scrollToStory(${i})"></button>
        `).join('');
    }
}

function renderBlog(posts) {
    const container = document.querySelector('.blog-grid');
    if (!container) return;

    container.innerHTML = posts.map(post => `
        <article class="blog-card fade-in">
            <img src="${post.image}" alt="${post.title}" class="blog-image">
            <div class="blog-content">
                <div class="blog-meta">
                    <span>📅 ${post.date}</span>
                    <span>⏱️ ${post.read_time}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
            </div>
        </article>
    `).join('');

    observeFadeElements();
}

function renderFAQ(faqs) {
    const container = document.querySelector('.faq-list');
    if (!container) return;

    container.innerHTML = faqs.map((faq, index) => `
        <div class="faq-item ${index === 0 ? 'active' : ''}">
            <div class="faq-question" onclick="toggleFaq(this)">
                <span>${faq.question}</span>
                <div class="faq-question-icon">▼</div>
            </div>
            <div class="faq-answer">
                <p>${faq.answer}</p>
            </div>
        </div>
    `).join('');
}

function applySettings(settings) {
    // Update contact info
    const phoneEl = document.querySelector('.contact-detail-text p');
    if (phoneEl && settings.phone) {
        const phoneDetail = document.querySelector('.contact-detail:nth-child(1) .contact-detail-text p');
        if (phoneDetail) phoneDetail.textContent = settings.phone;
    }

    const whatsappDetail = document.querySelector('.contact-detail:nth-child(2) .contact-detail-text p');
    if (whatsappDetail && settings.whatsapp) whatsappDetail.textContent = settings.whatsapp;

    const emailDetail = document.querySelector('.contact-detail:nth-child(3) .contact-detail-text p');
    if (emailDetail && settings.email) emailDetail.textContent = settings.email;

    const addressDetail = document.querySelector('.contact-detail:nth-child(4) .contact-detail-text p');
    if (addressDetail && settings.address) addressDetail.textContent = settings.address;

    // Update footer
    const footerPhone = document.querySelector('.footer-links a[href^="tel"]');
    if (footerPhone && settings.phone) {
        footerPhone.href = `tel:${settings.phone}`;
        footerPhone.textContent = settings.phone;
    }

    const footerEmail = document.querySelector('.footer-links a[href^="mailto"]');
    if (footerEmail && settings.email) {
        footerEmail.href = `mailto:${settings.email}`;
        footerEmail.textContent = settings.email;
    }
}

// ==================== COUNTDOWN TIMER ====================
let countdownInterval;

function startCountdown(konkurDateStr) {
    const konkurDate = new Date(konkurDateStr);
    const startDate = new Date(konkurDate);
    startDate.setFullYear(startDate.getFullYear() - 1);

    function updateCountdown() {
        const now = new Date();
        const diff = konkurDate - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '۰۰';
            document.getElementById('hours').textContent = '۰۰';
            document.getElementById('minutes').textContent = '۰۰';
            document.getElementById('seconds').textContent = '۰۰';
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
        const toPersian = (num) => num.toString().padStart(2, '0').split('').map(d => persianDigits[parseInt(d)]).join('');

        document.getElementById('days').textContent = toPersian(days);
        document.getElementById('hours').textContent = toPersian(hours);
        document.getElementById('minutes').textContent = toPersian(minutes);
        document.getElementById('seconds').textContent = toPersian(seconds);

        const totalTime = konkurDate - startDate;
        const elapsed = now - startDate;
        const progress = Math.min(100, Math.max(0, (elapsed / totalTime) * 100));

        const progressFill = document.getElementById('progressFill');
        const progressPercent = document.getElementById('progressPercent');

        if (progressFill) progressFill.style.width = progress + '%';
        if (progressPercent) progressPercent.textContent = Math.round(progress) + '٪';
    }

    updateCountdown();
    if (countdownInterval) clearInterval(countdownInterval);
    countdownInterval = setInterval(updateCountdown, 1000);
}

// ==================== UI FUNCTIONS ====================

function observeFadeElements() {
    const fadeElements = document.querySelectorAll('.fade-in:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => observer.observe(el));
}

function toggleFaq(element) {
    const faqItem = element.parentElement;
    const isActive = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
    });

    if (!isActive) {
        faqItem.classList.add('active');
    }
}

function showStory(index) {
    document.querySelectorAll('.story-item').forEach((item, i) => {
        item.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.story-detail-card').forEach((card, i) => {
        card.classList.toggle('active', i === index);
    });

    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}

function scrollToStory(index) {
    showStory(index);
    const carousel = document.getElementById('storyCarousel');
    const items = carousel.querySelectorAll('.story-item');
    if (items[index]) {
        items[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ درخواست شما با موفقیت ارسال شد';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        event.target.reset();
    }, 3000);
}

// ==================== NAVBAR ====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
    loadAllContent();

    // Create particles
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'hero-particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 6 + 's';
            particle.style.animationDuration = (4 + Math.random() * 4) + 's';
            particlesContainer.appendChild(particle);
        }
    }
});
