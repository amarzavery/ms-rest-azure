// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';
import Constants from './util/constants';
import * as msRest from '../../ms-rest/lib/msRest';
const LroStates = Constants.LongRunningOperationStates;
/**
 * @class
 * Initializes a new instance of the PollingState class.
 */
export default class PollingState {
    constructor(resultOfInitialRequest, retryTimeout = 30) {
        /**
         * @param {number} [retryTimeout] - The timeout in seconds to retry on intermediate operation results. Default Value is 30.
         */
        this.retryTimeout = 30;
        this.resultOfInitialRequest = resultOfInitialRequest;
        this.retryTimeout = retryTimeout;
        this.updateResponse(resultOfInitialRequest.response);
        this.request = resultOfInitialRequest.request;
        //Parse response.body & assign it as the resource
        try {
            if (resultOfInitialRequest.body &&
                typeof resultOfInitialRequest.body.valueOf() === 'string' &&
                resultOfInitialRequest.body.length > 0) {
                this.resource = JSON.parse(resultOfInitialRequest.body);
            }
            else {
                this.resource = resultOfInitialRequest.body;
            }
        }
        catch (error) {
            let deserializationError = new msRest.RestError(`Error "${error}" occurred in parsing the responseBody ' +
        'while creating the PollingState for Long Running Operation- "${resultOfInitialRequest.body}"`);
            deserializationError.request = resultOfInitialRequest.request;
            deserializationError.response = resultOfInitialRequest.response;
            throw deserializationError;
        }
        switch (this.response.status) {
            case 202:
                this.status = LroStates.InProgress;
                break;
            case 204:
                this.status = LroStates.Succeeded;
                break;
            case 201:
                if (this.resource && this.resource.properties && this.resource.properties.provisioningState) {
                    this.status = this.resource.properties.provisioningState;
                }
                else {
                    this.status = LroStates.InProgress;
                }
                break;
            case 200:
                if (this.resource && this.resource.properties && this.resource.properties.provisioningState) {
                    this.status = this.resource.properties.provisioningState;
                }
                else {
                    this.status = LroStates.Succeeded;
                }
                break;
            default:
                this.status = LroStates.Failed;
                break;
        }
    }
    /**
     * Update cached data using the provided response object
     * @param {nodeFetch.Response} [response] - provider response object.
     */
    updateResponse(response) {
        this.response = response;
        if (response && response.headers) {
            let asyncOperationHeader = response.headers.get('azure-asyncoperation');
            let locationHeader = response.headers.get('location');
            if (asyncOperationHeader) {
                this.azureAsyncOperationHeaderLink = asyncOperationHeader;
            }
            if (locationHeader) {
                this.locationHeaderLink = locationHeader;
            }
        }
    }
    /**
     * Gets timeout in milliseconds.
     * @returns {number} timeout
     */
    getTimeout() {
        if (this.retryTimeout || this.retryTimeout === 0) {
            return this.retryTimeout * 1000;
        }
        if (this.response) {
            let retryAfter = this.response.headers.get('retry-after');
            if (retryAfter) {
                return parseInt(retryAfter) * 1000;
            }
        }
        return 30 * 1000;
    }
    /**
     * Returns long running operation result.
     * @returns {msRest.HttpOperationResponse} HttpOperationResponse
     */
    getOperationResponse() {
        let result = new msRest.HttpOperationResponse(this.request, this.response);
        if (this.resource && typeof this.resource.valueOf() === 'string') {
            result.body = this.resource;
        }
        else {
            result.body = JSON.stringify(this.resource);
        }
        return result;
    }
    /**
     * Returns an Error on operation failure.
     * @param {Error} err - The error object.
     * @returns {msRest.RestError} The RestError defined in the runtime.
     */
    getRestError(err) {
        let errMsg = null;
        let errCode = null;
        let error = new msRest.RestError('');
        error.request = msRest.stripRequest(this.request);
        error.response = this.response;
        let responseBody = this.resultOfInitialRequest.body;
        let parsedResponse = null;
        try {
            if (responseBody !== null && responseBody !== undefined) {
                if (responseBody === '')
                    responseBody = null;
                parsedResponse = JSON.parse(responseBody);
            }
        }
        catch (parseErr) {
            error.message = `Error "${parseErr.message}" occurred while deserializing the error ` +
                `message "${this.response.body}" for long running operation.`;
            return error;
        }
        if (err && err.message) {
            errMsg = `Long running operation failed with error: "${err.message}".`;
        }
        else {
            errMsg = `Long running operation failed with status: "${this.status}".`;
        }
        if (parsedResponse) {
            if (parsedResponse.error && parsedResponse.error.message) {
                errMsg = `Long running operation failed with error: "${parsedResponse.error.message}".`;
            }
            if (parsedResponse.error && parsedResponse.error.code) {
                errCode = parsedResponse.error.code;
            }
        }
        error.message = errMsg;
        if (errCode)
            error.code = errCode;
        error.body = parsedResponse;
        return error;
    }
}
//# sourceMappingURL=pollingState.js.map