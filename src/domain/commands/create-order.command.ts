import {OrderItemVO} from '../models/order-item.vo';
import {OrderCommand} from './order.command';

/**
 * CreateOrderCommand. TODO Currently redundant; potential future use?
 */
export class CreateOrderCommand extends OrderCommand {
  orderId: string = '';
  customerId: string = '';
  receiptEmail: string = '';
  orderItems: OrderItemVO[] = [];
  taxRate: number = 0.15;
  chargeTotal: number = 0;
  createdTime: string = new Date().toISOString();
}
