// ============================================================
// Import modules

import {
    dbIdentityToApi,
} from './helpers';

import { Identity } from '../models';

// ============================================================
// Functions

async function createIdentity(req, res) {
    const { profile } = req.body;

    const identity = await Identity.createIdentity({
        profile,
    });

    await identity.save();

    res.status(200).json(dbIdentityToApi(identity));
}

// ============================================================
// exports
export default createIdentity;
