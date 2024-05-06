const express = require("express");
const router = express.Router();
const Users = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const {isLoggedIn,validateItem,isOwner}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage });



const ownerController=require("../Controller/owner.js");

router.get("/",isOwner,isLoggedIn, wrapAsync(ownerController.index))

router
.get("/:id/edit",isOwner,isLoggedIn, wrapAsync(ownerController.renderEdit))
.put("/:id/edit",isLoggedIn,isOwner,ownerController.update)


module.exports=router;