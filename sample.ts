'use strict';

import * as msRest from '../ms-rest/lib/msRest';
import * as msRestAzure from './lib/msRestAzure';
const clientOptions: msRestAzure.AzureServiceClientOptions = {
  filters: [new msRest.LogFilter()]
};

const subscriptionId = '00977cdb-163f-435f-9c32-39ec8ae61f4d';
const resourceGroupName = 'zitest';
const accountName = 'zitest1012';
const location = 'westus';
const apiVersion = '2015-06-15';
// An easy way to get the token
// 1. Go to this test drive link https://azure.github.io/projects/apis and authenticate by clicking on Authorize. Check the user impersoantion checkbox in the popup.
// 1.1 select a subscription of your choice
// 1.2 select the storage-2015-06-15 option from the first drop down list
// 1.3 expand the url to list storage accounts in a subscription
// 1.4 click on try it out button.
// 1.5 in the curl tab you will see the actual curl request that has the bearer token in it
// 1.6 copy paste that token here. That token is valid for 1 hour
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsIng1dCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyIsImtpZCI6IjlGWERwYmZNRlQyU3ZRdVhoODQ2WVR3RUlCdyJ9.eyJhdWQiOiJodHRwczovL21hbmFnZW1lbnQuYXp1cmUuY29tLyIsImlzcyI6Imh0dHBzOi8vc3RzLndpbmRvd3MubmV0LzcyZjk4OGJmLTg2ZjEtNDFhZi05MWFiLTJkN2NkMDExZGI0Ny8iLCJpYXQiOjE0OTkzOTEzNTksIm5iZiI6MTQ5OTM5MTM1OSwiZXhwIjoxNDk5Mzk1MjU5LCJhY3IiOiIxIiwiYWlvIjoiWTJaZ1lKQU5GdEIzdFF5VE96cGwrOFgxNnN3UHBpOFQ1K05lSXM0cHA5UXQvdlpXK25ZQSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwaWQiOiJmYmZjN2E3MS0yNTZiLTQ1NGEtYmYyNy0xMjE2MmY2MzBlMGEiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlphdmVyeSIsImdpdmVuX25hbWUiOiJBbWFyIiwiaGFzZ3JvdXBzIjoidHJ1ZSIsImlwYWRkciI6IjE2Ny4yMjAuMS4xNjUiLCJuYW1lIjoiQW1hciBaYXZlcnkiLCJvaWQiOiIxOTYxZWFiZi0yMTU3LTRjNDMtOTQ0MS1hNmQwNDlkMDVjZGEiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtMjEyNzUyMTE4NC0xNjA0MDEyOTIwLTE4ODc5Mjc1MjctMTE4MzQxNDQiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzAwMDA4NUIzMkM1NSIsInNjcCI6InVzZXJfaW1wZXJzb25hdGlvbiIsInN1YiI6ImtTNWFka3ptcmJINm45SEJjRHNtVFBOaUVfSkh4eE5rNEhQakJRZDlaRzAiLCJ0aWQiOiI3MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDciLCJ1bmlxdWVfbmFtZSI6ImFtemF2ZXJ5QG1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhbXphdmVyeUBtaWNyb3NvZnQuY29tIiwidmVyIjoiMS4wIn0.VEPJcanroqgVv34jAgkwg8W0TPC2X5-nu_eX1QK2axDrQJXc07lsYnvFQqkVoz_Fk6X9tB86nR1G43OG2SW4aUHBx_DKjxPfBWrTTUrztxtNbV0cPXF1UCPZGDke1KF9ZhAJUaoCTMEcuQ2VZJgAzW_xwzxDxgSR0Mm8E6Joib_7PAP7zj7Nq3ULxZ1w9q4w_EKqhPXMyFdZr2jWfxWyQJ4HjwABKn5q95yywgYnOwk-h_N4_g_42SFSkM8QOFVoCUu13ThaHTvfENYQRwGrC4QVs-UIr6Cl5FgrTXWj1SqCu_Wcs5vxN6_59IkbjYl9tsLp_BG7VCN3WE2twLJfOg';
const creds = new msRest.TokenCredentials(token);
const client = new msRestAzure.AzureServiceClient(creds, clientOptions);
const req: msRest.RequestPrepareOptions = {
  url: `https://management.azure.com/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.Storage/storageAccounts/${accountName}?api-version=${apiVersion}`,
  method: msRest.HttpMethods.PUT,
  body: {
    location: location,
    tags: {},
    properties: {
      accountType: 'Standard_LRS'
    }
  }
};

client.sendLongRunningRequest(req).then(function (res: msRest.HttpOperationResponse) {
  console.log(res.body as string);
});
