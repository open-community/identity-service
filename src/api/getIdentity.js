// ============================================================
// Import modules
import { Identity } from '../models';
import {
    getIdentityIdFromApiId,
    dbIdentityToApi,
} from './helpers';

// ============================================================
// Errors

const API_ERRORS = {
    INVALID_ID: 'Invalid ID',
};

// ============================================================
// Functions
async function getIdentity(req, res) {
    const { id: apiId } = req.params;

    const id = getIdentityIdFromApiId(apiId);

    if (!id) {
        const errors = {
            code: 'INVALID_ID',
            error: API_ERRORS.INVALID_ID,
        };

        res.status(400).json(errors);
        return;
    }

    const dbAccount = await Identity.findOne({ id });

    if (!dbAccount) {
        res.status(404).send();
        return;
    }

    res.status(200).send(dbIdentityToApi(dbAccount));
}

// ============================================================
// Exports
export default getIdentity;
