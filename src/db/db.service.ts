import { Inject, Injectable } from '@nestjs/common';
import { DbModuleOptions } from './db.module';
import { access, readFile, writeFile } from 'fs/promises';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private options: DbModuleOptions;

  // 读取
  async read() {
    const filePath = this.options.path;

    try {
      // 检测文件是否存在
      await access(filePath);
    } catch (e) {
      return [];
    }

    // 读取文件内容
    const str = await readFile(filePath, { encoding: 'utf-8' });

    if (!str) {
      return [];
    }

    // 转为对象
    return JSON.parse(str);
  }

  // 写入
  async write(obj: Record<string, any>) {
    // 写入文件
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf-8',
    });
  }
}
