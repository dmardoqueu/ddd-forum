import { left, right, type Either } from "@/core/either.js";
import type { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";

interface EditQuestionRequestUseCaseRequest {
    authorId: string;
    questionId: string;
    title: string;
    content: string;
}

type EditQuestionRequestUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError, {
        question: Question
    }
>

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) { }

    async execute({
        authorId,
        questionId,
        title,
        content,
    }: EditQuestionRequestUseCaseRequest): Promise<EditQuestionRequestUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        question.title = title;
        question.content = content;

        await this.questionsRepository.save(question);

        return right({
            question
        })
    }
}