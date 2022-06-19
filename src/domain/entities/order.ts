import {OrderItemVO} from '../models/order-item.vo';

/**
 * Order
 */
export class Order {
  orderId?: string;
  customerId: string = '';
  receiptEmail?: string = '';
  createdTime: string = new Date().toISOString();
  lastUpdatedTime: string = new Date().toISOString();
  orderItems: OrderItemVO[] = [];
  taxRate: number = 0.15;
  amountCharged: number = 0;

  /**
   * constructor
   * @param {string} orderId
   * @param {string} customerId
   * @param {string} receiptEmail
   * @param {OrderItemVO[]} orderItems
   * @param {string} createdTime
   * @param {string} lastUpdatedTime
   * @param {number} taxRate
   * @param {number} amountCharged
   */
  constructor(orderId: string, customerId: string, receiptEmail: string, orderItems: OrderItemVO[],
      createdTime:string, lastUpdatedTime: string, taxRate: number, amountCharged: number) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.receiptEmail = receiptEmail;
    this.orderItems = orderItems;
    this.createdTime = createdTime;
    this.lastUpdatedTime = lastUpdatedTime;
    this.taxRate = taxRate;
    this.amountCharged = amountCharged;
  }

  /**
   * getNetTotal
   * @return {number}
   */
  getNetTotal(): number {
    return Order.arrayPropertySum(this.orderItems, 'price');
  }

  /**
   * getGrossTotal
   * @return {number}
   */
  getGrossTotal(): number {
    const netTotal = this.getNetTotal();
    const taxTotal = this.getTaxTotal();
    return netTotal - taxTotal;
  }

  /**
   * getTaxTotal
   * @return {number}
   */
  getTaxTotal(): number {
    const netTotal = this.getNetTotal();
    return netTotal * this.taxRate;
  }

  /**
   * Returns sum of a specific property's values in an array. NB this must contain numbers only
   * @param {any[]} array
   * @param {string} key
   * @return {number}
   * @private
   */
  private static arrayPropertySum(array: any[], key: string) : number {
    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }
}
