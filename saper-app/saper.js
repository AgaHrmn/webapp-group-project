// variables / zmienne

const levelsList = [
    { rows: 8, columns: 8, bombs: 3 },
    { rows: 10, columns: 10, bombs: 3 },
    { rows: 12, columns: 12, bombs: 12 }
];
let level = 0;
let nextLvlButtonGenerated = false;
let board = [];
const bombs_location = [];
let squares_clicked = 0;
const is_flagged = false;
let game_over_flag = false;
let lvl_won_flag = false;


window.onload = function () {
    startGame();
}

// function to add board / dodanie planszy
function startGame() {
    document.getElementById("bombs_left").innerText = "( ͡° ͜ʖ ͡°)☞" + levelsList[level].bombs + "💣";
    generateCoordinates();

    const rows = levelsList[level].rows;
    const columns = levelsList[level].columns;

    for (let i = 0; i < levelsList[level].rows; i++) {
        let row = [];
        for (let v = 0; v < levelsList[level].columns; v++) {
            let square = document.createElement("div");
            square.id = i.toString() + "-" + v.toString();
            square.addEventListener("click", clickSquare);
            square.addEventListener("contextmenu", putFlag);
            document.getElementById("board").append(square);
            row.push(square);
        }
        board.push(row);
    }

    document.documentElement.style.setProperty('--rows', rows);
    document.documentElement.style.setProperty('--columns', columns);
    // Dodaj klasę do body, aby dynamicznie ustawić tło w zależności od poziomu trudności
    document.body.className = `level-${level + 1}`;
}

function playExplosionSound() {
    const explosionSound = document.getElementById("explosionSound");
    explosionSound.play();
}

function showExplosionGif() {
    const explosionGif = document.getElementById("explosionGif");
    explosionGif.style.display = "block";
}

// function to trigger flag placement / funkcja do pzycisku flagi (rozmieszczanie na planszy)
function putFlag(event) {
    event.preventDefault();
    let square = this;
    if (game_over_flag || this.classList.contains("square_clicked")) {
        return;
    }
    if (square.innerText == "") {
        square.innerText = "🚩";
    } else if (square.innerText == "🚩") {
        square.innerText = "";
    }
}

// function to make square clickable / dodanie funkcjonalności przycisku do pól planszy
function clickSquare() {
    if (game_over_flag || this.classList.contains("square_clicked")) {
        return;
    }
    let square = this;
    if (is_flagged) {
        if (square.innerText == "") {
            square.innerText = "🚩";
        } else if (square.innerText == "🚩") {
            square.innerText = "";
        }
        return;
    }
    if (gameOver(square)) {
        playAgain();
        return;
    } else if (lvlWon(square)) {
        if (gameWon()) {
            let nextLvl_butt = document.getElementById("nextLvl_butt");
            nextLvl_butt.removeEventListener("click", lvlUp);
            nextLvl_butt.textContent = "( ͡° ͜ʖ ͡°)"
            document.getElementById("bombs_left").innerText = "GG WP!";
        } else {
            nextLvl();
        }
        return;
    }

    let squareCoordinates = square.id.split("-");
    let r = parseInt(squareCoordinates[0]);
    let c = parseInt(squareCoordinates[1]);
    showNeighboringBombs(r, c);
}

// function to generate random coordinates / wygeneruj koordynanty dla bomb
function generateCoordinates() {
    do {
        let r = Math.floor(Math.random() * levelsList[level].bombs);
        let c = Math.floor(Math.random() * levelsList[level].bombs);
        let coordinate = r.toString() + "-" + c.toString();
        if (!bombs_location.includes(coordinate)) {
            bombs_location.push(coordinate)
        }
    } while (bombs_location.length < levelsList[level].bombs);
    squares_clicked += 1;
    console.log(bombs_location);
}

// function to show all the bombs / pokaż wszystkie bomby na planszy
function showBombs() {
    for (let r = 0; r < levelsList[level].rows; r++) {
        for (let c = 0; c < levelsList[level].columns; c++) {
            let square = board[r][c];
            if (bombs_location.includes(square.id)) {
                square.innerText = "💣";
                square.style.backgroundColor = "red";
            }
        }
    }
}

