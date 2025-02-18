// Configuración del juego
const CONFIG = {
    totalCasillas: 80,
    serpientes: { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 77: 24, 73: 51 },
    escaleras: { 3: 22, 6: 25, 11: 40, 20: 59, 27: 74, 35: 44, 50: 69, 70: 79 }
};

// Estado del juego
const estado = {
    posiciones: [0, 0],
    turno: 0,
    juegoTerminado: false
};

// Referencias DOM
const tablero = document.getElementById("tablero");
const mensaje = document.getElementById("mensaje");
const btnLanzar = document.getElementById("lanzarDado");

// Almacena las casillas y fichas
let casillas = {};
let fichas = [];

// Inicialización del juego
function inicializarJuego() {
    crearTablero();
    crearFichas();
    inicializarEventos();
    actualizarTablero();
}

// Crear el tablero
function crearTablero() {
    for (let fila = 7; fila >= 0; fila--) {
        for (let columna = 0; columna < 10; columna++) {
            const numero = fila % 2 === 0 
                ? fila * 10 + (columna + 1)
                : fila * 10 + (10 - columna);

            const casilla = document.createElement("div");
            casilla.classList.add("casilla");
            casilla.setAttribute("data-number", numero);
            casilla.setAttribute("id", `casilla-${numero}`);

            if (CONFIG.serpientes[numero]) {
                casilla.classList.add("serpiente");
            } else if (CONFIG.escaleras[numero]) {
                casilla.classList.add("escalera");
            }

            casillas[numero] = casilla;
            tablero.appendChild(casilla);
        }
    }
}

// Crear fichas de los jugadores
function crearFichas() {
    for (let i = 0; i < 2; i++) {
        const ficha = document.createElement("div");
        ficha.classList.add("ficha", `ficha${i + 1}`);
        tablero.appendChild(ficha);
        fichas.push(ficha);
    }
}

// Inicializar eventos
function inicializarEventos() {
    btnLanzar.addEventListener("click", turnoJugador);
}

// Manejar el turno del jugador
function turnoJugador() {
    if (estado.juegoTerminado) return;

    const dado = Math.floor(Math.random() * 6) + 1;
    mensaje.innerText = `🎲 Jugador ${estado.turno + 1} ha sacado un ${dado}`;
    moverFicha(estado.turno, dado);
}

// Mover ficha
function moverFicha(jugador, avance) {
    let nuevaPos = estado.posiciones[jugador] + avance;

    if (nuevaPos >= CONFIG.totalCasillas) {
        finalizarJuego(jugador);
        return;
    }

    if (CONFIG.serpientes[nuevaPos]) {
        nuevaPos = CONFIG.serpientes[nuevaPos];
        mensaje.innerText += ` 🐍 ¡Oh no! Serpiente a la casilla ${nuevaPos}`;
    } else if (CONFIG.escaleras[nuevaPos]) {
        nuevaPos = CONFIG.escaleras[nuevaPos];
        mensaje.innerText += ` 🪜 ¡Genial! Escalera a la casilla ${nuevaPos}`;
    }

    estado.posiciones[jugador] = nuevaPos;
    animarFicha(fichas[jugador], nuevaPos);
    estado.turno = (estado.turno + 1) % 2;
}

// Animar ficha
function animarFicha(ficha, numero) {
    const casillaDestino = casillas[numero];
    const rectTablero = tablero.getBoundingClientRect();
    const rectCasilla = casillaDestino.getBoundingClientRect();

    const offsetX = rectCasilla.left - rectTablero.left + (rectCasilla.width / 4);
    const offsetY = rectCasilla.top - rectTablero.top + (rectCasilla.height / 4);

    ficha.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

// Finalizar juego
function finalizarJuego(jugador) {
    estado.juegoTerminado = true;
    mensaje.innerHTML = `🎉 ¡Jugador ${jugador + 1} ha ganado! 🎉<br>
        <small>Recarga la página para jugar de nuevo</small>`;
    btnLanzar.disabled = true;
}

// Actualizar posiciones del tablero
function actualizarTablero() {
    fichas.forEach((ficha, index) => animarFicha(ficha, estado.posiciones[index]));
}

// Iniciar el juego cuando se carga la página
window.addEventListener('load', inicializarJuego);

// Actualizar posiciones cuando cambia el tamaño de la ventana
window.addEventListener('resize', () => {
    requestAnimationFrame(actualizarTablero);
});