export interface Questions {
  response_code: number
  results: TriviaResult[]
}

export interface TriviaResult {
  type: string
  difficulty: string
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}