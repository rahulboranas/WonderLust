if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const ExpressError = require("./utils/ExpressError.js");

// ROUTES IMPORTS
const listingsRoute = require("./routes/listings.js");
const reviewsRoute = require("./routes/reviews.js");
const usersRoute = require("./routes/users.js");

// CONFIG
const dbUrl = process.env.ATLASDB_URL;
const port = 8080;

// ✅ Database connection
async function main() {
  await mongoose.connect(dbUrl);
  console.log("✅ MongoDB Connected Successfully");
}
main().catch((err) => console.log("Mongo Connection Error:", err));

// ✅ Session Store (Mongo)
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: { secret: process.env.SECRET },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("❌ ERROR IN MONGO SESSION STORE:", err);
});

// ✅ Session Configuration
const sessionOptions = {
  store,
  secret: process.env.SECRET || "keyboardcat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

// ✅ App settings
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(session(sessionOptions));
app.use(flash());

// ✅ Passport setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ GLOBAL MIDDLEWARE (for all EJS templates)
app.use((req, res, next) => {
  res.locals.currUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.update = req.flash("update");
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listings");
});
// ✅ Routes
app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/", usersRoute);

// ✅ 404 Handler
// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page Not Found!"));
// });

// ✅ Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// ✅ Server Start
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});


// if(process.env.NODE_ENV !="production"){
//     require("dotenv").config();
// }
// require('dotenv').config()
// console.log(process.env);

// const express = require("express");
// const app = express();
// let port = 8080 ;
// const mongoose = require('mongoose');
// const Listing = require("./models/listing");
// const dbUrl = process.env.ATLASDB_URL;
// const path = require("path");
// const methodOverride=require("method-override");
// const ejsMate =require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
// const {listingSchema,reviewSchema}=require("./schema.js");
// const session = require("express-session");
// const MongoStore = require('connect-mongo')
// const listingsRoute=require("./routes/listings.js");
// const reviewsRoute=require("./routes/reviews.js");
// const usersRoute=require("./routes/users.js");
// const flash=require("connect-flash");
// const passport=require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");

// const store = MongoStore.create({
//     mongoUrl :dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter: 24 * 3600,
// });
// store.on("error",()=>{
//     console.log("ERROR IN MONGO SESSION STORE" , err);
// });

// const sessionOptions={store, secret:process.env.SECRET,
//     resave:false,
//     saveUninitialized:true,
//     cookie : {
//         expries:Date.now()+7*24*60*60*1000,
//         maxAge:7*24*60*60*1000,
//         httpOnly:true,
//     },
// };

// app.set("views",path.join(__dirname,"/views"));
// app.set("view engine","ejs");
// app.use(methodOverride("_method"));
// app.use(express.urlencoded({extended:true}));
// app.engine("ejs",ejsMate);
// app.use(express.static(path.join(__dirname,"/public")));
// app.use(session(sessionOptions));

// //check mongoss working
// main().then(()=>{
//     console.log("working properly mongoos");
// }).catch((err)=>{
//     console.log(err);
// });
// //connection to mongodb
// async function main() {
//   await mongoose.connect(dbUrl);
// }

// app.listen(port,()=>{
//     console.log(`app listen on port ${port}`);
// });

// //routes 
// app.use(flash());
// app.use(passport.initialize()); 
// app.use(passport.session());    

// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
// app.use((req,res,next)=>{
//     res.locals.success=req.flash("success");
//     res.locals.error=req.flash("error");
//     res.locals.update=req.flash("update");
//     res.locals.currUser=req.user;
//     next();
// });
// app.use("/listings",listingsRoute);
// app.use("/listings/:id/reviews",reviewsRoute);
// app.use("/",usersRoute);

// // app.all(/.*/,(req,res,next)=>{
// //     next(new ExpressError(404,"Page Not Found!"));
// // });
// // app.all("*", (req, res, next) => {
// //   next(new ExpressError(404, "Page Not Found!"));
// // });

// app.use((err,req,res,next)=>{
//     let{statusCode=500,message="something went wrong"}=err;
//     res.status(statusCode).render("error.ejs",{message});   
// });

