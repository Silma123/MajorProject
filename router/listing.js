const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const {validateReview}=require("../middleware.js");
const listingcontroller=require("../controllers/listing.js")
const multer  = require('multer')
const {storage}=require("../cloudconfig.js")
const upload = multer({storage})

router.route("/").get(wrapAsync(listingcontroller.index) )
.post(isLoggedIn,validatelisting,upload.single("listing[image][url]"),wrapAsync(listingcontroller.createListing));;


router.get("/new",isLoggedIn,listingcontroller.rendernewform);

router.route("/:id").get(wrapAsync(listingcontroller.showListing) ).
put(isLoggedIn,isOwner,upload.single("listing[image][url]"),validatelisting,wrapAsync(listingcontroller.updateListing))
.delete( isLoggedIn,isOwner,wrapAsync(listingcontroller.destroy))


router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingcontroller.renderEditForm) );


module.exports=router;