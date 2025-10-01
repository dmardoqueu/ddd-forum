import type { AnswersRepository } from "../repositories/answers-repository.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";

interface CommentOnAnswerRequestUseCaseRequest {
    authorId: string
    answerId: string
    content: string
}

interface CommentOnAnswerRequestUseCaseResponse {
    answerComment: AnswerComment
}

export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answerCommentsRepository: AnswerCommentsRepository
    ) { }

    async execute({
        authorId,
        answerId,
        content
    }: CommentOnAnswerRequestUseCaseRequest): Promise<CommentOnAnswerRequestUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            throw new Error('Answer not found')
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityId(authorId),
            answerId: new UniqueEntityId(answerId),
            content
        })

        await this.answerCommentsRepository.create(answerComment)

        return {
            answerComment
        }
    }
}