const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: String,
    name: Number,
});

module.exports = mongoose.model('Update', productSchema);