const mongoose = require("mongoose"); //import mongoose
const Schema = mongoose.Schema;  //create schema

const listingSchema = new Schema({   //define schema
    title: {              //define fields 
        type: String,
        required: true,   //constraints
    },
    description: String,       
    image:{
        type: String,
        default: "https://images.unsplash.com/photo-1766988156039-85f5a592df64?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //default image URL for -- at time when no option of image the it shows to tester
        set: (v) => v === "" ? "https://images.unsplash.com/photo-1766988156039-85f5a592df64?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v, //setter to set default image if none provided
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
          type: Schema.Types.ObjectId,
          ref: "Review" ,
        },
    ],
}); 

const Listing = mongoose.model("Listing", listingSchema); //create model
module.exports = Listing; //export model
