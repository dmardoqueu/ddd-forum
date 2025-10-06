import { right, type Either } from "@/core/either.js";
import { UniqueEntityId } from "../../../../core/entities/unique-entity-id.js";
import { Answer } from "../../enterprise/entities/answer.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment.js";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list.js";

interface AnswerQuestionRequestUseCaseRequest {
    instructorId: string;
    questionId: string;
    attachmentsIds: string[]
    content: string;
}

type AnswerQuestionRequestUseCaseResponse = Either<
    null,
    {
        answer: Answer
    }
>

export class AnswerQuestionUseCase {
    constructor(
        private answersRepository: AnswersRepository
    ) { }

    async execute({ instructorId, questionId, content, attachmentsIds }: AnswerQuestionRequestUseCaseRequest): Promise<AnswerQuestionRequestUseCaseResponse> {
        const answer = Answer.create({
            content,
            authorId: new UniqueEntityId(instructorId),
            questionId: new UniqueEntityId(questionId),
        })

        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id
            })
        })

        answer.attachments = new AnswerAttachmentList(answerAttachments)


        await this.answersRepository.create(answer)

        return right({
            answer
        })
    }
}