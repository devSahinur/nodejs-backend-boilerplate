import mongoose from 'mongoose';

const privacySchema = new mongoose.Schema({
    content: { type: String, required: [true, 'Content is must be Required'] },
},
    { timestamps: true },

);

export default mongoose.model('Privacy', privacySchema);