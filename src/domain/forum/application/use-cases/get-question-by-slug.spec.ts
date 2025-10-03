import { expect } from 'vitest';
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.js';
import { makeQuestion } from 'test/factories/make-question.js';
import { Slug } from '../../enterprise/entities/value-objects/slug.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create('example-question')
        })

        inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'example-question'
        })

        expect(result.isRight()).toBe(true);

        if (result.isRight()) {
            expect(result.value.question.id).toBeTruthy();
            expect(result.value.question.title).toEqual(newQuestion.title);
        }

    })
});