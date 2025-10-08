import { UniqueEntityId } from "@/core/entities/unique-entity-id.js";
import { right, type Either } from "@/core/either.js";
import { Notification } from "../../enterprise/entities/notification.js";
import type { NotificationsRepository } from "../repositories/notifications-repository.js";

interface SendNotificationRequestUseCaseRequest {
    recipientId: string;
    title: string;
    content: string;
}

type SendNotificationRequestUseCaseResponse = Either<
    null,
    {
        notification: Notification;
    }
>

export class SendNotificationUseCase {
    constructor(
        private notificationsRepository: NotificationsRepository,
    ) { }

    async execute({
        recipientId,
        title,
        content,
    }: SendNotificationRequestUseCaseRequest): Promise<SendNotificationRequestUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityId(recipientId),
            title,
            content
        });

        await this.notificationsRepository.create(notification);

        return right({
            notification
        })
    }
}