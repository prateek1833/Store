const Item = require("../models/item.js");
const Review = require("../models/review.js");
const Order = require("../models/order.js");




module.exports.addToCart = async (req, res) => {
    try {
        const allItem = await Item.find({});
        const item = await Item.findById(req.body.item);

        // Extract the quantity from the request body
        const quantity = req.body.quantity;

        // Check if the item exists
        if (!item) {
            // Handle the case where the item is not found
            return res.status(404).send("Item not found");
        }

        // Get the current order array from the cookie, or initialize it as an empty array if it doesn't exist
        let orders = req.cookies.order ? JSON.parse(req.cookies.order) : [];

        // Add the new order to the array
        orders.push({ item, quantity });

        // Set the cookie with the updated order array
        res.cookie("order", JSON.stringify(orders));

        // Render the cart view
        req.flash("success", `${item.title} has been added to cart`);
        res.redirect("/items");

    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.destroyFromCart = async (req, res) => {
    try {
        console.log(req.body.orderItem);
        // Get the current order array from the cookie, or initialize it as an empty array if it doesn't exist
        const order = req.cookies.order ? JSON.parse(req.cookies.order) : [];

        // Check if there are any orders in the array
        if (order.length == 0) {
            return res.status(404).send("No orders to delete");
        }

        // Extract the orderItem ID from the request body
        const orderItemId = req.body.orderItem;


        // Find the index of the orderItem in the orders array
        const index = order.findIndex(order => order.item._id == orderItemId);

        // Check if the orderItem exists in the orders array
        if (index === -1) {
            return res.status(404).send("Order not found");
        }

        // Remove the orderItem from the orders array
        order.splice(index, 1);

        // Set the cookie with the updated order array
        res.cookie("order", JSON.stringify(order));

        // Redirect back to the cart view or any other appropriate page
        res.render('user/cart.ejs', { order: order });// You might need to change this URL based on your application's routes

    } catch (error) {
        // Handle any errors that occur during the process
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.createOrder = async (req, res) => {
    try {
        console.log(res.locals.currUser);
        const user = res.locals.currUser;
        const orders = req.cookies.order ? JSON.parse(req.cookies.order) : [];

        // Initialize an empty array to store order items
        const items = [];

        // Iterate through each orderItem and construct the items array
        orders.forEach(orderItem => {
            items.push({
                item: {
                    _id: orderItem.item._id,
                    title: orderItem.item.title,
                    price: orderItem.item.price,
                    quantity: orderItem.quantity,
                    // Add other properties if necessary
                },
                // You may want to include other properties from the orderItem or additional properties if needed
            });
        });

        // Create a new order with the constructed items array
        const newOrder = new Order({
            items: items,
            author: {
                name: user.username,
                address: user.address +", "+ user.pincode,
                mobile: user.mobile,
                distance:user.distance,
                // Add other user properties if necessary
            },
            createdAt: new Date()
        });

        // Save the new order
        await newOrder.save();

        // Add the order ID to user's orders array
        user.orders.push(newOrder._id);

        // Save the updated user
        await user.save();

        // Clear the order cookie after the order has been placed
        res.clearCookie('order');

        req.flash("success", "Your Order has been placed. Keep Shopping.");
        res.redirect("/items");
    } catch (error) {
        console.error(error);
        req.flash("error", "Error placing your order. Please try again later.");
        res.redirect("/items");
    }
};
