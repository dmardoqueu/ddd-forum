import { expect } from 'vitest';
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';
import { makeQuestion } from 'test/factories/make-question.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { DeleteQuestionUseCase } from './delete-question.js';
import { NotAllowedError } from './errors/not-allowed-error.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to delete a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('question-1'))

        inMemoryQuestionsRepository.create(newQuestion)

        await sut.execute({
            questionId: 'question-1',
            authorId: 'author-1'
        })

        expect(inMemoryQuestionsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('question-1'))

        inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
                questionId: 'question-1',
                authorId: 'author-2'
            })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
});

