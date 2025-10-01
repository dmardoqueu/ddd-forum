import { InMemoryQuestionCommentsRepository } from "test/respositories/in-memory-question-comments-repository.js"
import { DeleteQuestionCommentUseCase } from "./delete-question-comment.js"
import { makeQuestionComment } from "test/factories/make-question-comment.js"
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js"

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

        sut = new DeleteQuestionCommentUseCase(
            inMemoryQuestionCommentsRepository,
        )
    })

    it('should be able to delete a question comment', async () => {
        const questionComment = makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user question comment', async () => {
        const questionComment = makeQuestionComment({
            authorId: new UniqueEntityId('author-1')
        })

        await inMemoryQuestionCommentsRepository.create(questionComment)

        expect(() => {
            return sut.execute({
                questionCommentId: questionComment.id.toString(),
                authorId: 'author-2'
            })
        }).rejects.toBeInstanceOf(Error)
    })
})