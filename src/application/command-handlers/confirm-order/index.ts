import 'reflect-metadata';
import TYPES from '../../../infrastructure/types';
import {APIGatewayEvent} from 'aws-lambda';
import {IAppOrderService} from '../../services/app-order-service.interface';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';
import {HttpUtils} from '@thebetterstore/tbs-lib-infra-common/lib/http-utils';
import {Container} from 'inversify';
import {IOrderRepository} from '../../../infrastructure/interfaces/order-repository.interface';
import {OrderRepository} from '../../../infrastructure/persistence/order-repository';
import {AppOrderService} from '../../services/app-order-service';
import {IRestApiClient} from '../../../infrastructure/interfaces/restapi-client.interface';
import {RestApiClient} from '../../../infrastructure/adapters/restapi-client';


exports.handler = async (event: APIGatewayEvent, context) => {
  Logger.info('Entered handler', event);
  const container = new Container();

  container.bind<IAppOrderService>(TYPES.IAppOrderService).to(AppOrderService).inSingletonScope();
  container.bind<IOrderRepository>(TYPES.IOrderRepository).to(OrderRepository).inSingletonScope();
  container.bind<IRestApiClient>(TYPES.IRestApiClient).to(RestApiClient).inSingletonScope();

  const orderVm = createSampleOrder();
  const svc = container.get<IAppOrderService>(TYPES.IAppOrderService);
  const p = await svc.confirmOrder(orderVm);
  Logger.debug('Result:', p);
  Logger.debug('Upserted order:', orderVm);

  const response = HttpUtils.buildJsonResponse(201, p);
  Logger.info('Exiting handler');
  return response;
};



function createSampleOrder(): any {}