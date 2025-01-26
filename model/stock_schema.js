const mongoose = require("mongoose")

const stockSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    productName: {
        type: String,
        required: true
    },
    skuBarcode: {
        type: String,
        required: true,
        unique: true
    },
    stockQuantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stockThreshold: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    dateUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    collection: "stock"
})

const stock_schema = mongoose.model("Stock", stockSchema)

module.exports = { stock_schema }