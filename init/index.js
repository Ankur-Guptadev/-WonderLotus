const mongoose = require("mongoose"); // import mongoose
const initData = require("./data.js"); // import sample data
const Listing = require("../models/listing.js"); // import listing model

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlotus";          //mongoDB URL

main()                                     //connect to mongoDB
   .then(() => {
      console.log("connected to DB");
   })
    .catch((err) => {
        console.log(err);
    });

async function main() {                       //async function to connect to mongoDB
    await mongoose.connect(MONGO_URL)         //connect to mongoDB
}

const initDB = async () => {         //function to initialize DB with sample data
    await Listing.deleteMany({});              //delete all existing listings previous data
    await Listing.insertMany(initData.data);   //insert sample data , initdata is object having data array
    console.log("data was initialized");
};

initDB();   //initialize DB with sample data