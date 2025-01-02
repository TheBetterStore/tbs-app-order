/**
 * OrderDto
 */
export interface OrderDto {
  CustomerId: string;
  OrderId?: string,
  ReceiptEmail?: string;
  AmountCharged: number;
  NetTotal: number;
  GrossTotal: number;
  TaxRate: number;
  TaxTotal: number;
  OrderItems: OrderItemDto[];
  CreatedTime: string;
  LastUpdatedTime: string;
}

export interface OrderItemDto {
  Quantity: number;
  ProductId: string;
  ProductName: string;
  Price: number;
}
