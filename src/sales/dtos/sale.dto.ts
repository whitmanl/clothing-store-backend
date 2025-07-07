import { IsNumber, IsArray, IsString } from 'class-validator';

class ProductDto {
  @IsString()
  productId: string;

  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsNumber()
  quantity: number;
}

export class SaleDto {
  @IsString()
  userId: string;

  @IsArray()
  products: ProductDto[];

  @IsNumber()
  totalPrice: number;
}
