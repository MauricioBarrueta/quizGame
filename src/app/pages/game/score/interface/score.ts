export interface Score {
    index: number,
    question: string,
    selectedAnswer: string,
    correctAnswer: string,
    result: boolean // true: Correcta / false: Incorrecta
}