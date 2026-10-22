import { Module } from "@nestjs/common";
import { BullModule } from "@nestjs/bullmq";
import { MailService } from "./mail.service";
import { MailQueue } from "./jobs/mail.queue";
import { MailProcessor } from "./jobs/mail.processor";
import { MAIL_QUEUE } from "./jobs/mail.constants";

@Module({
  imports: [BullModule.registerQueue({ name: MAIL_QUEUE })],
  providers: [MailService, MailQueue, MailProcessor],
  exports: [MailQueue],
})
export class MailModule {}
