import { DynamicModule, Module } from '@nestjs/common';
import { DbService } from './db.service';

export interface DbModuleOptions {
  // 数据库文件路径
  path: string
}

@Module({})
export class DbModule {
  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [
        {
          // 通过 provide: "OPTIONS" 和 useValue: options 将传入的配置选项注册为可注入的值
          provide: "OPTIONS",
          useValue: options
        },
        DbService,
      ],
      exports: [DbService]
    }
  }
}
