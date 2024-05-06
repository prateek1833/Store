const Orders = require("../models/order");
const User = require("../models/user");

module.exports.index = async (req, res) => {
    const allUser = await User.find({});
    res.render("owner/users.ejs", { allUser });
}
module.exports.renderEdit = async (req, res) => {
    let { id } = req.params;
    const user = await User.findById(id);
    res.render("owner/edit.ejs", { user });
}

module.exports.update = async (req, res) => {
    const { id } = req.params;
    let { address, pincode, balance_due, mobile } = req.body;
    console.log(req.body);

    try {
        let user = await User.findByIdAndUpdate(id, {
            address,
            pincode,
            balance_due,
            mobile,
        })

        if (!user) {
            req.flash("error", "User not found");
            return res.redirect(`/owner`);
        }
        await user.save();
        req.flash("success", "User Updated");
        return res.redirect(`/owner`);
    } catch (error) {
        console.error("Error updating user:", error);
        req.flash("error", "Error updating user");
        return res.redirect(`/owner`);
    }
}

