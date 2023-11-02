import express from 'express'
import { createWebsite, getAllWebsiteData, getWebsiteData, getWebsiteNameList, updateWebsiteData } from '../controllers/websiteController.js'
import { check, param } from 'express-validator'
import message from '../utilities/messages/message.js'
import { validationfield } from '../field_valodator/index.js'
import { getWebSiteDataByAggregation } from '../controllers/aggregation.js'
import mongoose from 'mongoose'
import { tokenVerify } from '../middleware/isWebsite.js'
const router = express.Router()

// use for create website
router.post('/create', [check('name').notEmpty().withMessage(message?.pageNameRequired)], validationfield, createWebsite)

// use for get all website data
router.get('/all-data', getAllWebsiteData)

// use for get particluar website data
router.get('/data', tokenVerify, getWebsiteData)

// use for get website name
router.get('/name/list', getWebsiteNameList)

// use for  get all website data by aggregation
router.get('/all/data/:websiteId', [param('websiteId').exists().withMessage(message?.websiteIdRequired).custom((value) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error(message.enterValidWebsiteId)
  }
  return true
})], validationfield, getWebSiteDataByAggregation)

// use for update websitedata
router.put('/update', tokenVerify, updateWebsiteData)
export default router
