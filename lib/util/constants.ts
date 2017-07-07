// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

'use strict';

const Constants = {
  /**
  * Defines constants for long running operation states.
  *
  * @const
  * @type {string}
  */
  LongRunningOperationStates: {
    InProgress: 'InProgress',
    Succeeded: 'Succeeded',
    Failed: 'Failed',
    Canceled: 'Canceled'
  },

  DEFAULT_LANGUAGE: 'en-us'
};

export default Constants;
