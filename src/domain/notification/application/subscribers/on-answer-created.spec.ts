import { makeAnswer } from "test/factories/make-answer.js"
import { OnAnswerCreated } from "./on-answer-created.js"
import { InMemoryAnswerAttachmentsRepository } from "test/respositories/in-memory-answer-attachments-repository.js"
import { InMemoryAnswersRepository } from "test/respositories/in-memory-answers-repository.js"
import { InMemoryQuestionsRepository } from "test/respositories/in-memory-questions-repository.js"
import { InMemoryQuestionAttachmentsRepository } from "test/respositories/in-memory-question-attachments-repository.js"
import { SendNotificationUseCase } from "../use-cases/send-notification.js"
import { InMemoryNotificationsRepository } from "test/respositories/in-memory-notifications-repository.js"
import { makeQuestion } from "test/factories/make-question.js"
import { vi } from "vitest"
import { waitFor } from "test/utils/wait-for.js"

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: any

describe('On Answer Created', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository =
            new InMemoryQuestionAttachmentsRepository()

        inMemoryQuestionsRepository =
            new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)

        inMemoryAnswerAttachmentsRepository =
            new InMemoryAnswerAttachmentsRepository()

        inMemoryAnswersRepository =
            new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository,)

        inMemoryNotificationsRepository =
            new InMemoryNotificationsRepository()

        sendNotificationUseCase =
            new SendNotificationUseCase(inMemoryNotificationsRepository)

        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
    })

    it('should  send a notification when an answer is created', async () => {
        const question = makeQuestion()
        const answer = makeAnswer({ questionId: question.id })

        inMemoryQuestionsRepository.create(question)
        inMemoryAnswersRepository.create(answer)

        await waitFor(() => {
            expect(sendNotificationExecuteSpy).toHaveBeenCalled()
        })
    })
})