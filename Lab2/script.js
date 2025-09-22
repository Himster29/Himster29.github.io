// Global variables
let randomNumber;
let attempts;
let wins = 0;       
let losses = 0;     
let maxAttempts = 7; 

// Event Listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);

initializeGame();

function initializeGame() {
  randomNumber = Math.floor(Math.random() * 99) + 1; 
  console.log("randomNumber: " + randomNumber);
  attempts = 0;


  document.querySelector("#resetBtn").style.display = "none";
  document.querySelector("#guessBtn").style.display = "inline";

  let playerGuess = document.querySelector("#playerGuess"); 
  playerGuess.focus();
  playerGuess.value = "";

  let feedback = document.querySelector("#feedback");
  feedback.textContent = "";

  document.querySelector("#guesses").textContent = "";


  document.querySelector("#attemptsLeft").textContent = "Attempts left: " + (maxAttempts - attempts);
  document.querySelector("#winLoss").textContent = "Wins: " + wins + " | Losses: " + losses;
}

function checkGuess() {
  let feedback = document.querySelector("#feedback");
  feedback.textContent = "";


  let guess = Number(document.querySelector("#playerGuess").value);

  if (guess < 1 || guess > 99 || Number.isNaN(guess)) {
    feedback.textContent = "Enter a number between 1 and 99";
    feedback.style.color = "red";
    return;
  }

  attempts++;
  document.querySelector("#attemptsLeft").textContent = "Attempts left: " + (maxAttempts - attempts);
  feedback.style.color = "orange";

  if (guess == randomNumber) {
    feedback.textContent = "Game Over! You Win!!";
    feedback.style.color = "red";
    wins++; 
    document.querySelector("#winLoss").textContent = "Wins: " + wins + " | Losses: " + losses;
    gameOver();
  } else {
    document.querySelector("#guesses").textContent += guess + " ";
    if (attempts == maxAttempts) {
      feedback.textContent ="You Lost, Better Luck Next Time. The number was " + randomNumber + ".";
      `feedback.style.color = "red"`;
      losses++; 
      document.querySelector("#winLoss").textContent = "Wins: " + wins + " | Losses: " + losses;
      gameOver();
    } else if (guess > randomNumber) {
      feedback.textContent = "Guess was too high"
      feedback.style.color = "coral";
    } else {
      feedback.textContent = "Guess was too low";
      feedback.style.color = "green";
    }
  }
}

function gameOver() {
  let guessBtn = document.querySelector("#guessBtn"); 
  let resetBtn = document.querySelector("#resetBtn");  
  guessBtn.style.display = "none";
  resetBtn.style.display = "inline";
}
