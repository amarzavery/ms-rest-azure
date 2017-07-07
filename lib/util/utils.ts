// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information. 

'use strict';

import * as uuid from "uuid";

/**
 * Generated UUID
 *
 * @return {string} RFC4122 v4 UUID.
 */
export function generateUuid(): string {
  return uuid.v4();
}
