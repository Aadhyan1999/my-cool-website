// ============================================
// NAVIGATION — Scroll spy + button clicks
// ============================================
const navButtons = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('.section');
const navbar = document.getElementById('navbar');

// Smooth scroll on nav button click
navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.section;
        const target = document.getElementById(targetId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Scroll spy — highlight active nav button
function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section.id;
        }
    });

    navButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.section === current);
    });

    // Navbar background on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ============================================
// REVEAL ON SCROLL — Intersection Observer
// ============================================
function setupRevealAnimations() {
    const revealElements = document.querySelectorAll(
        '.about-card, .sport-card, .hobby-card, .gallery-item, .section-header'
    );

    revealElements.forEach(el => el.classList.add('reveal'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

setupRevealAnimations();

// ============================================
// FLOATING SPORTS PARTICLES (BASKETBALLS & FOOTBALLS)
// ============================================
function createSportsParticles() {
    const container = document.getElementById('leafParticles');
    const particleCount = 20;
    const sports = ['🏀', '🏈'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'apple-emoji'; // Reuse particle styling
        particle.textContent = sports[Math.floor(Math.random() * sports.length)];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDuration = `${12 + Math.random() * 14}s`;
        particle.style.animationDelay = `${Math.random() * 18}s`;
        particle.style.fontSize = `${16 + Math.random() * 16}px`;
        container.appendChild(particle);
    }
}

createSportsParticles();

// ============================================
// INTERACTIVE LEGO BUILDER
// ============================================
const legoCanvas = document.getElementById('legoCanvas');
const legoReset = document.getElementById('legoReset');
const legoColors = ['#e63946', '#1d3557', '#ffb703', '#2a9d8f', '#8338ec', '#fb5607'];

if (legoCanvas) {
    legoCanvas.addEventListener('click', (e) => {
        // Prevent click when hitting a brick directly (so we stack/add logically)
        if (e.target.classList.contains('lego-brick')) {
            return;
        }
        
        const brick = document.createElement('div');
        brick.className = 'lego-brick';
        const randomColor = legoColors[Math.floor(Math.random() * legoColors.length)];
        brick.style.backgroundColor = randomColor;
        
        // Random width for different lego size variations
        const widths = ['28px', '40px', '52px'];
        brick.style.width = widths[Math.floor(Math.random() * widths.length)];
        
        legoCanvas.appendChild(brick);
    });
}

if (legoReset) {
    legoReset.addEventListener('click', () => {
        if (legoCanvas) {
            legoCanvas.innerHTML = '';
        }
    });
}

// ============================================
// INTERACTIVE RECORDER (AUDIO SYNTESIZER)
// ============================================
const noteButtons = document.querySelectorAll('.note-btn');
const noteDisplay = document.getElementById('noteDisplay');
let audioCtx = null;

function playTone(freq) {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Resume context if suspended (required by browsers for user interaction)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle'; // Triangle wave sounds a bit closer to a recorder/flute
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        
        // Quick volume envelope to sound pleasant
        gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.6);
    } catch (err) {
        console.warn('AudioContext not supported or blocked:', err);
    }
}

noteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const note = btn.dataset.note;
        const freq = parseFloat(btn.dataset.freq);
        
        // Play audio
        playTone(freq);
        
        // Show active state
        btn.classList.add('playing');
        setTimeout(() => btn.classList.remove('playing'), 150);
        
        // Display note feedback
        if (noteDisplay) {
            noteDisplay.textContent = `🎵 Play: Note ${note} (${Math.round(freq)}Hz)`;
            noteDisplay.classList.remove('pulse');
            void noteDisplay.offsetWidth; // Trigger reflow for animation restart
            noteDisplay.classList.add('pulse');
        }
    });
});

// ============================================
// PARALLAX — Subtle on plant decorations
// ============================================
const plantLeft = document.querySelector('.plant-left');
const plantRight = document.querySelector('.plant-right');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const speed = 0.08;

    if (plantLeft) {
        plantLeft.style.transform = `translateY(${scrollY * speed}px)`;
    }
    if (plantRight) {
        plantRight.style.transform = `translateY(${scrollY * speed * 0.7}px)`;
    }
}, { passive: true });
