// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Header scroll effect
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = event.target.closest('.navbar') || event.target.closest('.mobile-menu');
        if (!isClickInsideNav && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });

    // Simple active nav link on click - No scroll detection
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Remove active from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active to clicked link
            this.classList.add('active');

            // Smooth scroll if it's an anchor link
            if (href && href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('.newsletter-input').value;
            if (email) {
                alert('Cảm ơn bạn đã đăng ký nhận tin! Chúng tôi sẽ gửi email cho bạn sớm nhất.');
                this.querySelector('.newsletter-input').value = '';
            }
        });
    }

    // Countdown Timer Functionality
    function updateCountdown() {
        const countdownTimers = document.querySelectorAll('.countdown-timer');
        
        countdownTimers.forEach(timer => {
            const endTimeString = timer.getAttribute('data-end-time');
            if (!endTimeString) return;

            const endTime = new Date(endTimeString).getTime();
            const now = new Date().getTime();
            const distance = endTime - now;

            if (distance < 0) {
                // Timer has expired
                timer.querySelectorAll('.countdown-value').forEach(value => {
                    value.textContent = '00';
                });
                return;
            }

            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update display
            const daysElement = timer.querySelector('[data-unit="days"]');
            const hoursElement = timer.querySelector('[data-unit="hours"]');
            const minutesElement = timer.querySelector('[data-unit="minutes"]');
            const secondsElement = timer.querySelector('[data-unit="seconds"]');

            if (daysElement) daysElement.textContent = String(days).padStart(2, '0');
            if (hoursElement) hoursElement.textContent = String(hours).padStart(2, '0');
            if (minutesElement) minutesElement.textContent = String(minutes).padStart(2, '0');
            if (secondsElement) secondsElement.textContent = String(seconds).padStart(2, '0');
        });
    }

    // Update countdown every second
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Tours Carousel Functionality
    const toursCarousel = document.querySelector('.tours-carousel');
    if (toursCarousel) {
        const carouselTrack = toursCarousel.querySelector('.tours-carousel-track');
        const tourCards = carouselTrack.querySelectorAll('.tour-card');
        const prevBtn = document.querySelector('.carousel-btn-prev');
        const nextBtn = document.querySelector('.carousel-btn-next');
        const dotsContainer = document.querySelector('.carousel-dots');
        
        let currentIndex = 0;
        let cardsPerView = 1;
        let totalSlides = 0;

        // Calculate cards per view based on screen size
        function getCardsPerView() {
            const width = window.innerWidth;
            if (width >= 1024) {
                return 3; // Desktop: 3 cards
            } else if (width >= 768) {
                return 2; // Tablet: 2 cards
            } else {
                return 1; // Mobile: 1 card
            }
        }

        // Calculate total slides
        function calculateTotalSlides() {
            cardsPerView = getCardsPerView();
            totalSlides = Math.max(0, tourCards.length - cardsPerView);
            return totalSlides;
        }

        // Update carousel position
        function updateCarousel() {
            if (tourCards.length === 0) return;
            
            const carouselWidth = toursCarousel.offsetWidth;
            const gap = parseInt(getComputedStyle(carouselTrack).gap) || 24;
            const cardWidth = (carouselWidth - (gap * (cardsPerView - 1))) / cardsPerView;
            const translateX = -(currentIndex * (cardWidth + gap));
            
            carouselTrack.style.transform = `translateX(${translateX}px)`;
            
            // Update buttons
            if (prevBtn) {
                prevBtn.disabled = currentIndex === 0;
            }
            if (nextBtn) {
                nextBtn.disabled = currentIndex >= totalSlides;
            }
            
            // Update dots
            updateDots();
        }

        // Create dots
        function createDots() {
            if (!dotsContainer) return;
            
            dotsContainer.innerHTML = '';
            const totalDots = totalSlides + 1;
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Chuyển đến slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        // Update dots active state
        function updateDots() {
            if (!dotsContainer) return;
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Go to specific slide
        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, totalSlides));
            updateCarousel();
        }

        // Next slide
        function nextSlide() {
            if (currentIndex < totalSlides) {
                currentIndex++;
                updateCarousel();
            }
        }

        // Previous slide
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Initialize carousel
        function initCarousel() {
            calculateTotalSlides();
            createDots();
            updateCarousel();
        }

        // Event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }

        // Handle window resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                calculateTotalSlides();
                createDots();
                // Reset to first slide if current index is out of bounds
                if (currentIndex > totalSlides) {
                    currentIndex = totalSlides;
                }
                updateCarousel();
            }, 250);
        });

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        carouselTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next
                    nextSlide();
                } else {
                    // Swipe right - previous
                    prevSlide();
                }
            }
        }

        // Initialize on load
        initCarousel();
        
        // Recalculate on images load (in case images affect layout)
        const images = carouselTrack.querySelectorAll('img');
        let imagesLoaded = 0;
        images.forEach(img => {
            if (img.complete) {
                imagesLoaded++;
            } else {
                img.addEventListener('load', () => {
                    imagesLoaded++;
                    if (imagesLoaded === images.length) {
                        setTimeout(initCarousel, 100);
                    }
                });
            }
        });
        
        if (imagesLoaded === images.length) {
            setTimeout(initCarousel, 100);
        }
    }
});

