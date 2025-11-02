import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    content: { type: String, required: [true, 'Content is must be Required'] },
},
    { timestamps: true },

);

export default mongoose.model('About', aboutSchema);