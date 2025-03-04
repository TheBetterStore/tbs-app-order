import {injectable} from 'inversify';
import {IRestApiClient} from '../interfaces/restapi-client.interface';
const axios = require('axios');
const AWSXRay = require('aws-xray-sdk-core');
AWSXRay.captureHTTPsGlobal(require('https'));
AWSXRay.captureHTTPsGlobal(require('http'));
const API_REQUEST_TIMEOUT = process.env.API_REQUEST_TIMEOUT || 3000;

@injectable()
/**
 * RestApiClient
 */
export class RestApiClient implements IRestApiClient {
  /**
   * post
   * @param {string} endpointUrl
   * @param {any} body
   * @param {any} headers
   * @return {any}
   */
  async post(endpointUrl: string, body: any, headers: any) {
    // Using self here; as this reference can change within async functions!
    console.info(`Calling: ${endpointUrl}`);

    const axiosRequestConfig = {
      timeout: Number(API_REQUEST_TIMEOUT),
      headers: headers,
    };
    return axios.post(endpointUrl, body, axiosRequestConfig);
  }
}
