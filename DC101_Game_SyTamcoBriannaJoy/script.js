// =====================
// Memory Match Game
// =====================

// Elements
const gameBoard = document.getElementById("gameBoard");
const timerDisplay = document.getElementById("timer");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalMessage = document.getElementById("modalMessage");
const restartBtn = document.getElementById("restartBtn");

const flipSound = document.getElementById("flipSound");
const matchSound = document.getElementById("matchSound");
const winSound = document.getElementById("winSound");
const gameOverSound = document.getElementById("gameOverSound");

// Cards
const cardsArray = [
  "joonghyuk",
  "dokja",
  "sooyoung",
  "heewon",
  "sangah",
  "hyunsung",
  "jihye",
  "yoosung"
];

let cards = [...cardsArray, ...cardsArray];

// Game state
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;
let timeLeft = 60;
let timer;
const totalPairs = cardsArray.length;

// =====================
// Initialize Game
// =====================
function initGame() {
  // Reset state
  firstCard = null;
  secondCard = null;
  lockBoard = false;
  matchedPairs = 0;
  timeLeft = 60;

  // Clear previous timer
  clearInterval(timer);

  // Reset timer display
  timerDisplay.textContent = `Time: ${timeLeft}`;

  // Hide modal
  modal.classList.add("hidden");

  // Shuffle cards
  cards.sort(() => Math.random() - 0.5);

  // Clear board
  gameBoard.innerHTML = "";

  // Create card elements
  cards.forEach(name => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = name;

    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="assets/logo.png" alt="Front">
        </div>
        <div class="card-back">
          <img src="assets/${name}.png" alt="${name}">
        </div>
      </div>
    `;

    card.addEventListener("click", () => flipCard(card));
    gameBoard.appendChild(card);
  });

  startTimer();
}

// =====================
// Card Logic
// =====================
function flipCard(card) {
  if (lockBoard || card === firstCard) return;

  flipSound.currentTime = 0;
  flipSound.play();
  card.classList.add("flip");

  if (!firstCard) {
    firstCard = card;
    return;
  }

  secondCard = card;
  checkMatch();
}

function checkMatch() {
  const isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? handleMatch() : unflipCards();
}

function handleMatch() {
  matchSound.play();

  // Disable cards
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  matchedPairs++;

  if (matchedPairs === totalPairs) {
    clearInterval(timer);
    setTimeout(showWin, 500);
  }

  resetBoard();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  [firstCard, secondCard, lockBoard] = [null, null, false];
}

// =====================
// Timer
// =====================
function startTimer() {
  timerDisplay.textContent = `Time: ${timeLeft}`;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      showGameOver();
    }
  }, 1000);
}

// =====================
// Modals
// =====================
function showWin() {
  winSound.play();
  modalTitle.textContent = "🎉 You Win!";
  modalMessage.textContent = "You matched all the cards!";
  modal.classList.remove("hidden");
}

function showGameOver() {
  lockBoard = true;
  gameOverSound.play();
  modalTitle.textContent = "⏰ Game Over";
  modalMessage.textContent = "Time ran out. Try again!";
  modal.classList.remove("hidden");
}

// =====================
// Restart Game
// =====================
function restartGame() {
  initGame();
}

// =====================
// Attach restart button
// =====================
restartBtn.addEventListener("click", restartGame);

// =====================
// Start the game initially
// =====================
initGame();
