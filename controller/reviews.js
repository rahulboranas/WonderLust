const Listing = require("../models/listing");
const Review=require("../models/review");
module.exports.destroy= async(req,res)=>{
let {id,reviewID}=req.params;
await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewID}});
await Review.findByIdAndDelete(reviewID);
res.redirect(`/listings/${id}`);
};
module.exports.post=  async(req,res)=>{
  let listing = await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  listing.reviews.push(newReview);
  await listing.save();
  await newReview.save();
res.redirect(`/listings/${listing._id}`)
};
