import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
  ForbiddenException,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/createUser.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Param('id') id: string, @Request() req) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.usersService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.usersService.updateUser(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removeUser(@Param('id') id: string, @Request() req) {
    if (req.user.userId !== id) {
      throw new ForbiddenException('Access denied');
    }
    return this.usersService.removeUser(id);
  }

  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.usersService.login(body);
    return this.authService.getJwt(user);
  }
}
