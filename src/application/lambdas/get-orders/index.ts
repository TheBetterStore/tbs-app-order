import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {HttpUtils} from '@thebetterstore/tbs-lib-infra-common/lib/http-utils';

console.log('INFO - cold-starting lambdas...');
exports.handler = async (event, context) => {
  Logger.info('Entered handler');

  const orderTableName = process.env.ORDER_TABLE_NAME || '';
  container.bind<string>(TYPES.OrderTableName).toConstantValue(orderTableName);

  // Note the follow 2 bindings are redundant for GetOrder
  const paymentApiUrl = process.env.PAYMENT_API_URL || '';
  container.bind<string>(TYPES.PaymentApiUrl).toConstantValue(paymentApiUrl);

  const tbsEventBusArn = process.env.TBS_EVENTBUS_ARN || '';
  container.bind<string>(TYPES.TbsEventBusArn).toConstantValue(tbsEventBusArn);

  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);
  const p = await svc.getOrders('BOOKS');

  Logger.debug('Retrieved order:', p);

  const response = HttpUtils.buildJsonResponse(200, p);
  Logger.info('Exiting handler');
  return response;
};
