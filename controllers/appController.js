const bcrypt = require("bcryptjs");
const Question = require("../models/Question");
const Passed = require('../models/Passed');
const Review = require('../models/Review');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
// const PostComment = require('../models/Post-Comment');
const User = require("../models/User");

exports.login_get = (req, res) => {
    const error = req.session.error;
    const suc = req.session.suc;
    

    delete req.session.error;
    res.render("login", {suc:suc, err: error, data: req.body});

};
exports.login_post = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if (!user) {
        req.session.error = "Invalid Credentials";
        return res.redirect("/login");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        req.session.error = "Invalid Credentials";
        return res.redirect("/login");
    }

    req.session.isAuth = true;
    console.log(req.body);
    req.session.user = user
    res.redirect("profile");
};

exports.register_get = (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render("register", { err: error});
};
exports.register_post = async (req, res) => {
    const {username, email, password} = req.body;
    let user = await User.findOne({email});

    if (user) {
        req.session.error = "User already exists";
        return res.redirect("/register");
    }
    
    const hasdPsw = await bcrypt.hash(password, 12);

    user = new User({
        username,
        email,
        password: hasdPsw,
        roles: ["USER"]
    });

    await user.save();
    if (user) {
        req.session.suc = "You have successfully registered";
        res.redirect("/login");
}
};
exports.main_get = async (req, res) => {
    const posts = await Post.find().populate('user').populate({
        path: 'posts',
        model: 'Post',
        populate: {path: 'user', model: 'User'}
    })
    res.render('main', {posts: posts});
};
exports.publish_get = async (req, res) => {
    const posts = await Post.find().populate('user').populate({
        path: 'posts',
        model: 'Post',
        populate: {path: 'user', model: 'User'}
    })
    res.render('publish', {posts: posts});
};

exports.comment_get = async (req, res) => {
    const reviews = await Review.find().populate('user').populate({
        path: 'comments',
        model: 'Comment',
        populate: {path: 'user', model: 'User'}
    })

    res.render('comment', {reviews: reviews});
};
exports.comment_edit_get = async (req, res) => {
    const reviews = await Review.find().populate('user').populate({
        path: 'comments',
        model: 'Comment',
        populate: {path: 'user', model: 'User'}
    })

    res.render('edit-comment', {reviews: reviews});
};

// exports.userprofile_get = (req, res) => {
//     // const username = req.session.username;
//     // const email = req.session.email;
//     if (req.session.user) {
//         // res.render('user-profile', { data : req.session.body });
//     } else {
//         res.send("Unauthorize User")
//         // res.render('user-profile', { user : req.session.username });

//     }
// };
exports.profile_get = async (req, res) => {
    const user = await User.findOne({email: req.session.user.email})
    res.render('profile', {user: user})
}

exports.settings_page = async (req, res) => {
    const user = await User.findOne({email: req.session.user.email})
    res.render('account-settings', {user: user})
}
exports.settings_post = async (req, res) => {
    try {
        await User.findOneAndUpdate({email: req.session.user.email},
            {
                email: req.body.email,
                username: req.body.nickname,
            })
        res.redirect('/login');
    } catch (e) {
        console.log(e)
    }
}

exports.change_password = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})
        const isMatch = await bcrypt.compare(req.body.current, user.password)
        if (isMatch) {
            const hasdPsw = await bcrypt.hash(req.body.new, 12);
            await User.findOneAndUpdate({email: req.session.user.email},
                {
                    password: hasdPsw,
                })
            res.redirect('/account-settings');
        } else {
            res.send('Incorrect password')
        }
    } catch (e) {
        console.log(e)
    }
}

exports.logout_post = (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/login");
    });
};

exports.admin_users = async (req, res) => {
    // const var1 = await Question.find()
    // console.log(var1)
    const users = await User.find()
    res.render('all-users', {users: users});
};

exports.user_edit = async (req, res) => {
    const user = await User.findOne({_id: req.params.id})
    res.render('user-edit', {user: user});
};

exports.user_update = async (req, res) => {
    try {
        await User.findOneAndUpdate({_id: req.params.id},
            {
                email: req.body.email,
                username: req.body.nickname,
                roles: req.body.roles,
                hasAccess: req.body.hasAccess
            })
        res.redirect('/admin-users');
    } catch (e) {
        console.log(e)
    }
};

exports.user_delete = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
        if (user.roles.includes("ADMIN")) {
            res.send("You cannot delete this user because he has an Admin Role")
        } else {
            await User.deleteOne({_id: req.params.id})
            res.redirect('/admin-users');
        }
    } catch (e) {
        console.log(e)
    }
};

// ---SAT VAR_--------
exports.sat1 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "SAT Variant1") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};

exports.sat2 = async (req, res) => {
    const variant2 = await Question.find()
    let neededVar = []
    variant2.forEach(function (v) {
        if (v.dependent === "SAT Variant2") {
            neededVar.push(v)
        }
    })

    res.render('mcq', {variant: neededVar});
};


// ====HOK VARIANTS======
exports.hok1 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "HOK Variant1") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};
exports.hok2 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "HOK Variant2") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};
exports.hok3 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "HOK Variant3") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};

exports.rl1 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "RL Variant1") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};

