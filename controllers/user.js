const user=require("../models/user");

module.exports.rendersignupform=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new user({email,username});
        const registeredUser=await user.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        })
        
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
    
}

module,exports.renderloginform=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
    req.flash("Success","Welcome to wanderlust");
    let redirectUrl=   res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","you are logged out now")
        res.redirect("/listings");
    })
}