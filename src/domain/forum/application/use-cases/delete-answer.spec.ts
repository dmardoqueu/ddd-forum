import { UniqueEntityId } from "@/core/entities/unique-entity-id.js"
import { makeAnswer } from "test/factories/make-answer.js"
import { DeleteAnswerUseCase } from "./delete-answer.js"
import { InMemoryAnswersRepository } from "test/respositories/in-memory-answers-repository.js"
import { NotAllowedError } from "./errors/not-allowed-error.js"


let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityId('author-1'),
            },
            new UniqueEntityId('answer-1'),
        )

        await inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-1',
        })

        expect(inMemoryAnswersRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer from another user', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityId('author-1'),
            },
            new UniqueEntityId('answer-1'),
        )

        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})