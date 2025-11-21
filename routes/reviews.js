const express = require("express");
const router =express.Router({mergeParams:true});
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review = require("../models/review.js");
const { isLoggedid } = require("../middleware.js");
const reviewControllers=require("../controller/reviews.js");
//validation code
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
    next();
    }
};
//reviews
//post route
router.post("/",isLoggedid,validateReview,wrapAsync(reviewControllers.post

));
//Delete review 
//Route
router.delete("/:reviewID",isLoggedid,wrapAsync(reviewControllers.destroy

));
module.exports=router;