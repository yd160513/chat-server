import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { DbService } from '../db/db.service';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  @Inject(DbService)
  dbService: DbService;

  // 登录
  async login(loginUserDto: LoginUserDto) {
    const users: User[] = await this.dbService.read();

    const foundUser = users.find(item => item.username === loginUserDto.username)

    if (!foundUser) {
      throw new BadRequestException('用户不存在')
    }

    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('密码错误')
    }

    return foundUser
  }

  // 注册
  async register(registerUserDto: RegisterUserDto) {
    // 获取数据库中的数据
    const users: User[] = await this.dbService.read();

    const foundUser = users.find(item => item.username === registerUserDto.username)

    // 用户已注册，则响应 400 提示用户已注册
    if (foundUser) {
      throw new BadRequestException('该用户已注册')
    }

    // 创建新用户写入数据库中
    const user = new User()
    user.username = registerUserDto.username
    user.password = registerUserDto.password
    users.push(user)

    await this.dbService.write(users)
    return user
  }
}
