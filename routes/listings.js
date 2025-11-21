const express = require("express");
const router =express.Router();
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const {isLoggedid,isOwner}=require("../middleware.js")
const listingControllers=require("../controller/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });
//validation code
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
    next();
    }
};
router
.route("/")
.get(wrapAsync(listingControllers.index))
//eehe wale route mai islogged nhi add karna hai ki nhi checkout karna
.post(isLoggedid,upload.single('listing[image][url]'),validateListing,wrapAsync(listingControllers.create));
// .post(upload.single('listing[image][url]'),(req,res)=>{
// res.send(req.file);

//index route
// router.get("/",wrapAsync(listingControllers.index
// ));
//new route
router.get("/new",isLoggedid,(req,res)=>
         { 
  res.render("listings/new.ejs");
});

router
.route("/:id")
.get(wrapAsync(listingControllers.show))
.put(isLoggedid,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(async(req,res)=>{
    
    let{id}=req.params;
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
    // if(req.file) {
   let url=req.file.path;
   let filename=req.file.filename;
   listing.image={url,filename}
   await listing.save()
//    }
   
    req.flash("success","The listing is updated");
    res.redirect(`/listings/${id}`);
}))
.delete(isLoggedid,isOwner,listingControllers.destroy);

//show routes
//  router.get("/:id",wrapAsync(listingControllers.show));
//create route
// router.post("/", validateListing,wrapAsync(listingControllers.create
// ));
//edit route
router.get("/:id/edit",isLoggedid,isOwner,wrapAsync(listingControllers.edit
));
//update route
// router.put("/:id",validateListing,isOwner,wrapAsync(async(req,res)=>{
//     // if(!req.listing.error){
//     //     throw new ExpressError(400,"write valid listing");
//     // }
//     let{id}=req.params;
   
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     req.flash("success","The listing is updated");
//     res.redirect(`/listings/${id}`);
// }));
// delete route
// router.delete("/:id",isLoggedid,isOwner,listingControllers.destroy
// );
module.exports=router;