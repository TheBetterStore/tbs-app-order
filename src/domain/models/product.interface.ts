export interface IProduct {
  productId?: string;
  category: string;
  name: string;
  type: 'PHYSICAL' | 'DIGITAL';
  sku: string;
  description: string;
  price: number;
  brandId: string;
  hitCount: number;
  imageUrl: string;
  lastUpdatedTime: string;
}
