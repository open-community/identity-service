// ============================================================
// Import packages
import _ from 'lodash';

// ============================================================
// Import modules
import {
    getAccountIdFromApiId,
    getIdentityIdFromApiId,
    dbIdentityToApi,
} from './helpers';
import { Identity } from '../models';

// ============================================================
// Functions
async function listIdentities(req, res) {
    const {
        'creation-date.min': creationDateMinStr,
        'creation-date.max': creationDateMaxStr,
        'deletion-date.min': deletionDateMinStr,
        'deletion-date.max': deletionDateMaxStr,
    } = req.query;

    const allIdentityId = typeof req.query.id === 'string'
        ? [req.query.id]
        : req.query.id || [];

    const allUserId = typeof req.query['user.id'] === 'string'
        ? [req.query['user.id']]
        : req.query['user.id'] || [];

    const [listId, invalidApiIds] = checkIdentityApiId(allIdentityId);
    const [listUserId, invalidUserId] = checkAccountApiId(allUserId);

    const [
        [
            creationDateMax,
            creationDateMin,
            deletionDateMax,
            deletionDateMin,
        ],
        invalidDates,
    ] = checkDates([
        creationDateMaxStr,
        creationDateMinStr,
        deletionDateMaxStr,
        deletionDateMinStr,
    ]);

    if (invalidApiIds.length || invalidDates.length || invalidUserId.length) {
        const errors = {
            id: invalidApiIds,
            dates: invalidDates,
            'user.id': invalidUserId,
        };

        res.status(400).json(errors);
        return;
    }

    const query = createQuery(
        listId,
        listUserId,

        // Creation date
        {
            min: creationDateMin,
            max: creationDateMax,
        },

        // Deletion date
        {
            min: deletionDateMin,
            max: deletionDateMax,
        },
    );

    const dbAccounts = await Identity.find(query);
    const accounts = dbAccounts.map(dbIdentityToApi);
    res.status(200).json(accounts);
}

function createQuery(
    listId,
    listUserId,
    creationDate = {},
    deletionDate = {},
) {
    const query = {};

    // filter: id
    if (listId.length) {
        query.id = listId.length === 1
            ? listId[0]
            : { $in: listId };
    }

    // filter: user.id
    if (listUserId.length) {
        query.user = {
            $elemMatch: {
                $in: listUserId,
            },
        };
    }

    // filter: creation date
    if (creationDate.min || creationDate.max) {
        query.creationDate = {};

        if (creationDate.min) {
            query.creationDate.$gte = creationDate.min;
        }

        if (creationDate.max) {
            query.creationDate.$lte = creationDate.max;
        }
    }

    // filter: deletion date
    if (deletionDate.min || deletionDate.max) {
        query.deletionDate = {};

        if (deletionDate.min) {
            query.deletionDate.$gte = deletionDate.min;
        }

        if (deletionDate.max) {
            query.deletionDate.$lte = deletionDate.max;
        }
    }

    return query;
}

function checkAccountApiId(list) {
    // Checking ID
    const invalidIdList = [];

    const listId = list.map((apiID) => {
        const id = getAccountIdFromApiId(apiID);

        if (!id) {
            invalidIdList.push([apiID, ['INVALID_ID']]);
        }

        return id;
    });

    return [
        listId,
        invalidIdList,
    ];
}

/**
 * Check and return the list of account ID
 * @param {string[]} list
 * @returns {Array.<id: string[], invalidApiId: string[]>}
 * @private
 */
function checkIdentityApiId(list) {
    // Checking ID
    const invalidIdList = [];

    const listId = list.map((apiID) => {
        const id = getIdentityIdFromApiId(apiID);

        if (!id) {
            invalidIdList.push([apiID, ['INVALID_ID']]);
        }

        return id;
    });

    return [
        listId,
        invalidIdList,
    ];
}

function checkDates(datesString) {
    const invalidDates = [];

    const dates = datesString.map((dateString) => {
        if (!dateString) {
            return null;
        }

        const date = new Date(dateString);


        if (Number.isNaN(date.getTime())) {
            invalidDates.push(dateString);
            return null;
        }

        return date;
    });

    return [
        dates,
        _.uniq(invalidDates),
    ];
}

// ============================================================
// Exports
export default listIdentities;
