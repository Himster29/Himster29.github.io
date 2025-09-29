// Word list
const wordList = [
  "blizzard","boggle","bookworm","boxcar","boxful","buckaroo","buffalo",
  "grogginess","haiku","haphazard","hyphen","iatrogenic","icebox","injury",
  "ovary","oxidize","oxygen","pajama","peekaboo","phlegm","pixel",
  "vaporize","vixen","vodka","voodoo","vortex","voyeurism","walkway"
];

// Globals
let guess = ""; 
const maxWrong = 6;         
let correct = new Set();
let wrong = new Set();
let checkGame = false;
let pics = ["pic1.jpg", "pic2.jpg", "pic3.jpg", "pic4.jpg", "pic5.jpg"];
let picIndex = 0;

const word     = document.querySelector("#word");
const misses   = document.querySelector("#misses");
const layout   = document.querySelector("#keyboard");
const message  = document.querySelector("#message");
const resetBtn = document.querySelector("#resetBtn");
const hangman  = Array.from(document.querySelectorAll(".part"));

// Calls
keyboard();
newGame();
setupSideImage();  
showNextPic();     

// Event Listeners
resetBtn.addEventListener("click", newGame);
document.addEventListener("keydown", function (e) {
  const k = e.key.toLowerCase();
  if (k.length === 1 && k >= "a" && k <= "z") {
    makeGuess(k);
  }
});

// Helper Functions
function newGame() {
  guess = wordList[Math.floor(Math.random() * wordList.length)];
  correct.clear();
  wrong.clear();
  checkGame = false;

  message.textContent = "";
  message.classList.remove("lose");

  let keys = layout.querySelectorAll(".key");
  for (let i = 0; i < keys.length; i++) {
    keys[i].disabled = false;
  }

  for (let j = 0; j < hangman.length; j++) {
    hangman[j].classList.remove("show");
  }

  updateWord();
  updateMisses();
}

function keyboard() {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  layout.innerHTML = "";
  for (let i = 0; i < letters.length; i++) {
    let letter = letters[i];
    let btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = letter.toUpperCase();
    (function (ch, button) {
      button.addEventListener("click", function () {
        makeGuess(ch);
      });
    })(letter, btn);
    layout.appendChild(btn);
  }
}

function makeGuess(letter) {
  if (checkGame) return;
  if (correct.has(letter) || wrong.has(letter)) return;

  showNextPic();
  
  let keyBtn = null;
  for (let i = 0; i < layout.children.length; i++) {
    if (layout.children[i].textContent.toLowerCase() === letter) {
      keyBtn = layout.children[i];
      break;
    }
  }

  if (guess.indexOf(letter) !== -1) {
    correct.add(letter);
    if (keyBtn) keyBtn.disabled = true;
    updateWord();
    checkWin();
  } else {
    wrong.add(letter);
    if (keyBtn) keyBtn.disabled = true;
    updateMisses();
    showHangman(wrong.size);
    checkLoss();
  }
}

function updateWord() {
  word.innerHTML = "";
  for (let i = 0; i < guess.length; i++) {
    let ch = guess[i];
    let span = document.createElement("span");
    span.className = "slot";
    span.textContent = correct.has(ch) ? ch.toUpperCase() : "";
    word.appendChild(span);
  }
}

function updateMisses() {
  let items = Array.from(wrong).map(function (c) { return c.toUpperCase(); });
  misses.textContent = items.length ? "Misses: " + items.join(" ") : "";
}

function showHangman(count) {
  for (let i = 0; i < hangman.length; i++) {
    let p = hangman[i];
    let idx = Number(p.dataset.part);
    if (idx <= count) {
      p.classList.add("show");
    } else {
      p.classList.remove("show");
    }
  }
}

function checkWin() {
  let allRevealed = true;
  for (let i = 0; i < guess.length; i++) {
    if (!correct.has(guess[i])) {
      allRevealed = false;
      break;
    }
  }
  if (allRevealed) {
    checkGame = true;
    message.textContent = "You win!";
  }
}

function checkLoss() {
  if (wrong.size >= maxWrong) {
    checkGame = true;
    message.textContent = "You lost. The word was “" + guess.toUpperCase() + "”.";
    message.classList.add("lose");
    for (let i = 0; i < guess.length; i++) {
      correct.add(guess[i]);
    }
    updateWord();
  }
}

function setupSideImage() {

  let hang = document.querySelector("#hangman");
  if (!hang) return;

  let img = document.querySelector("#sidePic");
  if (!img) {
    img = new Image();
    img.id = "sidePic";
    img.alt = "Gallery image";
    hang.appendChild(img); 
  }
}

function shufflePics() {

  for (let i = pics.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let t = pics[i]; pics[i] = pics[j]; pics[j] = t;
  }
  picIndex = 0;
}

function showNextPic() {

  if (picIndex === 0) shufflePics();

  let img = document.querySelector("#sidePic");
  if (img) {
    img.src = pics[picIndex]; 
  }

  picIndex++;
  if (picIndex >= pics.length) picIndex = 0;
}
