
import {OrderItemViewModel, OrderViewModel} from '../viewmodels/order-viewmodel';
import {CreateOrderCommand} from '../../domain/commands/create-order.command';
import {OrderItemVO} from '../../domain/models/order-item.vo';
import {Order} from '../../domain/entities/order';

/**
 * OrderViewModelMapper
 */
export class OrderViewModelMapper {
  /**
   * mapToCreateNewOrderCommand
   * @param {OrderViewModel} orderVM
   * @return {CreateOrderCommand}
   */
  public static mapToCreateNewOrderCommand(orderVM: OrderViewModel): CreateOrderCommand {
    const currentTime = new Date();
    const cmd: CreateOrderCommand = {
      orderId: currentTime.getTime().toString(26).toUpperCase(),
      customerId: orderVM.customerId,
      receiptEmail: orderVM.receiptEmail || '',
      taxRate: orderVM.taxRate,
      chargeTotal: orderVM.grossTotal,
      createdTime: new Date().toISOString(),
      orderItems: orderVM.orderItems.map(OrderViewModelMapper.toOrderItem),
    };
    return cmd;
  }

  /**
   * toOrderItem
   * @param {OrderItemViewModel} r
   * @private
   * @return {OrderItemVO}
   */
  private static toOrderItem(r: OrderItemViewModel): OrderItemVO {
    const result: OrderItemVO = {
      productId: r.productId,
      productName: r.productName,
      quantity: r.quantity,
      price: r.price,
    };
    return result;
  }

  /**
   * mapOrderToOrderVM
   * @param {Order} o
   * @return {OrderViewModel}
   */
  public static mapOrderToOrderVM(o: Order): OrderViewModel {
    const vm: OrderViewModel = {
      orderId: o.orderId || '',
      customerId: o.customerId,
      receiptEmail: o.receiptEmail || '',
      taxRate: o.taxRate,
      createdTime: o.createdTime,
      lastUpdatedTime: o.lastUpdatedTime,
      orderItems: o.orderItems.map(OrderViewModelMapper.toOrderVMItem),
      netTotal: o.getNetTotal(),
      grossTotal: o.getGrossTotal(),
      taxTotal: o.getTaxTotal(),
    };
    return vm;
  }

  /**
   * toOrderVMItem
   * @param {OrderItemViewModel} r
   * @private
   * @return {OrderItemVO}
   */
  private static toOrderVMItem(r: OrderItemVO): OrderItemViewModel {
    const result: OrderItemViewModel = {
      productId: r.productId,
      productName: r.productName,
      quantity: r.quantity,
      price: r.price,
    };
    return result;
  }
}
