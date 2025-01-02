import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {HttpUtils} from '@thebetterstore/tbs-lib-infra-common/lib/http-utils';
import {IClaims} from "../../../domain/models/claims.interface";
import {APIGatewayProxyEvent} from "aws-lambda";

console.log('INFO - cold-starting lambdas...');
exports.handler = async (event: APIGatewayProxyEvent) => {
  Logger.info('Entered get-orders.handler', event);
  Logger.debug(JSON.stringify(event));

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'});
  }

  const userClaims: IClaims = event.requestContext.authorizer.claims;
  Logger.debug('Received userClaims:', userClaims);

  const customerId = userClaims.sub;

  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);

  if(event.pathParameters) {
    const params = event.pathParameters;
    if (params.id) {
      const o = await svc.getOrder(customerId, params.id);
      Logger.debug('Retrieved order:', o);
      const response = HttpUtils.buildJsonResponse(200, o, {});
      Logger.debug('Returning response:', response);
      Logger.info('Exiting handler');
      return response;
    }
  } else {
    const p = await svc.getOrders(customerId);

    Logger.debug('Retrieved orders:', p);

    const response = HttpUtils.buildJsonResponse(200, p);
    Logger.info('Exiting handler');
    return response;
  }
};
