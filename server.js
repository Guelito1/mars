require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const user = require('./models/User');
const Comment = require('./models/Comment')



const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(helmet());

// const loginLimiter = new RateLimit({
//     windowMs: 5*60*1000,
//     max: 3,
//     delayMs: 0,
//     message: 'Maximum login attempts exceeded'
// });
// const signupLimiter = new RateLimit({
//     windowMs: 60*60*1000,
//     max: 3,
//     delayMs: 0,
//     message: "Maximum accounts created. Try again later."
// });

mongoose.connect('mongodb://localhost/rover-mars', {useNewUrlParser: true});
const db = mongoose.connection;
db.once('open', () => {
    console.log(`🦁🦁🦁Conected to Mongo on ${db.host}:${db.port}`);
});
db.on('error', (err) => {
    console.log(`❌❌❌Database error:\n${err}`)
});

// app.use('/auth/login', loginLimiter);
// app.use('/auth/signup', signupLimiter);

app.use('/auth', require('./routes/auth'));
// app.use('/api', expressJWT({secret: process.env.JWT_SECRET}), require('./routes/api'));
app.use('/api', require('./routes/api'))
// app.use('/user', require('./routes/user'))

// //! GET all comments
app.get('/comment', (req, res) => {
    Comment.find({}, function(err, comment) {
        if(err) res.json(err)
        res.json(comment)
    })
})

// //! GET One comment
app.get('/comment/:id', (req, res) => {
    Comment.findById(req.params.id, function(err, comment) {
        if(err) res.json(err)
        res.json(comment)
    })
})

// //! POST One comment

app.post('/comment', (req, res) => {
    let comment = new Comment ({
        comment: req.body.comment,
        like: req.body.like,
    });
    Comment.save((err, comment) => {
        if (err) res.json(err);
        res.json(comment);
    })
})

//! UPDATE a comment

app.put('/comment/:id', (req, res) => {
    Comment.findByIdAndUpdate(req.params.id, {
        comment: req.body.comment,
        like: req.body.like
    }, function(err, comment) {
        if (err) res.json(err)
        res.json(comment)
    })
})




app.listen(process.env.PORT, () => {
    console.log(`🍕🍕🍕you're listening to port ${process.env.PORT}...`)
});