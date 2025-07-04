document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо елементи DOM
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const carousel = document.querySelector('.carousel');
    const slides = document.querySelectorAll('.carousel .list .item');
    const thumbnails = document.querySelectorAll('.thumbnail .item');
    const timeElement = document.querySelector('.time');
    
    // Налаштування
    const slideCount = slides.length;
    let currentIndex = 0;
    let isAutoPlaying = true;
    let timeInterval;
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 секунд
    
    // Ініціалізація слайдера
    function initSlider() {
        updateSlider();
        startAutoPlay();
        setupEventListeners();
    }
    
    // Оновлення стану слайдера
    function updateSlider() {
        // Оновлення слайдів
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === currentIndex);
        });
        
        // Оновлення мініатюр
        thumbnails.forEach((thumb, index) => {
            thumb.classList.toggle('active', index === currentIndex);
        });
        
        // Скидання індикатора прогресу
        resetProgressBar();
    }
    
    // Наступний слайд
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }
    
    // Попередній слайд
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    }
    
    // Перехід до конкретного слайду
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    // Скидання анімації індикатора прогресу
    function resetProgressBar() {
        timeElement.style.width = '0%';
        clearInterval(timeInterval);
        
        timeInterval = setInterval(() => {
            const currentWidth = parseFloat(timeElement.style.width);
            timeElement.style.width = (currentWidth + 0.5) + '%';
            
            if (currentWidth >= 100) {
                clearInterval(timeInterval);
                if (isAutoPlaying) {
                    nextSlide();
                }
            }
        }, autoPlayDelay / 200);
    }
    
    // Запуск автоматичної зміни слайдів
    function startAutoPlay() {
        if (isAutoPlaying) {
            autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
            resetProgressBar();
        }
    }
    
    // Пауза автоматичної зміни
    function pauseAutoPlay() {
        clearInterval(autoPlayInterval);
        clearInterval(timeInterval);
        isAutoPlaying = false;
    }
    
    // Продовження автоматичної зміни
    function resumeAutoPlay() {
        isAutoPlaying = true;
        startAutoPlay();
    }
    
    // Налаштування обробників подій
    function setupEventListeners() {
        // Кнопки навігації
        nextBtn.addEventListener('click', () => {
            pauseAutoPlay();
            nextSlide();
            setTimeout(resumeAutoPlay, autoPlayDelay * 2);
        });
        
        prevBtn.addEventListener('click', () => {
            pauseAutoPlay();
            prevSlide();
            setTimeout(resumeAutoPlay, autoPlayDelay * 2);
        });
        
        // Навігація по мініатюрах
        thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => {
                pauseAutoPlay();
                goToSlide(index);
                setTimeout(resumeAutoPlay, autoPlayDelay * 2);
            });
        });
        
        // Кліки по кнопках
        document.querySelectorAll('.see-more').forEach(button => {
            button.addEventListener('click', function() {
                alert('Ви натиснули "Детальніше" для ' + 
                     this.closest('.item').querySelector('.title').textContent);
            });
        });
        
        document.querySelectorAll('.subscribe').forEach(button => {
            button.addEventListener('click', function() {
                alert('Дякуємо за підписку на ' + 
                     this.closest('.item').querySelector('.title').textContent);
            });
        });
        
        // Пауза при наведенні
        carousel.addEventListener('mouseenter', pauseAutoPlay);
        carousel.addEventListener('mouseleave', resumeAutoPlay);
        
        // Обробка дотиків для мобільних пристроїв
        let touchStartX = 0;
        let touchEndX = 0;
        
        carousel.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            pauseAutoPlay();
        }, {passive: true});
        
        carousel.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            setTimeout(resumeAutoPlay, autoPlayDelay * 2);
        }, {passive: true});
        
        function handleSwipe() {
            const difference = touchStartX - touchEndX;
            if (difference > 50) {
                nextSlide(); // Свайп вліво
            } else if (difference < -50) {
                prevSlide(); // Свайп вправо
            }
        }
    }
    
    // Ініціалізація слайдера
    initSlider();
});