const mongoose = require('mongoose');

const stockHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    action: {
        type: String,
        enum: ['added', 'updated'],
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    previousQuantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StockHistory', stockHistorySchema);
