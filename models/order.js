const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
    items: [
        {
            item: {
                image: {
                    url: String,
                    filename: String,
                },
                _id: String,
                title: String,
                description: String,
                price: Number,
                quantity: Number,
                owner: String,
                __v: Number,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    author: {
        name:String,
        address:String,
        mobile: Number,
        distance:Number,
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
