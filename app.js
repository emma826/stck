const express = require("express")
const app = express()
const port = process.env.PORT || 5004
const ejs = require("ejs")
const path = require("path")
const mongoose = require("mongoose")

const auth = require("./routes/auth")

mongoose.connect("mongodb://0.0.0.0:27017/stck")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'assets')))
app.use("/auth", auth)

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/:url", (req, res) => {
    const url = req.params.url
    res.render(url)
})

app.listen(port, () => console.log(`http:127.0.0.1:${port}`))