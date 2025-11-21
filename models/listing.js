const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review.js");
const listingSchema=new mongoose.Schema({
   title :{ 
   type:String,
   required:true,
   },
   description : String,
 image: {
  filename: String,
  url: {
    type: String,
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1700483717331-6da3888bc3db?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDV8RnpvM3p1T0hONnd8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
},
      
   price : Number,
   location : String,
   country : String ,
    reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    },
  ],
  owner:
  {
      type: Schema.Types.ObjectId,
      ref:"User",
  },
});
//middleware for and deletion listing all content
listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){await Review.deleteMany({_id:{$in:listing.reviews}});
}});
const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;