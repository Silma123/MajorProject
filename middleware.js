const Listing = require("./models/listing");
const {listingSchema,reviewSchema}=require("./schema.js");
const expresserror=require("./utils/expresserror.js");
const Review=require("./models/review");


module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be looged in");
        res.redirect("/login");
        }
        next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params
    let listing=await Listing.findById(id);
    if(!listing.Owner.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports. validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }
    else{
        next();
    }
}

module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }
    else{
        next();
    }
}
module.exports.isreviewAuthor=async(req,res,next)=>{
    let {rid,eviewId}=req.params
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author");
        return res.redirect(`/listings/${id}`);
    }
    next();
}