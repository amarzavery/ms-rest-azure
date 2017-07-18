// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var msRest = require("ms-rest");
var constants_1 = require("./util/constants");
var pollingState_1 = require("./pollingState");
var LroStates = constants_1.default.LongRunningOperationStates;
/**
 * @class
 * Initializes a new instance of the AzureServiceClient class.
 * @constructor
 *
 * @param {msRest.ServiceClientCredentilas} credentials - ApplicationTokenCredentials or
 * UserTokenCredentials object used for authentication.
 * @param {AzureServiceClientOptions} options - The parameter options used by AzureServiceClient
 */
var AzureServiceClient = (function (_super) {
    __extends(AzureServiceClient, _super);
    function AzureServiceClient(credentials, options) {
        var _this = _super.call(this, credentials, options) || this;
        _this.acceptLanguage = constants_1.default.DEFAULT_LANGUAGE;
        _this.generateClientRequestId = true;
        _this.longRunningOperationRetryTimeout = 30;
        _this.rpRegistrationRetryTimeout = 30;
        _this.acceptLanguage = constants_1.default.DEFAULT_LANGUAGE;
        _this.generateClientRequestId = true;
        _this.longRunningOperationRetryTimeout = 30;
        if (!options)
            options = {};
        if (options.acceptLanguage !== null && options.acceptLanguage !== undefined) {
            _this.acceptLanguage = options.acceptLanguage;
        }
        if (options.generateClientRequestId !== null && options.generateClientRequestId !== undefined) {
            _this.generateClientRequestId = options.generateClientRequestId;
        }
        if (options.longRunningOperationRetryTimeout !== null && options.longRunningOperationRetryTimeout !== undefined) {
            _this.longRunningOperationRetryTimeout = options.longRunningOperationRetryTimeout;
        }
        if (options.rpRegistrationRetryTimeout !== null && options.rpRegistrationRetryTimeout !== undefined) {
            _this.rpRegistrationRetryTimeout = options.rpRegistrationRetryTimeout;
        }
        try {
            var moduleName = 'ms-rest-azure';
            var moduleVersion = constants_1.default.msRestAzureVersion;
            _this.addUserAgentInfo(moduleName + "/" + moduleVersion);
        }
        catch (err) {
            // do nothing
        }
        return _this;
    }
    /**
     * Provides a mechanism to make a request that will poll and provide the final result.
     * @param {msRest.RequestPrepareOptions|msRest.WebResource} request - The request object
     * @param {msRest.RequestOptions} [options] Additional options to be sent while making the request
     * @returns {Promise<msRest.HttpOperationResponse>} The HttpOperationResponse containing the final polling request, response and the responseBody.
     */
    AzureServiceClient.prototype.sendLongRunningRequest = function (request, options) {
        return __awaiter(this, void 0, void 0, function () {
            var self, initialResponse, err_1, finalResponse, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, self.sendRequest(request)];
                    case 2:
                        initialResponse = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _a.sent();
                        return [2 /*return*/, Promise.reject(err_1)];
                    case 4:
                        _a.trys.push([4, 6, , 7]);
                        return [4 /*yield*/, self.getLongRunningOperationResult(initialResponse, options)];
                    case 5:
                        finalResponse = _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        err_2 = _a.sent();
                        return [2 /*return*/, Promise.reject(err_2)];
                    case 7: return [2 /*return*/, Promise.resolve(finalResponse)];
                }
            });
        });
    };
    /**
     * Verified whether an unexpected polling status code for long running operation was received for the response of the initial request.
     * @param {msRest.HttpOperationResponse} initialResponse - Response to the initial request that was sent as a part of the asynchronous operation.
     */
    AzureServiceClient.prototype.checkResponseStatusCodeFailed = function (initialResponse) {
        var statusCode = initialResponse.response.status;
        var method = initialResponse.request.method;
        if (statusCode === 200 || statusCode === 202 ||
            (statusCode === 201 && method === 'PUT') ||
            (statusCode === 204 && (method === 'DELETE' || method === 'POST'))) {
            return false;
        }
        else {
            return true;
        }
    };
    //goal is to get this working without using the async package and simply using async and Promise.
    /**
     * Poll Azure long running PUT, PATCH, POST or DELETE operations.
     * @param {msRest.HttpOperationResponse} resultOfInitialRequest - result/response of the initial request which is a part of the asynchronous polling operation.
     * @param {msRest.RequestOptions} [options] - custom request options.
     * @returns {Promise<msRest.HttpOperationResponse>} result - The final response after polling is complete.
     */
    AzureServiceClient.prototype.getLongRunningOperationResult = function (resultOfInitialRequest, options) {
        return __awaiter(this, void 0, void 0, function () {
            var self, initialRequestMethod, pollingState, resourceUrl;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        initialRequestMethod = resultOfInitialRequest.request.method;
                        if (self.checkResponseStatusCodeFailed(resultOfInitialRequest)) {
                            return [2 /*return*/, Promise.reject("Unexpected polling status code from long running operation " +
                                    ("\"" + resultOfInitialRequest.response.status + "\" for method \"" + initialRequestMethod + "\"."))];
                        }
                        pollingState = null;
                        try {
                            pollingState = new pollingState_1.default(resultOfInitialRequest, self.longRunningOperationRetryTimeout);
                            pollingState.optionsOfInitialRequest = options;
                        }
                        catch (error) {
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        resourceUrl = resultOfInitialRequest.request.url;
                        _a.label = 1;
                    case 1:
                        if (!![LroStates.Succeeded, LroStates.Failed, LroStates.Canceled].some(function (e) { return e === pollingState.status; })) return [3 /*break*/, 10];
                        return [4 /*yield*/, msRest.delay(pollingState.getTimeout())];
                    case 2:
                        _a.sent();
                        if (!pollingState.azureAsyncOperationHeaderLink) return [3 /*break*/, 4];
                        return [4 /*yield*/, self.updateStateFromAzureAsyncOperationHeader(pollingState, true)];
                    case 3:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 4:
                        if (!pollingState.locationHeaderLink) return [3 /*break*/, 6];
                        return [4 /*yield*/, self.updateStateFromLocationHeader(initialRequestMethod, pollingState)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 6:
                        if (!(initialRequestMethod === 'PUT')) return [3 /*break*/, 8];
                        return [4 /*yield*/, self.updateStateFromGetResourceOperation(resourceUrl, pollingState)];
                    case 7:
                        _a.sent();
                        return [3 /*break*/, 9];
                    case 8: return [2 /*return*/, Promise.reject(new Error('Location header is missing from long running operation.'))];
                    case 9: return [3 /*break*/, 1];
                    case 10:
                        if (!(pollingState.status === LroStates.Succeeded)) return [3 /*break*/, 14];
                        if (!((pollingState.azureAsyncOperationHeaderLink || !pollingState.resource) &&
                            (initialRequestMethod === 'PUT' || initialRequestMethod === 'PATCH'))) return [3 /*break*/, 12];
                        return [4 /*yield*/, self.updateStateFromGetResourceOperation(resourceUrl, pollingState)];
                    case 11:
                        _a.sent();
                        return [2 /*return*/, Promise.resolve(pollingState.getOperationResponse())];
                    case 12: return [2 /*return*/, Promise.resolve(pollingState.getOperationResponse())];
                    case 13: return [3 /*break*/, 15];
                    case 14: return [2 /*return*/, Promise.reject(pollingState.getRestError())];
                    case 15: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Retrieve operation status by polling from 'azure-asyncoperation' header.
     * @param {PollingState} pollingState - The object to persist current operation state.
     * @param {boolean} inPostOrDelete - Invoked by Post Or Delete operation.
     */
    AzureServiceClient.prototype.updateStateFromAzureAsyncOperationHeader = function (pollingState, inPostOrDelete) {
        if (inPostOrDelete === void 0) { inPostOrDelete = false; }
        return __awaiter(this, void 0, void 0, function () {
            var result, err_3, responseBody, parsedResponse, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getStatus(pollingState.azureAsyncOperationHeaderLink, pollingState.optionsOfInitialRequest)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        return [2 /*return*/, Promise.reject(err_3)];
                    case 4:
                        responseBody = result.body;
                        if (responseBody === '')
                            responseBody = null;
                        try {
                            parsedResponse = JSON.parse(responseBody);
                        }
                        catch (err) {
                            e = new Error("An error \"" + err + "\" occurred in deserializing the response body \"" + responseBody + "\" " +
                                ("after getting status from azure-asyncoperation header: \"" + pollingState.azureAsyncOperationHeaderLink + "\"."));
                            return [2 /*return*/, Promise.reject(e)];
                        }
                        if (!parsedResponse || !parsedResponse.status) {
                            return [2 /*return*/, Promise.reject(new Error('The response "${responseBody}" from long running operation does not contain the status property.'))];
                        }
                        pollingState.status = parsedResponse.status;
                        pollingState.error = parsedResponse.error;
                        pollingState.updateResponse(result.response);
                        pollingState.request = result.request;
                        pollingState.resource = null;
                        if (inPostOrDelete) {
                            pollingState.resource = result.body;
                        }
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    /**
     * Retrieve PUT operation status by polling from 'location' header.
     * @param {string} method - The HTTP method.
     * @param {PollingState} pollingState - The object to persist current operation state.
     */
    AzureServiceClient.prototype.updateStateFromLocationHeader = function (method, pollingState) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_4, responseBody, parsedResponse, e, statusCode;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getStatus(pollingState.locationHeaderLink, pollingState.optionsOfInitialRequest)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_4 = _a.sent();
                        return [2 /*return*/, Promise.reject(err_4)];
                    case 4:
                        responseBody = result.body;
                        if (responseBody === '')
                            responseBody = null;
                        parsedResponse = null;
                        try {
                            parsedResponse = JSON.parse(responseBody);
                        }
                        catch (err) {
                            e = new Error("An error \"" + err + "\" occurred in deserializing the response body \"" + responseBody + "\" " +
                                ("after getting status from azure-asyncoperation header: \"" + pollingState.azureAsyncOperationHeaderLink + "\"."));
                            return [2 /*return*/, Promise.reject(e)];
                        }
                        pollingState.updateResponse(result.response);
                        pollingState.request = result.request;
                        statusCode = result.response.status;
                        if (statusCode === 202) {
                            pollingState.status = LroStates.InProgress;
                        }
                        else if (statusCode === 200 ||
                            (statusCode === 201 && method === 'PUT') ||
                            (statusCode === 204 && (method === 'DELETE' || method === 'POST'))) {
                            pollingState.status = LroStates.Succeeded;
                            pollingState.resource = parsedResponse;
                            //we might not throw an error, but initialize here just in case.
                            pollingState.error = new msRest.RestError("Long running operation failed with status \"" + pollingState.status + "\".");
                            pollingState.error.code = pollingState.status;
                        }
                        else {
                            return [2 /*return*/, Promise.reject(new Error("The response with status code " + statusCode + " from polling for " +
                                    ("long running operation url \"" + pollingState.locationHeaderLink + "\" is not valid.")))];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Polling for resource status.
     * @param {string} resourceUrl - The url of resource.
     * @param {PollingState} pollingState - The object to persist current operation state.
     */
    AzureServiceClient.prototype.updateStateFromGetResourceOperation = function (resourceUrl, pollingState) {
        return __awaiter(this, void 0, void 0, function () {
            var result, err_5, responseBody, parsedResponse, e;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = null;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.getStatus(resourceUrl, pollingState.optionsOfInitialRequest)];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_5 = _a.sent();
                        return [2 /*return*/, Promise.reject(err_5)];
                    case 4:
                        responseBody = result.body;
                        if (responseBody === '')
                            responseBody = null;
                        try {
                            parsedResponse = JSON.parse(responseBody);
                        }
                        catch (err) {
                            e = new Error("An error \"" + err + "\" occurred in deserializing the response body \"" + responseBody + "\" " +
                                ("after getting status from azure-asyncoperation header: \"" + pollingState.azureAsyncOperationHeaderLink + "\"."));
                            return [2 /*return*/, Promise.reject(e)];
                        }
                        pollingState.status = parsedResponse.properties.provisioningState || LroStates.Succeeded;
                        pollingState.updateResponse(result.response);
                        pollingState.request = result.request;
                        pollingState.resource = parsedResponse;
                        //we might not throw an error, but initialize here just in case.
                        pollingState.error = new msRest.RestError("Long running operation failed with status \"" + pollingState.status + "\".");
                        pollingState.error.code = pollingState.status;
                        return [2 /*return*/, Promise.resolve()];
                }
            });
        });
    };
    /**
     * Retrieves operation status by querying the operation URL.
     * @param {string} operationUrl - URL used to poll operation result.
     * @param {object} options - Options that can be set on the request object
     */
    AzureServiceClient.prototype.getStatus = function (operationUrl, options) {
        return __awaiter(this, void 0, void 0, function () {
            var self, requestUrl, httpRequest, headerName, operationResponse, err_6, statusCode, responseBody, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        self = this;
                        requestUrl = operationUrl.replace(' ', '%20');
                        httpRequest = {
                            method: 'GET',
                            url: requestUrl,
                            headers: {}
                        };
                        if (options) {
                            for (headerName in options.customHeaders) {
                                if (options.customHeaders.hasOwnProperty(headerName)) {
                                    httpRequest.headers[headerName] = options.customHeaders[headerName];
                                }
                            }
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, self.sendRequest(httpRequest)];
                    case 2:
                        operationResponse = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_6 = _a.sent();
                        return [2 /*return*/, Promise.reject(err_6)];
                    case 4:
                        statusCode = operationResponse.response.status;
                        responseBody = operationResponse.body;
                        if (responseBody === '')
                            responseBody = null;
                        if (statusCode !== 200 && statusCode !== 201 && statusCode !== 202 && statusCode !== 204) {
                            error = new msRest.RestError("Invalid status code with response body \"" + operationResponse.response.body + "\" occurred " +
                                "when polling for operation status.");
                            error.statusCode = statusCode;
                            error.request = msRest.stripRequest(operationResponse.request);
                            error.response = operationResponse.response;
                            try {
                                error.body = JSON.parse(responseBody);
                            }
                            catch (badResponse) {
                                error.message += " Error \"" + badResponse + "\" occured while deserializing the response body - \"" + responseBody + "\".";
                                error.body = responseBody;
                            }
                            return [2 /*return*/, Promise.reject(error)];
                        }
                        return [2 /*return*/, Promise.resolve(operationResponse)];
                }
            });
        });
    };
    return AzureServiceClient;
}(msRest.ServiceClient));
exports.AzureServiceClient = AzureServiceClient;
//# sourceMappingURL=azureServiceClient.js.map