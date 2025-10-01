import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import type { AnswerComment } from "../../enterprise/entities/answer-comment.js";

export interface AnswerCommentsRepository {
    findById(id: string): Promise<AnswerComment | null>;
    findManyByAnswerId(
        questionId: string,
        params: PaginationParams
    ): Promise<AnswerComment[]>
    create(answer: AnswerComment): Promise<void>;
    delete(answer: AnswerComment): Promise<void>;
}