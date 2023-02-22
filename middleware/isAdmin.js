module.exports = (req, res, next) => {
    // console.log(req.session.user)
    if (req.session.isAuth && req.session.user.roles.includes("ADMIN")) {
        next();
    } else {
        res.render('404')
        // res.send("You don't have an Admin role!")
    }
};

