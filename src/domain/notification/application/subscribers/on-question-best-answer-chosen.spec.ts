import { InMemoryAnswerAttachmentsRepository } from "test/respositories/in-memory-answer-attachments-repository.js"
import { InMemoryAnswersRepository } from "test/respositories/in-memory-answers-repository.js"
import { InMemoryNotificationsRepository } from "test/respositories/in-memory-notifications-repository.js"
import { InMemoryQuestionAttachmentsRepository } from "test/respositories/in-memory-question-attachments-repository.js"
import { InMemoryQuestionsRepository } from "test/respositories/in-memory-questions-repository.js"
import { SendNotificationUseCase } from "../use-cases/send-notification.js"
import { makeQuestion } from "test/factories/make-question.js"
import { makeAnswer } from "test/factories/make-answer.js"
import { waitFor } from "test/utils/wait-for.js"
import { OnQuestionBestAnswerChosen } from "./on-question-best-answer-chosen.js"

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sendNotificationUseCase: SendNotificationUseCase

let sendNotificationExecuteSpy: any

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    )
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    )

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  it('should send a notification when topic has new best answer chosen', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    inMemoryQuestionsRepository.create(question)
    inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
    })
  })
})