import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../models/authModels.js'
import validator from 'express-validator'
const { check, validationResult } = validator

const authUser = asyncHandler(async(req, res) => {

    const userName = req.body.username;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    } else {
        const user = await User.findOne({ userName })

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                message: "Login Successfull",
                _id: user._id,
                userName: user.userName,
                email: user.email,
                userType: user.userType,
                token: generateToken(user._id),
            })
        } else {
            res.status(401).json({

                message: "CO-AC-authUser/34- Invalid email or password"
                    // message: "co-ac-authUser- Invalid email or password"
            })

        }
    }


})

const registerUser = asyncHandler(async(req, res) => {

    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const rpassword = req.body.rpassword;
    const userType = req.body.userType;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        console.log(errors)
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    } else {
        const userExists = await User.findOne({ userName })

        if (userExists) {
            res.status(400).json({
                message: "User already exist"
            })
        }

        const user = await User.create({
            userName,
            email,
            password,
            userType
        })

        if (user) {
            res.status(201).json({
                message: "Registration Successfull",
                _id: user._id,
                userName: user.userName,
                email: user.email,
                userType: user.userType,
                token: generateToken(user._id),
            })
        } else {
            res.status(400).json({ message: "CO-AC-registerUser/85- Invalid user data" })
        }
    }


})


const getUserById = asyncHandler(async(req, res) => {

    User.findById(req.params.id, function(err, result) {
        if (err) {
            res.status(404).json({
                message: "CO-AC-getUserById/98- User not found",
                // error: errors.array()[0].msg
            });
        } else {
            res.json({
                message: "user found",
                result
            })
        }
    });
})

// Temporory code
const registration = asyncHandler(async(req, res) => {

    const cust_details = new User({
        userName: req.body.userName,
        phone_no: req.body.phone_no,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        gst: req.body.gst,
        dlNo: req.body.dlNo,
        password: req.body.password,
        userType: req.body.userType

    })
    cust_details.save()
        .then(data => {
            // res.json(data)
            res.send({ data: "Record has been Inserted..!!" });
        })
        .catch(error => {
            res.json({
                message: "CO-AC-registration- Record has not been Inserted"
                    // error
            })
        })

})

export {
    authUser,
    registerUser,
    getUserById,
    registration
}