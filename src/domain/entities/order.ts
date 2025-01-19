import {OrderItemVO} from '../models/order-item.vo';

/**
 * Order
 */
export class Order {
  orderId?: string;
  customerId: string;
  receiptEmail: string;
  createdTime: string;
  lastUpdatedTime: string;
  orderItems: OrderItemVO[] = [];
  taxRate: number = 0.15;
  amountCharged: number = 0;
  status: 'INITIAL' | 'PAID' | 'SHIPPED' | 'COMPLETED' = 'INITIAL';
  stripePaymentIntent: any = {};

  /**
   * constructor
   * @param {string} orderId
   * @param {string} customerId
   * @param {string} receiptEmail
   * @param {OrderItemVO[]} orderItems
   * @param {createdTime} createdTime
   * @param {lastUpdatedTime} lastUpdatedTime
   * @param {number} taxRate
   * @param {number} amountCharged
   * @param {'INITIAL' | 'PAID' | 'SHIPPED' | 'COMPLETED'} status
   */
  constructor(orderId: string, customerId: string, receiptEmail: string, orderItems: OrderItemVO[],
      createdTime: string, lastUpdatedTime: string, taxRate: number, amountCharged: number,
              status: 'INITIAL' | 'PAID' | 'SHIPPED' | 'COMPLETED') {
    this.orderId = orderId;
    this.customerId = customerId;
    this.receiptEmail = receiptEmail;
    this.orderItems = orderItems;
    this.createdTime = createdTime;
    this.lastUpdatedTime = lastUpdatedTime;
    this.taxRate = taxRate;
    this.amountCharged = amountCharged;
    this.status = status;
  }

  /**
   * getNetTotal
   * @returns {number} NetTotal
   */
  getNetTotal(): number {
    return Order.arrayPropertySum(this.orderItems, 'Price');
  }

  /**
   * getGrossTotal
   * @returns {number} GrossTotal
   */
  getGrossTotal(): number {
    const netTotal = this.getNetTotal();
    const taxTotal = this.getTaxTotal();
    return netTotal - taxTotal;
  }

  /**
   * getTaxTotal
   * @returns {number} TaxTotal
   */
  getTaxTotal(): number {
    const netTotal = this.getNetTotal();
    return netTotal * this.taxRate;
  }

  /**
   * Returns sum of a specific property's values in an array. NB this must contain numbers only
   * @param {any[]} array
   * @param {string} key
   * @returns {number} Sum of array property
   * @private
   */
  private static arrayPropertySum(array: any[], key: string) : number {
    if (!array) {
      return 0;
    }

    return array.reduce((a, b) => a + (b[key] || 0), 0);
  }
}
