const mongoose = require("mongoose"); //import mongoose
const Schema = mongoose.Schema;  //create schema

const reviewSchema = new Schema({
    comment: String,
    reting: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("Review", reviewSchema);