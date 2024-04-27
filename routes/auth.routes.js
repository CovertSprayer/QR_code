const router = require('express').Router();
const User = require('../models/User.model');

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.send('User not found!')
    }

    if (user.password !== password) {
        return res.send('Invalid Credentials!');
    }

    if (user.role === 'admin') {
        
        return res.redirect('/')
    }

    res.redirect('/');
})

module.exports = router;