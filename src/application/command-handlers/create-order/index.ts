import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {APIGatewayEvent} from 'aws-lambda';
import {IClaims} from '../../../domain/models/claims.interface';
import {OrderViewModel} from '../../viewmodels/order-viewmodel';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {HttpUtils} from '@thebetterstore/tbs-lib-infra-common/lib/http-utils';

console.log('INFO - lambda is cold-starting.');
exports.handler = async (event: APIGatewayEvent, context) => {
  Logger.info('Entered create-order.handler', event);
  Logger.debug(JSON.stringify(event));

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'});
  }
  const userClaims: IClaims = event.requestContext.authorizer.claims;
  Logger.debug('Received userClaims:', userClaims);

  //const orderTableName = process.env.ORDER_TABLE_NAME || '';

  // const paymentApiUrl = process.env.PAYMENT_API_URL || '';

  const orderVm: OrderViewModel = JSON.parse(event.body || '{}');
  if (!orderVm.orderItems || orderVm.orderItems.length < 1) {
    throw new Error('ORD-401: No items have been included in order');
  }

  orderVm.customerId = userClaims.sub;

  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);
  const p = await svc.createOrder(orderVm);
  Logger.debug('Result:', p);
  Logger.debug('Upserted order:', orderVm);

  const response = HttpUtils.buildJsonResponse(201, p);
  Logger.info('Exiting handler');
  return response;
};
