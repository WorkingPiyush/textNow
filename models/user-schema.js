const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, minlength: 6 },
        status: { type: String, enum: ["online", "offline", "busy", "away"], default: "offline" }

    })

module.exports = mongoose.model('userSch', userSchema);