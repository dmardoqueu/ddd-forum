import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Question, type QuestionProps } from "@/domain/forum/enterprise/entities/question.js";
import { faker } from "@faker-js/faker";

export function makeQuestion(
    override: Partial<QuestionProps> = {},
    id?: UniqueEntityId
) {
    const question = Question.create({
        authorId: new UniqueEntityId(),
        title: faker.lorem.sentence(),
        content: faker.lorem.text(),
        ...override
    },
        id
    );

    return question
}