class NumberGuessingGame {
  constructor() {
    this.input = document.querySelector("input");
    this.guessDisplay = document.querySelector(".guess");
    this.checkButton = document.getElementById("check");
    this.remainingChancesDisplay = document.querySelector(".chances");

    this.input.focus();
    this.isGameOver = false;
    this.resetGame();

    this.checkButton.addEventListener("click", () => this.handleButtonClick());
    document.addEventListener("DOMContentLoaded", () => this.hideLoaderAfterDelay());
  }

  resetGame() {
    this.randomNum = Math.floor(Math.random() * 100) + 1;
    this.chance = 10;
    this.isGameOver = false;
    this.updateUI();
  }

  handleButtonClick() {
    if (this.isGameOver) {
      this.resetGame();
    } else {
      this.handleGuess();
    }
  }

  handleGuess() {
    this.chance--;

    const inputValue = parseInt(this.input.value);

    if (isNaN(inputValue) || inputValue < 1 || inputValue > 100) {
      this.displayMessage("Please enter a number between 1 and 100", "#DE0611");
    } else if (inputValue === this.randomNum) {
      this.displayMessage("Congratulations! You guessed it", "green");
      this.isGameOver = true;
      this.input.disabled = true;
      this.checkButton.textContent = "Replay";
    } else {
      this.displayMessage(inputValue > this.randomNum ? "Your guess is high" : "Your guess is low");
      this.remainingChancesDisplay.textContent = this.chance;
    }

    if (this.chance === 0) {
      this.displayMessage(`You lost the game..The correct number was ${this.randomNum}`);
      this.isGameOver = true;
      this.input.disabled = true;
      this.checkButton.textContent = "Replay";
    }
  }

  updateUI() {
    this.guessDisplay.textContent = "";
    this.remainingChancesDisplay.textContent = this.chance;
    this.input.value = "";
    this.input.disabled = false;
    this.checkButton.textContent = "Check";
    this.input.focus();
  }

  displayMessage(message, color) {
    this.guessDisplay.textContent = message;
    this.guessDisplay.style.color = color || "";
  }

  hideLoaderAfterDelay() {
    setTimeout(() => {
      document.getElementById("loading-spinner").style.display = "none";
    }, 1500);
  }
}

// Create an instance of the game
const game = new NumberGuessingGame();
