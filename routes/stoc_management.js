const express = require("express")
const router = express.Router()
const path = require("path")
const { get_user_details } = require("./middleware")
const { stock_schema } = require("../model/stock_schema")

router.use(get_user_details)

router.post("/add_stock", async (req, res) => {
    const { id } = req.user
    const { name, sku, quantity, price, threshold, category } = req.body

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Session not found, login to fix issue"
        })
    }

    if (!name || !sku || !quantity || !price || !threshold || !category) {
        return res.status(400).json({
            success: false,
            message: "Empty fields, all fields are required"
        })
    }

    try {
        const newStock = await stock_schema.create({
            user_id: id,
            productName: name,
            skuBarcode: sku,
            stockQuantity: quantity,
            price,
            stockThreshold: threshold,
            category
        })

        res.status(201).json({
            success: true,
            newStock
        })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({
                success: false,
                message: `SKU number already existing in the database`
            })
        }
        res.status(500).json({
            success: false,
            message: "Server Error, please try again later"
        })
    }
})

router.get("/", async (req, res) => {
    const { id, name, email } = req.user
    const url = path.join("stock_management", "index")

    if (!id) {
        res.redirect("/login")
        return
    }

    res.render(url, { id, name, email })
})

router.get("/load_stocks", async (req, res) => {
    try {
        const { id } = req.user

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Session not found, login to fix issue"
            })
        }

        const stocks = await stock_schema.find({ user_id: id })

        res.status(200).json({
            success: true,
            stocks
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            success: false,
            message: "Server Error, please try again later"
        })
    }
})

module.exports = router