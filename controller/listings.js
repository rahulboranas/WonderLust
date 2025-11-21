const Listing = require("../models/listing");
module.exports.index=async(req,res)=>{
     const allListings=await Listing.find({})
     res.render("listings/index.ejs",{allListings})
};
module.exports.show=async(req,res)=>
{
let{id}=req.params;
let listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author",},}).populate("owner");
if(!listing){
    req.flash("error","Oops! This listing is no longer available.");
    return res.redirect("/listings");
};
console.log(listing);
res.render("listings/show.ejs",{listing});
};

module.exports.create=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
const newListings=new Listing(req.body.listing);
newListings.owner=req.user._id;
newListings.image={url,filename}
await newListings.save();
req.flash("success","New listing is added");
res.redirect("/listings");
};

module.exports.destroy=async(req,res)=>{
    let{id}=req.params;
    let deletedlisting = await Listing.findByIdAndDelete(id);
    console.log(deletedlisting);
    req.flash("success","The listing is deleted");
    res.redirect("/listings");
};

module.exports.edit=async(req,res)=>{
    let{id}=req.params;
    let listing=await Listing.findById(id);
     if(!listing){
    req.flash("update","Oops! This listing is no longer available for edit.");
    return res.redirect("/listings");
};
    res.render("listings/edit.ejs",{listing});
};
