'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as msRest from '../ms-rest/lib/msRest';
import * as msRestAzure from './lib/msRestAzure';
const clientOptions = {
    filters: [new msRest.LogFilter()]
};
const subscriptionId = '00977cdb-163f-435f-9c32-39ec8ae61f4d';
const resourceGroupName = 'foozap002';
const accountName = 'foozy894';
const location = 'westus';
const apiVersion = '2017-06-01';
// An easy way to get the token
// 1. Go to this test drive link https://azure.github.io/projects/apis and authenticate by clicking on Authorize. Check the user impersoantion checkbox in the popup.
// 1.1 select a subscription of your choice
// 1.2 select the storage-2015-06-15 option from the first drop down list
// 1.3 expand the url to list storage accounts in a subscription
// 1.4 click on try it out button.
// 1.5 in the curl tab you will see the actual curl request that has the bearer token in it
// 1.6 copy paste that token here. That token is valid for 1 hour
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyIsImtpZCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE0OTk0NzM3MDUsIm5iZiI6MTQ5OTQ3MzcwNSwiZXhwIjoxNDk5NDc3NjA1LCJhY3IiOiIxIiwiYWlvIjoiWTJaZ1lLaFQ1TE5SZVJueXRPamM1TGJucjNoVDA3N1B1THVuVSs3ZVBOYUgyVndHRm5FQSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiJmYmZjN2E3MS0yNTZiLTQ1NGEtYmYyNy0xMjE2MmY2MzBlMGEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlphdmVyeSIsImdpdmVuX25hbWUiOiJBbWFyIiwiaGFzZ3JvdXBzIjoidHJ1ZSIsImlwYWRkciI6IjE2Ny4yMjAuMS4xNjUiLCJuYW1lIjoiQW1hciBaYXZlcnkiLCJvaWQiOiIxOTYxZWFiZi0yMTU3LTRjNDMtOTQ0MS1hNmQwNDlkMDVjZGEiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjEyNzUyMTE4NC0xNjA0MDEyOTIwLTE4ODc5Mjc1MjctMTE4MzQxNDQiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzAwMDA4NUIzMkM1NSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6ImtTNWFka3ptcmJINm45SEJjRHNtVFBOaUVfSkh4eE5rNEhQakJRZDlaRzAiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6ImFtemF2ZXJ5QG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhbXphdmVyeUBtaWNyb3NvZnQuY29tIiwidmVyIjoiMS4wIn0.i8HQ9AxXjI01JTcWpwpxYpeISWW5vFcB2DxIdJ6WRHk9kVJDvdosAm8DBVLkzD0VvwER3ufKR9xRE8v-IdQ02VJZKq_aJG5xcdk2hgppg80pAlP3VL_c4P6ByMbLvDXS3fRDwNm4bN85K4y0pHT8pSAquCOA-ff3LP63tzw-2IXOEEKfiYsad674PJ2MUIRzV67I6wepUCIjvS3ujnwrLqVJYkHBhn9BE9dv0cN9ERZuFJ5_HxwYtHeSKff_ZhaudbE-7FCLqFAB8EmOHFfNkHCdJIuFrAKsgRUy6HT_DOerfBRueAsGySjRhG6V9kynNpOfM1SrmKl5a5ZTltfHZA';
const creds = new msRest.TokenCredentials(token);
const client = new msRestAzure.AzureServiceClient(creds, clientOptions);
const req = {
    url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${accountName}?api-version=${apiVersion}`,
    method: msRest.HttpMethods.PUT,
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
    return __awaiter(this, void 0, void 0, function* () {
        let res;
        try {
            res = yield client.sendLongRunningRequest(req);
            console.dir(res);
            document.write(JSON.stringify(res));
        }
        catch (err) {
            console.dir(err);
        }
        return Promise.resolve(res);
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