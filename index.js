require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.model');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db_url = process.env.DB_URL || 'mongodb://127.0.0.1:27017/QR-code-project';
const { isLoggedIn } = require('./middlewares/auth');
const { QR_generator } = require('./helpers/QR_generator');

mongoose.connect(db_url)
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// initialize passport
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middlewares
app.use(express.urlencoded());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    // store: MongoStore.create({ mongoUrl: db_url }),
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.user = req.user;
    console.log(req.user);
    next();
})

app.get('/', isLoggedIn, async (req, res) => {
    // const users = await User.find({ role: 'user' });
    if (req.user.role === 'admin') {
        const users = await User.find({ role: 'user' });
        return res.render('home', { users });
    }
    else {
        const user = await User.findById(req.user._id);
        const link = QR_generator();
        res.render('home', { self: user });
    }
})

const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
app.use(authRouter);
app.use(adminRouter);


const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is up at PORT', PORT);
});


