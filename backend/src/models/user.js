import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

const ChatSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    filenames: {
        type: [String],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    indices: {
        type: [String], 
        required: true,
    },
    history: {
        type: [messageSchema], 
        required: true,
    },
});

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    chats: {
        type: [ChatSchema],
        default: [],
    },
});

const User = mongoose.model('User', UserSchema);

export default User;