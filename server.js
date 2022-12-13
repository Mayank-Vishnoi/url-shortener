const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }))


// EJS setup
app.set('view engine', 'ejs');


// flash messages
app.use(require('connect-flash')());
app.use(require('express-session')({ secret: process.env.SECRET, resave: true, saveUninitialized: true }));
app.use((req, res, next) => {
   res.locals.e = req.flash('error'); // you can use e in your ejs files now to show messages
   res.locals.s = req.flash('success');
   next();
});


// Passport Setup
const passport = require('passport');
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());


// Authentication Routes
app.use('/users', require('./routes/users'));


// Services routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/url'));


app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));