import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SaleDocument = Sale & Document;

@Schema()
class Product {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  quantity: number;
}

@Schema({ timestamps: true })
export class Sale {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [Product], required: true })
  products: Product[];

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ required: true })
  saleDate: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);

SaleSchema.set('toJSON', {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    ret.products = ret.products.map((product) => {
      return {
        ...product,
        id: product._id,
        _id: undefined,
      };
    });
    return ret;
  },
});
