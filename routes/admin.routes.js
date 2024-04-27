const router = require('express').Router();
const User = require('../models/User.model');
const generator = require('generate-password');

router.get('/signup', (req, res) => {
    res.render('signup');
})

router.post('/admin', async (req, res) => {
    const { email, password, accessCode } = req.body;

    if(password.length < 6){
        return res.send('Password must be greater than 6 characters');
    }

    if (accessCode === '1234ABCD') {
        const admin = await User.create({ email, password, role: 'admin' });
        return res.redirect('/login')
    }
    else{
        return res.send('Wrong AccessCode!!');
    }
})

router.get('/user/new', (req, res)=>{
    res.render('user')
})

router.post('/user/create', async(req, res)=>{
    const body = req.body;
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    const email = `${body.firstName}.${body.course}@shushant.in`
    body.password = password;
    body.role = 'user';
    body.email = email.toLowerCase();

    await User.create(body);
    res.redirect('/')
})

module.exports = router;