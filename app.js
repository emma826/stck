const express = require("express")
const app = express()
const port = process.env.PORT || 5004
const ejs = require("ejs")
const path = require("path")

app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, 'assets')))

app.get("/", (req, res) => {
    res.render("index")
})
app.get("/:url", (req, res) => {
    const url = req.params.url
    res.render(req.params.url)
})

app.listen(port, () => console.log(`http:127.0.