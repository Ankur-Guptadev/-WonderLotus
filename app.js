const express = require("express");  //import express
const app = express();                 //create app
const mongoose = require("mongoose");               //import mongoose
const Listing = require("./models/listing.js");       //import listing model or "require" listing model from models/listing.js
const path = require("path");
const methodOverride = require("method-override"); //import method-override
const ejsMate = require("ejs-mate"); //import ejs-mate for layout support in ejs
const wrapAsync = require("./utils/wrapAsync.js"); //import wrapAsync utility function
const ExpressError = require("./utils/ExpressError.js"); //import custom ExpressError class
const { listingSchema, reviewSchema } = require("./schema.js"); //import listingSchema for validating listing data
const Review = require("./models/review.js");       //import review model or "require" review model from models/review.js

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlotus";          //mongoDB URL

main()                                     //connect to mongoDB
   .then(() => {
      console.log("connected to DB");
   })
    .catch((err) => {       //catch error if connection fails
        console.log(err);
    });

async function main() {                       //async function to connect to mongoDB
    await mongoose.connect(MONGO_URL)         //connect to mongoDB
}

app.set("view engine", "ejs"); //set view engine to ejs
app.set("views", path.join(__dirname, "views")); //set views directory
app.use(express.urlencoded({extended: true})); //parse urlencoded bodies means in easy language when form is submitted data is encoded in URL format and sent to server this middleware helps to parse that data
app.use(methodOverride("_method"));  //use method-override to override methods in forms (like PUT and DELETE requests from forms which only support GET and POST)
app.engine("ejs",  ejsMate); //set ejs-mate as the engine for ejs files
app.use(express.static(path.join(__dirname, "/public")));  //serve static files from public directory


//Root Route
app.get("/", (req, res) => {                 //root route
    res.send("Hello I am Root");
});

const validateListing = (req, res, next) => {
       let {error} = listingSchema.validate(req.body);        //validate req.body with listingSchema means validate data before creating new listing
   
       if(error) {
        let errMsg = error.details.map((el) => el.message).join(",") ;   //map through error details and join messages with comma
        throw new ExpressError(400, errMsg);
       }  else {
        next();
       }
};

const validateReview = (req, res, next) => {
       let {error} = reviewSchema.validate(req.body);        //validate req.body with listingSchema means validate data before creating new listing
   
       if(error) {
        let errMsg = error.details.map((el) => el.message).join(",") ;   //map through error details and join messages with comma
        throw new ExpressError(400, errMsg);
       }  else {
        next();
       }
};

//Index Route to show all listings
app.get("/listings",  wrapAsync(async (req, res) => {      //route to get all listings
   const allListings = await Listing.find({});   //fetch all listings from DB
   res.render("listings/index.ejs", {allListings});        //render index.ejs with all listings
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");     //render new.ejs to show form to create new listing
})
 

//Show Route
app.get("/listings/:id",  wrapAsync(async (req, res) => {         
    let {id} = req.params;                  //get id from params
    const listing = await Listing.findById(id);  //find listing by id
    res.render("listings/show.ejs", {listing});     //render show.ejs with listing
}));

//Create Route
app.post(
    "/listings",
    validateListing,
     wrapAsync(async (req, res, next) => {     //route used async because we are using await inside and also added next to pass error to error handling middleware and wrapped with wrapAsync to catch errors
       const newListing = new Listing(req.body.listing);     //create new listing with form data
       await newListing.save();             //save new listing to DB 
       res.redirect("/listings");          //redirect to listings page
    })
); 

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;                  //get id from params
    const listing = await Listing.findById(id);  //find listing by id
    res.render("listings/edit.ejs", {listing});    //render edit.ejs with listing
}));

//Update Route
app.put("/listings/:id",validateListing,  wrapAsync(async (req, res) => {            //route to update listing
    let { id } = req.params;         //get id from params
   await Listing.findByIdAndUpdate(id, {...req.body.listing});  //update listing with form data ...spread operator is used to copy all properties from req.body.listings to the update object
   res.redirect(`/listings/${id}`);       //redirect to show page of updated listing
}));

//Delete Route
app.delete("/listings/:id", async (req, res) => {        //route to delete listing
    let { id } = req.params;         //get id from params
   let deletedListing = await Listing.findByIdAndDelete(id);      //delete listing by id
    console.log(deletedListing);
    res.redirect("/listings");      //redirect to listings page
});

//Reviews
//Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async(req, res) => {
   let listing = await Listing.findById(req.params.id);
   let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   res.redirect(`/listings/${listing._id}`);
}));

// app.get("/testListing", async (req, res) => {          //route to test listing model
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();        //save sample listing to DB
//     console.log("sample was saved");
//     res.send("Successfull testing");
// });

app.use((req, res, next) => {
    next(new ExpressError(404, "Page not Found!"));
});

app.use((err, req, res, next) => {     //error handling middleware
    let{statusCode=500, message="Somthing went wrong!"} = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
});

app.listen(8080, () => {                   //listen to port 8080
    console.log("server is listening to port 8080");
});              
 

