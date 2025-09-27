import { expect } from 'vitest';
import { AnswerQuestionUseCase } from './answer-question.js';
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository.js';

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
    beforeEach(() => {
        inMemoryAnswersRepository = new InMemoryAnswersRepository()
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })

    it('should be able to create an answer', async () => { 
        const { answer } = await sut.execute({
            questionId: '1',
            instructorId: '1',
            content: 'Nova resposta'
        })

        expect(answer.id).toBeTruthy()
        expect(inMemoryAnswersRepository.items[0]?.id).toEqual(answer.id)
    })
});

