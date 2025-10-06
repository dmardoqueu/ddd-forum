import { expect } from 'vitest';
import { CreateQuestionUseCase } from './create-question.js';
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';

import { InMemoryQuestionAttachmentsRepository } from 'test/respositories/in-memory-question-attachments-repository.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to create an question', async () => {
        const result = await sut.execute({
            authorId: '1',
            title: 'Nova pergunta',
            content: 'Conteudo da pergunta',
            attachmentsIds: ['1', '2']
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
        expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
        ])
    })
});

