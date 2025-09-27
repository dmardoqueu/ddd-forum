import type { AnswersRepository } from "@/domain/forum/application/repositories/answers-repository.js";
import type { Answer } from "@/domain/forum/enterprise/entities/answer.js";

export class InMemoryAnswersRepository implements AnswersRepository {
    async findById(id: string) {
        const answer = this.items.find(item => item.id.toString() === id);

        if (!answer) {
            return null;
        }

        return answer;
    }

    async delete(answer: Answer) {
        const itemIndex = this.items.findIndex(item => item.id === answer.id);

        this.items.splice(itemIndex, 1);
    }

    public items: Answer[] = [];

    async create(answer: Answer): Promise<void> {
        this.items.push(answer);
    }
}