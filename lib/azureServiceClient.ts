// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import * as msRest from '../../ms-rest/lib/msRest';
import Constants from './util/constants';
import * as fs from 'fs';
import PollingState from './pollingState';
const LroStates = Constants.LongRunningOperationStates;

/**
 * Options to be provided while creating the client. 
 */
export interface AzureServiceClientOptions extends msRest.ServiceClientOptions {
  /**
   * @property {string} [options.acceptLanguage] - Gets or sets the preferred language for the response. Default value is: 'en-US'.
   */
  acceptLanguage?: string;

  /**
   * @property {boolean} [options.generateClientRequestId] - When set to true a unique x-ms-client-request-id value 
   * is generated and included in each request. Default is true.
   */
  generateClientRequestId?: boolean;

  /**
   * @property {number} [options.longRunningOperationRetryTimeout] - Gets or sets the retry timeout in seconds for 
   * Long Running Operations. Default value is 30.
   */
  longRunningOperationRetryTimeout?: number;

  /**
   * @property {number} [rpRegistrationRetryTimeout] - Gets or sets the retry timeout in seconds for 
   * AutomaticRPRegistration. Default value is 30 seconds.
   */
  rpRegistrationRetryTimeout?: number;
}

/**
 * @class
 * Initializes a new instance of the AzureServiceClient class.
 * @constructor
 * 
 * @param {msRest.ServiceClientCredentilas} credentials - ApplicationTokenCredentials or 
 * UserTokenCredentials object used for authentication.  
 * @param {AzureServiceClientOptions} options - The parameter options used by AzureServiceClient
 */
export class AzureServiceClient extends msRest.ServiceClient {
  acceptLanguage: string = Constants.DEFAULT_LANGUAGE;
  generateClientRequestId: boolean = true;
  longRunningOperationRetryTimeout: number = 30;
  rpRegistrationRetryTimeout: number = 30;

