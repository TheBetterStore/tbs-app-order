import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import container from './container';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {HttpUtils} from '@thebetterstore/tbs-lib-infra-common/lib/http-utils';
import {IClaims} from "../../../domain/models/claims.interface";
import {APIGatewayProxyEvent} from "aws-lambda";



console.log('INFO - cold-starting lambdas...');

exports.handler = async (event: APIGatewayProxyEvent) => {
  console.info('Entered get-orders.handler', event);
  console.debug(JSON.stringify(event));

  if (!event.requestContext || !event.requestContext.authorizer) {
    return HttpUtils.buildJsonResponse(400, {message: 'Missing authorizer'});
  }

  const userClaims: IClaims = event.requestContext.authorizer.claims;
  console.debug('Received userClaims:', userClaims);

  const customerId = userClaims.sub;

  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);

  if(event.pathParameters) {
    const params = event.pathParameters;
    if (params.id) {
      const o = await svc.getOrder(customerId, params.id);
      console.debug('Retrieved order:', o);
      const response = HttpUtils.buildJsonResponse(200, o, {});
      console.debug('Returning response:', response);
      console.info('Exiting handler');
      return response;
    }
  } else {
    const p = await svc.getOrders(customerId);

    console.debug('Retrieved orders:', p);

    const response = HttpUtils.buildJsonResponse(200, p);
    console.info('Exiting handler');
    return response;
  }
};
