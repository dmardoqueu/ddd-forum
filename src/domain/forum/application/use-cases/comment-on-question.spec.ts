import { InMemoryQuestionsRepository } from "test/respositories/in-memory-questions-repository.js"
import { makeQuestion } from "test/factories/make-question.js"
import { InMemoryQuestionCommentsRepository } from "test/respositories/in-memory-question-comments-repository.js"
import { CommentOnQuestionUseCase } from "./comment-on-question.js"

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentario teste'
    })

    expect(inMemoryQuestionCommentsRepository.items[0]!.content).toEqual('Comentario teste')
  })
})