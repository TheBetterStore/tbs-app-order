import {PutEventsCommand, PutEventsCommandInput, PutEventsCommandOutput} from '@aws-sdk/client-eventbridge';
import {IEventBridgeClient} from '../../interfaces/eventbridge-client.interface';
import {EventBridgeClient as EbClient} from '@aws-sdk/client-eventbridge';
import {injectable} from 'inversify';

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
    console.info('Entered EventBridgeClient.send()');
    const data = await this.ebClient.send(new PutEventsCommand(params));
    return data;
  }
}
