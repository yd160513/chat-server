import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WebsocketDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  userAvatar: string;

  @IsString()
  userNickname: string;

  @IsString()
  conversationId: string
}