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
    document.getElementById("bombs_left").innerText = bombs_left;
    document.getElementById("flag-butt").addEventListener("click", putFlag)

    for (let i = 0; i < rows; i++) {
        let row = [];
        for (let v = 0; v < columns; v++) {
            let square = document.createElement("div");
            square.id = i.toString + "-" + v.toString;
            square.addEventListener("click", clickSquare)
            document.getElementById("board").append(square);
            row.push(square);
        }
        board.push(row);
    }
}

function putFlag() {
    if (is_flagged) {
        is_flagged = false;
        document.getElementById("flag-butt").style.backgroundColor = "lightgray";
    } else {
        is_flagged = true;
        document.getElementById("flag-butt").style.backgroundColor = "darkgray";
    }
}

function clickSquare() {
    let square = this;
    if (is_flagged) {
        if (square.innerText == "") {
            square.innerText = "🚩";
        } else if (square.innerText == "🚩") {
            square.innerText = "";
        }
        return;
    }
}

//function to add flags on board witch a right click
//rozmieść flagi prawym przyciskiem myszy

//function to check if bomb was clicked
//sprawdz czy kliknięto bombę

//function to check neighboring bombs
//sprawdz sąsiadujące pola (czy mają bomby)

//function to check if user has won
//sprawdz czy wygrana 