// function to show neighboring bombs / sprawdz sąsiadujące pola (czy mają bomby)
function showNeighboringBombs(r, c) {
    if (r < 0 || r >= levelsList[level].rows || c < 0 || c >= levelsList[level].columns) {
        return;
    }
    if (board[r][c].classList.contains("square_clicked")) {
        return;
    }

    board[r][c].classList.add("square_clicked");
    squares_clicked += 1;

    let bombs_found = 0;

    for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            bombs_found += checkSquare(i, j);
        }
    }

    if (bombs_found > 0) {
        board[r][c].innerText = bombs_found;
        board[r][c].classList.add("x" + bombs_found.toString())

    } else {
        for (let i = r - 1; i <= r + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                showNeighboringBombs(i, j);
            }
        }
    }
}

// function to check neighboring squares / sprawdz sąsiadujące pola (czy mają bomby)
function checkSquare(r, c) {
    if (r < 0 || r >= levelsList[level].rows || c < 0 || c >= levelsList[level].columns) {
        return 0;
    }
    if (bombs_location.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function gameOver(s) {
    if (bombs_location.includes(s.id) && s.innerText == "") {
        showBombs();
        showExplosionGif();
        playExplosionSound()
        game_over_flag = true;
        return true;
    }
    return false;
}

function clearBoard() {
    let boardContainer = document.getElementById("board");

    boardContainer.childNodes.forEach(row => {
        row.childNodes.forEach(square => {
            square.removeEventListener("click", clickSquare);
            square.removeEventListener("contextmenu", putFlag);
        });
    });

    while (boardContainer.firstChild) {
        boardContainer.removeChild(boardContainer.firstChild);
    }

    board.length = 0;
    bombs_location.length = 0;
    squares_clicked = 0;
}


function resetGame() {
    location.reload();
}

function playAgain() {
    let brake_line = document.createElement("br")
    let play_again_butt = document.createElement("button");
    play_again_butt.textContent = "Jeszcze raz?";

    let firstChild = document.body.firstChild;
    document.body.insertBefore(brake_line, firstChild);
    document.body.insertBefore(play_again_butt, firstChild);

    play_again_butt.addEventListener("click", resetGame);
}

function nextLvl() {
    if (!nextLvlButtonGenerated) {
        let brake_line = document.createElement("br")
        let nextLvl_butt = document.createElement("button");
        nextLvl_butt.textContent = "Kolejny level?";
        nextLvl_butt.id = "nextLvl_butt";

        let firstChild = document.body.firstChild;
        document.body.insertBefore(brake_line, firstChild);
        document.body.insertBefore(nextLvl_butt, firstChild);

        nextLvl_butt.addEventListener("click", lvlUp);
        nextLvlButtonGenerated = true;
    }
}

function lvlUp() {
    if (level < levelsList.length) {
        level++;
        game_over_flag = false;
        lvl_won_flag = false;
        clearBoard();
        startGame();
    }
}

function lvlWon(s) {
    if (squares_clicked == levelsList[level].rows * levelsList[level].columns - levelsList[level].bombs) {
        document.getElementById("bombs_left").innerText = "Udało ci się skończyć level " + level;
        if (!bombs_location.includes(s.id)) {
            s.style.backgroundColor = "lightslategray"
        }
        lvl_won_flag = true;
        return true;
    }
    return false;
}

function gameWon() {
    if (level === levelsList.length-1) {
        return true;
    }
    return false;
}

document.addEventListener("DOMContentLoaded", function () {
    // Dodaj nasłuchiwanie na kliknięcie przycisku "Obejrzyj filmik"
    document.getElementById("watchVideoBtn").addEventListener("click", showVideo);
    // Dodaj nasłuchiwanie na kliknięcie overlaya, aby ukryć filmik
    document.getElementById("overlay").addEventListener("click", hideVideo);
});

// Dodaj funkcję pokazującą video i overlay
function showVideo() {
    const existingVideo = document.getElementById("existingVideo");
    const overlay = document.getElementById("overlay");

    if (existingVideo && overlay) {
        existingVideo.style.display = "block";
        overlay.style.display = "block";
    } else {
        console.error("Brak istniejącego filmu lub overlaya do wyświetlenia.");
    }
}

// Dodaj funkcję ukrywającą video i overlay
function hideVideo() {
    const existingVideo = document.getElementById("existingVideo");
    const overlay = document.getElementById("overlay");

    if (existingVideo && overlay) {
        existingVideo.style.display = "none";
        overlay.style.display = "none";
    }
}