exports.ml1 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "ML Variant1") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};
exports.ml2 = async (req, res) => {
    const variant1 = await Question.find()
    let neededVar = []
    variant1.forEach(function (v) {
        if (v.dependent === "ML Variant2") {
            neededVar.push(v)
        }
    })
    res.render('mcq', {variant: neededVar});
};
// ====RATING oF USERS=======
exports.hok_var1 = async (req, res) => {
    try {
        const passed = await Passed.find({name: "HOK Variant1"}).sort({scores: -1}).populate('user')

        res.render('hok_var1', {scores: passed})
    }
    catch (e) {
        console.log(e)
    }
}
exports.hok_var2 = async (req, res) => {
    try {
        const passed = await Passed.find({name: "HOK Variant2"}).sort({scores: -1}).populate('user')

        res.render('hok_var2', {scores: passed})
    }
    catch (e) {
        console.log(e)
    }
}
exports.hok_var3 = async (req, res) => {
    try {
        const passed = await Passed.find({name: "HOK Variant3"}).sort({scores: -1}).populate('user')

        res.render('hok_var3', {scores: passed})
    }
    catch (e) {
        console.log(e)
    }
}
//RL_var
exports.rl_var1 = async (req, res) => {
    try {
        const passed = await Passed.find({name: "RL Variant1"}).sort({scores: -1}).populate('user')

        res.render('rl_var1', {scores: passed})
    }
    catch (e) {
        console.log(e)
    }
}

// ML Var
exports.ml_var1 = async (req, res) => {
    try {
        const passed = await Passed.find({name: "ML Variant1"}).sort({scores: -1}).populate('user')

        res.render('ml_var1', {scores: passed})
    }
    catch (e) {
        console.log(e)
    }
}
exports.ml_var2 = async (req, res) => {
    try {
        const passed = await Passed.find({name: "ML Variant2"}).sort({scores: -1}).populate('user')

        res.render('ml_var2', {scores: passed})
    }
    catch (e) {
        console.log(e)
    }
}
// =============
   
exports.check_answers = async (req, res) => {
    try {
        const id = req.params.id
        const quiz = await Question.find();
        let neededVar = []
        quiz.forEach(function (v) {
            if (v.dependent === id) {
                neededVar.push(v)
            }
        })
        const answers = req.body
        const correct = []
        const ansArr = []
        const result = Object
            .entries(answers)
            .map(entry => ({[entry[0]]: entry[1]}));
        let count = 0;
        neededVar.forEach(function (q) {
            ansArr[count] = Object.values(result[count])[0]
            if (Object.values(result[count])[0] === q.answer) {
                correct[count] = 1
            } else
                correct[count] = 0
            count++
        })
        const user = await User.findOne({email: req.session.user.email})

        let scores = 0
        for (let elem of correct) {
            if (elem === 1) {
                scores++;
            }
        }
        await Passed.create({
            name: neededVar[0].dependent,
            quiz: neededVar,
            user: user,
            correct: correct,
            scores: scores,
            answers: ansArr
        })
        res.render('review', {variant: neededVar, correct: correct, ans: ansArr})
    } catch (e) {
        console.log(e)
    }
};

exports.review = async (req, res) => {
    try {
        const passed = await Passed.findOne({_id: req.params.id}).populate('user').populate('quiz')
        res.render('review', {variant: passed.quiz, correct: passed.correct, ans: passed.answers})
    } catch (e) {
        console.log(e)
    }
};

exports.passed = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})
        const pass = await Passed.find().populate('user').populate('quiz')
        res.render('passed', {user: user, pass: pass})
    } catch (e) {
        console.log(e)
    }
}

exports.postReview = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})

        await Review.create({
            title: req.body.title,
            text: req.body.text,
            user: user
        })
        res.redirect('back')
    } catch (e) {
        console.log(e)
    }
}

exports.postComment = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})
        const review = await Review.findOne({_id: req.params.id})

        const comment = await Comment.create({
            text: req.body.text,
            user: user,
            review: review
        })
        await Review.findOneAndUpdate(
            {_id: req.params.id},
            {$push: {comments: comment}})
        res.redirect('back')
    } catch (e) {
        console.log(e)
    }
}

exports.delete_comment = async (req, res) => {
    try {
            await Comment.deleteOne({_id: req.params.id})
            res.redirect('/edit-comment');
    } catch (e) {
        console.log(e)
    }
};

exports.delete_review = async (req, res) => {
    try {
            await Review.deleteOne({_id: req.params.id})
            await Comment.deleteOne({_id: req.params.id})
            res.redirect('/edit-comment');
    } catch (e) {
        console.log(e)
    }
};

exports.publishPost = async (req, res) => {
    try {
        const user = await User.findOne({email: req.session.user.email})

        await Post.create({
            title: req.body.title,
            text: req.body.text,
            user: user
        })
        res.redirect('back')
    } catch (e) {
        console.log(e)
    }
}
// exports.publishComment = async (req, res) => {
//     try {
//         const user = await User.findOne({email: req.session.user.email})
//         const post = await Post.findOne({_id: req.params.id})

//         const comment = await PostComment.create({
//             text: req.body.text,
//             user: user,
//             post: post
//         })
//         await Post.findOneAndUpdate(
//             {_id: req.params.id},
//             {$push: {comments: comment}})
//         res.redirect('back')
//     } catch (e) {
//         console.log(e)
//     }
// }
exports.delete_post = async (req, res) => {
    try {
            await Post.deleteOne({_id: req.params.id})
            res.redirect('/publish');
    } catch (e) {
        console.log(e)
    }
};