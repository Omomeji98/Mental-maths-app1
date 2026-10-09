// COLOURS (for reference)
const COLORS = {
  correct: "#16A34A",
  wrong: "#DC2626",
  text: "#1E293B",
  primary: "#2563EB"
};

let score = 0;
let gameRunning = false;
let timerId = null;
let timeLeft = 120;

let rndNum1 = 11;
let rndNum2 = Math.floor(Math.random() * 99) + 1;

// DOM elements
const num1El = document.getElementById("num1");
const num2El = document.getElementById("num2");
const feedbackEl = document.getElementById("feedback");
const answerInput = document.getElementById("answer-input");
const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const enterBtn = document.getElementById("enter-btn");

function calculate(num1, num2) {
  return num1 * num2;
}

function setFeedback(text, type = "neutral") {
  feedbackEl.textContent = text;
  feedbackEl.className = "feedback " + type;
}

function updateNumbers() {
  num1El.textContent = rndNum1;
  num2El.textContent = rndNum2;
}

function checkAnswer() {
  if (!gameRunning) return;

  const userInput = answerInput.value.trim();

  if (userInput === "") {
    setFeedback("Enter an answer!", "wrong");
    return;
  }

  const userAnswer = parseInt(userInput, 10);
  if (isNaN(userAnswer)) {
    setFeedback("Enter a valid number!", "wrong");
    return;
  }

  const correctAnswer = calculate(rndNum1, rndNum2);

  if (userAnswer === correctAnswer) {
    score += 1;
    scoreEl.textContent = `Score: ${score}`;
    setFeedback("Correct! Well done!", "correct");

    // Next question: keep first number as 11 (matching original game logic)
    rndNum1 = 11;
    rndNum2 = Math.floor(Math.random() * 99) + 1;
    updateNumbers();
    answerInput.value = "";
    answerInput.focus();
  } else {
    setFeedback("Wrong! Try again.", "wrong");
    answerInput.value = "";
    answerInput.focus();
  }
}

function startTimer() {
  if (gameRunning) return;

  gameRunning = true;
  timeLeft = 120;

  setFeedback("Solve the question!", "neutral");
  answerInput.value = "";
  answerInput.disabled = false;
  enterBtn.disabled = false;
  answerInput.focus();

  countDown();
}

function countDown() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  if (timeLeft > 0) {
    timeLeft -= 1;
    timerId = setTimeout(countDown, 1000);
  } else {
    gameRunning = false;
    timerId = null;

    const correctAnswer = calculate(rndNum1, rndNum2);
    setFeedback(`Time's up! Answer: ${correctAnswer}`, "primary");
    answerInput.disabled = true;
    enterBtn.disabled = true;
  }
}

function resetGame() {
  gameRunning = false;

  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }

  score = 0;
  timeLeft = 120;

  rndNum1 = Math.floor(Math.random() * 99) + 1;
  rndNum2 = Math.floor(Math.random() * 99) + 1;

  scoreEl.textContent = "Score: 0";
  timerEl.textContent = "2:00";
  setFeedback("Ready?", "neutral");
  updateNumbers();

  answerInput.disabled = false;
  enterBtn.disabled = false;
  answerInput.value = "";
}

// Event listeners
startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", resetGame);
enterBtn.addEventListener("click", checkAnswer);

answerInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkAnswer();
  }
});

// Initialize display
updateNumbers();
