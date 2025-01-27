const express = require("express")
const app = express()
const port = process.env.PORT || 5004
const ejs = require("ejs")
const path = require("path")
const mongoose = require("mongoose")
const cookie_parser = require("cookie-parser")
const body_parser = require("body-parser")

const auth = require("./routes/auth")
const { get_user_details, get_stocks } = require("./routes/middleware")
const stock_managerment = require("./routes/stoc_management")

mongoose.connect("mongodb://0.0.0.0:27017/stck")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'assets')))
app.use(cookie_parser())
app.use(body_parser.json())
app.use("/auth", auth)
app.use("/stock_management", stock_managerment)

app.get("/", get_user_details, async (req, res) => {
    const { id, name, email } = req.user

    if (!id) {
        res.redirect("/login")
        return
    }

    res.render("index", { id, name, email })
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/get_stocks", get_user_details, async (req, res) => {
    const { id } = req.user

    if (!id) {
        return res.status(400).json({
            success: false,
            message: "Session not found, login to fix issue"
        })
    }

    const stockList = await get_stocks(id)

    return res.status(200).json({
        stockList
    })

})

app.get("/:url", get_user_details, (req, res) => {
    const { id, name, email } = req.user
    const url = req.params.url

    if (!id) {
        res.redirect("/login")
        return
    }

    res.render(url, { id, name, email })
})

app.listen(port, () => console.log(`http://127.0.0.1:${port}`))