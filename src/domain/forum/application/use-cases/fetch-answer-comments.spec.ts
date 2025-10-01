import { expect } from 'vitest';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { InMemoryAnswerCommentsRepository } from 'test/respositories/in-memory-answer-comments-repository.js';
import { makeAnswerComment } from 'test/factories/make-answer-comment.js';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
    beforeEach(() => {
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to fetch answer comments', async () => {
        await inMemoryAnswerCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityId('answer-1')
            })
        )

        await inMemoryAnswerCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityId('answer-1')
            })
        )

        await inMemoryAnswerCommentsRepository.create(
            makeAnswerComment({
                answerId: new UniqueEntityId('answer-1')
            })
        )

        const { answerComments } = await sut.execute({
            answerId: 'answer-1',
            page: 1
        })

        expect(answerComments).toHaveLength(3)
    })

    it('should be able to fetch paginated answer comments', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(
                makeAnswerComment({
                    answerId: new UniqueEntityId('answer-1')
                }))
        }

        const { answerComments } = await sut.execute({
            answerId: 'answer-1',
            page: 2
        })

        expect(answerComments).toHaveLength(2)
    })
});

