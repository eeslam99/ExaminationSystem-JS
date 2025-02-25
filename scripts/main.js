import { Exam } from './exam.js';
import { Question } from './question.js';

document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        welcomeModal: document.getElementById('welcomeModal'),
        examContent: document.getElementById('examContent'),
        startBtn: document.getElementById('startExamBtn'),
        nameInput: document.getElementById('studentName'),
        nameDisplay: document.getElementById('student-name-display'),
        questionText: document.getElementById('question-text'),
        questionImage: document.getElementById('question-image'),
        optionsContainer: document.getElementById('options-container'),
        nextBtn: document.getElementById('nextBtn'),
        finishBtn: document.getElementById('finishBtn'),
        buttonsContainer: document.getElementById('buttonsContainer'),
        timerText: document.getElementById('timer-text'),
        timerProgress: document.querySelector('.timer-progress'),
        currentQuestion: document.getElementById('current-question-num'),
        totalQuestions: document.getElementById('total-questions-num'),
        totalQuestionsDisplay: document.getElementById('total-questions'),
        examName: document.getElementById('exam-name')
    };

    const questions = [
        new Question("Which animal is known as the 'King of the Jungle'?", 
            ["Lion", "Tiger", "Elephant", "Gorilla"], 0,
            "assets/images/lion.jpg"),
        new Question("What is this animal?", 
            ["Cheetah", "Lion", "Gazelle", "Horse"], 0,
            "assets/images/cheetah.jpg"),
        new Question("Which animal can change its color to blend into its surroundings?", 
            ["Chameleon", "Frog", "Octopus", "Butterfly"], 0,
            "assets/images/chameleon.jpg"),
        new Question("What is the largest mammal in the world?", 
            ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"], 1,
            "assets/images/blue-whale.jpg"),
        new Question("Which bird is known for its ability to mimic human speech?", 
            ["Crow", "Parrot", "Owl", "Eagle"], 1,
            "assets/images/parrot.jpg"),
        new Question("What is the only mammal capable of true flight?", 
            ["Bat", "Flying Squirrel", "Penguin", "Ostrich"], 0,
            "assets/images/bat.jpg"),
        new Question("Which animal is known for its black and white stripes?", 
            ["Zebra", "Tiger", "Panda", "Orca"], 0,
            "assets/images/zebra.jpg"),
        new Question("What is the national bird of the United States?", 
            ["Eagle", "Hawk", "Falcon", "Owl"], 0,
            "assets/images/eagle.jpg"),
        new Question("Which animal is known to have the longest lifespan?", 
            ["Tortoise", "Elephant", "Whale", "Parrot"], 0,
            "assets/images/tortoise.jpg"),
        new Question("What is the smallest bird in the world?", 
            ["Hummingbird", "Sparrow", "Finch", "Bee"], 0,
            "assets/images/hummingbird.jpg")
    ];

    const exam = new Exam("General Knowledge Exam", questions, 60);

    elements.startBtn.addEventListener('click', () => {
        const name = elements.nameInput.value.trim();
        if (!name) {
            alert('Please enter your name to start the exam.');
            return;
        }
        
        exam.studentName = name;
        elements.nameDisplay.textContent = name;
        elements.welcomeModal.style.display = 'none';
        elements.examContent.style.display = 'flex';
        
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
            elements.questionImage.style.display = 'block';
        } else {
            elements.questionImage.style.display = 'none';
        }

        elements.optionsContainer.innerHTML = '';
        question.options.forEach((option, index) => {
            const optionDiv = document.createElement('div');
            optionDiv.className = `option ${question.userAnswer === index ? 'selected' : ''}`;
            
            const letter = document.createElement('span');
            letter.className = 'option-letter';
            letter.textContent = String.fromCharCode(65 + index); 
            
            const text = document.createElement('span');
            text.textContent = option;
            
            optionDiv.appendChild(letter);
            optionDiv.appendChild(text);
            optionDiv.onclick = () => selectAnswer(index);
            
            elements.optionsContainer.appendChild(optionDiv);
        });

        elements.nextBtn.classList.toggle('disabled', !question.isAnswered());

        if (exam.isLastQuestion()) {
            elements.nextBtn.style.display = 'none';
            elements.buttonsContainer.className = 'buttons-container last-question';
        } else {
            elements.nextBtn.style.display = 'flex';
            elements.buttonsContainer.className = 'buttons-container';
        }
    }

    function selectAnswer(index) {
        exam.getCurrentQuestion().userAnswer = index;
        elements.nextBtn.classList.remove('disabled');
        displayQuestion();
    }

    function updateTimer(timeRemaining) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        elements.timerText.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        const percentRemaining = (timeRemaining / exam.timeLimit) * 100;
        elements.timerProgress.style.width = `${percentRemaining}%`;
    }

    function finishExam() {
        exam.stopTimer();
        const results = exam.getResults();
        
        document.body.innerHTML = `
            <div style="max-width: 800px; margin: 0 auto; padding: 40px; background: white; border-radius: 20px; box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);">
                <h1 style="text-align: center; margin-bottom: 30px; color: #2b5876; font-family: 'Pacifico', serif;">Exam Results</h1>
                <div style="font-size: 24px; text-align: center; margin-bottom: 10px;">
                    <strong>${results.studentName}</strong>
                </div>
                <div style="display: flex; justify-content: center; margin: 30px 0;">
                    <div style="
                        width: 150px; 
                        height: 150px; 
                        border-radius: 50%; 
                        background: conic-gradient(
                            ${results.percentage >= 70 ? '#4CAF50' : '#FF5722'} ${results.percentage * 3.6}deg, 
                            #f0f0f0 ${results.percentage * 3.6}deg 360deg
                        );
                        display: flex; 
                        justify-content: center; 
                        align-items: center; 
                        position: relative;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                    ">
                        <div style="
                            position: absolute;
                            width: 130px;
                            height: 130px;
                            border-radius: 50%;
                            background: white;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            font-size: 36px;
                            font-weight: bold;
                            color: ${results.percentage >= 70 ? '#4CAF50' : '#FF5722'};
                            font-family: 'Pacifico', serif;
                        ">
                            ${results.percentage.toFixed(0)}%
                        </div>
                    </div>
                </div>
                <div style="font-size: 20px; text-align: center; margin-bottom: 20px;">
                    You have <strong>${results.score}</strong> out of <strong>${results.total}</strong> Correct answers
                </div>
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="window.location.reload()" style="padding: 12px 24px; background: linear-gradient(135deg, #2b5876, #4e4376); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Pacifico', serif;">
                        Retry Exam
                    </button>
                </div>
            </div>
        `;
    }

    elements.nextBtn.addEventListener('click', () => {
        if (!elements.nextBtn.classList.contains('disabled')) {
            exam.nextQuestion();
            displayQuestion();
        }
    });

    elements.finishBtn.addEventListener('click', finishExam);
});