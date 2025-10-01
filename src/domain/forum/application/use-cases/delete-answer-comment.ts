import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js"

interface DeleteAnswerCommentRequestUseCaseRequest {
    authorId: string
    answerCommentId: string
}

interface DeleteAnswerCommentRequestUseCaseResponse {}

export class DeleteAnswerCommentUseCase {
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository
    ) { }

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentRequestUseCaseRequest): Promise<DeleteAnswerCommentRequestUseCaseResponse> {
        const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

        if (!answerComment) {
            throw new Error('Answer comment not found')
        }

        if (answerComment.authorId.toString() !== authorId) {
            throw new Error('Not allowed')
        }

        await this.answerCommentsRepository.delete(answerComment)

        return {}
    }
}