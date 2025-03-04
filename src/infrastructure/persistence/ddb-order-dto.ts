export interface DdbOrderDto {
  AmountCharged: { N: number },
  Status: { S: 'INITIAL' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED' },
  TaxTotal: { N: number },
  CreatedTime: { S: string },
  OrderItems: {L: DdbOrderItemDto[]},
  LastUpdatedTime: { S: string },
  ReceiptEmail: { S: string },
  CustomerId: { S: string },
  OrderId: { S: string },
  StripePaymentIntent: { M: { Id: { S: string }, Status: { S: string } } },
  NetTotal: { N: number },
  GrossTotal: { N: number },
  TaxRate: { N: number },
}

export interface DdbOrderItemDto {
  M: {
    ProductName: { S: string },
    Price: { S: string },
    Quantity: { N: number },
    ProductId: { S: string }
  }
}
