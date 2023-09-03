
import {OrderItemViewModel, OrderViewModel} from '../viewmodels/order-viewmodel';
import {OrderItemVO} from '../../domain/models/order-item.vo';
import {Order} from '../../domain/entities/order';

/**
 * OrderViewModelMapper
 */
export class OrderViewModelMapper {
  /**
   * mapToCreateNewOrderCommand
   * @param {OrderViewModel} vm
   * @return {CreateOrderCommand}
   */
  public static mapToNewOrder(vm: OrderViewModel): Order {
    const currentTime = new Date();
    const newOrderId = currentTime.getTime().toString(26).toUpperCase();
    const o = new Order(newOrderId, vm.customerId, vm.receiptEmail || '', vm.orderItems, vm.createdTime,
        vm.createdTime, vm.taxRate, vm.grossTotal);
    return o;
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
