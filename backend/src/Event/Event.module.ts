import { Module } from "@nestjs/common";
import { EventController } from "./controllers/Event.controller";
import { NotificationController } from "./controllers/Notification.controller";
import { EventService } from "./services/Event.service";
import { NotificationService } from "./services/Notification.service";
import {UserModule} from '../user/user.module'

@Module({
    imports:[UserModule],
    controllers:[EventController,NotificationController],
    providers:[NotificationService,EventService]
})
export class EventModule{}