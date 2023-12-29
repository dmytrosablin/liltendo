const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    record: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("User", userSchema)