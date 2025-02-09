document.addEventListener("DOMContentLoaded", function () {
    // 🎶 Elemento de audio
    const music = document.getElementById("backgroundMusic");

    // 🎵 Lista de reproducción con iconos y títulos
    let playlist = [
        { src: "sounds/song1.mp3", title: "Amandote", icon: "img/song1.jpg" },
        { src: "sounds/song2.mp3", title: "Antes de Perderte", icon: "img/song2.jpg" },
        { src: "sounds/song3.mp3", title: "Lo que Siento", icon: "img/song3.jpg" }
    ];

    let currentSong = 0;
    let fadeOut = null;
    let fadeIn = null;

    // 🔹 Inicializar la primera canción
    function loadCurrentSong(play = false) {
        music.src = playlist[currentSong].src;
        document.getElementById("songTitle").textContent = playlist[currentSong].title;
        document.getElementById("songIcon").src = playlist[currentSong].icon;
        music.volume = 0.05; // 🎧 Volumen más bajo por defecto

        if (play) {
            music.play().catch(error => console.log("🎵 Error de reproducción automática: ", error));
        }
    }

    loadCurrentSong(); // Carga la primera canción pero sin reproducir

    // 🎶 Función para cambiar de canción con crossfade de 3s
    function crossfadeNextSong(next = true) {
        clearInterval(fadeOut);
        clearInterval(fadeIn);

        fadeOut = setInterval(() => {
            if (music.volume > 0.02) {
                music.volume -= 0.02;
            } else {
                clearInterval(fadeOut);
                music.pause();

                // Cambiar a la siguiente o anterior canción
                currentSong = next 
                    ? (currentSong + 1) % playlist.length 
                    : (currentSong - 1 + playlist.length) % playlist.length;

                loadCurrentSong(true);

                fadeIn = setInterval(() => {
                    if (music.volume < 0.05) { // Volumen moderado
                        music.volume += 0.02;
                    } else {
                        clearInterval(fadeIn);
                    }
                }, 150);
            }
        }, 150);
    }

    // 🔄 Cambiar canción automáticamente al terminar
    music.addEventListener("ended", () => crossfadeNextSong(true));

    // 🖱 Botones de reproducción manual
    document.getElementById("prevSong").addEventListener("click", () => crossfadeNextSong(false));
    document.getElementById("nextSong").addEventListener("click", () => crossfadeNextSong(true));

    // 🎶 Autoplay al hacer clic en cualquier parte de la página
    document.addEventListener("click", () => {
        if (music.paused) {
            music.play().catch(error => console.log("🎵 Error de reproducción automática: ", error));
        }
    }, { once: true }); // Se activa solo la primera vez
});
