import { expect } from 'vitest';
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository.js';
import { makeAnswer } from 'test/factories/make-answer.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { EditAnswerUseCase } from './edit-answer.js';
import { NotAllowedError } from './errors/not-allowed-error.js';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new EditAnswerUseCase(inMemoryAnswersRepository)
    })

    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('answer-1'))

        inMemoryAnswersRepository.create(newAnswer)

        await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-1',
            content: 'Conteudo teste',
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'Conteudo teste',
        })
    })

    it('should not be able to delete a answer from another user', async () => {
        const newAnswer = makeAnswer({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('answer-1'))

        inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: newAnswer.id.toValue(),
            authorId: 'author-2',
            content: 'Conteudo teste',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
});

