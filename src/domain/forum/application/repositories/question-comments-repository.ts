import type { QuestionComment } from "../../enterprise/entities/question-comment.js";

export interface QuestionCommentsRepository {
    create(question: QuestionComment): Promise<void>;
}