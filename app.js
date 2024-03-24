const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongo_url = "mongodb://127.0.0.1:27017/wonderlust";
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require('method-override');

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

main()
    .then(() => {
        console.log("connect to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url);
}
app.get("/", (req, res) => {
    res.send("working");
})
app.get("/listings/:id/show.ejs", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
})
app.get("/listings/new.ejs", async (req, res) => {
    res.render("listings/new.ejs");
})

app.get("/listings", async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });

})
app.post("/listings/new", async (req, res) => {
    let { title, description, image, price, location, country } = req.body;
    console.log(req.body);
    let newListing = await new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    })
    await newListing.save()
        .then((res) => {
            console.log("newList saved");
        })
        .catch(err => console.log(err));
    res.redirect("/listings");
})

app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})

app.delete("/listings/:id/delete",async(req,res)=>{
    let {id}=req.params;
    let deleted=await Listing.findByIdAndDelete(id);
    console.log(deleted);
    res.redirect("/listings");
})

app.put("/listings/:id/edit", async (req, res) => {
    const { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, {
        title,
        description,
        image,
        price,
        location,
        country,
    })
    
    res.redirect(`/listings/${id}/show.ejs`);
})

// app.get("/testListing",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New villa",
//         description: "By the beach",
//         price:1200,
//         location:"calangute,Goa",
//         country:"India",
//     })
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });


app.listen(8080, () => {
    console.log("server is listening to port 8080");
});
