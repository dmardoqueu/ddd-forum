import type { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface EditQuestionRequestUseCaseRequest {
    authorId: string;
    questionId: string;
    title: string;
    content: string;
}

interface EditQuestionRequestUseCaseResponse {
    question: Question
}

export class EditQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        authorId,
        questionId,
        title,
        content,
    }: EditQuestionRequestUseCaseRequest): Promise<EditQuestionRequestUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId);

        if (!question) {
            throw new Error('Question not found');
        }

        if (authorId !== question.authorId.toString()) {
            throw new Error('You are not the author of this question');
        }

        question.title = title;
        question.content = content;

        await this.questionsRepository.save(question);

        return {
            question
        };
    }
}