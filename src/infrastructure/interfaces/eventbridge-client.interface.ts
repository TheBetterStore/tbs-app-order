import {PutEventsCommandInput, PutEventsCommandOutput} from '@aws-sdk/client-eventbridge';
export interface IEventBridgeClient {
  send(params: PutEventsCommandInput): Promise<PutEventsCommandOutput>;
}
