const User = require("../models/user");

const user_register_get = (req, res) => {
    res.render("users/register");
};

const user_register_post = async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash("success", "Welcome to Yelp Camp!");
            res.redirect("/campgrounds");
        })
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register");
}    
};

const user_login_get = (req, res) => {
    res.render("users/login");
};

const user_login_post = (req, res) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = res.locals.returnTo || "/campgrounds";
    res.redirect(redirectUrl);
};

const user_logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {return next(err);}
        req.flash("success", "Goodbye!");
        res.redirect("/login");
    });
    
};

module.exports = {
    user_register_get,
    user_register_post,
    user_login_get,
    user_login_post,
    user_logout
};