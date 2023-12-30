// variables / zmienne 

var board = [];
var rows = 8;
var columns = 8;
var bombs_left = 5;
var bombs_location = [];
var squares_clicked = 0;
var is_flagged = false;
var game_over = false;


window.onload = function () {
    startGame();
}

// function to add board / dodanie planszy (10x10)
function startGame() {
    document.getElementById("bombs_left").innerText = "(☞ ͡° ͜ʖ ͡°)☞" + bombs_left + "💣";
    document.getElementById("flag_butt").addEventListener("click", putFlag);
    generateCoordinates();

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let v = 0; v < columns; v++) {
            let square = document.createElement("div");
            square.id = i.toString() + "-" + v.toString();
            square.addEventListener("click", clickSquare);
            document.getElementById("board").append(square);
            row.push(square);
        }
        board.push(row);
    }
    console.log(board);
}

// function to trigger flag placement / funkcja do pzycisku flagi (rozmieszczanie na planszy)
function putFlag() {
    if (is_flagged) {
        is_flagged = false;
        document.getElementById("flag_butt").style.backgroundColor = "lightgray";
    } else {
        is_flagged = true;
        document.getElementById("flag_butt").style.backgroundColor = "darkgray";
    }
}

// function to make square clickable / dodanie funkcjonalności przycisku do pól planszy
function clickSquare() {
    if (game_over || this.classList.contains("square_clicked")) {
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
    if (bombs_location.includes(square.id)) {
        game_over = true;
        showBombs();
        return;
    } else {
        console.log("clicked " + square.id)
    }

    let squareCoordinates = square.id.split("-");
    let r = parseInt(squareCoordinates[0]);
    let c = parseInt(squareCoordinates[1]);
    showNeighboringBombs(r, c);
}

// function to generate random coordinates / wygeneruj koordynanty dla bomb 
function generateCoordinates() {
    do {
        let r = Math.floor(Math.random() * bombs_left);
        let c = Math.floor(Math.random() * bombs_left);
        let coordinate = r.toString() + "-" + c.toString();
        if (!bombs_location.includes(coordinate)) {
            bombs_location.push(coordinate)
        }
    } while (bombs_location.length < bombs_left);
    squares_clicked += 1;
    console.log(bombs_location);
}

// function to show all the bombs / pokaż wszystkie bomby na planszy
function showBombs() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
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
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (board[r][c].classList.contains("square_clicked")) {
        return;
    }

    board[r][c].classList.add("square_clicked");
    squares_clicked += 1;

    let bombs_found = 0;

    bombs_found += checkSquare(r - 1, c - 1);
    bombs_found += checkSquare(r - 1, c);
    bombs_found += checkSquare(r - 1, c + 1);

    bombs_found += checkSquare(r, c - 1);
    bombs_found += checkSquare(r, c + 1);

    bombs_found += checkSquare(r + 1, c - 1);
    bombs_found += checkSquare(r + 1, c);
    bombs_found += checkSquare(r + 1, c + 1);

    if (bombs_found > 0) {
        board[r][c].innerText = bombs_found;
        board[r][c].classList.add("x" + bombs_found.toString())
    } else {
        showNeighboringBombs(r - 1, c - 1);
        showNeighboringBombs(r - 1, c);
        showNeighboringBombs(r - 1, c + 1);

        showNeighboringBombs(r, c - 1);
        showNeighboringBombs(r, c + 1);

        showNeighboringBombs(r + 1, c - 1);
        showNeighboringBombs(r + 1, c);
        showNeighboringBombs(r + 1, c + 1);
    }

    if (squares_clicked == rows * columns - bombs_left) {
        document.getElementById("bombs_left").innerText = "(੭˃ᴗ˂)੭";
        
    }
}

// function to check neighboring squares / sprawdz sąsiadujące pola (czy mają bomby)
function checkSquare(r, c) {
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    if (bombs_location.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}