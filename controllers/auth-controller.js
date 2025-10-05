const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSch = require('../models/user-schema.js')

const signup = async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) { return res.status(404).json({ message: "Please enter details" }) };
    let userVerification = await userSch.findOne({ email })
    if (userVerification) {
        return res.status(400).json({ message: 'User already exists. Please sign in' })
    }
    else {
        try {
            const hashPassword = await bcrypt.hash(password, 10);
            const newUser = userSch.create({
                username,
                email,
                password: hashPassword
            })

            res.status(201).json({ success: true, message: "User Created Successfully", userid: newUser._id })
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ error: `Server Error`, error: error.message })
        }
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) { return res.status(404).json({ message: "Please enter details" }) }
    try {
        const userCheck = await userSch.findOne({ email });
        if (!userCheck) return res.status(401).json({ message: `Invalid Username or password` });
        const isMatch = await bcrypt.compare(password, userCheck.password);
        if (!isMatch) return res.status(401).json({ message: `Invalid Username or password` });
        const paylod = {
            user: {
                id: userCheck._id
            }
        }
        const token = jwt.sign(paylod, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            success: true,
            message: "Access Granted",
            token
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: `Server Error`, error });
    }
}

module.exports = {
    signup,
    login
}