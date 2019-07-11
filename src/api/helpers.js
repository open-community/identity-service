import base64url from 'base64url';
import { isValidBase64 } from '../helpers';

// ============================================================
// Module's constants and variables
const API_ID_REGEXP = /^([a-zA-Z0-9-_:]+):([a-zA-Z0-9-_]+)$/;
const IDENTITY_TYPE_CODE = 'identity';
const ACCOUNT_TYPE_CODE = 'account';
// ============================================================
// Functions

/**
 *
 * @param {Account} account
 * @returns {Object}
 */
function dbIdentityToApi({
    id,
    login,
    creationDate,
    deletionDate,
}) {
    return {
        id: toApiId(id),
        login,
        creationDate,
        deletionDate,
    };
}

/**
 * Return the real account ID from an API ID.
 * @returns {string}
 */
function getAccountIdFromApiId(id) {
    const info = parsePublicId(id);

    if (!info) {
        return null;
    }

    if (info.type !== ACCOUNT_TYPE_CODE) {
        return null;
    }

    if (!isValidBase64(info.id)) {
        return null;
    }

    return info.id;
}

/**
 * Return the real account ID from an API ID.
 * @returns {string}
 */
function getIdentityIdFromApiId(id) {
    const info = parsePublicId(id);

    if (!info) {
        return null;
    }

    if (info.type !== IDENTITY_TYPE_CODE) {
        return null;
    }

    if (!isValidBase64(info.id)) {
        return null;
    }

    return info.id;
}

/**
 * Parse a public ID and return it's type and real id
 * @param {string} apiId
 * @returns {{type: string, id: string}}
 * @public
 */
function parsePublicId(apiId) {
    const decoded = base64url.decode(apiId);

    const match = decoded.match(API_ID_REGEXP);

    if (!match) {
        return null;
    }

    return {
        type: match[1],
        id: match[2],
    };
}

/**
 * Transform an account ID to it's API equivalent
 * @param {string} id
 * @public
 */
function toApiId(id) {
    return base64url.encode(`${IDENTITY_TYPE_CODE}:${id}`);
}

// ============================================================
// Exports
export {
    dbIdentityToApi,
    getAccountIdFromApiId,
    getIdentityIdFromApiId,
    toApiId,
};
