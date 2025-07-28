import { Injectable } from '@nestjs/common';
import { WebsocketDto } from './dto/websocket.dto'

export type Message = {
  sender: string;
  message: WebsocketDto;
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

  findAll() {
    return `This action returns all websocket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} websocket`;
  }

  remove(id: number) {
    return `This action removes a #${id} websocket`;
  }
}
