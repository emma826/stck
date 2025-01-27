const express = require("express")
const router = express.Router()
const cookie_parser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const user = require("../model/user_schema")
const { stock_schema } = require("../model/stock_schema")

router.use(cookie_parser())

async function get_user_details(req, res, next) {
    if (req.cookies) {
        const { stck } = req.cookies

        try {

            const verify_id = await jwt.verify(stck, process.env.SECRET_KEY)
            const find_user = await user.findById({ _id: verify_id })

            if (!find_user) {
                req.user = {
                    id: null
                }
                next()
            }
            else {
                req.user = {
                    id: find_user.id,
                    name: find_user.name,
                    email: find_user.email,
                    public_key: find_user.public_key,
                    private_key: find_user.private_key
                }
                next()
            }

        } catch (error) {
            req.user = {
                id: null
            }
            next()
        }
    } else {
        req.user = {
            id: null
        }
        next()
    }
}

const get_categories = async () => {
    try {
        const categories = await stock_schema.distinct("category");
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}

const get_stocks = async (user_id) => {
    try {
        const stocks = await stock_schema.find({ user_id });
        return stocks;
    } catch (error) {
        console.error("Error fetching stocks:", error);
        return null;
    }
}

module.exports = { get_user_details, get_categories, get_stocks }