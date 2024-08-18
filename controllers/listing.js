const Listing=require("../models/listing");

module.exports.index=async (req,res)=>{
    
    const alllisting= await Listing.find({});
    res.render("listing/index.ejs",{alllisting} )
    
}

module.exports.rendernewform=(req,res)=>{
    
    res.render("listing/new.ejs");
}

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("Owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    res.render("listing/show.ejs",{listing})
}

module.exports.createListing=async(req,res)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting= new Listing(req.body.listing);
    newlisting.Owner=req.user._id;
    newlisting.image={url,filename};
    await newlisting.save();
    req.flash("success","New Listing created");
    res.redirect("/listings");

   
}

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist");
        res.redirect("/listings");
    }
    let originalimage=listing.image.url;
    originalimage=originalimage.replace("/upload","/upload/h_200,w_200");
    res.render("listing/edit.ejs",{listing,originalimage})
}

module.exports.updateListing=async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename}
    await listing.save();
    }
    req.flash("success"," Listing updated");
    res.redirect(`/listings/${id}`);
}

module.exports.destroy=async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
}