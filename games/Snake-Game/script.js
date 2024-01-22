$(document).ready(function () {
    const playBoard = $(".play-board");
    const scoreElement = $(".score");
    const highScoreElement = $(".high-score");

    let gameOver = false;
    let foodX, foodY;
    let snakeX = 5, snakeY = 5;
    let velocityX = 0, velocityY = 0;
    let snakeBody = [];
    let setIntervalId;
    let score = 0;

    let touchStartX = 0;
    let touchStartY = 0;

    let highScore = localStorage.getItem("high-score") || 0;
    highScoreElement.text(`High Score: ${highScore}`);

    const updateFoodPosition = () => {
        foodX = Math.floor(Math.random() * 30) + 1;
        foodY = Math.floor(Math.random() * 30) + 1;
    };

    const handleGameOver = () => {
        clearInterval(setIntervalId);

        var bg = $("#bg");
        bg.css('display', 'flex');

        $('#replay').text('Game Over');

        setTimeout(() => {
            location.reload();
        }, 1500);
    };

    const changeDirection = (key) => {
        if (key === "ArrowUp" && velocityY !== 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (key === "ArrowDown" && velocityY !== -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (key === "ArrowLeft" && velocityX !== 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (key === "ArrowRight" && velocityX !== -1) {
            velocityX = 1;
            velocityY = 0;
        }
    };

    playBoard.on("touchstart", function (e) {
        touchStartX = e.originalEvent.touches[0].clientX;
        touchStartY = e.originalEvent.touches[0].clientY;
    });

    playBoard.on("touchend", function (e) {
        const touchEndX = e.originalEvent.changedTouches[0].clientX;
        const touchEndY = e.originalEvent.changedTouches[0].clientY;

        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (deltaX > 0) {
                changeDirection("ArrowRight");
            } else {
                changeDirection("ArrowLeft");
            }
        } else {
            // Vertical swipe
            if (deltaY > 0) {
                changeDirection("ArrowDown");
            } else {
                changeDirection("ArrowUp");
            }
        }
    });

    const initGame = () => {
        if (gameOver) return handleGameOver();
        let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

        if (snakeX === foodX && snakeY === foodY) {
            updateFoodPosition();
            snakeBody.push([foodY, foodX]);
            score++;
            highScore = score >= highScore ? score : highScore;
            localStorage.setItem("high-score", highScore);
            scoreElement.text(`Score: ${score}`);
            highScoreElement.text(`High Score: ${highScore}`);
        }

        snakeX += velocityX;
        snakeY += velocityY;

        for (let i = snakeBody.length - 1; i > 0; i--) {
            snakeBody[i] = snakeBody[i - 1];
        }
        snakeBody[0] = [snakeX, snakeY];

        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
            return gameOver = true;
        }

        for (let i = 0; i < snakeBody.length; i++) {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
            if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
                gameOver = true;
            }
        }
        playBoard.html(html);
    };

    updateFoodPosition();
    setIntervalId = setInterval(initGame, 100);
    $(document).on("keyup", function (e) {
        changeDirection(e.key);
    });
});

// Loader
$(document).ready(function () {
    setTimeout(function () {
        $("#loading-spinner").css("display", "none");
    }, 1500);
});
