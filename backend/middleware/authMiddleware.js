import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import User from '../models/authModels.js'

const isAuthenticated = asyncHandler(async (req, res, next) => {
  let token
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      
      req.user = User.findById(decoded.id)

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const isAdmin = (req, res, next) => {
  if (req.user && req.user.userType=='A' || req.user.userType=='SA') {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

export { isAuthenticated, isAdmin }
