// const { db } = require("../models/User");

// module.exports.isAdmin = (req, res, next) => {
//     db.collection('users').findOne({
//         username: req.session.username
//     }).then((user) => {
//         if (!user) {
//             res.status(500).send({ message: err });
//             return;
//         }
//         else {
//             if (user.role === 'admin') {
//                 res.redirect("/admin")
//             }
//             else {
//                 res.redirect('/main')
//             }
//         }

//     });
// };