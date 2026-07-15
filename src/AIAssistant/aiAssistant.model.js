import { Schema, model } from 'mongoose';

const chatSessionSchema = new Schema({
    user: {
        type: String,
        required: true
    },
    title: {
        type: String,
        default: 'Nuevo Chat'
    },
    messages: [{
        role: { type: String, enum: ['user', 'model'], required: true },
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now }
    }]
}, {
    timestamps: true,
    versionKey: false
});

export default model('ChatSession', chatSessionSchema);
