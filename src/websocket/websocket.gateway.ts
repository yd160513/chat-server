import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer, ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, WebsocketService } from './websocket.service';
import { WebsocketDto } from './dto/websocket.dto';
import { UseFilters, ValidationPipe } from '@nestjs/common';
import { WebsocketFilter } from './exceptionFilter/websocket.filter'

@WebSocketGateway()
@UseFilters(WebsocketFilter)
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  handleConnection(client: any, ...args): any {
    console.log('client connected', client.id);
  }

  handleDisconnect(client: any): any {
    console.log('client disconnected', client.id);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    @MessageBody(new ValidationPipe({ transform: false })) data: WebsocketDto,
    @ConnectedSocket() client: Socket
    ) {
    console.log('data: ', data instanceof  WebsocketDto)
    const message: Message = {
      sender: client.id, // 自动填充发送方 ID
      message: data.message,
      timestamp: Date.now(),
    }

    console.log('subscribeMessage - sendMessage: ', message)

    // 广播消息给所有连接的客户端
    this.server.emit('message', message);

    // 保存消息
    this.websocketService.saveMessage(message)

    return { success: true };
  }

  @SubscribeMessage('findAllWebsocket')
  findAll() {
    return this.websocketService.findAll();
  }

  @SubscribeMessage('findOneWebsocket')
  findOne(@MessageBody() id: number) {
    return this.websocketService.findOne(id);
  }

  @SubscribeMessage('removeWebsocket')
  remove(@MessageBody() id: number) {
    return this.websocketService.remove(id);
  }
}
