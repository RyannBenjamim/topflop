import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Request,
} from "@nestjs/common";
import { NotificationsService } from "./notifications.service";
import { ApiResponse } from "../../common/interfaces/ApiResponse";
import { NotificationResponse } from "./interfaces/NotificationResponse";
import { UnreadCountResponse } from "./interfaces/UnreadCountResponse";
import { NotificationMapper } from "./mappers/notification.mapper";
import type { AuthenticatedRequest } from "../../common/interfaces/AuthenticatedRequest";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findMine(
    @Request() req: AuthenticatedRequest
  ): Promise<ApiResponse<NotificationResponse[]>> {
    const notifications = await this.notificationsService.findManyByRecipient(req.user.id);
    return {
      message: "Notifications listed successfully.",
      data: notifications.map(NotificationMapper.toResponse),
    };
  }

  @Get("unread-count")
  async countUnread(
    @Request() req: AuthenticatedRequest
  ): Promise<ApiResponse<UnreadCountResponse>> {
    const count = await this.notificationsService.countUnread(req.user.id);
    return {
      message: "Unread notifications counted successfully.",
      data: { count },
    };
  }

  @Patch("read-all")
  async markAllAsRead(
    @Request() req: AuthenticatedRequest
  ): Promise<ApiResponse<UnreadCountResponse>> {
    const count = await this.notificationsService.markAllAsRead(req.user.id);
    return {
      message: "Notifications marked as read.",
      data: { count },
    };
  }

  @Patch(":id/read")
  async markAsRead(
    @Request() req: AuthenticatedRequest,
    @Param("id", ParseUUIDPipe) id: string
  ): Promise<ApiResponse<NotificationResponse>> {
    const notification = await this.notificationsService.markAsRead(id, req.user.id);
    return {
      message: "Notification marked as read.",
      data: NotificationMapper.toResponse(notification),
    };
  }
}
