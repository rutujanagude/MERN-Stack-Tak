// ProductModel.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    sold: { type: Boolean, default: false },
    category: { type: String, required: true },
    dateOfSale: { type: String, default: Date.now },
});

// Make sure to export the model correctly
module.exports = mongoose.model('Product', productSchema);