  constructor(credentials: msRest.ServiceClientCredentials, options?: AzureServiceClientOptions) {
    super(credentials, options);
    this.acceptLanguage = Constants.DEFAULT_LANGUAGE;
    this.generateClientRequestId = true;
    this.longRunningOperationRetryTimeout = 30;
    if (!options) options = {};

    if (options.acceptLanguage !== null && options.acceptLanguage !== undefined) {
      this.acceptLanguage = options.acceptLanguage;
    }

    if (options.generateClientRequestId !== null && options.generateClientRequestId !== undefined) {
      this.generateClientRequestId = options.generateClientRequestId;
    }

    if (options.longRunningOperationRetryTimeout !== null && options.longRunningOperationRetryTimeout !== undefined) {
      this.longRunningOperationRetryTimeout = options.longRunningOperationRetryTimeout;
    }

    if (options.rpRegistrationRetryTimeout !== null && options.rpRegistrationRetryTimeout !== undefined) {
      this.rpRegistrationRetryTimeout = options.rpRegistrationRetryTimeout;
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync("../package.json", { encoding: "utf8" }));
      const moduleName = packageJson.name;
      const moduleVersion = packageJson.version;
      this.addUserAgentInfo(`${moduleName}/${moduleVersion}`);
    } catch (err) {
      // do nothing
    }
  }

  /**
   * Provides a mechanism to make a request that will poll and provide the final result.
   * @param {msRest.RequestPrepareOptions|msRest.WebResource} request - The request object
   * @param {msRest.RequestOptions} [options] Additional options to be sent while making the request
   * @returns {Promise<msRest.HttpOperationResponse>} The HttpOperationResponse containing the final polling request, response and the responseBody.
   */
  async sendLongRunningRequest(request: msRest.RequestPrepareOptions | msRest.WebResource, options?: msRest.RequestOptions): Promise<msRest.HttpOperationResponse> {
    let self = this;
    let initialResponse: msRest.HttpOperationResponse;
    try {
      initialResponse = await self.sendRequest(request);
    } catch (err) {
      return Promise.reject(err);
    }
    let finalResponse: msRest.HttpOperationResponse;
    try {
      finalResponse = await self.getLongRunningOperationResult(initialResponse, options);
    } catch (err) {
      return Promise.reject(err);
    }
    return Promise.resolve(finalResponse);
  }

  /**
   * Verified whether an unexpected polling status code for long running operation was received for the response of the initial request.
   * @param {msRest.HttpOperationResponse} initialResponse - Response to the initial request that was sent as a part of the asynchronous operation.
   */
  checkResponseStatusCodeFailed(initialResponse: msRest.HttpOperationResponse): boolean {
    let statusCode = initialResponse.response.status;
    let method = initialResponse.request.method;
    if (statusCode === 200 || statusCode === 202 ||
      (statusCode === 201 && method === 'PUT') ||
      (statusCode === 204 && (method === 'DELETE' || method === 'POST'))) {
      return false;
    } else {
      return true;
    }
  }

  //goal is to get this working without using the async package and simply using async and Promise.
  /**
   * Poll Azure long running PUT, PATCH, POST or DELETE operations.
   * @param {msRest.HttpOperationResponse} resultOfInitialRequest - result/response of the initial request which is a part of the asynchronous polling operation.
   * @param {msRest.RequestOptions} [options] - custom request options.
   * @returns {Promise<msRest.HttpOperationResponse>} result - The final response after polling is complete.
   */
  async getLongRunningOperationResult(resultOfInitialRequest: msRest.HttpOperationResponse, options?: msRest.RequestOptions): Promise<msRest.HttpOperationResponse> {
    let self = this;
    let initialRequestMethod: string = resultOfInitialRequest.request.method;

    if (self.checkResponseStatusCodeFailed(resultOfInitialRequest)) {
      return Promise.reject(`Unexpected polling status code from long running operation ` +
        `"${resultOfInitialRequest.response.status}" for method "${initialRequestMethod}".`);
    }
    let pollingState: PollingState = null;
    try {
      pollingState = new PollingState(resultOfInitialRequest, self.longRunningOperationRetryTimeout);
      pollingState.optionsOfInitialRequest = options;
    } catch (error) {
      return Promise.reject(error);
    }
    let resourceUrl: string = resultOfInitialRequest.request.url;
    while (![LroStates.Succeeded, LroStates.Failed, LroStates.Canceled].some((e) => { return e === pollingState.status; })) {
      await msRest.delay(pollingState.getTimeout());
      if (pollingState.azureAsyncOperationHeaderLink) {
        await self.updateStateFromAzureAsyncOperationHeader(pollingState, true);
      } else if (pollingState.locationHeaderLink) {
        await self.updateStateFromLocationHeader(initialRequestMethod, pollingState);
      } else if (initialRequestMethod === 'PUT') {
        await self.updateStateFromGetResourceOperation(resourceUrl, pollingState);
      } else {
        return Promise.reject(new Error('Location header is missing from long running operation.'));
      }
    }

    if (pollingState.status === LroStates.Succeeded) {
      if ((pollingState.azureAsyncOperationHeaderLink || !pollingState.resource) &&
        (initialRequestMethod === 'PUT' || initialRequestMethod === 'PATCH')) {
        await self.updateStateFromGetResourceOperation(resourceUrl, pollingState);
        return Promise.resolve(pollingState.getOperationResponse());
      } else {
        return Promise.resolve(pollingState.getOperationResponse());
      }
    } else {
      return Promise.reject(pollingState.getRestError());
    }
  }

  /**
   * Retrieve operation status by polling from 'azure-asyncoperation' header.
   * @param {PollingState} pollingState - The object to persist current operation state.
   * @param {boolean} inPostOrDelete - Invoked by Post Or Delete operation.
   */
  async updateStateFromAzureAsyncOperationHeader(pollingState: PollingState, inPostOrDelete: boolean = false): Promise<void> {
    let result: msRest.HttpOperationResponse = null;

    try {
      result = await this.getStatus(pollingState.azureAsyncOperationHeaderLink, pollingState.optionsOfInitialRequest);
    } catch (err) {
      return Promise.reject(err);
    }

    let responseBody: string = result.body as string;
    if (responseBody === '') responseBody = null;
    let parsedResponse: {
      status: string;
      name: string;
      [key: string]: any;
    };

    try {
      parsedResponse = JSON.parse(responseBody);
    } catch (err) {
      let e = new Error(`An error "${err}" occurred in deserializing the response body "${responseBody}" ` +
        `after getting status from azure-asyncoperation header: "${pollingState.azureAsyncOperationHeaderLink}".`)
      return Promise.reject(e);
    }

    if (!parsedResponse || !parsedResponse.status) {
      return Promise.reject(new Error('The response "${responseBody}" from long running operation does not contain the status property.'));
    }

    pollingState.status = parsedResponse.status;
    pollingState.error = parsedResponse.error;
    pollingState.updateResponse(result.response);
    pollingState.request = result.request;
    pollingState.resource = null;
    if (inPostOrDelete) {
      pollingState.resource = result.body;
    }
    return Promise.resolve();
  }

  /**
   * Retrieve PUT operation status by polling from 'location' header.
   * @param {string} method - The HTTP method.
   * @param {PollingState} pollingState - The object to persist current operation state.
   */
  async updateStateFromLocationHeader(method: string, pollingState: PollingState): Promise<void> {
    let result: msRest.HttpOperationResponse = null;
    try {
      result = await this.getStatus(pollingState.locationHeaderLink, pollingState.optionsOfInitialRequest);
    } catch (err) {
      return Promise.reject(err);
    }

    let responseBody: string = result.body as string;
    if (responseBody === '') responseBody = null;
    let parsedResponse: any = null;
    try {
      parsedResponse = JSON.parse(responseBody);
    } catch (err) {
      let e = new Error(`An error "${err}" occurred in deserializing the response body "${responseBody}" ` +
        `after getting status from azure-asyncoperation header: "${pollingState.azureAsyncOperationHeaderLink}".`)
      return Promise.reject(e);
    }

    pollingState.updateResponse(result.response);
    pollingState.request = result.request;
    let statusCode = result.response.status;
    if (statusCode === 202) {
      pollingState.status = LroStates.InProgress;
    } else if (statusCode === 200 ||
      (statusCode === 201 && method === 'PUT') ||
      (statusCode === 204 && (method === 'DELETE' || method === 'POST'))) {
      pollingState.status = LroStates.Succeeded;
      pollingState.resource = parsedResponse;
      //we might not throw an error, but initialize here just in case.
      pollingState.error = new msRest.RestError(`Long running operation failed with status "${pollingState.status}".`);
      pollingState.error.code = pollingState.status;
    } else {
      return Promise.reject(new Error(`The response with status code ${statusCode} from polling for ` +
        `long running operation url "${pollingState.locationHeaderLink}" is not valid.`));
    }
  }

  /**
   * Polling for resource status.
   * @param {string} resourceUrl - The url of resource.
   * @param {PollingState} pollingState - The object to persist current operation state.
   */
  async updateStateFromGetResourceOperation(resourceUrl: string, pollingState: PollingState): Promise<void> {
    let result: msRest.HttpOperationResponse = null;
    try {
      result = await this.getStatus(resourceUrl, pollingState.optionsOfInitialRequest);
    } catch (err) {
      return Promise.reject(err);
    }

    let responseBody: string = result.body as string;
    if (responseBody === '') responseBody = null;
    let parsedResponse: {
      properties: {
        provisioningState?: string;
        [key: string]: any;
      };
      id: string;
      name: string;
      type: string;
      location: string;
      [key: string]: any;
    };
    try {
      parsedResponse = JSON.parse(responseBody);
    } catch (err) {
      let e = new Error(`An error "${err}" occurred in deserializing the response body "${responseBody}" ` +
        `after getting status from azure-asyncoperation header: "${pollingState.azureAsyncOperationHeaderLink}".`)
      return Promise.reject(e);
    }
    pollingState.status = parsedResponse.properties.provisioningState || LroStates.Succeeded;
    pollingState.updateResponse(result.response);
    pollingState.request = result.request;
    pollingState.resource = parsedResponse;
    //we might not throw an error, but initialize here just in case.
    pollingState.error = new msRest.RestError(`Long running operation failed with status "${pollingState.status}".`);
    pollingState.error.code = pollingState.status;
    return Promise.resolve();
  }

  /**
   * Retrieves operation status by querying the operation URL.
   * @param {string} operationUrl - URL used to poll operation result.
   * @param {object} options - Options that can be set on the request object
   */
  async getStatus(operationUrl: string, options?: msRest.RequestOptions): Promise<msRest.HttpOperationResponse> {
    let self = this;
    // Construct URL
    let requestUrl = operationUrl.replace(' ', '%20');
    // Create HTTP request object
    let httpRequest: msRest.RequestPrepareOptions = {
      method: msRest.HttpMethods.GET,
      url: requestUrl,
      headers: {}
    };
    if (options) {
      for (let headerName in options.customHeaders) {
        if (options.customHeaders.hasOwnProperty(headerName)) {
          httpRequest.headers[headerName] = options.customHeaders[headerName];
        }
      }
    }
    let operationResponse: msRest.HttpOperationResponse;
    try {
      operationResponse = await self.sendRequest(httpRequest);
    } catch (err) {
      return Promise.reject(err);
    }
    let statusCode = operationResponse.response.status;
    let responseBody: string = operationResponse.body as string;
    if (responseBody === '') responseBody = null;
    if (statusCode !== 200 && statusCode !== 201 && statusCode !== 202 && statusCode !== 204) {
      let error = new msRest.RestError(`Invalid status code with response body "${operationResponse.response.body}" occurred ` +
        `when polling for operation status.`);
      error.statusCode = statusCode;
      error.request = msRest.stripRequest(operationResponse.request);
      error.response = operationResponse.response;
      try {
        error.body = JSON.parse(responseBody);
      } catch (badResponse) {
        error.message += ` Error "${badResponse}" occured while deserializing the response body - "${responseBody}".`;
        error.body = responseBody;
      }
      return Promise.reject(error);
    }

    return Promise.resolve(operationResponse);
  }
}