import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import type { Question } from "@/domain/forum/enterprise/entities/question.js";

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public items: Question[] = [];

    async create(question: Question): Promise<void> {
        this.items.push(question);
    }
}