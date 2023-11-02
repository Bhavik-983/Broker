import { websiteModels } from '../models/websiteModels.js'
import logger from '../utilities/logger.js'
import message from '../utilities/messages/message.js'
import { sendBadRequest, sendSuccess } from '../utilities/response/index.js'
import jwt from 'jsonwebtoken'
import config from '../config/index.js'

export const Login = async (req, res) => {
  try {
    const data = req.body
    const websiteData = await websiteModels.findOne({ name: data.name })
    if (!websiteData) {
      return sendBadRequest(res, message.websiteDataNotFound)
    }
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

    websiteData.token = token
    websiteData.refresh_token = refreshToken
    await websiteData.save()
    return sendSuccess(res, { token, refreshToken }, message.loginSuccessfully)
  } catch (e) {
    logger.error(e)
    logger.error('LOGIN')
    sendBadRequest(res, message.somethingGoneWrong)
  }
}

// export const fileUpload = () => {
//     try{}catch(){

//     }
// }
