import type { AnswersRepository } from "../repositories/answers-repository.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";

interface CommentOnAnswerRequestUseCaseRequest {
    authorId: string
    answerId: string
    content: string
}

type CommentOnAnswerRequestUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        answerComment: AnswerComment
    }
>

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
            return left(new ResourceNotFoundError())
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityId(authorId),
            answerId: new UniqueEntityId(answerId),
            content
        })

        await this.answerCommentsRepository.create(answerComment)

        return right({
            answerComment
        })
    }
}