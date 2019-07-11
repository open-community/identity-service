// ============================================================
// Import packages
import { Schema } from 'mongoose';
import _ from 'lodash';

// ============================================================
// Import modules
import {
    generateIdentityId,
} from '../helpers';

// ============================================================
// Schema
const IdentitySchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },

    profile: {
        firstName: String,
        lastName: String,
    },

    users: {
        type: [String],
        required: true,
    },

    deletionDate: Date,

    creationDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

// ============================================================
// Methods

/**
 * Add a list of users to the identity
 * @param {string[]} listId - List of user ID to add
 * @public
 */
IdentitySchema.methods.addUsers = function addUsers(listId) {
    const users = [
        ...this.users,
        ...listId,
    ];

    this.users = users;
};

/**
 * Remove a list of users from the identity
 * @public
 */
IdentitySchema.methods.removeUsers = async function removeUsers(listId) {
    this.users = _.difference(
        this.users,
        listId,
    );
};

// ============================================================
// Statis
/**
 * Create a new account.
 * @public
 */
IdentitySchema.statics.createIdentity = async function createIdentity({
    profile: {
        firstName,
        lastName,
    },
}) {
    const identity = await this.create({
        id: generateIdentityId(),
        profile: {
            firstName,
            lastName,
        },
    });

    return identity;
};

// ============================================================
// Exports
export default IdentitySchema;
