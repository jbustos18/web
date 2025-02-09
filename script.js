document.addEventListener("DOMContentLoaded", function () {
    var swiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: false,
        on: {
            slideChange: function () {
                var progressBar = document.getElementById('progressBar');
                progressBar.style.width = ((this.activeIndex + 1) / this.slides.length * 100) + '%';
            }
        }
    });
    const letterContainer = document.querySelector('.container-letter');
    const cover = document.querySelector('.cover');
    const paper = document.querySelector('.paper');
    const section3 = document.querySelector('.section3-content');
    const notificationSound = document.getElementById("notificationSound");

    let isOpen = false;
    let heartInterval = null;

    letterContainer.addEventListener("click", function () {
        if (!isOpen) {
            cover.classList.add('open-cover');
            cover.style.pointerEvents = "auto"; // Asegura que la tapa sigue interactuable

            // Reproducir sonido de notificación
            notificationSound.currentTime = 0; // Reinicia el sonido si se ha reproducido antes
            notificationSound.play();

            setTimeout(() => {
                paper.classList.add('open-paper');
                startHeartFall();
            }, 500);

            isOpen = true;
        } else {
            cover.classList.remove('open-cover');
            cover.style.pointerEvents = "auto"; // Evita que el clic desaparezca

            paper.classList.remove('open-paper');

            stopHeartFall();
            isOpen = false;
        }
    });

    function startHeartFall() {
        if (heartInterval) return;

        heartInterval = setInterval(() => {
            if (!section3) {
                clearInterval(heartInterval);
                return;
            }

            const heart = document.createElement("span");
            heart.innerHTML = "♥";
            heart.classList.add("heart-fall");

            heart.style.left = `${Math.random() * 100}vw`;
            heart.style.top = `-5vh`;
            heart.style.animationDuration = `${3 + Math.random() * 3}s`;

            document.body.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 6000);
        }, 150);
    }

    function stopHeartFall() {
        clearInterval(heartInterval);
        heartInterval = null;

        document.querySelectorAll(".heart-fall").forEach(heart => heart.remove());
    }
});
