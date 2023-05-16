const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('./user.model');

require('dotenv').config("..\\..\\.env");

const SALT_ROUND = 8 ; // process.env.SALT_ROUND.toInteger;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

console.log(PRIVATE_KEY)

const router = express.Router()

const registeration = async (req, res) => {
    try {
        const { email, first_name, last_name, password } = req.body;

        const existingUser = await userModel.findOne({
            "email": email
        });
        if (existingUser) {
            return res.status(400).json({
                "error": "User is already exists."
            })
        } else {
            const passwordHashed = bcrypt.hashSync(password, SALT_ROUND);
            userModel.create({ first_name, last_name, email, password: passwordHashed })

            return res.status(200).json({
                "message": "user Created"
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            "message": "Server Error."
        })
    }
};

const logIn = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const userData = await userModel.findOne({ email: email }).exec();

    if (bcrypt.compareSync(password, userData.password)) {
        const token = jwt.sign(
            {
                "secret": "token_secret",
                "email": userData.email
            },
            "shhhh",
            {
                expiresIn: '1h'
            }
        )
        return res.status(200).json({
            "status": "password match",
            "token": token
        });
    } else {
        return res.status(400).json({
            "status": "password does not match"
        });
    }
};

const getUserData = async (req, res) => {

    const token = req.body.token;
    var decode;
    try {
        // console.log(typeof (token), PRIVATE_KEY)
        decode = jwt.verify(token, PRIVATE_KEY);

        const user = await userModel.findOne({ email: decode.email }).exec();

        return res.status(200).json({
            "name": user.first_name.concat(" ", user.last_name)
        })
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            "error": "internal server error"
        })
    }

};

router.post("/user/data", getUserData);
router.post("/user/logIn", logIn);
router.post('/user/register', registeration);

module.exports = router