import { Injectable } from '@nestjs/common';

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
