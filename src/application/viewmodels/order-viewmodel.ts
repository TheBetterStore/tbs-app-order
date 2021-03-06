export interface OrderViewModel {
  customerId: string;
  orderId: string,
  receiptEmail?: string;
  stripeToken?: string;
  netTotal: number;
  grossTotal: number;
  taxRate: number;
  taxTotal: number;
  orderItems: OrderItemViewModel[];
  createdTime: string;
  lastUpdatedTime: string;
}

export interface OrderItemViewModel {
  quantity: number;
  productId: string;
  productName: string;
  price: number;
}
