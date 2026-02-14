document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const heartsContainer = document.getElementById('hearts-container');
    const burstContainer = document.getElementById('click-burst-container');
    const sections = {
        landing: document.getElementById('landing'),
        message: document.getElementById('message-section'),
        question: document.getElementById('valentine-question'),
        celebration: document.getElementById('celebration')
    };

    const beginBtn = document.getElementById('begin-btn');
    const continueBtn = document.getElementById('continue-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');

    const messageParagraphs = document.querySelectorAll('.message-paragraph');

    // --- Configurations ---

    const heartEmojis = ['❤️', '💖', '💗', '💓', '💘', '✨', '🌸', '💝'];

    // --- Floating Hearts Background ---
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

        const size = Math.random() * 25 + 10;
        const left = Math.random() * 100;
        const duration = Math.random() * 12 + 12; // Slower for magical feel
        const drift = (Math.random() - 0.5) * 300;

        heart.style.left = `${left}%`;
        heart.style.fontSize = `${size}px`;
        heart.style.setProperty('--duration', `${duration}s`);
        heart.style.setProperty('--drift', `${drift}px`);

        heartsContainer.appendChild(heart);
        setTimeout(() => heart.remove(), duration * 1000);
    }

    // Spawn initial hearts and then interval
    for (let i = 0; i < 20; i++) {
        setTimeout(createFloatingHeart, Math.random() * 5000);
    }
    setInterval(createFloatingHeart, 1200);

    // --- Click Burst Effect ---
    function createBurst(x, y, count = 12) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

            const destX = (Math.random() - 0.5) * 400;
            const destY = (Math.random() - 0.5) * 400;

            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.setProperty('--x', `${destX}px`);
            particle.style.setProperty('--y', `${destY}px`);

            burstContainer.appendChild(particle);
            setTimeout(() => particle.remove(), 800);
        }
    }

    window.addEventListener('mousedown', (e) => {
        createBurst(e.clientX, e.clientY);
    });

    // --- Section Navigation ---
    function showSection(sectionId) {
        Object.values(sections).forEach(s => {
            s.classList.add('hidden');
            s.classList.remove('active');
        });
        sections[sectionId].classList.remove('hidden');
        setTimeout(() => sections[sectionId].classList.add('active'), 100);
    }

    // --- Landing -> Message Flow ---
    beginBtn.addEventListener('click', () => {
        showSection('message');
        animateMessage();


    });

    function animateMessage() {
        const paraDelay = 1500;
        messageParagraphs.forEach((para, index) => {
            setTimeout(() => {
                para.classList.add('animate');
                const rect = para.getBoundingClientRect();
                createBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);

                // Show continue button only after the LAST paragraph has been visible for a while
                if (index === messageParagraphs.length - 1) {
                    setTimeout(() => {
                        continueBtn.classList.remove('hidden');
                        continueBtn.classList.add('animate-fade-in');
                    }, 4000);
                }
            }, index * paraDelay);
        });
    }

    // --- Message -> Question Flow ---
    continueBtn.addEventListener('click', () => {
        showSection('question');
    });

    // --- Evasive No Button ---
    function moveNoButton() {
        // Force fixed position to avoid container constraints
        noBtn.style.position = 'fixed';

        const padding = 20; // Smaller padding for mobile
        const rect = noBtn.getBoundingClientRect();
        const btnWidth = rect.width || 120;
        const btnHeight = rect.height || 50;

        // Calculate maximum safe coordinates within the viewport
        const maxX = window.innerWidth - btnWidth - padding;
        const maxY = window.innerHeight - btnHeight - padding;

        // Ensure bounds are safe (never less than padding)
        const safeMaxX = Math.max(padding, maxX);
        const safeMaxY = Math.max(padding, maxY);

        // Generate new random position strictly within bounds
        const newX = Math.floor(Math.random() * (safeMaxX - padding)) + padding;
        const newY = Math.floor(Math.random() * (safeMaxY - padding)) + padding;

        // Apply new position with high z-index and smooth transition
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
        noBtn.style.margin = '0';
        noBtn.style.zIndex = '100000';
        noBtn.style.transition = 'left 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';

        // Feedback burst at the new location
        createBurst(newX + btnWidth / 2, newY + btnHeight / 2, 5);
    }

    noBtn.addEventListener('mouseover', moveNoButton);
    // On mobile, click triggers mouseenter/mouseover often, so we handle touch separately
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    }, { passive: false });

    // --- Celebration Flow ---
    yesBtn.addEventListener('click', () => {
        showSection('celebration');
        startCelebration();
    });

    function startCelebration() {
        const interval = setInterval(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            createBurst(x, y, 15);
        }, 150);

        setTimeout(() => clearInterval(interval), 5000);
    }


});
