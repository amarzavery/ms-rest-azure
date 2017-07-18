'use strict';
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
var msRestAzure = require("./lib/msRestAzure");
var clientOptions = {
    filters: [new msRest.LogFilter()]
};
var subscriptionId = '00977cdb-163f-435f-9c32-39ec8ae61f4d';
var resourceGroupName = 'foozap002';
var accountName = 'foozy894';
var location = 'westus';
var apiVersion = '2017-06-01';
// An easy way to get the token
// 1. Go to this test drive link https://azure.github.io/projects/apis and authenticate by clicking on Authorize. Check the user impersoantion checkbox in the popup.
// 1.1 select a subscription of your choice
// 1.2 select the storage-2015-06-15 option from the first drop down list
// 1.3 expand the url to list storage accounts in a subscription
// 1.4 click on try it out button.
// 1.5 in the curl tab you will see the actual curl request that has the bearer token in it
// 1.6 copy paste that token here. That token is valid for 1 hour
var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyIsImtpZCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE1MDAxNTQ2MTcsIm5iZiI6MTUwMDE1NDYxNywiZXhwIjoxNTAwMTU4NTE3LCJhY3IiOiIxIiwiYWlvIjoiQVNRQTIvOERBQUFBZnl1aDdncnk0QW5nUk5weDJ2YVB6Yk5HQ2FnYXZLSUhiaXlGN2RBV2lWbz0iLCJhbXIiOlsicHdkIiwibWZhIl0sImFwcGlkIjoiZmJmYzdhNzEtMjU2Yi00NTRhLWJmMjctMTIxNjJmNjMwZTBhIiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJaYXZlcnkiLCJnaXZlbl9uYW1lIjoiQW1hciIsImhhc2dyb3VwcyI6InRydWUiLCJpbl9jb3JwIjoidHJ1ZSIsImlwYWRkciI6IjczLjE2OS4xNDkuMTEwIiwibmFtZSI6IkFtYXIgWmF2ZXJ5Iiwib2lkIjoiMTk2MWVhYmYtMjE1Ny00YzQzLTk0NDEtYTZkMDQ5ZDA1Y2RhIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxMjc1MjExODQtMTYwNDAxMjkyMC0xODg3OTI3NTI3LTExODM0MTQ0IiwicGxhdGYiOiI1IiwicHVpZCI6IjEwMDMwMDAwODVCMzJDNTUiLCJzY3AiOiJ1c2VyX2ltcGVyc29uYXRpb24iLCJzdWIiOiJrUzVhZGt6bXJiSDZuOUhCY0RzbVRQTmlFX0pIeHhOazRIUGpCUWQ5WkcwIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJhbXphdmVyeUBtaWNyb3NvZnQuY29tIiwidXBuIjoiYW16YXZlcnlAbWljcm9zb2Z0LmNvbSIsInZlciI6IjEuMCJ9.fOLpgYzXCd_qgR0k8DpPYVw6-Y3T_WFQAdqLk4nJ0a08_cvP3Sll25ykKWGrDzf_Tc_QIA-msKCpepUlfFIQZZyb354quAZmfOUwPt-NFsTGZkzzbsmKypMGXxlIF-nMJuxJZfQBj1UUdpsICGf9P3zfMlS7Vjxgupzr1plJGmzWz_54Lk6jGtO80XIMJ2IfOghnjyrdGHuEp6Nt4wo5a6PSuEPSj4UNpC8A_qFd6MyPuqedRve5uKMtLtbO71IJOFQ8d4Dsn2tjnlJI-2LQe6OnqiZNw42xl7fIr0czam_VJxLiKlW7SJ47BPbXEZ08Abwjc1U8Ux8aMEBGhncXqw';
var creds = new msRest.TokenCredentials(token);
var client = new msRestAzure.AzureServiceClient(creds, clientOptions);
var req = {
    url: "https://management.azure.com/subscriptions/" + subscriptionId + "/resourceGroups/" + resourceGroupName + "/providers/Microsoft.Storage/storageAccounts/" + accountName + "?api-version=" + apiVersion,
    method: 'PUT',
    body: {
        location: location,
        sku: {
            name: "Standard_GRS"
        },
        kind: "Storage",
        tags: {
            key1: "value1",
            key2: "value2"
        }
    }
};
function execute(req) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, client.sendLongRunningRequest(req)];
                case 1:
                    res = _a.sent();
                    console.dir(res);
                    document.write(JSON.stringify(res));
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.dir(err_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, Promise.resolve(res)];
            }
        });
    });
}
console.log("Hi There!!");
// client.sendLongRunningRequest(req).then((res: msRest.HttpOperationResponse) => {
//   console.log(res.body as string);
// }).catch((err) => {
//   console.dir(err);
// });
execute(req);
for (var i = 1; i <= 20; i++) {
    console.log('Hello World ' + i);
    setTimeout(function (x) { return function () { console.log(x); }; }(i), 1000 * i);
    // 1 2 3 4 5
}
//# sourceMappingURL=sample.js.map