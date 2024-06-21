const express = require('express');
const router = express.Router();
const { validateUser, User } = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).send(user);
});

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send(`User with email ${req.body.email} already exists`);

    // user = new User({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: req.body.password
    // });

    // await user.save();
    // res.status(200).send({
    //     _id: user._id,
    //     name: user.name,
    //     email: user.email
    // });

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, 10);
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;