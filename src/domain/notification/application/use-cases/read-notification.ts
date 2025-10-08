import { left, right, type Either } from "@/core/either.js";
import { Notification } from "../../enterprise/entities/notification.js";
import type { NotificationsRepository } from "../repositories/notifications-repository.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";

interface ReadNotificationRequestUseCaseRequest {
    recipientId: string
    notificationId: string
}

type ReadNotificationRequestUseCaseResponse = Either<
    ResourceNotFoundError | NotAllowedError,
    {
        notification: Notification;
    }
>

export class ReadNotificationUseCase {
    constructor(
        private notificationsRepository: NotificationsRepository,
    ) { }

    async execute({
        recipientId,
        notificationId
    }: ReadNotificationRequestUseCaseRequest): Promise<ReadNotificationRequestUseCaseResponse> {
        const notification = await this.notificationsRepository.findById(notificationId)

        if (!notification) {
            return left(new ResourceNotFoundError())
        }

        if (recipientId !== notification.recipientId.toString()) {
            return left(new NotAllowedError())
        }

        notification.read()

        await this.notificationsRepository.create(notification);

        return right({
            notification
        })
    }
}