import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { SalesService } from './sales.service';
import { SaleDto } from './dtos/sale.dto';

@Controller('api/sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createSale(@Body() body: SaleDto, @Request() req) {
    return this.salesService.createSale(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  async findByUser(@Param('userId') userId: string, @Request() req) {
    if (req.user.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return this.salesService.findSaleByUserId(userId);
  }
}
