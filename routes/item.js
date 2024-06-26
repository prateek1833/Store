const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const { itemSchemaSchema, reviewSchema } = require("../schema.js");
const Item = require("../models/item.js");
const User = require("../models/user.js");
const {isLoggedIn,validateItem,isOwner}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage });


const itemController=require("../Controller/item.js");

router.get("/", wrapAsync(itemController.index))

router.get("/hardware", wrapAsync(itemController.indexHardware))
router.get("/clothes", wrapAsync(itemController.indexClothes))
router.get("/accessories", wrapAsync(itemController.indexAccessories))
router.get("/paints", wrapAsync(itemController.indexPaint))
router.get("/grocery", wrapAsync(itemController.indexGrocery))

router.get("/search", wrapAsync(itemController.search))

router.get("/:id/show.ejs", wrapAsync(itemController.showItem));
router.get("/orders.ejs", wrapAsync(itemController.orders));

router.get("/new.ejs", isLoggedIn, async (req, res) => {
    res.render("items/new.ejs");
})
router.get("/cart.ejs", isLoggedIn, async (req, res) => {
    const order = req.cookies.order ? JSON.parse(req.cookies.order) : [];
    res.render('user/cart.ejs', { order: order});
})

router.post("/new",isLoggedIn,upload.single('image'), wrapAsync(itemController.createItem));

router
.route("/:id/edit")
.get(isLoggedIn, itemController.renderEdit)
.put(isLoggedIn,upload.single('image'), itemController.update)


router.delete("/:id/delete",isLoggedIn, itemController.destroyItem);


module.exports=router;