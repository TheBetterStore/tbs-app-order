import {OrderItemVO} from '../models/order-item.vo';

/**
 * CreateOrderCommand
 */
export abstract class OrderCommand {
  customerId: string = '';
  orderId: string = '';
  orderItems: OrderItemVO[] = [];
  taxRate: number = 0.15;
  chargeTotal: number = 0;
}
