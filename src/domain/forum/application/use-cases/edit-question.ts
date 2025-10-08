import { left, right, type Either } from "@/core/either.js";
import type { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import type { QuestionAttachmentsRepository } from "../repositories/question-attachments-repository.js";
import { QuestionAttachmentList } from "../../enterprise/entities/question-attachment-list.js";
import { QuestionAttachment } from "../../enterprise/entities/question-attachment.js";
import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";

interface EditQuestionRequestUseCaseRequest {
    authorId: string;
    questionId: string;
    title: string;
    content: string;
    attachmentsIds: string[];
}

type EditQuestionRequestUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError, {
        question: Question
    }
>

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
        private questionAttachmnentsRepository: QuestionAttachmentsRepository,
    ) { }

    async execute({
        authorId,
        questionId,
        title,
        content,
        attachmentsIds,
    }: EditQuestionRequestUseCaseRequest): Promise<EditQuestionRequestUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        const currentQuestionAttachments = await this.questionAttachmnentsRepository.findManyByQuestionId(questionId)

        const questionAttachmentList = new QuestionAttachmentList(
            currentQuestionAttachments
        )

        const questionAttachments = attachmentsIds.map(attachmentId => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityId(attachmentId),
                questionId: question.id
            })
        })

        questionAttachmentList.update(questionAttachments)
        
        question.attachments = questionAttachmentList;
        question.title = title;
        question.content = content;

        await this.questionsRepository.save(question);

        return right({
            question
        })
    }
}