import { expect } from 'vitest';
import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';
import { makeQuestion } from 'test/factories/make-question.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { EditQuestionUseCase } from './edit-question.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to delete a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('question-1'))

        inMemoryQuestionsRepository.create(newQuestion)

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta teste',
            content: 'Conteudo teste',
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteudo teste',
        })
    })

    it('should not be able to delete a question from another user', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('question-1'))

        inMemoryQuestionsRepository.create(newQuestion)

        expect(() => {
            return sut.execute({
                questionId: newQuestion.id.toValue(),
                authorId: 'author-2',
                title: 'Pergunta teste',
                content: 'Conteudo teste',
            })
        }).rejects.toBeInstanceOf(Error)
    })
});

