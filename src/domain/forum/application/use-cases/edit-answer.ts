import { left, right, type Either } from "@/core/either.js";
import type { Answer } from "../../enterprise/entities/answer.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { NotAllowedError } from "./errors/not-allowed-error.js";

interface EditAnswerRequestUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

type EditAnswerRequestUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError, {
        answer: Answer
    }
>

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) { }

    async execute({
        authorId,
        answerId,
        content,
    }: EditAnswerRequestUseCaseRequest): Promise<EditAnswerRequestUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        answer.content = content;

        await this.answersRepository.save(answer);

        return right({
            answer
        })
    }
}