import express from 'express'
import { createPage, deletePageData, getAllPageData, getPageData, getPageNameList, updatePageData } from '../controllers/pageController.js'
import { validationfield } from '../field_valodator/index.js'
import { check, param } from 'express-validator'
import message from '../utilities/messages/message.js'
import { tokenVerify } from '../middleware/isWebsite.js'
import mongoose from 'mongoose'

const router = express.Router()

// use for create page
router.post('/create', [check('name').notEmpty().withMessage(message?.pageNameRequired)], tokenVerify, createPage)

// use for get page data
router.get('/data/:pageId', [param('pageId').exists().withMessage(message?.pageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidPageId)
  }
  return true
})], validationfield, tokenVerify, getPageData)

// use for get all page data
router.get('/data', tokenVerify, getAllPageData)

// use for get all page name
router.get('/name/list', tokenVerify, getPageNameList)

// use for soft delete page data
router.put('/update/:pageId', [param('pageId').exists().withMessage(message?.pageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidPageId)
  }
  return true
})], validationfield, tokenVerify, updatePageData)

// use for delete page data
router.delete('/delete/:pageId', [param('pageId').exists().withMessage(message?.pageIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidPageId)
  }
  return true
})], validationfield, tokenVerify, deletePageData)
export default router
