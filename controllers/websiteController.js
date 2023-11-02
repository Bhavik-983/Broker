import config from '../config/index.js'
import { websiteModels } from '../models/websiteModels.js'
import logger from '../utilities/logger.js'
import message from '../utilities/messages/message.js'
import { sendBadRequest, sendSuccess } from '../utilities/response/index.js'
import jwt from 'jsonwebtoken'

// use for create website
export const createWebsite = async (req, res) => {
  try {
    const data = req.body
    const websiteData = await websiteModels.findOne({ name: data.name })

    if (websiteData) {
      // generate accesstoken
      const token = jwt.sign({
        id: websiteData?._id
      },
      config?.ACCESS_TOKEN,
      { expiresIn: config?.ACCESS_TOKEN_EXP * 60 }
      )

      const refreshToken = jwt.sign({
        id: websiteData._id
      },
      config.REFRESH_TOKEN,
      { expiresIn: config.REFRESH_TOKEN_EXP * 60 }
      )
      await websiteData.save()
      return sendSuccess(res, { token, refreshToken }, message.dataAlreadyExist)
    }
    const createWebsite = await new websiteModels({
      name: data.name
    })
    // generate accesstoken
    const token = jwt.sign({
      id: createWebsite?._id
    },
    config?.ACCESS_TOKEN,
    { expiresIn: config?.ACCESS_TOKEN_EXP * 60 }
    )

    const refreshToken = jwt.sign({
      id: createWebsite._id
    },
    config.REFRESH_TOKEN,
    { expiresIn: config.REFRESH_TOKEN_EXP * 60 }
    )
    await createWebsite.save()
    return sendSuccess(res, token, refreshToken, message.websiteCreatedSuccessfully)
  } catch (e) {
    logger.error(e)
    logger.error('CREATE_WEBSITE')
    return sendBadRequest(res, message.somethingGoneWrong)
  }
}

// use for get all websitedata
export const getAllWebsiteData = async (req, res) => {
  try {
    const option = {}
    if (req.query.status) {
      option.status = req.query.status
    }
    if (req.query.name) {
      option.name = { $regex: req.query.name, $options: 'i' }
    }
    const websiteData = await websiteModels.find(option, { token: 0, refresh_token: 0 })
    if (!websiteData) {
      return sendBadRequest(res, message.websiteDataNotFound)
    }
    return sendSuccess(res, websiteData, message.websiteDataGetSuccessfully)
  } catch (e) {
    logger.error(e)
    logger.error('GET_WEBSITE_DATA')
    return sendBadRequest(res, message.somethingGoneWrong)
  }
}

// use for get  websitedata
export const getWebsiteData = async (req, res) => {
  try {
    const websiteData = await websiteModels.findOne({ _id: req.website._id }, { refresh_token: 0, token: 0 })
    if (!websiteData) {
      return sendBadRequest(res, message.websiteDataNotFound)
    }
    return sendSuccess(res, websiteData, message.websiteDataGetSuccessfully)
  } catch (e) {
    logger.error(e)
    logger.error('GET_WEBSITE_DATA')
    return sendBadRequest(res, message.somethingGoneWrong)
  }
}

// use for get website namelist
export const getWebsiteNameList = async (req, res) => {
  try {
    const option = {}
    if (req.query.status) {
      option.status = req.query.status
    }
    const websiteData = await websiteModels.find(option).select({ name: 1 })
    if (!websiteData) {
      return sendBadRequest(res, message.websiteDataNotFound)
    }
    return sendSuccess(res, websiteData, message.websiteDataGetSuccessfully)
  } catch (e) {
    logger.error(e)
    logger.error('GET_WEBSITE_DATA')
    return sendBadRequest(res, message.somethingGoneWrong)
  }
}

// use for update website data
export const updateWebsiteData = async (req, res) => {
  try {
    const data = req.body
    const websiteData = await websiteModels.findOne({ _id: req.website._id })
    if (!websiteData) {
      return sendBadRequest(res, message.websiteDataNotFound)
    }
    if (data.name) {
      websiteData.name = data.name
    }
    await websiteData.save()
    return sendSuccess(res, message.websiteDataUpdatedSuccessfully)
  } catch (e) {
    logger.error(e)
    logger.error('DELETE_WEBSITE_DATA')
    return sendBadRequest(res, message.somethingGoneWrong)
  }
}
