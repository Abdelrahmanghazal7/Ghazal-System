const selectBox = document.querySelector(".select-box"),
    selectBtnX = selectBox.querySelector(".options .playerX"),
    selectBtnO = selectBox.querySelector(".options .playerO"),
    playBoard = document.querySelector(".play-board"),
    players = document.querySelector(".players"),
    allBox = document.querySelectorAll("section span"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("button"),
    modeSelector = document.querySelector(".mode-selector");

let isPlayerTurn = true;
let isTwoPlayerMode = false;

window.onload = () => {
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.addEventListener("click", () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
});

selectBtnO.addEventListener("click", () => {
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
    bot();
});

let playerXIcon = "fas fa-times";
let playerOIcon = "far fa-circle";
let playerSign = "X";
let runBot = true;

function clickedBox(element) {

    if (modeSelector.value === 'player-vs-player') {
        if (!element.classList.contains("clicked")) {

            element.classList.add("clicked");

            if (isPlayerTurn) {
                playerSign = "X";
                element.innerHTML = `<i class="${playerXIcon}"></i>`;
                players.classList.remove("active");
                element.setAttribute("id", playerSign);
            } else {
                playerSign = "O";
                element.innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.add("active");
                element.setAttribute("id", playerSign);
            }
            selectWinner();
            isPlayerTurn = !isPlayerTurn;
        }
    } else if (modeSelector.value === "vs-cpu") {
        if (!element.classList.contains("clicked")) {
            element.classList.add("clicked");

            if (players.classList.contains("player")) {
                playerSign = "O";
                element.innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                element.setAttribute("id", playerSign);
            } else {
                playerSign = "X";
                element.innerHTML = `<i class="${playerXIcon}"></i>`;
                players.classList.add("active");
                element.setAttribute("id", playerSign);
            }
            selectWinner();
            isPlayerTurn = !isPlayerTurn;
            if (!isPlayerTurn && runBot) {
                bot();
            }
        }
    }
}

function bot() {
    let array = [];
    if (!isPlayerTurn) {
        playerSign = "O";
        for (let i = 0; i < allBox.length; i++) {
            if (allBox[i].childElementCount == 0) {
                array.push(i);
            }
        }

        let bestMove = findBestMove();

        let randomBox = array.includes(bestMove) ? bestMove : array[Math.floor(Math.random() * array.length)];

        if (array.length > 0) {
            if (players.classList.contains("player")) {
                playerSign = "X";
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active");
            } else {
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                allBox[randomBox].setAttribute("id", playerSign);
            }
            selectWinner();
        }
        allBox[randomBox].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto";
        playerSign = "X";
        isPlayerTurn = true;
    }
}

function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].childElementCount == 0) {
            allBox[i].innerHTML = `<i class="${playerOIcon}"></i>`;
            let score = minimax(allBox, 0, false);
            allBox[i].innerHTML = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    let scores = {
        X: -1,
        O: 1,
        draw: 0
    };

    let result = selectWinner();

    if (result !== null) {
        return scores[result];
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].childElementCount == 0) {
                board[i].innerHTML = `<i class="${playerOIcon}"></i>`;
                let score = minimax(board, depth + 1, false);
                board[i].innerHTML = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i].childElementCount == 0) {
                board[i].innerHTML = `<i class="${playerXIcon}"></i>`;
                let score = minimax(board, depth + 1, true);
                board[i].innerHTML = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function getIdVal(classname) {
    return document.querySelector(".box" + classname).id;
}

function checkIdSign(val1, val2, val3, sign) {
    if (getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign) {
        return true;
    }
}

function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) || checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) || checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        runBot = false;
        bot(runBot);
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.innerHTML = `Player <p>${playerSign}</p> won the game!`;
    } else {
        if (getIdVal(1) != "" && getIdVal(2) != "" && getIdVal(3) != "" && getIdVal(4) != "" && getIdVal(5) != "" && getIdVal(6) != "" && getIdVal(7) != "" && getIdVal(8) != "" && getIdVal(9) != "") {
            runBot = false;
            bot(runBot);
            setTimeout(() => {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
            wonText.textContent = "Match has been drawn!";
        }
    }
}

replayBtn.addEventListener("click", () => {
    window.location.reload();
});

document.addEventListener("DOMContentLoaded", function () {
    setTimeout(function () {
        document.getElementById("loading-spinner").style.display = "none";
    }, 2000);
});