import 'reflect-metadata';
import TYPES from '../../src/infrastructure/types';

import {IAppOrderService} from '../../src/application/services/app-order-service.interface';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {HttpUtils} from '@thebetterstore/tbs-lib-infra-common/lib/http-utils';
import {Container} from 'inversify';
import {IOrderRepository} from '../../src/infrastructure/interfaces/order-repository.interface';
import {AppOrderService} from '../../src/application/services/app-order-service';
import {IRestApiClient} from '../../src/infrastructure/interfaces/restapi-client.interface';
import {Order} from '../../src/domain/entities/order';
import {OrderViewModelMapper} from '../../src/application/mappers/order-viewmodel.mapper';


sampleFunctionTest();

/**
 *
 * @constructor
 */
async function sampleFunctionTest() {
  Logger.info('Entered handler');
  const container = new Container();

  container.bind<IAppOrderService>(TYPES.IAppOrderService).to(AppOrderService).inSingletonScope();
  container.bind<IOrderRepository>(TYPES.IOrderRepository).to(MockOrderRepository).inSingletonScope();
  container.bind<IRestApiClient>(TYPES.IRestApiClient).to(MockPaymentRestApiClient).inSingletonScope();

  const order = createSampleOrder();
  const vm = OrderViewModelMapper.mapOrderToOrderVM(order);
  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);
  const p = await svc.confirmOrder(vm);


  const response = HttpUtils.buildJsonResponse(201, p);
  Logger.info('Exiting handler');
  return response;
}

/**
 * createSampleOrder
 * @return {Order}
 */
function createSampleOrder(): Order {
  return new Order('123', '123', 'joe.bloggs@sample.com',
      [], '2022-06-12T01:00:12.000Z', '2022-06-12T01:00:12.000Z',
      0.15, 1 );
}

/**
 * MockOrderRepository
 */
class MockOrderRepository implements IOrderRepository {
  /**
   * createOrder
   * @param {Order} p
   * @return {Promise<Order>}
   */
  createOrder(p: Order): Promise<Order> {
    return Promise.resolve(createSampleOrder());
  }

  /**
   * getOrder
   * @param {string} id
   * @return {Promise<Order>}
   */
  getOrder(id: string): Promise<Order> {
    return Promise.resolve(createSampleOrder());
  }

  /**
   * getOrders
   * @param {string} customerId
   * @return {Promise<Order>}
   */
  getOrders(customerId: string): Promise<Order[]> {
    return Promise.resolve([]);
  }

  /**
   * updateOrder
   * @param {Order} p
   * @return {Promise<Order>}
   */
  updateOrder(p: Order): Promise<Order> {
    return Promise.resolve(createSampleOrder());
  }
}

/**
 * MockPaymentRestApiClient
 */
class MockPaymentRestApiClient implements IRestApiClient {
  /**
   * post
   * @param {string} endpointUrl
   * @param {string} body
   * @param {string} headers
   */
  post(endpointUrl: string, body: any, headers: any) {
  }
}
