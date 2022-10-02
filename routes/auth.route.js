const {Router} = require('express');
const router = Router();
const User = require('../models/User');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/registration',
    [
        check('email', 'invalid email').isEmail(),
        check('password', 'invalid password - should contain at least 6 characters').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data by registration'
                });
            }

            const { email, password } = req.body;

            const isOccupied = await User.findOne({ email });

            if (isOccupied) {
                return res.status(300).json({message: 'This Email is already occupied, try another one.'})
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            const user = new User({
                email, 
                password: hashedPassword,
            });

            await user.save();

            res.status(201).json({message: 'User has been created'});
        } catch (error) {
            console.log(error);
        }
    })

    router.post('/login',
    [
        check('email', 'invalid email').isEmail(),
        check('password', 'invalid password').exists(),
    ],
    async (req, res) => {
        try {

            const errors = validationResult(req);
            if(!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Invalid data by login'
                });
            }

            const { email, password } = req.body;

            const user = await User.findOne({ email});

            if(!user) {
                return res.status(400).json({message: 'There is no this Email in database'});
            }

            const isMatch = bcrypt.compare(password, user.password);

            if(!isMatch) {
                return res.status(400).json({message: "Passwords doesn't match"});
            }

            const token = jwt.sign(
                {userId: user.id},
                process.env.JWT_SECRET,
                {expiresIn: '1h'},
            );

            res.json({token, userId: user.id});

        } catch (error) {
            console.log(error);
        }
    })

module.exports = router;
