const cardGrid = document.getElementById('cardGrid');
const moveCountDisplay = document.getElementById('moveCount');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const congratsMessage = document.getElementById('congratsMessage');
const finalScoreDisplay = document.getElementById('finalScore');
const playAgainBtn = document.getElementById('playAgainBtn');
const exitBtn = document.getElementById('exitBtn');
const fireworkContainer = document.getElementById('fireworkContainer');

const preGameButtons = document.getElementById('preGameButtons');
const inGameButtons = document.getElementById('inGameButtons');
const resetBtn = document.getElementById('resetBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const quitBtn = document.getElementById('quitBtn');

let cards = [];
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let moves = 0;
let matchCount = 0;
let timer;
let seconds = 0;
let score = 0;
let gridSize = 4; // Default to 4x4

const images = [
  'images/image1.webp', 'images/image2.jpg', 'images/image3.jpg', 'images/image4.jpg',
  'images/image5.jpg', 'images/image6.jpg', 'images/image7.jpg', 'images/image8.webp',
  // Additional images for larger grids
  'images/image9.webp', 'images/image10.webp', 'images/image11.png', 'images/image12.jpg',
  'images/image13.png', 'images/image14.jpeg', 'images/image15.webp', 'images/image16.webp', 
  'images/image17.webp', 'images/image18.webp', 'images/image18.webp', 'images/image19.jpg',
  'images/image20.jpg', 'images/image21.png', 'images/image22.webp', 'images/image23.jpg',
  'images/image24.jpg', 'images/image25.png', 'images/image26.png', 'images/image27.jpeg',
  'images/image28.webp', 'images/image29.jpg', 'images/image30.webp', 'images/image31.png',
  'images/image32.webp', 'images/image33.jpg', 'images/image34.png', 'images/image35.jpg',
  'images/image36.webp', 'images/image37.webp', 'images/image38.webp',
];

function createBoard(size) {
  cardGrid.innerHTML = ''; // Clear the board
  gridSize = size;

  const shuffledImages = images.slice(0, (size * size) / 2).concat(images.slice(0, (size * size) / 2));
  shuffledImages.sort(() => 0.5 - Math.random());

  cardGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  cardGrid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

  shuffledImages.forEach(image => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `<img src="${image}" alt="Memory Card">`;
    card.addEventListener('click', flipCard);
    cardGrid.appendChild(card);
  });

  // Adjust card size based on grid size
  adjustCardSize(size);

  cards = document.querySelectorAll('.card');
}

function adjustCardSize(size) {
  const cardSize = Math.min(100, Math.floor(800 / size)) - 10; // Adjust card size
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.style.width = `${cardSize}px`;
    card.style.height = `${cardSize}px`;
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('show');

  if (!hasFlippedCard) {
    hasFlippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.innerHTML === secondCard.innerHTML;
  isMatch ? disableCards() : unflipCards();
  updateScore(isMatch);
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  resetBoard();
  matchCount += 2;

  if (matchCount === cards.length) {
    endGame();
  }
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove('show');
    secondCard.classList.remove('show');

    resetBoard();
  }, 1000);
}

function resetBoard() {
  [hasFlippedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

function updateScore(isMatch) {
  moves++;
  moveCountDisplay.textContent = moves;

  if (isMatch) {
    score += 10;
  } else {
    score -= 2;
  }

  scoreDisplay.textContent = score;
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function resetTimer() {
  clearInterval(timer);
  seconds = 0;
  timerDisplay.textContent = '0:00';
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function endGame() {
  stopTimer();
  finalScoreDisplay.textContent = score;
  document.getElementById('endMoves').textContent = moves;
  document.getElementById('endTime').textContent = timerDisplay.textContent;
  congratsMessage.style.display = 'block';
  triggerFireworks();
}

function resetGame() {
  congratsMessage.style.display = 'none';
  cardGrid.innerHTML = '';
  resetTimer();
  moveCountDisplay.textContent = '0';
  scoreDisplay.textContent = '0';
  matchCount = 0;
  moves = 0;
  score = 0;
  preGameButtons.style.display = 'block';
  inGameButtons.style.display = 'none';
}

function startNewGame(size) {
  resetGame();
  createBoard(size);
  startTimer();
  preGameButtons.style.display = 'none';
  inGameButtons.style.display = 'flex';
}

function quitGame() {
  resetGame();
  stopTimer();
  resetTimer();
  // Hide in-game buttons and show difficulty selection buttons
  inGameButtons.style.display = 'none';
  preGameButtons.style.display = 'block';
}

function triggerFireworks() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
}

function setupEventListeners() {
  easyBtn.addEventListener('click', () => startNewGame(4));
  mediumBtn.addEventListener('click', () => startNewGame(6));
  hardBtn.addEventListener('click', () => startNewGame(8));
  
  resetBtn.addEventListener('click', resetGame);
  
  pauseBtn.addEventListener('click', () => {
    stopTimer();
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'block';
  });
  
  resumeBtn.addEventListener('click', () => {
    startTimer();
    resumeBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
  });

  quitBtn.addEventListener('click', quitGame);
  playAgainBtn.addEventListener('click', () => startNewGame(gridSize));
}

setupEventListeners();

// Exit button quits the game
exitBtn.addEventListener('click', () => {
  resetGame();
  window.location.reload(); // Reload the page to fully reset everything
});

// Add these variables to your script
const totalMovesDisplay = document.getElementById('totalMoves');
const totalTimeDisplay = document.getElementById('totalTime');

// Function to show the congratulations modal
function showCongratulations() {
  // Populate the modal with stats
  totalMovesDisplay.textContent = moves;
  totalTimeDisplay.textContent = formatTime(seconds);
  finalScoreDisplay.textContent = score;

  // Show the modal
  congratsMessage.style.display = 'block';
  
  // Stop the fireworks from showing if already displayed
  fireworkContainer.style.display = 'none';

  // Show fireworks
  if (fireworksEnabled) {
    displayFireworks();
  }
}

// Helper function to format time
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to trigger fireworks
function displayFireworks() {
  // Use canvas-confetti to display fireworks
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Example call to show the congratulations modal (Replace with your game end logic)
function endGame() {
  clearInterval(timer); // Stop the timer
  showCongratulations();
}

// Event listeners for buttons
playAgainBtn.addEventListener('click', () => {
  congratsMessage.style.display = 'none';
  startGame(gridSize); // Restart the game
});

exitBtn.addEventListener('click', () => {
  window.location.reload(); // Reload the page
});

