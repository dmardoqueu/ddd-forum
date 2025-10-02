import { expect } from 'vitest';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { InMemoryQuestionCommentsRepository } from 'test/respositories/in-memory-question-comments-repository.js';
import { makeQuestionComment } from 'test/factories/make-question-comment.js';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Question Comments', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository)
    })

    it('should be able to fetch question comments', async () => {
        await inMemoryQuestionCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityId('question-1')
            })
        )

        await inMemoryQuestionCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityId('question-1')
            })
        )

        await inMemoryQuestionCommentsRepository.create(
            makeQuestionComment({
                questionId: new UniqueEntityId('question-1')
            })
        )

        const result = await sut.execute({
            questionId: 'question-1',
            page: 1
        })

        expect(result.value?.questionComments).toHaveLength(3)
    })

    it('should be able to fetch paginated question comments', async () => {
        for (let i = 1; i <= 22; i++) {
            await inMemoryQuestionCommentsRepository.create(
                makeQuestionComment({
                    questionId: new UniqueEntityId('question-1')
                }))
        }

        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(result.value?.questionComments).toHaveLength(2)
    })
});

