import { expect } from 'vitest';
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.js';
import { makeQuestion } from 'test/factories/make-question.js';
import { Slug } from '../../enterprise/entities/value-objects/slug.js';
import { InMemoryQuestionAttachmentsRepository } from 'test/respositories/in-memory-question-attachments-repository.js';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        let inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
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