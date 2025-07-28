import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, WebsocketService } from './websocket.service';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';

@WebSocketGateway()
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
  // { sender: string; message: string }
  // TODO: 消息体验证
  handleSendMessage(@MessageBody() data) {
    const message: Message = {
      sender: '', // TODO: 根据消息发送方自动填充 sender，而不是通过用户传入
      message: data,
      timestamp: Date.now(),
    }

    console.log('subscribeMessage - sendMessage: ', message)

    // 广播消息给所有连接的客户端
    this.server.emit('message', message);

    // 保存消息
    this.websocketService.saveMessage(message)

    return { success: true };
  }

  @SubscribeMessage('createWebsocket')
  create(@MessageBody() createWebsocketDto: CreateWebsocketDto) {
    return this.websocketService.create(createWebsocketDto);
  }

  @SubscribeMessage('findAllWebsocket')
  findAll() {
    return this.websocketService.findAll();
  }

  @SubscribeMessage('findOneWebsocket')
  findOne(@MessageBody() id: number) {
    return this.websocketService.findOne(id);
  }

  @SubscribeMessage('updateWebsocket')
  update(@MessageBody() updateWebsocketDto: UpdateWebsocketDto) {
    return this.websocketService.update(
      updateWebsocketDto.id,
      updateWebsocketDto,
    );
  }

  @SubscribeMessage('removeWebsocket')
  remove(@MessageBody() id: number) {
    return this.websocketService.remove(id);
  }
}
