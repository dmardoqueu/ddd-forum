import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { QuestionComment } from "../../enterprise/entities/question-comment.js";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

interface CommentOnQuestionRequestUseCaseRequest {
    authorId: string
    questionId: string
    content: string
}

interface CommentOnQuestionRequestUseCaseResponse {
    questionComment: QuestionComment
}

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
            throw new Error('Question not found')
        }

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityId(authorId),
            questionId: new UniqueEntityId(questionId),
            content
        })

        await this.questionCommentsRepository.create(questionComment)

        return {
            questionComment
        }
    }
}