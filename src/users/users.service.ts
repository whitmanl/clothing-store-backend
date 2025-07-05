import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users.schema';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(body: CreateUserDto): Promise<User> {
    const existing = await this.userModel.findOne({
      $or: [{ username: body.username }, { email: body.email }],
    });
    if (existing) {
      throw new ConflictException('Username or email already exists');
    }

    body.password = await bcrypt.hash(body.password, 10);
    const user = new this.userModel(body);
    return user.save();
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateUser(id: string, body: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    _.assign(user, body);
    await user.save();
    return this.getUserById(id);
  }

  async removeUser(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('User not found');
  }

  async login(body: LoginDto): Promise<User> {
    const { username, password } = body;
    const user = await this.userModel.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      return this.getUserById(user.id);
    }
    throw new NotFoundException('Username or password incorrect');
  }
}
