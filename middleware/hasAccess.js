module.exports = (req, res, next) => {
    if (req.session.user.hasAccess === true) {
        next();
    } else {
        res.render('unt0')
    }
};