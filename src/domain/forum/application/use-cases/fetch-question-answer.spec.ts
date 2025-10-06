import { expect } from 'vitest';
import { makeQuestion } from 'test/factories/make-question.js';
import { InMemoryAnswersRepository } from 'test/respositories/in-memory-answers-repository.js';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers.js';
import { makeAnswer } from 'test/factories/make-answer.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { InMemoryAnswerAttachmentsRepository } from 'test/respositories/in-memory-answer-attachments-repository.js';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
    })

    it('should be able to fetch questions answers', async () => { 
        await inMemoryAnswersRepository.create(
            makeAnswer({
                questionId: new UniqueEntityId('question-1')
            })
        )
        await inMemoryAnswersRepository.create(
            makeAnswer({
                questionId: new UniqueEntityId('question-1')
            })
        )
        await inMemoryAnswersRepository.create(
            makeAnswer({
                questionId: new UniqueEntityId('question-1')
            })
        )

        const result = await sut.execute({
            questionId: 'question-1',
            page: 1
        })

        expect(result.value?.answers).toHaveLength(3)
    })

    it('should be able to fetch paginated question answers', async () => { 
        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswersRepository.create(makeAnswer({
                questionId: new UniqueEntityId('question-1')
            }))   
        }
        
        const result = await sut.execute({
            questionId: 'question-1',
            page: 2
        })

        expect(result.value?.answers).toHaveLength(2)
    })
});

