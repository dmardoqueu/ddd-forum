import { expect } from 'vitest';
import { CreateQuestionUseCase } from './create-question.js';
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to create an question', async () => { 
        const { question } = await sut.execute({
            authorId: '1',
            title: 'Nova pergunta',
            content: 'Conteudo da pergunta'
        })

        expect(question.id).toBeTruthy()
        expect(inMemoryQuestionsRepository.items[0]?.id).toEqual(question.id)
    })
});

