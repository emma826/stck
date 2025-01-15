const mongoose = require("mongoose")

const stock_schema = mongoose.schema({
    name: {
        type: String,
        required: true
    },
    sku_number: {
        type: String,
        required
    },
    description : {
        type: String,
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
},{
    timestamps: true,
    collection: "stock"
})

const Stock = mongoose.model("Stock", stock_schema)

module.exports = { Stock }