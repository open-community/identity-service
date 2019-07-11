// ============================================================
// Import modules
import { Identity } from '../models';
import {
    getIdentityIdFromApiId,
} from './helpers';
import { buildError, ApiErrors } from './errors';

// ============================================================
// Functions
async function deleteIdentity(req, res) {
    const { id: apiId } = req.params;

    const id = getIdentityIdFromApiId(apiId);

    if (!id) {
        const errors = buildError(ApiErrors.INVALID_ID, 'id');

        res.status(400).json(errors);
        return;
    }

    await Identity.deleteOne({ id });

    res.status(200).send();
}

// ============================================================
// Exports
export default deleteIdentity;
