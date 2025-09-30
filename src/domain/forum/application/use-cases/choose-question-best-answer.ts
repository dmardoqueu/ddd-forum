import { UniqueEntityId } from "../../../../core/entities/unique-entity-id.js";
import { Answer } from "../../enterprise/entities/answer.js";
import type { Question } from "../../enterprise/entities/question.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface ChooseQuestionBestAnswerRequestUseCaseRequest {
    answerId: string
    authorId: string
}

interface ChooseQuestionBestAnswerRequestUseCaseResponse {
    question: Question
}

export class ChooseQuestionBestAnswerUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private answersRepository: AnswersRepository
    ) { }

    async execute({
        answerId,
        authorId
    }: ChooseQuestionBestAnswerRequestUseCaseRequest): Promise<ChooseQuestionBestAnswerRequestUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            throw new Error('Answer not found')
        }

        const question = await this.questionsRepository.findById(answer.questionId.toValue())

        if (!question) {
            throw new Error('Question not found')
        }

        if (authorId !== question.authorId.toString()) {
            throw new Error('Not allowed')
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return {
            question
        }

    }
}