import {PutEventsCommand, PutEventsCommandInput, PutEventsCommandOutput} from '@aws-sdk/client-eventbridge';
import {IEventBridgeClient} from '../interfaces/eventbridge-client.interface';
import {EventBridgeClient as EbClient} from '@aws-sdk/client-eventbridge';
import {injectable} from 'inversify';
import {Logger} from '@thebetterstore/tbs-lib-infra-common/lib/logger';

@injectable()
/**
 * EventBridgeClient
 */
export class EventBridgeClient implements IEventBridgeClient {
  private ebClient = new EbClient({});

  /**
   *
   * @param {PutEventsCommandInput} params
   */
  async send(params: PutEventsCommandInput): Promise<PutEventsCommandOutput> {
    Logger.info('Entered EventBridgeClient.send()');
    const data = await this.ebClient.send(new PutEventsCommand(params));
    return data;
  }
}
