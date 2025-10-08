import { left, right, type Either } from "@/core/either.js";
import type { Answer } from "../../enterprise/entities/answer.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list.js";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import type { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository.js";

interface EditAnswerRequestUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
    attachmentsIds: string[];
}

type EditAnswerRequestUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError, {
        answer: Answer
    }
>

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
        private answersAttachmnentsRepository: AnswerAttachmentsRepository,
    ) { }

    async execute({
        authorId,
        answerId,
        content,
        attachmentsIds,
    }: EditAnswerRequestUseCaseRequest): Promise<EditAnswerRequestUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentAnswerAttachments = await this.answersAttachmnentsRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(
            currentAnswerAttachments
        )

        const answerAttachments = attachmentsIds.map(attachmentId => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                answerId: answer.id
            })
        })

        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList;

        answer.content = content;

        await this.answersRepository.save(answer);

        return right({
            answer
        })
    }
}