const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const Listing=require("../models/listing.js");
const review=require("../models/review.js")
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controllers/review.js");



router.post("/",isLoggedIn,validateReview,wrapAsync(reviewcontroller.createReview));

router.delete("/:reviewId", isLoggedIn,isreviewAuthor,wrapAsync(reviewcontroller.destroyReview))

module.exports=router;