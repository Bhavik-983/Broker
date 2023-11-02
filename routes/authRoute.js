import express from 'express'
import { Login } from '../controllers/authController.js'
import { validationfield } from '../field_valodator/index.js'
import { check } from 'express-validator'
import message from '../utilities/messages/message.js'
const route = express.Router()

// login
route.post('/login', [check('name').notEmpty().withMessage(message?.nameRequired)], validationfield, Login)

export default route
