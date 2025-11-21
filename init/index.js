const mongoose = require('mongoose');
const initData = require("./data.js");
const Listing=require("../models/listing.js");
const passport=require("passport")
main().then(()=>{
    console.log("working properly mongoos");

}).catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};
const initDB=async()=>
{
    await Listing.deleteMany({}); 
 initData.data =initData.data.map((obj)=>({...obj,owner:"6843fc8462855e5ef906fdbd",}));
    await Listing.insertMany(initData.data);
   console.log( "this is working properly initialization");
};
initDB();
