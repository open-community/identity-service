// ============================================================
// Import packages
import base64url from 'base64url';

import cryptoRandomString from 'crypto-random-string';

import { BASE64_REGEXP } from './constants';

// ============================================================
// Module's constants and variables

// ============================================================
// Functions

/**
 * Generate a base64 account ID.
 */
function generateIdentityId() {
    const string = cryptoRandomString({
        length: 16,
        type: 'url-safe',
    });

    return base64url.encode(string);
}

/**
 * Indicate if the given string is a valid base64 string or not.
 * @param {*} string
 * @returns {boolean}
 */
function isValidBase64(string) {
    return BASE64_REGEXP.test(string);
}

// ============================================================
// Exports
export {
    generateIdentityId,
    isValidBase64,
};
