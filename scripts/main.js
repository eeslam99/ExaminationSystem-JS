import { Exam } from "./exam.js";
import { questions } from "./questionsArray.js";

const elements = {
  welcomeModal: document.getElementById("welcomeModal"),
  examContent: document.getElementById("examContent"),
  resultsContainer: document.getElementById("resultsContainer"),
  startBtn: document.getElementById("startExamBtn"),
  nameInput: document.getElementById("studentName"),
  nameDisplay: document.getElementById("student-name-display"),
  questionText: document.getElementById("question-text"),
  questionImage: document.getElementById("question-image"),
  optionsContainer: document.getElementById("options-container"),
  nextBtn: document.getElementById("nextBtn"),
  finishBtn: document.getElementById("finishBtn"),
  buttonsContainer: document.getElementById("buttonsContainer"),
  timerText: document.getElementById("timer-text"),
  timerProgress: document.querySelector(".timer-progress"),
  currentQuestion: document.getElementById("current-question-num"),
  totalQuestions: document.getElementById("total-questions-num"),
  totalQuestionsDisplay: document.getElementById("total-questions"),
  examName: document.getElementById("exam-name"),
  scorePercentage: document.getElementById("score-percentage"),
  scoreCorrect: document.getElementById("score-correct"),
  scoreTotal: document.getElementById("score-total"),
  retryExamBtn: document.getElementById("retryExamBtn"),
};

const exam = new Exam("Names Of Animals", questions, 60);

elements.startBtn.addEventListener("click", () => {
  const name = elements.nameInput.value;
  if (!name) {
    alert("Please enter your name to start the exam");
    return;
  }

  elements.welcomeModal.style.display = "none";
  elements.examContent.style.display = "flex";

  initExam();
});

function initExam() {
  elements.examName.textContent = exam.title;
  elements.totalQuestionsDisplay.textContent = `${exam.questions.length} Questions`;
  elements.totalQuestions.textContent = exam.questions.length;

  displayQuestion();
  exam.startTimer(updateTimer, finishExam);
}


function displayQuestion() {
  const question = exam.getCurrentQuestion();

  elements.currentQuestion.textContent = exam.currentIndex + 1;
  elements.totalQuestions.textContent = exam.questions.length;
  elements.questionText.textContent = question.title;

  if (question.imageUrl) {
    elements.questionImage.src = question.imageUrl;
    elements.questionImage.style.display = "block";
  } else {
    elements.questionImage.style.display = "none";
  }

  elements.optionsContainer.innerHTML = "";
  question.options.forEach((option, index) => {
    const optionDiv = document.createElement("div");
    optionDiv.className = `option ${
      question.userAnswer === index ? "selected" : ""
    }`;

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const text = document.createElement("span");
    text.textContent = option;

    optionDiv.appendChild(letter);
    optionDiv.appendChild(text);
    optionDiv.onclick = () => selectAnswer(index);

    elements.optionsContainer.appendChild(optionDiv);
  });

  elements.nextBtn.classList.toggle("disabled", !question.isAnswered());

  if (exam.isLastQuestion()) {
    elements.nextBtn.style.display = "none";
    elements.buttonsContainer.className = "buttons-container last-question";
  } else {
    elements.nextBtn.style.display = "flex";
    elements.buttonsContainer.className = "buttons-container";
  }
}


function selectAnswer(index) {
  exam.getCurrentQuestion().userAnswer = index;
  elements.nextBtn.classList.remove("disabled");
  displayQuestion();
}


function updateTimer(timeRemaining) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  elements.timerText.textContent = `${String(minutes).padStart(2,"0")}:${String(seconds).padStart(2, "0")}`;

  const percentRemaining = (timeRemaining / exam.timeLimit) * 100;
  elements.timerProgress.style.width = `${percentRemaining}%`;
}


function finishExam() {
  exam.stopTimer();
  const results = exam.getResults();

  elements.examContent.style.display = "none";
  elements.resultsContainer.style.display = "block";

  elements.scorePercentage.textContent = `${results.percentage.toFixed(0)}%`;
  elements.scoreCorrect.textContent = results.score;
  elements.scoreTotal.textContent = results.total;

  const scoreCircle = document.querySelector(".score-circle");
  const percentageDeg = results.percentage * 3.6;
  scoreCircle.style.background = `conic-gradient(${results.percentage >= 60 ? "#4CAF50" : "#FF5722"} ${percentageDeg}deg, #f0f0f0 ${percentageDeg}deg 360deg)`;
  elements.scorePercentage.style.color = results.percentage >= 60 ? "#4CAF50" : "#FF5722";
}


elements.retryExamBtn.addEventListener("click", () => {
  window.location.reload();
});

elements.nextBtn.addEventListener("click", () => {
  if (!elements.nextBtn.classList.contains("disabled")) {
    exam.nextQuestion();
    displayQuestion();
  }
});

elements.finishBtn.addEventListener("click", finishExam);
