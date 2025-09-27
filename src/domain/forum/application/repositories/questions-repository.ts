import type { Question } from "../../enterprise/entities/question.js";

export interface QuestionsRepository {
    create(questuin: Question): Promise<void>;
}