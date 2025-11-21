
const express = require("express");
const router =express.Router();
const User= require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport=require("passport");
const {SaveRedirectUrl}=require("../middleware.js");
router.get("/signup",(req,res)=>{
 res.render("users/signup.ejs");
});
//signup route
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
 let{username,password,email}=req.body;
 const newUser=new User({email,username});
 const registeredUser = await User.register(newUser,password);
 console.log(registeredUser);
 req.login(registeredUser,(err)=>{
   if(err){
   return next(err);
   }
    req.flash("success","you are signup");
 res.redirect("/listings");
 }
);

    }catch(e){
    req.flash("error",e.message);
     res.redirect("/signup");
};
}));

//login route
router.get("/login",(req,res)=>{
 res.render("users/login.ejs");
});
router.post("/login",SaveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Successfully logined");
    let redirect = res.locals.redirectUrl || "/listings" ;
    res.redirect(redirect);
});
router.get("/logout",(req,res,next)=>{
req.logout((err)=>{
    if(err){
    return next(err);
}
req.flash("success","successfully logout!");
res.redirect("/listings");
});

});
module.exports=router;