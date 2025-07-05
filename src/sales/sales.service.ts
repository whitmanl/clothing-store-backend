import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sale, SaleDocument } from './sales.schema';
import { Model, Types } from 'mongoose';
import { SaleDto } from './dtos/sale.dto';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private saleModel: Model<SaleDocument>) {}

  async createSale(userId: string, body: SaleDto): Promise<Sale> {
    const { products } = body;
    if (products.length <= 0) {
      throw new BadRequestException('Your cart is empty!');
    }
    const totalPrice = _.sumBy(products, (v) => {
      return v.price * v.quantity;
    });

    const sale = new this.saleModel({
      userId: new Types.ObjectId(userId),
      products: products,
      totalPrice,
      saleDate: moment().utc(),
    });
    return sale.save();
  }

  async findSaleByUserId(userId: string): Promise<Sale[]> {
    return this.saleModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ saleDate: -1 })
      .exec();
  }
}
