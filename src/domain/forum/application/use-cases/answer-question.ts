import { UniqueEntityId } from "../../../../core/entities/unique-entity-id.js";
import { Answer } from "../../enterprise/entities/answer.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";

interface AnswerQuestionRequestUseCaseRequest {
    instructorId: string;
    questionId: string;
    content: string;
}

export class AnswerQuestionUseCase {
    constructor(
        private answersRepository: AnswersRepository
    ) {}

    async execute({ instructorId, questionId, content }: AnswerQuestionRequestUseCaseRequest) {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityId(instructorId),
            questionId: new UniqueEntityId(questionId),
        })

        await this.answersRepository.create(answer)

        return {
            answer
        }
    }
}