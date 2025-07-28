// websocket-exception.filter.ts
import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WebsocketFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const data = host.switchToWs().getData();
    const event = host.switchToWs().getPattern();

    console.log('WebSocket Exception:', exception); // 调试用

    // 处理 ValidationPipe 错误
    if ((exception as any).getResponse?.()?.message) {
      const response = (exception as any).getResponse();
      const status = (exception as any).getStatus?.() || HttpStatus.BAD_REQUEST;

      client.emit('error', {
        event,
        message: 'Validation failed',
        statusCode: status,
        errors: response.message, // 这包含了详细的验证错误信息
        receivedData: data,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 处理其他类型的异常
    if (exception instanceof WsException) {
      client.emit('error', {
        event,
        message: exception.message,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 处理 HttpException
    if (exception instanceof HttpException) {
      const response = exception.getResponse();
      client.emit('error', {
        event,
        message: exception.message,
        statusCode: exception.getStatus(),
        error: response,
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // 处理未知异常
    client.emit('error', {
      event,
      message: 'Internal server error',
      error: exception instanceof Error ? exception.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
}
