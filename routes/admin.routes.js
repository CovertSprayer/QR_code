const router = require('express').Router();
const passport = require('passport');
const User = require('../models/User.model');
const generator = require('generate-password');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/admin', async (req, res) => {
    const { email, password, accessCode } = req.body;

    if (password.length < 4) {
        return res.send('Password must be greater than 6 characters');
    }

    if (accessCode === '1234ABCD') {
        const admin = new User({ email, role: 'admin' });
        await User.register(admin, password);
        return res.redirect('/login')
    }
    else {
        return res.send('Wrong AccessCode!!');
    }
})

router.get('/user/new', (req, res) => {
    res.render('user')
})

router.post('/user/create', async (req, res) => {
    const body = req.body;
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    const email = `${body.firstName}.${body.course}@shushant.in`
    body.role = 'user';
    body.passkey = password;
    body.email = email.toLowerCase();

    const user = new User(body);
    await User.register(body, password)
    res.redirect('/')
})

module.exports = router;