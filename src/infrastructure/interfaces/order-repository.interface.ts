import {Order} from '../../domain/entities/order';

export interface IOrderRepository {
  getOrder(id: string): Promise<Order>;
  getOrders(customerId: string): Promise<Order[]>;
  createOrder(p: Order): Promise<Order>
  updateOrder(p: Order): Promise<Order>;
}
