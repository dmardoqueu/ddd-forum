import type { Answer } from "../../enterprise/entities/answer.js";
import type { AnswersRepository } from "../repositories/answers-repository.js";

interface EditAnswerRequestUseCaseRequest {
    authorId: string;
    answerId: string;
    content: string;
}

interface EditAnswerRequestUseCaseResponse {
    answer: Answer
}

export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRepository,
    ) {}

    async execute({
        authorId,
        answerId,
        content,
    }: EditAnswerRequestUseCaseRequest): Promise<EditAnswerRequestUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId);

        if (!answer) {
            throw new Error('Answer not found');
        }

        if (authorId !== answer.authorId.toString()) {
            throw new Error('You are not the author of this answer');
        }

        answer.content = content;

        await this.answersRepository.save(answer);

        return {
            answer
        };
    }
}