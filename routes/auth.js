const express = require("express")
const router = express.Router()
const body_parser = require("body-parser")
const bcrypt = require("bcryptjs")
const cookie_parser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const env = require("dotenv").config()
const user = require("../model/user_schema")

router.use(body_parser.json())
router.use(cookie_parser())

router.post("/register", async (req, res) => {
	const { name, email, password } = req.body

	if (!name || !email || !password) {
		return res.status(422).json({
			success: false,
			message: "Please fill in the empty fields"
		})
	}
	else if (password.length < 8) {
		return res.status(422).json({
			success: false,
			message: "Passwords must be u to 8 characters"
		})
	}
	else {

		
		try {
			const password_hash = await bcrypt.hash(password, 10)

			const create_user = await user.create({ name, email, password: password_hash })
			const token = jwt.sign(create_user.id, process.env.SECRET_KEY)
			
			res.cookie("stck", token, {
				maxAge: 3600 * 24 * 1000,
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				path: "/",
				sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
			});



			return res.status(200).json({
				success: true
			})

		} catch (error) {
			console.log(error)
			if (error.code == 11000) {
				return res.status(422).json({
					success: false,
					message: "Email already exists in the database, try logging in"
				})
			}
			else {
				console.log(error)
				return res.status(500).json({
					success: false,
					message: "Server error, please try again later"
				})
			}
		}
	}

})

router.post("/login", async (req, res) => {
	const { email, password } = req.body

	if (!email) {
		return res.status(422).json({
			success: false,
			message: "Empty fields, please input your email address"
		})
	}
	else {
		try {

			const findUser = await user.findOne({ email })

			if (findUser.id) {

				const compare_password = await bcrypt.compare(password, findUser.password)

				if (compare_password == true) {
					const token = jwt.sign(findUser.id, process.env.SECRET_KEY)
					
					res.cookie("stck", token, {
						maxAge: 3600 * 24 * 1000,
						httpOnly: true,
						secure: process.env.NODE_ENV === "production",
						path: "/",
						sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
					});




					return res.status(200).json({
						success: true
					})
				}
				else {
					return res.status(400).json({
						success: false,
						message: "Invalid Email/Password"
					})
				}

			}
			else {
				return res.status(422).json({
					success: false,
					message: "Account doesn't exist, signup to create account"
				})
			}

		} catch (error) {
			console.log(error)
			return res.status(500).json({
				success: false,
				message: "Server error, don't worry we are working to fix the issue"
			})
		}
	}
})

router.get("/logout", async (req, res) => {
	res.clearCookie('stck');
	res.redirect("/login")
})


module.exports = router