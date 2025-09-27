import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";

interface CreateQuestionRequestUseCaseRequest {
    authorId: string;
    title: string;
    content: string;
}

interface CreateQuestionRequestUseCaseResponse {
    question: Question;
}

export class CreateQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        authorId,
        title,
        content
    }: CreateQuestionRequestUseCaseRequest): Promise<CreateQuestionRequestUseCaseResponse> {
        const question = Question.create({
            authorId: new UniqueEntityId(authorId),
            title,
            content
        });

        await this.questionsRepository.create(question);

        return {
            question
        };
    }
}