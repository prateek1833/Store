
const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {isLoggedIn,validateItem,isOwner}=require("../middleware.js");

const userController=require("../Controller/user");

router
.route("/signup")
.get( userController.renderSignUp)
.post( wrapAsync(userController.signup))

router.get("/logout",wrapAsync(userController.logout));

router
.route("/login")
.get(userController.renderLogin)
.post( saveRedirectUrl, passport.authenticate("local", { failureRedirect: '/login', failureFlash: true }), userController.login);

router.get("/cart", isLoggedIn, async (req, res) => {
    const order = req.cookies.order ? JSON.parse(req.cookies.order) : [];
    res.render('user/cart.ejs', { order: order});
})


module.exports = router;