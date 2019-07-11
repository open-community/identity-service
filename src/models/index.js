// ============================================================
// Import packages
import mongoose from 'mongoose';

// ============================================================
// Import modules
import IdentitySchema from './IdentitySchema';

// ============================================================
// Module's constants and variables

const Identity = mongoose.model('Identity', IdentitySchema);

// ============================================================
// Exports
export {
    Identity,
};
