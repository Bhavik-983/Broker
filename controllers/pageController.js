import { keyModel } from "../models/keyModels.js";
import { pageModels } from "../models/pageModels.js";
import { websiteModels } from "../models/websiteModels.js";
import logger from "../utilities/logger.js";
import message from "../utilities/messages/message.js";
import { sendBadRequest, sendSuccess } from "../utilities/response/index.js";

//use for create page
export const createPage = async (req, res) => {
    try {
        const data = req.body
        const websiteData = await websiteModels.findOne({ _id: req.website?._id })
        if (!websiteData) {
            return sendBadRequest(res, message.websiteDataNotFound)
        }
        const pageData = await pageModels.findOne({ name: data.name.toLowerCase(), website_id: websiteData._id })
        if (pageData) {
            return sendBadRequest(res, message.pageDataAlReadyExist)
        }
        // for (let i = 0; i < websiteData.pages.length; i++) {
        //     const existPageName = await pageModels.findOne({ _id: websiteData.pages[i] }).select({ name: 1 })
        //     if (existPageName.name.toLowerCase() === data.name.toLowerCase()) {
        //         return sendBadRequest(res, message.pageDataAlReadyExist)
        //     }
        // }

        const addPage = await new pageModels({
            name: data.name.toLowerCase(),
            website_id: websiteData._id
        })
        websiteData.pages.push(addPage._id)
        await addPage.save()
        await websiteData.save()
        return sendSuccess(res, addPage, message.pageCreatedSuccessfully)

    } catch (e) {
        logger.error(e)
        logger.error("CREATE_PAGE")
        return sendBadRequest(res, message.somethingGoneWrong)

    }
}


//use for get all page data
export const getAllPageData = async (req, res) => {
    try {
        const option = {}
        option.website_id = req.website._id
        if (req.query.status) {
            option.status = req.query.status
        }
        if (req.query.name) {
            option.name = { $resges: req.query.name, $option: "i" }
        }
        const pageData = await pageModels.find(option).populate("website_id", "name")
        if (!pageData) {
            return sendBadRequest(res, message.pageDataNotFound)
        }
        return sendSuccess(res, pageData, message.pageDataGetSuccessfully)

    } catch (e) {
        logger.error(e)
        logger.error("GET_ALL_PAGE_DATA")
        return sendBadRequest(res, message.somethingGoneWrong)
    }
}


//use for get page name list
export const getPageNameList = async (req, res) => {
    try {
        const option = {}
        option.status = true
        option.website_id = req.website._id
        if (req.query.status) {
            option.status = req.query.status
        }
        const pageData = await pageModels.find(option).select({ name: 1 })
        if (!pageData) {
            return sendBadRequest(res, message.pageDataNotFound)
        }
        return sendSuccess(res, pageData, message.pageDataGetSuccessfully)

    } catch (e) {
        logger.error(e)
        logger.error("GET_PAGE_NAME_LIST")
        return sendBadRequest(res, message.somethingGoneWrong)
    }
}


//use for get particular page data
export const getPageData = async (req, res) => {
    try {
        const pageData = await pageModels.findOne({ _id: req.params.pageId })
        if (!pageData) {
            return sendBadRequest(res, message.pageDataNotFound)
        }
        return sendSuccess(res, pageData, message.pageDataGetSuccessfully)
    } catch (e) {
        logger.error(e)
        logger.error("GET_PAGE_DATA")
        return sendBadRequest(res, message.somethingGoneWrong)
    }
}


//use for update page data
export const updatePageData = async (req, res) => {
    try {
        const data = req.body
        const pageData = await pageModels.findOne({ _id: req.params.pageId })
        if (!pageData) {
            return sendBadRequest(res, message.pageDataNotFound)
        }
        const websiteData = await websiteModels.findOne({ pages: { $in: pageData._id } })
        if (data.name) {
            const existPageData = await pageModels.findOne({ name: data.name.toLowerCase(), website_id: websiteData._id })
            if (existPageData) {
                return sendBadRequest(res, message.pageDataAlReadyExist)
            }
            pageData.name = data.name.toLowerCase()
        }
        if (Object.keys(data).includes("status")) {
            if (data.status !== pageData.status) {
                for (let i = 0; i < pageData.keys.length; i++) {
                    const keyData = await keyModel.findOne({ _id: pageData.keys[i] })
                    if (keyData) keyData.status = data.status
                    keyData.save()
                }
            }
            pageData.status = data.status

        }
        await pageData.save()
        return sendSuccess(res, pageData, message.pageDataUpdatedSuccessfully)

    } catch (e) {
        logger.error(e)
        logger.error("UPDATE_PAGE_DATA")
        return sendBadRequest(res, message.somethingGoneWrong)
    }
}




// use for soft delete page data
export const deletePageData = async (req, res) => {
    try {
        const websiteData = await websiteModels.findOne({ _id: req.website._id })
        if (!websiteData) {
            return sendBadRequest(res, message.websiteDataNotFound)
        }
        const pageData = await pageModels.findOne({ _id: req.params.pageId })
        if (!pageData) {
            return sendBadRequest(res, message.pageDataNotFound)
        }
        if (pageData.keys.length > 0) {
            return sendBadRequest(res, message.pageIsInUse)
        }
        await websiteData.pages.pull(pageData._id)
        await pageData.delete()
        return sendSuccess(res, message.pageDataDeletedSuccessfully)

    } catch (e) {
        logger.error(e)
        logger.error("DELETE_PAGE_DATA")
        return sendBadRequest(res, message.somethingGoneWrong)
    }
}