module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.json({msg: "You are not logged in"})
    }
}
