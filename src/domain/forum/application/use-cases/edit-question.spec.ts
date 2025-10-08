import { InMemoryQuestionsRepository } from 'test/respositories/in-memory-questions-repository.js';
import { makeQuestion } from 'test/factories/make-question.js';
import { UniqueEntityId } from '@/core/entities/unique-entity-id.js';
import { EditQuestionUseCase } from './edit-question.js';
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error.js';
import { InMemoryQuestionAttachmentsRepository } from 'test/respositories/in-memory-question-attachments-repository.js';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment.js';

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Delete Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository)
    })

    it('should be able to delete a question', async () => {
        const newQuestion = makeQuestion({
            authorId: new UniqueEntityId('author-1')
        }, new UniqueEntityId('question-1'))

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('1')
            }),

            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityId('2')
            }),
        )

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta teste',
            content: 'Conteudo teste',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteudo teste',
        })

        expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toHaveLength(2)

        expect(inMemoryQuestionsRepository.items[0]?.attachments.currentItems).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
        ])
    })
})

it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion({
        authorId: new UniqueEntityId('author-1')
    }, new UniqueEntityId('question-1'))

    inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
        questionId: newQuestion.id.toValue(),
        authorId: 'author-2',
        title: 'Pergunta teste',
        content: 'Conteudo teste',
        attachmentsIds: []
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
})

