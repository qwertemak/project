let currentSlide = 0; // Добавьте это в начало файла

 
 
 
 // Простая инициализация анимаций (Animate.css)
 document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.animate__animated');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__fadeInUp'); // Или другую анимацию
                observer.unobserve(entry.target); // Прекращаем наблюдение после срабатывания
            }
        });
    }, {
        threshold: 0.2 // Элемент видим на 20%
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const testimonials = document.querySelector('.testimonial-cards');
    const slides = Array.from(document.querySelectorAll('.testimonial-card'));
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const sliderDots = document.querySelector('.slider-dots');
    let currentSlide = 0;

    // Добавляем ширину контейнера для корректного смещения
    testimonials.style.width = `${slides.length * 100}%`;

    // Создаём индикаторы
    slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        dot.dataset.slide = index;
        sliderDots.appendChild(dot);
    });

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        testimonials.style.transform = `translateX(-${100 * currentSlide}%)`;

        // Обновляем активный индикатор
        document.querySelectorAll('.slider-dot').forEach(dot => dot.classList.remove('active'));
        sliderDots.children[slideIndex].classList.add('active');
    }

    // Обработчики кнопок
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : slides.length - 1;
        goToSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide < slides.length - 1) ? currentSlide + 1 : 0;
        goToSlide(currentSlide);
    });

    // Обработчик кликов по индикаторам
    sliderDots.addEventListener('click', (e) => {
        if (e.target.classList.contains('slider-dot')) {
            goToSlide(parseInt(e.target.dataset.slide));
        }
    });

    // Инициализация
    goToSlide(0);
});



// Плавная прокрутка при клике на якорные ссылки
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  


  // Получаем элементы
var modal = document.getElementById("loginModal");
var btn = document.getElementById("loginBtn");
var span = document.getElementsByClassName("close")[0];

// Открытие модального окна
btn.onclick = function() {
  modal.style.display = "block";
}

// Закрытие модального окна
span.onclick = function() {
  modal.style.display = "none";
}

// Закрытие модального окна при клике вне его
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Обработка отправки формы
document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault(); // Отменить стандартное поведение (перезагрузка страницы)

  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Проверка логина и пароля
  if (username === "log" && password === "log") {
    // Перенаправление на страницу профиля
    window.location.href = "profile.html";
  } else {
    alert("Неверный логин или пароль!");
  }

  // Закрытие модального окна после отправки
  modal.style.display = "none";
});




    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault(); // Отменить стандартное поведение формы (перезагрузку страницы)


        // Показываем уведомление об успешной отправке
        document.getElementById('successMessage').style.display = 'block';

        // Скрываем форму после отправки
        document.getElementById('contactForm').style.display = 'none';

        // Можно добавить дополнительную задержку, прежде чем скрыть уведомление, например, через 5 секунд:
        setTimeout(function() {
            document.getElementById('successMessage').style.display = 'none';
            document.getElementById('contactForm').style.display = 'block'; // Восстановим форму (если нужно)
        }, 5000); // Уведомление исчезает через 5 секунд
    });

