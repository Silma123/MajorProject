const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapasync.js");
const expresserror=require("../utils/expresserror.js");
const Listing=require("../models/listing.js");
const review=require("../models/review.js")
const {validateReview,isLoggedIn,isreviewAuthor}=require("../middleware.js");




router.post("/",isLoggedIn,validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()
    req.flash("success","New Review created");
    res.redirect(`/listings/${listing._id}`);

}));

router.delete("/:reviewId", isLoggedIn,isreviewAuthor,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    res.redirect(`/listings/${id}`);
}))

module.exports=router;