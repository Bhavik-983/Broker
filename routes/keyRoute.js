import express from 'express'
import { createLanguageKey, deleteKeyData, getAllKeyData, getAllKeyDataByPageId, updateKeyData } from '../controllers/keyController.js'
import message from '../utilities/messages/message.js'
import { validationfield } from '../field_valodator/index.js'
import { param } from 'express-validator'
import { tokenVerify } from '../middleware/isWebsite.js'
import mongoose from 'mongoose'
const router = express.Router()

// use for create language key
router.post('/create/:pageId', [param('pageId').exists().withMessage(message?.pageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidPageId)
  }
  return true
})
], validationfield, tokenVerify, createLanguageKey)

// use for get all key data
router.get('/data', tokenVerify, getAllKeyData)

// use for get key data of particular language
// router.get("/:languageid", [param('languageid').notEmpty().withMessage(message?.languageIdRequired)], validationfield, tokenVerify, getKeyData)

// use for get key data by keyid
// router.get("/data/:keyid", [param('keyid').notEmpty().withMessage(message?.keyIdRequired)], validationfield, tokenVerify, getKeyDataByKeyId)

// use for get key data by keyid
router.get('/data/:pageId', [param('pageId').exists().withMessage(message?.pageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidPageId)
  }
  return true
})], validationfield, tokenVerify, getAllKeyDataByPageId)

// use for get key data by keyid
router.put('/update/:keyId', [param('keyId').exists().withMessage(message?.keyIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidKeyId)
  }
  return true
})], validationfield, tokenVerify, updateKeyData)

// use for delete key data by keyid
router.delete('/delete/:keyId', [param('keyId').exists().withMessage(message?.keyIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidKeyId)
  }
  return true
})], validationfield, tokenVerify, deleteKeyData)

export default router
