export class Question {
    constructor(title, options, correctAnswer, imageUrl = null) {
        this.title = title;
        this.options = options;
        this.correctAnswer = correctAnswer;
        this.userAnswer = null;
        this.imageUrl = imageUrl;
    }

    isCorrect() {
        return this.userAnswer === this.correctAnswer;
    }

    isAnswered() {
        return this.userAnswer !== null;
    }
}