import { InMemoryAnswersRepository } from "test/respositories/in-memory-answers-repository.js"
import { makeAnswer } from "test/factories/make-answer.js"
import { CommentOnAnswerUseCase } from "./comment-on-answer.js"
import { InMemoryAnswerCommentsRepository } from "test/respositories/in-memory-answer-comments-repository.js"

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: CommentOnAnswerUseCase

describe('Comment on Answer', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository()

    sut = new CommentOnAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswerCommentsRepository,
    )
  })

  it('should be able to comment on answer', async () => {
    const answer = makeAnswer()

    await inMemoryAnswersRepository.create(answer)

    await sut.execute({
      answerId: answer.id.toString(),
      authorId: answer.authorId.toString(),
      content: 'Comentario teste'
    })

    expect(inMemoryAnswerCommentsRepository.items[0]!.content).toEqual('Comentario teste')
  })
})