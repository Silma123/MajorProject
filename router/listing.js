const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapasync.js");
const {listingSchema}=require("../schema.js");
const expresserror=require("../utils/expresserror.js");
const Listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js")


const validatelisting=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }
    else{
        next();
    }
}

router.get("/",wrapAsync(async (req,res)=>{
    
    const alllisting= await Listing.find({});
    res.render("listing/index.ejs",{alllisting} )
    
}) );

router.get("/new",isLoggedIn,(req,res)=>{
    
    res.render("listing/new.ejs");
})
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews").populate("Owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing})
}) )
router.post("/",isLoggedIn,validatelisting,wrapAsync(async(req,res)=>{
    
    const newlisting= new Listing(req.body.listing);
    newlisting.Owner=req.user._id;
    await newlisting.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");

   
}) )
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listing/edit.ejs",{listing})
}) )
router.put("/:id",isLoggedIn,validatelisting,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success"," Listing updated");
    res.redirect(`/listings/${id}`);
}))
router.delete("/:id", isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}))


module.exports=router;