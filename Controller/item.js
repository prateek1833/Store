const Item = require("../models/item");
const Orders = require("../models/order");
const User = require("../models/user");

module.exports.index = async (req, res) => {
    const allItem = await Item.find({});
    res.render("items/index.ejs", { allItem });
}
module.exports.indexHardware = async (req, res) => {
    const allItem = await Item.find({ category: "Hardware" });
    res.render("items/index.ejs", { allItem });
}
module.exports.indexClothes = async (req, res) => {
    const allItem = await Item.find({ category: "Clothes" });
    res.render("items/index.ejs", { allItem });
}
module.exports.indexAccessories = async (req, res) => {
    const allItem = await Item.find({ category: "Accessories" });
    res.render("items/index.ejs", { allItem });
}
module.exports.search = async (req, res) => {
    const keyword = req.query.keyword; // Assuming keyword is sent in the query parameters
    console.log(keyword);
    // Find items where title or description contains the keyword
    const allItem = await Item.find({
        $or: [
            { title: { $regex: new RegExp(keyword, 'i') } }, // Case-insensitive regex search for title
            { description: { $regex: new RegExp(keyword, 'i') } }, // Case-insensitive regex search for description
            { key: { $regex: new RegExp(keyword, 'i') } },
        ]
    });

    res.render("items/index.ejs", { allItem });
}

module.exports.showItem = async (req, res) => {
    let { id } = req.params;
    const item = await Item.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");;
    if (!item) {
        req.flash("error", "Item you trying to access does not exist");
        res.redirect("/items");
    }
   
    res.render("items/show.ejs", { item });
}
module.exports.orders = async (req, res) => {
    const allOrder = await Orders.find({});
    res.render("items/orders.ejs", { allOrder,User });
}



module.exports.createItem = async (req, res) => {
    // if (!req.body) {
    //     throw new ExpressError("send valid data for item");
    // }
    // if (!req.body.title) {
    //     throw new ExpressError("Title is missing");
    // }
    // if (!req.body.price) {
    //     throw new ExpressError("Price is missing");
    // }
    let { title, description, price,category,unit,key } = req.body;
  
    let url = req.file.path;
    let filename = req.file.filename;

    let newItem = await new Item({
        owner: req.user._id,
        title: title,
        description: description,
        price: price,
        category: category,
        unit:unit,
        key:key.split(" "),
        image: { url, filename },
    })
    await newItem.save()
        .then((res) => {
            console.log("newList saved");
        })
        .catch(err => console.log(err));
    req.flash("success", "New Item Created");
    res.redirect("/items");
}

module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const item = await Item.findById(id);
    if(!item){
        res.flash("error","Item you requested does not exist!");
        res.redirect("/items");
    }
    let originalImageUrl=item.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("items/edit.ejs", { item,originalImageUrl });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    let { title, description, price,category } = req.body;

    let item = await Item.findByIdAndUpdate(id, {
        title,
        description,
        price,
        category,
    })
    if (typeof req.file != "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        item.image= { url, filename };
        await item.save();
    }
    req.flash("success", " Item Updated");
    res.redirect(`/items/${id}/show.ejs`);
}

module.exports.destroyItem = async (req, res) => {
    let { id } = req.params;
    let deleted = await Item.findByIdAndDelete(id);
    req.flash("success", " Item deleted");
    res.redirect("/items");
}