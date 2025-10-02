import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { QuestionComment } from "../../enterprise/entities/question-comment.js";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";

interface CommentOnQuestionRequestUseCaseRequest {
    authorId: string
    questionId: string
    content: string
}

type CommentOnQuestionRequestUseCaseResponse = Either<
    ResourceNotFoundError,
    {
        questionComment: QuestionComment
    }
>

export class CommentOnQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionCommentsRepository: QuestionCommentsRepository
    ) { }

    async execute({
        authorId,
        questionId,
        content
    }: CommentOnQuestionRequestUseCaseRequest): Promise<CommentOnQuestionRequestUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
            content
        })

        await this.questionCommentsRepository.create(questionComment)

        return right({
            questionComment
        })
    }
}