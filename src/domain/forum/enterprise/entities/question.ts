import type { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { Slug } from "./value-objects/slug.js";
import dayjs from "dayjs";
import type { Optional } from "@/core/types/optional.js";
import { AggregateRoot } from "@/core/entities/aggregate-root.js";
import type { Attachment } from "./attachment.js";
import type { QuestionAttachment } from "./question-attachment.js";

export interface QuestionProps {
    authorId: UniqueEntityId;
    bestAnswerId?: UniqueEntityId | undefined;
    title: string;
    content: string;
    slug: Slug;
    attachments: QuestionAttachment[];
    createdAt: Date;
    updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
    get authorId() {
        return this.props.authorId;
    }

    get bestAnswerId() {
        return this.props.bestAnswerId;
    }

    get title() {
        return this.props.title;
    }

    get content() {
        return this.props.content;
    }

    get slug() {
        return this.props.slug;
    }

    get attachments() {
        return this.props.attachments;
    }

    get createdAt() {
        return this.props.createdAt;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }

    get isNew(): boolean {
        return dayjs().diff(this.props.createdAt, 'day') <= 3;
    }

    get excerpt() {
        return this.content
            .substring(0, 120)
            .trimEnd()
            .concat('...');
    }

    private touch() {
        this.props.updatedAt = new Date();
    }

    set title(title: string) {
        this.props.title = title;
        this.props.slug = Slug.createFromText(title);
        this.touch();
    }

    set content(content: string) {
        this.props.content = content;
        this.touch();
    }

    set attachments(attachments: QuestionAttachment[]) {
        this.props.attachments = attachments
    }

    set bestAnswerId(bestAnswerId: UniqueEntityId | undefined) {
        this.props.bestAnswerId = bestAnswerId;
        this.touch();
    }

    static create(
        props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
        id?: UniqueEntityId
    ) {
        const question = new Question({
            ...props,
            slug: props.slug ?? Slug.createFromText(props.title),
            attachments: props.attachments ?? [],
            createdAt: props.createdAt ?? new Date(),
        },
            id
        );

        return question;
    }
}