const express = require("express");
const router = express.Router();
const path = require("path");
const { get_user_details } = require("./middleware");
const { stock_schema } = require("../model/stock_schema");
const StockHistory = require('../model/stock_history_schema');
const Order = require('../model/order_schema');

router.use(get_user_details);

router.post("/add_stock", async (req, res) => {
    const { id } = req.user;
    const { name, sku, quantity, price, threshold, category } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Session not found, login to fix issue"
        });
    }

    if (!name || !sku || !quantity || !price || !threshold || !category) {
        return res.status(400).json({
            success: false,
            message: "Empty fields, all fields are required"
        });
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
        });

        await StockHistory.create({
            userId: id,
            productId: newStock._id,
            action: 'added',
            quantity: quantity,
            previousQuantity: 0,
            price: price
        });

        res.status(201).json({
            success: true,
            newStock
        });

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).json({
                success: false,
                message: `SKU number already existing in the database`
            });
        }
        res.status(500).json({
            success: false,
            message: "Server Error, please try again later"
        });
    }
});

router.post("/update_stocks", async (req, res) => {
    const { id } = req.user;
    const { productId, quantity, price } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Session not found, login to fix issue"
        });
    }

    if (!productId || !quantity || !price) {
        return res.status(400).json({
            success: false,
            message: "Empty fields, all fields are required"
        });
    }

    try {
        const stock = await stock_schema.findById(productId);

        if (!stock) {
            return res.status(404).json({
                success: false,
                message: "Stock not found"
            });
        }

        const previousQuantity = stock.stockQuantity;
        stock.stockQuantity += quantity;
        stock.price = price;
        await stock.save();

        await StockHistory.create({
            userId: id,
            productId: stock._id,
            action: 'updated',
            quantity: quantity,
            previousQuantity: previousQuantity,
            price: price
        });

        res.status(200).json({
            success: true,
            stock
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error, please try again later"
        });
    }
});

router.post("/add_order", async (req, res) => {
    const { id } = req.user;
    const { orderList } = req.body;

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Session not found, login to fix issue"
        });
    }

    if (!orderList || orderList.length === 0) {
        return res.status(400).json({
            success: false,
            message: "No product added to the order list"
        });
    }

    try {
        for (let order of orderList) {
            const stock = await stock_schema.findById(order.productId);

            if (stock.stockQuantity < order.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${stock.productName}`
                });
            }

            stock.stockQuantity -= order.quantity;
            await stock.save();
        }

        const totalAmount = orderList.reduce((sum, order) => sum + order.totalAmount, 0);

        const newOrder = new Order({
            userId: id,
            orderList,
            totalAmount
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Order added successfully'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error, please try again later"
        });
    }
});

router.get("/", async (req, res) => {
    const { id, name, email } = req.user;
    const url = path.join("stock_management", "index");

    if (!id) {
        res.redirect("/login");
        return;
    }

    res.render(url, { id, name, email });
});

router.get("/load_stocks", async (req, res) => {
    try {
        const { id } = req.user;

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Session not found, login to fix issue"
            });
        }

        const stocks = await stock_schema.find({ user_id: id });

        res.status(200).json({
            success: true,
            stocks
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error, please try again later"
        });
    }
});

router.get("/product/:id", async (req, res) => {
    const { id } = req.user;
    const { id: productId } = req.params;

    if (!id) {
        res.redirect("/login");
        return;
    }

    try {
        const stock = await stock_schema.findById(productId);
        console.log(stock);

        if (!stock) {
            res.redirect("/stock_management");
            return;
        }

        res.render("stock_management/product", { id, stock });
    } catch (error) {
        console.error(error);
        res.redirect("/stock_management");
    }
});

module.exports = router;