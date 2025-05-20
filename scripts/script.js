// Глобальные переменные
let currentSlide = 0;
let swiperInstance = null;

// Инициализация после полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initLoginModal();
    initContactForm();
    loadTestimonials();
});

// Плавная прокрутка
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (history.pushState) {
                    history.pushState(null, '', targetId);
                }
            }
        });
    });
}

// Модальное окно входа
function initLoginModal() {
    const modal = document.getElementById("loginModal");
    const btn = document.getElementById("loginBtn");
    const span = document.getElementsByClassName("close")[0];

    if (!modal || !btn) return;

    btn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = "block";

        const savedLogin = localStorage.getItem('savedLogin');
        const usernameInput = document.getElementById("username");
        if (savedLogin && usernameInput) {
            usernameInput.value = savedLogin;
            document.getElementById("remember")?.setAttribute('checked', true);
        }
    });

    if (span) {
        span.addEventListener('click', () => {
            modal.style.display = "none";
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const username = document.getElementById("username")?.value || '';
            const password = document.getElementById("password")?.value || '';
            const remember = document.getElementById("remember")?.checked || false;

            if (remember) {
                localStorage.setItem('savedLogin', username);
            } else {
                localStorage.removeItem('savedLogin');
            }

            if (username === "log" && password === "log") {
                window.location.href = "profile.html";
            } else {
                alert("Неверный логин или пароль!");
            }
        });
    }

    // Чекбокс "Запомнить"
    if (loginForm && !document.getElementById("remember")) {
        loginForm.insertAdjacentHTML(
            'beforeend',
            '<div class="form-group"><label><input type="checkbox" id="remember"> Запомнить меня</label></div>'
        );
    }
}

// Форма контакта
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    restoreFormData();

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        saveFormData();
        const successMessage = document.getElementById('successMessage');
        if (successMessage) successMessage.style.display = 'block';
        contactForm.style.display = 'none';

        setTimeout(() => {
            if (successMessage) successMessage.style.display = 'none';
            contactForm.style.display = 'block';
            contactForm.reset();
            localStorage.removeItem('formData');
        }, 5000);
    });
}

function saveFormData() {
    const formData = {
        name: document.getElementById("name")?.value || '',
        email: document.getElementById("email")?.value || '',
        message: document.getElementById("message")?.value || ''
    };
    localStorage.setItem('formData', JSON.stringify(formData));
}

function restoreFormData() {
    const savedData = localStorage.getItem('formData');
    if (!savedData) return;

    try {
        const data = JSON.parse(savedData);
        if (document.getElementById("name")) document.getElementById("name").value = data.name || '';
        if (document.getElementById("email")) document.getElementById("email").value = data.email || '';
        if (document.getElementById("message")) document.getElementById("message").value = data.message || '';
    } catch (e) {
        console.error("Ошибка восстановления данных формы:", e);
    }
}

// Загрузка отзывов из JSON
function loadTestimonials() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error(`Ошибка загрузки: ${response.statusText}`);
            return response.json();
        })
        .then(data => {
            renderTestimonials(data.testimonials);
            setTimeout(() => {
                initAnimations();
                initTestimonialsSlider();
            }, 100);
        })
        .catch(error => {
            console.error('Ошибка загрузки отзывов:', error);
            const wrapper = document.querySelector('.testimonials-slider');
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="error-message">
                        <p>Не удалось загрузить отзывы.</p>
                    </div>
                `;
            }
        });
}

// Отображение отзывов
function renderTestimonials(data) {
    const container = document.querySelector('.swiper-wrapper');
    if (!container) return;
    container.innerHTML = ''; // очистка
    data.forEach(({ text, author, authorInfo }) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide testimonial-card animate__animated animate__fadeInUp';
        slide.innerHTML = `
            <div class="testimonial-content">
                <p class="testimonial-text">"${text}"</p>
                <div class="testimonial-author">
                    <h4>${author}</h4>
                    <p>${authorInfo}</p>
                </div>
            </div>
        `;
        container.appendChild(slide);
    });
}

// Анимации (если подключена Animate.css)
function initAnimations() {
    const elements = document.querySelectorAll('.animate__animated');
    if (elements.length && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__fadeInUp');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        elements.forEach(el => observer.observe(el));
    } else {
        elements.forEach(el => el.classList.add('animate__fadeInUp'));
    }
}

function initTestimonialsSlider() {
    const container = document.querySelector('.testimonials-slider');
    if (!container) return;

    if (window.swiperInstance && typeof swiperInstance.destroy === 'function') {
        window.swiperInstance.destroy(true, true);
    }

    window.swiperInstance = new Swiper('.testimonials-slider', {
        loop: false, // ❌ Без дублирования
        slidesPerView: 1, // ✅ Только один отзыв на экране
        spaceBetween: 30,
        autoplay: false, // ❌ Без автопрокрутки (если хочешь — можно включить)
        pagination: {
            el: '.swiper-pagination',
            clickable: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev'
        }
        // ❌ breakpoints удалены
    });
}
// Скрытие прелоадера после загрузки страницы
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1500);
    }

    window.addEventListener('resize', () => {
        if (swiperInstance && !swiperInstance.destroyed) {
            swiperInstance.update();
        }
    });
});