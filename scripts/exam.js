export class Exam {
    constructor(title, questions, timeLimit) {
        this.title = title;
        this.questions = this.shuffleQuestions(questions);
        this.currentIndex = 0;
        this.timeLimit = timeLimit;
        this.timeRemaining = timeLimit;
        this.timer = null;
        this.studentName = '';
    }

    shuffleQuestions(questions) {
        return [...questions].sort(() => Math.random() - 0.5);
    }

    getCurrentQuestion() {
        return this.questions[this.currentIndex];
    }

    nextQuestion() {
        if (this.currentIndex < this.questions.length - 1) {
            this.currentIndex++;
            return true;
        }
        return false;
    }

    goToQuestion(index) {
        if (index >= 0 && index < this.questions.length) {
            this.currentIndex = index;
            return true;
        }
        return false;
    }

    getResults() {
        const correctAnswers = this.questions.filter(q => q.isCorrect()).length;
        const percentage = (correctAnswers / this.questions.length) * 100;

        return {
            studentName: this.studentName,
            score: correctAnswers,
            total: this.questions.length,
            percentage: percentage,
            answers: this.questions.map(q => ({
                question: q.title,
                userAnswer: q.userAnswer !== null ? q.options[q.userAnswer] : 'Not answered',
                correctAnswer: q.options[q.correctAnswer],
                isCorrect: q.isCorrect()
            }))
        };
    }

    startTimer(onTick, onComplete) {
        this.timer = setInterval(() => {
            this.timeRemaining--;
            if (onTick) onTick(this.timeRemaining);

            if (this.timeRemaining <= 0) {
                this.stopTimer();
                if (onComplete) onComplete();
            }
        }, 1000);
    }

    stopTimer() {
        clearInterval(this.timer);
    }

    isLastQuestion() {
        return this.currentIndex === this.questions.length - 1;
    }
}