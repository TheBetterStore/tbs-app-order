import {Order} from '../../domain/entities/order';

export interface IOrderRepository {
  getOrder(customerId: string, orderId: string): Promise<Order>;
  getOrders(customerId: string): Promise<Order[]>;
  createOrder(p: Order): Promise<Order>
  updateOrder(p: Order): Promise<Order>;
}
