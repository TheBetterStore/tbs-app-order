
import {OrderItemViewModel, OrderViewModel} from '../viewmodels/order-viewmodel';
import {OrderItemVO} from '../../domain/models/order-item.vo';
import {Order} from '../../domain/entities/order';
import {Logger} from "@thebetterstore/tbs-lib-infra-common/lib/logger";

/**
 * OrderViewModelMapper
 */
export class OrderViewModelMapper {
  /**
   * mapToCreateNewOrderCommand
   * @param {OrderViewModel} vm View model
   * @returns {Order} Created order
   */
  public static mapToNewOrder(vm: OrderViewModel): Order {
    const currentTime = new Date();
    const amountCharged = Math.floor(vm.grossTotal * 100) / 100;
    Logger.debug(`Amount charged: ${amountCharged}`);
    const newOrderId = currentTime.getTime().toString(26).toUpperCase();
    return new Order(newOrderId, vm.customerId, vm.receiptEmail || '', vm.orderItems,
        currentTime.toISOString(), currentTime.toISOString(), vm.taxRate, amountCharged, 'INITIAL');
  }

  /**
   * mapOrderToOrderVM
   * @param {Order} o Order entity to map
   * @returns {OrderViewModel} OrderViewModel
   */
  public static mapOrderToOrderVM(o: Order): OrderViewModel {
    let orderItems: any = [];
    if (o.orderItems) {
      orderItems = o.orderItems.map(OrderViewModelMapper.toOrderVMItem);
    }

    const vm: OrderViewModel = {
      orderId: o.orderId || '',
      customerId: o.customerId,
      receiptEmail: o.receiptEmail || '',
      taxRate: o.taxRate,
      createdTime: o.createdTime,
      lastUpdatedTime: o.lastUpdatedTime,
      orderItems: orderItems,
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
   * @returns {OrderItemVO}
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
