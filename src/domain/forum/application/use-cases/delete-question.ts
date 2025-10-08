import { left, right, type Either } from "@/core/either.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";

interface DeleteQuestionRequestUseCaseRequest {
    authorId: string;
    questionId: string;
}

type DeleteQuestionRequestUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {}
>

export class DeleteQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        authorId,
        questionId
    }: DeleteQuestionRequestUseCaseRequest): Promise<DeleteQuestionRequestUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        await this.questionsRepository.delete(question);

        return right({})
    }
}