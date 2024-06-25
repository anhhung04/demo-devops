var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const UserModel = require('../../models/user');

/* GET users listing. */
router.post('/signin', async function (req, res, next) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        if (typeof email !== 'string' || typeof password !== 'string') {
            res.status(400).json({ message: 'Email and password must be strings' });
            return;
        }
        const existUser = await UserModel.findOne({
            email
        });
        if (!existUser) {
            res.status(401).json({ message: 'None exist user!' });
            return;
        }
        const isValidPassword = await bcrypt.compare(password, existUser.password);
        if (!isValidPassword) {
            res.status(401).json({ message: 'Invalid password!' });
            return;
        }
        req.session.user = {
            email: existUser.email,
            name: existUser.name
        };
        await req.session.save();
        return res.redirect("/dashboard");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/signup', async function (req, res, next) {
    try {
        const { email, password, name } = req.body;
        if (!email || !password || !name) {
            res.status(400).json({ message: 'Email, password and name are required' });
            return;
        }
        if (typeof email !== 'string' || typeof password !== 'string' || typeof name !== 'string') {
            res.status(400).json({ message: 'Email, password and name must be strings' });
            return;
        }
        const existUser = await UserModel.findOne({
            email
        });
        if (existUser) {
            res.status(400).json({ message: 'User already exists!' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            email,
            password: hashedPassword,
            name
        });
        await newUser.save();
        res.redirect("/signin");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/signout', async function (req, res, next) {
    try {
        req.session.destroy();
        res.redirect("/");
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
