const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsmate=require("ejs-mate");
const wrapAsync=require("./utils/wrapasync.js");
const expresserror=require("./utils/expresserror.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const review=require("./models/review.js");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(mongo_url);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"view"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsmate);
app.use(express.static(path.join(__dirname,"/public")));

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
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
    }
    else{
        next();
    }
}

app.get("/",(req,res)=>{
    res.send("Hi i AM ROOT");
})
app.get("/listings",wrapAsync(async (req,res)=>{
    
    const alllisting= await Listing.find({});
    res.render("listing/index.ejs",{alllisting} )
    
}) );

app.get("/listings/new",(req,res)=>{
    res.render("listing/new.ejs");
})
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs",{listing})
}) )
app.post("/listings",validatelisting,wrapAsync(async(req,res)=>{
    
    const newlisting= new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");

   
})
)
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listing/edit.ejs",{listing})
}) )
app.put("/listings/:id",validatelisting,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))
app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletelisting=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()

    res.redirect(`/listings/${listing._id}`);

}));

app.all("*",(req,res,next)=>{
    next(new expresserror(404,"Page not found"));
})
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
})
app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})