const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const User = require('./models/User.model');

mongoose.connect('mongodb://127.0.0.1:27017/QR-code-project')
    .then(() => console.log('DB Connected'))
    .catch(err => console.log(err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const authRouter = require('./routes/auth.routes');
const adminRouter = require('./routes/admin.routes');
app.use(authRouter);
app.use(adminRouter);

app.get('/', async (req, res) => {
    const users = await User.find({ role: 'user' });
    res.render('home', {users});
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log('Server is up at PORT', PORT);
});