import {OrderItemVO} from '../../domain/models/order-item.vo';

export interface OrderDto {
  customerId: string;
  orderId?: string,
  receiptEmail?: string;
  amountCharged: number;
  netTotal: number;
  grossTotal: number;
  taxRate: number;
  taxTotal: number;
  orderItems: OrderItemVO[];
  createdTime: string;
  lastUpdatedTime: string;
}
