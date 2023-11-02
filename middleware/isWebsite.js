import jwt from "jsonwebtoken";
import logger from "../utilities/logger.js";
import { sendBadRequest, sendBadRequestWith406Code } from "../utilities/response/index.js";
import message from "../utilities/messages/message.js";
import { websiteModels } from "../models/websiteModels.js";
import config from "../config/index.js";

export const tokenVerify = async (req, res, next) => {
    try {
        const bearerToken = req.headers.authorization

        if (!bearerToken) return sendBadRequestWith406Code(res, message.authTokenRequired)

        const tokenInfo = await jwt.verify(
            String(bearerToken).split(' ')[1],
            config.ACCESS_TOKEN
        )

        // token and token id find next step
        if (!tokenInfo && !tokenInfo.id) return sendBadRequestWith406Code(res, message.tokenFormatInvalid)

        const websiteDetails = await websiteModels.findOne(
            { _id: tokenInfo.id },
            {
                _id: 1,
                pages: 1,
                languages: 1
            }
        )
        // Website Does not exist
        if (!websiteDetails) {
            return sendBadRequest(res, message.websiteDataNotFound)
        }
        if (req.params.pageId) {
            if (!websiteDetails.pages.includes(req.params.pageId)) return sendBadRequest(res, message.pageNotExist)
        }
        if (req.params.languageId) {
            if (!websiteDetails.languages.includes(req.params.languageId)) return sendBadRequest(res, message.languageNotExist)
        }
        // Attach Website Info
        req.website = websiteDetails
        next()
    } catch (e) {
        logger.error("TOKEN_VERIFY")
        if (String(e).includes('jwt expired')) {
            return sendBadRequestWith406Code(res, message.tokenExpiredError)
        } else if (String(e).includes('invalid token')) {
            return sendBadRequestWith406Code(res, message.invalidToken)
        } else if (String(e).includes('jwt malformed')) {
            return sendBadRequestWith406Code(res, message.invalidToken)
        }
        logger.error(e)
        return sendBadRequest(res, message.somethingGoneWrong)

    }

}
export const isAdmin = async (req, res, next) => {
    try {
        // find token in headers
        const bearerToken = req.headers.authorization
        // if token find then verify
        if (!bearerToken) return sendBadRequestWith406Code(res, message.authTokenRequired)

        const tokenInfo = await jwt.verify(
            String(bearerToken).split(' ')[1],
            config.ACCESS_TOKEN_ADMIN
        )

        // token and token id find next step
        if (!tokenInfo && !tokenInfo.id) return sendBadRequestWith406Code(res, message.tokenFormatInvalid)

        const adminDetails = await AdminModal.findOne(
            { _id: tokenInfo.id },
            {
                email: 1,
                isMasterAdmin: 1,
                _id: 1
            }
        )
        // Admin Does not exist
        if (!adminDetails) {
            return sendBadRequest(res, message.adminNotFound)
        }


        // Attach Admin Info
        req.admin = adminDetails

        // next for using this method only
        next()
    } catch (e) {
        console.log(e);
        logger.error('IS_ADMIN')
        if (String(e).includes('jwt expired')) {
            return sendBadRequestWith406Code(res, message.tokenExpiredError)
        } else if (String(e).includes('invalid token')) {
            return sendBadRequestWith406Code(res, message.invalidToken)
        } else if (String(e).includes('jwt malformed')) {
            return sendBadRequestWith406Code(res, message.invalidToken)
        }
        logger.error(e)
        return sendBadRequest(res, message.somethingGoneWrong)
    }
}