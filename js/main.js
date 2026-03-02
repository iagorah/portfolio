document.addEventListener('DOMContentLoaded', async () => {
    try {
        initObserver(); // Initialize observer first
        const response = await fetch('data/cv-data.json');
        const data = await response.json();
        renderCV(data);
        initInteractions();
    } catch (error) {
        console.error('Error loading CV data:', error);
    }
});

let observer;

function initObserver() {
    const observerOptions = {
        threshold: 0.12
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
}

function renderCV(data) {
    // ... rest of the function ...
    // 1. Profile / Hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        const eyebrow = heroContent.querySelector('.eyebrow');
        if (eyebrow) {
            if (data.profile.eyebrow) {
                eyebrow.textContent = data.profile.eyebrow;
                eyebrow.style.display = 'flex';
            } else {
                eyebrow.style.display = 'none';
            }
        }
        heroContent.querySelector('h1').innerHTML = `${data.profile.name} <span>${data.profile.title}</span>`;
        heroContent.querySelector('p').textContent = data.profile.description;

        // Update social links in hero if any (currently LinkedIn)
        const linkedinBtn = heroContent.querySelector('.btn-outline');
        if (linkedinBtn) linkedinBtn.href = data.profile.links.linkedin;
    }

    const heroPhoto = document.querySelector('.photo-wrapper img');
    if (heroPhoto) {
        heroPhoto.src = data.profile.photo;
        heroPhoto.alt = data.profile.name;
    }

    // 2. About Section
    const aboutSection = document.querySelector('#sobre');
    if (aboutSection) {
        const textContainer = aboutSection.querySelector('.about-grid > div:first-child');
        textContainer.querySelector('h2').textContent = data.about.title;

        // Replace existing paragraphs
        const paragraphs = textContainer.querySelectorAll('p');
        paragraphs.forEach(p => p.remove());

        data.about.paragraphs.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            textContainer.appendChild(p);
        });

        // Skills
        const skillsContainer = aboutSection.querySelector('.fade-up-d2');
        if (skillsContainer) {
            skillsContainer.innerHTML = ''; // Clear hardcoded
            data.about.skills.forEach(skillGroup => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'skill-group';

                const h3 = document.createElement('h3');
                h3.textContent = skillGroup.category;

                const badgesDiv = document.createElement('div');
                badgesDiv.className = 'skill-badges';

                skillGroup.items.forEach(skill => {
                    const badge = document.createElement('span');
                    badge.className = 'badge';
                    badge.textContent = skill;
                    badgesDiv.appendChild(badge);
                });

                groupDiv.appendChild(h3);
                groupDiv.appendChild(badgesDiv);
                skillsContainer.appendChild(groupDiv);
            });
        }
    }

    // 3. ProjectsSection
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        projectsGrid.innerHTML = ''; // Clear hardcoded
        data.projects.forEach((proj, index) => {
            const article = document.createElement('article');
            article.className = `project-card fade-up ${index > 0 ? 'fade-up-d' + index : ''}`;

            article.innerHTML = `
                <div class="project-header">
                    <div class="project-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                    </div>
                    <a href="${proj.link}" target="_blank" class="project-link">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                    </a>
                </div>
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                <div class="project-tags">
                    ${proj.tags.map(tag => `<span class="ptag ${proj.type ? 'tag-' + proj.type : ''}"><span></span> ${tag}</span>`).join('')}
                </div>
            `;
            projectsGrid.appendChild(article);
        });
    }

    // 4. Experience Section
    const timeline = document.querySelector('.timeline');
    if (timeline) {
        timeline.innerHTML = ''; // Clear hardcoded
        data.experience.forEach((exp, index) => {
            const expDiv = document.createElement('div');
            expDiv.className = 'timeline-item fade-up';

            expDiv.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-header">
                    <h3>${exp.role} — <span>${exp.company}</span></h3>
                    <span class="timeline-period">${exp.period}</span>
                </div>
                <p class="timeline-desc">${exp.description}</p>
                <div class="timeline-tags">
                    ${exp.tags.map(tag => `<span class="tag-tiny">${tag}</span>`).join('')}
                </div>
            `;
            timeline.appendChild(expDiv);
        });
    }

    // 5. Contact Section
    const contactLinks = document.querySelector('.contact-links');
    if (contactLinks) {
        const links = contactLinks.querySelectorAll('.contact-card');
        // LinkedIn
        if (links[0]) links[0].href = data.profile.links.linkedin;
        if (links[0] && links[0].querySelector('.contact-value')) {
            links[0].querySelector('.contact-value').textContent = data.profile.links.linkedin.replace('https://www.linkedin.com/in/', 'in/');
        }

        // WhatsApp (previously phone)
        if (links[1]) {
            const rawPhone = data.profile.links.phone.replace(/\D/g, '');
            const formattedPhone = rawPhone.length === 11 ? `55${rawPhone}` : rawPhone;
            links[1].href = `https://wa.me/${formattedPhone}`;
        }
        if (links[1] && links[1].querySelector('.contact-value')) {
            links[1].querySelector('.contact-value').textContent = data.profile.links.phone;
        }

        // Email
        if (links[2]) links[2].href = `mailto:${data.profile.links.email}`;
        if (links[2] && links[2].querySelector('.contact-value')) {
            links[2].querySelector('.contact-value').textContent = data.profile.links.email;
        }
    }

    // 6. Footer
    const footerSocials = document.querySelector('.footer-socials');
    if (footerSocials) {
        const links = footerSocials.querySelectorAll('a');
        if (links[0]) links[0].href = data.profile.links.linkedin;
        if (links[1]) links[1].href = data.profile.links.github;
    }

    const copyright = document.querySelector('.copyright');
    if (copyright) {
        copyright.textContent = `© ${new Date().getFullYear()} ${data.profile.name}. Portfólio Profissional.`;
    }

    // Re-observe animations since elements were added dynamically
    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// Interaction Logic

function initInteractions() {
    // Sticky Navigation
    const nav = document.querySelector('#navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

    // Hero initial animation
    setTimeout(() => {
        document.querySelectorAll('.hero .fade-up').forEach(el => el.classList.add('visible'));
    }, 100);

    // Smooth scroll for nav links with offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = target.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
