import { IsNotEmpty, IsString } from 'class-validator';

export class WebsocketDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}