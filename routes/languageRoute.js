import express from 'express'
import { addLanguage, getAllLanguageData, getLanguageData, getLanguageNameList, updateLanguageData } from '../controllers/languageController.js'
import { validationfield } from '../field_valodator/index.js'
import { check, param } from 'express-validator'
import message from '../utilities/messages/message.js'
import { tokenVerify } from '../middleware/isWebsite.js'
import mongoose from 'mongoose'
const router = express.Router()

// use for add language
router.post('/add', [check('name').notEmpty().withMessage(message?.languageNameRequired), check('key').notEmpty().withMessage(message?.keyRequired)], validationfield, tokenVerify, addLanguage)

// use for get all language data
router.get('/data', tokenVerify, getAllLanguageData)

// use for get language name list
router.get('/name/list', tokenVerify, getLanguageNameList)

// use for get language data
router.get('/data/:languageId', [param('languageId').exists().withMessage(message?.languageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidLanguageId)
  }
  return true
})], validationfield, tokenVerify, getLanguageData)

// use for delete language data
router.put('/update/:languageId', [param('languageId').exists().withMessage(message?.languageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidLanguageId)
  }
  return true
})], validationfield, tokenVerify, updateLanguageData)

export default router
