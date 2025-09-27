import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface DeleteQuestionRequestUseCaseRequest {
    authorId: string;
    questionId: string;
}

interface DeleteQuestionRequestUseCaseResponse {
}

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
            throw new Error('Question not found');
        }

        if (authorId !== question.authorId.toString()) {
            throw new Error('You are not the author of this question');
        }

        await this.questionsRepository.delete(question);

        return {};
    }
}