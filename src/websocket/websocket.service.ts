import { Injectable } from '@nestjs/common';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';

export interface Message {
  sender: string;
  message: string;
  timestamp: number;
}

@Injectable()
export class WebsocketService {
  private messages: Message[] = []
  saveMessage(message: Message): Message {
    this.messages.push(message);
    return message;
  }

  getMessages(): Message[] {
    return this.messages;
  }

  create(createWebsocketDto: CreateWebsocketDto) {
    return 'This action adds a new websocket';
  }

  findAll() {
    return `This action returns all websocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websocket`;
  }

  update(id: number, updateWebsocketDto: UpdateWebsocketDto) {
    return `This action updates a #${id} websocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} websocket`;
  }
}
