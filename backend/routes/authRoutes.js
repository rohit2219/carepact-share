import express from 'express'
const router = express.Router();
import { authUser, registerUser, getUserById, registration } from '../controllers/authController.js'
import { isAuthenticated, isAdmin } from '../middleware/authMiddleware.js'
import validator from 'express-validator'
const { check, validationResult } = validator

router.post('/login', [
    check("username").isLength({ min: 5 }).withMessage('Name must be at least 5 chars long'),
    check("password").isLength({ min: 8 }).withMessage('password must be at least 8 chars long')
], authUser)

router.post('/register', [
    check("username").isLength({ min: 5 }).withMessage('Name must be at least 5 chars long'),
    check("password").isLength({ min: 8 }).withMessage('password must be at least 8 chars long'),
    check("email").isEmail().withMessage("Email is required")
], registerUser)

router.route('/:id').get(isAuthenticated, getUserById)

router.post('/registration', registration)


export default router